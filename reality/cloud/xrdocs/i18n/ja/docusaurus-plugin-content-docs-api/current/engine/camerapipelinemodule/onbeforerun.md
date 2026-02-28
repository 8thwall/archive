# onBeforeRun()

`onBeforeRun: ({ config })`

## 説明 {#description}

`onBeforeRun`は[XR8.run()](/api/engine/xr8)の直後に呼び出される。 何らかの約束が返された場合、XRはすべての約束を待ってから続行する。

## パラメータ {#parameters}

| パラメータ  | 説明                                                                            |
| ------ | ----------------------------------------------------------------------------- |
| config | [XR8.run()](/api/engine/xr8) に渡された設定パラメータ。 |
