---
id: debug-mode
---

# Mode débogage

Le mode débogage est une fonction avancée de l'éditeur de nuages qui fournit des journaux, des informations sur les performances et des visualisations améliorées sur
directement sur votre appareil.

Remarque : le mode débogage n'est actuellement pas affiché lors de la prévisualisation d'expériences sur des appareils montés sur la tête.

#### Pour activer le mode débogage {#to-activate-debug-mode}

1. En haut de la fenêtre de l'éditeur de nuages, cliquez sur le bouton **Examen**.
2. Sous le code QR, activez le **Mode débogage**.
3. Scannez le code QR pour prévisualiser votre projet WebAR avec des informations de débogage en surimpression sur la page :

![debug1](/images/debug-mode-preview.jpg)

Si un appareil est déjà connecté dans la console de l'éditeur de cloud, vous pouvez activer/désactiver le mode de débogage
à tout moment en appuyant sur le bouton "Mode de débogage" lorsque vous avez sélectionné l'onglet de l'appareil.

![debug2](/images/debug-mode-console.jpg)

Mode débogage Stats :

En fonction du moteur de rendu utilisé par votre projet, le mode débogage affichera certaines des informations suivantes :

![debug3](/images/debug-mode-stats.jpg)

<u>Panneau des statistiques</u> (touchez pour réduire)

- fps - images par seconde, framerate.
- Tris - nombre de triangles rendus par image.
- Appels de dessin - nombre d'appels de dessin par image. Un appel au dessin est un appel à l'API graphique pour dessiner des objets (par exemple, dessiner un triangle).
- Textures - Nombre de textures dans la scène.
- Tex(max) - la dimension maximale de la plus grande texture de la scène.
- Shaders - nombre de shaders GLSL dans la scène.
- Géométries - nombre de géométries dans la scène.\*
- Points - nombre de points dans la scène. S'affiche uniquement lorsque la scène a plus de 0.\*
- Entités - nombre d'entités A-Frame dans la scène.\*
- ImgTargets - nombre de cibles d'images 8e mur actives dans la scène.
- Modèles - taille totale en Mo de tous les `<a-asset-items>` (uniquement les modèles 3D préchargés) dans `<a-assets>`.\*

<u>Panneau de version</u>

- Version du moteur - version du moteur AR du 8e mur que l'expérience utilise.
- Version du moteur de rendu - version du moteur de rendu que l'expérience utilise.

<u>Panneau d'outils</u>

- Console - affiche les journaux de la console en temps réel.
- Actions - options permettant de réinitialiser la caméra XR (XR8.recenter()), d'afficher la surface détectée et d'afficher l'inspecteur de la trame A.
- Caméra - affiche la position et la rotation de la caméra XR.
- Minimiser - réduit le panneau d'outils.

[\*] disponible dans les projets de l'éditeur de nuages utilisant le cadre A
