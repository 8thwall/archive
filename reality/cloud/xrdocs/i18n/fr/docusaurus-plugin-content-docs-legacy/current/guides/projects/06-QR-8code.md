---
id: qr-8code
---

# QR 8Code

Pour plus de commodité, les codes QR de la marque 8th Wall (également appelés "codes 8") peuvent être générés pour un projet, ce qui permet à
de les scanner facilement à partir d'un appareil mobile afin d'accéder à votre projet WebAR.  Vous pouvez toujours générer
vos propres codes QR ou utiliser des sites web ou des services tiers de génération de codes QR.

Le code QR sur le tableau de bord du projet pointe vers un lien court "8th.io" unique pour votre projet. Ce lien court
redirige ensuite l'utilisateur vers l'URL de votre expérience de RA Web.

<u>Le code QR et le code "8th.io" pour un projet donné sont statiques et ne changeront pas en fonction du type de projet ou de la licence.</u>

### Projets hébergés du 8e mur (PAS de domaine connecté) {#8th-wall-hosted-projects-no-connected-domain}

Si votre projet utilise l'URL par défaut de 8th Wall (au format
"**nom-de-l'espace-de-travail**.8thwall.app/**nom-du-projet**"), le QR Code et le lien court de 8th.io redirigeront toujours
vers l'URL par défaut.  Il n'est pas possible de modifier l'URL de destination.

![ProjectDashboard8wHostedQR](/images/console-appkey-qrcode-8w-hosted.png)

### Projets hébergés du 8e mur (AVEC domaine connecté) {#8th-wall-hosted-projects-with-connected-domain}

Si vous avez configuré un [domaine connecté] (/legacy/guides/projects/connected-domains) pour votre projet hébergé sur le 8e
Wall, vous aurez la possibilité de définir la destination du QR Code / Shortlink soit sur l'URL par défaut du projet
, soit sur le domaine connecté principal.

Utilisez le bouton radio pour définir la destination du code QR ou du lien court :

![ProjectDashboard8wHostedQRConnectedDomain](/images/console-appkey-qrcode-8w-hosted-connected-domain.png)

### Projets auto-hébergés {#self-hosted-projects}

Pour générer un code QR et un lien court, saisissez l'URL complète de votre projet auto-hébergé et cliquez sur **Sauvegarder** :

![ProjectDashboardSelfHostedQR](/images/console-appkey-qrcode.png)

Le code QR généré peut être téléchargé au format PNG ou SVG pour être inclus sur un site web,
sur un support physique ou à d'autres endroits afin que les utilisateurs puissent facilement le scanner avec leur smartphone pour visiter
l'URL auto-hébergée.  Cliquez sur l'icône en forme de crayon pour modifier la destination du lien court en cas de changement futur de l'URL de
.

Exemple :

![ProjectDashboardSelfHostedQRResult](/images/console-appkey-qrcode-result.png)
