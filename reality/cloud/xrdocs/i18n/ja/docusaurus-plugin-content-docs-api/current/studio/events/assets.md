---
id: assets
---

# 資産イベント

## 3Dモデル

### gltf_model_loaded

モデルがロードされたときに発行される

#### プロパティ

| プロパティ | タイプ   | 説明     |
| ----- | ----- | ------ |
| 名称    | ストリング | モデルの名前 |

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

### GLTF_ANIMATION_FINISHED（グルトフ・アニメーション・フィニッシュド

アニメーションクリップのすべてのループが終了したときに発行される。

#### プロパティ

| プロパティ | タイプ   | 説明         |
| ----- | ----- | ---------- |
| 名称    | ストリング | アニメーションの名前 |

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

#### プロパティ

| プロパティ | タイプ   | 説明         |
| ----- | ----- | ---------- |
| 名称    | ストリング | アニメーションの名前 |

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

## ガウス・スプラット

### splat_model_loaded

スプラットがロードされたときに発せられる

#### プロパティ

| プロパティ | タイプ      | 説明       |
| ----- | -------- | -------- |
| モデル   | スプラットモデル | スプラットモデル |

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

## オーディオ

### オーディオ・キャン・プレイ・スルー

エンティティがAudioを再生する能力を持つときに発せられる。

#### プロパティ

なし

#### 例

```ts
world.events.addListener(component.eid, ecs.events.AUDIO_CAN_PLAY_THROUGH, () => {
    console.log(`${component.eid} can now play audio.`);
})；
```

### AUDIO_END

エンティティのオーディオ再生が終了したときに発せられる。

#### プロパティ

なし

#### 例

```ts
world.events.addListener(component.eid, ecs.events.AUDIO_END, (e) => {
    console.log(`${e.target} オーディオの再生を終了しました。`);
})；
```

## ビデオ

### ビデオ・キャン・プレイ・スルー

エンティティがビデオを再生する能力を持つときに発せられる。

#### プロパティ

なし

#### 例

```ts
world.events.addListener(component.eid, ecs.events.VIDEO_CAN_PLAY_THROUGH, (e) => {
    console.log(`${e.target} ready to play video.`);
})；
```

### ビデオ終了

エンティティでビデオの再生が終了したときに発行される。

#### プロパティ

なし

#### 例

```ts
world.events.addListener(component.eid, ecs.events.VIDEO_END, (e) => {
    console.log(`${e.target} 動画の再生を終了しました。`);
})；
```
