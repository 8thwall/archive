---
id: monetize-with-8th-wall-payments
---

# 8. Mauer-Zahlungen

8th Wall Payments gibt Entwicklern die Werkzeuge an die Hand, die sie benötigen, um ihre AR- und VR-Webapplikationen mit sicheren Zahlungen zu versehen
. Entwickler können das Zahlungsmodul im Cloud-Editor verwenden, um ihrem Projekt auf einfache Weise Produkte für den Kauf auf
hinzuzufügen. Alle Zahlungen werden über die 8th Wall Payments API abgewickelt, die es
Entwicklern ermöglicht, Zahlungen zu sammeln und zu empfangen.

#### Warum 8th Wall Payments verwenden? {#why-use-8th-wall-payments}

Monetarisieren Sie Ihre WebAR- oder WebVR-Erlebnisse mit 8th Wall Payments ganz einfach mit dem Payments-Modul.
Powered by Stripe, 8th Wall Payments bietet eine sichere Möglichkeit für Endbenutzer, für Ihr Produkt zu bezahlen und
für Sie, Geld zu verdienen, indem Sie WebXR-Projekte entwickeln.

Mit dem 8th Wall Payments-Modul haben Sie die Möglichkeit, Ihr Web-AR- oder Web-VR-Projekt in einem einzigen Schritt zu importieren und über
mit erweiterbaren Zahlungsoptionen zu monetarisieren. Mit dem Zahlungsmodul
können Sie die Zahlungsoptionen, wie z. B. Kosten und Artikel, die Sie verkaufen, ganz einfach anpassen und dabei
unseren optimierten Checkout-Flow nutzen, der für die Verwendung auf Mobilgeräten, Desktop und VR optimiert ist. Zugriff auf alle aktuellen und
zukünftigen Zahlungsarten in einem Modul. Testen Sie den Erfolg Ihrer Zahlungsintegration mit dem eingebauten Testmodus
.

Aktuelle Zahlungsoptionen verfügbar:

- **Zugangspass**: Der Zugangspass ermöglicht es Ihnen, eine einmalige Zahlung zu Ihrem Produkt hinzuzufügen, die nach mindestens 1 Tag bis maximal 7 Tagen abläuft
  . Keine Benutzeranmeldung erforderlich. Der Zugangspass ist unter
  auf einem Gerät verfügbar und wird entfernt, wenn der Browser-Cache geleert wird.

#### Zahlungsabwicklung {#payment-processing}

Um diesen Zahlungsservice anbieten zu können, nimmt 8th Wall eine kleine Provision von jeder Gebühr, die mit
, unserem Stripe-Prozessor, geteilt wird. Endnutzer müssen den 8th Wall's Terms of
Service zustimmen, um einen Kauf tätigen zu können.

#### Zahlungsbearbeitungsgebühr {#payment-processing-fee}

20% von jeder Transaktion

## Zahlungsbeschränkungen {#payment-restrictions}

- 8th Wall Payments ist derzeit nur in den folgenden Ländern und deren jeweiligen Währungen verfügbar:
  - Australien
  - Kanada
  - Japan
  - Neuseeland
  - UK
  - Vereinigte Staaten
