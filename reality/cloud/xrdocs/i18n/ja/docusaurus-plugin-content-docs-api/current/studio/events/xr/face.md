---
id: face
sidebar_position: 1
---

# フェイス・エフェクト・イベント

## タイプ {#types}

### TransformObject {#TransformObject}

| プロパティ        | タイプ            | 説明                                  |
| ------------ | -------------- | ----------------------------------- |
| position     | `{x, y, z}`    | 位置する面の3Dポジション。                      |
| rotation     | `{w, x, y, z}` | 配置された面の3次元の局所的な向き。                  |
| scale        | `Number`       | この面に取り付けられているオブジェクトに適用されるスケールファクター。 |
| scaledWidth  | `Number`       | スケールを掛けたときのシーン内の頭部のおおよその幅。          |
| scaledHeight | `Number`       | スケールを掛けたときのシーン内の頭部のおおよその高さ。         |
| scaledDepth  | `Number`       | スケールを掛けたときの、シーン内の頭部のおおよその深さ。        |

## イベント

### facefound {#facefound}

このイベントは、Face Effectsが最初に顔を見つけたときに発行される。

#### プロパティ

| プロパティ            | タイプ                                   | 説明                                                                                                                                                                                                            |
| ---------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id               | `Number`                              | 位置する面の数値ID                                                                                                                                                                                                    |
| transform        | [`TransformObject`](#TransformObject) | 位置する顔の変形情報。                                                                                                                                                                                                   |
| vertices         | `[{x, y, z}]`                         | トランスフォームに対する顔点の位置。                                                                                                                                                                                            |
| normals          | `[{x, y, z}]`                         | トランスフォームに対する頂点の法線方向。                                                                                                                                                                                          |
| attachmentPoints | `{ name, position: {x,y,z} }`         | 使用可能なアタッチメントポイントのリストについては、[`XR8.FaceController.AttachmentPoints`](https://www.8thwall.com/docs/api/facecontroller/attachmentpoints/) を参照してください。 position\`はトランスフォームからの相対位置である。 position`はトランスフォームからの相対位置である。 |
| uvsInCameraFrame | `[{u, v}]`                            | 返された頂点点に対応するカメラフレーム内の uv 位置のリスト。                                                                                                                                                                              |

#### 例

```ts
world.events.addListener(world.events.globalId, 'facecontroller.facefound', (e) => {
    console.log(e)
})
```

### faceloading {#faceloading}

このイベントは、追加の顔ARリソースのロードが開始されたときにFace Effectsによって発行されます。

#### プロパティ

| プロパティ           | タイプ                                                                 | 説明                                                           |
| --------------- | ------------------------------------------------------------------- | ------------------------------------------------------------ |
| 最大検出数           | 番号                                                                  | 同時に処理できる面の最大数。                                               |
| ポイント・パー・ディテクション | 番号                                                                  | 面ごとに抽出される頂点の数。                                               |
| 指標              | [{a, b, c}]\\` | configureのmeshGeometryで指定された、要求されたメッシュの三角形を形成する頂点配列へのインデックス。 |
| 紫外線             | [{u, v}]\\`    | 返された頂点ポイントに対応するテクスチャ・マップのuv位置。                               |

#### 例

```ts
world.events.addListener(world.events.globalId, 'facecontroller.faceloading', (e) => {
    console.log(e)
})
```

### facelost {#facelost}

このイベントは、顔が追跡されなくなったときにFace Effectsから発行される。

#### プロパティ

| プロパティ | タイプ | 説明          |
| ----- | --- | ----------- |
| アイドル  | 番号  | 失われた顔の数値ID。 |

#### 例

```ts
world.events.addListener(world.events.globalId, 'facecontroller.facelost', (e) => {
    console.log(e)
})
```

### フェイススキャン {#facescanning}

このイベントは、すべての顔ARリソースがロードされ、スキャンが開始されたときにFace Effectsによって発行されます。

#### プロパティ

| プロパティ           | タイプ                                                                 | 説明                                                           |
| --------------- | ------------------------------------------------------------------- | ------------------------------------------------------------ |
| 最大検出数           | 番号                                                                  | 同時に処理できる面の最大数。                                               |
| ポイント・パー・ディテクション | 番号                                                                  | 面ごとに抽出される頂点の数。                                               |
| 指標              | [{a, b, c}]\\` | configureのmeshGeometryで指定された、要求されたメッシュの三角形を形成する頂点配列へのインデックス。 |
| 紫外線             | [{u, v}]\\`    | 返された頂点ポイントに対応するテクスチャ・マップのuv位置。                               |

#### 例

```ts
world.events.addListener(world.events.globalId, 'facecontroller.facescanning', (e) => {
    console.log(e)
})
```

### faceupdated {#faceupdated}

このイベントは、Face Effectsによって、その後顔が見つかったときに発行される。

#### プロパティ

| プロパティ            | タイプ                                                                 | 説明                                                                                                                                                                                                            |
| ---------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| アイドル             | 番号                                                                  | 位置する面の数値ID                                                                                                                                                                                                    |
| 変える              | [TransformObject\\`](#TransformObject)                             | 位置する顔の変形情報。                                                                                                                                                                                                   |
| 頂点               | [{x, y, z}]\\` | トランスフォームに対する顔点の位置。                                                                                                                                                                                            |
| 標準               | [{x, y, z}]\\` | トランスフォームに対する頂点の法線方向。                                                                                                                                                                                          |
| アタッチメントポイント      | 名前、ポジション： {x,y,z} }\\`                                             | 使用可能なアタッチメントポイントのリストについては、[`XR8.FaceController.AttachmentPoints`](https://www.8thwall.com/docs/api/facecontroller/attachmentpoints/) を参照してください。 position\`はトランスフォームからの相対位置である。 position`はトランスフォームからの相対位置である。 |
| uvsInCameraFrame | [{u, v}]\\`    | 返された頂点点に対応するカメラフレーム内の uv 位置のリスト。                                                                                                                                                                              |

#### 例

```ts
world.events.addListener(world.events.globalId, 'facecontroller.faceupdated', (e) => {
    console.log(e)
})
```

### blinked {#blinked}

このイベントは、トラッキングされた顔の目がまばたきしたときにFace Effectsから発行されます。

#### プロパティ

| プロパティ | タイプ | 説明         |
| ----- | --- | ---------- |
| アイドル  | 番号  | 位置する面の数値ID |

#### 例

```ts
world.events.addListener(world.events.globalId, 'facecontroller.blinked', (e) => {
    console.log(e)
})
```

### interpupillarydistance {#interpupillarydistance}

このイベントは、トラッキングされた顔の各瞳孔の中心間の距離がミリメートル単位で最初に検出されたときに、Face Effectsによって発行されます。

#### プロパティ

| プロパティ | タイプ | 説明                       |
| ----- | --- | ------------------------ |
| アイドル  | 番号  | 位置する面の数値ID。              |
| 瞳孔間距離 | 番号  | 各瞳孔の中心間のおおよその距離（ミリメートル）。 |

#### 例

```ts
world.events.addListener(world.events.globalId, 'facecontroller.interpupillarydistance', (e) => {
    console.log(e)
})
```

### lefteyebrowlowered {#lefteyebrowlowered}

このイベントは、トラッキングされた顔の各瞳孔の中心間の距離がミリメートル単位で最初に検出されたときに、Face Effectsによって発行されます。

#### プロパティ

| プロパティ | タイプ | 説明          |
| ----- | --- | ----------- |
| アイドル  | 番号  | 位置する面の数値ID。 |

#### 例

```ts
world.events.addListener(world.events.globalId, 'facecontroller.lefteyebrowlowered', (e) => {
    console.log(e)
})
```

### leftteyebrowraised {#lefteyebrowraised}

このイベントは、トラッキングされた顔の左眉が、顔を発見したときの初期位置から上がったときに、Face Effectsによって発行されます。

#### プロパティ

| プロパティ | タイプ | 説明          |
| ----- | --- | ----------- |
| アイドル  | 番号  | 位置する面の数値ID。 |

#### 例

```ts
world.events.addListener(world.events.globalId, 'facecontroller.lefteyebrowraised', (e) => {
    console.log(e)
})
```

### leftteyeclosed {#lefteyeclosed}

このイベントは、トラッキングされた顔の左目が閉じたときにFace Effectsから発行されます。

#### プロパティ

| プロパティ | タイプ | 説明          |
| ----- | --- | ----------- |
| アイドル  | 番号  | 位置する面の数値ID。 |

#### 例

```ts
world.events.addListener(world.events.globalId, 'facecontroller.lefteyeclosed', (e) => {
    console.log(e)
})
```

### lefteyeopened {#lefteyeopened}

このイベントは、トラッキングされた顔の左目が開いたときにFace Effectsが発する。

#### プロパティ

| プロパティ | タイプ | 説明          |
| ----- | --- | ----------- |
| アイドル  | 番号  | 位置する面の数値ID。 |

#### 例

```ts
world.events.addListener(world.events.globalId, 'facecontroller.lefteyeopened', (e) => {
    console.log(e)
})
```

### lefteyewinked {#lefteyewinked}

このイベントは、トラッキングされた顔の左目が750ミリ秒以内に閉じたり開いたりする一方で、右目は開いたままである場合に、Face Effectsによって発せられる。

#### プロパティ

| プロパティ | タイプ | 説明          |
| ----- | --- | ----------- |
| アイドル  | 番号  | 位置する面の数値ID。 |

#### 例

```ts
world.events.addListener(world.events.globalId, 'facecontroller.lefteyewinked', (e) => {
    console.log(e)
})
```

### mouthclosed {#mouthclosed}

このイベントは、トラッキングされた顔の口が閉じたときにFace Effectsから発行されます。

#### プロパティ

| プロパティ | タイプ | 説明          |
| ----- | --- | ----------- |
| アイドル  | 番号  | 位置する面の数値ID。 |

#### 例

```ts
world.events.addListener(world.events.globalId, 'facecontroller.mouthclosed', (e) => {
    console.log(e)
})
```

### mouthopened {#mouthopened}

このイベントは、トラッキングされた顔の口が開いたときにFace Effectsが発する。

#### プロパティ

| プロパティ | タイプ | 説明          |
| ----- | --- | ----------- |
| アイドル  | 番号  | 位置する面の数値ID。 |

#### 例

```ts
world.events.addListener(world.events.globalId, 'facecontroller.mouthopened', (e) => {
    console.log(e)
})
```

### righteyebrowlowered {#righteyebrowlowered}

このイベントは、トラッキングされた顔の右眉が、顔を発見したときの初期位置まで下がったときに、Face Effectsによって発行される。

#### プロパティ

| プロパティ | タイプ | 説明          |
| ----- | --- | ----------- |
| アイドル  | 番号  | 位置する面の数値ID。 |

#### 例

```ts
world.events.addListener(world.events.globalId, 'facecontroller.righteyebrowlowered', (e) => {
    console.log(e)
})
```

### righteyebrowraised {#righteyebrowraised}

このイベントは、トラッキングされた顔の右眉が、顔を発見したときの初期位置から上がったときに、Face Effectsによって発行される。

#### プロパティ

| プロパティ | タイプ | 説明          |
| ----- | --- | ----------- |
| アイドル  | 番号  | 位置する面の数値ID。 |

#### 例

```ts
world.events.addListener(world.events.globalId, 'facecontroller.righteyebrowraised', (e) => {
    console.log(e)
})
```

### righteyeclosed {#righteyeclosed}

このイベントは、トラッキングされた顔の右目が閉じたときにFace Effectsが発する。

#### プロパティ

| プロパティ | タイプ | 説明          |
| ----- | --- | ----------- |
| アイドル  | 番号  | 位置する面の数値ID。 |

#### 例

```ts
world.events.addListener(world.events.globalId, 'facecontroller.righteyeclosed', (e) => {
    console.log(e)
})
```

### righteyeopened {#righteyeopened}

このイベントは、トラッキングされた顔の右目が開いたときにFace Effectsが発する。

#### プロパティ

| プロパティ | タイプ | 説明          |
| ----- | --- | ----------- |
| アイドル  | 番号  | 位置する面の数値ID。 |

#### 例

```ts
world.events.addListener(world.events.globalId, 'facecontroller.righteyeopened', (e) => {
    console.log(e)
})
```

### righteyewinked {#righteyewinked}

このイベントは、トラッキングされた顔の右目が750ms以内に閉じたり開いたりする一方で、左目は開いたままである場合に、Face Effectsによって発せられる。

#### プロパティ

| プロパティ | タイプ | 説明          |
| ----- | --- | ----------- |
| アイドル  | 番号  | 位置する面の数値ID。 |

#### 例

```ts
world.events.addListener(world.events.globalId, 'facecontroller.righteyewinked', (e) => {
    console.log(e)
})
```

### earpointfound {#earpointfound}

このイベントはイヤーポイントが見つかるとFace Effectsから発行されます。

#### プロパティ

| プロパティ | タイプ | 説明                                                       |
| ----- | --- | -------------------------------------------------------- |
| アイドル  | 番号  | 位置する面の数値ID                                               |
| ポイント  | 文字列 | イヤーポイント名。 以下のいずれか：左葉`、`左管`、`左ヘリックス`、`右葉`、`右管`、`右ヘリックス\`。 |

#### 例

```ts
world.events.addListener(world.events.globalId, 'facecontroller.earpointfound', (e) => {
    console.log(e)
})
```

### earpointlost {#earpointlost}

このイベントは、イヤーポイントが失われたときにFace Effectsが発する。

#### プロパティ

| プロパティ | タイプ | 説明                                                       |
| ----- | --- | -------------------------------------------------------- |
| アイドル  | 番号  | 位置する面の数値ID                                               |
| ポイント  | 文字列 | イヤーポイント名。 以下のいずれか：左葉`、`左管`、`左ヘリックス`、`右葉`、`右管`、`右ヘリックス\`。 |

#### 例

```ts
world.events.addListener(world.events.globalId, 'facecontroller.earpointlost', (e) => {
    console.log(e)
})
```
