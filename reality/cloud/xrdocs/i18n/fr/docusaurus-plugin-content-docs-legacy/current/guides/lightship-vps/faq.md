---
sidebar_label: FAQ
sidebar_position: 5
---

# FAQ VPS {#lightship-vps-faq}

## Qu'est-ce que Lightship VPS ? {#what-is-lightship-vps}

Lightship VPS (Visual Positioning System) est un service en nuage qui permet aux applications de localiser l'appareil d'un utilisateur
dans des lieux réels, ce qui permet aux utilisateurs d'interagir avec du contenu AR persistant et
, ce qui permet de nouvelles expériences immersives. VPS détermine la position et l'orientation de l'appareil (pose) en se référant à
aux données cartographiques qui existent dans le nuage de Niantic.

## Comment fonctionne le VPS ? {#how-does-vps-work}

Lorsqu'un appareil appelle le service VPS, le service reçoit une image de requête de l'appareil
de l'utilisateur ainsi que sa position approximative (à partir du GPS) en tant qu'entrées et tente de le localiser à l'aide de la ou des cartes
qui existent à l'endroit où il se trouve. Si la localisation est réussie, le service renvoie la position et l'orientation (pose) de l'appareil
correspondant à l'horodatage de l'image transmise par
. Comme il s'écoule un certain temps entre le moment où une image de requête VPS est capturée et celui où une réponse
est reçue du service VPS, l'appareil doit disposer d'un système de suivi des mouvements à l'adresse
afin de rester localisé avec précision lorsqu'il est en mouvement. Lorsque le service VPS renvoie une estimation de la position à l'appareil
, la différence de position du système de suivi de l'appareil est ajoutée à la réponse de localisation
afin que le VPS puisse "suivre" la façon dont l'appareil s'est déplacé en attendant la réponse du serveur
à la requête du VPS.

## Qu'est-ce qu'un scan ? {#what-is-a-scan}

Les scans AR des joueurs, des développeurs et des géomètres sont l'ingrédient fondamental utilisé pour créer la carte Niantic
: La carte du monde en 3D de Niantic. Les scans AR sont enregistrés et téléchargés à l'aide du cadre de scannage AR
de Niantic, un module utilisé dans Pokemon Go, Ingress et l'application Wayfarer. Chaque scan AR
consiste en une série d'images vidéo avec des données complémentaires provenant d'accéléromètres et de capteurs GPS
qui construisent un modèle 3D du monde à partir de plusieurs images 2D. Les scans AR sont utilisés par Niantic pour
construire des cartes et des maillages de lieux réels.

## Qu'est-ce qu'une carte ? {#what-is-a-map}

Dans le jargon du SPV, une carte est l'artefact de données utilisé pour localiser votre appareil lorsque l'API du SPV est appelée à l'adresse
. Une carte peut être considérée comme une fonction qui prend une image d'interrogation en entrée et renvoie
la position et l'orientation (pose) en sortie. La carte correspondant à un lieu donné est créée
à partir des scans qui ont été téléchargés à cet endroit. Les cartes VPS ne sont pas lisibles par l'homme.

## Qu'est-ce qu'une maille ? {#what-is-a-mesh}

Dans le langage du SPV, un maillage est un modèle 3D d'un lieu ou d'un objet réel. Les maillages fournissent une représentation détaillée
d'un espace ou d'un objet physique, et sont utiles pour comprendre à quoi ressemble un lieu
, comme référence pour la création de contenu AR, et pour créer des effets physiques et d'occlusion. Comme les cartes
, les maillages qui correspondent à un lieu donné sont créés à partir des scans qui ont été téléchargés à
ce lieu. Les maillages sont lisibles à la fois par l'homme et par la machine.

## Où puis-je utiliser un VPS ? {#where-can-i-use-vps}

Le SPV est disponible dans plus de 150 000 lieux dans le monde réel, et de nouveaux lieux sont ajoutés chaque jour. Sur
, pour qu'un lieu soit disponible sur VPS, une quantité suffisante de données de scan AR doit être téléchargée sur
et le processus d'activation du VPS doit être achevé. Les développeurs peuvent ajouter de nouveaux lieux à
et demander l'activation de VPS pour des lieux entièrement numérisés à l'aide du navigateur géospatial.

