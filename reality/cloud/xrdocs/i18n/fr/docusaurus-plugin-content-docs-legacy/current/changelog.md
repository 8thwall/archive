---
id: changelog
sidebar_position: 7
---

# Changelog

#### Version 27.3 : (2025-mars-19, v27.3.1.427) {#whatsnew-release-27-2025-March-19-2731427}

- Corrections et améliorations :
  - Amélioration des performances de localisation dans les sites VPS
  - Correction des plantages lors du changement d'orientation et du changement de caméra
  - Correction des effets de scintillement des visages

#### Version 27.2 : (2024-décembre-04, v27.2.6.427 / 2024-novembre-04, v27.2.5.427 / 2024-octobre-23, v27.2.4.427) {#release-27-2024-october-23-2724427}

- Nouvelles fonctionnalités :
  - Compatibilité VPS pour les projets du 8th Wall Studio.

- Corrections et améliorations :
  - Correction d'un problème affectant la fiabilité du simulateur dans les projets VPS. (27.2.5.427)
  - Amélioration de la fiabilité de l'initialisation du pipeline de la caméra pour de meilleures expériences de réalité augmentée. (27.2.6.427)

#### Version 27.1 : (2024-octobre-03, v27.1.9.427 / 2024-octobre-01, v27.1.6.427) {#release-27-1-2024-october-01-v2716427}

- Corrections et améliorations :
  - Amélioration de la qualité de la localisation et du suivi sur les sites VPS, ce qui a permis d'améliorer considérablement la stabilité
    et la précision des expériences de RA sur les sites VPS.
  - Optimisation de la relocalisation et du suivi SLAM.
  - Correction d'un problème où la caméra de World Effects pouvait se téléporter au début de l'exécution dans Studio.
  - Résolution d'un problème affectant la stabilité du suivi des VPS afin d'améliorer les performances globales. (27.1.9.427)
  - La relocalisation SLAM améliorée permet de replacer plus rapidement le contenu AR dans la bonne position. (27.1.9.427)

#### Version 27 : (2024-Sept-12, v27.0.4.427 / 2024-August-01, v27.0.2.427) {#release-27-2024-august-01-v2702427}

- Corrections et améliorations :
  - Correction d'un problème lors du passage de l'expérience "Effets du monde" à l'expérience "Effets du visage".
  - Amélioration de la synchronisation de la caméra XR avec les scènes dans Studio.
  - Optimisation de la journalisation pour des performances accrues et des résultats plus nets.

#### Version 26 : (2024-Juin-18, v26.0.6.150) {#release-26-2024-june-18-v2606150}

- Nouvelles fonctionnalités :
  - Ajout de la prise en charge des effets de visage et du suivi du monde dans 8th Wall Studio.

- Corrections et améliorations :
  - Correction d'un problème avec certains projets A-Frame qui pouvait provoquer un comportement inattendu.

#### Version 25 : (2024-May-28, v25.0.1.2384) {#release-25-2024-may-28-v25012384}

- Nouvelles fonctionnalités :
  - Mise à jour du moteur XR pour qu'il puisse être téléchargé sous forme de composants spécifiques au lieu d'un gros paquet.

#### Version 24.1 : (2024-mars-28, v24.1.10.2165 / 2024-février-29, v24.1.5.2165 / 2024-février-13, v24.1.2.2165 / 2024-janvier-25, v24.1.1.2165) {#release-241-2024-march-28-v241102165--2024-february-29-v24152165--2024-february-13-v24122165--2024-january-25-v24112165}

- Nouvelles fonctionnalités :
  - Mise à jour de 8Frame pour supporter A-Frame 1.5.0.
  - Ajout de la prise en charge du déploiement métaversal pour la mise à jour du système d'exploitation Magic Leap 2 1.5.0.
  - Mise à jour du suivi des mains pour prendre en charge les UV de la main gauche et de la main droite, ce qui vous permet de dessiner facilement des motifs sur un maillage de main.
  - Ajout de la prise en charge des effets de ciel au 8e simulateur de mur. (24.1.2.2165)
  - Ajout de quatre nouveaux points d'attache au poignet pour le suivi des mains. (24.1.5.2165)
  - Mise à jour de Metaversal Deployment pour supporter la réalité virtuelle dans le navigateur sur Apple Vision Pro. (24.1.10.2165)

- Corrections et améliorations :
  - Amélioration des performances des expériences Sky Effects.
  - Amélioration de la stabilité du suivi du poignet. (24.1.5.2165)

- Améliorations de XRExtras :
  - Ajout du paramètre `uv-orientation` à `xrextras-hand-mesh` pour supporter la nouvelle fonctionnalité UV de la main.
  - Correction d'un problème avec MediaRecorder sur iOS 17.4. (24.1.10.2165)

#### Version 24 : (2023-Novembre-29, v24.0.10.2165 / 2023-Novembre-16, v24.0.9.2165 / 2023-Novembre-01, v24.0.8.2165) {#release-24-2023-november-29-v240102165--2023-november-16-v24092165--2023-november-01-v24082165}

