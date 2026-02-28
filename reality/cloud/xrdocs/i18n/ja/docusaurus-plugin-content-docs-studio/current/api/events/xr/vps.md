---
id: vps
sidebar_position: 1
---

# VPSイベント

## イベント

### ロケーションファウンド

このイベントは、プロジェクトロケーションが最初に見つかったときに発行されます。

#### プロパティ一覧

| Property | Type                           | 商品説明                       |
| -------- | ------------------------------ | -------------------------- |
| name     | String                         | プロジェクトの場所名。                |
| position | {x, y, z}\`                    | プロジェクト・ロケーションの3Dポジション。     |
| rotation | w, x, y, z}\`. | プロジェクト位置の 3 次元ローカル方位（四元数）。 |

#### 例

```ts
world.events.addListener(world.events.globalId, 'reality.locationfound', (e) => {
    console.log(e)
})
```

### ロケーションロスト

このイベントは、プロジェクトの場所が追跡されなくなったときに発行されます。

#### プロパティ一覧

| Property | Type                           | 商品説明                       |
| -------- | ------------------------------ | -------------------------- |
| name     | String                         | プロジェクトの場所名。                |
| position | {x, y, z}\`                    | プロジェクト・ロケーションの3Dポジション。     |
| rotation | w, x, y, z}\`. | プロジェクト位置の 3 次元ローカル方位（四元数）。 |

#### 例

```ts
world.events.addListener(world.events.globalId, 'reality.locationlost', (e) => {
    console.log(e)
})
```

### ロケーションスキャン

このイベントは、すべてのプロジェクトロケーションがスキャンのためにロードされたときに発行されます。

#### プロパティ一覧

| Property | Type                                                                                                                                | 商品説明             |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| 場所       | [ロケーションオブジェクト]\`](#LocationObject) | 位置情報を含むオブジェクトの配列 |

##### LocationObject {#LocationObject}

LocationObject\`は以下のプロパティを持つオブジェクトである:

| Property | Type   | 商品説明                          |
| -------- | ------ | ----------------------------- |
| id       | String | セッション内で安定している、このプロジェクトロケ地のID。 |
| name     | String | プロジェクト・ロケーション名                |
| imageUrl | String | このプロジェクトの場所の代表画像のURL。         |
| title    | String | プロジェクト・ロケーションのタイトル            |
| lat      | 番号     | このプロジェクトの場所の緯度                |
| lng      | 番号     | このプロジェクトの場所の経度。               |

#### 例

```ts
world.events.addListener(world.events.globalId, 'reality.locationcanning', (e) => {
    console.log(e)
})
```

### メッシュファウンド

このイベントは、開始後または `recenter()` の後にメッシュが最初に見つかったときに発行されます。

#### プロパティ一覧

| Property | Type                           | 商品説明                                           |
| -------- | ------------------------------ | ---------------------------------------------- |
| id       | String                         | セッション内で安定している、このメッシュのIDです。                     |
| position | {x, y, z}\`                    | プロジェクト・ロケーションの3Dポジション。                         |
| rotation | w, x, y, z}\`. | プロジェクト位置の 3 次元ローカル方位（四元数）。                     |
| geometry | GeometryObject\`               | 生メッシュのジオメトリデータを含むオブジェクトです。 属性には、位置と色の属性が含まれます。 |

##### ジオメトリオブジェクト {#GeometryObject}

| Property   | Type                                                                       | 商品説明                       |
| ---------- | -------------------------------------------------------------------------- | -------------------------- |
| index      | String                                                                     | セッション内で安定している、このメッシュのIDです。 |
| attributes | PositionAttributeObject、ColorAttributeObject]\`。 | 生のメッシュジオメトリデータです。          |

##### PositionAttributeObject {#PositionAttributeObject}

| Property | Type                                 | 商品説明              |
| -------- | ------------------------------------ | ----------------- |
| name     | String                               | オブジェクト名           |
| 配列       | Float32Array()\`。 | 生のメッシュジオメトリデータです。 |
| アイテムサイズ  | 整数                                   | オブジェクト内のアイテムの数    |

##### ColorAttributeObject {#ColorAttributeObject}

| Property | Type                                 | 商品説明              |
| -------- | ------------------------------------ | ----------------- |
| name     | String                               | オブジェクト名           |
| 配列       | Float32Array()\`。 | 生のメッシュジオメトリデータです。 |
| アイテムサイズ  | 整数                                   | オブジェクト内のアイテムの数    |

#### 例

```ts
world.events.addListener(world.events.globalId, 'reality.meshfound', (e) => {
    console.log(e)
})
```

### メシュロスト

このイベントは `recenter()` が呼ばれたときに発生する。

#### プロパティ一覧

| Property | Type   | 商品説明                       |
| -------- | ------ | -------------------------- |
| id       | String | セッション内で安定している、このメッシュのIDです。 |

#### 例

```ts
world.events.addListener(world.events.globalId, 'reality.meshlost', (e) => {
    console.log(e)
})
```
