---
id: device-not-authorized
---

# Gerät nicht autorisiert

Problem: Wenn ich versuche, meine Web-App anzuzeigen, erhalte ich die Fehlermeldung "Gerät nicht autorisiert".

#### Safari-spezifisch {#safari-specific}

Die Situation:

- Während Sie Ihr Projekt betrachten, sehen Sie die Warnmeldungen 'Gerät nicht autorisiert', **aber**
- [apps.8thwall.com/token](https://apps.8thwall.com/token) zeigt die korrekte Autorisierung an.

Wie kommt es dazu?

Safari verfügt über eine Funktion namens Intelligent Tracking Prevention, mit der Cookies von Drittanbietern (die wir verwenden, um Ihr Gerät zu autorisieren, während Sie sich entwickeln) blockiert werden können. Wenn sie blockiert werden, können wir Ihr Gerät nicht verifizieren.

Schritte zur Behebung:

1. Safari schließen
1. Deaktivieren Sie die Intelligent Tracking Prevention unter `Einstellungen>Safari>Cross-Site-Tracking verhindern`
1. Löschen Sie die Cookies von 8th Wall unter `Einstellungen>Safari>Erweitert>Webseitendaten>8thwall.com`
1. Von der Konsole aus neu autorisieren
1. Prüfen Sie Ihr Projekt
1. Falls nicht behoben: Löschen Sie alle Cookies unter `Einstellungen>Safari>Verlauf und Website-Daten löschen`
1. Von der Konsole aus neu autorisieren

#### Andernfalls {#otherwise}

Siehe [Ungültiger App-Schlüssel](/troubleshooting/invalid-app-key) Schritte ab #5 zur weiteren Fehlerbehebung.