- Nouvelles fonctionnalités :
  - Ajout de trois nouveaux points d'attache aux oreilles pour Face Effects, ce qui vous permet d'attacher avec précision du contenu AR à différents points des oreilles.
  - Mise à jour du suivi des mains pour exposer les UV des mains, ce qui vous permet de dessiner facilement des motifs sur un maillage de mains.
  - Déploiement métaversal amélioré pour soutenir les expériences du 8e mur sur le Magic Leap 2.
  - Mise à jour de l'intégration de PlayCanvas pour prendre en charge trois nouveaux points d'attache d'oreille pour les effets de visage. (24.0.9.2165)

- Corrections et améliorations :
  - Nettoyage de certains avertissements de PlayCanvas (24.0.10.2165)

- Améliorations de XRExtras :
  - Composants AFrame mis à jour pour faciliter les effets de visage avec de nouveaux points d'attache pour les oreilles

#### Version 23 : (2023-août-24, v23.1.1.2275 / 2023-août-09, v23.0.12.2275 /2023-juillet-28, v23.0.7.2275 / 2023-juillet-25, v23.0.4.2275) {#release-23-2023-august-24-v23112275--2023-august-09-v230122275-2023-july-28-v23072275--2023-july-25-v23042275}

- Nouvelles fonctionnalités :
  - Introduction du suivi des mains - utilisez les mains, les poignets et les doigts comme toile interactive pour des expériences WebAR immersives.
    - Attachez des objets 3D à l'un des 36 points d'attache manuels les plus importants de l'industrie.
    - Utilisez le maillage adaptatif des mains du moteur 8th Wall pour faire correspondre la taille et le volume de n'importe quelle main.
    - Ajout d'un module de coaching de suivi des mains pour guider les utilisateurs à travers un flux afin de s'assurer que leurs mains sont dans le champ de la caméra.
  - Mise à jour de l'intégration de PlayCanvas pour prendre en charge le suivi des mains. (23.0.12.2275)
  - Ajout de l'API XrDevice.deviceInfo pour demander des informations détaillées sur le périphérique. (23.1.1.2275)

- Corrections et améliorations :
  - La relocalisation SLAM améliorée remet le contenu AR dans la bonne position plus rapidement et avec une meilleure précision après une interruption.
  - Amélioration de la sélection de l'appareil photo sur les appareils Android.
  - Nettoyage des avertissements liés aux paramètres par défaut de xrhand. (23.0.7.2275)
  - Correction d'un problème avec le contexte WebGL sur les appareils MacOS utilisant Safari. (23.0.12.2275)
  - Amélioration du suivi SLAM sur une large gamme d'appareils. (23.1.1.2275)

- Améliorations de XRExtras :
  - Nouveaux composants du cadre A pour faciliter le développement du Hand Tracking.
  - Correction du shader d'ombre dans PlayCanvas.

#### Version 22.1 : (2023-May-15, v22.1.7.1958 / 2023-May-03, v22.1.2.1958) {#release-221-2023-may-15-v22171958--2023-may-03-v22121958}

- Nouvelles fonctionnalités :
  - Ajout de la prise en charge de plusieurs visages pour les effets de visage, ce qui vous permet d'augmenter jusqu'à trois visages simultanément dans une même expérience.
  - Mise à jour des effets de visage pour prendre en charge les UV standard ou projetés, ce qui vous permet de dessiner facilement des motifs d'effets de visage sur un maillage de visage projeté.

- Corrections et améliorations :
  - Correction d'un problème d'orientation de l'appareil sur les appareils iOS 16.4.
  - Correction d'un problème de performance qui pouvait survenir lors de l'utilisation d'un contrôleur sur un périphérique Meta Quest.
  - Amélioration des performances des expériences three.js sur les casques. (22.1.7.1958)

- Améliorations de XRExtras :
  - Ajout du paramètre `face-id` à `xrextras-faceanchor` pour supporter la nouvelle fonctionnalité multi-face. (22.1.7.1958)

#### Version 22 : (2023-April-20, v22.0.4.1958) {#release-22-2023-april-20-v22041958}

- Nouvelles fonctionnalités :
  - Les effets de visage de la 8e machine murale ont été entièrement rafraîchis :
    - Amélioration de la qualité et de la stabilité du suivi pour :
      - Région des sourcils
      - Suivi des yeux
      - Suivi de la bouche
    - Ajout d'une fonction de suivi des iris :
      - Ajout d'une API pour estimer la distance interpupillaire (IPD)
    - Ajout d'événements en temps réel pour les développeurs, notamment
      - Sourcils levés/baissés
      - Bouche ouverte/fermée
      - Œil ouvert/fermé
    - Activation de nouveaux effets de morphing des visages en exposant les positions uv des points du visage dans le cadre de la caméra.
    - Augmentation de la hauteur des mailles de la tête pour permettre des effets qui s'étendent jusqu'à la racine des cheveux.

- Corrections et améliorations :
  - Amélioration de la vitesse de détection du ciel pour les expériences de Sky Effect.

#### Version 21.4 : (2023-April-07, v21.4.7.997 / 2023-March-27, v21.4.6.997) {#release-214-2023-april-07-v2147997--2023-march-27-v2146997}

