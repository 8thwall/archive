---
id: physics
---

# physique

## Description

Cette bibliothèque propose des méthodes pour appliquer la physique et paramétrer les collisionneurs sur les entités.

## Fonctions

### applyForce

Vous pouvez appliquer directement des forces (linéaires et angulaires) à n'importe quelle entité dotée d'un collisionneur physique.
Ces forces sont appliquées lors de la prochaine mise à jour de la simulation physique, qui a lieu à intervalles réguliers.
La fonction accepte un vecteur 3D pour définir la direction et l'ampleur de la force.

:::warning
Cela dépend de la fréquence des appels à requestAnimationFrame() ou du taux de rafraîchissement de votre appareil.
:::

```ts
ecs.physics.applyForce(world, eid, forceX, forceY, forceZ) // -> void
```

### appliquerImpulsion

Cette fonction est utilisée pour appliquer une force instantanée unique à un collisionneur physique, modifiant sa vitesse en fonction du vecteur d'impulsion donné.
Cette méthode est utile pour les événements qui nécessitent une réaction rapide et unique, comme un saut, un coup de poing ou une poussée soudaine.

```ts
ecs.physics.applyImpulse(world, eid, impulseX, impulseY, impulseZ) // -> void
```

### applyTorque

Vous pouvez appliquer directement des forces (linéaires et angulaires) à n'importe quelle entité dotée d'un collisionneur physique.
Ces forces sont appliquées lors de la prochaine mise à jour de la simulation physique, qui a lieu à intervalles réguliers.
La fonction accepte un vecteur 3D pour définir la direction et l'ampleur de la force.

:::warning
Cela dépend de la fréquence des appels à requestAnimationFrame() ou du taux de rafraîchissement de votre appareil.
:::

```ts
ecs.physics.applyTorque(world, eid, torqueX, torqueY, torqueZ) // -> void
```

### getWorldGravity

Il s'agit d'une simple fonction getter qui renvoie la force de gravité actuelle appliquée à chaque objet de la scène.
La valeur de retour peut varier en fonction de l'heure à laquelle la fonction a été exécutée.

```ts
ecs.physics.getWorldGravity(world) // -> nombre
```

### registerConvexShape

Enregistrer une forme convexe.

```ts
ecs.physics.registerConvexShape(world, vertices) // -> eid de la forme enregistrée
```

### getLinearVelocity

Obtenir la vitesse linéaire d'une entité.

```ts
ecs.physics.getLinearVelocity(world, eid) // -> nombre
```

### setLinearVelocity

Définit la vitesse linéaire d'une entité.

```ts
ecs.physics.setLinearVelocity(world, eid, velocityX, velocityY, velocityZ) // -> void
```

### setWorldGravity

Définir la gravité du monde.

```ts
ecs.physics.setWorldGravity(world, gravity) // -> void
```

### désenregistrer la forme convexe

Annuler l'enregistrement d'une forme convexe.

```ts
ecs.physics.unregisterConvexShape(world, id) // -> void
```

## Evénements

### ÉVÉNEMENT_DÉBUT_COLLISION

Emis lorsque la collision a commencé avec une entité.

```ts
ecs.physics.COLLISION_START_EVENT.data : { other }
```

#### Propriétés

| Propriété | Type | Description                           |
| --------- | ---- | ------------------------------------- |
| autres    | eid  | L'eid de l'entité entrée en collision |

### ÉVÉNEMENT DE FIN DE COLLISION

Emis lorsque la collision avec une entité s'est arrêtée.

```ts
ecs.physics.COLLISION_END_EVENT.data : { other }
```

#### Propriétés

| Propriété | Type | Description                           |
| --------- | ---- | ------------------------------------- |
| autres    | eid  | L'eid de l'entité entrée en collision |
