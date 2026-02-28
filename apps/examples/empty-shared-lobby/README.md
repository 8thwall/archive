## A-Frame: Shared AR Lobby Template

This project demonstrates how to use lobby pages to easily create Shared AR experiences. It spawns player entities represented as spheres and a cube which rotates when any player taps it.

Note that player entities are **not co-localized**. All players are spawned in **the same position** in their **own coordinate system**. While the movement of the spheres mimics players' movement in the real world, the positions are relative to the point the experience started and not the actual positions of players.

In AR, is more common to spawn player entities in unique positions instead of attaching them to the camera. See the Player Spawning section below.

This project is based on the [basic persistence networked-aframe example](https://github.com/networked-aframe/networked-aframe/blob/master/examples/basic-persistent.html).
This project uses [Networked A-Frame](https://github.com/networked-aframe/networked-aframe) and the [Shared AR Module](https://www.8thwall.com/8thwall/modules/shared-ar).

**Note**: Shared AR is supported on `Plus`, `Pro`, and `Enterprise` plans. It is **not supported**
for `Starter` plans.

### Try it yourself

Click the "new game" button to start a new lobby. Use the QR code or invite link to open the game on a different device or different browser (chrome and safari, for example).

### Player spawning

In this project, all players are spawned in the same place. Best practice is to spawn players at a designated position.
For example, if the project was limited to two players it would instead spawn players across from each other.
To spawn players at a designated position, create a spawner component and attach it to the avatar-template.
Spawner components should create an ordered list of clients and assign each associated instance of the template a unqiue position.

See the [playerSpawnerComponent in Hot Pot Hop](https://www.8thwall.com/8thwall/hot-pot-hop/code/components/multiplayer.js#L256) for an example.

In VR, best practice is to spawn player entities in a circle. See the [spawn-in-circle component](https://github.com/networked-aframe/networked-aframe/blob/master/examples/js/spawn-in-circle.component.js).

### How this project was made

#### 1. Clone the [A-Frame: World Effects Template sample project](https://www.8thwall.com/8thwall/unitcube-aframe)

#### 2. Import the [Shared AR module](https://www.8thwall.com/8thwall/modules/shared-ar)

#### 3. Add the Networked A-Frame script in `head.html`

```
<script src="https://unpkg.com/networked-aframe@^0.11.0/dist/networked-aframe.min.js" crossorigin="anonymous"></script>
```

#### 4. Add the `networked-scene` component to the `a-scene`

```
<a-scene ... networked-scene="adapter: sharedar; connectOnLoad: false">
```

#### 5. Add the `lobby-pages` component to the `a-scene`.

Use lobby pages to quickly set up peer connections. All you need to do is set `room` on the `networked-scene` component. The room value is provided through the `lobby8-roomJoined` event. See a list of [lobby page events here](https://www.8thwall.com/8thwall/modules/shared-ar).
Learn more about [lobby pages here](https://www.8thwall.com/8thwall/modules/shared-ar).

```
<a-scene ... lobby-pages>
```

#### 6. Create the `lobby-handler` component, add to the `a-scene`

```
import {initializeSharedAR} from 'shared-ar'

const lobbyHandlerComponent = {
  init() {
    initializeSharedAR()

    const connect = (event) => {
      this.el.setAttribute('networked-scene', 'room', event.detail.roomConnection.roomId)
      this.el.emit('connect')
    }
    const startAR = () => {
      this.el.setAttribute('xrweb', 'allowedDevices: any')
    }

    this.el.addEventListener('lobby8-roomJoined', connect)
    this.el.addEventListener('lobby8-countdowndone', startAR)
  },
}

export {lobbyHandlerComponent}
```

#### 7. Define the `avatar-template` and `box-template`

```
<a-assets>
  <template id="avatar-template">
    <a-sphere></a-sphere>
  </template>

  <template id="sphere-template">
    <a-entity
      class="cantap"
      geometry="primitive: box"
      position="0 0.5 0"
      material="
      color: #AD50FF; shader: flat;
      src: https://cdn.8thwall.com/web/assets/cube-texture.png"
      color-changer></a-entity>
  </template>
</a-assets>
```

#### 8. Add the `networked` entities to the `a-scene`

```
<!-- player entities -->
<a-entity networked="template: #avatar-template" xrextras-attach="target: camera"></a-entity>

<!-- sphere entity -->
<a-entity networked="template: #sphere-template; networkId: sphere; persistent: true; owner: scene"></a-entity>
```
