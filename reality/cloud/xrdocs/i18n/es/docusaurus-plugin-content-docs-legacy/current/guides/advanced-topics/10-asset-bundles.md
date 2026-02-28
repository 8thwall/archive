---
id: asset-bundles
---

# Paquetes de activos

La función Asset bundle del Editor Cloud de 8th Wall permite utilizar activos de varios archivos.  Estos activos suelen incluir archivos que se referencian entre sí internamente utilizando rutas relativas. Los archivos ".glTF", ".hcap", ".msdf" y cubemap son algunos ejemplos habituales.

En el caso de los archivos .hcap, se carga el activo a través del archivo "principal", por ejemplo, "mi-holograma.hcap".  Dentro de este archivo hay muchas referencias a otros recursos dependientes, como archivos .mp4 y .bin.  Estos nombres de archivo son referenciados y cargados por el archivo principal como URLs con rutas relativas al archivo .hcap.

![AssetBundleGif](https://media.giphy.com/media/dB0va3gWqncbgPYxxJ/giphy.gif)

## Crear paquete de activos {#create-asset-bundle}

#### 1. Prepare sus archivos {#1-prepare-your-files}

Utilice uno de los siguientes métodos para preparar sus archivos antes de cargarlos:

- Selección múltiple de archivos individuales del sistema de archivos local
- Crea un archivo ZIP.
- Localice el directorio que contiene todos los archivos necesarios para su activo (Nota: la carga de directorios no es compatible con todos los navegadores).

#### 2. Crear nuevo paquete de activos {#2-create-new-asset-bundle}

##### Opción 1 {#option-1}

En el Editor de la nube, haga clic en el signo **"+"** a la derecha de **ASSETS** y seleccione "Nuevo paquete de activos".  A continuación, seleccione el tipo de activo.  Si no va a cargar un activo glTF o HCAP, seleccione "Otros".

![NewAssetBundle](/images/new-asset-bundle.jpg)

##### Opción 2 {#option-2}

Alternativamente, puede arrastrar los activos o ZIP directamente al panel ACTIVOS en la parte inferior derecha del Editor de Nube.

![NewAssetBundleDrag](/images/new-asset-bundle-drag.jpg)

#### 3. Vista previa de Asset Bundle {#3-preview-asset-bundle}

Una vez cargados los archivos, podrás previsualizarlos antes de añadirlos al proyecto.  Seleccione archivos individuales en el panel izquierdo para previsualizarlos en el derecho.

![NewAssetBundlePreview](/images/new-asset-bundle-preview.jpg)

#### 4. Seleccione el archivo "principal" {#4-select-main-file}

Si su tipo de activo requiere que haga referencia a un archivo, establezca este archivo como su "archivo principal". Si su tipo de activo requiere que haga referencia a una carpeta (cubemaps, etc), establezca "ninguno" como su "archivo principal".

Nota: Este paso no es necesario para los activos glTF o HCAP.  El fichero principal se configura automáticamente para estos tipos de activos.

El archivo principal no puede modificarse posteriormente.  Si selecciona el archivo equivocado, tendrá que volver a cargar el paquete de activos.

#### 5. Establecer el nombre del paquete de activos {#5-set-asset-bundle-name}

Asigne un nombre al paquete de activos. Este es el nombre de archivo con el que accederá al paquete de recursos dentro de su proyecto.

#### 6. Haga clic en "Create Bundle" {#6-lick-create-bundle}

La carga de su paquete de activos se completará y se añadirá a su proyecto de Cloud Editor.

## Vista previa de Asset Bundle {#preview-asset-bundle}

Los activos pueden previsualizarse directamente en el Editor de nubes.  Seleccione un activo a la izquierda para previsualizarlo a la derecha.  Puede previsualizar un activo específico dentro del paquete desplegando el menú "Mostrar contenido" de la derecha y seleccionando un activo dentro.

![AssetBundlePreview](/images/asset-bundle-preview.jpg)

## Cambie el nombre del paquete de activos {#rename-asset-bundle}

Para renombrar un activo, haga clic en el icono de la "flecha hacia abajo" situado a la derecha del activo y seleccione **Renombrar**.  Edite el nombre del activo y pulse Intro para guardarlo.  Importante: si cambia el nombre de un conjunto de activos, tendrá que revisar el proyecto y asegurarse de que todas las referencias apuntan al nombre actualizado del activo.

## Eliminar paquete de activos {#delete-asset-bundle}

Para eliminar un activo, haga clic en el icono de la "flecha hacia abajo" situado a la derecha del activo y seleccione **Eliminar**.

## Referencia al paquete de activos {#referencing-asset-bundle}

Para hacer referencia al conjunto de recursos desde un archivo **html** del proyecto (por ejemplo, body.html), basta con indicar la ruta correspondiente en el parámetro **src=** o **gltf-model=**.

Para hacer referencia al conjunto de activos desde **javascript**, utilice **require()**.

#### Ejemplo - HTML {#example---html}

```html
<!-- Example 1 -->
<a-assets>
  <a-asset-item id="myModel" src="assets/sand-castle.gltf"></a-asset-item>
</a-assets>
<a-entidad 
  id="model"
  gltf-model="#myModel"
  class="cantap"
  scale="3 3 3"
  shadow="receive: false">
</a-entity>


<!-- Example 2 -->
<holo-cap 
  id="holo" 
  src="./assets/mi-holograma.hcap"
  holo-scale="6"
  holo-touch-target="1.65 0.35"
  xrextras-hold-drag
  xrextras-two-finger-rotate 
  xrextras-pinch-scale="scale: 6">
</holo-cap>
```

#### Ejemplo - javascript {#example---javascript}

```javascript
const modelFile = require('./assets/mi-modelo.gltf')
```
