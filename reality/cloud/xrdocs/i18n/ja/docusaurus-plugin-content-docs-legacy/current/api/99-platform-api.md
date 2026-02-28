# プラットフォームAPI画像ターゲット

8th Wall Image Target Management APIにより、開発者は8th Wall搭載WebARプロジェクトに関連する**イメージターゲット
ライブラリ**を動的に管理することができます。 このAPIと付属の
ドキュメントは、ウェブ開発と8th Wallイメージターゲットに精通した開発者向けに設計されています。 このAPIと付属の
ドキュメントは、ウェブ開発と8th Wallイメージターゲットに精通した開発者向けに設計されています。

\*\*Image Target API を使用する前に、ワークスペースが
**Enterprise** 課金プランである必要があります。 アップグレードをご希望の方は、[営業までご連絡ください](https://www.8thwall.com/licensing)。

## 認証 {#authentication}

認証は秘密鍵によって行われる。 認証は秘密鍵によって行われる。 EnterpriseプランのワークスペースはAPI Keyをリクエストできます。
リクエストが認可されていることを確認するために、各リクエストにこの秘密鍵を含めることになる。 キーは
ワークスペースにスコープされているので、そのキーは
ワークスペース内のすべてのアプリ内のすべてのイメージターゲットにアクセスできます。
リクエストが認可されていることを確認するために、各リクエストにこの秘密鍵を含めることになる。 キーは
ワークスペースにスコープされているので、そのキーは
ワークスペース内のすべてのアプリ内のすべてのイメージターゲットにアクセスできます。

キーはアカウントページで確認できます。

![Visualization showing image targets inside apps, apps inside the workspace, and the API Key inside the workspace](/images/authentication-structure.png)

#### 重要 {#important}

Image Target APIキーは、ワークスペースに関連付けられたB2Bキーです。 APIキーを一般に公開すると、意図しない使用や不正なアクセス（
）が発生する可能性があるため、ベストプラクティスに従ってAPIキーを
。 特に避けてください： APIキーを一般に公開すると、意図しない使用や不正なアクセス（
）が発生する可能性があるため、ベストプラクティスに従ってAPIキーを
。 特に避けてください：

- ユーザーのデバイス上で実行される、または一般に共有されるコードに Image Target API キーを埋め込む。
- アプリケーションのソースツリー内にImage Target APIキーを保存する

## リミットとクォータ {#limits-and-quotas}

- 1分間に25リクエスト、バースト許容量は500。つまり、
  1分間に500リクエスト、その後は1分間に25リクエスト、あるいは20分待って、さらに
  500リクエストできる。
- 1日あたり10,000件のリクエスト。

**注**\*：これらの制限はイメージターゲット管理APIにのみ適用され、開発者は8th Wallプロジェクトに関連するイメージライブラリを
、動的に管理することができます。
\*\*これらの制限は、ウェブAR体験のエンドユーザーによるアクティベーションには適用されません。
\*\*これらの制限は、ウェブAR体験のエンドユーザーによるアクティベーションには適用されません。

ワークスペース（
）にあるプロジェクトの Image Target API クォータ制限の増加をリクエストするには、[support](mailto:support@8thwall.com) にリクエストを送信してください。

## エンドポイント {#endpoints}

- [イメージターゲット作成](#create-image-target)
- [イメージターゲット一覧](#list-image-targets)
- [ターゲット画像取得](#get-image-target)
- [ターゲット画像の変更](#modify-image-target)
- [画像ターゲット削除](#delete-image-target)
- [プレビュー画像対象](#preview-image-target)

### イメージ・ターゲットの作成 {#create-image-target}

アプリの画像ターゲットリストに新しいターゲットをアップロードする

#### リクエスト {#post-request}

```bash
curl -X POST "https://api.8thwall.com/v1/apps/$APP_KEY/targets"  \
    -H "X-Api-Key：$SECRET_KEY" ￤
    -F "name=my-target-name" ￤
    -F "image=@image.png"￤
    -F "geometry.top=0"￤
    -F "geometry.left=0"￤
    -F "geometry.width=480"￤
    -F "geometry.height=640"￤
    -F "metadata={"customFlag":true}}"
    -F "loadAutomatically=true"
```

| フィールド                                                                                           | タイプ     | デフォルト値    | 説明                                                                                                                |
| :---------------------------------------------------------------------------------------------- | :------ | :-------- | :---------------------------------------------------------------------------------------------------------------- |
| イメージ                                                                                            | バイナリデータ |           | PNGまたはJPEG形式、480x640以上、2048x2048未満、10MB未満であること。                                                                   |
| 名称                                                                                              | 文字列     |           | アプリ内で一意でなければならず、チルダ（~）を含むことはできず、255文字を超えることはできません。                                                |
| type [オプション］                                                          | 文字列     | プラナー      | PLANAR'`、'CYLINDER'`、または'CONICAL'\\`。                                                                            |
| メタデータ [オプション］                                                         | 文字列     | null\\`。 | metadataIsJson\\` が true の場合は有効な JSON でなければならず、2048 文字を超えてはならない。                                                 |
| metadataIsJson [オプション]。                     | ブーリアン   | true\\`  | メタデータ・プロパティを生の文字列として使用するには、falseを設定します。                                                                           |
| loadAutomatically [オプション］                                             | ブーリアン   | false\\` | 各アプリは、`loadAutomatically: true`で5つの画像ターゲットに制限されます。                                                                |
| geometry.isRotated [オプション]。 | ブーリアン   | false\\` | 画像が横向きから縦向きにあらかじめ回転されている場合はtrueに設定する。                                                                             |
| ジオメトリトップ                                                                                        | 整数      |           | これらのプロパティは、画像に適用する切り抜きを指定します。 アスペクト比3:4、480x640以上であること。 アスペクト比3:4、480x640以上であること。 |
| ジオメトリ.左                                                                         | 整数      |           |                                                                                                                   |
| ジオメトリの幅                                                                                         | 整数      |           |                                                                                                                   |
| ジオメトリの高さ                                                                                        | 整数      |           |                                                                                                                   |
| ジオメトリ.topRadius                                                                 | 整数      |           | type: 'CONICAL'\\`にのみ必要。                                                                         |
| ジオメトリ.ボトム半径                                                                     | 整数      |           | type: 'CONICAL'\\`にのみ必要。                                                                         |

#### 平面 / シリンダー アップロード ジオメトリー {#planar--cylinder-upload-geometry}

この図は、
`imageUrl` と `thumbnailImageUrl` を生成するために、指定されたクロップがどのようにアップロードされた画像に適用されるかを示しています。 幅：高さの比率は常に3：4である。 幅：高さの比率は常に3：4である。

![Diagram showing how crop, rotation, and scale are applied to planar and cylinder image targets](/images/flat-geometry.jpg)

横長にクロップする場合は、画像を時計回りに90度回転させてアップロードし、
`geometry.isRotated: true`を設定し、回転した画像に対してクロップを指定します。

![Diagram showing how crop, rotation, and scale are applied to planar and cylinder image targets when isRotated is true](/images/rotated-geometry.jpg)

#### 円錐アップロード形状 {#conical-upload-geometry}

この図は、アップロードされた画像がパラメータに基づいてどのように平坦化され、トリミングされるかを示しています。
アップロードされた画像は、コンテンツの上端と下端が2つの同心円
に並ぶ「虹」形式です。 もしターゲットが上部の方が下部よりも狭い場合は、`topRadius`
を外側の半径のマイナスとして指定し、`bottomRadius` を内側の半径（プラス）として指定します。
の風景クロップでは、`geometry.isRotated: true` を設定すると、
のクロップが適用される前に、平坦化された画像が回転されます。

![Diagram showing how crop, rotation, and scale are applied to conical image targets](/images/cone-geometry.jpg)

#### レスポンス {#post-response}

<span id="image-target-format">これは画像ターゲットの標準的なJSONレスポンスフォーマットです。</span>

```json
{
  "name"："...",
  "uuid"："...",
  "type"："PLANAR",
  "loadAutomatically": true,
  "status"："AVAILABLE",
  "appKey"："...",
  "geometry"：{
    "top"：842,
    "left"：392,
    "width"：851,
    "height"：1135,
    "isRotated": true,
    "originalWidth"：2000,
    "originalHeight"：2000
  },
  "metadata": null,
  "metadataIsJson": true,
  "originalImageUrl"："https://cdn.8thwall.com/image-target/...",
  "imageUrl"："https://cdn.8thwall.com/image-target/...",
  "thumbnailImageUrl"："https://cdn.8thwall.com/image-target/...",
  "geometryTextureUrl"："https://cdn.8thwall.com/image-target/...",
  "created"：1613508074845,
  "updated"：1613683291310
}.
```

| プロパティ              | タイプ    | 説明                                                       |
| :----------------- | :----- | :------------------------------------------------------- |
| 名称                 | 文字列    |                                                          |
| ユイド                | 文字列    | この画像ターゲットのユニークID                                         |
| タイプ                | 文字列    | PLANAR'`、'CYLINDER'`、または'CONICAL'\\`。                   |
| 自動的にロード            | ブーリアン  |                                                          |
| ステータス              | 文字列    | AVAILABLE'`または`'TAKEN_DOWN'\\`。    |
| アプリキー              | 文字列    | ターゲットが属するアプリ                                             |
| ジオメトリー             | オブジェクト | 下記参照                                                     |
| メタデータ              | 文字列    |                                                          |
| メタデータIsJson        | ブーリアン  |                                                          |
| オリジナル画像URL         | 文字列    | アップロードされたソース画像のCDN URL                                   |
| イメージURL            | 文字列    | geometryTextureUrl\\`の切り抜き版。                            |
| サムネイル画像URL         | 文字列    | サムネイルで使用する高さ350pxの`imageUrl`バージョン                        |
| geometryTextureUrl | 文字列    | 円錐形の場合は元画像の平坦化されたバージョン、平面と円柱の場合は `originalImageUrl` と同じ。 |
| 作成                 | 整数     | unixエポック後のミリ秒単位の作成日                                      |
| 更新済み               | 整数     | unixエポック後のミリ秒単位の最終更新日                                    |

#### 平面幾何学 {#planar-geometry}

| プロパティ  | タイプ   | 説明             |
| :----- | :---- | :------------- |
| トップ    | 整数    |                |
| 左      | 整数    |                |
| 幅      | 整数    |                |
| 高さ     | 整数    |                |
| 回転     | ブーリアン |                |
| オリジナル幅 | 整数    | アップロードされた画像の幅  |
| 元の高さ   | 整数    | アップロードされた画像の高さ |

#### 円柱または円錐形状 {#cylinder-or-conical-geometry}

OriginalWidth`と
`originalHeight\\`がgeometryTextureUrlに格納されている平坦化された画像の寸法を参照するように変更されたPlanar Geometryプロパティを拡張します。

| プロパティ      | タイプ  | 説明                                                                                                                   |
| :--------- | :--- | :------------------------------------------------------------------------------------------------------------------- |
| トップラディウス   | フロート |                                                                                                                      |
| 底半径        | フロート |                                                                                                                      |
| コニネス       | フロート | タイプ: `type：CYLINDER` の場合は常に 0、`type: CYLINDER` の場合は `topRadius`/`bottomRadius` から派生する：CONICAL\\`の場合 |
| 円柱周長トップ    | フロート | ターゲットの上端がなぞる円周の長さ。                                                                                                   |
| ターゲット円周トップ | フロート | クロップする前のターゲットの上端に沿った長さ。                                                                                              |
| 円柱の底の円周    | フロート | cylinderCircumferenceTop`と`topRadius`/`bottomRadius\\` から派生。                                                        |
| シリンダー側面の長さ | フロート | targetCircumferenceTop\\` と元の画像の寸法から生成される。                                                                          |
| 円弧角度       | フロート | cylinderCircumferenceTop`と`targetCircumferenceTop\\` から派生した。                                                        |
| 入力モード      | 文字列  | BASIC'` または 'ADVANCED'`. ユーザーが8th Wallコンソールで見るもの（スライダーまたは数値入力ボックス）をコントロールする。                         |

### リスト・イメージ・ターゲット {#list-image-targets}

アプリに属するイメージターゲットのリストを問い合わせる。 アプリに属するイメージターゲットのリストを問い合わせる。 つまり、
、1回のレスポンスで返せる以上のイメージターゲットがアプリに含まれている場合、イメージターゲットの全リストを列挙するために複数の
リクエストを行う必要があります。

#### リクエスト {#list-request}

```bash
curl "https://api.8thwall.com/v1/apps/$APP_KEY/targets" -H "X-Api-Key：$SECRET_KEY"
```

| パラメータ                                   | タイプ | 説明                                                                          |
| :-------------------------------------- | :-- | :-------------------------------------------------------------------------- |
| オプション]で       | 文字列 | ソートするカラムを指定する。 ソートするカラムを指定する。 オプションは "created"、"updated"、"name"、または "uuid"。 |
| dir [オプション］   | 文字列 | リストのソート方向を制御する。 asc "または "desc "のいずれか。 asc "または "desc "のいずれか。               |
| start [オプション］ | 文字列 | by\\`カラムにこの値を持つアイテムからリストが始まることを指定する。                                       |
| オプション                                   | 文字列 | この値を持つ項目の直後からリストが始まるように指定する。                                                |
| limit [オプション］ | 整数  | 1から500の間でなければならない                                                           |
| 継続 [オプション］    | 文字列 | 最初のクエリの次のページを取得するために使用される。                                                  |

#### 並べ替えリスト {#sorted-list}

このクエリーは、アプリのターゲットを "z "から始まり "a "に向かってリストアップする。

```bash
curl "https://api.8thwall.com/v1/apps/$APP_KEY/targets?by=name&dir=desc" -H "X-Api-Key：$SECRET_KEY"
```

#### 複数のソート {#multiple-sorts}

二番目の "sort-by "パラメータを指定することができ、これは最初の`by`値に重複があった場合に同点にするためのものである。 uuid\`は指定がない場合、デフォルトのタイブレークとして使用される。 uuid`は指定がない場合、デフォルトのタイブレークとして使用される。

```bash
curl "https://api.8thwall.com/v1/apps/$APP_KEY/targets?by=updated&by=uuid" -H "X-Api-Key：$SECRET_KEY"
```

#### スタート地点の指定 {#specify-a-starting-point}

by`の値に対応する `start`または`after` の値を指定することで、リスト内の現在の位置を指定することができる。 by`の値に対応する `start`または`after`の値を指定することで、リスト内の現在の位置を指定することができる。 リストを`updated：333`と`uuid: 777\` を持つアイテムの直後からリストを開始したい場合は、次のようにする： by`の値に対応する `start`または`after`の値を指定することで、リスト内の現在の位置を指定することができる。 リストを`updated：333`と`uuid: 777\\` を持つアイテムの直後からリストを開始したい場合は、次のようにする：

```bash
curl "https://api.8thwall.com/v1/apps/$APP_KEY/targets?by=updated&by=uuid&start=333&after=777" -H "X-Api-Key：$SECRET_KEY"
```

こうすると、`updated：333` を持つアイテムは、 `uuid` が `777` の後に来ても次のページに含まれる。 こうすると、`updated：333` を持つアイテムは、 `uuid` が `777` の後に来ても次のページに含まれる。 アイテムの `updated` の値が `333` より大きくても、`uuid` の値が `777` より小さければ、2番目の `by` プロパティはタイブレーカーにのみ適用されるため、次のページに含まれます。

タイブレークソートに `start` の値を指定しながら、メインソートに `after` の値を指定することは無効である。 例えば、`?by=name&by=uuid&after=my-name-&start=333`のような指定は無効である。 これは代わりに`?by=name&by=uuid&after=my-name-`とすべきです。なぜなら、2つ目の開始点は、メインの開始点が（`start`を使用して）包括的である場合にのみ有効になるからです。

![Diagram showing how the by, start, and after parameters specify the starting point of the list](/images/image-target-sort.png)

#### レスポンス {#list-response}

プロパティ `targets` を含むJSONオブジェクトで、[標準フォーマット](#post-response)のイメージターゲットオブジェクトの配列である。

continuationToken`が存在する場合、画像ターゲットの次のページを取得するには、フォローアップリクエストで `?continuation=[continuationToken]\\`を指定する必要があります。

```json
{
  "continuationToken"："...",
  "targets"：[{
    "name"："...",
    "uuid"："...",
    "type"："PLANAR",
    "loadAutomatically": true,
    "status"："AVAILABLE",
    "appKey"："...",
    "geometry"：{
      "top"：842,
      "left"：392,
      "width"：851,
      "height"：1135,
      "isRotated": true,
      "originalWidth"：2000,
      "originalHeight"：2000
    },
    "metadata": null,
    "metadataIsJson": true,
    "originalImageUrl"："https://cdn.8thwall.com/image-target/...",
    "imageUrl"："https://cdn.8thwall.com/image-target/...",
    "thumbnailImageUrl"："https://cdn.8thwall.com/image-target/...",
    "geometryTextureUrl"："https://cdn.8thwall.com/image-target/...",
    "created"：1613508074845,
    "updated"：1613683291310
  }, {
    "name"："...",
    "uuid"："...",
    "type"："CONICAL",
    "loadAutomatically": true,
    "status"："AVAILABLE",
    "appKey"："...",
    "geometry"：{
      "top"：0,
      "left"：0,
      "width"：480,
      "height"：640,
      "originalWidth"：886,
      "originalHeight"：2048,
      "isRotated": true,
      "cylinderCircumferenceTop"：100,
      "cylinderCircumferenceBottom"：40,
      "targetCircumferenceTop"：50,
      "cylinderSideLength"：21.63,
      "topRadius"：1600,
      "bottomRadius"：640,
      "arcAngle"：180,
      "coniness"：1.3219280948873624,
      "inputMode"："BASIC"
    },
    "metadata"："{"my-metadata"：34534}",
    "metadataIsJson": true,
    "originalImageUrl"："https://cdn.8thwall.com/...",
    "imageUrl"："https://cdn.8thwall.com/...",
    "thumbnailImageUrl"："https://cdn.8thwall.com/...",
    "geometryTextureUrl"："https://cdn.8thwall.com/...",
    "created"：1613508074845,
    "updated"：1613683291310
  }].
}
```

### ターゲット画像の取得 {#get-image-target}

#### リクエスト {#get-request}

```bash
curl "https://api.8thwall.com/v1/targets/$TARGET_UUID" -H "X-Api-Key：$SECRET_KEY"
```

#### レスポンス {#get-response}

標準画像ターゲットフォーマット]のJSONオブジェクト(#post-response)

### 画像ターゲットの修正 {#modify-image-target}

以下のプロパティを変更できます：

- 名前\\`
- 自動的にロードする
- メタデータ
- metadataIsJson\\`。

初回アップロード](#create-image-target)と同じ検証ルールが適用されます。

円柱や円錐形のイメージターゲットでは、`geometry`オブジェクトの以下のプロパティも変更できます：

- シリンダー周長トップ\\`。
- targetCircumferenceTop\\`。
- inputMode\\`

ターゲットの他のジオメトリ・プロパティは、それに合わせて更新される。

#### リクエスト {#patch-request}

```bash
curl -X PATCH "https://api.8thwall.com/v1/targets/$TARGET_UUID"\
    -H "X-Api-Key：$SECRET_KEY"￭
    -H "Content-Type: application/json"￭
    --data '{"name": "new-name", "geometry：'{"name": "新しい名前", "geometry: {"inputMode"："BASIC"}, "metadata"："{}"}'
```

#### レスポンス {#patch-response}

標準画像ターゲットフォーマット]のJSONオブジェクト(#post-response)

### 画像の削除 {#delete-image-target}

#### リクエスト {#delete-request}

```bash
curl -X DELETE "https://api.8thwall.com/v1/targets/$TARGET_UUID" -H "X-Api-Key：$SECRET_KEY"
```

#### レスポンス {#delete-response}

削除に成功すると、ステータスコード `204：コンテンツがありません`。

### プレビュー画像ターゲット {#preview-image-target}

ユーザーがターゲットのトラッキングをプレビューするために使用できるURLを生成します。

#### リクエスト {#preview-request}

```bash
curl "https://api.8thwall.com/v1/targets/$TARGET_UUID/test" -H "X-Api-Key：$SECRET_KEY"
```

#### レスポンス {#preview-response}

```json
{
  "url"："https://8w.8thwall.app/previewit/?j=...",
  "token"："...",
  "exp"：1612830293128
}.
```

| プロパティ | タイプ | 説明                                                 |
| :---- | :-- | :------------------------------------------------- |
| url   | 文字列 | ターゲット・トラッキングのプレビューに使用できるURL                        |
| トークン  | 文字列 | このトークンは現在、プレビューアプリでのみ使用できます。                       |
| 経験値   | 整数  | トークンの有効期限が切れるまでのタイムスタンプ（ミリ秒単位）。 トークンの有効期限は発行から1時間。 |

プレビュー機能は、特定のユーザーがイメージターゲットを管理する、または
設定する場合に使用することを想定しています。 プレビューURLを公開サイトに公開したり、多数のユーザーと共有したりしないでください。

**カスタム・プレビュー・エクスペリエンスのベスト・プラクティス:** APIによって返されるプレビューURLは、
、8番目のウォール汎用プレビュー画像ターゲット・エクスペリエンスです。 イメージターゲットプレビューの
フロントエンドをさらにカスタマイズしたい場合は、次の手順を実行します： イメージターゲットプレビューの
フロントエンドをさらにカスタマイズしたい場合は、次の手順を実行します：

1. 第8回ウォール・プロジェクトを公開
2. このプロジェクトのUXをあなた仕様にカスタマイズする
3. ステップ1で作成したプロジェクト（
   ）のアプリキーを使って、ユーザーがテストしたい画像ターゲットをAPI経由でアップロードする。
4. ステップ1（
   ）のプロジェクトの公開URLと、画像ターゲットの名前を持つURLパラメータを使用して、エンドユーザー向けにテスト可能な画像ターゲットURLを生成します。
5. ステップ1で作成したプロジェクトで、URLパラメータを使用して、
   [`XR8.XrController.configure({imageTargets: ['theTargetName']})`](./xrcontroller/configure.md)を呼び出し、アクティブなイメージターゲットを設定します。

## エラー処理 {#error-handling}

APIがリクエストを拒否した場合、レスポンスは `Content-Type: application/json` となり、
のボディにはエラー文字列を含む `message` プロパティが含まれる。

## 例 {#example}

```json
{
  "message"："アプリが見つかりません: ..."
}
```

#### ステータス・コード {#status-codes}

| ステータス | 理由                                                                                                                                                                                                                                                                                        |
| :---- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 400   | これは、無効な値を指定した場合や、存在しないパラメータを指定した場合に起こる可能性がある。                                                                                                                                                                                                                                             |
| 403   | これは、秘密鍵を正しく入力していない場合に起こる可能性があります。                                                                                                                                                                                                                                                         |
| 404   | アプリまたはイメージターゲットが削除されているか、アプリキーまたはターゲットUUIDが正しくない可能性があります。 アプリまたはイメージターゲットが削除されているか、アプリキーまたはターゲットUUIDが正しくない可能性があります。 これは、提供されたAPIキーがアクセスしようとしているリソースと一致しない場合のレスポンスコードでもある。 アプリまたはイメージターゲットが削除されているか、アプリキーまたはターゲットUUIDが正しくない可能性があります。 これは、提供されたAPIキーがアクセスしようとしているリソースと一致しない場合のレスポンスコードでもある。 |
| 413   | アップロードされた画像はファイルサイズが大きすぎるため拒否されました。                                                                                                                                                                                                                                                       |
| 429   | お客様のAPIキーが、関連する[レート制限](#limits-and-quotas)を超えました。                                                                                                                                                                                                                                         |
