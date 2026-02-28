# Module importieren

## Module in ein Cloud Editor-Projekt importieren {#importing-modules-into-a-cloud-editor-project}

Mit Modulen können Sie Ihrem Projekt wiederverwendbare Komponenten hinzufügen, so dass Sie sich auf die Entwicklung Ihres Kerngeschäfts konzentrieren können. Mit dem 8th Wall Cloud Editor können Sie Ihre eigenen oder von 8th Wall veröffentlichte Module direkt in Ihre Projekte importieren.

**So importieren Sie ein Modul in ein Cloud Editor-Projekt**:

1. Drücken Sie im Cloud Editor auf die Schaltfläche "+" neben Module.

![modules-step1-add-module](/images/modules-step1-add-module.png)

2. Wählen Sie das Modul, das Sie importieren möchten, aus der Liste aus. Nur Module, die mit dem von 8th Wall gehosteten Projekt kompatibel sind, stehen für den Import zur Verfügung. (Erfahren Sie mehr über [Modulkompatibilität](#module-compatibility))

![modules-step2-select-template](/images/modules-step2-select-template.png)

3. Klicken Sie auf "Importieren", um Ihr Modul zu Ihrem Projekt hinzuzufügen. Notieren Sie sich den Modul-Alias. Wenn Sie bereits ein Modul mit demselben Alias in Ihrem Projekt haben, müssen Sie Ihr Modul möglicherweise umbenennen.

![module-step3-press-import](/images/modules-step3-press-import.png)

4. Das Modul ist nun in Ihrem Projekt unter dem Abschnitt "Module" sichtbar.

![module-step4-press-import](/images/modules-added-to-project.jpg)

5. Wenn Sie das importierte Modul auswählen, werden Sie zur Seite für die Modulkonfiguration weitergeleitet. Auf dieser Seite können Sie verschiedene Modulparameter konfigurieren.

![module-step5-press-import](/images/modules-config-page.jpg)

Sobald Sie ein Modul zu Ihrem Projekt hinzugefügt haben, müssen Sie möglicherweise Änderungen an Ihrem Code vornehmen, um das Modul vollständig zu integrieren. Module mit Readmes enthalten Dokumentation, die Sie lesen sollten, um zu verstehen, wie Sie das jeweilige Modul in Ihren Projektcode integrieren können.

## Module in ein selbstgehostetes Projekt importieren {#importing-modules-into-a-self-hosted-project}

Mithilfe von Modulen können Sie Ihrem Projekt wiederverwendbare Komponenten hinzufügen, so dass Sie sich auf die Entwicklung Ihrer Kernerfahrung konzentrieren können. Sie können Ihre eigenen Module oder Module, die von 8th Wall veröffentlicht wurden, direkt in Ihre selbst gehosteten Projekte importieren.

**So importieren Sie ein Modul in Ihr selbstgehostetes Projekt**:

1. Öffnen Sie im Cloud Editor Ihr selbstgehostetes Projekt und klicken Sie auf das Modul-Symbol in der linken Navigation:

![Module-left-nav](/images/modules-icon-left-nav.jpg)

2. Drücken Sie "+" oder "Modul importieren", um ein verfügbares Modul zu Ihrem Projekt hinzuzufügen.

3. Klicken Sie auf "Öffentliche Module", um ein von 8th Wall erstelltes Modul zu importieren, oder auf "Meine Module", um ein von einem Mitglied Ihres Arbeitsbereichs erstelltes Modul zu importieren. Nur Module, die mit dem Self-Hosted-Projekt kompatibel sind, können über importiert werden. (Erfahren Sie mehr über [Modulkompatibilität](#module-compatibility))

4. Wählen Sie das Modul, das Sie importieren möchten, aus der Liste aus.

5. Klicken Sie auf "Importieren", um Ihr Modul zu Ihrem Projekt hinzuzufügen. Notieren Sie sich den Modul-Alias. Wenn Sie bereits ein Modul mit demselben Alias in Ihrem Projekt haben, müssen Sie Ihr Modul möglicherweise umbenennen.

6. Sie können bis zu 10 Module zu Ihrem Self-Hosted-Projekt hinzufügen. Diese Module werden als Registerkarten auf der Seite Projektmodule des 8th Wall Cloud Editors angezeigt.

![self-hosted-project-modules](/images/self-hosted-project-modules.jpg)

7. Wenn Sie das importierte Modul auswählen, werden die Details der Modulkonfiguration angezeigt. Hiermit können Sie verschiedene Modulparameter konfigurieren.

![self-hosted-project-module-details](/images/self-hosted-project-module-details.jpg)

8. Wenn Sie ein Modul importieren, das Ihr Team erstellt hat, sehen Sie unter mehrere Optionen für das Anheftungsziel, darunter "Version" (nur, wenn das Modul mindestens einmal bereitgestellt wurde) und "Commit" (ermöglicht Ihnen , das Modul an eine beliebige Commit-Version des Modulcodes anzuheften). Wenn Sie ein "Version"-Anheftungsziel auswählen, können Sie Ihr importiertes Modul für Bugfix-Updates und Updates für neue Funktionen abonnieren oder die automatischen Modul-Updates deaktivieren.

![self-hosted-project-module-pinning-target](/images/self-hosted-project-module-pinning-target.jpg)

9. Sobald Sie ein Modul zu Ihrem Projekt hinzugefügt haben, klicken Sie auf "Code kopieren" und fügen den Inhalt Ihrer Zwischenablage in die Datei `head.html` Ihres Projekts ein. Dieser Schnipsel ermöglicht das Laden von Modulen in Ihr selbstgehostetes Projekt mit den von Ihnen festgelegten Modulkonfigurationseinstellungen. Sie müssen den Codeschnipsel erneut kopieren und die `head.html` Ihres Projekts aktualisieren, wenn Sie eine Änderung an den Einstellungen der Modulkonfiguration vornehmen.

![selbst-gehostetes-projekt-modul-kopieren-code](/images/self-hosted-project-module-copy-code.jpg)

10. Möglicherweise müssen Sie Änderungen an Ihrem Code vornehmen, um das Modul vollständig zu integrieren.