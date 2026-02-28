---
id: writing-backend-code
sidebar_position: 2
---

# Écrire le code du backend

## Aperçu

Le code de la fonction backend s'exécute dans un environnement sans serveur associé à votre compte 8th Wall.
Toutes les fonctions backend doivent exporter une méthode **async** de premier niveau appelée `handler`, qui est le point d'entrée
dans la fonction backend.

Exemple de code de fichier d'entrée :

```javascript
const handler = async (event: any) => {
  // Custom backend code goes here

  return {
    body: JSON.stringify({
      myResponse,
    }),
  }
}

export {
  handler,
}
```

## Méthode du client

Lorsque vous créez une fonction backend, une méthode client est automatiquement créée pour vous. Cette méthode du client
est une enveloppe autour de `fetch`, ce qui signifie que vous pouvez passer les mêmes arguments à cette fonction que vous
le feriez avec un appel normal à `fetch`. Voir [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch)
pour plus de détails.

Cette méthode client permet d'envoyer des requêtes du code client du module à la fonction backend.

![FetchWrapper](/images/studio/bfn-fetch-wrapper.png)

## Fonction Paramètres de l'événement

La méthode du gestionnaire est invoquée avec un objet `event` à chaque fois que la méthode du client est appelée. `event`
a les propriétés suivantes :

| Propriété             | Type                                                 | Description                                                                                                                                                                                      |
| --------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| chemin                | chaîne de caractères                                 | Le chemin de l'URL passé à la méthode du client (`'/getUser/foo'` , `'/checkAnswer'`, etc).                                                                   |
| corps                 | chaîne de caractères                                 | Appeler `JSON.parse(event.body)` pour transformer le corps en objet.                                                                                                             |
| httpMethod            | chaîne de caractères                                 | La méthode HTTP utilisée pour appeler la fonction du backend. L'un des éléments suivants : `'GET'', `'PUT'', `'POST'', `'PATCH'', \\`'DELETE''. |
| queryStringParameters | Enregistrer<string, string> | Paires clé/valeur contenant les paramètres de la chaîne de requête de la demande.                                                                                                |
| en-têtes              | Enregistrer<string, string> | Paires clé/valeur contenant les en-têtes de la demande.                                                                                                                          |

## Objet de retour

Toutes les propriétés sont facultatives.

| Propriété   | Type                                                 | Description                                                                                   |
| ----------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| code d'état | id                                                   | Le code d'état de la réponse. La valeur par défaut est `200`. |
| en-têtes    | Enregistrer<string, string> | Les en-têtes associés à la réponse.                                           |
| corps       | chaîne de caractères                                 | L'objet `JSON.stringify()` associé à la réponse.                              |

## Gestion des erreurs

Si la fonction du backend lève une exception, la fonction retournera `statusCode : 500`
avec un objet d'erreur dans le corps de la réponse.

Si vous **possédez** le module et êtes **en mode développement**, l'objet d'erreur contiendra `name`,
`message` et `stack` :

`{error: {name: string, message: string, stack: string}}`

Exemple :

```
{
  "error": {
    "name": "TypeError",
    "message": "Cannot read properties of undefined (reading 'foo')",
    "stack": "TypeError: Cannot read properties of undefined (reading 'foo')\n at call (webpack:///src/index.ts:8:24)\n ...
  }
}
```

Pour le mode **non-développement**, l'objet d'erreur ne contiendra pas de propriété `name` ou `stack` et le `message` de
sera une erreur générique de type "Internal Server Error".

## Épingler des cibles

Veuillez vous référer à https://www.8thwall.com/docs/guides/modules/pinning-targets/ pour plus de détails sur les cibles d'épinglage du module
.

Lors de l'épinglage d'une `Version`, **Mises à jour autorisées** doit être réglé sur `None`

![BFNVersionPinning](/images/studio/bfn-version-pinning.png)

Lorsque vous épinglez un `Commit`, sélectionnez un commit spécifique.  `Latest` n'est pas supporté.

![BFNCommitPinning](/images/studio/bfn-commit-pinning.png)
