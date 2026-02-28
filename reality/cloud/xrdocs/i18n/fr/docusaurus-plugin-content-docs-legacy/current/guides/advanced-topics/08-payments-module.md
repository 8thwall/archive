---
id: monetize-with-8th-wall-payments
---

# Paiements du 8e mur

8th Wall Payments offre aux développeurs les outils dont ils ont besoin pour ajouter des paiements sécurisés à leurs applications web AR et VR
. Les développeurs peuvent utiliser le module de paiement qui se trouve dans l'éditeur cloud pour ajouter facilement à leur projet des produits à acheter sur
. Tous les paiements sont facilités par l'API 8th Wall Payments qui permet aux développeurs de
de collecter et de recevoir des paiements.

#### Pourquoi utiliser 8th Wall Payments ? {#why-use-8th-wall-payments}

Monétisez facilement vos expériences WebAR ou WebVR avec les paiements 8th Wall grâce au module de paiement.
Basé sur Stripe, 8th Wall Payments offre aux utilisateurs finaux un moyen sûr de payer votre produit et
vous permet de gagner de l'argent en développant des projets WebXR.

Avec le module 8th Wall Payments, vous disposez d'une importation en une étape qui vous permet de
monétiser votre projet web AR ou web VR à l'aide d'options de paiement extensibles. Avec le module de paiement,
vous pouvez facilement personnaliser les options de paiement telles que le coût et l'article que vous vendez, tout en tirant parti de
notre flux de paiement rationalisé optimisé pour une utilisation sur mobile, ordinateur de bureau et VR. Accédez à tous les types de paiements actuels et
futurs dans un seul module. Testez le succès de votre intégration de paiement avec le mode test intégré
.

Options de paiement actuelles disponibles :

- **Passe d'accès** : La carte d'accès vous permet d'ajouter à votre produit un paiement unique qui expire à l'adresse
  après un minimum de 1 jour et un maximum de 7 jours. Aucune connexion d'utilisateur n'est nécessaire. La carte d'accès est disponible à l'adresse
  sur un seul appareil et est supprimée lorsque le cache du navigateur est vidé.

#### Traitement des paiements {#payment-processing}

