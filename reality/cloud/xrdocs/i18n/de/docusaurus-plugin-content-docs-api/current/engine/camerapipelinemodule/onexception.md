# onException()

onException: (Fehler)\\`

## Beschreibung {#description}

onException()\\` wird aufgerufen, wenn ein Fehler in XR auftritt. Wird mit dem Fehlerobjekt aufgerufen.

## Parameter {#parameters}

| Parameter | Beschreibung                          |
| --------- | ------------------------------------- |
| Fehler    | Das Fehlerobjekt, das ausgelöst wurde |

## Beispiel {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'mycamerapipelinemodule',
    onException : (error) => {
      console.error('XR warf eine Ausnahme', error)
  },
})
```