- Nouvelles fonctionnalités :
  - Les effets de ciel et le suivi du monde permettent de créer des expériences immersives qui augmentent le ciel et le sol dans un même projet :
    - Possibilité accrue de suivre simultanément des contenus interactifs en 3D dans le ciel et sur des surfaces grâce à la méthode SLAM.
    - Ajout de la possibilité de déplacer le contenu AR de la couche ciel vers le sol, et du sol vers le ciel.
  - Mise à jour de l'intégration de PlayCanvas pour prendre en charge les effets de ciel ainsi que le suivi du ciel et du monde.
  - Intégration améliorée de PlayCanvas avec une nouvelle API unifiée run() & stop() qui remplace les API runXr() & stopXr().
  - Ajout d'une nouvelle API xrconfig qui facilite la configuration des différents composants XR utilisés par votre projet.

- Corrections et améliorations :
  - Correction d'un problème de détection du ciel au bord du cadre de la caméra dans certaines expériences d'effets de ciel.
  - Correction d'un problème avec le composant xrlayerscene lorsqu'il est utilisé dans des projets auto-hébergés.
  - Correction d'un problème d'orientation de l'appareil sur les appareils iOS 16.4 (21.4.7.997)

#### Version 21.3 : (2023-March-17, v21.3.8.997) {#release-213--2023-march-17-v2138997}

- Nouvelles fonctionnalités :
  - Ajout de contrôles d'adoucissement des bords (edgeSmoothness) pour les effets de ciel, vous permettant d'affiner l'aspect et l'intensité des bordures entre le contenu virtuel et le contenu réel dans le ciel.
  - Ajout de la prise en charge des effets de ciel verrouillés par la caméra dans three.js, ce qui vous permet d'ajouter du contenu au ciel qui est toujours en vue de la caméra dans vos projets three.js.
  - Mise à jour de 8Frame pour supporter A-Frame 1.4.1.
  - Mise à jour du déploiement de Metaversal pour prendre en charge la configuration des salles dans le navigateur Meta Quest.

- Corrections et améliorations :
  - Amélioration des performances et de la qualité visuelle des expériences Sky Effects.
  - Ajout de la possibilité de spécifier les emplacements de projet du SPV que vous souhaitez localiser. Cela permet d'améliorer les délais de localisation du SPV s'il y a beaucoup d'emplacements à proximité.
  - Correction d'un problème où l'ouverture des expériences PlayCanvas sur le bureau pouvait entraîner un plantage.

#### Version 21.2 : (2022-décembre-16, v21.2.2.997 / 2022-décembre-13, v21.2.1.997) {#release-212--2022-december-16-v2122997--2022-december-13-v2121997}

- Nouvelles fonctionnalités :
  - Présentation de Sky Effects - une mise à jour majeure du moteur 8th Wall Engine permettant la segmentation du ciel :
    - Ajout de la possibilité de placer du contenu interactif 3D dans le ciel.
    - Ajout de la possibilité de remplacer le masque du ciel par des images ou des vidéos.
    - Ajout d'un module de superposition d'entraînement au ciel pour guider les utilisateurs à travers un flux afin de s'assurer qu'ils pointent leur appareil vers le ciel.

- Corrections et améliorations :
  - Amélioration de la qualité du suivi dans les sites VPS.
  - Correction d'un problème de pixellisation des effets de ciel AFrame qui affectait certains téléphones. (21.2.2.997)

- Améliorations de XRExtras :
  - Amélioration de MediaRecorder pour ajouter une autre méthode de dessin d'éléments 2D sur la toile enregistrée.
  - Correction du rendu des ombres dans PlayCanvas v1.55+.
  - Amélioration des performances des primitives Image Target A-Frame.

#### Version 20.3 : (2022-November-22, v20.3.3.684) {#release-203--2022-november-22-v2033684}

- Nouvelles fonctionnalités :
  - Mise à jour du déploiement de Metaversal pour supporter la réalité mixte dans le navigateur Meta Quest.
    - Les expériences de 8th Wall World Effects utilisent automatiquement la vidéo passthrough AR sur Meta Quest Pro et Meta Quest 2 lorsqu'elles sont accédées dans le navigateur.

- Corrections et améliorations :
  - Optimisation de la localisation des sites VPS
  - Amélioration de la qualité du suivi des sites VPS grâce à l'utilisation du maillage sélectionné pour chaque site de projet.
  - Amélioration de l'expérience pour certains appareils Android dotés de plusieurs caméras.

#### Version 20 : (2022-October-05, v20.1.20.684 / 2022-September-21, v20.1.19.684 / 2022-September-21, v20.1.17.684) {#release-20--2022-october-05-v20120684--2022-september-21-v20119684--2022-september-21-v20117684}

