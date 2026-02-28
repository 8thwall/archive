# g8 Basics Codelab

# Introduction

`g8` is a Niantic command-line tool that streamlines common git workflows and makes it harder to get into catastrophic states. You use it on the command line by typing `g8` instead of `git`. When you use `g8`, you will almost never need to use `git`.

Compared to `git`, `g8` is designed to help keep you close to `main` and land code faster.

`g8` does this by operating on a `Squash and Rebase` workflow. Every change made through `g8` will result in exactly one commit in `main`. Subsequent changes in development would then be rebased on top of those commits, forcing merge conflicts to be resolved during development, rather than after development has completed.

# GitHub https credentials and g8 Installation

`g8` uses https authentication with a GitLab personal access token that is stored in your OSX Keychain.

Set the token expiration to at the very least some several months in the future to prevent potential debugging time if you fail to update the token correctly.

Credentials and installation are setup as part of the repo/niantic bootstrap script. If you haven’t run it already, run the following command in a shell:
```bash
/bin/bash -c "$(curl -fsSL
```

When prompted, head over to and generate a token with the following scopes:

 * **✅ api**

 * **✅ read_api**

 * **✅ read_repository**

 * **✅ write_repository**

When you add the Personal Access Token to the prompt above, it will configure `git` and `g8` clients to store this credential in your OSX keychain and use it for https connections to gitlab.

If you see an error about your command line tools being outdated, try the following command:
`sudo xcode-select --install`

### Updating your token via a script (only necessary if it expires)

run the following command in a shell:
```bash
/bin/bash -c "$(curl -fsSL
```

### Updating your token manually (only necessary if it expires)

Head over to and generate a new token with the permissions mentioned above. Then open the osx keychain and replace the existing token with the new one.

# Confirmation:

To confirm your installation was successful, run the following:
```bash
g8 --help
```

# Upgrade g8

