---
id: quat
---

# カト

四元数を表すインターフェース。 クォータニオンは（x、y、z、w）座標で表され、3次元回転を表す。 クオータニオンは、Mat4のインターフェイスを使って4x4の回転行列に変換したり、4x4の回転行列から変換したりすることができる。 Quaternionオブジェクトは、ecs.math.quat QuatFactory、または他のQuatオブジェクトの操作によって作成されます。

## ソース

QuatSourceインターフェイスは、x、y、z、wのプロパティを持つオブジェクトを表し、Quatを作成するためのデータソースとして使用することができます。 加えて、QuatSourceはQuatアルゴリズムの引数として使用することができ、{x: 数、y: 数、z: 数、w: 数}プロパティを持つ任意のオブジェクトを使用できることを意味する。

## プロパティ一覧

クアットは以下の列挙可能な特性を持つ:

`readonly x: number` 四元数のx成分にアクセスする。

readonly y: number\`\` 四元数のy成分にアクセスする。

`readonly z: number` 四元数のz成分にアクセスする。

`readonly w: number` 四元数のw成分にアクセスする。

## 工場

### 軸角度

軸角度表現からQuatを作成する。 aaベクトルの方向は回転軸を表し、ベクトルの大きさはラジアン単位の角度を表す。 例えば、quat.axisAngle(vec3.up().scale(Math.PI / 2))は、Y軸に対して90度の回転を表し、quat.yDegrees(90)と等価です。 targetが与えられた場合、結果はtargetに格納され、targetが返される。 そうでない場合は、新しいQuatが作成されて返される。

```ts
ecs.math.quat.axisAngle(aa: Vec3Source, target?: Quat) // -> quat
```

### より

x、y、z、wのプロパティを持つオブジェクトからQuatを作成する。

```ts
ecs.math.quat.from({x, y, z, w}: {x: 数, y: 数, z: 数, w: 数) // -> quat
```

### ルックアット

eye'に位置するオブジェクトが'target'に位置するオブジェクトを見るために必要な回転を表すQuatを、与えられた'up vector'で作成する。

```ts
ecs.math.quat.lookAt(eye: Vec3Source, target: Vec3Source, up: Vec3Source) // -> quat
```

### ピッチヨーロール度

YXZオイラー角としても知られるピッチ/ヨー/ロール表現からクォータニオンを構成する。 回転は度単位で指定する。

```ts
ecs.math.quat.pitchYawRollDegrees(v: Vec3Source) // -> quat
```

### ピッチヨーロールラジアン

YXZオイラー角としても知られるピッチ/ヨー/ロール表現からクォータニオンを構成する。 回転はラジアン単位で指定する。

```ts
ecs.math.quat.pitchYawRollRadians(v: Vec3Source) // -> quat
```

### x度

X軸の回転を表すQuatを作成する。 回転は度単位で指定する。

```ts
ecs.math.quat.xDegrees(degrees: number) // -> quat
```

### xラジアン

X軸の回転を表すQuatを作成する。 回転はラジアン単位で指定する。

```ts
ecs.math.quat.xRadians(radians: number) // -> quat
```

### xyzw

x,y,z,wの値からQuatを作成する。

```ts
ecs.math.quat.xyzw(x: 数, y: 数, z: 数, w: 数) // -> quat
```

### y度

Y軸の回転を表すQuatを作成する。 回転は度単位で指定する。

```ts
ecs.math.quat.yDegrees(degrees: number) // -> quat
```

### イドラジアン

Y軸の回転を表すQuatを作成する。 回転はラジアン単位で指定する。

```ts
ecs.math.quat.yRadians(radians: number) // -> quat
```

### z度

Z軸の回転を表すQuatを作成する。 回転は度単位で指定する。

```ts
ecs.math.quat.zDegrees(degrees: number) // -> quat
```

### ゼットラジアン

Z軸の回転を表すQuatを作成する。 回転はラジアン単位で指定する。

```ts
ecs.math.quat.zRadians(radians: number) // -> quat
```

### ゼロ

ゼロ回転を表すQuatを作成する。

```ts
ecs.math.quat.zero() // -> quat
```

## 不変

以下のメソッドは、クアットの内容を変更することなく、クアットの現在値を使用して計算を実行します。 Quat型を返すメソッドは、新しいインスタンスを作成する。 イミュータブルAPIは一般的に安全で、読みやすく、エラーの可能性を減らすことができるが、フレームごとに大量のオブジェクトが割り当てられると非効率になることがある。

:::note
ガベージ・コレクションがパフォーマンスに影響する場合は、後述するMutable APIの使用を検討してください。
:::

### 軸角度

四元数を軸角度表現に変換する。 ベクトルの方向は回転軸を表し、ベクトルの大きさはラジアン単位の角度を表す。 target'が与えられた場合、結果は'target'に格納され、'target'が返される。 そうでない場合は、新しいVec3が作成されて返される。

```ts
existingQuat.axisAngle(target?: Vec3) // -> vec3
```

### クローン

このクォータニオンと同じ成分を持つ新しいクォータニオンを作成する。

```ts
existingQuat.clone() // -> quat
```

### 抱合体

この四元数の回転共役を返す。 クォータニオンの共役は、回転軸を中心に反対方向に同じ回転を表す。

```ts
existingQuat.conjugate() // -> quat
```

### データ

x, y, z, w]の配列として四元数にアクセスする。

```ts
ecs.math.quat.data() // -> number[].
```

### 度

2つのクォータニオン間の角度、単位は度。

```ts
existingQuat.degreesTo(target: QuatSource) // -> 数
```

### デルタ

この四元数をターゲット四元数に回転させるのに必要な四元数を計算する。

```ts
existingQuat.delta(target: QuatSource) // -> quat
```

### ドット

この四元数と別の四元数との内積を計算する。

```ts
existingQuat.dot(target: QuatSource) // -> quat
```

### イコール

2つのクォータニオンが等しいかどうかを、指定された浮動小数点数の許容誤差でチェックする。

```ts
existingQuat.equals(q: QuatSource, tolerance: number) // -> boolean
```

### イン

このクォータニオンを乗算してゼロ回転クォータニオンを得るクォータニオンを計算する。

```ts
existingQuat.inv() // -> quat
```

### ネゲート

この四元数のすべての成分を否定する。 結果は、このクォータニオンと同じ回転を表すクォータニオンとなる。

```ts
existingQuat.negate() // -> quat
```

### ノーマライズ

長さ1の正規化された四元数を取得する。

```ts
existingQuat.normalize() // -> quat
```

### ピッチヨーロールラジアン

クォータニオンをラジアン単位のピッチ、ヨー、ロール角度に変換する。

```ts
ecs.math.quat.pitchYawRollRadians(target?: Vec3) // -> vec3
```

### ピッチヨーロール度

クォータニオンをピッチ、ヨー、ロール角（度）に変換する。

```ts
ecs.math.quat.pitchYawRollDegrees(target?: Vec3) // -> vec3
```

### プラス

2つのクォータニオンを足し合わせる。

```ts
ecs.math.quat.plus(q: QuatSource) // -> quat
```

### ラジアン

2つのクォータニオン間の角度（ラジアン単位）。

```ts
ecs.math.quat.rotateToward(target: QuatSource, radians: number) // -> quat
```

### スラープ

指定された補間値が与えられた2つのクォータニオン間の球面補間。 補間が0に設定されている場合は、このクォータニオンを返す。 内挿が1に設定されている場合は、ターゲットのクォータニオンを返します。

```ts
ecs.math.quat.slerp(target: QuatSource, t: number) // -> quat
```

### 回

2つのクォータニオンを掛け合わせる。

```ts
existingQuat.times(q: QuatSource) // -> quat
```

### タイムズベック

四元数をベクトルで乗算する。 これは、クォータニオンを回転行列に変換し、その行列にベクトルを乗算することと等価である。

```ts
ecs.math.quat.times(v: Vec3Source, target?: Vec3) // -> vec3
```

## ミュータブル

以下のメソッドは、クアットの現在値を使用して計算を実行し、それを直接変更します。 これらのメソッドは、上記のImmutable APIにあるメソッドに対応している。 Quat型を返すとき、それらは同じオブジェクトへの参照を提供し、メソッドの連鎖を可能にする。 ミュータブルAPIはイミュータブルAPIよりもパフォーマンスが向上する一方で、安全性や可読性に劣り、エラーが発生しやすい傾向がある。 コードが1フレーム内で頻繁に呼び出される可能性が低い場合は、安全性と明快さを向上させるためにImmutable APIを使用することを検討してください。

### セット共役

この四元数を回転共役に設定する。 クォータニオンの共役は、回転軸を中心に反対方向に同じ回転を表す。 このQuatに結果を格納し、連鎖のためにこのQuatを返す。

```ts
existingQuat.setConjugate() // -> quat
```

### セットデルタ

この四元数をターゲット四元数に回転させるのに必要な四元数を計算する。 このQuatに結果を格納し、連鎖のためにこのQuatを返す。

```ts
existingQuat.setDelta(target: QuatSource) // -> quat
```

### セットインヴ

このクォータニオンを乗算してゼロ回転クォータニオンを得るクォータニオンに設定する。 このQuatに結果を格納し、連鎖のためにこのQuatを返す。

```ts
existingQuat.setInv() // -> quat
```

### セット・ネゲート

この四元数のすべての成分を否定する。 結果は、このクォータニオンと同じ回転を表すクォータニオンとなる。 このQuatに結果を格納し、連鎖のためにこのQuatを返す。

```ts
existingQuat.setNegate() // -> quat
```

### セット・ノーマライズ

長さ1の正規化された四元数を取得する。 このQuatに結果を格納し、連鎖のためにこのQuatを返す。

```ts
existingQuat.setNormalize() // -> quat
```

### セットプラス

この四元数を別の四元数に加える。 このQuatに結果を格納し、連鎖のためにこのQuatを返す。

```ts
existingQuat.setPlus(q: QuatSource) // -> quat
```

### セットプレマルチプライ

この四元数をq倍した結果をこの四元数に設定する。 このQuatに結果を格納し、連鎖のためにこのQuatを返す。

```ts
existingQuat.setPremultiply(q: QuatSource) // -> quat
```

### 回転方向

このクォータニオンを、ターゲットにクランプされた状態で、指定されたラジアン数だけターゲットのクォータニオンに向かって回転させる。 このQuatに結果を格納し、連鎖のためにこのQuatを返す。

```ts
existingQuat.setRotateToward(target: QuatSource, radians: number) // -> quat
```

### セットスランプ

指定された補間値が与えられた2つのクォータニオン間の球面補間。 補間が0に設定されている場合は、このクォータニオンを返す。 内挿が1に設定されている場合は、ターゲットのクォータニオンを返します。 このQuatに結果を格納し、連鎖のためにこのQuatを返す。

```ts
existingQuat.setSlerp(target: QuatSource, t: number) // -> quat
```

### セットタイムズ

2つのクォータニオンを掛け合わせる。 このQuatに結果を格納し、連鎖のためにこのQuatを返す。

```ts
existingQuat.setTimes(target: QuatSource) // -> quat
```

## セット

以下のメソッドは、現在のQuatオブジェクトの値を、その現在の内容に関係なく設定します。

### makeAxisAngle

軸角度表現から Quat を設定する。 ベクトルの方向は回転軸を表し、ベクトルの大きさはラジアン単位の角度を表す。 このQuatに結果を格納し、連鎖のためにこのQuatを返す。

```ts
既存Quat.makeAxisAngle(aa: Vec3Source) // -> quat
```

### makePitchYawRollRadians

ピッチ、ヨー、ロールの角度をラジアン単位で指定した回転にクォータニオンを設定する。 このQuatに結果を格納し、連鎖のためにこのQuatを返す。

```ts
既存Quat.makePitchYawRollRadians(v: Vec3Source) // -> quat
```

### メイクルックアット

クォータニオンを、与えられたアップベクトルで視線がターゲットを見るようになる回転に設定する。 このQuatに結果を格納し、連鎖のためにこのQuatを返す。

```ts
既存のQuat.makeLookAt(eye: Vec3Source, target: Vec3Source, up: Vec3Source) // -> quat
```

### makePitchYawRollDegrees

ピッチ、ヨー、ロールの角度を度単位で指定した回転にクォータニオンを設定する。 このQuatに結果を格納し、連鎖のためにこのQuatを返す。

```ts
既存Quat.makePitchYawRollDegrees(v: Vec3Source) // -> quat
```

### メイクX度

クオータニオンをX軸（ピッチ）回りの回転に度単位で設定する。 このQuatに結果を格納し、連鎖のためにこのQuatを返す。

```ts
existingQuat.makeXDegrees(degrees: number) // -> quat
```

### メイクXラディアン

X軸（ピッチ）回りの回転をラジアン単位でクォータニオンに設定する。 このQuatに結果を格納し、連鎖のためにこのQuatを返す。

```ts
既存のQuat.makeXRadians(radians: number) // -> quat
```

### makeYDegrees

四元数（クォータニオン）をy軸の回転（ヨー）に度単位で設定する。 このQuatに結果を格納し、連鎖のためにこのQuatを返す。

```ts
existingQuat.makeYDegrees(degrees: number) // -> quat
```

### メイクイ・ラディアン

ラジアン単位のy軸回りの回転（yaw）にクォータニオンを設定する。 このQuatに結果を格納し、連鎖のためにこのQuatを返す。

```ts
既存のQuat.makeYRadians(radians: number) // -> quat
```

### makeZDegrees

z軸の回転（ロール）を度単位でクォータニオンに設定する。 このQuatに結果を格納し、連鎖のためにこのQuatを返す。

```ts
existingQuat.makeZDegrees(degrees: number) // -> quat
```

### メイクズラジアン

ラジアン単位のz軸（ロール）周りの回転にクォータニオンを設定する。 このQuatに結果を格納し、連鎖のためにこのQuatを返す。

```ts
既存のQuat.makeZRadians(radians: number) // -> quat
```

### メイクゼロ

クォータニオンをゼロ回転に設定する。 このQuatに結果を格納し、連鎖のためにこのQuatを返す。

```ts
existingQuat.makeZero() // -> quat
```

### セット・フロム

このクォータニオンを別のクォータニオンの値に設定する。 このQuatに結果を格納し、連鎖のためにこのQuatを返す。

```ts
existingQuat.setFrom(q: QuatSource) // -> quat
```

### setXyzw

四元数を指定されたx、y、z、wの値に設定する。 このQuatに結果を格納し、連鎖のためにこのQuatを返す。

```ts
existingQuat.setXyzw(x: 数, y: 数, z: 数, w: 数) // -> quat
```
