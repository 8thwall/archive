# Entwicklung von Modulen

## Erstellen eines neuen Moduls {#creating-a-new-module}

Mit Modulen können Sie modularisierte Assets, Dateien und Code hinzufügen und sie mit einem Versionierungssystem in Ihre Projekte importieren
. Auf diese Weise können Sie Ihren Projektcode auf die wichtigsten Unterscheidungsmerkmale konzentrieren, und
kann über ein von Ihnen erstelltes Modul problemlos gemeinsame Funktionen importieren.

So erstellen Sie ein neues Modul in Ihrem Arbeitsbereich:

1. Klicken Sie in Ihrem Workspace Dashboard auf die Registerkarte "Module":

![ModulesTab](/images/modules-tab.jpg)

2. Klicken Sie auf der Registerkarte "Module" im Workspace Dashboard auf "Neues Modul erstellen".

![ModulesTab](/images/create-new-module.jpg)

Sie können ein neues Modul auch direkt im Kontext eines Projekts erstellen. Drücken Sie in Ihrem Cloud Editor
Projekt auf die Schaltfläche "+" neben "Module". Klicken Sie dann auf "Neue Module erstellen" und fahren Sie mit den Anweisungen unter
fort.

3. Geben Sie grundlegende Informationen für das Modul ein: Geben Sie eine Modul-ID (diese ID wird in der URL Ihres Arbeitsbereichs
   angezeigt und kann verwendet werden, um im Projektcode auf Ihr Modul zu verweisen) und einen Modultitel an. Der Modultitel
   kann später auf der Seite Moduleinstellungen bearbeitet werden.

4. Sobald Sie Ihr Modul erstellt haben, werden Sie zur Datei module.js im Cloud Editor weitergeleitet.
   Von hier aus können Sie mit der Entwicklung Ihrer Module beginnen. Weitere Einzelheiten zur Modulentwicklung finden Sie unter
   im Abschnitt Entwicklung Ihres Moduls.

## Entwicklung eines Moduls {#developing-a-module}

Die Entwicklung von Modulen unterscheidet sich etwas von der Projektentwicklung. Module können nicht eigenständig ausgeführt werden (
) und können nur ausgeführt werden, nachdem sie in ein Projekt importiert wurden. Module können in einer
modulspezifischen Ansicht des Cloud Editors oder im Kontext eines Projekts entwickelt werden. \*\*Module sind nur unter
für den Arbeitsbereich verfügbar, in dem sie entwickelt wurden.

Wenn Sie ein Modul in der modulspezifischen Ansicht entwickeln, sehen Sie keine Schaltfläche "Vorschau" in der oberen Navigation des Cloud-Editors
, da Module nur in der Vorschau angezeigt werden können, wenn sie in ein Projekt importiert werden.

Zu den Hauptbestandteilen eines Moduls gehören:

`manifest.json`

In der Datei `manifest.json` können Sie Parameter erstellen, die über einen visuellen Konfigurator bearbeitet werden können, wenn
Module in Projekte importiert werden. Ihr "module.js"-Code kann die Parameter abonnieren, die Sie
im Modulmanifest zur Verfügung stellen, um sie dynamisch auf der Grundlage von Benutzereingaben zu ändern, wenn Sie das Modul
im Kontext eines Projekts konfigurieren.

Das Modul Config Builder startet automatisch mit einer verfügbaren Parametergruppe. Parametergruppen
können für logische Unterteilungen von Parametern verwendet werden, die dann unter
visuell dargestellt und gruppiert werden, wenn Ihr Modul in einem Projekt verwendet wird.

1. Benennen Sie eine Konfigurationsgruppe durch Doppelklick auf den Gruppentitel um.
2. Fügen Sie eine neue Konfigurationsgruppe hinzu, indem Sie auf die Schaltfläche "New Config Group" klicken.
3. Fügen Sie einen Parameter zu einer Konfigurationsgruppe hinzu, indem Sie auf "+ Neuer Parameter" drücken.

![ModulesConfigBuilder](/images/modules-config-builder.jpg)

4. Wenn Sie einen neuen Parameter erstellen, müssen Sie ihm einen Namen geben. Dieser Name kann in
   Modul- und Projektcode verwendet werden und sollte daher keine Leerzeichen oder Sonderzeichen enthalten.
