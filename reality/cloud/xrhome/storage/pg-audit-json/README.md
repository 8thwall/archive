# PostgreSQL Audit Logging
## General
This is to audit PostgreSQL database and store the logs for actions INSERT, UPDATE, and DELETE or TRUNCATE. This is logging the changes with the data stored as a jsonb data type to easier json [search queries](https://www.postgresqltutorial.com/postgresql-json/), [function and operators](https://www.postgresql.org/docs/9.5/functions-json.html) with two main columns
* __audit.log.row_data__ - New record values. Null for statement-level trigger. For DELETE this has fields set to be null. For INSERT and UPDATE it is the new tuple.
* __audit.log.previous_values__ - Old values of fields for DELETE or changed by UPDATE. Null for INSERT
For more details, please refer to [requirement document](https://docs.google.com/document/d/<REMOVED_BEFORE_OPEN_SOURCING>)

## How It Works
* Run the script `pg-audit-json.sql` to enable the audit logging feature.
* Use the sample query to start auditing `public."Apps"` table.
```sql
SELECT audit.audit_table('public."Apps"');
```
* Stop auditing `public."Apps"` table
```sql
DROP TRIGGER IF EXISTS audit_trigger_row on public."Apps";
DROP TRIGGER IF EXISTS audit_trigger_stm on public."Apps";
```
* Revert changes by running script `revert-changes.sql` is dropping schema and functions in a reverse fashion and running successfully.

## About The Logs
* __INSERT__ - insert an app and check if the new row data show in the __row_data__ column, while in __previous_values__ column we list all the fields and set them to be `null`.
* __UPDATE__ - update a field (e.g. __isWeb__) and the new row data show in the __row_data__ column, while only the changed field shows in __previous_values__ column set with the old value.
* __UPDATE__ - Add a new value to a field (e.g. __webUrl__) and the new row data show in the __row_data__ column, while only the changed field shows in __previous_values__ column set with `null`.
* __UPDATE__ - clear an existing value to a field (e.g. __webUrl__) and the new row data with the fields set to be null show in the __row_data__ column, while only the changed field shows in __previous_values__ column set with the old value.
* __DELETE__ or __TRUNCATE__ - remove an app and the new row data show all the fields set to be null hows in the __row_data__ column, while in __previous_values__ column still contains all the fields with the old values.
