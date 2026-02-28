---
id: vec3
---

# vec3

3Dベクトルを表すインターフェイス。 3Dベクトルは(x, y, z)座標で表現され、空間内の点、方向ベクトル、または3つの順序付けられた次元を持つ他のタイプのデータを表すことができる。 3Dベクトルは、同次座標計算を使用して4x4行列（Mat4）と乗算することができ、効率的な3Dジオメトリ計算を可能にします。 Vec3オブジェクトは、ecs.math.vec3 Vec3Factory、または他のVec3オブジェクトの操作によって作成されます。

## ソース

Vec3Sourceインターフェイスは、x、y、zのプロパティを持つオブジェクトを表す。 さらに、Vec3SourceはVec3アルゴリズムの引数として使用できる。つまり、 {x: number, y: number, z: number} プロパティを持つオブジェクトなら何でも使用できる。

## プロパティ

Vec3は以下の列挙可能な特性を持つ：

`readonly x: number` ベクトルのx成分にアクセスする。

`readonly y: number` ベクトルのy成分にアクセスする。

`readonly z: number` ベクトルのz成分にアクセスする。

## 工場

### from

Vec3、またはx、yのプロパティを持つ他のオブジェクトからVec3を作成します。

```ts
ecs.math.vec3.from({x, y, z}: {x: number, y: number, z: number}) // -> vec3
```

### one

