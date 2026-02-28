# xrmeshfound（ホームズファウンド

## 説明 {#description}

このイベントは[`xrweb`](/legacy/api/aframe/#world-tracking-image-targets-andor-lightship-vps)によって、メッシュが最初に見つかったとき、またはrecenter()の後に発行されます。

`xrmeshfound.detail : { id, position, rotation, bufferGeometry }`.

| プロパティ                                               | 説明                                            |
| --------------------------------------------------- | --------------------------------------------- |
| アイドル                                                | セッション内で安定したメッシュのID。                           |
| position: `{x, y, z}`               | 配置されたメッシュの3次元位置。                              |
| 回転: `{w, x, y, z}`. | 配置されたメッシュの3次元ローカル方向（クォータニオン）。                 |
| バッファージオメトリ：                                         | THREE.BufferGeometry\\`メッシュ。 |
