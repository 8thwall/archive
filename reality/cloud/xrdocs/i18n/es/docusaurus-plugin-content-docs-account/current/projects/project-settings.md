---
id: project-settings
sidebar_position: 8
---

# Configuración del proyecto

La página Configuración del proyecto te permite:

- Establezca las preferencias del desarrollador, como las combinaciones de teclas y el modo oscuro.
- Editar la información del proyecto:
  - Título
  - Descripción
  - Actualizar la imagen de portada
- Gestionar el código de acceso
- Acceder a la cadena App Key del proyecto (**sólo autoalojado**)
- Versión del motor Freeze (**sólo suscripción activa de marca blanca**)
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
- Actualizar la imagen de portada

<!-- ## Default Splash Screen {#default-splash-screen}

The Default Splash Screen is displayed at the beginning of each Web AR experience created using the
8th Wall Cloud Editor. It cannot be customized, however, it can be disabled by purchasing a white label subscription.

![DefaultSplashScreen](/images/default-splash-screen.jpg)

To Enable or Disable the Default Splash Screen:
1. Go to the `Project Settings` page.
2. Expand the `Basic Information` section.
3. Toggle `Default Splash Screen` (On/Off)

![DefaultSplashScreenToggle](/images/basic-information-splash-screen.jpg) -->

## Código de acceso {#staging-passcode}

Cuando su aplicación se escenifica en XXXXX.staging.8thwall.app (donde XXXX representa la URL de su espacio de trabajo),
está protegida por contraseña.  Para poder ver el Proyecto WebAR, el usuario debe introducir primero el código de acceso que usted ha facilitado a
.  Se trata de una excelente forma de previsualizar proyectos con clientes u otras partes interesadas antes de que
se lance públicamente.

Un código de acceso debe tener 5 o más caracteres y puede incluir letras (A-Z, minúsculas o mayúsculas),
números (0-9) y espacios.

## Versión del motor {#engine-version}

Puede especificar la versión del motor de 8th Wall utilizada al servir clientes web públicos (`Release`
o `Beta`).

A los usuarios que vean una experiencia publicada siempre se les servirá la versión más reciente de 8th Wall
Engine de ese canal.

En general, 8th Wall recomienda utilizar el canal oficial **release** para las aplicaciones web de producción.

Si desea probar su aplicación web con una versión preliminar del motor de 8th Wall, que puede contener nuevas funciones y/o correcciones de errores que aún no han pasado por el proceso completo de control de calidad, puede cambiar al canal beta de
. Las experiencias comerciales no deben lanzarse en el canal beta.

### Versión del motor de congelación {#freezing-engine-version}

:::info
La congelación de la versión del motor sólo está disponible para proyectos con una suscripción de marca blanca activa.
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

Un proyecto con una suscripción de marca blanca no se puede eliminar. Visite la página
Account para cancelar una suscripción de marca blanca activa.

Al eliminar un proyecto, éste dejará de funcionar. No se puede deshacer esta operación.
