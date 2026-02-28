---
sidebar_label: Entwicklung
sidebar_position: 4
---

# Entwicklung von VPS-Erfahrungen

## Freischaltung von Lightship VPS {#enabling-lightship-vps}

Um VPS in Ihrem WebAR-Projekt zu aktivieren, müssen Sie `enableVPS` auf `true` setzen.

Für A-Frame-Projekte setzen Sie `enableVps: true` auf der `xrweb` Komponente auf der `<a-scene>`.

Bei Nicht-AFrame-Projekten setzen Sie `enableVps: true` im Aufruf von `XR8.XrController.configure()` vor dem Start des Motors
.

#### Beispiel - AFrame {#example---aframe}

```html
<a-scene
  coaching-overlay
  landing-page
  xrextras-loading
  xrextras-runtime-error
  ...
  xrweb="enableVps: true;">
```

#### Beispiel - Nicht-AFrame {#example---non-aframe}

```javascript
XR8.XrController.configure({enableVps: true})
// Starten Sie dann die 8th Wall Engine
```

## Entwicklung von maßgeschneiderten VPS-Erfahrungen

Maßgeschneiderte VPS-Szenen sind für einen einzigen Standort konzipiert und verwenden ein Referenznetz aus dem Geospatial Browser, um AR-Inhalte auszurichten.

Teil 1: Standort zur Szene hinzufügen

