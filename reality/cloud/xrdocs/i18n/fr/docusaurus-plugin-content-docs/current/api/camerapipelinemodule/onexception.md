# onException()

`onException : (erreur)`

## Description {#description}

`onException()` est appelé lorsqu'une erreur se produit dans le XR. Appelé avec l'objet d'erreur.

## Paramètres {#parameters}

| Paramètres | Description                      |
| ---------- | -------------------------------- |
| erreur     | L'objet d'erreur qui a été lancé |

## Exemple {#example}

```javascript
XR8.addCameraPipelineModule({
  name : 'mycamerapipelinemodule',
    onException : (error) => {
      console.error('XR threw an exception', error)
  },
})
```
