---
id: project-settings
---

# Projekt-Einstellungen

Auf der Seite Projekteinstellungen können Sie Folgendes tun:

* Entwicklereinstellungen festlegen, z. B. Tastenkombinationen und den dunklen Modus
* Projektinformationen bearbeiten:
  * Titel
  * Beschreibung
  * Standard-Splash-Screen aktivieren/deaktivieren
  * Titelbild aktualisieren
* Staging Passcode verwalten
* Auf den App-Schlüsselstring des Projekts zugreifen
* Engineversion einstellen
* App-Veröffentlichung rückgängig machen
* Projekt vorübergehend deaktivieren
* Projekt löschen

## Code-Editor-Einstellungen {#code-editor-preferences}

Die folgenden Code-Editor-Einstellungen können festgelegt werden:

* Dunkler Modus (Ein/Aus)
  * Verwenden Sie im Code-Editor eine dunklere Farbpalette, die dunklere Hintergrundfarben und hellere Vordergrundfarben verwendet.
* Tastenkombinationen
  * Aktivieren Sie die Tastenkombinationen von gängigen Texteditoren.  Wählen Sie aus:
    * Normal
    * Erhaben
    * Vim
    * Emacs
    * VSCode

## Grundlegende Informationen {#basic-information}

Unter Projekteinstellungen können Sie die Basisinformationen für Ihr Projekt bearbeiten

