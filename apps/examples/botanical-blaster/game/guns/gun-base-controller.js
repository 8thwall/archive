import * as ecs from '@8thwall/ecs'
export const GunControllerEvents = {
  Fire: 'fire-gun',
}

export class FireGunEvent {
  /**
   * @param {[number,number,number]} direction
   */
  constructor(direction) {
    /**
     * @type {[number,number,number]} direction
     */
    this.direction = direction
  }
}

const GunBaseController = ecs.registerComponent({
  name: 'GunBaseController',
  schema: {},
  add: (world, component) => {},
  remove: (world, component) => {},
})

export {GunBaseController}
