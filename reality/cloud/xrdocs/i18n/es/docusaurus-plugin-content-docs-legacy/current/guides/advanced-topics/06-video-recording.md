---
id: video-recording
---

# Personalizar la grabación de vídeo

La biblioteca [XRExtras](https://github.com/8thwall/web/tree/master/xrextras) de 8th Wall proporciona módulos
que gestionan las necesidades más comunes de las aplicaciones WebAR, incluyendo la pantalla de carga, los flujos de enlace social
y la gestión de errores.

El módulo XRExtras [MediaRecorder](https://github.com/8thwall/web/tree/master/xrextras/src/mediarecorder)
facilita la personalización de la experiencia de usuario de grabación de vídeo en su proyecto.

Esta sección describe cómo personalizar los vídeos grabados con cosas como el comportamiento del botón de captura
(pulsar vs mantener), añadir marcas de agua de vídeo, duración máxima del vídeo, comportamiento y aspecto de la tarjeta de finalización, etc.

## A-Frame primitives {#a-frame-primitives}

`xrextras-capture-button` : Añade un botón de captura a la escena.

| Parámetro       | Tipo   | Por defecto  | Descripción                                                                                                                                                                                                                                                                                                                                                                                              |
| --------------- | ------ | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| modo de captura | Cadena | `'estándar'` | Establece el comportamiento del modo de captura. **estándar**: pulse para hacer una foto, pulse + mantenga pulsado para grabar un vídeo. **corregido**: toque para alternar la grabación de vídeo. **foto**: pulse para hacer una foto. Una de `[estándar, fijo, foto]`. |

`xrextras-capture-config` : Configura los medios capturados.

| Parámetro               | Tipo     | Por defecto                     | Descripción                                                                                                                                                                                                                                                    |
| ----------------------- | -------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| max-duration-ms         | int      | `15000`                         | Duración total del vídeo (en milisegundos) que permite el botón de captura. Si la tarjeta final está desactivada, corresponde al tiempo máximo de grabación del usuario. 15000 por defecto. |
| dimensión máxima        | int      | `1280`                          | Dimensión máxima (anchura o altura) del vídeo capturado.  Para la configuración de fotos, consulte [`XR8.CanvasScreenshot.configure()`](/legacy/api/canvasscreenshot/configure)                                             |
| enable-end-card         | Booleano | `true`                          | Si la tarjeta final está incluida en el soporte grabado.                                                                                                                                                                                       |
| cover-image-url         | Cadena   |                                 | Fuente de la imagen de la portada. Utiliza por defecto la imagen de portada del proyecto.                                                                                                                                      |
| end-card-call-to-action | Cadena   | `'Pruébalo en: '`               | Establece la cadena de texto para la llamada a la acción en la tarjeta final.                                                                                                                                                                  |
| enlace corto            | Cadena   |                                 | Establece la cadena de texto para el enlace corto de la tarjeta final. Utiliza el enlace corto del proyecto por defecto.                                                                                                       |
| footer-image-url        | Cadena   | Desarrollado por 8th Wall image | Fuente de la imagen de pie de página de la tarjeta final.                                                                                                                                                                                      |
| watermark-image-url     | Cadena   | "null                           | Fuente de la imagen para la marca de agua.                                                                                                                                                                                                     |
| watermark-max-width     | int      | 20                              | Anchura máxima (%) de la imagen de marca de agua.                                                                                                                                                                           |
| watermark-max-height    | int      | 20                              | Altura máxima (%) de la imagen de marca de agua.                                                                                                                                                                            |
| marca de agua-ubicación | Cadena   | bottomRight                     | Ubicación de la imagen de marca de agua. Una de `topLeft, topMiddle, topRight, bottomLeft, bottomMiddle, bottomRight`.                                                                                                         |
| nombre-archivo-prefijo  | Cadena   | `'mi-captura-'`                 | Establece la cadena de texto que antepone la marca de tiempo única al nombre del archivo.                                                                                                                                                      |
| solicitud-mic           | Cadena   | `'auto'`                        | Determina si quieres configurar el micrófono durante la inicialización (`'auto'`) o durante el tiempo de ejecución (`'manual'`).                                                                         |
| incluir-escena-audio    | Booleano | `true`                          | Si es verdadero, los sonidos A-Frame de la escena formarán parte de la salida grabada.                                                                                                                                                         |

`xrextras-capture-preview` : Añade un prefab de previsualización multimedia a la escena que permite reproducir, descargar y compartir.

| Parámetro                | Tipo   | Por defecto | Descripción                                                                                                                                                                                               |
| ------------------------ | ------ | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| action-button-share-text | Cadena | "Compartir  | Establece la cadena de texto en el botón de acción cuando Web Share API 2 **está** disponible (Android, iOS 15 o superior). `'Compartir'` por defecto. |
| action-button-view-text  | Cadena | `'Ver'`     | Establece la cadena de texto en el botón de acción cuando Web Share API 2 **no** está disponible en iOS (iOS 14 o inferior). `'Ver'` por defecto.      |

## Eventos XRExtras.MediaRecorder {#xrextrasmediarecorder-events}

XRExtras.MediaRecorder emite los siguientes eventos.

#### Eventos Emitidos {#events-emitted}

| Evento emitido                 | Descripción                                                                                                                                                                            | Detalle del evento |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| mediarecorder-photocomplete    | Se emite después de hacer una foto.                                                                                                                                    | {blob}             |
| mediarecorder-recordcomplete   | Se emite una vez finalizada la grabación de vídeo.                                                                                                                     | {videoBlob}        |
| mediarecorder-previewready     | Se emite una vez finalizada una grabación de vídeo previsualizable. [(Sólo Android/Escritorio)](/legacy/api/mediarecorder/recordvideo/#parameters)  | {videoBlob}        |
| mediarecorder-finalizeprogress | Se emite cuando la grabadora está avanzando en la exportación final. [(Sólo Android/Escritorio)](/legacy/api/mediarecorder/recordvideo/#parameters) | {progress, total}  |
| mediarecorder-previewopened    | Se emite cuando se abre la vista previa de la grabación.                                                                                                               | null               |
| mediarecorder-previewclosed    | Se emite después de cerrar la vista previa de grabación.                                                                                                               | null               |

#### Ejemplo: A-Frame Primitives {#primitives-example}

```jsx
<xrextras-capture-button capture-mode="standard"></xrextras-capture-button>

<xrextras-capture-config
  max-duration-ms="15000"
  max-dimension="1280"
  enable-end-card="true"
  cover-image-url=""
  end-card-call-to-action="Pruébelo en:"
  short-link=""
  footer-image-url="//cdn.8thwall.com/web/img/almostthere/v2/poweredby-horiz-white-2.svg"
  watermark-image-url="//cdn.8thwall.com/web/img/mediarecorder/8logo.png"
  watermark-max-width="100"
  watermark-max-height="10"
  watermark-location="bottomRight"
  file-name-prefix="mi-captura-"
></xrextras-capture-config>

<xrextras-capture-preview
  action-button-share-text="Compartir"
  action-button-view-text="Ver"
  finalize-text="Exportando..."
></xrextras-capture-preview>
```

#### Ejemplo: Eventos A-Frame {#example-a-frame-events}

```javascript
window.addEventListener('mediarecorder-previewready', (e) => {
  console.log(e.detail.videoBlob)
})
```

#### Ejemplo: Cambiar el CSS del botón Compartir {#change-share-button-example}

```css
#actionButton {
  /* cambiar el color del botón de acción */
  background-color: #007aff !important;
}
```