すべての要素が1に設定されたvec3を作成する。 これは \`\`vec3.from({x: 1, y: 1, z: 1})\`\`\` と等価である。

```ts
ecs.math.vec3.one() // -> vec3
```

### scale

すべての要素がスケール値 s に設定された vec3 を作成します。 これは `vec3.from({x: s, y: s, z: s})` と等価である。

```ts
ecs.math.vec3.scale(s: number) // -> vec3
```

### xyz

x, y, z値からVec3を作成する。 これは `vec3.from({x, y, z})` と等価である。

```ts
ecs.math.vec3.xyz(x: 数, y: 数, z: 数) // -> vec3
```

### zero

すべての要素がゼロに設定されたvec3を作成する。 これは `vec3.from({x: 0, y: 0, z: 0})` と等価である。

```ts
ecs.math.vec3.zero() // -> vec3
```

## 不変

以下のメソッドは、Vec3の現在値に基づいて計算を実行するが、その内容は変更しない。 Vec3型を返すメソッドは新しいオブジェクトを返す。 イミュータブルAPIは一般的に、ミュータブルAPIよりも安全で、可読性が高く、エラーが起こりにくいが、フレームごとに何千ものオブジェクトが割り当てられるような状況では非効率的かもしれない。

:::note
ガベージ・コレクションがパフォーマンスに影響する場合は、後述するMutable APIの使用を検討してください。
:::

### clone

このベクトルと同じ成分を持つ新しいベクトルを作成する。

```ts
existingVec3.clone() // -> vec3
```

### cross

このベクトルと別のベクトルの外積を計算する。

```ts
existingVec3.cross(v: Vec3Source) // -> vec3
```

### data

ベクトルを同次配列（4次元）としてアクセスする。

```ts
existingVec3.data() // -> number[]
```

### distanceTo

このベクトルと別のベクトルとのユークリッド距離を計算する。

```ts
existingVec3.distanceTo(v: Vec3Source) // -> 数
```

### divide

要素ごとのベクトル除算。

```ts
existingVec3.divide(v: Vec3Source) // -> vec3
```

### dot

このベクトルと別のベクトルの内積を計算する。

```ts
existingVec3.dot(v: Vec3Source) // -> 数
```

### equals

2つのベクトルが等しいかどうかを、指定された浮動小数点数の許容誤差でチェックする。

```ts
existingVec3.equals(v: Vec3Source, tolerance: number) // -> boolean
```

### length

ベクトルの長さ。

```ts
existingVec3.length() // -> number
```

### minus

このベクトルからベクトルを引く。

```ts
existingVec3.minus(v: Vec3Source) // -> vec3
```

### mix

このベクトルと別のベクトル v の間の線形補間を計算し、その結果が thisVec \* (1 - t) + v \* t となるように係数 t を指定する。 係数tはゼロから1の間でなければならない。

```ts
existingVec3.mix(v: Vec3Source, t: number) // -> vec3
```

### normalize

このベクトルと同じ方向で、長さが 1 の新しいベクトルを返す。

```ts
existingVec3.normalize() // -> vec3
```

### plus

2つのベクトルを足し合わせる。

```ts
existingVec3.plus(v: Vec3Source) // -> vec3
```

### scale

ベクトルにスカラーを掛ける。

```ts
existingVec3.scale(s: number) // -> vec3
```

### times

要素ごとのベクトル乗算。

```ts
existingVec3.times(v: Vec3Source) // -> vec3
```

## ミュータブル

以下のメソッドは、Vec3の現在値に基づいて計算を行い、その内容をその場で変更する。 これらは、上記のミュータブルAPIのメソッドと並行している。 Vec3型を返すメソッドは、メソッドの連鎖を便利にするために、現在のオブジェクトへの参照を返す。 変更可能なAPIは不変なAPIよりもパフォーマンスが高いが、一般的に安全性や可読性に劣り、エラーが発生しやすい。

### SetCross

このベクトルと別のベクトルの外積を計算する。 結果をこの Vec3 に格納し、連鎖のためにこの Vec3 を返す。

```ts
existingVec3.setCross(v: Vec3Source) // -> vec3
```

### setDivide

要素ごとのベクトル除算。 結果をこの Vec3 に格納し、連鎖のためにこの Vec3 を返す。

```ts
existingVec3.setDivide(v: Vec3Source) // -> vec3
```

### setMinus

このベクトルからベクトルを引く。 結果をこの Vec3 に格納し、連鎖のためにこの Vec3 を返す。

```ts
existingVec3.setMinus(v: Vec3Source) // -> vec3
```

### setMix

このベクトルと別のベクトル v の間の線形補間を計算し、その結果が thisVec \* (1 - t) + v \* t となるように係数 t を指定する。 係数tは0から1の間でなければならない。 結果をこの Vec3 に格納し、連鎖のためにこの Vec3 を返す。

```ts
existingVec3.setMix(v: Vec3Source, t: number) // -> vec3
```

### setNormalize

ベクトルを同じ方向で長さ1のバージョンにする。 結果をこの Vec3 に格納し、連鎖のためにこの Vec3 を返す。

```ts
existingVec3.setNormalize() // -> vec3
```

### setPlus

2つのベクトルを足し合わせる。 結果をこの Vec3 に格納し、連鎖のためにこの Vec3 を返す。

```ts
existingVec3.setPlus(v: Vec3Source) // -> vec3
```

### setScale

ベクトルにスカラーを掛ける。 結果をこの Vec3 に格納し、連鎖のためにこの Vec3 を返す。

```ts
existingVec3.setScale(s: number) // -> vec3
```

### setTimes

要素ごとのベクトル乗算。 結果をこの Vec3 に格納し、連鎖のためにこの Vec3 を返す。

```ts
existingVec3.setTimes(v: Vec3Source) // -> vec3
```

### setX

Vec3のx成分を設定する。 結果をこの Vec3 に格納し、連鎖のためにこの Vec3 を返す。

```ts
existingVec3.setX(v: number) // -> vec3
```

### setY

Vec3のy成分を設定する。 結果をこの Vec3 に格納し、連鎖のためにこの Vec3 を返す。

```ts
existingVec3.setY(v: number) // -> vec3
```

### setZ

Vec3のz成分を設定する。 結果をこの Vec3 に格納し、連鎖のためにこの Vec3 を返す。

```ts
existingVec3.setZ(v: number) // -> vec3
```

### Set

以下のメソッドは、現在のVec3オブジェクトの値を、その現在の内容に関係なく設定します。

### makeOne

Vec3をすべて1にする。 結果をこの Vec3 に格納し、連鎖のためにこの Vec3 を返す。

```ts
existingVec3.makeOne() // -> vec3
```

### makeScale

すべての成分がスケール値sに設定されるようにVec3を設定する。 結果をこの Vec3 に格納し、連鎖のためにこの Vec3 を返す。

```ts
existingVec3.makeScale(s: number) // -> vec3
```

### makeZero

Vec3をすべてゼロにする。 結果をこの Vec3 に格納し、連鎖のためにこの Vec3 を返す。

```ts
existingVec3.makeZero() // -> vec3
```

### setFrom

このVec3を、別のVec3、またはx、y、zプロパティを持つ別のオブジェクトと同じ値に設定する。 結果をこの Vec3 に格納し、連鎖のためにこの Vec3 を返す。

```ts
existingVec3.setFrom(source: Vec3Source) // -> vec3
```

### setXyz

Vec3のx、y、z成分を設定する。 結果をこの Vec3 に格納し、連鎖のためにこの Vec3 を返す。

```ts
existingVec3.setXyz(x: 数, y: 数, z: 数) // -> vec3
```
