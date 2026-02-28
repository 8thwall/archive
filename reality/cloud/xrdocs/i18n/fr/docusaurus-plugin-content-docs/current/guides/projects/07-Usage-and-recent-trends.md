---
id: usage-and-recent-trends
---

# Utilisation et tendances récentes

## Vues et temps d'attente {#views-and-dwell-time}

Les analyses d'utilisation suivantes sont fournies pour chaque projet :

* Points de vue
* Temps d'attente

Dans l'onglet `Vues`, vous pouvez voir combien de fois votre projet a été consulté au cours de sa durée de vie. Sur , l'onglet `Dwell Time` vous permet de voir le temps moyen passé par les utilisateurs dans votre expérience. Les moyennes ne tiennent pas compte des jours où les données sont nulles.

Toutes les heures du graphique sont affichées en heure locale, mais 8th Wall ne recueille que des données agrégées toutes les heures en UTC. Les utilisateurs de la carte dans des fuseaux horaires avec des décalages non horaires verront les données collectées pour les heures UTC les plus proches de leur jour. Le temps de séjour n'est disponible qu'à partir du 1er janvier 2023. Le jour le plus récent ( ) ne sera composé que de données partielles jusqu'à l'heure actuelle.

Les heures de l'infobulle sur le graphique indiquent le début de la période de collecte des données, et la valeur du point est l'agrégation des données à partir de cette date.

![Aperçu du tableau de bord du projet](/images/console-appkey-usage.jpg)

## Exportation CSV {#csv-export}

Des données au format CSV sont également disponibles pour des analyses plus avancées. Vous pouvez télécharger ces données en cliquant sur l'icône de téléchargement au-dessus du graphique. Les champs CSV sont les suivants :

| Champ              | Description                                                           |
| ------------------ | --------------------------------------------------------------------- |
| dt                 | Chaîne de date et d'heure UTC formatée ISO8601.                       |
| moyenneDwellTimeMs | La durée moyenne de la session, en millisecondes, pour le jour donné. |
| points de vue      | Le nombre de vues reçues le jour donné.                               |

## Vues de la licence commerciale {#commercia-license-views}

Les projets dotés de licences commerciales basées sur l'utilisation afficheront également le nombre de vues pour la période de facturation en cours , le cas échéant.  L'utilisation est mesurée par tranches de 100 vues. L'utilisation des mois précédents peut être consultée sur dans le [résumé de facturation de](/guides/account-settings/#invoices) la page du compte.
