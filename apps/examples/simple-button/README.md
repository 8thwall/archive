To add a button to any experience, you can use standard html/css:

In body.html:
```
<button id="myButton">click me</button>
<a-scene ...>
```

In app.js:
```
import './main.css'
```

In main.css:
```
#myButton {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}
```

There are multiple ways to add behaviors to 2D UI elements. One option is to use Javascript via an A-Frame component:

In app.js:
```
AFRAME.registerComponent('button', {
  init() {
    const btn = document.getElementById('myButton')
    btn.addEventListener('click', () => {
      window.open('https://google.com', '_blank')
    })
  }
})
```

Attaching the component to the scene in body.html:
```
<a-scene ... button>
```