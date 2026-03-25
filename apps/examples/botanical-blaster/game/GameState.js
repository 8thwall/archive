import {ScreenStateManager} from './scenes/SceneStateManager'
import {SceneIds} from './scenes/Scenes'
import {GravityGunScreen} from './scenes/gravityGun/GravityGunScreen'
import {PlantersScreenState} from './scenes/planters/PlantersScreen'
import {StartScreen} from './scenes/start/StartScreen'
import {WateringPlantsScreen} from './scenes/wateringPlants/WateringPlantsScreen'
class GameStateClass {
  constructor() {
    /**
     * @type {SceneIds} SceneIds
     */
    this.SceneIds = SceneIds

    this.screenState = ScreenStateManager

    /**
     * @type {StartScreen} gravityGunScreen
     */
    this.startScreen = StartScreen

    /**
     * @type {PlantersScreenState} gravityGunScreenst
     */
    this.plantersScreen = PlantersScreenState

    /**
     * @type {WateringPlantsScreen} gravityGunScreen
     */
    this.wateringPlantsScreen = WateringPlantsScreen

    /**
     * @type {GravityGunScreen} gravityGunScreen
     */
    this.gravityGunScreen = GravityGunScreen
  }
}

export const GameState = new GameStateClass()
