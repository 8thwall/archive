---
sidebar_label: 開発
sidebar_position: 4
---

# VPS体験の開発

## Lightship VPS {#enabling-lightship-vps}の有効化

WebAR プロジェクトで VPS を有効にするには、`enableVPS` を `true` に設定する必要があります。

A-Frame プロジェクトの場合、`<a-scene>` の `xrweb` コンポーネントに `enableVps: true` を設定する。

非AFrameプロジェクトでは、エンジン始動の前に`XR8.XrController.configure()`の呼び出しで`enableVps: true`を設定してください。

#### 例 - AFrame {#example---aframe}

```html
<a-scene
  coaching-overlay
  landing-page
  xrextras-loading
  xrextras-runtime-error
  ...
  xrweb="enableVps: true;">
```

#### 例 - ノンAフレーム {#example---non-aframe}

```javascript
XR8.XrController.configure({enableVps: true})
// 次に、8番目のウォールエンジンをスタートさせる。
```

## オーダーメイドのVPS体験の開発

オーダーメイドのVPSシーンは、単一のロケーション用にデザインされ、ARコンテンツを配置するためにGeospatial Browserの参照メッシュを利用します。

その1：シーンに場所を追加する

1. 地理空間ブラウザを開く（左側の地図アイコンǺ）。
2. VPSが有効なロケーションを探す（または[自分で指名/有効化](https://www.8thwall.com/docs/web/#scanning-wayspots)
3. ロケーションをプロジェクトに追加する

![](https://static.8thwall.app/assets/geospatial-browser-jmcd7ic3ob.png)

パート2：カスタムARアニメーションのリファレンスとしてロケーションGLBを使用する

4. 行の右側から参考GLBをダウンロードする。
5. これを3Dモデリングソフトウェア（Blender、Maya、A-Frameなど）で使用して、ARコンテンツをメッシュの原点に対して相対的に配置します。

![](https://i.giphy.com/media/dOFnRHGzZghGjecdeq/giphy.gif)

\*重要この3Dモデルの原点はLocationの原点です。 原点をリセットしないでください。 原点をリセットしないでください。

_オプション_です：もし、Geospatial Browserからダウンロードしたメッシュが、ベイクドアニメーションや物理演算、オクルーダーのマテリアルに使用するのに十分な品質でない場合は、
、Scaniverseのようなサードパーティのアプリケーションを使ってスキャンし、その高品質メッシュと
Geospatial Browserからダウンロードしたメッシュをアライメントすることを検討してください。

6. アニメーションGLBをクラウドエディタにインポートし、シーンに追加する
7. named-locationコンポーネントをアセットの`<a-entity>`に追加します。 name' 属性は、Geospatial Browser の Project Location の `name` を参照する。 name' 属性は、Geospatial Browser の Project Location の `name` を参照する。

ジャジャーン! 🪄 アニメーションは、現実世界のロケ地と一直線上に表示されるはずです。

パート3：オクルージョンと影の追加

1. シーンに`<a-entity named-location="name: LOCATIONNAME"><a-entity>` を追加する。
2. この要素の中に、子要素として<a-entity> を3つ追加する。 これらはオクルーダー・メッシュ、シャドウ・メッシュ、VPSアニメーションとなる。 これらはオクルーダー・メッシュ、シャドウ・メッシュ、VPSアニメーションとなる。
3. 最初の`<a-entity>`に`xrextras-hider-material`と`gltf-model="#vps-mesh"`を追加する。 "`#vps-mesh`"は、
   、テクスチャが削除され、ジオメトリが縮小されたリファレンスGLBのバージョンを参照する必要があります。 "`#vps-mesh`"は、
   、テクスチャが削除され、ジオメトリが縮小されたリファレンスGLBのバージョンを参照する必要があります。
4. 2番目の`<a-entity>`に、`shadow-shader`、`gltf-model="#vps-mesh"`、`shadow="cast: false"`を追加する。
   シャドウシェーダは、Zファイトを防ぐためにポリゴンオフセットで参照メッシュにシャドウマテリアルを適用します。
   shadow="cast:true"\`で、vps-meshに実世界に影を落とすかどうかを選択できる。 
   シャドウシェーダは、Zファイトを防ぐためにポリゴンオフセットで参照メッシュにシャドウマテリアルを適用します。 
   shadow="cast:true"`で、vps-meshに実世界に影を落とすかどうかを選択できる。
5. 3番目の`<a-entity>`に、`gltf-model="#vps-anim"`、`reflections="type: realtime"`、`play-vps-animation`、`shadow="receive:false"`を追加する。
   play-vps-animation`は、`vps-coaching-overlay\`が消えるまで待ってからVPSアニメーションを再生する。 
   play-vps-animation`は、`vps-coaching-overlay`が消えるまで待ってからVPSアニメーションを再生する。

### \*リモートデスクトップ開発セットアップ

![](https://i.giphy.com/media/cBr0UnA7jjqAzAOGTi/giphy.gif)

A-Frameインスペクタを使って、デスクトップ上のコンテンツをリモートで配置すると便利なことがよくあります。
このプロジェクトのシーンをリモートデスクトップ開発用に設定するには、
、先頭に文字を追加して、以下のコンポーネントを無効にします（例："Znamed-location"）：

- xrweb`->`Zxrweb\\`
- xrextras-loading`->`Zxrextras-loading\\`.
- named-location`->`Znamed-location\\`
- xrextras-hider-material`→`Zxrextras-hider-material\\`。

これで、[A-Frame Inspector](https://aframe.io/docs/1.3.0/introduction/visual-inspector-and-dev-tools.html)
（Mac：ctrl+opt+i、PC：ctrl+alt+i）を開き、Geospatial BrowserからインポートしたVPSメッシュに対してコンテンツを相対的に配置することができます。
覚えておいてほしいのは、これは_検査官_だということだ。 トランスフォームの値をコードにコピーし直す必要がある。
覚えておいてほしいのは、これは_検査官_だということだ。 トランスフォームの値をコードにコピーし直す必要がある。

オプションとして、<a-entity named-location>`を一時的にシーンの中心に再配置することができます。 オプションとして、<a-entity named-location>`を一時的にシーンの中心に再配置することができます。 注: VPS
のコンテンツが正しく配置されるように、`<a-entity named-location>`を`position="0 0"\` にリセットする。

### \*リモート・モバイル開発セットアップ

![](https://i.giphy.com/media/ZVQCdOhIHx10Dsrxnf/giphy.gif)

A-Frameインスペクタを使用して、モバイルデバイスでVPSをリモートシミュレートすると便利です。
リモート・モバイル開発用にこのプロジェクトのシーンをセットアップするには、
、以下のコンポーネントの先頭にアルファベットを追加して無効にする（例："Znamed-location"）：

- named-location`->`Znamed-location\\`
- xrextras-hider-material`→`Zxrextras-hider-material\\`。

次に、VPSを無効にし、絶対スケールを有効にする必要があります。 これにより、正確なシミュレーションのために参照メッシュ
のサイズが正しく設定されます： これにより、正確なシミュレーションのために参照メッシュ
のサイズが正しく設定されます：

`xrweb="enableVps: false; scale: absolute;"`.

<a-entity named-location>` を一時的にシーンの中央に再配置する必要があります。
反復速度を支援します。 リファレンスメッシュの底辺を`y="0"`（地面）に合わせるようにします。
注：VPSプロジェクトをデプロイする前に、`<a-entity named-location>`を`position="0 0"\`
にリセットして、VPSコンテンツが正しく配置されていることを確認してください。 リファレンスメッシュの底辺を`y="0"`（地面）に合わせるようにします。
注：VPSプロジェクトをデプロイする前に、`<a-entity named-location>`を`position="0 0"\`
にリセットして、VPSコンテンツが正しく配置されていることを確認してください。

## 手続き的なVPS体験の開発

プロシージャルVPSシーンは、（特定のプロジェクト・ロケーションではなく）検出されたロケーションを使用するように設計されています。 一度検出されると、ロケーションのメッシュ
、プロシージャル生成されたVPS体験を生成することができます。 一度検出されると、ロケーションのメッシュ
、プロシージャル生成されたVPS体験を生成することができます。

8th Wallエンジンが発するプロシージャル関連のイベントは2つある：

- [xrmeshfound](https://www.8thwall.com/docs/web/#xrmeshfound): メッシュが最初に見つかったときに発行されます。
- [xrmeshlost](https://www.8thwall.com/docs/web/#xrmeshlost)：recenter()が呼び出されたときに発せられる。

メッシュが検出されると、8th Wallエンジンはrecenter()が呼ばれるまでそのメッシュを追跡し続ける。