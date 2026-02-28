# Modulkompatibilität {#module-compatibility}

8th Wall Module können nur für von 8th Wall gehostete Projekte, nur für selbst gehostete Projekte,
oder sowohl für von 8th Wall gehostete als auch für selbst gehostete Projekte zur Verfügung gestellt werden. Standardmäßig sind Module sowohl für 8th Wall
gehostete als auch für selbst gehostete Projekte verfügbar. Dies kann auf der Einstellungsseite für das Modul geändert werden.

![module-compatibility-settings](/images/modules-compatibility-settings.jpg)

Die Module müssen richtig kodiert sein, damit sie sowohl in den von 8th Wall gehosteten als auch in den selbst gehosteten Projekten funktionieren. In
müssen bestimmte Assets, auf die innerhalb von Modulen verwiesen wird, als Cross-Origin-fähig geladen werden, damit sie
in Self-Hosted-Domains laden können. Zum Beispiel das explizite Setzen des Cross-Origin-Attributs auf
Medien:

![module-example-cors](/images/modules-example-cors.jpg)

Oder das Vorladen eines Webworker-Blob mit fetch vor dem Aufruf des Webworkers:

![module-example-webworker](/images/modules-example-webworker.jpg)