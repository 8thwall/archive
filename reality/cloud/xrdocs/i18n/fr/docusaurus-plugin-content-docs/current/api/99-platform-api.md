# Plate-forme API : Image cible

L'API de gestion des cibles d'image du 8e mur permet aux développeurs de gérer dynamiquement la cible d'image ** library** associée à leurs projets WebAR alimentés par le 8e mur. Cette API et la documentation qui l'accompagne sont conçues pour les développeurs familiarisés avec le développement web et les images cible 8th Wall.

**Avant de commencer :** Avant de commencer à utiliser l'API Image Target, votre espace de travail doit faire partie d'un plan de facturation **Pro** ou **Enterprise**. Pour effectuer une mise à niveau, [contacter le service des ventes](https://www.8thwall.com/licensing).

## Authentification {#authentication}

L'authentification est assurée par des clés secrètes. Les espaces de travail qui bénéficient d'un plan Pro ou Enterprise peuvent demander une clé API. Vous inclurez cette clé secrète dans chaque demande pour vérifier que la demande est autorisée. Étant donné que la clé se trouve dans votre espace de travail, elle aura accès à toutes les images cible dans toutes les applications de cet espace de travail.

Vous pouvez consulter votre clé sur la page de votre compte.

![Visualisation des images cible dans les applications, des applications dans l'espace de travail et de la clé API dans l'espace de travail](/images/authentication-structure.png)

#### Important {#important}

La clé d’image cible d’API est une clé B2B associée à votre espace de travail. Suivez les meilleures pratiques pour sécuriser votre clé API car l'exposition publique de votre clé API peut entraîner une utilisation involontaire et un accès non autorisé. En particulier, veuillez éviter de :

- Intégrer la clé image cible d’API dans un code qui s'exécute sur l'appareil d'un utilisateur ou qui est partagé publiquement
- Stocker la clé clé image cible d’API dans l'arborescence source de votre application

## Limites et quotas {#limits-and-quotas}

- 25 requêtes par minute, avec une allocation de 500, ce qui signifie que vous pouvez effectuer 500 requêtes en une minute , puis 25 requêtes par minute ensuite, ou attendre 20 minutes et effectuer à nouveau 500 requêtes.
- 10 000 demandes par jour.

** Note** : Ces limites ne s'appliquent qu'à l'API de gestion d’images cible, qui permet aux développeurs de gérer dynamiquement la bibliothèque d'images associée à un projet 8th Wall. **Ces limites ne sont pas applicables aux activations par l'utilisateur final d'une expérience de WebAR.**

Pour demander une augmentation des quotas de clé d’image cible d’API pour les projets de votre espace de travail , veuillez envoyer une demande au [support](mailto:support@8thwall.com).

## Points finaux {#endpoints}

- [Créer une image cible](#create-image-target)
- [Liste des images cible](#list-image-targets)
- [Obtenir l’image cible](#get-image-target)
- [Modifier l’image cible](#modify-image-target)
- [Supprimer l’image cible](#delete-image-target)
- [Aperçu de l’image cible](#preview-image-target)

### Créer une image cible {#create-image-target}

Téléchargez une nouvelle cible dans la liste des images cible d’une application

#### Requête {#post-request}

```bash
curl -X POST "https://api.8thwall.com/v1/apps/$APP_KEY/targets" \N-
    -H "X-Api-Key:$SECRET_KEY" \N-
    -F "name=my-target-name" \N-
    -F "image=@image.png"\N-
    -F "geometry.top=0"\N-
    -F "geometry.left=0"\N-
    -F "geometry.width=480"\N-
    -F "geometry.height=640"\N-
    -F "metadata={\"customFlag\":true}"
    -F "loadAutomatically=true"
```

| Champ                          | Type             | Valeur par défaut | Description                                                                                                                              |
|:------------------------------ |:---------------- |:----------------- |:---------------------------------------------------------------------------------------------------------------------------------------- |
| image                          | Données binaires |                   | Format PNG ou JPEG, au moins 480x640, moins de 2048x2048 et moins de 10MB                                                                |
| nom                            | `Chaîne`         |                   | Doit être unique au sein d'une application, ne peut pas inclure de tildes (~) et ne peut pas dépasser 255 caractères                     |
| type [Facultatif]              | `Chaîne`         | `pLANAR`          | `pLANAR"`, `"CYLINDER"`, ou `"CONICAL"`.                                                                                                 |
| métadonnées [Facultatif]       | `Chaîne`         | `nul`             | Doit être un JSON valide si `metadataIsJson` est vrai, et ne peut pas dépasser 2048 caractères                                           |
| metadataIsJson [Optionnel]     | `Booléen`        | `vrai`            | Vous pouvez définir la valeur faux pour utiliser la propriété de métadonnées en tant que chaîne brute                                    |
| loadAutomatically [Facultatif] | `Booléen`        | `faux`            | Chaque application est limitée à 5 images cible avec `loadAutomatically: vrai`                                                           |
| geometry.isRotated [Optionnel] | `Booléen`        | `faux`            | La valeur vrai est utilisée si l'image est pré-tournée de l'horizontale à la verticale.                                                  |
| géométrie.haut                 | entier           |                   | Ces propriétés spécifient le recadrage à appliquer à votre image. Elle doit avoir un rapport hauteur/largeur de 3:4 et au moins 480x640. |
| géométrie.gauche               | entier           |                   |                                                                                                                                          |
| géométrie.largeur              | entier           |                   |                                                                                                                                          |
| géométrie.hauteur              | entier           |                   |                                                                                                                                          |
| géométrie.topRadius            | entier           |                   | Uniquement nécessaire pour `type : "CONICAL"`                                                                                            |
| geometry.bottomRadius          | entier           |                   | Uniquement nécessaire pour `type : "CONICAL"`                                                                                            |

#### Géométrie de chargement planaire / cylindrique {#planar--cylinder-upload-geometry}

Ce diagramme montre comment le recadrage spécifié est appliqué à votre image téléchargée pour générer les images `imageUrl` et `thumbnailImageUrl`. Le rapport largeur/hauteur est toujours de 3:4.

![Diagramme montrant comment le recadrage, la rotation et la mise à l'échelle sont appliqués aux cibles planaires et cylindriques](/images/flat-geometry.jpg)

Pour un recadrage de paysage, téléchargez l'image avec une rotation de 90 degrés dans le sens des aiguilles d'une montre, définissez `geometry.isRotated : true`, et spécifiez le recadrage par rapport à l'image ayant subi une rotation.

![Diagramme montrant comment le recadrage, la rotation et l'échelle sont appliqués aux cibles d'images planes et cylindriques lorsque isRotated est vrai](/images/rotated-geometry.jpg)

#### Géométrie des charges coniques {#conical-upload-geometry}

Ce diagramme montre comment votre image téléchargée est aplanie et recadrée en fonction des paramètres. L'image téléchargée se présente sous la forme d'un "arc-en-ciel" dans lequel les bords supérieur et inférieur de votre contenu sont alignés sur deux cercles concentriques. Si votre cible est plus étroite en haut qu'en bas, indiquez `topRadius` comme la valeur négative du rayon extérieur, et `bottomRadius` comme le rayon intérieur (positif). Pour un recadrage de paysage , définissez `geometry.isRotated : true`, et l'image aplatie subira une rotation avant l'application du recadrage.

![Diagramme montrant comment le recadrage, la rotation et l'échelle sont appliqués aux cibles d'images coniques](/images/cone-geometry.jpg)

#### Réponse {#post-response}

<span id="image-target-format">Il s'agit du format de réponse JSON standard pour les images cible.</span>

```json
{
  "name": "...",
  "uuid": "...",
  "type": "PLANAR",
  "loadAutomatically": true,
  "status": "AVAILABLE",
  "appKey": "...",
  "geometry": {
    "top": 842,
    "left": 392,
    "width": 851,
    "height": 1135,
    "isRotated": true,
    "originalWidth": 2000,
    "originalHeight": 2000
  },
  "metadata": null,
  "metadataIsJson": true,
  "originalImageUrl": "https://cdn.8thwall.com/image-target/...",
  "imageUrl": "https://cdn.8thwall.com/image-target/...",
  "thumbnailImageUrl": "https://cdn.8thwall.com/image-target/...",
  "geometryTextureUrl": "https://cdn.8thwall.com/image-target/...",
  "created": 1613508074845,
  "updated": 1613683291310
}
```

| Propriété          | Type      | Description                                                                                                                                                 |
|:------------------ |:--------- |:----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| nom                | `Chaîne`  |                                                                                                                                                             |
| uuid               | `Chaîne`  | ID unique de cette image cible                                                                                                                              |
| type               | `Chaîne`  | `pLANAIRE"`, `"CYLINDRE"`, ou `"CONIQUE"`                                                                                                                   |
| loadAutomatically  | `Booléen` |                                                                                                                                                             |
| statut             | `Chaîne`  | `aVAILABLE"` ou `"TAKEN_DOWN" (disponible)`                                                                                                                 |
| appKey             | `Chaîne`  | L'application à laquelle appartient la cible                                                                                                                |
| géométrie          | `Objet`   | Voir ci-dessous                                                                                                                                             |
| métadonnées        | `Chaîne`  |                                                                                                                                                             |
| metadataIsJson     | `Booléen` |                                                                                                                                                             |
| originalImageUrl   | `Chaîne`  | URL CDN pour l'image source qui a été chargée                                                                                                               |
| imageUrl           | `Chaîne`  | Version recadrée de `geometryTextureUrl`                                                                                                                    |
| thumbnailImageUrl  | `Chaîne`  | version haute de 350px de`l'imageUrl` à utiliser dans les vignettes                                                                                         |
| geometryTextureUrl | `Chaîne`  | Pour les coniques, il s'agit d'une version aplatie de l'image originale, pour les planaires et les cylindriques, c'est la même chose que `originalImageUrl` |
| créé               | entier    | Date de création en millisecondes après l'époque Unix                                                                                                       |
| mis à jour         | entier    | Date de la dernière mise à jour en millisecondes après l'époque unix                                                                                        |

#### Géométrie planaire {#planar-geometry}

| Propriété         | Type    | Description                    |
|:----------------- |:------- |:------------------------------ |
| sommet            | entier  |                                |
| gauche            | entier  |                                |
| largeur           | entier  |                                |
| hauteur           | entier  |                                |
| isRotated         | Booléen |                                |
| largeur originale | entier  | Largeur de l'image chargée     |
| hauteur originale | entier  | Hauteur de l'image téléchargée |

#### Cylindre ou géométrie conique {#cylinder-or-conical-geometry}

Étend les propriétés de la géométrie planaire en précisant que `originalWidth` et `originalHeight` font référence aux dimensions de l'image aplatie stockée dans geometryTextureUrl.

| Propriété                    | Type     | Description                                                                                                                                               |
|:---------------------------- |:-------- |:--------------------------------------------------------------------------------------------------------------------------------------------------------- |
| topRadius                    | flotteur |                                                                                                                                                           |
| rayon du bas                 | flotteur |                                                                                                                                                           |
| coniness                     | flotteur | Toujours 0 pour le type `: CYLINDRE`, dérivé de `topRadius`/`bottomRadius` pour `type : CONIQUE`                                                          |
| cylindreCirconférenceTop     | flotteur | La circonférence du cercle complet tracé par le bord supérieur de votre cible                                                                             |
| targetCircumferenceTop       | flotteur | La longueur du bord supérieur de votre cible avant le recadrage                                                                                           |
| cylinderCircumferenceBottom  | flotteur | Dérivé de `cylinderCircumferenceTop` et `topRadius`/`bottomRadius`                                                                                        |
| longueur du côté du cylindre | flotteur | Dérivé de `targetCircumferenceTop` et des dimensions de l'image originale                                                                                 |
| arcAngle                     | flotteur | Dérivé de `cylinderCircumferenceTop` et `targetCircumferenceTop`                                                                                          |
| mode d'entrée                | `Chaîne` | `bASIC"` ou `"ADVANCED"`. Contrôle ce que les utilisateurs voient dans la console 8th Wall, qu'il s'agisse de curseurs ou de champs de saisie de nombres. |

### Liste des images cible {#list-image-targets}

Demande d'une liste d'images cible appartenant à une application. Les résultats sont paginés, ce qui signifie que si l'application contient plus de cibles d'images que ce qui peut être renvoyé en une seule réponse, vous devrez faire plusieurs demandes pour énumérer la liste complète des images cible.

#### Requête {#list-request}

```bash
curl "https://api.8thwall.com/v1/apps/$APP_KEY/targets" -H "X-Api-Key:$SECRET_KEY"
```

| Paramètres                | Type     | Description                                                                                |
|:------------------------- |:-------- |:------------------------------------------------------------------------------------------ |
| par [Facultatif]          | `Chaîne` | Spécifie la colonne à trier. Les options sont "created", "updated", "name" ou "uuid".      |
| dir [Facultatif]          | `Chaîne` | Contrôle le sens de tri de la liste. Soit "asc", soit "desc".                              |
| start [Facultatif]        | `Chaîne` | Spécifie que la liste commence par les éléments qui ont cette valeur dans la colonne `par` |
| après [Facultatif]        | `Chaîne` | Spécifie que la liste commence immédiatement après les éléments qui ont cette valeur       |
| limite [Facultatif]       | entier   | Doit être compris entre 1 et 500                                                           |
| continuation [Facultatif] | `Chaîne` | Utilisé pour rechercher la page suivante après la requête initiale.                        |

#### Liste triée {#sorted-list}

Cette requête énumère les cibles de l'application en partant de "z" et en allant vers "a".

```bash
curl "https://api.8thwall.com/v1/apps/$APP_KEY/targets?by=name&dir=desc" -H "X-Api-Key:$SECRET_KEY"
```

#### Tris multiples {#multiple-sorts}

Vous pouvez spécifier un paramètre secondaire de "tri par" qui permet de départager les doublons dans votre premier site `par la valeur` . `uuid` est utilisé comme critère d'égalité par défaut s'il n'est pas spécifié.

```bash
curl "https://api.8thwall.com/v1/apps/$APP_KEY/targets?by=updated&by=uuid" -H "X-Api-Key:$SECRET_KEY"
```

#### Spécifiez un point de départ {#specify-a-starting-point}

Vous pouvez spécifier `début` ou `après` valeurs qui correspondent aux valeurs `par` pour spécifier votre position actuelle dans la liste. Si vous voulez que votre liste commence immédiatement après l'élément avec `mis à jour : 333` et `uuid : 777`, vous devez utiliser :

```bash
curl "https://api.8thwall.com/v1/apps/$APP_KEY/targets?by=updated&by=uuid&start=333&after=777" -H "X-Api-Key:$SECRET_KEY"
```

De cette façon, les éléments avec `mis à jour : 333` sont toujours inclus dans la page suivante si leur uuid `` vient après `777`. Si la valeur `mise à jour` d'un élément est supérieure à `333`, mais que son `uuid` est inférieur à `777`, il sera tout de même inclus dans la page suivante, car la deuxième propriété `par` n'entre en jeu qu'en cas d'égalité.

Il n'est pas possible de spécifier une valeur `après` pour le tri principal tout en fournissant une valeur `début` pour le tri subsidiaire. Par exemple, il ne serait pas valide de spécifier `?by=name&by=uuid&after=my-name-&start=333`. Il faudrait plutôt écrire`?by=name&by=uuid&after=my-name-` parce que le deuxième point de départ n'entre en jeu que lorsque le point de départ principal est inclusif (en utilisant `start`).

![Diagramme montrant comment les paramètres by, start et after spécifient le point de départ de la liste](/images/image-target-sort.png)

#### Réponse {#list-response}

Objet JSON contenant la propriété `cible`, qui est un tableau d'objets cibles d'images dans le[format standard](#image-target-format) .

Si `continuationToken` est présent, vous devrez spécifier `?continuation=[continuationToken]` dans une demande de suivi pour obtenir la page suivante des images cible.

```json
{
  "continuationToken": "...",
  "targets": [{
    "name": "...",
    "uuid": "...",
    "type": "PLANAR",
    "loadAutomatically": true,
    "status": "AVAILABLE",
    "appKey": "...",
    "geometry": {
      "top": 842,
      "left": 392,
      "width": 851,
      "height": 1135,
      "isRotated": true,
      "originalWidth": 2000,
      "originalHeight": 2000
    },
    "metadata": null,
    "metadataIsJson": true,
    "originalImageUrl": "https://cdn.8thwall.com/image-target/...",
    "imageUrl": "https://cdn.8thwall.com/image-target/...",
    "thumbnailImageUrl": "https://cdn.8thwall.com/image-target/...",
    "geometryTextureUrl": "https://cdn.8thwall.com/image-target/...",
    "created": 1613508074845,
    "updated": 1613683291310
  }, {
    "name": "...",
    "uuid": "...",
    "type": "CONICAL",
    "loadAutomatically": true,
    "status": "AVAILABLE",
    "appKey": "...",
    "geometry": {
      "top": 0,
      "left": 0,
      "width": 480,
      "height": 640,
      "originalWidth": 886,
      "originalHeight": 2048,
      "isRotated": true,
      "cylinderCircumferenceTop": 100,
      "cylinderCircumferenceBottom": 40,
      "targetCircumferenceTop": 50,
      "cylinderSideLength": 21.63,
      "topRadius": 1600,
      "bottomRadius": 640,
      "arcAngle": 180,
      "coniness": 1.3219280948873624,
      "inputMode": "BASIC"
    },
    "metadata": "{\"my-metadata\": 34534}",
    "metadataIsJson": true,
    "originalImageUrl": "https://cdn.8thwall.com/...",
    "imageUrl": "https://cdn.8thwall.com/...",
    "thumbnailImageUrl": "https://cdn.8thwall.com/...",
    "geometryTextureUrl": "https://cdn.8thwall.com/...",
    "created": 1613508074845,
    "updated": 1613683291310
  }]
}
```

### Obtenir l’image cible {#get-image-target}

#### Requête {#get-request}

```bash
curl "https://api.8thwall.com/v1/targets/$TARGET_UUID" -H "X-Api-Key:$SECRET_KEY"
```

#### Réponse {#get-response}

Objet JSON du format cible de[l'image standard](#image-target-format)

### Modifier l’image cible {#modify-image-target}

Les propriétés suivantes peuvent être modifiées :

- `nom`
- `loadAutomatically`
- `métadonnées`
- `metadataIsJson`

Les mêmes règles de validation s'appliquent que pour le [chargement initial](#create-image-target)

Pour les cibles cylindriques et coniques, les propriétés suivantes de l'objet `geometry` peuvent également être modifiées :

- `cylindreCirconférenceTop`
- `targetCircumferenceTop`
- `mode d'entrée`

Les autres propriétés géométriques de la cible seront mises à jour en conséquence.

#### Requête {#patch-request}

```bash
curl -X PATCH "https://api.8thwall.com/v1/targets/$TARGET_UUID"\N-
    -H "X-Api-Key:$SECRET_KEY"\N-
    -H "Content-Type : application/json"\N-
    --data '{"name":"new-name", "geometry: {"inputMode": "BASIC"}, "metadata" : "{}"}'
```

#### Réponse {#patch-response}

Objet JSON du format cible de[l'image standard](#image-target-format)

### Supprimer l’image cible {#delete-image-target}

#### Requête {#delete-request}

```bash
curl -X DELETE "https://api.8thwall.com/v1/targets/$TARGET_UUID" -H "X-Api-Key:$SECRET_KEY"
```

#### Réponse {#delete-response}

Une suppression réussie renvoie une réponse vide avec le code de statut `204 : Pas de contenu`.

### Aperçu de l’image cible {#preview-image-target}

Générer une URL que les utilisateurs peuvent utiliser pour prévisualiser le suivi d'une cible.

#### Requête {#preview-request}

```bash
curl "https://api.8thwall.com/v1/targets/$TARGET_UUID/test" -H "X-Api-Key:$SECRET_KEY"
```

#### Réponse {#preview-response}

```json
{
  "url": "https://8w.8thwall.app/previewit/?j=...",
  "token": "...",
  "exp": 1612830293128
}
```

| Propriété | Type     | Description                                                                                               |
|:--------- |:-------- |:--------------------------------------------------------------------------------------------------------- |
| url       | `Chaîne` | L'URL qui peut être utilisée pour prévisualiser le suivi de la cible                                      |
| jeton     | `Chaîne` | Ce jeton ne peut actuellement être utilisé que par notre application de prévisualisation.                 |
| exp       | entier   | L'heure en millisecondes à laquelle le jeton expirera. Les jetons expirent une heure après leur émission. |

La fonctionnalité de prévisualisation est destinée à être utilisée dans le contexte d'un utilisateur spécifique qui gère ou configure des images cible. Ne publiez pas les URL de prévisualisation sur un site public et ne les partagez pas avec un grand nombre d'utilisateurs.

**Meilleures pratiques pour les expériences de prévisualisation personnalisées :** L'URL de prévisualisation renvoyée par l'API est l'expérience cible de l'image de prévisualisation générique de 8th Wall. Si vous souhaitez personnaliser davantage l'interface de l'aperçu de votre cible d'image, procédez comme suit :

1. Créer un projet public 8th Wall
1. Personnalisez l'interface utilisateur de ce projet en fonction de vos spécifications
1. Chargez les images cibles que les utilisateurs veulent tester via l'API en utilisant la clé d'application du projet que vous avez créé à l'étape 1
1. Générez une URL d'image cible testable pour les utilisateurs finaux en utilisant l'URL publique du projet à l'étape 1 et un paramètre URL avec le nom de l’image cible
1. Dans le projet que vous avez créé à l'étape 1, utilisez le paramètre URL pour définir l'image cible active en utilisant call [`XR8.XrController.configure({imageTargets: ['theTargetName']})`](./xrcontroller/configure.md).

## Gestion des erreurs {#error-handling}

Si l'API rejette votre demande, la réponse sera `Content-Type : application/json`, et le corps contiendra une propriété `message` contenant une chaîne d'erreur.

## Exemple {#example}

```json
{
  "message" : "App not found : ..."
}
```

#### Codes d'état {#status-codes}

| Statut | Raison                                                                                                                                                                                                                                              |
|:------ |:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 400    | Cela peut se produire si vous avez spécifié une valeur non valide ou si vous avez fourni un paramètre qui n'existe pas.                                                                                                                             |
| 403    | Cela peut se produire si vous ne fournissez pas votre clé secrète correctement.                                                                                                                                                                     |
| 404    | L'application ou l'image cible a pu être supprimée, ou la clé de l'application ou l'UUID de la cible est incorrect. Il s'agit également du code de réponse si la clé API fournie ne correspond pas à la ressource à laquelle vous tentez d'accéder. |
| 413    | L'image chargée a été rejetée car le fichier est trop volumineux.                                                                                                                                                                                   |
| 429    | Votre clé API a dépassé la [limite de débit qui lui est associée](#limits-and-quotas).                                                                                                                                                              |
