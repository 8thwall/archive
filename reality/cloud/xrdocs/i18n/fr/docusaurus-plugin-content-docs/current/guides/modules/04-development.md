# Développement de modules

## Création d'un nouveau module {#creating-a-new-module}

Les modules vous permettent d'ajouter des actifs, des fichiers et du code modulaires et de les importer dans vos projets à l'aide d'un système de gestion des versions. Cela vous permet de concentrer le code de votre projet sur les éléments clés de différenciation et d'importer facilement des fonctionnalités communes par le biais d'un module que vous créez.

Pour créer un nouveau module dans votre espace de travail :

1. Dans le tableau de bord de votre espace de travail, cliquez sur l'onglet « Modules » :

![Onglet Modules](/images/modules-tab.jpg)

2. Dans l'onglet « Modules » du tableau de bord de l'espace de travail, cliquez sur "Créer un nouveau module »

![Onglet Modules](/images/create-new-module.jpg)

Vous pouvez également créer un nouveau module directement dans le cadre d'un projet. Dans votre projet Cloud Editor , cliquez sur le bouton "+" à côté de Modules. Cliquez ensuite sur « Créer de nouveaux modules » et suivez les instructions ci-dessous.

3. Saisissez les informations de base du module : Veuillez fournir un identifiant de module (cet identifiant apparaît dans l’URL de votre espace de travail et peut être utilisé pour référencer votre module dans le code du projet), et le titre du module. Le titre du module peut être modifié ultérieurement dans la page Paramètres du module.

4. Une fois que vous avez créé votre module, vous accédez au fichier module.js dans le Cloud Editor. A partir de là, vous pouvez commencer à développer vos modules. Vous trouverez plus de détails sur le développement des modules dans la section Développement de votre module.

## Développement d'un module {#developing-a-module}

Le développement de modules est légèrement différent du développement de projets. Les modules ne peuvent pas être exécutés seuls et ne peuvent l'être qu'après avoir été importés dans un projet. Les modules peuvent être développés dans une vue spécifique du module du Cloud Editor, ou dans le contexte d'un projet. **Les modules ne sont disponibles que pour l'espace de travail dans lequel ils ont été développés.**

Lorsque vous développez un module dans la vue spécifique du module, vous ne verrez pas de bouton « Prévisualiser » sur la navigation supérieure du Cloud Editor, car les modules ne peuvent être prévisualisés que lorsqu'ils sont importés dans un projet.

Les principaux éléments d'un module sont les suivants :

`manifest.json`

Dans `manifest.json`, vous pouvez créer des paramètres qui sont modifiables via un configurateur visuel lorsque les modules sont importés dans les projets. Votre code `module.js` peut s’inscrire aux paramètres que vous rendez disponibles dans le manifeste du module pour les modifier dynamiquement en fonction des entrées de l'utilisateur lors de la configuration du module dans le contexte d'un projet.

Le configurateur de module démarre automatiquement avec un groupe de paramètres disponible. Les groupes de paramètres peuvent être utilisés pour des divisions logiques de paramètres qui sont ensuite exprimés et regroupés visuellement lorsque vous utilisez votre module dans un projet.

1. Renommez un groupe de configuration en double-cliquant sur le titre du groupe.
2. Ajoutez un nouveau groupe de configuration en appuyant sur le bouton « Nouveau groupe de configuration ».
3. Ajoutez un paramètre à un groupe de configuration en appuyant sur « + Nouveau paramètre ».

![ModulesConfigBuilder](/images/modules-config-builder.jpg)

4. Lorsque vous créez un nouveau paramètre, vous devez lui donner un nom. Ce nom peut être utilisé dans le code du module et du projet. Il ne doit donc pas comporter d'espaces ou de caractères spéciaux.
5. Sélectionnez le type de paramètre. Les types de paramètres actuellement pris en charge incluent `Chaîne`, `Nombre`, `Booléen`, et `Ressource`.
6. Une fois que vous avez fait vos choix, appuyez sur "**Suivant**".

![ModulesParameterGroup](/images/modules-param-group.jpg)

**REMARQUE :** L'ordre des groupes de configuration et des paramètres au sein de ces groupes détermine l'ordre dans lequel est affiché aux utilisateurs lorsqu'ils utilisent un module au sein d'un projet. Vous pouvez facilement réorganiser les paramètres au sein d'un groupe, ainsi que les groupes de configuration en les faisant glisser dans l'ordre que vous souhaitez. Pour faire passer un paramètre d'un groupe à un autre, appuyez sur l'icône de la flèche sur le champ du paramètre et sélectionnez le groupe vers lequel vous voulez déplacer le paramètre dans la liste déroulante.

