---
id: advanced-analytics
---

# Erweiterte Analytik

8th Wall-Projekte bieten [grundlegende Nutzungsanalysen](/guides/projects/usage-and-recent-trends), , die es Ihnen ermöglichen, zu sehen, wie viele "Ansichten" Ihr Projekt erhalten hat, sowie die durchschnittliche Verweildauer der Nutzer von . Wenn Sie benutzerdefinierte oder detailliertere Analysen wünschen, empfehlen wir Ihnen, Ihr Projekt um Webanalysen von Drittanbietern zu erweitern: .

Das Verfahren zum Hinzufügen von Analysen zu einem Projekt ist dasselbe wie bei jeder anderen Website, die nicht von AR stammt.  Sie können jede von Ihnen bevorzugte Analyselösung verwenden.

In diesem Beispiel erläutern wir, wie Sie Google Analytics mit dem Google Tag Manager (GTM) zu Ihrem 8th Wall-Projekt hinzufügen können. So können Sie ganz einfach benutzerdefinierte Analysen darüber erstellen, wie Nutzer Ihr Projekt ansehen und wie sie mit interagieren.

Mit der webbasierten Benutzeroberfläche von GTM können Sie Tags definieren und Auslöser erstellen, die bewirken, dass Ihr Tag beim Eintreten bestimmter Ereignisse ausgelöst wird. Lösen Sie in Ihrem 8th Wall-Projekt Ereignisse (mit einer einzigen Zeile Javascript) an den gewünschten Stellen in Ihrem Code aus.

## Analytik Voraussetzungen {#analytics-pre-requisites}

Sie müssen bereits über Google Analytics- und Google Tag Manager-Konten verfügen und ein grundlegendes Verständnis für deren Funktionsweise haben.

Weitere Informationen finden Sie in der folgenden Google-Dokumentation:

* Google Analytics 4
  * Erste Schritte: <https://support.google.com/analytics/answer/9304153>
  * Datenstrom hinzufügen: <https://support.google.com/analytics/answer/9304153#stream>
* Google Tag Manager
  * Übersicht: <https://support.google.com/tagmanager/answer/6102821>
  * Einrichtung und Installation: <https://support.google.com/tagmanager/answer/6103696>

## Fügen Sie Ihrem 8th Wall Projekt Google Tag Manager hinzu {#add-google-tag-manager-to-your-8th-wall-project}

1. Klicken Sie auf der Seite Arbeitsbereich Ihres Tag Manager-Containers auf Ihre Container-ID (z.B. "**GTM-XXXXXX**"), um das Feld "Google Tag Manager installieren" zu öffnen.  Dieses Fenster enthält den Code, den später zu Ihrem 8th Wall-Projekt hinzufügen müssen.

![GTM1](/images/gtm1.jpg)

2. Öffnen Sie den 8th Wall Cloud Editor und fügen Sie den Codeblock **top** in **head.html** ein:

![GTM2](/images/gtm2.jpg)

3. Klicken Sie auf "+" neben Dateien und erstellen Sie eine neue Datei mit dem Namen **gtm.html**. Fügen Sie dann den Inhalt von den **unteren** Codeblock in diese Datei ein:

![GTM3](/images/gtm3.jpg)

4. Fügen Sie den folgenden Code am Anfang von app.js ein:

```javascript
import * as googleTagManagerHtml from './gtm.html'
document.body.insertAdjacentHTML('afterbegin', googleTagManagerHtml)
```

## Google Tag Manager konfigurieren {#configure-google-tag-manager}

1. Suchen Sie die [Google Measurement ID](https://support.google.com/analytics/answer/12270356) für Ihren Datenstrom.
2. In GTM, [erstellen Sie ein GA4-Konfigurations-Tag](https://support.google.com/tagmanager/answer/9442095#config) .

Beispiel:

![GTM8](/images/gtm8.jpg)

## Verfolgen von Seitenaufrufen {#tracking-page-views}
Die Seitenaufrufe werden automatisch über das GA4 Konfigurations-Tag verfolgt. Weitere Informationen finden Sie unter [Konfigurieren Sie Google Tag Manager](/guides/advanced-topics/advanced-analytics/#configure-google-tag-manager) .

## Verfolgen von benutzerdefinierten Ereignissen {#tracking-custom-events}

GTM bietet auch die Möglichkeit, Ereignisse auszulösen, wenn benutzerdefinierte Aktionen stattfinden **innerhalb** des WebAR Erlebnisses. Diese Ereignisse sind spezifisch für Ihr WebAR-Projekt, aber einige Beispiele könnten sein:

* 3D-Objekt platziert
* Bildziel gefunden
* Screenshot aufgenommen
* usw..

In diesem Beispiel erstellen wir ein Tag (mit Trigger) und fügen es dem ["AFrame: Place Ground"](https://www.8thwall.com/8thwall/placeground-aframe) Beispielprojekt, das jedes Mal auslöst, wenn ein 3D-Modell gespawnt wird.

#### Benutzerdefinierten Ereignisauslöser erstellen {#create-custom-event-trigger}

* Auslöser-Typ: **Benutzerdefiniertes Ereignis**
* Name des Ereignisses: **placeModel**
* Dieser Auslöser wird ausgelöst bei: **Alle benutzerdefinierten Ereignisse**

![GTM6](/images/gtm6.jpg)

#### Tag erstellen {#create-tag-1}

Als nächstes erstellen Sie einen Tag, der ausgelöst wird, wenn der Auslöser "placeModel" in Ihrem Code ausgelöst wird.

* Tag-Typ: **Google Analytics: GA4 Ereignis**
* Konfigurations-Tag: (Wählen Sie die zuvor erstellte Konfiguration aus)
* Name des Ereignisses: **Ort Modell**
* Triggern: **Wählen Sie den im vorherigen Schritt erstellten Trigger "placeModel".**

![GTM9](/images/gtm9.jpg)

**WICHTIG**: Stellen Sie sicher, dass Sie alle erstellten Auslöser/Tags speichern und dann **Submit/Publish** Ihre Einstellungen in der GTM-Benutzeroberfläche veröffentlichen, damit sie aktiv sind. Siehe <https://support.google.com/tagmanager/answer/6107163>

#### Feuer-Ereignis innerhalb des 8th Wall-Projekts {#fire-event-inside-8th-wall-project}

Fügen Sie in Ihrem 8th Wall-Projekt die folgende Javascript-Zeile ein, um diesen Trigger an der gewünschten Stelle in Ihrem Code auszulösen:

`window.dataLayer.push({event: 'placeModel'})`

##### Beispiel - basierend auf <https://www.8thwall.com/8thwall/placeground-aframe/master/tap-place.js> {#example---based-on-httpswww8thwallcom8thwallplaceground-aframemastertap-placejs}

```javascript
export const tapPlaceComponent = {
  init: function() {
    const ground = document.getElementById('ground')
    ground.addEventListener('click', event => {
      // Neue Entität für das neue Objekt erstellen
      const newElement = document.createElement('a-entity')

      // Der raycaster gibt eine Position der Berührung in der Szene
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
        // Sobald das Modell geladen ist, können wir es mit einer Animation einblenden
        newElement.setAttribute('visible', 'true')
        newElement.setAttribute('animation', {
          property: 'scale',
          to: '7 7 7',
          easing: 'easeOutElastic',
          dur: 800,
        })

        // **************************************************
        // Google Tag Manager Ereignis auslösen, sobald das Modell geladen ist
        // **************************************************
        window.dataLayer.push({event: 'placeModel'})
      })
    })
  }
}
```
