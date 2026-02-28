---
id: project-settings
---

# Configuración del proyecto

La página Configuración del proyecto te permite:

- Establezca las preferencias del desarrollador, como las combinaciones de teclas y el modo oscuro.
- Editar la información del proyecto:
  - Título
  - Descripción
  - Activar/desactivar la pantalla de inicio por defecto
  - Actualizar la imagen de portada
- Gestionar el código de acceso
- Acceder a la cadena App Key del proyecto
- Establecer versión del motor
- Anular la publicación de la aplicación
- Desactivar temporalmente el proyecto
- Suprimir proyecto

## Preferencias del editor de código {#code-editor-preferences}

Pueden establecerse las siguientes preferencias del Editor de código:

- Modo oscuro (activado/desactivado)
  - Utilice una paleta de colores más oscura en el Editor de código que utilice colores de fondo más oscuros y colores de primer plano más claros.
- Combinaciones de teclas
  - Habilita las combinaciones de teclas de los editores de texto más populares.  Seleccione entre:
    - Normal
    - Sublime
    - Vim
    - Emacs
    - VSCode

## Información básica {#basic-information}

La Configuración del Proyecto le permite editar la Información Básica de su Proyecto

- Título del proyecto
- Descripción
- [Activar o desactivar la pantalla de bienvenida predeterminada](/legacy/guides/projects/project-settings/#default-splash-screen)
- Actualizar la imagen de portada

## Pantalla de bienvenida predeterminada {#default-splash-screen}

La pantalla de bienvenida predeterminada se muestra al principio de cada experiencia de realidad aumentada web creada con el editor
8th Wall Cloud Editor. No se puede personalizar, sin embargo, se puede desactivar para
`Proyectos comerciales` si estás en un plan de pago `Pro` o `Enterprise`.

![DefaultSplashScreen](/images/default-splash-screen.jpg)

Para activar o desactivar la pantalla de bienvenida predeterminada:

1. Vaya a la página `Configuración del proyecto`.
2. Amplíe la sección "Información básica".
3. Activar/desactivar la "pantalla de bienvenida predeterminada".

![DefaultSplashScreenToggle](/images/basic-information-splash-screen.jpg)

**Nota:** Todos los proyectos deben seguir mostrando el distintivo [Powered by 8th Wall](https://drive.google.com/drive/folders/1c9d23c5hS_HspHTUD7VceV6ocqdbPN7J?usp=sharing)
en la página de carga. Se incluye por defecto en el `Loading Module` y no puede eliminarse.
[Más información sobre la personalización de la pantalla de carga](/legacy/guides/advanced-topics/load-screen/).

## Código de acceso {#staging-passcode}

Cuando su aplicación se escenifica en XXXXX.staging.8thwall.app (donde XXXX representa la URL de su espacio de trabajo),
está protegida por contraseña.  Para poder ver el Proyecto WebAR, el usuario debe introducir primero el código de acceso que
proporciona.  Se trata de una excelente forma de previsualizar proyectos con clientes u otras partes interesadas antes de que
se lance públicamente.

Un código de acceso debe tener 5 o más caracteres y puede incluir letras (A-Z, minúsculas o mayúsculas),
números (0-9) y espacios.

## App Key {#app-key}

:::info
Las App Keys y el autoalojamiento sólo están disponibles en un [Plan personalizado](https://8thwall.com/custom).
:::

Los proyectos autoalojados requieren que se añada una App Key al código.

Para acceder a la app key de un proyecto:

1. [Cree un proyecto de editor heredado](/legacy/guides/projects/create-legacy-editor-project/) y seleccione **App Key** como tipo de proyecto.

2. En el menú de navegación de la izquierda, seleccione Configuración del proyecto:

![LeftNavProjectSettings](/images/left-nav-project-settings.jpg)

3. Desplácese hasta la sección **Autoalojamiento** de la página y despliegue el widget **Mi App Key**:

![ProjectSettingsMyAppKey](/images/project-settings-app-key.jpg)

4. Haga clic en el botón **Copiar** y pegue la cadena App Key en la etiqueta `<script>` de la página `<head>` de su código autoalojado.

#### Ejemplo - App Key {#example---app-key}

```html
<!-- Replace the X's with your App Key -->
<script async src="//apps.8thwall.com/xrweb?appKey=XXXXX"></script>
```

## Versión del motor {#engine-version}

Puede especificar la versión del motor de 8th Wall utilizada al servir clientes web públicos (`Release`
o `Beta`).

A los usuarios que vean una experiencia publicada siempre se les servirá la versión más reciente de 8th Wall
Engine de ese canal.

En general, 8th Wall recomienda utilizar el canal oficial **release** para las aplicaciones web de producción.

Si desea probar su aplicación web con una versión preliminar del motor de 8th Wall, que puede contener nuevas funciones y/o correcciones de errores que aún no han pasado por el proceso completo de control de calidad, puede cambiar al canal beta de
. Las experiencias comerciales no deben lanzarse en el canal beta.

#### Versión del motor de congelación {#freezing-engine-version}

:::note
La congelación de la versión del motor sólo está disponible para proyectos **comerciales** con una licencia activa.
:::

Para **Congelar** la versión actual del motor, seleccione el Canal deseado (release o beta) y haga clic en el botón **Congelar**.

![EngineFreeze](/images/engine-freeze.png)

Para **Reincorporarse** a un Canal y mantenerse al día, pulse el botón **Desconectar**.  Esto **descongelará**
la Versión del Motor asociada a su Proyecto y volverá a unirse a un Canal (release o beta) para utilizar la
última versión disponible para ese canal.

![EngineUnfreeze](/images/engine-unfreeze.png)

## Anular la publicación de la aplicación {#unpublish-app}

La anulación de la publicación de su proyecto lo eliminará de la puesta en escena (XXXXX.staging.8thwall.app) o público (XXXXX.8thwall.app).

Puede volver a publicarlo en cualquier momento desde las páginas Editor de código o Historial del proyecto.

Haga clic en **Unpublish Staging** para retirar su proyecto de XXXXX.staging.8thwall.app.

Haz clic en **Despublicar públicamente** para eliminar tu proyecto de XXXXX.8thwall.app

## Desactivar temporalmente el proyecto {#temporarily-disable-project}

Si desactiva su proyecto, su aplicación no será visible. Las visitas no se contabilizarán mientras estén desactivadas.

Se le seguirán cobrando las licencias comerciales activas de los proyectos que estén temporalmente desactivados.

Active o desactive su proyecto.

## Borrar proyecto {#delete-project}

No se puede eliminar un proyecto con licencia comercial. Visite la página
[Página de cuenta](/legacy/guides/account-settings#manage-commercial-licenses) para cancelar un proyecto comercial
activo.

Al eliminar un proyecto, éste dejará de funcionar. No se puede deshacer esta operación.
