# XR

El seguimiento del mundo y los efectos faciales de 8th Wall están disponibles para su uso visual en Studio. Imagen
Objetivos, Segmentación del Cielo, VPS y Seguimiento de Manos próximamente.

Hay tres tipos de cámaras en Studio: Sólo 3D, Cara y Mundo. Cada uno de estos tipos de cámara
tendrá diferentes ajustes. Para las experiencias de realidad aumentada se necesita una cámara facial o mundial. Para obtener más información
sobre la creación y gestión de una cámara en la escena, consulte la sección [Cámara](/studio/guides/camera)
.

Studio proporciona herramientas para trabajar con XR en tu proyecto. Para trabajar con World Effects, Studio
proporciona seguimiento de cámara 6DoF e interfaces para configurar el seguimiento. Con los efectos faciales, Studio
proporciona un componente de malla facial que permite configurar y probar el efecto, así como establecer puntos de fijación facial en
. Se puede añadir un componente de malla Cara mediante el botón (+) de la Jerarquía. Studio
también proporciona herramientas para previsualizar experiencias XR. Consulte la sección Simulador para obtener más información sobre cómo probar su proyecto XR en
.

![AugmentedRealityAddFace](/images/studio/augmented-reality-add-face.png)

![AugmentedRealityFaceMesh](/images/studio/augmented-reality-face-mesh.png)

Al previsualizar los efectos faciales en Studio, la cámara facial se coloca en el origen (0, 0, 0), mientras que en
el anclaje facial se coloca delante de la cámara facial, como se ve en la captura de pantalla siguiente.

![FaceEffectsCamera](/images/studio/xr-face-camera.png)

## Referencia API XR {#xr-api-reference}

Consulte las API del componente [Cámara](/api/studio/ecs/camera) que definen el comportamiento de la cámara.