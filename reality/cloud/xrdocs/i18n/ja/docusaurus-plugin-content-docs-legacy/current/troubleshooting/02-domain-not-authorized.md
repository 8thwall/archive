---
id: domain-not-authorized
---

# ドメイン未承認

#### 問題 {#issue}

セルフホスティングのWeb ARエクスペリエンスを表示しようとすると、"Domain Not Authorized "というエラーメッセージが表示されます。

#### ソリューション {#solutions}

1. ウェブサーバーのドメインをホワイトリストに登録してください。
   例えば、`mydomain.com`は`www.mydomain.com`と同じではありません。
   を `mydomain.com` と `www.mydomain.com` の両方でホスティングする場合は、**BOTH** を指定する必要があります。 詳しくは、
   ドキュメントの
   [Connected Domains](/legacy/guides/projects/connected-domains) (Self Hosted Projectsを参照) セクションを参照してください。

2. Domain='' (空)の場合は、Webサーバーの `RefererPolicy` 設定を確認してください。

![domain-not-authorized](/images/domain-not-authorized.jpg)

上のスクリーンショットでは、`Domain=`の値は空である。 このドメインは、
セルフホスト WebAR エクスペリエンスのドメインに設定する必要があります。 このような場合、ウェブサーバーの `参照元ポリシー` が
に制限されすぎています。 Referer\` httpヘッダーは、アプリのキーが
承認/ホワイトリストされたサーバーから使用されていることを確認するために使用される。

設定を確認するには、Chrome/Safariデバッガーを開き、ネットワークタブを見る。  設定を確認するには、Chrome/Safariデバッガーを開き、ネットワークタブを見る。  xrweb`リクエストヘッダには`Referer\\` 値を含める必要があり、これはプロジェクト設定で
ホワイトリストに登録したドメインと一致する必要があります。

\*\*このスクリーンショットでは、Referrer Policyが "same-origin "に設定されています。
つまり、リファラーは同じサイトのオリジンに対してのみ送信されますが、クロスオリジン
リクエストはリファラー情報を送信しません：

![referer-missing](/images/referer-missing.jpg)

**正しい** - `xrweb` リクエストヘッダは `Referer` 値を含んでいます。

![referer-ok](/images/referer-ok.jpg)

デフォルト値の "strict-origin-when-cross-origin "を推奨する。 デフォルト値の "strict-origin-when-cross-origin "を推奨する。 設定オプションについては、
<https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy>を参照のこと。