## Types de paramètres et options du module {#module-parameter-types--options}

Si vous créez un manifeste pour votre module, vous pourrez sélectionner différents types de paramètres à l'adresse , notamment `String`, `Number`, `Boolean`, & `Resource`. Détails sur chaque type de paramètre :

#### Chaîne {#string}

Les paramètres chaîne comportent les champs modifiables suivants :

| Champs de paramètres      | Type     | Description                                                                                                                                                                                                                                  |
| ------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Étiquette (1)             | `Chaîne` | Un nom lisible par l'homme pour votre paramètre qui sera affiché dans l'interface utilisateur de configuration lorsque le module est importé dans un projet. La valeur par défaut est générée dynamiquement en fonction du nom du paramètre. |
| Défaut \[Facultatif\] (2) | `Chaîne` | La valeur de la chaîne par défaut si aucune n'est spécifiée lorsque le module est importé dans un projet. La valeur par défaut est "".                                                                                                       |

![ModulesParameterString](/images/modules-param-string.jpg)

#### Nombre {#number}

Les paramètres de numérotation comportent les champs modifiables suivants :

| Champs de paramètres      | Type     | Description                                                                                                                                                                                                                                  |
| ------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Étiquette (1)             | `Chaîne` | Un nom lisible par l'homme pour votre paramètre qui sera affiché dans l'interface utilisateur de configuration lorsque le module est importé dans un projet. La valeur par défaut est générée dynamiquement en fonction du nom du paramètre. |
| Défaut \[Facultatif\] (2) | `Nombre` | Valeur numérique par défaut si aucune n'est spécifiée lors de l'importation du module dans un projet. La valeur par défaut est `zéro`.                                                                                                       |
| Min \[Facultatif\] (3)    | `Nombre` | La valeur maximale du nombre qu'un utilisateur peut saisir lorsque le module est importé dans un projet. La valeur par défaut est `zéro`.                                                                                                    |
| Max \[Facultatif\] (4)    | `Nombre` | La valeur minimale du nombre qu'un utilisateur peut saisir lorsque le module est importé dans un projet. La valeur par défaut est `zéro`.                                                                                                    |

![ModulesParameterNumber](/images/modules-param-number.jpg)

#### Booléen {#boolean}

Les paramètres booléens comportent les champs modifiables suivants :

| Champs de paramètres                 | Type      | Description                                                                                                                                                                                                                                  |
| ------------------------------------ | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Étiquette (1)                        | `Chaîne`  | Un nom lisible par l'homme pour votre paramètre qui sera affiché dans l'interface utilisateur de configuration lorsque le module est importé dans un projet. La valeur par défaut est générée dynamiquement en fonction du nom du paramètre. |
| Défaut \[Facultatif\] (2)            | `Booléen` | Valeur booléenne par défaut si aucune n'est spécifiée lors de l'importation du module dans un projet. La valeur par défaut est `false`.                                                                                                      |
| Étiquette si vrai \[facultatif\] (3) | `Chaîne`  | L'étiquette de l'option booléenne vraie qui sera affichée dans l'interface utilisateur de configuration lorsque le module est importé dans un projet. La valeur par défaut est `true`.                                                       |
| Étiquette si Faux \[Facultatif\] (4) | `Chaîne`  | L'étiquette de l'option booléenne false qui sera affichée dans l'interface utilisateur de configuration lorsque le module est importé dans un projet. La valeur par défaut est `false`.                                                      |

![ModulesParameterBoolean](/images/modules-param-boolean.jpg)

#### Ressources {#resource}

Les paramètres des ressources comportent les champs modifiables suivants :

| Champs de paramètres                              | Type              | Description                                                                                                                                                                                                                                  |
| ------------------------------------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Étiquette (1)                                     | `Chaîne`          | Un nom lisible par l'homme pour votre paramètre qui sera affiché dans l'interface utilisateur de configuration lorsque le module est importé dans un projet. La valeur par défaut est générée dynamiquement en fonction du nom du paramètre. |
| Autoriser aucun (2)                               | `Booléen`         | Active/désactive la possibilité de définir explicitement la ressource comme nulle à partir de l'interface utilisateur de configuration lorsque le module est importé dans le projet. La valeur par défaut est `false`.                       |
| Extensions d'actifs autorisées \[Facultatif\] (3) | Types de fichiers | Permet de télécharger les types de fichiers spécifiés via l'interface utilisateur de configuration lorsque le module est importé dans un projet. La valeur par défaut est tous les types de fichiers.                                        |
| Ressource par défaut \[Facultatif\] (4)           | Fichier           | La ressource par défaut si aucune n'est spécifiée lorsque le module est importé dans un projet. La valeur par défaut est `zéro`.                                                                                                             |

