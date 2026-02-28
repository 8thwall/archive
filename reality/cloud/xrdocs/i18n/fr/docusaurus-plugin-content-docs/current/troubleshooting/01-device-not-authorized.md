---
id: device-not-authorized
---

# Dispositif non autorisé

Problème : Lorsque j'essaie de visualiser mon application Web, je reçois un message d'erreur "Device Not Authorized".

#### Spécifique à Safari {#safari-specific}

La situation :

- Lors de la visualisation de votre projet, vous voyez des alertes ‘Appareil non autorisé', **mais**
- [apps.8thwall.com/token](https://apps.8thwall.com/token) montre l'autorisation correcte.

Pourquoi cela se produit-il ?

Safari dispose d'une fonction appelée Intelligent Tracking Prevention (prévention intelligente du suivi) qui peut bloquer les cookies de tiers (ceux que nous utilisons pour autoriser votre appareil pendant que vous développez). Lorsqu'ils sont bloqués, nous ne pouvons pas vérifier votre appareil.

Marche à suivre pour résoudre le problème :

1. Fermer Safari
1. Désactivez la prévention intelligente du suivi à l'adresse `Settings>Safari>Prevent Cross-Site Tracking`
1. Effacez les cookies de 8th Wall à l'adresse `Settings>Safari>Advanced>Website Data>8thwall.com`
1. Réautorisation à partir de la console
1. Vérifiez votre projet
1. Si le problème n'est pas résolu : Effacez tous les cookies à l'adresse `Settings>Safari>Clear History and Website Data`
1. Réautorisation à partir de la console

#### Dans le cas contraire {#otherwise}

Voir [Invalid App Key](/troubleshooting/invalid-app-key) étapes à partir de #5 pour plus de dépannage.
