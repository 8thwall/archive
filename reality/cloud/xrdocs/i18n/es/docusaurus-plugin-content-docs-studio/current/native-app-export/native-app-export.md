---
id: native-app-export
description: En esta sección se explica cómo utilizar Native App Export.
---

# Exportación de aplicaciones nativas

:::info[Beta Reportaje]
La exportación de aplicaciones nativas se encuentra actualmente en fase beta y está limitada a las versiones **Android e iOS**. Pronto habrá compatibilidad con ordenadores de sobremesa y auriculares.
:::

Native App Export te permite empaquetar tu proyecto de Studio como una aplicación independiente.

## Requisitos {#requirements}

Tanto si construyes para iOS como para Android, asegúrate de que tu proyecto se ha construido con éxito para la web al menos una vez antes de intentar exportarlo.

### iOS

La exportación nativa para iOS está disponible para proyectos AR y 3D. Su aplicación **no será** compatible:

- Notificaciones push
- Compras dentro de la aplicación

### Android

La exportación nativa para Android sólo está disponible para proyectos que no sean AR y sólo 3D. Su proyecto **no debe** utilizar:

- Funciones de cámara o RA
- GPS
- Teclados virtuales o físicos
- Notificaciones push
- Compras dentro de la aplicación
- Texturas de vídeo
- API de MediaRecorder
- CSS
