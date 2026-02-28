---
id: project-settings
---

# プロジェクト設定

プロジェクト設定ページでは、以下のことができます：

- キーバインドやダークモードなどの開発者設定を行う
- プロジェクト情報を編集する：
  - タイトル
  - 説明
  - デフォルトのスプラッシュ画面を有効/無効にする
  - カバー画像を更新
- ステージング・パスコードの管理
- プロジェクトのApp Key文字列にアクセスする
- エンジンバージョンの設定
- アプリのアンパブリッシュ
- プロジェクトを一時的に無効にする
- プロジェクトの削除

## コードエディター環境設定 {#code-editor-preferences}

コード・エディタの環境設定は、次のように設定できます：

- ダークモード（オン/オフ）
  - コードエディターでは、背景色を濃く、前景色を薄くしたカラーパレットを使用します。
- キーバインド
  - 一般的なテキストエディタのキーバインドを有効にします。  から選択する：  から選択する：
    - ノーマル
    - 崇高
    - ヴィム
    - イーマックス
    - VSCode

## 基本情報 {#basic-information}

プロジェクト設定では、プロジェクトの基本情報を編集できます。

- プロジェクト名
- 説明
- [デフォルトのスプラッシュ画面を有効または無効にする](/legacy/guides/projects/project-settings/#default-splash-screen)
- カバー画像を更新

## デフォルトのスプラッシュ画面 {#default-splash-screen}

デフォルトのスプラッシュ画面は、
8th Wall Cloud Editorを使用して作成された各Web AR体験の最初に表示されます。 カスタマイズはできませんが、有料の `Pro` または `Enterprise` プランをご利用の場合、
`Commercial` プロジェクトでは無効にすることができます。 カスタマイズはできませんが、有料の `Pro` または `Enterprise` プランをご利用の場合、
`Commercial` プロジェクトでは無効にすることができます。

![DefaultSplashScreen](/images/default-splash-screen.jpg)

デフォルトのスプラッシュ画面を有効または無効にするには：

1. プロジェクト設定\\`ページに行く。
2. 基本情報」セクションを展開する。
3. デフォルトのスプラッシュ画面のオン/オフの切り替え

![DefaultSplashScreenToggle](/images/basic-information-splash-screen.jpg)

**Note:** すべてのプロジェクトは、ローディングページに[Powered by 8th Wall](https://drive.google.com/drive/folders/1c9d23c5hS_HspHTUD7VceV6ocqdbPN7J?usp=sharing)
バッジを表示しなければなりません。 これはデフォルトで`ロード・モジュール`に含まれており、削除することはできない。
[ロード画面のカスタマイズについてはこちら](/legacy/guides/advanced-topics/load-screen/)。 これはデフォルトで`ロード・モジュール`に含まれており、削除することはできない。
[ロード画面のカスタマイズについてはこちら](/legacy/guides/advanced-topics/load-screen/)。

## ステージング・パスコード {#staging-passcode}

アプリがXXXXX.staging.8thwall.app（XXXXはワークスペースのURLを表す）にステージングされると、
、パスコードで保護されます。  WebAR Project を閲覧するためには、まず
で指定されたパスコードを入力する必要があります。  これは、
公開する前に、顧客や他の利害関係者とプロジェクトをプレビューするのに最適な方法である。  WebAR Project を閲覧するためには、まず
で指定されたパスコードを入力する必要があります。  これは、
公開する前に、顧客や他の利害関係者とプロジェクトをプレビューするのに最適な方法である。

パスコードは5文字以上で、アルファベット（A-Z、小文字、大文字）、
数字（0-9）、スペースを含むことができます。

## アプリキー {#app-key}

:::info
App Keysとセルフホスティングは、[カスタムプラン](https://8thwall.com/custom)でのみご利用いただけます。
:::

セルフホスト型プロジェクトでは、コードにApp Keyを追加する必要があります。

プロジェクトのアプリ・キーにアクセスするには

1. [レガシー・エディター・プロジェクトを作成](/legacy/guides/projects/create-legacy-editor-project/)し、プロジェクトのタイプとして**App Key**を選択します。

2. 左のナビゲーションで、プロジェクト設定を選択します：

![LeftNavProjectSettings](/images/left-nav-project-settings.jpg)

3. ページの**Self-Hosting**セクションまでスクロールダウンし、**My App Key**ウィジェットを展開します：

![ProjectSettingsMyAppKey](/images/project-settings-app-key.jpg)

4. Copy\*\*ボタンをクリックし、App Key文字列を自サイトのコードの`<head>`内の`<script>`タグに貼り付けます。

#### 例 - アプリキー {#example---app-key}

```html
<!-- Replace the X's with your App Key -->
<script async src="//apps.8thwall.com/xrweb?appKey=XXXXX"></script>
```

## エンジン・バージョン {#engine-version}

公開ウェブクライアントを提供する際に使用する8thウォールエンジンのバージョンを指定することができます(`Release`
または `Beta`)。

公開されたエクスペリエンスを閲覧しているユーザーには、常にそのチャンネルから最新バージョンの8th Wall
Engineが提供されます。

一般的に、8th Wallは本番ウェブアプリケーションには公式の**リリース**チャンネルを使用することを推奨している。

もし、あなたのウェブアプリを8th Wall's Engineのプレリリースバージョンでテストしたい場合、
、まだ完全なQAを通過していない新機能やバグフィックスが含まれているかもしれませんので、
ベータチャンネルに切り替えることができます。 商業的な体験はベータ・チャンネルで開始されるべきではない。 商業的な体験はベータ・チャンネルで開始されるべきではない。

#### フリーズ・エンジン・バージョン {#freezing-engine-version}

:::note
エンジン・バージョンのフリーズは、有効なライセンスを持つ**商用**プロジェクトでのみ利用可能です。
:::

現在のエンジンバージョンを**フリーズ**するには、希望のチャンネル（リリースまたはベータ）を選択し、**フリーズ**ボタンをクリックします。

![EngineFreeze](/images/engine-freeze.png)

チャンネルに**再加入**して最新状態を維持するには、**凍結解除**ボタンをクリックしてください。  チャンネルに**再加入**して最新状態を維持するには、**凍結解除**ボタンをクリックしてください。  これは **un\*freeze**
あなたのプロジェクトに関連付けられているエンジンのバージョンと、
そのチャンネルで利用可能な最新バージョンを使用するためにチャンネル（リリースまたはベータ）に再参加します。

![EngineUnfreeze](/images/engine-unfreeze.png)

## アプリの公開解除 {#unpublish-app}

プロジェクトをアンパブリッシュすると、ステージング(XXXXX.staging.8thwall.app)またはパブリック(XXXXX.8thwall.app)から削除されます。

コードエディターまたはプロジェクト履歴ページから、いつでも再公開することができます。

Unpublish Staging\*\*をクリックし、XXXXX.staging.8thwall.appからプロジェクトを削除します。

Unpublish Public\*\*をクリックし、XXXXX.8thwall.appからプロジェクトを削除します。

## プロジェクトを一時的に無効にする {#temporarily-disable-project}

プロジェクトを無効にすると、アプリは表示できなくなります。 無効になっている間は再生回数はカウントされません。 無効になっている間は再生回数はカウントされません。

一時的に無効になっているプロジェクトの有効な商用ライセンスは、引き続き課金されます。

スライダーを切り替えて、プロジェクトを無効/有効にします。

## プロジェクトの削除 {#delete-project}

商用ライセンスのプロジェクトは削除できません。
[アカウントページ](/legacy/guides/account-settings#manage-commercial-licenses)にアクセスして、アクティブな
商業プロジェクトをキャンセルする。
[アカウントページ](/legacy/guides/account-settings#manage-commercial-licenses)にアクセスして、アクティブな
商業プロジェクトをキャンセルする。

プロジェクトを削除すると機能しなくなります。 この操作を元に戻すことはできない。 この操作を元に戻すことはできない。