g8 is distributed through [Homebrew](<https://brew.sh/>), using a [Homebrew Tap](<https://brew.sh/>). To upgrade g8, run the following commands from your terminal:
```bash
brew update
```
```bash
brew upgrade g8
```

## g8 Concepts

**client** : All g8 work is done in clients. Each g8 client is a separate branch off of `main`. You can have many clients, and each has work that is completely isolated from other clients.

**status / diff** : Files that differ from `main` show up in the status, and the changes with respect to `main` can be shown with a `diff` query.

**changeset** : When you’re ready to merge a changed file or files back to `main`, you create a changeset. A changeset is a subset of files in your client and a message describing the change.

**code review** : After creating a changeset, it can be reviewed in a code review UI like github or gitlab. You can have multiple changesets from the same client being reviewed simultaneously, as long as they contain different files. Not all edited files need to be in a changeset for code review.

**update** : Changes made locally after creating a changeset will not be reflected in code review (and will not ultimately be landed) unless you update your changeset using `g8 update`.

**patch** : While you’re waiting on a changeset to be reviewed, you can continue work on those files in another client by patching the changeset into the different client. These changes will be isolated from the current codereview cycle, and can be sent later, after you land, sync and merge.

**land** : After code review finishes, you land your changeset to have it merged into `main`. If there are conflicts with `main`, they must be resolved before landing.

**sync / merge** : To get the newest changes into a client (either changes made by your colleagues or changes you have made in another client), you should sync the client. This will make your client up to date with the latest and greatest. However, if you have work that conflicts with new changes, you will have to resolve merge conflicts. Once merge conflicts are resolved, you can continue working.

**revert** : To discard local changes, you can revert a file or all files. This will make them the same as they are on `main`. You can also revert them to an older version of themselves at a specific commit.

# Using g8 with an existing Niantic repo

`g8` works well with existing git repos, however, it currently supports only `https` authentication. That means you may need to run a command so switch `ssh` to `https`.

Print out the current origin for the repo:
```bash
git remote get-url origin
```

If the result is ` your repo is already using `https` authentication.

If the result is `git@<internal-gitlab>:<path>.git run the following command:
```bash
git remote set-url origin remote get-url origin | sed 's/https:\/\/<internal-gitlab> | sed 's/git@<internal-gitlab>:<path>.git
```

# Working with g8

First time setup:
```bash
# Create a new client with a name of your choice.
g8 newclient doty
```

Typical Workflow:
```bash
# Sync all remote changes and resolve any merge conflicts.
g8 sync

# Edit an existing file.
vim path/to/some/file.cc

# See added, deleted, and modified files.
g8 status

# Make a new changeset with some files (editor will open up to select)
g8 newchange -m "change message"

# Edit another file
vim path/to/some/otherfile.cc

# Open the interactive editor to add this new file to the changeset.
g8 files

# Edit the file some more.
vim path/to/some/otherfile.cc

# Save new changes to otherfile.cc to your existing merge request.
g8 update

# Update the changeset message with any additional modifications.
g8 update -m "change message"

# View diff of the changes in your client.
g8 diff

# Go to gitlab and request review
# Get feedback on your review, edit and update as necessary.
g8 mr

# Once your change has approval, land it. Do not merge using the UI.
g8 land 457234
```

Other common actions:
```bash
# Switch between clients
g8 client foo

# List all of your clients
g8 client

# revert a set of files without a prompt
g8 revert file1 file2

# revert all files with prompt
g8 revert
```

Advanced usage:
```bash
# Sync your client to a specific previous commit on main.
g8 sync -c <commit id>

# Revert file or files to the state they were in the given commit.
g8 revert -c <commit id> [files]

# Bring in changes from another client into this client.
g8 patch -c <other client>

# Bring in changes from a changeset in a different client.
g8 patch -c <other client> -s 457234

# Discard changeset
g8 change -d 404894

# If you don’t need the client you were working on anymore, consider
# deleting it to avoid “client clutter” for yourself.
g8 client -d doty
```

Recovering from bad states:
```bash
# Generally g8 is safe and self-consistent. As a rule, avoid manual
# git actions, and avoid merging directly from the github UI. If you
# find yourself in a bad state, some of the following may help.
git gc

# Oops! I accidentally merged a PR from the github UI instead of
# running g8 land. What do I need to do to get back to a happy place?
g8 sync
g8 change -d 123456 # Use the number from your changeset
```

# Cloning

`g8 clone

If the repo uses git-lfs you’ll need to get it setup with:

`git lfs pull && git checkout -f HEAD`

# Clients

One of g8's basic primitives are clients. Each client is an independent fork off of main with working changes. Changing between clients manages loading and storing all working changes associated with that client.

g8 clients enable parallel progress on multiple independent projects. Each client keeps work from interacting with each other client. This keeps each of your projects as a smaller delta and more targeted on top of main.

## Create a Client

g8 requires a client to be created before creating any modifications to the codebase.
Let's create a few clients for some changes that will be made later in this codelab:
```bash
g8 newclient clean
g8 newclient feature1
g8 newclient feature2
```

### Clean Client

g8 does not let you operate directly on main. However, it is often helpful to have a special client that is a clean branch off main. This is useful for diagnosing regressions in your code, for example.

## Change Clients

You'll notice that each time a client is created, g8 will automatically switch to the newly created client. We won't actually need to use the `feature2` client for the remainder of this codelab, so let's switch to a client we will be using.

We can view all of the available clients by running:
```bash
g8 client
```

Let's switch to the `feature1` client.
```bash
g8 client feature1
```

## Delete A Client

There's no real harm in keeping a client around, though it certainly causes clutter when listing out all of the clients you have locally. You can delete clients that you no longer want by using the `-d` flag on the `g8 client` command. Let's delete the `feature2` client, since we will no longer need it for this codelab.
```bash
g8 client -d feature2
```

# Create Changesets

A changeset is a subset of working files in a client that can be reviewed and landed. Changesets enable incremental review and landing of related changes for one project. The only limitation is that changesets must be a strict partitioning of files with working changes. One file can't be in two changesets in the same client at a time.

Each changeset that g8 creates will correspond to exactly one pull request in GitHub. A typcical workflow will look like:

 1. Make changes locally.

 2. View & verify your changes locally.

 3. Create a changeset / pull request on GitHub.

 4. Make more local changes.

 5. Update your changeset to include the new local changes.

## Make Changes

Let's start by making some changes in the `code8` codebase.
```bash
cd path/to/code8
mkdir codelabs/g8basics/YOUR_8THWALL_USERNAME
cd codelabs/g8basics/YOUR_8THWALL_USERNAME
```

Be sure to replace `YOUR_8THWALL_USERNAME` with your own username. This is typically matches what is before the "@<company>.com" part of your email.

Let's now create a file under this directory, called `my_changes_1.txt`. Inside that file, copy the following:
```
Hello 8th Wall!
```

## View Changes

There are a couple different ways to view the changes you've made so far, and each provides a different overview of the changes made. That being said, `g8` will always show you the differences between your current state and the fork point (i.e. the main branch).

Let's run the following command:
```bash
g8 status
```

This command will provide a quick overview of the files that have been added, modified, or deleted.

Now, let's run:
```bash
g8 diff
```

This will display all of the changes that have been made in the files listed by `g8 status`. This, however, can be a little overwhelming when you have several files with changes. For a more scoped view of your changes, you can use the single file option provided by `g8 diff`:
```bash
g8 diff codelabs/g8basics/YOUR_8THWALL_USERNAME/my_changes_1.txt
```

_NOTE: The path provided for single file diffs must always be relative to the code8 root._

Both these commands can be pretty useful in verifying all your changes before creating a changeset that is uploaded to GitHub.

## Create A New Changeset

Now that we have made and verified all of our changes, let's create a changeset. This can be done using the `newchange` command.
```bash
g8 newchange
```

You'll immediately be prompted to edit another file. In this file, you will specify which files should be included in your changeset. It should look something like this:
```bash
# The following files will be included in the changeset.
codelabs/g8basics/YOUR_8THWALL_USERNAME/my_changes_1.txt
```

This prompt will automatically include any files with local changes that do not already belong to an existing changeset. In our case though, we only have one file, which should be included, so no edits will be needed with this file. To continue, simply save and quit from this file.

_NOTE: The command to save and quit from vim is ESC, then :wq_

After selecting your files, you'll then be prompted to provide a description for your changeset. This description will be used as the title of the pull request that is created on GitHub, and will ultimately be the name of the squashed commit that is pushed onto main. This name should be descriptive name that encapsulates your changes well.

One of the description styles we use at 8th Wall is to prefix the changeset description with a "tag". This tag provides a quick identifier for what part of the codebase the commit is changing. Some examples of this are:

 * **[xrhome]** \- Changes made to the 8th Wall Developer Console.

 * **[server-admin]** \- Changes made to the 8th Wall Admin Console.

 * **[g8]** \- Changes made to `g8`'s source code.

In some cases, it may make sense to use multiple prefix tags as well. There isn't a strict rule on how these should be used, so long as they make sense and help identify what the change is for.

Given that, let's use the following as our desciption:
```json
[codelab][g8basics] My first changeset
# Please enter the description for your changeset. Lines starting
# with '#' will be ignored, and empty message will cancel.
#
# In client 'feature1'
#
# Files in the changeset:
# codelabs/g8basics/YOUR_8THWALL_USERNAME/my_changes_1.txt
```

Each changeset corresponds to exactly one pull request on GitHub, so by creating a new changeset, a new pull request is also created for you.

Verify that your pull request is visible on GitHub by navigating to go/pr, then searching for the pull request with your title.

### Opening changeset PR/MR in the browser.

Once you have a changeset going you can open the associated Github PR/ Gitlab MR via command line.

Use **g8 status** to view your changesets:

(In the screenshot above I’m using ng8 as an alias for g8)

Now you can do `g8 mr` to launch the MR in gitlab. If you have multiple changesets you can open a specific one like so `g8 mr 952697`

Note that `g8 pr` and `g8 mr` are aliases for each other and can be used interchangeably.

## Update A Changeset

By default, `g8` will create pull requests for each changeset as a `Draft`. This not only allows you to continue making changes to the files in your pull request, but it also allows others on the team to know that these changes are still a work-in-progress.

In typical feature development, the first version of your pull request isn't always the version that is ready to be reviewed. To emulate that, let's add more changes to our `my_changes_1.txt` file.
```
Hello World!

WebAR is cool!
```

Now, let's verify g8 has detected these changes:
```bash
g8 status
```

You'll notice that this time, there is an asterisk next to our file name.
```
Changeset [123456] [codelab][g8basics] My first changeset
 A* codelabs/g8basics/YOUR_8THWALL_USERNAME/my_changes_1.txt
```

This means that the file contains changes locally which are not part of the current changeset yet. To update your changeset with your latest changes, you can use the `update` command:
```bash
g8 update
```

Verify that your changes have been uploaded to GitHub. You should now see your new and old changes on your pull request.

If you run `g8 status` again, you'll notice that the asterisk is no longer next to the file you modified.

### Add A New File to an Existing Changeset

Before we move forward with this changeset, let's quickly add another file.

Create a file named `my_changes_2.txt` under the `codelabs/g8basics/YOUR_8THWALL_USERNAME` directory. Paste the following into the file:
```
Hello World! This file wasn't part of the original changeset!
```

To quickly add/remove files from any existing changesets, we can use the `files` command.
```bash
g8 files
```

You should see something like:
```bash
# Changeset [123456] [codelab][g8basics] My first changeset
codelabs/g8basics/YOUR_8THWALL_USERNAME/my_changes_1.txt
# Changeset [working]
codelabs/g8basics/YOUR_8THWALL_USERNAME/my_changes_2.txt
```

The files listed under `[working]` represent files that are not currently included in any changeset. To add it to our current changeset, cut and paste the `my_changes_2.txt` file so that it now appears under our changeset:
```bash
# Changeset [123456] [codelab][g8basics] My first changeset
codelabs/g8basics/YOUR_8THWALL_USERNAME/my_changes_1.txt
codelabs/g8basics/YOUR_8THWALL_USERNAME/my_changes_2.txt
# Changeset [working]
```

Save and quit the editor, then run `g8 status`. You should now see that the `my_changes_2.txt` file appears as part of our current changeset.
```
$ g8 status
Changeset [123456] [codelab][g8basics] My first changeset
 A codelabs/g8basics/YOUR_8THWALL_USERNAME/my_changes_1.txt
 A codelabs/g8basics/YOUR_8THWALL_USERNAME/my_changes_2.txt
```

# Request A Review

Before asking anyone to review your pull request, you should always self-review your code.

If you've followed along in this codelab so far, you should see that your pull request has changes in both `my_changes_1.txt` and `my_changes_2.txt`.

Once you have reviewed your own code, you can request a review from another person on the team in two ways. For the purposes of this codelab, feel free to request review from the username `mralbean`.

## Request Review Through GitHub

You can request a review directly through the GitHub UI. This is perfectly safe to do, and will not affect your local `g8` state.

First, mark your PR as "Ready for review". This will change your PR from `Draft` to `Open`.

Next, click "Reviewers", search for `mralbean` and add `Alvin Portillo` as your reviewer.

## Request Review Through G8

You can also request a review using g8.
```bash
# Request a review
g8 send 12345 -t mralbean

# Request a group of reviewers
# Define a usergroup in .git/info/user_groups.txt
# Example: groupname=user1,user2,user3
g8 send 12345 -g groupname
```

# Land Code

You'll usually hear the phrase "landing code", or "my code has landed" at 8th Wall. Landing your code, in this context, represents the act of pushing your changes from your changeset onto main. As such, the command for merging your changeset's pull request into main is `g8 land`.

Typically, you should wait until at least one other engineer on the team has approved your pull request. However, this is a codelab which doesn't affect production code, so let's land some of the changes we've made now.
```bash
g8 land 12345
```

_NOTE: Be sure to replace 12345 with the actual value of your changeset._

## Verify Landed Changes

Congrats! Your changes should now be visible on the main branch. We can verify this in two places:

 1. On Github

 2. On a separate g8 client

Let's first verify on GitHub by navigating to <https://github.com/8thwall/8thwall/tree/master/codelabs/g8basics,> and ensure your folder and files are visible.

Next, let's switch to the `clean` client. As we mentioned earlier, this is a good client to keep as a local representation of the current state of `main`.
```bash
g8 client clean
```

Let's sync to make sure we're up-to-date with the newest changes, then print a log of the most recent commits:
```bash
g8 sync
g8 log
```

Your most recent change should appear as a single commit near the top (if not the top) of the list!

## Managing Merge Conflicts

When you sync, g8 automatically merges files where possible, but sometimes conflicts must be resolved with your input. In these cases, you will enter a conflict resolution flow which looks like this:
```
Modified file /path/to/foo.txt has merge conflicts. Edit?
Edit(e) Accept Theirs (at) Accept Yours (ay) Cancel(c) Help(?) e:
```

In this case, hit `return` or type `e` to open a text editor and manually resolve conflicts. After all conflicts are resolved, save the file and close the editor. Then you should see this prompt:
```
File /path/to/foo.txt has been edited. Accept edit?
Accept Edits (ae) Accept Theirs (at) Accept Yours (ay) Edit(e) Cancel(c) Help(?) ae:
```

Hitting `return` or typing `ae` will then accept your merge.

If instead of merging, you know that you want to accept the new version of the file from the `main` branch, discarding your changes, you can select `at` (Accept theirs) instead of editing. If you know that you want to keep your version of the file, discarding any changes from main, you can select `ay` (Accept yours) instead of editing.

If a file that you have edited was deleted on `main`, you will see the following:
```
Modified file %s has been deleted. Accept delete?
Accept Delete (ad) Accept Yours (ay) Cancel(c) Help(?) ad:
```

In this case, hit `return` or type `ad` to delete the file from your client, discarding all of your changes. If you want to keep the deleted file (effectively re-adding it), you can type `ay` (Accept yours) instead.

If at any point you want clarification on these choices, you can type `?` to bring up the help menu:
```
Merge conflict detected, please choose from the following:
 ? (help) - Print this message.
 c (cancel) - Exit without syncing.
 d (diff) - Print diff from yours to merge.
 e (edit) - Edit the proposed merge and manually resolve conflicts.
 ad (accept delete) - Accept their delete [if applicable].
 ae (accept edits) - Accept your edits [if applicable].
 am (accept merge) - Accept the auto merge results [if applicable].
 at (accept theirs) - Accept their version, discard your changes.
 ay (accept yours) - Accept your version, discard their changes.
 dt (diff theirs) - Print diff from original to theirs.
 dy (diff yours) - Print diff from original to yours.
```

# Land Through GitHub

While it is highly recommended that you manage all of your version control actions through `g8`, it is also possible to land your code through the GitHub UI. Landing through GitHub will require you to manually clean up any out-of-sync state with your local g8 clients. See “Recovering from bad states” above.

That being said, if you do decide your preferred method of landing is through GitHub, please be sure you change your landing method to `Squash and merge`. This way, your changes stay consistent with g8's behavior of squashing all intermediate commits into one commit.

# Caveats with Gitlab.

I noticed the following on a project that i created in my own group that i made:

 1. I had to change the squash and merge settings in the repo so that landing an MR would result in a single squash commit. Originally it squashed the changeset branch on top of main then "merged" it. Weird. **Repo settings → Need to set merge to be**`Fast-forward Merge` to prevent double-commits. G8 only does fast-forward lands.

 2. For the g8 testing repo I had to add Kyle to the project for him to be able to push (create clients and so forth) even though he was able to read (clone). I take that users who are members of groups automatically get write permissions.

# Congratulations

You've learned the basics of g8! Now that you have a better understanding of g8, it's highly recommended that you join the #g8-devs Slack channel to help further improve g8 for both memebers of the team, and our public users using the Cloud Editor!