## Comment fonctionne l'activation d'un VPS ? {#how-does-vps-activation-work}

Pour qu'un site soit éligible à l'activation du SPV, il doit avoir téléchargé au moins 10 scans qui passent les contrôles de qualité minimums de
, et la différence de temps entre les scans les plus anciens et les plus récents sur le site
doit être d'au moins 5 heures. Ces exigences garantissent que les cartes et les maillages obtenus sont d'une qualité
suffisante et qu'ils capturent suffisamment de variations pour que les utilisateurs puissent effectuer une localisation fiable.
Le processus d'activation des VPS s'appuie sur l'infrastructure de cartographie AR de Niantic et implique de nombreuses étapes complexes sur le site
. À partir de l'ensemble des scans éligibles sur le site, un algorithme sélectionne la plupart des scans pour
afin de les utiliser pour construire des cartes et des maillages, et la poignée restante pour la validation et la mesure de la qualité de la localisation
. Le processus d'activation d'un lieu se déroule sur les serveurs de Niantic et prend généralement 1 à 2 heures sur le site
.

## Puis-je retrouver mes scans après l'activation du VPS ? {#can-i-find-my-scans-after-vps-activation-is-done}

Au cours du processus d'activation, les cartes et les maillages créés à partir des scans téléchargés sont fusionnés à l'adresse
afin d'intégrer autant d'informations que possible. Le produit final, qui est utilisé
par les développeurs pour créer du contenu et par les utilisateurs pour le localiser, se compose de scans provenant de nombreuses sources
différentes. Les données des scanners sont mélangées pour créer une représentation plus complète du lieu,
. Il n'y a donc pas de relation univoque entre les scanners qui sont téléchargés sur un lieu et les cartes et maillages
qui sont créés une fois que le lieu est activé par le système VPS.

## Puis-je ajouter d'autres analyses à un site déjà activé ? {#can-i-add-more-scans-to-a-location-thats-already-activated}

Dans certains cas, les développeurs peuvent souhaiter ajouter des balayages supplémentaires à un lieu précédemment activé sur
afin d'améliorer la qualité et la couverture des cartes et des maillages du lieu. Sur
, pour qu'un site soit éligible à la "réactivation", il doit avoir fait l'objet d'au moins 5 balayages supplémentaires
depuis sa dernière activation. Au contraire, le processus de réactivation nécessite la construction d'une nouvelle carte fusionnée
qui incorpore les nouveaux balayages dans le contexte des balayages existants.

## Comment puis-je demander l'activation d'un nouveau site ? {#how-do-i-request-vps-activation-of-a-new-location}

Une fois qu'un lieu a téléchargé suffisamment de scans pour répondre aux exigences d'activation du SPV (au moins 10 scans
au total avec une différence de temps d'au moins 5 heures entre les scans les plus anciens et les plus récents), les développeurs peuvent
demander l'activation du SPV en sélectionnant le lieu dans l'application Wayfarer ou le navigateur géospatial et
en appuyant sur le bouton "Activer". Cela ajoutera le lieu à la file d'attente d'activation. En général, une demande d'activation de
est traitée dans les deux heures. Les développeurs ont également la possibilité de demander à
la réactivation d'un lieu existant après le téléchargement de 5 scans supplémentaires.

## Le SPV fonctionne-t-il la nuit ou dans de mauvaises conditions météorologiques ? {#does-vps-work-at-night-or-in-poor-weather-conditions}

Le SPV fonctionne mieux lorsqu'il y a une bonne visibilité. Afin de maximiser les chances de réussite de l'expérience
VPS, il est préférable de télécharger de nombreuses analyses AR couvrant un large éventail de conditions différentes
(par exemple, différentes heures de la journée, différentes conditions météorologiques, etc.) Par exemple, si vous
construisez une expérience dans un endroit où il pleut beaucoup, il est très utile d'avoir des images d'un jour de pluie
.

## La numérisation AR et le VPS nécessitent-ils des téléphones équipés de capteurs LiDAR ? {#do-ar-scanning-and-vps-require-phones-with-lidar-sensors}

Le balayage AR et le VPS ne nécessitent pas de LiDAR.
