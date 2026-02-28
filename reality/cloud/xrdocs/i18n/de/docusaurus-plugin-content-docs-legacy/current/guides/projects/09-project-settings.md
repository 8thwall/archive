---
id: project-settings
---

# Projekt-Einstellungen

Auf der Seite Projekteinstellungen können Sie Folgendes tun:

- Entwicklereinstellungen wie Tastenkombinationen und Dunkelmodus festlegen
- Projektinformationen bearbeiten:
  - Titel
  - Beschreibung
  - Standard-Splash-Screen aktivieren/deaktivieren
  - Titelbild aktualisieren
- Staging-Passcode verwalten
- Zugriff auf den App Key String des Projekts
- Motorversion einstellen
- Anwendung nicht veröffentlichen
- Projekt vorübergehend deaktivieren
- Projekt löschen

## Code-Editor-Einstellungen {#code-editor-preferences}

Die folgenden Code-Editor-Einstellungen können festgelegt werden:

- Dunkler Modus (Ein/Aus)
  - Verwenden Sie eine dunklere Farbpalette im Code-Editor, die dunklere Hintergrundfarben und hellere Vordergrundfarben verwendet.
- Tastenkombinationen
  - Aktivieren Sie Tastenkombinationen von gängigen Texteditoren.  Wählen Sie aus:
    - Normal
    - Erhabenheit
    - Vim
    - Emacs
    - VSCode

## Grundlegende Informationen {#basic-information}

Unter Projekteinstellungen können Sie die Basisinformationen für Ihr Projekt bearbeiten

