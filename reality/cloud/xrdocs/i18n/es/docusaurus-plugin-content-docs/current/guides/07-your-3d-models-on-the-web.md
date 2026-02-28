---
id: your-3d-models-on-the-web
---

# Tus modelos 3D en la Web

Recomendamos utilizar modelos 3D en formato GLB (glTF 2.00 binario) para todas las experiencias WebAR. GLB es actualmente el mejor formato para WebAR por su pequeño tamaño de archivo, su gran rendimiento y su versátil compatibilidad con las funciones (PBR, animaciones, etc.).

## Convertir modelos al formato GLB {#converting-models-to-glb}

Antes de exportar, asegúrese de que:

* El Pivot point está en la base del modelo (si espera que se fije al suelo)
* El vector hacia delante del objeto está a lo largo del eje Z (si espera que mire hacia delante)

Si su modelo está exportado como glTF, arraste y suelte la carpeta glTF en [gltf.report](https://gltf.report) y haga clic en _Exportar_ para convertirlo en un GLB.

Si su modelo no se puede exportar a glTF/GLB desde un software de modelado 3D, impórtelo en Blender y expórtelo como gLTF o utilice un conversor.

**Conversores en línea**: [Creators3D](https://www.creators3d.com/online-viewer), [Boxshot](https://boxshot.com/facebook-3d-converter/)

**Conversores nativos**: [Maya2glTF](https://github.com/iimachines/Maya2glTF), [3DS Max](https://doc.babylonjs.com/features/featuresDeepDive/Exporters/3DSMax)

Puede encontrar una lista completa de convertidores en <https://github.com/khronosgroup/gltf#gltf-tools>.

Es una buena idea ver el modelo en [glTF Viewer](https://gltf-viewer.donmccurdy.com/) antes de importarlo a un proyecto de 8th Wall. Esto ayudará a detectar cualquier problema con su modelo antes de añadirlo a un proyecto de 8th Wall.

Después de importar a un proyecto de 8th Wall, asegúrese de que:

* La escala es correcta en (1, 1, 1). Si la escala está desviada una cantidad significativa (por ejemplo, 0,0001 o 10 000), no cambie la escala en el código. En lugar de eso, modifíquelo en su programa de modelado y vuelva a importarlo. Cambiar la escala de forma significativa en el código puede provocar problemas de recorte en el modelo.
* Los materiales son correctos. Si su modelo tiene materiales reflectantes, pueden aparecer negros a menos que les dé algo que reflejar. Consulte el [proyecto de ejemplo de reflejos](https://www.8thwall.com/8thwall/cubemap-aframe) y/o el [proyecto de ejemplo de cristales](https://www.8thwall.com/playground/glass-materials-aframe)

Para más información sobre las mejores prácticas de modelos 3D, consulte la [sección de optimización GLB](#glb-optimization).

Consulta también la entrada del blog [5 consejos para que los desarrolladores hagan más realista cualquier proyecto WebAR de 8th Wall](https://www.8thwall.com/blog/post/41447089034/5-tips-for-developers-to-make-any-8th-wall-webar-project-more-realistic).

### Convertir FBX a GLB {#converting-fbx-to-glb}

Las siguientes instrucciones le explicarán cómo instalar y ejecutar localmente en su Mac la [herramienta de conversión FBX2glTF CLI](https://github.com/facebookincubator/FBX2glTF) desarrollada por Facebook. Esta herramienta es, con diferencia, la más fiable que hemos utilizado en 8th Wall para la conversión de FBX a GLB, y la hemos utilizado para todos nuestros contenidos propios hasta la fecha.

**Instalar FBX2glTF en su Mac**

1. Descargue este archivo: https://github.com/facebookincubator/FBX2glTF/releases/download/v0.9.7/FBX2glTF-darwin-x64
2. Terminal abierto
3. Naveguw hasta la carpeta descargas: `cd ~/Downloads`
4. Haga ejecutable el archivo: `chmod +x FBX2glTF-darwin-x64`
5. Si ve una advertencia sobre el archivo descargado, simplemente haga clic en `Cancelar`

![macos-warning-1](/images/macos-download-warning-fbx2gltf-1.jpg)

6. Abra `Preferencias del Sistema` -> `Seguridad y Privacidad`, haga clic en el icono `Bloquear` y, a continuación, introduzca su `contraseña de macOS`.

![macos-security-and-privacy](/images/macos-security-and-privacy.jpg)

7. Haga clic en `Permitir de todos modos`
8. Cierre Preferencias del Sistema.
9. Vuelva a la ventana Terminal
10. Vuelva a ejecutar el comando anterior (pulsando la flecha hacia arriba se restaurará el comando anterior): `chmod +x FBX2glTF-darwin-x64`
11. Aparecerá un aviso actualizado, haga clic en `Abrir`:

![macos-warning-2](/images/macos-download-warning-fbx2gltf-2.jpg)

12. En este punto debería poder ejecutar con éxito FBX2glTF

**Copie FBX2glTF a un directorio del sistema (Opcional)**

Para facilitar la ejecución del conversor FBX2glTF, cópielo en el directorio /usr/local/bin. Esto elimina la necesidad de navegar a la carpeta de descargas cada vez para ejecutar el comando.

1. Desde la carpeta de descargas, ejecute `sudo cp ./FBX2glTF-darwin-x64 /usr/local/bin`
2. Es probable que el sistema le pida su contraseña de macOS. Introdúzcalo y pulse `Intro`
3. Como `/usr/local/bin` debería estar en su PATH por defecto, ahora puede simplemente ejecutar `FBX2glTF-darwin-x64` desde cualquier directorio.

**Ejecutar FBX2glTF en su Mac**

1. En Terminal, navegue hasta la carpeta donde se encuentran sus archivos fbx. Aquí tiene algunos comandos útiles de para recorrer directorios a través de la línea de comandos en macOS:
  * `pwd` muestra el directorio actual del terminal.
  * `ls` muestra el contenido del directorio actual.
  * `cd` cambia de directorio, y toma una ruta relativa (por ejemplo `cd ~/Downloads`) o absoluta (por ejemplo `cd /var/tmp`)

2. Ejecute el programa `FBX2glTF-darwin-x64` e introduzca los parámetros de los archivos de entrada (-i) y de salida (-o).

#### Ejemplo FBX2glTF {#fbx2gltf-example}

```bash
FBX2glTF-darwin-x64 -i yourfile.fbx -o newfile.glb
```

3. El ejemplo anterior convertirá `yourfile.fbx` en un nuevo archivo GLB llamado `newfile.glb`
4. Arrastraey suelte el archivo GLB recién creado en https://gltf-viewer.donmccurdy.com/ para comprobar que funciona correctamente.
5. Para una configuración avanzada de la conversión glb, consulte los siguientes comandos: https://github.com/facebookincubator/FBX2glTF#cli-switches

**Conversión por lotes FBX2glTF**

Si tiene varios archivos FBX en el mismo directorio, puede convertirlos todos a la vez

1. En Terminal, naveue hasta la carpeta que contiene varios archivos FBX
2. Ejecute el siguiente comando:

#### Ejemplo de conversión por lotes FBX2glTF {#fbx2gltf-batch-conversion-example}

```bash
ls *.fbx | xargs -n1 -I {} FBX2glTF-darwin-x64  -i {} -o {}.glb
```

3. Esto debería producir versiones glb de cada archivo fbx que tengaa en la carpeta actual

## Optimización GLB {#glb-optimization}

Optimizar los activos es un paso fundamental para crear contenidos WebAR mágicos. Los activos de gran tamaño pueden provocar problemas, como carga infinita, texturas negras y fallos.

### Optimización de la textura {#texture-optimization}

Las texturas suelen ser las que más contribuyen al gran tamaño de los archivos, por lo que es buena idea optimizar primero estas.

Para obtener mejores resultados, le sugerimos que utilice texturas de 1024x1024 o inferiores. Los tamaños de las texturas deben fijarse siempre a la potencia de dos (512x512, 1024x1024, etc.).

Esto puede hacerse utilizando su programa favorito de edición de imágenes y/o modelado 3D; sin embargo, si ya tiene un modelo GLB existente, una forma rápida y fácil de cambiar el tamaño de las texturas dentro del modelo 3D es utilizar [gltf.report](https://gltf.report)

* Arrastre su modelo 3D a la página.  En la columna de la izquierda, establezca el tamaño máximo de textura deseado (1).
* Pulse reproducir (2) para ejecutar el código. La consola (abajo a la izquierda) mostrará el estado de la operación.
* Descargue su modelo GLB modificado haciendo clic en Exportar (3)

![gltf-report](/images/gltf-report.jpg)

### Compresión {#compression}

La compresión puede reducir mucho el tamaño del archivo. La compresión Draco es el método de compresión más popular y puede configurarse en los ajustes de exportación de Blender o después de exportar en [gltf.report](https://gltf.report).

Cargar modelos comprimidos en su proyecto requiere una configuración adicional. Consulte el proyecto de ejemplo [A-Frame](https://www.8thwall.com/playground/draco-compression) o el proyecto de ejemplo [three.js](https://www.8thwall.com/playground/draco-threejs) para obtener más información.

### Optimización de la geometría {#geometry-optimization}

Para una mayor optimización, diezme el modelo para reducir el número de polígonos.

En Blender, apliqie el modificador _Diezmar_ al modelo y reduzca el ajuste de_Ratio_ a un valor inferior a 1.

Seleccione _Aplicar modificadores_ en los ajustes de exportación.

### Tutorial de optimización {#optimization-tutorial}

````mdx-code-block
<iframe width="560" height="315" src="https://www.youtube.com/embed/1ToEPOHN1no" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

````
