---
id: html
description: Cette section explique comment exporter un paquet HTML5.
---

# HTML

## Exportation d'un ensemble HTML5 {#exporting-an-html5-bundle}

:::info[Important]
Pour l'instant, les expériences de réalité augmentée ne sont pas encore fournies par l'exportation HTML5.
Votre projet doit utiliser des caméras 3D pour fonctionner correctement.
:::

1. L'exportation HTML5 n'est actuellement disponible que pour les comptes payants. Veuillez consulter les [Paramètres du compte] (/account/settings/) pour plus de détails.

2. **Ouvrez votre projet Studio**.

3. Cliquez sur **Publier**. Dans la section **Export**, sélectionnez **HTML5**.

4. Sélectionnez un environnement à partir duquel vous souhaitez créer votre paquet.

5. Cliquez sur **Construire** pour générer votre paquet HTML5.

> Une fois la compilation terminée, téléchargez le fichier `.zip` en utilisant les liens de téléchargement fournis dans le résumé de la compilation.

---

## Publier votre projet 8th Wall sur les plateformes de jeux

Comme les packs HTML5 de 8th Wall sont des constructions complètes, ils peuvent être auto-hébergés ou publiés sur de nombreuses plates-formes de jeu.

### Auto-hébergement

:::note
L'offre groupée HTML5 peut être auto-hébergée ou déployée de différentes manières. Les instructions ci-dessous ne sont qu'un exemple d'utilisation de `npm`.
Pour des informations plus complètes sur l'auto-hébergement, consultez ce [guide](https://github.com/mikeroyal/Self-Hosting-Guide).
:::

