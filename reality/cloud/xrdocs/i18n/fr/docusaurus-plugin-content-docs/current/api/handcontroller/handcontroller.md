# XR8.HandController

## Description {#description}

`HandController` assure la détection et le maillage des mains, ainsi que les interfaces de configuration du suivi.

- Le `HandController` et le `XrController` ne peuvent pas être utilisés en même temps.
- Le `HandController` et le `LayersController` ne peuvent pas être utilisés en même temps.
- Le `HandController` et le `FaceController` ne peuvent pas être utilisés en même temps.

## Fonctions {#functions}

| Fonction                                    | Description                                                                                                                                                                                                                                       |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [configurer](configure.md)                  | Configure le traitement effectué par le HandController.                                                                                                                                                                                           |
| [module pipeline](pipelinemodule.md)        | Crée un module de pipeline de caméra qui, lorsqu'il est installé, reçoit des rappels sur le démarrage de la caméra, les événements d'essai de la caméra et d'autres changements d'état. Ils sont utilisés pour calculer la position de la caméra. |
| [Points d'attachement](attachmentpoints.md) | Points sur la main auxquels vous pouvez ancrer du contenu.                                                                                                                                                                                        |
