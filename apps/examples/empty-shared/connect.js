import {Multiplayer, initializeSharedAR} from 'shared-ar'

const connectComponent = {
  async init() {
    const scene = this.el

    initializeSharedAR()

    const roomClient = Multiplayer.RoomClientFactory.getCachingClient()

    // if the user was invited to a room, the room id will be in the URL parameters
    let roomId = new URLSearchParams(location.search).get('room')
    if (!roomId) {
      // if they are not invited to a room, create a new room
      const createResult = await roomClient.createRoom()
      roomId = createResult.roomId
      if (createResult.error) {
        throw new Error(`Error creating room. Code: ${createResult.error}`)
      }
    }

    const joinResult = await roomClient.joinRoom(roomId)
    if (joinResult.error) {
      throw new Error(`Error joining room ${joinResult.roomId}. Code: ${joinResult.error}`)
    }

    scene.setAttribute('networked-scene', 'room', roomId)
    scene.setAttribute('invite-overlay', 'room', roomId)
    scene.emit('connect')

    scene.setAttribute('xrweb', 'allowedDevices: any')
  },
}
export {connectComponent}
