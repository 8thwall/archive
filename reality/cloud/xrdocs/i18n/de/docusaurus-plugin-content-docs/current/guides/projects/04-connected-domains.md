---
id: connected-domains
---

# Verbundene Domains

Wenn Sie den 8th Wall Cloud Editor zur Entwicklung verwenden, wird das erstellte WebAR-Erlebnis auf der Hosting-Infrastruktur von 8th Wall veröffentlicht. Die Standard-URL Ihrer veröffentlichten Web AR-Erfahrung hat das folgende Format:

"**arbeitsbereich-name**.8thwall.app/**projekt-name**"

Wenn Sie eine eigene Domain besitzen und diese mit einem von 8th Wall gehosteten Projekt anstelle der Standard-URL verwenden möchten, können Sie die Domain mit Ihrem 8th Wall Projekt verbinden, indem Sie ein paar DNS-Einträge hinzufügen. Dazu benötigen Sie Zugang zum Erstellen/Bearbeiten der DNS-Konfiguration für Ihre Domäne.

**HINWEIS**: Um benutzerdefinierte Domains mit 8th Wall Hosted-Projekten zu verbinden, ist ein **Pro- oder Enterprise-Tarif** erforderlich.

**WARNUNG**: Es wird dringend empfohlen, eine **Subdomain** ("ar.mydomain.com") anstelle der Root-Domain ("mydomain.com" ohne etwas davor) zu verbinden, da **nicht alle DNS-Anbieter CNAME/ALIAS/ANAME-Einträge für die Root-Domain** unterstützen. Bitte erkundigen Sie sich bei Ihrem DNS-Anbieter, ob er CNAME- oder ALIAS-Einträge für die Root-Domain unterstützt, bevor Sie fortfahren.

1. Wählen Sie auf der Seite "Projekt-Dashboard" die Option "Domänen einrichten"

![SetupConnectedDomains](/images/connected-domains-setup-domains.png)

2. Erweitern Sie "Richten Sie Ihre Domain so ein, dass sie auf dieses von 8th Wall gehostete Projekt verweist"

3. Geben Sie in **Schritt 1** des Assistenten für verbundene Domänen Ihre **benutzerdefinierte Domäne** (z.B. www.mydomain.com) in das Feld Primäre verbundene Domäne ein.

![VerbundeneDomänen](/images/console-appkey-domains.png)

4. [Optional] Wenn Sie weitere Subdomänen verbinden möchten, klicken Sie auf die Schaltfläche **Zusätzliche Subdomäne hinzufügen** und fügen Sie alle **zusätzlichen Domänen** hinzu, die Sie verbinden möchten. **Hinweis**: Wenn Sie weitere Subdomänen verbinden, werden diese auf die primäre verbundene Domäne zurückgeleitet. Sie müssen denselben Stamm wie die primäre verbundene Domain haben.

![AdditionalConnectedDomains](/images/console-appkey-domains-additional.png)

5. Klicken Sie auf **Verbinden**. An diesem Punkt generiert 8th Wall ein SSL-Zertifikat für die zu verbindende(n) benutzerdefinierte(n) Domain(s). Dieser Vorgang kann einige Minuten dauern, haben Sie also bitte etwas Geduld. Klicken Sie bei Bedarf auf die Schaltfläche "Status aktualisieren".

6. Als Nächstes: **Überprüfen Sie die Inhaberschaft** Ihrer Domain. Um zu überprüfen, ob Sie der Eigentümer der benutzerdefinierten Domain sind, müssen Sie sich auf der Website Ihres DNS-Providers anmelden und einen oder mehrere CNAME-Einträge zur Überprüfung hinzufügen.  Verwenden Sie die Schaltfläche **Kopieren**, um sicherzustellen, dass Sie die vollständigen Host- und Wertedatensätze korrekt erfassen.

![ConnectedDomainVerificationRecord](/images/connected-domain-verification-record.png)

Die Überprüfung dieser DNS-Einträge kann bis zu 24 Stunden dauern, ist aber in den meisten Fällen innerhalb weniger Minuten abgeschlossen.  Bitte haben Sie etwas Geduld und klicken Sie bei Bedarf regelmäßig auf die Schaltfläche "Überprüfungsstatus aktualisieren".

Wenn die Überprüfung abgeschlossen ist, sehen Sie ein grünes Häkchen neben dem überprüften DNS-Eintrag:

![ConnectedDomainVerified](/images/connected-domain-verified.png)

7. Schließlich zeigt **Schritt 3** einen oder mehrere CNAME- (wenn Sie eine Subdomain verbinden) oder ANAME-Einträge (wenn Sie eine Root-Domain verbinden, siehe Warnung oben) an, die zu Ihrem DNS-Server hinzugefügt werden müssen, um die Einrichtung der verbundenen Domain abzuschließen. Diese Einträge ordnen Ihre benutzerdefinierte Domain der Hosting-Infrastruktur von 8th Wall zu.

![ConnectedDomainConnectionRecord](/images/connected-domain-connection-record.png)

Ergebnis: Verbindungssatz verifiziert:

![ConnectedDomainConnectionEstablished](/images/connected-domain-connection-established.png)

Zusätzliche Hinweise:

* Wenn Sie eine **Root-Domäne** verbinden, wird in Schritt 3 ein `ANAME` Eintrag angezeigt.  Vorausgesetzt, Ihr DNS-Anbieter unterstützt diese Art von Einträgen tatsächlich, werden sie nicht als "verbunden" angezeigt. Ihre verbundene Domain funktioniert weiterhin, solange Sie die entsprechenden DNS-Einträge erstellt haben.
* Es ist nicht möglich, die Einstellungen der verbundenen Domäne zu ändern, wenn sie einmal definiert sind. Wenn Sie Änderungen vornehmen müssen, müssen Sie das Folgende tun:
    1. Löschen Sie die verbundene Domäne aus Ihrem 8th Wall-Projekt.
    2. Bereinigen und Hinzufügen von DNS-Einträgen aus der vorherigen Einrichtung.
    3. Beginnen Sie mit der neuen benutzerdefinierten Domänenkonfiguration von vorne.
* Verwenden Sie **nicht** einen **A-Eintrag** für Schritt 3.  die von 8th Wall gehosteten Erlebnisse werden über ein globales CDN mit Hunderten von Standorten rund um den Globus bereitgestellt. Die Benutzer werden automatisch an das nächstgelegene/schnellste Rechenzentrum weitergeleitet, um maximale Leistung zu erzielen. Sie müssen Ihre Domain mit der eindeutigen URL "xxxxx.cloudfront.net" verbinden, die in `Schritt 3` des Assistenten angezeigt wird.
