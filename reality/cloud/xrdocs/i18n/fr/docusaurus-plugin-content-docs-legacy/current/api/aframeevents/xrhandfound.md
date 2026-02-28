# xrhandfound

## Description {#description}

Cet événement est émis par [`xrhand`](/legacy/api/aframe/#hand-tracking) lorsqu'une main est trouvée pour la première fois.

`xrhandfound.detail : {id, transform, vertices, normals, handKind, attachmentPoints}`

| Propriété                                                                                  | Description                                                                                                                                                                                                                      |
| ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                                                                                         | Un identifiant numérique de la main localisée.                                                                                                                                                                   |
| transformer : `{position, rotation, scale}`                                | Transformer l'information de la main située.                                                                                                                                                                     |
| sommets : [{x, y, z}]  | Position des points de la main par rapport à la transformation.                                                                                                                                                  |
| normales : [{x, y, z}] | Direction normale des sommets, par rapport à la transformation.                                                                                                                                                  |
| mainKind                                                                                   | Une représentation numérique de la main de la personne localisée. Les valeurs valables sont 0 (non spécifié), 1 (gauche) et 2 (droite). |
| attachmentPoints : `{ nom, position : {x,y,z} }`                           | Voir [`XR8.HandController.AttachmentPoints`](/legacy/api/handcontroller/attachmentpoints) pour la liste des points d'attache disponibles. Le nom du point d'attache.                             |

`transform` est un objet avec les propriétés suivantes :

| Propriété             | Description                                                                     |
| --------------------- | ------------------------------------------------------------------------------- |
| poste {x, y, z}       | La position 3d de la main située.                               |
| rotation {w, x, y, z} | L'orientation locale en 3D de la main située.                   |
| échelle               | Facteur d'échelle à appliquer aux objets attachés à cette main. |

`attachmentPoints` est un objet avec les propriétés suivantes :

| Propriété             | Description                                                                                                                                                                                          |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| nom                   | Le nom du point d'attache. Voir [`XR8.HandController.AttachmentPoints`](/legacy/api/handcontroller/attachmentpoints) pour la liste des points d'attache disponibles. |
| poste {x, y, z}       | La position 3D du point d'attache sur la main située.                                                                                                                                |
| rotation {w, x, y, z} | Quaternion de rotation qui fait pivoter le vecteur Y positif vers le vecteur osseux du point d'attache.                                                                              |
| innerPoint {x, y, z}  | Le point intérieur d'un point d'attache. (ex. main côté paume)                                                                                    |
| outerPoint {x, y, z}  | Le point extérieur d'un point d'attache. (ex. dos de la main)                                                                                     |
| rayon                 | Le rayon des points d'attache des doigts.                                                                                                                                            |
| rayon mineur          | Le rayon le plus court entre la surface de la main et le point d'attache du poignet.                                                                                                 |
| rayon principal       | Le rayon le plus long entre la surface de la main et le point d'attache du poignet.                                                                                                  |

## Exemple {#example}

```javascript
const handRigidComponent = {
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
    this.el.sceneEl.addEventListener('xrhandfound', show)
    this.el.sceneEl.addEventListener('xrhandupdated', show)
    this.el.sceneEl.addEventListener('xrhandlost', hide)
  }
}
```
