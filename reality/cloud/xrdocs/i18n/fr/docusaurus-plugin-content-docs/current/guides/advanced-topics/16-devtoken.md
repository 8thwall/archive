---
id: device-authorization
---

# Autorisation de l'appareil

Si vous bénéficiez d'un plan Pro ou Entreprise payant, vous avez la possibilité d'héberger vous-même vos expériences WebAR. Si l'IP ou les domaines de votre serveur web n'ont pas été mis sur liste blanche (voir la section [Domaines auto-hébergés](/guides/projects/self-hosted-domains) de la documentation), vous devrez autoriser votre appareil pour pouvoir visualiser l'expérience.

Si vous utilisez le Cloud Editor, il n'est pas nécessaire d'autoriser les appareils.  Le Cloud Editor autorise automatiquement les appareils lorsque vous scannez le QR code de prévisualisation pendant le développement.

L'autorisation d'un appareil installe un jeton de développeur (cookie) dans son navigateur web, ce qui lui permet de visualiser n'importe quelle clé d'application dans l'espace de travail actuel.

Il n'y a pas de limite au nombre d'appareils pouvant être autorisés, mais chaque appareil doit être autorisé individuellement. Les vues de votre expérience WebAR à partir d'appareils autorisés sont prises en compte dans votre total d'utilisation mensuelle.

**IMPORTANT**: Si vous avez suivi les étapes ci-dessous sur un appareil iOS **** , et que vous avez toujours des problèmes , veuillez consulter la section [Dépannage](/troubleshooting/device-not-authorized) pour connaître les étapes à suivre. Safari dispose d'une fonction appelée **Intelligent Tracking Prevention** qui peut **bloquer les cookies de tiers** (ce que nous utilisons pour autoriser votre appareil pendant que vous développez). Lorsqu'ils sont bloqués, nous ne pouvons pas vérifier votre appareil.

Comment autoriser un appareil :

1. Connectez-vous à 8thwall.com et sélectionnez un projet dans votre espace de travail.

2. Cliquez sur **Autorisation des appareils** pour développer le volet d'autorisation des périphériques.

3. Sélectionnez la version de 8th Wall Engine à utiliser pendant le développement.  Pour utiliser la dernière version stable de 8th Wall, sélectionnez **publication**.  Pour tester une version préliminaire, sélectionnez **beta**.

![Canal du mode développeur de console](/images/console-developer-mode-channel.jpg)

4. Autorisez votre appareil :

**Depuis le bureau**: Si vous êtes connecté à la console sur votre ordinateur portable/de bureau, **Scannez le QR code** à partir de l'appareil **que vous souhaitez autoriser**.  Cela installe un cookie d'autorisation sur l'appareil.

Remarque : un QR code ne peut être scanné qu'une seule fois.  Après la numérisation, vous recevrez la confirmation que votre appareil a été autorisé. La console génère alors un nouveau QR code qui peut être scanné pour autoriser un autre appareil.

Avant :

![ConsoleDevTokenQR](/images/console-developer-mode-qr.jpg)

Après :

| Confirmation (console)                                                         | Confirmation (sur l'appareil)                                                  |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| ![ConsoleQRConfirmation](/images/console-developer-mode-qr-result-desktop.jpg) | ![Confirmation MobileQRC](/images/console-developer-mode-qr-result-mobile.jpg) |

**À partir d'un appareil mobile**: Si vous êtes connecté à 8thwall.com directement sur l'appareil mobile que vous souhaitez autoriser , cliquez simplement sur **Autoriser le navigateur**. Ce faisant, vous installez un cookie d'autorisation dans votre navigateur mobile , l'autorisant à visualiser n'importe quel projet dans l'espace de travail actuel.

Avant :

![DéveloppeurModeMobile](/images/console-developer-mode-mobile.jpg)

Après :

![DeveloperModeMobileAuthorized](/images/console-developer-mode-mobile-authorized.jpg)
