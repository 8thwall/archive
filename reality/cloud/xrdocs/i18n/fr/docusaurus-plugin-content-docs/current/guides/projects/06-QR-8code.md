---
id: qr-8code
---

# QR 8Code

Pour plus de commodité, les QR codes de la marque 8th Wall (également appelés "codes 8") peuvent être générés pour un projet, ce qui permet de les scanner facilement à partir d'un appareil mobile afin d'accéder à votre projet WebAR.  Vous pouvez toujours générer vos propres QR codes ou utiliser des sites web ou des services tiers de génération de QR codes.

Le QR code sur le tableau de bord du projet pointe vers un lien court "8th.io" unique pour votre projet. Ce lien court redirige ensuite l'utilisateur vers l'URL de votre expérience de WebAR.

<u>Le QR code et le code "8th.io" pour un projet donné sont statiques et ne changeront pas en fonction du type de projet ou de la licence.</u>

### projets hébergés 8th Wall (PAS de domaine connecté) {#8th-wall-hosted-projects-no-connected-domain}

Si votre projet utilise l'URL par défaut de 8th Wall (au format "**workspace-name**.8thwall.app/**project-name**"), le QR Code et le lien court de 8th.io seront toujours redirigés vers l'URL par défaut.  Il n'est pas possible de modifier l'URL de destination.

![Tableau de bord du projet8wHostedQR](/images/console-appkey-qrcode-8w-hosted.png)

### projets hébergés sur 8th Wall (AVEC domaine connecté) {#8th-wall-hosted-projects-with-connected-domain}

Si vous avez configuré un[domaine connecté](/guides/projects/connected-domains) pour votre projet hébergé sur le 8th Wall, vous aurez la possibilité de définir la destination du QR Code / lien soit sur l'URL par défaut du projet, soit sur le domaine connecté principal.

Utilisez le bouton radio pour définir la destination de votre QR code / lien court :

![ProjetTableau de bord8wHostedQRConnectedDomain](/images/console-appkey-qrcode-8w-hosted-connected-domain.png)

### Projets auto-hébergés {#self-hosted-projects}

Pour générer un QR code QR et un lien court, saisissez l'URL complète de votre projet auto-hébergé et cliquez sur **Enregistrer**:

![Tableau de bord du projetQR auto-hébergé](/images/console-appkey-qrcode.png)

Le QR code généré peut être téléchargé au format PNG ou SVG pour être inclus sur un site web, sur un support physique ou à d'autres endroits afin que les utilisateurs puissent facilement le scanner avec leur smartphone pour visiter l'URL auto-hébergée.  Cliquez sur l'icône en forme de crayon pour modifier la destination du lien court en cas de changement futur de l'URL.

Exemple :

![ProjectDashboardSelfHostedQResult](/images/console-appkey-qrcode-result.png)
