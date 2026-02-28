# requiredPermissions()

`requiredPermissions: ([permissions])`

## 説明 {#description}

`requiredPermissions`は、パイプラインモジュールが必要とするパーミッションのリストを定義するために使用される。

## パラメータ {#parameters}

| パラメータ       | 説明                                                                                              |
| ----------- | ----------------------------------------------------------------------------------------------- |
| permissions | パイプラインモジュールが必要とする[`XR8.XrPermissions.permissions()`](/api/engine/xrpermissions/permissions)の配列。 |

## 例 {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'request-gyro',
  requiredPermissions: () => ([XR8.XrPermissions.permissions().DEVICE_ORIENTATION]),
})
```
