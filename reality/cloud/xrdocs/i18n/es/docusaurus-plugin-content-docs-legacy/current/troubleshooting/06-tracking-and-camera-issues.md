---
id: tracking-and-camera-issues
---

# Seguimiento y problemas de la cámara

## El movimiento de la cámara 6DoF no funciona {#camera-problem}

#### Edición {#camera-issue}

Cuando muevo el teléfono, la posición de la cámara no se actualiza.

#### Resolución {#camera-resolution}

Comprueba la posición de la cámara en tu escena.  La cámara **NO** debe estar a una altura (Y) de
cero.  Ajústelo a un valor distinto de cero.  La posición Y de la cámara al inicio determina efectivamente la escala
del contenido virtual en una superficie (por ejemplo, menor y, mayor contenido)

## Objeto que no sigue correctamente la superficie {#tracking-problem}

#### Edición {#tracking-issue}

El contenido de mi escena no parece "pegarse" correctamente a una superficie.

#### Resolución {#tracking-resolution}

Para colocar un objeto en una superficie, la **base** del objeto debe estar a una **altura de Y=0**.

**Nota**: Establecer la posición a una altura de Y=0 no es necesariamente suficiente.

Por ejemplo, si la transformación de su modelo se encuentra en el centro del objeto, colocándola en Y=0 resultará
en que parte del objeto vivirá por debajo de la superficie.  En este caso tendrá que ajustar la posición vertical
del objeto para que la parte inferior del objeto se sitúe en Y=0.

A menudo resulta útil visualizar la posición del objeto respecto a la superficie colocando un plano semitransparente
en Y=0.

#### A-Frame ejemplo {#a-frame-example}

```html
<a-plano
  position="0 0 0"
  rotation="-90 0 0"
  width="4"
  height="4"
  material="side: double; color: #FFFF00; transparent: true; opacity: 0.5"
  shadow>
</a-plane>
```

#### three.js ejemplo {#threejs-example}

```javascript
  // Crea un Plano 1x1 con un material amarillo transparente
  var geometry = new THREE.PlaneGeometry(1, 1, 1, 1); // THREE.PlaneGeometry (width, height, widthSegments, heightSegments)
  var material = new THREE.MeshBasicMaterial({color: 0xffff00, transparent:true, opacity:0.5, side: THREE.DoubleSide});
  var plane = new THREE.Mesh(geometry, material);
  // Rotate 90 degrees (in radians) along X so plane is parallel to ground 
  plane.rotateX(1.5708)
  plane.position.set(0, 0, 0)
  scene.add( plane );
```
