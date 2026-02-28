---
id: monetize-with-8th-wall-payments
---

# paiements 8th Wall

8th Wall Payments offre aux développeurs les outils dont ils ont besoin pour ajouter des paiements sécurisés à leurs applications web AR et VR. Les développeurs peuvent utiliser le module de paiement qui se trouve dans le Cloud Editor pour ajouter facilement à leur projet des produits à acheter. Tous les paiements sont facilités par l'API 8th Wall Payments qui permet aux développeurs de collecter et de recevoir des paiements.

#### Pourquoi utiliser 8th Wall Payments ? {#why-use-8th-wall-payments}

Monétisez facilement vos expériences WebAR ou WebVR avec les paiements 8th Wall grâce au module de paiement. Basé sur Stripe, 8th Wall Payments offre aux utilisateurs finaux un moyen sûr de payer votre produit et vous permet de gagner de l'argent en développant des projets WebXR.

Avec le module 8th Wall Payments, vous disposez d'une importation en une étape qui vous permet de monétiser votre projet web AR ou web VR à l'aide d'options de paiement extensibles. Avec le module de paiement, vous pouvez facilement personnaliser les options de paiement telles que le coût et l'article que vous vendez, tout en tirant parti de notre flux de paiement rationalisé optimisé pour une utilisation sur mobile, ordinateur de bureau et VR. Accédez à tous les types de paiements actuels et futurs dans un seul module. Testez le succès de votre intégration de paiement avec le mode test intégré.

Options de paiement actuelles disponibles :

- **Access Pass**: La carte d'accès vous permet d'ajouter un paiement unique à votre produit qui expire après un minimum de 1 jour et un maximum de 7 jours. Aucune connexion d'utilisateur n'est nécessaire. La carte d'accès est disponible sur un seul appareil et est supprimée lorsque le cache du navigateur est vidé.

#### Traitement des paiements {#payment-processing}

Pour fournir ce service de paiement, 8th Wall prend une petite commission sur chaque frais, qui est partagée avec notre processeur Stripe. Les utilisateurs finaux doivent accepter les conditions d'utilisation de [8th Wall Service](https://www.8thwall.com/terms) pour pouvoir effectuer un achat.

#### Frais de traitement des paiements {#payment-processing-fee}

20 % de chaque transaction

## Restrictions de paiement {#payment-restrictions}

* 8th Wall Payments n'est actuellement accessible que dans les pays suivants et dans leurs devises respectives :
  * Australie
  * Canada
  * Japon
  * Nouvelle-Zélande
  * Royaume-uni
  * États-Unis
* 8th Wall Payments n'est accessible que pour les projets utilisant le Cloud Editor.
* Vous devez être `Admin` ou `Propriétaire` de votre espace de travail 8th Wall pour vous inscrire à l'API de paiement de 8th Wall.
* </a>les paiements de 8th Wall sont liés à la

liste des entreprises restreintes de Stripe.</li>

  * Vous ne pouvez utiliser 8th Wall Payments comme processeur de paiement que pour les fonctionnalités de l'application, le contenu numérique ou les biens numériques créés à l'aide de 8th Wall.
* Tous les utilisateurs finaux doivent accepter [les conditions d'utilisation de 8th Wall](https://www.8thwall.com/terms), (voir « 8th Wall Payments dans les conditions d'utilisation »)</ul>



## Dates de paiement {#payout-dates}

Inscrivez-vous à l'API Paiements sur la page de vos Comptes. Une fois votre compte approvisionné, vous recevrez des paiements le 15 de chaque mois. Les montants qui n'ont pas été payés apparaîtront comme **Montants en attente** sur votre page Comptes.



## Aide au paiement et remboursement {#payment-support-and-refunds}

