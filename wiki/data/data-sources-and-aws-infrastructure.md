# Data Sources & AWS Infrastructure

# 8th Wall Data Sources

| Source | Description | Sync Method | Athena Location |
|---|---|---|---|
| **Stripe** | Accounting and billing information (subscriptions, invoices, customers, coupons, etc.) | Synced hourly to S3 through Appflow [cdk/data-pipelines] | Database: `stripe` |
| **Hubspot** | CRM and sales data (leads, deals, companies, free trial history, etc.) | Synced hourly to S3 through Appflow [cdk/data-pipelines] | Database: `hubspot` |
| **xrhome** (postgres) | 8th Wall postgres data (accounts, users, apps, etc.) | Synced hourly to S3 by the `dump-postgres` lambda [gitlab] | Database: `xrhome` |
| **Console** | Console logging (web views, 8th Wall website logs, etc.) | Streamed through Kinesis directly to S3 | Root tables: `logs.console_events`, `console.events` |
| **8th Wall Engine** | Application logging through engine (sessions, device data, technologies, dwell time metrics, etc.) | Streamed through Kinesis directly to S3 | Root tables: `logs.application_events`, `application.events` |
| **Pendo** | User behavior and NPS responses | Synced as needed through `pendo-sync` lambda | Database: `pendo` |
| **Zendesk** | Support tickets and tags from customers | Synced to S3 through Appflow [cdk/data-pipelines] | Database: `zendesk` |
| **DynamoDB** | Repo metadata (e.g. modules imported by an app) | Synced to S3 through DDB exports [cdk/data-pipelines] | Database: `dynamodb` |

## AWS Services

### S3

 * AWS S3 is a storage service consisting of buckets and objects. The buckets organized by “directories” which are essentially groups of prefixes for objects in that bucket.

 * Data is written by many sources, including lambdas, Glue jobs, users, Kinesis log streams, etc.

 * All data which is queried through Athena can be traced back upstream to data materialized on S3.

### Athena

 * AWS Query Engine powered by Presto SQL. Comparable to GCP BigQuery.

 * Table metadata (schemas, S3 directories, etc) stored in AWS Glue and this specific function of Glue is called the `DataCatalog`

 * Databases in Athena represent a high-level grouping (e.g. `xrhome` for data synced from Postgres, `kpi` for data relating to OKRs and KPI calculation, `stripe` for data synced from Stripe, etc.)

 * Within these databases, we have tables and views:

| | **Tables** | **Views** |
|---|---|---|
| **Description** | Parsed, **materialized** data with a defined schema. Stored in S3 and can be partitioned. Upstream to all views. | **Queries** whose results are recalculated every time they're referenced. Built downstream from other tables and views. |
| **Pros** | Quick access to outputs for computationally heavy queries. Can be partitioned to limit reads of large data sets. | Data is refreshed at each run, so it is guaranteed to be live. Easily run and transformed for other use cases. |
| **Cons** | Data can be stale and out-of-date. | Can take a long time to complete if the view is referenced many times or is computationally heavy. |

 * **For more info, see: Querying with Athena & SQL**

### Glue

AWS Glue is an integral part of our data flows at 8th Wall. Key Features are

 * Glue’s Data Catalog defines the schemas and all metadata for tables and views we use in Athena

 * Jobs are ETL scripts, written in Python or Scala, which can interact with the data catalog, other AWS services, and Spark

 * Since job workers and resources are relatively expensive, Glue jobs are reserved for quick computations (ideally < 30 min, and scheduled at most hourly)

 * Examples include materializing Athena views on S3 at specified cadences, consolidating log stream output records into a single file on S3, generating datasets for use in other services, etc.

 * Jobs have custom parameters we can define with each run, which allow us to cater behavior based on invocation environment (prod/dev), number of output files, write location, etc.

 * Triggers on Glue allow us to specify cadences or on-demand invocations of Glue jobs with specified job parameters

 * Crawlers on Glue are used to add new partitions and/or update the schema of materialized tables based on the data in its S3 location.

### Quicksight

AWS Quicksight is a visualization tool which uses datasets defined through various sources (Athena, S3, custom SQL queries, etc.) to create dashboards and monitor metrics. Some key dashboards include

 * KPI Dashboard - `<REMOVED_BEFORE_OPEN_SOURCING>`

 * Free Trial Metrics - `<REMOVED_BEFORE_OPEN_SOURCING>`

 * Dwell Time 2022 - `<REMOVED_BEFORE_OPEN_SOURCING>`

 * Dwell Time Metrics - `<REMOVED_BEFORE_OPEN_SOURCING>`

 * Featured Project Dashboard - `<REMOVED_BEFORE_OPEN_SOURCING>`

### Lambda

The Lambda platform houses serverless computing functions which can be invoked through various triggers. In our data flows, we mostly use triggers which are

 * Cloudwatch events: scheduled chron events at certain cadences (daily, hourly, etc.)

 * S3: creation of objects in a specified S3 location

 * SNS: prompts from Simple Notification Service (SNS) from other pipelines

### Pending documentation `TODO(saniya)`

 * Kinesis

 * RDS

 * Opensearch

 * Cloudwatch

 * Cloudfront?

 * API gateway?
