---
id: invalid-timestamps-detected
---

# Ungültige Zeitstempel entdeckt

#### Ausgabe {#issue}

Auf iOS-Geräten zeigen die Konsolenprotokolle eine Warnung an, die lautet: `webvr-polyfill: Ungültige Zeitstempel erkannt: Zeitstempel von devicemotion außerhalb des erwarteten Bereichs.`

#### Auflösung {#resolution}

Keine Aktion erforderlich.

Dies ist eine **Warnung** von `webvr-polyfill`, einer Abhängigkeit von der AFrame/8Frame Bibliothek. Devicemotion ist ein Ereignis, das vom Browser kommt und in regelmäßigen Abständen ausgelöst wird. Sie zeigt an, wie stark die physikalische Kraft der Beschleunigung ist, die das Gerät zu diesem Zeitpunkt erhält. Diese "Ungültiger Zeitstempel"-Meldungen sind ein Nebenprodukt der iOS-Implementierung von Devicemotion, bei der Zeitstempel manchmal in falscher Reihenfolge gemeldet werden.

Dies ist lediglich eine **Warnung**, kein Fehler, und kann getrost ignoriert werden. Es hat keinen Einfluss auf Ihr WebAR-Erlebnis.
