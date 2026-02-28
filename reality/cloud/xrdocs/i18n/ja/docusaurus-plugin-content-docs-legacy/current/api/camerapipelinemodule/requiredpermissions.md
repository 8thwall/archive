# requiredPermissions()

必須パーミッション: ([パーミッション])\\`。

## 説明 {#description}

requiredPermissions\\`は、パイプラインモジュールが必要とするパーミッションのリストを定義するために使用される。

## パラメータ {#parameters}

| パラメータ | 説明                                                                                              |
| ----- | ----------------------------------------------------------------------------------------------- |
| 許可    | パイプラインモジュールが必要とする[`XR8.XrPermissions.permissions()`](/legacy/api/xrpermissions/permissions)の配列。 |

## 例 {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'request-gyro',
  requiredPermissions: () => ([XR8.XrPermissions.permissions().DEVICE_ORIENTATION]),
})
```
