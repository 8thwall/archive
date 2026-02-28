---
id: serve-localhost
---

# No se puede conectar con el script "serve

#### Edición {#issue}

Estoy usando el script "serve" (del repositorio público GitHub de 8th Wall Web:
<https://github.com/8thwall/web>) para ejecutar un servidor web local en mi portátil y dice que está escuchando en
**127.0.0.1**.  Mi teléfono no puede conectarse al portátil utilizando esa dirección IP.

![ServeLocalhost](/images/serve-localhost.jpg)

"127.0.0.1" es la dirección de loopback de tu portátil (también conocida como "localhost"), por lo que otros dispositivos como tu teléfono
no podrán conectarse directamente a esa dirección IP.  Por alguna razón, el script `serve` ha
decidido escuchar en la interfaz loopback.

#### Resolución {#resolution}

Vuelva a ejecutar el script `serve` con el indicador `-i` y especifique la interfaz de red que desea utilizar.

#### Ejemplo (Mac) {#example-mac}

`./serve/bin/serve -d gettingstarted/xraframe/ -p 7777 -i en0`

#### Ejemplo (Windows) {#example-windows}

**Nota:** Ejecute el siguiente comando utilizando una ventana estándar de símbolo del sistema (**cmd.exe**). El \*script
generará errores si se ejecuta desde PowerShell.

`serve\bin\serve.bat -d gettingstarted\xraframe -p 7777 -i WiFi`

Si sigue sin poder conectarse, compruebe lo siguiente:

- Asegúrate de que tanto tu ordenador como tu dispositivo móvil están conectados a la **misma red WiFi**.
- **Desactiva** el **firewall** local de tu ordenador.
- Para conectarse, escanee el código QR **o** asegúrese de copiar la **URL completa** de "Escucha" en
  su navegador, incluyendo tanto el "**https://**" al principio como el **número de puerto** al final.
