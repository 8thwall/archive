---
id: loading-infinite-spinner
---

# Ladebildschirm Unendlicher Spinner

#### Ausgabe {#issue}

Beim Zugriff auf ein WebAR-Erlebnis bleibt die Seite auf dem Ladebildschirm mit einem "unendlichen Spinner" hängen.

![loading-infinite-spinner](/images/loading-infinite-spinner.jpg)

#### Warum ist das so? {#why-does-this-happen}

Wenn Sie das XRExtras-Modul "Laden" verwenden (das standardmäßig in allen 8th Wall-Projekten und
-Beispielen enthalten ist), wird der Ladebildschirm angezeigt, während die Szene und die Elemente geladen werden, und
, während der Browser darauf wartet, dass die Browserberechtigungen akzeptiert werden. Wenn das Laden der Szene sehr lange dauert
oder wenn etwas die Szene daran hindert, sich vollständig zu initialisieren, kann es so aussehen, als ob dieser Bildschirm für immer auf
"hängen bleibt".

#### Mögliche Ursachen {#potential-causes}

1. Große Assets und/oder langsame Internetverbindung

Wenn Sie sich an einem Ort mit langsamen WLAN- und/oder Mobilfunkdiensten befinden und versuchen, eine Web AR
Seite mit großen Assets zu laden, kann es sein, dass die Szene nicht wirklich "feststeckt", sondern nur sehr lange braucht, um
zu laden. Verwenden Sie den Netzwerkinspektor des Browsers, um festzustellen, ob Ihre Seite gerade
herunterlädt.

Versuchen Sie außerdem, so viel wie möglich zu [optimieren](/legacy/guides/your-3d-models-on-the-web/#texture-optimization)
.  Dazu gehören Techniken wie die Komprimierung von Texturen, die Verringerung der Textur
und/oder der Videoauflösung und die Reduzierung der Polygonzahl von 3D-Modellen.

2. Kamera auf eine Hintergrund-Registerkarte fixiert

Bei einigen Geräten/Browsern können Sie die Kamera möglicherweise nicht öffnen, wenn sie bereits von einer anderen Registerkarte verwendet wird. Versuchen Sie,
alle anderen Registerkarten zu schließen, die die Kamera verwenden, und laden Sie dann die Seite neu.

3. iOS Safari-spezifisch: CSS-Elemente schieben das Videoelement "aus dem Bildschirm"

Wenn Sie benutzerdefinierte HTML/CSS-Elemente zu Ihrem Web AR-Erlebnis hinzugefügt haben, stellen Sie sicher, dass diese unter
korrekt über die Szene gelegt werden. Wenn das Videoelement auf der Seite aus dem Bildschirm verschoben wird, kann iOS
Safari den Video-Feed nicht wiedergeben. Dies wiederum löst eine Reihe von Ereignissen aus, die den Eindruck erwecken, dass die 8. Mauer "feststeckt" (
).  In der Realität sieht die Sache folgendermaßen aus:

Video-Feed wird nicht gerendert -> AFrame-Szene wird nicht vollständig initialisiert -> AFrame-Szene sendet nie das
"loaded"-Ereignis -> XRExtras Loading-Modul verschwindet nie (es wartet auf das "loading"-Ereignis der Szene
, das nie ausgelöst wird!)

Um dieses Problem zu lösen, empfehlen wir, die "Layout"-Ansicht des Safari-Inspektors zu verwenden, um die
Positionierung Ihres DOM-Inhalts zu visualisieren. Oft sieht man etwas Ähnliches wie das Bild unten, wo
das Videoelement "aus dem Bildschirm" / "unterhalb der Faltung" verdrängt wird.

![video-element-offscreen](/images/video-element-offscreen.jpg)

Passen Sie die CSS-Positionierung Ihrer Elemente so an, dass sie den Video-Feed nicht vom
Bildschirm verdrängen. Die Verwendung der absoluten Positionierung ist eine Möglichkeit, dies zu tun.
