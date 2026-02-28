---
id: vps
sidebar_position: 3
---

# VPSイベント

## タイプ {#types}

### LocationObject {#LocationObject}

| プロパティ   | タイプ | 説明                            |
| ------- | --- | ----------------------------- |
| アイドル    | 文字列 | セッション内で安定している、このプロジェクトロケ地のID。 |
| 名称      | 文字列 | プロジェクト・ロケーション名                |
| イメージURL | 文字列 | このプロジェクトの場所の代表的な画像のURL。       |
| タイトル    | 文字列 | プロジェクト・ロケーションのタイトル            |
| ラット     | 番号  | このプロジェクトの場所の緯度                |
| lng     | 番号  | このプロジェクトの場所の経度。               |

### PositionAttributeObject {#PositionAttributeObject}

| プロパティ   | タイプ                                    | 説明             |
| ------- | -------------------------------------- | -------------- |
| 名称      | 文字列                                    | オブジェクト名        |
| 配列      | Float32Array()\\`。 | 生のメッシュ形状データ。   |
| アイテムサイズ | 整数                                     | オブジェクト内のアイテムの数 |

### ColorAttributeObject {#ColorAttributeObject}

| プロパティ   | タイプ                                    | 説明             |
| ------- | -------------------------------------- | -------------- |
| 名称      | 文字列                                    | オブジェクト名        |
| 配列      | Float32Array()\\`。 | 生のメッシュ形状データ。   |
| アイテムサイズ | 整数                                     | オブジェクト内のアイテムの数 |

### GeometryObject {#GeometryObject}

| プロパティ  | タイプ                                                                                                             | 説明                  |
| ------ | --------------------------------------------------------------------------------------------------------------- | ------------------- |
| インデックス | 文字列                                                                                                             | セッション内で安定したメッシュのID。 |
| 属性     | `[`[`PositionAttributeObject`](#PositionAttributeObject)`,`  [`ColorAttributeObject`](#ColorAttributeObject)`]` | 生のメッシュ形状データ。        |

## イベント

### locationfound {#locationfound}

このイベントは、プロジェクトロケーションが最初に見つかったときに発行されます。

#### プロパティ

| プロパティ   | タイプ            | 説明                         |
| ------- | -------------- | -------------------------- |
| 名称      | 文字列            | プロジェクトの場所名。                |
| 位置      | `{x, y, z}`    | プロジェクト・ロケーションの3Dポジション。     |
| ローテーション | `{w, x, y, z}` | プロジェクト位置の 3 次元ローカル方位（四元数）。 |

#### 例

```ts
world.events.addListener(world.events.globalId, 'reality.locationfound', (e) => {
    console.log(e)
})
```

### locationlost {#locationlost}

このイベントは、プロジェクトの場所が追跡されなくなったときに発行されます。

#### プロパティ

| プロパティ   | タイプ            | 説明                         |
| ------- | -------------- | -------------------------- |
| 名称      | 文字列            | プロジェクトの場所名。                |
| 位置      | `{x, y, z}`    | プロジェクト・ロケーションの3Dポジション。     |
| ローテーション | `{w, x, y, z}` | プロジェクト位置の 3 次元ローカル方位（四元数）。 |

#### 例

```ts
world.events.addListener(world.events.globalId, 'reality.locationlost', (e) => {
    console.log(e)
})
```

### locationscanning {#locationscanning}

このイベントは、すべてのプロジェクトロケーションがスキャンのためにロードされたときに発行されます。

#### プロパティ

| プロパティ | タイプ                                       | 説明               |
| ----- | ----------------------------------------- | ---------------- |
| 場所    | `[`[`LocationObject`](#LocationObject)`]` | 位置情報を含むオブジェクトの配列 |

#### 例

```ts
world.events.addListener(world.events.globalId, 'reality.locationcanning', (e) => {
    console.log(e)
})
```

### meshfound {#meshfound}

このイベントは、開始後または `recenter()` の後にメッシュが最初に見つかったときに発行されます。

#### プロパティ

| プロパティ   | タイプ                                   | 説明                                      |
| ------- | ------------------------------------- | --------------------------------------- |
| アイドル    | 文字列                                   | セッション内で安定したメッシュのID。                     |
| 位置      | {x, y, z}\\`                         | プロジェクト・ロケーションの3Dポジション。                  |
| ローテーション | w, x, y, z}\\`.      | プロジェクト位置の 3 次元ローカル方位（四元数）。              |
| ジオメトリー  | [GeometryObject\\`](#GeometryObject) | 生のメッシュ形状データを含むオブジェクト。 属性には位置と色の属性が含まれる。 |

#### 例

```ts
world.events.addListener(world.events.globalId, 'reality.meshfound', (e) => {
    console.log(e)
})
```

### meshlost {#meshlost}

このイベントは `recenter()` が呼ばれたときに発生する。

#### プロパティ

| プロパティ | タイプ | 説明                  |
| ----- | --- | ------------------- |
| アイドル  | 文字列 | セッション内で安定したメッシュのID。 |

#### 例

```ts
world.events.addListener(world.events.globalId, 'reality.meshlost', (e) => {
    console.log(e)
})
```
