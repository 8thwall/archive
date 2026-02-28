---
sidebar_label: configure()
---

# XR8.MediaRecorder.configure()

`XR8.MediaRecorder.configure({ coverImageUrl, enableEndCard, endCardCallToAction, footerImageUrl, foregroundCanvas, maxDurationMs, maxDimension, shortLink, configureAudioOutput, audioContext, requestMic })`

## Description {#description}

Configure divers paramètres du MediaRecorder.

## Paramètres {#parameters}

| Paramètres                             | Type     | Défaut                                                      | Description                                                                                                                                                                                                                                                                                                                 |
| -------------------------------------- | -------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| coverImageUrl [Optionnel]              | `Chaîne` | Image de couverture configurée dans le projet, `null` sinon | Source de l'image de couverture.                                                                                                                                                                                                                                                                                            |
| enableEndCard [Facultatif]             | `Chaîne` | `faux`                                                      | Si vrai, activez la carte d'extrémité.                                                                                                                                                                                                                                                                                      |
| endCardCallToAction [Optionnel]        | `Chaîne` | `'essayez-le à : '`                                         | Définit la chaîne de texte pour l'appel à l'action.                                                                                                                                                                                                                                                                         |
| préfixe du nom de fichier [Facultatif] | `Chaîne` | `'my-capture-'`                                             | Définit la chaîne de texte qui ajoute la marque unique au nom du fichier.                                                                                                                                                                                                                                                   |
| footerImageUrl [Optionnel]             | `Chaîne` | `nul`                                                       | Image src pour l'image de couverture.                                                                                                                                                                                                                                                                                       |
| foregroundCanvas [Facultatif]          | `Chaîne` | `nul`                                                       | Le support à utiliser comme premier plan dans la vidéo enregistrée.                                                                                                                                                                                                                                                         |
| maxDurationMs [Optionnel]              | `Nombre` | `15000`                                                     | Durée maximale de la vidéo, en millisecondes.                                                                                                                                                                                                                                                                               |
| maxDimension [Facultatif]              | `Nombre` | `1280`                                                      | Dimension maximale de l'enregistrement capturé, en pixels.                                                                                                                                                                                                                                                                  |
| shortLink [Facultatif]                 | `Chaîne` | 8th.io shortlink depuis le tableau de bord du projet        | Définit la chaîne de texte pour le lien court.                                                                                                                                                                                                                                                                              |
| configureAudioOutput [Optionnel]       | `Objet`  | `nul`                                                       | Fonction fournie par l'utilisateur qui recevra les nœuds audio `microphoneInput` et `audioProcessor` pour un contrôle complet de l'audio de l'enregistrement. Les nœuds attachés au nœud de processeur audio feront partie de l'audio de l'enregistrement. Il doit renvoyer le nœud final du graphe audio de l'utilisateur. |
| audioContext [Facultatif]              | `Chaîne` | `nul`                                                       | Instance de `AudioContext` fournie par l'utilisateur. Des moteurs comme three.js et BABYLON.js ont leur propre instance audio interne. Pour que les enregistrements contiennent des sons définis dans ces moteurs, vous devrez fournir leur instance `AudioContext`.                                                        |
| requestMic [Facultatif]                | `Chaîne` | `auto`                                                      | Détermine le moment où les autorisations audio sont demandées. Les options sont fournies à l'adresse [`XR8.MediaRecorder.RequestMicOptions`](requestmicoptions.md).                                                                                                                                                         |

La fonction transmise à `configureAudioOutput` prend un objet avec les paramètres suivants :

| Paramètres      | Description                                                                                                                                                                                                                                                                            |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| microphoneInput | Un GainNode [``](https://developer.mozilla.org/en-US/docs/Web/API/GainNode) qui contient l'entrée micro de l'utilisateur. Si les autorisations de l'utilisateur ne sont pas acceptées, ce nœud n'émettra pas l'entrée micro mais sera toujours présent.                                |
| audioProcessor  | un ScriptProcessorNode [``](https://developer.mozilla.org/en-US/docs/Web/API/ScriptProcessorNode) qui transmet les données audio à l'enregistreur. Si vous souhaitez qu'un nœud audio fasse partie de la sortie audio de l'enregistrement, vous devez le connecter à l'audioProcessor. |

## Retours {#returns}

Aucun

## Exemple {#example}

```javascript
XR8.MediaRecorder.configure({
  maxDurationMs : 15000,
  enableEndCard : true,
  endCardCallToAction : 'Try it at:',
  shortLink : '8th.io/my-link',
})
```

## Exemple - sortie audio configurée par l'utilisateur {#example---user-configured-audio-output}

```javascript
const userConfiguredAudioOutput = ({microphoneInput, audioProcessor}) => {
  const myCustomAudioGraph = ...
  myCustomAudioSource.connect(myCustomAudioGraph)
  microphoneInput.connect(myCustomAudioGraph)

  // Connectez le nœud final du graphique audio au matériel.
  myCustomAudioGraph.connect(microphoneInput.context.destination)

  // Le graphique audio sera automatiquement connecté au processeur.
  return myCustomAudioGraph
}
const threejsAudioContext = THREE.AudioContext.getContext()
XR8.MediaRecorder.configure({
  configureAudioOutput : userConfiguredAudioOutput,
  audioContext : threejsAudioContext,
  requestMic : XR8.MediaRecorder.RequestMicOptions.AUTO,
})
```
