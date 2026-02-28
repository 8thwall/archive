# Développement de modules

## Création d'un nouveau module {#creating-a-new-module}

Les modules vous permettent d'ajouter des actifs, des fichiers et du code modulaires et de les importer dans vos projets
à l'aide d'un système de gestion des versions. Cela vous permet de concentrer le code de votre projet sur les éléments clés de différenciation et
d'importer facilement des fonctionnalités communes par le biais d'un module que vous créez.

Pour créer un nouveau module dans votre espace de travail :

1. Dans le tableau de bord de votre espace de travail, cliquez sur l'onglet "Modules" :

![ModulesTab](/images/modules-tab.jpg)

2. Dans l'onglet "Modules" du tableau de bord de l'espace de travail, cliquez sur "Créer un nouveau module"

![ModulesTab](/images/create-new-module.jpg)

Vous pouvez également créer un nouveau module directement dans le cadre d'un projet. Dans votre projet Cloud Editor
, cliquez sur le bouton "+" à côté de Modules. Cliquez ensuite sur "Create New Modules" (Créer de nouveaux modules) et suivez les instructions ci-dessous (
).

3. Saisissez les informations de base du module : Veuillez fournir un ID de module (cet ID apparaît dans l'url de votre espace de travail
   et peut être utilisé pour référencer votre module dans le code du projet), et le titre du module. Le titre du module
   peut être modifié ultérieurement dans la page Paramètres du module.

4. Une fois que vous avez créé votre module, vous accédez au fichier module.js dans l'Éditeur de nuages.
   A partir de là, vous pouvez commencer à développer vos modules. Pour plus de détails sur le développement des modules, voir
   la section Développer votre module.

## Développement d'un module {#developing-a-module}

Le développement de modules est légèrement différent du développement de projets. Les modules ne peuvent pas être exécutés seuls (
) et ne peuvent l'être qu'après avoir été importés dans un projet. Les modules peuvent être développés dans une vue spécifique du module
de l'éditeur de nuages, ou dans le contexte d'un projet. \*\*Les modules ne sont disponibles que sur
pour l'espace de travail dans lequel ils ont été développés.

Lorsque vous développez un module dans la vue spécifique du module, vous ne verrez pas de bouton "Prévisualiser" sur la navigation supérieure
de l'éditeur de cloud, car les modules ne peuvent être prévisualisés que lorsqu'ils sont importés dans un projet.

Les principaux éléments d'un module sont les suivants

`manifest.json`

Dans `manifest.json`, vous pouvez créer des paramètres qui sont éditables via un configurateur visuel lorsque les modules
sont importés dans les projets. Votre code `module.js` peut souscrire aux paramètres que vous rendez
disponibles dans le manifeste du module pour changer dynamiquement en fonction des entrées de l'utilisateur lors de la configuration du module
dans le contexte d'un projet.

Le configurateur de module démarre automatiquement avec un groupe de paramètres disponible. Les groupes de paramètres
peuvent être utilisés pour des divisions logiques de paramètres qui sont ensuite exprimés et regroupés visuellement lorsque
utilise votre module dans un projet.

1. Renommer un groupe de configuration en double-cliquant sur le titre du groupe.
2. Ajoutez un nouveau groupe de configuration en appuyant sur le bouton "Nouveau groupe de configuration".
3. Ajouter un paramètre à un groupe de configuration en appuyant sur "+ Nouveau paramètre".

![ModulesConfigBuilder](/images/modules-config-builder.jpg)

4. Lorsque vous créez un nouveau paramètre, vous devez lui donner un nom. Ce nom peut être utilisé dans le code du module et du projet
   . Il ne doit donc pas comporter d'espaces ou de caractères spéciaux.
5. Sélectionnez le type de paramètre. Les types de paramètres actuellement supportés sont
   `String`, `Number`, `Boolean`, & `Resource`.
6. Une fois que vous avez fait vos choix, appuyez sur "**Suivant**".

![ModulesParameterGroup](/images/modules-param-group.jpg)

\*\*L'ordre des groupes de configuration et des paramètres au sein de ces groupes détermine l'ordre dans lequel
est affiché aux utilisateurs lors de l'utilisation d'un module dans le cadre d'un projet. Vous pouvez facilement réorganiser les paramètres
au sein d'un groupe, ainsi que les groupes de configuration en les faisant glisser dans l'ordre que vous souhaitez. Pour
faire passer un paramètre d'un groupe à un autre, appuyez sur l'icône de la flèche dans le champ du paramètre et
sélectionnez le groupe dans lequel vous voulez déplacer le paramètre dans la liste déroulante.

