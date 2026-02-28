---
id: platformapi
---
# プラットフォームAPI: イメージ・ターゲット

8th Wall Image Target Management APIにより、開発者は8th Wall powered WebARプロジェクトに関連する **イメージターゲット ライブラリ** を動的に管理することができます。 このAPIと付属のドキュメントは、Web開発 & 8th Wallイメージ・ターゲットに精通した開発者向けに設計されています。

**始める前に**Image Target API を使用する前に、ワークスペースが **Pro**または**Enterprise**課金プランである必要があります。 アップグレードをご希望の方は、[営業担当](https://www.8thwall.com/licensing)までご連絡ください。

## 認証 {#authentication}

認証は秘密鍵によって行われます。 ProプランまたはEnterpriseプランのワークスペースは、APIキーをリクエストできます。 リクエストが承認されていることを確認するために、各リクエストにこの秘密鍵を含めることになります。 キーはワークスペースにスコープされているので、キーはそのワークスペース内の全アプリの、すべてのイメージ・ターゲットにアクセスできます。

キーはアカウントページで確認することができます。

![アプリ内のイメージ・ターゲット、ワークスペース内のアプリ、ワークスペース内のAPI Keyを示す可視化](/images/authentication-structure.png)

#### 重要 {#important}

Image Target APIキーは、ワークスペースに関連付けられたB2Bキーです。 APIキーを公開すると、意図しない利用や不正アクセスにつながる可能性があるため、ベストプラクティスに従ってAPIキーを保護してください。 以下の点を特に避けてください。

- ユーザーの端末で実行されるコードや、一般に公開されるコードにImage Target API Keyを埋め込むこと
- アプリケーションのソースツリー内にImage Target API Keyを格納すること

## 制限とクォータ {#limits-and-quotas}

- 1分間に25リクエスト、バースト許容量は500リクエストです。つまり、1分間に500リクエストした後、1分間に25リクエストすることができます。20分後、再び500リクエストすることができます。
- 1日あたりのリクエスト上限は10,000です。

**注**: これらの制限は、Image Target Management API にのみ適用され、開発者は 8th Wallプロジェクトに関連する画像のライブラリを動的に管理することができます。 **これらの制限は、Web AR体験のエンドユーザーによるアクティベーションには、 適用されません。**

ワークスペース内のプロジェクトに対するImage Target APIのクォータ制限の増加を希望する場合は、[サポート](mailto:support@8thwall.com)にリクエストを送信してください。

## エンドポイント {#endpoints}

- [イメージ・ターゲットの作成](#create-image-target)
- [イメージ・ターゲットの一覧](#list-image-targets)
- [イメージ・ターゲットの取得](#get-image-target)
- [イメージ・ターゲットの変更](#modify-image-target)
- [イメージ・ターゲットの削除](#delete-image-target)
- [イメージ・ターゲットのプレビュー](#preview-image-target)

### イメージ・ターゲットの作成 {#create-image-target}

アプリのイメージ・ターゲットリストに、新しいターゲットをアップロードします。

#### リクエスト {#post-request}

```bash
curl -X POST "https://api.8thwall.com/v1/apps/$APP_KEY/targets" \
    -H "X-Api-Key:$SECRET_KEY" \
    -F "name=my-target-name" \
    -F "image=@image.png"\
    -F "geometry.top=0"\
    -F "geometry.left=0"\
    -F "geometry.width=480"\
    -F "geometry.height=640"\
    -F "metadata={\"customFlag\":true}"
    -F "loadAutomatically=true"
```

| フィールド                         | タイプ         | デフォルト値     | 説明                                                                |
|:----------------------------- |:----------- |:---------- |:----------------------------------------------------------------- |
| image                         | Binary data |            | PNGまたはJPEG形式で、480x640以上、2048x2048未満、10MB未満である必要があります。             |
| name                          | `String`    |            | アプリ内で一意である必要があり、チルダ（~）を含めることはできません。255文字を超えることはできません。             |
| type [Optional]               | `String`    | `'PLANAR'` | `'PLANAR'`, `'CYLINDER'`, または `'CONICAL'`のいずれかです。                 |
| metadata [Optional]           | `String`    | `null`     | `metadataIsJson`がtrueの場合、有効なJSONである必要があり、2048 文字を超えることはできません。     |
| metadataIsJson [Optional]     | `Boolean`   | `true`     | メタデータプロパティを生の文字列として使用する場合は、falseを設定することができます。                     |
| loadAutomatically [Optional]  | `Boolean`   | `false`    | 各アプリは、`loadAutomatically: true`で、5つのイメージ・ターゲットに制限されています。          |
| geometry.isRotated [Optional] | `Boolean`   | `false`    | 画像が横向きから縦向きにあらかじめ回転している場合、trueに設定します。                             |
| geometry.top                  | integer     |            | これらのプロパティは、画像に適用するクロップを指定します。 アスペクト比は3:4で、少なくとも480x640でなければなりません。 |
| geometry.left                 | integer     |            |                                                                   |
| geometry.width                | integer     |            |                                                                   |
| geometry.height               | integer     |            |                                                                   |
| geometry.topRadius            | integer     |            | `type: 'CONICAL'`でのみ必要です。                                         |
| geometry.bottomRadius         | integer     |            | `type: 'CONICAL'`でのみ必要です。                                         |

#### 平面／曲面のジオメトリをアップロードする {#planar--cylinder-upload-geometry}

このダイアグラムは、アップロードされた画像に対して、`imageUrl`と`thumbnailImageUrl`を生成するために、指定したクロップがどのように適用されるかを示しています。 幅: 高さの比率は常に3: 4です。

![平面と円柱のイメージ・ターゲットにクロップ、回転、スケールを適用する方法を示す図。](/images/flat-geometry.jpg)

横長のクロップは、画像を時計回りに90度回転させた状態でアップロードし、`geometry.isRotated: true`を設定して、回転させた画像に対してクロップを指定します。

![isRotatedがtrueのとき、平面と曲面のイメージターゲットに、クロップ、回転、スケールがどのように適用されるかを示す図](/images/rotated-geometry.jpg)

#### 円錐のジオメトリをアップロードする {#conical-upload-geometry}

この図は、アップロードされた画像が、パラメータに基づいてどのように平坦化され、クロップされるかを示しています。 アップロードされた画像は、コンテンツの上端と下端が2つの同心円に揃う「レインボー」形式になっています。 ターゲットの上部が下部より狭い場合、外側の半径（マイナス）として`topRadius`を、内側の半径（プラス）として`bottomRadius` を指定してください。 縦長のクロップは、`geometry.isRotated: true`を設定し、クロップ適用前に平坦化された画像を回転させます。

![円錐形のイメージ・ターゲットにクロップ、回転、スケールを適用する方法を示す図](/images/cone-geometry.jpg)

#### レスポンス {#post-response}

<span id="image-target-format">これはイメージ・ターゲットの標準的なJSON応答フォーマットです。</span>

```json
{
  "name": "...",
  "uuid": "...",
  "type": "PLANAR",
  "loadAutomatically": true,
  "status": "AVAILABLE",
  "appKey": "...",
  "geometry": {
    "top": 842,
    "left": 392,
    "width": 851,
    "height": 1135,
    "isRotated": true,
    "originalWidth": 2000,
    "originalHeight": 2000
  },
  "metadata": null,
  "metadataIsJson": true,
  "originalImageUrl": "https://cdn.8thwall.com/image-target/...",
  "imageUrl": "https://cdn.8thwall.com/image-target/...",
  "thumbnailImageUrl": "https://cdn.8thwall.com/image-target/...",
  "geometryTextureUrl": "https://cdn.8thwall.com/image-target/...",
  "created": 1613508074845,
  "updated": 1613683291310
}
```

| プロパティ              | タイプ       | 説明                                                       |
|:------------------ |:--------- |:-------------------------------------------------------- |
| name               | `String`  |                                                          |
| uuid               | `String`  | このイメージ・ターゲットのユニークIDです。                                   |
| type               | `String`  | `'PLANAR'`, `'CYLINDER'`, または `'CONICAL'`のいずれかです。        |
| loadAutomatically  | `Boolean` |                                                          |
| status             | `String`  | `'AVAILABLE'`または`'TAKEN_DOWN'`のいずれかです。                   |
| appKey             | `String`  | ターゲットが属するアプリです。                                          |
| geometry           | `Object`  | 以下を参照してください。                                             |
| metadata           | `String`  |                                                          |
| metadataIsJson     | `Boolean` |                                                          |
| originalImageUrl   | `String`  | アップロードされたソース画像ののCDN URLです。                               |
| imageUrl           | `String`  | `geometryTextureUrl`のクロップされたバージョンです。                     |
| thumbnailImageUrl  | `String`  | サムネイルで使用するための、高さ350px版の`imageUrl`です。                     |
| geometryTextureUrl | `String`  | 円錐の場合は、元画像を平らにしたもので、平面と曲面の場合は、`originalImageUrl`と同じものです。 |
| created            | integer   | UNIXエポックからのミリ秒単位の作成日です。                                  |
| updated            | integer   | UNIXエポックからのミリ秒単位の最終更新日です。                                |

#### 平面ジオメトリ {#planar-geometry}

| プロパティ          | タイプ     | 説明                |
|:-------------- |:------- |:----------------- |
| top            | integer |                   |
| left           | integer |                   |
| width          | integer |                   |
| height         | integer |                   |
| isRotated      | Boolean |                   |
| originalWidth  | integer | アップロードされた画像の幅です。  |
| originalHeight | integer | アップロードされた画像の高さです。 |

#### 曲面または円錐ジオメトリ {#cylinder-or-conical-geometry}

`originalWidth` と`originalHeight`がgeometryTextureUrlに格納されている平坦化された画像の寸法を指すように変更された、平面ジオメトリプロパティを拡張します。

| プロパティ                       | タイプ      | 説明                                                                                |
|:--------------------------- |:-------- |:--------------------------------------------------------------------------------- |
| topRadius                   | float    |                                                                                   |
| bottomRadius               | float    |                                                                                   |
| coniness                    | float    | `type: CYLINDER`の場合は常に0です。 `type: CONICAL`の場合は`topRadius`/`bottomRadius`より得られます。  |
| cylinderCircumferenceTop    | float    | ターゲットの上辺がなぞる完全な円の外周です。                                                            |
| targetCircumferenceTop      | float    | クロップ適用前のターゲットの上辺に沿った長さです。                                                         |
| cylinderCircumferenceBottom | float    | `cylinderCircumferenceTop`および`topRadius`/`bottomRadius`より得られます。                   |
| cylinderSideLength          | float    | `targetCircumferenceTop`と元画像の寸法より得られます。                                           |
| arcAngle                    | float    | `cylinderCircumferenceTop`および`targetCircumferenceTop`より得られます。                     |
| inputMode                   | `String` | `'BASIC'`または`'ADVANCED'`のいずれかです。 8th Wallコンソールで、スライダーまたは数値入力ボックスのいずれを表示するかを制御します。 |

### イメージ・ターゲットの一覧 {#list-image-targets}

アプリに属するイメージ・ターゲットの一覧をクエリします。 結果はページ分割されます。つまりアプリに1回のレスポンスで返せる以上のイメージ・ターゲットが含まれている場合、イメージ・ターゲットの全リストを列挙するために、複数のリクエストを実行する必要があります。

#### リクエスト {#list-request}

```bash
curl "https://api.8thwall.com/v1/apps/$APP_KEY/targets" -H "X-Api-Key:$SECRET_KEY"
```

| パラメータ                   | タイプ      | 説明                                                            |
|:----------------------- |:-------- |:------------------------------------------------------------- |
| by [Optional]           | `String` | ソートする列を指定します。 オプションは "created", "updated", "name", "uuid" です。 |
| dir [Optional]          | `String` | リストのソート方向を制御します。 "asc"または "desc"のいずれかです。                      |
| start [Optional]        | `String` | `by`列に、この値を持つアイテムからリストが始まることを指定します。                           |
| after [Optional]        | `String` | この値を持つアイテムの直後にリストが開始することを指定します。                               |
| limit [Optional]        | integer  | 1から500の間でなければなりません。                                           |
| continuation [Optional] | `String` | 最初のクエリの後に次のページを取得するために使用します。                                  |

#### ソートされたリスト {#sorted-list}

このクエリは、アプリのターゲットを "z"から"a"の順でリストアップします。

```bash
curl "https://api.8thwall.com/v1/apps/$APP_KEY/targets?by=name&dir=desc" -H "X-Api-Key:$SECRET_KEY"
```

#### マルチソート {#multiple-sorts}

最初の `by` の値で重複した場合、タイブレーカーとして機能する2番目の"sort-by"パラメータを指定することができます。 `uuid` が指定されていない場合、デフォルトのタイブレーカーとして使用されます。

```bash
curl "https://api.8thwall.com/v1/apps/$APP_KEY/targets?by=updated&by=uuid" -H "X-Api-Key:$SECRET_KEY"
```

#### 開始ポイントの指定 {#specify-a-starting-point}

`by`の値に対応する`start`または`after`の値 の値を指定することで、リスト内の現在位置を指定することができます。 `updated: 333`と`uuid: 777`を持つアイテムの直後にリストを開始したい場合は、次のようにします。

```bash
curl "https://api.8thwall.com/v1/apps/$APP_KEY/targets?by=updated&by=uuid&start=333&after=777" -H "X-Api-Key:$SECRET_KEY"
```

こうすることで、`updated: 333` は、`uuid`が`777`の後に来る場合でも、次のページに含まれます。 あるアイテムの`updated`の値が`333`より大きくても、その`uuid`が`777`より小さい場合、2番目の`by`プロパティはタイブレーカーとしてのみ作用するため、次のページに含まれることに変わりはありません。

メインソートで`after`の値を指定し、タイブレーカーソートのために`start`の値を指定するのは無効です。 例えば、 `?by=name&by=uuid&after=my-name-&start=333`と指定しても有効ではありません。 これは、`?by=name&by=uuid&after=my-name-` とすべきです。なぜなら、2つ目の開始ポイントは、メインの開始ポイントが包括的である場合にのみ作用するからです（`start`を使用）。

![by、start、afterパラメータでリストの開始ポイントを指定する様子を示す図](/images/image-target-sort.png)

#### レスポンス {#list-response}

`targets`プロパティを含むJSONオブジェクトです。これは、[標準フォーマット](#image-target-format)のイメージ・ターゲットオブジェクトの配列です。

`continuationToken`がある場合、次のページのイメージ・ターゲットを取得するためには、フォローアップリクエストで次のページのイメージ・ターゲットを取得するために、`?continuation=[continuationToken]`を指定する必要があります。

```json
{
  "continuationToken": "...",
  "targets": [{
    "name": "...",
    "uuid": "...",
    "type": "PLANAR",
    "loadAutomatically": true,
    "status": "AVAILABLE",
    "appKey": "...",
    "geometry": {
      "top": 842,
      "left": 392,
      "width": 851,
      "height": 1135,
      "isRotated": true,
      "originalWidth": 2000,
      "originalHeight": 2000
    },
    "metadata": null,
    "metadataIsJson": true,
    "originalImageUrl": "https://cdn.8thwall.com/image-target/...",
    "imageUrl": "https://cdn.8thwall.com/image-target/...",
    "thumbnailImageUrl": "https://cdn.8thwall.com/image-target/...",
    "geometryTextureUrl": "https://cdn.8thwall.com/image-target/...",
    "created": 1613508074845,
    "updated": 1613683291310
  }, {
    "name": "...",
    "uuid": "...",
    "type": "CONICAL",
    "loadAutomatically": true,
    "status": "AVAILABLE",
    "appKey": "...",
    "geometry": {
      "top": 0,
      "left": 0,
      "width": 480,
      "height": 640,
      "originalWidth": 886,
      "originalHeight": 2048,
      "isRotated": true,
      "cylinderCircumferenceTop": 100,
      "cylinderCircumferenceBottom": 40,
      "targetCircumferenceTop": 50,
      "cylinderSideLength": 21.63,
      "topRadius": 1600,
      "bottomRadius": 640,
      "arcAngle": 180,
      "coniness": 1.3219280948873624,
      "inputMode": "BASIC"
    },
    "metadata": "{\"my-metadata\": 34534}",
    "metadataIsJson": true,
    "originalImageUrl": "https://cdn.8thwall.com/...",
    "imageUrl": "https://cdn.8thwall.com/...",
    "thumbnailImageUrl": "https://cdn.8thwall.com/...",
    "geometryTextureUrl": "https://cdn.8thwall.com/...",
    "created": 1613508074845,
    "updated": 1613683291310
  }]
}
```

### イメージ・ターゲットの取得 {#get-image-target}

#### リクエスト {#get-request}

```bash
curl "https://api.8thwall.com/v1/targets/$TARGET_UUID" -H "X-Api-Key:$SECRET_KEY"
```

#### レスポンス {#get-response}

[標準画像ターゲットフォーマット](#image-target-format)のJSONオブジェクト。

### イメージ・ターゲットの変更 {#modify-image-target}

以下のプロパティを変更することができます。

- `name`
- `loadAutomatically`
- `metadata`
- `metadataIsJson`

[初期アップロード](#create-image-target)と同じ検証ルールが適用されます。

曲面や円錐のイメージ・ターゲットの場合、`geometry`オブジェクトの以下のプロパティも変更可能です。

- `cylinderCircumferenceTop`
- `targetCircumferenceTop`
- `inputMode`

ターゲットの他のジオメトリプロパティは、それに合わせて更新されます。

#### リクエスト {#patch-request}

```bash
curl -X PATCH "https://api.8thwall.com/v1/targets/$TARGET_UUID"\
    -H "X-Api-Key:$SECRET_KEY"\
    -H "Content-Type: application/json"\
    --data '{"name":"new-name", "geometry: {"inputMode": "BASIC"}, "metadata": "{}"}'
```

#### レスポンス {#patch-response}

[標準画像ターゲットフォーマット](#image-target-format)のJSONオブジェクト。

### イメージ・ターゲットの削除 {#delete-image-target}

#### リクエスト {#delete-request}

```bash
curl -X DELETE "https://api.8thwall.com/v1/targets/$TARGET_UUID" -H "X-Api-Key:$SECRET_KEY"
```

#### レスポンス {#delete-response}

削除に成功すると、ステータスコード`204: No Content`を持つ空のレスポンスが返されます。

### イメージ・ターゲットのプレビュー {#preview-image-target}

ユーザーがターゲットのトラッキングをプレビューするために使用できるURLを生成します。

#### リクエスト {#preview-request}

```bash
curl "https://api.8thwall.com/v1/targets/$TARGET_UUID/test" -H "X-Api-Key:$SECRET_KEY"
```

#### レスポンス {#preview-response}

```json
{
  "url": "https://8w.8thwall.app/previewit/?j=...",
  "token": "...",
  "exp": 1612830293128
}
```

| プロパティ | タイプ      | 説明                                                 |
|:----- |:-------- |:-------------------------------------------------- |
| url   | `String` | ターゲット・トラッキングのプレビューに使用できるURLです。                     |
| token | `String` | このトークンは、現在プレビューアプリでのみ使用することができます。                  |
| exp   | integer  | トークンの有効期限を示すタイムスタンプ（ミリ秒単位）です。 トークンの有効期限は、発行後1時間です。 |

プレビュー機能は、特定のユーザーがイメージ・ターゲットを管理・設定する文脈で使用することを想定しています。 プレビューURLを公開サイトに公開したり、多数のユーザーと共有したりしないでください。

**カスタムプレビュー体験のベストプラクティス: **APIによって返されるプレビューURLは、8th Wallの汎用プレビュー画像・ターゲット体験です。 イメージ・ターゲットプレビューのフロントエンドをさらにカスタマイズしたい場合は、次の手順を実行します。

1. パブリックな8th Wallプロジェクトを作成します。
1. このプロジェクトのUXを、要件仕様に合わせてカスタマイズします。
1. ステップ1で作成したプロジェクトのApp Keyを使用して、ユーザーがテストしたいイメージ・ターゲットを、API経由でアップロードします。
1. ステップ1のプロジェクトの公開URLと、イメージ・ターゲット名のURLパラメータを使用して、エンドユーザー向けに、テスト可能なイメージ・ターゲットURLを生成します。
1. ステップ1で作成したプロジェクトで、URLパラメータを使用して、アクティブなイメージ・ターゲットを設定します。設定の際は、[`XR8.XrController.configure({imageTargets: ['theTargetName']})`](./xrcontroller/configure.md)を呼び出して使います。

## エラー処理 {#error-handling}

APIがリクエストを拒否した場合、レスポンスは`Content-Type: application/json`となり、ボディにはエラー文字列を含む`message`プロパティが含まれます。

## 例 {#example}

```json
{
  "message": "App not found: ..."
}
```

#### ステータスコード {#status-codes}

| ステータス | 理由                                                                                                               |
|:----- |:---------------------------------------------------------------------------------------------------------------- |
| 400   | これは、不正な値を指定した場合や、存在しないパラメータを指定した場合に発生する可能性があります。                                                                 |
| 403   | これは、秘密鍵を正しく指定しなかった場合に起こる可能性があります。                                                                                |
| 404   | アプリまたはイメージターゲットが削除された、またはApp KeyまたはターゲットUUIDが正しくない可能性があります。 また、提供されたAPIキーがアクセスしようとするリソースと一致しない場合のレスポンスコードでもあります。 |
| 413   | アップロードされた画像は、ファイルサイズが大きすぎるため拒否されました。                                                                             |
| 429   | APIキーが関連する[レート制限](#limits-and-quotas)を超過しています。                                                                   |
