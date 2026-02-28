---
id: advanced-analytics
---

# アドバンスド・アナリティクス

8th Wallのプロジェクトは、[基本的な利用状況分析](/legacy/guides/projects/usage-and-recent-trends)を提供しています。
、あなたのプロジェクトが何回「閲覧」されたか、また、
ユーザーの平均滞在時間を見ることができます。 カスタム分析やより詳細な分析をご希望の場合は、3rd
パーティーのウェブ分析をプロジェクトに追加することをお勧めします。

プロジェクトにアナリティクスを追加するプロセスは、AR
以外のウェブサイトにアナリティクスを追加するのと同じです。  お好きな分析ソリューションをご利用ください。  お好きな分析ソリューションをご利用ください。

この例では、Google Tag
Manager (GTM)を使って8th WallプロジェクトにGoogle Analyticsを追加する方法を説明します。

GTMのウェブベースのユーザーインターフェイスを使用して、タグを定義し、特定のイベントが発生したときにタグを
、発火させるトリガーを作成することができます。 あなたの8th Wallプロジェクトで、（
Javascriptの1行を使って）コード内の必要な場所でイベントを発生させます。

## アナリティクス 前提条件 {#analytics-pre-requisites}

すでにGoogle AnalyticsとGoogle Tag Managerのアカウントを持っており、それらの仕組みについて基本的な理解を持っていること。

詳細については、以下のGoogleドキュメントを参照してください：

- グーグルアナリティクス4
  - はじめに<https://support.google.com/analytics/answer/9304153>
  - データストリームの追加<https://support.google.com/analytics/answer/9304153#stream>
- グーグルタグマネージャー
  - 概要<https://support.google.com/tagmanager/answer/6102821>
  - セットアップとインストール：<https://support.google.com/tagmanager/answer/6103696>

## Google Tag Managerを8th Wall Projectに追加する {#add-google-tag-manager-to-your-8th-wall-project}

1. タグマネージャーコンテナのワークスペースページで、コンテナID（例：
   "**GTM-XXXXXX**\*"）をクリックし、"Install Google Tag Manager "ボックスを開きます。  このウィンドウには、
   、後で8th Wallプロジェクトに追加する必要のあるコードが含まれています。

![GTM1](/images/gtm1.jpg)

2. 8番目のWall Cloud Editorを開き、**top**コードブロックを**head.html**に貼り付ける：

![GTM2](/images/gtm2.jpg)

3. Filesの隣にある「+」をクリックし、**gtm.html**という新しいファイルを作成し、
   the **bottom** コードブロックの内容をこのファイルに貼り付けます：

![GTM3](/images/gtm3.jpg)

4. app.jsの一番上に以下のコードを追加する：

```javascript
import * as googleTagManagerHtml from './gtm.html'
document.body.insertAdjacentHTML('afterbegin', googleTagManagerHtml)
```

## Google Tag Manager {#configure-google-tag-manager}

1. データストリームの[Google Measurement ID](https://support.google.com/analytics/answer/12270356)を探します。
2. GTMで、[GA4 Configuration](https://support.google.com/tagmanager/answer/9442095#config)タグを作成します。

例

![GTM8](/images/gtm8.jpg)

## ページビューのトラッキング {#tracking-page-views}

ページビューはGA4 Configurationタグを通して自動的にトラッキングされます。 詳しくは[Googleタグマネージャの設定](/legacy/guides/advanced-topics/advanced-analytics/#configure-google-tag-manager)をご覧ください。

## カスタムイベントのトラッキング {#tracking-custom-events}

GTMはまた、カスタムアクションがWebAR
の **内部** で発生したときにイベントを発生させる機能を提供します。 これらのイベントは、あなたのWebARプロジェクトに特有のものですが、いくつか例を挙げることができます： これらのイベントは、あなたのWebARプロジェクトに特有のものですが、いくつか例を挙げることができます：

- 配置された3Dオブジェクト
- 画像ターゲット発見
- スクリーンショット
- その他…

この例では、
["AFrame: Place Ground"](https://www.8thwall.com/8thwall/placeground-aframe) サンプルプロジェクトに、3Dモデルがスポーンされるたびに
発生するTag（Trigger付き）を作成し、追加します。

#### カスタム・イベント・トリガーの作成 {#create-custom-event-trigger}

- トリガータイプ\*\*カスタムイベント
- イベント名イベント名：**placeModel**
- このトリガーは\*\*すべてのカスタムイベント

![GTM6](/images/gtm6.jpg)

#### タグの作成 {#create-tag-1}

次に、コード内で "placeModel "トリガーが発火したときに発火するタグを作成する。

- タグの種類\*\*Google Analytics：GA4イベント
- コンフィギュレーション・タグ(以前に作成されたコンフィギュレーションを選択)
- イベント名\*\*会場モデル
- トリガーをかける：\*\*前のステップで作成した "placeModel "トリガーを選択する。

![GTM9](/images/gtm9.jpg)

**重要**です：  作成したすべてのトリガー/タグを保存し、
の設定を GTM インターフェース内で **Submit/Publish** して、ライブになるようにしてください。 <https://support.google.com/tagmanager/answer/6107163>を参照。

#### 第8ウォール・プロジェクト内部での火災イベント {#fire-event-inside-8th-wall-project}

あなたの8th Wallプロジェクトで、このトリガーをあなたのコードの好きな場所で起動するために、以下のjavascriptの行を追加してください：

ウィンドウ.データレイヤー.プッシュ({event: 'placeModel'})

##### 例 - <https://www.8thwall.com/8thwall/placeground-aframe/master/tap-place.js> {#example---based-on-httpswww8thwallcom8thwallplaceground-aframemastertap-placejs}に基づく

```javascript
export const tapPlaceComponent = {
  init: function() {
    const ground = document.getElementById('ground')
    ground.addEventListener('click', event => {
      // 新しいオブジェクトのエンティティを作成
      const newElement = document.createElement('a-entity')

      // raycaster はシーン内のタッチの位置を与える
      const touchPoint = event.detail.intersection.point
      newElement.setAttribute('position', touchPoint)

      const randomYRotation = Math.random() * 360
      newElement.setAttribute('rotation', '0 ' + randomYRotation + ' 0')

      newElement.setAttribute('visible', 'false')
      newElement.setAttribute('scale', '0.0001 0.0001 0.0001')

      newElement.setAttribute('shadow', {
        receive: false,
      })

      newElement.setAttribute('class', 'cantap')
      newElement.setAttribute('hold-drag', '')

      newElement.setAttribute('gltf-model', '#treeModel')
      this.el.sceneEl.appendChild(newElement)

      newElement.addEventListener('model-loaded', () => {
        // モデルが読み込まれたら、アニメーションを使って飛び出すように表示する準備ができた
        newElement.setAttribute('visible', 'true')
        newElement.setAttribute('animation', {
          property: 'scale',
          to：'7 7 7',
          easing：'easeOutElastic',
          dur: 800,
        })

        // ****************************
        // モデルが読み込まれたらGoogle Tag Managerイベントを発生させる
        // ****************************
        window.dataLayer.push({event: 'placeModel'})
      })
    })
  }
}
```
