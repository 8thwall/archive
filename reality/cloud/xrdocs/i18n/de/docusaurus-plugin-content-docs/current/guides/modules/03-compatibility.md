# Modul-Kompatibilität {#module-compatibility}

8th Wall Module können nur für von 8th Wall gehostete Projekte, nur für selbst gehostete Projekte, oder sowohl für von 8th Wall gehostete als auch für selbst gehostete Projekte zur Verfügung gestellt werden. Standardmäßig sind Module sowohl für von 8th Wall gehostete als auch für selbstgehostete Projekte verfügbar. Dies kann auf der Einstellungsseite für das Modul geändert werden.

![module-compatibility-settings](/images/modules-compatibility-settings.jpg)

Die Module müssen richtig kodiert sein, damit sie sowohl in den von 8th Wall gehosteten als auch in den selbst gehosteten Projekten funktionieren. In müssen bestimmte Assets mit Referenz zu Modulen als Crossorigin-aktiviert geladen werden, damit sie in selbst gehosteten Domains laden können. Zum Beispiel das explizite Festlegen des Crossorigin-Attributs auf Medien:

![modul-beispiel-cors](/images/modules-example-cors.jpg)

Oder laden Sie einen Webworker-Blob mit fetch vor, bevor Sie den Webworker aufrufen:

![module-example-webworker](/images/modules-example-webworker.jpg)