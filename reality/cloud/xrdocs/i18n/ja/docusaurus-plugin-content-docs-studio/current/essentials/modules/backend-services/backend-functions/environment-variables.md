---
id: environment-variables
sidebar_position: 3
---

# 環境変数

環境変数によって、モジュールに関連する機密情報を安全に保つことができる。
たとえば、
認証情報をコードに直接公開することなく、保存したり渡したりすることができます。

## 環境変数の作成

1. モジュール内のバックエンド機能を選択します。
2. 新規環境変数」をクリックする。

![NewEnvironmentVariable](/images/studio/bfn-new-environment-variable.png)

3. キー（変数名）の定義

![NewEnvironmentVariable](/images/studio/bfn-environment-variable-key.png)

4. ラベルの定義 - これは、バックエンド関数を含む
   モジュールを使用するプロジェクトに表示されるキーの表示名です。

![NewEnvironmentVariable](/images/studio/bfn-environment-variable-label.png)

## コードで環境変数にアクセスする

環境変数は、コード内で`process.env.<KEY>`

### 例

```ts
const API_KEY = process.env.api_key
```