![ModulesParameterResource](/images/modules-param-resource.jpg)

`module.js`

`module.js` est le point d'entrée principal de votre module 8th Wall. Code dans `module.js` exécutera avant que le projet ne soit chargé. Vous pouvez également ajouter d'autres fichiers et actifs et les référencer dans `module.js`.

Les modules peuvent être très différents en fonction de leur objectif et de votre style de développement. En règle générale, les modules contiennent certains des éléments suivants :

## Inscription aux valeurs de configuration du module {#subscription-to-module-configuration-values}

```javascript
import {subscribe} from 'config' // config est la façon dont vous accédez aux options de votre module

subscribe((config) => {
  // Votre code fait quelque chose avec la configuration ici
})
```

## Exporter des propriétés référencées dans le code du projet {#export-properties-that-are-referenced-in-project-code}

```javascript
export {
  // Exporter les propriétés ici
}

```

`README.md`

Vous pouvez inclure un readme dans votre module en créant simplement un fichier nommé `README.md` dans le répertoire de votre module. Tout comme les readme de projets, les readme de modules peuvent être formatés à l'aide de markdown et peuvent inclure des éléments tels que des images et des vidéos.

**NOTE :** Si votre module a un readme, il sera automatiquement associé avec le module lorsque vous *déployez une version. Ce module readme approprié sera affiché dans le contexte du module en fonction *de la version du module utilisée dans le projet.

## Développer un module dans le cadre d'un projet {#developing-a-module-within-the-context-of-a-project}

Vous pouvez activer le mode développement dans le contexte d'un projet sur les modules appartenant à votre espace de travail en basculant « Mode développement » (en rouge dans l'image ci-dessous) sur la page de configuration du module. Une fois le mode développement activé, le code et les fichiers sous-jacents des modules deviennent visibles dans le panneau latéral gauche.

Lorsqu'un module est en mode développement dans le contexte d'un projet, vous verrez des options supplémentaires à l'adresse sur la page de configuration, notamment : les contrôles client du module (en sarcelle), un bouton de déploiement du module (en rose) et un bouton « Mode édition » pour basculer entre l'édition du contenu de la page de configuration de visuel et l'utilisation de la configuration.

![ModulesDevelopmentMode](/images/modules-development-mode.jpg)

Lorsque vous développez des modules dans le cadre d'un projet et que vous avez des modifications à apporter aux land, vous verrez un flux de land qui vous guidera à travers les modifications apportées au projet et aux modules. Vous pouvez choisir d'envoyer ou non à les modifications spécifiques aux land. Tout projet ou module comportant des modifications sur lesquelles vous travaillez doit être accompagné d'un message de validation avant que vous ne puissiez terminer votre code.

![ModulesReviewChanges](/images/modules-review-changes.jpg)

Lorsque vous développez des modules dans le contexte d'un projet et que vous avez des modifications, vous remarquerez également une mise à jour des options Abandonner et Revenir sur les modifications dans le Cloud Editor. Vous pouvez choisir d'abandonner/reprendre uniquement les modifications du projet ou les modifications de votre projet et de tous les modules en cours de développement.

## Déployer un module {#deploying-a-module}

#### Déploiement initial du module {#initial-module-deployment}

Le déploiement de modules vous permet de partager des versions stables, tout en permettant aux projets de s'abonner aux mises à jour du module au sein d'une famille de versions. Cela peut vous permettre d'envoyer automatiquement des mises à jour de modules sans rupture à vos projets.

#### Pour déployer un module pour la première fois {#deploy-a-module-for-the-first-time}

1. Si vous développez à partir de la vue spécifique du module du Cloud Editor, appuyez sur le bouton "Déployer" dans le coin supérieur droit. Si vous développez un module dans le cadre d'un projet, cliquez sur le bouton "Déployer" dans le coin supérieur droit de la page de configuration du module.

![ModulesDeploy](/images/modules-deploy.jpg)

