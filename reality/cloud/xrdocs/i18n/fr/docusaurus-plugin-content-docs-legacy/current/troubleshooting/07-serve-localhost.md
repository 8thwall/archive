---
id: serve-localhost
---

# Impossible de se connecter au script "serve".

#### Numéro {#issue}

J'utilise le script "serve" (du repo GitHub public de 8th Wall Web :
<https://github.com/8thwall/web>) pour lancer un serveur web local sur mon ordinateur portable et il indique qu'il écoute sur
**127.0.0.1**.  Mon téléphone n'arrive pas à se connecter à l'ordinateur portable en utilisant cette adresse IP.

![ServeLocalhost](/images/serve-localhost.jpg)

"127.0.0.1" est l'adresse de bouclage de votre ordinateur portable (alias "localhost"), de sorte que d'autres appareils tels que votre téléphone
ne pourront pas se connecter directement à cette adresse IP.  Pour une raison quelconque, le script `serve` a décidé
d'écouter sur l'interface loopback.

#### Résolution {#resolution}

Veuillez réexécuter le script `serve` avec l'option `-i` et spécifier l'interface réseau que vous souhaitez utiliser.

#### Exemple (Mac) {#example-mac}

`./serve/bin/serve -d gettingstarted/xraframe/ -p 7777 -i en0`

#### Exemple (Windows) {#example-windows}

**Note:** Exécutez la commande suivante dans une fenêtre standard de l'invite de commande (**cmd.exe**). Le script\* génère des erreurs s'il est exécuté à partir de PowerShell.

`serve\bin\serve.bat -d gettingstarted\xraframe -p 7777 -i WiFi`

Si vous ne parvenez toujours pas à vous connecter, vérifiez les points suivants :

- Assurez-vous que votre ordinateur et votre appareil mobile sont tous deux connectés au **même réseau WiFi**.
- **Désactivez** le **firewall** local en cours d'exécution sur votre ordinateur.
- Pour vous connecter, scannez le code QR **ou** veillez à copier l'intégralité de l'URL "Listening" dans
  votre navigateur, y compris le "**https://**" au début et le **numéro de port** à la fin.
