---
id: face
sidebar_position: 2
---

# フェイス・イベント

## イベント

### フェイスファウンド

このイベントは、Face Effectsが最初に顔を見つけたときに発行される。

#### プロパティ一覧

| Property         | Type                   | 商品説明                                                                                                                                                                    |
| ---------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id               | `Number`                                                                | 位置する面の数値ID                                                                                                                                                              |
| transform        | [`TransformObject`](#TransformObject)                              | 位置する顔のトランスフォーム情報。                                                                                                                                                       |
| vertices         | `[{x, y, z}]` | transformに対する相対的な顔の位置。                                                                                                                                                  |
| normals          | `[{x, y, z}]` | transformに対する相対的な頂点の法線方向。                                                                                                                                               |
| attachmentPoints | `{ name, position: {x,y,z} }`                                             | 使用可能なアタッチメントポイントの一覧は[`XR8.FaceController.AttachmentPoints`](https://www.8thwall.com/docs/api/facecontroller/attachmentpoints/)を参照してください。 position\`はトランスフォームからの相対位置である。 |
| uvsInCameraFrame | [{u, v}]\`    | 返された頂点に対応するカメラフレーム内のuv位置のリスト。                                                                                                                                           |

##### TransformObject {#TransformObject}
| Property     | Type                           | 商品説明                         |
| ------------ | ------------------------------ | ---------------------------- |
| position     | `{x, y, z}`                    | 配置された顔の3次元位置。                |
| rotation     | `{w, x, y, z}`. | 配置された顔の3dローカル方向。             |
| scale        | `Number`                             | この顔に付けられたオブジェクトに適用されるスケール係数。 |
| scaledWidth  | `Number`                             | シーンにスケールを掛けたときの頭のおおよその幅です。   |
| scaledHeight | `Number`                             | シーンにスケールを掛けたときの頭のおおよその高さ。    |
| scaledDepth  | `Number`                             | シーンにスケールを掛けたときの頭のおおよその奥行き。   |

#### 例

```ts
world.events.addListener(world.events.globalId, 'facecontroller.facefound', (e) => {
    console.log(e)
})
```

### フェイスローディング

このイベントは、追加の顔ARリソースのロードが開始されたときにFace Effectsによって発行されます。

#### プロパティ一覧

| Property           | Type                                                              | 商品説明                                                                |
| ------------------ | ----------------------------------------------------------------- | ------------------------------------------------------------------- |
| maxDetections      | 番号                                                                | 同時に処理できる顔の最大数です。                                                    |
| pointsPerDetection | 番号                                                                | 1つの顔に対して抽出される頂点の数。                                                  |
| indices            | `[{a, b, c}]` | configure の meshGeometry で指定したように、要求されたメッシュの三角形を形成する頂点配列へのインデックスです。 |
| uvs                | `[{u, v}]`    | 返される頂点に対応するテクスチャマップへのuv位置。                                          |

#### 例

```ts
world.events.addListener(world.events.globalId, 'facecontroller.faceloading', (e) => {
    console.log(e)
})
```

### ファセロスト

このイベントは、顔が追跡されなくなったときにFace Effectsから発行される。

#### プロパティ一覧

| Property | Type | 商品説明           |
| -------- | ---- | -------------- |
| id       | `Number`   | 追跡が終了した顔の数値ID。 |

#### 例

```ts
world.events.addListener(world.events.globalId, 'facecontroller.facelost', (e) => {
    console.log(e)
})
```

### フェイススキャン

このイベントは、すべての顔ARリソースがロードされ、スキャンが開始されたときにFace Effectsによって発行されます。

#### プロパティ一覧

| Property           | Type                                                              | 商品説明                                                                |
| ------------------ | ----------------------------------------------------------------- | ------------------------------------------------------------------- |
| maxDetections      | 番号                                                                | 同時に処理できる顔の最大数です。                                                    |
| pointsPerDetection | 番号                                                                | 1つの顔に対して抽出される頂点の数。                                                  |
| indices            | `[{a, b, c}]` | configure の meshGeometry で指定したように、要求されたメッシュの三角形を形成する頂点配列へのインデックスです。 |
| uvs                | `[{u, v}]`    | 返される頂点に対応するテクスチャマップへのuv位置。                                          |

#### 例

```ts
world.events.addListener(world.events.globalId, 'facecontroller.facescanning', (e) => {
    console.log(e)
})
```

### フェイスアップ

このイベントは、Face Effectsによって、その後顔が見つかったときに発行される。

#### プロパティ一覧

| Property         | Type                                                              | 商品説明                                                                                                                                                                    |
| ---------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id               | 番号                                                                | 位置する面の数値ID                                                                                                                                                              |
| transform        | [`TransformObject`](#TransformObject)                              | 位置する顔のトランスフォーム情報。                                                                                                                                                       |
| vertices         | `[{x, y, z}]` | transformに対する相対的な顔の位置。                                                                                                                                                  |
| normals          | `[{x, y, z}]` | transformに対する相対的な頂点の法線方向。                                                                                                                                               |
| attachmentPoints | `{ name, position: {x,y,z} }`                                             | 使用可能なアタッチメントポイントの一覧は[`XR8.FaceController.AttachmentPoints`](https://www.8thwall.com/docs/api/facecontroller/attachmentpoints/)を参照してください。 position\`はトランスフォームからの相対位置である。 |
| uvsInCameraFrame | [{u, v}]\`    | 返された頂点に対応するカメラフレーム内のuv位置のリスト。                                                                                                                                           |

#### 例

```ts
world.events.addListener(world.events.globalId, 'facecontroller.faceupdated', (e) => {
    console.log(e)
})
```

### 瞬き

このイベントは、トラッキングされた顔の目がまばたきしたときにFace Effectsから発行されます。

#### プロパティ一覧

| Property | Type | 商品説明       |
| -------- | ---- | ---------- |
| id       | 番号   | 位置する面の数値ID |

#### 例

```ts
world.events.addListener(world.events.globalId, 'facecontroller.blinked', (e) => {
    console.log(e)
})
```

### 瞳孔間距離

このイベントは、トラッキングされた顔の各瞳孔の中心間の距離がミリメートル単位で最初に検出されたときに、Face Effectsによって発行されます。

#### プロパティ一覧

| Property               | Type | 商品説明                                         |
| ---------------------- | ---- | -------------------------------------------- |
| id                     | 番号   | 位置する顔の数値ID。                                  |
| interpupillaryDistance | 番号   | 各瞳孔の中心間のおおよその距離。 (ミリメートル) |

#### 例

```ts
world.events.addListener(world.events.globalId, 'facecontroller.interpupillarydistance', (e) => {
    console.log(e)
})
```

### レフトテイブローローワード

このイベントは、トラッキングされた顔の各瞳孔の中心間の距離がミリメートル単位で最初に検出されたときに、Face Effectsによって発行されます。

#### プロパティ一覧

| Property | Type | 商品説明        |
| -------- | ---- | ----------- |
| id       | 番号   | 位置する顔の数値ID。 |

#### 例

```ts
world.events.addListener(world.events.globalId, 'facecontroller.lefteyebrowlowered', (e) => {
    console.log(e)
})
```

### 左眉毛

このイベントは、トラッキングされた顔の左眉が、顔を発見したときの初期位置から上がったときに、Face Effectsによって発行されます。

#### プロパティ一覧

| Property | Type | 商品説明        |
| -------- | ---- | ----------- |
| id       | 番号   | 位置する顔の数値ID。 |

#### 例

```ts
world.events.addListener(world.events.globalId, 'facecontroller.lefteyebrowraised', (e) => {
    console.log(e)
})
```

### レフティクローズド

このイベントは、トラッキングされた顔の左目が閉じたときにFace Effectsが発する。

#### プロパティ一覧

| Property | Type | 商品説明        |
| -------- | ---- | ----------- |
| id       | 番号   | 位置する顔の数値ID。 |

#### 例

```ts
world.events.addListener(world.events.globalId, 'facecontroller.lefteyeclosed', (e) => {
    console.log(e)
})
```

### レフトアイ・オープン

このイベントは、トラッキングされた顔の左目が開いたときにFace Effectsが発する。

#### プロパティ一覧

| Property | Type | 商品説明        |
| -------- | ---- | ----------- |
| id       | 番号   | 位置する顔の数値ID。 |

#### 例

```ts
world.events.addListener(world.events.globalId, 'facecontroller.lefteyeopened', (e) => {
    console.log(e)
})
```

### レフティウィンク

このイベントは、トラッキングされた顔の左目が750ミリ秒以内に閉じたり開いたりする一方で、右目は開いたままである場合に、Face Effectsによって発せられる。

#### プロパティ一覧

| Property | Type | 商品説明        |
| -------- | ---- | ----------- |
| id       | 番号   | 位置する顔の数値ID。 |

#### 例

```ts
world.events.addListener(world.events.globalId, 'facecontroller.lefteyewinked', (e) => {
    console.log(e)
})
```

### 口閉じ

このイベントは、トラッキングされた顔の口が閉じたときにFace Effectsから発行されます。

#### プロパティ一覧

| Property | Type | 商品説明        |
| -------- | ---- | ----------- |
| id       | 番号   | 位置する顔の数値ID。 |

#### 例

```ts
world.events.addListener(world.events.globalId, 'facecontroller.mouthclosed', (e) => {
    console.log(e)
})
```

### 口を開けた

このイベントは、トラッキングされた顔の口が開いたときにFace Effectsが発する。

#### プロパティ一覧

| Property | Type | 商品説明        |
| -------- | ---- | ----------- |
| id       | 番号   | 位置する顔の数値ID。 |

#### 例

```ts
world.events.addListener(world.events.globalId, 'facecontroller.mouthopened', (e) => {
    console.log(e)
})
```

### 右手

このイベントは、トラッキングされた顔の右眉が、顔を発見したときの初期位置まで下がったときに、Face Effectsによって発行される。

#### プロパティ一覧

| Property | Type | 商品説明        |
| -------- | ---- | ----------- |
| id       | 番号   | 位置する顔の数値ID。 |

#### 例

```ts
world.events.addListener(world.events.globalId, 'facecontroller.righteyebrowlowered', (e) => {
    console.log(e)
})
```

### 右眉毛

このイベントは、トラッキングされた顔の右眉が、顔を発見したときの初期位置から上がったときに、Face Effectsによって発行される。

#### プロパティ一覧

| Property | Type | 商品説明        |
| -------- | ---- | ----------- |
| id       | 番号   | 位置する顔の数値ID。 |

#### 例

```ts
world.events.addListener(world.events.globalId, 'facecontroller.righteyebrowraised', (e) => {
    console.log(e)
})
```

### 右側通行

このイベントは、トラッキングされた顔の右目が閉じたときにFace Effectsが発する。

#### プロパティ一覧

| Property | Type | 商品説明        |
| -------- | ---- | ----------- |
| id       | 番号   | 位置する顔の数値ID。 |

#### 例

```ts
world.events.addListener(world.events.globalId, 'facecontroller.righteyeclosed', (e) => {
    console.log(e)
})
```

### 右肩上がり

このイベントは、トラッキングされた顔の右目が開いたときにFace Effectsが発する。

#### プロパティ一覧

| Property | Type | 商品説明        |
| -------- | ---- | ----------- |
| id       | 番号   | 位置する顔の数値ID。 |

#### 例

```ts
world.events.addListener(world.events.globalId, 'facecontroller.righteyeopened', (e) => {
    console.log(e)
})
```

### 右往左往

このイベントは、トラッキングされた顔の右目が750ms以内に閉じたり開いたりする一方で、左目は開いたままである場合に、Face Effectsによって発せられる。

#### プロパティ一覧

| Property | Type | 商品説明        |
| -------- | ---- | ----------- |
| id       | 番号   | 位置する顔の数値ID。 |

#### 例

```ts
world.events.addListener(world.events.globalId, 'facecontroller.righteyewinked', (e) => {
    console.log(e)
})
```

### イヤポイントファウンド

このイベントはイヤーポイントが見つかるとFace Effectsから発行されます。

#### プロパティ一覧

| Property | Type   | 商品説明                                                     |
| -------- | ------ | -------------------------------------------------------- |
| id       | 番号     | 位置する面の数値ID                                               |
| point    | String | イヤーポイント名。 以下のいずれか: 左葉`、`左管`、`左ヘリックス`、`右葉`、`右管`、`右ヘリックス\`。 |

#### 例

```ts
world.events.addListener(world.events.globalId, 'facecontroller.earpointfound', (e) => {
    console.log(e)
})
```

### イヤポイントロスト

このイベントは、イヤーポイントが失われたときにFace Effectsが発する。

#### プロパティ一覧

| Property | Type   | 商品説明                                                     |
| -------- | ------ | -------------------------------------------------------- |
| id       | 番号     | 位置する面の数値ID                                               |
| point    | String | イヤーポイント名。 以下のいずれか: 左葉`、`左管`、`左ヘリックス`、`右葉`、`右管`、`右ヘリックス\`。 |

#### 例

```ts
world.events.addListener(world.events.globalId, 'facecontroller.earpointfound', (e) => {
    console.log(e)
})
```
