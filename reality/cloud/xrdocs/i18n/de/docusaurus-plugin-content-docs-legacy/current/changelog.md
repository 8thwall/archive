---
id: changelog
sidebar_position: 7
---

# Änderungsliste

#### Version 27.3: (2025-März-19, v27.3.1.427) {#whatsnew-release-27-2025-March-19-2731427}

- Korrekturen und Erweiterungen:
  - Verbesserte Lokalisierungsleistung an VPS-Standorten
  - Abstürze bei Ausrichtungsänderung und Kameraumschaltung behoben
  - Korrigierte flackernde Gesichtseffekte

#### Version 27.2: (2024-Dezember-04, v27.2.6.427 / 2024-November-04, v27.2.5.427 / 2024-Oktober-23, v27.2.4.427) {#release-27-2024-october-23-2724427}

- Neue Funktionen:
  - VPS-Kompatibilität für 8th Wall Studio-Projekte hinzugefügt.

- Korrekturen und Erweiterungen:
  - Es wurde ein Problem behoben, das die Zuverlässigkeit des Simulators in VPS-Projekten beeinträchtigte. (27.2.5.427)
  - Verbesserte Zuverlässigkeit der Kamera-Pipeline-Initialisierung für verbesserte AR-Erlebnisse. (27.2.6.427)

#### Version 27.1: (2024-Oktober-03, v27.1.9.427 / 2024-Oktober-01, v27.1.6.427) {#release-27-1-2024-october-01-v2716427}

- Korrekturen und Erweiterungen:
  - Verbesserte Lokalisierungs- und Verfolgungsqualität an VPS-Standorten, wodurch die Stabilität
    und die Genauigkeit der VPS-AR-Erlebnisse erheblich verbessert wurden.
  - Optimierte SLAM-Relokalisierung und -Verfolgung.
  - Ein Problem wurde behoben, bei dem sich die Welteffektkamera zu Beginn der Laufzeit in Studio teleportieren konnte.
  - Behebung eines Problems, das die Stabilität der VPS-Verfolgung beeinträchtigte, um die Gesamtleistung zu verbessern. (27.1.9.427)
  - Die verbesserte SLAM-Relokalisierung bringt AR-Inhalte schneller an die richtige Position zurück. (27.1.9.427)

#### Version 27: (2024-Sept-12, v27.0.4.427 / 2024-August-01, v27.0.2.427) {#release-27-2024-august-01-v2702427}

- Korrekturen und Erweiterungen:
  - Ein Problem beim Wechsel zwischen Welteffekten und Gesichtseffekten wurde behoben.
  - Verbesserte Synchronisierung der XR-Kamera mit Szenen in Studio.
  - Optimierte Protokollierung für verbesserte Leistung und saubere Ausgabe.

#### Version 26: (2024-Juni-18, v26.0.6.150) {#release-26-2024-june-18-v2606150}

- Neue Funktionen:
  - Unterstützung für Face Effects und World Tracking in 8th Wall Studio hinzugefügt.

- Korrekturen und Erweiterungen:
  - Es wurde ein Problem mit einigen A-Frame-Projekten behoben, das zu unerwartetem Verhalten führen konnte.

#### Version 25: (2024-Mai-28, v25.0.1.2384) {#release-25-2024-may-28-v25012384}

- Neue Funktionen:
  - Die XR-Engine wurde so aktualisiert, dass sie als funktionsspezifische Komponenten heruntergeladen werden kann und nicht mehr als ein großes Paket.

#### Version 24.1: (2024-März-28, v24.1.10.2165 / 2024-Februar-29, v24.1.5.2165 / 2024-Februar-13, v24.1.2.2165 / 2024-Januar-25, v24.1.1.2165) {#release-241-2024-march-28-v241102165--2024-february-29-v24152165--2024-february-13-v24122165--2024-january-25-v24112165}

- Neue Funktionen:
  - 8Frame wurde aktualisiert, um A-Frame 1.5.0 zu unterstützen.
  - Metaversal Deployment Unterstützung für Magic Leap 2 1.5.0 Betriebssystem Update hinzugefügt.
  - Das Hand-Tracking wurde aktualisiert und unterstützt nun UVs für die linke und rechte Hand, so dass Sie problemlos Designs auf einem Hand-Mesh zeichnen können.
  - Unterstützung für Himmelseffekte zum 8th Wall Simulator hinzugefügt. (24.1.2.2165)
  - Dem Hand-Tracking wurden vier neue Befestigungspunkte für das Handgelenk hinzugefügt. (24.1.5.2165)
  - Metaversal Deployment wurde aktualisiert, um Virtual Reality im Browser auf Apple Vision Pro zu unterstützen. (24.1.10.2165)

- Korrekturen und Erweiterungen:
  - Verbesserte Leistung von Sky Effects-Erlebnissen.
  - Die Stabilität der Handgelenksverfolgung wurde verbessert. (24.1.5.2165)

- XRExtras Erweiterungen:
  - Der Parameter `uv-orientation` wurde zu `xrextras-hand-mesh` hinzugefügt, um die neue Hand-UV-Funktionalität zu unterstützen.
  - Ein Problem mit MediaRecorder unter iOS 17.4 wurde behoben. (24.1.10.2165)

#### Version 24: (2023-November-29, v24.0.10.2165 / 2023-November-16, v24.0.9.2165 / 2023-November-01, v24.0.8.2165) {#release-24-2023-november-29-v240102165--2023-november-16-v24092165--2023-november-01-v24082165}

