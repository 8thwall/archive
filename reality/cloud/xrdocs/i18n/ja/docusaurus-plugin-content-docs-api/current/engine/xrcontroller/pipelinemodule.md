---
sidebar_label: pipelineModule()
---

# XR8.XrController.pipelineModule()

XR8.XrController.pipelineModule()\\`。

## 説明 {#description}

カメラパイプラインモジュールを作成し、インストールすると、カメラの起動時、カメラプロセッシングイベント、その他の状態変化に関するコールバックを受け取ります。 これらはカメラの位置を計算するために使用される。 これはカメラの位置を計算するために使用されます。

## パラメータ（全てオプション） {#parameters-all-optional}

なし

## 戻り値 {#returns}

戻り値は、[`onUpdate`](/legacy/api/camerapipelinemodule/onupdate) で利用可能なオブジェクトである：

`processCpuResult.reality: { rotation, position, intrinsics, trackingStatus, trackingReason, worldPoints, realityTexture, lighting }`.

| プロパティ       | タイプ                                                                                                          | 概要                                                                                                                                         |
| ----------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| ローテーション     | w, x, y, z}\\`.                                                                             | シーン内のカメラの向き（クォータニオン）。                                                                                                                      |
| 位置          | {x, y, z}\\`                                                                                                | シーン内のカメラの位置。                                                                                                                               |
| intrinsics  | 数字                                                                                                           | レンダリングされたカメラフィードと同じ視野をシーンカメラに与える、16次元の列長4x4の投影行列。                                                                                          |
| トラッキングステータス | 文字列                                                                                                          | LIMITED'`または`NORMAL'\\`のいずれか。                                                                                                             |
| トラッキング理由    | 文字列                                                                                                          | UNSPECIFIED'`または`INITIALIZING'\\`のいずれか。                                                                                                   |
| ワールドポイント    | id、confidence、position: {x, y, z}}]`[{id、confidence、position: }]`。 | シーン内の場所で検出されたワールドの検出座標の配列です。 シーン内の位置で検出されたワールド内の点の配列。 XrController`がワールドポイントを返すように設定されていて、`trackingReason != 'INITIALIZING'\\`の場合のみ満たされる。 |
| リアリティ・テクスチャ | [WebGLTexture\\`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture)                            | カメラフィードデータを含むテクスチャ。                                                                                                                        |
| 照明          | {exposure, temperature}\\`                                                                                  | 環境中の照明の露出です。 注：`temperature`はまだ実装されていない。                                                                                                   |

## 派遣イベント {#dispatched-events}

**trackingStatus**：XrController\\`が起動し、トラッキングステータスや理由が変更されたときに発生します。

`reality.trackingstatus : { status, reason }`.

| プロパティ | タイプ | 説明                                     |
| ----- | --- | -------------------------------------- |
| ステータス | 文字列 | LIMITED'`または`NORMAL'\\`のいずれか。         |
| 理由    | 文字列 | INITIALIZING'` または 'UNDEFINED'` のいずれか。 |

**imageloading**：検出画像のロードが開始されたときに発生します。

`imageloading.detail : { imageTargets： {name, type, metadata} }`

| プロパティ | タイプ    | 説明                                        |
| ----- | ------ | ----------------------------------------- |
| 名称    | 文字列    | 画像の名前。                                    |
| タイプ   | String | FLAT'`、'CYLINDRICAL'`、'CONICAL'\\`のいずれか。 |
| メタデータ | オブジェクト | ユーザーのメタデータ。                               |

**imagescanning**：すべての検出画像がロードされ、スキャンが開始されると発生します。

`imagescanning.detail : { imageTargets：{名前、タイプ、メタデータ、ジオメトリ}。}`

| プロパティ  | タイプ    | 説明                                                                                                                                                                                                                       |
| ------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 名称     | 文字列    | 画像の名前。                                                                                                                                                                                                                   |
| タイプ    | 文字列    | FLAT'`、'CYLINDRICAL'`、'CONICAL'\\`のいずれか。                                                                                                                                                                                |
| メタデータ  | オブジェクト | ユーザーのメタデータ。                                                                                                                                                                                                              |
| ジオメトリー | オブジェクト | ジオメトリデータを含むオブジェクトです。 ジオメトリデータを含むオブジェクト。 type=FLAT の場合：{scaledWidth, scaledHeight}`, else if type=CYLINDRICAL or type=CONICAL: `{height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians}\\`. |

type = `FLAT` の場合、ジオメトリ：

| プロパティ    | タイプ | 説明                      |
| -------- | --- | ----------------------- |
| 拡大幅      | 番号  | シーン内の画像の幅（scaleを掛けた場合）。 |
| スケールドハイト | 番号  | Scaleを掛けたときのシーン内の画像の高さ。 |

type= `CYLINDRICAL` または `CONICAL` の場合、ジオメトリ：

| プロパティ     | タイプ | 概要                |
| --------- | --- | ----------------- |
| 高さ        | 番号  | カーブしたターゲットの高さ。    |
| 半径トップ     | 番号  | 上部のカーブしたターゲットの半径。 |
| 底半径       | 番号  | 下部のカーブしたターゲットの半径。 |
| アーク開始ラジアン | 番号  | ラジアン単位の開始角度。      |
| 弧長ラジアン    | 番号  | ラジアン単位の中心角。       |

**imagefound**：画像ターゲットが最初に見つかったときに発生します。

`imagefound.detail : { name、type、position、rotation、scale、scaledWidth、scaledHeight、height、radiusTop、radiusBottom、arcStartRadians、arcLengthRadians }` 。

| プロパティ   | タイプ                              | 概要                                        |
| ------- | -------------------------------- | ----------------------------------------- |
| 名称      | String                           | 画像の名前。                                    |
| タイプ     | 番号                               | FLAT'`、'CYLINDRICAL'`、'CONICAL'\\`のいずれか。 |
| 位置      | {x, y, z}\\`                    | 配置された画像の3次元位置。                            |
| ローテーション | w, x, y, z}\\`. | 配置された画像の3次元の局所的な向き。                       |
| スケール    | 番号                               | この画像に添付されているオブジェクトに適用されるスケールファクター。        |

type = `FLAT` の場合：

| プロパティ    | タイプ | 説明                      |
| -------- | --- | ----------------------- |
| 拡大幅      | 番号  | シーン内の画像の幅（scaleを掛けた場合）。 |
| スケールドハイト | 番号  | Scaleを掛けたときのシーン内の画像の高さ。 |

type= `CYLINDRICAL` または `CONICAL` の場合：

| プロパティ     | タイプ | 説明                |
| --------- | --- | ----------------- |
| 高さ        | 番号  | カーブしたターゲットの高さ。    |
| 半径トップ     | 番号  | 上部のカーブしたターゲットの半径。 |
| 底半径       | 番号  | 下部のカーブしたターゲットの半径。 |
| アーク開始ラジアン | 番号  | ラジアン単位の開始角度。      |
| 弧長ラジアン    | 番号  | ラジアン単位の中心角。       |

**imageupdated**：イメージターゲットの位置、回転、スケールが変更されたときに発生します。

`imageupdated.detail : { name、type、position、rotation、scale、scaledWidth、scaledHeight、height、radiusTop、radiusBottom、arcStartRadians、arcLengthRadians }` 。

| プロパティ   | タイプ                              | 概要                                        |
| ------- | -------------------------------- | ----------------------------------------- |
| 名称      | 文字列                              | 画像の名前。                                    |
| タイプ     | 番号                               | FLAT'`、'CYLINDRICAL'`、'CONICAL'\\`のいずれか。 |
| 位置      | {x, y, z}\\`                    | 配置された画像の3次元位置。                            |
| ローテーション | w, x, y, z}\\`. | 配置された画像の3次元の局所的な向き。                       |
| スケール    | 番号                               | この画像に添付されているオブジェクトに適用されるスケールファクター。        |

type = `FLAT` の場合：

| プロパティ    | タイプ | 説明                      |
| -------- | --- | ----------------------- |
| 拡大幅      | 番号  | シーン内の画像の幅（scaleを掛けた場合）。 |
| スケールドハイト | 番号  | Scaleを掛けたときのシーン内の画像の高さ。 |

type= `CYLINDRICAL` または `CONICAL` の場合：

| プロパティ     | タイプ | 説明                |
| --------- | --- | ----------------- |
| 高さ        | 番号  | カーブしたターゲットの高さ。    |
| 半径トップ     | 番号  | 上部のカーブしたターゲットの半径。 |
| 底半径       | 番号  | 下部のカーブしたターゲットの半径。 |
| アーク開始ラジアン | 番号  | ラジアン単位の開始角度。      |
| 弧長ラジアン    | 番号  | ラジアン単位の中心角。       |

**imagelost**：画像ターゲットが追跡されなくなったときに発生します。

`imagelost.detail : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }`.

| プロパティ   | タイプ                              | 概要                                        |
| ------- | -------------------------------- | ----------------------------------------- |
| 名称      | String                           | 画像の名前。                                    |
| タイプ     | 番号                               | FLAT'`、'CYLINDRICAL'`、'CONICAL'\\`のいずれか。 |
| 位置      | {x, y, z}\\`                    | 配置された画像の3次元位置。                            |
| ローテーション | w, x, y, z}\\`. | 配置された画像の3次元の局所的な向き。                       |
| スケール    | 番号                               | この画像に添付されているオブジェクトに適用されるスケールファクター。        |

type = `FLAT` の場合：

| プロパティ    | タイプ | 説明                      |
| -------- | --- | ----------------------- |
| 拡大幅      | 番号  | シーン内の画像の幅（scaleを掛けた場合）。 |
| スケールドハイト | 番号  | Scaleを掛けたときのシーン内の画像の高さ。 |

type= `CYLINDRICAL` または `CONICAL` の場合：

| プロパティ     | タイプ | 概要                |
| --------- | --- | ----------------- |
| 高さ        | 番号  | カーブしたターゲットの高さ。    |
| 半径トップ     | 番号  | 上部のカーブしたターゲットの半径。 |
| 底半径       | 番号  | 下部のカーブしたターゲットの半径。 |
| アーク開始ラジアン | 番号  | ラジアン単位の開始角度。      |
| 弧長ラジアン    | 番号  | ラジアン単位の中心角。       |

**meshfound**：開始後またはrecenter()後にメッシュが最初に見つかったときに発生します。

`xrmeshfound.detail : { id, position, rotation, geometry }`.

| プロパティ   | タイプ                              | 説明                                             |
| ------- | -------------------------------- | ---------------------------------------------- |
| id      | String                           | セッション内で安定したメッシュのID。                            |
| 位置      | {x, y, z}\\`                    | 配置されたメッシュの3次元位置。                               |
| ローテーション | w, x, y, z}\\`. | 配置されたメッシュの3次元ローカル方向（クォータニオン）。                  |
| ジオメトリー  | {index, attributes}\\`          | 生メッシュのジオメトリデータを含むオブジェクトです。 属性には、位置と色の属性が含まれます。 |

ジオメトリ\\`は以下のプロパティを持つオブジェクトである：

| プロパティ  | タイプ                                                                                                                            | 説明                         |
| ------ | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------- |
| インデックス | Uint32Array\\`                                                                                                                | 連続する3つの頂点が三角形を構成するメッシュの頂点。 |
| 属性     | `[{name: 'position', array：Float32Array(), itemSize: 3}, {name: 'color', array：Float32Array(), itemSize: 3}]`. | 生のメッシュ形状データ。               |

**meshupdated**：最初に見つかったメッシュの位置や回転が変更されたときに発生します。

`meshupdated.detail : { id, position, rotation }`.

| プロパティ   | タイプ                              | 概要                            |
| ------- | -------------------------------- | ----------------------------- |
| id      | String                           | セッション内で安定したメッシュのID。           |
| 位置      | {x, y, z}\\`                    | 配置されたメッシュの3次元位置。              |
| ローテーション | w, x, y, z}\\`. | 配置されたメッシュの3次元ローカル方向（クォータニオン）。 |

**meshlost**：recelerが呼び出されたときに発生します。

`xrmeshlost.detail : { id }`.

| プロパティ | タイプ | 説明                  |
| ----- | --- | ------------------- |
| id    | 文字列 | セッション内で安定したメッシュのID。 |

**projectwayspotscanning**：すべてのプロジェクト場所がスキャン用にロードされたときに発生します。

`projectwayspotscanning.detail : { ウェイスポット：[] }`

| プロパティ   | タイプ    | 説明               |
| ------- | ------ | ---------------- |
| ウェイスポット | オブジェクト | 位置情報を含む配列オブジェクト。 |

wayspots\\`は以下のプロパティを持つオブジェクトの配列である：

