---
slug: '/'
sidebar_label: Introduction à l'API
sidebar_position: 1
description: Cette section présente en détail les API disponibles pour créer des expériences WebAR immersives avec 8th Wall Studio.
---

# Introduction à l'API

Cette section présente en détail les API disponibles pour créer des expériences WebAR immersives avec 8th Wall Studio.

La référence de l'API du 8e mur est organisée en deux groupes principaux :

## Studio API

L'API Studio fournit tout ce dont vous avez besoin pour créer des expériences structurées et dynamiques dans Studio.

L'API Studio comprend

- [**Entity-Component System (ECS)**](/api/studio/ecs) - API pour travailler avec l'architecture ECS de Studio, vous permettant de créer, modifier et organiser des entités et des composants au moment de l'exécution.
- [**World**](/api/studio/world) - Fonctions et utilitaires de base pour la gestion du graphe de scène global, y compris les hiérarchies d'entités, les transformations et les espaces. Le monde est le contenant de tous les espaces, entités, requêtes et observateurs de votre projet.
- [**Events**](/api/studio/events) - Un système riche pour envoyer et répondre aux événements d'exécution dans Studio.

Utilisez l'API Studio pour créer des expériences immersives, avec état, qui répondent aux entrées des joueurs, aux changements du monde et aux interactions en temps réel.

[Explorer l'API Studio →](/api/studio)

## API moteur

L'API moteur fournit un accès de niveau inférieur au moteur AR sous-jacent de 8th Wall, notamment :

- **8th Wall Camera Pipeline Modules** - Modules de pipeline de caméra développés par 8th Wall.
- **Modules personnalisés pour le pipeline de la caméra** - Interface permettant de travailler avec le pipeline de traitement des images de la caméra.

Utilisez l'API moteur lorsque vous avez besoin d'un contrôle fin sur l'entrée de la caméra, le traitement des images, ou lorsque vous intégrez des flux de travail WebGL ou de vision par ordinateur personnalisés dans votre projet.

[Explorer l'API du moteur →](/api/engine)

---

## Choisir la bonne API

- → Commencez par l'API de Studio pour travailler dans l'environnement de développement structuré de Studio.

- → Plongez dans l'API du moteur pour l'accès à la caméra et les fonctions de réalité augmentée de bas niveau.

:::note
**Les expériences Studio peuvent utiliser des modules de pipeline de caméra personnalisés pour un contrôle avancé, mais l'API Studio et l'API Engine ont des objectifs différents : Studio s'occupe de la construction du monde et de l'interaction, tandis que Engine gère la caméra de bas niveau et le traitement des images**.
:::
