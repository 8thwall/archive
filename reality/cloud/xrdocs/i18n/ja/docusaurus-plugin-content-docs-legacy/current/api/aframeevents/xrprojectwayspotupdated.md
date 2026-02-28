# xrprojectwayspotupdated

## 説明 {#description}

このイベントは、[`xrweb`](/legacy/api/aframe/#world-tracking-image-targets-andor-lightship-vps)によって、プロジェクトの場所の位置や回転が変更されたときに発行されます。

`xrprojectwayspotupdated.detail : { name, position, rotation }`.

| プロパティ                                               | 説明                         |
| --------------------------------------------------- | -------------------------- |
| 名称                                                  | プロジェクトの場所名。                |
| position: `{x, y, z}`               | プロジェクト・ロケーションの3Dポジション。     |
| 回転: `{w, x, y, z}`. | プロジェクト位置の 3 次元ローカル方位（四元数）。 |
