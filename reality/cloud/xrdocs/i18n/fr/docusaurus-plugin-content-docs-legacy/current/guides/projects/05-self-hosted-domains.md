---
id: self-hosted-domains
---

# Domaines auto-hébergés

Si vous bénéficiez d'un plan Pro ou Enterprise payant, vous pouvez héberger les expériences de RA Web sur
votre propre serveur Web (et les visualiser sans autorisation de l'appareil). Pour ce faire, vous devez spécifier une liste de domaines approuvés pour héberger votre projet
.

1. Sur la page du tableau de bord du projet, sélectionnez "Configurer les domaines".

2. Développez "Configurer ce projet pour l'auto-hébergement ou le développement local".

3. Saisissez le(s) domaine(s) ou l'(les) IP du serveur web sur lequel vous allez auto-héberger
   le projet. Un domaine ne peut pas contenir de caractères génériques, de chemin d'accès ou de port. Cliquez sur le "+"
   pour en ajouter plusieurs.

Note : Les domaines auto-hébergés sont **sous-domaines spécifiques** - par exemple, `mydomain.com` n'est pas la même chose que
`www.mydomain.com`. Si vous hébergez à la fois sur mydomain.com et `www.mydomain.com`, vous devez
spécifier **LES DEUX**.

![SelfHostedDomainList](/images/console-app-key-origins.jpg)
