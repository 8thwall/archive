--
-- DROP schema and functions in the reverse fashion of the create script.
-- This will drop the triggers with tables as well.
-- [Dangerous] Caution! Use the following DROP TRIGGER queries
-- if you only intend to stop auditing tables instead of removing everything.
-- Otherwise all the data will be lost.
--
-- DROP TRIGGER IF EXISTS audit_trigger_row on public."Apps";
-- DROP TRIGGER IF EXISTS audit_trigger_stm on public."Apps";
--
DROP SCHEMA IF EXISTS audit CASCADE;
DROP FUNCTION IF EXISTS "jsonb_nullify" ( "input" JSONB );
DROP FUNCTION IF EXISTS "jsonb_minus" ( "left" JSONB, "right" JSONB );
DROP FUNCTION IF EXISTS "jsonb_minus" ( "left" JSONB, "keys" TEXT[] );
