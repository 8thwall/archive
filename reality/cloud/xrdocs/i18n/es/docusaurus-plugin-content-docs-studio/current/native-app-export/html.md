---
id: html
description: En esta sección se explica cómo exportar un paquete HTML5.
---

# HTML

## Exportación de un paquete HTML5 {#exporting-an-html5-bundle}

:::info[Important]
Por el momento, todavía no se ofrecen experiencias de RA mediante la exportación a HTML5.
Tu proyecto debe utilizar cámaras 3D para funcionar correctamente.
:::

1. Actualmente, la exportación a HTML5 sólo está disponible para las cuentas de pago. Consulte la información sobre [Configuración de la cuenta](/account/settings/) para obtener más detalles.

2. **Abre tu proyecto de Studio**.

3. Haga clic en **Publicar**. En la sección **Exportar**, seleccione **HTML5**.

4. Selecciona un entorno desde el que crear tu paquete.

5. Haga clic en **Construir** para generar su paquete HTML5.

> Una vez finalizada la compilación, descargue el archivo `.zip` utilizando los enlaces de descarga que aparecen en el resumen de compilación.

---

## Publicación de su proyecto 8th Wall en plataformas de juego

Dado que los paquetes HTML5 de 8th Wall son compilaciones completas, pueden alojarse o publicarse en muchas plataformas de juego.

### Autoalojamiento

