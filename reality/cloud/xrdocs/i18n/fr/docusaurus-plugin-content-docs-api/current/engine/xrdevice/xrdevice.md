# XR8.XrDevice

## Description {#description}

Fournit des informations sur la compatibilité et les caractéristiques des appareils.

## Propriétés {#properties}

| Propriété                                           | Type | Description                                                                                                                   |
| --------------------------------------------------- | ---- | ----------------------------------------------------------------------------------------------------------------------------- |
| [IncompatibilityReasons](incompatibilityreasons.md) | Enum | Les raisons possibles pour lesquelles un appareil et un navigateur ne sont pas compatibles avec 8th Wall Web. |

## Fonctions {#functions}

| Fonction                                                  | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [deviceEstimate](deviceestimate.md)                       | Renvoie une estimation de l'appareil de l'utilisateur (par exemple, marque / modèle) en fonction de la chaîne de l'agent utilisateur et d'autres facteurs. Ces informations ne sont qu'une estimation et ne doivent pas être considérées comme complètes ou fiables.                                                                                                                                                                            |
| [incompatibleReasons](incompatiblereasons.md)             | Renvoie un tableau de [`XR8.XrDevice.IncompatibilityReasons`](incompatibilityreasons.md) expliquant pourquoi le périphérique, le périphérique et le navigateur ne sont pas supportés. Elle ne contiendra des entrées que si [`XR8.XrDevice.isDeviceBrowserCompatible()`](isdevicebrowsercompatible.md) renvoie la valeur false.                                                                                                                                    |
| [incompatibleReasonDetails](incompatiblereasondetails.md) | Renvoie des détails supplémentaires sur les raisons pour lesquelles l'appareil et le navigateur sont incompatibles. Ces informations ne doivent être utilisées qu'à titre indicatif pour faciliter la gestion des erreurs. Ils ne doivent pas être considérés comme complets ou fiables. Elle ne contiendra des entrées que si [`XR8.XrDevice.isDeviceBrowserCompatible()`](isdevicebrowsercompatible.md) renvoie la valeur false. |
| [isDeviceBrowserCompatible](isdevicebrowsercompatible.md) | Renvoie une estimation de la compatibilité de l'appareil et du navigateur de l'utilisateur avec 8th Wall Web. Si le résultat est faux, [`XR8.XrDevice.incompatibleReasons()`](incompatiblereasons.md) renverra les raisons pour lesquelles le périphérique et le navigateur ne sont pas pris en charge.                                                                                                                                                            |
