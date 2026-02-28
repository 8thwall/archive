---
sidebar_label: deviceEstimate()
---

# XR8.XrDevice.deviceEstimate()

`XR8.XrDevice.deviceEstimate()`

## Description {#description}

Renvoie une estimation de l'appareil de l'utilisateur (par exemple, marque / modèle) en fonction de la chaîne de l'agent utilisateur et d'autres facteurs. Ces informations ne sont qu'une estimation et ne doivent pas être considérées comme complètes ou fiables.

## Paramètres {#parameters}

Aucun

## Retours {#returns}

Un objet : `{ locale, os, osVersion, manufacturer, model }`

| Propriété | Description                                      |
| --------- | ------------------------------------------------ |
| lieu      | Le lieu de travail de l'utilisateur.             |
| os        | Le système d'exploitation de l'appareil.         |
| osVersion | Version du système d'exploitation de l'appareil. |
| fabricant | Le fabricant de l'appareil.                      |
| modèle    | Le modèle de l'appareil.                         |