Tous les paiements ne sont pas remboursables. Si un utilisateur final a une question concernant son paiement, il peut contacter [le service d'assistance](mailto:support@8thwall.com).



## Utilisation de 8th Wall Payments dans votre projet {#using-8th-wall-payments-in-your-project}

8th Wall Payments s'appuie sur Stripe Connect pour le traitement sécurisé des paiements. Pour commencer à créer des applications web avec du contenu payant, vous devez ouvrir un compte Stripe Connect par l'intermédiaire de 8th Wall. Ceci est requis pour bénéficier des 8th Wall Payments afin d'être payé.

Inscrivez-vous à l'API Paiements sur votre page Comptes

1. Accédez à votre page de comptes
1. Sous Paiements API, sélectionnez le pays de votre banque ou de votre carte de débit.
1. Cliquez sur "Commencer ici" ![paiement-api-setting](/images/payment-api-setting.png)

1. Vous serez dirigé vers Stripe Connect. Suivez les instructions pour remplir tous les champs obligatoires. Vous devrez fournir :

       1. Email
    1. Numéro de téléphone
    1. Détails pour les particuliers ou les entreprises
               1. Particulier - Votre date de naissance et votre adresse personnelle, votre numéro de sécurité sociale
        1. Nom de l'entreprise
    1. Industrie, site web ou description du produit
    1. Les informations relatives au compte bancaire ou à la carte de débit sur lequel vous percevrez les paiements

Une fois que vous avez envoyé vos informations complètes, Stripe peut prendre plusieurs jours pour traiter et valider vos informations. Vous pouvez vérifier l'état de votre compte dans l'écran Comptes.

Une fois confirmé, vous verrez vos informations bancaires sur votre page Comptes



#### Gérer les paiements API Compte Stripe Connect {#manage-payments-api-stripe-connect-account}

Vous pouvez consulter les détails de vos paiements pour l'argent gagné dans toutes les applications web de votre espace de travail sur la page Comptes, dans la section Vue d'ensemble de l'API des paiements.

Page Comptes Vue d'ensemble de l'API de paiement

- Compte bancaire - le compte bancaire ou la carte de débit sur lequel votre paiement sera déposé
- Montant total - le montant total que vous avez collecté auprès de toutes vos applications web
- Date de paiement - le jour du mois où vous recevrez votre paiement. Consultez les dates de paiement pour voir le calendrier.
- Montant du prochain paiement - le montant total que vous recevrez à la prochaine date de paiement
- Montant en attente - le montant total que vous avez reçu et qui est en attente de traitement. Ce n'est pas encore prêt à être envoyé lors du prochain versement

Pour consulter votre compte Stripe Connect, cliquez sur **Aller à Stripe**.

Pour mettre à jour les informations de paiement de votre compte Stripe, telles que l'adresse ou les informations bancaires, cliquez sur **Mettre à jour les Informations**.

Pour voir les paiements individuels à partir de vos applications web, cliquez sur **Voir Historique**.



#### Module de paiement {#payments-module}

Une fois que vous vous êtes inscrit à 8th Wall Payments, vous devez importer le module Paiements dans votre projet afin d'accéder à l'API Paiements.

Pour importer le module de paiement :

1. Ouvrez un projet du Cloud Editor
2. Cliquez sur le signe + à côté de la section "Modules" dans le menu de gauche du Cloud Editor.
3. Recherchez "Paiements" et importez le module dans votre projet.

Vous êtes maintenant prêt à ajouter du contenu payant à votre projet !



#### Configurations {#configurations}

Le module Paiements vous permet de personnaliser facilement le type d'option de paiement que vous souhaitez, le coût, le produit, etc. Vous pouvez également activer le mode test pour vous assurer que vos paiements fonctionnent comme prévu.



#### Mode test {#test-mode}

Le mode test vous permet de simuler les achats effectués sur votre application web avant de la lancer publiquement. L'activation du mode test vous permet d'intégrer l'API de paiement dans leurs applications, sans avoir à effectuer de véritables achats.

Configurations pour le mode test :

| Configuration                                   | Type      | Défaut | Description                                                                                                                                                                                                                                                                                |
| ----------------------------------------------- | --------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Mode test activé                                | `Booléen` | `faux` | Si Vrai - Vous simulez des achats dans votre produit, les paiements ne sont pas sur le serveur mais mis en cache localement <br /> Si Faux - Le mode test est désactivé                                                                                                              |
| Effacer les achats de test en cours d'exécution | `Booléen` | `faux` | Si Vrai - Les achats en mode test seront supprimés afin que vous puissiez tester à nouveau l'expérience d'achat. <br /> Si Faux - L'achat en mode test restera dans le stockage local jusqu'à ce qu'il soit effacé. Cette fonction est utile pour tester les flux d'achat existants. |




#### Passe d'accès {#access-pass}

Ce type de paiement offre aux utilisateurs un accès payant au contenu AR ou VR pendant une période limitée. Les passes d'accès sont bien adaptées pour permettre un accès payant à des événements de AR/VR, comme un billet d'une journée pour un concert holographique ou une exposition d'art virtuel, ou un accès de 7 jours à une chasse au trésor utilisant la AR.

Dans l'expérience de l'utilisateur final, l’utilisateur pourra :

1. Voir l’invitation au passe d'accès ou l'invitation à acheter le produit
2. Cliquer sur le CTA pour ouvrir le flux de paiement hébergé sur 8thwall.com
3. Permet aux utilisateurs d'acheter un produit à un prix spécifique
4. Enregistrer l'achat sur le support local de l'appareil jusqu'à la fin de la période préconfigurée

Configurations pour les valeurs par défaut du passe d'accès

| Configuration                 | Type     | Défaut  | Description                                                                                                                                                                                                                                                                                                                                         |
| ----------------------------- | -------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Accès Durée Jours             | `Nombre` | `1`     | Le nombre de jours pendant lesquels cet achat est valable. La durée minimale est de 1 jour, la durée maximale est de 7 jours.                                                                                                                                                                                                                       |
| Montant                       | `Nombre` | `0.99`  | Le montant à demander pour le paiement du Pass d'accès spécifié.<br/>Les montants ont un minimum et un maximum définis par la devise.<br/>**AUD**: 0,99 à 99,99 $<br/>**CAD**: 0,99 à 99,99 $<br/>**GBP**: 0,99 à 99,99 £<br/>**JPY**: ¥99 à ¥999<br/>**NZD**: 0,99 à 99,99 $<br/>**USD**: 0,99 à 99,99 $ |
| Nom du passe d'accès          | `Chaîne` | `N/A`   | Le nom du produit. Il sera utilisé dans le formulaire de paiement pour décrire à l'utilisateur ce qu'il achète.                                                                                                                                                                                                                                     |
| Monnaie                       | `Chaîne` | `usd`   | La devise à facturer à l'utilisateur. Peut être `"aud"`, `"cad"`, `"gbp"`, `"jpy"`, `"nzd"`, ou `"usd"`.                                                                                                                                                                                                                                            |
| Langue de la page de paiement | `Chaîne` | `en-US` | La langue qui apparaît à l'utilisateur final sur la page de paiement sécurisé. Peut être `'en-US'` (anglais - États-Unis) ou `'ja-JP'` (japonais).                                                                                                                                                                                                  |
