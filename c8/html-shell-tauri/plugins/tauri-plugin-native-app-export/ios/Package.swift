// swift-tools-version:5.3

import PackageDescription

let package = Package(
  name: "tauri-plugin-native-app-export",
  platforms: [
    .macOS(.v10_13),
    .iOS(.v13),
  ],
  products: [
    .library(
      name: "tauri-plugin-native-app-export",
      type: .static,
      targets: ["tauri-plugin-native-app-export"])
  ],
  dependencies: [
    .package(name: "Tauri", path: "../.tauri/tauri-api")
  ],
  targets: [
    .target(
      name: "tauri-plugin-native-app-export",
      dependencies: [
        .byName(name: "Tauri")
      ],
      path: "Sources")
  ]
)
