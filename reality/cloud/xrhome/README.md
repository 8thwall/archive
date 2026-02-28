# XRHome Development Docs

## Prerequisites

Before following the instructions listed in this README, ensure that you have followed any prerequisite steps at the [Engineer Onboarding for 8th Wall](https://<REMOVED_BEFORE_OPEN_SOURCING>.atlassian.net/wiki/spaces/AR/pages/2238775511/Engineer+Onboarding+for+8th+Wall).

Additionally, for VSCode/browser extension setup, please revisit the above guide as well as [Using VSCode at 8th Wall](https://<REMOVED_BEFORE_OPEN_SOURCING>.atlassian.net/wiki/spaces/AR/pages/1903329448/Using+VSCode+at+8th+Wall).

## Development

### Change to xrhome directory

`cd ~/repo/code8/reality/cloud/xrhome`

### Set up node modules

NOTE: When running xrhome locally, it is recommended to use the same version of Node installed to
our remote servers, which is currently 18.17.1. To manage multiple node versions, [install nvm](https://github.com/nvm-sh/nvm#installing-and-updating), then:

```sh
nvm install 18.17.1
nvm alias xrhome 18.17.1
nvm alias default xrhome # Optional, this will make the xrhome version your default version
nvm use xrhome
```

Finally, within the `xrhome` directory you can:

```sh
npm ci --legacy-peer-deps
```

#### Troubleshooting

If a large number of changes appear in package-lock.json, you might have a mismatched npm version.
Restart your terminal and make sure nvm is set up properly.
If a a few `resolved: ""` or `resolved: false` changes show up, you can revert them with
`g8 revert reality/cloud/xrhome/package-lock.json`.

### Enabling console.local.8thwall.com

Some features of xrhome local development require it to be served from console.local.8thwall.com
in your browser (i.e. not 192.168.XXX.YYY, 10.XXX.YYY.ZZZ, localhost, etc.). To get your browser
to connect to your local server when you type <https://console.local.8thwall.com:3001> into your browser window,
follow these instructions.

*Based on the instructions at <https://www.stevenrombauts.be/2018/01/use-dnsmasq-instead-of-etc-hosts/>*

You are about to run your own DNS server locally and route all .test domains to your local host.

* install dnsmasq

```sh
brew install dnsmasq
```

Add to the bottom of dnsmasq config file at `/opt/homebrew/etc/dnsmasq.conf`

```sh
address=/.lightshipdev.test/127.0.0.1
address=/.8thwallcom.test/127.0.0.1
address=/.8thwallapp.test/127.0.0.1
address=/.local.8thwall.com/127.0.0.1
address=/.local.nianticarcade.com/127.0.0.1  # Experimental domain name
```

* Starts dnsmasq `sudo brew services restart dnsmasq`
* `sudo mkdir /etc/resolver`
* Add/edit `sudo vim /etc/resolver/test` and add `nameserver 127.0.0.1`
* Add/edit `sudo vim /etc/resolver/local.8thwall.com` and add `nameserver 127.0.0.1`

If you want test the new Map List View (MLV) Niantic Arcade website locally, you need to do the following:

* Add/edit `sudo vim /etc/resolver/local.nianticarcade.com` and add `nameserver 127.0.0.1`

You can now test that things are working

```sh
ping -c 1 google.com # Make sure you can still access the outside world!
ping -c 1 www.8thwallapp.test
ping -c 1 apps.8thwallcom.test
ping -c 1 console.local.8thwall.com
ping -c 1 console.local.nianticarcade.com # Experimental domain name, test only if using.
```

### Portal Fusion

#### Testing lightshipdev.test

In the previous section, you should already have <https://lightshipdev.test:3001> routing setup with
dnsmasq and ready to be test. However, we currently still have separate authentication system for
lightship so you might have to sign up for a new test lightship account
[here](https://cd.qa.lightship.dev/signin/create-account) before you can start logging in.

### Fix some errors

Here are some errors you may encounter over the next couple steps, and recommended fixes.

#### dyld: Library nod loaded: /usr/local/opt/icu4c/lib/libicui18n.58.dylib

Symptom: When running `npm install` you see:

```sh
dyld: Library not loaded: /usr/local/opt/icu4c/lib/libicui18n.58.dylib
  Referenced from: /usr/local/bin/node
  Reason: image not found
```

Cause: Node is pegged to an older version that no longer has required dependencies on your computer.

Fix: Make the latest version of Node active.

```sh
brew link --overwrite node
```

If you are running into an issue with the `gulp` command not being found, it is likely the case that it was not installed globally. This can be fixed by running `npm install -g gulp-cli`

### Running the server

Needs 2 terminals.

> [!NOTE]
> lightship.dev is also served using xrhome after portal fusion. So the following steps will
> also start lightshipdev.test locally

#### Terminal 1 (Client)
* Run xrhome with Hot Module Replacement (or HMR). HMR lets you see updated client code
without a full page reload.

```sh
cd ~/repo/code8/reality/cloud/xrhome
npm run dev:hot
```

HMR requires you to acknowledge an insecure connection from https://localhost:3601, where the
hot-reloaded JS bundle is served from.
1. Visit https://localhost:3601 and acknowledge
2. Or enable chrome://flags/#allow-insecure-localhost

* Run xrhome without HMR
```sh
cd ~/repo/code8/reality/cloud/xrhome
npm run dev
```

In both cases of running xrhome, you will know when the terminal is in a goal state once you see output similar to:
```
webpack <some version here> compiled ... in <X> ms
```

#### Terminal 2 (Server)

```sh
cd ~/repo/code8/reality/cloud/xrhome
npm run start
```

You will know when the terminal is in a goal state once you see output similar to:
```sh
Started server: <some domain name>
<lots of "Loaded template..." logs>
Will clean up temporary directory...
Removed <X> stale invitations older than...
```

Note that currently the xrhome local instance is connecting to the Dev RDS database `xrhome-pgsql-dev` by default
<https://us-west-2.console.aws.amazon.com/rds/home?region=us-west-2#database:id=xrhome-pgsql-dev;is-cluster=false>
which has the external internet connectivity locked down to only allow the office IP.
So you need to connect to the company VPN first to get the instance running.

You can now go to <https://console.local.8thwall.com:3001> to test out 8th Wall changes or
<https://lightshipdev.test:3001> to test out lightship (portal fusion) changes

#### Troubleshooting

##### Unable to assume xrhome role for local development

Ensure that you have AWS CLI credentials as mentioned in the [Engineer Onboarding for 8th Wall](https://<REMOVED_BEFORE_OPEN_SOURCING>.atlassian.net/wiki/spaces/AR/pages/2238775511/Engineer+Onboarding+for+8th+Wall).

#### Subsequent runs with new dependencies (e.g. after syncing or editing package.json)

After syncing changes from the server, there may be new dependencies. Or, if you add new
dependencies to `package.json`, there will be new dependencies. Either way, make sure to run the
following to make sure the dependencies are up to date:

````sh
g8 sync
npm install --legacy-peer-deps
npm run dev # or npm run dev:hot
````

#### Use local version of @8thwall/embed8

If you want to use the local version of embed8 so you can make changes to the library
at the same time as using it in xrhome. You can use npm link.

````sh
# Link your embed8
cd apps/client/public/web/embed
npm link
cd -
# Use these version in xrhome
cd reality/cloud/xrhome
npm link @8thwall/embed8
````

### Type Checking

```sh
npm run ts:check
```

```sh
npm run ts:check-file src/client/app.tsx
```

Our migration to a strict typescript compilation is in progress. If you are modifying a file that
includes a `// @ts-nocheck LEGACY_TS_ERRORS` line, please remove the line and ensure there are no
errors in the file.

## Production

### Creating a Production & Deploying Build

<https://<REMOVED_BEFORE_OPEN_SOURCING>.atlassian.net/wiki/spaces/AR/pages/2122547233/Creating+a+new+XRHome+Release>

### Advanced xrhome Build Topics

You typically should **not** create production builds from your local machine. If you must do so, you have a couple options:

#### Prerequisite

- Install eb by brew install awsebcli

#### OPTION 1: Automatic deploy to console-staging.8thwall.com

* Run `npm run deploy-version`
* Check that the site at <https://console-staging.8thwall.com> is working as expected. NOTE that this site uses
  the same database as the Production one. Do NOT delete or modify random things.
* Switch the prod version
  * Go to <https://console.aws.amazon.com> , Elastic Beanstalk, Console-prod
  * Click `Upload and Deploy`, choose `Application Versions page`
  * Find the version that Console-staging is pointing to
  * Check the version check-box, choose `Deploy`, in Environment, pick Console-prod. Choose `Deploy`

#### OPTION 2: Prepare .zip package to upload to beanstalk manually

* Run `./package-beanstalk.sh` to generate console-server.zip
* Check that the zip file has the content that you want `zipinfo console-server.zip`
  It should contains ***.ebextensions*** folder, ***src/server*** code in multiple files, ***src/shared/*** and the uglified distributed data under ***dist/***
* If you already have eb working, then 'npm run eb-deploy'
  Otherwise, 'eb init' and for aws-access-id put in a new 'Access key ID' and secret found on your IAM Summary > Users page
* To upload manually
  * Go to console.aws.amazon.com, go to Elastic Beanstalk, Applications -> Website -> Console-prod
  * Click on "Upload and Deploy"
  * Choose your console-server.zip. Use the label console-server-YYYYMMDD

## Relational Database Related

### DB Migration

The detail guide to migrate our database can be found on Prod8 repo
[here](https://github.com/8thwall/prod8/blob/master/migrations/README.md)

### Production Tunnelling

> [!CAUTION]
>If you need to go in and directly edit production migrations, start by posting in #8w-production-changes so people know what you're planning to do.

#### Set up an ssh tunnel

```sh
ssh -L <REMOVED_BEFORE_OPEN_SOURCING>:<REMOVED_BEFORE_OPEN_SOURCING>:xrhome-pgsql.<REMOVED_BEFORE_OPEN_SOURCING>.us-west-2.rds.amazonaws.com:<REMOVED_BEFORE_OPEN_SOURCING> ec2-user@<REMOVED_BEFORE_OPEN_SOURCING>.us-west-2.compute.amazonaws.com -i ~/.ssh/<REMOVED_BEFORE_OPEN_SOURCING>.pem -o "ExitOnForwardFailure yes" -N
```

By running that command, your 5433 port will be tunneled through the ec2 instance to the prod database, which otherwise cannot be connected to directly. Note that the specific `xxx.compute.amazonaws.com` domain may no longer work if the instance is terminated, you can get a list of running instances [here](https://us-west-2.console.aws.amazon.com/ec2/home?region=us-west-2#Instances:search=:rc;v=3;$case=tags:true%5C,client:false;$regex=tags:false%5C,client:false).

Go to [Parameter Store](https://us-west-2.console.aws.amazon.com/systems-manager/parameters/%252FProd%252Fsecrets%252Fxrhome_db_url/description?region=us-west-2&tab=Table#list_parameter_filters=Name:Contains:xrhome
) to get the production password.

Don't enter this command in an AI-enabled terminal which phones home to a third party.

```sh
export DB_PASSWORD='xxx'
```

#### Check migration statuses

```sh
DATA_REALM=production-tunnel npx sequelize db:migrate:status
```

Note that your current prod8 checkout controls what you see in this list, so you may want to switch to a clean client or sync in that repo.

#### Undo a migration

```sh
DATA_REALM=production-tunnel npx sequelize db:migrate:undo --name 20250101-example.js
```

#### Run all unapplied migrations

```sh
DATA_REALM=production-tunnel npx sequelize db:migrate
```

### Changing Enums column example

1. Create a new migration file that alter the enum type for
[example](https://github.com/8thwall/prod8/blob/master/migrations/xrhome/typed/20220510181515-update-build-settings-splash-screen.ts)
2. Alter the enum type in schema mapping

## Debug Production Package

When the app fails to load on console-staging, here are some pointers on how to debug

### If the problem is potentially on the client side

You can run the same server you run in development mode with the js for distribution. Simply run `npm run dist`
which would put your JS into the production version. This removes source map and uglify your JS though. You would want
to comment out the mode: ... line in webpack.main.js temporarily to make it easier to determine the error line
in the code

## Production Initial Setup (already done)

> [!IMPORTANT]
> This is only for archival. You don't need to re-perform these tasks

1. Verify that you can log into a host within our VPC. A good host would be the console-staging host
  `ssh -i "~/.ssh/<REMOVED_BEFORE_OPEN_SOURCING>.pem" ec2-user@<REMOVED_BEFORE_OPEN_SOURCING>.us-west-2.compute.amazonaws.com`
2. Log out. Go to `c8/reality/cloud/xrhome/` Get the migration code onto the server

```sh
tar czf migration-sql.tar.gz .sequelizerc package.json config/db.js storage
scp -i "~/.ssh/<REMOVED_BEFORE_OPEN_SOURCING>.pem" migration-sql.tar.gz ec2-user@<REMOVED_BEFORE_OPEN_SOURCING>.us-west-2.compute.amazonaws.com:
```

3. Log back into the server (see step 1)
4. Create a folder and extract the files

```sh
mkdir xrhome_migration
cd xrhome_migration
tar xzf migration-sql.tar.gz
```

5. Run npm to install sequelize and postgres

```sh
export PATH=$PATH:/opt/elasticbeanstalk/node-install/node-v8.9.3-linux-x64/bin/
npm install sequelize sequelize-cli pg
```

6. You do NOT have to perform db creation. Our Aurora instance has it
7. Set the env variables for the correct connection, see c8/reality/cloud/xrhome/.env
8. Perform model sync

```sh
NODE_ENV=production node storage/migrations/sync.js
```

9. Perform seeder data population

```sh
node_modules/.bin/sequelize --env production db:seeder:all
```

## Known problems

### Debug cookies

Many of our cookies are signed cookies, you can print their content using either the tools/cookie
command or by copy and paste the cookie content into [jwt.io](https://jwt.io)

## Advanced local development

> [!WARNING]
>Typical development for xrhome connects to a shared development database. This section walks through
>creating a database on your local machine, but great care should be taken to avoid writing data to
>the shared database. Please work with a senior team member to make sure these instructions are up to
>date and accurate.

### Set up your Postgres

Install PostgresQL using either brew (instructions below), or the package downloadable from Postgres website. The package from their website include a GUI tool for managing the tables and querying.

* Install postgres sql

```sh
brew install postgresql
```

* Start as a service; this will restart the server when your computer restarts.

```sh
brew services start postgresql
```

* Alternatively, this will start the server, but it will go down when your computer does:

```sh
pg_ctl -D /usr/local/var/postgres start
```

* Set up the same credentials as the one used in our development

```sh
psql postgres
postgres=# CREATE ROLE postgres WITH LOGIN PASSWORD 'foo';
postgres=# ALTER ROLE postgres CREATEDB;
postgres=# \q
```

### Set up your dev database

#### First run only (or if your db gets dropped)

First configure `db.js` to create your local database correctly. Under the cases for `development` and `local`, you'll need to:

* Set the host to localhost: `'host': 'localhost',`
* Disable SSL: comment out `dialectOptions`
* Change the `username` and `password` to be the username and password you set under `## Set up your postgres`

Then run the following to set up the databases used for development and unit testing, respectively!

```sh
node_modules/.bin/sequelize db:create
node_modules/.bin/sequelize db:create --env test
```

#### Reset database to starting data

> [!CAUTION]
> For a full init script, you can run `init.sh`. But be careful when running this. Make sure you have:
>  1. Connected to your local database and
>  2. Disconnected from the VPN so you can't touch the AWS database

> [!TIP]
> If you just want to create the schema and run migrations, you can run
> `node tools/archive/mark.js` and then `node tools/archive/sync.js`. You will have to fill in the
> config here, set it to: `var config    = require(__dirname + '/../../config/db.js')(env);`. You can
> also just set the key-value pairs yourself in the config object.

#### Seed some useful data

We provide several useful seeds so your local data is in a good state for various aspects of the console

```sh
npx sequelize db:seed --seed 20200520140828-public-browse-8thwall.js
npx sequelize db:seed --seed 20200501184226-default-contract.js
```

## Data Realms and Deployments

For naming, we have deployment stage, data realm, and feature progress concepts

### Deployment stages

- "CD" = (continuous deployment, i.e. autopush), ~hourly
- "RC" = release branch build, cut from head ~weekly, with cherrypicks
- "Release" = what users see

### Data realms

- "QA" = non-prod, used for local development and release QA
 - Build time: use "isQa"
- "Prod" = what users see

### Feature Progresses

- Disabled (build time: false)
- Experimental (early development, enabled in cd-qa builds)
- Mature (late-stage development, enabled in cd-prod builds)
- Launched (build time: true)

### Deployment table

We have a guide on how to cut a new release [here](<REMOVED_BEFORE_OPEN_SOURCING>)

With the above taxonomy, we can define the following deployments

| Name                                                                                   | Endpoint                        | Deployment | OAuth | Data | Feature      | Downstream | Status                  |
| -------------------------------------------------------------------------------------- | ------------------------------- | ---------- | ----- | ---- | ------------ | ---------- | ----------------------- |
| local                                                                                  | console.local.8thwall.com:3001/ | unlanded   | no    | QA   | Experimental | cd-qa      | current                 |
| [cd-qa](http://jenkins.<REMOVED_BEFORE_OPEN_SOURCING>.com:<REMOVED_BEFORE_OPEN_SOURCING>/view/xrhome/job/xrhome-cd-qa/)                 | www-cd.qa.8thwall.com           | CD         | yes   | QA   | Experimental | cd-qa      | console-dev.8thwall.com |
| **rc-qa**                                                                              | www-rc.qa.8thwall.com           | RC         | yes   | QA   | Launched     | rc-qa      | new                     |
| [cd-prod](http://jenkins.<REMOVED_BEFORE_OPEN_SOURCING>.com:<REMOVED_BEFORE_OPEN_SOURCING>/view/xrhome/job/xrhome-cd-prod/)             | www-cd.8thwall.com              | CD         | yes   | Prod | Mature       | cd-prod    | new                     |
| [rc-prod](http://jenkins.<REMOVED_BEFORE_OPEN_SOURCING>.com:<REMOVED_BEFORE_OPEN_SOURCING>/view/xrhome/job/xrhome-rc/)                  | www-rc.8thwall.com              | RC         | yes   | Prod | Launched     | release    | staging.8thwall.com     |
| [release](http://jenkins.<REMOVED_BEFORE_OPEN_SOURCING>.com:<REMOVED_BEFORE_OPEN_SOURCING>/view/xrhome/job/xrhome-rc-captain-notifier/) | www.8thwall.com                 | Release    | no    | Prod | Launched     | release    | current                 |

**NOTE**: we haven't created rc-qa as of May 2025 since it's not needed

### Buildif flag by domain truth table (updated 2025-05-27)

| Value               | console.local | www-cd.qa | ww-cd | www-rc/prod | Note                                                                   |
| ------------------- | ------------- | --------- | ----- | ----------- | ---------------------------------------------------------------------- |
| `true `             | ✅             | ✅         | ✅     | ✅           | this feature is included in all builds                                |
| `false `            | ❌             | ❌         | ❌     | ❌           | this feature is included in no builds                                 |
| `'isTest'`          | ❌             | ❌         | ❌     | ❌           | True when running client-side tests                                    |
| `'isLocal'`         | ✅             | ❌         | ❌     | ❌           | True if running locally                                                |
| `'isQa'`/`'isDev'`  | ✅             | ✅         | ❌     | ❌           | True if in the QA data realm. Env params are preferred for server code |
| `'isExperimental' ` | ✅             | ✅         | ❌     | ❌           | Features that should only be visible for internal QA builds            |
| `'isMature' `       | ✅             | ✅         | ✅     | ❌           | Features that aren't ready to launch, but ready for QA or prod testing |
