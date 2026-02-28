---
id: creating-backend-functions
sidebar_position: 1
---

# Creating Backend Functions

:::info
Backend Functions run within the context of 8th Wall's Module System. For full Module documentation
please [see here](https://www.8thwall.com/docs/guides/modules/overview/).  This section of the
documentation will focus specifically on the Backend Function functionality provided by the module
system.
:::

Modules can be created from the Workspace page (Modules Tab) or directly within a Studio project. To
create a Module with a Backend Function directly in Studio, please follow these steps:

1. In the Studio Editor, select the Modulese tab in the left panel and click "+ New Module"

![CreateNewModule](/images/studio/bfn-new-module.png)

2. Select the "Create New Module" tab and give your new module a Module ID.  This value will be used
to later reference your module in project code.  It cannot be changed after creation.

![ModuleId](/images/studio/bfn-module-id.png)

3. Add a backend to the module: File explorer -> select the Modules tab -> right click on Backends ->
select New Backend config.

![NewBackendFunction](/images/studio/bfn-new-backend-config.png)

4. In the New Backend wizard, select the desired type of backend (Function, in this case), give it a
Title and Description. The file-name of the backend will be automatically generated based on Title
and is how you will reference the backend within module code.

![NewBackend](/images/studio/bfn-new-backend.png)

5. Set an Entry Path for your backend code.  This is the file where your backend code entry point
will live.

![BackendFunctionEntryPath](/images/studio/bfn-entry-path.png)

6. Create a file with the same path/name as defined in the Entry Path step above.  Right-click Files -> New File -> Empty File:

![BackendFunctionEmptyFile](/images/studio/bfn-create-empty-file.png)

Type or paste in the name that matches your Entry Path:

![BackendFunctionEmptyFileName](/images/studio/bfn-create-empty-file-name.png)

Result:

![BackendFunctionEmptyFileNameResult](/images/studio/bfn-create-empty-file-result.png)

:::info
The backend function must export an **async method** called `handler`.  Please refer to the [Writing Backend Code](/studio/guides/modules/backend-services/backend-functions/writing-backend-code/) documentation for more details.
:::

Example:

```javascript
const handler = async (event: any) => {
  // Custom backend code goes here

  return {
    body: JSON.stringify({
      myResponse,
    }),
  }
}

export {
  handler,
}
```