- Nouvelles fonctionnalités :
  - Lightship VPS pour le Web - créez des expériences WebAR basées sur la localisation en connectant le contenu AR à des lieux réels.
    - Ajout d'un nouveau navigateur géospatial au portail des développeurs du 8e mur.
      - Trouver, créer et gérer les emplacements activés par le SPV.
      - Générer et télécharger des maillages 3D à utiliser comme occluders, objets physiques ou comme référence pour la création d'animations tenant compte de l'emplacement.
    - Ajout du paramètre `enableVps` à XR8.XrController.configure() et xrweb.
    - Ajout d'événements lorsqu'un lieu est prêt à être scanné, trouvé ou perdu.
    - Ajout de la possibilité de trouver et d'accéder à la géométrie brute du maillage de Location.
    - Ajout des API `XR8.Vps.makeWayspotWatcher`, et `XR8.Vps.projectWayspots` pour interroger les emplacements activés par les VPS et les emplacements des projets.
    - Ajout du module Lightship VPS Coaching Overlay pour guider les utilisateurs à travers un flux de localisation sur des sites réels.
    - Ajout de l'API XR8.Platform pour débloquer les nouvelles fonctionnalités de la plateforme 8th Wall comme Lightship VPS et Niantic Lightship Maps.
  - Niantic Lightship Map module
    - Ajoutez le module lightship-maps à votre projet sur 8thwall.com pour faciliter la création d'une variété d'expériences basées sur la localisation.

- Corrections et améliorations :
  - Amélioration de la gestion des erreurs pour les demandes de réseau VPS (20.1.19.684)
  - Correction de problèmes avec certaines demandes de réseau VPS (20.1.20.684)

#### Version 19.1 : (2022-août-26, v19.1.6.390 / 2022-août-10, v19.1.2.390) {#release-191--2022-august-26-v1916390--2022-august-10-v1912390}

- Corrections et améliorations :
  - Correction des problèmes liés à l'expérience du 8e mur dans WeChat sur iOS.
  - Amélioration du suivi initial SLAM pour certains appareils Android (19.1.6.390)

#### Version 19 : (2022-Mai-5, v19.0.16.390 / 2022-April-13, v19.0.14.390 / 2022-March-24, v19.0.8.390) {#release-19--2022-may-5-v19016390--2022-april-13-v19014390--2022-march-24-v1908390}

- Nouvelles fonctionnalités :
  - Introduction de l'échelle absolue - une mise à jour majeure de 8th Wall SLAM pour permettre l'échelle réelle dans World Effects :
    - Ajout de la possibilité d'activer l'échelle absolue dans les projets World Effects.
    - Ajout du paramètre scale à XR8.XrController.configure().
    - Ajout d'un module de superposition de l'encadrement pour guider les utilisateurs dans la génération de données appropriées pour l'estimation de l'échelle.
  - Mise à jour de 8Frame pour supporter A-Frame 1.3.0. (19.0.16.390)

- Corrections et améliorations :
  - Amélioration des performances sur différents appareils.
  - Amélioration de l'expérience pour certains appareils Android dotés de plusieurs caméras.
  - Amélioration des performances de l'échelle absolue sur certains appareils iOS. (19.0.14.390)
  - Correction de la messagerie utilisateur du navigateur Huawei sur les appareils Huawei. (19.0.14.390)

#### Version 18.2 : (2022-mars-09, v18.2.4.554 / 2022-janvier-14, v18.2.3.554 / 2022-janvier-13, v18.2.2.554) {#release-182--2022-march-09-v1824554--2022-january-14-v1823554--2022-january-13-v1822554}

- Corrections et améliorations :
  - Correction d'un problème où les appareils fonctionnant sous iOS 13 pouvaient se recharger après le démarrage d'une session XR8.
  - Correction d'un problème où le contexte WebGL pouvait être perdu après plusieurs sessions XR8.
  - Amélioration de l'expérience pour certains appareils Android dotés de plusieurs caméras.
  - Correction d'un problème où le mélange additif pouvait interférer avec le flux de la caméra.
  - Correction d'un problème avec les matériaux transparents. (18.2.3.554)
  - Correction d'un problème de rendu de three.js sur les appareils fonctionnant sous iOS 15.4 (18.2.4.554)

#### Version 18.1 : (2021-December-02, v18.1.3.554) {#release-181--2021-december-02-v1813554}

- Corrections et améliorations :
  - Correction d'un problème de chargement sur certains appareils iOS lors de l'accès aux projets Inline AR.
  - Correction d'un problème de refus des invites du navigateur sur certains appareils iOS.
  - Correction d'un problème de rotation de l'orientation de l'appareil entre paysage et portrait dans SFSafariViewController.
  - Amélioration de la compatibilité avec certains appareils Android dont les ratios d'aspect du flux de l'appareil photo sont atypiques.

#### Version 18 : (2021-November-08, v18.0.6.554) {#release-18--2021-november-08-v1806554}

- Nouvelles fonctionnalités :
  - Nous vous présentons le 8th Wall Engine, entièrement reconstruit et doté d'un système de déploiement métaversal :
    - Ajout d'une API de module de pipeline pour les gestionnaires de session.
    - Ajout d'un gestionnaire de session Web3D.
    - Ajout de gestionnaires de session de casque pour three.js et A-Frame.
    - Mise à jour des appareils autorisés pour inclure le mobile et le casque.
    - Ajout de paramètres de configuration de session supplémentaires dans XR8.run().

- Corrections et améliorations :
  - Amélioration de la capture d'images avec une variété d'appareils Pixel.
  - Mise à jour du flux iOS WKWebView pour prendre en charge les expériences accessibles via LinkedIn.

- XRextras :
  - Ajout du composant A-Frame xrextras-opaque-background et de XRExtras.Lifecycle.attachListener.

