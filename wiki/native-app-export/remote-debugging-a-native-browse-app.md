# Remote Debugging a Native-Browse App

This allows someone to connect a native-browse app (e.g. Solstice) to the chrome devtools to allow for remote debugging/performance monitoring

 1. Be on the same Wi-Fi as your Quest (lighthouse-rocks if you’re in the office)

 2. Add `"--inspect=0.0.0.0:9229",` to `c8/html-shell/quest/quest-shell-main.cc` under `"--experimental-vm-modules",`

 3. Run `./apps/client/nae/solstice/quest/build-install.sh`

 4. Run `adb shell ifconfig | grep inet` and grab the IP that looks the most similar to `192.168.229.17`

 5. Go to chrome://inspect/#devices on your dev machine

 6. <REMOVED_BEFORE_OPEN_SOURCING>
 
 7. <REMOVED_BEFORE_OPEN_SOURCING>

 8. <REMOVED_BEFORE_OPEN_SOURCING>

 9. Enter `<your-ip>:9229`

 10. Go back to the devices screen and you should see a “Remote Target” with the expected IP, and if the app is running, a debuggable session:

## Troubleshooting

### Enable local network for Chrome

 * Ensure that inspect is working check the terminal logs if it prints something like: `Debugger listening on ws://0.0.0.0:9229/f4213cc6-40bf-4923-b057-23570fa3957d`

 * If the target isn’t showing up under Remote Target, check if opening browser on the quest will at least have it show some page under Quest

 * Check if you can ping the ip address of the device

 * Sometimes switching VPN to SVL will also fix the issue

 * Check under Mac Settings > Privacy & Security > Local Network, enable Google Chrome

