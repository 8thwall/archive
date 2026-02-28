# xrfacefound

## Description {#description}

Cet événement est émis par [`xrface`](/legacy/api/aframe/#face-effects) lorsqu'un visage est trouvé pour la première fois.

`xrfacefound.detail : {id, transform, vertices, normals, attachmentPoints}`

| Propriété                                                                                                                                      | Description                                                                                                                                                                                                            |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                                                                                                                                             | Un identifiant numérique de la face localisée.                                                                                                                                                         |
| transformer : `{position, rotation, échelle, largeur mise à l'échelle, hauteur mise à l'échelle, profondeur mise à l'échelle}` | Informations sur la transformation de la face localisée.                                                                                                                                               |
| sommets : [{x, y, z}]                                                      | Position des points du visage par rapport à la transformation.                                                                                                                                         |
| normales : [{x, y, z}]                                                     | Direction normale des sommets, par rapport à la transformation.                                                                                                                                        |
| attachmentPoints : `{ nom, position : {x,y,z} }`                                                                               | Voir [`XR8.FaceController.AttachmentPoints`](/legacy/api/facecontroller/attachmentpoints) pour la liste des points d'attache disponibles. `position` est relative à la transformation. |
| uvsInCameraFrame `[{u, v}]`                                                                                                                    | La liste des positions uv dans l'image de la caméra correspondant aux points de vertex renvoyés.                                                                                                       |

`transform` est un objet avec les propriétés suivantes :

| Propriété                   | Description                                                                                  |
| --------------------------- | -------------------------------------------------------------------------------------------- |
| poste {x, y, z}             | La position 3D de la face située.                                            |
| rotation {w, x, y, z}       | L'orientation locale en 3D de la face localisée.                             |
| échelle                     | Facteur d'échelle à appliquer aux objets attachés à cette face.              |
| largeur mise à l'échelle    | Largeur approximative de la tête dans la scène, multipliée par l'échelle.    |
| hauteur mise à l'échelle    | Hauteur approximative de la tête dans la scène, multipliée par l'échelle.    |
| profondeur mise à l'échelle | Profondeur approximative de la tête dans la scène, multipliée par l'échelle. |

## Exemple {#example}

```javascript
const faceRigidComponent = {
  init : function () {
    const object3D = this.el.object3D
    object3D.visible = false
    const show = ({detail}) => {
      const {position, rotation, scale} = detail.transform
      object3D.position.copy(position)
      object3D.quaternion.copy(rotation)
      object3D.scale.set(scale, scale, scale)
      object3D.visible = true
    }
    const hide = ({detail}) => { object3D.visible = false }
    this.el.sceneEl.addEventListener('xrfacefound', show)
    this.el.sceneEl.addEventListener('xrfaceupdated', show)
    this.el.sceneEl.addEventListener('xrfacelost', hide)
  }
}
```
