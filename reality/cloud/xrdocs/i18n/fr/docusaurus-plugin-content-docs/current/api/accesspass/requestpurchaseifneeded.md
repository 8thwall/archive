---
sidebar_label: requestPurchaseIfNeeded()
---

# AccessPass.requestPurchaseIfNeeded()

`AccessPass.requestPurchaseIfNeeded({ amount, name, productId, statementDescriptor, accessDurationDays, currency, language  })`

## Description {#description}

Ouvre une fenêtre de paiement où le client peut effectuer en toute sécurité le paiement de la carte d'accès fournie.

Si un titre d'accès valide a déjà été acheté dans le passé, la Promesse renvoyée sera résolue immédiatement avec des informations sur l'achat précédent.

Tout paramètre fourni via cette API remplacera tout paramètre fourni dans la configuration du module.

## Paramètres {#parameters}

| Paramètres                 | Type     | Description                                                                                                                                                                                                                                                                                                                                                  |
| -------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| montant                    | `Nombre` | Le montant à demander pour le paiement de la carte d'accès spécifiée.<br/>Les montants ont un minimum et un maximum définis par la devise `` .<br/>**AUD**: 0,99 à 99,99 $<br/>**CAD**: 0,99 à 99,99 $<br/>**GBP**: 0,99 à 99,99 £<br/>**JPY**: ¥99 à ¥999<br/>**NZD**: 0,99 à 99,99 $<br/>**USD**: 0,99 à 99,99 $ |
| nom                        | `Chaîne` | Le nom du produit. Cette information est affichée aux utilisateurs sur l'écran de paiement. Maximum de 30 caractères.                                                                                                                                                                                                                                        |
| produitId                  | `Chaîne` | Identifiant unique pour ce titre d'accès. Maximum de 30 caractères.                                                                                                                                                                                                                                                                                          |
| descripteur de déclaration | `Chaîne` | Le descripteur qui apparaît sur le relevé de carte de crédit du client. 22 caractères au maximum.                                                                                                                                                                                                                                                            |
| accessDurationDays         | `Nombre` | Nombre de jours pendant lesquels un client est autorisé à accéder au site. Minimum de 1 et maximum de 7.                                                                                                                                                                                                                                                     |
| monnaie                    | `Chaîne` | La devise à facturer à l'utilisateur. Peut être '`aud`', '`cad`', '`gbp`', '`jpy`', '`nzd`', ou '`usd`'.                                                                                                                                                                                                                                                     |
| langue                     | `Chaîne` | La langue qui apparaît à l'utilisateur final sur la page de paiement sécurisé. Peut être '`en-US`' (anglais - États-Unis) ou '`ja-JP`' (japonais).                                                                                                                                                                                                           |

## Retours {#returns}

Une promesse qui déterminera si le client a effectué l'achat avec succès. Le résultat comprend des informations sur l'achat effectué :

```js
{
  productId: '1-day-access-pass',
  timestamp: 1653413347810,
  expirationTimestamp: 1653499747810,
}
```

## Lancers {#throws}

Une erreur est générée si le client ne termine pas l'achat avec succès.

## Exemple {#example}

```javascript
AccessPass.requestPurchaseIfNeeded({
    amount : 9.99,
    name : '1-Day Access Pass',
    productId : '1-day-access-pass',
    statementDescriptor : '1DAY ACCESS PASS',
    accessDurationDays : 1,
    currency : 'usd',
    language : 'en-US',
})
```
