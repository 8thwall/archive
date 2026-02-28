# Auto-tagging tech types/frameworks

 * Background
 * Dataflow
 * Methodology overview
 * Known Limitations
 * Auto-tagging sources
 * Opensearch-ranking Glue job

## Background

Auto-tagging projects would be helpful for search and filtering functionality on features such as the project picker and discovery hub. We currently rely on exact keyword matching of technology types within the user-provided text of a public project, which is both unreliable and requires manual intervention to resolve.

## Dataflow

### Methodology overview

We leverage various data sources to determine (roughly) whether an application has utilized various technology types and frameworks. (See Auto-tagging sources section below.)

 * Engine logs:

 * Dwell time metrics: time tracked for a given feature

 * Modules logged: modules loaded during the engine sessions

 * Note: the engine only logs a set of specified modules (_list defined here_ _)_ and wouldn’t include project modules imported/created by a user

 * Console logs: modules imported into the project

 * XRHome: app’s name, title, or tags

The `opensearch-ranking` Glue job materializes the projects' associated tech types and app rankings to S3, which are then picked up by the discovery hub`rank-search` lambda to be synced to OpenSearch. (See opensearch-ranking Glue job section below.)

### Known Limitations

 * Using engine (dwell time/modules) and console (imported modules) logs would include

 * We would only have tech types derived from engine logs associated with a project which was

 * Sampled through _application_events_ (because only 1/100 application sessions are logged), AND

 * either logged

 1. after 2021-09-21 for fields obtained through logged modules, OR 

 2. using engine release 18 onwards for fields determined through dwell time metrics

 * Since the opensearch-ranking Glue job currently runs daily, we could see a delay between applications which were newly launched and their tech types being available to opensearch

 * Some public projects whose launched app was different from the one they published would not be associated with the technologies from application_events. This is also the behavior for appranking logic at the moment.

### Auto-tagging sources

The view **logs.app_techs** utilizes application_events logs to aggregate technologies associated with projects. (Query: reality/cloud/aws/athena/logs/app_techs)

| **Source** | **Tech type/Framework** | **Value in OpenSearch** |
|----------------------------------------------|-----------------------------------------------|--------------------------|
| **[Engine logs]** **Dwell time** | World effects | `world effects` |
| Face effects | `face effects` |
| (Flat) Image targets | `image targets - flat` |
| Curved image targets | `image targets - curved` |
| VPS | `vps` |
| Hand tracking | `hand tracking` |
| **[Engine logs]** **Logged Modules** | Babylon JS renderer | `babylon.js` |
| WebGL texture renderer | ~~webgl~~ (Not synced to OpenSearch) |
| Media recorder | ~~mediarecorder~~ (Not synced to OpenSearch) |
| Playcanvas | ~~playcanvas~~(Not synced to OpenSearch) |
| Sumerian JS | ~~sumerianjs~~ (Not synced to OpenSearch) |
| Three.js renderer | `three.js` |
| XR A-frame | `a-frame` |
| **[XRHome]** **Tags, app names, app titles** | Holograms | `holograms` |
| Avatars | `avatars` |
| Sky effects | `sky effects` |
| **[Console logs]** **Module imports** | Shared AR Module | `shared ar` |

### Opensearch-ranking Glue job

The `opensearch-ranking` Glue job materializes the projects’ associated tech types and app rankings to S3 and is scheduled to run once a day. (Script: reality/cloud/aws/glue/opensearch-ranking.py)

These tags are also materialized under the `logs.app_tech_frameworks` to leverage downstream and reduce query runtimes. By default, the script adds a new partition with the latest day’s tags. If we add a new autotag, we will need to backfill the data in this table.

 * **Daily Forwards**

 * The daily trigger generates tech types associated with applications on the previous day through **logs.app_techs** and writes it to a new `dt=yyyy-mm-dd/` partition.

 * **Historical**

 * Materialize a single partition containing historical tech types for applications.

 1. Add the new column to `logs.app_tech_frameworks` Glue table schema

 2. Specify job parameter `--backfill = 1` to overwrite the historical partition `dt=0000-00-00/`

Since the materialized table has a app record in each `dt` partition, we need to reduce it to a single record per app for the file that is read by opensearch.

Example

> A project which has records on two days, and is only associated with _sharedar_ on one of them, would be reduced to a single row reflecting that someone had used _sharedar_ while viewing this experience:

> …which would then be transformed to lists containing tech types and frameworks, and in this case, the following _json_ record would be written to S3:
```json
{
 "index":"apps",
 "id":"foo",
 "updates":"{\"autotags\": \"world effects,a-frame,vps,shared ar\"}"
}
```

The discovery hub rank-search lambda then reads the file of all tech types and rankings to serve to xrhome.
