---
sidebar_label: device()
---

# XR8.XrConfig.device()

Enumération

## Description {#description}

Spécifiez la classe d'appareils sur lesquels le pipeline doit fonctionner. Si l'appareil actuel ne fait pas partie de cette classe, l'exécution échouera avant l'ouverture de la caméra. Si allowedDevices est `XR8.XrConfig.device().ANY`, ouvrez toujours la caméra.

Remarque : les effets de monde (SLAM) ne peuvent être utilisés qu'avec `XR8.XrConfig.device().MOBILE_AND_HEADSETS` ou `XR8.XrConfig.device().MOBILE`.

## Propriétés {#properties}

| Propriété           | Valeur                | Description                                                                                                                                                                                                                                                                                     |
| ------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MOBILE              | `'mobile'`            | Restreindre le passage des caméras sur les appareils mobiles, par exemple les téléphones et les tablettes.                                                                                                                                                                                      |
| MOBILE_ET_CASQUES | `'mobile-et-casques'` | Restreindre le pipeline de la caméra sur les appareils mobiles et les casques d'écoute.                                                                                                                                                                                                         |
| ANY                 | `n'importe lequel`    | Lancez l'exécution du pipeline de caméras sans vérifier les capacités de l'appareil. Cette opération peut échouer à un moment donné du démarrage du pipeline si un capteur requis n'est pas disponible au moment de l'exécution (par exemple, un ordinateur portable n'a pas d'appareil photo). |
