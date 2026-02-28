---
id: writing-backend-code
sidebar_position: 2
---

# バックエンドのコードを書く

## 概要

バックエンド関数のコードは、8th Wallアカウントに関連付けられたサーバーレス環境で実行されます。すべてのバックエンド関数は `handler` と呼ばれるトップレベルの **async メソッド** をエクスポートしなければならない。

エントリーファイルのコード例：

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

## クライアント・メソッド

バックエンド関数を作成すると、自動的にクライアントメソッドが作成されます。 このクライアント
メソッドは `fetch` のラッパーです。つまり、
通常の `fetch` 呼び出しと同じ引数をこの関数に渡すことができます。 詳細は[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch)
を参照。

このクライアントメソッドは、モジュールクライアントコードからバックエンド関数にリクエストを送る方法です。

![FetchWrapper](/images/studio/bfn-fetch-wrapper.png)

## ファンクション・イベント・パラメーター

ハンドラメソッドは、クライアントメソッドが呼ばれるたびに `event` オブジェクトとともに呼び出される。 event\`
は以下のプロパティを持つ：

| プロパティ                 | タイプ                                             | 説明                                                                                                   |
| --------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| パス                    | ストリング                                           | クライアントメソッドに渡される URL パス (`'/getUser/foo'` 、 `'/checkAnswer'` など)。                  |
| ボディ                   | ストリング                                           | JSON.parse(event.body)\\`を呼び出して、ボディをオブジェクトに変換する。 |
| httpMethod            | ストリング                                           | バックエンド関数の呼び出しに使われる HTTP メソッド。 GET'`、`PUT'`、`POST'`、`PATCH'`、`DELETE'\` のいずれか。                        |
| queryStringParameters | Record<string, string> | リクエストのクエリ文字列パラメータを表すキーと値のペア。                                                                         |
| ヘッダー                  | Record<string, string> | リクエストヘッダを含むキーと値のペア。                                                                                  |

## リターンオブジェクト

すべてのプロパティはオプションです。

| プロパティ    | タイプ                                             | 説明                                           |
| -------- | ----------------------------------------------- | -------------------------------------------- |
| ステータスコード | 番号                                              | レスポンスのステータスコード。 デフォルトは`200`である。              |
| ヘッダー     | Record<string, string> | レスポンスに関連するヘッダー。                              |
| ボディ      | ストリング                                           | レスポンスに関連付けられた `JSON.stringify()` のボディオブジェクト。 |

## エラー処理

バックエンド関数が捕捉できない例外をスローした場合、関数は `statusCode：500`
を返し、レスポンスボディにエラーオブジェクトが格納されます。

モジュールを**所有**していて、**開発モード** の場合、エラーオブジェクトには `name`,
`message` と `stack` が含まれる：

`{error: {name: string, message: string, stack: string}}`

例

```
{
  "error"：{
    "name"："TypeError",
    "message"："Cannot read properties of undefined (reading 'foo')",
    "stack"："TypeError：Cannot read properties of undefined (reading 'foo')\n at call (webpack:///src/index.ts:8:24)\n ...
  }
}
```

非開発モード\*\*の場合、エラーオブジェクトは `name` や `stack` プロパティを含まず、
`message` は一般的な "Internal Server Error" となる。

## ターゲットの固定

モジュールピンニングターゲットの詳細については、https://www.8thwall.com/docs/guides/modules/pinning-targets/ を参照してください。

バージョン`にピン留めする場合、**許可される更新**は `None\\` に設定する必要があります。

![BFNVersionPinning](/images/studio/bfn-version-pinning.png)

コミット`にピン留めする場合は、特定のコミットを選択する。  `Latest\`はサポートされていません。

![BFNCommitPinning](/images/studio/bfn-commit-pinning.png)