2. Validez le titre de votre module.
3. Sélectionnez le commit souhaité pour la version de votre module.
4. Rédigez une description de la fonctionnalité initiale du module dans la section Notes de mise à jour. Cette section accepte le formatage markdown.
5. Cliquez sur "Suivant".

![ModulesDeployInitialVersion](/images/modules-deploy-initial-version.jpg)

6. Vous pouvez également ajouter une description du module et/ou une image de couverture. La description du module et l'image de couverture sont affichées dans le flux d'importation du module lors de l'intégration d'un module dans un projet. L'ajout d'une description et d'une image de couverture peut aider à différencier le module et à donner aux autres membres de votre espace de travail un contexte pour l'utilisation du module.
7. Cliquez sur "Déployer".

![ModulesDeployInitialVersion2](/images/modules-deploy-initial-version2.jpg)

## Déployer les mises à jour des modules {#deploying-module-updates}

Le déploiement des mises à jour de modules est similaire au déploiement d'un module pour la première fois, avec deux options de déploiement supplémentaires.

1. **Type de version**: Lors du déploiement d'une mise à jour d'un module, vous serez invité à choisir si la mise à jour est une correction de bug, une nouvelle fonctionnalité ou une version majeure.
    * **Correction de Bug**: A sélectionner pour le code remanié et les corrections de problèmes existants. Les projets dont les modules sont inscrits aux corrections de bugs ou aux nouvelles fonctionnalités recevront automatiquement une mise à jour lorsqu'une nouvelle version du module de correction de bugs est disponible.
    * **Nouvelles fonctionnalités**: Doit être sélectionné lorsque vous avez ajouté des fonctionnalités supplémentaires à votre module. Les projets dont les modules sont abonnés à Nouvelles fonctionnalités recevront automatiquement une mise à jour lorsqu'une nouvelle version du module Nouvelles fonctionnalités est disponible.
    * **Version majeure**: Doit être sélectionné pour les changements. Les projets comportant des modules ne reçoivent pas de mises à jour automatiques pour les versions majeures.
2. **Marquer comme pré-version**: Après avoir sélectionné un type de version, vous pouvez marquer la version comme étant une pré-version. Ceci ajoutera un badge de préversion pour notifier aux autres utilisateurs que la version du module est une préversion, si le type de version est Correction de Bug ou Nouvelles Fonctionnalités, les projets ne recevront pas non plus de mise à jour automatique tant qu'une version est marquée comme préversion. Pour utiliser une préversion dans un module importé dans votre projet, sélectionnez manuellement la préversion à partir de la cible d'épinglage de version.

![ModulesDeployNewVersion](/images/modules-deploy-new-version.jpg)

## Préversion du module d'édition {#edit-module-pre-release}

Lorsqu'une préversion est active, vous pouvez continuer à la mettre à jour jusqu'à ce que vous promouviez la préversion ou l'abandonniez.

**Pour éditer un module préversion**:

1. Si vous développez à partir de la vue spécifique du module du Cloud Editor après avoir préalablement défini une nouvelle version en tant que préversion, appuyez sur le bouton "Déployer" dans le coin supérieur droit. Si vous développez un module dans le contexte d'un projet après avoir préalablement défini une nouvelle version en tant que pré-version , cliquez sur le bouton "Déployer" dans le coin supérieur droit de la page de configuration du module.

![ModulesDeploy2](/images/modules-deploy.jpg)

2. Sélectionnez un nouveau commit pour votre préversion ou conservez le commit actuel.
3. Modifiez la description de la fonctionnalité de la version du module dans la section Notes de mise à jour. Cette section accepte le formatage markdown.
4. Cochez la case « Promouvoir la publication » si vous êtes prêt à convertir votre préversion en version standard.
5. Appuyez sur "Abandonner la pré-publication" pour supprimer la pré-publication. Cette option est généralement utilisée pour sélectionner un type de version différent de celui de la préversion (par exemple, passer de la correction de bugss à une version majeure avec des changements radicaux). Les projets dont les modules sont actuellement épinglés à la préversion continueront à fonctionner avec la préversion jusqu'à ce qu'ils reçoivent une mise à jour souscrite ou qu'ils soient modifiés manuellement.
6. Le bouton « Déployer » met à disposition les modifications apportées à la préversion (soit en mettant à jour la préversion, soit en promouvant la préversion si cette case est cochée) :

![ModulesEditPreleaseDeploy](/images/modules-edit-pre-release.jpg)