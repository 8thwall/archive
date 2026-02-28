---
id: general
---

# 一般イベント

## イベント

### アクティブ・スペース・チェンジ

ワールドがSpaceをロードしたときに発せられる（Spaceがロードされることを約束するものではない）。

#### プロパティ

いない。

#### 例

```ts
world.events.addListener(world.events.globalId, ecs.events.ACTIVE_SPACE_CHANGE, () => {
    console.log('アクティブスペース変更');
})；
```

### location_spawned

マップ上にVPSロケーションがスポーンしたときに発せられる。

#### プロパティ

| プロパティ   | タイプ   | 説明                       |
| ------- | ----- | ------------------------ |
| アイドル    | ストリング | 場所の一意識別子                 |
| イメージURL | ストリング | ロケ地イメージ                  |
| タイトル    | ストリング | 場所のタイトル                  |
| ラット     | 番号    | 場所の緯度                    |
| lng     | 番号    | 場所の経度                    |
| マップポイント | イード   | コンテンツの親となるマップポイントエンティティ。 |

#### 例（グローバル）

```ts
world.events.addListener(world.events.globalId, ecs.events.LOCATION_SPAWNED, ({data}) => {
    console.log(data)
})
```

#### 例（事業体別）

```ts
world.events.addListener(mapEid, ecs.events.LOCATION_SPAWNED, ({data}) => {
    console.log(data)
})
```

### リアリティレディ

このイベントは8th Wall Webが初期化された時に発行される。

#### プロパティ

いない。

#### 例

```ts
world.events.addListener(world.events.globalId, 'realityready', () => {
    console.log('realityready');
})；
```
