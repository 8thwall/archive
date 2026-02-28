---
id: qr-8code
sidebar_position: 5
---

# QR 8コード

利便性として、8th WallブランドのQRコード（別名「8コード」）をプロジェクト用に生成することができ、
、モバイルデバイスからスキャンしてWebARプロジェクトにアクセスすることが簡単になります。  
、ご自身でQRコードを生成することも、サードパーティのQRコード生成サイトやサービスを利用することも、いつでも大歓迎です。

プロジェクトダッシュボードのQRコードは、あなたのプロジェクトのユニークな "8th.io "ショートリンクを指しています。 この
ショートリンクは、ユーザーをWeb AR体験のURLにリダイレクトします。

<u>プロジェクトのQRコードと "8th.io "コードは静的なもので、プロジェクトの種類やライセンスによって変わることはありません。</u>

### 8th Wall Hosted Projects（接続ドメインなし） {#8th-wall-hosted-projects-no-connected-domain}

あなたのプロジェクトがデフォルトの8th WallホストURL（
"**workspace-name**.8thwall.app/**project-name**"の形式）を使用している場合、QRコードと8th.ioショートリンクは常に
デフォルトURLにリダイレクトされます。  送信先URLを変更することはできません。

![ProjectDashboard8wHostedQR](/images/console-appkey-qrcode-8w-hosted.png)

### 8th Wall Hosted Projects (WITH connected domain) {#8th-wall-hosted-projects-with-connected-domain}

Wallがホストする8番目のプロジェクトに[接続ドメイン](/account/projects/connected-domains/)を設定している場合、QRコード/ショートリンクの送信先をプロジェクトのデフォルトURL(
)、またはプライマリ接続ドメインのいずれかに設定するオプションがあります。

ラジオボタンでQRコード/ショートリンク先を設定します：

![ProjectDashboard8wHostedQRConnectedDomain](/images/console-appkey-qrcode-8w-hosted-connected-domain.png)

### セルフ・ホスティング・プロジェクト {#self-hosted-projects}

QRコードとショートリンクを生成するには、セルフホスト・プロジェクトの完全なURLを入力し、**保存**をクリックします：

![ProjectDashboardSelfHostedQR](/images/console-appkey-qrcode.png)

生成されたQRコードはPNGまたはSVG形式でダウンロードでき、ウェブサイトや
物理的なメディアなどに記載することで、ユーザーがスマートフォンでスキャンして、
自社のURLを簡単に訪問できるようになる。  鉛筆のアイコンをクリックすると、将来的にセルフホスト
URLが変更された場合にショートリンク先を編集することができます。

例

![ProjectDashboardSelfHostedQRResult](/images/console-appkey-qrcode-result.png)
