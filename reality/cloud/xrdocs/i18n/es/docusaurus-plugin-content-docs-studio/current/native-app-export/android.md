---
id: android
description: En esta sección se explica cómo exportar a Android.
---

# Android

## Exportar a Android

1. **Abre tu proyecto de Studio**. Asegúrese de que el proyecto cumple los [criterios de requisitos](/studio/native-app-export/#requirements).

2. Haga clic en **Publicar**. En **Exportar**, selecciona **Android**.

3. \*\*Personaliza la compilación de tu aplicación
   - **Nombre de pantalla:** El nombre que aparece en la pantalla de inicio de Android.
   - **Identificador del paquete:** Una cadena única, por ejemplo `com.miempresa.miapp`.
   - **(Opcional)** Subir un **Icono de aplicación** (1024x1024)

4. Una vez completada la información básica de tu aplicación, haz clic en **Continuar** para finalizar la configuración de la compilación.

---

## Finalización de los ajustes de compilación

Ahora definirás cómo se empaqueta tu aplicación:

- **Versión:** Utilice el versionado semántico (por ejemplo, `1.0.0`)
- **Orientación:**
  - **Retrato:** Mantiene la aplicación fija en posición vertical, incluso cuando se gira el dispositivo.
  - **Paisaje izquierdo:** Muestra la aplicación horizontalmente con el dispositivo girado de modo que el lado izquierdo esté hacia abajo.
  - **Paisaje derecho:** Muestra la aplicación horizontalmente con el dispositivo girado de modo que el lado derecho esté hacia abajo.
  - **Rotación automática:** Permite a la aplicación seguir la rotación física del dispositivo, cambiando automáticamente entre las vistas vertical y horizontal.
  - **Giro automático (sólo horizontal):** Ajusta la posición de la aplicación en función de la rotación del dispositivo, pero sólo en vistas horizontales.
- **Barra de estado:**
  - **Sí:** Muestra la barra de estado del sistema por defecto sobre la aplicación.
  - **No:** Oculta la barra de estado del sistema por defecto.
- \*\*Tipo de construcción
  - **APK (Android Package):** Archivos de instalación directa para pruebas o carga lateral.
  - **AAB (Android App Bundle):** Necesario para publicar en Google Play
- \*\*Modo de construcción
  - **Recarga en directo:** Obtiene actualizaciones de Studio a medida que se actualiza el proyecto.
  - \*\*Paquete estático: compilación completa y autónoma.
- **Entorno:** Seleccione entre `Dev`, `Latest`, `Staging` o `Production`.

Cuando todo esté listo, haz clic en **Build** para generar el paquete de tu aplicación.

> Una vez finalizada la compilación, descarga el archivo `.apk` o `.aab` utilizando los enlaces de descarga que aparecen en el resumen de compilación.

---

## Publicación en Google Play Store

Una vez completada la exportación, estarás listo para publicar tu aplicación en Play Store utilizando el **AAB (Android App Bundle)**:

### ¿Por qué AAB?

Google exige el formato AAB para todas las aplicaciones nuevas desde agosto de 2021. AAB ayuda a optimizar la entrega generando APK específicos para cada dispositivo y reduciendo el tamaño de la aplicación.

### Subir a Google Play Console

1. Inicie sesión en [Play Console](https://play.google.com/console) e inscríbase en Play App Signing si es necesario.
2. Navega hasta **"Crear app "** → rellena nombre, idioma, estado gratuito/pagado.
3. Vaya a **Prueba y publicación** → **Producción** (o pista interna/beta). Haz clic en **Crear nueva versión** y, a continuación, sube tu archivo .aab arrastrándolo a la sección **Drop app bundles here to upload**.
4. Listado completo de tiendas, política de privacidad, clasificación de contenidos y regiones objetivo
5. Revise y ponga en marcha su lanzamiento

🔗 [Consulta la documentación completa de la subida aquí: Sube tu app a la Play Console](https://developer.android.com/studio/publish)

---

## Instalación directa en un dispositivo Android

### Instalación en un dispositivo Android físico

1. Habilita **"instalar aplicaciones desconocidas "** para tu navegador o gestor de archivos
2. Transfiere el APK por USB, correo electrónico o almacenamiento en la nube
3. Abre el APK desde tu dispositivo y pulsa **Instalar**.

**Para el método de línea de comandos:**

```bash
adb install path/to/app.apk
```

### Instalación en un emulador de Android

1. Configura un emulador en el Gestor de AVD de Android Studio.
2. Ejecuta el emulador.
3. Arrastra y suelta el APK desde tu ordenador en el emulador para instalarlo.

En la terminal:

```bash
adb install path/to/app.apk
```
