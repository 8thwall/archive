---
sidebar_label: 互換性のない理由()
---

# XR8.XrDevice.incompatibleReasons()

XR8.XrDevice.incompatibleReasons(({ allowedDevices })\\`。

## 説明 {#description}

デバイスとブラウザがサポートされていない [`XR8.XrDevice.IncompatibilityReasons`](incompatibilityreasons.md)の配列を返します。 これは、[`XR8.XrDevice.isDeviceBrowserCompatible()`](isdevicebrowsercompatible.md)がfalseを返した場合のみエントリーを含みます。 これは、[`XR8.XrDevice.isDeviceBrowserCompatible()`](isdevicebrowsercompatible.md)がfalseを返した場合のみエントリーを含みます。

## パラメータ {#parameters}

| パラメータ                                            | 説明                                                                       |
| ------------------------------------------------ | ------------------------------------------------------------------------ |
| allowedDevices [オプション］ | サポートされるデバイスクラス、[`XR8.XrConfig.device()`](/legacy/api/xrconfig/device)の値。 |

## {#returns}を返す。

XR8.XrDevice.IncompatibilityReasons\\`](incompatibilityreasons.md) の配列を返します。

## 例 {#example}

```javascript
const reasons = XR8.XrDevice.incompatibleReasons()
for (let reason of reasons) {
  switch (reason) {
    case XR8.XrDevice.IncompabilityReasons.UNSUPPORTED_OS：
      //
      break;
    case XR8.XrDevice.IncompabilityReasons.UNSUPPORTED_BROWSER:
       // サポートされていないブラウザを処理する
       break;
   ...
}
```
