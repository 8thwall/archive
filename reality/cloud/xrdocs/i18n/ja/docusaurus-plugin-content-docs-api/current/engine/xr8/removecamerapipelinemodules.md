---
sidebar_label: removeCameraPipelineModules()
---

# XR8.removeCameraPipelineModules()

`XR8.removeCameraPipelineModules([ moduleNames ])`

## 説明 {#description}

複数のカメラパイプラインモジュールを削除する。 これは
[`XR8.removeCameraPipelineModule()`](removecamerapipelinemodule.md) を入力
配列の各要素に対して順番に呼び出す便利なメソッドです。

## パラメータ {#parameters}

| パラメータ       | タイプ                     | 説明                                     |
| ----------- | ----------------------- | -------------------------------------- |
| moduleNames | `[String]`または`[Object]` | name プロパティを持つオブジェクトの配列、またはモジュールの名前文字列。 |

## を返す {#returns}

なし

## 例 {#example}

```javascript
XR8.removeCameraPipelineModules(['threejsrenderer', 'reality'])
```
