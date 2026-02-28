# XR

8th Walls World Tracking und Face Effects können in Studio visuell genutzt werden. Bild
Ziele, Himmelssegmentierung, VPS und Handverfolgung sind in Kürze verfügbar.

In Studio gibt es drei Arten von Kameras: Nur 3D, Gesicht und Welt. Jeder dieser Kameratypen
hat unterschiedliche Einstellungen. Für AR-Erlebnisse ist eine Gesichts- oder Weltkamera erforderlich. Um mehr
über das Erstellen und Verwalten einer Kamera in Ihrer Szene zu erfahren, lesen Sie bitte den Abschnitt [Camera](/studio/guides/camera)
.

Studio bietet Werkzeuge für die Arbeit mit XR in Ihrem Projekt. Für die Arbeit mit World Effects bietet Studio
6DoF-Kameratracking und Schnittstellen zur Konfiguration des Trackings. Mit Face Effects bietet Studio
eine Face Mesh-Komponente, die das Konfigurieren und Testen des Effekts sowie das Einrichten von
Gesichtspunkten unterstützt. Eine Flächennetzkomponente kann über die Schaltfläche (+) in der Hierarchie hinzugefügt werden. Studio
bietet auch Tools für die Vorschau von XR-Erlebnissen - im Abschnitt Simulator erfahren Sie mehr über
, um Ihr XR-Projekt zu testen.

![AugmentedRealityAddFace](/images/studio/augmented-reality-add-face.png)

![AugmentedRealityFaceMesh](/images/studio/augmented-reality-face-mesh.png)

Bei der Vorschau von Gesichtseffekten in Studio wird die Gesichtskamera am Ursprung (0, 0, 0) platziert, während bei
der Gesichtsanker vor der Gesichtskamera platziert wird, wie im Screenshot unten zu sehen ist.

![FaceEffectsCamera](/images/studio/xr-face-camera.png)

## XR-API-Referenz {#xr-api-reference}

Bitte beachten Sie die [Camera](/api/studio/ecs/camera)-Komponenten-APIs, die das Kameraverhalten definieren.