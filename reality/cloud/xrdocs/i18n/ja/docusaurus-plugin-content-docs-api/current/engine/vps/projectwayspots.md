---
sidebar_label: projectWayspots()
---

# XR8.Vps.projectWayspots()

`XR8.Vps.projectWayspots()`

## 説明 {#description}

各プロジェクト拠点に関するデータを照会します。

## パラメータ {#parameters}

なし

## を返す {#returns}

各プロジェクトロケーションに関するデータを含む `ClientWayspotInfo` の配列を持つプロミス。

`[{id, name, imageUrl, title, lat, lng }]`

| プロパティ                                  | タイプ | 説明                 |
| -------------------------------------- | --- | ------------------ |
| id                                     | 文字列 | セッション内でのみ安定する。     |
| name [オプション］ | 文字列 | プロジェクト・ロケーションへの参照。 |
| imageUrl                               | 文字列 | この場所の代表的な画像のURL。   |
| title                                  | 文字列 | ロケ地のタイトル           |
| lat                                    | 番号  | プロジェクト場所の緯度        |
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
