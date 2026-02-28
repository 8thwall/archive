---
id: monetize-with-8th-wall-payments
---

# „8th Wall“-Zahlungen

8th Wall Payments gibt Entwicklern die Werkzeuge in die Hand, die sie benötigen, um ihre AR- und VR-Webapplikationen mit sicheren Zahlungen zu versehen. Entwickler können das Zahlungsmodul im Cloud-Editor verwenden, um ihrem Projekt ganz einfach Produkte zum Kauf hinzuzufügen. Alle Zahlungen werden über die 8th Wall Payments API abgewickelt, die Entwicklern ermöglicht, Zahlungen zu sammeln und zu empfangen.

#### Warum 8th Wall Payments verwenden? {#why-use-8th-wall-payments}

Monetarisieren Sie Ihre WebAR- oder WebVR-Erlebnisse ganz einfach mit 8th Wall Payments mit dem Zahlungsmodul. 8th Wall Payments wird von Stripe angetrieben und bietet eine sichere Möglichkeit für Endbenutzer, für Ihr Produkt zu bezahlen und für Sie, Geld mit der Entwicklung von WebXR-Projekten zu verdienen.

Mit dem 8th Wall Zahlungsmodul haben Sie die Möglichkeit, Ihr WebAR- oder WebVR-Projekt in einem Schritt zu importieren und mit erweiterbaren Zahlungsoptionen zu monetarisieren. Mit dem Zahlungsmodul können Sie die Zahlungsoptionen, wie z.B. die Kosten und den Artikel, den Sie verkaufen, ganz einfach anpassen und dabei unseren optimierten Kassenablauf nutzen, der für die Verwendung auf Mobilgeräten, Desktop und VR optimiert ist. Greifen Sie auf alle aktuellen und zukünftigen Zahlungsarten in einem Modul zu. Testen Sie den Erfolg Ihrer Zahlungsintegration mit dem eingebauten Testmodus .

Aktuelle verfügbaren Zahlungsoptionen:

- **Zugangspass**: Mit dem Zugangspass können Sie eine einmalige Zahlung zu Ihrem Produkt hinzufügen, die nach mindestens 1 Tag bis maximal 7 Tagen abläuft . Keine Benutzeranmeldung erforderlich. Der Zugangspass ist auf einem Gerät verfügbar und wird entfernt, wenn der Browser-Cache gelöscht wird.

#### Zahlungsabwicklung {#payment-processing}

