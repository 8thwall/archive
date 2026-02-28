# Plate-forme API : Cibles d'images

L'API de gestion des cibles d'images de 8th Wall permet aux développeurs de gérer dynamiquement la \*\*bibliothèque de cibles d'images
\*\* associée à leurs projets WebAR alimentés par 8th Wall. Cette API et la documentation
qui l'accompagne sont conçues pour les développeurs familiarisés avec le développement web et les cibles d'images 8th Wall.

**Avant de commencer:** Avant de commencer à utiliser l'API Image Target, votre espace de travail doit être sur un plan de facturation
**Enterprise**. Pour effectuer une mise à niveau, [contacter les ventes](https://www.8thwall.com/licensing).

## Authentification {#authentication}

L'authentification est assurée par des clés secrètes. Les espaces de travail d'un plan Entreprise peuvent demander une clé API.
Vous inclurez cette clé secrète dans chaque demande pour vérifier que la demande est autorisée. Étant donné que la clé se trouve à
dans votre espace de travail, elle aura accès à toutes les cibles d'image dans toutes les applications de cet espace de travail
.

Vous pouvez consulter votre clé sur la page de votre compte.

![Visualization showing image targets inside apps, apps inside the workspace, and the API Key inside the workspace](/images/authentication-structure.png)

#### Important {#important}

La clé API Image Target est une clé B2B associée à votre espace de travail. Suivez les meilleures pratiques pour
sécuriser votre clé API car l'exposition publique de votre clé API peut entraîner une utilisation involontaire et un accès non autorisé à
. En particulier, il convient d'éviter

- Intégrer la clé API Image Target dans un code qui s'exécute sur l'appareil d'un utilisateur ou qui est partagé publiquement.
- Stocker la clé API Image Target dans l'arborescence source de votre application

## Limites et quotas {#limits-and-quotas}

- 25 requêtes par minute, avec une allocation de 500, ce qui signifie que vous pouvez effectuer 500 requêtes en une minute
  , puis 25 requêtes par minute ensuite, ou attendre 20 minutes et effectuer à nouveau
  500 requêtes.
- 10 000 demandes par jour.

**Note** : Ces limites ne s'appliquent qu'à l'API de gestion des cibles d'images, qui permet aux développeurs de gérer dynamiquement la bibliothèque d'images associée à un projet 8th Wall (
). \*\*Ces limites ne s'appliquent pas à
aux activations de l'utilisateur final d'une expérience de RA Web.

Pour demander une augmentation des quotas de l'API Image Target pour les projets de votre espace de travail
, veuillez envoyer une demande à [support](mailto:support@8thwall.com).

## Critères d'évaluation {#endpoints}

