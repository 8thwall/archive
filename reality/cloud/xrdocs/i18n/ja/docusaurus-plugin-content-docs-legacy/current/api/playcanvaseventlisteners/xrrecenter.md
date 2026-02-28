# xr:recenter

`this.app.fire('xr:recenter')`。

## 説明 {#description}

カメラの映像を原点に戻す。 新しい原点が引数として与えられると、カメラの原点はその原点にリセットされ、リセンターされる。

## パラメータ {#parameters}

| パラメータ                                    | タイプ                              | 説明                   |
| ---------------------------------------- | -------------------------------- | -------------------- |
| origin [オプション］ | {x, y, z}\\`                    | 新しい原点の位置。            |
| オプション                                    | w, x, y, z}\\`. | 原点でカメラが向くべき方向を表す四元数。 |

## 例 {#example}

```javascript
/*jshint esversion: 6, asi: true, laxbreak: true*/

// taprecenter.js：


var taprecenter = pc.createScript('taprecenter')

// 'recenter'イベントを発生させて、カメラをシーンの開始位置に戻します。
taprecenter.prototype.initialize = function() {
  this.app.touch.on(pc.EVENT_TOUCHSTART,
    (event) => { if (event.touches.length !== 1) { return } this.app.fire('xr:recenter')})
}
```
