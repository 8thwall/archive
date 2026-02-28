# Native-Browse Heap Snapshots

Heap Snapshots are an incredibly valuable tool for debugging memory issues on the running running Javascript in NAE

## Live Heap Snapshot

To get live heap snapshots from Chrome devtools, you must enable the “inspect” on your running Native-Browse instance. This will enable the instance to be visible from chrome://inspect#devices.

For remote devices, following the instructions outline in Remote Debugging a Native-Browse App will suffice.

When running NAE through node directly on Desktop, adding the `--//bzl/js:inspect` flag will enable the runtime to be visible to chrome. If you haven’t already added localhost to be a visible connection, from chrome://inspect#devices, click on `Open dedicated DevTools for Node` > `Connection` tab > `Add Connection` button > Enter `127.0.0.1:9229` in the text field for network address.

Now that you the running node instances are visible, click on `inspect` for the expected entry.
Chrome will open a new tab / window to allow you to observe logs, collect performance data, etc on your running node instance.

To take a live Heap Snapshot, navigate to the `Memory` tab, make sure `Heap snapshot` is selected, and click on the record button or `Take snapshot` button.

NOTE: This only captures the heap on the mainThread of the node process. For Google Chrome, the Workers will be listed under the “Select JavaScript VM instance”

It’ll take some time to finish loading, but you should be able to view the JS objects' memory captured from the snapshot.

## Heap Snapshot From Code

You can also create heap snapshots using ‘v8’ in Node. This is especially helpful for getting snapshots are specific points in time or snapshots from Worker threads.

Note: You will have to compile the JS source for node in order to use v8
```cpp
import fs from 'fs'
import v8 from 'v8'

let snapshotCount = 0
const takeHeapSnapshot = () => {
 const runfilesDir = (globalThis as any).__niaRunfilesDir
 const snapshotPath = `${runfilesDir}/worker_heapsnapshot_${snapshotCount++}.heapsnapshot`
 v8.writeHeapSnapshot(snapshotPath)
 console.log(`Wrote heap snapshot to ${snapshotPath}`)
}

takeHeapSnapshot()
```

The snapshots should be available in your filesystem, and can be uploaded to Chrome DevTools to inspect the contents.

## Example Heap Snapshot

This is a heap snapshot from a Worker running the `model-manager-worker.js` script. It was observed that when the worker was terminated, that the `WebGL2RenderingContext` had lingering references. It was tricky to track them all down by hand, but the heap snapshot displays a nice list of them under the “Retainers” group. There are a lot of circular references, but the two that we needed to null out where `GLctx`and `offscreenCanvas._context`.

