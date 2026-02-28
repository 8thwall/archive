---
sidebar_label: IncompatibilityReasons
---

# XR8.XrDevice.IncompatibilityReasons

列挙

## 説明 {#description}

デバイスとブラウザが第8ウォールウェブと互換性がない可能性のある理由。

## 物件 {#properties}

| プロパティ                                                                | 価値  | 説明                                |
| -------------------------------------------------------------------- | --- | --------------------------------- |
| UNSPECIFIED                                                          | `0` | 互換性のない理由は明記されていない。                |
| UNSUPPORTED_OS                                  | `1` | 推定されるオペレーティングシステムはサポートされていません。    |
| UNSUPPORTED_BROWSER                             | `2` | 推定ブラウザはサポートされていません。               |
| MISSING_DEVICE_ORIENTATION | `3` | このブラウザはデバイスの向きのイベントをサポートしていません。   |
| MISSING_USER_MEDIA         | `4` | このブラウザはユーザーメディアへのアクセスをサポートしていません。 |
| MISSING_WEB_ASSEMBLY       | `5` | ブラウザがウェブアセンブリをサポートしていません。         |
