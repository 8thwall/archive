---
id: media-recorder
---

# メディアレコーダーイベント

## 説明

このMedia Recorderを使用すると、実行時にStudioプロジェクトのスクリーンショットやビデオをキャプチャして録画できます。

## イベント

### 録画のSCREENSHOT_READY

スクリーンショットの準備ができたときに発生します。

#### プロパティ

| プロパティ | タイプ | 概要                        |
| ----- | --- | ------------------------- |
| ブロブ   | ブロブ | スクリーンショットの JPEG イメージ Blob |

#### 例

```
world.events.addListener(world.events.globalId, ecs.events.RECORDER_SCREENSHOT_READY, (e) => {
    const blob = e.data;
    console.log('Screenshot blob:', blob);
});
```

### 録画の開始

録画を開始したときに発生します。

#### プロパティ

いない。

#### 例

```
world.events.addListener(world.events.globalId, ecs.events.RECORDER_VIDEO_STARTED, () => {
    console.log('Recording started');
});
```

### 録画を停止します。

録画が停止したときに発生します。

#### プロパティ一覧

いない。

#### 例

```
world.events.addListener(world.events.globalId, ecs.events.RECORDER_VIDEO_STOPPED, () => {
    console.log('stopped');
});
```

### 録画中のビデオエラー

エラーがあるときに発生します。

#### プロパティ

| プロパティ | タイプ   | 説明          |
| ----- | ----- | ----------- |
| メッセージ | ストリング | エラーメッセージ    |
| 名称    | ストリング | エラー名        |
| スタック  | ストリング | エラースタックトレース |

#### 例

```
world.events.addListener(world.events.globalId, ecs.events.RECORDER_VIDEO_ERROR, (error) => {
    console.error('Recorder error:', error.message);
});
```

### 録画の準備ができています

録画が完了し、ビデオが準備ができたときに発生します。

#### プロパティ

| プロパティ     | タイプ | 説明           |
| --------- | --- | ------------ |
| videoBlob | ブロブ | 記録されたビデオブロック |

#### 例

```
world.events.addListener(world.events.globalId, ecs.events.RECORDER_VIDEO_READY, ({ videoBlob }) => {
    console.log('Video ready:', videoBlob);
});
```

### 録画の準備ができています

プレビュー可能でありながら共有が最適化されていないときに発生します。ビデオの準備ができています (Android/デスクトップのみ)。

#### プロパティ

| プロパティ     | タイプ | 説明           |
| --------- | --- | ------------ |
| videoBlob | ブロブ | プレビュービデオブロック |

#### 例

```
world.events.addListener(world.events.globalId, ecs.events.RECORDER_PREVIEW_READY, ({ videoBlob }) => {
    console.log('Preview ready:', videoBlob);
});
```

### 最後の処理を記録します。

メディアレコーダーが最終的なエクスポートを進めているときに発生します(Android/デスクトップのみ)。

#### プロパティ一覧

| プロパティ | タイプ | 説明           |
| ----- | --- | ------------ |
| 進行状況  | 番号  | 完了の進行状況（0～1） |

#### 例

```
world.events.addListener(world.events.globalId, ecs.events.RECORDER_FINALIZE_PROGRESS, ({ progress }) => {
    console.log(`Finalizing progress: ${progress * 100}%`);
});
```

### レコード処理フレーム

#### プロパティ

| プロパティ   | タイプ       | 商品説明                                 |
| ------- | --------- | ------------------------------------ |
| フレーム    | ImageData | 処理されたビデオフレーム                         |
| タイムスタンプ | 番号        | フレームのタイムスタンプ (ms) |

#### 例

```
world.events.addListener(world.events.globalId, ecs.events.RECORDER_PROCESS_FRAME, ({ frame, timestamp }) => {
    console.log(`Processed frame at ${timestamp}ms`, frame);
});
```
