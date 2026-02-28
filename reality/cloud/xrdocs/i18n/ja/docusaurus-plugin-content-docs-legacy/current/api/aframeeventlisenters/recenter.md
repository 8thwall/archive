# センター

`scene.emit('recenter', {origin, facing})`.

## 説明 {#description}

カメラの映像を原点に戻す。 新しい原点が引数として与えられると、カメラの原点はその原点にリセットされ、リセンターされる。

xrweb`または`XR8.FaceController.configure({coordinates: {origin, scale, axes}})`/`xrface`または`xrlayers`を使用している場合は`XR8.LayersController.configure({coordinates: {origin, scale, axes}})\\`.

**重要:** A-Frameでは、`updateCameraProjectionMatrix()`と/または`configure()`は、シーン内の初期カメラ位置に基づいて最初に呼び出されます。

## パラメータ {#parameters}

| パラメータ                                                                                          | 説明                   |
| ---------------------------------------------------------------------------------------------- | -------------------- |
| origin: {x, y, z} [オプション]。 | 新しい原点の位置。            |
| に直面している：{w, x, y, z}.[オプション］                         | 原点でカメラが向くべき方向を表す四元数。 |

## 例 - シーンを再調整する {#example}

```javascript
let scene = this.el.sceneEl
scene.emit('recenter')
```

## 例 - シーンを再センタし、原点を更新する {#example---update-origin}

```javascript
let scene = this.el.sceneEl
scene.emit('recenter', {
  origin: {x: 1, y: 4, z: 0},
  facing: {w: 0.9856, x:0, y:0.169, z:0}
})
```