- Neue Funktionen:
  - Es wurden drei neue Ohranbringungspunkte für Gesichtseffekte hinzugefügt, mit denen Sie AR-Inhalte an verschiedenen Punkten an den Ohren anbringen können.
  - Aktualisiertes Hand-Tracking, um Hand-UVs freizulegen, so dass Sie einfach Designs auf einem Hand-Mesh zeichnen können
  - Verbessertes Metaversal Deployment zur Unterstützung von 8th Wall Erfahrungen auf dem Magic Leap 2.
  - Die PlayCanvas-Integration wurde aktualisiert, um drei neue Ohranlegepunkte für Gesichtseffekte zu unterstützen. (24.0.9.2165)

- Korrekturen und Erweiterungen:
  - Einige PlayCanvas-Warnungen wurden bereinigt (24.0.10.2165)

- XRExtras Erweiterungen:
  - Aktualisierte AFrame-Komponenten für einfache Face Effects mit neuen Ohrbefestigungspunkten

#### Version 23: (2023-August-24, v23.1.1.2275 / 2023-August-09, v23.0.12.2275 /2023-Juli-28, v23.0.7.2275 / 2023-Juli-25, v23.0.4.2275) {#release-23-2023-august-24-v23112275--2023-august-09-v230122275-2023-july-28-v23072275--2023-july-25-v23042275}

- Neue Funktionen:
  - Einführung von Hand Tracking - nutzen Sie Hände, Handgelenke und Finger als interaktive Leinwand für immersive WebAR-Erlebnisse.
    - Befestigen Sie 3D-Objekte an den branchenweit führenden 36 Handbefestigungspunkten.
    - Verwenden Sie das adaptive Handmesh der 8th Wall-Engine, um die Größe und das Volumen einer beliebigen Hand anzupassen.
    - Hand-Tracking-Coaching-Overlay-Modul hinzugefügt, um Benutzer durch einen Ablauf zu leiten, um sicherzustellen, dass ihre Hände im Blickfeld der Kamera sind.
  - Die PlayCanvas-Integration wurde aktualisiert, um Hand-Tracking zu unterstützen. (23.0.12.2275)
  - XrDevice.deviceInfo API hinzugefügt, um detaillierte Geräteinformationen abzufragen. (23.1.1.2275)

- Korrekturen und Erweiterungen:
  - Die verbesserte SLAM-Relokalisierung bringt AR-Inhalte nach einer Unterbrechung schneller und präziser wieder an die richtige Position.
  - Verbesserte Kameraauswahl auf Android-Geräten.
  - Bereinigung von Warnungen im Zusammenhang mit standardmäßigen xrhand-Parametern. (23.0.7.2275)
  - Ein Problem mit dem WebGL-Kontext auf MacOS-Geräten mit Safari wurde behoben. (23.0.12.2275)
  - Verbesserte SLAM-Verfolgung auf einer Vielzahl von Geräten. (23.1.1.2275)

- XRExtras Erweiterungen:
  - Neue A-Frame-Komponenten für die einfache Entwicklung von Handtracking.
  - Schatten-Shader im PlayCanvas behoben.

#### Version 22.1: (2023-Mai-15, v22.1.7.1958 / 2023-Mai-03, v22.1.2.1958) {#release-221-2023-may-15-v22171958--2023-may-03-v22121958}

- Neue Funktionen:
  - Unterstützung für mehrere Gesichter bei Gesichtseffekten, so dass Sie bis zu drei Gesichter gleichzeitig in einem einzigen Erlebnis verbessern können.
  - Die Gesichtseffekte wurden aktualisiert und unterstützen nun sowohl Standard- als auch projizierte UVs, so dass Sie Gesichtseffekt-Designs einfach auf einem projizierten Gesichtsnetz zeichnen können.

- Korrekturen und Erweiterungen:
  - Ein Problem mit der Geräteausrichtung auf iOS 16.4-Geräten wurde behoben.
  - Ein Leistungsproblem wurde behoben, das bei der Verwendung eines Controllers auf einem Meta Quest-Gerät auftreten konnte.
  - Verbesserte Leistung von three.js Erlebnissen auf Headsets. (22.1.7.1958)

- XRExtras Erweiterungen:
  - Parameter `face-id` zu `xrextras-faceanchor` hinzugefügt, um die neue Multi-Face-Funktionalität zu unterstützen. (22.1.7.1958)

#### Version 22: (2023-April-20, v22.0.4.1958) {#release-22-2023-april-20-v22041958}

- Neue Funktionen:
  - Die 8. Wand-Engine stellt die komplett überarbeiteten Gesichtseffekte vor:
    - Verbesserte Tracking-Qualität und Stabilität für:
      - Augenbrauenbereich
      - Eye Tracking
      - Mouth Tracking
    - Die Möglichkeit der Irisverfolgung wurde hinzugefügt:
      - API zur Schätzung des Augenabstandes (InterPupillary Distance, IPD) hinzugefügt
    - Entwicklerfreundliche Echtzeit-Gesichtsereignisse wurden hinzugefügt:
      - Hochgezogene/abgesenkte Augenbrauen
      - Mund offen/geschlossen
      - Auge Offen/Geschlossen
    - Aktiviert neue Gesichtsmorphing-Effekte, indem die UV-Positionen von Gesichtspunkten im Kamerabild angezeigt werden.
    - Die Höhe des Kopfnetzes wurde erhöht, um Effekte zu ermöglichen, die bis zum Haaransatz reichen.

- Korrekturen und Erweiterungen:
  - Die Geschwindigkeit der Himmelserkennung für die Erfahrungen von Sky Effect wurde verbessert.

#### Version 21.4: (2023-April-07, v21.4.7.997 / 2023-März-27, v21.4.6.997) {#release-214-2023-april-07-v2147997--2023-march-27-v2146997}