* Projekttitel
* Beschreibung
* [Aktivieren oder Deaktivieren des Standard-Splash-Bildschirms](/guides/projects/project-settings/#default-splash-screen)
* Titelbild aktualisieren

## Standard-Splash-Screen {#default-splash-screen}

Der Standard-Startbildschirm wird zu Beginn jedes Web AR-Erlebnisses angezeigt, das mit dem 8th Wall Cloud Editor erstellt wurde. Sie kann nicht angepasst werden, aber sie kann für `Commercial-Projekte` deaktiviert werden, wenn Sie einen kostenpflichtigen `Pro-` oder `Enterprise-Tarif` haben.

![DefaultSplashScreen](/images/default-splash-screen.jpg)

So aktivieren oder deaktivieren Sie den Standard-Splash-Screen:
1. Rufen Sie die Seite `Projekteinstellungen` auf.
2. Erweitern Sie den Abschnitt `Grundlegende Informationen`.
3. `Standard-Splash-Bildschirm` umschalten (Ein/Aus)

![DefaultSplashScreenToggle](/images/basic-information-splash-screen.jpg)

**Hinweis:** Alle Projekte müssen weiterhin das Abzeichen [Powered by 8th Wall](https://drive.google.com/drive/folders/1c9d23c5hS_HspHTUD7VceV6ocqdbPN7J?usp=sharing) auf der Ladeseite anzeigen. Es ist standardmäßig im `Lademodul` enthalten und kann nicht entfernt werden. [Erfahren Sie mehr über die Anpassung des Ladebildschirms](/guides/advanced-topics/load-screen/).

## Staging-Passcode {#staging-passcode}

Wenn Ihre App auf XXXXX.staging.8thwall.app bereitgestellt wird (wobei XXXX für die URL Ihres Arbeitsbereichs steht), ist sie passwortgeschützt.  Um das WebAR-Projekt einzusehen, muss ein Benutzer zunächst den von Ihnen angegebenen Passcode eingeben.  Dies ist eine großartige Möglichkeit, Projekte mit Kunden oder anderen Interessengruppen zu besprechen, bevor man an die Öffentlichkeit geht.

Ein Passcode sollte 5 oder mehr Zeichen lang sein und kann Buchstaben (A-Z, Klein- oder Großbuchstaben), Zahlen (0-9) und Leerzeichen enthalten.

## App Schlüssel {#app-key}

Selbst gehostete Projekte erfordern einen App-Schlüssel, der dem Code hinzugefügt wird. Self-Hosting und App Keys sind nur für Arbeitsbereiche mit einem **Pro- oder Enterprise-Tarif** verfügbar. App Keys sind im Basic-Tarif (oder den früheren Starter/Plus-Tarifen) nicht verfügbar.

Um den App-Schlüssel für ein Projekt zu finden:

1. Wenn Ihr Projekttyp nicht "Self Hosted" ist, erstellen Sie bitte ein neues Projekt:

![CreateProjectSelfHosted](/images/create-project-self-hosted.jpg)

Klicken Sie auf die Schaltfläche **Kopieren** und fügen Sie sie dann in Ihre index.html ein

2. Wählen Sie in der linken Navigation die Option Projekteinstellungen:

![LeftNavProjectSettings](/images/left-nav-project-settings.jpg)

3. Scrollen Sie nach unten zum Abschnitt **Selbsthosten** der Seite und erweitern Sie das Widget **My App Key** :

![ProjectSettingsMyAppKey](/images/project-settings-app-key.jpg)

4. Klicken Sie auf die Schaltfläche **Kopieren** und fügen Sie den String App Key in den `` Tag im `` Ihres selbst gehosteten Codes ein

#### Beispiel - App Key {#example---app-key}

```html
<!-- Replace the X's with your App Key -->
<script async src="//apps.8thwall.com/xrweb?appKey=XXXXX"></script>
```

## Engine-Version {#engine-version}

Sie können die Version der 8th Wall-Engine angeben, die bei der Bereitstellung öffentlicher Webclients verwendet wird (`Release` oder `Beta`).

Nutzern, die ein veröffentlichtes Erlebnis ansehen, wird immer die aktuellste Version von 8th Wall Engine aus diesem Kanal angezeigt.

Im Allgemeinen empfiehlt 8th Wall die Verwendung des offiziellen **Release** Kanals für produktive Webanwendungen.

Wenn Sie Ihre Webanwendung mit einer Vorabversion von 8th Wall's Engine testen möchten, die möglicherweise neue Funktionen und/oder Fehlerbehebungen enthält, die noch nicht die vollständige QA durchlaufen haben, können Sie zum Beta-Kanal wechseln. Kommerzielle Erlebnisse sollten nicht im Beta-Kanal veröffentlicht werden.

#### Sperren der Engineversion {#freezing-engine-version}

:::note
Engine version freezing ist nur für **kommerzielle** Projekte mit einer aktiven Lizenz verfügbar.
:::

Um **die aktuelle Engine-Version** einzufrieren, wählen Sie den gewünschten Kanal (Release oder Beta) und klicken Sie auf die Schaltfläche **Einfrieren**.

![EngineFreeze](/images/engine-freeze.png)

Um **einem Kanal wieder beizutreten** und auf dem neuesten Stand zu bleiben, klicken Sie auf die Schaltfläche **Auftauchen** .  Dies wird **die mit Ihrem Projekt verknüpfte Engine-Version auftauen** und einem Kanal (Release oder Beta) erneut beitreten, um die neueste Version zu verwenden, die für diesen Kanal verfügbar ist.

![EngineUnfreeze](/images/engine-unfreeze.png)

## App-Veröffentlichung rückgängig machen {#unpublish-app}

Wenn Sie Ihr Projekt nicht veröffentlichen, wird es aus Staging (XXXXX.staging.8thwall.app) oder Public (XXXXX.8thwall.app) entfernt.

Sie können sie jederzeit über den Code-Editor oder die Projekthistorie erneut veröffentlichen.

Klicken Sie auf **Staging-Veröffentlichung rückgängig machen**, um Ihr Projekt von XXXXX.staging.8thwall.app herunterzunehmen

Klicken Sie auf **Öffentliche Veröffentlichung rückgängig machen**, um Ihr Projekt von XXXXX.8thwall.app herunterzunehmen

## Projekt vorübergehend deaktivieren {#temporarily-disable-project}

Wenn Sie Ihr Projekt deaktivieren, kann Ihre App nicht angezeigt werden. Die Ansichten werden nicht gezählt, wenn sie deaktiviert sind.

Für Projekte, die vorübergehend deaktiviert sind, werden Ihnen weiterhin alle aktiven kommerziellen Lizenzen in Rechnung gestellt.

Schalten Sie den Schieberegler um, um Ihr Projekt zu deaktivieren/aktivieren.

## Projekt löschen {#delete-project}

Ein Projekt mit einer kommerziellen Lizenz kann nicht gelöscht werden. Besuchen Sie die [Kontoseite](/guides/account-settings#manage-commercial-licenses) um ein aktives kommerzielles Projekt zu löschen.

Wenn Sie ein Projekt löschen, wird es nicht mehr funktionieren. Sie können diesen Vorgang nicht rückgängig machen.
