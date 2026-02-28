--
-- Use the SELECT queries below to audit tables.
-- Use the following DROP TRIGGER queries to stop audit a specific table:
--
-- DROP TRIGGER IF EXISTS audit_trigger_row on public."Apps";
-- DROP TRIGGER IF EXISTS audit_trigger_stm on public."Apps";
--
SELECT audit.audit_table('public."AccountContractAgreements"');
SELECT audit.audit_table('public."AccountShortNames"');
SELECT audit.audit_table('public."Accounts"');
SELECT audit.audit_table('public."ApiKeys"');
SELECT audit.audit_table('public."Apps"');
SELECT audit.audit_table('public."ContractItems"');
SELECT audit.audit_table('public."ContractTemplates"');
SELECT audit.audit_table('public."ContractTiers"');
SELECT audit.audit_table('public."Contracts"');
SELECT audit.audit_table('public."ImageTargets"');
SELECT audit.audit_table('public."Invites"');
SELECT audit.audit_table('public."PolicyViolations"');
SELECT audit.audit_table('public."PwaInfos"');
SELECT audit.audit_table('public."NaeInfos"');
SELECT audit.audit_table('public."ScheduledSubscriptions"');
SELECT audit.audit_table('public."SequelizeMeta"');
SELECT audit.audit_table('public."User_Accounts"');
SELECT audit.audit_table('public."User_App_Prefs"');
SELECT audit.audit_table('public."AppTags"');
SELECT audit.audit_table('public."AppTagMaps"');
