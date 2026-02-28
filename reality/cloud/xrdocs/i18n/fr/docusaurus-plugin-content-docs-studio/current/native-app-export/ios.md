---
id: iOS
description: Cette section explique comment exporter vers iOS.
---

# iOS

## Exportation vers iOS

1. **Ouvrez votre projet Studio**. S'assurer que le projet répond aux [critères d'exigence] (/studio/native-app-export/#requirements).

2. Cliquez sur **Publier**. Sous **Export**, sélectionnez **iOS**.

3. **Personnalisez votre application:**
   - **Nom d'affichage** : Le nom affiché sur l'écran d'accueil d'iOS
   - **(Facultatif)** Télécharger une **icône d'application** (1024x1024 ou plus)

4. **Terminer la configuration Apple:** Dans cette étape, vous allez configurer les identifiants de signature nécessaires à la création et à l'exécution de votre application iOS. Vous devez sélectionner un type de signature ou les deux : Développement ou Distribution, et télécharger le certificat et le profil de provisionnement correspondants pour chacun d'eux. Toutes ces étapes doivent être réalisées sans quitter le flux d'exportation de l'application native dans Studio.

   - **Bundle Identifier** : Une chaîne unique, par exemple `com.mycompany.myapp` cette chaîne doit correspondre aux paramètres du compte développeur d'Apple afin de télécharger l'application pour distribution/test.

   - **Type de signature** :

     i. **Développement Apple** - Utilisez cette option si vous souhaitez créer et tester votre application sur des appareils enregistrés pendant le développement.

     1. **Générer une demande de signature de certificat (CSR)**
        a. Dans Studio, cliquez sur _Add New Certificate_, puis sur _Create Certificate Signing Request_.

     2. **Créer un certificat de développement**
        a. Connectez-vous à votre [compte de développeur Apple] (https://developer.apple.com/account/resources/certificates/add).
        b. Utilisez la demande de signature de certificat pour créer un certificat Apple Development ou iOS Development, puis téléchargez-le.
        c. Référence : [Apple : Créer un certificat de développement](https://developer.apple.com/help/account/certificates/create-a-development-certificate).

     3. **Télécharger le certificat**
        a. Dans Studio, téléchargez le certificat de développement sous _Upload Certificate._

     4. **Créer un profil de provisionnement**
        a. Dans votre compte Apple Developer, créez un profil de provisionnement pour le développement d'applications iOS.
        b. Associez-le au certificat de développement et à l'identifiant d'application corrects (vous devrez peut-être d'abord en créer un).
        i. Pour créer un App ID, allez sur [Apple : Create an App ID](https://developer.apple.com/account/resources/identifiers/add/bundleId) et choisissez App IDs. Sélectionnez ensuite _App_. Rédigez ensuite la description et l'identifiant de l'offre groupée.
        - Certaines équipes préfèrent utiliser un identifiant d'ensemble de caractères génériques pendant le développement, car cela permet de partager le même identifiant d'application et le même profil de provisionnement entre différentes applications. Pour ce faire, choisissez **Description = Wildcard Development** et **Bundle ID = Explicit** avec la valeur `com.mycompany.*`.
          c. Référence : [Apple : Créer un profil de provisionnement de développement](https://developer.apple.com/help/account/provisioning-profiles/create-a-development-provisioning-profile).

     5. **Télécharger le profil de provisionnement du développement**
        a. Dans Studio, téléchargez le profil de développement sous _Upload Provisioning Profile._.

     ii. **Distribution Apple** - Utilisez cette option lorsque vous préparez votre application pour une diffusion via TestFlight, l'App Store ou une distribution d'entreprise.

     1. **Générer une demande de signature de certificat (CSR)**
        a. Dans Studio, cliquez sur _Add New Certificate_, puis sur _Create Certificate Signing Request_.

     2. **Créer un certificat de distribution**
        a. Connectez-vous à votre compte de développeur Apple.
        b. Utilisez la demande de signature de certificat pour créer un certificat Apple Distribution (ou iOS Distribution - App Store Connect et Ad Hoc), puis téléchargez-le.
        c. Référence : [Apple : Certificate overview](https://developer.apple.com/help/account/certificates/certificates-overview).

     3. **Télécharger le certificat**
        a. Dans Studio, téléchargez le certificat de distribution sous _Upload Certificate._

     4. **Créer un profil de provisionnement**
        a. Dans votre compte Apple Developer, créez un profil de provisionnement App Store (pour les versions TestFlight/App Store) ou Ad Hoc (pour une distribution limitée d'appareils).
        b. Associez-le au certificat de distribution et à l'identifiant d'application corrects (il peut être nécessaire d'en créer un au préalable).
        i. Contrairement à ce qui se passe pour le développement, pour la distribution vous devez créer un App ID uniquement pour cette application, et non pas un Wildcard Bundle ID.
        c. Référence : [Apple : Créer un profil d'approvisionnement de distribution](https://developer.apple.com/help/account/provisioning-profiles/create-an-app-store-provisioning-profile).

     5. **Télécharger le profil de provisionnement de la distribution**
        a. Dans Studio, téléchargez le profil de provisionnement de la distribution sous _Upload Provisioning Profile._

   - Une fois que vous avez téléchargé les certificats et les profils de provisionnement nécessaires pour le développement et/ou la distribution, cliquez sur **Save** pour confirmer votre configuration de signature Apple.

5. **Configurer les autorisations (facultatif):**
   Indiquez les autorisations de capteur dont votre application peut avoir besoin pour fonctionner correctement, et définissez éventuellement un texte personnalisé pour l'invite d'autorisation. Cette étape est nécessaire pour soumettre avec succès votre application à l'App Store.

   - **Caméra** : Sélectionnez si l'application utilise l'un des appareils photo de l'appareil (comme pour les effets de visage ou les effets de monde).
   - **Localisation** : Sélectionnez si l'application utilise la localisation GPS (comme pour le VPS).
   - **Microphone** : Sélectionnez cette option si l'application utilise le microphone de l'appareil (comme pour l'enregistreur multimédia ou l'interaction vocale).

6. Une fois que les informations de base de votre application sont remplies, que la configuration Apple est complète et que les permissions sont définies, cliquez sur **Continuer** pour finaliser la configuration de la construction.

---

## Finalisation des paramètres de construction

Vous allez maintenant définir la façon dont votre application est emballée :

- **Version** : Utiliser le versionnement sémantique (par exemple 1.0.0) ([Versionnement sémantique](https://semver.org/))

- **Orientation** :
  - Portrait : Maintient l'application en position verticale, même lorsque l'appareil est tourné.
  - Paysage gauche : affiche l'application horizontalement, l'appareil étant tourné de manière à ce que le côté gauche soit en bas.
  - Paysage à droite : Affiche l'application horizontalement, l'appareil étant tourné de manière à ce que le côté droit soit en bas.
  - Rotation automatique : Permet à l'application de suivre la rotation physique de l'appareil, en passant automatiquement de l'affichage vertical à l'affichage horizontal.
  - Rotation automatique (paysage uniquement) : Ajuste la position de l'application en fonction de la rotation de l'appareil, mais la limite aux vues horizontales uniquement.

- **Status Bar** :
  - Oui : affiche la barre d'état du système par défaut sur l'application.
  - Non : masque la barre d'état du système par défaut.

- **Mode de construction**:
  - Ensemble statique : Construction autonome complète (note : les applications qui utilisent des fonctionnalités AR nécessitent toujours une connexion internet, même s'il s'agit d'un Static Bundle).
  - Live Reload : Imprime les mises à jour de Studio au fur et à mesure que votre projet est mis à jour.

- **Environnement** : Sélectionnez Dev, Latest, Staging ou Production.

- **Type de signature** :
  - Développement : Sélectionnez cette option lorsque vous construisez et testez votre application pendant le développement. Il vous permet d'exécuter l'application sur des appareils enregistrés à l'aide de votre profil de développement et de vos certificats.
  - Distribution : Sélectionnez cette option lorsque vous préparez votre application pour une diffusion, que ce soit pour TestFlight, l'App Store ou une distribution interne ou d'entreprise. Elle utilise votre profil de distribution et vos certificats pour s'assurer que l'application peut être installée et approuvée sur les appareils des utilisateurs finaux.

7. Lorsque tout est prêt, cliquez sur **Build** pour générer votre paquet d'applications.

8. Une fois la compilation terminée, téléchargez le fichier `.ipa` en utilisant les liens de téléchargement fournis dans le résumé de la compilation.

---

## Publier sur l'App Store

Une fois l'exportation terminée, vous êtes prêt à publier votre application sur l'App Store à l'aide de l'IPA (iOS App Store Package). Lorsque vous êtes prêt à partager votre application avec d'autres personnes ou à la publier, vous devez utiliser l'App Store Connect d'Apple et soit TestFlight (pour les tests bêta), soit la distribution dans l'App Store. Le processus de haut niveau est le suivant :

1. **Préparez un enregistrement App Store Connect** : Connectez-vous à App Store Connect (avec votre compte Apple Developer) et créez une entrée App si vous ne l'avez pas encore fait. Dans le tableau de bord App Store Connect, allez dans _Mes applications_ et cliquez sur le "+" pour ajouter une nouvelle application. Choisissez iOS comme plateforme, entrez le nom de votre application, sélectionnez l'identifiant d'offre groupée correct (tel que configuré dans votre projet 8th Wall), et fournissez une UGS et une langue principale, puis _Créez_ l'application.

2. **Téléchargez le fichier .ipa à l'aide de Transporter** : Assurez-vous que le fichier .ipa est signé avec votre certificat de distribution et votre profil de provisionnement (distribution App Store). Apple n'accepte pas les versions signées par les développeurs pour la distribution TestFlight/App Store. Sur un Mac, la méthode de téléchargement la plus simple est l'application Transporter d'Apple. Installez Transporter depuis le Mac App Store, ouvrez-le et connectez-vous avec votre identifiant Apple (compte développeur). Cliquez ensuite sur le "+" et ajoutez votre fichier .ipa (ou faites glisser le .ipa dans Transporter) et cliquez sur _Deliver_ pour le télécharger. Transporter validera le fichier et le soumettra à App Store Connect. (Vous pouvez également télécharger des builds via l'Archive Organizer de Xcode ou la commande `altool`).

3. **Activez les tests TestFlight (si nécessaire)** : Une fois que le build apparaît dans App Store Connect (sous l'onglet TestFlight de votre application), vous pouvez le distribuer aux testeurs.
   - Tests internes : jusqu'à 100 membres, attribution immédiate de la version.
   - Tests externes : jusqu'à 10 000 utilisateurs, nécessite un examen bêta de l'application.

4. **Soumission à l'App Store** : Pour publier l'application dans l'App Store public, allez sur la page App Store de l'application dans App Store Connect. Remplissez toutes les métadonnées requises : captures d'écran, description, catégorie, prix, URL de la politique de confidentialité, etc. Joignez la version téléchargée, puis cliquez sur _Submit for Review_. Apple procédera alors à un examen complet de l'application.

🔗 [Apple : Téléchargez votre application sur App Store Connect](https://developer.apple.com/help/app-store-connect/manage-builds/upload-builds/#:~:text=After%20adding%20an%20app%20to,testing%20%2C%20or%20%2075)

---

## Installation directe sur un appareil iOS

Pour installer un fichier `.ipa` signé par les développeurs (par exemple, de 8th Wall) sur un iPhone ou un iPad à des fins de test, vous devez le charger de manière latérale à l'aide des outils d'Apple :

1. **Vérifier le provisionnement** : Assurez-vous que l'UDID de l'appareil est inclus dans le profil de provisionnement de l'application. Un `.ipa` de développement ou ad hoc ne s'installera que sur les appareils enregistrés dans ce profil. Si ce n'est pas le cas, vous devrez ajouter votre appareil au profil de provisionnement, puis télécharger à nouveau votre profil de provisionnement sur la page Configuration complète d'Apple, sous Développement Apple, puis régénérer l'application `.ipa` signée avec le profil qui contient votre appareil.

2. **Installer sur le périphérique** :
   a. **En utilisant Xcode** : Sur macOS, connectez votre appareil iOS via USB (et appuyez sur "Trust" si l'appareil vous le demande). Lancez Xcode et allez dans _Fenêtre > Appareils et simulateurs_ Sélectionnez votre iPhone/iPad dans la liste de gauche. (Assurez-vous que le mode développeur est activé sur l'appareil pour iOS 16+ ; sinon, iOS bloquera l'exécution de l'application). Installez le fichier `.ipa` en utilisant Xcode : Glissez-déposez le fichier `.ipa` dans la section "Apps installées" du panneau de votre appareil dans la fenêtre Appareils de Xcode. Xcode copiera l'application sur l'appareil et la vérifiera. Après quelques instants, l'icône de l'application devrait apparaître sur votre appareil.

   b. **En utilisant Apple Configurator 2** : Il s'agit d'une application Mac gratuite d'Apple qui peut être utilisée pour installer le fichier `.ipa`. Ouvrez le Configurateur, connectez votre appareil, puis choisissez _Actions > Ajouter > Apps > Choisir dans mon Mac…_ et sélectionnez le fichier `.ipa`. L'application sera ainsi déployée sur l'appareil de la même manière.

   c. **En utilisant Music (anciennement iTunes)** : Ouvrez l'application Musique, connectez votre appareil, sélectionnez votre appareil dans la barre latérale gauche, puis faites glisser le fichier `.ipa` dans la fenêtre principale. Après quelques instants, l'application devrait apparaître sur votre appareil. Si vous ne la voyez pas, faites défiler les pages d'accueil de vos applications.

3. **Faites confiance au certificat du développeur** : Si l'application a été signée avec un certificat d'entreprise ou de développement, il se peut que vous deviez l'approuver manuellement sur l'appareil avant qu'elle ne s'exécute. Sur l'iPhone/iPad, allez dans _Réglages > Général > VPN et gestion des appareils_ (ou _Profils et gestion des appareils_ sur les anciens iOS) et trouvez le profil du développeur de l'application. Appuyez sur _Confiance [Développeur]_ et confirmez la confiance accordée au certificat. Cette étape n'est pas nécessaire pour les applications App Store/TestFlight, mais peut l'être pour les installations directes.

4. **Lancez l'application** : Ouvrez l'application sur votre appareil. L'application devrait se lancer si le profil et le certificat sont valides et si l'appareil est en mode développeur (pour iOS 16+). Si vous obtenez une erreur du type "l'intégrité n'a pas pu être vérifiée", cela signifie généralement que l'appareil n'est pas provisionné, que l'application n'est pas correctement signée ou que le mode développeur est désactivé. Une fois correctement installée et approuvée, la version de développement s'exécutera sur votre appareil physique.