5. Wählen Sie die Art des Parameters. Derzeit unterstützte Parametertypen sind
   `String`, `Number`, `Boolean`, & `Resource`.
6. Sobald Sie Ihre Auswahl getroffen haben, drücken Sie auf "**Weiter**".

![ModulesParameterGroup](/images/modules-param-group.jpg)

**HINWEIS:** Die Reihenfolge der Konfigurationsgruppen und der Parameter innerhalb dieser Gruppen bestimmt die Reihenfolge, in der
den Benutzern angezeigt wird, wenn sie ein Modul in einem Projekt verwenden. Sie können die Parameter
innerhalb einer Gruppe ganz einfach neu anordnen und auch die Konfigurationsgruppen neu anordnen, indem Sie sie in die gewünschte Reihenfolge ziehen. Um
einen Parameter von einer Gruppe in eine andere Gruppe zu verschieben, drücken Sie das Pfeilsymbol auf dem Parameterfeld und wählen Sie unter
die Gruppe aus, in die Sie den Parameter verschieben möchten.

## Modul Parametertypen und Optionen {#module-parameter-types--options}

Wenn Sie ein Modulmanifest für Ihr Modul erstellen, können Sie unter verschiedenen
Parametertypen wählen, darunter "String", "Number", "Boolean" und "Resource". Einzelheiten zu den einzelnen Parametern
type:

#### Zeichenfolge {#string}

String-Parameter haben die folgenden editierbaren Felder:

| Parameter-Felder                                                                               | Typ      | Beschreibung                                                                                                                                                                                                                                                          |
| ---------------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Etikett (1)                                                                 | `String` | Ein von Menschen lesbarer Name für Ihren Parameter, der in der Konfigurationsoberfläche angezeigt wird, wenn das Modul in ein Projekt importiert wird. Der Standardwert wird dynamisch auf der Grundlage des Parameternamens erzeugt. |
| Standard [Optional] (2) | `String` | Der Standard-Stringwert, wenn beim Import des Moduls in ein Projekt kein Wert angegeben wird. Der Standardwert ist "".                                                                                                                |

![ModulesParameterString](/images/modules-param-string.jpg)

#### Nummer {#number}

Zahlenparameter haben die folgenden bearbeitbaren Felder:

| Parameter-Felder                                                                               | Typ      | Beschreibung                                                                                                                                                                                                                                                          |
| ---------------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Etikett (1)                                                                 | `String` | Ein von Menschen lesbarer Name für Ihren Parameter, der in der Konfigurationsoberfläche angezeigt wird, wenn das Modul in ein Projekt importiert wird. Der Standardwert wird dynamisch auf der Grundlage des Parameternamens erzeugt. |
| Standard [Optional] (2) | Nummer   | Der Standardwert der Nummer, wenn beim Import des Moduls in ein Projekt kein Wert angegeben wird. Die Voreinstellung ist `null`.                                                                                                      |
| Min [fakultativ] (3)    | Nummer   | Der maximale Zahlenwert, den ein Benutzer eingeben kann, wenn das Modul in ein Projekt importiert wird. Die Voreinstellung ist `null`.                                                                                                |
| Max [fakultativ] (4)    | Nummer   | Der minimale Zahlenwert, den ein Benutzer eingeben kann, wenn das Modul in ein Projekt importiert wird. Die Voreinstellung ist `null`.                                                                                                |

![ModulesParameterNumber](/images/modules-param-number.jpg)

#### Boolesche {#boolean}

Boolesche Parameter haben die folgenden bearbeitbaren Felder:

| Parameter-Felder                                                                                           | Typ       | Beschreibung                                                                                                                                                                                                                                                          |
| ---------------------------------------------------------------------------------------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Etikett (1)                                                                             | `String`  | Ein von Menschen lesbarer Name für Ihren Parameter, der in der Konfigurationsoberfläche angezeigt wird, wenn das Modul in ein Projekt importiert wird. Der Standardwert wird dynamisch auf der Grundlage des Parameternamens erzeugt. |
| Standard [Optional] (2)             | `Boolean` | Der boolesche Standardwert, wenn beim Import des Moduls in ein Projekt kein Wert angegeben wird. Die Voreinstellung ist `false`.                                                                                                      |
| Etikett, wenn wahr [fakultativ] (3) | `String`  | Die Bezeichnung für die boolesche Option true, die in der Konfigurationsoberfläche angezeigt wird, wenn das Modul in ein Projekt importiert wird. Der Standardwert ist "true".                                                        |
| Etikett bei Falsch [fakultativ] (4) | `String`  | Die Bezeichnung für die boolesche Option false, die in der Konfigurationsoberfläche angezeigt wird, wenn das Modul in ein Projekt importiert wird. Die Voreinstellung ist `false`.                                                    |