:::note
El paquete HTML5 puede autoalojarse o desplegarse de muchas formas distintas. Las instrucciones de abajo son sólo un ejemplo usando `npm`.
Para obtener información más completa sobre el autoalojamiento, consulte esta [guía](https://github.com/mikeroyal/Self-Hosting-Guide).
:::

1. Descargue el paquete `.zip` y descomprima el archivo.
2. Si aún no tiene instalado `npm`, siga las instrucciones de esta [página](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) para configurarlo.
3. Ejecute `npm install --global http-server` para instalar el paquete npm [http-server](https://www.npmjs.com/package/http-server) como herramienta CLI global.
4. Ejecute `http-server <path_to_unzipped_folder>`
   1. Ejemplo: `http-server /Usuarios/Juan/Descargas/mi-proyecto`.
5. Debe haber algunos registros que enumeran una serie de direcciones URL locales como:

```sh
Available on:
  http://127.0.0.1:8080
  http://192.168.20.43:8080
  http://172.29.29.159:8080
```

6. Abra una de las URL en su navegador.

### Itch.io

1. Descargue el paquete `.zip`.
2. Inicie sesión en [Itch.io](https://itch.io) y [cree un nuevo proyecto](https://itch.io/game/new).
3. Rellene los datos del proyecto:
   - En **Tipo de proyecto**, seleccione **HTML**.
   - En **Cargas**, seleccione **Cargar archivos**. Cargue el archivo `.zip` que descargó en el paso 1. Marque la casilla **Este archivo se reproducirá en el navegador**.
   - En **Embed options**, elija el tamaño adecuado para su proyecto.
4. Termina de configurar tu juego y publícalo.

### Viverse

1. Inicia sesión en [Viverse](https://viverse.com) y [ve a Viverse Studio](https://studio.viverse.com).
2. En **Cargar su propia construcción**, haga clic en **Cargar**.
3. Haz clic en **Crear nuevo mundo**.
4. Introduzca el **Nombre** y la **Descripción** de su proyecto y haga clic en **Crear**.
5. Haga clic en **Versiones de contenido**.
6. En **Nueva versión**, haga clic en **Seleccionar archivo**. Cargue el archivo `.zip` que descargó en el paso 1 y haga clic en **Cargar**.
7. En **Soporte iframe para vista previa**, haz clic en **Aplicar configuración iframe** y activa todos los permisos que requiera tu proyecto.
   - Tenga en cuenta que Viverse pondrá su proyecto descargado de 8th Wall en su propio iFrame, y el iFrame de Viverse tendrá que conceder un permiso que su proyecto requiere.
8. Termina de configurar tu juego y publícalo.

### Juego Jolt

1. Inicia sesión en [Game Jolt](https://gamejolt.com) y [ve a la tienda Game Jolt](https://gamejolt.com/games).
2. Haz clic en **Añade tu juego**.
3. Introduzca los detalles del proyecto y haga clic en **Guardar y Siguiente**.
4. En el panel de control del juego, en **Paquetes**, haz clic en **Añadir paquete**.
5. En **Editar paquete**, haga clic en **Nueva versión**.
6. Haga clic en **Upload Browser Build**. Cargue el archivo `.zip` que descargó en el paso 1.
7. Configura las dimensiones del juego o selecciona **Ajustar a la pantalla?** si quieres que el juego se ajuste a la pantalla.
8. Termina de configurar tu juego y publícalo.

### GamePix

:::info[Important]
GamePix no permite juegos con enlaces externos. Asegúrese de que su proyecto NO realiza llamadas de red fuera del paquete.
:::

1. Descargar el **código HTML** completo.\i
2. Regístrese para obtener una [Cuenta de desarrollador de GamePix](https://partners.gamepix.com/join-us?t=developer) y vaya al [Panel de control de GamePix](https://my.gamepix.com/dashboard).
3. Haz clic en **Crear nueva partida**.
4. Introduce los datos del juego y haz clic en **Crear**.
5. En **Info**, seleccione **HTML5-JS** en **Game Engine**.
6. En **Construir**, haga clic en **Buscar archivo**. Sube el archivo `.zip` que has descargado antes.
7. Termina de configurar tu juego y publícalo.

### Newgrounds

1. Descargar el código HTML\*\* completo. Crea un archivo `.zip` de este archivo `index.html`.
2. Regístrese para obtener una [cuenta Newgrounds](https://www.newgrounds.com).
3. Haz clic en la flecha de la esquina superior derecha y selecciona **Juego (swf, HTML5)**.
4. En **Archivo(s) de presentación**, haga clic en **Subir archivo**. Sube el archivo `.zip` que has descargado antes.
5. Configura las dimensiones de tu juego y comprueba **Pantalla táctil**.
6. Termina de configurar tu juego y publícalo.

### Y8

1. Descargar el código HTML\*\* completo. Crea un archivo `.zip` de este archivo `index.html`.
2. Inicie sesión en [Y8](https://www.y8.com/upload).
3. Asegúrate de haber verificado tu correo electrónico y, a continuación, [crea una cuenta gratuita de almacenamiento Y8](https://account.y8.com/storage_account).
4. En **Juego**, elige **Zip** y luego **HTML5**.
5. Haga clic en **Seleccionar archivo**. Sube el archivo `.zip` que has descargado antes. Si no ha creado una cuenta de almacenamiento, fallará. Si esto ocurre, haz clic en **Crear cuenta de almacenamiento** para crear una, luego actualiza la página **Carga tu contenido en Y8** e inténtalo de nuevo.
6. Termina de configurar tu juego y publícalo.

### Poki

1. Ve al [Portal del Desarrollador Poki](https://developers.poki.com/share).
2. Rellene los detalles de su proyecto, utilizando el enlace a su proyecto alojado en **Enlace a su juego**.
3. Haz clic en **Comparte tu juego**.

### Kongregate

1. Envía un correo electrónico al equipo de Kongregate a [bd@kongregate.com](mailto:bd@kongregate.com). Incluya en su correo electrónico el enlace a su proyecto alojado.

### Juegos de armadura

1. Envíe un correo electrónico al equipo de Armor Games a [mygame@armorgames.com](mailto:mygame@armorgames.com). Incluya en su correo electrónico el enlace a su proyecto alojado.

### Juegos adictivos

1. Descargar el código HTML\*\* completo.
2. Envíe un correo electrónico al equipo de Addicting Games a [games@addictinggames.com](mailto:games@addictinggames.com). Incluya el archivo `.zip` en su correo electrónico, así como el resto de la información que solicitan en el [Addicting Games Developer Center](https://www.addictinggames.com/about/upload#Send).

### Retrasado

1. Envíe un correo electrónico al equipo de Lagged a [contact@lagged.com](mailto:contact@lagged.com). Incluya en su correo electrónico el enlace a su proyecto alojado.
2. Una vez aprobado, puedes [registrarte para obtener una cuenta Lagged](https://lagged.dev/signup) utilizando el **Código de invitación** que te proporcionan y subir tu juego.

### Discordia

#### Ejemplo de proyecto

Como punto de partida para utilizar Discord Embedded SDK con tu proyecto, puedes probar nuestro proyecto de ejemplo.

1. Vaya a https://www.8thwall.com/8thwall/discord-activity-example y clone el proyecto en su espacio de trabajo.
2. Siga los pasos indicados en [Exportar un paquete HTML5](#exporting-an-html5-bundle)
3. Descarga el archivo `.zip` en la ubicación que prefieras.

#### Discord Developer Set Up

Para ejecutar un cliente web en Discord, tendrás que configurar una cuenta y crear una aplicación en el centro de desarrolladores.

1. Crea una cuenta de Discord y navega hasta https://discord.com/developers/applications

2. Cree una nueva aplicación haciendo clic en el botón de la esquina superior derecha
   1. Introduzca un nombre para la aplicación y acepte las condiciones del servicio

![New Activity](/images/studio/native-app-export/discord/new-activity.png)

3. Vaya a la página **OAuth2**, en la sección **Configuración**:
   1. Añada `http://127.0.0.1` como URI de redirección para realizar pruebas.
   2. Guarda el `Client ID` en algún lugar seguro.
   3. Haz clic en "Restablecer secreto" para recuperar el "Secreto de cliente" y guárdalo en un lugar seguro.
   4. Pulsa "Guardar" para conservar la configuración.

![Redirect](/images/studio/native-app-export/discord/redirect.png)

4. Navegue hasta la página **URL Mappings**, en la sección **Actividades**:
   1. Añade un objetivo temporal al mapeo raíz como `127.0.0.1:8888`. Esto será reemplazado más tarde con su URL pública, pero es necesario para habilitar las Actividades en el siguiente paso.

5. Vaya a la página **Configuración**, en la sección **Actividades**:
   1. Activa **Activar Actividades** y acepta el acuerdo del lanzador de aplicaciones.

![Enable Activity](/images/studio/native-app-export/discord/enable-activity.png)

6. A continuación, vaya a la pestaña **Instalación**, en la sección **Configuración**:
   1. Copie el enlace del panel **Enlace de instalación** y ábralo en su navegador.
   2. Instala la aplicación para hacerla accesible en cualquier servidor o DM.

#### Iniciar una aplicación

1. Configure el código del servidor de ejemplo en https://github.com/8thwall/discord-activity-example
   1. `git clone https://github.com/8thwall/discord-activity-example`
   2. Ejecute `npm install`
   3. Descomprime el archivo `.zip` descargado anteriormente que contiene el frontend del proyecto.
   4. Crea un archivo `.env` en la raíz del repositorio, y rellénalo con los detalles del Portal del Desarrollador de Discord:
   ```
   DISCORD_CLIENT_ID=XXXXXXXXXX
   DISCORD_CLIENT_SECRET=XXXXXXXXXX
   DISCORD_CLIENT_HOST_PATH=/path/to/unzipped/folder
   ```
   5. Introduzca `npm start` para iniciar el servidor.

2. Utilice `cloudflared` para crear un túnel, de modo que el proyecto sea accesible públicamente a través de Internet.

   1. `brew install cloudflared` para descargar la herramienta CLI \`cloudflared
   2. Ejecute `cloudflared tunnel --url http://localhost:8888`.
   3. Anote la URL generada.

   Ejemplo:

   ```
   2025-10-11T03:05:16Z INF +--------------------------------------------------------------------------------------------+
   2025-10-11T03:05:16Z INF |  Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):  |
   2025-10-11T03:05:16Z INF |  https://sporting-follow-audit-href.trycloudflare.com                                      |
   2025-10-11T03:05:16Z INF +--------------------------------------------------------------------------------------------+
   ```

   4. Abre la URL `cloudflared` en tu navegador para asegurarte de que el proyecto se carga.

3. Actualiza la configuración de tu aplicación Discord:
   1. Abre el Portal del Desarrollador de Discord y navega hasta tu aplicación
   2. Vaya a **Asignaciones URL** en la sección **Actividades**.
   3. Sustituya el destino temporal por su URL `cloudflared` para el **Mapeo raíz**.

![Cloudflare URL](/images/studio/native-app-export/discord/cloudflare-url.png)

4. Pon a prueba tu actividad en Discordia:
   1. Abre Discord y navega a cualquier DM o servidor
   2. Haz clic en el icono de actividades (mando del juego) en los controles del canal de voz
   3. Busque y haga clic en su aplicación en el panel **Aplicaciones y comandos**.

![Example Final View](/images/studio/native-app-export/discord/example-final-view.jpeg)
