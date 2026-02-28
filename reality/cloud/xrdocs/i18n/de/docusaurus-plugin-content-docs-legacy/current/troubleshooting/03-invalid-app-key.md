---
id: invalid-app-key
---

# Ungültiger App-Schlüssel

Problem: Wenn ich versuche, meine Webanwendung anzuzeigen, erhalte ich die Fehlermeldung **"Ungültiger Anwendungsschlüssel "** oder **"Domäne nicht autorisiert "**.

Schritte zur Fehlersuche:

1. Überprüfen Sie, ob Ihr App-Schlüssel richtig in den Quellcode eingefügt wurde.
2. Stellen Sie sicher, dass die Verbindung zu Ihrer Webanwendung über **https** erfolgt.  Dies wird von mobilen Browsern für den Zugriff auf die Kamera benötigt.
3. Vergewissern Sie sich, dass Sie einen unterstützten Browser verwenden, siehe [Webbrowser-Anforderungen](/legacy/getting-started/requirements/#web-browser-requirements)
4. Wenn Sie Ihr Gerät selbst hosten, überprüfen Sie, ob es ordnungsgemäß autorisiert wurde.  Rufen Sie auf Ihrem Telefon <https://apps.8thwall.com/token> auf, um den Status der Geräteautorisierung anzuzeigen. Dies ist nicht erforderlich, wenn Sie [Self Hosted Domains](/legacy/guides/projects/self-hosted-domains) konfiguriert haben.
5. Wenn Sie Mitglied mehrerer Webentwickler-Arbeitsbereiche sind, vergewissern Sie sich, dass der App-Schlüssel und das Dev-Token aus dem **gleichen Arbeitsbereich** stammen.
6. Wenn sich Ihr Webbrowser im Modus "Privates Surfen" oder "Inkognito" befindet, beenden Sie bitte den Modus "Privat/Inkognito", autorisieren Sie Ihr Gerät erneut und versuchen Sie es erneut.
7. Löschen Sie Website-Daten und Cookies aus Ihrem Webbrowser, autorisieren Sie Ihr Gerät erneut und versuchen Sie es erneut.
8. Wenn Sie einen kostenpflichtigen Pro- oder Enterprise-Tarif haben und versuchen, öffentlich auf Ihr WebAR-Erlebnis zuzugreifen, stellen Sie sicher, dass [Self Hosted Domains](/legacy/guides/projects/self-hosted-domains) richtig konfiguriert sind.