- Neue Funktionen:
  - Sky Effects + World Tracking - Erstellen Sie immersive Erlebnisse, die den Himmel und den Boden in einem Projekt zusammenführen:
    - Zusätzliche Fähigkeit zur gleichzeitigen Verfolgung interaktiver 3D-Inhalte am Himmel und auf Oberflächen über SLAM.
    - Es wurde die Möglichkeit hinzugefügt, AR-Inhalte von der Himmelsebene auf den Boden und vom Boden in den Himmel zu verschieben.
  - Die PlayCanvas-Integration wurde aktualisiert und unterstützt nun Himmelseffekte sowie Sky + World Tracking.
  - Verbesserte PlayCanvas-Integration mit einer neuen vereinheitlichten run() & stop() API, die die runXr() & stopXr() API ersetzt.
  - Es wurde eine neue xrconfig-API hinzugefügt, die die Konfiguration der verschiedenen XR-Komponenten, die Ihr Projekt verwendet, erleichtert.

- Korrekturen und Erweiterungen:
  - Ein Problem mit der Erkennung des Himmels am Rand des Kamerarahmens bei einigen Himmelseffekten wurde behoben.
  - Ein Problem mit der xrlayerscene-Komponente bei der Verwendung in selbst gehosteten Projekten wurde behoben.
  - Ein Problem mit der Geräteausrichtung auf iOS 16.4-Geräten wurde behoben (21.4.7.997)

#### Version 21.3: (2023-März-17, v21.3.8.997) {#release-213--2023-march-17-v2138997}

- Neue Funktionen:
  - Es wurden Steuerelemente für die Kantenglättung (edgeSmoothness) für Himmelseffekte hinzugefügt, mit denen Sie das Aussehen und die Intensität der Grenzen zwischen virtuellen und realen Inhalten im Himmel fein abstimmen können.
  - Es wurde Unterstützung für kameragesperrte Himmelseffekte in three.js hinzugefügt, sodass du dem Himmel in deinen three.js Projekten Inhalte hinzufügen kannst, die immer im Blickfeld der Kamera sind.
  - 8Frame wurde aktualisiert, um A-Frame 1.4.1 zu unterstützen.
  - Metaversal Deployment wurde aktualisiert, um die Raumeinrichtung im Meta Quest Browser zu unterstützen.

- Korrekturen und Erweiterungen:
  - Verbesserte Leistung und visuelle Qualität der Sky Effects-Erlebnisse.
  - Es wurde die Möglichkeit hinzugefügt, anzugeben, welche VPS-Projektstandorte lokalisiert werden sollen. Dies kann dazu beitragen, die VPS-Lokalisierungszeiten zu verbessern, wenn es viele Standorte in der Nähe gibt.
  - Ein Problem wurde behoben, bei dem das Öffnen von PlayCanvas-Erlebnissen auf dem Desktop zu einem Absturz führen konnte.

#### Version 21.2: (2022-Dezember-16, v21.2.2.997 / 2022-Dezember-13, v21.2.1.997) {#release-212--2022-december-16-v2122997--2022-december-13-v2121997}

- Neue Funktionen:
  - Einführung von Sky Effects - ein großes Update der 8th Wall Engine, das die Segmentierung des Himmels ermöglicht:
    - Es wurde die Möglichkeit hinzugefügt, interaktive 3D-Inhalte in den Himmel zu platzieren.
    - Es wurde die Möglichkeit hinzugefügt, die Himmelsmaske durch Bilder oder Videos zu ersetzen.
    - Es wurde ein Sky Coaching Overlay-Modul hinzugefügt, das die Benutzer durch einen Ablauf führt, um sicherzustellen, dass sie ihr Gerät auf den Himmel ausrichten.

- Korrekturen und Erweiterungen:
  - Verbesserte Verfolgungsqualität an VPS-Standorten.
  - Ein AFrame Sky Effects-Pixelproblem wurde behoben, das bei einigen Handys auftrat. (21.2.2.997)

- XRExtras Erweiterungen:
  - Der MediaRecorder wurde erweitert, um eine weitere Methode zum Zeichnen von 2D-Elementen auf der aufgezeichneten Leinwand hinzuzufügen.
  - Behobene Schattenwiedergabe in PlayCanvas v1.55+
  - Verbesserte Leistung von Image Target A-Frame Primitiven.

#### Version 20.3: (2022-November-22, v20.3.3.684) {#release-203--2022-november-22-v2033684}

- Neue Funktionen:
  - Metaversal Deployment wurde aktualisiert, um Mixed Reality im Meta Quest Browser zu unterstützen.
    - Die 8th Wall World Effects-Erlebnisse nutzen automatisch den Video-Passthrough AR auf Meta Quest Pro und Meta Quest 2, wenn sie im Browser aufgerufen werden.

- Korrekturen und Erweiterungen:
  - Optimierte Lokalisierung an VPS-Standorten
  - Verbesserte Verfolgungsqualität an VPS-Standorten durch Verwendung des ausgewählten Netzes jedes Projektstandorts.
  - Verbesserte Erfahrung für einige Android-Geräte mit mehreren Kameras.

#### Version 20: (2022-Oktober-05, v20.1.20.684 / 2022-September-21, v20.1.19.684 / 2022-September-21, v20.1.17.684) {#release-20--2022-october-05-v20120684--2022-september-21-v20119684--2022-september-21-v20117684}

