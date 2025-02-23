# Track when Twitch streams go online

## Quickstart

Install: `npm install --save twitchonlinetracker`

Get a Client ID. See Step 1 of the [Twitch API Introduction](https://dev.twitch.tv/docs/api/#introduction) on how to do this.

```js
const { TwitchOnlineTracker } = require('twitchonlinetracker')
const tracker = new TwitchOnlineTracker({
  client_id: "your twitch app client id", // used for api requests
  track: ['channel1', 'channel2'], // all the channels you want to track
  pollInterval: 30, // how often in between polls in seconds. default 30
  debug: true, // whether to debug to console
  clip: true, // whether to listen to clip creation
  start: true // whether to start immediately. if you don't use this, you must call .start() later
})

// Listen to live event, it returns StreamData
tracker.on('live', streamData => {
  console.log(`${streamData.user_name} just went live!`)
})

// Make sure you listen for errors
tracker.on('error', error => console.error)
```

**NOTE:** If you don't pass `start: true` in the options, you must call `tracker.start()` to start polling.

## TwitchOnlineTracker API

### const tracker = new TwitchOnlineTracker(options: [TwitchOnlineTrackerOptions](src/interfaces.ts#L100))

Create a new `TwitchOnlineTracker` instance. It takes a TwitchOnlineTrackerOptions interface:

- `client_id` *string* **required** Your Twitch app's client id
- `track` *string[]* An array of the channels you wish to track on startup
- `pollInterval` *number* The amount of time in seconds between polls
- `clips` *boolean* If true, listen for clip creation
- `debug` *boolean* If true, output debug information to console
- `start` *boolean* If true, start polling immediately

### tracker.start()

Starts polling the Twitch API for stream changes and new clips (optional).

### tracker.stop()

Stops polling the Twitch API for stream changes.

### tracker.track(usernamesToTrack: string[])

Adds more streams to track. `usernamesToTrack` expects an array of strings.

### tracker.untrack(usernamesToUntrack: string[])

Stops tracking streams. `usernamesToTrack` expects an array of strings.

### tracker.on('live', function (streamData: [StreamData](src/interfaces.ts#L36)) { })

When a stream is found to be live, fires this event. The callback function provides a StreamData parameter.

Example:
```javascript
tracker.on('live', function (streamData) {
  console.log(`${streamData.user_name} has started streaming with the title ${streamData.title} at https://twitch.tv/${streamData.user_name} for ${streamData.viewer_count} viewers!`)
})
```

### tracker.on('clip', function (clipData: [ClipData](src/interfaces.ts#L56)) { })

When a new clip is found, fires this event. The callback function provides a ClipData parameter.

Example:
```javascript
tracker.on('clip', function (clipData) {
  console.log(`${streamData.broadcaster_name} has a new clip!`)
})
```

### tracker.on('offline', function (channelName: string) { })

When a stream is found to have gone offline, fires this event. The callback function provides a string.

Example:
```javascript
tracker.on('offline', function (channel) {
  console.log(`${channel} has gone offline.`)
})
```

### tracker.on('error', function (error) { })

Fires this event on error. Make sure you capture this event.

Example:
```javascript
tracker.on('error', function (error) {
  throw Error(error)
})
```
