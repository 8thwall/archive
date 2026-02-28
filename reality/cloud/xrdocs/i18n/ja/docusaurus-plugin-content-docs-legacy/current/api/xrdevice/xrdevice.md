# XR8.XrDevice

## 説明 {#description}

デバイスの互換性と特性に関する情報を提供します。

## 物件 {#properties}

| プロパティ                                               | タイプ | 説明                                  |
| --------------------------------------------------- | --- | ----------------------------------- |
| [IncompatibilityReasons](incompatibilityreasons.md) | 列挙  | デバイスとブラウザが第8ウォールウェブと互換性がない可能性のある理由。 |

## 機能 {#functions}

| 機能                                                        | 説明                                                                                                                                                                                                                                                                                                                                                                             |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [deviceEstimate](deviceestimate.md)                       | ユーザーエージェントの文字列やその他の要素から、ユーザーのデバイス（メーカー/モデルなど）の推定値を返します。 この情報はあくまで概算であり、完全なもの、あるいは信頼できるものであると仮定されるべきではない。                                                                                                                                                                                                                                                                       |
| [incompatibleReasons](incompatiblereasons.md)             | デバイスとブラウザがサポートされていない理由 `XR8.XrDevice.IncompatibilityReasons`](incompatibilityreasons.md)の配列を返します。 これは、[`XR8.XrDevice.isDeviceBrowserCompatible()`](isdevicebrowsercompatible.md)がfalseを返した場合のみエントリーを含みます。 これは、[`XR8.XrDevice.isDeviceBrowserCompatible()`](isdevicebrowsercompatible.md)がfalseを返した場合のみエントリーを含みます。 |
| [incompatibleReasonDetails](incompatiblereasondetails.md) | デバイスとブラウザに互換性がない理由の詳細を返します。 この情報は、さらなるエラー処理のヒントとしてのみ使用されるべきである。 これらは完全なもの、あるいは信頼できるものであると仮定すべきではない。 これは、[`XR8.XrDevice.isDeviceBrowserCompatible()`](isdevicebrowsercompatible.md)がfalseを返した場合のみエントリーを含みます。                                                                                                                                                                    |
| [isDeviceBrowserCompatible](isdevicebrowsercompatible.md) | ユーザーのデバイスとブラウザが8th Wall Webと互換性があるかどうかの推定値を返します。 これがfalseを返した場合、[`XR8.XrDevice.incompatibleReasons()`](incompatiblereasons.md)はデバイスとブラウザがサポートされていない理由を返します。 これがfalseを返した場合、[`XR8.XrDevice.incompatibleReasons()`](incompatiblereasons.md)はデバイスとブラウザがサポートされていない理由を返します。                                                                                                         |