1. Öffnen Sie den Geospatial Browser (Kartensymbol 🗺 auf der linken Seite)
2. Finden Sie einen VPS-aktivierten Standort (oder [nominieren/aktivieren Sie Ihren eigenen](https://www.8thwall.com/docs/web/#scanning-wayspots))
3. Hinzufügen des Standorts zum Projekt

![](https://static.8thwall.app/assets/geospatial-browser-jmcd7ic3ob.png)

Teil 2: Standort-GLB als Referenz für benutzerdefinierte AR-Animation verwenden

4. Laden Sie die Referenz-GLB auf der rechten Seite der Zeile herunter.
5. Verwenden Sie dies in Ihrer 3D-Modellierungssoftware (Blender, Maya, A-Frame, etc.), um AR-Inhalte relativ zum Mesh-Ursprung zu positionieren.

![](https://i.giphy.com/media/dOFnRHGzZghGjecdeq/giphy.gif)

_WICHTIG_: Der Ursprung dieses 3D-Modells ist der Ursprung des Standorts. SETZEN SIE DEN URSPRUNG NICHT ZURÜCK, SONST WIRD IHR INHALT NICHT AUSGERICHTET.

_OPTIONAL_: Wenn das vom Geospatial Browser heruntergeladene Mesh nicht hochwertig genug ist, um es für eine gebackene Animation, Physik oder Okkluder-Material zu verwenden,
können Sie einen Scan mit einer Drittanbieter-Anwendung wie Scaniverse erstellen und dieses hochwertige Mesh mit dem vom
Geospatial Browser heruntergeladenen Mesh abgleichen.

6. Animation GLB in Cloud Editor importieren und zur Szene hinzufügen
7. Fügen Sie die Komponente "named-location" zu Ihrem Asset "<a-entity>" hinzu. Das Attribut "Name" bezieht sich auf den "Namen" des Projektstandorts im Geospatial Browser.

Ta-da! 🪄 Ihre Animation sollte auf den Standort in der realen Welt ausgerichtet sein.

Teil 3: Hinzufügen von Okklusion und Schatten

1. Fügen Sie in Ihrer Szene `<a-entity named-location="name: LOCATIONNAME"><a-entity>` hinzu.
2. Fügen Sie drei "<a-entity>" innerhalb dieses Elements als dessen Kinder hinzu. Dies sind das Okkluder-Mesh, das Schatten-Mesh und die VPS-Animation.
3. Im ersten "<a-entity>" fügen Sie "xrextras-hider-material" und "gltf-model="#vps-mesh" hinzu. "#vps-mesh" sollte
   auf eine Version Ihrer Referenz-GLB verweisen, bei der die Texturen entfernt und die Geometrie dezimiert wurde.
4. In der zweiten `<a-entity>`, fügen Sie `shadow-shader`, `gltf-model="#vps-mesh"` und `shadow="cast: false"` hinzu.
   Der Schattenshader wendet ein Schattenmaterial auf das Referenzmesh mit einem Polygonversatz an, um Z-Fighting zu verhindern.
   Mit `shadow="cast: true"` kann man wählen, ob das vps-mesh einen Schatten auf die reale Welt werfen soll.
5. Im dritten `<a-entity>` fügen Sie `gltf-model="#vps-anim"`, `reflections="type: realtime"`, `play-vps-animation` und `shadow="receive:false"` hinzu.
   play-vps-animation" wartet, bis das "vps-coaching-overlay" verschwunden ist, bevor die VPS-Animation abgespielt wird.

### _Remote-Desktop-Entwicklungseinrichtung_

![](https://i.giphy.com/media/cBr0UnA7jjqAzAOGTi/giphy.gif)

Es ist oft hilfreich, den A-Frame-Inspektor zu verwenden, um Inhalte an entfernten Stellen auf dem Desktop zu positionieren.
Um die Szene dieses Projekts für die Remote-Desktop-Entwicklung einzurichten, deaktivieren Sie die folgenden Komponenten
, indem Sie einen Buchstaben am Anfang hinzufügen (z. B. "Znamed-location"):

- xrweb" -> "Zxrweb
- xrextras-loading" -> "Zxrextras-loading".
- benannter-Ort" -> "benannter-Ort
- xrextras-verstecken-Material" -> "Zxrextras-verstecken-Material".

Jetzt können Sie den [A-Frame Inspector](https://aframe.io/docs/1.3.0/introduction/visual-inspector-and-dev-tools.html)
(Mac: ctrl + opt + i, PC: ctrl + alt + i) öffnen und den Inhalt relativ zu dem aus dem Geospatial Browser importierten VPS-Netz positionieren.
Denken Sie daran: Dies ist ein _Inspektor_. Sie müssen die Transformationswerte zurück in Ihren Code kopieren.

Optional können Sie die "<a-entity named-location>" vorübergehend in die Mitte der Szene
verschieben, um die Iterationsgeschwindigkeit zu erhöhen. HINWEIS: Setzen Sie `<a-entity named-location>` auf `Position="0 0 0"` zurück, um sicherzustellen, dass der Inhalt von VPS
korrekt ausgerichtet ist.

### _Remote Mobile Development Setup_

![](https://i.giphy.com/media/ZVQCdOhIHx10Dsrxnf/giphy.gif)

Es ist oft hilfreich, den A-Frame Inspektor zu verwenden, um VPS aus der Ferne auf Ihrem mobilen Gerät zu simulieren.
Um die Szene dieses Projekts für die mobile Fernentwicklung einzurichten, deaktivieren Sie die folgenden Komponenten
, indem Sie einen Buchstaben am Anfang hinzufügen (z. B. "Znamed-location"):

- benannter-Ort" -> "benannter-Ort
- xrextras-verstecken-Material" -> "Zxrextras-verstecken-Material".

Als nächstes müssen Sie VPS deaktivieren und absolute Skalierung aktivieren. Dadurch wird sichergestellt, dass das Referenznetz
die richtige Größe für eine genaue Simulation hat:

`xrweb="enableVps: false; scale: absolute;"`

Um die Iterationsgeschwindigkeit zu erhöhen, sollten Sie die "<a-entity named-location>" vorübergehend in die Mitte der Szene
verschieben. Versuchen Sie, die Basis Ihres Referenznetzes mit `y="0"` (dem Boden) auszurichten.
HINWEIS: Bevor Sie Ihr VPS-Projekt bereitstellen, setzen Sie `<a-entity named-location>` auf `position="0 0 0"`
zurück, um sicherzustellen, dass der VPS-Inhalt korrekt ausgerichtet ist.

## Entwicklung von prozeduralen VPS-Erfahrungen

Prozedurale VPS-Szenen sind so konzipiert, dass sie jeden erkannten Standort verwenden können (im Gegensatz zu bestimmten Projektstandorten). Sobald der Standort erkannt wurde, steht Ihnen das Mesh
zur Verfügung, um prozedural generierte VPS-Erlebnisse zu erzeugen.

Es gibt zwei verfahrensbezogene Ereignisse, die von der 8th Wall Engine ausgegeben werden:

- [xrmeshfound](https://www.8thwall.com/docs/web/#xrmeshfound): wird ausgegeben, wenn ein Netz zum ersten Mal gefunden wird, entweder nach dem Start oder nach einem recenter()
- [xrmeshlost](https://www.8thwall.com/docs/web/#xrmeshlost): wird ausgegeben, wenn recenter() aufgerufen wird.

Nachdem ein Mesh erkannt wurde, verfolgt die 8th Wall Engine dieses Mesh weiter, bis recenter() aufgerufen wird.