- Neue Funktionen:
  - Lightship VPS für das Web - Erstellen Sie ortsbezogene WebAR-Erlebnisse, indem Sie AR-Inhalte mit realen Orten verbinden.
    - Der neue Geospatial Browser wurde dem 8th Wall Developer Portal hinzugefügt.
      - Finden, erstellen und verwalten Sie VPS-aktivierte Standorte.
      - Generieren Sie 3D-Meshes und laden Sie sie herunter, um sie als Okkluder, Physikobjekte oder als Referenz für die Erstellung ortsabhängiger Animationen zu verwenden.
    - Parameter `enableVps` zu XR8.XrController.configure() und xrweb hinzugefügt.
    - Es wurden Ereignisse hinzugefügt, wenn ein Ort zum Scannen bereit, gefunden oder verloren ist.
    - Es wurde die Möglichkeit hinzugefügt, die Rohnetzgeometrie von Standorten zu finden und darauf zuzugreifen.
    - XR8.Vps.makeWayspotWatcher" und "XR8.Vps.projectWayspots" APIs wurden hinzugefügt, um nahegelegene aktivierte VPS-Standorte und Projektstandorte abzufragen.
    - Das Lightship VPS Coaching Overlay Modul wurde hinzugefügt, um Benutzer durch einen Ablauf zur Lokalisierung an realen Orten zu führen.
    - XR8.Platform API hinzugefügt, um neue 8th Wall Plattform Features wie Lightship VPS und Niantic Lightship Maps freizuschalten.
  - Niantic Lightship Kartenmodul
    - Fügen Sie Ihrem Projekt auf 8thwall.com das Modul lightship-maps hinzu, um eine Vielzahl von ortsbezogenen Erlebnissen zu schaffen.

- Korrekturen und Erweiterungen:
  - Verbesserte Fehlerbehandlung für VPS-Netzwerkanfragen (20.1.19.684)
  - Probleme mit einigen VPS-Netzwerkanfragen behoben (20.1.20.684)

#### Version 19.1: (2022-August-26, v19.1.6.390 / 2022-August-10, v19.1.2.390) {#release-191--2022-august-26-v1916390--2022-august-10-v1912390}

- Korrekturen und Erweiterungen:
  - Probleme mit der 8. Wand in WeChat auf iOS behoben.
  - Verbesserte anfängliche SLAM-Verfolgung für einige Android-Geräte (19.1.6.390)

#### Version 19: (2022-Mai-5, v19.0.16.390 / 2022-April-13, v19.0.14.390 / 2022-März-24, v19.0.8.390) {#release-19--2022-may-5-v19016390--2022-april-13-v19014390--2022-march-24-v1908390}

- Neue Funktionen:
  - Einführung des absoluten Maßstabs - ein großes Update für 8th Wall SLAM, das einen realistischen Maßstab in World Effects ermöglicht:
    - Es wurde die Möglichkeit hinzugefügt, die absolute Skalierung in World Effects-Projekten zu aktivieren.
    - Der Parameter scale wurde zu XR8.XrController.configure() hinzugefügt.
    - Das Modul "Coaching Overlay" wurde hinzugefügt, um die Benutzer durch einen Ablauf zu führen, der geeignete Daten für die Skalenabschätzung erzeugt.
  - 8Frame wurde aktualisiert, um A-Frame 1.3.0 zu unterstützen. (19.0.16.390)

- Korrekturen und Erweiterungen:
  - Verbesserte Leistung auf verschiedenen Geräten.
  - Verbesserte Erfahrung für einige Android-Geräte mit mehreren Kameras.
  - Die Leistung von Absolute Scale auf einigen iOS-Geräten wurde verbessert. (19.0.14.390)
  - Behebung der Huawei-Browser-Benutzermeldungen auf Huawei-Geräten. (19.0.14.390)

#### Version 18.2: (2022-März-09, v18.2.4.554 / 2022-Januar-14, v18.2.3.554 / 2022-January-13, v18.2.2.554) {#release-182--2022-march-09-v1824554--2022-january-14-v1823554--2022-january-13-v1822554}

- Korrekturen und Erweiterungen:
  - Ein Problem wurde behoben, bei dem Geräte mit iOS 13 nach dem Start einer XR8-Sitzung neu geladen werden konnten.
  - Ein Problem wurde behoben, bei dem der WebGL-Kontext nach vielen XR8-Sitzungen verloren gehen konnte.
  - Verbesserte Erfahrung für einige Android-Geräte mit mehreren Kameras.
  - Es wurde ein Problem behoben, bei dem das additive Blending die Kameraführung beeinträchtigen konnte.
  - Ein Problem mit transparenten Materialien wurde behoben. (18.2.3.554)
  - Ein Problem bei der Darstellung von three.js auf Geräten mit iOS 15.4 (18.2.4.554) wurde behoben.

#### Version 18.1: (2021-Dezember-02, v18.1.3.554) {#release-181--2021-december-02-v1813554}

- Korrekturen und Erweiterungen:
  - Ein Ladeproblem auf einigen iOS-Geräten beim Zugriff auf Inline AR-Projekte wurde behoben.
  - Ein Problem mit der Verweigerung von Browser-Eingaben auf einigen iOS-Geräten wurde behoben.
  - Ein Problem beim Drehen der Geräteausrichtung zwischen Hoch- und Querformat im SFSafariViewController wurde behoben.
  - Verbesserte Kompatibilität mit einigen Android-Geräten, die ein untypisches Seitenverhältnis der Kameraaufnahme haben.

#### Version 18: (2021-November-08, v18.0.6.554) {#release-18--2021-november-08-v1806554}

- Neue Funktionen:
  - Die komplett überarbeitete 8th Wall Engine mit Metaversal Deployment wird vorgestellt:
    - Pipeline-Modul-API für Sitzungsmanager hinzugefügt.
    - Web3D Sitzungsmanager hinzugefügt.
    - Headset-Sitzungsmanager für three.js und A-Frame hinzugefügt.
    - Aktualisierung von "allowedDevices" um "Handy und Headset".
    - Zusätzliche Sitzungskonfigurationsparameter in XR8.run() hinzugefügt.

- Korrekturen und Erweiterungen:
  - Verbesserte Bilderfassung mit einer Vielzahl von Pixel-Geräten.
  - Der iOS WKWebView Flow wurde aktualisiert, um Erfahrungen zu unterstützen, auf die über LinkedIn zugegriffen wird.

