---
sidebar_label: permissions()
---

# XR8.XrPermissions.permissions()

列挙

## 説明 {#description}

パイプラインモジュールが要求できるパーミッション。

## 物件 {#properties}

| プロパティ                                   | 価値                    | 説明             |
| --------------------------------------- | --------------------- | -------------- |
| CAMERA                                  | `'camera'`            | カメラが必要。        |
| DEVICE_MOTION      | `'devicemotion'`      | 加速度センサーが必要。    |
| DEVICE_ORIENTATION | `'deviceorientation'` | ジャイロが必要。       |
| DEVICE_GPS         | `'geolocation'`       | GPS位置情報を必要とする。 |
| MICROPHONE                              | `'microphone'`        | マイクが必要。        |

## 例 {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'request-gyro',
  requiredPermissions: () => ([XR8.XrPermissions.permissions().DEVICE_ORIENTATION]),
})
```