## Types de paramètres et options du module {#module-parameter-types--options}

Si vous créez un manifeste pour votre module, vous pourrez choisir parmi les différents types de paramètres de
, y compris `String`, `Number`, `Boolean`, et `Resource`. Détails sur chaque type de paramètre
:

#### Chaîne {#string}

Les paramètres de type "chaîne" comportent les champs modifiables suivants :

| Champs de paramètres                                                                           | Type     | Description                                                                                                                                                                                                                                                                  |
| ---------------------------------------------------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Étiquette (1)                                                               | `Chaîne` | Un nom lisible par l'homme pour votre paramètre qui sera affiché dans l'interface utilisateur de configuration lorsque le module est importé dans un projet. La valeur par défaut est générée dynamiquement en fonction du nom du paramètre. |
| Défaut [Facultatif] (2) | `Chaîne` | La valeur de la chaîne par défaut si aucune n'est spécifiée lorsque le module est importé dans un projet. La valeur par défaut est "".                                                                                                       |

![ModulesParameterString](/images/modules-param-string.jpg)

#### Numéro {#number}

Les paramètres de numérotation comportent les champs modifiables suivants :

| Champs de paramètres                                                                           | Type     | Description                                                                                                                                                                                                                                                                  |
| ---------------------------------------------------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Étiquette (1)                                                               | `Chaîne` | Un nom lisible par l'homme pour votre paramètre qui sera affiché dans l'interface utilisateur de configuration lorsque le module est importé dans un projet. La valeur par défaut est générée dynamiquement en fonction du nom du paramètre. |
| Défaut [Facultatif] (2) | `Nombre` | Valeur numérique par défaut si aucune n'est spécifiée lors de l'importation du module dans un projet. La valeur par défaut est `null`.                                                                                                       |
| Min [Facultatif] (3)    | `Nombre` | La valeur maximale du nombre qu'un utilisateur peut saisir lorsque le module est importé dans un projet. La valeur par défaut est `null`.                                                                                                    |
| Max [Facultatif] (4)    | `Nombre` | La valeur minimale du nombre qu'un utilisateur peut saisir lorsque le module est importé dans un projet. La valeur par défaut est `null`.                                                                                                    |

![ModulesParameterNumber](/images/modules-param-number.jpg)

#### Booléen {#boolean}

Les paramètres booléens comportent les champs modifiables suivants :

| Champs de paramètres                                                                                      | Type      | Description                                                                                                                                                                                                                                                                  |
| --------------------------------------------------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Étiquette (1)                                                                          | `Chaîne`  | Un nom lisible par l'homme pour votre paramètre qui sera affiché dans l'interface utilisateur de configuration lorsque le module est importé dans un projet. La valeur par défaut est générée dynamiquement en fonction du nom du paramètre. |
| Défaut [Facultatif] (2)            | `Booléen` | Valeur booléenne par défaut si aucune n'est spécifiée lors de l'importation du module dans un projet. La valeur par défaut est `false`.                                                                                                      |
| Étiquette si vrai [facultatif] (3) | `Chaîne`  | L'étiquette de l'option booléenne vraie qui sera affichée dans l'interface utilisateur de configuration lorsque le module est importé dans un projet. La valeur par défaut est `true`.                                                       |
| Étiquette si Faux [Facultatif] (4) | `Chaîne`  | L'étiquette de l'option booléenne false qui sera affichée dans l'interface utilisateur de configuration lorsque le module est importé dans un projet. La valeur par défaut est `false`.                                                      |

![ModulesParameterBoolean](/images/modules-param-boolean.jpg)

#### Ressources {#resource}

Les paramètres des ressources comportent les champs modifiables suivants :

| Champs de paramètres                                                                                                   | Type              | Description                                                                                                                                                                                                                                                                  |
| ---------------------------------------------------------------------------------------------------------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Étiquette (1)                                                                                       | `Chaîne`          | Un nom lisible par l'homme pour votre paramètre qui sera affiché dans l'interface utilisateur de configuration lorsque le module est importé dans un projet. La valeur par défaut est générée dynamiquement en fonction du nom du paramètre. |
| Autoriser aucun (2)                                                                                 | `Booléen`         | Active/désactive la possibilité de définir explicitement la ressource comme nulle à partir de l'interface utilisateur de configuration lorsque le module est importé dans le projet. La valeur par défaut est `false`.                       |
| Extensions d'actifs autorisées [Facultatif] (3) | Types de fichiers | Permet de télécharger les types de fichiers spécifiés via l'interface utilisateur de configuration lorsque le module est importé dans un projet. La valeur par défaut est tous les types de fichiers.                                        |
| Ressource par défaut [Facultatif] (4)           | Fichier           | La ressource par défaut si aucune n'est spécifiée lorsque le module est importé dans un projet. La valeur par défaut est `null`.                                                                                                             |

