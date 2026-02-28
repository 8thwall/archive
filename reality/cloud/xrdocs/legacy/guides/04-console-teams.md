---
id: teams
---

# Teams

Each Workspace has a team containing one or more Users, each with different permissions. Users can belong to multiple Workspace teams.

Add others to your team to allow them to access the Projects in your workspace. This allows you to collaboratively create, manage, test and publish Web AR projects as a team.

## Invite Users {#invite-users}

1. Select your workspace.

![SelectWorkspace](/images/console-home-my-workspaces.jpg)

2. Click **Team** in the left navigation.

![SelectAccountNav](/images/console-workspace-nav-teams.jpg)

3. Enter the email address(es) for the users you want to invite.  Enter multiple emails separated by commas.
4. Click **Invite users**

![ManagePlans](/images/console-teams-invite.jpg)

## User Roles {#user-roles}

Team members can have one of the following roles:
* OWNER
* ADMIN
* BILLMANAGER
* DEV

Capabilities for each role:

Capability                                  | OWNER | ADMIN | BILLMANAGER | DEV
----------                                  | ----- | ----- | ----------- | ---
Projects - View                             | X     | X     | X           | X
Projects - Create                           | X     | X     | X           | X
Projects - Edit                             | X     | X     | X           | X
Projects - Delete                           | X     | X     | X           | X
Team - View Users                           | X     | X     | X           | X
Team - Invite Users                         | X     | X     |             |
Team - Remove Users                         | X     | X     |             |
Team - Manage User Roles                    | X     | X     |             |
Public Profile - Activate                   | X     | X     |             |
Public Profile - Deactivate                 | X     | X     |             |
Public Profile - Publish Featured Project   | X     | X     |             |
Public Profile - Edit Featured Project      | X     | X     |             | X
Public Profile - Unpublish Featured Project | X     | X     |             |
Account - Manage Plan                       | X     | X     | X           |
Account - Manage Commercial Licenses        | X     | X     | X           |
Account - Manage Payment Methods            | X     | X     | X           |
Account - Update Billing Information        | X     | X     | X           |
Account - View/Pay Invoices                 | X     | X     | X           |

## User Handles {#user-handles}

Each user in your workspace has a handle. Workspace handles will be the same as the User Handle defined in a user's profile unless already taken or customized by a user.

Handles are used as part of the URL (in the format "handle-client-workspace.dev.8thwall.app") to preview new changes when developing with the 8th Wall Cloud Editor.

Example:  tony-default-mycompany.dev.8thwall.app

#### Important {#important}

* Before changing your handle, make sure all work in the Cloud Editor is saved.
* Any of your unlanded changes to projects in the workspace will be abandonded.
* Any clients you created in projects in the workspace will be deleted.

#### Modify User Handle {#modify-user-handle}

1. Select your workspace.
2. Click **Team** in the left navigation
3. Enter a new Handle.
4. Click &#10004; to save.
5. Confirm you

![Change Handle](/images/console-teams-handle.jpg)
