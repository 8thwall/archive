---
sidebar_label: requestPurchaseIfNeeded()
---

# AccessPass.requestPurchaseIfNeeded()

`AccessPass.requestPurchaseIfNeeded({ amount, name, productId, statementDescriptor, accessDurationDays, currency, language  })`

## Beschreibung {#description}

Öffnet ein Kassenfenster, in dem der Kunde eine sichere Zahlung für den bereitgestellten Zugangspass vornehmen kann.

Wurde in der Vergangenheit bereits ein gültiger Zugangspass erworben, wird das zurückgegebene Versprechen sofort mit Informationen über den früheren Kauf aufgelöst.

Alle über diese API bereitgestellten Parameter ersetzen die in der Modulkonfiguration angegebenen Parameter.

## Parameter {#parameters}

| Parameter           | Typ      | Beschreibung                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Betrag              | Nummer   | Der Betrag, der für die Zahlung des angegebenen Zugangspasses verlangt wird.<br/>Die Beträge haben einen Mindest- und einen Höchstbetrag, wie sie in der jeweiligen Währung festgelegt sind.<br/>**AUD**: $0.99 bis $99.99<br/>**CAD**: $0.99 bis $99.99<br/>**GBP**: £0.99 bis £99.99<br/>**JPY**: ¥99 bis ¥999<br/>**NZD**: $0.99 bis $99.99<br/>**USD**: $0,99 bis $99,99 |
| Name                | `String` | Der Name des Produkts. Dies wird dem Benutzer auf dem Kassenbildschirm angezeigt. Maximal 30 Zeichen.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| productId           | `String` | Eine eindeutige Kennung für diesen Zugangsausweis. Maximal 30 Zeichen.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| statementDescriptor | `String` | Die Bezeichnung, die auf der Kreditkartenabrechnung des Kunden erscheint. Maximal 22 Zeichen.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| accessDurationDays  | Nummer   | Die Anzahl der Tage, für die ein Kunde Zugang erhält. Minimum von 1 und Maximum von 7.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Währung             | `String` | Die Währung, die dem Nutzer in Rechnung gestellt wird. Kann `aud`, `cad`, `gbp`, `jpy`, `nzd` oder `usd` sein.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Sprache             | `String` | Die Sprache, die dem Endbenutzer auf der sicheren Kassenseite angezeigt wird. Kann "`en-US" (Englisch - Vereinigte Staaten) oder "`ja-JP" (Japanisch) sein.                                                                                                                                                                                                                                                                                                                                                                                                                               |

## Rückgabe {#returns}

Ein Versprechen, das aufgelöst wird, wenn der Kunde den Kauf erfolgreich abgeschlossen hat. Das Ergebnis enthält Informationen über den getätigten Kauf:

```js
{
  productId: '1-day-access-pass',
  timestamp: 1653413347810,
  expirationTimestamp: 1653499747810,
}
```

## Wirft {#throws}

Ein Fehler wird ausgelöst, wenn der Kunde den Kauf nicht erfolgreich abschließen kann.

## Beispiel {#example}

```javascript
AccessPass.requestPurchaseIfNeeded({
    amount: 9.99,
    name: '1-Day Access Pass',
    productId: '1-day-access-pass',
    statementDescriptor: '1DAY ACCESS PASS',
    accessDurationDays: 1,
    currency: 'usd',
    language: 'en-US',
})
```
