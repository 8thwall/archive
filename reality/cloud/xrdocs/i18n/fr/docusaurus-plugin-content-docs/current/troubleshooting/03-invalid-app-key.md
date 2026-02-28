---
id: invalid-app-key
---

# Clé d'application invalide

Problème : Lorsque j'essaie de visualiser mon application Web, je reçois un message d'erreur **« Clé d'application invalide »** ou **« Domaine Non autorisé »**.

Étapes de dépannage :

1. Vérifiez que votre clé d'application a été collée correctement dans le code source.
2. Vérifiez que vous vous connectez à votre application web via **https**.  Les navigateurs mobiles en ont besoin pour accéder à la caméra.
3. Vérifiez que vous utilisez un navigateur compatible, voir [Prérequis navigateur](/getting-started/requirements/#web-browser-requirements)
4. En cas d'auto-hébergement, vérifiez que votre appareil a été correctement autorisé.  Sur votre téléphone, visitez <https://apps.8thwall.com/token> pour voir l'état de l'autorisation de l'appareil. Ceci n'est pas nécessaire si vous avez configuré [des domaines auto-hébergés](/guides/projects/self-hosted-domains).
5. Si vous êtes membre de plusieurs espaces de travail de développeurs Web, assurez-vous que l'App Key et le Dev Token proviennent du **même espace de travail**.
6. Si votre navigateur Web est en mode de navigation privée ou en mode Incognito, veuillez quitter le mode privé/Incognito, réautoriser votre appareil et réessayer.
7. Effacez les données du site web et les cookies de votre navigateur web, ré-autorisez votre appareil et réessayez.
8. Si vous bénéficiez d'un plan Pro ou Entreprise payant et que vous essayez d'accéder publiquement à votre expérience WebAR, assurez-vous que [Self Hosted Domains](/guides/projects/self-hosted-domains) est configuré correctement.