#### Version 17.2 : (2021-octobre-26, v17.2.4.476) {#release-172--2021-october-26-v1724476}

- Corrections et améliorations :
  - Amélioration de la qualité de la construction des cartes SLAM.
  - Optimisation de la qualité du suivi des expériences SLAM.
  - Amélioration de l'intégration de PlayCanvas pour permettre de dessiner sur le même canevas que celui sur lequel le flux de la caméra est rendu.

#### Version 17.1 : (2021-September-21, v17.1.3.476) {#release-171--2021-september-21-v1713476}

- Nouvelles fonctionnalités :
  - Ajout de nouvelles API
    - pour interroger l'état d'initialisation du moteur.
    - Le flux de la caméra three.js est disponible en tant que THREE.Texture.
    - Méthode de cycle de vie pour l'enlèvement des modules de canalisation.

- Corrections et améliorations :
  - Amélioration de la qualité de la construction des cartes SLAM.
  - Amélioration de la qualité du suivi sur une large gamme d'appareils.
  - Amélioration de la fréquence d'images des expériences World Effects, Face Effects et Image Target sur les navigateurs basés sur Chromium et Firefox.
  - Amélioration de la qualité vidéo de MediaRecorder sur les appareils Android.

- Améliorations de XRExtras :
  - Amélioration du flux de partage de MediaRecorder lorsque le niveau 2 de l'API Web Share est activé.
  - Amélioration du temps de démarrage du module de chargement.
  - Amélioration de la gestion du cycle de vie des modules Runtime Error, Almost There et Loading.
  - Mise à jour du module "Presque là" pour améliorer le succès des scans de codes QR.
  - Amélioration de la logique du canevas pleine fenêtre sur les écrans divisés de l'iPad.

#### Version 17 : (2021-July-20, v17.0.5.476) {#release-17--2021-july-20-v1705476}

- Corrections et améliorations :
  - Le suivi amélioré au-dessus de l'horizon renforce la qualité des cartes et améliore les performances des expériences WebAR qui demandent aux utilisateurs de pointer leur téléphone vers le haut pour explorer pleinement le contenu de la réalité augmentée.
  - La relocalisation SLAM optimisée ramène le contenu AR à la bonne position dans l'espace mondial après une interruption.
  - Amélioration de la qualité du suivi des expériences SLAM lorsque les utilisateurs effectuent des mouvements de lacet extrêmes.

- Améliorations de XRExtras :
  - Mise à jour de MediaRecorder pour revenir à l'aperçu des médias lorsque les utilisateurs appuient sur le bouton "voir" de la boîte de dialogue iOS après avoir choisi de télécharger les médias.

#### Version 16.1 : (2021-June-02, v16.1.4.1227) {#release-161--2021-june-02-v16141227}

- Corrections et améliorations :
  - Amélioration de la récupération du suivi du monde après une interruption.
  - Amélioration de la gestion du cycle de vie des récepteurs d'événements dans les projets A-Frame.
  - Correction d'un problème avec les erreurs WebGL 1 sur certains appareils Android.
  - Correction d'un problème qui empêchait parfois MediaRecorder d'afficher un aperçu de l'enregistrement.
  - Correction d'un problème où le fait de changer de caméra plusieurs fois pouvait entraîner un plantage.
  - Amélioration de la compatibilité avec l'utilisation de canevas avec des contextes WebGL 2 prédéfinis.

#### Version 16 : (2021-May-21, v16.0.8.1227 / 2021-April-27, v16.0.6.1227 / 2021-April-22, v16.0.5.1227) {#release-16--2021-may-21-v16081227--2021-april-27-v16061227--2021-april-22-v16051227}

- Nouvelles fonctionnalités :
  - Voici le tout nouveau 8th Wall MediaRecorder :
    - Utilise des enregistrements conformes aux normes web du W3C lorsqu'ils sont disponibles.
    - Optimise les performances pour améliorer le taux de rafraîchissement pendant l'enregistrement.
    - Amélioration de la qualité de l'image et de la fréquence d'enregistrement.

- Corrections et améliorations :
  - Amélioration de la qualité du suivi et de la fréquence d'images des expériences SLAM.
  - Amélioration de la qualité du suivi et de la fréquence d'images de l'expérience Image Target.
  - Amélioration de l'expérience pour certains appareils Android dotés de plusieurs caméras.
  - Correction des problèmes de raycasting avec PlayCanvas.
  - Correction du problème de suivi SLAM (v16.0.8.1227)

- Améliorations de XRExtras :
  - Mise à jour de MediaRecorder afin d'afficher une barre de progression lors du transcodage des enregistrements sur les appareils concernés.

#### Version 15.3 : (2021-March-2, v15.3.3.487) {#release-153--2021-march-2-v1533487}

- Nouvelles fonctionnalités :
  - Mise à jour de 8Frame pour supporter A-Frame 1.2.0.

- Corrections et améliorations :
  - Correction d'un problème lié à la reprise du flux de la caméra dans Safari après avoir navigué vers une application 8th Wall.
  - Correction d'un problème de reprise du flux de la caméra après réouverture d'une WKWebView
  - Amélioration de la compatibilité avec les différentes versions du moteur de rendu.
  - Optimisation des flux iOS WKWebView pour certaines applications natives.

