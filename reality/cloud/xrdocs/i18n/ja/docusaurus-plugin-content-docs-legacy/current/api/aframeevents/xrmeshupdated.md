# xrmesh更新

## 説明 {#description}

このイベントは[`xrweb`](/legacy/api/aframe/#world-tracking-image-targets-andor-lightship-vps)によって、最初に見つかった\*\*メッシュの位置や回転が変更されたときに発行されます。

`xrmeshupdated.detail : { id, position, rotation }`.

| プロパティ                                               | 説明                            |
| --------------------------------------------------- | ----------------------------- |
| アイドル                                                | セッション内で安定したメッシュのID。           |
| position: `{x, y, z}`               | 配置されたメッシュの3次元位置。              |
| 回転: `{w, x, y, z}`. | 配置されたメッシュの3次元ローカル方向（クォータニオン）。 |
