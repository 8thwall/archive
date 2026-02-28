---
id: importing-xrextras-into-cloud-editor
---

# Importation de XRExtras dans le Cloud Editor

Cette section de la documentation est destinée aux utilisateurs avancés qui utilisent le Cloud Editor 8th Wall et qui doivent créer une version entièrement personnalisée de XRExtras. Ce processus implique :

* Cloner le code XRExtras depuis GitHub
* Importer des fichiers dans votre projet Cloud Editor
* Désactivation de la vérification de type dans les fichiers de composants A-Frame
* Mise à jour de votre code pour utiliser votre copie locale et personnalisée de XRExtras au lieu d'extraire notre version par défaut du CDN (via une balise méta)

Si vous n'avez besoin que de personnaliser l'écran de chargement de XRExtras, reportez-vous plutôt à [cette section](/guides/advanced-topics/load-screen).

Remarque : en important une copie de XRExtras dans votre projet Cloud Editor, vous ne recevrez plus les dernières mises à jour et fonctionnalités de XRExtras disponibles sur le CDN. Veillez à toujours récupérer la dernière version du code XRExtras sur GitHub lorsque vous démarrez de nouveaux projets.

Instructions :

1. Créez un dossier `myxrextras` dans votre projet Cloud Editor

2. Clone <https://github.com/8thwall/web>

3. Ajoutez le contenu du répertoire `xrextras/src/` (<https://github.com/8thwall/web/tree/master/xrextras/src>) à votre projet, à l'exception de **** de index.js

4. Le contenu de votre projet ressemblera à ceci :

![fichiers xrextras](/images/xrextras-import-files.jpg)

5. Pour **chaque fichier** dans le dossier `aframe/components` , supprimez l'instruction `d’importation` et remplacez-la par `// @ts-nocheck`

![xrextras désactive la vérification de type](/images/xrextras-disable-type-checking.jpg)

6. Dans head.html, supprimez ou commentez la balise `<meta>` pour @8thwall.xrextras afin qu'elle ne soit plus extraite de notre CDN :

![tête xrextras](/images/xrextras-import-head.jpg)

7. Dans app.js, importez votre bibliothèque xrextras locale :

![xrextras appjs](/images/xrextras-import-appjs.jpg)

#### Modification/ajout d'images {#changingadding-image-assets}

Tout d'abord, glissez-déposez les nouvelles images dans assets/ pour les télécharger dans votre projet :

![atout xrextras](/images/xrextras-import-asset.jpg)

Dans les fichiers **html** avec les paramètres `src` , faites référence à l'image en utilisant un chemin relatif :

`<img src="../../assets/my-logo.png" id="loadImage" class="spin" /&gt ;`

Dans les fichiers **javascript** , utilisez un chemin relatif et`require()` pour référencer les ressources :

`img.src = require('../../assets/my-logo.png')`
