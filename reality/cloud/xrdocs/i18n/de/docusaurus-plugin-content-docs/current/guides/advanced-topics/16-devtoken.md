---
id: device-authorization
---

# Geräte-Autorisierung

Wenn Sie einen kostenpflichtigen Pro- oder Enterprise-Plan haben, können Sie WebAR-Erlebnisse selbst hosten. Wenn die IP oder die Domänen Ihres Webservers nicht auf die Whitelist gesetzt hat (siehe [Self Hosted Domains](/guides/projects/self-hosted-domains) in der Dokumentation), müssen Sie Ihr Gerät autorisieren, um das Erlebnis nutzen zu können.

Wenn Sie den Cloud Editor verwenden, müssen Sie keine Geräte autorisieren.  Der Cloud Editor autorisiert Geräte automatisch, wenn Sie den Vorschau-QR-Code während der Entwicklung scannen.

Durch die Autorisierung eines Geräts wird ein Entwickler-Token (Cookie) in seinem Webbrowser installiert, mit dem es jede App-Taste im aktuellen Arbeitsbereich anzeigen kann.

Es gibt keine Begrenzung für die Anzahl der Geräte, die autorisiert werden können, aber jedes Gerät muss einzeln autorisiert werden. Die Aufrufe Ihres WebAR-Erlebnisses von autorisierten Geräten werden auf Ihre monatliche Gesamtnutzung angerechnet.

**WICHTIG**: Wenn Sie die folgenden Schritte auf einem **iOS-Gerät** befolgt haben und immer noch Probleme haben, lesen Sie bitte den Abschnitt [Fehlerbehebung](/troubleshooting/device-not-authorized) für Schritte zur Behebung. Safari verfügt über eine Funktion namens **Intelligent Tracking Prevention** , die ** Cookies von Drittanbietern** (die wir verwenden, um Ihr Gerät zu autorisieren, während Sie entwickeln) blockieren kann. Wenn sie blockiert werden, können wir Ihr Gerät nicht verifizieren.

Wie Sie ein Gerät autorisieren:

1. Melden Sie sich bei 8thwall.com an und wählen Sie ein Projekt in Ihrem Arbeitsbereich.

2. Klicken Sie auf **Geräteautorisierung**, um das Fenster für die Geräteautorisierung zu erweitern.

3. Wählen Sie die 8. Wall-Engine-Version, die Sie während der Entwicklung verwenden möchten.  Um die neueste stabile Version von 8th Wall zu verwenden, wählen Sie **release**.  Um mit einer Vorabversion zu testen, wählen Sie **beta**.

![ConsoleDeveloperModeKanal](/images/console-developer-mode-channel.jpg)

4. Autorisieren Sie Ihr Gerät:

**Vom Desktop aus**: Wenn Sie auf Ihrem Laptop/Desktop bei der Konsole angemeldet sind, **scannen Sie den QR-Code** von dem **Gerät, das Sie autorisieren möchten**.  Dadurch wird ein Autorisierungs-Cookie auf dem Gerät installiert.

Hinweis: Ein QR-Code kann nur einmal gescannt werden.  Nach dem Scannen erhalten Sie eine Bestätigung, dass Ihr Gerät autorisiert wurde. Die Konsole erstellt dann einen neuen QR-Code, der gescannt werden kann, um ein anderes Gerät zu autorisieren.

Vorher:

![ConsoleDevTokenQR](/images/console-developer-mode-qr.jpg)

Nach:

| Bestätigung (Konsole)                                                          | Bestätigung (auf dem Gerät)                                                  |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| ![ConsoleQRConfirmation](/images/console-developer-mode-qr-result-desktop.jpg) | ![MobileQRConfirmation](/images/console-developer-mode-qr-result-mobile.jpg) |

**Vom Handy aus**: Wenn Sie direkt auf dem mobilen Gerät, das Sie autorisieren möchten, bei 8thwall.com angemeldet sind, klicken Sie einfach auf **Browser autorisieren**. Dadurch wird ein Autorisierungs-Cookie in Ihrem mobilen Browser installiert, mit dem Sie jedes Projekt im aktuellen Arbeitsbereich anzeigen können.

Vorher:

![EntwicklerModusMobil](/images/console-developer-mode-mobile.jpg)

Nachher:

![DeveloperModeMobileAuthorized](/images/console-developer-mode-mobile-authorized.jpg)
