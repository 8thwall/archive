---
id: materials
description: >-
  In diesem Abschnitt wird erklärt, wie Sie Materialien in Studio verwenden
  können.
---

# Materialien

## Einführung

In diesem Abschnitt wird erklärt, wie Sie Materialien in Studio verwenden können.

## Materialtypen

### Material

Ein Standard-[PBR]-Material (https://learn.microsoft.com/en-us/azure/remote-rendering/overview/features/pbr-materials).

### UnbeleuchtetMaterial

Material unbeeinflusst von Licht und Schatten.

### SchattenMaterial

Material, das nur auf Schatten reagiert.

### HiderMaterial

Spezielles Material, das alle Objekte hinter sich verbirgt.

## Materialeigenschaften

Materialien können entweder durch Code oder direkt in der Mesh-Komponente im Editor konfiguriert werden.

Eigenschaften anzeigen [hier](/api/studio/ecs/material/basic-material).

## Beispiel

Das folgende Beispiel zeigt, wie man ein Material auf eine Entität zur Laufzeit setzt.

```ts
// Einstellung des Standardmaterials
ecs.Material.set(world, component.eid, {r: 255, g: 0, b: 100, roughness: 1})

// Einstellung des Schattenmaterials
ecs.ShadowMaterial.set(world, component.eid, {r: 255, g: 0, b: 100})
```
