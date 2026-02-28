---
sidebar_label: deviceEstimate()
---

# XR8.XrDevice.deviceEstimate()

`XR8.XrDevice.deviceEstimate()`

## 説明 {#description}

ユーザーエージェントの文字列やその他の要素から、ユーザーのデバイス（メーカー/モデルなど）の推定値を返します。 この情報はあくまで概算であり、完全なもの、あるいは信頼できるものであると仮定されるべきではない。

## パラメータ {#parameters}

なし

## を返す {#returns}

オブジェクト: `{ locale, os, osVersion, manufacturer, model }`.

| プロパティ        | 説明                       |
| ------------ | ------------------------ |
| locale       | ユーザーのロケール。               |
| os           | デバイスのオペレーティングシステム。       |
| osVersion    | デバイスのオペレーティングシステムのバージョン。 |
| manufacturer | デバイスの製造元。                |
| model        | デバイスのモデル。                |
