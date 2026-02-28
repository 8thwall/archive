CREATE OR REPLACE FUNCTION "jsonb_minus" ( "left" JSONB, "keys" TEXT[] )
  RETURNS JSONB
  LANGUAGE SQL
  IMMUTABLE
  STRICT
AS $$
  SELECT
    CASE
      WHEN "left" ?| "keys"
        THEN COALESCE(
          (SELECT ('{' ||
                    string_agg(to_json("key")::TEXT || ':' || "value", ',') ||
                    '}')
             FROM jsonb_each("left")
            WHERE "key" <> ALL ("keys")),
          '{}'
        )::JSONB
      ELSE "left"
    END
$$;

COMMENT ON FUNCTION jsonb_minus(JSONB, TEXT[]) IS 'Delete specificed keys';

CREATE OR REPLACE FUNCTION "jsonb_minus" ( "left" JSONB, "right" JSONB )
  RETURNS JSONB
  LANGUAGE SQL
  IMMUTABLE
  STRICT
AS $$
  SELECT
    COALESCE(json_object_agg(
      "key",
      CASE
        -- if the value is an object and the value of the second argument is
        -- not null, we do a recursion
        WHEN jsonb_typeof("value") = 'object' AND "right" -> "key" IS NOT NULL
        THEN jsonb_minus("value", "right" -> "key")
        -- for all the other types, we just return the value
        ELSE "value"
      END
    ), '{}')::JSONB
  FROM
    jsonb_each("left")
  WHERE
    "left" -> "key" <> "right" -> "key"
    OR "right" -> "key" IS NULL
$$;

COMMENT ON FUNCTION jsonb_minus(JSONB, JSONB)
  IS 'Delete matching pairs in the right argument from the left argument';

CREATE SCHEMA audit;
REVOKE ALL ON SCHEMA audit FROM public;
COMMENT ON SCHEMA audit
  IS 'Out-of-table audit/history logging tables and trigger functions';

--
-- Audited data. Lots of information is available, it's just a matter of how
-- much you really want to record. See:
--
--   http://www.postgresql.org/docs/9.1/static/functions-info.html
--
-- Remember, every column you add takes up more audit table space and slows
-- audit inserts.
--
-- Every index you add has a big impact too, so avoid adding indexes to the
-- audit table unless you REALLY need them. The hstore GIST indexes are
-- particularly expensive.
--
-- It is sometimes worth copying the audit table, or a coarse subset of it that
-- you're interested in, into a temporary table where you CREATE any useful
-- indexes and do your analysis.
--
CREATE TABLE audit.log (
    id BIGSERIAL PRIMARY KEY,
    schema_name TEXT NOT NULL,
    table_name TEXT NOT NULL,
    relid OID NOT NULL,
    session_user_name TEXT NOT NULL,
    current_user_name TEXT NOT NULL,
    action_tstamp_tx TIMESTAMP WITH TIME ZONE NOT NULL,
    action_tstamp_stm TIMESTAMP WITH TIME ZONE NOT NULL,
    action_tstamp_clk TIMESTAMP WITH TIME ZONE NOT NULL,
    transaction_id BIGINT NOT NULL,
    application_name TEXT,
    client_addr INET,
    client_port INTEGER,
    client_query TEXT,
    action TEXT NOT NULL CHECK (action IN ('I','D','U', 'T')),
    row_data JSONB,
    previous_values JSONB,
    statement_only BOOLEAN NOT NULL
);

REVOKE ALL ON audit.log FROM public;

COMMENT ON TABLE audit.log
  IS 'History of auditable actions on audited tables';
COMMENT ON COLUMN audit.log.id
  IS 'Unique identifier for each auditable event';
COMMENT ON COLUMN audit.log.schema_name
  IS 'Database schema audited table for this event is in';
COMMENT ON COLUMN audit.log.table_name
  IS 'Non-schema-qualified table name of table event occured in';
COMMENT ON COLUMN audit.log.relid
  IS 'Table OID. Changes with drop/create. Get with ''tablename''::REGCLASS';
COMMENT ON COLUMN audit.log.session_user_name
  IS 'Login / session user whose statement caused the audited event';
COMMENT ON COLUMN audit.log.current_user_name
  IS 'Effective user that cased audited event (if authorization level changed)';
COMMENT ON COLUMN audit.log.action_tstamp_tx
  IS 'Transaction start timestamp for tx in which audited event occurred';
COMMENT ON COLUMN audit.log.action_tstamp_stm
  IS 'Statement start timestamp for tx in which audited event occurred';
COMMENT ON COLUMN audit.log.action_tstamp_clk
  IS 'Wall clock time at which audited event''s trigger call occurred';
COMMENT ON COLUMN audit.log.transaction_id
  IS 'Identifier of transaction that made the change. Unique when paired with action_tstamp_tx.';
