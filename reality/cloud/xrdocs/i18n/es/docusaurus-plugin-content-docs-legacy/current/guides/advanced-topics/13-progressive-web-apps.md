---
id: progressive-web-apps
---

# Aplicaciones web progresivas

Las aplicaciones web progresivas (PWA) utilizan las modernas capacidades de la web para ofrecer a los usuarios una experiencia similar a la de una aplicación nativa:
. El editor de 8th Wall Cloud le permite crear una versión PWA de su proyecto
para que los usuarios puedan añadirla a su pantalla de inicio. Los usuarios deben estar **conectados a Internet**
para poder acceder.

Para habilitar el soporte PWA para tu proyecto WebAR:

1. Visite la página de configuración de su proyecto y expanda el panel "Progressive Web App". (Sólo visible para los espacios de trabajo de pago)
2. Active el control deslizante para habilitar la compatibilidad con PWA.
3. Personaliza el nombre, el icono y los colores de tu PWA.
4. Haga clic en "Guardar".

![project-settings-pwa](/images/project-settings-pwa.jpg)

**Nota**: En el caso de los proyectos de Cloud Editor, es posible que se le pida que compile y vuelva a publicar su proyecto si
se publicó anteriormente. Si decides no volver a publicar, la compatibilidad con PWA se incluirá la próxima vez que se cree tu proyecto en
.

## Referencia API PWA {#pwa-api-reference}

La biblioteca **XRExtras** de 8th Wall proporciona una API para mostrar automáticamente un aviso de instalación en su aplicación web.

Consulte la referencia de la API `PwaInstaller` en <https://github.com/8thwall/web/tree/master/xrextras/src/pwainstallermodule>.

## Requisitos de los iconos de la PWA {#pwa-icon-requirements}

- Tipos de archivo: **.png**
- Relación de aspecto: **1:1**
- Dimensiones:
  - Mínimo: \*\*512 x 512 píxeles
    - Nota: Si subes una imagen de más de 512x512, se recortará a una relación de aspecto 1:1 y se redimensionará a 512x512.

## Personalización del aviso de instalación de la PWA {#pwa-install-prompt-customization}

El módulo [PwaInstaller](https://github.com/8thwall/web/tree/master/xrextras/src/pwainstallermodule)
de XRExtras muestra un mensaje de instalación pidiendo al usuario que añada su aplicación web a su pantalla de inicio
.

Para personalizar el aspecto del indicador de instalación, puede proporcionar valores de cadena personalizados a través de la API
[XRExtras.PwaInstaller.configure()](https://github.com/8thwall/web/tree/master/xrextras/src/pwainstallermodule#configure).

Para obtener un aviso de instalación completamente personalizado, configure el instalador con
[displayInstallPrompt](https://github.com/8thwall/web/tree/master/xrextras/src/pwainstallermodule#displayinstallprompt)
y
[hideInstallPrompt](https://github.com/8thwall/web/tree/master/xrextras/src/pwainstallermodule#hideinstallprompt)

## Uso de PWA autoalojadas {#self-hosted-pwa-usage}

En el caso de las aplicaciones autoalojadas, no podemos inyectar automáticamente los detalles de la PWA en el HTML, por lo que
requiere el uso de la API de configuración con el nombre y el icono que desean que aparezcan en la solicitud de instalación de
.

Añada las siguientes etiquetas `<meta>` a la `<head>` de su html:

`<meta name="8thwall:pwa_name" content="My PWA Name">`

`<meta name="8thwall:pwa_icon" content="//cdn.mydomain.com/my_icon.png">`

## Ejemplos de código PWA {#pwa-code-examples}

#### Ejemplo básico (AFrame) {#basic-example-aframe}

```html
<a-scene
  xrextras-casi-allí
  xrextras-loading
  xrextras-runtime-error
  xrextras-pwa-installer
  xrweb>
```

#### Ejemplo básico (sin marco) {#basic-example-non-aframe}

```javascript
XR8.addCameraPipelineModules([
  XR8.GlTextureRenderer.pipelineModule(),
  XR8.Threejs.pipelineModule(),
  XR8.XrController.pipelineModule(),
  XRExtras.AlmostThere.pipelineModule(),
  XRExtras.FullWindowCanvas.pipelineModule(),
  XRExtras.Loading.pipelineModule(),
  XRExtras.RuntimeError.pipelineModule(),

  XRExtras.PwaInstaller.pipelineModule(), // Añadido aquí

  // Módulos pipeline personalizados.
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
    installTitle: 'Mi título personalizado';
    installSubtitle: 'Mi subtítulo personalizado';
    installButtonText: 'Instalación personalizada';
    iosInstallText: 'Custom iOS Install'"
  xrweb>
```

#### Ejemplo de look personalizado (sin marco) {#customized-look-example-non-aframe}

```javascript
XRExtras.PwaInstaller.configure({
  displayConfig: {
    name: 'Mi nombre personalizado de PWA',
    iconSrc: '//cdn.8thwall.com/my_custom_icon',
    installTitle: ' Mi título personalizado',
    installSubtitle: 'Mi subtítulo personalizado',
    installButtonText: 'Instalación personalizada',
    iosInstallText: 'Instalación personalizada de iOS',
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

#### Ejemplo de tiempo de visualización personalizado (sin marco) {#customized-display-time-example-non-aframe}

```javascript
XRExtras.PwaInstaller.configure({
  promptConfig: {
    minNumVisits: 5, // Los usuarios deben visitar la aplicación web 5 veces antes de que se les pregunte
    displayAfterDismissalMillis: 86400000 // Un día
  }
})
```
