---
id: tracking-and-camera-issues
---

# トラッキングとカメラの問題

## 6DoF カメラモーションが動作しない {#camera-problem}

#### 問題 {#camera-issue}

携帯電話を動かしても、カメラの位置は更新されない。

#### 解像度 {#camera-resolution}

シーン内のカメラの位置を確認してください。  カメラは高さ（Y）が
ゼロであってはならない。  ゼロ以外の値に設定する。  シーン内のカメラの位置を確認してください。  カメラは高さ（Y）が
ゼロであってはならない。  ゼロ以外の値に設定する。  開始時のカメラのY位置は、サーフェス上の仮想コンテンツの
スケールを効果的に決定します（例えば、Yが小さいとコンテンツは大きくなります）。

## オブジェクトがサーフェスを正しくトラッキングしない {#tracking-problem}

#### 問題 {#tracking-issue}

私のシーンでは、コンテンツが表面に正しく「貼りついて」いないように見える。

#### 解像度 {#tracking-resolution}

オブジェクトをサーフェス上に置くには、オブジェクトの**ベース**が**Y=0**の高さにある必要がある。

**注**\*：Y=0の高さに位置を設定するだけでは必ずしも十分ではありません。

例えば、モデルのトランスフォームがオブジェクトの中心にある場合、それをY=0に置くと、
、オブジェクトの一部が表面の下に住むことになります。  この場合、
オブジェクトの垂直位置を調整して、オブジェクトの底がY=0に収まるようにする必要があります。  この場合、
オブジェクトの垂直位置を調整して、オブジェクトの底がY=0に収まるようにする必要があります。

、Y=0に半透明な平面を置くことで、サーフェスに対するオブジェクトの位置関係を視覚化するのに役立つことが多い。

#### Aフレームの例 {#a-frame-example}

```html
<a-plane
  position="0 0 0"
  rotation="-90 0 0"
  width="4"
  height="4"
  material="side: double; color：#transparent: true; opacity: 0.5"
  shadow>.
</a-plane>
```

#### three.js サンプル {#threejs-example}

```javascript
  //
  var geometry = new THREE.PlaneGeometry(1, 1, 1, 1); // THREE.PlaneGeometry (width, height, widthSegments, heightSegments)
  var material = new THREE.MeshBasicMaterial({color: 0xffff00, transparent:true, opacity:0.5, side: THREE.DoubleSide});
  var plane = new THREE.Mesh(geometry, material);
  // 平面が地面と平行になるように、X に沿って 90 度回転（ラジアン単位） 
  plane.rotateX(1.5708)
  plane.position.set(0, 0, 0)
  scene.add( plane )；
```
