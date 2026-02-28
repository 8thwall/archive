---
id: camera
---

# カメライベント

## イベント

### アクティブカメラ変更

アクティブなカメラが変更されたときに発せられる。

#### プロパティ

| プロパティ | タイプ | 説明       |
| ----- | --- | -------- |
| カメラ   | カメラ | アクティブカメラ |

#### 例

```ts
world.events.addListener(world.events.globalId, ecs.CameraEvents.ACTIVE_CAMERA_CHANGE, (camera) => {
    console.log(camera)
})
```

### アクティブカメラID変更

アクティブなカメラのeidが変更されたときに発行される。

#### プロパティ

| プロパティ | タイプ | 説明       |
| ----- | --- | -------- |
| イード   | カメラ | アクティブカメラ |

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
