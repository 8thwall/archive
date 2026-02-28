---
sidebar_position: 2
---

# Emplacement des SPV

## Gestion des sites {#managing-locations}

Vous pouvez accéder au navigateur géospatial à partir de votre projet en sélectionnant l'icône de carte dans le
menu de gauche(annoté comme #1 dans l'image ci-dessous). Sur cette page, vous trouverez une vue cartographique (#2)
que vous pouvez utiliser pour rechercher les sites activés par le SPV. La sélection d'un emplacement
activé par VPS affichera le maillage 3D de l'emplacement (#3) afin que vous puissiez vérifier que vous avez sélectionné l'emplacement
correct et l'ajouter à votre projet (#4).

![ConsoleGSB](/images/console-geospatial-browser.jpg)

Lorsque vous ajoutez un lieu activé par le SPV à votre projet, celui-ci apparaît dans le tableau "Project
Locations" du navigateur géospatial (annoté comme #1 dans l'image ci-dessous). Une fois que vous avez un emplacement
dans le tableau "Project Locations", vous pouvez utiliser le bouton "Download" (#2) pour télécharger une version GLB ou
OBJ (toggle shown as #3) du maillage 3D et l'ouvrir dans des applications logicielles 3D tierces,
telles que Blender, ou l'importer directement dans votre projet 8th Wall. Lorsque vous faites référence à des lieux dans
votre code de projet, vous devez copier le champ "Nom" (#4) du tableau "Lieux du projet".

![ConsoleGSBManageWayspots](/images/console-geospatial-browser-manage-wayspots.jpg)

Si l'emplacement que vous souhaitez utiliser dans votre projet n'est pas disponible en tant qu'emplacement VPS, vous pouvez créer
l'emplacement en suivant les instructions de la section
[Create New Location](#create-new-location).

## Créer un nouvel emplacement {#create-new-location}

1. Cliquez sur un emplacement libre sur la carte pour sélectionner l'endroit où vous souhaitez créer un nouveau site VPS. Voir
   [VPS Location Requirements](#location-requirements) pour en savoir plus sur le choix d'un bon endroit pour
   créer un emplacement VPS.

![ConsoleCreateWayspot](/images/console-create-wayspot.png)

2. Les espaces de travail des plans `Pro` ou `Enterprise` auront l'option de **Créer un emplacement public** ou
   **Créer un emplacement privé**. Les emplacements publics sont accessibles à tous les développeurs et à toutes les personnes qui utilisent
   leurs projets, tandis que les emplacements privés ne seront visibles et accessibles qu'à votre espace de travail et à
   ses projets. La création d'un emplacement public est le bon choix pour la plupart des projets ; les emplacements privés
   sont une fonctionnalité premium pour les développeurs qui ont besoin de créer des expériences VPS
   temporaires ou à accès contrôlé. Cliquez sur le bouton **Créer un lieu public** ou **Créer un lieu privé**
   pour lancer le processus de création du lieu.

3. **Vérifiez les doublons** : Avant de créer un nouveau site, vous devez vérifier que le site
   n'existe pas déjà. Comparez l'emplacement souhaité à d'autres emplacements déjà présents sur la carte afin de vous assurer
   que vous ne créez pas de doublon. S'il ne s'agit pas d'un emplacement en double, vous devez cocher la case **Mon emplacement
   n'est pas en double** et cliquer sur le bouton **Suivant** pour continuer.

![ConsoleCreateWayspotNoDuplicate](/images/console-create-wayspot-nodupe.png)

4. **Ajouter des informations de localisation** : Les métadonnées de localisation seront visibles pour les développeurs qui utilisent le navigateur géospatial
   et peuvent être visibles pour les utilisateurs finaux. N'oubliez pas que l'équipe Trust & Safety de Niantic utilise
   les informations que vous fournissez pour déterminer si l'emplacement répond à nos critères pour être rendu public
   . Une fois que vous avez ajouté les informations suivantes pour le lieu que vous essayez de créer,
   cliquez sur le bouton **Submit** :

- Titre (125 caractères)
- Description (250 caractères)
- Catégorie (1 ou plus)
- Image (si disponible)

5. Votre lieu devrait être immédiatement ajouté à votre onglet "Location Submissions" dans le navigateur géospatial
   avec son type ("Public" ou "Private") et son statut ("Not Activated"). Il sera disponible à l'adresse
   pour être analysé dans les minutes qui suivent et l'activation du SPV pourra être demandée une fois qu'il aura été entièrement analysé.

## Exigences en matière de localisation {#location-requirements}

Lors du choix d'un emplacement pour l'utilisation d'un VPS, il convient de tenir compte des éléments suivants :

- Le SPV fonctionne mieux dans des lieux distincts et cohérents (par exemple, une plage de sable ou
  un patio bondé avec des meubles mobiles ne fonctionnera pas bien).
- Les lieux dominés par des éléments réfléchissants ou transparents (par exemple, les fenêtres et les miroirs) sont déconseillés sur le site
  .
- Plus l'expérience est grande, plus vous devrez numériser pour capturer l'espace ; la taille maximale recommandée par
  pour une expérience VPS est aujourd'hui de 400 m^2 (20 x 20 m), bien que des expériences plus grandes puissent être prises en charge par
  avec une numérisation minutieuse.

### Exigences en matière de lieux publics {#public-location-requirements}

Les **Lieux publics** sont accessibles à tous les développeurs et à toutes les personnes qui utilisent leurs projets et leurs applications. Lorsque
ajoute un nouveau lieu public, veuillez tenir compte des lignes directrices suivantes :

- Les lieux publics doivent être des lieux ou des objets permanents, physiques, tangibles et identifiables.
- Les lieux publics doivent être sûrs et accessibles aux piétons.
- Veillez à inclure des informations précises dans le titre, la description et la photo afin d'aider vos utilisateurs
  à trouver le lieu.

### Exigences en matière d'emplacement privé {#private-location-requirements}

Les **Lieux privés** sont une fonctionnalité premium pour les développeurs qui ont besoin de créer des expériences VPS temporaires ou à accès contrôlé sur
. Ils ne sont visibles et accessibles que dans l'espace de travail
qui les a créés. Lors de la création d'un nouveau lieu privé, veuillez tenir compte des éléments suivants :

- Les emplacements privés ne peuvent être découverts que par l'espace de travail qui les a créés, de sorte qu'ils ne peuvent être analysés et localisés (
  ) que par les membres et les utilisateurs des projets de cet espace de travail.
- Les emplacements privés sont un bon choix si vous construisez une expérience spéciale à accès contrôlé
  (par exemple, sur votre propriété privée ou celle de votre client).
- Les lieux privés sont également une option si vous créez une expérience dans un lieu public qui
  a temporairement une apparence différente (par exemple, un concert, une exposition dans un musée ou un autre événement spécial).

## Localisation Quantités {#location-quantities}

Il n'y a pas de limite au nombre de lieux qui peuvent être associés à un projet 8th Wall.
Les emplacements sont localisés côté serveur via le service VPS.

## Types d'emplacements {#location-types}

Dans le navigateur géospatial, vous verrez quatre types d'emplacements différents :

| Type       | Icône                                            | Description                                                                                                                                                                                                                                                                                                                          |
| ---------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Public     | ![WSPublic](/images/wayspot-type-public.png)     | Les lieux "publics" ont été approuvés par l'équipe Trust & Safety de Niantic et répondent aux critères de sécurité et d'accessibilité au public. Ces lieux peuvent être utilisés dans des projets publiés.                                                                       |
| En attente | ![WSPending](/images/wayspot-type-pending.png)   | Les emplacements "en attente" sont examinés par l'équipe Trust & Safety de Niantic afin de déterminer s'ils répondent aux critères de sécurité et d'accessibilité au public. \*\*Les localisations en attente peuvent être scannées et activées en attendant la fin de l'examen. |
| Rejeté     | ![WSRejected](/images/wayspot-type-rejected.png) | Les lieux "rejetés" peuvent avoir échoué à l'examen de confiance et de sécurité de Niantic, être un doublon d'un lieu existant ou précédemment rejeté, ou ne pas être autorisés par Niantic pour une autre raison. Ces lieux ne peuvent pas être ajoutés à des projets.                              |
| Test       | ![WSTest](/images/wayspot-type-private.png)        | Les emplacements "test" ne sont accessibles à votre espace de travail qu'en scannant l'emplacement à l'aide de l'application Wayfarer de Niantic. Les lieux de test sont destinés à être utilisés pendant le développement et peuvent ne pas être inclus dans un projet publié.                      |

Pour toute question ou problème lié à la création de sites VPS, ou pour vérifier l'état d'un site existant, veuillez contacter [support@lightship.dev](mailto://support@lightship.dev).

## Localisation Statut {#location-status}

Dans le navigateur géospatial, vous verrez cinq statuts différents pour les emplacements VPS :

| Statut       | Icône                                                       | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------ | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Non activé   | ![WSNotActivated](/images/wayspot-status-not-activated.png) | Les sites dont le statut est "Non activé" n'ont pas fait l'objet d'une analyse. Un minimum de 10 numérisations viables doit être soumis pour le lieu avant que vous puissiez demander l'activation. Après l'envoi d'un scan, l'état de l'emplacement passe à "Scanning".                                                                                                                                                                                                                                       |
| Numérisation | ![WSScanning](/images/wayspot-status-scanning.png)          | Les sites dont le statut est "en cours d'analyse" ont fait l'objet d'au moins une analyse. Un minimum de 10 numérisations viables doit être soumis pour le lieu avant que vous puissiez demander l'activation.                                                                                                                                                                                                                                                                                                                 |
| Traitement   | ![WSProcessing](/images/wayspot-status-processing.png)      | Les sites dont le statut est "en cours de traitement" ont fait l'objet d'une demande d'activation et afficheront le statut "en cours de traitement" jusqu'à ce que le processus d'activation soit terminé. **En règle générale, une demande d'activation est traitée dans les 4 heures. Vous recevrez un courriel lorsque le processus sera terminé.**                                                                                                                                                         |
| Actif        | ![WSActive](/images/wayspot-status-active.png)              | Les sites dont le statut est "actif" peuvent être utilisés dans des projets de création de contenu WebAR à l'aide de VPS for Web.                                                                                                                                                                                                                                                                                                                                                                                                              |
| Échec        | ![WSFailed](/images/wayspot-status-failed.png)              | Les sites dont le statut est "Échec" ont rencontré un problème au cours du processus d'activation. Cela peut résulter d'un certain nombre de facteurs, tels qu'une mauvaise adéquation de l'emplacement pour le SPV, des analyses insuffisantes ou des données corrompues. Malheureusement, cela signifie que cet emplacement ne peut pas être utilisé pour créer du contenu WebAR à l'aide d'un VPS. Nous vous encourageons à trouver un nouveau lieu à utiliser dans votre projet de 8e mur. |

Pour toute question ou problème lié à la numérisation, à l'activation ou au statut de la localisation, veuillez contacter [support@lightship.dev](mailto://support@lightship.dev).

## Emplacement Qualité {#location-quality}

Une fois qu'un lieu a été activé par le VPS, Niantic fournit une évaluation de la qualité dans le navigateur géospatial.
Les détails de l'emplacement affichent soit _Moyenne qualité_, soit _Bonne qualité_.

La qualité de l'emplacement fait référence à la capacité de l'emplacement à se localiser à tout moment. Les sites disposant de plusieurs scans
dans tous les types d'éclairage ont tendance à être de meilleure qualité. Les lieux pour lesquels le nombre de numérisations requises est minimal ou pour lesquels la majorité des numérisations dans un type d'éclairage (
) ont tendance à être de moins bonne qualité.

L'évaluation de la qualité est un processus automatisé et peut ne pas refléter la performance réelle du lieu.
La meilleure façon de déterminer la qualité est de l'essayer vous-même.

## Emplacement Alignement {#location-alignment}

L'avertissement de non-alignement peut se produire pour diverses raisons et signifie que la localisation par rapport au maillage ne
peut pas être garantie. Bien que le maillage puisse fonctionner correctement pour la localisation, l'avertissement indique que le maillage est
expérimental et qu'il doit être utilisé à vos risques et périls.

Remarque : Tous les scans **test** sont non alignés.

## Lieu Événements {#location-events}

8th Wall émet des événements à différentes étapes du cycle de vie de l'emplacement du projet (par exemple, numérisation, recherche, mise à jour de
, perte, etc.) Veuillez consulter la référence de l'API pour obtenir des instructions spécifiques sur la gestion de ces événements
dans votre application web :

- [AFrame Events](/api/aframeevents)
- [PlayCanvas Events](/api/playcanvasevents/playcanvas-image-target-events)
- [XrController Dispatched Events](/api/xrcontroller/pipelinemodule/#dispatched-events)

## Scans d'essai {#test-scans}

Les scans de test sont un maillage unique, accessible à un seul espace de travail, pour développer et tester les
expériences VPS. Bien que les analyses de test soient une excellente solution pour développer et tester des expériences VPS
pendant qu'un emplacement public est en cours de nomination ou d'activation, leur utilisation n'est pas autorisée dans les projets publiés sur
.

Les scans de test sont créés à l'aide de l'application Niantic Wayfarer. Assurez-vous que vous êtes connecté à Wayfarer en utilisant les informations d'identification de
8th Wall et que l'espace de travail correct est sélectionné sur la page Profil. Le scan de test
ne sera disponible que dans l'espace de travail 8th Wall sélectionné au moment du scan et du
téléchargement. Les scans ne peuvent pas être déplacés vers un autre espace de travail ou un autre compte Lightship.

Dans l'application Wayfarer, sélectionnez _Scan_ et [prenez un scan de la zone](#using-niantic-wayfarer).

Les scans de test doivent durer 60 secondes ou moins ; un nouveau maillage est généré toutes les 60 secondes - un scan
de 120 secondes donnera donc 2 scans de test. Tous les balayages de test sont
[unaligned](#location-alignment).

Une fois traité, vous pouvez prévisualiser le maillage et l'ajouter à votre projet à partir du navigateur géospatial
onglet _Test Scans_.

![Onglet Scans de test](/images/private-scans-tab.jpg)

Si le traitement de votre scan de test échoue, il se peut que vous deviez effectuer un nouveau scan. Contactez
[support@lightship.dev](mailto://support@lightship.dev) pour plus d'informations.
