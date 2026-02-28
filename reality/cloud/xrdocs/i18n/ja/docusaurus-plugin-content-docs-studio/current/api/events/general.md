---
id: general
sidebar_position: 3
---

# 一般イベント

## イベント

### GLTF_ANIMATION_FINISHED（グルトフ・アニメーション・フィニッシュド

アニメーションクリップのすべてのループが終了したときに発行される。

#### プロパティ一覧

| Property | Type  | 商品説明       |
| -------- | ----- | ---------- |
| name     | ストリング | アニメーションの名前 |

#### 例（グローバル）

```ts
world.events.addListener(world.events.globalId, ecs.events.GLTF_ANIMATION_FINISHED, (properties) => {
    console.log(properties.name);
})；
```

#### 例（事業体別）

```ts
world.events.addListener(component.eid, ecs.events.GLTF_ANIMATION_FINISHED, (properties) => {
    console.log(properties.name);
})；
```

### gltf_animation_loop

アニメーションクリップの1つのループが終了したときに発せられる。

#### プロパティ一覧

| Property | Type  | 商品説明       |
| -------- | ----- | ---------- |
| name     | ストリング | アニメーションの名前 |

#### 例（グローバル）

```ts
world.events.addListener(world.events.globalId, ecs.events.GLTF_ANIMATION_LOOP, (properties) => {
    console.log(properties.name);
})；
```

#### 例（事業体別）

```ts
world.events.addListener(component.eid, ecs.events.GLTF_ANIMATION_LOOP, (properties) => {
    console.log(properties.name);
})；
```

### gltf_model_loaded

モデルがロードされたときに発行される

#### プロパティ一覧

| Property | Type  | 商品説明   |
| -------- | ----- | ------ |
| name     | ストリング | モデルの名前 |

#### 例（グローバル）

```ts
world.events.addListener(world.events.globalId, ecs.events.GLTF_MODEL_LOADED, (properties) => {
    console.log(properties.name);
})；
```

#### 例（事業体別）

```ts
world.events.addListener(component.eid, ecs.events.GLTF_MODEL_LOADED, (properties) => {
    console.log(properties.name);
})；
```

### splat_model_loaded

スプラットがロードされたときに発せられる

#### プロパティ一覧

| Property | Type     | 商品説明     |
| -------- | -------- | -------- |
| model    | スプラットモデル | スプラットモデル |

#### 例（グローバル）

```ts
world.events.addListener(world.events.globalId, ecs.events.SPLAT_MODEL_LOADED, (model: SplatModel) => {
    console.log(model);
})；
```

#### 例（事業体別）

```ts
world.events.addListener(component.eid, ecs.events.GLTF_MODEL_LOADED, (model: SplatModel) => {
    console.log(model);
})；
```

### オーディオ・キャン・プレイ・スルー

エンティティがAudioを再生する能力を持つときに発せられる。

#### プロパティ一覧

None

#### 例

```ts
world.events.addListener(component.eid, ecs.events.AUDIO_CAN_PLAY_THROUGH, () => {
    console.log(`${component.eid} can now play audio.`);
})；
```

### AUDIO_END

エンティティのオーディオ再生が終了したときに発せられる。

#### プロパティ一覧

None

#### 例

```ts
world.events.addListener(component.eid, ecs.events.AUDIO_END, () => {
    console.log(`${component.eid} オーディオ再生終了.`);
})；
```
