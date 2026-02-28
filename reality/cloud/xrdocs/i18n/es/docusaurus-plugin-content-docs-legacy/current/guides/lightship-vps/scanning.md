---
sidebar_position: 3
---

# Ubicaciones de escaneado

## Scaniverse para desarrolladores de Niantic {#scaniverse-for-niantic-developers}

Scaniverse para desarrolladores de Niantic integra a la perfección
el navegador geoespacial (GSB) con la galardonada experiencia de escaneado de Scaniverse. Esta dirección
agiliza considerablemente los flujos de trabajo de los desarrolladores en torno a la navegación por el mapa, la adición de ubicaciones y, por supuesto, la exploración de
:

- Hemos adaptado el navegador geoespacial (GSB) para dispositivos móviles, de modo que pueda utilizarse eficazmente en
  Scaniverse para navegar por el mapa, inspeccionar ubicaciones, añadir ubicaciones y solicitar la activación de VPS.
- Flujo de inicio de sesión simplificado mediante un simple código QR que vincula Scaniverse con su cuenta de
  8th Wall.
- Hemos adoptado la interfaz de usuario de Scaniverse para facilitar la creación y carga de escaneados.
- Hemos habilitado la localización de pruebas en ubicaciones activadas por VPS dentro de Scaniverse
- Hemos integrado nuestras últimas mejoras en el filtrado de mapas para que le resulte más fácil que nunca encontrar la ubicación o ubicaciones de
  que está buscando.

### Vinculación de Scaniverse con el navegador geoespacial (GSB) {#linking-scaniverse-with-the-geospatial-browser}

