---
id: invalid-timestamps-detected
---

# Ungültige Zeitstempel entdeckt

#### Ausgabe {#issue}

Auf iOS-Geräten zeigen die Konsolenprotokolle eine Warnung an, die lautet: "webvr-polyfill: Ungültige Zeitstempel erkannt: Zeitstempel von devicemotion außerhalb des erwarteten Bereichs".

#### Auflösung {#resolution}

Keine Maßnahmen erforderlich.

Dies ist eine **Warnung**, die von `webvr-polyfill` kommt, einer Abhängigkeit von der AFrame/8Frame-Bibliothek. Devicemotion ist ein Ereignis, das vom Browser kommt und in regelmäßigen Abständen ausgelöst wird. Sie gibt an, wie stark die physikalische Kraft der Beschleunigung ist, die das Gerät zu diesem Zeitpunkt erfährt. Diese "Ungültiger Zeitstempel"-Meldungen sind ein Nebenprodukt der iOS-Implementierung von Devicemotion, bei der Zeitstempel manchmal in falscher Reihenfolge gemeldet werden.

Dies ist lediglich eine **Warnung**, kein Fehler, und kann getrost ignoriert werden. Sie hat keine Auswirkungen auf Ihr Web AR-Erlebnis.
