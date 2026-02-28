# Studio-Ereignisse Referenz

Events sind ein zentraler Bestandteil des Aufbaus dynamischer und interaktiver Erlebnisse in Studio. In dieser Referenz werden die verschiedenen Arten von Ereignissen beschrieben, auf die Sie in Ihren Projekten achten können.

## Ereignis-Kategorien

- [XR Events](xr): Ereignisse, die von 8th Wall Kamera-Pipeline-Modulen wie `reality` und `facecontroller` ausgegeben werden und Dinge wie Image Target Tracking, VPS Location Spawning und Face Detection abdecken.

- [Asset-Ereignisse](assets): Ereignisse im Zusammenhang mit Assets, wie z. B. das Laden von Assets und Wiedergabeereignisse.

- [Kamera-Ereignisse](camera): Ereignisse, die sich auf Änderungen des Kamerazustands beziehen, einschließlich aktiver Kameraschalter, Änderungen von XR-Kameraattributen und Änderungen aktiver Kameraeinheiten.

- [Allgemeine Ereignisse](general): Grundlegende Ereignisse auf Weltebene, die innerhalb von Studio-Erlebnissen ausgelöst werden, wie z. B. ein aktiver Raumwechsel.

- [Eingabeereignisse](input): Ereignisse, die durch Benutzerinteraktionen ausgelöst werden, einschließlich Berührungs-, Gesten- und UI-Klick-Ereignisse. Deckt sowohl einfaches Antippen als auch komplexe Multi-Touch-Gesten ab.

- [Physikalische Ereignisse](physics): Ereignisse, die ausgesendet werden, wenn physikalische Interaktionen zwischen Entitäten stattfinden, z. B. wenn Kollisionen beginnen oder enden.

---

Jeder Ereignisabschnitt bietet:

- Eine Beschreibung des Zeitpunkts, zu dem das Ereignis ausgelöst wird
- Eigenschaften (falls vorhanden), die mit dem Ereignis übergeben werden
- Code-Beispiele, die zeigen, wie man auf das Ereignis global oder auf bestimmte Entitäten hört
