---
id: native-app-export
description: 'In diesem Abschnitt wird erklärt, wie Sie den Native App Export verwenden.'
---

# Export von nativen Anwendungen

:::info[Beta Merkmal]
Native App Export befindet sich derzeit in der Beta-Phase und ist auf **Android & iOS** Builds beschränkt. Unterstützung für Desktops und Headsets folgt in Kürze.
:::

Native App Export ermöglicht es Ihnen, Ihr Studio-Projekt als eigenständige Anwendung zu verpacken.

## Anforderungen {#requirements}

Unabhängig davon, ob Sie Ihr Projekt für iOS oder Android erstellen, stellen Sie sicher, dass es mindestens einmal erfolgreich für das Web erstellt wurde, bevor Sie versuchen, es zu exportieren.

### iOS

Nativer Export für iOS ist für AR- und 3D-Projekte verfügbar. Ihre Anwendung wird **nicht** unterstützt:

- Push-Benachrichtigungen
- In-App-Käufe

### Android

Der native Export für Android ist nur für reine 3D-Projekte verfügbar, die nicht in AR erstellt wurden. Ihr Projekt **darf** nicht verwenden:

- Kamera- oder AR-Funktionen
- GPS
- Virtuelle oder physische Tastaturen
- Push-Benachrichtigungen
- In-App-Käufe
- Video-Texturen
- MediaRecorder API
- CSS
