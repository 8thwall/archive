---
id: quickstart
sidebar_position: 2
---

# Quick Start

## Creating a Studio Project {#creating-a-studio-project}

1. To get started with a Studio project, click the **"Start a new Project"** button from the Workspace page.

![StartNewProject](/images/console-workspace-start-project.jpg)

2. If your workspace is on a `Pro plan`, you'll need to select a project type. Select **Studio**:

![StartNewProject](/images/studio/new-project-studio.png)

3. **Select a Template**: When you open the new project, you will be presented with a few Project
   Templates to help you get started, including gaming-oriented and AR-oriented templates. These
   project templates showcase different functionalities, and can be easily modified by swapping in your
   own assets. Create a project using one of the available templates or create a project from the Empty
   template.

![StudioTemplatePicker](/images/studio/studio-template-picker.png)

When your project has loaded everything it needs for you to begin, you can start creating.

## Navigating the Interface {#navigating-the-interface}

:::warning
**Limit your project to a single browser tab.** Having multiple tabs of the same project open simultaneously can cause
unexpected issues during the build process. To avoid potential problems, ensure only one tab of your project is active
at a time.
:::

Studio features a rich editor interface made up of a number of different tools and views, each of
which are essential when developing your project.

The sections below showcase the main Studio editor interface elements, with the fundamental features
highlighted.

![StudioInterface1](/images/studio/studio-navigate-interface.png)

![StudioInterface2](/images/studio/studio-navigate-editor.png)

### Hierarchy {#hierarchy}

View the entities and objects included in the space, and change their nesting. You can reparent or
unparent the object by clicking and dragging it to another position in the hierarchy. Right click to
duplicate or delete objects. Add new objects to your space. Search and filter for different objects.

![StudioHierarchy](/images/studio/studio-navigate-hierarchy.png)

### Assets {#assets}

Files & Assets can be managed from the lower left panel. Upload your own 3D models, 2D images, audio
files, custom scripts and more. Create folders and drag files to reorganize their placement. You can
also drag and drop an asset into the Viewport or the Hierarchy to add the entity into your scene. To
learn more about using and optimizing 3D Modules in GLB/GLTF format please see Your 3D Models on the
Web.

![StudioAssets](/images/studio/studio-navigate-assets.png)

### Viewport {#viewport}

Add, position, update, and work with objects and lighting in the space. Use the lower perspective
gizmo to change the view of the scene, change lighting and shadow visibility, and switch from
orthographic to perspective view. Use the top toolbar to change the position, rotation, or scale of
a selected object, or to undo and redo edits.

![StudioViewport](/images/studio/studio-navigate-viewport.png)

#### Viewport Navigation Shortcuts {#viewport-navigation-shortcuts}

| Función                  | Keyboard Shortcut                                       |
| ------------------------ | ------------------------------------------------------- |
| Camera Orbit             | ⌥ Left Click+Drag                                       |
| Camera Pan               | ⌥ Right Click+Drag, Right Click+Drag, Middle Click+Drag |
| Camera Zoom              | Scroll Wheel                                            |
| Focus on Selected Object | F                                                       |
| Translate                | W                                                       |
| Rotate                   | E                                                       |
| Scale                    | R                                                       |
| Hide/Show UI Layer       | ⌘\                                                     |
| Delete Object            | Delete                                                  |
| Duplicate                | ⌘D                                                      |
| Copy Object              | ⌘C                                                      |
| Paste Object             | ⌘V                                                      |
| Undo                     | ⌘Z                                                      |
| Redo                     | ⌘⇧Z, ⌘Y                                                 |

### Simulator & Preview Links {#simulator--preview-links}

#### Simulator {#simulator}

When you go to play your scene - it connects a Simulator instance. Your viewport will remotely
reflect the playback happening in the Simulator. You can see spawned or procedural objects that are
happening in playback in the space hierarchy. You can make edits to the entities in your space and
see those immediately reflected in the client view. In your Space settings, if you have Persist
Changes while in Play Mode turned on, those changes will persist after the play state is
disconnected. The currently connected client is indicated with the plug icon.

