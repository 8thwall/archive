---
id: invalid-timestamps-detected
---

# 無効なタイムスタンプを検出

#### 問題 {#issue}

iOSデバイスでは、コンソールログに「webvr-polyfill：無効なタイムスタンプが検出されました：devicemotion からのタイムスタンプは期待される範囲外です。

#### 解像度 {#resolution}

何もする必要はない。

これは、AFrame/8Frameライブラリの依存関係である`webvr-polyfill`からの**警告**です。 Devicemotionは、一定間隔で発生するブラウザからのイベントです。 デバイスがその時点で受けている加速度の物理的な力の大きさを示す。 これらの "Invalid timestamp "メッセージは、iOSのdevicemotion実装の副産物で、タイムスタンプが時々順番通りに報告されません。

これは単なる**警告**であり、エラーではない。 これは単なる**警告**であり、エラーではない。 Web ARの体験に影響を与えることはありません。
