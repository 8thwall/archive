---
id: iOS
description: 'In diesem Abschnitt wird erklärt, wie man nach iOS exportiert.'
---

# iOS

## Exportieren nach iOS

1. **Öffnen Sie Ihr Studio-Projekt**. Sicherstellen, dass das Projekt die [Anforderungskriterien](/studio/native-app-export/#requirements) erfüllt.

2. Klicken Sie auf **Veröffentlichen**. Wählen Sie unter **Export** die Option **iOS**.

3. **Passen Sie Ihre App-Erstellung an:**
   - **Anzeige-Name**: Der Name, der auf dem iOS-Startbildschirm angezeigt wird
   - **(Optional)** Laden Sie ein **App-Symbol** hoch (1024x1024 oder größer)

4. **Vollständige Apple-Konfiguration:** In diesem Schritt konfigurieren Sie die Anmeldedaten, die für die Erstellung und Ausführung Ihrer iOS-App erforderlich sind. Sie müssen einen oder beide Signierungstypen auswählen: Entwicklung oder Verteilung, und laden Sie das entsprechende Zertifikat und das Bereitstellungsprofil für beide hoch. Alle diese Schritte sollten abgeschlossen werden, ohne den Native App Export Flow in Studio zu verlassen.

   - **Bundle-Bezeichner**: Eine eindeutige Zeichenkette, z. B. "com.mycompany.myapp". Diese Zeichenkette muss mit den Einstellungen des Apple-Entwicklerkontos übereinstimmen, damit die App zur Verteilung/Testung hochgeladen werden kann.

   - **Zeichnungsart**:

     i. **Apple-Entwicklung** - Verwenden Sie diese Option, wenn Sie Ihre App während der Entwicklung auf registrierten Geräten erstellen und testen möchten.

     1. **Generieren Sie eine Zertifikatssignierungsanforderung (CSR)**
        a. Klicken Sie in Studio auf _Neues Zertifikat hinzufügen_ und dann auf _Zertifikatssignierungsanforderung erstellen_.

     2. **Ein Entwicklungszertifikat erstellen**
        a. Melden Sie sich bei Ihrem [Apple Developer Account](https://developer.apple.com/account/resources/certificates/add) an.
        b. Verwenden Sie die Zertifikatsignierungsanforderung, um ein Apple Development- oder iOS Development-Zertifikat zu erstellen, und laden Sie es dann herunter.
        c. Referenz: [Apple: Erstellen eines Entwicklungszertifikats](https://developer.apple.com/help/account/certificates/create-a-development-certificate).

     3. **Das Zertifikat hochladen**
        a. In Studio laden Sie das Entwicklungszertifikat unter _Zertifikat hochladen_ hoch.

     4. **Ein Bereitstellungsprofil erstellen**
        a. Erstellen Sie in Ihrem Apple Developer Account ein iOS App Development Provisioning Profil.
        b. Verknüpfen Sie es mit dem richtigen Entwicklungszertifikat und dem App-Identifikator (möglicherweise müssen Sie zuerst einen erstellen).
        i. Um eine App-ID zu erstellen, gehen Sie zu [Apple: App-ID erstellen](https://developer.apple.com/account/resources/identifiers/add/bundleId) und wählen Sie App-IDs. Wählen Sie dann _App_. Schreiben Sie dann die Beschreibung und die Bündel-ID dazu.
        - Einige Teams bevorzugen die Verwendung einer Wildcard-Bundle-ID für die Entwicklungsphase, da Sie so dieselbe App-ID und dasselbe Bereitstellungsprofil für verschiedene Apps verwenden können. Wählen Sie dazu **Beschreibung = Wildcard-Entwicklung** und **Bündel-ID = Explizit** mit einem Wert von "com.mycompany.\*".
          c. Referenz: [Apple: Erstellen eines Entwicklungsbereitstellungsprofils](https://developer.apple.com/help/account/provisioning-profiles/create-a-development-provisioning-profile).

     5. **Hochladen des Entwicklungsbereitstellungsprofils**
        a. Laden Sie in Studio das Entwicklungs-Bereitstellungsprofil unter _Bereitstellungsprofil hochladen_ hoch.

     ii. **Apple Distribution** - Verwenden Sie diese Option, wenn Sie Ihre App für die Veröffentlichung über TestFlight, den App Store oder die Unternehmensverteilung vorbereiten.

     1. **Generieren Sie eine Zertifikatssignierungsanforderung (CSR)**
        a. Klicken Sie in Studio auf _Neues Zertifikat hinzufügen_ und dann auf _Zertifikatssignierungsanforderung erstellen_.

     2. **Verteilungszertifikat erstellen**
        a. Melden Sie sich bei Ihrem Apple Developer Account an.
        b. Verwenden Sie die Zertifikatsignierungsanforderung, um ein Apple Distribution-Zertifikat (oder iOS Distribution - App Store Connect und Ad Hoc) zu erstellen, und laden Sie es dann herunter.
        c. Referenz: [Apple: Zertifikatsübersicht](https://developer.apple.com/help/account/certificates/certificates-overview).

     3. **Das Zertifikat hochladen**
        a. Laden Sie in Studio das Verteilungszertifikat unter _Zertifikat hochladen_ hoch.

     4. **Ein Bereitstellungsprofil erstellen**
        a. Erstellen Sie in Ihrem Apple Developer Account ein App Store (für TestFlight/App Store Freigabe) oder Ad Hoc (für begrenzte Geräteverteilung) Bereitstellungsprofil.
        b. Verknüpfen Sie es mit dem korrekten Verteilungszertifikat und der App-Kennung (möglicherweise müssen Sie zuerst eine erstellen).
        i. Anders als bei der Entwicklung sollten Sie für die Verteilung eine App-ID nur für diese App erstellen, keine Wildcard-Bundle-ID.
        c. Referenz: [Apple: Erstellen eines Distributions-Bereitstellungsprofils](https://developer.apple.com/help/account/provisioning-profiles/create-an-app-store-provisioning-profile).

     5. **Hochladen des Bereitstellungsprofils für die Verteilung**
        a. Laden Sie in Studio das Bereitstellungsprofil für die Verteilung unter _Bereitstellungsprofil hochladen_ hoch.

   - Wenn Sie die erforderlichen Zertifikate und Bereitstellungsprofile für Entwicklung und/oder Verteilung hochgeladen haben, klicken Sie auf **Speichern**, um die Einrichtung der Apple-Signatur zu bestätigen.

5. **Zulassungen konfigurieren (optional):**
   Geben Sie die Sensorzulassungen an, die Ihre Anwendung benötigt, um ordnungsgemäß zu funktionieren, und legen Sie optional einen benutzerdefinierten Text für die Zulassungsaufforderung fest. Dieser Schritt ist erforderlich, um Ihre App erfolgreich beim App Store einzureichen.

   - **Kamera**: Wählen Sie aus, ob die Anwendung die Kamera des Geräts verwendet (z. B. für Gesichtseffekte oder Welteffekte)
   - **Standort**: Wählen Sie aus, ob die Anwendung GPS-Ortung verwendet (wie für VPS)
   - **Mikrofon**: Wählen Sie aus, ob die Anwendung das Mikrofon des Geräts verwendet (z. B. für Media Recorder oder Sprachinteraktion)

6. Wenn Sie die grundlegenden Informationen zu Ihrer App eingegeben haben, die Apple-Konfiguration abgeschlossen ist und die Berechtigungen festgelegt sind, klicken Sie auf **Fortfahren**, um die Build-Konfiguration abzuschließen.

---

## Abschluss der Build-Einstellungen

Jetzt legen Sie fest, wie Ihre Anwendung verpackt wird:

- **Version**: Semantische Versionierung verwenden (z.B. 1.0.0) ([Semantische Versionierung](https://semver.org/))

- **Orientierung**:
  - Hochformat: Die App bleibt in einer vertikalen Position, auch wenn das Gerät gedreht wird.
  - Querformat links: Zeigt die App horizontal an, wobei das Gerät so gedreht wird, dass die linke Seite nach unten zeigt.
  - Querformat rechts: Zeigt die App im Querformat an, wobei das Gerät so gedreht wird, dass die rechte Seite nach unten zeigt.
  - Automatisches Drehen: Ermöglicht es der App, der physischen Drehung des Geräts zu folgen und automatisch zwischen vertikaler und horizontaler Ansicht zu wechseln.
  - Automatisches Drehen (nur im Querformat): Passt die Position der App auf der Grundlage der Gerätedrehung an, beschränkt sie jedoch auf horizontale Ansichten.

- **Statusleiste**:
  - Ja: Zeigt die Standard-Systemstatusleiste über der Anwendung an.
  - Nein: Blendet die Standard-Systemstatusleiste aus.

- **Build-Modus**:
  - Statisches Bundle: Vollständig eigenständiges Build (Hinweis: Anwendungen, die AR-Funktionen verwenden, benötigen immer noch eine Internetverbindung, auch wenn sie ein Static Bundle sind)
  - Live-Neuladen: Zieht Aktualisierungen aus Studio, wenn Ihr Projekt aktualisiert wird

- **Umgebung**: Wählen Sie zwischen Dev, Latest, Staging oder Production

- **Zeichnungsart**:
  - Entwicklung: Wählen Sie diese Option, wenn Sie Ihre Anwendung während der Entwicklung erstellen und testen. Sie ermöglicht es Ihnen, die Anwendung auf registrierten Geräten unter Verwendung Ihres Entwicklungsbereitstellungsprofils und Ihrer Zertifikate auszuführen.
  - Verteilung: Wählen Sie diese Option, wenn Sie Ihre App für die Veröffentlichung vorbereiten, sei es für TestFlight, den App Store oder die unternehmensinterne Verteilung. Dabei werden Ihr Bereitstellungsprofil und Ihre Zertifikate verwendet, um sicherzustellen, dass die App auf den Geräten der Endbenutzer installiert werden kann und vertrauenswürdig ist.

7. Wenn alles eingestellt ist, klicken Sie auf **Build**, um Ihr Anwendungspaket zu erstellen.

8. Sobald der Build abgeschlossen ist, laden Sie die "ipa"-Datei über die in der Build-Zusammenfassung angegebenen Download-Links herunter.

---

## Veröffentlichung im App Store

Sobald der Export abgeschlossen ist, können Sie Ihre App mit dem IPA (iOS App Store Package) im App Store veröffentlichen. Wenn Sie bereit sind, Ihre Anwendung mit anderen zu teilen oder zu veröffentlichen, verwenden Sie Apples App Store Connect und entweder TestFlight (für Betatests) oder die App Store Distribution. Der übergeordnete Prozess ist:

1. **Bereiten Sie einen App Store Connect Eintrag vor**: Melden Sie sich bei App Store Connect (mit Ihrem Apple Developer Account) an und erstellen Sie einen App-Eintrag, falls Sie das noch nicht getan haben. Gehen Sie im App Store Connect Dashboard zu _Meine Apps_ und klicken Sie auf das "+", um eine neue App hinzuzufügen. Wählen Sie iOS als Plattform, geben Sie den Namen Ihrer App ein, wählen Sie die korrekte Bundle-ID (wie in Ihrem 8th Wall-Projekt konfiguriert), geben Sie eine SKU und eine primäre Sprache an und _erstellen_ Sie dann die App.

2. **Laden Sie die .ipa-Datei mit Transporter** hoch: Vergewissern Sie sich, dass die .ipa-Datei mit Ihrem Verteilungszertifikat und Ihrem Bereitstellungsprofil (App Store-Verteilung) signiert ist. Apple akzeptiert keine von der Entwicklung signierten Builds für den Vertrieb über TestFlight/App Store. Auf einem Mac ist die einfachste Methode zum Hochladen die Transporter-App von Apple. Installieren Sie Transporter aus dem Mac App Store, öffnen Sie es und melden Sie sich mit Ihrer Apple ID (Developer Account) an. Klicken Sie dann auf das "+" und fügen Sie Ihre .ipa-Datei hinzu (oder ziehen Sie die .ipa-Datei in Transporter) und klicken Sie zum Hochladen auf _Liefern_. Transporter validiert die Datei und übermittelt sie an App Store Connect. (Sie können Builds auch über den Archive Organizer von Xcode oder den Befehl `altool` hochladen).

3. **Aktivieren Sie TestFlight-Tests (falls erforderlich)**: Sobald der Build in App Store Connect erscheint (unter der Registerkarte TestFlight Ihrer App), können Sie ihn an die Tester verteilen.
   - Interne Tests: bis zu 100 Mitglieder, sofortige Zuweisung von Builds.
   - Externe Tests: bis zu 10.000 Nutzer, erfordert Beta App Review.

4. **Einreichung im App Store**: Um die App für den öffentlichen App Store freizugeben, gehen Sie in App Store Connect auf die App Store-Seite der App. Füllen Sie alle erforderlichen Metadaten aus: Screenshots, Beschreibung, Kategorie, Preise, URL für Datenschutzbestimmungen usw. Hängen Sie das hochgeladene Build an und klicken Sie dann auf _Zur Prüfung vorlegen_. Apple wird dann eine vollständige Überprüfung der App vornehmen.

🔗 [Apple: Laden Sie Ihre App in App Store Connect hoch](https://developer.apple.com/help/app-store-connect/manage-builds/upload-builds/#:~:text=After%20adding%20an%20app%20to,testing%20%2C%20or%20%2075)

---

## Direktes Installieren auf einem iOS-Gerät

Um eine von der Entwicklung signierte `.ipa` (z.B. von 8th Wall) zu Testzwecken auf einem iPhone oder iPad zu installieren, müssen Sie sie mit Apples Werkzeugen per Sideload laden:

1. **Bereitstellung überprüfen**: Stellen Sie sicher, dass die UDID des Geräts im Bereitstellungsprofil der App enthalten ist. Eine Entwicklungs- oder Ad-hoc-"ipa" wird nur auf Geräten installiert, die in diesem Profil registriert sind. Wenn dies nicht der Fall ist, müssen Sie Ihr Gerät zum Bereitstellungsprofil hinzufügen und dann Ihr Bereitstellungsprofil auf der Seite "Vollständige Apple-Konfiguration" unter "Apple-Entwicklung" erneut hochladen und dann die mit dem Profil, das Ihr Gerät enthält, signierte "ipa"-App neu erstellen.

2. **Installation auf dem Gerät**:
   a. **Verwenden Sie Xcode**: Schließen Sie unter macOS Ihr iOS-Gerät über USB an (und tippen Sie auf "Vertrauen", wenn Sie dazu auf dem Gerät aufgefordert werden). Starten Sie Xcode und gehen Sie zu _Fenster > Geräte und Simulatoren_. Wählen Sie Ihr iPhone/iPad aus der linken Geräteliste aus. (Stellen Sie sicher, dass der Entwicklermodus auf dem Gerät für iOS 16+ aktiviert ist; andernfalls blockiert iOS die Ausführung der App). Installieren Sie die `.ipa` mit Xcode: Ziehen Sie die "ipa"-Datei auf den Abschnitt "Installierte Apps" in der Geräteleiste des Xcode-Fensters "Geräte". Xcode kopiert die Anwendung auf das Gerät und verifiziert sie. Nach einem kurzen Moment sollte das App-Symbol auf Ihrem Gerät erscheinen.

   b. **Verwendung von Apple Configurator 2**: Dies ist eine kostenlose Mac-Anwendung von Apple, die zur Installation der `.ipa` verwendet werden kann. Öffnen Sie Configurator, schließen Sie Ihr Gerät an und wählen Sie _Aktionen > Hinzufügen > Apps > Von meinem Mac wählen…_ und wählen Sie die `.ipa`-Datei. Dadurch wird die App in ähnlicher Weise auf dem Gerät bereitgestellt.

   c. **Verwendung von Musik (früher iTunes)**: Öffnen Sie die Musik-App, verbinden Sie Ihr Gerät, wählen Sie Ihr Gerät in der linken Seitenleiste aus und ziehen Sie dann die "ipa"-Datei auf das Hauptfenster. Nach einem kurzen Moment sollte die App auf Ihrem Gerät erscheinen. Beachten Sie, dass sie sich möglicherweise nicht auf der ersten Seite befindet - wenn Sie sie nicht sehen, blättern Sie durch Ihre App-Homepages.

3. **Vertrauen Sie dem Entwicklerzertifikat**: Wenn die App mit einem Unternehmens- oder Entwicklungszertifikat signiert wurde, müssen Sie ihr auf dem Gerät möglicherweise manuell vertrauen, bevor sie ausgeführt werden kann. Gehen Sie auf dem iPhone/iPad zu _Einstellungen > Allgemein > VPN & Gerätemanagement_ (bzw. _Profile & Gerätemanagement_ bei älteren iOS-Geräten) und suchen Sie das Profil für den Entwickler der App. Tippen Sie auf _Vertrauen [Entwickler]_ und bestätigen Sie, dass Sie dem Zertifikat vertrauen. Dieser Schritt ist für App Store/TestFlight-Anwendungen nicht erforderlich, kann aber für Direktinstallationen notwendig sein.

4. **Starten Sie die App**: Öffnen Sie nun die App auf Ihrem Gerät. Die App sollte starten, wenn das Profil und das Zertifikat gültig sind und sich das Gerät im Entwicklermodus befindet (für iOS 16+). Wenn Sie eine Fehlermeldung wie "Integrität konnte nicht überprüft werden" erhalten, bedeutet dies in der Regel, dass das Gerät nicht bereitgestellt wurde, die App nicht ordnungsgemäß signiert ist oder der Entwicklermodus deaktiviert ist. Nach der ordnungsgemäßen Installation und Vertrauensstellung wird das Entwicklungs-Build auf Ihrem physischen Gerät ausgeführt.
