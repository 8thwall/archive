---
sidebar_label: requestPurchaseIfNeeded()
---

# AccessPass.requestPurchaseIfNeeded()

`AccessPass.requestPurchaseIfNeeded({ amount, name, productId, statementDescriptor, accessDurationDays, currency, language  })`

## Descripción {#description}

Abre una ventana de pago en la que el cliente puede realizar de forma segura el pago del pase de acceso proporcionado.

Si ya se ha comprado anteriormente un pase de acceso válido, la promesa devuelta se resolverá inmediatamente con información sobre la compra anterior.

Cualquier parámetro proporcionado a través de esta API sustituirá a cualquier parámetro proporcionado en la configuración del módulo.

## Parámetros {#parameters}

| Parámetro           | Tipo     | Descripción                                                                                                                                                                                                                                                                                                                                                               |
| ------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| amount              | `Number` | El importe a solicitar para el pago del pase de acceso especificado.<br/>Los importes tienen un mínimo y un máximo respectivos, definidos por la moneda ``.<br/>**AUD**: $0.99 a $99.99<br/>**CAD**: $0.99 a $99.99<br/>**GBP**: £0.99 a £99.99<br/>**JPY**: ¥99 a ¥999<br/>**NZD**: $0.99 a $99.99<br/>**USD**: $0.99 a $99.99 |
| name                | `Cadena` | El nombre del producto. Esto se muestra a los usuarios en la pantalla de pago. Máximo de 30 caracteres.                                                                                                                                                                                                                                                                   |
| productId           | `Cadena` | Un identificador único para este pase de acceso. Máximo de 30 caracteres.                                                                                                                                                                                                                                                                                                 |
| statementDescriptor | `Cadena` | El descriptor que aparece en el extracto de la tarjeta de crédito del cliente. Máximo de 22 caracteres.                                                                                                                                                                                                                                                                   |
| accessDurationDays  | `Number` | El número de días durante los que se permite el acceso a un cliente. Mínimo de 1 y máximo de 7.                                                                                                                                                                                                                                                                           |
| currency            | `Cadena` | La moneda que se cobrará al usuario. Puede ser '`aud`', '`cad`', '`gbp`', '`jpy`', '`nzd`', o '`usd`'.                                                                                                                                                                                                                                                                    |
| language            | `Cadena` | El idioma que aparece al usuario final en la página de pago seguro. Puede ser '`en-US`' (inglés - Estados Unidos) o '`ja-JP`' (japonés).                                                                                                                                                                                                                                  |

## Devuelve {#returns}

Una promesa que se resolverá si el cliente ha completado la compra con éxito. El resultado incluye información sobre la compra realizada:

```js
{
  productId: '1-day-access-pass',
  timestamp: 1653413347810,
  expirationTimestamp: 1653499747810,
}
```

## Lanza {#throws}

Se lanza un error si el cliente no completa la compra con éxito.

## Ejemplo {#example}

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
