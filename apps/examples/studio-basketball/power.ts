import * as ecs from '@8thwall/ecs'

// Define helper functions at the top
// Ease out quad function for smoother animations
function easeOutQuad(t) {
  return t * (2 - t)
}

// Update meter color based on power percentage
function updateMeterColor(world, meterEntity, powerPercent) {
  if (!ecs.Material.has(world, meterEntity)) {
    return
  }

  // Color gradient from green (low) to yellow (mid) to red (high)
  let r; let g; let
    b
  if (powerPercent < 0.5) {
    // Green to yellow (0 to 0.5)
    const t = powerPercent * 2  // Normalize to 0-1 range
    r = Math.round(255 * t)
    g = 255
    b = 0
  } else {
    // Yellow to red (0.5 to 1.0)
    const t = (powerPercent - 0.5) * 2  // Normalize to 0-1 range
    r = 255
    g = Math.round(255 * (1 - t))
    b = 0
  }

  // Update material color
  ecs.Material.set(world, meterEntity, {
    r,
    g,
    b,
  })
}

// Register the component
ecs.registerComponent({
  name: 'power-meter',
  schema: {
    meterBackground: ecs.eid,    // Grey background rectangle (full meter)
    meterFill: ecs.eid,          // Rectangle to scale and color (current power)
    maxScale: ecs.f32,           // Maximum scale value for full power
    minScale: ecs.f32,           // Minimum scale value for empty power
    axis: ecs.string,            // Axis to scale on ('x', 'y', or 'z')
    chargeTime: ecs.f32,         // Charge time in seconds (matching basketball-shooter)
    animateColor: ecs.boolean,   // Whether to animate color with power
    resetAnimDuration: ecs.f32,  // Duration of reset animation in seconds
  },
  schemaDefaults: {
    maxScale: 1.0,               // Default maximum scale (1.0 = 100%)
    minScale: 0.01,              // Default minimum scale (almost 0)
    axis: 'x',                   // Scale horizontally by default
    chargeTime: 1.4,             // Default to 1.4 seconds (matching your basketball-shooter setting)
    animateColor: true,          // Animate color by default
    resetAnimDuration: 0.3,      // Reset animation takes 0.3 seconds
  },
  data: {
    isCharging: ecs.boolean,     // Whether currently charging
    isResetting: ecs.boolean,    // Whether currently in reset animation
    pressStartTime: ecs.f32,     // When the button was pressed
    resetStartTime: ecs.f32,     // When reset animation started
    lastChargePercent: ecs.f32,  // Last charge percentage before reset
    currentScale: ecs.f32,       // Current scale value
  },

  add: (world, component) => {
    const {meterFill, minScale, axis} = component.schema
    const {data} = component

    // Initialize data
    data.isCharging = false
    data.isResetting = false
    data.pressStartTime = 0
    data.resetStartTime = 0
    data.lastChargePercent = 0
    data.currentScale = minScale

    // Initially set the meter fill to minimum scale
    if (meterFill) {
      const scaleObj = {x: 1.0, y: 1.0, z: 1.0}
      scaleObj[axis] = minScale
      world.setScale(meterFill, scaleObj.x, scaleObj.y, scaleObj.z)

      // Initialize with low power color
      if (component.schema.animateColor) {
        updateMeterColor(world, meterFill, 0)
      }
    }
  },

  tick: (world, component) => {
    // Read mouse input directly
    const mouseDown = world.input.getMouseButton(0)  // Left mouse button
    const mousePressed = world.input.getMouseDown(0)  // Just pressed
    const mouseReleased = world.input.getMouseUp(0)  // Just released

    const {meterFill, minScale, maxScale, axis, chargeTime, resetAnimDuration, animateColor} = component.schema
    const {data} = component

    // Handle mouse press to start charging
    if (mousePressed && !data.isCharging && !data.isResetting) {
      data.isCharging = true
      data.pressStartTime = world.time.elapsed / 1000
      data.lastChargePercent = 0
    }

    // Handle mouse release to start reset animation
    if (mouseReleased && data.isCharging) {
      data.isCharging = false
      data.isResetting = true
      data.resetStartTime = world.time.elapsed / 1000

      // Calculate final charge percentage for smooth reset animation
      const currentTime = world.time.elapsed / 1000
      const chargeDuration = currentTime - data.pressStartTime
      data.lastChargePercent = Math.min(chargeDuration / chargeTime, 1.0)
    }

    // Update meter
    if (meterFill) {
      let powerPercent = 0

      if (data.isCharging) {
        // Calculate charge percentage during charging
        const currentTime = world.time.elapsed / 1000
        const chargeDuration = currentTime - data.pressStartTime
        powerPercent = Math.min(chargeDuration / chargeTime, 1.0)
      } else if (data.isResetting) {
        // Smooth animation back to zero
        const currentTime = world.time.elapsed / 1000
        const resetDuration = currentTime - data.resetStartTime
        const resetPercent = Math.min(resetDuration / resetAnimDuration, 1.0)

        // Use easing function for smoother return animation
        const easedResetPercent = easeOutQuad(resetPercent)
        powerPercent = data.lastChargePercent * (1 - easedResetPercent)

        // Check if reset animation is complete
        if (resetPercent >= 1.0) {
          data.isResetting = false
          powerPercent = 0
        }
      }

      // Calculate scale based on power percentage
      const fillScale = minScale + powerPercent * (maxScale - minScale)
      data.currentScale = fillScale

      // Apply scale to the fill rectangle
      const scaleObj = {x: 1.0, y: 1.0, z: 1.0}
      scaleObj[axis] = fillScale
      world.setScale(meterFill, scaleObj.x, scaleObj.y, scaleObj.z)

      // Update color if enabled
      if (animateColor) {
        updateMeterColor(world, meterFill, powerPercent)
      }
    }
  },
})
