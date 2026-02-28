# onDetach()

`onDetach : ({framework})`

## Description {#description}

`onDetach` est appelé après la dernière fois qu'un module reçoit des mises à jour de trame. Cette opération a lieu soit après l'arrêt du moteur, soit après le retrait manuel du module de la canalisation, selon ce qui se produit en premier.

## Paramètres {#parameters}

| Paramètres | Description                                                                        |
| ---------- | ---------------------------------------------------------------------------------- |
| cadre      | Les liaisons de ce module avec le cadre pour l'envoi d'événements. |
