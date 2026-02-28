---
sidebar_label: projectWayspots()
---

# XR8.Vps.projectWayspots()

XR8.Vps.projectWayspots()\\`を実行する。

## 説明 {#description}

各プロジェクト拠点に関するデータを照会します。

## パラメータ {#parameters}

なし

## {#returns}を返す。

各プロジェクトロケーションに関するデータを含む `ClientWayspotInfo` の配列を持つプロミス。

id、name、imageUrl、title、lat、lng }]\\`。

| プロパティ                                  | タイプ | 説明                 |
| -------------------------------------- | --- | ------------------ |
| アイドル                                   | 文字列 | セッション内でのみ安定する。     |
| name [オプション］ | 文字列 | プロジェクト・ロケーションへの参照。 |
| イメージURL                                | 文字列 | この場所の代表的な画像のURL。   |
| タイトル                                   | 文字列 | ロケ地のタイトル           |
| ラット                                    | 番号  | プロジェクト場所の緯度        |
| lng                                    | 番号  | プロジェクト位置の経度        |

## 例 {#example}

```javascript
// プロジェクトの場所をログに記録する。
XR8.Vps.projectWayspots().then((projectLocations) => {
  projectLocations.forEach((projectLocation) => {
    console.log('projectLocation: ', projectLocation)
  })
})
```
