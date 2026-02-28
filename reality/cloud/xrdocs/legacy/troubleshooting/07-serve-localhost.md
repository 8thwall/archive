---
id: serve-localhost
---
# Can't connect to "serve" script

#### Issue {#issue}

I'm using the "serve" script (from 8th Wall Web's public GitHub repo:
<https://github.com/8thwall/web>) to run a local webserver on my laptop and it says it's listening on
**127.0.0.1**.  My phone is unable to connect to the laptop using that IP address.

![ServeLocalhost](/images/serve-localhost.jpg)

"127.0.0.1" is the loopback address of your laptop (aka "localhost"), so other devices such as your
phone won't be able to connect directly to that IP address.  For some reason, the `serve` script has
decided to listen on the loopback interface.

#### Resolution {#resolution}

Please re-run the `serve` script with the `-i` flag and specify the network interface you wish to use.

#### Example (Mac) {#example-mac}

`./serve/bin/serve -d gettingstarted/xraframe/ -p 7777 -i en0`

#### Example (Windows) {#example-windows}

**Note:** Run the following command using a standard **Command Prompt** window (**cmd.exe**). The
*script will generate errors if run from PowerShell.

`serve\bin\serve.bat -d gettingstarted\xraframe -p 7777 -i WiFi`

If you are still unable to connect, please check the following:

* Make sure that your computer and mobile device are both connected to the **same WiFi network**.
* **Disable** the local **firewall** running on your computer.
* To connect, either scan the QR code **or** make sure to copy the **entire** "Listening" URL into
your browser, including both the "**https://**" at the beginning and **port** number at the end.
