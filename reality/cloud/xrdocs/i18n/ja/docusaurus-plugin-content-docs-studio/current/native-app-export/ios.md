---
id: iOS
description: このセクションでは、iOSにエクスポートする方法を説明します。
---

# iOS

## iOSへのエクスポート

1. \*\*スタジオプロジェクトを開いてください。 プロジェクトが[要求基準](/studio/native-app-export/#requirements)を満たしていることを確認する。

2. Publish**をクリックしてください。 エクスポート**で、**iOS**を選択します。

3. \*\*アプリのビルドをカスタマイズする。
   - **表示名**：iOSのホーム画面に表示される名前
   - \*\*(オプション)**アプリのアイコンをアップロード** (1024x1024以上)

4. \*\*このステップでは、iOSアプリのビルドと実行に必要な署名認証情報を設定します。 署名タイプは、1 つまたは両方を選択する必要があります：また、それぞれに対応する証明書とプロビジョニング・プロファイルをアップロードする必要があります。 これらの手順はすべて、StudioのNative App Exportフローから離れることなく完了する必要があります。

   - **Bundle Identifier**：例: `com.mycompany.myapp` この文字列は、配布/テストのためにアプリをアップロードするために、Apple開発者アカウントの設定と一致する必要があります。

   - **契約形態**：

     i. **Apple Development** - 開発中に登録されたデバイスでアプリをビルドしてテストしたい場合は、このオプションを使用します。

     1. \*\*証明書署名要求（CSR）の生成 \*\*
        a. Studio で、_Add New Certificate_ をクリックし、次に _Create Certificate Signing Request._ をクリックします。

     2. **開発証明書の作成**
        a. Apple Developer Account](https://developer.apple.com/account/resources/certificates/add)にログインしてください。
        b. 証明書署名要求を使ってApple DevelopmentまたはiOS Development証明書を作成し、ダウンロードする。
        c. 参考[Apple: 開発証明書の作成](https://developer.apple.com/help/account/certificates/create-a-development-certificate)。

     3. **証明書をアップロードする**
        a. スタジオで、\*Upload Certificate.\*の下に開発証明書をアップロードします。

     4. **プロビジョニング・プロファイルの作成**
        a. Apple Developer Accountで、iOS App Developmentのプロビジョニングプロファイルを作成します。
        b. 正しい開発証明書とApp Identifierを関連付ける（最初に作成する必要があるかもしれません）。
        i. App IDを作成するには、[Apple: Create an App ID](https://developer.apple.com/account/resources/identifiers/add/bundleId)にアクセスし、App IDsを選択します。 次に_App_を選択する。 次に、その説明とバンドルIDを書く。
        - 異なるアプリ間で同じApp IDとプロビジョニングプロファイルを共有できるためです。 そのためには、**Description = Wildcard Development** と **Bundle ID = Explicit** を選択し、`com.mycompany.*`の値を指定します。
          c. 参考にしてください：[Apple: 開発プロビジョニングプロファイルの作成](https://developer.apple.com/help/account/provisioning-profiles/create-a-development-provisioning-profile)。

     5. **開発プロビジョニング・プロファイルのアップロード**
        a. スタジオで、_Upload Provisioning Profile._ にある開発プロビジョニング・プロファイルをアップロードします。

     ii. **Apple Distribution** - TestFlight、App Store、または企業向けディストリビューションでリリースするアプリを準備する場合は、このオプションを使用します。

     1. \*\*証明書署名要求（CSR）の生成 \*\*
        a. Studio で、_Add New Certificate_ をクリックし、次に _Create Certificate Signing Request._ をクリックします。

     2. **配信証明書の作成**
        a. Apple Developer Accountにログインします。
        b. 証明書署名要求を使ってApple Distribution証明書（またはiOS Distribution - App Store ConnectとAd Hoc）を作成し、ダウンロードします。
        c. 参考[Apple: 証明書の概要](https://developer.apple.com/help/account/certificates/certificates-overview)。

     3. **証明書をアップロードする**
        a. スタジオで、\*Upload Certificate.\*の下に配布証明書をアップロードします。

     4. **プロビジョニング・プロファイルの作成**
        a. Apple Developer Accountで、App Store（TestFlight/Appストアリリース用）またはAd Hoc（限定デバイス配布用）のプロビジョニングプロファイルを作成します。
        b. 正しい配布証明書とApp Identifierを関連付けます（最初に作成する必要があるかもしれません）。
        i. 開発用とは異なり、配布用にはワイルドカードバンドルIDではなく、このアプリ専用のApp IDを作成する必要があります。
        c. 参考にしてください：[Apple: ディストリビューション・プロビジョニング・プロファイルの作成](https://developer.apple.com/help/account/provisioning-profiles/create-an-app-store-provisioning-profile)。

     5. **ディストリビューション・プロビジョニング・プロファイルのアップロード**
        a. スタジオで、\*Upload Provisioning Profile.\*の下にディストリビューション・プロビジョニング・プロファイルをアップロードします。

   - 開発および/または配布に必要な証明書とプロビジョニング・プロファイルをアップロードしたら、**保存**をクリックして、Apple署名の設定を確認します。

5. **Configure Permissions (Optional):**
   アプリが適切に機能するために必要なセンサー許可を示し、オプションで許可プロンプトのカスタムテキストを設定します。 このステップは、アプリをアプリストアに登録するために必要です。

   - **カメラ**：アプリケーションがデバイスのカメラを使用するかどうかを選択します（フェイスエフェクトやワールドエフェクトなど）。
   - **位置情報**：アプリケーションがGPS位置情報を使用するかどうかを選択します。
   - **マイク**：アプリケーションがデバイスのマイクを使用するかどうかを選択します（メディアレコーダーや音声対話など）。

6. アプリの基本情報が入力され、Appleの設定が完了し、パーミッションが設定されたら、**Continue**をクリックしてビルド設定を確定します。

---

## ビルド設定の最終決定

次に、アプリをどのようにパッケージ化するかを定義する：

- **バージョン**：セマンティック・バージョニングを使用する（例：1.0.0） ([セマンティック・バージョニング](https://semver.org/))

- \*\*オリエンテーション
  - ポートレート：デバイスの向きを変えても、アプリは縦位置に固定されます。
  - Landscape Left: デバイスの左側を下にして、アプリを水平に表示します。
  - 右横向き：デバイスの右側を下にして、アプリを水平に表示します。
  - 自動回転：アプリがデバイスの物理的な回転に追従し、縦と横の表示を自動的に切り替えます。
  - 自動回転（横表示のみ）：デバイスの回転に基づいてアプリの位置を調整しますが、水平表示のみに制限されます。

- \*\*ステータスバー
  - Yes：デフォルトのシステムステータスバーをアプリケーションの上に表示します。
  - No：デフォルトのシステムステータスバーを非表示にします。

- \*\*ビルド・モード
  - スタティックバンドル：完全な自己完結型ビルド（注意：AR機能を使用するアプリは、Static Bundleであってもインターネット接続が必要です。）
  - ライブリロード：プロジェクトが更新されると、スタジオから更新を取得します。

- \*\*環境Dev、Latest、Staging、Productionから選択します。

- **契約形態**：
  - 開発：開発中にアプリをビルドしてテストする場合は、このオプションを選択します。 これにより、開発プロビジョニング・プロファイルと証明書を使用して、登録されたデバイス上でアプリを実行できるようになります。
  - 配布：TestFlight、App Store、または企業/社内配布など、アプリをリリースする準備をするときにこのオプションを選択します。 これは、ディストリビューションのプロビジョニング・プロファイルと証明書を使用して、アプリがエンドユーザーのデバイスにインストールされ、信頼されるようにします。

7. すべての設定が完了したら、**Build**をクリックしてアプリ・パッケージを生成します。

8. ビルドが完了したら、ビルドサマリーに記載されているダウンロードリンクを使用して `.ipa` ファイルをダウンロードします。

---

## App Storeへの公開

エクスポートが完了したら、IPA（iOS App Store Package）を使ってApp Storeにアプリを公開する準備が整いました。 アプリを他の人と共有したり、リリースする準備ができたら、AppleのApp Store ConnectとTestFlight（ベータテスト用）またはApp Store配信のいずれかを使用します。 ハイレベルなプロセスはこうだ：

1. \*\*App Store Connectの記録を作成します：App Store Connectにログインし（Apple Developerアカウントで）、Appエントリーを作成してください。 App Store Connectのダッシュボードで、_My Apps_に移動し、「+」をクリックして新しいアプリを追加します。 プラットフォームとしてiOSを選択し、アプリ名を入力し、正しいバンドルID（8th Wallプロジェクトで設定されたもの）を選択し、SKUと主要言語を指定し、アプリを_作成_します。

2. **Transporter**を使用して.ipaをアップロードします：.ipaがディストリビューション証明書とプロビジョニングプロファイル（App Storeディストリビューション）で署名されていることを確認します。 AppleはTestFlight/App Store配布用の開発署名付きビルドを受け付けていません。 Macでは、アップルのTransporterアプリが最も簡単なアップロード方法だ。 Mac App StoreからTransporterをインストールして開き、Apple ID（デベロッパーアカウント）でサインインします。 をクリックして.ipaファイルを追加し（または.ipaをTransporterにドラッグし）、_Deliver_をクリックしてアップロードします。 Transporterがファイルを検証し、App Store Connectに送信します。 (XcodeのArchive Organizerや`altool`コマンドを使用してビルドをアップロードすることもできます)。

3. **TestFlightテストを有効にします（必要な場合）**：ビルドがApp Store Connect（アプリのTestFlightタブの下）に表示されたら、テスターに配布できます。
   - 社内テスト：最大100名まで、すぐにビルドを割り当てます。
   - 外部テスト：最大10,000ユーザー、ベータアプリレビューが必要。

4. **App Storeへの登録**：App Storeにアプリを公開するには、App Store ConnectのアプリのApp Storeページにアクセスします。 スクリーンショット、説明文、カテゴリー、価格、プライバシーポリシーのURLなど、必要なメタデータをすべて入力してください。 アップロードしたビルドを添付し、_Submit for Review_をクリックします。 その後、アップルはアプリの全面的な審査を行う。

🔗 [Apple: App Store Connectにアプリをアップロード](https://developer.apple.com/help/app-store-connect/manage-builds/upload-builds/#:~:text=After%20adding%20an%20app%20to,testing%20%2C%20or%20%2075)

---

## iOSデバイスに直接インストールする

開発用に署名された`.ipa`（例えば8th Wallのもの）をテスト用にiPhoneやiPadにインストールするには、Appleのツールを使ってサイドロードする必要があります：

1. \*\*プロビジョニングを確認する：デバイスの UDID がアプリのプロビジョニング・プロファイルに含まれていることを確認します。 開発用またはアドホック用の `.ipa` は、そのプロファイルに登録されたデバイスにのみインストールされます。 そうでない場合は、プロビジョニングプロファイルにデバイスを追加し、Apple DevelopmentのComplete Apple Configurationページでプロビジョニングプロファイルを再アップロードし、デバイスを含むプロファイルで署名された`.ipa`アプリを再生成する必要があります。

2. **Install on device**:
   a. \*\*Xcodeを使用する：macOS上で、iOSデバイスをUSB経由で接続します（デバイス上でプロンプトが表示されたら "Trust "をタップします）。 Xcodeを起動し、左のデバイスリストからiPhone/iPadを選択します。 (そうでない場合、iOSはアプリの実行をブロックします)。 Xcode を使って `.ipa` をインストールする：.ipa\`ファイルをXcodeのDevicesウィンドウのデバイスパネルの "Installed Apps "セクションにドラッグ＆ドロップします。 Xcodeはアプリをデバイスにコピーし、それを検証する。 しばらくすると、アプリのアイコンがデバイスに表示されるはずです。

   b. **Apple Configurator 2**を使用します：.ipa`をインストールするために使用できます。 Configuratorを開き、デバイスを接続し、*Actions > Add > Apps > Choose from my Mac…*を選択し、`.ipa\`ファイルを選択します。 これは、同様の方法でアプリをデバイスにデプロイする。

   c. \*\*ミュージック（旧 iTunes）を使用する：Musicアプリを開き、デバイスを接続し、左サイドバーでデバイスを選択し、.ipaファイルをメインウィンドウにドラッグ＆ドロップします。 しばらくすると、アプリがあなたのデバイスに表示されるはずです。 最初のページにない場合は、アプリのホームページをスクロールしてください。

3. **開発者証明書を信頼する**：アプリが企業証明書または開発証明書で署名されている場合、実行する前にデバイス上で手動で信頼する必要がある場合があります。 iPhone/iPadで、_設定>一般>VPNとデバイス管理_（古いiOSでは_プロファイルとデバイス管理_）に進み、アプリの開発者のプロファイルを見つける。 Trust [Developer]\*をタップし、証明書を信頼することを確認します。 この手順は、App Store/TestFlightアプリの場合は必要ありませんが、直接インストールする場合は必要になる場合があります。

4. \*\*アプリを起動します：アプリを起動してください。 プロファイルと証明書が有効で、デバイスが開発者モード（iOS 16以上）であれば、アプリが起動するはずです。 完全性を確認できませんでした」というようなエラーが表示された場合、通常はデバイスがプロビジョニングされていないか、アプリが適切に署名されていないか、デベロッパーモードがオフになっていることを意味します。 適切にインストールされ、信頼されれば、開発ビルドは物理的なデバイス上で実行される。
