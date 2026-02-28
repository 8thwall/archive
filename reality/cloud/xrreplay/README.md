# What is this?

This tool contains a backend that stores data in sqlite. This backend receives replay data from the
web.

This tool also contains a simple front end that explores this data on sqlite storage. Currently it
only shows the first recording.

# How to use this tool

0. Install the packages with `npm i``
1. Run the backend locally with `ts-node src/app.ts`
2. Create a reverse proxy so your server is available online. This can be achieve by signing up for
ngrok and running something like `ngrok http --domain=<REMOVED_BEFORE_OPEN_SOURCING>.ngrok-free.app http://localhost:3003`
3. Add the logging code to your experience, i.e. go to 8th Wall project and add the logging.
4. Refresh your experience. Interact with it.
5. Visit `http://localhost:3003` on your machine that ran step 1. You should see the experience, mouse motion, and console logs.
6. When you want to record another one, kill the process in step 1 and re-run it. This wipes out the
 storage since the storage is in-memory only.

# Logging code
For logging, the code needs to load rrweb recording code then send the data on an interval.

In head.html, add the script tags to load rrweb recording libraries

```html
<script src="https://cdn.jsdelivr.net/npm/rrweb/dist/rrweb.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/rrweb/dist/plugins/console-record.min.js"></script
```

In your app code, set up the replay recording interval. In pure js, this looks like

```javascript
// Starting our rrweb recording
window.loggingEvents = []

const LOG_SERVER_URL = 'https://coherent-frankly-hermit.ngrok-free.app'
fetch(`${LOG_SERVER_URL}/recording`, {
  method: 'POST',
}).then(res => res.json())
  .then(({id}) => {
    let stopLoggingFn_ = null
    let saveLogsIntervalHandle_ = null
    const saveLogsToServer = () => {
      const body = JSON.stringify({events: window.loggingEvents})
      window.loggingEvents = []
      fetch(`${LOG_SERVER_URL}/recording/${id}/log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      }).catch((e) => {
        stopLoggingFn_()
        clearInterval(saveLogsIntervalHandle_)
        console.error('Stopped logging since fetch got an error', e)
      })
    }

    stopLoggingFn_ = rrweb.record({
      emit(event) {
        // push event into the events array
        window.loggingEvents.push(event)
      },
      recordCanvas: true,
      sampling: {
        canvas: 15,
      },
      // to use default record option
      plugins: [
        rrwebConsoleRecord.getRecordConsolePlugin({
          level: ['info', 'log', 'warn', 'error'],
          lengthThreshold: 10000,
          stringifyOptions: {
            stringLengthLimit: 1000,
            numOfKeysLimit: 100,
            depthOfLimit: 1,
          },
          logger: window.console,
        }),
      ],
    })
    saveLogsIntervalHandle_ = setInterval(saveLogsToServer, 5000)
  })
```
