---
id: materials
description: En esta sección se explica cómo utilizar los materiales en Studio.
---

# Materiales

## Introducción

En esta sección se explica cómo utilizar los materiales en Studio.

## Tipos de material

### Material

Un material estándar [PBR](https://learn.microsoft.com/en-us/azure/remote-rendering/overview/features/pbr-materials).

### UnlitMaterial

El material no se ve afectado por la iluminación ni las sombras.

### ShadowMaterial

Material que sólo responde a las sombras.

### HiderMaterial

Material especial que oculta cualquier objeto que se encuentre detrás de él.

## Propiedades de los materiales

Los materiales pueden configurarse mediante código o directamente en el componente Malla del editor.

Ver propiedades [aquí](/api/studio/ecs/material/basic-material).

## Ejemplo

El siguiente ejemplo muestra cómo establecer un Material en una entidad en tiempo de ejecución.

```ts
// Establecer el material estándar
ecs.Material.set(world, component.eid, {r: 255, g: 0, b: 100, roughness: 1})

// Establecer el material de sombra
ecs.ShadowMaterial.set(world, component.eid, {r: 255, g: 0, b: 100})
```
