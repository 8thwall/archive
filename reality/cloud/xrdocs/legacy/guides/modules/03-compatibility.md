# Module Compatibility {#module-compatibility}

8th Wall Modules may be made available for only 8th Wall hosted projects, only Self-Hosted projects,
or both 8th Wall hosted & Self-Hosted projects. By default modules are available for both 8th Wall
hosted & Self-Hosted projects. This can be changed in the settings page for the module.

![module-compatibility-settings](/images/modules-compatibility-settings.jpg)

Modules must be properly coded to work in both 8th Wall hosted and Self-Hosted projects. In
particular assets referenced from within modules must be loaded as cross-origin enabled so that they
can load into Self-Hosted domains. For example, explicitly setting the crossorigin attribute on
media:

![module-example-cors](/images/modules-example-cors.jpg)

Or pre-loading a web worker blob using fetch before invoking the web worker:

![module-example-webworker](/images/modules-example-webworker.jpg)