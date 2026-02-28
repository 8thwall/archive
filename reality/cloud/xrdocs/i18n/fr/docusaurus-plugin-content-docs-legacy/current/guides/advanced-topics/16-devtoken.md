---
id: device-authorization
---

# Autorisation de l'appareil

Si vous bénéficiez d'un plan Pro ou Enteprise payant, vous avez la possibilité d'héberger vous-même vos expériences WebAR. Si
l'IP ou les domaines de votre serveur web n'ont pas été mis sur liste blanche (voir
[Self Hosted Domains](/legacy/guides/projects/self-hosted-domains) section de la documentation), vous devrez
autoriser votre appareil pour pouvoir visualiser l'expérience.

Si vous utilisez l'éditeur en nuage, il n'est pas nécessaire d'autoriser les appareils.  L'éditeur de cloud
autorise automatiquement les appareils lorsque vous scannez le code QR de prévisualisation pendant le développement.

L'autorisation d'un appareil installe un jeton de développeur (cookie) dans son navigateur web, ce qui lui permet de visualiser
n'importe quelle clé d'application dans l'espace de travail actuel.

Il n'y a pas de limite au nombre d'appareils pouvant être autorisés, mais chaque appareil doit être autorisé individuellement à l'adresse
. Les consultations de votre expérience Web AR à partir d'appareils autorisés sont prises en compte dans le calcul de votre consommation mensuelle totale sur
.

**IMPORTANT** : Si vous avez suivi les étapes ci-dessous sur un appareil **iOS**, et que vous avez toujours des problèmes avec
, veuillez consulter la section [Troubleshooting](/legacy/troubleshooting/device-not-authorized) pour connaître les étapes à suivre
. Safari dispose d'une fonction appelée **Intelligent Tracking Prevention** qui peut **bloquer les cookies
de tiers** (ceux que nous utilisons pour autoriser votre appareil pendant que vous développez). Lorsqu'ils sont bloqués, nous
ne pouvons pas vérifier votre appareil.

Comment autoriser un appareil :

1. Connectez-vous à 8thwall.com et sélectionnez un projet dans votre espace de travail.

2. Cliquez sur **Autorisation du périphérique** pour développer le volet d'autorisation du périphérique.

3. Sélectionnez la version de 8th Wall Engine à utiliser pendant le développement.  Pour utiliser la dernière version stable de
   8th Wall, sélectionnez **release**.  Pour tester une version préliminaire, sélectionnez **beta**.

![ConsoleDeveloperModeChannel](/images/console-developer-mode-channel.jpg)

4. Autorisez votre appareil :

**Depuis un ordinateur de bureau** : Si vous êtes connecté à la console sur votre ordinateur portable/de bureau, **Scannez le code QR**
à partir du **dispositif que vous souhaitez autoriser**.  Cela installe un cookie d'autorisation sur l'appareil.

Remarque : un code QR ne peut être scanné qu'une seule fois.  Après la numérisation, vous recevrez la confirmation que votre appareil
a été autorisé. La console génère alors un nouveau code QR qui peut être scanné pour
autoriser un autre appareil.

Avant :

![ConsoleDevTokenQR](/images/console-developer-mode-qr.jpg)

Après :

| Confirmation (console)                                      | Confirmation (sur l'appareil)                             |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| ![ConsoleQRConfirmation](/images/console-developer-mode-qr-result-desktop.jpg) | ![MobileQRConfirmation](/images/console-developer-mode-qr-result-mobile.jpg) |

**À partir d'un téléphone portable** : Si vous êtes connecté à 8thwall.com directement sur l'appareil mobile que vous souhaitez autoriser
, cliquez simplement sur **Autoriser le navigateur**. Ce faisant, vous installez un cookie d'autorisation dans votre navigateur mobile
, l'autorisant à visualiser n'importe quel projet dans l'espace de travail actuel.

Avant :

![DeveloperModeMobile](/images/console-developer-mode-mobile.jpg)

Après :

![DeveloperModeMobileAuthorized](/images/console-developer-mode-mobile-authorized.jpg)