![ModulesParameterBoolean](/images/modules-param-boolean.jpg)

#### Ressource {#resource}

Ressourcenparameter haben die folgenden bearbeitbaren Felder:

| Parameter-Felder                                                                                                   | Typ         | Beschreibung                                                                                                                                                                                                                                                          |
| ------------------------------------------------------------------------------------------------------------------ | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Etikett (1)                                                                                     | `String`    | Ein von Menschen lesbarer Name für Ihren Parameter, der in der Konfigurationsoberfläche angezeigt wird, wenn das Modul in ein Projekt importiert wird. Der Standardwert wird dynamisch auf der Grundlage des Parameternamens erzeugt. |
| Erlauben Keine (2)                                                                              | `Boolean`   | Aktiviert/deaktiviert die Möglichkeit, die Ressource über die Konfigurationsoberfläche explizit auf Null zu setzen, wenn das Modul in das Projekt importiert wird. Die Voreinstellung ist `false`.                                    |
| Erlaubte Asset-Erweiterungen [Optional] (3) | Datei-Typen | Ermöglicht das Hochladen bestimmter Dateitypen über die in der Konfigurationsoberfläche angezeigte Option, wenn das Modul in ein Projekt importiert wird. Die Standardeinstellung ist alle Dateitypen.                                |
| Standard-Ressource [Optional] (4)           | Datei       | Die Standardressource, wenn beim Import des Moduls in ein Projekt keine angegeben wird. Die Voreinstellung ist `null`.                                                                                                                |

![ModulesParameterResource](/images/modules-param-resource.jpg)

`module.js`

Die Datei `module.js` ist der Haupteinstiegspunkt für Ihr 8th Wall-Modul. Der Code in `module.js` wird
ausgeführt, bevor das Projekt geladen wird. Sie können auch andere Dateien und Anlagen hinzufügen und auf sie in
`module.js` verweisen.

Module können sehr unterschiedlich sein, je nach ihrem Zweck und Ihrem Entwicklungsstil. Typischerweise enthalten
Module einige der folgenden Elemente:

## Abonnement für Modulkonfigurationswerte {#subscription-to-module-configuration-values}

```javascript
import {subscribe} from 'config' // Mit config greifen Sie auf Ihre Moduloptionen zu

subscribe((config) => {
  // Ihr Code macht hier etwas mit der config
})
```

## Exportieren von Eigenschaften, die im Projektcode referenziert werden {#export-properties-that-are-referenced-in-project-code}

```javascript
export {
  // Eigenschaften hier exportieren
}

```

`README.md`

Sie können eine Readme-Datei in Ihr Modul einfügen, indem Sie einfach eine Datei mit dem Namen `README.md` im Dateiverzeichnis Ihres Moduls
erstellen. Genau wie die Readme-Module für Projekte können Readmes mit Markdown formatiert werden und
kann Assets wie Bilder und Videos enthalten.

**HINWEIS:** Wenn Ihr Modul eine Readme-Datei hat, wird diese automatisch mit dem Modul verpackt, wenn Sie
\*eine Version bereitstellen. Die entsprechende Modul-Lektüre wird im Kontext des Moduls angezeigt, abhängig
\*von der Version des Moduls, das im Projekt verwendet wird.

## Entwicklung eines Moduls im Rahmen eines Projekts {#developing-a-module-within-the-context-of-a-project}

Sie können den Entwicklungsmodus im Kontext eines Projekts für Module, die Ihrem Arbeitsbereich
gehören, aktivieren, indem Sie auf der Modulkonfigurationsseite die Option "Entwicklungsmodus" (in der Abbildung unten rot dargestellt) aktivieren.
Sobald der Entwicklungsmodus aktiviert ist, werden der zugrunde liegende Code und die Dateien des Moduls im linken Seitenbereich von
sichtbar.