**Requisito**: Instalar Scaniverse desde iOS [App Store](https://apps.apple.com/us/app/scaniverse-3d-scanner/id1541433223). Pronto habrá compatibilidad con dispositivos Android.

1. Accede a tu cuenta de 8th Wall desde tu ordenador. Abra el **Explorador geoespacial (GSB)**, seleccione cualquier ubicación
   en el mapa y, a continuación, seleccione **Ver detalles**. En la esquina inferior derecha de la tarjeta de detalles de la ubicación
   , pulse **Generar código QR**. Aparecerá un código QR.

![Scaniverse1](/images/scaniverse1.png)

2. Escanea el **código QR** con tu aplicación Cámara. Abre la aplicación Cámara de tu teléfono y apunta al código QR.

3. Pulse sobre el enlace **Scaniverse** que aparece. Esto vinculará Scaniverse con tu cuenta de desarrollador de 8th Wall
   . Sólo hay que hacerlo una vez.
   :::info
   **Asegúrese de permitir que www.8thwall.com utilice
   su ubicación actual cuando se le solicite; esto es necesario para el correcto funcionamiento de la interfaz GSB.**
   :::

![Scaniverse2](/images/scaniverse2.png)

4. Una vez que haya vinculado Scaniverse a GSB, podrá volver a la pantalla GSB en cualquier momento
   pulsando el **botón GSB** en la cinta inferior de la aplicación Scaniverse. Tenga en cuenta que puede desvincular
   Scaniverse de GSB en cualquier momento accediendo al menú **Configuración** y desactivando la opción \*\*Modo desarrollador de Niantic
   \*\*.

5. Todos los escaneos que hayas realizado fuera del Modo Desarrollador de Niantic seguirán siendo accesibles cuando
   vincule/desvincule Scaniverse con GSB.

![Scaniverse3](/images/scaniverse3.png)

### Navegar por el mapa GSB en Scaniverse

1. Pulsando sobre el icono **Persona** podrá seleccionar su 8º Espacio de Trabajo en la Pared.

2. Si pulsa el botón **cargar** podrá seleccionar la ubicación de los escaneos que desea cargar. Tenga en cuenta que
   sólo los escaneos que se originan desde el Modo Desarrollador de Niantic (utilizando las opciones Añadir Escaneos o Escaneo de Prueba) pueden
   ser cargados a Niantic para propósitos de activación de VPS.

3. Si pulsa el botón **Plus** podrá crear nuevas ubicaciones y realizar exploraciones de prueba.

4. Si pulsa el botón **Capas**, se activará la vista por satélite del mapa.

5. Al tocar el botón **Reticule**, el mapa se centrará en su ubicación.

6. Si pulsa el botón **Brújula**, el mapa volverá a su orientación por defecto, norte arriba.

7. El botón **Controles** le permitirá aplicar filtros a las localidades que aparecen en el mapa
   en función de su tamaño, categoría o estado de activación.

8. El botón **Lupa** le permitirá buscar en el mapa.

9. Al pulsar el botón **X** se cerrará el GSB y volverá a la pantalla de inicio de Scaniverse.

![Scaniverse4](/images/scaniverse4.jpg)

10. Al seleccionar una ubicación en el mapa aparecerá una pantalla de **Previsualización**, que puede pulsarse para obtener más detalles en
    .

11. Si ha seleccionado una localización activada por VPS, puede pulsar el botón **Probar VPS** para verificar que la localización
    funciona.

12. Para crear una exploración y añadirla a una ubicación concreta, pulse el botón **Añadir exploraciones** de la ubicación correspondiente en
    . Tenga en cuenta que debe estar cerca de la ubicación para que la opción Añadir exploraciones esté disponible.

![Scaniverse5](/images/scaniverse5.png)

### Crear y cargar escaneos

1. El botón **Grabar** se utiliza para iniciar y detener el proceso de escaneado.

2. El botón **Pausa** puede utilizarse para suspender temporalmente el proceso de escaneado si se desea.

3. La pantalla **Tiempo** indica la duración de la exploración actual. Se requiere una duración mínima de 15 segundos
   para que un escaneo sea viable para su carga con fines de desarrollo VPS. Lo ideal es una exploración de 30-60 segundos
   (las exploraciones de más de 60 segundos se dividen en varios fragmentos para procesarlas en
   ).

4. Si pulsa el botón **X** volverá a la pantalla de inicio de Scaniverse.

![Scaniverse6](/images/scaniverse6.png)

5. Cuando haya completado un escaneo, podrá inspeccionar una **Malla de Revisión** de la escena que
   capturó.

6. Si está satisfecho con su escaneado, puede cargarlo inmediatamente pulsando el botón \*\*Cargar escaneado de
   \*\*.

7. También puede elegir **Descargar más tarde** si desea utilizar una conexión WiFi (recomendado).

8. Si no está satisfecho con su escaneado, puede descartarlo pulsando el botón **Borrar**.

![Scaniverse7](/images/scaniverse7.png)

## Instalación de Niantic Wayfarer {#installing-niantic-wayfarer}

Actualmente sólo admitimos Wayfarer App en iOS, que es una alternativa a scaniverse. Para escanear nuevas ubicaciones VPS
o añadir escaneos a ubicaciones previamente activadas, consulte a continuación las instrucciones de instalación y uso de
.

### iOS {#ios}

La app Niantic Wayfarer requiere iOS 12 o posterior y un iPhone 8 o posterior. No es necesario un dispositivo LiDAR
.

Para instalar la aplicación Niantic Wayfarer, visita
[Testflight for Niantic Wayfarer](https://testflight.apple.com/join/VXu1F2jf)
([8th.io/wayfarer-ios](https://8th.io/wayfarer-ios))
en tu dispositivo iOS.

## Uso de Niantic Wayfarer {#using-niantic-wayfarer}

Puedes añadir exploraciones a [Ubicaciones públicas](./vps-locations.md#location-types) así como crear
[Exploraciones de prueba](./vps-locations.md#test-scans) con la aplicación Niantic Wayfarer.

Una vez que haya instalado la aplicación, inicie sesión con sus credenciales de 8th Wall pulsando el botón _Iniciar sesión con
8th Wall_.

Si tiene acceso a varios espacios de trabajo, seleccione un espacio de trabajo pulsando el desplegable _8th Wall Workspace_
en la página de perfil.

| Página de acceso                                      | Página de perfil                                          |
| ----------------------------------------------------- | --------------------------------------------------------- |
| ![wayfarer app login](/images/wayfarer-app-login.jpg) | ![wayfarer app profile](/images/wayfarer-app-profile.jpg) |

En la página _Mapa_, seleccione una Ubicación VPS para añadir una exploración a una Ubicación pública (1), o seleccione _Exploración_ para añadir una exploración de prueba a su espacio de trabajo (2).

Realice un escaneado de la zona utilizando la [técnica de escaneado] recomendada (#scanning-technique).

| Mapa de la página                                   | Página de exploración                               |
| --------------------------------------------------- | --------------------------------------------------- |
| ![wayfarer add scan](/images/wayfarer-add-scan.jpg) | ![wayfarer scanning](/images/wayfarer-scanning.jpg) |

Una vez finalizado el escaneado, seleccione público o de prueba y, a continuación, cárguelo.

| Tipo de exploración                                   | Carga de escáneres                                        |
| ----------------------------------------------------- | --------------------------------------------------------- |
| ![wayfarer scan type](/images/wayfarer-scan-type.jpg) | ![wayfarer scan upload](/images/wayfarer-scan-upload.jpg) |

El procesamiento de las exploraciones puede tardar entre 15 y 30 minutos. Una vez procesadas, las exploraciones aparecerán en el navegador geoespacial.

Las cuestiones relacionadas con el escaneado o el tratamiento deben dirigirse a [support@lightship.dev](mailto://support@lightship.dev).

Puedes encontrar más información sobre cómo utilizar la aplicación Wayfarer en la [documentación de Lightship](https://lightship.dev/docs/ardk/vps/generating_scans.html#using-the-niantic-wayfarer-app).

## Técnica de escaneado {#scanning-technique}

Las ubicaciones activadas por VPS escaneadas no deben tener más de 10 metros de diámetro alrededor de la ubicación.
Por ejemplo, una estatua típica funcionaría como una Ubicación activada por VPS. Un edificio entero, sin embargo,
no lo haría. Una cara o puerta/entrada a un edificio podría funcionar. Recomendamos empezar por
con zonas más pequeñas (por ejemplo, un escritorio, una estatua o un mural).

Antes de escanear, sea consciente de su entorno y asegúrese de que tiene derecho a acceder a la ubicación
que está escaneando.

1. Compruebe el área que se va a explorar y los alrededores del objeto explorado para determinar si hay
   algún obstáculo y para seleccionar una ruta de exploración. Es necesario planificar la ruta que pretende
   utilizar para la exploración antes de iniciar el procedimiento.

2. Asegúrate de que tu cámara está enfocada. El movimiento de la cámara puede afectar negativamente a la reconstrucción 3D. Mantén
   tu teléfono lo más cerca posible de tu costado para evitar el desenfoque. Camine alrededor del objeto que está escaneando en
   en lugar de quedarse parado en un lugar y mover el teléfono.

3. Camine a un ritmo lento y natural. Muévase lenta y suavemente durante la exploración. Los cambios bruscos de dirección
   son un no-no definitivo. Muévete lenta y suavemente con los pies en el suelo. Si escanea en
   en un entorno oscuro, es aún más importante moverse lenta y suavemente. Mueva el teléfono
   con usted mientras se mueve (piense en caminar como un cangrejo).

4. VPS La ubicación debe ser siempre el punto central. Para que podamos construir el mapa, es importante
   centrarse en la Localización VPS y capturar la órbita completa de 360° de la misma. Si no es seguro o no es posible
   obtener una cobertura de 360°, capta todo lo que puedas.

5. Varía la distancia/ángulo (0-10 m o 0-35 pies). Para que el mapa 3D funcione bien en diferentes escenarios de
   , es importante que capturemos el entorno que rodea la Localización y dispongamos de una variedad de
   escaneos diferentes. Es importante variar la distancia y los ángulos al explorar la Ubicación.

Vídeo de la técnica recomendada de escaneado de ubicaciones VPS:

```mdx-code-block
<iframe width="560" height="315" src="https://www.youtube.com/embed/FYS3fe5drf0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
```

#### Cosas que hay que evitar al escanear {#things-to-avoid-while-scanning}

1. Evite escanear cuando el entorno no sea seguro, por ejemplo, en medio de la carretera o en un parque infantil
   con niños.

2. Evite escanear cuando la Localización esté demasiado lejos (>10m o 35ft) o sea demasiado grande para enfocarla con su cámara
   .

3. Evite escanear mientras pasea o hace footing. Es importante mantener la ubicación
   como punto central en todo momento.

4. Evita apuntar con el teléfono a objetos muy brillantes, como una luz fluorescente o el sol.

5. Evite no moverse o moverse demasiado rápido mientras explora. Los movimientos bruscos provocarán desplazamientos en la reconstrucción de
   .

6. Evita escanear si el teléfono se calienta demasiado. Si la temperatura del dispositivo aumenta demasiado, el rendimiento de
   se reducirá considerablemente, lo que afectará negativamente a la exploración.

7. Evite subir escaneos que parezcan incompletos o poco representativos de lo que intenta escanear en
   .