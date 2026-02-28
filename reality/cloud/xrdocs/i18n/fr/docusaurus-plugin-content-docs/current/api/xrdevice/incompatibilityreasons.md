---
sidebar_label: IncompatibilityReasons
---

# XR8.XrDevice.IncompatibilityReasons

Enumération

## Description {#description}

Les raisons possibles pour lesquelles un appareil et un navigateur ne sont pas compatibles avec 8th Wall Web.

## Propriétés {#properties}

| Propriété                            | Valeur | Description                                                                      |
| ------------------------------------ | ------ | -------------------------------------------------------------------------------- |
| NON SUGGÉRÉ                          | `0`    | La raison de l'incompatibilité n'est pas spécifiée.                              |
| UNSUPPORTED_OS                       | `1`    | Le système d'exploitation estimé n'est pas pris en charge.                       |
| NAVIGATEUR NON PRIS EN CHARGE        | `2`    | Le navigateur estimé n'est pas pris en charge.                                   |
| ORIENTATION_DU_DISPOSITIF_MANQUANT | `3`    | Le navigateur ne prend pas en charge les événements d'orientation de l'appareil. |
| MISSING_USER_MEDIA                 | `4`    | Le navigateur ne prend pas en charge l'accès aux médias par l'utilisateur.       |
| ASSEMBLAGE_WEB_MANQUANT            | `5`    | Le navigateur ne prend pas en charge l'assemblage web.                           |
