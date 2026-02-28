---
id: project-settings
sidebar_position: 8
---

# プロジェクト設定

プロジェクト設定ページでは、以下のことができます：

- キーバインドやダークモードなどの開発者設定を行う
- プロジェクト情報を編集する：
  - タイトル
  - 説明
  - カバー画像を更新
- ステージング・パスコードの管理
- プロジェクトのApp Key文字列にアクセスする（**セルフホストのみ**）。
- フリーズエンジン版（**アクティブ・ホワイトレーベル・サブスクリプションのみ**)
- アプリのアンパブリッシュ
- プロジェクトを一時的に無効にする
- プロジェクトの削除

## コードエディター環境設定 {#code-editor-preferences}

コード・エディタの環境設定は、次のように設定できます：

- ダークモード（オン/オフ）
  - コードエディターでは、背景色を濃く、前景色を薄くしたカラーパレットを使用します。
- キーバインド
  - 一般的なテキストエディタのキーバインドを有効にします。  から選択する：
    - ノーマル
    - 崇高
    - ヴィム
    - イーマックス
    - VSCode

## 基本情報 {#basic-information}

プロジェクト設定では、プロジェクトの基本情報を編集できます。

- プロジェクト名
- 説明
- カバー画像を更新

<!-- ## Default Splash Screen {#default-splash-screen}

The Default Splash Screen is displayed at the beginning of each Web AR experience created using the
8th Wall Cloud Editor. It cannot be customized, however, it can be disabled by purchasing a white label subscription.

![DefaultSplashScreen](/images/default-splash-screen.jpg)

To Enable or Disable the Default Splash Screen:
1. Go to the `Project Settings` page.
2. Expand the `Basic Information` section.
3. Toggle `Default Splash Screen` (On/Off)

![DefaultSplashScreenToggle](/images/basic-information-splash-screen.jpg) -->

## ステージング・パスコード {#staging-passcode}

アプリがXXXXX.staging.8thwall.app（XXXXはワークスペースのURLを表す）にステージングされると、
、パスコードで保護されます。  WebAR Project を閲覧するためには、まず
で指定されたパスコードを入力する必要があります。  これは、
公開する前に、顧客や他の利害関係者とプロジェクトをプレビューするのに最適な方法である。

パスコードは5文字以上で、アルファベット（A-Z、小文字、大文字）、
数字（0-9）、スペースを含むことができます。

## エンジン・バージョン {#engine-version}

公開ウェブクライアントを提供する際に使用する8thウォールエンジンのバージョンを指定することができます(`Release`
または `Beta`)。

公開されたエクスペリエンスを閲覧しているユーザーには、常にそのチャンネルから最新バージョンの8th Wall
Engineが提供されます。

一般的に、8th Wallは本番ウェブアプリケーションには公式の**リリース**チャンネルを使用することを推奨している。

もし、あなたのウェブアプリを8th Wall's Engineのプレリリースバージョンでテストしたい場合、
、まだ完全なQAを通過していない新機能やバグフィックスが含まれているかもしれませんので、
ベータチャンネルに切り替えることができます。 商業的な体験はベータ・チャンネルで開始されるべきではない。

### フリーズ・エンジン・バージョン {#freezing-engine-version}

:::info
エンジンのバージョン凍結は、有効なホワイトラベル サブスクリプションを持つプロジェクトのみが利用できます。
:::

現在のエンジンバージョンを**フリーズ**するには、希望のチャンネル（リリースまたはベータ）を選択し、**フリーズ**ボタンをクリックします。

![EngineFreeze](/images/engine-freeze.png)

チャンネルに**再加入**して最新状態を維持するには、**凍結解除**ボタンをクリックしてください。  これは **unfreeze**
あなたのプロジェクトに関連付けられているエンジンのバージョンと、
そのチャンネルで利用可能な最新バージョンを使用するためにチャンネル（リリースまたはベータ）に再参加します。

![EngineUnfreeze](/images/engine-unfreeze.png)

## アプリの公開解除 {#unpublish-app}

プロジェクトをアンパブリッシュすると、ステージング(XXXXX.staging.8thwall.app)またはパブリック(XXXXX.8thwall.app)から削除されます。

コードエディターまたはプロジェクト履歴ページから、いつでも再公開することができます。

Unpublish Staging\*\*をクリックし、XXXXX.staging.8thwall.appからプロジェクトを削除します。

Unpublish Public\*\*をクリックし、XXXXX.8thwall.appからプロジェクトを削除します。

## プロジェクトを一時的に無効にする {#temporarily-disable-project}

プロジェクトを無効にすると、アプリは表示できなくなります。 無効になっている間は再生回数はカウントされません。

一時的に無効になっているプロジェクトの有効な商用ライセンスは、引き続き課金されます。

スライダーを切り替えて、プロジェクトを無効/有効にします。

## プロジェクトの削除 {#delete-project}

ホワイトラベルのサブスクリプションを持つプロジェクトは削除できません。 アクティブなホワイトレーベルのサブスクリプションをキャンセルするには、
アカウントページにアクセスしてください。

プロジェクトを削除すると機能しなくなります。 この操作を元に戻すことはできない。
