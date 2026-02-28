---
id: progressive-web-apps
---

# Aplicaciones web progresivas

Las Aplicaciones Web Progresivas (PWAs) utilizan las capacidades modernas de la web para ofrecer a los usuarios una experiencia similar a la de una aplicación nativa. El editor en la nube de 8th Wall le permite crear una versión PWA de su proyecto para que los usuarios puedan añadirla a su pantalla de inicio. Los usuarios deben estar **conectados a Internet** para poder acceder.

Activar la compatibilidad con la PWA en su proyecto WebAR:

1. Visite la página de configuración de su proyecto y despliegue el panel "Aplicación Web Progresiva". (Solo visible para las área de trabajo de pago)
2. Active el control deslizante para activar la compatibilidad con la PWA.
3. Personalice el nombre, el icono y los colores de su PWA.
4. Pulse "Guardar".

![project-settings-pwa](/images/project-settings-pwa.jpg)

**Nota**: Para los proyectos del editor en la nube, puede que se le pida crear y volver a publicar su proyecto si fue publicado previamente. Si decide no volver a publicar, la compatibilidad con la PWA se incluirá la próxima vez que se cree su proyecto.

## Referencia API de la PWA {#pwa-api-reference}

la biblioteca **XRExtras** de 8th Wall proporciona una API para mostrar automáticamente un aviso de instalación en su aplicación web.

Consulte la referencia de la API del `PwaInstaller` en<https://github.com/8thwall/web/tree/master/xrextras/src/pwainstallermodule>

## Requisitos del icono de la PWA {#pwa-icon-requirements}

* Tipos de archivo: **.png**
* Relación de aspecto: **1:1**
* Dimensiones:
  * Mínimo: **512 x 512 píxeles**
    * Nota: Si sube una imagen mayor de 512x512, se recortará a una proporción de 1:1 y se reahustará a 512x512.

## Personalización del aviso de instalación de la PWA {#pwa-install-prompt-customization}

El módulo [PwaInstaller](https://github.com/8thwall/web/tree/master/xrextras/src/pwainstallermodule) de XRExtras muestra un aviso de instalación que pide al usuario que añada la aplicación web a su pantalla de inicio .

Para personalizar el aspecto del aviso de instalación, puede proporcionar valores de cadena personalizados a través de la API [XRExtras.PwaInstaller.configure()](https://github.com/8thwall/web/tree/master/xrextras/src/pwainstallermodule#configure).

Para un aviso de instalación completamente personalizado, configure el instalador con [displayInstallPrompt](https://github.com/8thwall/web/tree/master/xrextras/src/pwainstallermodule#displayinstallprompt) y [hideInstallPrompt](https://github.com/8thwall/web/tree/master/xrextras/src/pwainstallermodule#hideinstallprompt)

## Uso de PWA autohospedada {#self-hosted-pwa-usage}

En el caso de las aplicaciones autohospedadas, no podemos introducie automáticamente detalles de la PWA en el HTML, por lo que requiere el uso de la API de configuración con el nombre y el icono que les gustaría que aparecieran en el aviso de instalación.

Añada las siguientes etiquetas `<meta>` al `<head>` de tu html:

`<meta name="8thwall:pwa_name" content="My PWA Name">`

`<meta name="8thwall:pwa_icon" content="//cdn.mydomain.com/my_icon.png">`

## Ejemplos de código PWA {#pwa-code-examples}

#### Ejemplo básico (AFrame) {#basic-example-aframe}

```html
<a-scene
  xrextras-almost-there
  xrextras-loading
  xrextras-runtime-error
  xrextras-pwa-installer
  xrweb>
```

#### Ejemplo básico (sin AFrame) {#basic-example-non-aframe}

```javascript
XR8.addCameraPipelineModules([
  XR8.GlTextureRenderer.pipelineModule(),
  XR8.Threejs.pipelineModule(),
  XR8.XrController.pipelineModule(),
  XRExtras.AlmostThere.pipelineModule(),
  XRExtras.FullWindowCanvas.pipelineModule(),
  XRExtras.Loading.pipelineModule(),
  XRExtras.RuntimeError.pipelineModule(),

  XRExtras.PwaInstaller.pipelineModule(), // Added here

  // Custom pipeline modules.
  myCustomPipelineModule(),
])

```

#### Ejemplo de aspecto personalizado (AFrame) {#customized-look-example-aframe}

```html
<a-scene
  xrextras-gesture-detector
  xrextras-almost-there
  xrextras-loading
  xrextras-runtime-error
  xrextras-pwa-installer="name: My Cool PWA;
    iconSrc: '//cdn.8thwall.com/my_custom_icon';
    installTitle: 'My CustomTitle';
    installSubtitle: 'My Custom Subtitle';
    installButtonText: 'Custom Install';
    iosInstallText: 'Custom iOS Install'"
  xrweb>
```

#### Ejemplo de Aspecto Personalizado (sin AFrame) {#customized-look-example-non-aframe}

```javascript
XRExtras.PwaInstaller.configure({
  displayConfig: {
    name: 'My Custom PWA Name',
    iconSrc: '//cdn.8thwall.com/my_custom_icon',
    installTitle: ' My Custom Title',
    installSubtitle: 'My Custom Subtitle',
    installButtonText: 'Custom Install',
    iosInstallText: 'Custom iOS Install',
  }
})
```

#### Ejemplo de tiempo de visualización personalizado (AFrame) {#customized-display-time-example-aframe}

```html
<a-scene
  xrweb="disableWorldTracking: true"
  xrextras-gesture-detector
  xrextras-almost-there
  xrextras-loading
  xrextras-runtime-error
  xrextras-pwa-installer="minNumVisits: 5;
    displayAfterDismissalMillis: 86400000;"
>
```

#### Ejemplo de tiempo de visualización personalizado (sin AFrame) {#customized-display-time-example-non-aframe}

```javascript
XRExtras.PwaInstaller.configure({
  promptConfig: {
    minNumVisits: 5, // Los usuarios deben visitar la aplicación web 5 veces antes de que se les pregunte
    displayAfterDismissalMillis: 86400000 // One day
  }
})
```
