---
sidebar_label: makeWayspotWatcher()
---

# XR8.Vps.makeWayspotWatcher()

`XR8.Vps.makeWayspotWatcher({onVisible, onHidden, pollGps, lat, lng})`

## 説明 {#description}

プロジェクト・ロケーションだけでなく、すべてのVPS起動ロケーションを検索するウォッチャーを作成する。

## パラメータ {#parameters}

| パラメータ                                                            | 説明                                                                                                      |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| onVisible [オプション］                      | 半径1000メートル以内に新しいLocationが表示されたときに呼び出されるコールバック。                                                          |
| onHidden [オプション］                       | 以前見た場所が半径1000メートル以内になくなったときに呼び出されるコールバック。                                                               |
| pollGps [オプション］                        | trueの場合、GPSをオンにし、GPSの移動によって見つかった/失われたLocationで'onVisible'および'onHidden'コールバックを呼び出します。                    |
| lat [オプション]。 | もし `lat` または `lng` がセットされていれば、セットされた位置の近くで見つかった/失われた Locations で `onVisible` と `onHidden` のコールバックを呼び出す。 |
| lng [オプション］                            | もし `lat` または `lng` がセットされていれば、セットされた位置の近くで見つかった/失われた Locations で `onVisible` と `onHidden` のコールバックを呼び出す。 |

## {#returns}を返す。

以下のメソッドを持つオブジェクト：

`{dispose(), pollGps(), setLatLng()}`

| 方法                                                                                     | 説明                                            |
| -------------------------------------------------------------------------------------- | --------------------------------------------- |
| dispose()                                                           | 状態をクリアし、GPSを停止する。 更新され、いかなるコールバックも呼び出されなくなった。 |
| pollGps(ブール値)                                                       | gpsアップデートのオン/オフ。                              |
| setLatLng(lat: Number, lng: Number) | ウォッチャーの現在位置を `lat` / `lng` に設定する。             |

## 例 {#example}

```javascript



let gotAllLocationsTimeout_ = 0 const onLocationVisible = (location) => { nearbyLocations_.push(location) window.clearTimeout(gotAllLocationsTimeout_) gotAllLocationsTimeout_ = window.setTimeout(() => { // ロケーションを個別に取得します。   // 近くの場所をすべて取得した後、操作だけを実行したい場合は、ここでそれを行うことができます。   }, 0) } const onLocationHidden = (location) => { const index = nearbyLocations_.indexOf(location) if (index > -1) { foundProjectLocations_.splice(index, 1) }.  } const onAttach = ({}) => { waypotWatcher_ = XR8.Vps.makeWayspotWatcher( ) } const onDetach = ({}) => { // ウォッチャーをクリーンアップ waypotWatcher_.dispose() }.




















   {onVisible: onLocationVisible, onHidden: onLocationHidden, pollGps: true}








```