#### Version 15.2 : (2020-December-14, v15.2.4.487) {#release-152--2020-december-14-v1524487}

- Nouvelles fonctionnalités :
  - Ajout de la prise en charge de WKWebView sur les appareils fonctionnant sous iOS 14.3 ou une version ultérieure.
  - Mise en place d'un contexte de calcul accessible aux modules de pipeline afin d'accélérer la vision par ordinateur hors écran au moyen du GPU.
  - Mise à jour de 8Frame pour supporter A-Frame 1.1.0.

- Corrections et améliorations :
  - Amélioration de la compatibilité avec les moteurs de rendu.
  - Ajout de la possibilité de charger et de décharger des cibles d'images tout en suivant d'autres cibles d'images.
  - Correction d'un problème avec MediaRecorder lié au changement de contexte audio.
  - Amélioration de l'expérience pour certains appareils Android dotés de plusieurs caméras.
  - Correction d'un problème où les erreurs WebGL étaient parfois cachées.
  - Correction d'un problème lié au suivi simultané de cibles d'images plates et courbes.
  - Correction d'un problème avec la commutation entre les pipelines WebGL et WebGL2.

- Améliorations de XRExtras :
  - Amélioration des flux pour iOS WKWebView sur les appareils fonctionnant sous iOS 14.3 ou plus récent.
  - Correction d'un problème avec le détachement du pipeline du module Stats.

#### Version 15.1 : (2020-octobre-27, v15.1.4.487) {#release-151--2020-october-27-v1514487}

- Nouvelles fonctionnalités :
  - Ajout de la prise en charge de l'utilisation simultanée de cibles d'images courbes et de SLAM.
  - Prise en charge de A-Frame 1.1.0-beta, THREE 120 et MRCS HoloVideoObject 1.2.5.

- Corrections et améliorations :
  - Amélioration de la qualité du suivi des cibles à image plane simultanément avec SLAM.
  - Amélioration du framerate pour les appareils équipés d'iOS 14 ou supérieur.
  - Amélioration de l'expérience pour certains appareils Android dotés de plusieurs caméras. (v15.0.9.487)
  - Optimisation des performances de certains traitements GPU.
  - Intégration améliorée de PlayCanvas avec prise en charge de la commutation entre les caméras XR et FaceController.
  - Correction d'un problème avec l'accès au microphone du MediaRecorder où les événements onPause ne fermaient pas l'entrée du microphone.
  - Correction d'un problème lié au fait que MediaRecorder produisait parfois des fichiers incompatibles avec certains lecteurs vidéo.
  - Correction d'un problème de raycasting avec AFrame 1.0.x. (v15.0.9.487)

- Améliorations de XRExtras :
  - Le module XRExtras.PauseOnHidden() met en pause le flux de la caméra lorsque l'onglet de votre navigateur est masqué.

#### Version 15 : (2020-octobre-09, v15.0.9.487 / 2020-septembre-22, v15.0.8.487) {#release-15--2020-october-09-v1509487--2020-september-22-v1508487}

- Nouvelles fonctionnalités :
  - Cibles d'images courbes du 8e mur :
    - Ajout de la prise en charge des cibles d'images cylindriques telles que celles qui sont enroulées autour de bouteilles, de boîtes de conserve, etc.
    - Ajout de la prise en charge des cibles d'image coniques, telles que celles entourant les tasses à café, les chapeaux de fête, les abat-jour, etc.

- Corrections et améliorations :
  - Amélioration de la qualité du suivi pour les cibles SLAM et les cibles d'image.
  - Correction d'un problème avec les hologrammes MRCS et le routage des appareils sur iOS 14.
  - Correction d'un problème avec les effets de visage et les cibles d'image où les mises à jour de mirroredDisplay n'étaient pas reflétées pendant l'exécution.
  - Amélioration de l'expérience pour certains appareils Android dotés de plusieurs caméras. (v15.0.9.487)
  - Correction d'un problème de raycasting avec AFrame 1.0.x (v15.0.9.487)

- Améliorations de XRExtras :
  - Nouveaux composants AFrame pour faciliter le développement de cibles à image courbe :
    - Composant préfabriqué de conteneur 3D qui forme un conteneur de type portail à l'intérieur duquel du contenu 3D peut être placé.
    - Composant préfabriqué de lecture vidéo permettant d'activer facilement la vidéo sur des cibles d'images incurvées.
  - Amélioration de la détection de la prise en charge de l'API Web Share de niveau 2.

#### Version 14.2 : (2020-July-30, v14.2.4.949) {#release-142--2020-july-30-v1424949}

- Nouvelles fonctionnalités :
  - Mise à jour de MediaRecorder.configure() pour offrir plus de contrôle sur la sortie audio et le mixage :
    - Introduisez votre propre audioContext.
    - Demander des autorisations pour les microphones lors de l'installation ou de l'exécution.
    - Possibilité de désactiver l'enregistrement du microphone.
    - Ajoutez vos propres nœuds audio au graphe audio.
    - Incorporer le son de la scène dans la lecture de l'enregistrement.