- XRextras:
  - xrextras-opaque-background A-Frame Komponente und XRExtras.Lifecycle.attachListener hinzugefügt.

#### Version 17.2: (2021-Oktober-26, v17.2.4.476) {#release-172--2021-october-26-v1724476}

- Korrekturen und Erweiterungen:
  - Verbesserte Qualität der SLAM-Kartenerstellung.
  - Optimierte Verfolgungsqualität von SLAM-Erfahrungen.
  - Die PlayCanvas-Integration wurde verbessert, um das Zeichnen auf demselben Canvas zu unterstützen, auf dem auch der Kamera-Feed gerendert wird.

#### Version 17.1: (2021-September-21, v17.1.3.476) {#release-171--2021-september-21-v1713476}

- Neue Funktionen:
  - Neue APIs hinzugefügt
    - API, um den Initialisierungsstatus des Motors abzufragen.
    - three.js-Kamera-Feed ist als THREE.Texture verfügbar.
    - Lebenszyklusmethode für die Entfernung von Pipeline-Modulen.

- Korrekturen und Erweiterungen:
  - Verbesserte Qualität der SLAM-Kartenerstellung.
  - Verbesserte Tracking-Qualität auf einer Vielzahl von Geräten.
  - Die Framerate von Welteffekten, Gesichtseffekten und Bildzielen auf Chromium-basierten und Firefox-Browsern wurde verbessert.
  - Die Videoqualität von MediaRecorder auf Android-Geräten wurde verbessert.

- XRExtras Erweiterungen:
  - Verbesserter MediaRecorder-Freigabefluss, wenn Web Share API Level 2 aktiviert ist.
  - Die Startzeit des Lademoduls wurde verbessert.
  - Verbesserte Lebenszyklusbehandlung für die Module Runtime Error, Almost There und Loading.
  - Das Modul Almost There wurde aktualisiert, um den Erfolg von QR-Code-Scans zu verbessern.
  - Verbesserte Logik für die Vollbildleinwand bei geteiltem iPad-Bildschirm.

#### Version 17: (2021-July-20, v17.0.5.476) {#release-17--2021-july-20-v1705476}

- Korrekturen und Erweiterungen:
  - Das verbesserte Tracking über dem Horizont steigert die Kartenqualität und verbessert die Leistung von WebAR-Erlebnissen, bei denen Nutzer ihr Telefon nach oben halten müssen, um AR-Inhalte vollständig zu erkunden.
  - Optimierte SLAM-Relokalisierung bringt AR-Inhalte nach einer Unterbrechung wieder an die richtige Position im Weltraum.
  - Verbesserte Verfolgungsqualität von SLAM-Erfahrungen, wenn Benutzer extreme Gierbewegungen machen.

- XRExtras Erweiterungen:
  - MediaRecorder wurde aktualisiert, um zur Medienvorschau zurückzukehren, wenn Benutzer die Schaltfläche "Ansicht" im iOS-Dialogfeld drücken, nachdem sie den Download von Medien ausgewählt haben.

#### Version 16.1: (2021-Juni-02, v16.1.4.1227) {#release-161--2021-june-02-v16141227}

- Korrekturen und Erweiterungen:
  - Verbesserte Wiederherstellung der Weltverfolgung nach einer Unterbrechung.
  - Verbessertes Lebenszyklus-Management von Ereignis-Listenern in A-Frame-Projekten.
  - Ein Problem mit WebGL 1-Fehlern auf einigen Android-Geräten wurde behoben.
  - Ein Problem wurde behoben, bei dem MediaRecorder gelegentlich keine Aufnahmevorschau anzeigte.
  - Ein Problem wurde behoben, bei dem das mehrfache Umschalten der Kamera zum Absturz führen konnte.
  - Verbesserte Kompatibilität bei der Verwendung von Leinwänden mit vordefinierten WebGL 2-Kontexten.

#### Version 16: (2021-Mai-21, v16.0.8.1227 / 2021-April-27, v16.0.6.1227 / 2021-April-22, v16.0.5.1227) {#release-16--2021-may-21-v16081227--2021-april-27-v16061227--2021-april-22-v16051227}

- Neue Funktionen:
  - Der brandneue 8th Wall MediaRecorder wird vorgestellt:
    - Verwendet W3C-konforme Aufzeichnungen, sofern verfügbar.
    - Optimiert die Leistung, um die Bildrate während der Aufnahme zu verbessern.
    - Verbesserungen der Bildqualität und der Bildrate bei der Aufnahme.

- Korrekturen und Erweiterungen:
  - Verbesserte Verfolgungsqualität und Bildrate von SLAM-Erfahrungen.
  - Verbesserte Tracking-Qualität und Bildrate von Image Target Erfahrungen.
  - Verbesserte Erfahrung für einige Android-Geräte mit mehreren Kameras.
  - Raycasting-Probleme mit PlayCanvas behoben.
  - SLAM-Verfolgungsproblem behoben (v16.0.8.1227)

- XRExtras Erweiterungen:
  - MediaRecorder wurde aktualisiert, um einen Fortschrittsbalken beim Transkodieren von Aufnahmen auf relevanten Geräten anzuzeigen.

#### Version 15.3: (2021-März-2, v15.3.3.487) {#release-153--2021-march-2-v1533487}

- Neue Funktionen:
  - 8Frame wurde aktualisiert, um A-Frame 1.2.0 zu unterstützen.

- Korrekturen und Erweiterungen:
  - Es gab ein Problem bei der Wiederaufnahme des Kamerafeeds in Safari, nachdem man zu einer 8. Wand-App zurück navigiert hatte.
  - Ein Problem bei der Wiederaufnahme der Kameraübertragung nach dem erneuten Öffnen eines WKWebViews wurde behoben
  - Verbesserte Kompatibilität mit verschiedenen Rendering-Engine-Versionen.
  - Optimierte iOS WKWebView-Flows für einige native Anwendungen.