| プロパティ   | タイプ    | 概要                            |
| ------- | ------ | ----------------------------- |
| id      | String | セッション内で安定している、このプロジェクトロケ地のID。 |
| 名称      | 文字列    | プロジェクト・ロケーション名                |
| イメージURL | 文字列    | このプロジェクトの場所の代表的な画像のURL。       |
| タイトル    | 文字列    | プロジェクト・ロケーションのタイトル            |
| lat     | 番号     | このプロジェクトの場所の緯度                |
| lng     | 番号     | このプロジェクトの場所の経度。               |

**projectwayspotfound**：プロジェクト ロケーションが最初に見つかったときに発生します。

`projectwayspotfound.detail : { name, position, rotation }`.

| プロパティ   | タイプ                              | 概要                         |
| ------- | -------------------------------- | -------------------------- |
| 名称      | String                           | プロジェクトの場所名。                |
| 位置      | {x, y, z}\\`                    | プロジェクト・ロケーションの3Dポジション。     |
| ローテーション | w, x, y, z}\\`. | プロジェクト位置の 3 次元ローカル方位（四元数）。 |

**projectwayspotupdated**：プロジェクト ロケーションの位置または回転が変更されたときに発生します。

`projectwayspotupdated.detail : { name, position, rotation }`.

| プロパティ   | タイプ                              | 概要                         |
| ------- | -------------------------------- | -------------------------- |
| 名称      | 文字列                              | プロジェクトの場所名。                |
| 位置      | {x, y, z}\\`                    | プロジェクト・ロケーションの3Dポジション。     |
| ローテーション | w, x, y, z}\\`. | プロジェクト位置の 3 次元ローカル方位（四元数）。 |

