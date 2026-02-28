---
sidebar_label: 互換性のない理由の詳細()
---

# XR8.XrDevice.incompatibleReasonDetails()

XR8.XrDevice.incompatibleReasonDetails(({ allowedDevices })\\`。

## 説明 {#description}

デバイスとブラウザに互換性がない理由の詳細を返します。 この情報は、さらなるエラー処理のヒントとしてのみ使用されるべきである。 これらは完全なもの、あるいは信頼できるものであると仮定すべきではない。 デバイスとブラウザに互換性がない理由の詳細を返します。 この情報は、さらなるエラー処理のヒントとしてのみ使用されるべきである。 これらは完全なもの、あるいは信頼できるものであると仮定すべきではない。 これは、[`XR8.XrDevice.isDeviceBrowserCompatible()`](isdevicebrowsercompatible.md)がfalseを返した場合のみエントリーを含みます。

## パラメータ {#parameters}

| パラメータ                                            | 説明                                                                       |
| ------------------------------------------------ | ------------------------------------------------------------------------ |
| allowedDevices [オプション］ | サポートされるデバイスクラス、[`XR8.XrConfig.device()`](/legacy/api/xrconfig/device)の値。 |

## {#returns}を返す。

オブジェクト: `{ inAppBrowser, inAppBrowserType }`

| プロパティ            | 説明                                                  |
| ---------------- | --------------------------------------------------- |
| inAppBrowser     | 検出されたアプリ内ブラウザの名前 (例 `'Twitter'`) |
| inAppBrowserType | アプリ内ブラウザの処理方法を記述するのに役立つ文字列。                         |
