---
id: generate-models
sidebar_position: 2
---

# Générer des modèles 3D

Pour générer un modèle 3D (format `.glb`), vous devez d'abord générer une ou plusieurs images à utiliser comme entrée. Les modèles 3D sont générés à partir d'une image unique ou d'un ensemble d'images multi-vues.

Ce procédé fonctionne mieux avec des sujets individuels tels que des objets ou des bâtiments, et non avec des scènes entières.

## Étape 1 : Générer des images d'entrée

Commencez par sélectionner un modèle à l'aide du menu déroulant.

![](/images/studio/asset-lab/model-model.png)

Chaque modèle présente des atouts différents, ainsi qu'un prix de crédit différent par demande (affiché dans le bouton Générer près du bas). Voir le document sur les prix du crédit pour la liste complète des prix.

Selon le modèle choisi pour générer une image, vous disposerez de différentes options de saisie. Voir le flux de travail de la génération d'images pour plus de détails sur les modèles et les entrées disponibles.

Utilisez l'option de basculement pour générer soit une image unique (meilleure pour les objets simples et symétriques), soit la vue de face dans un ensemble d'images multiples (meilleure pour les objets plus complexes ou asymétriques).

Si vous sélectionnez Vue unique, vous générez une image de l'objet à un angle de vue de ¾.

![](/images/studio/asset-lab/model-single.png)

Si vous sélectionnez Multi-vues, vous générerez d'abord une vue de l'"avant" de votre objet. Si vous êtes satisfait du résultat, vous pouvez ensuite générer les vues "droite", "gauche" et "arrière" du même objet à l'aide du bouton Générer des vues multiples. Pour cette étape, il est nécessaire d'utiliser l'image GPT-1.

![](/images/studio/asset-lab/model-multi.png)

Lorsque vous êtes satisfait de vos entrées d'images, vous pouvez cliquer sur le bouton "Envoyer au modèle 3D" en bas à droite pour passer à l'étape suivante.

## Étape 2 : Générer un modèle 3D

Sélectionnez le modèle de votre choix et ajustez les paramètres si nécessaire.

### Modèles pris en charge

**Trellis**\
Modèle à grande échelle de Microsoft pour des maillages texturés de haute qualité.\
Entrées :  
Entrées :

- Images à vue unique ou à vues multiples
- Orientation de la forme (0-10)
- Conseils détaillés (1-10)
- Simplification du maillage (0.9-0.98)
- Taille de la texture : 512x512 ou 1024x1024

**Hunyuan 3D-2**\
Générateur de ressources à haute résolution de Tencent.\
Entrées :  
Entrées :

- Images à vue unique ou à vues multiples
- Vitesse (standard ou turbo)
- Orientation (0-20)
- Détail de la forme (1-1024)

**Hunyuan 3D-2 Mini**\
Variante à ressources réduites du Hunyuan 3D-2.\
Entrées :  
Entrées :

- Seules les images
- Vitesse (standard ou turbo)
- Orientation (0-20)
- Détail de la forme (1-1024)

Chaque modèle présente des atouts différents, ainsi qu'un prix de crédit différent par demande (affiché dans le bouton Générer près du bas). Voir le document sur les prix du crédit pour la liste complète des prix.

Sélectionnez le bouton Générer pour commencer.

![](/images/studio/asset-lab/model-generate.png)

## Étape 3 : Importer dans un projet ou télécharger

Utilisez les boutons en bas de page pour importer ou télécharger votre modèle 3D.

![](/images/studio/asset-lab/model-import.png)

Vous pouvez accéder à tous les actifs générés par les utilisateurs de votre espace de travail à partir de la bibliothèque, disponible dans l'onglet gauche de l'outil Asset Lab en plein écran ou dans l'onglet du panneau latéral gauche dans Studio. L'option de filtrage permet d'afficher uniquement les modèles 3D.

![](/images/studio/asset-lab/model-library.png)

![](/images/studio/asset-lab/model-library2.png)

