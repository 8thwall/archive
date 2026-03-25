import {Multiplayer} from 'shared-ar'

const roomClient = Multiplayer.RoomClientFactory.create()

// When we have the roomId then we can resolve it.
let resolveRoomId_ = null

// Current state as seen from this client
const roomState = {
  roomClient,
  roomId: new Promise((res, rej) => {
    resolveRoomId_ = res
  }),
}

let roomCreatedOrPending = false

// Note: This assumes the roomId is valid.
const setRoomId = (roomId) => {
  roomCreatedOrPending = true
  const url = new URL(window.location)
  url.searchParams.set('roomId', roomId)
  window.history.pushState({}, '', url)
  resolveRoomId_(roomId)
}

// Create a room if roomId is specified in the URL
const maybeCreateRoom = async () => {
  // If we already created or have a pending create request, then don't create another `createRoom()` request.
  if (roomCreatedOrPending) {
    return roomState.roomId
  }

  // Otherwise return a roomId if we can get one of the url params
  roomCreatedOrPending = true
  // If we already have a roomId as a url param, then we can resolve the roomId
  const urlRoomId = new URLSearchParams(window.location.search).get('roomId')
  if (urlRoomId) {
    setRoomId(urlRoomId)
    return roomState.roomId
  }

  // Otherwise ask the room client to create one for us.
  roomState.roomId = roomClient.createRoom({capacity: 20})
  roomState.roomId.then((roomId) => {
    setRoomId(roomId)
  })
  // Error handling if there was in issue the the `roomClient.createRoom()` request.
    .catch((e) => {
      roomCreatedOrPending = false
    })

  return roomState.roomId
}

export {
  roomState,
  maybeCreateRoom,
}
