---
id: generate-characters
sidebar_position: 3
---

# アニメーション・キャラクターの生成

Asset Labは現在、**人型二足歩行**3Dキャラクターモデルのリギングとアニメーションをサポートしています。

リギングされ、アニメーション化されたキャラクターモデルを生成するには、まず、入力として使用する複数の画像から、T字ポーズの3Dキャラクターモデルを生成する必要があります。

## ステップ1：画像入力の生成

アニメーションキャラクター用の入力画像を生成するためには、GPT-Image-1を使用する必要があります。  詳細は[画像の生成](/studio/asset-lab/generate-models)を参照してください。

GPT-Image-1\*\*を使用して、Tポーズでマルチビューのキャラクター画像を生成します：

1. 正面
2. 右、左、バックビュー

次に、**Send to 3D Model**をクリックします。

![](/images/studio/asset-lab/character-input.png)

## ステップ2：3Dモデルの生成

サポートされている3D世代モデルを選択します。 (詳細は[3Dモデルの生成](/studio/asset-lab/generate-models)を参照)。 サポートされている3D世代モデルを選択します。 (詳細は[3Dモデルの生成](/studio/asset-lab/generate-models)を参照)。 See [Generate 3D Models](/studio/asset-lab/generate-models) for more details.

リクエストを処理するには、[生成]ボタンを選択します。

![](/images/studio/asset-lab/character-generation.png)

完了したら、**Send to Animation**をクリックします。

## ステップ3：リグとアニメート

現在、**Meshy**によるリギングをサポートしている。 入力は手足がはっきりした二足歩行のヒューマノイドでなければならない。

以下のアニメーションクリップを返します：

- ウォーク
- 走る
- アイドル
- ジャンプ
- 攻撃
- 死
- ゾンビ・ウォーク
- ダンス

Rig + Animate\*\*をクリックして処理します（最大2分かかる場合があります）。

![](/images/studio/asset-lab/character-animation.png)

## ステップ4：プロジェクトにインポートする

リギングしたモデルを保存するには、インポートボタンまたはダウンロードボタンを使用します。

![](/images/studio/asset-lab/character-import.png)

ライブラリで**Animated Characters**をフィルタリングして探してください。

![](/images/studio/asset-lab/character-library.png)

![](/images/studio/asset-lab/character-library2.png)
