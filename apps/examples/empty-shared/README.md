## A-Frame: Shared AR Template

This project demonstrates how to easily create Shared AR experiences using the Shared AR Library and a custom invite overlay. It spawns player entities represented as spheres and a cube which rotates when any player taps it.

Note that player entities are **not co-localized**. All players are spawned in the same position in their **own coordinate system**. While the movement of the spheres mimics players' movement in the real world, the positions are relative to the point the experience started and not the actual positions of players.

It is more common to spawn player entities in unique positions instead of attaching them to the camera. See the [Hot Pot Hop sample project](https://www.8thwall.com/8thwall/hot-pot-hop) for an example.

This project is based on the [basic persistence networked-aframe example](https://github.com/networked-aframe/networked-aframe/blob/master/examples/basic-persistent.html).
This project uses [Networked A-Frame](https://github.com/networked-aframe/networked-aframe) and the [Shared AR Module](https://www.8thwall.com/8thwall/modules/shared-ar).

**Note**: Shared AR is supported on `Plus`, `Pro`, and `Enterprise` plans. It is **not supported**
for `Starter` plans.

### Try it yourself

Use the QR code within the experience to open the game on a different device or browser.
