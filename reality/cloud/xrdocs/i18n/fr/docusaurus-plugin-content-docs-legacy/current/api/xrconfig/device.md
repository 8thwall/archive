---
sidebar_label: dispositif()
---

# XR8.XrConfig.device()

Enumération

## Description {#description}

Spécifier la classe des appareils sur lesquels le pipeline doit fonctionner. Si l'appareil actuel ne fait pas partie de cette classe, l'exécution échouera avant l'ouverture de la caméra. Si allowedDevices est `XR8.XrConfig.device().ANY`, la caméra est toujours ouverte.

Note : Les effets de monde (SLAM) ne peuvent être utilisés qu'avec `XR8.XrConfig.device().MOBILE_AND_HEADSETS` ou `XR8.XrConfig.device().MOBILE`.

## Propriétés {#properties}

| Propriété                                                   | Valeur                       | Description                                                                                                                                                                                                                                                                                                                            |
| ----------------------------------------------------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MOBILE                                                      | `'mobile'`                   | Restreindre le pipeline de caméras sur les appareils mobiles, par exemple les téléphones et les tablettes.                                                                                                                                                                                                             |
| MOBILE_ET_CASQUES | `'mobile-and-headsets'` \\` | Restreindre le pipeline de la caméra sur les appareils mobiles et les casques d'écoute.                                                                                                                                                                                                                                |
| ANY                                                         | `'any'`                      | Lancer le pipeline de caméras sans vérifier les capacités de l'appareil. Cette opération peut échouer à un moment donné du démarrage du pipeline si un capteur requis n'est pas disponible au moment de l'exécution (par exemple, un ordinateur portable n'a pas d'appareil photo). |