- Titel des Projekts
- Beschreibung
- [Aktivieren oder Deaktivieren des Standard-Splash-Screens](/legacy/guides/projects/project-settings/#default-splash-screen)
- Titelbild aktualisieren

## Standard-Splash-Screen {#default-splash-screen}

Der Standard-Startbildschirm wird zu Beginn jedes Web AR-Erlebnisses angezeigt, das mit dem
8th Wall Cloud Editor erstellt wurde. Sie kann nicht angepasst werden, aber sie kann für
`Kommerzielle Projekte` deaktiviert werden, wenn Sie einen kostenpflichtigen `Pro`- oder `Enterprise`-Plan haben.

![DefaultSplashScreen](/images/default-splash-screen.jpg)

So aktivieren oder deaktivieren Sie den Standard-Splash-Screen:

1. Gehen Sie auf die Seite "Projekteinstellungen".
2. Erweitern Sie den Abschnitt "Grundlegende Informationen".
3. Standard-Splash-Bildschirm" umschalten (Ein/Aus)

![DefaultSplashScreenToggle](/images/basic-information-splash-screen.jpg)

**Hinweis:** Alle Projekte müssen weiterhin das [Powered by 8th Wall](https://drive.google.com/drive/folders/1c9d23c5hS_HspHTUD7VceV6ocqdbPN7J?usp=sharing)
Abzeichen auf der Ladeseite anzeigen. Es ist standardmäßig im "Lademodul" enthalten und kann nicht entfernt werden.
[Erfahren Sie mehr über die Anpassung des Ladebildschirms](/legacy/guides/advanced-topics/load-screen/).

## Staging Passcode {#staging-passcode}

Wenn Ihre Anwendung auf XXXXX.staging.8thwall.app bereitgestellt wird (wobei XXXX für die URL Ihres Arbeitsbereichs steht), ist sie
passcodegeschützt.  Um das WebAR-Projekt anzuzeigen, muss ein Benutzer zunächst den von Ihnen
bereitgestellten Passcode eingeben.  Dies ist eine großartige Möglichkeit, Projekte mit Kunden oder anderen Interessenvertretern zu besprechen, bevor
der Öffentlichkeit vorgestellt wird.

Ein Passcode sollte mindestens 5 Zeichen lang sein und kann Buchstaben (A-Z, Klein- oder Großbuchstaben),
Zahlen (0-9) und Leerzeichen enthalten.

## App-Taste {#app-key}

:::info
App Keys und Self-Hosting sind nur mit einem [Custom Plan](https://8thwall.com/custom) verfügbar.
:::

Für selbst gehostete Projekte muss dem Code ein App-Schlüssel hinzugefügt werden.

So greifen Sie auf den Anwendungsschlüssel für ein Projekt zu:

1. [Erstellen Sie ein Legacy-Editor-Projekt](/legacy/guides/projects/create-legacy-editor-project/) und wählen Sie **App Key** als Projekttyp.

2. Wählen Sie in der linken Navigation Projekteinstellungen:

![LeftNavProjectSettings](/images/left-nav-project-settings.jpg)

3. Scrollen Sie nach unten zum Abschnitt **Self-Hosting** auf der Seite und erweitern Sie das Widget **Mein App-Schlüssel**:

![ProjectSettingsMyAppKey](/images/project-settings-app-key.jpg)

4. Klicken Sie auf die Schaltfläche **Kopieren** und fügen Sie den App-Schlüssel in den "<script>"-Tag in der "<head>"-Seite Ihres selbst gehosteten Codes ein.

#### Beispiel - App Key {#example---app-key}

```html
<!-- Replace the X's with your App Key -->
<script async src="//apps.8thwall.com/xrweb?appKey=XXXXX"></script>
```

## Motorversion {#engine-version}

Sie können die Version der 8th Wall-Engine angeben, die bei der Bereitstellung öffentlicher Webclients verwendet wird (`Release`
oder `Beta`).

Nutzern, die ein veröffentlichtes Erlebnis ansehen, wird immer die aktuellste Version der 8th Wall
Engine aus diesem Kanal angezeigt.

Im Allgemeinen empfiehlt 8th Wall die Verwendung des offiziellen **release** Kanals für produktive Webanwendungen.

Wenn Sie Ihre Webanwendung mit einer Vorabversion von 8th Wall's Engine testen möchten, die
neue Funktionen und/oder Fehlerkorrekturen enthalten kann, die noch nicht die vollständige QA durchlaufen haben, können Sie zum
beta channel wechseln. Kommerzielle Erlebnisse sollten nicht über den Beta-Kanal angeboten werden.

#### Freezing Engine Version {#freezing-engine-version}

:::note
Das Einfrieren der Engine-Version ist nur für **kommerzielle** Projekte mit einer aktiven Lizenz verfügbar.
:::

Um die aktuelle Engine-Version **einzufrieren**, wählen Sie den gewünschten Channel (Release oder Beta) und klicken Sie auf die Schaltfläche **Einfrieren**.

![EngineFreeze](/images/engine-freeze.png)

Um **einem Channel wieder beizutreten** und auf dem neuesten Stand zu bleiben, klicken Sie auf die Schaltfläche **Auftauen**.  Dadurch wird die mit Ihrem Projekt verknüpfte Engine-Version **freigegeben**
und ein Channel (Release oder Beta) wird wieder mit der neuesten für diesen Channel verfügbaren Version
verbunden.

![EngineUnfreeze](/images/engine-unfreeze.png)

## Unpublish App {#unpublish-app}

Wenn Sie Ihr Projekt nicht veröffentlichen, wird es aus Staging (XXXXX.staging.8thwall.app) oder Public (XXXXX.8thwall.app) entfernt.

Sie können sie jederzeit über den Code-Editor oder die Projekthistorie erneut veröffentlichen.

Klicken Sie auf **Unpublish Staging**, um Ihr Projekt von XXXXX.staging.8thwall.app herunterzunehmen.

Klicken Sie auf **Veröffentlichung aufheben**, um Ihr Projekt von XXXXX.8thwall.app herunterzunehmen.

## Projekt vorübergehend deaktivieren {#temporarily-disable-project}

Wenn Sie Ihr Projekt deaktivieren, kann Ihre Anwendung nicht angezeigt werden. Solange sie deaktiviert sind, werden die Aufrufe nicht gezählt.

Für Projekte, die vorübergehend deaktiviert sind, werden Ihnen weiterhin alle aktiven kommerziellen Lizenzen in Rechnung gestellt.

Schalten Sie den Schieberegler um, um Ihr Projekt zu deaktivieren/aktivieren.

## Projekt löschen {#delete-project}

Ein Projekt mit einer kommerziellen Lizenz kann nicht gelöscht werden. Besuchen Sie die
[Kontoseite] (/legacy/guides/account-settings#manage-commercial-licenses), um ein aktives kommerzielles Projekt
zu kündigen.

Wenn Sie ein Projekt löschen, wird es nicht mehr funktionieren. Sie können diesen Vorgang nicht rückgängig machen.
