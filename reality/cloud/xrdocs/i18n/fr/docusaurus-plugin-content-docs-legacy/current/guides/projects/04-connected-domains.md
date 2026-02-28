---
id: connected-domains
---

# Domaines connectés

Lorsque vous utilisez l'éditeur cloud de 8th Wall pour développer, l'expérience Web AR créée est publiée sur l'infrastructure d'hébergement de 8th Wall. L'URL par défaut de votre expérience Web AR publiée aura le format suivant :

"**nom de l'espace de travail**.8thwall.app/**nom du projet**"

Si vous possédez un domaine personnalisé et que vous souhaitez l'utiliser avec un projet hébergé par 8th Wall au lieu de l'URL par défaut, vous pouvez connecter le domaine à votre projet 8th Wall en ajoutant quelques enregistrements DNS. Pour ce faire, vous devez avoir accès à la création/modification de la configuration DNS de votre domaine.

**REMARQUE** : La connexion de domaines personnalisés aux projets 8th Wall Hosted nécessite un plan **Pro ou Enterprise**.

**ATTENTION** : Il est fortement recommandé de connecter un **sous-domaine** ("ar.mydomain.com") au lieu du domaine racine ("mydomain.com" sans rien devant) car **tous les fournisseurs de DNS ne supportent pas les enregistrements CNAME/ALIAS/ANAME pour le domaine racine**. Veuillez contacter votre fournisseur DNS pour savoir s'il prend en charge les enregistrements CNAME ou ALIAS pour le domaine racine avant de poursuivre.

1. Sur la page du tableau de bord du projet, sélectionnez "Configurer les domaines"

![SetupConnectedDomains](/images/connected-domains-setup-domains.png)

2. Développez "Configurez votre domaine pour qu'il pointe vers ce projet hébergé par 8th Wall"

3. Dans **l'étape 1** de l'assistant de domaine connecté, entrez votre **domaine personnalisé** (par exemple www.mydomain.com), dans le champ Domaine connecté primaire.

![ConnectedDomains](/images/console-appkey-domains.png)

4. [Si vous souhaitez connecter des sous-domaines supplémentaires, cliquez sur le bouton **Ajouter un sous-domaine supplémentaire** et ajoutez les **domaines supplémentaires** que vous souhaitez connecter. **Note** : Si vous connectez d'autres sous-domaines, ceux-ci seront redirigés vers le domaine primaire connecté. Ils doivent partager la même racine que le domaine primaire connecté.

![AdditionalConnectedDomains](/images/console-appkey-domains-additional.png)

5. Cliquez sur **Connect**. A ce stade, 8th Wall génère un certificat SSL pour le(s) domaine(s) personnalisé(s) connecté(s). Cette opération peut prendre quelques minutes, soyez patient. Cliquez sur le bouton "Actualiser l'état" si nécessaire.

6. Ensuite, **Vérifiez la propriété** de votre domaine. Afin de vérifier que vous êtes bien le propriétaire du domaine personnalisé, vous devez vous connecter au site web de votre fournisseur DNS et ajouter un ou plusieurs enregistrements CNAME de vérification.  Utilisez le bouton **Copier** pour vous assurer de collecter correctement les enregistrements complets de l'hôte et de la valeur.

![ConnectedDomainVerificationRecord](/images/connected-domain-verification-record.png)

La vérification de ces enregistrements DNS peut prendre jusqu'à 24 heures, mais dans la plupart des cas, elle se fait en quelques minutes.  Soyez patient et cliquez régulièrement sur le bouton "Actualiser l'état de la vérification" si nécessaire.

Lorsque la vérification est terminée, une coche verte apparaît à côté de l'enregistrement DNS de vérification :

![ConnectedDomainVerified](/images/connected-domain-verified.png)

7. Enfin, **l'étape 3** affichera un ou plusieurs enregistrements CNAME (si vous connectez un sous-domaine) ou ANAME (si vous connectez un domaine racine, voir l'avertissement ci-dessus) qui doivent être ajoutés à votre serveur DNS pour terminer la configuration du domaine connecté. Ces enregistrements associent votre domaine personnalisé à l'infrastructure d'hébergement de 8th Wall.

![ConnectedDomainConnectionRecord](/images/connected-domain-connection-record.png)

Résultat : L'enregistrement de la connexion a été vérifié :

![ConnectedDomainConnectionEstablished](/images/connected-domain-connection-established.png)

Notes supplémentaires :

- Si vous connectez un domaine **root**, l'étape 3 affichera un enregistrement `ANAME`.  En supposant que votre fournisseur DNS prenne en charge ces types d'enregistrements, ils n'apparaîtront pas comme "connectés". Votre domaine connecté fonctionnera toujours si vous avez créé les enregistrements DNS appropriés.
- Il n'est pas possible de modifier les paramètres du domaine connecté une fois qu'ils ont été définis. Si vous devez apporter des modifications, vous devrez le faire :
  1. Supprimez le domaine connecté de votre projet 8th Wall.
  2. Nettoyage et ajout d'enregistrements DNS provenant de l'installation précédente.
  3. Recommencez avec la nouvelle configuration du domaine personnalisé.
- N'utilisez pas d'enregistrement **A** pour l'étape 3.  Les expériences hébergées par 8th Wall sont servies par un CDN global avec des centaines de sites dans le monde entier. Les utilisateurs sont automatiquement dirigés vers le centre de données le plus proche/le plus rapide pour une performance maximale. Vous devez connecter votre domaine à l'URL unique "xxxxx.cloudfront.net" affichée à l'étape 3 de l'assistant.
