---
id: simulator
sidebar_position: 2
---

# Simulateur

Lorsque vous jouez votre scène, elle connecte une instance du Simulateur. Le simulateur reflétera à distance
les changements effectués dans la fenêtre de visualisation.

![Simulator1](/images/studio/studio-navigate-simulator1.png)

Le simulateur vous permet de tester et de visualiser les modifications apportées à un projet en fonction de la taille de l'écran de l'appareil et de l'environnement réel simulé (
), sans avoir à quitter Studio. Le simulateur fonctionne en exécutant
le 8th Wall AR Engine en temps réel sur la collection incluse de séquences AR préenregistrées.
Vous pouvez ouvrir autant d'instances du simulateur que vous le souhaitez, ce qui vous permet de tester les changements apportés au projet dans un éventail de scénarios diversifiés (
). Le simulateur dispose d'un certain nombre de commandes de lecture et de fonctions pratiques, comme
:

- Barre de lecture, scrubber et poignées d'entrée/sortie : Vous permettent de définir des points de boucle, ce qui vous donne un contrôle granulaire sur la séquence sélectionnée (
  ).
- Bouton de recentrage (en bas à droite) : Recentre le flux de la caméra à son point d'origine. NOTE : Recenter est également appelé sur
  à chaque fois que la séquence tourne en boucle et à chaque fois qu'une nouvelle séquence est sélectionnée.
- Bouton d'actualisation (en haut à droite) : Actualise la page en conservant le contenu mis en cache. Si vous maintenez la touche SHIFT enfoncée et que vous cliquez sur le bouton d'actualisation à l'adresse
  , vous effectuerez un rechargement complet, sans tenir compte du contenu mis en cache.

Vous pouvez simuler votre expérience à travers une série de séquences de RA différentes qui vous permettent de tester les effets de visage
, le suivi des mains, les effets de monde, l'échelle absolue, la RA partagée, et bien plus encore. Une séquence de RA comprend
les données d'enregistrement vidéo et les données enregistrées par le gyroscope ou l'orientation de l'appareil afin de simuler la RA sur
. Utilisez le menu de sélection de la séquence en bas à gauche pour modifier la séquence AR. Vous pouvez utiliser le carrousel
pour passer d'une option à l'autre dans la catégorie des séquences. La mise en pause de la séquence ne fait qu'interrompre la vidéo,
vous permettant de tester les changements sur la même image. Faites glisser les poignées de lecture pour définir les points d'entrée et de sortie de la boucle.

![Simulator2](/images/studio/studio-navigate-simulator2.png)

![SimulatorSequenceSelector](/images/simulator-sequence-selector.jpg)

Live View suit la même logique que la configuration de la caméra de votre projet, ce qui vous permet de simuler
votre projet en utilisant le flux de votre bureau au lieu d'une séquence AR préenregistrée. Par exemple, si
votre projet utilise Face Effects et que vous avez le projet Studio ouvert sur le bureau, il ouvrira votre caméra de bureau
. Remarque : Live View dans le simulateur peut vous demander d'activer les autorisations de caméra, de microphone ou de localisation
en fonction de ce qui est activé dans votre projet. Cliquez sur Autoriser pour les invites d'autorisation afin de
voir votre expérience en Live View.

Votre projet peut avoir un aspect différent selon l'appareil utilisé, en raison des différences de taille de la fenêtre de visualisation du site web mobile
. Vous pouvez également souhaiter voir votre projet en mode paysage et en mode portrait. En haut de la page
, à gauche du simulateur, vous pouvez choisir parmi un ensemble de tailles d'affichage courantes, modifier l'orientation de
ou utiliser le mode réactif pour vous adapter à une taille personnalisée. Vous pouvez également double-cliquer sur les bords
du panneau du simulateur pour adapter automatiquement le simulateur à la largeur de la fenêtre du dispositif sélectionné
. **Remarque : les dimensions sont présentées en pixels logiques CSS (AKA viewport dimensions), et non en pixels physiques
. Lors de la sélection d'un appareil dans le sélecteur, seules les dimensions de la fenêtre
seront mises à jour, et non l'agent utilisateur du client**.

![SimulatorDeviceSelector](/images/simulator-device-selector.jpg)

## Connecter un appareil

1. En bas de la fenêtre Studio, cliquez sur le bouton **Connect Device**.

2. Scannez le code QR avec votre appareil mobile pour ouvrir un navigateur web et obtenir un aperçu en direct du projet.

![GettingStartedPreview](/images/editor-preview.jpg)

**Note** : Le code QR "Preview" est un code QR
**temporaire, à usage unique**, destiné à être utilisé par le développeur pendant qu'il travaille activement sur le projet. Ce code QR
vous conduit à une URL privée, de développement, et n'est pas accessible par d'autres. Pour partager votre travail avec
, veuillez consulter la section **Publier votre projet** ci-dessous.
