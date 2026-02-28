---
id: physics
---

# Physik

## Beschreibung

Diese Bibliothek enthält Methoden zum Anwenden von Physik und zum Einstellen von Kollidern auf Entitäten.

## Funktionen

### applyForce

Sie können direkt Kräfte (linear und winklig) auf jedes Objekt mit einem Physik-Kollider anwenden.
Diese Kräfte werden bei der nächsten Aktualisierung der Physiksimulation angewendet, die in regelmäßigen Abständen stattfindet.
Die Funktion akzeptiert einen 3D-Vektor, um die Richtung und den Betrag der Kraft zu definieren.

:::warning
Dies ist abhängig von der Häufigkeit der Aufrufe von requestAnimationFrame() oder der Aktualisierungsrate Ihres Geräts.
:::

```ts
ecs.physics.applyForce(world, eid, forceX, forceY, forceZ) // -> void
```

### applyImpulse

Diese Funktion wird verwendet, um eine einmalige, momentane Kraft auf einen Physik-Collider anzuwenden, die seine Geschwindigkeit basierend auf dem angegebenen Impulsvektor verändert.
Diese Methode eignet sich für Ereignisse, die eine schnelle, einmalige Reaktion erfordern, wie z. B. Springen, Schlagen oder ein plötzlicher Stoß.

```ts
ecs.physics.applyImpulse(world, eid, impulseX, impulseY, impulseZ) // -> void
```

### applyTorque

Sie können direkt Kräfte (linear und winklig) auf jedes Objekt mit einem Physik-Kollider anwenden.
Diese Kräfte werden bei der nächsten Aktualisierung der Physiksimulation angewendet, die in regelmäßigen Abständen stattfindet.
Die Funktion akzeptiert einen 3D-Vektor, um die Richtung und den Betrag der Kraft zu definieren.

:::warning
Dies ist abhängig von der Häufigkeit der Aufrufe von requestAnimationFrame() oder der Aktualisierungsrate Ihres Geräts.
:::

```ts
ecs.physics.applyTorque(world, eid, torqueX, torqueY, torqueZ) // -> void
```

### getWorldGravity

Dies ist eine einfache Getter-Funktion, die die aktuelle Schwerkraft zurückgibt, die auf jedes Objekt in der Szene wirkt.
Der Rückgabewert kann sich je nach dem Zeitpunkt der Ausführung der Funktion ändern.

```ts
ecs.physics.getWorldGravity(world) // -> Zahl
```

### registerConvexShape

Registrieren Sie eine konvexe Form.

```ts
ecs.physics.registerConvexShape(world, vertices) // -> eid der registrierten Form
```

### getLinearVelocity

Ermittelt die lineare Geschwindigkeit eines Objekts.

```ts
ecs.physics.getLinearVelocity(world, eid) // -> Zahl
```

### setLinearVelocity

Legt die lineare Geschwindigkeit eines Objekts fest.

```ts
ecs.physics.setLinearVelocity(world, eid, velocityX, velocityY, velocityZ) // -> void
```

### setWorldGravity

Stellen Sie die Schwerkraft der Welt ein.

```ts
ecs.physics.setWorldGravity(world, gravity) // -> void
```

### unregisterConvexShape

Aufheben der Registrierung einer konvexen Form.

```ts
ecs.physics.unregisterConvexShape(world, id) // -> void
```

## Ereignisse

### KOLLISION_START_EREIGNIS

Wird ausgesendet, wenn eine Kollision mit einer Entität begonnen hat.

```ts
ecs.physics.COLLISION_START_EVENT.data : { other }
```

#### Eigenschaften

| Eigenschaft | Typ | Beschreibung                     |
| ----------- | --- | -------------------------------- |
| andere      | eid | Der eid der kollidierten Entität |

### KOLLISION_ENDE_EREIGNIS

Wird ausgesendet, wenn die Kollision mit einer Entität beendet ist.

```ts
ecs.physics.COLLISION_END_EVENT.data : { other }
```

#### Eigenschaften

| Eigenschaft | Typ | Beschreibung                     |
| ----------- | --- | -------------------------------- |
| andere      | eid | Der eid der kollidierten Entität |
