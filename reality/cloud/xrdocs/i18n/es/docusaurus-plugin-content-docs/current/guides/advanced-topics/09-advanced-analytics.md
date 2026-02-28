---
id: advanced-analytics
---

# Analítica avanzada

8th Wall projects provide [basic usage analytics](/guides/projects/usage-and-recent-trends), allowing you to see how many "views" your project has received, as well as average time spent by users. If you are looking for custom or more detailed analytics, we recommend adding 3rd party web analytics to your project.

The process for adding analytics to a project is the same as adding them to any non-AR website.  Puede utilizar la solución analítica que prefiera.

In this example, we’ll explain how to add Google Analytics to your 8th Wall project using Google Tag Manager (GTM) - making it easy to collect custom analytics on how users are both viewing and interacting with your project.

Utilizando la interfaz de usuario basada en web de GTM, puedes definir etiquetas y crear desencadenantes que hagan que tu etiqueta se lance cuando se produzcan determinados eventos. En su proyecto 8th Wall, lance eventos (utilizando una sola línea de Javascript ) en los lugares deseados de su código.

## Requisitos previos para analítica {#analytics-pre-requisites}

Debes tener ya cuentas de Google Analytics y Google Tag Manager y tener conocimientos básicos de su funcionamiento.

Para más información, consulte la siguiente documentación de Google:

* Google Analytics 4
  * Cómo empezar: <https://support.google.com/analytics/answer/9304153>
  * Añada un flujo de datos: <https://support.google.com/analytics/answer/9304153#stream>
* Google Tag Manager
  * Resumen: <https://support.google.com/tagmanager/answer/6102821>
  * Configuración e instalación: <https://support.google.com/tagmanager/answer/6103696>

## Añade Google Tag Manager a su proyecto 8th Wall {#add-google-tag-manager-to-your-8th-wall-project}

1. En la página de área de trabajo de su contenedor Tag Manager, haga clic en el ID de su contenedor (por ejemplo, "**GTM-XXXXXX**") para abrir el cuadro "Instalar Google Tag Manager".  Esta ventana contiene el código que tendrá que añadir más adelante a su proyecto de 8th Wall.

![GTM1](/images/gtm1.jpg)

2. Abra el editor de la nube del 8th Wall y pegue el bloque de código **arriba****head.html**:

![GTM2](/images/gtm2.jpg)

3. Haga clic en "+" junto a archivos, y cree un nuevo archivo llamado **gtm.html**, luego pegue el contenido del bloque de código **inferior** en este archivo:

![GTM3](/images/gtm3.jpg)

4. Añada el siguiente código en la parte superior de app.js:

```javascript
import * as googleTagManagerHtml from './gtm.html'
document.body.insertAdjacentHTML('afterbegin', googleTagManagerHtml)
```

## Configurar Google Tag Manager {#configure-google-tag-manager}

1. Localice el [ID de medición de Google](https://support.google.com/analytics/answer/12270356) para su flujo de datos.
2. En GTM, [cree una etiqueta de congiguración GA4](https://support.google.com/tagmanager/answer/9442095#config).

Ejemplo:

![GTM8](/images/gtm8.jpg)

## Seguimiento de las visitas a la página {#tracking-page-views}
Las visitas a la página se rastrearán automáticamente a través de la etiqueta de configuración GA4. Consulte la página [Configurar Google Tag Manager](/guides/advanced-topics/advanced-analytics/#configure-google-tag-manager) para obtener más información.

## Seguimiento de eventos personalizados {#tracking-custom-events}

GTM también ofrece la posibilidad de lanzar eventos cuando se producen acciones personalizadas **dentro** de la experiencia WebAR . Estos eventos serán únicos de su proyecto WebAR, pero algunos ejemplos podrían ser:

* Objeto 3D colocado
* Objetivo de imagen encontrado
* Captura de pantalla realizada
* etc.

En este ejemplo, crearemos una etiqueta (con activador) y la añadiremos al proyecto de ejemplo ["AFrame: Place Ground"](https://www.8thwall.com/8thwall/placeground-aframe) que se lanza cada vez que se genera un modelo 3D.

#### Crear activador de eventos personalizado {#create-custom-event-trigger}

* Tipo de activador: **Evento personalizado**
* Nombre del evento: **placeModel**
* Este activador se lanza en: **todos los eventos personalizados**

![GTM6](/images/gtm6.jpg)

#### Crear etiqueta {#create-tag-1}

A continuación, cree una etiqueta que se lanzará cuando se dispare el activador "placeModel" en su código.

* Tipo de etiqueta: **Google Analytics: evento GA4**
* Etiqueta de configuración: (Seleccione la configuración creada anteriormente)
* Nombre del Evento: **Lugar Modelo**
* Activación: **Seleccione el disparador "placeModel" creado en el paso anterior.**

![GTM9](/images/gtm9.jpg)

**IMPORTANTE**:  Asegúrese de guardar todos los activadores/etiquetas creados y, a continuación, **Envíe/Publique** sus ajustes dentro de la interfaz GTM para que estén activos. Consulte <https://support.google.com/tagmanager/answer/6107163>

#### Lanzar eventos dentro del proyecto de 8th Wall {#fire-event-inside-8th-wall-project}

En su proyecto de 8th Wall, añada la siguiente línea de javascript para lanzar este activador en el lugar deseado de su código:

`window.dataLayer.push({event: 'placeModel'})`

##### Ejemplo - basado en <https://www.8thwall.com/8thwall/placeground-aframe/master/tap-place.js> {#example---based-on-httpswww8thwallcom8thwallplaceground-aframemastertap-placejs}

```javascript
export const tapPlaceComponent = {
  init: function() {
    const ground = document.getElementById('ground')
    ground.addEventListener('click', event => {
      // Crear una nueva entidad para el nuevo objeto
      const newElement = document.createElement('a-entity')

      // El raycaster da una localización del toque en la escena
      const touchPoint = event.detail.intersection.point
      newElement.setAttribute('position', touchPoint)

      const randomYRotation = Math.random() * 360
      newElement.setAttribute('rotation', '0 ' + randomYRotation + ' 0')

      newElement.setAttribute('visible', 'false')
      newElement.setAttribute('scale', '0.0001 0.0001 0.0001')

      newElement.setAttribute('shadow', {
        receive: false,
      })

      newElement.setAttribute('class', 'cantap')
      newElement.setAttribute('hold-drag', '')

      newElement.setAttribute('gltf-model', '#treeModel')
      this.el.sceneEl.appendChild(newElement)

      newElement.addEventListener('model-loaded', () => {
        // Una vez cargado el modelo, estamos listos para mostrarlo emergiendo mediante una animación
        newElement.setAttribute('visible', 'true')
        newElement.setAttribute('animation', {
          property: 'scale',
          to: '7 7 7',
          easing: 'easeOutElastic',
          dur: 800,
        })

        // **************************************************
        //Lanzar el evento Google Tag Manager una vez cargado el modelo
        // **************************************************
        window.dataLayer.push({event: 'placeModel'})
      })
    })
  }
}
```
