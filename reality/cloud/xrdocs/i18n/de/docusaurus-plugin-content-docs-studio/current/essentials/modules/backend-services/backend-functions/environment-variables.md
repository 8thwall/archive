---
id: environment-variables
sidebar_position: 3
---

# Umgebungsvariablen

Mit Hilfe von Umgebungsvariablen können Sie sensible Informationen, die mit Ihrem Modul verbunden sind, sicher aufbewahren.
Sie ermöglichen es Ihnen beispielsweise, Authentifizierungsdaten zu speichern und weiterzugeben, ohne sie
direkt in Ihrem Code zu veröffentlichen.

## Umgebungsvariablen erstellen

1. Wählen Sie die Backend-Funktion innerhalb Ihres Moduls.
2. Klicken Sie auf "Neue Umgebungsvariable".

![NewEnvironmentVariable](/images/studio/bfn-new-environment-variable.png)

3. Definieren Sie einen Schlüssel (Variablenname)

![NewEnvironmentVariable](/images/studio/bfn-environment-variable-key.png)

4. Definieren Sie ein Label - dies ist der Anzeigename des Schlüssels, der dem Projekt angezeigt wird, das das Modul
   verwendet, das die Backend-Funktion enthält.

![NewEnvironmentVariable](/images/studio/bfn-environment-variable-label.png)

## Zugriff auf Umgebungsvariable im Code

Auf Umgebungsvariablen kann in Ihrem Code als `process.env zugegriffen werden.<KEY>`

### Beispiel:

```ts
const API_KEY = process.env.api_key
```
