---
id: device-not-authorized
---

# Dispositif non autorisé

Problème : Lorsque j'essaie de visualiser mon application Web, je reçois un message d'erreur "Device Not Authorized".

#### {#safari-specific}spécifique à Safari

La situation :

- Lors de la visualisation de votre projet, vous voyez des alertes 'Device not Authorized', **mais**
- [apps.8thwall.com/token](https://apps.8thwall.com/token) montre l'autorisation correcte.

Pourquoi cela se produit-il ?

Safari dispose d'une fonction appelée Intelligent Tracking Prevention (prévention intelligente du suivi) qui peut bloquer les cookies de tiers (ceux que nous utilisons pour autoriser votre appareil pendant que vous développez). Lorsqu'ils sont bloqués, nous ne pouvons pas vérifier votre appareil.

Marche à suivre pour résoudre le problème :

1. Fermer le safari
2. Désactivez la prévention du suivi intelligent dans `Settings>Safari>Prevent Cross-Site Tracking` (Paramètres>Safari>Prévenir le suivi intersite).
3. Effacez les cookies de 8th Wall dans `Paramètres>Safari>Avancé>Données du site web>8thwall.com`.
4. Réautorisation à partir de la console
5. Vérifiez votre projet
6. Si le problème n'est pas résolu : Effacez tous les cookies dans `Paramètres>Safari>Effacer l'historique et les données du site web`.
7. Réautorisation à partir de la console

#### Sinon {#otherwise}

Voir [Invalid App Key](/legacy/troubleshooting/invalid-app-key) étapes à partir de #5 pour plus de dépannage.