![Simulator1](/images/studio/studio-navigate-simulator1.png)

![Simulator2](/images/studio/studio-navigate-simulator2.png)

The Simulator also lets you test and view project changes across different device viewport sizes and
simulated real-world environments without needing to leave Studio. The Simulator works by running
the 8th Wall AR Engine in realtime on top of the included collection of pre-recorded AR sequences.
You may open as many Simulator instances as you want, allowing you to test project changes across a
diverse range of scenarios. The Simulator has a number of playback controls and convenience features
like:

- Play bar, scrubber and in/out handles: Allow you to set up loop points, giving you granular
  control over the selected sequence.
- Recenter button (lower right): Recenters the camera feed to its origin. NOTE: Recenter is also
  called each time the sequence loops and each time a new sequence is selected.
- Botón de actualización (parte superior derecha): Actualiza la página y conserva el contenido almacenado en caché. Holding SHIFT and
  clicking the refresh button will perform a full reload, ignoring any cached content.

#### Preview Links {#preview-links}

Instantly preview projects on mobile, desktop, or headset device or in another browser window as you
develop via link/QR code.

![SimulatorPreview](/images/studio/studio-navigate-preview-links.png)

#### Using Live Preview {#using-live-preview}

- At the top of the Cloud Editor window, click the Connect new device button.
- Scan the QR code with your mobile device to open a web browser and look at a live preview of the
  WebAR project. Or click on the QR code to open a new tab in your current browser
- When the page loads, if your project uses Web AR, you'll be prompted for access to motion and
  orientation sensors (on some devices) and the camera (all devices). Click Allow for all permission
  prompts. You will be taken to the private development URL for the project.
- Note: The "Preview" QR code displayed within the Cloud Editor is a temporary, one-time use QR code
  only meant for use by the developer while actively working in the Cloud Editor. This QR code takes
  you to a private, development URL, and isn't accessible by others. To share your work with others,
  please see the section below on Publishing your project.
- Click the headset icon to generate a link for a headset device.

:::tip
Testing your project on multiple devices ensures that users will see a consistent experience across
a variety of screen sizes and platforms.
:::

### Launch Toolbar {#launch-toolbar}

Studio will automatically save your progress as you work on a project, however, key stages in
development can be marked by manually building your project, landing your changes as commits, and
publishing your project.

![StudioLaunchToolbar](/images/studio/studio-navigate-launch-toolbar.png)

**Build**: Click Build to save your work and initiate a new cloud build of your project.

**Land or Sync**: Once satisfied with your changes, land the updated code into Studio's integrated
source control. At the top-right of the Studio window, click Land. The button will be green,
indicating that there are changes in your project that have not yet been landed into source control.
"Sync" indicates that your project is not up to date with the latest landed changes in source
control (example: another team member has landed project changes into the source control).

<!-- ![StudioLand](/images/studio/TODO.png) -->

**Publish**: The final step is to publish your updated and landed project code using 8th Wall's
Built-in Hosting. Public allows the project to be viewed publicly by anyone on the internet. Staging
allows those with a passcode to view your project.

![StudioPublish](/images/studio/studio-navigate-publish.png)

