# Module importieren

## Module in ein Cloud-Editor-Projekt importieren {#importing-modules-into-a-cloud-editor-project}

Mit Modulen können Sie Ihrem Projekt wiederverwendbare Komponenten hinzufügen, so dass Sie sich auf die Entwicklung Ihres Kerngeschäfts konzentrieren können. Der 8th Wall Cloud Editor ermöglicht es Ihnen, eigene oder von 8th Wall veröffentlichte Module direkt in Ihre Projekte zu importieren.

**Um ein Modul in ein Cloud Editor-Projekt zu importieren**:

1. Drücken Sie im Cloud-Editor auf die Schaltfläche "+" neben "Module".

![modules-step1-add-module](/images/modules-step1-add-module.png)

2. Wählen Sie das Modul, das Sie importieren möchten, aus der Liste aus. Nur Module, die mit dem von 8th Wall gehosteten Projekt kompatibel sind, stehen für den Import zur Verfügung. (Erfahren Sie mehr über [Modulkompatibilität](/legacy/guides/modules/compatibility/))

![modules-step2-select-template](/images/modules-step2-select-template.png)

3. Klicken Sie auf "Importieren", um Ihr Modul zu Ihrem Projekt hinzuzufügen. Achten Sie auf den Modulalias. Wenn Sie bereits ein Modul
   mit demselben Alias in Ihrem Projekt haben, müssen Sie Ihr Modul möglicherweise umbenennen.

![modules-step3-press-import](/images/modules-step3-press-import.png)

4. Das Modul ist nun in Ihrem Projekt unter dem Abschnitt "Module" sichtbar.

![modules-step4-press-import](/images/modules-added-to-project.jpg)

5. Wenn Sie das importierte Modul auswählen, werden Sie zur Seite für die Modulkonfiguration weitergeleitet. Auf dieser Seite können Sie verschiedene Modulparameter konfigurieren.

![modules-step5-press-import](/images/modules-config-page.jpg)

Sobald Sie ein Modul zu Ihrem Projekt hinzugefügt haben, müssen Sie möglicherweise Änderungen an Ihrem Code vornehmen, um das Modul vollständig zu integrieren. Module mit Readmes enthalten Dokumentation, auf die Sie Bezug nehmen sollten, um zu verstehen, wie Sie das jeweilige Modul in Ihren Projektcode integrieren können.

## Importieren von Modulen in ein selbstgehostetes Projekt {#importing-modules-into-a-self-hosted-project}

Mit Hilfe von Modulen können Sie Ihrem Projekt wiederverwendbare Komponenten hinzufügen und sich auf die
Entwicklung Ihres Kerngeschäfts konzentrieren. Sie können Ihre eigenen Module oder Module, die von 8th
Wall veröffentlicht wurden, direkt in Ihre selbst gehosteten Projekte importieren.

**Um ein Modul in Ihr selbstgehostetes Projekt zu importieren**:

1. Öffnen Sie im Cloud-Editor Ihr selbstgehostetes Projekt und klicken Sie auf das Modul-Symbol in der linken Navigation
   :

![Modules-left-nav](/images/modules-icon-left-nav.jpg)

2. Drücken Sie "+" oder "Modul importieren", um ein verfügbares Modul zu Ihrem Projekt hinzuzufügen.

3. Klicken Sie auf "Öffentliche Module", um ein von 8th Wall erstelltes Modul zu importieren, oder auf "Meine Module", um ein von einem Mitglied Ihres Arbeitsbereichs erstelltes Modul
   zu importieren. Nur Module, die mit dem Self-Hosted-Projekt kompatibel sind, werden unter
   zum Import angeboten. (Erfahren Sie mehr über [Modulkompatibilität](/legacy/guides/modules/compatibility/))

4. Wählen Sie das Modul, das Sie importieren möchten, aus der Liste aus.

5. Klicken Sie auf "Importieren", um Ihr Modul zu Ihrem Projekt hinzuzufügen. Achten Sie auf den Modulalias. Wenn Sie bereits ein Modul
   mit demselben Alias in Ihrem Projekt haben, müssen Sie Ihr Modul möglicherweise umbenennen.

6. Sie können bis zu 10 Module zu Ihrem Self-Hosted-Projekt hinzufügen. Diese Module werden als Registerkarten
   auf der Seite Projektmodule des 8th Wall Cloud Editors sichtbar sein.

![self-hosted-project-modules](/images/self-hosted-project-modules.jpg)

7. Wenn Sie das importierte Modul auswählen, werden die Details der Modulkonfiguration angezeigt. Unter
   können Sie verschiedene Modulparameter konfigurieren.

![self-hosted-project-module-details](/images/self-hosted-project-module-details.jpg)

8. Wenn Sie ein von Ihrem Team erstelltes Modul importieren, sehen Sie unter
   mehrere Optionen für das Anheftungsziel, darunter "Version" (nur, wenn das Modul mindestens einmal bereitgestellt wurde) und "Commit" (ermöglicht es Ihnen
   , das Modul an eine beliebige Commit-Version des Modulcodes anzuheften). Wenn Sie ein "Versions"-Anheftungsziel auswählen, können Sie
   Ihr importiertes Modul für Bugfix-Updates und neue Funktions-Updates abonnieren oder automatische
   Modul-Updates deaktivieren.

![self-hosted-project-module-pinning-target](/images/self-hosted-project-module-pinning-target.jpg)

9. Sobald Sie ein Modul zu Ihrem Projekt hinzugefügt haben, drücken Sie "Code kopieren" und fügen Sie den Inhalt der Zwischenablage
   in die Datei "head.html" Ihres Projekts ein. Dieses Snippet ermöglicht das Laden von Modulen in
   Ihr selbstgehostetes Projekt mit den von Ihnen angegebenen Modulkonfigurationseinstellungen. Sie müssen den Codeschnipsel
   erneut kopieren und die Datei "head.html" Ihres Projekts aktualisieren, wenn Sie die Einstellungen der Modulkonfiguration unter
   ändern.

![self-hosted-project-module-copy-code](/images/self-hosted-project-module-copy-code.jpg)

10. Möglicherweise müssen Sie Änderungen an Ihrem Code vornehmen, um das Modul vollständig zu integrieren.
