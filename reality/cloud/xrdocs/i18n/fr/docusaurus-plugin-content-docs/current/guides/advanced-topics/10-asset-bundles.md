---
id: asset-bundles
---

# Ensembles d'actifs

La fonction de regroupement d'actifs du Cloud Editor de 8th Wall permet d'utiliser des actifs multi-fichiers.  Ces actifs impliquent généralement des fichiers qui se référencent mutuellement en interne à l'aide de chemins d'accès relatifs. les fichiers ".glTF", ".hcap", ".msdf" et cubemap sont quelques exemples courants.

Dans le cas des fichiers .hcap, vous chargez la ressource via le fichier "principal", par exemple "mon-hologramme.hcap".  Ce fichier contient de nombreuses références à d'autres ressources dépendantes, telles que les fichiers .mp4 et .bin.  Ces noms de fichiers sont référencés et chargés par le fichier principal en tant qu'URL avec des chemins relatifs au fichier .hcap.

![AssetBundleGif](https://media.giphy.com/media/dB0va3gWqncbgPYxxJ/giphy.gif)

## Créer un ensemble d'actifs {#create-asset-bundle}

#### 1. Préparez vos fichiers {#1-prepare-your-files}

Utilisez l'une des méthodes suivantes pour préparer vos fichiers avant le chargement :

* Multi-sélectionner les fichiers individuels de votre système de fichiers local
* Créez un fichier ZIP.
* Localisez le répertoire contenant tous les fichiers nécessaires à votre ressource (Remarque : le chargement de répertoire n'est pas pris en charge par tous les navigateurs !)

#### 2. Créer un nouvel ensemble d'actifs {#2-create-new-asset-bundle}

##### Option 1 {#option-1}

Dans le Cloud Editor, cliquez sur le "+" **** à droite de **ASSETS** et sélectionnez « Nouvel ensemble d’actifs ».  Sélectionnez ensuite le type d'actif.  Si vous ne chargez pas d'actif glTF ou HCAP, sélectionnez "Autre".

![NewAssetBundle](/images/new-asset-bundle.jpg)

##### Option 2 {#option-2}

Vous pouvez également faire glisser les actifs ou ZIP directement dans le volet ASSETS en bas à droite du Cloud Editor.

![NewAssetBundleDrag](/images/new-asset-bundle-drag.jpg)

#### 3. Aperçu de l'ensemble d'actifs {#3-preview-asset-bundle}

Une fois les fichiers chargés, vous pourrez les prévisualiser avant de les ajouter à votre projet.  Sélectionnez des fichiers individuels dans le volet gauche pour les prévisualiser dans le volet droit.

![NewAssetBundlePreview](/images/new-asset-bundle-preview.jpg)

#### 4. Sélectionnez le fichier "principal" {#4-select-main-file}

Si votre type d'actif exige que vous fassiez référence à un fichier, définissez ce fichier comme "fichier principal". Si votre type de ressource vous oblige à faire référence à un dossier (cubemaps, etc.), définissez « aucun » comme "fichier principal".

Note : Cette étape n'est pas nécessaire pour les actifs du FGTI ou du PCAH.  Le fichier principal est défini automatiquement pour ces types d’actifs.

Le fichier principal ne peut pas être modifié ultérieurement.  Si vous sélectionnez le mauvais fichier, vous devrez charger à nouveau l'ensemble des ressources.

#### 5. Définir le nom du groupe d'actifs {#5-set-asset-bundle-name}

Donnez un nom à l'ensemble d'actifs. Il s'agit du nom de fichier par lequel vous accéderez au paquet de ressources dans votre projet.

#### 6. cliquez sur "Créer une offre groupée" {#6-lick-create-bundle}

Le chargement de votre ensemble de ressources sera terminé et il sera ajouté à votre projet Cloud Editor.

## Aperçu de l'ensemble d'actifs {#preview-asset-bundle}

Les actifs peuvent être prévisualisés directement dans le Cloud Editor.  Sélectionnez un actif sur la gauche pour le visualiser sur la droite.  Vous pouvez prévisualiser une ressource spécifique à l'intérieur de l'offre groupée en développant le menu « Montrer le contenu » sur la droite et en sélectionnant une ressource à l'intérieur.

![AssetBundlePreview](/images/asset-bundle-preview.jpg)

## Renommer l'ensemble d'actifs {#rename-asset-bundle}

Pour renommer un actif, cliquez sur l'icône "flèche vers le bas" à droite de votre actif et choisissez **Renommer**.  Modifiez le nom de l'actif et appuyez sur Entrée pour enregistrer.  Important : si vous renommez un jeu d'actifs, vous devrez parcourir votre projet et vous assurer que toutes les références pointent vers le nom de l'actif mis à jour.

## Supprimer l'ensemble d'actifs {#delete-asset-bundle}

Pour supprimer un actif, cliquez sur l'icône de la "flèche vers le bas" à droite de votre actif et choisissez **Supprimer**.

## Référencement de l'ensemble des actifs {#referencing-asset-bundle}

Pour faire référence au groupe d'actifs à partir d'un fichier **html** dans votre projet (par exemple, body.html), il suffit d'indiquer le chemin approprié dans le paramètre **src=** ou **gltf-model=** .

Pour référencer le paquet d'actifs à partir de **javascript**, utilisez **require()**

#### Exemple - HTML {#example---html}

```html
<!-- Example 1 -->
<a-assets>
  <a-asset-item id="myModel" src="assets/sand-castle.gltf"></a-asset-item>
</a-assets>
<a-entity
  id="model"
  gltf-model="#myModel"
  class="cantap"
  scale="3 3 3"
  shadow="receive: false">
</a-entity>


<!-- Example 2 -->
<holo-cap
  id="holo"
  src="./assets/my-hologram.hcap"
  holo-scale="6"
  holo-touch-target="1.65 0.35"
  xrextras-hold-drag
  xrextras-two-finger-rotate
  xrextras-pinch-scale="scale: 6">
</holo-cap>
```

#### Exemple - javascript {#example---javascript}

```javascript
const modelFile = require('./assets/my-model.gltf')
```
