import ecs from './helpers/runtime'
import {GameBoard, GetRandomBoardPos} from './gameboard'
import {Character} from './character'
import {CharacterAI} from './character-ai'
import {Coin} from './coin'
import {cloneComponents, setComponent} from './helpers/clone-tools'

const coins: ecs.eid[] = []
const ghosts: ecs.eid[] = []

function GetCoin(world, column, row) {
  // Brute force FTW
  // console.log('testing for coin', column, row)
  let rc = null
  coins.forEach((coin) => {
    const g = Coin.get(world, coin)
    if (g.currentColumn === column && g.currentRow === row) {
      // console.log('hit', coin, coin.eid)
      rc = coin
    }
  })

  return rc
}

function GetGhost(world, column, row) {
  // Brute force FTW
  // console.log('testing for ghost', column, row)
  let rg = null
  ghosts.forEach((ghost) => {
    const g = Character.get(world, ghost)
    // console.log('ghost', g.currentColumn, g.currentRow)

    if (g.currentColumn === column && g.currentRow === row) {
      // console.log('hit', ghost.eid)
      rg = ghost
    }
  })

  return rg
}

function PopulateCoins(world, component) {
  console.log('populate coins')
  const {schema} = component

  // Destroy existing coins
  coins.forEach((coin) => {
    world.deleteEntity(coin)
  })
  coins.length = 0

  for (let coin = 0; coin < schema.coinCount; coin++) {
    let pos = GetRandomBoardPos()
    let sanity = 0

    while (GetCoin(world, pos.x, pos.y) !== null && sanity < 100) {
      pos = GetRandomBoardPos()
      sanity++
    }

    const newCoin = world.createEntity()
    cloneComponents(schema.coinPrefab, newCoin, world)

    // TH - Custom components aren't being cloned currently so do it manually then override
    const coinProperties = Coin.get(world, schema.coinPrefab)
    Coin.set(world, newCoin,
      {...coinProperties})

    Coin.set(world, newCoin, {
      currentColumn: pos.x,
      currentRow: pos.y,
      prefab: false,
    })

    // console.log('new coin', pos.x, pos.y, newCoin, typeof newCoin, typeof newCoin.eid)
    coins.push(newCoin)
  }
}

function CollectCoin(world, coin, collectFX1, collectFX2) {
  const coinPos = ecs.math.vec3.from(ecs.Position.get(world, coin))
  console.log('Collecting coin at', coinPos)
  // Spawn effects
  const fx1 = world.createEntity()
  cloneComponents(collectFX1, fx1, world)
  world.setPosition(fx1, coinPos.x, coinPos.y, coinPos.z)

  const fx2 = world.createEntity()
  cloneComponents(collectFX2, fx2, world)
  world.setPosition(fx2, coinPos.x, coinPos.y, coinPos.z)

  // Delete coin
  const index = coins.indexOf(coin)
  coins.splice(index, 1)
  world.deleteEntity(coin)
}

function DestroyGhost(world, ghost, hitFX) {
  const ghostPos = ecs.math.vec3.from(ecs.Position.get(world, ghost))
  console.log('Destroying ghost at', ghostPos)

  // Spawn effects
  const fx1 = world.createEntity()
  cloneComponents(hitFX, fx1, world)
  world.setPosition(fx1, ghostPos.x, ghostPos.y, ghostPos.z)

  // Delete ghost
  const index = ghosts.indexOf(ghost)
  ghosts.splice(index, 1)
  world.deleteEntity(ghost)
}

function PopulateGhosts(world, component) {
  console.log('populate ghosts')
  const {schema} = component

  // Destroy existing ghosts
  ghosts.forEach((ghost) => {
    world.deleteEntity(ghost)
  })
  ghosts.length = 0

  for (let ghost = 0; ghost < schema.ghostCount; ghost++) {
    let pos = GetRandomBoardPos()
    let sanity = 0

    while (GetGhost(world, pos.x, pos.y) !== null && sanity < 100) {
      pos = GetRandomBoardPos()
      sanity++
    }

    const newGhost = world.createEntity()
    cloneComponents(schema.ghostPrefab, newGhost, world)

    // TH - Custom components aren't being cloned currently so do it manually then override
    const charProperties = Character.get(world, schema.ghostPrefab)
    Character.set(world, newGhost,
      {...charProperties})

    Character.set(world, newGhost, {
      prefab: false,
      currentColumn: pos.x,
      currentRow: pos.y,
    })

    const aiProperties = CharacterAI.get(world, schema.ghostPrefab)
    CharacterAI.set(world, newGhost,
      {...aiProperties})
    ghosts.push(newGhost)
  }
}

// Register the component with the ECS system
const Game = ecs.registerComponent({
  name: 'game',
  schema: {
    board: ecs.eid,
    playerCharacter: ecs.eid,
    playerStartColumn: ecs.i32,
    playerStartRow: ecs.i32,
    coinCount: ecs.i32,
    coinPrefab: ecs.eid,
    ghostCount: ecs.i32,
    ghostPrefab: ecs.eid,
    coinCollectEffectPrefab1: ecs.eid,
    coinCollectEffectPrefab2: ecs.eid,
    hitEffectPrefab: ecs.eid,
    score: ecs.i32,
    coinPointValue: ecs.i32,
    ghostPointValue: ecs.i32,
    startGame: ecs.boolean,
  },
  schemaDefaults: {
    score: 0,
  },

  add: (world, component) => {
    const {data, schema, eid} = component

    world.events.addListener(world.events.globalId, 'start_game', (e) => {
      Game.set(world, eid, {startGame: true})
    })

    world.events.addListener(world.events.globalId, 'player_collected_coin', (e) => {
      console.log('player collected coin', e, e.data.player, e.data.coin)

      CollectCoin(world, e.data.coin, schema.coinCollectEffectPrefab1,
        schema.coinCollectEffectPrefab2)

      // Increment score
      let s = Game.get(world, eid).score
      const v = Game.get(world, eid).coinPointValue
      s += v
      Game.set(world, eid, {score: s})
      world.events.dispatch(world.events.globalId, 'score_changed', {score: s})

      if (coins.length === 0 && ghosts.length === 0) {
        world.events.dispatch(world.events.globalId, 'victory', {})
      }
    })

    world.events.addListener(world.events.globalId, 'projectile_hit_ghost', (e) => {
      console.log('projectile hit ghost', e.data)
      DestroyGhost(world, e.data.ghost, schema.hitEffectPrefab)

      // Increment score
      let s = Game.get(world, eid).score
      const v = Game.get(world, eid).ghostPointValue
      console.log('score', s, 'value', v)
      s += v
      Game.set(world, eid, {score: s})
      world.events.dispatch(world.events.globalId, 'score_changed', {score: s})

      if (coins.length === 0 && ghosts.length === 0) {
        world.events.dispatch(world.events.globalId, 'victory', {})
      }
    })

    world.events.addListener(world.events.globalId, 'ghost_hit_player', (e) => {
      console.log('ghost hit player', e, e.data.player, e.data.ghost)
      Character.set(world, e.data.player, {dying: true})
    })
  },

  tick: (world, component) => {
    const {eid} = component
    const {schema} = component
    const {data} = component

    if (schema.startGame) {
      console.log('starting game')

      schema.startGame = false

      // Pop player in correct location
      Character.set(world, schema.playerCharacter, {
        currentRow: schema.playerStartRow,
        currentColumn: schema.playerStartColumn,
        revive: true,
      })

      // Populate coins
      PopulateCoins(world, component)

      // Populate ghosts
      PopulateGhosts(world, component)
    }
  },
})

export {Game, GetCoin, GetGhost}