COMMENT ON COLUMN audit.log.client_addr
  IS 'IP address of client that issued query. Null for unix domain socket.';
COMMENT ON COLUMN audit.log.client_port
  IS 'Port address of client that issued query. Undefined for unix socket.';
COMMENT ON COLUMN audit.log.client_query
  IS 'Top-level query that caused this auditable event. May be more than one.';
COMMENT ON COLUMN audit.log.application_name
  IS 'Client-set session application name when this audit event occurred.';
COMMENT ON COLUMN audit.log.action
  IS 'Action type; I = insert, D = delete, U = update, T = truncate';
COMMENT ON COLUMN audit.log.row_data
  IS 'New record values. Null for statement-level trigger.
      For DELETE this has fields set to be null. For INSERT and UPDATE it is the new tuple.';
COMMENT ON COLUMN audit.log.previous_values
  IS 'Old values of fields for DELETE or changed by UPDATE. Null for INSERT';
COMMENT ON COLUMN audit.log.statement_only
  IS '''t'' if audit event is from an FOR EACH STATEMENT trigger, ''f'' for FOR EACH ROW';

CREATE INDEX log_relid_idx ON audit.log(relid);
CREATE INDEX log_action_tstamp_tx_stm_idx ON audit.log(action_tstamp_stm);
CREATE INDEX log_action_idx ON audit.log(action);

--
-- Nullify all fields in the JSONB in the following cases:
-- row_data when it is a DELETE action
-- previous_values when it is a INSERT action
--
CREATE OR REPLACE FUNCTION jsonb_nullify ( input JSONB )
  RETURNS JSONB
  LANGUAGE plpgsql
AS $$
DECLARE
    _key TEXT;
    _keys TEXT[];
    _values TEXT[];
BEGIN
    FOR _key IN SELECT * FROM jsonb_each(input)
    LOOP
        _keys = array_append(_keys, _key);
        _values = array_append(_values, null);
    END LOOP;

    RETURN jsonb_object(_keys, _values);
END;
$$;

CREATE OR REPLACE FUNCTION audit.if_modified_func()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
    audit_row audit.log;
    include_values BOOLEAN;
    log_diffs BOOLEAN;
    h_old JSONB;
    h_new JSONB;
    excluded_cols TEXT[] = ARRAY[]::TEXT[];
BEGIN
  IF TG_WHEN <> 'AFTER' THEN
    RAISE EXCEPTION 'audit.if_modified_func() may only run as an AFTER trigger';
  END IF;

  audit_row = ROW(
    nextval('audit.log_id_seq'),                    -- id
    TG_TABLE_SCHEMA::TEXT,                          -- schema_name
    TG_TABLE_NAME::TEXT,                            -- table_name
    TG_RELID,                                       -- relation OID for faster searches
    session_user::TEXT,                             -- session_user_name
    current_user::TEXT,                             -- current_user_name
    current_timestamp,                              -- action_tstamp_tx
    statement_timestamp(),                          -- action_tstamp_stm
    clock_timestamp(),                              -- action_tstamp_clk
    txid_current(),                                 -- transaction ID
    current_setting('application_name', true),      -- client application
    inet_client_addr(),                             -- client_addr
    inet_client_port(),                             -- client_port
    current_query(),                                -- top-level query or queries
    substring(TG_OP, 1, 1),                         -- action
    NULL,                                           -- row_data
    NULL,                                           -- previous_values
    'f'                                             -- statement_only
    );

  IF NOT TG_ARGV[0]::BOOLEAN IS DISTINCT FROM 'f'::BOOLEAN THEN
    audit_row.client_query = NULL;
  END IF;

  IF TG_ARGV[1] IS NOT NULL THEN
    excluded_cols = TG_ARGV[1]::TEXT[];
  END IF;

  IF (TG_OP = 'INSERT' AND TG_LEVEL = 'ROW') THEN
    audit_row.row_data = jsonb_minus(to_jsonb(NEW.*), excluded_cols);
    audit_row.previous_values = jsonb_nullify(audit_row.row_data);
  ELSIF (TG_OP = 'UPDATE' AND TG_LEVEL = 'ROW') THEN
    audit_row.row_data = jsonb_minus(to_jsonb(NEW.*), excluded_cols);
    audit_row.previous_values =
      jsonb_minus(jsonb_minus(to_jsonb(OLD.*), audit_row.row_data), excluded_cols);
    IF audit_row.previous_values = '{}'::JSONB THEN
      -- All changed fields are ignored. Skip this update.
      RETURN NULL;
    END IF;
  ELSIF (TG_OP = 'DELETE' AND TG_LEVEL = 'ROW') THEN
    audit_row.previous_values = jsonb_minus(to_jsonb(OLD.*), excluded_cols);
    audit_row.row_data = jsonb_nullify(audit_row.previous_values);
  ELSIF (TG_LEVEL = 'STATEMENT' AND
         TG_OP IN ('INSERT','UPDATE','DELETE','TRUNCATE')) THEN
    audit_row.statement_only = 't';
  ELSE
    RAISE EXCEPTION '[audit.if_modified_func] - Trigger func added as trigger '
                    'for unhandled case: %, %', TG_OP, TG_LEVEL;
    RETURN NULL;
  END IF;
  INSERT INTO audit.log VALUES (audit_row.*);
  RETURN NULL;
END;
$$;


COMMENT ON FUNCTION audit.if_modified_func() IS $$
Track changes to a table at the statement and/or row level.

Optional parameters to trigger in CREATE TRIGGER call:

param 0: BOOLEAN, whether to log the query text. Default 't'.

param 1: TEXT[], columns to ignore in updates. Default [].

         Updates to ignored cols are omitted from previous_values.

         Updates with only ignored cols changed are not inserted
         into the audit log.

         Almost all the processing work is still done for updates
         that ignored. If you need to save the load, you need to use
         WHEN clause on the trigger instead.

         No warning or error is issued if ignored_cols contains columns
         that do not exist in the target table. This lets you specify
         a standard set of ignored columns.

There is no parameter to disable logging of values. Add this trigger as
a 'FOR EACH STATEMENT' rather than 'FOR EACH ROW' trigger if you do not
want to log row values.

Note that the user name logged is the login role for the session. The audit
trigger cannot obtain the active role because it is reset by
the SECURITY DEFINER invocation of the audit trigger its self.
$$;

---
--- Enables tracking on a table by generating and attaching a trigger
---
CREATE OR REPLACE FUNCTION audit.audit_table(
  target_table REGCLASS,
  audit_rows BOOLEAN,
  audit_query_text BOOLEAN,
  ignored_cols TEXT[]
)
RETURNS VOID
LANGUAGE 'plpgsql'
AS $$
DECLARE
  stm_targets TEXT = 'INSERT OR UPDATE OR DELETE OR TRUNCATE';
  _q_txt TEXT;
  _ignored_cols_snip TEXT = '';
BEGIN
  EXECUTE 'DROP TRIGGER IF EXISTS audit_trigger_row ON ' || target_table::TEXT;
  EXECUTE 'DROP TRIGGER IF EXISTS audit_trigger_stm ON ' || target_table::TEXT;

  IF audit_rows THEN
    IF array_length(ignored_cols,1) > 0 THEN
        _ignored_cols_snip = ', ' || quote_literal(ignored_cols);
    END IF;
    _q_txt = 'CREATE TRIGGER audit_trigger_row '
             'AFTER INSERT OR UPDATE OR DELETE ON ' ||
             target_table::TEXT ||
             ' FOR EACH ROW EXECUTE PROCEDURE audit.if_modified_func(' ||
             quote_literal(audit_query_text) ||
             _ignored_cols_snip ||
             ');';
    RAISE NOTICE '%', _q_txt;
    EXECUTE _q_txt;
    stm_targets = 'TRUNCATE';
  END IF;

  _q_txt = 'CREATE TRIGGER audit_trigger_stm AFTER ' || stm_targets || ' ON ' ||
           target_table ||
           ' FOR EACH STATEMENT EXECUTE PROCEDURE audit.if_modified_func('||
           quote_literal(audit_query_text) || ');';
  RAISE NOTICE '%', _q_txt;
  EXECUTE _q_txt;
END;
$$;

COMMENT ON FUNCTION audit.audit_table(REGCLASS, BOOLEAN, BOOLEAN, TEXT[]) IS $$
Add auditing support to a table.

Arguments:
   target_table:     Table name, schema qualified if not on search_path
   audit_rows:       Record each row change, or only audit at a statement level
   audit_query_text: Record the text of the client query that triggered
                     the audit event?
   ignored_cols:     Columns to exclude from update diffs,
                     ignore updates that change only ignored cols.
$$;

--
-- Pg doesn't allow variadic calls with 0 params, so provide a wrapper
--
CREATE OR REPLACE FUNCTION audit.audit_table(
  target_table REGCLASS,
  audit_rows BOOLEAN,
  audit_query_text BOOLEAN
)
RETURNS VOID
LANGUAGE SQL
AS $$
  SELECT audit.audit_table($1, $2, $3, ARRAY[]::TEXT[]);
$$;

--
-- And provide a convenience call wrapper for the simplest case
-- of row-level logging with no excluded cols and query logging enabled.
--
CREATE OR REPLACE FUNCTION audit.audit_table(target_table REGCLASS)
RETURNS VOID
LANGUAGE 'sql'
AS $$
  SELECT audit.audit_table($1, BOOLEAN 't', BOOLEAN 't');
$$;

COMMENT ON FUNCTION audit.audit_table(REGCLASS) IS $$
Add auditing support to the given table. Row-level changes will be logged with
full client query text. No cols are ignored.
$$;
