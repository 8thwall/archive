---
id: materials
description: Cette section explique comment utiliser les matériaux dans Studio.
---

# Matériaux

## Introduction

Cette section explique comment utiliser les matériaux dans Studio.

## Types de matériaux

### Matériau

Un matériau standard [PBR](https://learn.microsoft.com/en-us/azure/remote-rendering/overview/features/pbr-materials).

### Non éclairéMatériel

Le matériau n'est pas affecté par l'éclairage ou les ombres.

### Matériau d'ombre

Matériau qui ne réagit qu'aux ombres.

### HiderMaterial

Matériau spécialisé qui cache les objets situés derrière lui.

## Propriétés des matériaux

Les matériaux peuvent être configurés soit par le biais du code, soit directement dans le composant Mesh de l'éditeur.

Voir les propriétés [ici](/api/studio/ecs/material/basic-material).

## Exemple

L'exemple suivant montre comment définir un matériau sur une entité au moment de l'exécution.

```ts
// Réglage du matériau standard
ecs.Material.set(world, component.eid, {r : 255, g : 0, b : 100, roughness : 1})

// Réglage du matériau de l'ombre
ecs.ShadowMaterial.set(world, component.eid, {r: 255, g: 0, b: 100})
```
