---
id: vec2
---

# ベクトル2

2次元ベクトルを表すインターフェイス。 2次元ベクトルは(x, y)座標で表され、平面上の点、方向ベクトル、その他の3次元のデータを表すことができる。 Vec2オブジェクトは、ecs.math.vec2 Vec2Factory、または他のVec2オブジェクトに対する操作によって作成されます。

## ソース

Vec2Sourceインターフェイスは、xとyのプロパティを持つオブジェクトを表す。 さらに、Vec2SourceはVec2アルゴリズムの引数として使うことができる。つまり、 {x: number, y: number} プロパティを持つオブジェクトなら何でも使えるということだ。

## プロパティ

Vec2Sourceは以下の列挙可能なプロパティを持つ：

`readonly x: number` ベクトルのx成分にアクセスする。

readonly y: number\`\` ベクトルのy成分にアクセスする。

## 工場

### from

Vec2、または x, y プロパティを持つ他のオブジェクトから Vec2 を作成する。

```ts
ecs.math.vec2.from({x, y}: {x: number, y: number}) // -> vec2
```

### one

すべての要素が1に設定されたvec2を作成する。 これは \`\`vec2.from({x: 1, y: 1})\`\`\` と等価である。

```ts
ecs.math.vec2.one() // -> vec2
```

### scale

すべての要素がスケール値 s に設定された vec2 を作成する。 これは \`\`vec2.from({x: s, y: s})\`\`\\` と等価である。 これは \`\`vec2.from({x: s, y: s})\`\`\` と等価である。

```ts
ecs.math.vec2.scale(s: number) // -> vec2
```

### xy

x, y の値から Vec2 を作成する。 これは \`\`vec2.from({x, y})\`\`\` と等価である。

```ts
ecs.math.vec2.xy(x: number, y: number) // -> vec2
```

### zero

すべての要素がゼロに設定されたvec2を作成する。 これは `vec2.from({x: 0, y: 0})` と等価である。

```ts
ecs.math.vec2.zero() // -> vec2
```

## 不変

以下のメソッドは、Vec2の現在値に基づいて計算を実行するが、その内容は変更しない。 Vec2型を返すメソッドは新しいオブジェクトを返す。 イミュータブルAPIは一般的に、ミュータブルAPIよりも安全で、可読性が高く、エラーが起こりにくいが、フレームごとに何千ものオブジェクトが割り当てられるような状況では非効率的かもしれない。

:::note
ガベージ・コレクションがパフォーマンスに影響する場合は、後述するMutable APIの使用を検討してください。
:::

### clone

このベクトルと同じ成分を持つ新しいベクトルを作成する。

```ts
existingVec2.clone() // -> vec2
```

### cross

このベクトルと別のベクトルの外積を計算する。 2Dベクトルの場合、z成分を0とした2つのベクトルの3Dクロス積のz成分の大きさがクロス積となる。

```ts
existingVec2.cross(v: Vec2Source) // -> 数
```

### distanceTo

このベクトルと別のベクトルとのユークリッド距離を計算する。

```ts
existingVec2.distanceTo(v: Vec2Source) // -> 数
```

### divide

要素ごとのベクトル除算。

```ts
existingVec2.divide(v: Vec2Source) // -> vec2
```

### dot

このベクトルと別のベクトルの内積を計算する。

```ts
existingVec2.dot(v: Vec2Source) // -> 数
```

### equals

2つのベクトルが等しいかどうかを、指定された浮動小数点数の許容誤差でチェックする。

```ts
existingVec2.equals(v: Vec2Source, tolerance: number) // -> boolean
```

### length

ベクトルの長さ。

```ts
existingVec2.length() // -> 数
```

### minus

このベクトルからベクトルを引く。

```ts
existingVec2.minus(v: Vec2Source) // -> vec2
```

### mix

このベクトルと別のベクトル v の間の線形補間を計算し、その結果が thisVec \* (1 - t) + v \* t となるように係数 t を指定する。 係数tはゼロから1の間でなければならない。

```ts
existingVec2.mix(v: Vec2Source, t: number) // -> vec2
```

### normalize

このベクトルと同じ方向で、長さが 1 の新しいベクトルを返す。

```ts
existingVec2.normalize() // -> vec2
```

### plus

2つのベクトルを足し合わせる。

```ts
existingVec2.plus(v: Vec2Source) // -> vec2
```

### scale

ベクトルにスカラーを掛ける。

```ts
existingVec2.scale(s: number) // -> vec2
```

### times

要素ごとのベクトル乗算。

```ts
existingVec2.times(v: Vec2Source) // -> vec2
```

## ミュータブル

以下のメソッドは、Vec2の現在値に基づいて計算を行い、その内容をその場で変更する。 これらは、上記のミュータブルAPIのメソッドと並行している。 Vec2型を返すメソッドは、メソッドの連鎖を便利にするために、現在のオブジェクトへの参照を返す。 変更可能なAPIは不変なAPIよりもパフォーマンスが高いが、一般的に安全性や可読性に劣り、エラーが発生しやすい。

### setDivide

要素ごとのベクトル除算。 結果をこの Vec2 に格納し、連鎖のためにこの Vec2 を返す。

```ts
existingVec2.setDivide(v: Vec2Source) // -> vec2
```

### setMinus

このベクトルからベクトルを引く。 結果をこの Vec2 に格納し、連鎖のためにこの Vec2 を返す。

```ts
existingVec2.setMinus(v: Vec2Source) // -> vec2
```

### setMix

このベクトルと別のベクトル v の間の線形補間を計算し、その結果が thisVec \* (1 - t) + v \* t となるように係数 t を指定する。 係数tは0から1の間でなければならない。 結果をこの Vec2 に格納し、連鎖のためにこの Vec2 を返す。

```ts
existingVec2.setMix(v: Vec2Source, t: number) // -> vec2
```

### setNormalize

ベクトルを同じ方向で長さ1のバージョンにする。 結果をこの Vec2 に格納し、連鎖のためにこの Vec2 を返す。

```ts
existingVec2.setNormalize() // -> vec2
```

### setPlus

2つのベクトルを足し合わせる。 結果をこの Vec2 に格納し、連鎖のためにこの Vec2 を返す。

```ts
existingVec2.setPlus(v: Vec2Source) // -> vec2
```

### setScale

ベクトルにスカラーを掛ける。 結果をこの Vec2 に格納し、連鎖のためにこの Vec2 を返す。

```ts
existingVec2.setScale(s: number) // -> vec2
```

### setTimes

要素ごとのベクトル乗算。 結果をこの Vec2 に格納し、連鎖のためにこの Vec2 を返す。

```ts
existingVec2.setTimes(v: Vec2Source) // -> vec2
```

### setX

Vec2のx成分を設定する。 結果をこの Vec2 に格納し、連鎖のためにこの Vec2 を返す。

```ts
existingVec2.setX(v: number) // -> vec2
```

### setY

Vec2のy成分を設定する。 結果をこの Vec2 に格納し、連鎖のためにこの Vec2 を返す。 結果をこの Vec2 に格納し、連鎖のためにこの Vec2 を返す。

```ts
existingVec2.setY(v: number) // -> vec2
```

### Set

以下のメソッドは、現在のVec2オブジェクトの値を、その現在の内容に関係なく設定する。

### makeOne

Vec2をすべて1にする。 結果をこの Vec2 に格納し、連鎖のためにこの Vec2 を返す。

```ts
existingVec2.makeOne() // -> vec2
```

### makeScale

すべての成分がスケール値sに設定されるようにVec2を設定する。 結果をこの Vec2 に格納し、連鎖のためにこの Vec2 を返す。

```ts
existingVec2.makeScale(s: number) // -> vec2
```

### makeZero

Vec2をすべてゼロにする。 結果をこの Vec2 に格納し、連鎖のためにこの Vec2 を返す。

```ts
existingVec2.makeZero() // -> vec2
```

### setFrom

このVec2を、別のVec2またはxとyのプロパティを持つ別のオブジェクトと同じ値に設定する。 結果をこの Vec2 に格納し、連鎖のためにこの Vec2 を返す。

```ts
existingVec2.setFrom(source: Vec2Source) // -> vec2
```

### setXy

Vec2のx成分とy成分を設定する。 結果をこの Vec2 に格納し、連鎖のためにこの Vec2 を返す。

```ts
existingVec2.setXy(x: 数, y: 数) // -> vec2
```
