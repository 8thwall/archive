---
id: media-recorder
---

# Événements de l'enregistreur de médias

## Description

Ce Media Recorder vous permet de capucher des captures d'écran et d'enregistrer des vidéos de votre projet Studio à l'exécution.

## Evénements

### Enregistreur d'écrans

Émis lorsque la capture d'écran est prête.

#### Propriété

| Propriété | Type     | Description                             |
| --------- | -------- | --------------------------------------- |
| amalgame  | Amalgame | L'image JPEG blob de la capture d'écran |

#### Exemple

```
world.events.addListener(world.events.globalId, ecs.events.RECORDER_SCREENSHOT_READY, (e) => {
    const blob = e.data;
    console.log('Screenshot blob:', blob);
});
```

### L'enregistrement de la photo a commencé

Émis lorsque l'enregistrement a démarré.

#### Propriétés

Aucun.

#### Exemple

```
world.events.addListener(world.events.globalId, ecs.events.RECORDER_VIDEO_STARTED, () => {
    console.log('Recording started');
});
```

### L'enregistrement de la photo est interrompu

Émis lorsque l'enregistrement s'est arrêté.

#### Propriétés

Aucune.

#### Exemple

```
world.events.addListener(world.events.globalId, ecs.events.RECORDER_VIDEO_STOPPED, () => {
    console.log('Enregistrement arrêté');
});
```

### Impossible d'enregistrer le fichier VIDÉO

Émis lorsqu'il y a une erreur.

#### Propriété

| Propriété | Type                 | Description                   |
| --------- | -------------------- | ----------------------------- |
| message   | chaîne de caractères | Le message d'erreur           |
| nom       | chaîne de caractères | Nom de l'erreur               |
| empilage  | chaîne de caractères | La trace de la pile d'erreurs |

#### Exemple

```
world.events.addListener(world.events.globalId, ecs.events.RECORDER_VIDEO_ERROR, (error) => {
    console.error('Enregistreur error:', error.message);
});
```

### Enregistrement_VIDÉO_PRÊT

Émis lorsque l'enregistrement est terminé et que la vidéo est prête.

#### Propriétés

| Propriété | Type     | Description              |
| --------- | -------- | ------------------------ |
| videoBlob | Amalgame | Le blob vidéo enregistré |

#### Exemple

```
world.events.addListener(world.events.globalId, ecs.events.RECORDER_VIDEO_READY, ({ videoBlob }) => {
    console.log('Vidéo prête:', videoBlob);
});
```

### Prévisualisation du dossier

Émis lorsqu'une prévisualisable, mais pas optimisée pour le partage, la vidéo est prête (Android/Bureau uniquement).

#### Propriétés

| Propriété | Type     | Description                  |
| --------- | -------- | ---------------------------- |
| videoBlob | Amalgame | Le blob de la vidéo d'aperçu |

#### Exemple

```
world.events.addListener(world.events.globalId, ecs.events.RECORDER_PREVIEW_READY, ({ videoBlob }) => {
    console.log('Preview ready:', videoBlob);
});
```

### Progression de l'enregistrement

Émis lorsque l’enregistreur de médias fait des progrès dans l’exportation finale (Android/Bureau uniquement).

#### Propriété

| Propriété  | Type | Description                                               |
| ---------- | ---- | --------------------------------------------------------- |
| avancement | id   | Progression de la finalisation (0 à 1) |

#### Exemple

```
world.events.addListener(world.events.globalId, ecs.events.RECORDER_FINALIZE_PROGRESS, ({ progress }) => {
    console.log(`Finaliser la progression : ${progress * 100}%`);
});
```

### Le cadre de suivi de l'enregistrement est un cadre

#### Propriété

| Propriété  | Type               | Description                                     |
| ---------- | ------------------ | ----------------------------------------------- |
| cadre      | Données de l'image | La trame vidéo traitée                          |
| horodatage | id                 | L'horodatage de l'image (ms) |

#### Exemple

```
world.events.addListener(world.events.globalId, ecs.events.RECORDER_PROCESS_FRAME, ({ frame, timestamp }) => {
    console.log(`Cadre traité à ${timestamp}ms`, frame);
});
```
