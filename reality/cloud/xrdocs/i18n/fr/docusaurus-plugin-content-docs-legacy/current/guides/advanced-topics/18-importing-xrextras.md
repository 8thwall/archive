---
id: importing-xrextras-into-cloud-editor
---

# Importation de XRExtras dans l'Éditeur de nuages

Cette section de la documentation est destinée aux utilisateurs avancés qui utilisent l'éditeur 8th Wall Cloud
et qui doivent créer une version entièrement personnalisée de XRExtras. Ce processus implique

- Cloner le code XRExtras depuis GitHub
- Importer des fichiers dans votre projet Cloud Editor
- Désactivation de la vérification de type dans les fichiers de composants A-Frame
- Mise à jour de votre code pour utiliser votre copie locale et personnalisée de XRExtras au lieu d'extraire notre version par défaut du CDN (via une balise méta).

Si vous avez seulement besoin de personnaliser l'écran de chargement de XRExtras, reportez-vous plutôt à
[cette section](/legacy/guides/advanced-topics/load-screen).

Remarque : en important une copie de XRExtras dans votre projet Cloud Editor, vous ne recevrez plus les
dernières mises à jour et fonctionnalités de XRExtras disponibles sur le CDN. Veillez à toujours récupérer la dernière version
du code XRExtras sur GitHub lorsque vous démarrez de nouveaux projets.

Instructions :

1. Créez un dossier `myxrextras` dans votre projet Cloud Editor

2. Clone <https://github.com/8thwall/web>

3. Ajoutez le contenu du répertoire `xrextras/src/` (<https://github.com/8thwall/web/tree/master/xrextras/src>)
   à votre projet, à l'**exception** de index.js

4. Le contenu de votre projet ressemblera à ceci :

![xrextras files](/images/xrextras-import-files.jpg)

5. Pour **chaque** fichier du dossier `aframe/components`, supprimez l'instruction `import` et remplacez-la par `// @ts-nocheck`

![xrextras disable type-checking](/images/xrextras-disable-type-checking.jpg)

6. Dans head.html, supprimez ou commentez la balise `<meta>` pour @8thwall.xrextras afin qu'elle ne soit plus extraite de notre CDN :

![xrextras head](/images/xrextras-import-head.jpg)

7. Dans app.js, importez votre bibliothèque xrextras locale :

![xrextras appjs](/images/xrextras-import-appjs.jpg)

#### Modification/ajout d'images {#changingadding-image-assets}

Tout d'abord, glissez-déposez les nouvelles images dans assets/ pour les télécharger dans votre projet :

![xrextras asset](/images/xrextras-import-asset.jpg)

Dans les fichiers **html** avec les paramètres `src`, faites référence à l'image en utilisant un chemin relatif :

`<img src="​../../assets/​my-logo.png" id="loadImage" class="spin" />`

Dans les fichiers **javascript**, utilisez un chemin relatif et `require()` pour référencer les actifs :

`img.src = require('../../assets/my-logo.png')`
