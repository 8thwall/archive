---
id: advanced-analytics
---

# Analyse avancée

Les projets 8th Wall fournissent des [analyses d'utilisation de base] (/legacy/guides/projects/usage-and-recent-trends),
vous permettant de voir combien de "vues" votre projet a reçues, ainsi que le temps moyen passé par les utilisateurs
. Si vous souhaitez obtenir des analyses personnalisées ou plus détaillées, nous vous recommandons d'ajouter à votre projet des outils d'analyse Web de tierce partie (
).

Le processus d'ajout d'analyses à un projet est le même que pour tout site web non AR
.  Vous pouvez utiliser la solution analytique de votre choix.

Dans cet exemple, nous allons vous expliquer comment ajouter Google Analytics à votre projet 8th Wall à l'aide de Google Tag
Manager (GTM) - ce qui facilitera la collecte d'analyses personnalisées sur la façon dont les utilisateurs consultent votre projet et interagissent avec lui à l'adresse
.

Grâce à l'interface utilisateur Web de GTM, vous pouvez définir des balises et créer des déclencheurs qui font en sorte que la balise
se déclenche lorsque certains événements se produisent. Dans votre projet 8th Wall, déclenchez des événements (à l'aide d'une seule ligne de Javascript
) aux endroits souhaités dans votre code.

## Analytique Pré-requis {#analytics-pre-requisites}

Vous devez déjà avoir des comptes Google Analytics et Google Tag Manager et avoir une compréhension de base de leur fonctionnement.

Pour plus d'informations, veuillez consulter la documentation Google suivante :

- Google Analytics 4
  - Démarrage : <https://support.google.com/analytics/answer/9304153>
  - Ajouter un flux de données : <https://support.google.com/analytics/answer/9304153#stream>
- Google Tag Manager
  - Aperçu : <https://support.google.com/tagmanager/answer/6102821>
  - Configuration et installation : <https://support.google.com/tagmanager/answer/6103696>

## Ajoutez Google Tag Manager à votre projet 8th Wall {#add-google-tag-manager-to-your-8th-wall-project}

1. Sur la page Espace de travail de votre conteneur Tag Manager, cliquez sur l'ID de votre conteneur (par exemple
   "**GTM-XXXXXX**") pour ouvrir la boîte de dialogue "Installer Google Tag Manager".  Cette fenêtre contient le code que
   vous devrez ajouter ultérieurement à votre projet 8th Wall.

![GTM1](/images/gtm1.jpg)

2. Ouvrez le 8th Wall Cloud Editor et collez le bloc de code **top** dans **head.html** :

![GTM2](/images/gtm2.jpg)

3. Cliquez sur "+" à côté de Files, et créez un nouveau fichier appelé **gtm.html**, puis collez le contenu du bloc de code
   the **bottom** dans ce fichier :

![GTM3](/images/gtm3.jpg)

4. Ajoutez le code suivant au début du fichier app.js :

```javascript
import * as googleTagManagerHtml from './gtm.html'
document.body.insertAdjacentHTML('afterbegin', googleTagManagerHtml)
```

## Configurer Google Tag Manager {#configure-google-tag-manager}

1. Localisez l'[ID de mesure Google] (https://support.google.com/analytics/answer/12270356) pour votre flux de données.
2. Dans le GTM, [créer une configuration GA4](https://support.google.com/tagmanager/answer/9442095#config) tag.

Exemple :

![GTM8](/images/gtm8.jpg)

## Suivi des pages vues {#tracking-page-views}

Les pages vues seront automatiquement suivies par le biais de la balise de configuration GA4. Voir [Configurer Google Tag Manager] (/legacy/guides/advanced-topics/advanced-analytics/#configure-google-tag-manager) pour plus d'informations.

## Suivi des événements personnalisés {#tracking-custom-events}

GTM offre également la possibilité de déclencher des événements lorsque des actions personnalisées ont lieu **à l'intérieur** de l'expérience WebAR
. Ces événements sont propres à votre projet WebAR, mais en voici quelques exemples :

- Placement d'un objet 3D
- Image Cible trouvée
- Capture d'écran réalisée
- etc…

Dans cet exemple, nous allons créer une balise (avec déclencheur) et l'ajouter au projet d'exemple
["AFrame : Place Ground"](https://www.8thwall.com/8thwall/placeground-aframe) que
déclenche à chaque fois qu'un modèle 3D est créé.

#### Créer des déclencheurs d'événements personnalisés {#create-custom-event-trigger}

- Type de déclencheur : **Événement personnalisé**
- Nom de l'événement : **placeModel**
- Ce déclencheur se déclenche sur : **Tous les événements personnalisés**

![GTM6](/images/gtm6.jpg)

#### Créer une étiquette {#create-tag-1}

Ensuite, créez une balise qui se déclenchera lorsque le déclencheur "placeModel" sera activé dans votre code.

- Tag Type : **Google Analytics : GA4 Event**
- Configuration Tag : (Sélectionner la configuration créée précédemment)
- Nom de l'événement : **Modèle de lieu**
- Déclenchement : **Sélectionnez le déclencheur "placeModel" créé à l'étape précédente**.

![GTM9](/images/gtm9.jpg)

**IMPORTANT** :  Assurez-vous de sauvegarder tous les triggers/tags créés et ensuite **Submit/Publish** vos paramètres
dans l'interface GTM pour qu'ils soient actifs. Voir <https://support.google.com/tagmanager/answer/6107163>

#### Incendie à l'intérieur du projet 8th Wall {#fire-event-inside-8th-wall-project}

Dans votre projet 8th Wall, ajoutez la ligne de javascript suivante pour déclencher ce trigger à l'endroit souhaité dans votre code :

`window.dataLayer.push({event: 'placeModel'})`

##### Exemple - basé sur <https://www.8thwall.com/8thwall/placeground-aframe/master/tap-place.js> {#example---based-on-httpswww8thwallcom8thwallplaceground-aframemastertap-placejs}

```javascript
export const tapPlaceComponent = {
  init : function() {
    const ground = document.getElementById('ground')
    ground.addEventListener('click', event => {
      // Créer une nouvelle entité pour le nouvel objet
      const newElement = document.createElement('a-entity')

      // Le raycaster donne un emplacement au toucher dans la scène
      const touchPoint = event.detail.intersection.point
      newElement.setAttribute('position', touchPoint)

      const randomYRotation = Math.random() * 360
      newElement.setAttribute('rotation', '0 ' + randomYRotation + ' 0')

      newElement.setAttribute('visible', 'false')
      newElement.setAttribute('scale', '0.0001 0.0001 0.0001')

      newElement.setAttribute('shadow', {
        receive: false,
      })

      newElement.setAttribute('class', 'cantap')
      newElement.setAttribute('hold-drag', '')

      newElement.setAttribute('gltf-model', '#treeModel')
      this.el.sceneEl.appendChild(newElement)

      newElement.addEventListener('model-loaded', () => {
        // Une fois le modèle chargé, nous sommes prêts à le faire apparaître à l'aide d'une animation
        newElement.setAttribute('visible', 'true')
        newElement.setAttribute('animation', {
          property : 'scale',
          to : '7 7 7',
          easing : 'easeOutElastic',
          dur : 800,
        })

        // **************************************************
        // Lance l'événement Google Tag Manager une fois le modèle chargé
        // **************************************************
        window.dataLayer.push({event: 'placeModel'})
      })
    })
  }
}
```
