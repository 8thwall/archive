---
id: simulator
sidebar_position: 5
---

# Simulateur

## Aperçu

Lancez le simulateur pour jouer votre scène. Vous pouvez apporter des modifications aux entités de votre espace et
les voir immédiatement reflétées dans le simulateur. Le simulateur vous permet également de tester et de visualiser les modifications apportées au projet en fonction de la taille de la fenêtre de visualisation de l'appareil et de
simuler des environnements réels sans avoir à quitter Studio.

![Simulator1](/images/studio/studio-navigate-simulator1.png)

![Simulator2](/images/studio/studio-navigate-simulator2.png)

## Simulateur AR

Si vous développez la réalité augmentée, vous pouvez accéder à une collection de séquences de caméras préenregistrées.
Le simulateur de réalité augmentée dispose d'un certain nombre de commandes de lecture et de fonctions pratiques, comme
:

- Barre de lecture, scrubber et poignées d'entrée/sortie : Vous permettent de définir des points de boucle, ce qui vous donne un contrôle granulaire sur la séquence sélectionnée (
  ).
- Bouton de recentrage (en bas à droite) : Recentre le flux de la caméra à son point d'origine. NOTE : Recenter est également appelé sur
  à chaque fois que la séquence tourne en boucle et à chaque fois qu'une nouvelle séquence est sélectionnée.

![ARSimulator](/images/studio/studio-ar-simulator.png)

Utilisez le menu de sélection de la séquence en bas à gauche pour modifier la séquence AR. Vous pouvez utiliser le carrousel
pour passer d'une option à l'autre dans la catégorie des séquences. La mise en pause de la séquence ne fait qu'interrompre la vidéo,
vous permettant de tester les changements sur la même image. Faites glisser les poignées de lecture pour définir les points d'entrée et de sortie de la boucle.

![SimulatorSequenceSelector](/images/studio/studio-sequence-selector.png)

Le bouton de la caméra dans le coin inférieur droit ouvre l'affichage en direct, qui suit la même logique que la configuration de la caméra de votre projet. Live View vous permet de simuler votre projet en utilisant le flux de votre bureau au lieu d'une séquence AR préenregistrée. Par exemple, si
votre projet utilise Face Effects et que vous avez le projet Studio ouvert sur le bureau, il ouvrira votre caméra de bureau
.

:::note
L'affichage en direct dans le simulateur peut vous demander d'activer les autorisations relatives à la caméra, au microphone ou à l'emplacement
en fonction de ce qui est activé dans votre projet. Cliquez sur Autoriser pour les invites d'autorisation afin de
voir votre expérience en Live View.
:::

Votre projet peut avoir un aspect différent selon l'appareil utilisé, en raison des différences de taille de la fenêtre de visualisation du site web mobile
. Vous pouvez également souhaiter voir votre projet en mode paysage et en mode portrait. En haut de la page
, à gauche du simulateur, vous pouvez choisir parmi un ensemble de tailles d'affichage courantes, modifier l'orientation de
ou utiliser le mode réactif pour vous adapter à une taille personnalisée. Vous pouvez également double-cliquer sur les bords
du panneau du simulateur pour adapter automatiquement le simulateur à la largeur de la fenêtre du dispositif sélectionné
. **Remarque : les dimensions sont présentées en pixels logiques CSS (AKA viewport dimensions), et non en pixels physiques
. Lors de la sélection d'un appareil dans le sélecteur, seules les dimensions de la fenêtre
seront mises à jour, et non l'agent utilisateur du client**.

![SimulatorDeviceSelector](/images/studio/studio-device-selector.png)

Vous pouvez également simuler des coordonnées GPS spécifiques si vous développez une expérience basée sur un lieu ou une carte.

![SimulatorLocation](/images/studio/studio-simulator-location.png)
