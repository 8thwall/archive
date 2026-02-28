---
id: tracking-and-camera-issues
---

# Questions relatives au suivi et à la caméra

## le mouvement de la caméra 6DoF ne fonctionne pas {#camera-problem}

#### Problème {#camera-issue}

Lorsque je déplace mon téléphone, la position de la caméra ne se met pas à jour.

#### Résolution {#camera-resolution}

Vérifiez la position de l'appareil photo dans votre scène.  La caméra ne doit **PAS** être à une hauteur (Y) de zéro.  Réglez-le sur une valeur non nulle.  La position Y de la caméra au départ détermine effectivement l'échelle du contenu virtuel sur une surface (par exemple, plus y est petit, plus le contenu est grand)

## L'objet ne suit pas correctement la surface {#tracking-problem}

#### Problème {#tracking-issue}

Le contenu de ma scène ne semble pas "coller" correctement à la surface

#### Résolution {#tracking-resolution}

Pour placer un objet sur une surface, la base **** de l'objet doit se trouver à une hauteur **de Y=0**

**Note** : Fixer la position à une hauteur de Y=0 n'est pas nécessairement suffisant.

Par exemple, si la transformation de votre modèle se trouve au centre de l'objet, le fait de la placer à Y=0 aura pour conséquence qu'une partie de l'objet vivra sous la surface.  Dans ce cas, vous devrez ajuster la position verticale de l'objet ( ) de manière à ce que le bas de l'objet se trouve à Y=0.

Il est souvent utile de visualiser le positionnement des objets par rapport à la surface en plaçant un plan semi-transparent à Y=0.

#### Exemple de cadre A {#a-frame-example}

```html
<a-plane
  position="0 0 0"
  rotation="-90 0 0"
  width="4"
  height="4"
  material="side: double; color: #FFFF00; transparent: true; opacity: 0.5"
  shadow>
</a-plane>
```

#### exemple three.js {#threejs-example}

```javascript
  // Créez un plan 1x1 avec un matériau jaune transparent
  var geometry = new THREE.PlaneGeometry(1, 1, 1, 1) ; // THREE.PlaneGeometry (width, height, widthSegments, heightSegments)
  var material = new THREE.MeshBasicMaterial({color: 0xffff00, transparent:true, opacity:0.5, side: THREE.DoubleSide}) ;
  var plane = new THREE.Mesh(geometry, material) ;
  // Rotation de 90 degrés (en radians) le long de X pour que le plan soit parallèle au sol
  plane.rotateX(1.5708)
  plane.position.set(0, 0, 0)
  scene.add( plane ) ;
```
