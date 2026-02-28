This project demonstrates how to dynamically load assets while leveraging the A-Frame asset management system.

The entry point for this experience is `app.js`.

After detecting which device the user is on (mobile or desktop), the scene (either `mobile-scene.html` or `desktop-scene.html`) is appended to the document and loads only assets/entities which are relevant to that device.