- 8th Wall Payments ist nur über Projekte zugänglich, die den Cloud Editor verwenden.
- Sie müssen ein `Admin` oder `Owner` Ihres 8th Wall Arbeitsbereiches sein, um sich für die 8th Wall Payment API anzumelden.
- 8th Wall Payments sind an die [Stripe Restricted Businesses List](https://stripe.com/gb/legal/restricted-businesses) gebunden.
- Sie können 8th Wall Payments nur als Zahlungsabwickler für App-Funktionen, digitale Inhalte oder digitale Waren nutzen, die mit 8th Wall erstellt wurden.
- Alle Endnutzer müssen den [8th Wall's Terms of Service](https://www.8thwall.com/terms) zustimmen, (siehe "8th Wall Payments End User Terms and Conditions" in den ToS)

## Auszahlungstermine {#payout-dates}

Melden Sie sich für die Zahlungs-API auf Ihrer Kontenseite an. Sobald das Geld auf Ihrem Konto eingegangen ist, erhalten Sie am 15. eines jeden Monats Zahlungen an
. Beträge, die noch nicht ausgezahlt wurden, werden auf Ihrer Kontoseite als **Ausstehende
Beträge** angezeigt.

## Zahlungsunterstützung und Erstattungen {#payment-support-and-refunds}

Alle Zahlungen sind nicht erstattungsfähig. Wenn ein Endnutzer eine Frage zu seiner Zahlung hat, kann er sich an
[support](mailto:support@8thwall.com) wenden.

## Verwendung von 8th Wall Payments in Ihrem Projekt {#using-8th-wall-payments-in-your-project}

8th Wall Payments nutzt Stripe Connect für die sichere Zahlungsabwicklung. Um mit der Erstellung von
Webanwendungen mit bezahlten Inhalten zu beginnen, müssen Sie sich über 8th Wall für ein Stripe Connect-Konto anmelden. Dies ist
erforderlich, um die Vorteile von 8th Wall Payments zu nutzen und eine Auszahlung zu erhalten.

Registrieren Sie sich für die Zahlungs-API auf Ihrer Kontenseite

1. Gehen Sie zu Ihrer Kontenseite
2. Wählen Sie unter Zahlungs-API das Land für Ihre Bank- oder Debitkarte aus.
3. Klicken Sie auf "Hier starten"
   ![payment-api-setting](/images/payment-api-setting.png)
4. Sie werden dann zu Stripe Connect weitergeleitet. Folgen Sie den Aufforderungen, alle erforderlichen Felder auszufüllen. Sie müssen Folgendes vorlegen:
   1. E-Mail
   2. Rufnummer
   3. Details für Privatpersonen oder Unternehmen
      1.
      1. Einzelperson - Ihr Geburtsdatum und Ihre Wohnanschrift, Sozialversicherungsnummer
         2.
      2. Name des Unternehmens
   4. Industrie, Website oder Produktbeschreibung
   5. Angaben zum Bankkonto oder zur Debitkarte, von der Sie die Zahlungen einziehen werden

Nachdem Sie Ihre vollständigen Daten übermittelt haben, kann es einige Tage dauern, bis Stripe Ihre Daten verarbeitet und überprüft hat. Sie können den Status Ihres Kontos auf dem Bildschirm Konten abrufen.

Nach der Bestätigung sehen Sie Ihre Kontodaten auf der Seite Konten

#### Verwalten von Zahlungen API Stripe Connect Konto {#manage-payments-api-stripe-connect-account}

Sie können Ihre Zahlungsdetails für Geld, das Sie in all Ihren Arbeitsbereich-Webapplikationen verdient haben, auf der Seite Konten unter dem Abschnitt Zahlungs-API-Übersicht einsehen.

Konten Seite Payment API Übersicht

- Bankkonto - das Bankkonto oder die Debitkarte, auf die Ihre Auszahlung eingezahlt wird
- Gesamtbetrag - der Gesamtbetrag, den Sie über alle Ihre Webanwendungen eingenommen haben
- Auszahlungsdatum - der Tag des Monats, an dem Sie Ihre Auszahlung erhalten werden. Siehe Auszahlungstermine für den Zeitplan.
- Nächster Auszahlungsbetrag - der Gesamtbetrag, den Sie am nächsten Auszahlungsdatum erhalten werden
- Ausstehender Betrag - der Gesamtbetrag, den Sie erhalten haben und der zur Bearbeitung zurückliegt. Es ist noch nicht bereit, mit der nächsten Auszahlung verschickt zu werden.

Um Ihr Stripe Connect-Konto anzuzeigen, klicken Sie auf **Zu Stripe**.

Um die Zahlungsinformationen Ihres Stripe-Kontos zu aktualisieren, z. B. Adresse oder Bankverbindung, klicken Sie auf **Informationen aktualisieren**.

Um einzelne Zahlungen aus Ihren Webanwendungen anzuzeigen, klicken Sie auf **Verlauf anzeigen**.

#### Zahlungsmodul {#payments-module}

Sobald Sie sich für 8th Wall Payments angemeldet haben, müssen Sie das Zahlungsmodul in Ihr Projekt importieren, um auf die Zahlungs-API zugreifen zu können.

So importieren Sie das Zahlungsmodul:

1. Öffnen Sie ein Cloud Editor-Projekt
2. Klicken Sie auf das +-Zeichen neben dem Abschnitt "Module" in der linken Navigation des Cloud-Editors.
3. Suchen Sie nach "Payments" und importieren Sie das Modul in Ihr Projekt.

Sie sind nun bereit, bezahlte Inhalte in Ihr Projekt aufzunehmen!

#### Konfigurationen {#configurations}

Mit dem Zahlungsmodul können Sie ganz einfach die Art der Zahlungsoption, die Kosten, das Produkt und vieles mehr anpassen. Sie können auch den Testmodus aktivieren, um sicherzustellen, dass Ihre Zahlungen wie erwartet funktionieren.

#### Testmodus {#test-mode}

Im Testmodus können Sie Käufe simulieren, die über Ihre Webanwendung getätigt wurden, bevor Sie diese öffentlich zugänglich machen. Wenn Sie den Testmodus aktivieren, können Sie die Zahlungsverkehrs-API in ihre Anwendungen integrieren, ohne echte Käufe tätigen zu müssen.

Konfigurationen für den Testmodus:

| Konfiguration                    | Typ       | Standard | Beschreibung                                                                                                                                                                                                                                                    |
| -------------------------------- | --------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Testmodus Aktiviert              | `Boolean` | false    | Wenn True - Sie simulieren Käufe in Ihrem Produkt, Zahlungen werden nicht auf dem Server, sondern lokal zwischengespeichert <br /> Wenn False - Testmodus ist ausgeschaltet                                                                                     |
| Testkäufe bei Ausführung löschen | `Boolean` | false    | Wenn Wahr - Testkäufe werden gelöscht, damit Sie den Kauf erneut testen können <br /> Wenn Falsch - Testkäufe bleiben auf dem lokalen Speicher, bis sie gelöscht werden. Dies ist nützlich, um bestehende Kaufströme zu testen. |

#### Zugangskarte {#access-pass}

Diese Zahlungsart bietet Nutzern für einen begrenzten Zeitraum bezahlten Zugang zu AR- oder VR-Inhalten. Zugangspässe sind gut geeignet, um den kostenpflichtigen Zugang zu AR/VR-Veranstaltungen zu ermöglichen, z. B. ein Tagesticket für ein holografisches Konzert oder eine virtuelle Kunstausstellung oder 7 Tage Zugang zu einer AR-aktivierten Schnitzeljagd.

Für den Endnutzer bedeutet dies:

1. Zeigen Sie die Aufforderung zum Erwerb des Zugangsausweises oder des Produkts an.
2. Ein Klick auf CTA öffnet den Checkout-Flow auf 8thwall.com
3. Ermöglicht den Nutzern den Kauf eines Produkts zu einem bestimmten Preis
4. Speichern Sie den Kauf auf dem lokalen Speicher des Geräts bis zu einem vorher festgelegten Zeitraum

Konfigurationen für Zugangspass-Standardwerte

| Konfiguration              | Typ      | Standard | Beschreibung                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| -------------------------- | -------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Zugang Dauer Tage          | Nummer   | `1`      | Die Anzahl der Tage, für die dieser Kauf gültig ist. Die Mindestdauer beträgt 1 Tag, die Höchstdauer 7 Tage.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Betrag                     | Nummer   | `0.99`   | Der Betrag, der für die Zahlung des angegebenen Zugangspasses angefordert werden soll.<br/>Die Beträge haben einen Mindest- und einen Höchstwert, wie sie in der Währung festgelegt sind.<br/>**AUD**: $0.99 bis $99.99<br/>**CAD**: $0.99 bis $99.99<br/>**GBP**: £0.99 bis £99.99<br/>**JPY**: ¥99 bis ¥999<br/>**NZD**: $0.99 bis $99.99<br/>**USD**: $0,99 bis $99,99 |
| Name des Zugangspasses     | `String` | "N/A     | Der Name des Produkts. Dies wird im Kassenformular verwendet, um dem Benutzer zu beschreiben, was er kauft.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Währung                    | `String` | ''usd''  | Die Währung, die dem Nutzer in Rechnung gestellt wird. Kann `'aud'`, `'cad'`, `'gbp'`, `'jpy'`, `'nzd'`, oder `'usd'` sein.                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Sprache der Checkout-Seite | `String` | 'en-US'  | Die Sprache, die dem Endbenutzer auf der sicheren Kassenseite angezeigt wird. Kann `'en-US'` (Englisch - Vereinigte Staaten) oder `'ja-JP'` (Japanisch) sein.                                                                                                                                                                                                                                                                                                                                                                                                       |
