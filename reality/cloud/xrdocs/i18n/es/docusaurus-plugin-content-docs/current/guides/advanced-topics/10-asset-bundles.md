---
id: asset-bundles
---

# Paquete de activos

La función de agrupación de activos del editor de la nube de 8th Wall permite utilizar activos de varios archivos.  Estos activos suelen incluir archivos que se referencian entre sí internamente utilizando rutas relativas. los activos ".glTF", ".hcap", ".msdf" y cubemap son algunos ejemplos comunes.

En el caso de los archivos .hcap, el activo se carga a través del archivo "principal", por ejemplo "mi-holograma.hcap".  Dentro de este archivo hay muchas referencias a otros recursos relacionados, como archivos .mp4 y .bin.  Estos nombres de archivo son referenciados y cargados por el archivo principal como URLs con rutas relativas al archivo .hcap.

![AssetBundleGif](https://media.giphy.com/media/dB0va3gWqncbgPYxxJ/giphy.gif)

## Crear paquete de activos {#create-asset-bundle}

#### 1. Prepare sus archivos {#1-prepare-your-files}

Utilice uno de los siguientes métodos para preparar sus archivos antes de subirlos:

* Seleccionw varios archivos individuales de su sistema de archivos local
* Cree un archivo ZIP.
* Localice el directorio que contiene todos los archivos que necesita su activo (Nota: ¡la carga de directorios no es compatible con todos los navegadores!)

#### 2. Crear un nuevo paquete de activos {#2-create-new-asset-bundle}

##### Opción 1 {#option-1}

En el editor de la nube, haga clic en el signo "+" **** situado a la derecha de **ACTIVOS** y seleccione "Nuevo paquete de activos".  A continuación, seleccione el tipo de activo.  Si no va a subir un activo glTF o HCAP, seleccione "Otro".

![NewAssetBundle](/images/new-asset-bundle.jpg)

##### Opción 2 {#option-2}

Alternativamente, puede arrastrar los activos o ZIP directamente al panel ACTIVOS situado en la parte inferior derecha del editor de nube.

![NewAssetBundleDrag](/images/new-asset-bundle-drag.jpg)

#### 3. Vista previa del paquete de activos {#3-preview-asset-bundle}

Una vez cargados los archivos, podrá previsualizarlos antes de añadirlos a su proyecto.  Seleccione archivos individuales en el panel izquierdo para previsualizarlos en el derecho.

![NewAssetBundlePreview](/images/new-asset-bundle-preview.jpg)

#### 4. Seleccione el archivo "principal" {#4-select-main-file}

Si su tipo de activo requiere que haga referencia a un archivo, establezca este archivo como su "archivo principal". Si tu tipo de activo requiere que haga referencia a una carpeta (cubemaps, etc.), establezca "no" como su "archivo principal".

Nota: este paso no es necesario para los activos glTF o HCAP.  El archivo principal se configura automáticamente para estos tipos de activos.

El archivo principal no puede modificarse posteriormente.  Si selecciona el archivo equivocado, tendrá que volver a cargar el paquete de activos.

#### 5. Establecer el nombre del paquete de activos {#5-set-asset-bundle-name}

Dé un nombre al paquete de activos. Este es el nombre de archivo con el que accederá al paquete de recursos dentro de su proyecto.

#### 6. haga clic en "Crear paquete". {#6-lick-create-bundle}

La carga de ts paquete de activos se completará y se añadirá a su proyecto del editor de nube.

## Vista previa del paquete de activos {#preview-asset-bundle}

Los activos pueden visualizarse previamente directamente en el editor de la nube.  Seleccione un activo a la izquierda para verlo previamente a la derecha.  Puede previsualizar un activo concreto dentro del paquete desplegando el menú "Mostrar contenido" de la derecha y seleccionando un activo de su interior.

![AssetBundlePreview](/images/asset-bundle-preview.jpg)

## Cambiar el nombre del paquete de activos {#rename-asset-bundle}

Para cambiar el nombre de un activo, haga clic en el icono de la "flecha hacia abajo" situado a la derecha de su activo y elija **Cambiar nombre**.  Edite el nombre del activo y pulse Intro para guardar.  Importante: si cambia el nombre de un conjunto de activos, tendrá que revisar su proyecto y asegurarse de que todas las referencias apuntan al nombre actualizado del activo.

## Eliminar paquete de activos {#delete-asset-bundle}

Para eliminar un activo, haga clic en el icono de la "flecha hacia abajo" situado a la derecha del activo y elija **Eliminar**.

## Hacer referencia al Conjunto de Activos {#referencing-asset-bundle}

Para hacer referencia al conjunto de activos desde un archivo **html** de su proyecto (por ejemplo, body.html), solo tiene que proporcionar la ruta adecuada al parámetro **src=** o **gltf-model=**.

Para hacer referencia al paquete de activos desde **javascript**, utilice **require()**

#### Example - HTML {#example---html}

```html
<!-- Example 1 -->
<a-assets>
  <a-asset-item id="myModel" src="assets/sand-castle.gltf"></a-asset-item>
</a-assets>
<a-entity 
  id="model"
  gltf-model="#myModel"
  class="cantap"
  scale="3 3 3"
  shadow="receive: false">
</a-entity>


<!-- Example 2 -->
<holo-cap 
  id="holo" 
  src="./assets/my-hologram.hcap"
  holo-scale="6"
  holo-touch-target="1.65 0.35"
  xrextras-hold-drag
  xrextras-two-finger-rotate 
  xrextras-pinch-scale="scale: 6">
</holo-cap>
```

#### Ejemplo - javascript {#example---javascript}

```javascript
const modelFile = require('./assets/my-model.gltf')
```
