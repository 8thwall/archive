---
id: project-settings
---

# Configuración del proyecto

La página de configuración del proyecto le permite:

* Establecer las preferencias del desarrollador, como las combinaciones de teclas y el modo oscuro
* Editar la información del proyecto:
  * Título
  * Descripción
  * Activar/Desactivar la pantalla inicial por defecto
  * Actualizar la imagen de portada
* Gestionar el código de acceso del modo preparación
* Acceder a la cadena clave de aplicación del proyecto
* Establecer la versión del motor
* Anular la publicación de la aplicación
* Desactivar temporalmente un proyecto
* Eliminar proyectos

## Programar las preferencias del editor {#code-editor-preferences}

Se pueden establecer las siguientes preferencias del Eeitor de código:

* Modo Oscuro (Activado/Desactivado)
  * Utiliza una paleta de colores más oscura en el editor de código con colores de fondo más oscuros y colores de primer plano más claros.
* Asignación de teclas
  * Habilita las combinaciones de teclas de los editores de texto más populares.  Seleccione entre:
    * Normal
    * Sublime
    * Vim
    * Emacs
    * VSCode

## Información básica {#basic-information}

La configuración del proyecto le permite editar la información básica de su proyecto

* Título del proyecto
* Descripción
* [Activar o desactivar la pantalla de bienvenida predeterminada](/guides/projects/project-settings/#default-splash-screen)
* Actualizar la imagen de portada

## Pantalla de bienvenida predeterminada {#default-splash-screen}

La pantalla de bienvenida predeterminada se muestra al principio de cada experiencia de realidad aumentada web creada con el editor 8th Wall Cloud Editor. No se puede personalizar, sin embargo, se puede desactivar para `proyectos comerciales` si usted está en un plan de pago `Pro` o `Enterprise`.

![DefaultSplashScreen](/images/default-splash-screen.jpg)

Para activar o desactivar la pantalla de bienvenida predeterminada:
1. Vaya a la página `Configuración del proyecto`.
2. Amplíe la sección `Información básica`.
3. Activar/desactivar `la pantalla de bienvenida predeterminada`

![DefaultSplashScreenToggle](/images/basic-information-splash-screen.jpg)

**Nota:** Todos los proyectos deben seguir mostrando el distintivo [Powered by 8th Wall](https://drive.google.com/drive/folders/1c9d23c5hS_HspHTUD7VceV6ocqdbPN7J?usp=sharing) en la página de carga. Se incluye por defecto en el `módulo de carga` y no puede eliminarse. [Más información sobre la personalización de la pantalla de carga](/guides/advanced-topics/load-screen/).

## Código de acceso del modo Preparación {#staging-passcode}

Cuando su aplicación se escenifica en XXXXX.staging.8thwall.app (donde XXXX representa la URL de su área de trabajo), está protegida con contraseña.  Para poder ver el proyecto WebAR, el usuario debe introducir primero el código de acceso que le proporcione.  Es una forma estupenda de previsualizar proyectos con clientes u otras partes interesadas antes de que se lance públicamente.

Una contraseña debe tener 5 o más caracteres y puede incluir letras (AZ, minúsculas o mayúsculas), números (0-9) y espacios.

## Mi clave de aplicación (App Key) {#app-key}

Los Proyectos autohospedados requieren que se añada una clave de aplicación al código. Self-hosting and App Keys are only available to workspaces on a **Pro or Enterprise plan**. App Keys are not available on the Basic plan (or legacy Starter/Plus plans).

Acceder a la clave de aplicación de un proyecto:

1. Si su tipo de proyecto no es "Autohospedado", cree un nuevo proyecto:

![CreateProjectSelfHosted](/images/create-project-self-hosted.jpg)

Haz clic en el botón **Copiar** y péguelo en su index.html

2. En el navegador de la izquierda, seleccione Configuración del proyecto:

![LeftNavProjectSettings](/images/left-nav-project-settings.jpg)

3. Desplácese hasta la sección **Autohospedaje** de la página y despliega el widget **Mi App Key**:

![ProjectSettingsMyAppKey](/images/project-settings-app-key.jpg)

4. Haga clic en el botón **Copiar** y pegue la cadena App Key en la etiqueta `<script>` en la `<head>` de su código autohospedado

#### Ejemplo - App Key {#example---app-key}

```html
<!-- Sustituye las X por tu App Key -->
<script async src="//apps.8thwall.com/xrweb?appKey=XXXXX"></script>
```

## Versión del motor {#engine-version}

Puede especificar la versión del motor de 8th Wall que se utiliza al servir a clientes web públicos (`Publicación` o `Beta`).

A los usuarios que vean una experiencia publicada siempre se les servirá la versión más reciente del motor de 8th Wall de ese canal.

En general, 8th Wall recomienda utilizar el canal oficial de la </strong>publicación** para las aplicaciones web de producción.</p>

Si quiere probar su aplicación web con una versión preliminar del motor de 8th Wall, que puede contener nuevas funciones y/o correcciones de errores que aún no han pasado por el control de calidad completo, puedes pasar al canal beta. Las experiencias comerciales no deben lanzarse en el canal beta.

#### Congelación de la versión del motor {#freezing-engine-version}

:::note
Engine version freezing is only available to **Commercial** projects with an active license.
:::

Para **congelar** la versión actual del motor, seleccione el canal deseado (publicación o beta) y haga clic en el botón **Congelar**

![EngineFreeze](/images/engine-freeze.png)

Para **volver a unirse** a un canal y estar al día, haga clic en el botón **Descongelar**.   Esto hará que **descongele** la versión del motor asociada a su proyecto y vuelva a unirse a un Canal (de lanzamiento o beta) para utilizar la última versión disponible en ese canal.

![EngineUnfreeze](/images/engine-unfreeze.png)

## Anular la publicación de la aplicación {#unpublish-app}

Al cancelar la publicación de su proyecto lo eliminará del modo Preparación (XXXXX.staging.8thwall.app) o público (XXXXX.8thwall.app).

Puede volver a publicarlo en cualquier momento desde el editor de código o el historal de proyectos.

Haga clic en **Anular publicación de preparación** para retirar su proyecto de XXXXX.staging.8thwall.app

Haz clic en **Anular publicación** para retirar su proyecto de XXXXX.8thwall.app

## Desactivar temporalmente un proyecto {#temporarily-disable-project}

Si desactiva su proyecto, su aplicación no se podrá ver. Las visitas no se contabilizarán mientras estén desactivadas.

Se le seguirán cobrando las licencias comerciales activas de los proyectos que estén desactivados temporalmente.

Active el control deslizante para Desactivar / Activar su proyecto.

## Proyectos eliminados {#delete-project}

No se puede eliminar un proyecto con licencia comercial. Visite la [página de la cuenta](/guides/account-settings#manage-commercial-licenses) para cancelar una licencia comercial activa.

Borrar un proyecto hará que deje de funcionar. No puedes deshacer esta operación.
