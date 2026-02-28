---
sidebar_label: requiredPermissions()
---

# XR8.requiredPermissions()

`XR8.requiredPermissions()`

## 説明 {#description}

アプリケーションが必要とするパーミッションのリストを返します。

## パラメータ {#parameters}

なし

## {#returns}を返す。

XR8.XrPermissions.permissions()\\\`](../xrpermissions/permissions.md)のリスト。

## 例 {#example}

```javascript
if (XR8.XrPermissions) {
  const permissions = XR8.XrPermissions.permissions()
  const requiredPermissions = XR8.requiredPermissions()
  if (!requiredPermissions.has(permissions.DEVICE_ORIENTATION)) {
    return
  }
}
```