Um diesen Zahlungsservice anbieten zu können, nimmt 8th Wall eine kleine Provision von jeder Gebühr, die mit , unserem Stripe-Prozessor, geteilt wird. Endverbraucher müssen den Nutzungsbedingungen von [8th Wall Service](https://www.8thwall.com/terms) zustimmen, um einen Kauf tätigen zu können.

#### Gebühr für die Zahlungsabwicklung {#payment-processing-fee}

20% von jeder Transaktion

## Zahlungseinschränkungen {#payment-restrictions}

* 8th Wall Payments ist derzeit nur in den folgenden Ländern und deren jeweiligen Währungen verfügbar:
  * Australien
  * Kanada
  * Japan
  * Neuseeland
  * UK
  * Vereinigte Staaten
* 8th Wall Payments ist nur über Projekte zugänglich, die den Cloud Editor verwenden.
* Sie müssen `Admin` oder `Besitzer` Ihres 8th Wall Arbeitsbereichs sein, um sich für die 8th Wall Payment API anzumelden.
* 8th Wall Payments ist an die [Stripe Restricted Businesses List](https://stripe.com/gb/legal/restricted-businesses) gebunden.
* Sie können 8th Wall-Zahlungen nur als Zahlungsabwickler für App-Funktionen, digitale Inhalte oder digitale Waren nutzen, die mit 8th Wall erstellt wurden.
* Alle Endnutzer müssen sich mit den Nutzungsbedingungen von [8th Wall](https://www.8thwall.com/terms) einverstanden erklären (siehe "8th Wall Geschäftsbedingungen für Zahlungsnutzer" in den Nutzungsbedingungen)

## Auszahlungsdaten {#payout-dates}

Melden Sie sich auf Ihrer Kontoseite für die Zahlungs-API an. Sobald das Geld auf Ihrem Konto eingegangen ist, erhalten Sie die Zahlungen von am 15. eines jeden Monats. Beträge, die noch nicht ausgezahlt wurden, werden als **Ausstehende Beträge Beträge** auf Ihrer Kontenseite angezeigt.

## Zahlungsunterstützung und Erstattungen {#payment-support-and-refunds}

Zahlungen können nicht erstattet werden. Wenn ein Endbenutzer eine Frage zu seiner Zahlung hat, kann er sich an den [Support](mailto:support@8thwall.com) wenden.

## Verwendung von 8th Wall Payments in Ihrem Projekt {#using-8th-wall-payments-in-your-project}

8th Wall Payments nutzt Stripe Connect für die sichere Zahlungsabwicklung. Um mit der Erstellung von Web-Apps mit bezahlten Inhalten beginnen zu können, müssen Sie sich über 8th Wall für ein Stripe Connect-Konto anmelden. Dies ist erforderlich, um die Vorteile von 8th Wall Payments zu nutzen, um Auszahlungen zu erhalten.

Registrieren Sie sich für die Zahlungs-API auf Ihrer Kontenseite

1. Gehen Sie zu Ihrer Kontenseite
1. Wählen Sie unter Zahlungs-API das Land für Ihre Bank- oder Debitkarte.
1. Klicken Sie auf "Hier starten" ![payment-api-setting](/images/payment-api-setting.png)
1. Sie werden zu Stripe Connect weitergeleitet. Folgen Sie den Aufforderungen, um alle erforderlichen Felder auszufüllen. Sie müssen Folgendes angeben:
    1. E-Mail
    1. Telefonnummer
    1. Details für Privatpersonen oder Unternehmen
        1. Einzelperson - Ihr Geburtsdatum und Ihre Heimatadresse, Sozialversicherungsnummer
        1. Geschäftlicher Name
    1. Industrie, Website oder Produktbeschreibung
    1. Angaben zum Bankkonto oder zur Debitkarte, über die Sie Zahlungen einziehen werden

Nachdem Sie Ihre vollständigen Daten übermittelt haben, kann es einige Tage dauern, bis Stripe Ihre Daten verarbeitet und validiert hat. Sie können den Status Ihres Kontos auf dem Bildschirm Konten abrufen.

Nach der Bestätigung sehen Sie Ihre Kontoinformationen auf Ihrer Kontenseite

#### Zahlungen verwalten API Stripe Connect Konto {#manage-payments-api-stripe-connect-account}

Sie können Ihre Zahlungsdetails für Geld, das Sie in all Ihren Workspace-Web-Apps verdient haben, auf der Seite Konten unter dem Abschnitt Zahlungs-API-Übersicht einsehen.

Konten Seite Zahlungs-API Übersicht

- Bankkonto - das Bankkonto oder die Debitkarte, auf die Ihre Auszahlung eingezahlt wird
- Gesamtbetrag - der Gesamtbetrag, den Sie über alle Ihre Web-Apps eingenommen haben
- Auszahlungsdatum - der Tag des Monats, an dem Sie Ihre Auszahlung erhalten werden. Siehe Auszahlungstermine für den Zeitplan.
- Nächster Auszahlungsbetrag - der Gesamtbetrag, den Sie am nächsten Auszahlungstermin erhalten werden
- Ausstehender Betrag - der Gesamtbetrag, den Sie erhalten haben und der zur Bearbeitung ansteht. Es ist noch nicht bereit, um mit der nächsten Auszahlung verschickt zu werden

Um Ihr Stripe Connect-Konto anzuzeigen, klicken Sie auf **. Gehen Sie zu Stripe**.

Um die Zahlungsinformationen Ihres Stripe-Kontos zu aktualisieren, wie z.B. Adresse oder Bankverbindung, klicken Sie auf **Informationen aktualisieren**.

Um einzelne Zahlungen aus Ihren Webanwendungen zu sehen, klicken Sie auf **Verlauf anzeigen**.

#### Modul Zahlungen {#payments-module}

Sobald Sie sich für 8th Wall Payments angemeldet haben, müssen Sie das Zahlungsmodul in Ihr Projekt importieren, um auf die Zahlungs-API zugreifen zu können.

So importieren Sie das Zahlungsmodul:

1. Öffnen Sie ein Cloud Editor-Projekt
2. Klicken Sie auf das + Zeichen neben dem Abschnitt "Module" in der linken Navigation des Cloud Editors.
3. Suchen Sie nach "Payments" und importieren Sie das Modul in Ihr Projekt.

Sie sind nun bereit, bezahlte Inhalte in Ihr Projekt aufzunehmen!

#### Konfigurationen {#configurations}

Mit dem Zahlungsmodul können Sie ganz einfach die Art der gewünschten Zahlungsoption, die Kosten, das Produkt und vieles mehr anpassen. Sie können auch den Testmodus aktivieren, um sicherzustellen, dass Ihre Zahlungen wie erwartet funktionieren.

#### Testmodus {#test-mode}

Im Testmodus können Sie Käufe simulieren, die in Ihrer Webanwendung getätigt wurden, bevor Sie diese öffentlich zugänglich machen. Wenn Sie den Testmodus aktivieren, können Sie die Zahlungsverkehrs-API in ihre Apps integrieren, ohne echte Käufe tätigen zu müssen.

Konfigurationen für den Testmodus:

| Konfiguration                    | Typ         | Standard | Beschreibung                                                                                                                                                                                                                                    |
| -------------------------------- | ----------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Testmodus Aktiviert              | `Boolesche` | `false`  | Wenn Wahr - Sie simulieren Käufe in Ihrem Produkt, die Zahlungen liegen nicht auf dem Server, sondern werden lokal zwischengespeichert <br /> Wenn Falsch - Der Testmodus ist deaktiviert                                                 |
| Testkäufe bei Ausführung löschen | `Boolesche` | `false`  | Wenn Wahr - Käufe im Testmodus werden gelöscht, damit Sie den Kauf erneut testen können <br /> Wenn Falsch - Testkäufe bleiben auf dem lokalen Speicher, bis sie gelöscht werden. Dies ist nützlich, um bestehende Kaufabläufe zu testen. |

#### Zugangspass {#access-pass}

Diese Zahlungsart bietet Nutzern für einen begrenzten Zeitraum bezahlten Zugang zu AR- oder VR-Inhalten. Zugangspässe sind gut geeignet, um einen kostenpflichtigen Zugang zu AR/VR-Events zu ermöglichen, wie z.B. ein 1-Tages-Ticket für ein holografisches Konzert oder eine virtuelle Kunstausstellung oder 7 Tage Zugang zu einer AR-aktivierten Schnitzeljagd.

Im Endbenutzererlebnis wird der Benutzer:

1. Den Zugangspass-Prompt oder die Aufforderung zum Kauf des Produkts sehen
2. Wenn Sie auf CTA klicken, öffnet sich der auf 8thwall.com gehostete Bestellvorgang
3. Ermöglicht Benutzern, ein Produkt zu einem bestimmten Preis zu kaufen
4. Speichern Sie den Kauf auf dem lokalen Gerätespeicher bis zu einem bestimmten Zeitraum

Konfigurationen für Zugriffspass-Standardwerte

| Konfiguration              | Typ      | Standard             | Beschreibung                                                                                                                                                                                                                                                                                                                                                                                                        |
| -------------------------- | -------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Zugangsdauer Tage          | `Nummer` | `1`                  | Die Anzahl der Tage, für die dieser Kauf gültig ist. Die Mindestdauer beträgt 1 Tag, die Höchstdauer 7 Tage.                                                                                                                                                                                                                                                                                                        |
| Betrag                     | `Nummer` | `0.99`               | Der Betrag, der für die Zahlung des angegebenen Zugangspasses angefordert werden soll.<br/>Die Beträge haben einen Mindest- und einen Höchstbetrag, die durch die Währung definiert sind.<br/>**AUD**: $0,99 bis $99,99<br/>**CAD**: $0,99 bis $99,99<br/>**GBP**: £0,99 bis £99,99<br/>**JPY**: ¥99 bis ¥999<br/>**NZD**: $0,99 bis $99,99<br/>**USD**: $0,99 bis $99,99 |
| Name des Zugangspasses     | `String` | `'Nicht zutreffend'` | Der Name des Produkts. Dies wird im Kassenformular verwendet, um dem Benutzer zu beschreiben, was er kauft.                                                                                                                                                                                                                                                                                                         |
| Währung                    | `String` | `'usd'`              | Die Währung, die dem Benutzer in Rechnung gestellt wird. Kann `'aud'`, `'cad'`, `'gbp'`, `'jpy'`, `'nzd'`, oder `'usd'` sein.                                                                                                                                                                                                                                                                                       |
| Sprache der Checkout-Seite | `String` | `'en-US'`            | Die Sprache, die dem Endbenutzer auf der sicheren Kassenseite angezeigt wird. Kann `'en-US'` (Englisch - Vereinigte Staaten) oder `'ja-JP'` (Japanisch) sein.                                                                                                                                                                                                                                                       |
