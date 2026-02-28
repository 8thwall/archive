---
id: creating-backend-functions
sidebar_position: 1
---

# Erstellen von Backend-Funktionen

:::info
Backend-Funktionen laufen im Kontext des 8th Wall Modulsystems. Die vollständige Moduldokumentation finden Sie unter
[siehe hier](https://www.8thwall.com/docs/guides/modules/overview/).  Dieser Abschnitt der Dokumentation
konzentriert sich speziell auf die Backend-Funktionen, die das Modul
bietet.
:::

Module können über die Seite Arbeitsbereich (Registerkarte Module) oder direkt in einem Studio-Projekt erstellt werden. Um
ein Modul mit einer Backend-Funktion direkt in Studio zu erstellen, folgen Sie bitte diesen Schritten:

1. Wählen Sie im Studio-Editor die Registerkarte "Module" im linken Bereich und klicken Sie auf "+ Neues Modul".

![CreateNewModule](/images/studio/bfn-new-module.png)

2. Wählen Sie die Registerkarte "Neues Modul erstellen" und geben Sie Ihrem neuen Modul eine Modul-ID.  Dieser Wert wird
   verwendet, um später im Projektcode auf Ihr Modul zu verweisen.  Sie kann nach der Erstellung nicht mehr geändert werden.

![ModuleId](/images/studio/bfn-module-id.png)

3. Fügen Sie dem Modul ein Backend hinzu: Datei-Explorer -> Registerkarte Module -> Rechtsklick auf Backends ->
   Wählen Sie New Backend config.

![NewBackendFunction](/images/studio/bfn-new-backend-config.png)

4. Wählen Sie im Assistenten für neue Backends den gewünschten Backend-Typ (in diesem Fall "Funktion") und geben Sie ihm einen
   Titel und eine Beschreibung. Der Dateiname des Backends wird automatisch auf der Grundlage von Title
   generiert und dient als Referenz für das Backend im Modulcode.

![NewBackend](/images/studio/bfn-new-backend.png)

5. Legen Sie einen Eingabepfad für Ihren Backend-Code fest.  Dies ist die Datei, in der Ihr Backend-Code-Einstiegspunkt
   gespeichert wird.

![BackendFunctionEntryPath](/images/studio/bfn-entry-path.png)

6. Erstellen Sie eine Datei mit demselben Pfad/Namen wie im obigen Schritt Eingabepfad definiert.  Klicken Sie mit der rechten Maustaste auf Dateien -> Neue Datei -> Leere Datei:

![BackendFunctionEmptyFile](/images/studio/bfn-create-empty-file.png)

Geben Sie den Namen ein, der Ihrem Eintragspfad entspricht:

![BackendFunctionEmptyFileName](/images/studio/bfn-create-empty-file-name.png)

Ergebnis:

![BackendFunctionEmptyFileNameResult](/images/studio/bfn-create-empty-file-result.png)

:::info
Die Backend-Funktion muss eine **async-Methode** namens "Handler" exportieren.  Weitere Informationen finden Sie in der Dokumentation [Writing Backend Code](/studio/guides/modules/backend-services/backend-functions/writing-backend-code/).
:::

Beispiel:

```javascript
const handler = async (event: any) => {
  // Custom backend code goes here

  return {
    body: JSON.stringify({
      myResponse,
    }),
  }
}

export {
  handler,
}
```
