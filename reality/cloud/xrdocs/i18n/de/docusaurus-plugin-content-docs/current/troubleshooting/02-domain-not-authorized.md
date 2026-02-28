---
id: domain-not-authorized
---

# Domäne nicht autorisiert

#### Ausgabe {#issue}

Wenn ich versuche, ein selbst gehostetes WebAR-Erlebnis anzuzeigen, erhalte ich die Fehlermeldung "Domain Not Authorized".

#### Lösungen {#solutions}

1. Vergewissern Sie sich, dass Sie die Domain(s) Ihres Webservers auf eine weiße Liste gesetzt haben. Selbst gehostete Domains sind **subdomain-spezifisch** - z. B. ist `mydomain.com` NICHT dasselbe wie `www.mydomain.com.` Wenn Sie sowohl bei `mydomain.com` als auch bei `www.mydomain.com` hosten möchten `,` müssen Sie **BEIDE** angeben. Weitere Informationen finden Sie im Abschnitt [Connected Domains](/guides/projects/connected-domains) (siehe Selbst gehostete Projekte) in den Dokumenten.

2. Wenn Domain='' (leer), überprüfen Sie die `RefererPolicy` Einstellungen auf Ihrem Webserver.

![domain-not-authorized](/images/domain-not-authorized.jpg)

In dem obigen Screenshot ist der Wert `Domain=` leer. Sie sollte auf die Domäne Ihrer selbst gehosteten WebAR-Erfahrung eingestellt sein. In diesem Fall ist die `Referer Policy` Ihres Webservers zu restriktiv. Der `Referer` http-Header wird verwendet, um zu überprüfen, ob Ihr App-Schlüssel von einem genehmigten/weißgeisteten Server verwendet wird.

Um die Konfiguration zu überprüfen, öffnen Sie den Chrome/Safari-Debugger und sehen Sie sich die Registerkarte Netzwerk an.  Die `xrweb` Request Headers sollten einen `Referer` Wert enthalten, und dieser muss mit der/den Domain(s) übereinstimmen, die Sie in Ihren Projekteinstellungen whitelisted haben.

**Falsch** - In diesem Screenshot ist die Referrer Policy auf "same-origin" eingestellt. Das bedeutet, dass ein Referrer nur für dieselbe Website gesendet wird, aber bei herkunftsübergreifenden -Anfragen werden keine Referrer-Informationen gesendet:

![referer-missing](/images/referer-missing.jpg)

**Richtig** - Die `xrweb` Request Headers enthalten einen `Referer` Wert.

![referer-ok](/images/referer-ok.jpg)

Der Standardwert "strict-origin-when-cross-origin" wird empfohlen. Bitte lesen Sie <https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy> für die Konfigurationsmöglichkeiten.
