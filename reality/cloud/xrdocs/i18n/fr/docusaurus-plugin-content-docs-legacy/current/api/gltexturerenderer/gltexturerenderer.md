# XR8.GlTextureRenderer

## Description {#description}

Fournit un module de pipeline de caméra qui dessine le flux de la caméra sur un canevas ainsi que des utilitaires supplémentaires pour les opérations de dessin GL.

## Fonctions {#functions}

| Fonction                                                        | Description                                                                                                                                                                                                                                                                |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [configure](configure.md)                                       | Configure le module de pipeline qui dessine le flux de la caméra sur le canevas.                                                                                                                                                                           |
| [create](create.md)                                             | Crée un objet pour le rendu d'une texture vers un canevas ou une autre texture.                                                                                                                                                                            |
| [fillTextureViewport](filltextureviewport.md)                   | Méthode pratique pour obtenir une structure Viewport qui remplit une texture ou un canevas à partir d'une source sans distorsion. Il est transmis à la méthode de rendu de l'objet créé par [`XR8.GlTextureRenderer.create()`](create.md). |
| [getGLctxParameters](getglctxparameters.md)                     | Récupère l'ensemble actuel des liaisons WebGL afin de pouvoir les restaurer ultérieurement.                                                                                                                                                                |
| [pipelineModule](pipelinemodule.md)                             | Crée un module de pipeline qui dessine le flux de la caméra sur le canevas.                                                                                                                                                                                |
| [setGLctxParameters](setglctxparameters.md)                     | Restaure les bindings WebGL qui ont été sauvegardés avec [`XR8.GlTextureRenderer.getGLctxParameters()`](getglctxparameters.md).                                                                                                                            |
| [setTextureProvider](settextureprovider.md)                     | Définit un fournisseur qui transmet la texture à dessiner.                                                                                                                                                                                                 |
| [setForegroundTextureProvider](setforegroundtextureprovider.md) | Définit un fournisseur qui transmet une liste de textures de premier plan et de masques alpha à dessiner.                                                                                                                                                  |
