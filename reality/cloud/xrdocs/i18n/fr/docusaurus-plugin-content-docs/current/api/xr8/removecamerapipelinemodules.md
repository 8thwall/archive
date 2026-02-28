---
sidebar_label: removeCameraPipelineModules()
---

# XR8.removeCameraPipelineModules()

`XR8.removeCameraPipelineModules([ moduleNames ])`

## Description {#description}

Supprimez les modules de pipeline des caméras multiples. Il s'agit d'une méthode pratique qui appelle [`XR8.removeCameraPipelineModule()`](removecamerapipelinemodule.md) dans l'ordre pour chaque élément du tableau d'entrée .

## Paramètres {#parameters}

| Paramètres      | Type                   | Description                                                                    |
| --------------- | ---------------------- | ------------------------------------------------------------------------------ |
| noms de modules | `[String] or [Object]` | Un tableau d'objets avec une propriété name, ou une chaîne de noms de modules. |

## Retours {#returns}

Aucun

## Exemple {#example}

```javascript
XR8.removeCameraPipelineModules(['threejsrenderer', 'reality'])
```
