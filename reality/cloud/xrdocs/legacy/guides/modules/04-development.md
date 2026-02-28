# Module Development

## Creating a New Module {#creating-a-new-module}

Modules enable you to add modularized assets, files, and code and import them into your projects
with a versioning system. This allows you to focus your project code on key differentiators and
easily import common functionality via a module that you create.

To create a new module in your workspace:

1. From your Workspace Dashboard, click the "Modules" tab:

![ModulesTab](/images/modules-tab.jpg)

2. From the "Modules" tab on the Workspace Dashboard, click "Create new module"

![ModulesTab](/images/create-new-module.jpg)

You can also create a new module directly within the context of a project. Within your Cloud Editor
project, press the "+" button next to Modules. Then press "Create New Modules" and continue with the
instructions below.

3. Enter Basic info for the module: Please provide a Module ID (This ID appears in your workspace
url and can be used to reference your module in project code.), and Module Title. The Module Title
can be edited later in the Module Settings page.

4. Once you have created your module, you’ll be taken to the module.js file within the Cloud Editor.
From here you can begin developing your modules. More details on module development can be found in
the Developing your Module section.

## Developing a Module {#developing-a-module}

Module development is slightly different from project development. Modules cannot be run on their
own and can only be run after being imported into a project. Modules can be developed within a
module specific view of the Cloud Editor, or within the context of a project. **Modules are only
available to the workspace they are developed in.**

When developing a module within the module specific view you will not see a “Preview” button on the
top navigation of the Cloud Editor since modules can only be previewed when imported into a project.

The main components of a module include:

`manifest.json`

Within `manifest.json` you can create parameters that are editable via a visual configurator when
modules are imported into projects. Your `module.js` code can subscribe to the parameters you make
available in the module manifest to dynamically change based on user input when configuring the
module within the context of a project.

The module config builder automatically starts with one parameter group available. Parameter groups
can be used for logical divisions of parameters which are then expressed and grouped visually when
using your module in a project.

1. Rename a config group by double clicking the group title.
2. Add a new config group by pressing the "New Config Group" button.
3. Add a parameter to a config group by pressing "+ New parameter".

![ModulesConfigBuilder](/images/modules-config-builder.jpg)

4. When creating a new parameter you must give your parameter a name. This name could be used in
module and project code so it should not include spaces or special characters.
5. Select the type of parameter. Currently supported parameter types include
`String`, `Number`, `Boolean`, & `Resource`.
6. Once you have made your selections press "**Next**".

![ModulesParameterGroup](/images/modules-param-group.jpg)

**NOTE:** The order of config groups, and of parameters within these groups, dictates the order that
is displayed to users when using a module within a project. You can easily reorder parameters
within a group, as well as reorder config groups by dragging them in the order that you want. To
switch a parameter from one group to another group press the arrow icon on the parameter field and
select the group you want to move the parameter to from the dropdown.

## Module Parameter Types & Options {#module-parameter-types--options}

If you are creating a module manifest for your module you will be able to select from different
parameter types including `String`, `Number`, `Boolean`, & `Resource`. Details on each parameter
type:

#### String {#string}

String parameters have the following editable fields:

Parameter Fields | Type | Description
---- | ---- | -----------
Label (1) | `String` | A human readable name for your parameter that will be displayed in the configuration UI when the module is imported into a project. The default is dynamically generated based on the parameter name.
Default [Optional] (2) | `String` | The default string value if none is specified when the module is imported into a  project. The default is "".

![ModulesParameterString](/images/modules-param-string.jpg)

#### Number {#number}

Number parameters have the following editable fields:

Parameter Fields | Type | Description
---- | ---- | -----------
Label (1) | `String` | A human readable name for your parameter that will be displayed in the configuration UI when the module is imported into a project. The default is dynamically generated based on the parameter name.
Default [Optional] (2) | `Number` | The default number value if none is specified when the module is imported into a  project. The default is `null`.
Min [Optional] (3) | `Number` | The maximum number value a user can input  when the module is imported into a  project. The default is `null`.
Max [Optional] (4) | `Number` | The minimum  number value a user can input when the module is imported into a  project. The default is `null`.

![ModulesParameterNumber](/images/modules-param-number.jpg)

#### Boolean {#boolean}

Boolean parameters have the following editable fields:

Parameter Fields | Type | Description
---- | ---- | -----------
Label (1) | `String` | A human readable name for your parameter that will be displayed in the configuration UI when the module is imported into a project. The default is dynamically generated based on the parameter name.
Default [Optional] (2) | `Boolean` | The default boolean value if none is specified when the module is imported into a project. The default is `false`.
Label if True [Optional] (3) | `String` | The label for the true boolean option that will be displayed in the configuration UI when the module is imported into a project. The default is `true`.
Label if False [Optional] (4) | `String` | The label for the false boolean option that will be displayed in the configuration UI when the module is imported into a project. The default is `false`.

![ModulesParameterBoolean](/images/modules-param-boolean.jpg)

#### Resource {#resource}

Resource parameters have the following editable fields:

Parameter Fields | Type | Description
---- | ---- | -----------
Label (1) | `String` | A human readable name for your parameter that will be displayed in the configuration UI when the module is imported into a project. The default is dynamically generated based on the parameter name.
Allow None (2) | `Boolean` | Enables/disables the ability to explicitly set the resource to null from the configuration UI when the module is imported into the project. The default is `false`.
Allowed Asset Extensions [Optional] (3) | File Types | Enables the ability to upload specified file types via the displayed in the configuration UI when the module is imported into a project. The default is all file types.
Default Resource [Optional] (4) | File | The default resource if none is specified when the module is imported into a project. The default is `null`.

![ModulesParameterResource](/images/modules-param-resource.jpg)