- Corrections et améliorations :
  - Correction d'un problème où les plans de coupe n'étaient pas définis à partir de PlayCanvas dans certains cas.
  - Ajout de la prise en charge de la commutation entre le suivi du monde, le suivi de la cible de l'image et les effets de visage au moment de l'exécution.
  - Correction d'un problème où les tampons de vertex pouvaient être rebondis après la suppression des tableaux de vertex.
  - Amélioration de l'expérience pour certains appareils Android dotés de plusieurs caméras.

#### Version 14.1 : (2020-July-06, v14.1.4.949) {#release-141--2020-july-06-v1414949}

- Nouvelles fonctionnalités :
  - Présentation de l'enregistrement vidéo du 8e mur :
    - Ajoutez un enregistrement vidéo dans le navigateur à n'importe quel projet 8th Wall grâce à la nouvelle API XR8.MediaRecorder.
    - Ajoutez des superpositions dynamiques et des cartes de fin avec des images personnalisées et des appels à l'action.
    - Configurer la durée et la résolution maximales de la vidéo.
  - Ajout du microphone en tant qu'autorisation de module configurable.

- Corrections et améliorations :
  - Fonctionnalité CanvasScreenshot améliorée avec une meilleure prise en charge des superpositions.
  - Correction d'un problème avec les effets de visage qui pouvait causer des problèmes visuels lors d'un changement d'orientation de l'appareil.
  - Amélioration de la compatibilité des coordonnées droitières de Face Effects avec Bablyon.js.
  - Amélioration de la compatibilité du pipeline graphique avec Babylon.js.

- Améliorations de XRExtras :
  - Composant préfabriqué de bouton d'enregistrement pour capturer des vidéos et des photos :
    - Sélectionnez le mode standard, le mode fixe ou le mode photo.
  - Composant préfabriqué de prévisualisation permettant de prévisualiser, de télécharger et de partager facilement des captures
  - Utilisez XRExtras pour personnaliser facilement l'expérience utilisateur de l'enregistrement vidéo dans votre projet :
    - Configurer la longueur et la résolution maximales de la vidéo.
    - Ajoutez un filigrane facultatif à chaque image de la vidéo.
    - Ajoutez une carte de fin optionnelle pour ajouter une marque et un appel à l'action à la fin de la vidéo.

#### Version 14 : (2020-May-26) {#release-14--2020-may-26}

- Nouvelles fonctionnalités :
  - Voici 8th Wall Face Effects : Attachez des objets 3D aux points d'attache du visage et peignez votre visage avec des matériaux, des ombres ou des vidéos personnalisés.
  - Mode selfie : Utilisez la caméra frontale avec un écran miroir pour prendre un selfie parfait.
  - Navigateurs de bureau : Permettez à vos expériences de ciblage d'image et d'effet de visage de s'exécuter dans les navigateurs de bureau utilisant la webcam.

- Corrections et améliorations :
  - Amélioration du champ de vision de la capture sur les téléphones Pixel 4/4XL.
  - Profils d'appareil photo améliorés pour certains modèles de téléphone.
  - Correction d'un problème lié au changement d'orientation de l'appareil au démarrage.
  - Correction d'un problème lié à l'inversion de la direction de la caméra dans la même scène.
  - Correction d'un problème avec les look-controls AFrame qui n'étaient pas supprimés lors du redémarrage de la scène.
  - Amélioration de l'expérience pour certains téléphones Android dotés de plusieurs appareils photo.
  - Autres corrections et améliorations.

- Améliorations de XRExtras :
  - Les flux améliorés sont presque là pour les expériences qui peuvent être visualisées sur un ordinateur de bureau.
  - Le module PauseOnBlur arrête la caméra lorsque votre onglet n'est pas actif.
  - Nouveaux composants AFrame pour faciliter les effets de visage et le développement de l'expérience de bureau.
  - Nouveau ThreeExtras pour le rendu des matériaux PBR, des matériaux de base et des vidéos sur les visages.

#### Version 13.2 : (2020-Feb-13) {#release-132--2020-feb-13}

- Nouvelles fonctionnalités :
  - Libérer le flux de la caméra sur XR8.pause() et le rouvrir sur XR8.resume().
  - Ajout d'une API permettant d'accéder au programme de shaders et de modifier les uniformes utilisés par GlTextureRenderer.
  - Ajout d'une API pour configurer le contexte WebGL lors de l'exécution.

- Corrections et améliorations :
  - Correction d'un problème de vidéo noire sur iOS lorsqu'un utilisateur appuie longuement sur une image.
  - Amélioration de la vitesse et de la fiabilité des captures d'écran sous iOS.
  - Correction du rendu du canal alpha lors d'une capture d'écran.
  - Amélioration de l'expérience pour certains téléphones Android dotés de plusieurs appareils photo.
  - Amélioration de la détection des vues web des réseaux sociaux.

- Améliorations de XRExtras :
  - Amélioration des codes QR avec une meilleure compatibilité avec les caméras natives.
  - Amélioration des flux de sortie de liens pour les réseaux sociaux.
  - Amélioration de la personnalisation des CSS.

#### Version 13.1 {#release-131}

- Nouvelles fonctionnalités :
  - Amélioration du taux de rafraîchissement sur les téléphones Android à haute résolution.
  - Le pipeline de caméras peut être arrêté et redémarré.
  - Les modules du pipeline de caméras peuvent être supprimés au moment de l'exécution ou à l'arrêt.
  - Nouveaux rappels de cycle de vie pour l'attachement et le détachement.

