---
sidebar_label: removeCameraPipelineModules()
---

# XR8.removeCameraPipelineModules()

`XR8.removeCameraPipelineModules([ moduleNames ])`

## Description {#description}

Supprimer les modules de canalisation des caméras multiples. Il s'agit d'une méthode de commodité qui appelle
[`XR8.removeCameraPipelineModule()`](removecamerapipelinemodule.md) dans l'ordre sur chaque élément du tableau d'entrée
.

## Paramètres {#parameters}

| Paramètres      | Type                  | Description                                                                                    |
| --------------- | --------------------- | ---------------------------------------------------------------------------------------------- |
| noms de modules | `[Chaîne] ou [Objet]` | Un tableau d'objets avec une propriété name, ou une chaîne de noms de modules. |

## Retourne {#returns}

Aucun

## Exemple {#example}

```javascript
XR8.removeCameraPipelineModules(['threejsrenderer', 'reality'])
```