Pour fournir ce service de paiement, 8th Wall prend une petite commission sur chaque frais, qui est partagée avec
, notre processeur Stripe. Les utilisateurs finaux doivent accepter les [conditions du service
de 8th Wall] (https://www.8thwall.com/terms) pour pouvoir effectuer un achat.

#### Frais de traitement des paiements {#payment-processing-fee}

20% de chaque transaction

## Restrictions de paiement {#payment-restrictions}

- 8th Wall Payments n'est actuellement accessible que dans les pays suivants et dans leurs devises respectives :
  - Australie
  - Canada
  - Japon
  - Nouvelle-Zélande
  - ROYAUME-UNI
  - États-Unis
- 8th Wall Payments n'est accessible que pour les projets utilisant l'éditeur de nuages.
- Vous devez être un `Admin` ou un `Owner` de votre espace de travail 8th Wall afin de vous inscrire à l'API de paiement de 8th Wall.
- Les paiements 8th Wall sont liés à la [Stripe Restricted Businesses List](https://stripe.com/gb/legal/restricted-businesses).
- Vous ne pouvez utiliser 8th Wall Payments en tant que processeur de paiement que pour les fonctionnalités de l'application, le contenu numérique ou les biens numériques créés à l'aide de 8th Wall.
- Tous les utilisateurs finaux doivent accepter les [Conditions d'utilisation de 8th Wall] (https://www.8thwall.com/terms), (voir les "Conditions d'utilisation de 8th Wall Payments" dans les Conditions d'utilisation).

## Dates de paiement {#payout-dates}

Inscrivez-vous à l'API Paiements sur votre page Comptes. Une fois que votre compte est approvisionné, vous recevrez des paiements sur
le 15 de chaque mois. Les montants qui n'ont pas été payés apparaîtront comme \*\*Montants en attente
\*\* sur votre page Comptes.

## Aide au paiement et remboursement {#payment-support-and-refunds}

Tous les paiements ne sont pas remboursables. Si un utilisateur final a une question concernant son paiement, il peut contacter
[support](mailto:support@8thwall.com).

## Utilisation de 8th Wall Payments dans votre projet {#using-8th-wall-payments-in-your-project}

8th Wall Payments s'appuie sur Stripe Connect pour le traitement sécurisé des paiements. Pour commencer à créer des applications web
avec du contenu payant, vous devez ouvrir un compte Stripe Connect par l'intermédiaire de 8th Wall. Le site
est nécessaire pour bénéficier des 8th Wall Payments afin d'être payé.

S'inscrire à l'API Paiements sur votre page Comptes

1. Accédez à votre page de comptes
2. Sous Paiements API, sélectionnez le pays de votre banque ou de votre carte de débit.
3. Cliquez sur "Start Here"
   ![payment-api-setting](/images/payment-api-setting.png)
4. Vous serez dirigé vers Stripe Connect. Suivez les instructions pour remplir tous les champs obligatoires. Vous devrez fournir
   1. Courriel
   2. Numéro de téléphone
   3. Détails pour un particulier ou une entreprise
      1.
      1. Particulier - Votre date de naissance et l'adresse de votre domicile, votre numéro de sécurité sociale
         2.
      2. Nom de l'entreprise
   4. Industrie, site web ou description du produit
   5. les informations relatives au compte bancaire ou à la carte de débit sur lequel vous percevrez les paiements

Une fois que vous avez envoyé vos informations complètes, Stripe peut prendre plusieurs jours pour traiter et valider vos informations. Vous pouvez vérifier l'état de votre compte dans l'écran Comptes.

Une fois confirmé, vous verrez vos informations bancaires sur votre page Comptes.

#### Gérer les paiements API Stripe Connect Compte {#manage-payments-api-stripe-connect-account}

Vous pouvez consulter les détails de vos paiements pour l'argent gagné dans toutes les applications web de votre espace de travail sur la page Comptes, dans la section Vue d'ensemble de l'API des paiements.

Page Comptes Vue d'ensemble de l'API de paiement

- Compte bancaire - le compte bancaire ou la carte de débit sur lequel votre paiement sera déposé.
- Montant total - le montant total de l'argent que vous avez collecté auprès de toutes vos applications web.
- Date de paiement - le jour du mois où vous recevrez votre paiement. Consultez les dates de paiement pour connaître le calendrier.
- Montant du prochain paiement - le montant total que vous recevrez à la prochaine date de paiement.
- Montant en attente - le montant total que vous avez reçu et qui est en attente de traitement. Il n'est pas encore prêt à être envoyé lors du prochain versement.

Pour consulter votre compte Stripe Connect, cliquez sur **Voir Stripe**.

Pour mettre à jour les informations de paiement de votre compte Stripe, telles que l'adresse ou les informations bancaires, cliquez sur **Mise à jour des informations**.

Pour consulter les paiements individuels de vos applications web, cliquez sur **Voir l'historique**.

#### Module de paiement {#payments-module}

Une fois que vous vous êtes inscrit à 8th Wall Payments, vous devez importer le module de paiement dans votre projet afin d'accéder à l'API de paiement.

Pour importer le module de paiement :

1. Ouvrir un projet de l'Éditeur de nuages
2. Cliquez sur le signe + à côté de la section "Modules" dans le menu de gauche de l'éditeur de nuages.
3. Recherchez "Paiements" et importez le module dans votre projet.

Vous êtes maintenant prêt à ajouter du contenu payant à votre projet !

#### Configurations {#configurations}

Le module Paiements vous permet de personnaliser facilement le type d'option de paiement que vous souhaitez, le coût, le produit, etc. Vous pouvez également activer le mode test pour vous assurer que vos paiements fonctionnent comme prévu.

#### Mode test {#test-mode}

Le mode test vous permet de simuler les achats effectués sur votre application web avant de la lancer publiquement. L'activation du mode test vous permet d'intégrer l'API de paiement dans leurs applications, sans avoir à effectuer de véritables achats.

Configurations pour le mode test :

| Configuration                                   | Type      | Défaut  | Description                                                                                                                                                                                                                                                                                                                          |
| ----------------------------------------------- | --------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Mode test activé                                | `Booléen` | `false` | Si True - Vous simulez des achats dans votre produit, les paiements ne sont pas sur le serveur mais mis en cache localement <br /> Si False - Le mode test est désactivé                                                                                                                                                             |
| Effacer les achats de test en cours d'exécution | `Booléen` | `false` | Si Vrai - Les achats en mode test seront supprimés afin que vous puissiez tester à nouveau l'expérience d'achat. <br /> Si Faux - L'achat en mode test restera dans le stockage local jusqu'à ce qu'il soit effacé. Cette fonction est utile pour tester les flux d'achat existants. |

#### Passeport d'accès {#access-pass}

Ce type de paiement offre aux utilisateurs un accès payant au contenu AR ou VR pendant une période limitée. Les cartes d'accès sont bien adaptées pour permettre un accès payant à des événements de RA/VR, comme un billet d'une journée pour un concert holographique ou une exposition d'art virtuel, ou un accès de 7 jours à une chasse au trésor utilisant la RA.

Dans l'expérience de l'utilisateur final, l'utilisateur.. :

1. Afficher l'invite du laissez-passer d'accès ou l'invitation à acheter le produit
2. Cliquer sur le CTA ouvrira le flux de paiement hébergé sur 8thwall.com
3. Permet aux utilisateurs d'acheter un produit à un prix spécifique
4. Sauvegarder l'achat sur le stockage local de l'appareil jusqu'à la période de temps préconfigurée

Configurations pour les valeurs par défaut du laissez-passer d'accès

| Configuration                 | Type     | Défaut          | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ----------------------------- | -------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Accès Durée Jours             | `Nombre` | `1`             | Le nombre de jours pendant lesquels cet achat est valable. La durée minimale est de 1 jour, la durée maximale est de 7 jours.                                                                                                                                                                                                                                                                                                                                    |
| Montant                       | `Nombre` | `0.99`          | Montant à demander pour le paiement du titre d'accès spécifié.<br/>Les montants sont assortis d'un minimum et d'un maximum définis par la devise.<br/>**AUD** : 0,99 $ à 99,99 $<br/>**CAD** : 0,99 $ à 99,99 $<br/>**GBP** : £0.99 à £99.99<br/>**JPY** : ¥99 à ¥999<br/>**NZD** : 0,99 $ à 99,99 $<br/>**USD** : 0,99$ à 99,99 |
| Nom du passe d'accès          | `Chaîne` | `'N/A'`         | Le nom du produit. Il sera utilisé dans le formulaire de paiement pour décrire à l'utilisateur ce qu'il achète.                                                                                                                                                                                                                                                                                                                                                  |
| Monnaie                       | `Chaîne` | \`'usd'\`\\` | La devise à facturer à l'utilisateur. Peut être `'aud'`, `'cad'`, `'gbp'`, `'jpy'`, `'nzd'`, ou `'usd'`.                                                                                                                                                                                                                                                                                                                                                         |
| Langue de la page de paiement | `Chaîne` | `'en-US'`       | La langue qui apparaît à l'utilisateur final sur la page de paiement sécurisé. Peut être `'en-US'` (anglais - États-Unis) ou `'ja-JP'` (japonais).                                                                                                                                                                                                                                                                         |
