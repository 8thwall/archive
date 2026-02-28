---
sidebar_position: 3
---

# Emplacement des scanners

## Scaniverse pour les développeurs de Niantic (iOS Beta) {#scaniverse-for-niantic-developers}

:::info
**Scaniverse pour les développeurs de Niantic est disponible en version bêta sur les appareils iOS. La prise en charge d'Android est imminente.**
:::

Nous lançons actuellement une version bêta de Scaniverse pour les développeurs Niantic, qui intègre de manière transparente
le navigateur géospatial (GSB) à l'expérience de numérisation primée de Scaniverse. Ce site
rationalise considérablement les flux de travail des développeurs en ce qui concerne la navigation sur la carte, l'ajout d'emplacements et, bien sûr, la numérisation (
) :

- Nous avons rendu le navigateur géospatial (GSB) convivial pour les mobiles afin qu'il puisse être utilisé efficacement dans
  Scaniverse pour parcourir la carte, inspecter les emplacements, ajouter des emplacements et demander l'activation d'un VPS
- Flux de connexion simplifié à l'aide d'un simple code QR qui relie Scaniverse à votre compte
  8th Wall.
- Nous avons adopté l'interface utilisateur existante de Scaniverse pour faciliter la création et le téléchargement de scans.
- Nous avons permis de tester la localisation dans les sites activés par le VPS au sein de Scaniverse.
- Nous avons intégré les dernières améliorations apportées au filtrage des cartes afin qu'il soit plus facile que jamais de trouver le(s) site(s)
  que vous recherchez.

Les développeurs 8th Wall équipés d'appareils iOS peuvent essayer la version bêta dès maintenant en suivant les instructions ci-dessous.

### Lien entre Scaniverse et le navigateur géospatial (GSB) {#linking-scaniverse-with-the-geospatial-browser}

**Prérequis** : Installer Scaniverse à partir de l'[App Store] iOS (https://apps.apple.com/us/app/scaniverse-3d-scanner/id1541433223). La prise en charge des appareils Android est imminente.

1. Connectez-vous à votre compte 8th Wall sur votre ordinateur. Ouvrez le **Geospatial Browser (GSB)**, sélectionnez n'importe quel emplacement
   sur la carte, puis sélectionnez **View Details**. Dans le coin inférieur droit de la carte de détails de l'emplacement
   , appuyez sur **Générer un code QR**. Un code QR s'affiche.

![Scaniverse1](/images/scaniverse1.png)

2. Scannez le **code QR** avec votre application Appareil photo. Ouvrez l'application Appareil photo sur votre téléphone et pointez-la sur le code QR.

3. Tapez sur le lien **Scaniverse** qui apparaît. Cela permettra de relier Scaniverse à votre compte de développeur 8th Wall
   . Cette opération ne doit être effectuée qu'une seule fois.
   :::info
   **Veillez à autoriser www.8thwall.com à utiliser
   votre position actuelle lorsque vous y êtes invité ; cela est nécessaire au bon fonctionnement de l'interface GSB.**
   :: :

![Scaniverse2](/images/scaniverse2.png)

4. Une fois que vous avez relié Scaniverse à GSB, vous pourrez revenir à l'écran GSB à tout moment
   en appuyant sur le **bouton GSB** dans le ruban inférieur de l'application Scaniverse. Notez que vous pouvez déconnecter
   Scaniverse de GSB à tout moment en allant dans le menu **Settings** et en désactivant l'option **Niantic
   Developer Mode**.

5. Tous les scans que vous avez pris en dehors du mode développeur de Niantic resteront accessibles lorsque
   liera ou déliera Scaniverse avec GSB.

![Scaniverse3](/images/scaniverse3.png)

### Parcourir la carte du GSB dans Scaniverse

1. En tapant sur l'icône **Personne**, vous pourrez sélectionner votre espace de travail du 8e mur.

2. En cliquant sur le bouton **Télécharger**, vous pourrez sélectionner l'emplacement des scans à télécharger.
   Notez que
   seuls les scans provenant du mode développeur de Niantic (en utilisant les options Add Scans ou Test Scan) peuvent être téléchargés vers Niantic à des fins d'activation du VPS.

3. En cliquant sur le bouton **Plus**, vous pourrez créer de nouveaux emplacements et tester des balayages.

4. En appuyant sur le bouton **Couches**, la vue satellite de la carte s'affiche.

5. Le fait d'appuyer sur le bouton **Réticule** permet de centrer la carte sur votre position.

6. Le fait d'appuyer sur le bouton **Compas** ramène la carte à son orientation par défaut, vers le nord.

