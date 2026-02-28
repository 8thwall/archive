---
id: environment-variables
sidebar_position: 3
---

# Variables d'environnement

Les variables d'environnement vous permettent de protéger les informations sensibles associées à votre module.
Par exemple, ils vous permettent de stocker et de transmettre des informations d'authentification sans les exposer
directement dans votre code.

## Créer des variables d'environnement

1. Sélectionnez la fonction back-end dans votre module.
2. Cliquez sur "Nouvelle variable d'environnement".

![NewEnvironmentVariable](/images/studio/bfn-new-environment-variable.png)

3. Définir une clé (nom de la variable)

![NewEnvironmentVariable](/images/studio/bfn-environment-variable-key.png)

4. Définir une étiquette - il s'agit du nom de la clé qui sera affichée pour les projets utilisant le module
   contenant la fonction backend.

![NewEnvironmentVariable](/images/studio/bfn-environment-variable-label.png)

## Accéder à une variable d'environnement dans le code

Les variables d'environnement sont accessibles dans votre code sous la forme `process.env.<KEY>`

### Exemple :

```ts
const API_KEY = process.env.api_key
```
