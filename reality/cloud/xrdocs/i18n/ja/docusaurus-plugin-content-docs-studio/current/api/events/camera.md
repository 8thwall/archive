---
id: camera
sidebar_position: 4
---

# カメライベント

## イベント

### アクティブカメラ変更

アクティブなカメラが変更されたときに発せられる。

#### プロパティ一覧

| Property | Type   | 商品説明     |
| -------- | ------ | -------- |
| camera   | Camera | アクティブカメラ |

#### 例

```ts
world.events.addListener(world.events.globalId, ecs.CameraEvents.ACTIVE_CAMERA_CHANGE, (camera) => {
    console.log(camera)
})
```

### アクティブカメラID変更

アクティブなカメラのeidが変更されたときに発行される。

#### プロパティ一覧

| Property | Type   | 商品説明     |
| -------- | ------ | -------- |
| イード      | Camera | アクティブカメラ |

#### 例

```ts
world.events.addListener(world.events.globalId, ecs.CameraEvents.ACTIVE_CAMERA_EID_CHANGE, (eid) => {
    console.log(eid)
})
```

### XR_CAMERA_EDIT

アクティブなカメラのXR属性が変更されたときに発せられる。

#### 例

```ts
world.events.addListener(world.events.globalId, ecs.CameraEvents.XR_CAMERA_EDIT, () => {
    console.log('Something happened')
})
```
