---
id: device-not-authorized
---

# Gerät nicht autorisiert

Problem: Wenn ich versuche, meine Web-App anzuzeigen, erhalte ich die Fehlermeldung "Gerät nicht autorisiert".

#### Safari-spezifisch {#safari-specific}

Die Situation:

- Während Sie Ihr Projekt betrachten, sehen Sie die Warnung "Gerät nicht autorisiert", **aber**
- [apps.8thwall.com/token] (https://apps.8thwall.com/token) zeigt die korrekte Berechtigung an.

Warum ist das so?

Safari verfügt über eine Funktion namens Intelligente Tracking-Verhinderung, mit der Cookies von Drittanbietern blockiert werden können (die wir verwenden, um Ihr Gerät zu autorisieren, während Sie sich entwickeln). Wenn sie blockiert werden, können wir Ihr Gerät nicht verifizieren.

Schritte zur Behebung:

1. Safari schließen
2. Deaktivieren Sie die intelligente Tracking-Verhinderung unter "Einstellungen>Safari>Cross-Site-Tracking verhindern".
3. Löschen Sie die Cookies von 8th Wall unter `Einstellungen>Safari>Erweitert>Webseitendaten>8thwall.com`.
4. Von der Konsole aus neu autorisieren
5. Prüfen Sie Ihr Projekt
6. Falls nicht behoben: Löschen Sie alle Cookies unter `Einstellungen>Safari>Verlauf und Websitedaten löschen`.
7. Von der Konsole aus neu autorisieren

#### Ansonsten {#otherwise}

Siehe [Ungültiger App-Schlüssel](/legacy/troubleshooting/invalid-app-key) Schritte ab #5 für weitere Fehlersuche.
