---
id: requirements
---

# 必要条件

**すべてのプロジェクト**は、ローディングページに[Powered by 8th Wall](https://drive.google.com/drive/folders/1c9d23c5hS_HspHTUD7VceV6ocqdbPN7J?usp=sharing)
バッジを表示しなければなりません。 これはデフォルトで`ロード・モジュール`に含まれており、削除することはできない。
ロード画面のカスタマイズ方法については、[こちら](/legacy/guides/advanced-topics/load-screen/)を参照してください。

## ウェブブラウザの要件 {#web-browser-requirements}

モバイルブラウザは、8th Wallウェブ体験をサポートするために以下の機能を必要とします：

- **WebGL** (canvas.getContext('webgl') || canvas.getContext('webgl2'))
- **getUserMedia** (navigator.mediaDevices.getUserMedia)
- **deviceorientation**（window.DeviceOrientationEvent-SLAMが有効な場合にのみ必要です。）
- **Web-Assembly/WASM**（window.WebAssembly）。

**注**：第8回ウォールウェブ体験は、**https**経由で閲覧する必要があります。 これはブラウザーがカメラにアクセスするために**必要**なものです。 これはブラウザーがカメラにアクセスするために**必要**なものです。

これは、iOSとAndroidデバイスの互換性を次のように換算している：

- iOS：
  - **Safari**（iOS11以上）
  - **SFSafariViewController**ウェブビューを使用する**アプリ**（iOS 13以上）
    - AppleはiOS 13でSFSafariViewControllerにgetUserMedia()のサポートを追加した。  AppleはiOS 13でSFSafariViewControllerにgetUserMedia()のサポートを追加した。  8th Wallは、SFSafariViewControllerウェブビューを使用するiOS 13アプリ内で動作します。  AppleはiOS 13でSFSafariViewControllerにgetUserMedia()のサポートを追加した。  8th Wallは、SFSafariViewControllerウェブビューを使用するiOS 13アプリ内で動作します。
    - 例Twitter、Slack、Discord、Gmail、ハングアウトなど。
  - **WKWebView** Webビューを使用する**アプリ/ブラウザ** (iOS 14.3+)
    - 例を挙げよう：
      - クローム
      - ファイアフォックス
      - マイクロソフト・エッジ
      - フェイスブック
      - フェイスブックメッセンジャー
      - インスタグラム
      - その他...
- アンドロイドだ：
  - **ブラウザ**は、WebARに必要な機能をネイティブにサポートしていることが知られています：
    - \*\*クローム
    - \*\*ファイアフォックス
    - \*\*サムスン・インターネット
    - \*\*マイクロソフト・エッジ
  - WebAR に必要な機能をサポートしていることが知られている Web View を使用している **アプリ**：
    - Twitter、WhatsApp、Slack、Gmail、ハングアウト、Reddit、LinkedInなど。

#### リンクアウト対応 {#link-out-support}

XRExtrasライブラリは、WebARに必要な機能をネイティブにサポートしていないアプリに対して、ユーザーを適切な場所に誘導するフローを提供し、これらのアプリからWebARプロジェクトへのアクセシビリティを最大化します。

例TikTok、Facebook（Android）、Facebook Messenger（Android）、Instagram（Android）

スクリーンショット

| メニューからブラウザを起動する（iOS）                         | ボタンからブラウザを起動する（アンドロイド）                             | リンクをクリップボードにコピーする                                        |
| -------------------------------------------- | -------------------------------------------------- | -------------------------------------------------------- |
| ![iOS](/images/launch-browser-from-menu.jpg) | ![Android](/images/launch-browser-from-button.jpg) | ![copy to clipboard](/images/copy-link-to-clipboard.jpg) |

## 対応フレームワーク {#supported-frameworks}

8th Wall Webは、次のような3D JavaScriptフレームワークに簡単に統合できる：

- Aフレーム (<https://aframe.io/>)
- three.js (<https://threejs.org/>)
- バビロン.js (<https://www.babylonjs.com/>)
- プレイキャンバス (<https://www.playcanvas.com>)


