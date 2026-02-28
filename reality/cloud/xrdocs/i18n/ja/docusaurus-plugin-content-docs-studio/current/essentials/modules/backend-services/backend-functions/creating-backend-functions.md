---
id: creating-backend-functions
sidebar_position: 1
---

# バックエンド関数の作成

:::info
バックエンドファンクションは、8th Wallのモジュールシステムのコンテキスト内で実行されます。 モジュールの完全なドキュメント
については、[こちら](https://www.8thwall.com/docs/guides/modules/overview/) を参照してください。  
ドキュメントのこのセクションでは、特にモジュール
システムによって提供されるバックエンド機能の機能に焦点を当てます。
:::

モジュールは、ワークスペース・ページ（Modules タブ）から作成するか、スタジオ・プロジェクト内で直接作成できます。
バックエンド関数を持つモジュールをスタジオで直接作成するには、以下の手順に従います：

1. スタジオエディターで、左側のパネルにあるModuleseタブを選択し、"+ New Module "をクリックします。

![CreateNewModule](/images/studio/bfn-new-module.png)

2. Create New Module "タブを選択し、新しいモジュールにモジュールIDを与えます。  この値は、
   、後にプロジェクトコードでモジュールを参照する際に使用されます。  作成後に変更することはできない。

![ModuleId](/images/studio/bfn-module-id.png)

3. モジュールにバックエンドを追加します：ファイルエクスプローラー -> モジュールタブを選択 -> バックエンドを右クリック ->
   新規バックエンド設定を選択。

![NewBackendFunction](/images/studio/bfn-new-backend-config.png)

4. New Backend ウィザードで、必要なバックエンドのタイプ (ここでは Function) を選択し、
   Title (タイトル) と Description (説明) を指定します。 バックエンドのファイル名は Title
   に基づいて自動的に生成され、モジュールコード内でバックエンドを参照する方法となります。

![NewBackend](/images/studio/bfn-new-backend.png)

5. バックエンドのコードにEntry Pathを設定します。  これは、バックエンド・コードのエントリー・ポイント
   を置くファイルです。

![BackendFunctionEntryPath](/images/studio/bfn-entry-path.png)

6. 上記の「エントリー・パス」のステップで定義したものと同じパス／名前のファイルを作成する。  Filesを右クリック -> New File -> Empty File：

![BackendFunctionEmptyFile](/images/studio/bfn-create-empty-file.png)

エントリーパスに一致する名前を入力するか、ペーストしてください：

![BackendFunctionEmptyFileName](/images/studio/bfn-create-empty-file-name.png)

結果

![BackendFunctionEmptyFileNameResult](/images/studio/bfn-create-empty-file-result.png)

:::info
バックエンド関数は `handler` という **async メソッド** をエクスポートしなければならない。  詳しくは[Writing Backend Code](/studio/essentials/modules/backend-services/backend-functions/writing-backend-code/)のドキュメントを参照してください。
:::

例

```javascript
const handler = async (event: any) => {
  // Custom backend code goes here

  return {
    body：JSON.stringify({
      myResponse,
    }),
  }.
}

export {
  handler,
}.
```