7. Le bouton **Contrôles** vous permet d'appliquer des filtres aux lieux qui apparaissent sur la carte
   en fonction de leur taille, de leur catégorie ou de leur statut d'activation.

8. Le bouton **Verre grossissante** vous permet d'effectuer une recherche sur la carte.

9. En appuyant sur le bouton **X**, vous fermerez le GSB et reviendrez à l'écran d'accueil de Scaniverse.

![Scaniverse4](/images/scaniverse4.jpg)

10. La sélection d'un lieu sur la carte fait apparaître un écran **Preview**, sur lequel on peut appuyer pour obtenir plus de détails sur
    .

11. Si vous avez sélectionné une localisation activée par le SPV, vous pouvez cliquer sur le bouton **Tester le SPV** pour vérifier que la localisation de
    fonctionne.

12. Pour créer un scan à ajouter à un emplacement particulier, appuyez sur le bouton **Ajouter des scans** de l'emplacement
    correspondant. Notez que vous devez vous trouver à proximité de l'emplacement pour que l'option Ajouter des scans soit disponible.

![Scaniverse5](/images/scaniverse5.png)

### Création et téléchargement de scans

1. Le bouton **Enregistrer** permet de démarrer et d'arrêter le processus de numérisation.

2. Le bouton **Pause** peut être utilisé pour suspendre temporairement le processus de numérisation.

3. L'affichage **Temps** indique la durée du balayage en cours. Une durée minimale de 15 secondes
   est requise pour qu'un scan puisse être téléchargé à des fins de développement du SPV. Une durée de balayage de 30 à 60
   secondes est idéale (les balayages de plus de 60 secondes sont divisés en plusieurs parties à des fins de traitement
   ).

4. En appuyant sur le bouton **X**, vous retournerez à l'écran d'accueil de Scaniverse.

![Scaniverse6](/images/scaniverse6.png)

5. Lorsque vous avez terminé un balayage, vous pouvez inspecter un **Preview Mesh** de la scène que
   vous avez capturée.

6. Si vous êtes satisfait de votre scan, vous pouvez choisir de le télécharger immédiatement en cliquant sur le bouton **Upload
   Scan**.

7. Vous pouvez également choisir de **Télécharger plus tard** si vous souhaitez utiliser une connexion WiFi (recommandé).

8. Si vous n'êtes pas satisfait de votre numérisation, vous pouvez la rejeter en appuyant sur le bouton **Effacer**.

![Scaniverse7](/images/scaniverse7.png)

## Installation de Niantic Wayfarer {#installing-niantic-wayfarer}

Nous ne supportons actuellement que l'application Wayfarer sur iOS, qui est une alternative à scaniverse. Pour scanner de nouveaux sites VPS
ou ajouter des scans à des sites déjà activés, veuillez consulter ci-dessous les instructions d'installation et d'utilisation de
.

### iOS {#ios}

L'application Wayfarer de Niantic nécessite iOS 12 ou une version ultérieure et un iPhone 8 ou une version ultérieure. Un appareil compatible LiDAR
n'est **pas** nécessaire.