1. Téléchargez le paquet `.zip`, puis décompressez le fichier.
2. Si vous n'avez pas encore installé `npm`, suivez les instructions de cette [page](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) pour l'installer.
3. Lancez `npm install --global http-server` pour installer le paquet npm [http-server](https://www.npmjs.com/package/http-server) en tant qu'outil CLI global.
4. Exécutez `http-server <path_to_unzipped_folder>`.
   1. Exemple : `http-server /Users/John/Downloads/mon-projet`
5. Il devrait y avoir des journaux qui listent une série d'URL locales comme :

```sh
Available on:
  http://127.0.0.1:8080
  http://192.168.20.43:8080
  http://172.29.29.159:8080
```

6. Ouvrez l'un des URL dans votre navigateur web.

### Itch.io

1. Téléchargez le paquet `.zip`.
2. Connectez-vous à [Itch.io](https://itch.io) et [créez un nouveau projet](https://itch.io/game/new).
3. Complétez les détails du projet :
   - Sous **Kind of project**, sélectionnez **HTML**.
   - Sous **Transferts**, sélectionnez **Transferts de fichiers**. Téléchargez le fichier `.zip` que vous avez téléchargé à l'étape 1. Cochez la case **Ce fichier sera lu dans le navigateur**.
   - Sous **Options d'encastrement**, choisissez la taille appropriée à votre projet.
4. Terminez la configuration de votre jeu et publiez-le.

### Viverse

1. Connectez-vous à [Viverse](https://viverse.com) et [allez à Viverse Studio](https://studio.viverse.com).
2. Sous **Télécharger votre propre construction**, cliquez sur **Télécharger**.
3. Cliquez sur **Créer un nouveau monde**.
4. Saisissez le **Nom** et la **Description** de votre projet, puis cliquez sur **Créer**.
5. Cliquez sur **Versions de contenu**.
6. Sous **Nouvelle version**, cliquez sur **Sélectionner un fichier**. Téléchargez le fichier `.zip` que vous avez téléchargé à l'étape 1, puis cliquez sur **Upload**.
7. Sous **Support iframe pour l'aperçu**, cliquez sur **Appliquer les paramètres iframe** et activez toutes les autorisations requises par votre projet.
   - Notez que Viverse placera votre projet téléchargé depuis 8th Wall dans son propre iFrame, et l'iFrame Viverse devra accorder une permission que votre projet requiert.
8. Terminez la configuration de votre jeu et publiez-le.

### Jeu Jolt

1. Connectez-vous à [Game Jolt](https://gamejolt.com) et [allez au magasin Game Jolt](https://gamejolt.com/games).
2. Cliquez sur **Ajouter votre jeu**.
3. Saisissez les détails du projet et cliquez sur **Save & Next**.
4. Sur le tableau de bord de votre jeu, sous **Packages**, cliquez sur **Add Package**.
5. Sous **Modifier le paquet**, cliquez sur **Nouvelle version**.
6. Cliquez sur **Upload Browser Build**. Téléchargez le fichier `.zip` que vous avez téléchargé à l'étape 1.
7. Configurez les dimensions de votre jeu ou sélectionnez **Adapter à l'écran?** si vous voulez que le jeu s'adapte à l'écran.
8. Terminez la configuration de votre jeu et publiez-le.

### GamePix

:::info[Important]
GamePix n'autorise pas les jeux comportant des liens externes. Assurez-vous que votre projet n'effectue PAS d'appels réseau en dehors du bundle.
:::

1. Télécharger le **Code d'intégration HTML** complet.pdf
2. Créez un [compte de développeur GamePix] (https://partners.gamepix.com/join-us?t=developer) et accédez au [tableau de bord GamePix] (https://my.gamepix.com/dashboard).
3. Cliquez sur **Créer un nouveau jeu**.
4. Entrez les détails du jeu et cliquez sur **Créer**.
5. Sous **Info**, sélectionnez **HTML5-JS** sous **Game Engine**.
6. Sous **Construction**, cliquez sur **Explorer le fichier**. Téléchargez le fichier `.zip` que vous avez téléchargé précédemment.
7. Terminez la configuration de votre jeu et publiez-le.

### Newgrounds

1. Télécharger le code d'intégration **Full HTML**. Créez un fichier `.zip` de ce fichier `index.html`.
2. Créez un [compte Newgrounds](https://www.newgrounds.com).
3. Cliquez sur la flèche dans le coin supérieur droit et sélectionnez **Jeu (swf, HTML5)**.
4. Sous **Fichier(s) de soumission**, cliquez sur **Télécharger le fichier**. Téléchargez le fichier `.zip` que vous avez téléchargé précédemment.
5. Configurez les dimensions de votre jeu et vérifiez **Compatibilité avec les écrans tactiles**
6. Terminez la configuration de votre jeu et publiez-le.

### Y8

1. Télécharger le code d'intégration **Full HTML**. Créez un fichier `.zip` de ce fichier `index.html`.
2. Connectez-vous à [Y8](https://www.y8.com/upload).
3. Assurez-vous d'avoir vérifié votre adresse e-mail, puis [créez un compte de stockage Y8 gratuit] (https://account.y8.com/storage_account).
4. Sous **Jeu**, choisissez **Zip** puis **HTML5**.
5. Cliquez sur **Choisir un fichier**. Téléchargez le fichier `.zip` que vous avez téléchargé précédemment. Si vous n'avez pas créé de compte de stockage, l'opération échouera. Si cela se produit, cliquez sur **Créer un compte de stockage** pour en créer un, puis actualisez la page **Télécharger votre contenu sur Y8** et réessayez.
6. Terminez la configuration de votre jeu et publiez-le.

### Poki

1. Va sur le [Portail des développeurs Poki] (https://developers.poki.com/share).
2. Remplissez les détails de votre projet, en utilisant le lien vers votre projet hébergé sous **Lien vers votre jeu**.
3. Cliquez sur **Partagez votre jeu**.

### Kongregate

1. Envoyez un courriel à l'équipe de Kongregate à [bd@kongregate.com](mailto:bd@kongregate.com). Incluez le lien vers votre projet hébergé dans votre courriel.

### Jeux d'armure

1. Envoyez un courriel à l'équipe d'Armor Games à [mygame@armorgames.com](mailto:mygame@armorgames.com). Incluez le lien vers votre projet hébergé dans votre courriel.

### Jeux addictifs

1. Télécharger le code d'intégration **Full HTML**.
2. Envoyez un courriel à l'équipe d'Addicting Games à [games@addictinggames.com](mailto:games@addictinggames.com). Incluez le fichier `.zip` dans votre e-mail, ainsi que toutes les autres informations demandées dans le [Addicting Games Developer Center] (https://www.addictinggames.com/about/upload#Send).

### Décalé

1. Envoyez un courriel à l'équipe de Lagged à [contact@lagged.com](mailto:contact@lagged.com). Incluez le lien vers votre projet hébergé dans votre courriel.
2. Une fois que vous êtes approuvé, vous pouvez [vous inscrire pour un compte Lagged](https://lagged.dev/signup) en utilisant le **Code d'invitation** qu'ils vous fourniront et télécharger votre jeu.

### Discord

#### Exemple de projet

Pour commencer à utiliser le Discord Embedded SDK dans votre projet, vous pouvez essayer notre exemple de projet.

1. Naviguez vers https://www.8thwall.com/8thwall/discord-activity-example et clonez le projet dans votre espace de travail.
2. Suivez les étapes décrites dans [Exportation d'un ensemble HTML5](#exporting-an-html5-bundle)
3. Téléchargez le fichier `.zip` à l'endroit de votre choix.

#### Mise en place du développeur Discord

Pour utiliser un client web dans Discord, vous devez créer un compte et une application dans le hub des développeurs.

1. Créez un compte Discord et rendez-vous sur https://discord.com/developers/applications

2. Créez une nouvelle application en cliquant sur le bouton situé dans le coin supérieur droit.
   1. Saisissez un nom pour l'application et acceptez les conditions d'utilisation.

![New Activity](/images/studio/native-app-export/discord/new-activity.png)

3. Allez sur la page **OAuth2**, dans la section **Paramètres** :
   1. Ajouter `http://127.0.0.1` comme URI de redirection pour les tests.
   2. Sauvegardez l'identifiant du client dans un endroit sûr.
   3. Cliquez sur "Réinitialiser le secret" pour récupérer le `secret du client` et le conserver en lieu sûr.
   4. Appuyez sur "Enregistrer" pour conserver vos paramètres.

![Redirect](/images/studio/native-app-export/discord/redirect.png)

4. Naviguez jusqu'à la page **URL Mappings**, sous la section **Activités** :
   1. Ajoutez une cible temporaire au mappage de la racine comme `127.0.0.1:8888`. Elle sera remplacée ultérieurement par votre URL publique, mais elle est nécessaire pour activer les activités à l'étape suivante.

5. Allez sur la page **Paramètres**, dans la section **Activités** :
   1. Activez **Activer les activités** et acceptez l'accord du lanceur d'applications.

![Enable Activity](/images/studio/native-app-export/discord/enable-activity.png)

6. Ensuite, allez dans l'onglet **Installation**, sous la section **Paramètres** :
   1. Copiez le lien du panneau **Lien d'installation** et ouvrez-le dans votre navigateur.
   2. Installer l'application pour la rendre accessible sur n'importe quel serveur ou DM.

#### Lancement d'une application

1. Configurer le code du serveur d'exemple à l'adresse https://github.com/8thwall/discord-activity-example
   1. `git clone https://github.com/8thwall/discord-activity-example`
   2. Exécutez `npm install`
   3. Décompressez le fichier `.zip` téléchargé précédemment et contenant le frontend du projet.
   4. Créez un fichier `.env` à la racine du repo, et remplissez-le avec les détails du portail des développeurs Discord :
   ```
   DISCORD_CLIENT_ID=XXXXXXXXXX
   DISCORD_CLIENT_SECRET=XXXXXXXXXX
   DISCORD_CLIENT_HOST_PATH=/path/to/unzipped/folder
   ```
   5. Entrez `npm start` pour démarrer le serveur.

2. Utilisez `cloudflared` pour créer un tunnel, ainsi le projet sera accessible publiquement sur internet.

   1. `brew install cloudflared` pour télécharger l'outil CLI `cloudflared`.
   2. Exécutez `cloudflared tunnel --url http://localhost:8888`.
   3. Notez l'URL qui a été générée.

   Exemple :

   ```
   2025-10-11T03:05:16Z INF +--------------------------------------------------------------------------------------------+
   2025-10-11T03:05:16Z INF |  Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):  |
   2025-10-11T03:05:16Z INF |  https://sporting-follow-audit-href.trycloudflare.com                                      |
   2025-10-11T03:05:16Z INF +--------------------------------------------------------------------------------------------+
   ```

   4. Ouvrez l'URL `cloudflared` dans votre navigateur pour vous assurer que le projet se charge.

3. Mettez à jour les paramètres de votre application Discord :
   1. Ouvrez le portail des développeurs Discord et accédez à votre application.
   2. Allez dans **URL Mappings** dans la section **Activités**.
   3. Remplacez la cible temporaire par votre URL `cloudflared` pour le **Root Mapping**.

![Cloudflare URL](/images/studio/native-app-export/discord/cloudflare-url.png)

4. Testez votre activité Discord :
   1. Ouvrez Discord et naviguez vers n'importe quel DM ou serveur.
   2. Cliquez sur l'icône des activités (manette de jeu) dans les commandes du canal vocal.
   3. Recherchez et cliquez sur votre application dans le panneau **Apps & Commands**.

![Example Final View](/images/studio/native-app-export/discord/example-final-view.jpeg)