![ModulesParameterResource](/images/modules-param-resource.jpg)

`module.js`

`module.js` est le point d'entrée principal de votre module 8th Wall. Le code contenu dans `module.js` sera exécuté sur
avant que le projet ne soit chargé. Vous pouvez également ajouter d'autres fichiers et actifs et les référencer dans
`module.js`.

Les modules peuvent être très différents en fonction de leur objectif et de votre style de développement. En règle générale, les modules
contiennent certains des éléments suivants :

## Abonnement aux valeurs de configuration du module {#subscription-to-module-configuration-values}

```javascript
import {subscribe} from 'config' // config est la façon dont vous accédez aux options de votre module

subscribe((config) => {
  // Votre code fait quelque chose avec la configuration ici
})
```

## Exporter les propriétés référencées dans le code du projet {#export-properties-that-are-referenced-in-project-code}

```javascript
export {
  // Exporter les propriétés ici
}

```

`README.md`

Vous pouvez inclure un readme dans votre module simplement en créant un fichier nommé `README.md` dans le répertoire de votre module
. Tout comme les readme de projets, les readmes de modules peuvent être formatés à l'aide de markdown et peuvent
inclure des éléments tels que des images et des vidéos.

**NOTE:** Si votre module a un readme, il sera automatiquement empaqueté avec le module lorsque vous
\*déployez une version. Ce readme de module approprié sera affiché dans le contexte du module en fonction
\*de la version du module utilisée dans le projet.

## Développer un module dans le cadre d'un projet {#developing-a-module-within-the-context-of-a-project}

