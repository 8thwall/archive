---
id: device-authorization
---

# Geräteautorisierung

Wenn Sie einen kostenpflichtigen Pro- oder Enteprise-Plan haben, können Sie WebAR-Erfahrungen selbst hosten. Wenn
die IP oder die Domains Ihres Webservers nicht auf der Whitelist stehen (siehe
[Self Hosted Domains](/legacy/guides/projects/self-hosted-domains) in der Dokumentation), müssen Sie Ihr Gerät autorisieren, um das Erlebnis zu nutzen.

Wenn Sie den Cloud Editor verwenden, müssen Sie keine Geräte autorisieren.  Der Cloud Editor
autorisiert Geräte automatisch, wenn Sie den Vorschau-QR-Code während der Entwicklung scannen.

Durch die Autorisierung eines Geräts wird ein Entwickler-Token (Cookie) im Webbrowser des Geräts installiert, mit dem es
jede App-Taste im aktuellen Arbeitsbereich anzeigen kann.

Es gibt keine Begrenzung für die Anzahl der Geräte, die autorisiert werden können, aber jedes Gerät muss einzeln unter
autorisiert werden. Die Aufrufe Ihres Web AR-Erlebnisses von autorisierten Geräten werden auf Ihre monatliche Gesamtnutzung von
angerechnet.

**WICHTIG**: Wenn Sie die folgenden Schritte auf einem **iOS-Gerät** befolgt haben und immer noch Probleme mit
haben, lesen Sie bitte den Abschnitt [Fehlerbehebung](/legacy/troubleshooting/device-not-authorized) für Schritte
zur Behebung. Safari verfügt über eine Funktion namens **Intelligent Tracking Prevention**, mit der \*\*Cookies von Drittanbietern
\*\* (die wir verwenden, um Ihr Gerät zu autorisieren, während Sie sich entwickeln) blockiert werden können. Wenn sie blockiert werden, können wir
Ihr Gerät nicht verifizieren.

Wie man ein Gerät autorisiert:

1. Melden Sie sich bei 8thwall.com an und wählen Sie ein Projekt in Ihrem Arbeitsbereich aus.

2. Klicken Sie auf **Geräteautorisierung**, um den Bereich der Geräteautorisierung zu erweitern.

3. Wählen Sie die 8. Wall-Engine-Version, die Sie während der Entwicklung verwenden möchten.  Um die neueste stabile Version von
   8th Wall zu verwenden, wählen Sie **release**.  Um mit einer Vorabversion zu testen, wählen Sie **beta**.

![ConsoleDeveloperModeChannel](/images/console-developer-mode-channel.jpg)

4. Autorisieren Sie Ihr Gerät:

**Vom Desktop**: Wenn Sie in der Konsole auf Ihrem Laptop/Desktop angemeldet sind, **scannen Sie den QR-Code**
von dem **Gerät, das Sie autorisieren möchten**.  Dadurch wird ein Autorisierungs-Cookie auf dem Gerät installiert.

Hinweis: Ein QR-Code kann nur einmal gescannt werden.  Nach dem Scannen erhalten Sie eine Bestätigung, dass Ihr
Gerät autorisiert wurde. Die Konsole generiert dann einen neuen QR-Code, der gescannt werden kann, um
ein anderes Gerät zu autorisieren.

Vorher:

![ConsoleDevTokenQR](/images/console-developer-mode-qr.jpg)

Danach:

| Bestätigung (Konsole)                                       | Bestätigung (am Gerät)                                    |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| ![ConsoleQRConfirmation](/images/console-developer-mode-qr-result-desktop.jpg) | ![MobileQRConfirmation](/images/console-developer-mode-qr-result-mobile.jpg) |

**Vom Handy**: Wenn Sie direkt auf dem mobilen Gerät, das Sie
autorisieren möchten, bei 8thwall.com angemeldet sind, klicken Sie einfach auf **Browser autorisieren**. Dadurch wird ein Autorisierungs-Cookie in Ihrem mobilen Browser
installiert, das ihn berechtigt, jedes Projekt im aktuellen Arbeitsbereich anzuzeigen.

Vorher:

![DeveloperModeMobile](/images/console-developer-mode-mobile.jpg)

Danach:

![DeveloperModeMobileAuthorized](/images/console-developer-mode-mobile-authorized.jpg)
