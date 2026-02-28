def onWindows(items, default = []):
    return select({
        "@niantic//bzl/conditions:windows": items,
        "//conditions:default": default,
    })
