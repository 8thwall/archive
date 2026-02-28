---
id: creating-backend-functions
sidebar_position: 1
---

# Création de fonctions dorsales

:::info
Les fonctions dorsales sont exécutées dans le contexte du système de modules de 8th Wall. Pour une documentation complète sur le module
, veuillez [voir ici](https://www.8thwall.com/docs/guides/modules/overview/).  Cette section de la documentation
se concentre spécifiquement sur la fonctionnalité Backend Function fournie par le module
.
:::

Les modules peuvent être créés à partir de la page Espace de travail (onglet Modules) ou directement dans un projet Studio. Pour
créer un module avec une fonction backend directement dans Studio, veuillez suivre les étapes suivantes :

1. Dans l'éditeur Studio, sélectionnez l'onglet Modulese dans le panneau de gauche et cliquez sur "+ Nouveau module"

![CreateNewModule](/images/studio/bfn-new-module.png)

2. Sélectionnez l'onglet "Créer un nouveau module" et donnez à votre nouveau module un ID de module.  Cette valeur sera utilisée
   pour référencer ultérieurement votre module dans le code du projet.  Il ne peut être modifié après la création.

![ModuleId](/images/studio/bfn-module-id.png)

3. Ajouter un backend au module : Explorateur de fichiers -> sélectionner l'onglet Modules -> faire un clic droit sur Backends ->
   sélectionner New Backend config.

![NewBackendFunction](/images/studio/bfn-new-backend-config.png)

4. Dans l'assistant Nouveau backend, sélectionnez le type de backend souhaité (Fonction, dans ce cas), donnez-lui un titre et une description (
   ). Le nom de fichier du backend sera automatiquement généré sur la base du titre
   et c'est ainsi que vous référencerez le backend dans le code du module.

![NewBackend](/images/studio/bfn-new-backend.png)

5. Définissez un chemin d'entrée pour votre code backend.  C'est dans ce fichier que se trouve le point d'entrée du code du backend
   .

![BackendFunctionEntryPath](/images/studio/bfn-entry-path.png)

6. Créez un fichier avec le même chemin/nom que celui défini à l'étape Chemin d'entrée ci-dessus.  Cliquez avec le bouton droit de la souris sur Fichiers -> Nouveau fichier -> Fichier vide :

![BackendFunctionEmptyFile](/images/studio/bfn-create-empty-file.png)

Tapez ou collez le nom qui correspond à votre chemin d'entrée :

![BackendFunctionEmptyFileName](/images/studio/bfn-create-empty-file-name.png)

Résultat :

![BackendFunctionEmptyFileNameResult](/images/studio/bfn-create-empty-file-result.png)

:::info
La fonction backend doit exporter une méthode **async** appelée `handler`.  Veuillez vous référer à la documentation [Writing Backend Code](/studio/essentials/modules/backend-services/backend-functions/writing-backend-code/) pour plus de détails.
:::

Exemple :

```javascript
const handler = async (event : any) => {
  // Le code backend personnalisé va ici

  return {
    body : JSON.stringify({
      myResponse,
    }),
  }
}

export {
  handler,
}
```
