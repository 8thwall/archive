---
id: serve-localhost
---

# Kann keine Verbindung zum Skript "serve" herstellen

#### Ausgabe {#issue}

Ich verwende das Skript "serve" (aus dem öffentlichen GitHub-Repositorium von 8th Wall Web:
<https://github.com/8thwall/web>), um einen lokalen Webserver auf meinem Laptop auszuführen, und es sagt, dass er auf
**127.0.0.1** hört.  Mein Telefon kann über diese IP-Adresse keine Verbindung mit dem Laptop herstellen.

![ServeLocalhost](/images/serve-localhost.jpg)

"127.0.0.1" ist die Loopback-Adresse Ihres Laptops (auch bekannt als "localhost"), so dass andere Geräte, wie z. B. Ihr
Telefon, keine direkte Verbindung zu dieser IP-Adresse herstellen können.  Aus irgendeinem Grund hat das Skript `serve`
beschlossen, auf der Loopback-Schnittstelle zu lauschen.

#### Auflösung {#resolution}

Bitte führen Sie das Skript `serve` mit der Option `-i` erneut aus und geben Sie die Netzwerkschnittstelle an, die Sie verwenden möchten.

#### Beispiel (Mac) {#example-mac}

`./serve/bin/serve -d gettingstarted/xraframe/ -p 7777 -i en0`

#### Beispiel (Windows) {#example-windows}

**Hinweis:** Führen Sie den folgenden Befehl in einem Standardfenster der **Befehlszeile** (**cmd.exe**) aus. Das
\*Skript erzeugt Fehler, wenn es über PowerShell ausgeführt wird.

`serve\bin\serve.bat -d gettingstarted\xraframe -p 7777 -i WiFi`

Wenn Sie immer noch keine Verbindung herstellen können, überprüfen Sie bitte Folgendes:

- Vergewissern Sie sich, dass Ihr Computer und Ihr mobiles Gerät mit dem **gleichen WiFi-Netzwerk** verbunden sind.
- **Deaktivieren** Sie die lokale **Firewall** auf Ihrem Computer.
- Um eine Verbindung herzustellen, scannen Sie entweder den QR-Code **oder** stellen Sie sicher, dass Sie die **gesamte** "Listening"-URL in
  in Ihren Browser kopieren, einschließlich der "**https://**" am Anfang und der **Port**-Nummer am Ende.
