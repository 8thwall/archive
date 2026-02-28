import * as WebSocket from 'ws'

interface WebSocketWithChannels extends WebSocket.WebSocket {
  channels?: Set<string>
}

interface ChannelMessage {
  type: 'subscribe' | 'unsubscribe' | 'publish' | 'publishAll'
  channel?: string
  data?: any
}

// NOTE(dat): We likely need to take an externally created http server
const createStudioMcpWebsocketServer = (portNumber: number) => {
  const wss = new WebSocket.WebSocketServer({port: portNumber})
  const clientsByChannel = new Map<string, Set<WebSocketWithChannels>>()
  // TODO(chloe): Change to const webSocketUrlsByAppKey: Map<string, string> = new Map()
  let webSocketUrl: string | undefined

  const addClientToChannel = (ws: WebSocketWithChannels, channelName: string) => {
    if (!clientsByChannel.has(channelName)) {
      clientsByChannel.set(channelName, new Set())
    }
    clientsByChannel.get(channelName)!.add(ws)

    if (!ws.channels) {
      ws.channels = new Set()
    }
    ws.channels.add(channelName)
  }

  const removeClientFromChannel = (ws: WebSocketWithChannels, channelName: string) => {
    const channelClients = clientsByChannel.get(channelName)
    if (channelClients) {
      channelClients.delete(ws)
      if (channelClients.size === 0) {
        clientsByChannel.delete(channelName)
      }
    }

    if (ws.channels) {
      ws.channels.delete(channelName)
    }
  }

  const removeClientFromAllChannels = (ws: WebSocketWithChannels) => {
    if (ws.channels) {
      for (const channelName of ws.channels) {
        removeClientFromChannel(ws, channelName)
      }
    }
  }

  const broadcastToChannel = (channelName: string, message: any, sender: WebSocketWithChannels) => {
    const channelClients = clientsByChannel.get(channelName)
    if (channelClients) {
      channelClients.forEach((client) => {
        if (client !== sender && client.readyState === WebSocket.WebSocket.OPEN) {
          client.send(JSON.stringify(message), {binary: false})
        }
      })
    }
  }

  wss.on('connection', (ws: WebSocketWithChannels) => {
    // eslint-disable-next-line no-console
    ws.on('error', console.error)

    ws.on('close', () => {
      removeClientFromAllChannels(ws)
    })

    ws.on('message', (data, isBinary) => {
      if (isBinary) {
        return
      }

      try {
        const message: ChannelMessage = JSON.parse(data.toString())

        switch (message.type) {
          case 'subscribe':
            if (message.channel) {
              addClientToChannel(ws, message.channel)
              const payload = {
                type: 'subscribed',
                channel: message.channel,
              }
              if (message.channel === 'mcp8' && webSocketUrl) {
                Object.assign(payload, {data: {localWebSocketUrl: webSocketUrl}})
              }
              ws.send(JSON.stringify(payload))
            }
            break

          case 'unsubscribe':
            if (message.channel) {
              removeClientFromChannel(ws, message.channel)
              if (message.channel === 'mcp8') {
                webSocketUrl = undefined
              }
              ws.send(JSON.stringify({
                type: 'unsubscribed',
                channel: message.channel,
              }))
            }
            break

          case 'publish':
            if (message.channel) {
              if (message.data?.localWebSocketUrl) {
                // NOTE(chloe): If an mcp channel with that appKey has subscribed, broadcast its
                // local build WebSocket URL to it. Else, send it when that mcp channel subscribes.
                webSocketUrl = message.data.localWebSocketUrl
              }
              broadcastToChannel(message.channel, message, ws)
            }
            break

          case 'publishAll':
            wss.clients.forEach((client) => {
              if (client !== ws && client.readyState === WebSocket.WebSocket.OPEN) {
                client.send(data, {binary: isBinary})
              }
            })
            break

          default:
            throw new Error(`Invalid message type: ${message.type}`)
        }
      } catch (error) {
        throw new Error(`Invalid message format, cannot parse JSON: ${data.toString()}`)
      }
    })
  })

  return wss
}

export {createStudioMcpWebsocketServer}
