# XR8.HandController

## Description {#description}

`HandController` fournit la détection et le maillage des mains, ainsi que des interfaces pour configurer le suivi.

- `HandController` et `XrController` ne peuvent pas être utilisés en même temps.
- `HandController` et `LayersController` ne peuvent pas être utilisés en même temps.
- `HandController` et `FaceController` ne peuvent pas être utilisés en même temps.

## Fonctions {#functions}

| Fonction                                | Description                                                                                                                                                                                                                                                                       |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [configure](configure.md)               | Configure le traitement effectué par le HandController.                                                                                                                                                                                                           |
| [pipelineModule](pipelinemodule.md)     | Crée un module de pipeline de caméra qui, lorsqu'il est installé, reçoit des rappels sur le démarrage de la caméra, les événements d'essai de la caméra et d'autres changements d'état. Ils sont utilisés pour calculer la position de la caméra. |
| [AttachmentPoints](attachmentpoints.md) | Points sur la main auxquels vous pouvez ancrer du contenu.                                                                                                                                                                                                        |