Once you are ready to publish your project you will need a description and cover image. To learn
more about the Publishing Flow and Featuring a Project for public viewing please see the
[Publishing Section in the general 8th Wall Documentation](https://www.8thwall.com/docs/getting-started/quick-start-guide/#publish-your-project).

### Inspector & Space Settings {#inspector--space-settings}

View and configure object-specific components, as well as adjust overall settings for the editor.

#### General Settings {#general-settings}

When no object is selected you will see general settings for your project.

![StudioGeneralSettings](/images/studio/studio-navigate-general-settings.png)

#### Space Settings {#space-settings}

Style your Space’s Skybox. Skyboxes are a wrapper around your entire scene that shows what the world
looks like beyond your geometry. If your project is configured to use AR on an AR-compatible device,
(see [XR](/studio/guides/xr/world/)) the Skybox will not be rendered.

#### Source Control {#source-control}

Manage different versions of your project and change history. Creating a new client creates a new
version of your project which can be helpful for testing changes without affecting your main
version. You can also access a history of the project’s previous Landed changes by selecting the
Project History function.

#### Inputs {#inputs}

Use the Input Manager to set up experiences that work across different devices inputs like
keyboards, gamepad controls, trackpads, and touch screen actions. Create your event action and set
up a mapping (or binding) to different inputs. [Learn more the Input system](/studio/guides/input)

#### Code Editor {#code-editor}

Choose from different usability settings like light/dark modes, keybindings, and code save settings.

#### Play Mode {#play-mode}

If you have the Live Sync setting turned on, changes you make in the Editor will persist after the
Simulator or Live Preview is disconnected. With this setting turned off, you can make edits in the
Editor and see those edits reflected in the Simulator but those edits will not be saved once the
Simulator is disconnected. For more information on the Simulator see the
[Simulator](/studio/getting-started/quickstart#simulator--preview-links) section. Persist Changes is on
by default.

#### Inspector {#inspector}

Inspect and configure an entity and its components. Learn more about entities and components in
[Key Concepts](/studio/essentials/entities-and-components/).

By default every entity displays a Transform component in the Inspector. Different types of entities
may display different components, for example a Primitive will display a Mesh component with
configurable options like geometry shape settings, materials, textures, etc.

#### Adding a Component {#adding-a-component}

You can add a component using the "+ New Component" button. There are several types of built-in
components in Studio, including Physics, Lighting, Audio, Animations, and more. Custom components
can also be added - [Learn more about Custom Components](/studio/essentials/entities-and-components/components/). Once set up, your custom component
will
appear in the Custom category. Click the three dots to remove a component.

![StudioNewComponent](/images/studio/studio-navigate-adding-a-component.png)

### Console {#console}

Debug your project build actions and runtime. Debug Mode is an advanced Studio feature that provides
logging, performance information, and enhanced visualizations directly on your device.

![StudioConsole](/images/studio/studio-navigate-console.png)

### Code Editor {#code-editor-1}

The 8th Wall Code Editor equips developers with a set of coding tools to create, collaborate and
publish web-based XR content. Our powerful IDE includes the code editor, integrated source control,
commit history, live preview, wireless remote debugging and push-button hosting on a global CDN.
Other Code Editor features include:

- Intellisense
- Command Palette
- Code Peek
- Light/Dark Themes

![StudioEditor](/images/studio/studio-navigate-editor.png)

### Modules {#modules}

8th Wall Modules es una potente función de 8th Wall diseñada para aumentar drásticamente la eficacia del
desarrollo de proyectos. los módulos de 8th Wall le permiten guardar y reutilizar componentes (código, activos, archivos)
dentro de su espacio de trabajo y también encontrar e importar módulos creados por 8th Wall en su proyecto.

[Learn more about 8th Wall Modules](https://www.8thwall.com/docs/guides/modules/overview/).

#### Landing Page Module {#landing-page-module}

Next to the Files Browser you will see a tab called Modules. Each of the sample projects including
the basic Empty project come with the "Landing Page" module. To learn more about Modules in general
see our [8th Wall Modules overview](https://www.8thwall.com/docs/guides/modules/overview/).

![StudioLandingPageModule](/images/studio/studio-navigate-landing-page.png)

Landing Pages are customizable with the Module configurator. All Landing Page templates are
optimized for branding and education with various layouts, an improved QR code design and support
for key media.

Las páginas de aterrizaje garantizan que sus usuarios tengan una experiencia significativa, independientemente del dispositivo en el que se encuentren.
They appear on devices that are not allowed or capable of accessing the Web AR experience directly.

Landing Pages intelligently adapt to your configuration. For example:

![StudioLandingPageModuleExamples](/images/studio/studio-navigate-landing-page2.png)

:::tip
We recommend all projects use the Landing Page Module to ensure a consistent experience across
devices.
:::
