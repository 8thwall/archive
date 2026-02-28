---
id: your-3d-models-on-the-web
---

# Sus modelos 3D en la Web

Recomendamos utilizar modelos 3D en formato GLB (binario glTF 2.0) para todas las experiencias WebAR. GLB es
actualmente el mejor formato para WebAR por su pequeño tamaño de archivo, gran rendimiento y versátil soporte de características
(PBR, animaciones, etc).

## Conversión de modelos al formato GLB {#converting-models-to-glb}

Antes de exportar, asegúrese de que:

- El punto de pivote está en la base del modelo (si esperas que se fije al suelo)
- El vector de avance del objeto es a lo largo del eje Z (si se espera que mire hacia adelante)

Si su modelo está exportado como glTF, arrastre y suelte la carpeta glTF en
[gltf.report](https://gltf.report) y haga clic en _Export_ para convertirlo en un GLB.

Si su modelo no puede exportarse a glTF/GLB desde un software de modelado 3D, impórtelo en Blender y
expórtelo como gLTF o utilice un conversor.

**Convertidores en línea**: [Creators3D](https://www.creators3d.com/online-viewer), [Boxshot](https://boxshot.com/facebook-3d-converter/)

**Convertidores nativos**: [Maya2glTF](https://github.com/iimachines/Maya2glTF), [3DS Max](https://doc.babylonjs.com/features/featuresDeepDive/Exporters/3DSMax)

Encontrará una lista completa de convertidores en <https://github.com/khronosgroup/gltf#gltf-tools>.

Es una buena idea ver el modelo en [glTF Viewer](https://gltf-viewer.donmccurdy.com/) antes de importarlo
a un proyecto de 8th Wall. Esto ayudará a detectar cualquier problema con su modelo antes de añadirlo
a un proyecto de 8th Wall.

Después de importar a un proyecto de 8th Wall, asegúrese de que:

- La escala parece correcta en (1, 1, 1). Si la escala está desviada por una cantidad significativa (es decir, 0,0001 o
  10000\), no cambie la escala en el código. En su lugar, modifíquelo en su programa de modelado y vuelva a importarlo en
  . Cambiar la escala de forma significativa en el código puede provocar problemas de recorte en el modelo.
- Los materiales parecen correctos. Si su modelo tiene materiales reflectantes, pueden aparecer negros a menos que
  les dé algo para reflejar. Véase el
  [proyecto de ejemplo de reflejos](https://www.8thwall.com/8thwall/cubemap-aframe) y/o el
  [proyecto de ejemplo de vidrio](https://www.8thwall.com/playground/glass-materials-aframe)

Para obtener más información sobre las mejores prácticas de modelos 3D, consulte la [sección de optimización GLB](#glb-optimization).

Consulte también la entrada del blog [5 consejos para que los desarrolladores hagan más realista cualquier proyecto WebAR de 8th Wall](https://www.8thwall.com/blog/post/41447089034/5-tips-for-developers-to-make-any-8th-wall-webar-project-more-realistic).

### Conversión de FBX a GLB {#converting-fbx-to-glb}

Las siguientes instrucciones explican cómo instalar y ejecutar la [herramienta de conversión FBX2glTF CLI] desarrollada por Facebook (https://github.com/facebookincubator/FBX2glTF) localmente en tu Mac. Esta herramienta es, con diferencia, la más fiable que hemos utilizado en 8th Wall para la conversión de FBX a GLB, y la hemos utilizado para todos nuestros contenidos first party hasta la fecha.

**Instalación de FBX2glTF en su Mac**

1. Descargue este archivo: https://github.com/facebookincubator/FBX2glTF/releases/download/v0.9.7/FBX2glTF-darwin-x64
2. Terminal abierto
3. Navegue hasta la carpeta Descargas: `cd ~/Descargas`
4. Haz que el archivo sea ejecutable: `chmod +x FBX2glTF-darwin-x64`
5. Si aparece una advertencia sobre el archivo descargado, haga clic en "Cancelar".

![macos-warning-1](/images/macos-download-warning-fbx2gltf-1.jpg)

6. Abre `Preferencias del sistema` -> `Seguridad y privacidad`, haz clic en el icono `Bloqueo` e introduce tu `contraseña de macOS`.

![macos-security-and-privacy](/images/macos-security-and-privacy.jpg)

7. Haga clic en `Permitir de todos modos`.
8. Cierre Preferencias del Sistema.
9. Volver a la ventana Terminal
10. Vuelva a ejecutar el comando anterior (pulsando la flecha hacia arriba se restaurará el comando anterior): `chmod +x FBX2glTF-darwin-x64`.
11. Aparecerá una advertencia actualizada, haga clic en `Abrir`:

![macos-warning-2](/images/macos-download-warning-fbx2gltf-2.jpg)

12. En este punto deberías ser capaz de ejecutar con éxito el FBX2glTF

**Copie FBX2glTF a un directorio del sistema (opcional)**.

Para facilitar la ejecución del conversor FBX2glTF, cópielo en el directorio /usr/local/bin. Esto elimina la necesidad de navegar hasta la carpeta Descargas cada vez que se ejecuta el comando.

1. Desde la carpeta de descargas, ejecute `sudo cp ./FBX2glTF-darwin-x64 /usr/local/bin`.
2. Es probable que el sistema te pida tu contraseña de macOS. Escríbalo y pulse `Intro`.
3. Dado que `/usr/local/bin` debería estar en su PATH por defecto, ahora puede simplemente ejecutar
   `FBX2glTF-darwin-x64` desde cualquier directorio.

**Ejecutando FBX2glTF en tu Mac**

1. En Terminal, navegue hasta la carpeta donde se encuentran sus archivos fbx. Estos son algunos comandos útiles de
   para recorrer directorios a través de la línea de comandos en macOS:

- `pwd` muestra el directorio actual del terminal.
- `ls` lista el contenido del directorio actual.
- `cd` cambia de directorio, y toma una ruta relativa (por ejemplo `cd ~/Downloads`) o absoluta (por ejemplo `cd /var/tmp`)

2. Ejecute `FBX2glTF-darwin-x64` e introduzca los parámetros de los archivos de entrada (-i) y salida (-o).

#### FBX2glTF Ejemplo {#fbx2gltf-example}

```bash
FBX2glTF-darwin-x64 -i tuarchivo.fbx -o nuevoarchivo.glb
```

3. El ejemplo anterior convertirá `suarchivo.fbx` en un nuevo archivo GLB llamado `nuevoarchivo.glb`.
4. Arrastre y suelte el archivo GLB recién creado en https://gltf-viewer.donmccurdy.com/ para comprobar que
   funciona correctamente.
5. Para una configuración avanzada de la conversión glb, consulte los siguientes comandos:
   https://github.com/facebookincubator/FBX2glTF#cli-switches

**Conversión de lotes FBX2GLTF**

Si tiene varios archivos FBX en el mismo directorio, puede convertirlos todos a la vez

1. En Terminal, navegue hasta la carpeta que contiene varios archivos FBX
2. Ejecute el siguiente comando:

#### Ejemplo de conversión por lotes FBX2glTF {#fbx2gltf-batch-conversion-example}

```bash
ls *.fbx | xargs -n1 -I {} FBX2glTF-darwin-x64 -i {} -o {}.glb
```

3. Esto debería producir versiones glb de cada archivo fbx que tenga en la carpeta actual.

## Optimización GLB {#glb-optimization}

Optimizar los activos es un paso fundamental para crear contenidos WebAR mágicos. Los activos de gran tamaño pueden provocar problemas en
, como carga infinita, texturas negras y fallos.

### Optimización de texturas {#texture-optimization}

Las texturas suelen ser las que más contribuyen a aumentar el tamaño de los archivos, por lo que conviene optimizarlas primero en
.

Para obtener mejores resultados, sugerimos utilizar texturas de 1024x1024 o inferiores. El tamaño de las texturas debe fijarse siempre en
a la potencia de dos (512x512, 1024x1024, etc.).

Esto se puede hacer utilizando su programa favorito de edición de imágenes y/o modelado 3D; sin embargo, si usted
ya tiene un modelo GLB existente, una manera rápida y fácil de cambiar el tamaño de las texturas dentro del modelo 3D
es utilizar [gltf.report](https://gltf.report)

- Arrastra tu modelo 3D a la página.  En la columna de la izquierda, ajuste el tamaño máximo de textura deseado (1).
- Pulsa play (2) para ejecutar el script. La consola (abajo a la izquierda) mostrará el estado de la operación.
- Descargue su modelo GLB modificado haciendo clic en Exportar (3)

![gltf-report](/images/gltf-report.jpg)

### Compresión {#compression}

La compresión puede reducir considerablemente el tamaño de los archivos. La compresión Draco es el método de compresión más popular
y puede configurarse en los ajustes de exportación de Blender o después de exportar en
[gltf.report](https://gltf.report).

La carga de modelos comprimidos en el proyecto requiere una configuración adicional. Para más información, consulte
[A-Frame sample project](https://www.8thwall.com/playground/draco-compression) o
[three.js sample project](https://www.8thwall.com/playground/draco-threejs).

### Optimización geométrica {#geometry-optimization}

Para una mayor optimización, diezme el modelo para reducir el número de polígonos.

En Blender, aplique el modificador _Decimate_ al modelo y reduzca el ajuste _Ratio_ a un valor inferior a 1.

Seleccione _Aplicar modificadores_ en los ajustes de exportación.

### Tutorial de optimización {#optimization-tutorial}

```mdx-code-block
<iframe width="560" height="315" src="https://www.youtube.com/embed/1ToEPOHN1no" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

```