Wenn sich ein Modul im Kontext eines Projekts im Entwicklungsmodus befindet, werden auf der Konfigurationsseite
zusätzliche Optionen angezeigt, darunter: Modul-Client-Steuerelemente (in Grüntönen), eine Schaltfläche für die Modulbereitstellung
(in Rosa) und ein Umschalter für den "Bearbeitungsmodus", mit dem Sie zwischen der Bearbeitung des Inhalts der Konfigurationsseite von visual
und der Verwendung der Konfiguration wechseln können.

![ModulesDevelopmentMode](/images/modules-development-mode.jpg)

Wenn Sie Module im Rahmen eines Projekts entwickeln und Änderungen an Grundstücken vornehmen, sehen Sie unter
einen Grundstücksfluss, der Sie durch Projekt- und Moduländerungen führt. Sie können wählen, ob Sie
landesspezifische Änderungen vornehmen möchten oder nicht. Für jedes Projekt oder Modul mit Änderungen, die Sie landen wollen, muss eine
Commit-Nachricht hinzugefügt werden, bevor Sie Ihren Code vollständig landen können.

![ModulesReviewChanges](/images/modules-review-changes.jpg)

Wenn Sie Module im Rahmen eines Projekts entwickeln und Änderungen vornehmen, werden Sie auch eine Aktualisierung der Optionen zum Abbrechen und Zurücknehmen von Änderungen im Cloud-Editor feststellen. Sie können wählen, ob Sie nur Änderungen am Projekt oder sowohl an Ihrem Projekt als auch an den in der Entwicklung befindlichen Modulen abbrechen/zurücknehmen wollen oder nicht.

## Bereitstellen eines Moduls {#deploying-a-module}

#### Erste Modulbereitstellung {#initial-module-deployment}

Durch die Bereitstellung von Modulen können Sie stabile Versionen gemeinsam nutzen und gleichzeitig Projekten die Möglichkeit geben,
Modulaktualisierungen innerhalb einer Versionsfamilie zu abonnieren. So können Sie nicht-unterbrechende Modul-Updates automatisch an
weiterleiten.

#### So stellen Sie ein Modul zum ersten Mal bereit: {#deploy-a-module-for-the-first-time}

1. Wenn Sie von der modulspezifischen Ansicht des Cloud-Editors aus entwickeln, klicken Sie auf die Schaltfläche "Bereitstellen" in der oberen rechten Ecke. Wenn Sie ein Modul im Rahmen eines Projekts entwickeln, klicken Sie auf die Schaltfläche "Bereitstellen" in der oberen rechten Ecke der Modulkonfigurationsseite.

![ModulesDeploy](/images/modules-deploy.jpg)

2. Überprüfen Sie Ihren Modultitel.
3. Wählen Sie den gewünschten Commit für Ihre Modulversion.
4. Schreiben Sie eine Beschreibung der anfänglichen Modulfunktionalität in den Abschnitt Release Notes. Dieser Abschnitt akzeptiert die Markdown-Formatierung.
5. Klicken Sie auf "Weiter".

![ModulesDeployInitialVersion](/images/modules-deploy-initial-version.jpg)

6. Optional können Sie eine Modulbeschreibung und/oder ein Titelbild hinzufügen. Die Modulbeschreibung und das Titelbild werden im Modulimportfluss angezeigt, wenn ein Modul in ein Projekt aufgenommen wird. Das Hinzufügen einer Beschreibung und eines Titelbildes kann helfen, das Modul zu differenzieren und anderen Mitgliedern Ihres Arbeitsbereichs einen Kontext über die Verwendung des Moduls zu geben.
7. Klicken Sie auf "Bereitstellen".

![ModulesDeployInitialVersion2](/images/modules-deploy-initial-version2.jpg)

## Bereitstellen von Modul-Updates {#deploying-module-updates}

Die Bereitstellung von Modul-Updates erfolgt ähnlich wie die erstmalige Bereitstellung eines Moduls mit zwei zusätzlichen
Bereitstellungsoptionen.

