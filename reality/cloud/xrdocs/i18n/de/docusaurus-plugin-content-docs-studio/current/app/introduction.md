---
id: introduction
description: 'Dieser Abschnitt erklärt, wie Sie die 8th Wall Desktop App verwenden.'
sidebar_position: 2
---

# Verwendung der 8th Wall App

:::info[Public Beta]
Die **8th Wall Desktop App befindet sich in der Public Beta** und die Funktionalität kann sich in einer zukünftigen Version ändern. Wir freuen uns über Ihr Feedback und haben ein [spezielles Support-Forum für die Nutzer der Desktop-Beta-Anwendung] (https://forum.8thwall.com/c/desktop-beta/17) eingerichtet - bitte melden Sie hier alle Probleme oder Vorschläge, die Sie haben.
:::

Nach der ersten Anmeldung bei 8th Wall über die Desktop-App sehen Sie die von Ihnen erstellten Projekte in der Hub-Ansicht. Wenn Sie Mitglied in mehreren Arbeitsbereichen sind, können Sie den Arbeitsbereich über das Dropdown-Menü oben links im Hub wechseln. Um ein neues Projekt zu erstellen, klicken Sie auf die Schaltfläche **Neues Projekt** oben rechts im Hub.

![](/images/studio/app/hub.jpg)

## Projekte

In der Studio-Hub-Ansicht können Sie Projekte über das Menü "Projektaktionen" (...) verschieben, löschen und suchen:

- **Im Finder anzeigen**: Öffnet Ihren lokalen Dateibrowser zum Speicherort des Projekts
- **Von der Festplatte entfernen**: löscht die lokalen Dateien Ihres Projekts (das Projekt bleibt im Web ab dem letzten Cloud-Build verfügbar)
- **Datenspeicherort ändern**: Öffnet Ihren Dateibrowser, um einen neuen Ordner für Ihr Projekt auszuwählen, in den es verschoben werden soll.
- **Projekteinstellungen**: Öffnet Ihre Projekteinstellungen im Web für Aktionen wie das Umbenennen des Projekts, das Erstellen einer Beschreibung oder das Ändern des Titelbilds und vieles mehr.

![](/images/studio/app/project-actions.jpg)

## Projektstruktur

Wenn Sie ein Projekt zum ersten Mal erstellen oder öffnen, wird eine lokale Version des Projekts auf Ihrem Rechner unter `~/Documents/8th Wall/` hinzugefügt. Standardmäßig wird der 8th Wall-Ordner in Ihrem Dokumente-Ordner erstellt, aber Sie können dies ändern, indem Sie den 8th Wall-Ordner an einen anderen Ort verschieben.

Der für Ihr Projekt erstellte Ordner enthält standardmäßig bestimmte Dateien und Ordner. Der Ordner `src` spiegelt das Verzeichnis der Projektdateien wider, das Sie in Studio sehen. Dieser Ordner ist ein Verzeichnis innerhalb der Dateistruktur Ihres Projekts, in dem Sie Dateien wie Komponentenskripte sowie Assets wie Bilder, Schriftarten, Sounds oder andere Medien speichern, die Ihr Projekt benötigt.

![](/images/studio/app/project-directories.jpg)

:::info
Versuchen Sie nicht, diese Dateien auf einen anderen Server zu kopieren, da Ihr Projekt dann nicht wie erwartet läuft. Um Ihre Erfahrungen zu veröffentlichen und weiterzugeben, müssen Sie den Erstellungs- und Hosting-Prozess von 8th Wall nutzen.
:::

Die Desktop-Anwendung überwacht die Änderungen an Ihrem lokalen Verzeichnis in Echtzeit. Wenn Sie zum Beispiel VSCode verwenden, um die Datei "component.ts" eines Projekts zu aktualisieren, sollte die aktualisierte Datei in Studio angezeigt werden, sobald Sie die Datei speichern.

Ebenso können Sie mit 3D-Modellierungstools wie Blender und Maya arbeiten und Asset-Änderungen direkt in Ihrem 8th Wall-Projekt speichern. Auf diese Weise können Sie programmübergreifend arbeiten und eine einzige optimierte Pipeline erstellen, so dass Ihr Workflow von Anfang bis Ende intakt bleibt.

![](/images/studio/app/blender-to-studio.gif)

## Quellenkontrolle

Bei der Verwendung der Desktop-Version von Studio im Vergleich zur Web-Version gibt es einige wichtige Unterschiede zu beachten.

Erstens werden Sie keine Schaltfläche **Erstellen** in der Navigationsleiste oben rechts sehen, wie Sie sie in Studio im Web sehen. Das liegt daran, dass Studio on desktop die Änderungen automatisch speichert und nicht auf Cloud-Server zurückgreifen muss, um die Änderungen zu kompilieren und das Projekt neu zu erstellen.

Wenn Sie Ihre Projektänderungen mit der Cloud synchronisieren möchten, können Sie die Funktion **Cloud Build** in den Projekteinstellungen unter **Source Control** aufrufen. Sie können zum Beispiel zur Web-Version von Studio wechseln, um weiterzuarbeiten. Sie können die Schaltfläche "Cloud Build" auswählen, um Ihre letzten Änderungen zu synchronisieren, und diese Änderungen dann in der Webversion von Studio finden. Erfahren Sie mehr über die Funktionalität von Source Control [hier](/studio/getting-started/build-land/).

![](/images/studio/app/source-control.jpg)