#### Version 15.2: (2020-Dezember-14, v15.2.4.487) {#release-152--2020-december-14-v1524487}

- Neue Funktionen:
  - Unterstützung für WKWebView auf Geräten mit iOS 14.3 oder höher wurde hinzugefügt.
  - Ein Rechenkontext wurde für Pipeline-Module zugänglich gemacht, um das Offscreen-GPU-Computer-Vision zu beschleunigen.
  - 8Frame wurde aktualisiert, um A-Frame 1.1.0 zu unterstützen.

- Korrekturen und Erweiterungen:
  - Verbesserte Kompatibilität mit Rendering-Engines.
  - Es wurde die Möglichkeit hinzugefügt, Bildziele zu laden und zu entladen, während andere Bildziele verfolgt werden.
  - Ein Problem mit MediaRecorder im Zusammenhang mit der Umschaltung des Audiokontexts wurde behoben.
  - Verbesserte Erfahrung für einige Android-Geräte mit mehreren Kameras.
  - Ein Problem wurde behoben, bei dem WebGL-Fehler manchmal versteckt wurden.
  - Ein Problem bei der gleichzeitigen Verfolgung von flachen und gekrümmten Bildzielen wurde behoben.
  - Ein Problem beim Wechsel zwischen WebGL- und WebGL2-Pipelines wurde behoben.

- XRExtras Erweiterungen:
  - Verbesserte Abläufe für iOS WKWebView auf Geräten mit iOS 14.3 oder höher.
  - Ein Problem mit der Abtrennung der Stats-Modul-Pipeline wurde behoben.

#### Version 15.1: (2020-Oktober-27, v15.1.4.487) {#release-151--2020-october-27-v1514487}

- Neue Funktionen:
  - Unterstützung für gekrümmte Bildziele, die gleichzeitig mit SLAM verwendet werden können, wurde hinzugefügt.
  - Unterstützung für A-Frame 1.1.0-beta, THREE 120 und MRCS HoloVideoObject 1.2.5 hinzugefügt.

- Korrekturen und Erweiterungen:
  - Verbesserte Qualität der Verfolgung von Flachbildzielen gleichzeitig mit SLAM.
  - Verbesserte Framerate für Geräte mit iOS 14 oder höher.
  - Verbesserte Erfahrung für einige Android-Geräte mit mehreren Kameras. (v15.0.9.487)
  - Optimierte Leistung einiger GPU-Verarbeitungen.
  - Verbesserte PlayCanvas-Integration mit Unterstützung für den Wechsel zwischen XR- und FaceController-Kameras.
  - Ein Problem mit dem Mikrofonzugriff des MediaRecorders wurde behoben, bei dem onPause-Ereignisse den Mikrofoneingang nicht schlossen.
  - Ein Problem wurde behoben, bei dem MediaRecorder gelegentlich Dateien produzierte, die mit einigen Videoplayern nicht kompatibel waren.
  - Ein Raycasting-Problem mit AFrame 1.0.x wurde behoben. (v15.0.9.487)

- XRExtras Erweiterungen:
  - Das Modul XRExtras.PauseOnHidden() hält die Kameraübertragung an, wenn die Registerkarte Ihres Browsers ausgeblendet wird.

#### Version 15: (2020-Oktober-09, v15.0.9.487 / 2020-September-22, v15.0.8.487) {#release-15--2020-october-09-v1509487--2020-september-22-v1508487}

- Neue Funktionen:
  - 8. Wand Gebogene Bildziele:
    - Unterstützung für zylindrische Bildziele, wie z. B. um Flaschen, Dosen usw. gewickelt, wurde hinzugefügt.
    - Zusätzliche Unterstützung für konische Bildziele, wie z. B. um Kaffeetassen, Partyhüte, Lampenschirme und mehr gewickelt.

- Korrekturen und Erweiterungen:
  - Verbesserte Verfolgungsqualität für SLAM und Image Targets.
  - Es wurde ein Problem mit MRCS-Hologrammen und dem Geräte-Routing unter iOS 14 behoben.
  - Ein Problem mit Gesichtseffekten und Bildzielen wurde behoben, bei dem Aktualisierungen von mirroredDisplay während der Laufzeit nicht berücksichtigt wurden.
  - Verbesserte Erfahrung für einige Android-Geräte mit mehreren Kameras. (v15.0.9.487)
  - Ein Raycasting-Problem mit AFrame 1.0.x (v15.0.9.487) wurde behoben.

- XRExtras Erweiterungen:
  - Neue AFrame-Komponenten für die einfache Entwicklung von Curved Image Targets:
    - Vorgefertigte 3D-Container-Komponente, die einen portalartigen Container bildet, in dem 3D-Inhalte platziert werden können.
    - Vorgefertigte Komponente für die Videowiedergabe zur einfachen Aktivierung von Videos auf gekrümmten Bildzielen.
  - Verbesserte Erkennung von Web Share API Level 2 Unterstützung.

#### Version 14.2: (2020-July-30, v14.2.4.949) {#release-142--2020-july-30-v1424949}

- Neue Funktionen:
  - MediaRecorder.configure() wurde aktualisiert, um mehr Kontrolle über die Audioausgabe und das Mischen zu ermöglichen:
    - Geben Sie Ihren eigenen audioContext ein.
    - Abfrage von Mikrofonberechtigungen während der Einrichtung oder Laufzeit.
    - Optional können Sie die Mikrofonaufzeichnung deaktivieren.
    - Fügen Sie Ihre eigenen Audioknoten zum Audiographen hinzu.
    - Integrieren Sie den Ton der Szene in die Wiedergabe der Aufnahme.

