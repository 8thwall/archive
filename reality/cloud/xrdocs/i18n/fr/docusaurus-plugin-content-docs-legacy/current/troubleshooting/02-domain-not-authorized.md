---
id: domain-not-authorized
---

# Domaine non autorisé

#### Numéro {#issue}

Lorsque j'essaie d'afficher une expérience Web AR auto-hébergée, je reçois un message d'erreur "Domaine non autorisé".

#### Solutions {#solutions}

1. Assurez-vous d'avoir mis le(s) domaine(s) de votre serveur web sur liste blanche. Les domaines auto-hébergés sont
   **sous-domaine spécifique** - par exemple, `mydomain.com` n'est pas la même chose que `www.mydomain.com`. Si vous souhaitez héberger
   à la fois sur `mydomain.com` et `www.mydomain.com`, vous devez spécifier **LES DEUX**. Veuillez vous référer à la section
   [Connected Domains](/legacy/guides/projects/connected-domains) (voir Self Hosted Projects) de la documentation
   pour plus d'informations.

2. Si Domain='' (vide), vérifiez les paramètres de `RefererPolicy` sur votre serveur web.

![domain-not-authorized](/images/domain-not-authorized.jpg)

Dans la capture d'écran ci-dessus, la valeur `Domain=` est vide. Il doit être défini sur le domaine de votre expérience WebAR auto-hébergée
. Dans ce cas, la "Politique de référencement" de votre serveur web est trop restrictive
. L'en-tête http `Referer` est utilisé pour vérifier que votre clé d'application est utilisée à partir d'un serveur approuvé/whitelisté par
.

Pour vérifier la configuration, ouvrez le débogueur Chrome/Safari et regardez l'onglet Réseau.  Les en-têtes de requête `xrweb`
doivent inclure une valeur `Referer`, et celle-ci doit correspondre au(x) domaine(s) que vous avez
whitelisté dans les paramètres de votre projet.

**Incorrect** - Dans cette capture d'écran, la politique de référencement est définie sur "same-origin".
Cela signifie qu'un référent ne sera envoyé que pour les demandes provenant d'un même site, mais que les demandes inter-origines
n'enverront pas d'informations sur le référent :

![referer-missing](/images/referer-missing.jpg)

**Correct** - Les en-têtes de requête `xrweb` incluent une valeur `Referer`.

![referer-ok](/images/referer-ok.jpg)

La valeur par défaut "strict-origin-when-cross-origin" est recommandée. Veuillez vous référer à
<https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy> pour les options de configuration.
