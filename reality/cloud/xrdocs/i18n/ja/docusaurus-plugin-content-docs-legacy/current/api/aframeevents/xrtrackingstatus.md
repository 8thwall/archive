# xrtrackingstatus

## 説明 {#description}

このイベントは、[`XR8.XrController`](/legacy/api/xrcontroller)がロードされ、トラッキングのステータスや理由が変更されたときに、[`xrweb`](/legacy/api/aframe/#world-tracking-image-targets-andor-lightship-vps)によって発行されます。

xrtrackingstatus : { status, reason }\\`.

| プロパティ | 説明                                     |
| ----- | -------------------------------------- |
| ステータス | LIMITED'`または`NORMAL'\\`のいずれか。         |
| 理由    | INITIALIZING'` または 'UNDEFINED'` のいずれか。 |

## 例 {#example}

```javascript
const updateScene = ({detail}) => {
  const {status, reason} = detail
  if (status === 'NORMAL') {
    // シーンを表示
  }.
}
this.el.sceneEl.addEventListener('xrtrackingstatus', updateScene)
```