- Korrekturen und Erweiterungen:
  - Ein Problem wurde behoben, bei dem Clipebenen in manchen Fällen nicht von PlayCanvas aus gesetzt wurden.
  - Unterstützung für das Umschalten zwischen Weltverfolgung, Bildzielverfolgung und Gesichtseffekten zur Laufzeit hinzugefügt.
  - Ein Problem wurde behoben, bei dem Scheitelpunktpuffer nach dem Löschen von Scheitelpunktanordnungen wiederhergestellt werden konnten.
  - Verbesserte Erfahrung für einige Android-Geräte mit mehreren Kameras.

#### Version 14.1: (2020-July-06, v14.1.4.949) {#release-141--2020-july-06-v1414949}

- Neue Funktionen:
  - Einführung der 8. Wand-Videoaufzeichnung:
    - Fügen Sie mit der neuen XR8.MediaRecorder API jedem 8th Wall Projekt eine In-Browser-Videoaufzeichnung hinzu.
    - Fügen Sie dynamische Overlays und Endkarten mit benutzerdefinierten Bildern und Handlungsaufforderungen hinzu.
    - Konfigurieren Sie die maximale Videodauer und Auflösung.
  - Mikrofon als konfigurierbare Modulberechtigung hinzugefügt.

- Korrekturen und Erweiterungen:
  - Verbesserte CanvasScreenshot-Funktionalität mit verbesserter Overlay-Unterstützung.
  - Es wurde ein Problem mit Gesichtseffekten behoben, das bei einer Änderung der Geräteausrichtung zu visuellen Störungen führen konnte.
  - Verbesserte Kompatibilität der Face Effects-Koordinaten für Rechtshänder mit Bablyon.js.
  - Verbesserte Kompatibilität der Grafikpipeline mit Babylon.js.

- XRExtras Erweiterungen:
  - Vorgefertigte Komponente der Aufnahmetaste für die Aufnahme von Videos und Fotos:
    - Wählen Sie zwischen Standard-, Festnetz- und Fotoaufnahme-Modus.
  - Vorgefertigte Vorschaukomponente für einfaches Vorschauen, Herunterladen und Weitergeben von Aufnahmen
  - Verwenden Sie XRExtras, um die Benutzerfreundlichkeit der Videoaufzeichnung in Ihrem Projekt auf einfache Weise anzupassen:
    - Konfigurieren Sie die maximale Videolänge und Auflösung.
    - Fügen Sie zu jedem Frame des Videos ein optionales Wasserzeichen hinzu.
    - Fügen Sie eine optionale Endkarte hinzu, um ein Branding und einen Aufruf zum Handeln am Ende des Videos hinzuzufügen.

#### Freigabe 14: (2020-Mai-26) {#release-14--2020-may-26}

- Neue Funktionen:
  - Wir stellen vor: 8th Wall Face Effects: Befestigen Sie 3D-Objekte an Gesichtspunkten und bemalen Sie Ihr Gesicht mit eigenen Materialien, Shadern oder Videos.
  - Selfie-Modus: Verwenden Sie die Frontkamera mit gespiegeltem Display, um das perfekte Selfie zu machen.
  - Desktop-Browser: Aktivieren Sie Ihre Bildziel- und Gesichtseffekt-Erfahrungen, um sie in Desktop-Browsern unter Verwendung der Webcam auszuführen.

- Korrekturen und Erweiterungen:
  - Verbessertes Aufnahme-Sichtfeld auf Pixel 4/4XL Telefonen.
  - Verbesserte Kameraprofile für bestimmte Telefonmodelle.
  - Ein Problem mit der Änderung der Geräteausrichtung während des Starts wurde behoben.
  - Ein Problem mit dem Wechsel der Kamerarichtung in der gleichen A-Szene wurde behoben.
  - Ein Problem wurde behoben, bei dem AFrame-Look-Controls beim Neustart der Szene nicht entfernt wurden.
  - Verbesserte Erfahrung für einige Android-Handys mit mehreren Kameras.
  - Weitere Korrekturen und Verbesserungen.

- XRExtras Erweiterungen:
  - Verbesserte fast dort fließt für Erfahrungen, die auf dem Desktop angezeigt werden können.
  - Das Modul PauseOnBlur hält die Kamera an, wenn Ihre Registerkarte nicht aktiv ist.
  - Neue AFrame-Komponenten für die einfache Entwicklung von Gesichtseffekten und Desktop-Erlebnissen.
  - Neue ThreeExtras zum Rendern von PBR-Materialien, Basismaterialien und Videos auf Flächen.

#### Version 13.2: (2020-Feb-13) {#release-132--2020-feb-13}

- Neue Funktionen:
  - Kamerastream bei XR8.pause() freigeben und bei XR8.resume() wieder öffnen.
  - API hinzugefügt, um auf das Shader-Programm zuzugreifen und die von GlTextureRenderer verwendeten Uniformen zu ändern.
  - API zur Konfiguration des WebGL-Kontextes bei der Ausführung hinzugefügt.

- Korrekturen und Erweiterungen:
  - Behebung des Problems mit schwarzen Videos unter iOS, wenn ein Benutzer lange auf ein Bild drückt.
  - Verbesserte Geschwindigkeit und Zuverlässigkeit bei der Aufnahme von iOS-Screenshots.
  - Die Darstellung des Alphakanals bei der Aufnahme eines Screenshots wurde korrigiert.
  - Verbesserte Erfahrung für einige Android-Handys mit mehreren Kameras.
  - Verbesserte Erkennung von Webansichten in sozialen Netzwerken.

- XRExtras Erweiterungen:
  - Verbesserte QR-Codes mit besserer Kompatibilität mit nativen Kameras.
  - Verbesserte Link-Out-Flows für soziale Netzwerke.
  - Verbesserte CSS-Anpassung.