Pour installer l'application Niantic Wayfarer, rendez-vous sur
[Testflight for Niantic Wayfarer](https://testflight.apple.com/join/VXu1F2jf)
([8th.io/wayfarer-ios](https://8th.io/wayfarer-ios))
sur votre appareil iOS.

## Utilisation de Niantic Wayfarer {#using-niantic-wayfarer}

Vous pouvez ajouter des scans aux [Public Locations](./vps-locations.md#location-types) ainsi que créer
[Test Scans](./vps-locations.md#test-scans) avec l'application Niantic Wayfarer.

Une fois l'application installée, connectez-vous avec vos identifiants 8th Wall en appuyant sur le bouton _Se connecter avec
8th Wall_.

Si vous avez accès à plusieurs espaces de travail, sélectionnez un espace de travail en cliquant sur le menu déroulant _Espace de travail 8th Wall_
sur la page de profil.

| Page de connexion                                     | Page de profil                                            |
| ----------------------------------------------------- | --------------------------------------------------------- |
| ![wayfarer app login](/images/wayfarer-app-login.jpg) | ![wayfarer app profile](/images/wayfarer-app-profile.jpg) |

Sur la page _Map_, sélectionnez un emplacement VPS pour ajouter une numérisation à un emplacement public (1), ou sélectionnez _Scan_ pour ajouter une numérisation de test à votre espace de travail (2).

Effectuez un scan de la zone en utilisant la [technique de balayage] recommandée (#technique-de-balayage).

| Page de carte                                       | Page de numérisation                                |
| --------------------------------------------------- | --------------------------------------------------- |
| ![wayfarer add scan](/images/wayfarer-add-scan.jpg) | ![wayfarer scanning](/images/wayfarer-scanning.jpg) |

Une fois l'analyse terminée, sélectionnez public ou test, puis téléchargez.

| Type de scan                                          | Chargement du scan                                        |
| ----------------------------------------------------- | --------------------------------------------------------- |
| ![wayfarer scan type](/images/wayfarer-scan-type.jpg) | ![wayfarer scan upload](/images/wayfarer-scan-upload.jpg) |

Le traitement des scans peut prendre de 15 à 30 minutes. Une fois traités, les scans s'affichent dans le navigateur géospatial.

Les questions relatives à la numérisation ou au traitement doivent être adressées à [support@lightship.dev](mailto://support@lightship.dev).

Vous trouverez de plus amples informations sur l'utilisation de l'application Wayfarer dans la [documentation Lightship] (https://lightship.dev/docs/ardk/vps/generating_scans.html#using-the-niantic-wayfarer-app).

## Technique de scan {#scanning-technique}

Les emplacements activés par le SPV scannés ne doivent pas dépasser un diamètre de 10 mètres autour de l'emplacement.
Par exemple, une statue typique fonctionnerait comme un site activé par VPS. Mais pas un bâtiment entier
, par contre. Une face ou une porte/entrée dans un bâtiment pourrait fonctionner. Pour commencer, nous vous recommandons de vous en tenir à
pour les petites surfaces (par exemple, un bureau, une statue ou une peinture murale).

Avant de scanner, envisagez votre environnement et assurez-vous que vous avez le droit d'accéder au lieu
que vous scannez.

1. Vérifiez la zone à numériser et les environs de l'objet numérisé pour déterminer s'il
   y a des obstacles et pour sélectionner un itinéraire de numérisation. Il est nécessaire de planifier l'itinéraire que vous avez l'intention d'utiliser
   pour le balayage avant de commencer la procédure.

2. Assurez-vous que la mise au point de votre appareil photo est correcte. Le tremblement de la caméra peut avoir un effet négatif sur la reconstruction en 3D. Maintenez
   votre téléphone le plus près possible de votre corps pour éviter les flous. Marchez autour de l'objet que vous scannez à l'adresse
   au lieu de rester à un endroit précis et de déplacer votre téléphone.

3. Marchez à un rythme lent et naturel. Déplacez-vous lentement et sans à-coups pendant le scan. Les changements brusques
   de direction sont à proscrire. Déplacez-vous lentement et sans à-coups, les pieds au sol. Si vous numérisez à l'adresse
   dans un environnement sombre, il est d'autant plus important de se déplacer lentement et sans à-coups. Déplacez le téléphone
   avec vous lorsque vous vous déplacez (pensez à la marche en crabe).

4. L'emplacement du SPV doit toujours être le point central. Pour que nous puissions construire la carte, il est important
   de se concentrer sur l'emplacement du SPV et de capturer l'orbite complète à 360° de celui-ci. S'il n'est pas sûr ou pas possible
   d'obtenir une couverture à 360°, capturez autant que possible.

5. Variez la distance et les angles (0-10m ou 0-35ft). Pour que la carte 3D fonctionne bien dans différents scénarios
   , il est important que nous capturions l'environnement autour du lieu et que nous disposions d'une variété de
   scans différents. Il est important de varier la distance et les angles de vue lors de l'analyse de l'emplacement.

Vidéo de la technique recommandée de balayage de l'emplacement du SPV :

```mdx-code-block
<iframe width="560" height="315" src="https://www.youtube.com/embed/FYS3fe5drf0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
```

#### Choses à éviter lors de la numérisation {#things-to-avoid-while-scanning}

1. Évitez de scanner lorsque l'environnement n'est pas sûr, par exemple au milieu de la route ou dans une aire de jeux
   avec des enfants.

2. Évitez de scanner lorsque l'emplacement est trop éloigné (>10m ou 35ft) ou trop grand pour que votre appareil photo puisse faire la mise au point (
   ).

3. Évitez de scanner pendant que vous vous promenez ou que vous faites du jogging. Il est important de garder le site
   comme point central à tout moment.

4. Évitez de pointer votre téléphone vers des objets très lumineux tels qu'une lumière fluorescente ou le soleil.

5. Évitez de ne pas bouger ou de bouger trop vite lorsque vous scannez. Les mouvements brusques entraînent des décalages dans la reconstruction du site
   .

6. Évitez de numériser si votre téléphone devient trop chaud. Si la température de l'appareil augmente trop, les performances de
   seront fortement réduites, ce qui aura un effet négatif sur la numérisation.

7. Évitez de télécharger des scans qui semblent incomplets ou qui ne sont pas représentatifs de ce que vous essayez de scanner sur
   .
