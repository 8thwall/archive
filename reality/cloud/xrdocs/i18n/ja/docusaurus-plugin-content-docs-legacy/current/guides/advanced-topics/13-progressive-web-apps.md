---
id: progressive-web-apps
---

# プログレッシブ・ウェブ・アプリケーション

プログレッシブ・ウェブ・アプリケーション（PWA）は、最新のウェブ機能を使って、ネイティブ・アプリケーションと同様の体験（
）をユーザーに提供する。 プログレッシブ・ウェブ・アプリケーション（PWA）は、最新のウェブ機能を使って、ネイティブ・アプリケーションと同様の体験（
）をユーザーに提供する。 8th Wall Cloud Editorでは、
プロジェクトのPWAバージョンを作成し、ユーザーがホーム画面に追加できるようにすることができます。 アクセスするには、**インターネット**
に接続している必要があります。 アクセスするには、**インターネット**
に接続している必要があります。

WebARプロジェクトでPWAサポートを有効にするには：

1. プロジェクト設定ページにアクセスし、「Progressive Web App」ペインを展開する。 (有料ワークスペースのみ表示） (有料ワークスペースのみ表示）
2. スライダーを「PWAサポートを有効にする」に切り替えます。
3. PWAの名前、アイコン、色をカスタマイズできます。
4. 保存」をクリックする

![project-settings-pwa](/images/project-settings-pwa.jpg)

**注**\*：クラウド エディタ プロジェクトの場合、
が以前に公開されていると、プロジェクトのビルドと再公開を促されることがあります。 再パブリッシュしないことを決定した場合、PWAサポートは次回
、プロジェクトがビルドされるときに含まれます。 **注**\*：クラウド エディタ プロジェクトの場合、
が以前に公開されていると、プロジェクトのビルドと再公開を促されることがあります。 再パブリッシュしないことを決定した場合、PWAサポートは次回
、プロジェクトがビルドされるときに含まれます。 再パブリッシュしないことを決定した場合、PWAサポートは次回
、プロジェクトがビルドされるときに含まれます。

## PWA APIリファレンス {#pwa-api-reference}

8th Wallの**XRExtras**ライブラリは、ウェブアプリにインストールプロンプトを自動的に表示するAPIを提供します。

<https://github.com/8thwall/web/tree/master/xrextras/src/pwainstallermodule> にある `PwaInstaller` API リファレンスを参照してください。

## PWA アイコンの要件 {#pwa-icon-requirements}

- ファイルの種類\*\*.png\*\*
- アスペクト比**1:1**
- 寸法：
  - 最小：\*\*512×512ピクセル
    - 注：512x512より大きな画像をアップロードした場合、縦横比1:1にトリミングされ、512x512にリサイズされます。

## PWAインストールプロンプトのカスタマイズ {#pwa-install-prompt-customization}

XRExtrasの[PwaInstaller](https://github.com/8thwall/web/tree/master/xrextras/src/pwainstallermodule)
モジュールは、ユーザーにウェブアプリをホーム
画面に追加するよう求めるインストールプロンプトを表示します。

インストールプロンプトの外観をカスタマイズするには、
[XRExtras.PwaInstaller.configure()](https://github.com/8thwall/web/tree/master/xrextras/src/pwainstallermodule#configure) API でカスタム文字列値を指定します。

完全にカスタムなインストールプロンプトを表示するには、
[displayInstallPrompt](https://github.com/8thwall/web/tree/master/xrextras/src/pwainstallermodule#displayinstallprompt)
と
[hideInstallPrompt](https://github.com/8thwall/web/tree/master/xrextras/src/pwainstallermodule#hideinstallprompt) でインストーラを設定します。

## セルフホスト型PWA利用 {#self-hosted-pwa-usage}

セルフホスト型アプリの場合、HTMLにPWAの詳細を自動的に注入することはできません。
、インストール
のプロンプトに表示させたい名前とアイコンを指定し、configure APIを使用する必要があります。

以下の`<meta>`タグをhtmlの`<head>`に追加する：

`<meta name="8thwall:pwa_name" content="My PWA Name">`

`<meta name="8thwall:pwa_icon" content="//cdn.mydomain.com/my_icon.png">`

## PWAコード例 {#pwa-code-examples}

#### 基本例（AFrame） {#basic-example-aframe}

```html
<aシーン
  xrextras-almost-there
  xrextras-loading
  xrextras-runtime-error
  xrextras-pwa-installer
  xrweb>
```

#### 基本例（ノンアフレーム） {#basic-example-non-aframe}

```javascript
XR8.addCameraPipelineModules([
  XR8.GlTextureRenderer.pipelineModule(),
  XR8.Threejs.pipelineModule(),
  XR8.XrController.pipelineModule(),
  XRExtras.AlmostThere.pipelineModule(),
  XRExtras.FullWindowCanvas.pipelineModule(),
  XRExtras.Loading.pipelineModule(),
  XRExtras.RuntimeError.pipelineModule(),

  XRExtras.PwaInstaller.pipelineModule(), // ここに追加

  // カスタムパイプラインモジュール
  myCustomPipelineModule(),
])

```

#### カスタマイズルックの例（AFrame） {#customized-look-example-aframe}

```html
<a-scene
  xrextras-gesture-detector
  xrextras-almost-there
  xrextras-loading
  xrextras-runtime-error
  xrextras-pwa-installer="name: My Cool PWA;
    iconSrc: '//cdn.8thwall.com/my_custom_icon';
    installTitle: 'My CustomTitle';
    installSubtitle: 'My Custom Subtitle';
    installButtonText：'Custom Install';
    iosInstallText：'Custom iOS Install'"
  xrweb>
```

#### カスタマイズルック例（ノンアフレーム） {#customized-look-example-non-aframe}

```javascript
XRExtras.PwaInstaller.configure({
  displayConfig：{
    name: 'マイカスタムPWA名',
    iconSrc: '//cdn.8thwall.com/my_custom_icon',
    installTitle: ' マイカスタムタイトル',
    installSubtitle: 'マイカスタムサブタイトル',
    installButtonText：'Custom Install',
    iosInstallText：'Custom iOS Install',
  }.
})
```

#### カスタマイズ表示時間の例（AFrame） {#customized-display-time-example-aframe}

```html
<a-scene
  xrweb="disableWorldTracking: true"
  xrextras-gesture-detector
  xrextras-almost-there
  xrextras-loading
  xrextras-runtime-error
  xrextras-pwa-installer="minNumVisits：5;
    displayAfterDismissalMillis: 86400000;"
>
```

#### カスタマイズ表示時間の例（非フレーム） {#customized-display-time-example-non-aframe}

```javascript
XRExtras.PwaInstaller.configure({
  promptConfig：{
    minNumVisits：5, // ユーザーはプロンプトが表示されるまでにウェブアプリに5回アクセスする必要があります
    displayAfterDismissalMillis: 86400000 // 1日
  }.
})
```
