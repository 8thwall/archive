---
id: tracking-and-camera-issues
---

# Verfolgung und Kameraprobleme

## 6DoF Kamerabewegung funktioniert nicht {#camera-problem}

#### Ausgabe {#camera-issue}

Wenn ich mein Telefon bewege, wird die Kameraposition nicht aktualisiert.

#### Auflösung {#camera-resolution}

Überprüfen Sie die Position der Kamera in Ihrer Szene.  Die Kamera sollte **NICHT** auf einer Höhe (Y) von Null sein.  Setzen Sie ihn auf einen Nicht-Null-Wert.  Die Y-Position der Kamera beim Start bestimmt effektiv den Maßstab des virtuellen Inhalts auf einer Oberfläche (z.B. kleiner y, größerer Inhalt)

## Das Objekt verfolgt die Oberfläche nicht richtig {#tracking-problem}

#### Ausgabe {#tracking-issue}

Der Inhalt in meiner Szene scheint nicht richtig an der Oberfläche zu "kleben"

#### Auflösung {#tracking-resolution}

Um ein Objekt auf einer Oberfläche zu platzieren, muss sich die **Basis** des Objekts auf einer **Höhe von Y=0 befinden**

**Hinweis**: Es reicht nicht unbedingt aus, die Position auf eine Höhe von Y=0 zu setzen.

Wenn sich die Transformation Ihres Modells beispielsweise in der Mitte des Objekts befindet, führt die Platzierung bei Y=0 dazu, dass ein Teil des Objekts unter der Oberfläche liegt.  In diesem Fall müssen Sie die vertikale Position des Objekts so anpassen, dass der Boden des Objekts bei Y=0 sitzt.

Es ist oft hilfreich, die Positionierung von Objekten relativ zur Oberfläche zu visualisieren, indem Sie eine halbtransparente Ebene bei Y=0 platzieren.

#### A-Frame Beispiel {#a-frame-example}

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

#### three.js Beispiel {#threejs-example}

```javascript
  // Erstellen Sie eine 1x1-Ebene mit einem transparenten gelben Material
  var geometry = new THREE.PlaneGeometry(1, 1, 1, 1); // THREE.PlaneGeometry (width, height, widthSegments, heightSegments)
  var material = new THREE.MeshBasicMaterial({color: 0xffff00, transparent:true, opacity:0.5, side: THREE.DoubleSide});
  var plane = new THREE.Mesh(geometry, material);
  // Drehen Sie die Ebene um 90 Grad (in Radianten) entlang der X-Achse, damit sie parallel zum Boden liegt 
  plane.rotateX(1.5708)
  plane.position.set(0, 0, 0)
  scene.add( plane );
```
