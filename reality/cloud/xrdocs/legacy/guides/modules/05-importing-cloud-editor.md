# Importing Modules

## Importing Modules into a Cloud Editor Project {#importing-modules-into-a-cloud-editor-project}

Modules enable you to add reusable components to your project, allowing you to focus on the development of your core experience. The 8th Wall Cloud Editor allows you to import modules you own, or modules published by 8th Wall directly into your projects.

**To import a module into a Cloud Editor project**:

1. Within the Cloud Editor, press the "+" button next to Modules.

![modules-step1-add-module](/images/modules-step1-add-module.png)

2. Select the module that you want to import from the list. Only modules that are 8th Wall hosted project compatible will be available to import. (Learn more about [Module Compatibility](/legacy/guides/modules/compatibility/))

![modules-step2-select-template](/images/modules-step2-select-template.png)

3. Press "Import" to add your module to your project. Take note of the module alias. If you already
have a module in your project with the same alias, you may need to rename your module.

![modules-step3-press-import](/images/modules-step3-press-import.png)

4. The module is now visible in your project listed under the "Modules" section.

![modules-step4-press-import](/images/modules-added-to-project.jpg)

5. If you select the imported module, you will be taken to the module config page. This page can be used to configure various module parameters.

![modules-step5-press-import](/images/modules-config-page.jpg)

Once you have added a module to your project you may have to make changes to your code to fully integrate the module. Modules with readmes contain documentation that should be referenced to understand how to integrate the specific module into your project code.

## Importing Modules into a Self-Hosted Project {#importing-modules-into-a-self-hosted-project}

Modules enable you to add reusable components to your project, allowing you to focus on the
development of your core experience. You can import modules you own, or modules published by 8th
Wall directly into your self-hosted projects.

**To import a module into your Self-Hosted project**:

1. Within the Cloud Editor, open your Self-Hosted project and press the Module icon in the left
navigation:

![Modules-left-nav](/images/modules-icon-left-nav.jpg)

2. Press "+" or "Import Module" to add an available module to your project.

3. Press "Public Modules" to import a module created by 8th Wall, or "My Modules" to import a module
created by a member of your workspace. Only modules that are Self-Hosted project compatible will be
available to import. (Learn more about [Module Compatibility](/legacy/guides/modules/compatibility/))

4. Select the module that you want to import from the list.

5. Press "Import" to add your module to your project. Take note of the module alias. If you already
have a module in your project with the same alias, you may need to rename your module.

6. You can add up to 10 modules to your Self-Hosted project. These modules will be visible as tabs
on the Project Modules page of the 8th Wall Cloud Editor.

![self-hosted-project-modules](/images/self-hosted-project-modules.jpg)

7. If you select the imported module, the module configuration details will be displayed. This can
be used to  configure various module parameters.

![self-hosted-project-module-details](/images/self-hosted-project-module-details.jpg)

8. If you import a module that your team created you will see multiple pinning target options
including "Version" (only if the module has been deployed at least once), and "Commit" (allows you
to pin the module to any commit of the module code). If you select a "Version" pinning target you
can subscribe your imported module to bug fix updates, new feature updates, or disable automatic
module updates.

![self-hosted-project-module-pinning-target](/images/self-hosted-project-module-pinning-target.jpg)

9. Once you have added a module to your project press "Copy Code" and paste the contents of your
clipboard into the `head.html` file of your project. This snippet enables modules to be loaded into
your Self-Hosted project with the module config settings you have specified. You will have to
re-copy the code snippet and update the `head.html` of your project whenever you make a change to
the module config settings.

![self-hosted-project-module-copy-code](/images/self-hosted-project-module-copy-code.jpg)

10. You may have to make changes to your code to fully integrate the module.
