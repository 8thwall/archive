---
id: physics
---

# Physique

## Description

Cette bibliothèque propose des méthodes pour appliquer la physique et paramétrer les collisionneurs sur les entités.

## Fonctions

### applyForce

Vous pouvez appliquer directement des forces (linéaires et angulaires) à n'importe quelle entité dotée d'un collisionneur physique.
Ces forces sont appliquées lors de la prochaine mise à jour de la simulation physique, qui a lieu à intervalles réguliers.
La fonction accepte un vecteur 3D pour définir la direction et l'ampleur de la force.

```ts
ecs.physics.applyForce(world, eid, forceX, forceY, forceZ) // -> void
```

### appliquerImpulsion

Cette fonction est utilisée pour appliquer une force d'impulsion unique à un collisionneur physique, en modifiant sa vitesse sur la base du vecteur d'impulsion donné.
Cette méthode est utile pour les événements qui nécessitent une réaction rapide et unique, comme un saut, un coup de poing ou une poussée soudaine.

```ts
ecs.physics.applyImpulse(world, eid, impulseX, impulseY, impulseZ) // -> void
```

### applyTorque

Vous pouvez appliquer directement des forces (linéaires et angulaires) à n'importe quelle entité dotée d'un collisionneur physique.
Ces forces sont appliquées lors de la prochaine mise à jour de la simulation physique, qui a lieu à intervalles réguliers.
La fonction accepte un vecteur 3D pour définir la direction et l'ampleur de la force.

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

### getAngularVelocity

Obtenir la vitesse angulaire d'une entité.

```ts
ecs.physics.getAngularVelocity(world, eid) // -> {x: number, y: number, z: number}
```

### setAngularVelocity

Définit la vitesse angulaire d'une entité.

```ts
ecs.physics.setAngularVelocity(world, eid) // -> {x: number, y: number, z: number}
```

### getLinearVelocity

Obtenir la vitesse linéaire d'une entité.

```ts
ecs.physics.getLinearVelocity(world, eid) // -> {x: number, y: number, z: number}
```

### setLinearVelocity

Définit la vitesse linéaire d'une entité.

```ts
ecs.physics.setLinearVelocity(world, eid, velocityX, velocityY, velocityZ) // -> void
```

### getWorldGravity

Obtenir la gravité mondiale.

```ts
ecs.physics.getWorldGravity(world, gravity) // -> nombre
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
