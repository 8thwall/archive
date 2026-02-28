---
sidebar_position: 1
---

# xr:projectwayspotupdated

## 説明 {#description}

このイベントは、プロジェクトロケーションが位置や回転を変更したときに発行されます。

`xr:projectwayspotupdated.detail : { name, position, rotation }`.

| プロパティ                                               | 説明                         |
| --------------------------------------------------- | -------------------------- |
| 名称                                                  | プロジェクトの場所名。                |
| position: `{x, y, z}`               | プロジェクト・ロケーションの3Dポジション。     |
| 回転: `{w, x, y, z}`. | プロジェクト位置の 3 次元ローカル方位（四元数）。 |
