---
id: project-settings
sidebar_position: 8
---

# Projekt-Einstellungen

Auf der Seite Projekteinstellungen können Sie Folgendes tun:

- Entwicklereinstellungen wie Tastenkombinationen und Dunkelmodus festlegen
- Projektinformationen bearbeiten:
  - Titel
  - Beschreibung
  - Titelbild aktualisieren
- Staging-Passcode verwalten
- Zugriff auf den App-Schlüsselstring des Projekts (**nur selbst gehostet**)
- Freeze-Engine-Version (**nur aktives White-Label-Abonnement**)
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
- Titelbild aktualisieren

<!-- ## Default Splash Screen {#default-splash-screen}

The Default Splash Screen is displayed at the beginning of each Web AR experience created using the
8th Wall Cloud Editor. It cannot be customized, however, it can be disabled by purchasing a white label subscription.

![DefaultSplashScreen](/images/default-splash-screen.jpg)

To Enable or Disable the Default Splash Screen:
1. Go to the `Project Settings` page.
2. Expand the `Basic Information` section.
3. Toggle `Default Splash Screen` (On/Off)

![DefaultSplashScreenToggle](/images/basic-information-splash-screen.jpg) -->

## Staging Passcode {#staging-passcode}

Wenn Ihre Anwendung auf XXXXX.staging.8thwall.app bereitgestellt wird (wobei XXXX für die URL Ihres Arbeitsbereichs steht), ist sie
passcodegeschützt.  Um das WebAR-Projekt anzuzeigen, muss ein Benutzer zunächst den von Ihnen
bereitgestellten Passcode eingeben.  Dies ist eine großartige Möglichkeit, Projekte mit Kunden oder anderen Interessenvertretern zu besprechen, bevor
der Öffentlichkeit vorgestellt wird.

Ein Passcode sollte mindestens 5 Zeichen lang sein und kann Buchstaben (A-Z, Klein- oder Großbuchstaben),
Zahlen (0-9) und Leerzeichen enthalten.

## Motorversion {#engine-version}

Sie können die Version der 8th Wall-Engine angeben, die bei der Bereitstellung öffentlicher Webclients verwendet wird (`Release`
oder `Beta`).

Nutzern, die ein veröffentlichtes Erlebnis ansehen, wird immer die aktuellste Version der 8th Wall
Engine aus diesem Kanal angezeigt.

Im Allgemeinen empfiehlt 8th Wall die Verwendung des offiziellen **release** Kanals für produktive Webanwendungen.

Wenn Sie Ihre Webanwendung mit einer Vorabversion von 8th Wall's Engine testen möchten, die
neue Funktionen und/oder Fehlerkorrekturen enthalten kann, die noch nicht die vollständige QA durchlaufen haben, können Sie zum
beta channel wechseln. Kommerzielle Erlebnisse sollten nicht über den Beta-Kanal angeboten werden.

### Freezing Engine Version {#freezing-engine-version}

:::info
Das Einfrieren der Engine-Version ist nur für Projekte mit einem aktiven White-Label-Abonnement verfügbar.
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

Ein Projekt mit einem White-Label-Abonnement kann nicht gelöscht werden. Besuchen Sie die Seite
Konto, um ein aktives White-Label-Abonnement zu kündigen.

Wenn Sie ein Projekt löschen, wird es nicht mehr funktionieren. Sie können diesen Vorgang nicht rückgängig machen.
