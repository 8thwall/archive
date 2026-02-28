---
id: generate-characters
sidebar_position: 3
---

# Générer des personnages animés

Asset Lab prend actuellement en charge le rigging et l'animation de modèles de personnages 3D bipèdes **humanoïdes**.

Pour générer un modèle de personnage riggé et animé, vous devez d'abord générer un modèle de personnage 3D dans une position en T, à partir de plusieurs images, que vous utiliserez comme données d'entrée.

## Étape 1 : Générer des images d'entrée

Il est nécessaire d'utiliser GPT-Image-1 pour générer des entrées d'images pour les caractères animés.  Voir [Générer des images](/studio/asset-lab/generate-models) pour plus de détails.

Utilisez **GPT-Image-1** pour générer des images de caractères multi-vues en position T :

1. Vue de face
2. Vues de droite, de gauche et de dos

Cliquez ensuite sur **Envoyer au modèle 3D**.

![](/images/studio/asset-lab/character-input.png)

## Étape 2 : Générer un modèle 3D

Sélectionnez un modèle de génération 3D pris en charge. Voir [Générer des modèles 3D](/studio/asset-lab/generate-models) pour plus de détails.

Sélectionnez le bouton Générer pour traiter la demande.

![](/images/studio/asset-lab/character-generation.png)

Une fois l'opération terminée, cliquez sur **Envoyer à l'animation**.

## Étape 3 : Rig et animation

Prend actuellement en charge le rigging via **Meshy**. L'entrée doit être un humanoïde bipède avec des membres clairement définis.

Renvoie les clips d'animation suivants :

- Marcher
- Exécuter
- Au repos
- Sauter
- Attaque
- La mort
- Marche des zombies
- La danse

Cliquez sur **Rig + Animate** pour lancer le processus (cela peut prendre jusqu'à 2 minutes).

![](/images/studio/asset-lab/character-animation.png)

## Étape 4 : Importation dans le projet

Utilisez les boutons d'importation ou de téléchargement pour enregistrer votre modèle gréé.

![](/images/studio/asset-lab/character-import.png)

Filtrez pour **Personnages animés** dans la bibliothèque pour les trouver.

![](/images/studio/asset-lab/character-library.png)

![](/images/studio/asset-lab/character-library2.png)
