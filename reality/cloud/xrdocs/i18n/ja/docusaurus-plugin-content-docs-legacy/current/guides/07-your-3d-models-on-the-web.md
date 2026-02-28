---
id: your-3d-models-on-the-web
---

# ウェブ上の3Dモデル

すべてのWebAR体験には、GLB（glTF 2.0バイナリ）形式の3Dモデルを使用することを推奨します。 GLBは、
、ファイルサイズが小さく、パフォーマンスが高く、
の機能（PBR、アニメーションなど）を多目的にサポートする、WebARに最適なフォーマットです。 GLBは、
、ファイルサイズが小さく、パフォーマンスが高く、
の機能（PBR、アニメーションなど）を多目的にサポートする、WebARに最適なフォーマットです。

## モデルをGLB形式に変換する {#converting-models-to-glb}

輸出する前に、以下のことを確認してください：

- ピボット・ポイントはモデルの根元にある（地面につけることを想定している場合）
- 物体の前方ベクトルはZ軸に沿う（物体が正面を向くと想定している場合）

モデルがglTFとしてエクスポートされている場合は、glTFフォルダを
[gltf.report](https://gltf.report)にドラッグ＆ドロップし、_Export_をクリックしてGLBに変換します。

あなたのモデルが3DモデリングソフトウェアからglTF/GLBにエクスポートできない場合は、Blenderにインポートし、
gLTFとしてエクスポートするか、コンバータを使用してください。

\*\*オンラインコンバータ[Creators3D](https://www.creators3d.com/online-viewer), [Boxshot](https://boxshot.com/facebook-3d-converter/)

**ネイティブコンバータ**：[Maya2glTF](https://github.com/iimachines/Maya2glTF)、[3DS Max](https://doc.babylonjs.com/features/featuresDeepDive/Exporters/3DSMax)

コンバーターの全リストは<https://github.com/khronosgroup/gltf#gltf-tools>にある。

、8th Wallプロジェクトにインポートする前に、[glTF Viewer](https://gltf-viewer.donmccurdy.com/)でモデルを表示することをお勧めします。 これは、8th Wallのプロジェクトに
、それを追加する前に、モデルの問題をキャッチするのに役立ちます。 これは、8th Wallのプロジェクトに
、それを追加する前に、モデルの問題をキャッチするのに役立ちます。

8th Wallプロジェクトにインポートした後、以下のことを確認してください：

- スケールは(1, 1, 1)で正しく見える。 目盛りが大幅にずれている場合（例：0.0001 または
  10000）、コード内で目盛りを変更しないでください。 代わりに、モデリングソフトで変更して、
  再インポートしてください。 コード内でスケールを大幅に変更すると、モデルのクリッピング問題が発生することがあります。
- 材料は正しいようだ。 モデルに反射素材がある場合、
  反射させるものがないと黒く見えることがあります。 材料は正しいようだ。 モデルに反射素材がある場合、
  反射させるものがないと黒く見えることがあります。
  [反射サンプルプロジェクト](https://www.8thwall.com/8thwall/cubemap-aframe) および/または
  [ガラスサンプルプロジェクト](https://www.8thwall.com/playground/glass-materials-aframe) をご参照ください。

3Dモデルのベストプラクティスの詳細については、[GLB最適化セクション](#glb-optimization)を参照してください。

開発者が8th Wall WebARプロジェクトをより現実的にするための5つのヒント](https://www.8thwall.com/blog/post/41447089034/5-tips-for-developers-to-make-any-8th-wall-webar-project-more-realistic)のブログ記事もご覧ください。

### FBXからGLBへの変換 {#converting-fbx-to-glb}

以下の説明では、Facebookが開発した[FBX2glTF CLI変換ツール](https://github.com/facebookincubator/FBX2glTF)をMacローカルにインストールして実行する方法を説明します。 このツールは、FBXからGLBへの変換のために、私たち8th Wallの社員がこれまで使用した中で最も信頼できるツールです。 このツールは、FBXからGLBへの変換のために、私たち8th Wallの社員がこれまで使用した中で最も信頼できるツールです。

**MacにFBX2glTFをインストールする**。

1. このファイルをダウンロード: https://github.com/facebookincubator/FBX2glTF/releases/download/v0.9.7/FBX2glTF-darwin-x64
2. オープンターミナル
3. ダウンロードフォルダーに移動する：cd ~/Downloads\\`
4. ファイルを実行可能にする：chmod +x FBX2glTF-darwin-x64\\`。
5. ダウンロードしたファイルに関する警告が表示された場合は、`キャンセル`をクリックしてください。

![macos-warning-1](/images/macos-download-warning-fbx2gltf-1.jpg)

6. システム環境設定」→「セキュリティとプライバシー」を開き、「ロック」アイコンをクリックし、「macOSパスワード」を入力する。

![macos-security-and-privacy](/images/macos-security-and-privacy.jpg)

7. とにかく許可\\`をクリックする
8. システム環境設定を閉じる。
9. ターミナルウィンドウに戻る
10. 前のコマンドを再実行します（上矢印を押すと前のコマンドに戻ります）：chmod +x FBX2glTF-darwin-x64\\`。
11. 更新された警告が表示されるので、`開く`をクリックする：

![macos-warning-2](/images/macos-download-warning-fbx2gltf-2.jpg)

12. この時点で、FBX2glTFを正常に実行できるはずです。

\*\*FBX2glTFをシステムディレクトリにコピーします。

FBX2glTFコンバータを簡単に実行するには、/usr/local/binディレクトリにコピーする。 これにより、コマンドを実行するために毎回ダウンロードフォルダに移動する必要がなくなる。 これにより、コマンドを実行するために毎回ダウンロードフォルダに移動する必要がなくなる。

1. ダウンロードフォルダから、`sudo cp ./FBX2glTF-darwin-x64 /usr/local/bin`を実行する。
2. システムはおそらくあなたのmacOSのパスワードを要求するでしょう。 と入力し、「Enter」キーを押す。 と入力し、「Enter」キーを押す。
3. デフォルトでは `/usr/local/bin` が PATH に入っているはずなので、どのディレクトリからでも
   `FBX2glTF-darwin-x64` を実行するだけでよい。

**MacでFBX2glTFを実行する**。

1. ターミナルで、fbxファイルがあるフォルダに移動します。 以下は、macOSのコマンドラインからディレクトリをトラバースするのに便利な
   ： 以下は、macOSのコマンドラインからディレクトリをトラバースするのに便利な
   ：

- pwd\\`は端末のカレントディレクトリを出力する。
- ls\\` は現在のディレクトリの内容をリストアップする。
- cd`はディレクトリを変更し、相対パス（例えば`cd ~/Downloads`）または絶対パス（例えば`cd /var/tmp\\` ）を取ります。

2. FBX2glTF-darwin-x64\\`を実行し、入力ファイル(-i)と出力ファイル(-o)のパラメータを渡す。

#### FBX2glTF の例 {#fbx2gltf-example}

```bash
FBX2glTF-darwin-x64 -i yourfile.fbx -o newfile.glb
```

3. 上記の例では、`yourfile.fbx`を`newfile.glb`という新しいGLBファイルに変換します。
4. 新しく作成したGLBファイルをhttps://gltf-viewer.donmccurdy.com/ にドラッグ＆ドロップし、
   が正しく動作することを確認します。
5. glb変換の高度な設定については、以下のコマンドをチェックしてほしい：
   https://github.com/facebookincubator/FBX2glTF#cli-switches

**FBX2glTFのバッチ変換**。

同じディレクトリに複数のFBXファイルがある場合、それらを一度に変換することができます。

1. ターミナルで、複数のFBXファイルを含むフォルダに移動します。
2. 以下のコマンドを実行する：

#### FBX2glTFバッチ変換例 {#fbx2gltf-batch-conversion-example}

```bash
ls *.fbx | xargs -n1 -I {}.FBX2glTF-darwin-x64 -i {} -o {}.glbxFBX2glTF-darwin-x64 -i {} -o {}.glb
```

3. これにより、現在のフォルダにある各fbxファイルのglbバージョンが作成されるはずです!

## GLB 最適化 {#glb-optimization}

アセットを最適化することは、魔法のようなWebARコンテンツを作成するための重要なステップです。 大きなアセットは、無限ロード、黒いテクスチャ、クラッシュなど、
の問題につながる可能性があります。 大きなアセットは、無限ロード、黒いテクスチャ、クラッシュなど、
の問題につながる可能性があります。

### テクスチャ最適化 {#texture-optimization}

テクスチャは通常、ファイルサイズを大きくする最大の要因です。
、まずこれらを最適化するのがよいでしょう。

最良の結果を得るには、1024x1024以下のテクスチャを使用することをお勧めします。 最良の結果を得るには、1024x1024以下のテクスチャを使用することをお勧めします。 テクスチャのサイズは常に2のべき乗（512x512、1024x1024など）に
。 最良の結果を得るには、1024x1024以下のテクスチャを使用することをお勧めします。 テクスチャのサイズは常に2のべき乗（512x512、1024x1024など）に
。

これは、お好みの画像編集ソフトや3Dモデリングソフトを使って行うことができます。しかし、
、すでに既存のGLBモデルを持っている場合、3Dモデル内のテクスチャサイズを変更する簡単な方法は、[gltf.report](https://gltf.report)を使うことです。

- 3Dモデルをページにドラッグします。  3Dモデルをページにドラッグします。  左の列で、希望するテクスチャサイズの最大値を設定します(1)。  3Dモデルをページにドラッグします。  左の列で、希望するテクスチャサイズの最大値を設定します(1)。
- 再生(2)をクリックしてスクリプトを実行する。 コンソール（左下）に操作状況が表示されます。 コンソール（左下）に操作状況が表示されます。
- エクスポート(3)をクリックして、修正したGLBモデルをダウンロードします。

![gltf-report](/images/gltf-report.jpg)

### 圧縮 {#compression}

圧縮はファイルサイズを大幅に縮小することができる。 圧縮はファイルサイズを大幅に縮小することができる。 Draco圧縮は最も一般的な圧縮方法で
、Blenderのエクスポート設定か、エクスポート後に
[gltf.report](https://gltf.report)で設定できます。

圧縮されたモデルをプロジェクトにロードするには、追加の設定が必要です。 圧縮されたモデルをプロジェクトにロードするには、追加の設定が必要です。 詳しくは
[A-Frame サンプルプロジェクト](https://www.8thwall.com/playground/draco-compression)、または
[three.js サンプルプロジェクト](https://www.8thwall.com/playground/draco-threejs)を参照してください。

### ジオメトリー最適化 {#geometry-optimization}

さらに最適化するには、モデルをデシメートしてポリゴン数を減らす。

Blenderでモデルに_Decimate_モディファイアを適用し、_Ratio_設定を1以下の値にします。

エクスポート設定で_Apply Modifiers_を選択します。

### 最適化チュートリアル {#optimization-tutorial}

```mdx-code-block
<iframe width="560" height="315" src="https://www.youtube.com/embed/1ToEPOHN1no" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

```
