---
id: introduction
description: This section explains how to use the 8th Wall Desktop App.
sidebar_position: 2
---

# Using the 8th Wall App

:::info[Public Beta]
The **8th Wall desktop app is in Public Beta** and functionality may change in a future release. Your feedback is appreciated and we have a [dedicated support forum for the desktop app beta users](https://forum.8thwall.com/c/desktop-beta/17)–please report any issues you encounter or suggestions here.
:::

After initial login to 8th Wall via the desktop app, you will see existing projects you’ve created in the hub view. If you are a member of multiple workspaces you can switch the workspace using the drop down in top left of the hub. To create a new Project, click the **New Project** button at the top right of the hub.

![](/images/studio/app/hub.jpg)

## Projects

In the Studio hub view, you can move, delete, and find projects using the Project Actions menu `(...)`:  
- **Reveal in finder**: opens your local file browser to project’s location  
- **Remove from disk**: deletes your project’s local files (the project will remain available on web as of its last cloud build)  
- **Change disk location**: opens your file browser to select a new folder location for your project to move to  
- **Project settings**: opens your project settings on the web for actions like renaming the project, creating a description or changing the cover image, and more.  

![](/images/studio/app/project-actions.jpg)

## Project Structure

When you create or open a project for the first time, a local version of the project is added on your machine within `~/Documents/8th Wall/`. By default, the 8th Wall folder is created within your Documents folder, but you can change this by moving the 8th Wall folder to another location if preferred.

The folder created for your project will include certain files and folders by default. The `src` folder mirrors the Project file directory you see in Studio. This folder is a directory within your project's file structure where you store files like component scripts, as well as assets like images, fonts, sounds, or other media that your project needs.

![](/images/studio/app/project-directories.jpg)

:::info
Do not attempt to copy these files to another server, your project will not run as expected. To publish and share your experience, you must use 8th Wall’s build and hosting process.
:::

The desktop app listens for changes to your local directory in real time. For example, if you use VSCode to update a project’s `component.ts` file, as soon as you save the file, you should see the updated file appear in Studio.

Similarly, you can work within 3D modeling tools like Blender and Maya and save asset changes directly to your 8th Wall project. This enables you to work across different programs and create a single streamlined pipeline, so your workflow stays intact from start to finish.

![](/images/studio/app/blender-to-studio.gif)

## Source Control

There are some important differences to note when using the desktop version of Studio versus the web version.

First, you will not see a **Build** button on the top right nav bar like you see in Studio on web. This is because Studio on desktop automatically saves changes as you go and does not need to use cloud servers to compile your changes and rebuild your project.  

When you want to sync your project changes to the cloud, you can access the **Cloud Build** function in the Project Settings under **Source Control**. For example, you may want to switch to the web version of Studio to continue working. You can select the Cloud Build button to sync your latest changes, and then find those changes on the web version of Studio. Learn more about Source Control functionality [here](/studio/getting-started/build-land/).  

![](/images/studio/app/source-control.jpg)
