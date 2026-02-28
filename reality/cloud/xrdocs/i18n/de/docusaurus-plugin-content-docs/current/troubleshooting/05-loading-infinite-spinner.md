---
id: loading-infinite-spinner
---

# Ladebildschirm Unendlicher Spinner

#### Ausgabe {#issue}

Wenn Sie auf ein WebAR-Erlebnis zugreifen, bleibt die Seite auf dem Ladebildschirm mit einem "unendlichen Spinner" hängen.

![loading-infinite-spinner](/images/loading-infinite-spinner.jpg)

#### Wie kommt es dazu? {#why-does-this-happen}

Wenn Sie das Lademodul XRExtras `` verwenden (das standardmäßig in allen 8th Wall-Projekten und Beispielen enthalten ist), wird der Ladebildschirm angezeigt, während die Szene und die Assets geladen werden, und während der Browser darauf wartet, dass die Browserberechtigungen akzeptiert werden. Wenn die Szene sehr lange braucht, um geladen zu werden, oder wenn etwas die Szene daran hindert, sich vollständig zu initialisieren, kann es so aussehen, als ob sie für immer auf "hängen bleibt".

#### Mögliche Ursachen {#potential-causes}

1. Große Assets und/oder langsame Internetverbindung

Wenn Sie sich an einem Ort mit langsamem WLAN und/oder Mobilfunknetz befinden, während Sie versuchen, eine Web AR Seite mit großen Assets zu laden, kann es sein, dass die Szene nicht wirklich "feststeckt", sondern nur sehr lange braucht, um zu laden. Verwenden Sie den Netzwerkinspektor des Browsers, um zu sehen, ob Ihre Seite gerade herunterlädt.

Versuchen Sie außerdem, [zu optimieren](/guides/your-3d-models-on-the-web/#texture-optimization) so viel wie möglich.  Dazu gehören Techniken wie die Komprimierung von Texturen, die Verringerung der Textur und/oder der Videoauflösung und die Reduzierung der Polygonanzahl von 3D-Modellen.

2. Kamera auf eine Hintergrund-Registerkarte fixiert

Bei einigen Geräten/Browsern können Sie die Kamera möglicherweise nicht öffnen, wenn sie bereits von einer anderen Registerkarte verwendet wird. Versuchen Sie, alle anderen Registerkarten zu schließen, die die Kamera verwenden, und laden Sie dann die Seite erneut.

3. iOS Safari-spezifisch: CSS-Elemente verdrängen das Video-Element "aus dem Bildschirm"

Wenn Sie Ihrem WebAR-Erlebnis benutzerdefinierte HTML/CSS-Elemente hinzugefügt haben, vergewissern Sie sich, dass diese auf korrekt über die Szene gelegt werden. Wenn das Videoelement auf der Seite aus dem Bildschirm verschoben wird, kann iOS Safari den Video-Feed nicht wiedergeben. Dies wiederum löst eine Reihe von Ereignissen aus, die es als erscheinen lassen, wenn 8th Wall "feststeckt".  In Wirklichkeit sieht die Sache folgendermaßen aus:

Der Video-Feed wird nicht gerendert -> die AFrame-Szene wird nicht vollständig initialisiert -> die AFrame-Szene sendet nie das "loaded"-Ereignis -> das XRExtras-Lademodul verschwindet nie (es wartet auf das "loading"-Ereignis der Szene , das nie ausgelöst wird!)

Um dieses Problem zu lösen, empfehlen wir Ihnen, die Ansicht "Layout" des Safari-Inspektors zu verwenden, um die Positionierung Ihres DOM-Inhalts zu visualisieren. Oft sehen Sie etwas Ähnliches wie das Bild unten, wo das Videoelement "aus dem Bildschirm" / "below the fold" verdrängt wird.

![video-element-offscreen](/images/video-element-offscreen.jpg)

Passen Sie die CSS-Positionierung Ihrer Elemente so an, dass sie den Video-Feed nicht vom Bildschirm verdrängen. Die Verwendung von `absolute` Positionierung ist eine Möglichkeit, dies zu tun.
