---
sidebar_label: requestMicrophone()
---

# XR8.MediaRecorder.requestMicrophone()

XR8.MediaRecorder.requestMicrophone()\\`を実行します。

## 説明 {#description}

音声の録音を有効にし（自動的に有効になっていない場合）、必要に応じて許可を要求する。

ストリームが準備できたことをクライアントに知らせるプロミスを返します。  ストリームが準備できたことをクライアントに知らせるプロミスを返します。  オーディオストリームの準備が整う前に
録音を開始すると、
録音開始時にユーザーのマイク出力を見逃す可能性があります。

## パラメータ {#parameters}

なし

## {#returns}を返す。

約束。

## 例 {#example}

```javascript
XR8.MediaRecorder.requestMicrophone()
.then(() => {
  console.log('マイクが要求されました!')
})
.catch((err) => {
  console.log('エラーが発生しました： ', err)
})
```
