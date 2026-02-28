---
id: asset-bundles
---

# Asset-Bündel

Die Asset-Bündelungsfunktion des Cloud-Editors von 8th Wall ermöglicht die Verwendung von Assets aus mehreren Dateien.  Bei diesen Assets handelt es sich in der Regel um Dateien, die intern über relative Pfade aufeinander verweisen. ".glTF", ".hcap", ".msdf" und cubemap-Assets sind einige gängige Beispiele.

Im Falle von .hcap-Dateien laden Sie das Asset über die "Haupt"-Datei, z. B. "mein-hologramm.hcap".  In dieser Datei befinden sich viele Verweise auf andere abhängige Ressourcen, wie z. B. .mp4- und .bin-Dateien.  Diese Dateinamen werden von der Hauptdatei als URLs mit Pfaden relativ zur .hcap-Datei referenziert und geladen.

![AssetBundleGif](https://media.giphy.com/media/dB0va3gWqncbgPYxxJ/giphy.gif)

## Asset-Bündel erstellen {#create-asset-bundle}

#### 1. Bereiten Sie Ihre Dateien vor {#1-prepare-your-files}

Verwenden Sie eine der folgenden Methoden, um Ihre Dateien vor dem Hochladen vorzubereiten:

- Mehrfachauswahl der einzelnen Dateien aus Ihrem lokalen Dateisystem
- Erstellen Sie eine ZIP-Datei.
- Suchen Sie das Verzeichnis, das alle Dateien enthält, die für Ihr Asset benötigt werden (Hinweis: Der Upload von Verzeichnissen wird nicht von allen Browsern unterstützt!)

#### 2. Neues Asset-Bündel erstellen {#2-create-new-asset-bundle}

##### Option 1 {#option-1}

Klicken Sie im Cloud Editor auf das **"+"** rechts neben **ASSETS** und wählen Sie "Neues Asset-Bündel".  Wählen Sie dann den Asset-Typ aus.  Wenn Sie kein glTF- oder HCAP-Asset hochladen wollen, wählen Sie "Andere".

![NewAssetBundle](/images/new-asset-bundle.jpg)

##### Option 2 {#option-2}

Alternativ können Sie die Assets oder ZIP-Dateien auch direkt in den Bereich ASSETS unten rechts im Cloud-Editor ziehen.

![NewAssetBundleDrag](/images/new-asset-bundle-drag.jpg)

#### 3. Vorschau Asset-Bündel {#3-preview-asset-bundle}

Nachdem die Dateien hochgeladen wurden, können Sie die Assets in einer Vorschau ansehen, bevor Sie sie Ihrem Projekt hinzufügen.  Wählen Sie einzelne Dateien im linken Fenster aus, um sie rechts in der Vorschau anzuzeigen.

![NewAssetBundlePreview](/images/new-asset-bundle-preview.jpg)

#### 4. Wählen Sie die Datei "main" {#4-select-main-file}

Wenn Ihr Asset-Typ einen Verweis auf eine Datei erfordert, legen Sie diese Datei als "Hauptdatei" fest. Wenn Ihr Asset-Typ einen Verweis auf einen Ordner erfordert (Cubemaps usw.), legen Sie "none" als "Hauptdatei" fest.

Hinweis: Dieser Schritt ist für glTF- oder HCAP-Assets nicht erforderlich.  Die Hauptdatei wird für diese Asset-Typen automatisch festgelegt.

Die Hauptdatei kann später nicht mehr geändert werden.  Wenn Sie die falsche Datei auswählen, müssen Sie das Asset-Bündel erneut hochladen.

#### 5. Asset-Bündelname festlegen {#5-set-asset-bundle-name}

Geben Sie dem Asset-Bündel einen Namen. Dies ist der Dateiname, unter dem Sie in Ihrem Projekt auf das Asset-Bundle zugreifen können.

#### 6. Klicken Sie auf "Bündel erstellen" {#6-lick-create-bundle}

Der Upload Ihres Asset-Bündels wird abgeschlossen und es wird zu Ihrem Cloud Editor-Projekt hinzugefügt.

## Vorschau Asset-Bündel {#preview-asset-bundle}

Assets können direkt im Cloud-Editor in der Vorschau angezeigt werden.  Wählen Sie ein Asset auf der linken Seite aus, um es auf der rechten Seite anzuzeigen.  Sie können eine Vorschau für ein bestimmtes Asset innerhalb des Pakets anzeigen, indem Sie das Menü "Inhalt anzeigen" auf der rechten Seite erweitern und ein Asset darin auswählen.

![AssetBundlePreview](/images/asset-bundle-preview.jpg)

## Asset-Bündel umbenennen {#rename-asset-bundle}

Um ein Asset umzubenennen, klicken Sie auf das "Pfeil-nach-unten"-Symbol rechts neben dem Asset und wählen Sie **Umbenennen**.  Bearbeiten Sie den Namen des Assets und drücken Sie zum Speichern die Eingabetaste.  Wichtig: Wenn Sie ein Asset umbenennen, müssen Sie Ihr Projekt durchgehen und sicherstellen, dass alle Referenzen auf den aktualisierten Assetnamen verweisen.

## Asset-Bündel löschen {#delete-asset-bundle}

Um ein Asset zu löschen, klicken Sie auf das "Pfeil-nach-unten"-Symbol rechts neben dem Asset und wählen Sie **Löschen**.

## Referenzierung von Asset-Bündeln {#referencing-asset-bundle}

Um das Asset-Bundle aus einer **html**-Datei in Ihrem Projekt zu referenzieren (z. B. body.html), geben Sie einfach den entsprechenden Pfad für den Parameter **src=** oder **gltf-model=** an.

Um das Asset-Bundle von **javascript** aus zu referenzieren, verwenden Sie **require()**.

#### Beispiel - HTML {#example---html}

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
  src="./assets/mein-hologramm.hcap"
  holo-scale="6"
  holo-touch-target="1.65 0.35"
  xrextras-hold-drag
  xrextras-two-finger-rotate 
  xrextras-pinch-scale="scale: 6">
</holo-cap>
```

#### Beispiel - javascript {#example---javascript}

```javascript
const modelFile = require('./assets/my-model.gltf')
```
