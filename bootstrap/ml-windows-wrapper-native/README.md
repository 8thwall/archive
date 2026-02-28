For windows install deps
```
choco install rustup.install
```
and reopen pwsh

Then run from this directory
```
cargo build -r && cp target/release/ml-windows-wrapper-native.exe ../../bzl/crosstool/
```
to update the native wrapper
