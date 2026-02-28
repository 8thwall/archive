---
id: project-structure
sidebar_position: 2
---

# Project Structure

![](/images/migration/studio-buildable-files.png)

### config

Contains the necessary webpack configuration and typescript definitions to support project development.

### external

Contains dependencies used by your project, loaded in `index.html`.

### image-targets

Contains your project's image targets (if any).

### src

Contains all your original project code and assets

:::info
For Studio projects, the scene graph is stored in a file called `.expanse.json` which may not be visible in your file viewer by default.
:::
