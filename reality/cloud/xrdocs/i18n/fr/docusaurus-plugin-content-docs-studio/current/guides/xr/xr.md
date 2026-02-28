# XR

Le suivi du monde et les effets de visage de 8th Wall sont disponibles pour une utilisation visuelle dans Studio. Image
Targets, Sky Segmentation, VPS, & Hand Tracking seront bientôt disponibles.

Il existe trois types de caméras dans Studio : 3D uniquement, visage et monde. Chacun de ces types d'appareil photo
aura des réglages différents. Une caméra faciale ou mondiale est nécessaire pour les expériences de réalité augmentée. Pour en savoir plus
sur la création et la gestion d'une caméra dans votre scène, veuillez consulter la section [Camera](/studio/guides/camera)
.

Studio fournit des outils pour travailler avec XR dans votre projet. Pour travailler avec World Effects, Studio
fournit un suivi de caméra 6DoF et des interfaces pour configurer le suivi. Avec Face Effects, Studio
fournit un composant Face Mesh qui permet de configurer et de tester votre effet, ainsi que de définir les points d'attache du visage sur
. Un composant de maillage de face peut être ajouté en cliquant sur le bouton (+) de la hiérarchie. Studio
fournit également des outils de prévisualisation des expériences XR - voir la section Simulateur pour en savoir plus sur le test de votre projet XR à l'adresse
.

![AugmentedRealityAddFace](/images/studio/augmented-reality-add-face.png)

![AugmentedRealityFaceMesh](/images/studio/augmented-reality-face-mesh.png)

Lors de la prévisualisation des effets de visage dans Studio, la caméra de visage est placée à l'origine (0, 0, 0) tandis que
l'ancre de visage est placée devant la caméra de visage comme le montre la capture d'écran ci-dessous.

![FaceEffectsCamera](/images/studio/xr-face-camera.png)

## Référence API XR {#xr-api-reference}

Veuillez vous référer aux API du composant [Camera](/api/studio/ecs/camera) qui définissent le comportement de la caméra.