- Corrections et améliorations :
  - Amélioration de l'expérience pour certains téléphones Android dotés de plusieurs appareils photo.
  - Correction de l'étalonnage du téléphone iOS sur iOS 12.2 et supérieur.

#### Version 13 {#release-13}

- Nouvelles fonctionnalités :
  - Prise en charge de la création, de la collaboration, de la publication et de l'hébergement de contenu WebAR basé sur le cloud.

#### Version 12.1 {#release-121}

- Corrections et améliorations :
  - Augmentation de la résolution de l'appareil photo sur les nouveaux appareils iOS.
  - Augmentation du nombre d'images par seconde sur les appareils Android à haute résolution.
  - Correction des problèmes de raycasting de three.js r103+.
  - Ajout de la prise en charge de l'iPadOS.
  - Correction d'un problème de mémoire lors du chargement répété de nombreuses cibles d'images.
  - Améliorations mineures des performances et corrections de bugs.

#### Version 12 {#release-12}

- Nouvelles fonctionnalités :
  - Augmentation de la limite de téléchargement d'images cibles à 1000 images cibles par application.
  - Nouvelle API pour la sélection des cibles d'images actives au moment de l'exécution.
  - Les applications peuvent désormais rechercher jusqu'à 10 cibles d'images simultanément.
  - La caméra frontale est prise en charge dans le cadre de la caméra et les cibles d'image.
  - Prise en charge du moteur pour PlayCanvas.

- Corrections :
  - Amélioration de l'expérience pour certains téléphones Android dotés de plusieurs appareils photo.

- XRExtras :
  - Amélioration de la qualité visuelle sur les téléphones Android.
  - Prise en charge des autorisations d'orientation de l'appareil iOS 13.
  - Meilleure gestion des erreurs en cas d'assemblage web manquant sur certaines anciennes versions d'iOS.
  - Prise en charge de PlayCanvas.

#### Version 11.2 {#release-112}

- Nouvelles fonctionnalités :
  - Prise en charge des mouvements sous iOS 13.

#### Version 11.1 {#release-111}

- Corrections et améliorations :
  - Réduction de l'utilisation de la mémoire.
  - Amélioration des performances de suivi.
  - Amélioration de la détection des capacités du navigateur.

#### Version 11 {#release-11}

- Nouvelles fonctionnalités :
  - Ajout de la prise en charge des cibles d'image.
  - Ajout de la prise en charge de BabylonJS.
  - Réduction de la taille du binaire JS à 1MB.
  - Ajout de la prise en charge de l'exécution de 8th Wall Web à l'intérieur d'une iframe cross-originale.
  - Ajouts mineurs à l'API.

#### Version 10.1 {#release-101}

- Nouvelles fonctionnalités :
  - Ajout du support pour A-Frame 0.9.0.

- Corrections :
  - Correction d'une erreur lors de la fourniture de includedTypes à XrController.hitTest().
  - Réduction de l'utilisation de la mémoire lors du suivi sur de longues distances.

#### Version 10 {#release-10}

La version 10 ajoute une console de développement web remaniée avec un mode développeur rationalisé, l'accès aux origines autorisées et aux codes QR. Il ajoute la prise en charge par 8th Wall Web de XRExtras, un paquetage open-source pour la gestion des erreurs, les visualisations de chargement, les flux "presque là", et bien plus encore.

- Nouvelles fonctionnalités :
  - La console du développeur web a été remaniée.
  - XR Extras offre une solution pratique pour :
    - Chargement des écrans et demande d'autorisations pour les caméras.
    - Redirection des utilisateurs à partir d'appareils ou de navigateurs non pris en charge ("on y est presque").
    - Gestion des erreurs d'exécution.
    - Dessiner un flux de caméra en plein écran dans des frameworks de bas niveau comme three.js.
  - Ajout de l'éclairage public, des interfaces de test de frappe à XrController.
  - Autres ajouts mineurs à l'API.

- Corrections :
  - Amélioration de la vitesse de démarrage de l'application.
  - Correction d'un problème de cadre où les erreurs n'étaient pas propagées au démarrage.
  - Correction d'un problème qui pouvait survenir avec WebGL lors de l'initialisation.
  - Utiliser l'interface window.screen pour l'orientation de l'appareil si elle est disponible.
  - Correction d'un problème avec three.js qui pouvait survenir lorsque le canevas était redimensionné.

#### Version 9.3 {#release-93}

- Nouvelles fonctionnalités :
  - Ajouts mineurs à l'API : XR.addCameraPipelineModules() et XR.FullWindowCanvas.pipelineModule()

#### Version 9.2 {#release-92}

- Nouvelles fonctionnalités :
  - Documentation publique publiée : https://docs.8thwall.com/web

#### Version 9.1 {#release-91}

- Nouvelles fonctionnalités :
  - Ajout de la prise en charge d'Amazon Sumerian dans 8th Wall Web
  - Amélioration de la stabilité du suivi et élimination de la gigue

#### Version 9 {#release-9}

- Première version de 8th Wall Web !
