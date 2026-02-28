---
id: limits-and-quotas
sidebar_position: 4
---

# Limites et quotas

Les limites et quotas suivants s'appliquent actuellement aux fonctions back-end :

## Limites de l'itinéraire

- Routes maximales par module : 32
- Routes maximales par projet : 64

:::note
Chaque fonction backend compte pour une route attachée à la passerelle sous-jacente de votre application. Chaque route
Proxy compte également dans cette limite.
:::

## Délai d'attente de la fonction

Les fonctions dorsales sont limitées à un **temps d'exécution maximal de 10 secondes**. Si vous dépassez cette limite,
la fonction s'arrêtera avec une erreur.

## Soutien aux paquets

L'installation de paquets NPM n'est actuellement pas prise en charge. À ce stade, vous avez accès à tous les modules de base de Node.js
.
