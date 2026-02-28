---
id: your-3d-models-on-the-web
---

# Vos modèles 3D sur le Web

Nous recommandons d'utiliser des modèles 3D au format GLB (glTF 2.0 binary) pour toutes les expériences WebAR. GLB est actuellement le meilleur format pour WebAR grâce à sa petite taille de fichier, ses excellentes performances et son support polyvalent des fonctionnalités (PBR, animations, etc.).

## Conversion des modèles au format GLB {#converting-models-to-glb}

Avant d'exporter, assurez-vous que

* Le point de pivot se trouve à la base du modèle (si vous souhaitez qu'il soit fixé au sol)
* Le vecteur avant de l'objet est le long de l'axe Z (si vous vous attendez à ce qu'il soit orienté vers l'avant)

Si votre modèle est exporté sous forme de glTF, glissez-déposez le dossier glTF dans [gltf.report](https://gltf.report) et cliquez sur _Exporter_ pour le convertir en GLB.

Si votre modèle ne peut pas être exporté au format glTF/GLB à partir d'un logiciel de modélisation 3D, importez-le dans Blender et exportez-le au format gLTF ou utilisez un convertisseur.

**Convertisseurs en ligne** : [Creators3D](https://www.creators3d.com/online-viewer), [Boxshot](https://boxshot.com/facebook-3d-converter/)

**Convertisseurs natifs** : [Maya2glTF](https://github.com/iimachines/Maya2glTF), [3DS Max](https://doc.babylonjs.com/features/featuresDeepDive/Exporters/3DSMax)

Vous trouverez une liste complète des convertisseurs à l'adresse suivante : <https://github.com/khronosgroup/gltf#gltf-tools>.

Il est conseillé de visualiser le modèle dans [glTF Viewer](https://gltf-viewer.donmccurdy.com/) avant de l'importer dans un projet 8th Wall. Cela vous permettra de détecter les problèmes éventuels de votre modèle avant de l'ajouter à un projet de 8th Wall.

Après l'importation dans un projet 8th Wall, assurez-vous que :

* L'échelle semble correcte à (1, 1, 1). Si l'échelle est décalée d'une quantité significative (c'est-à-dire 0,0001 ou 10000), ne modifiez pas l'échelle dans le code. Au lieu de cela, modifiez-le dans votre logiciel de modélisation et réimportez-le. Une modification importante de l'échelle dans le code peut entraîner des problèmes d'écrêtage du modèle.
* Les matériaux semblent corrects. Si votre modèle comporte des matériaux réfléchissants, ils peuvent apparaître noirs à moins qu’ils aient quelque chose à refléter. Voir le projet d'exemple de réflexion [](https://www.8thwall.com/8thwall/cubemap-aframe) et/ou le projet d'exemple de verre [](https://www.8thwall.com/playground/glass-materials-aframe)

Pour plus d'informations sur les meilleures pratiques en matière de modèles 3D, consultez la section d'optimisation [GLB](#glb-optimization).

Veuillez également consulter l'article de blog [5 Tips for Developers to Make Any 8th Wall WebAR Project More Realistic](https://www.8thwall.com/blog/post/41447089034/5-tips-for-developers-to-make-any-8th-wall-webar-project-more-realistic) .

### Conversion de FBX en GLB {#converting-fbx-to-glb}

Les instructions suivantes expliquent comment installer et exécuter localement sur votre Mac l'outil de conversion CLI [FBX2glTF](https://github.com/facebookincubator/FBX2glTF)développé par Facebook. Cet outil est de loin le plus fiable que nous ayons utilisé à 8th Wall pour la conversion FBX vers GLB et nous l'avons utilisé pour tous nos contenus première partie à ce jour.

**Installation de FBX2glTF sur votre Mac**

1. Téléchargez ce fichier : https://github.com/facebookincubator/FBX2glTF/releases/download/v0.9.7/FBX2glTF-darwin-x64
2. Terminal ouvert
3. Accédez au dossier Téléchargements : `cd ~/Downloads`
4. Rendez le fichier exécutable : `chmod +x FBX2glTF-darwin-x64`
5. Si vous voyez un avertissement concernant le fichier téléchargé, cliquez simplement sur `Annuler`

![macos-alerte-1](/images/macos-download-warning-fbx2gltf-1.jpg)

6. Ouvrez `System Preferences` -> `Security & Privacy`, cliquez sur l'icône `Lock` et entrez votre `mot de passe macOS`.

![macos-securite-et-privatite](/images/macos-security-and-privacy.jpg)

7. Cliquez sur `Autoriser quand même`
8. Fermez les Préférences Système.
9. Retourner à la fenêtre du terminal
10. Réexécutez la commande précédente (en appuyant sur la flèche vers le haut, vous rétablirez la commande précédente) : `chmod +x FBX2glTF-darwin-x64`
11. Un avertissement actualisé s'affiche, cliquez sur `Ouvrez` :

![macos-alerte-2](/images/macos-download-warning-fbx2gltf-2.jpg)

12. À ce stade, vous devriez être en mesure d'exécuter avec succès le programme FBX2glTF

**Copiez FBX2glTF dans un répertoire système (Facultatif)**

Pour faciliter l'exécution du convertisseur FBX2glTF, copiez-le dans le répertoire /usr/local/bin. Il n'est donc pas nécessaire de se rendre à chaque fois dans le dossier Téléchargements pour exécuter la commande.

1. Depuis le dossier Téléchargements, exécutez `sudo cp ./FBX2glTF-darwin-x64 /usr/local/bin`
2. Le système vous demandera probablement votre mot de passe macOS. Saisissez-le et appuyez sur `Entrée`
3. Puisque `/usr/local/bin` devrait être dans votre CHEMIN par défaut, vous pouvez maintenant simplement lancer `FBX2glTF-darwin-x64` à partir de n'importe quel répertoire.

**Exécuter FBX2glTF sur votre Mac**

1. Dans Terminal, naviguez jusqu'au dossier où se trouvent vos fichiers fbx. Voici quelques commandes utiles pour parcourir les répertoires via la ligne de commande sur macOS :
  * `pwd` affiche le répertoire actuel du terminal.
  * `ls` liste le contenu du répertoire actuel.
  * `cd` change de répertoire et prend un chemin relatif (par exemple `cd ~/Downloads`) ou absolu (par exemple `cd /var/tmp`)

2. Lancez le programme `FBX2glTF-darwin-x64` et indiquez les paramètres des fichiers d'entrée (-i) et de sortie (-o).

#### Exemple FBX2glTF {#fbx2gltf-example}

```bash
FBX2glTF-darwin-x64 -i votrefichier.fbx -o nouveaufichier.glb
```

3. L'exemple ci-dessus convertira `votrefichier.fbx` en un nouveau fichier GLB nommé `nouveaufichier.glb`
4. Glissez-déposez le fichier GLB nouvellement créé dans https://gltf-viewer.donmccurdy.com/ pour vérifier qu’il fonctionne correctement.
5. Pour une configuration avancée de la conversion glb, consultez les commandes suivantes : https://github.com/facebookincubator/FBX2glTF#cli-switches

**Conversion par lots FBX2glTF**

Si vous avez plusieurs fichiers FBX dans le même répertoire, vous pouvez les convertir tous en même temps

1. Dans Terminal, naviguez jusqu'au dossier contenant les multiples fichiers FBX
2. Exécutez la commande suivante :

#### Exemple de conversion par lots FBX2glTF {#fbx2gltf-batch-conversion-example}

```bash
ls *.fbx | xargs -n1 -I {} FBX2glTF-darwin-x64 -i {} -o {}.glb
```

3. Cela devrait produire des versions glb de chaque fichier fbx que vous avez dans le dossier actuel !

## Optimisation GLB {#glb-optimization}

L'optimisation des ressources est une étape essentielle pour créer un contenu WebAR magique. Les ressources volumineuses peuvent entraîner des problèmes tels que des chargements infinis, des textures noires et des plantages.

### Optimisation des textures {#texture-optimization}

Les textures sont généralement le plus gros contributeur à la taille des fichiers, c'est donc une bonne idée de les optimiser d'abord.

Pour de meilleurs résultats, nous vous conseillons d'utiliser des textures de 1024x1024 ou moins. La taille des textures doit toujours être fixée à à la puissance deux (512x512, 1024x1024, etc.).

Vous pouvez le faire en utilisant votre programme d'édition d'images et/ou de modélisation 3D préféré ; cependant, si vous avez déjà un modèle GLB existant, un moyen rapide et facile de redimensionner les textures à l'intérieur du modèle 3D est d'utiliser [gltf.report](https://gltf.report)

* Faites glisser votre modèle 3D sur la page.  Dans la colonne de gauche, définissez la taille maximale de la texture souhaitée (1).
* Cliquez sur lecture (2) pour exécuter le script. La console (en bas à gauche) affiche l'état de l'opération.
* Téléchargez votre modèle GLB modifié en cliquant sur Exporter (3)

![rapport gltf](/images/gltf-report.jpg)

### Compression {#compression}

La compression permet de réduire considérablement la taille des fichiers. La compression Draco est la méthode de compression la plus populaire et peut être configurée dans les paramètres d'exportation de Blender ou après l'exportation dans [gltf.report](https://gltf.report).

Le chargement de modèles compressés dans votre projet nécessite une configuration supplémentaire. Pour plus d'informations, reportez-vous au projet d'exemple [A-Frame](https://www.8thwall.com/playground/draco-compression) ou au projet d'exemple [three.js](https://www.8thwall.com/playground/draco-threejs) .

### Optimisation de la géométrie {#geometry-optimization}

Pour une optimisation plus poussée, décimez le modèle afin de réduire le nombre de polygones.

Dans Blender, appliquez le modificateur _Decimate_ au modèle et réduisez le paramètre _Ratio_ à une valeur inférieure à 1.

Sélectionnez _Apply Modifiers_ dans les paramètres d'exportation.

### Tutoriel d'optimisation {#optimization-tutorial}

````mdx-code-block
<iframe width="560" height="315" src="https://www.youtube.com/embed/1ToEPOHN1no" frameborder="0" allow="accelerometer ; autoplay ; encrypted-media ; gyroscope ; picture-in-picture" allowfullscreen></iframe>

````