Vous pouvez activer le mode développement dans le contexte d'un projet sur les modules appartenant à votre espace de travail
en basculant "Mode développement" (en rouge dans l'image ci-dessous) sur la page de configuration du module.
Une fois le mode développement activé, le code et les fichiers sous-jacents des modules deviennent visibles dans le panneau latéral gauche de
.

Lorsqu'un module est en mode développement dans le contexte d'un projet, vous verrez des options supplémentaires à l'adresse
sur la page de configuration, notamment : des contrôles client de module (en sarcelle), un bouton de déploiement de module
(en rose) et un bouton "Mode édition" pour basculer entre l'édition du contenu de la page de configuration de visual
et l'utilisation de la configuration.

![ModulesDevelopmentMode](/images/modules-development-mode.jpg)

Lorsque vous développez des modules dans le cadre d'un projet et que vous devez modifier des terres, vous verrez
un flux de terres qui vous guidera à travers les modifications du projet et des modules. Vous pouvez choisir d'envoyer ou non à
les modifications spécifiques aux terres. Tout projet ou module comportant des modifications que vous êtes en train d'atterrir doit être accompagné d'un message de validation
avant que vous ne puissiez terminer l'atterrissage de votre code.

![ModulesReviewChanges](/images/modules-review-changes.jpg)

Lorsque vous développez des modules dans le contexte d'un projet et que vous avez des modifications, vous remarquerez également une mise à jour des options Abandonner et Revenir sur les modifications dans l'éditeur de nuages. Vous pouvez choisir d'abandonner/reprendre uniquement les modifications du projet ou les modifications de votre projet et de tous les modules en cours de développement.

## Déploiement d'un module {#deploying-a-module}

#### Déploiement initial du module {#initial-module-deployment}

Le déploiement de modules vous permet de partager des versions stables, tout en permettant aux projets de s'abonner aux mises à jour du module
au sein d'une famille de versions. Cela peut vous permettre d'envoyer automatiquement des mises à jour de modules sans rupture à
vos projets.

#### Pour déployer un module pour la première fois {#deploy-a-module-for-the-first-time}

1. Si vous développez à partir de la vue spécifique du module de l'éditeur de nuages, appuyez sur le bouton "Déployer" dans le coin supérieur droit. Si vous développez un module dans le cadre d'un projet, cliquez sur le bouton "Déployer" dans le coin supérieur droit de la page de configuration du module.

![ModulesDeploy](/images/modules-deploy.jpg)

2. Validez le titre de votre module.
3. Sélectionnez le commit souhaité pour la version de votre module.
4. Rédigez une description de la fonctionnalité initiale du module dans la section Notes de mise à jour. Cette section accepte le formatage markdown.
5. Cliquez sur "Suivant".

![ModulesDeployInitialVersion](/images/modules-deploy-initial-version.jpg)

6. Il est possible d'ajouter une description du module et/ou une image de couverture. La description du module et l'image de couverture sont affichées dans le flux d'importation du module lors de l'intégration d'un module dans un projet. L'ajout d'une description et d'une image de couverture peut aider à différencier le module et à donner aux autres membres de votre espace de travail un contexte pour l'utilisation du module.
7. Cliquez sur "Déployer".

![ModulesDeployInitialVersion2](/images/modules-deploy-initial-version2.jpg)

## Déploiement des mises à jour des modules {#deploying-module-updates}

Le déploiement des mises à jour de modules est similaire au déploiement d'un module pour la première fois, avec deux options de déploiement supplémentaires
.

1. **Type de version** : Lors du déploiement d'une mise à jour de module, vous serez invité à choisir s'il s'agit d'une correction de bogue, d'une nouvelle fonctionnalité ou d'une version majeure.
   - **Réparation de bogues** : Doit être sélectionné pour le code remanié et les corrections de problèmes existants. Les projets dont les modules sont abonnés aux corrections de bugs ou aux nouvelles fonctionnalités recevront automatiquement une mise à jour lorsqu'une nouvelle version du module de correction de bugs est disponible.
   - **Nouvelles fonctionnalités** : Cette option doit être sélectionnée lorsque vous avez ajouté des fonctionnalités supplémentaires à votre module. Les projets dont les modules sont abonnés à Nouvelles fonctionnalités recevront automatiquement une mise à jour lorsqu'une nouvelle version du module Nouvelles fonctionnalités sera disponible.
   - **Major Release** : Doit être sélectionnée pour les changements importants. Les projets comportant des modules ne reçoivent pas de mises à jour automatiques pour les versions majeures.
2. **Set as Pre-Release** : Après avoir sélectionné un type de version, vous pouvez marquer la version comme étant une pré-version.
   Ceci ajoutera un badge de préversion pour notifier aux autres utilisateurs que la version du module est une préversion, si
   le type de version est Bug Fixes ou New Features les projets ne recevront pas non plus de mise à jour automatique
   tant qu'une version est marquée comme préversion. Pour utiliser une version pre-release dans un module importé
   dans votre projet, sélectionnez manuellement la version pre-release à partir de la cible d'épinglage de version.

![ModulesDeployNewVersion](/images/modules-deploy-new-version.jpg)

## Edit Module Pre-Release {#edit-module-pre-release}

Lorsqu'une préversion est active, vous pouvez continuer à la mettre à jour jusqu'à ce que vous
promouviez la préversion ou l'abandonniez.

**Pour éditer un module avant sa sortie** :

1. Si vous développez à partir de la vue spécifique du module de l'éditeur de cloud après avoir préalablement défini une nouvelle version de
   en tant que préversion, appuyez sur le bouton "Déployer" dans le coin supérieur droit. Si vous développez
   un module dans le contexte d'un projet après avoir préalablement défini une nouvelle version en tant que pré-version
   , cliquez sur le bouton "Déployer" dans le coin supérieur droit de la page de configuration du module.

![ModulesDeploy2](/images/modules-deploy.jpg)

2. Sélectionnez un nouveau commit pour votre préversion ou conservez le commit actuel.
3. Modifier la description de la fonctionnalité de la version du module dans la section Notes de mise à jour. Cette section accepte le formatage markdown.
4. Cochez la case "Promouvoir en version" si vous êtes prêt à convertir votre préversion en version standard.
5. Appuyez sur "Abandonner la pré-certification" pour supprimer la pré-certification. Cette option est généralement utilisée pour sélectionner un type de version différent de celui de la préversion (par exemple, passer de la correction de bogues à une version majeure avec des changements radicaux). Les projets dont les modules sont actuellement épinglés à la préversion continueront à fonctionner avec la préversion jusqu'à ce qu'ils reçoivent une mise à jour souscrite ou qu'ils soient modifiés manuellement.
6. Le bouton "Déployer" rend disponibles les modifications apportées à la préversion (soit en mettant à jour la préversion, soit en promouvant la préversion si cette case est cochée) :

![ModulesEditPreReleaseDeploy](/images/modules-edit-pre-release.jpg)