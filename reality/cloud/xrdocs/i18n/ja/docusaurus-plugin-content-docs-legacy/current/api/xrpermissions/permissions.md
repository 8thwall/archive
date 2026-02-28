---
sidebar_label: パーミッション
---

# XR8.XrPermissions.permissions()

列挙

## 説明 {#description}

パイプラインモジュールが要求できるパーミッション。

## 物件 {#properties}

| プロパティ                              | 価値        | 説明             |
| ---------------------------------- | --------- | -------------- |
| カメラ                                | カメラ       | カメラが必要。        |
| DEVICE_MOTION | デバイスモーション | 加速度センサーが必要。    |
| デバイスの向き                            | デバイスの向き   | ジャイロが必要。       |
| DEVICE_GPS    | ジオロケーション  | GPS位置情報を必要とする。 |
| マイクロフォン                            | マイク       | マイクが必要。        |

## 例 {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'request-gyro',
  requiredPermissions: () => ([XR8.XrPermissions.permissions().DEVICE_ORIENTATION]),
})
```