- [Créer une cible d'image](#create-image-target)
- [Liste des cibles de l'image](#list-image-targets)
- [Obtenir la cible de l'image](#get-image-target)
- [Modifier la cible de l'image](#modify-image-target)
- [Supprimer l'image cible](#delete-image-target)
- [Cible de l'image de prévisualisation](#preview-image-target)

### Créer une image cible {#create-image-target}

Chargement d'une nouvelle cible dans la liste des cibles d'images d'une application

#### Demande {#post-request}

```bash
curl -X POST "https://api.8thwall.com/v1/apps/$APP_KEY/targets" \N-
    -H "X-Api-Key :$SECRET_KEY" \N-
    -F "name=my-target-name" \N-
    -F "image=@image.png"\N-
    -F "geometry.top=0"\N-
    -F "geometry.left=0"\N-
    -F "geometry.width=480"\N-
    -F "geometry.height=640"\N-
    -F "metadata={\N "customFlag"\N:true}"
    -F "loadAutomatically=true"
```

| Champ d'application                                                                                | Type             | Valeur par défaut | Description                                                                                                                                                                              |
| :------------------------------------------------------------------------------------------------- | :--------------- | :---------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| image                                                                                              | Données binaires |                   | Format PNG ou JPEG, au moins 480x640, moins de 2048x2048 et moins de 10MB.                                                                                               |
| nom                                                                                                | `Chaîne`         |                   | Doit être unique au sein d'une application, ne peut pas inclure de tildes (~) et ne peut pas dépasser 255 caractères.                 |
| type [optionnel]                               | `Chaîne`         | `'PLANAR'`''      | PLANAIRE", "CYLINDRE" ou "CONIQUE".                                                                                                                                      |
| métadonnées [Facultatif]                       | `Chaîne`         | `null`            | Doit être un JSON valide si `metadataIsJson` est vrai, et ne peut excéder 2048 caractères.                                                                               |
| metadataIsJson [Optionnel]                     | `Booléen`        | `true`            | Vous pouvez définir la valeur false pour utiliser la propriété des métadonnées comme une chaîne brute.                                                                   |
| loadAutomatically [Facultatif]                 | `Booléen`        | `false`           | Chaque application est limitée à 5 cibles d'images avec `loadAutomatically : true`                                                                                                       |
| geometry.isRotated [Optionnel] | `Booléen`        | `false`           | La valeur "true" est utilisée si l'image est pré-tournée de l'horizontale à la verticale.                                                                                |
| géométrie.haut                                                                     | entier           |                   | Ces propriétés spécifient le recadrage à appliquer à votre image. Elle doit avoir un rapport hauteur/largeur de 3:4 et au moins 480x640. |
| géométrie.gauche                                                                   | entier           |                   |                                                                                                                                                                                          |
| géométrie.largeur                                                                  | entier           |                   |                                                                                                                                                                                          |
| géométrie.hauteur                                                                  | entier           |                   |                                                                                                                                                                                          |
| géométrie.topRadius                                                                | entier           |                   | Uniquement nécessaire pour `type : 'CONICAL'`.                                                                                                                           |
| geometry.bottomRadius                                                              | entier           |                   | Uniquement nécessaire pour `type : 'CONICAL'`.                                                                                                                           |

#### Géométrie de chargement planaire / cylindrique {#planar--cylinder-upload-geometry}

Ce diagramme montre comment le recadrage spécifié est appliqué à votre image téléchargée pour générer les
`imageUrl` et `thumbnailImageUrl`. Le rapport largeur/hauteur est toujours de 3:4.

![Diagram showing how crop, rotation, and scale are applied to planar and cylinder image targets](/images/flat-geometry.jpg)

Pour un recadrage de paysage, téléchargez l'image avec une rotation de 90 degrés dans le sens des aiguilles d'une montre, définissez
`geometry.isRotated : true`, et spécifiez le recadrage par rapport à l'image pivotée.

![Diagram showing how crop, rotation, and scale are applied to planar and cylinder image targets when isRotated is true](/images/rotated-geometry.jpg)

#### Géométrie de la charge conique {#conical-upload-geometry}

Ce diagramme montre comment l'image téléchargée est aplatie et recadrée en fonction des paramètres. L'image téléchargée à l'adresse
se présente sous la forme d'un "arc-en-ciel" dans lequel les bords supérieur et inférieur de votre contenu sont alignés
sur deux cercles concentriques. Si votre cible est plus étroite en haut qu'en bas, spécifiez `topRadius`
comme la valeur négative du rayon extérieur, et `bottomRadius` comme le rayon intérieur (positif). Pour un recadrage de paysage
, définissez `geometry.isRotated : true`, et l'image aplatie subira une rotation avant que le recadrage
ne soit appliqué.

![Diagram showing how crop, rotation, and scale are applied to conical image targets](/images/cone-geometry.jpg)

#### Réponse {#post-response}

<span id="image-target-format">Il s'agit du format de réponse JSON standard pour les cibles d'image.</span>

```json
{
  "name" : "...",
  "uuid" : "...",
  "type" : "PLANAR",
  "loadAutomatically" : true,
  "status" : "AVAILABLE",
  "appKey" : "...",
  "geometry" : {
    "top" : 842,
    "left" : 392,
    "width" : 851,
    "height" : 1135,
    "isRotated" : true,
    "originalWidth" : 2000,
    "originalHeight" : 2000
  },
  "metadata" : null,
  "metadataIsJson" : true,
  "originalImageUrl" : "https://cdn.8thwall.com/image-target/...",
  "imageUrl" : "https://cdn.8thwall.com/image-target/...",
  "thumbnailImageUrl" : "https://cdn.8thwall.com/image-target/...",
  "geometryTextureUrl" : "https://cdn.8thwall.com/image-target/...",
  "created" : 1613508074845,
  "updated" : 1613683291310
}
```

| Propriété          | Type      | Description                                                                                                                                                           |
| :----------------- | :-------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| nom                | `Chaîne`  |                                                                                                                                                                       |
| uuid               | `Chaîne`  | ID unique de cette cible d'image                                                                                                                                      |
| type               | `Chaîne`  | PLANAIRE", "CYLINDRE" ou "CONIQUE".                                                                                                                   |
| loadAutomatically  | `Booléen` |                                                                                                                                                                       |
| statut             | `Chaîne`  | `'AVAILABLE'` ou `'TAKEN_DOWN'`                                                                                                                                       |
| appKey             | `Chaîne`  | L'application à laquelle appartient la cible                                                                                                                          |
| géométrie          | `Objet`   | Voir ci-dessous                                                                                                                                                       |
| métadonnées        | `Chaîne`  |                                                                                                                                                                       |
| metadataIsJson     | `Booléen` |                                                                                                                                                                       |
| originalImageUrl   | `Chaîne`  | URL CDN pour l'image source qui a été téléchargée                                                                                                                     |
| imageUrl           | `Chaîne`  | Version recadrée de `geometryTextureUrl`                                                                                                                              |
| thumbnailImageUrl  | `Chaîne`  | Version haute de 350px de `imageUrl` à utiliser dans les vignettes                                                                                                    |
| geometryTextureUrl | `Chaîne`  | Pour les coniques, il s'agit d'une version aplatie de l'image originale, pour les plans et les cylindres, c'est la même chose que `originalImageUrl`. |
| créé               | entier    | Date de création en millisecondes après l'époque Unix                                                                                                                 |
| mis à jour         | entier    | Date de la dernière mise à jour en millisecondes après l'époque unix                                                                                                  |

#### Géométrie plane {#planar-geometry}

| Propriété         | Type    | Description                    |
| :---------------- | :------ | :----------------------------- |
| sommet            | entier  |                                |
| gauche            | entier  |                                |
| largeur           | entier  |                                |
| hauteur           | entier  |                                |
| isRotated         | Booléen |                                |
| largeur originale | entier  | Largeur de l'image téléchargée |
| hauteur originale | entier  | Hauteur de l'image téléchargée |

#### Cylindre ou géométrie conique {#cylinder-or-conical-geometry}

Etend les propriétés Planar Geometry avec la modification que `originalWidth` et
`originalHeight` se réfèrent aux dimensions de l'image aplatie stockée dans geometryTextureUrl.

| Propriété                     | Type     | Description                                                                                                                                                                       |
| :---------------------------- | :------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| topRadius                     | flotteur |                                                                                                                                                                                   |
| rayon du bas                  | flotteur |                                                                                                                                                                                   |
| coniness                      | flotteur | Toujours 0 pour `type : CYLINDER`, dérivé de `topRadius`/`bottomRadius` pour `type : CONIQUE`                                                                                     |
| cylindreCirconférenceTop      | flotteur | La circonférence du cercle complet tracé par le bord supérieur de votre cible.                                                                                    |
| targetCircumferenceTop        | flotteur | La longueur du bord supérieur de votre cible avant l'application de la culture.                                                                                   |
| cylinderCircumferenceBottom   | flotteur | Dérivé de `cylinderCircumferenceTop` et `topRadius`/`bottomRadius`                                                                                                                |
| longueur latérale du cylindre | flotteur | Dérivé de `targetCircumferenceTop` et des dimensions de l'image originale                                                                                                         |
| arcAngle                      | flotteur | Dérivé de `cylinderCircumferenceTop` et `targetCircumferenceTop`.                                                                                                 |
| mode d'entrée                 | `Chaîne` | BASIC" ou "ADVANCED". Contrôle ce que les utilisateurs voient dans la console du 8e mur, soit des curseurs, soit des boîtes de saisie de nombres. |

### Liste des cibles de l'image {#list-image-targets}

Demande d'une liste de cibles d'images appartenant à une application. Les résultats sont paginés, ce qui signifie que si l'application
contient plus de cibles d'images que ce qui peut être renvoyé en une seule réponse, vous devrez faire plusieurs demandes à
pour énumérer la liste complète des cibles d'images.

#### Demande {#list-request}

```bash
curl "https://api.8thwall.com/v1/apps/$APP_KEY/targets" -H "X-Api-Key :$SECRET_KEY"
```

| Paramètres                                                                    | Type     | Description                                                                                                           |
| :---------------------------------------------------------------------------- | :------- | :-------------------------------------------------------------------------------------------------------------------- |
| par [Facultatif]          | `Chaîne` | Spécifie la colonne à trier. Les options sont "created", "updated", "name" ou "uuid". |
| dir [Facultatif]          | `Chaîne` | Contrôle le sens de tri de la liste. Soit "asc", soit "desc".                         |
| start [Facultatif]        | `Chaîne` | Spécifie que la liste commence par les éléments qui ont cette valeur dans la colonne `by`.            |
| après [Facultatif]        | `Chaîne` | Spécifie que la liste commence immédiatement après les éléments qui ont cette valeur                                  |
| limite [Facultatif]       | entier   | Doit être compris entre 1 et 500                                                                                      |
| continuation [Facultatif] | `Chaîne` | Utilisé pour rechercher la page suivante après la requête initiale.                                   |

#### Liste triée {#sorted-list}

Cette requête énumère les cibles de l'application en partant de "z" et en allant vers "a".

```bash
curl "https://api.8thwall.com/v1/apps/$APP_KEY/targets?by=name&dir=desc" -H "X-Api-Key :$SECRET_KEY"
```

#### Tris multiples {#multiple-sorts}

Vous pouvez spécifier un second paramètre "sort-by" qui sert à départager les doublons dans votre première valeur `by`. `uuid` est utilisé comme critère d'égalité par défaut s'il n'est pas spécifié.

```bash
curl "https://api.8thwall.com/v1/apps/$APP_KEY/targets?by=updated&by=uuid" -H "X-Api-Key :$SECRET_KEY"
```

#### Spécifier un point de départ {#specify-a-starting-point}

Vous pouvez spécifier des valeurs `start` ou `after` qui correspondent aux valeurs `by` pour spécifier votre position actuelle dans la liste. Si vous voulez que votre liste commence immédiatement après l'élément avec `updated : 333` et `uuid : 777`, vous utiliserez :

```bash
curl "https://api.8thwall.com/v1/apps/$APP_KEY/targets?by=updated&by=uuid&start=333&after=777" -H "X-Api-Key :$SECRET_KEY"
```

De cette façon, les éléments avec `updated : 333` sont toujours inclus dans la page suivante si leur `uuid` est postérieur à `777`. Si la valeur `updated` d'un élément est supérieure à `333`, mais que son `uuid` est inférieur à `777`, il sera quand même inclus dans la page suivante car la deuxième propriété `by` n'entre en jeu que pour les ex-aequo.

Il n'est pas possible de spécifier une valeur `après` pour le tri principal tout en fournissant une valeur `début` pour le tri décisif. Par exemple, il ne serait pas valide de spécifier `?by=name&by=uuid&after=my-name-&start=333`. Il faudrait plutôt dire "?by=name&by=uuid&after=my-name-`car le second point de départ n'entre en jeu que lorsque le point de départ principal est inclusif (en utilisant`start\\`).

![Diagram showing how the by, start, and after parameters specify the starting point of the list](/images/image-target-sort.png)

#### Réponse {#list-response}

Objet JSON contenant la propriété `targets`, qui est un tableau d'objets cibles d'images dans le [format standard](#post-response).

Si `continuationToken` est présent, vous devrez spécifier `?continuation=[continuationToken]` dans une requête suivante pour obtenir la page suivante d'images cibles.

```json
{
  "continuationToken" : "...",
  "targets" : [{
    "name" : "...",
    "uuid" : "...",
    "type" : "PLANAR",
    "loadAutomatically" : true,
    "status" : "AVAILABLE",
    "appKey" : "...",
    "geometry" : {
      "top" : 842,
      "left" : 392,
      "width" : 851,
      "height" : 1135,
      "isRotated" : true,
      "originalWidth" : 2000,
      "originalHeight" : 2000
    },
    "metadata" : null,
    "metadataIsJson" : true,
    "originalImageUrl" : "https://cdn.8thwall.com/image-target/...",
    "imageUrl" : "https://cdn.8thwall.com/image-target/...",
    "thumbnailImageUrl" : "https://cdn.8thwall.com/image-target/...",
    "geometryTextureUrl" : "https://cdn.8thwall.com/image-target/...",
    "created" : 1613508074845,
    "updated" : 1613683291310
  }, {
    "name" : "...",
    "uuid" : "...",
    "type" : "CONICAL",
    "loadAutomatically" : true,
    "status" : "AVAILABLE",
    "appKey" : "...",
    "geometry" : {
      "top" : 0,
      "left" : 0,
      "width" : 480,
      "height" : 640,
      "originalWidth" : 886,
      "originalHeight" : 2048,
      "isRotated" : true,
      "cylinderCircumferenceTop" : 100,
      "cylinderCircumferenceBottom" : 40,
      "targetCircumferenceTop" : 50,
      "cylinderSideLength" : 21.63,
      "topRadius" : 1600,
      "bottomRadius" : 640,
      "arcAngle" : 180,
      "coniness" : 1.3219280948873624,
      "inputMode" : "BASIC"
    },
    "metadata" : "{\"my-metadata\" : 34534}",
    "metadataIsJson" : true,
    "originalImageUrl" : "https://cdn.8thwall.com/...",
    "imageUrl" : "https://cdn.8thwall.com/...",
    "thumbnailImageUrl" : "https://cdn.8thwall.com/...",
    "geometryTextureUrl" : "https://cdn.8thwall.com/...",
    "created" : 1613508074845,
    "updated" : 1613683291310
  }]
}
```

### Obtenir la cible de l'image {#get-image-target}

#### Demande {#get-request}

```bash
curl "https://api.8thwall.com/v1/targets/$TARGET_UUID" -H "X-Api-Key :$SECRET_KEY"
```

#### Réponse {#get-response}

Objet JSON du [format standard de l'image cible](#post-response)

### Modifier la cible de l'image {#modify-image-target}

Les propriétés suivantes peuvent être modifiées :

- `nom`
- `loadAutomatically`
- `metadata`
- `metadataIsJson`

Les mêmes règles de validation s'appliquent que pour le [téléchargement initial](#create-image-target)

Pour les cibles cylindriques et coniques, les propriétés suivantes de l'objet `geometry` peuvent également être modifiées :

- `cylinderCircumferenceTop` (Circonférence du cylindre)
- `targetCircumferenceTop` (circonférence cible)
- `inputMode`

Les autres propriétés géométriques de la cible seront mises à jour en conséquence.

#### Demande {#patch-request}

```bash
curl -X PATCH "https://api.8thwall.com/v1/targets/$TARGET_UUID"\N-
    -H "X-Api-Key :$SECRET_KEY"\N-
    -H "Content-Type : application/json"\N-
    --data '{"name" : "new-name", "geometry : {"inputMode" : "BASIC"}, "metadata" : "{}"}'
```

#### Réponse {#patch-response}

Objet JSON du [format standard de l'image cible](#post-response)

### Supprimer la cible de l'image {#delete-image-target}

#### Demande {#delete-request}

```bash
curl -X DELETE "https://api.8thwall.com/v1/targets/$TARGET_UUID" -H "X-Api-Key :$SECRET_KEY"
```

#### Réponse {#delete-response}

Une suppression réussie renverra une réponse vide avec le code de statut `204 : Pas de contenu`.

### Aperçu de l'image cible {#preview-image-target}

Générer une URL que les utilisateurs peuvent utiliser pour prévisualiser le suivi d'une cible.

#### Demande {#preview-request}

```bash
curl "https://api.8thwall.com/v1/targets/$TARGET_UUID/test" -H "X-Api-Key :$SECRET_KEY"
```

#### Réponse {#preview-response}

```json
{
  "url" : "https://8w.8thwall.app/previewit/?j=...",
  "token" : "...",
  "exp" : 1612830293128
}
```

| Propriété | Type     | Description                                                                                                                               |
| :-------- | :------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| url       | `Chaîne` | L'URL qui peut être utilisée pour prévisualiser le suivi de la cible                                                                      |
| jeton     | `Chaîne` | Ce jeton ne peut actuellement être utilisé que par notre application de prévisualisation.                                 |
| exp       | entier   | L'heure en millisecondes à laquelle le jeton expirera. Les jetons expirent une heure après leur émission. |

La fonctionnalité de prévisualisation est destinée à être utilisée dans le contexte d'un utilisateur spécifique qui gère ou configure des cibles d'images (
). Ne publiez pas les URL de prévisualisation sur un site public et ne les partagez pas avec un grand nombre d'utilisateurs.

\*\*L'URL de prévisualisation renvoyée par l'API est
l'expérience cible de l'image générique de prévisualisation de 8th Wall. Si vous souhaitez personnaliser davantage l'interface
de l'aperçu de votre cible d'image, procédez comme suit :

1. Créer un projet public de 8e mur
2. Personnaliser l'interface utilisateur de ce projet en fonction de vos spécifications
3. Téléchargez les images cibles que les utilisateurs veulent tester via l'API en utilisant la clé d'application du projet que vous avez créé à l'étape 1 (
   ).
4. Générer une URL de cible d'image testable pour les utilisateurs finaux en utilisant l'URL publique du projet à l'étape 1
   et un paramètre URL avec le nom de la cible d'image.
5. Dans le projet que vous avez créé à l'étape 1, utilisez le paramètre URL pour définir la cible d'image active en utilisant l'appel
   [\\`XR8.XrController.configure({imageTargets : ['theTargetName']}](./xrcontroller/configure.md).

## Gestion des erreurs {#error-handling}

Si l'API rejette votre requête, la réponse sera `Content-Type : application/json`, et le corps de
contiendra une propriété `message` contenant une chaîne d'erreur.

## Exemple {#example}

```json
{
  "message" : "App not found : ..."
}
```

#### Codes d'état {#status-codes}

| Statut | Raison                                                                                                                                                                                                                                                                              |
| :----- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 400    | Cela peut se produire si vous avez spécifié une valeur non valide ou fourni un paramètre qui n'existe pas.                                                                                                                                                          |
| 403    | Cela peut se produire si vous ne fournissez pas votre clé secrète correctement.                                                                                                                                                                                     |
| 404    | L'application ou l'image cible a pu être supprimée, ou la clé de l'application ou l'UUID de la cible est incorrect. Il s'agit également du code de réponse si la clé API fournie ne correspond pas à la ressource à laquelle vous tentez d'accéder. |
| 413    | L'image téléchargée a été rejetée car le fichier est trop volumineux.                                                                                                                                                                                               |
| 429    | Votre clé API a dépassé la [limite de taux] qui lui est associée (#limits-and-quotas).                                                                                                       |