1. **Versionstyp**: Wenn Sie eine Modulaktualisierung bereitstellen, werden Sie aufgefordert, auszuwählen, ob es sich um eine Fehlerbehebung, eine neue Funktion oder eine Hauptversion handelt.
   - **Fehlerbehebung**: Sollte für überarbeiteten Code und Korrekturen bestehender Probleme ausgewählt werden. Projekte mit Modulen, die auf Fehlerbehebungen oder neue Funktionen abonniert sind, erhalten automatisch eine Aktualisierung, wenn eine neue Version des Fehlerbehebungsmoduls verfügbar ist.
   - **Neue Funktionen**: Sollte ausgewählt werden, wenn Sie Ihrem Modul zusätzliche, nicht unterbrechende Funktionen hinzugefügt haben. Projekte mit Modulen, die bei New Features abonniert sind, erhalten automatisch ein Update, wenn eine neue Version des New Features-Moduls verfügbar ist.
   - **Großes Release**: Sollte für grundlegende Änderungen ausgewählt werden. Projekte mit Modulen erhalten keine automatischen Updates für Major Releases.
2. **Als Vorabversion kennzeichnen**: Nach Auswahl eines Versionstyps können Sie die Version als Vorabversion kennzeichnen.
   Dies fügt einen Vorabversions-Badge hinzu, um andere Benutzer darüber zu informieren, dass es sich bei der Modulversion um eine Vorabversion handelt. Wenn
   als Versionstyp "Fehlerbehebungen" oder "Neue Funktionen" angibt, erhalten Projekte auch keine automatische Aktualisierung
   , solange eine Version als Vorabversion markiert ist. Um eine Vorabversion innerhalb eines Moduls zu verwenden, das
   in Ihr Projekt importiert wurde, wählen Sie die Vorabversion manuell aus dem Ziel für die Versionsanbindung aus.

![ModulesDeployNewVersion](/images/modules-deploy-new-version.jpg)

## Modul bearbeiten Vorabversion {#edit-module-pre-release}

Wenn eine Vorabversion aktiv ist, können Sie die Vorabversion so lange aktualisieren, bis Sie
entweder die Vorabversion veröffentlichen oder sie aufgeben.

**Um ein Modul vor der Freigabe zu bearbeiten**:

1. Wenn Sie von der modulspezifischen Ansicht des Cloud-Editors aus entwickeln, nachdem Sie zuvor eine neue Version von
   als Vorabversion eingestellt haben, klicken Sie auf die Schaltfläche "Bereitstellen" in der oberen rechten Ecke. Wenn Sie
   ein Modul aus dem Kontext eines Projekts heraus entwickeln, nachdem Sie zuvor eine neue Version als
   Vorabversion eingestellt haben, klicken Sie auf die Schaltfläche "Bereitstellen" in der oberen rechten Ecke der Modulkonfigurationsseite.

![ModulesDeploy2](/images/modules-deploy.jpg)

2. Wählen Sie einen neuen Commit für Ihre Vorabversion oder behalten Sie den aktuellen Commit bei.
3. Ändern Sie die Beschreibung der Funktionalität der Modulversion im Abschnitt Versionshinweise. Dieser Abschnitt akzeptiert die Markdown-Formatierung.
4. Aktivieren Sie das Kontrollkästchen "Zur Freigabe befördern", wenn Sie bereit sind, Ihre Vorabversion in eine Standardversion umzuwandeln.
5. Drücken Sie "Vorabfreigabe aufheben", um die Vorabfreigabe zu löschen. Dies wird normalerweise verwendet, um einen anderen Versionstyp auszuwählen als den, auf den die Vorabversion derzeit eingestellt ist (z. B. Wechsel von Fehlerkorrekturen zu einer Hauptversion mit grundlegenden Änderungen). Projekte mit Modulen, die derzeit an die Vorabversion angeheftet sind, werden weiterhin mit der Vorabversion ausgeführt, bis sie ein abonniertes Update erhalten oder manuell geändert werden.
6. Mit der Schaltfläche "Bereitstellen" werden die bearbeiteten Änderungen der Vorabversion verfügbar gemacht (entweder als Aktualisierung der Vorabversion oder als Freigabe, wenn das Kontrollkästchen aktiviert ist):

![ModulesEditPreReleaseDeploy](/images/modules-edit-pre-release.jpg)