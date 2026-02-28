---
id: domain-not-authorized
---

# Domaine non autorisé

#### Problème {#issue}

Lorsque j'essaie d'afficher une expérience WebAR auto-hébergée, je reçois un message d'erreur "Domaine non autorisé".

#### Solutions {#solutions}

1. Assurez-vous d'avoir mis le(s) domaine(s) de votre serveur web sur liste blanche. Les domaines auto-hébergés sont **spécifiques au sous-domaine** - par exemple, `mondomaine.com` n'est pas le même que `www.mydomain.com`. Si vous souhaitez héberger à la fois sur `mydomain.com` et `www.mydomain.com,` vous devez spécifier **LES DEUX**. Veuillez vous référer à la section [Connected Domains](/guides/projects/connected-domains) (voir Self Hosted Projects) de la documentation pour plus d'informations.

2. Si Domain='' (vide), vérifiez les paramètres de `RefererPolicy` sur votre serveur web.

![domaine-non-autorisé](/images/domain-not-authorized.jpg)

Dans la capture d'écran ci-dessus, la valeur `Domain=` est vide. Il doit être défini sur le domaine de votre expérience WebAR auto-hébergée. Dans cette situation, la politique `Referer Policy` de votre serveur web est trop restrictive. L'en-tête `Referer` http est utilisé pour vérifier que votre clé d'application est utilisée à partir d'un serveur approuvé/whitelisté.

Pour vérifier la configuration, ouvrez le débogueur Chrome/Safari et regardez l'onglet Réseau.  Les en-têtes de requête `xrweb` doivent inclure une valeur `Referer` , qui doit correspondre au(x) domaine(s) que vous avez inscrit sur la liste blanche dans les paramètres de votre projet.

**incorrect** - Dans cette capture d'écran, la politique de référence est définie sur "same-origin". Cela signifie qu'un référent ne sera envoyé que pour les demandes provenant d'un même site, mais que les demandes inter-origines n'enverront pas d'informations sur le référent :

![référent manquant](/images/referer-missing.jpg)

**Correct** - L'en-tête de requête `xrweb` comprend une valeur `Referer` .

![référer-ok](/images/referer-ok.jpg)

La valeur par défaut "strict-origin-when-cross-origin" est recommandée. Veuillez vous référer à <https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy> pour les options de configuration.
