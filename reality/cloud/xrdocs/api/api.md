---
slug: '/'
sidebar_label: API Introduction
sidebar_position: 1
description: This section provides a detailed look at the APIs available for building immersive WebAR experiences with 8th Wall Studio.
---

# API Introduction

This section provides a detailed look at the APIs available for building immersive WebAR experiences with 8th Wall Studio.

The 8th Wall API reference is organized into two main groups:

## Studio API

The Studio API provides everything you need to build structured, dynamic experiences in Studio.

The Studio API includes:

- [**Entity-Component System (ECS)**](/api/studio/ecs) — APIs for working with Studio’s ECS architecture, allowing you to create, modify, and organize entities and components at runtime.
- [**World**](/api/studio/world) — Core functions and utilities for managing the overall scene graph, including entity hierarchies, transforms, and spaces. The world is the container for all spaces, entities, queries, and observers in your project.
- [**Events**](/api/studio/events) — A rich system for sending and responding to runtime events within Studio.

Use the Studio API to create immersive, stateful experiences that respond to player input, world changes, and real-time interactions.

[Explore the Studio API →](/api/studio)


## Engine API

The Engine API provides lower-level access to 8th Wall’s underlying AR engine, including:

- **8th Wall Camera Pipeline Modules** — Camera pipeline modules developed by 8th Wall.
- **Custom Camera Pipeline Modules** — Interface for working with the camera frame processing pipeline.

Use the Engine API when you need fine-grained control over camera input, frame processing, or when integrating custom WebGL or computer vision workflows into your project.

[Explore the Engine API →](/api/engine)

---

## Choosing the Right API

- **Building in 8th Wall Studio?** → Start with the **Studio API** to work within Studio's structured development environment.
  
- **Working at the engine level or extending functionality?** → Dive into the **Engine API** for camera access and low-level AR features.

:::note
**Studio experiences can use custom camera pipeline modules for advanced control, but the Studio API and Engine API serve different purposes: Studio handles world-building and interaction, while Engine manages low-level camera and frame processing.**
:::
