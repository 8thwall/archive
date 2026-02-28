---
sidebar_label: isDeviceBrowserCompatible()
---

# XR8.XrDevice.isDeviceBrowserCompatible()

XR8.XrDevice.isDeviceBrowserCompatible(({ allowedDevices })\\`。

## 説明 {#description}

ユーザーのデバイスとブラウザが8th Wall Webと互換性があるかどうかの推定値を返します。 ユーザーのデバイスとブラウザが8th Wall Webと互換性があるかどうかの推定値を返します。 これがfalseを返した場合、[`XR8.XrDevice.incompatibleReasons()`](incompatiblereasons.md)はデバイスとブラウザがサポートされていない理由を返します。 ユーザーのデバイスとブラウザが8th Wall Webと互換性があるかどうかの推定値を返します。 これがfalseを返した場合、[`XR8.XrDevice.incompatibleReasons()`](incompatiblereasons.md)はデバイスとブラウザがサポートされていない理由を返します。

## パラメータ {#parameters}

| パラメータ                                            | 説明                                                                       |
| ------------------------------------------------ | ------------------------------------------------------------------------ |
| allowedDevices [オプション］ | サポートされるデバイスクラス、[`XR8.XrConfig.device()`](/legacy/api/xrconfig/device)の値。 |

## {#returns}を返す。

真か偽か。

## 例 {#example}

```javascript
XR8.XrDevice.isDeviceBrowserCompatible({allowedDevices：XR8.XrConfig.device().MOBILE})
```