**projectwayspotlost**：プロジェクトの場所が追跡されなくなったときに発生します。

`projectwayspotlost.detail : { name, position, rotation }`.

| プロパティ   | タイプ                              | 説明                         |
| ------- | -------------------------------- | -------------------------- |
| 名称      | 文字列                              | プロジェクトの場所名。                |
| 位置      | {x, y, z}\\`                    | プロジェクト・ロケーションの3Dポジション。     |
| ローテーション | w, x, y, z}\\`. | プロジェクト位置の 3 次元ローカル方位（四元数）。 |

## 例 - パイプライン・モジュールの追加 {#example---adding-pipeline-module}

```javascript
XR8.addCameraPipelineModule(XR8.XrController.pipelineModule())
```

## 例 - ディスパッチされたイベント {#example---dispatched-events}

```javascript
const logEvent = ({name, detail}) => {
  console.log(`Handling event ${name}, got detail, ${JSON.stringify(detail)}`)
}

XR8.addCameraPipelineModule({
  name: 'eventlogger',
  listeners: [
    {event: 'reality.imageloading', process: logEvent},
    {event: 'reality.imagescanning', process: logEvent},
    {event: 'reality.imagefound', process: logEvent},
    {event: 'reality.imageupdated', process: logEvent},
    {event: 'reality.imagelost', process: logEvent},
  ],
})
```
