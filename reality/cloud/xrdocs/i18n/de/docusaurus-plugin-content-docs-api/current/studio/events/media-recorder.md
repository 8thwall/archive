---
id: media-recorder
---

# Media Recorder Ereignisse

## Beschreibung

Mit diesem Media Recorder können Sie zur Laufzeit Screenshots und Videos Ihres Studio-Projekts aufnehmen.

## Veranstaltungen

### READY_READY

Wird ausgelöst wenn ein Screenshot fertig ist.

#### Eigenschaften

| Eigentum | Art    | Beschreibung                       |
| -------- | ------ | ---------------------------------- |
| klecks   | Klecks | Der JPEG-Bild-Blob des Screenshots |

#### Beispiel

```
world.events.addListener(world.events.globalId, ecs.events.RECORDER_SCREENSHOT_READY, (e) => {
    const blob = e.data;
    console.log('Screenshot blob:', blob);
});
```

### VIDEO_START

Wird ausgelöst, wenn die Aufnahme gestartet wurde.

#### Eigenschaften

Keine.

#### Beispiel

```
world.events.addListener(world.events.globalId, ecs.events.RECORDER_VIDEO_STARTED, () => {
    console.log('Aufnahme started');
});
```

### RECORDER_VIDEO_LABEL

Wird ausgelöst wenn die Aufnahme beendet ist.

#### Eigenschaften

Keine.

#### Beispiel

```
world.events.addListener(world.events.globalId, ecs.events.RECORDER_VIDEO_STOPPED, () => {
    console.log('Aufnahme stopped');
});
```

### Aufzeichnungsfehler

Wird ausgeführt, wenn ein Fehler vorliegt.

#### Eigenschaft

| Eigenschaft | Typ    | Beschreibung          |
| ----------- | ------ | --------------------- |
| nachricht   | String | Die Fehlermeldung     |
| Name        | String | Der Fehlername        |
| stapeln     | String | Die Fehlerstack-Trace |

#### Beispiel

```
world.events.addListener(world.events.globalId, ecs.events.RECORDER_VIDEO_ERROR, (error) => {
    console.error('Recorder error:', error.message);
});
```

### READY_LABEL

Wird ausgeführt, wenn die Aufnahme abgeschlossen ist und das Video fertig ist.

#### Eigenschaften

| Eigentum  | Typ    | Beschreibung                  |
| --------- | ------ | ----------------------------- |
| videoBlob | Klecks | Der aufgezeichnete Video-Blob |

#### Beispiel

```
world.events.addListener(world.events.globalId, ecs.events.RECORDER_VIDEO_READY, ({ videoBlob }) => {
    console.log('Video ready:', videoBlob);
});
```

### READY_READY

Emitted when a previewable, but not sharing-optimed, video is ready (nur Android/Desktop).

#### Eigenschaften

| Eigentum  | Typ    | Beschreibung           |
| --------- | ------ | ---------------------- |
| videoBlob | Klecks | Das Vorschauvideo Blob |

#### Beispiel

```
world.events.addListener(world.events.globalId, ecs.events.RECORDER_PREVIEW_READY, ({ videoBlob }) => {
    console.log('Vorschau ready:', videoBlob);
});
```

### Rekorder_Finalis_PROGRESS

Wird ausgelöst wenn der Medienrecorder Fortschritte im endgültigen Export macht (nur Android/Desktop).

#### Eigenschaften

| Eigenschaft | Typ    | Beschreibung                                            |
| ----------- | ------ | ------------------------------------------------------- |
| fortschritt | Nummer | Fertigstellungsfortschritt (0 bis 1) |

#### Beispiel

```
world.events.addListener(world.events.globalId, ecs.events.RECORDER_FINALIZE_PROGRESS, ({ progress }) => {
    console.log(`Fortschritt abschließen * 100}%`);
});
```

### Rekorder_PROCESS_FRAME

#### Eigenschaft

| Eigenschaft | Typ       | Beschreibung                                       |
| ----------- | --------- | -------------------------------------------------- |
| Rahmen      | Bilddaten | Der bearbeitete Video-Frame                        |
| Zeitstempel | Nummer    | Der Zeitstempel des Frames (ms) |

#### Beispiel

```
world.events.addListener(world.events.globalId, ecs.events.RECORDER_PROCESS_FRAME, ({ frame, timestamp }) => {
    console.log(`Processed frame at ${timestamp}ms`, frame);
});
```
