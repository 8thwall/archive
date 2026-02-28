# XR8.CanvasScreenshot

## Description {#description}

Fournit un module de pipeline de caméra qui peut générer des captures d'écran de la scène actuelle.

## Fonctions {#functions}

| Fonction                                         | Description                                                                                                                                                   |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [configurer](configure.md)                       | Configure le résultat attendu des captures d'écran du support.                                                                                                |
| [module pipeline](pipelinemodule.md)             | Crée un module de pipeline de caméra qui, lorsqu'il est installé, reçoit des rappels lorsque la caméra a démarré et lorsque la taille du support a changé.    |
| [setForegroundCanvas](setforegroundcanvas.md)    | Définit un support d'avant-plan à afficher au-dessus du support de la caméra. Les dimensions doivent être identiques à celles du support de l'appareil photo. |
| [prendre une capture d'écran](takescreenshot.md) | Renvoie une promesse qui, une fois résolue, fournit un tampon contenant l'image compressée JPEG. En cas de rejet, un message d'erreur est fourni.             |