#### Version 13.1 {#release-131}

- Neue Funktionen:
  - Verbesserte Framerate auf hochauflösenden Android-Telefonen.
  - Die Kamera-Pipeline kann angehalten und neu gestartet werden.
  - Kamera-Pipelinemodule können zur Laufzeit oder beim Anhalten entfernt werden.
  - Neue Lebenszyklus-Callbacks für das Anhängen und Lösen.

- Korrekturen und Erweiterungen:
  - Verbesserte Erfahrung für einige Android-Handys mit mehreren Kameras.
  - Die Kalibrierung des iOS-Telefons unter iOS 12.2 und höher wurde korrigiert.

#### Release 13 {#release-13}

- Neue Funktionen:
  - Unterstützung für die cloudbasierte Erstellung, Zusammenarbeit, Veröffentlichung und das Hosting von WebAR-Inhalten.

#### Version 12.1 {#release-121}

- Korrekturen und Erweiterungen:
  - Erhöhte Kameraauflösung auf neueren iOS-Geräten.
  - Erhöhte AFrame-Geschwindigkeit auf hochauflösenden Android-Geräten.
  - Probleme mit dem Raycasting in three.js r103+ behoben.
  - Unterstützung für iPadOS hinzugefügt.
  - Speicherproblem beim wiederholten Laden vieler Bildziele behoben.
  - Kleinere Leistungsverbesserungen und Fehlerbehebungen.

#### Release 12 {#release-12}

- Neue Funktionen:
  - Das Limit für das Hochladen von Bildzielen wurde auf 1000 Bildziele pro Anwendung erhöht.
  - Neue API für die Auswahl aktiver Bildziele zur Laufzeit.
  - Apps können jetzt nach bis zu 10 Bildzielen gleichzeitig scannen.
  - Die nach vorne gerichtete Kamera wird vom Kameraframework und den Bildzielen unterstützt.
  - Engine-Unterstützung für PlayCanvas.

- Korrekturen:
  - Verbesserte Erfahrung für einige Android-Handys mit mehreren Kameras.

- XRExtras:
  - Verbesserte visuelle Qualität auf Android-Telefonen.
  - Unterstützung für iOS 13 Geräteausrichtungsberechtigungen.
  - Bessere Fehlerbehandlung für fehlende Web-Assemblys auf einigen älteren iOS-Versionen.
  - Unterstützung für PlayCanvas.

#### Version 11.2 {#release-112}

- Neue Funktionen:
  - iOS 13 unterstützt Bewegungen.

#### Version 11.1 {#release-111}

- Korrekturen und Erweiterungen:
  - Geringere Speichernutzung.
  - Verbesserte Tracking-Leistung.
  - Verbesserte Erkennung von Browser-Funktionen.

#### Release 11 {#release-11}

- Neue Funktionen:
  - Unterstützung für Image Targets hinzugefügt.
  - Unterstützung für BabylonJS hinzugefügt.
  - Die JS-Binärgröße wurde auf 1 MB reduziert.
  - Unterstützung für 8th Wall Web innerhalb eines herkunftsübergreifenden Iframe hinzugefügt.
  - Kleinere API-Ergänzungen.

#### Version 10.1 {#release-101}

- Neue Funktionen:
  - Unterstützung für A-Frame 0.9.0 hinzugefügt.

- Korrekturen:
  - Fehler bei der Übergabe von includedTypes an XrController.hitTest() behoben.
  - Geringerer Speicherbedarf bei der Verfolgung über größere Entfernungen.

#### Release 10 {#release-10}

Release 10 bietet eine überarbeitete Konsole für Webentwickler mit einem optimierten Entwicklermodus, Zugriff auf zulässige Ursprünge und QR-Codes. Es fügt 8th Wall Web-Unterstützung für XRExtras hinzu, ein Open-Source-Paket für Fehlerbehandlung, Ladevisualisierungen, "fast fertig"-Abläufe und mehr.

- Neue Funktionen:
  - Neu gestaltete Konsole für Webentwickler.
  - XR Extras bietet eine praktische Lösung für:
    - Ladebildschirme und Abfrage von Kamerarechten.
    - Umleitung von Nutzern von nicht unterstützten Geräten oder Browsern ("fast fertig").
    - Laufzeitfehlerbehandlung.
    - Zeichnen eines bildschirmfüllenden Kamerafeeds in Low-Level-Frameworks wie three.js.
  - Öffentliche Beleuchtungs- und Hit-Test-Schnittstellen zu XrController hinzugefügt.
  - Andere kleinere API-Ergänzungen.

- Korrekturen:
  - Die Startgeschwindigkeit der Anwendung wurde verbessert.
  - Es wurde ein Framework-Problem behoben, bei dem Fehler beim Starten nicht weitergegeben wurden.
  - Es wurde ein Problem behoben, das während der Initialisierung mit WebGL auftreten konnte.
  - Verwenden Sie die Schnittstelle window.screen für die Geräteausrichtung, falls vorhanden.
  - Ein Problem in three.js wurde behoben, das bei der Größenänderung der Leinwand auftreten konnte.

#### Version 9.3 {#release-93}

- Neue Funktionen:
  - Kleinere API-Ergänzungen: XR.addCameraPipelineModules() und XR.FullWindowCanvas.pipelineModule()

#### Version 9.2 {#release-92}

- Neue Funktionen:
  - Öffentlich zugängliche Dokumentation: https://docs.8thwall.com/web

#### Version 9.1 {#release-91}

- Neue Funktionen:
  - Unterstützung für Amazon Sumerian in 8th Wall Web hinzugefügt
  - Verbesserte Tracking-Stabilität und kein Jitter

#### Release 9 {#release-9}

- Erste Veröffentlichung von 8th Wall Web!