`module.js`

`module.js` is the main entry point for your 8th Wall module. Code in `module.js` will execute
before the project is loaded. You can also add other files and assets and reference them within
`module.js`.

Modules can be very different depending on their purpose, and your development style. Typically
modules contain some of the following elements:

## Subscription to Module Configuration Values {#subscription-to-module-configuration-values}

```javascript
import {subscribe} from 'config'  // config is how you access your module options

subscribe((config) => {
  // Your code does something with the config here
})
```

## Export Properties that Are Referenced in Project Code {#export-properties-that-are-referenced-in-project-code}

```javascript
export {
  // Export properties here
}

```

`README.md`

You can include a readme in your module simply by creating a file named `README.md` in your module's
file directory. Just like project readme module readmes can be formatted using markdown and can
include assets like pictures and video.

**NOTE:** If your module has a readme it will automatically be packaged with the module when you
*deploy a version. This appropriate module readme will be shown in-context to the module depending
*on the version of the module being used in the project.

## Developing a Module Within the Context of a Project {#developing-a-module-within-the-context-of-a-project}

You can enable development mode within the context of a project on modules owned by your workspace
by toggling “Development Mode” (shown in red in the image below) on the module configuration page.
Once Development mode is enabled the modules underlying code and files will become visible in the
left side-pane.

When a module is in Development Mode within the context of a project you will see additional options
on the configuration page including: module client controls (in teal), a module deployment button
(in pink), and an "Edit mode" toggle to switch between editing the content of the visual
configuration page and using the configuration.

![ModulesDevelopmentMode](/images/modules-development-mode.jpg)

When you are developing modules within the context of a project and have changes to land you will
see a land flow that takes you through project and module changes. You can choose whether or not to
land specific changes. Any project or module that has changes that you are landing must have a
commit message added before you will be able to complete landing your code.

![ModulesReviewChanges](/images/modules-review-changes.jpg)

When you are developing modules within the context of a project and have changes you will also notice update to the Abandon & Revert changes options in the cloud editor. You can choose whether or not to Abandon/Revert only project changes or changes to both your project and any modules in development.

## Deploying a Module {#deploying-a-module}

#### Initial Module Deployment {#initial-module-deployment}

Deploying modules enables you to share stable versions, while allowing projects to subscribe to
module updates within a version family. This can allow you to push non-breaking module updates to
your projects automatically.

#### To deploy a module for the first time {#deploy-a-module-for-the-first-time}

1. If developing from the module specific view of the Cloud Editor, press the "Deploy" button in the upper right corner. If you are developing a module from within the context of a project, press the “Deploy” button on the upper right corner of the module configuration page.

![ModulesDeploy](/images/modules-deploy.jpg)

2. Validate your module title.
3. Select the desired commit for your module version.
4. Write out a description of the initial module functionality in the Release Notes section. This section accepts markdown formatting.
5. Click "Next".

![ModulesDeployInitialVersion](/images/modules-deploy-initial-version.jpg)

6. Optionally, add a module description and/or a cover image. The module description and cover image are shown in the module import flow when bringing a module into a project. Adding a description and cover image can help differentiate the module, and give other members of your workspace context about the module's use.
7. Click "Deploy".

![ModulesDeployInitialVersion2](/images/modules-deploy-initial-version2.jpg)

## Deploying Module Updates {#deploying-module-updates}

Deploying module updates is similar to deploying a module for the first time with two additional
deployment options.

1. **Version Type**: When deploying a module update you will be prompted to choose whether the update is a bug fix, new feature, or major release.
    * **Bug Fix**: Should be selected for refactored code & fixes for existing issues. Projects with modules subscribed to Bug Fixes or New Features will automatically receive an update when a new Bug Fix module version is available.
    * **New Features**: Should be selected when you've added additional non-breaking functionality to your module. Projects with modules subscribed to New Features will automatically receive an update when a new New Features module version is available.
    * **Major Release**: Should be selected for breaking changes. Projects with modules do not receive automatic updates for Major Releases.
2. **Set as Pre-Release**: After selecting a version type you can mark the version as a pre-release.
This will add a pre-release badge to notify other users that the module version is a pre-release, if
the version type is Bug Fixes or New Features projects will also not receive an automatic update
while a version is marked as a pre-release. To use a pre-release version within a module imported
into your project manually select the pre-release version from the version pinning target.

![ModulesDeployNewVersion](/images/modules-deploy-new-version.jpg)

## Edit Module Pre-Release {#edit-module-pre-release}

When there is a pre-release active, you can continue to update the pre-release version until you
either promote the pre-release, or abandon it.

**To edit a module pre-release**:

1. If developing from the module specific view of the Cloud Editor after previously setting a new
version as a pre-release, press the "Deploy" button in the upper right corner. If you are developing
a module from within the context of a project after previously setting a new version as a
pre-release, press the "Deploy" button on the upper right corner of the module configuration page.

![ModulesDeploy2](/images/modules-deploy.jpg)

2. Select a new commit for your pre-release or keep the current commit.
3. Change the description of the module version functionality in the Release Notes section. This section accepts markdown formatting.
4. Check the "Promote to Release" checkbox if you are ready to convert your pre-release to a standard release.
5. Press "Abandon Pre-Release" to delete the pre-release. This would typically be used to select a different version type from what the pre-release is currently set to (ex. Move from bug fixes to major release with breaking changes). Projects with modules currently pinned to the pre-release will continue to run with the pre-release version until they receive a subscribed update, or are manually changed.
6. The "Deploy" button makes your edited pre-release changes available (either updating the pre-release, or promoting to release if that checkbox is selected):

![ModulesEditPreReleaseDeploy](/images/modules-edit-pre-release.jpg)