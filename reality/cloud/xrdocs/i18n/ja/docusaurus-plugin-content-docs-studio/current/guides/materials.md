---
id: materials
description: このセクションでは、スタジオでのマテリアルの使用方法について説明します。
---

# 材料

## はじめに

このセクションでは、スタジオでのマテリアルの使用方法について説明します。

## 素材の種類

### 素材

標準的な[PBR](https://learn.microsoft.com/en-us/azure/remote-rendering/overview/features/pbr-materials)素材。

### アンライトマテリアル

照明や影の影響を受けない素材。

### シャドウマテリアル

影だけに反応する素材。

### ハイダーマテリアル

背後の物体を隠す特殊素材。

## 材料特性

マテリアルはコードを通して、またはエディターのMeshコンポーネント内で直接設定することができます。

物件を見る [こちら](/api/studio/ecs/material/basic-material).

## 例

次の例は、実行時にエンティティにマテリアルを設定する方法を示しています。

```ts
// 標準マテリアルの設定
ecs.Material.set(world, component.eid, {r: 255, g: 0, b: 100, roughness: 1})

// シャドウマテリアルの設定
ecs.ShadowMaterial.set(world, component.eid, {r: 255, g: 0, b: 100})
```
