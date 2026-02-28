# AccessPass

## Description {#description}

Fournit un module pour monétiser votre expérience WebAR et WebVR. Cette fonction n'est disponible que pour les projets hébergés par le 8th Wall et nécessite le [module de paiement](/guides/advanced-topics/monetize-with-8th-wall-payments).

```ts
import {AccessPass} from 'paiements'
```

## Fonctions {#functions}

| Fonction                                                    | Description                                                                                                          |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| [demande d'achat si nécessaire](requestpurchaseifneeded.md) | Ouvre une fenêtre de paiement où le client peut effectuer en toute sécurité le paiement de la carte d'accès fournie. |
