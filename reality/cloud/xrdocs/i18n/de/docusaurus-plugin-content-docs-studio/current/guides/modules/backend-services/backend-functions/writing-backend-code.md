---
id: writing-backend-code
sidebar_position: 2
---

# Backend-Code schreiben

## Übersicht

Der Backend-Funktionscode wird in einer serverlosen Umgebung ausgeführt, die mit Ihrem 8th Wall-Konto verbunden ist.
Alle Backend-Funktionen müssen eine **async-Methode** der obersten Ebene mit dem Namen `handler` exportieren, die der Einstiegspunkt
in die Backend-Funktion ist.

Beispiel für den Code der Eingabedatei:

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

## Client-Methode

Wenn Sie eine Backend-Funktion erstellen, wird automatisch eine Client-Methode für Sie erstellt. Diese Client-Methode
ist ein Wrapper um `fetch`, d.h. Sie können dieser Funktion die gleichen Argumente übergeben, wie Sie
mit einem normalen `fetch`-Aufruf übergeben würden. Siehe [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch)
für weitere Einzelheiten.

Mit dieser Client-Methode senden Sie Anfragen vom Modul-Client-Code an die Backend-Funktion.

![FetchWrapper](/images/studio/bfn-fetch-wrapper.png)

## Funktion Ereignisparameter

Die Handler-Methode wird jedes Mal, wenn die Client-Methode aufgerufen wird, mit einem "Event"-Objekt aufgerufen. `event`
has the following properties:

| Eigenschaft          | Typ                                                | Beschreibung                                                                                                                                                           |
| -------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pfad                 | String                                             | Der an die Client-Methode übergebene URL-Pfad (`'/getUser/foo'` , `'/checkAnswer'`, usw).                                           |
| Körper               | String                                             | Rufen Sie `JSON.parse(event.body)` auf, um den Body in ein Objekt zu verwandeln.                                                                       |
| httpMethode          | String                                             | Die HTTP-Methode, die für den Aufruf der Backend-Funktion verwendet wird. Eines von `'GET'`, `'PUT'`, `'POST'`, `'PATCH'`, `'DELETE'`. |
| queryStringParameter | Datensatz<string, string> | Schlüssel/Wert-Paare, die die Abfrage-String-Parameter aus der Anfrage enthalten.                                                                      |
| Kopfzeilen           | Datensatz<string, string> | Schlüssel/Wert-Paare, die Anfrage-Header enthalten.                                                                                                    |

## Objekt zurückgeben

Alle Eigenschaften sind optional.

| Eigenschaft | Typ                                                | Beschreibung                                                                        |
| ----------- | -------------------------------------------------- | ----------------------------------------------------------------------------------- |
| statusCode  | nummer                                             | Der Statuscode der Antwort. Standardwert ist "200". |
| Kopfzeilen  | Datensatz<string, string> | Die mit der Antwort verbundenen Kopfzeilen.                         |
| Körper      | String                                             | Das mit der Antwort verbundene `JSON.stringify()`'d body-Objekt.    |

## Fehlerbehandlung

Wenn die Backend-Funktion eine nicht abgefangene Ausnahme auslöst, gibt die Funktion `statusCode: 500`
mit einem Fehlerobjekt im Antwortkörper zurück.

Wenn Sie das Modul **besitzen** und sich **im Entwicklungsmodus** befinden, enthält das Fehlerobjekt `Name`,
`Meldung` und `Stack`:

`{error: {name: string, message: string, stack: string}}`

Beispiel:

```
{
  "error": {
    "name": "TypeError",
    "message": "Cannot read properties of undefined (reading 'foo')",
    "stack": "TypeError: Cannot read properties of undefined (reading 'foo')\n at call (webpack:///src/index.ts:8:24)\n ...
  }
}
```

Im **Nicht-Entwicklungsmodus** enthält das Fehlerobjekt weder eine "Name"- noch eine "Stack"-Eigenschaft, und die
"Message" ist ein allgemeiner "Internal Server Error".

## Pinning-Ziele

Ausführliche Informationen zu
Modul-Pinning-Zielen finden Sie unter https://www.8thwall.com/docs/guides/modules/pinning-targets/.

Beim Anheften an eine "Version" muss **Erlaubte Updates** auf "Keine" gesetzt werden.

![BFNVersionPinning](/images/studio/bfn-version-pinning.png)

Wenn Sie einen "Commit" anheften, wählen Sie einen bestimmten Commit aus.  Die Option "Neueste" wird nicht unterstützt.

![BFNCommitPinning](/images/studio/bfn-commit-pinning.png)
