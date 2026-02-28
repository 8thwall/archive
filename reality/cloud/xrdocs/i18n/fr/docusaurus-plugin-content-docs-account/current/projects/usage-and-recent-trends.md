---
id: usage-and-recent-trends
sidebar_position: 6
---

# Utilisation et tendances récentes

## Vues et temps de séjour {#views-and-dwell-time}

Les analyses d'utilisation suivantes sont fournies pour chaque projet :

- Points de vue
- Temps d'attente

Dans l'onglet "Vues", vous pouvez voir combien de fois votre projet a été vu au cours de sa durée de vie. Sur
l'onglet `Dwell Time`, vous pouvez voir le temps moyen passé par les utilisateurs dans votre expérience. Les moyennes ne tiennent pas compte des jours sans données (
).

Toutes les heures du graphique sont affichées en heure locale, mais 8th Wall ne recueille que des données agrégées
toutes les heures en UTC. Les utilisateurs de la carte dans des fuseaux horaires avec des décalages non horaires verront les données collectées
pour les heures UTC les plus proches de leur jour. Le temps de séjour n'est disponible qu'à partir du 1er janvier 2023. Le jour le plus récent (
) ne sera composé que de données partielles jusqu'à l'heure actuelle.

Les heures de l'infobulle sur le graphique indiquent le début de la période de collecte des données, et la valeur du point
est l'agrégation des données à partir de cette date.

![ProjectDashboardOverview](/images/console-appkey-usage.jpg)

## Exportation CSV {#csv-export}

Des données au format CSV sont également disponibles pour des analyses plus avancées. Vous pouvez télécharger
ces données en cliquant sur l'icône de téléchargement au-dessus du graphique. Les champs CSV sont les suivants :

| Champ d'application | Description                                                                           |
| ------------------- | ------------------------------------------------------------------------------------- |
| dt                  | Chaîne de date et d'heure UTC formatée ISO8601.                       |
| moyenneDwellTimeMs  | La durée moyenne de la session, en millisecondes, pour le jour donné. |
| points de vue       | Le nombre de vues reçues le jour donné.                               |
