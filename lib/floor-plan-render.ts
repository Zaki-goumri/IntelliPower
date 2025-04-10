import type { Camera, Door, FloorPlanData, Furniture, Wall, Window } from "@/types/floor-plan.types"

// Convert data coordinates to canvas coordinates
const scaleCoordinates = (
  x: number,
  y: number,
  data: FloorPlanData,
  canvasWidth: number,
  canvasHeight: number,
): [number, number] => {
  const scaleX = canvasWidth / data.dimensions.width
  const scaleY = canvasHeight / data.dimensions.height

  return [x * scaleX, y * scaleY]
}

// Draw walls
const drawWall = (
  ctx: CanvasRenderingContext2D,
  wall: Wall,
  data: FloorPlanData,
  canvasWidth: number,
  canvasHeight: number,
) => {
  const [x1, y1] = scaleCoordinates(wall.start.x, wall.start.y, data, canvasWidth, canvasHeight)
  const [x2, y2] = scaleCoordinates(wall.end.x, wall.end.y, data, canvasWidth, canvasHeight)

  // Calculate normal vector for the wall line
  const dx = x2 - x1
  const dy = y2 - y1
  const length = Math.sqrt(dx * dx + dy * dy)
  const nx = -dy / length // Normal x component
  const ny = dx / length // Normal y component

  // Calculate wall thickness in pixels
  const thickness = (wall.thickness * canvasWidth) / data.dimensions.width
  const halfThickness = thickness / 2

  // Calculate the four corners of the wall
  const x1a = x1 + nx * halfThickness
  const y1a = y1 + ny * halfThickness
  const x1b = x1 - nx * halfThickness
  const y1b = y1 - ny * halfThickness
  const x2a = x2 + nx * halfThickness
  const y2a = y2 + ny * halfThickness
  const x2b = x2 - nx * halfThickness
  const y2b = y2 - ny * halfThickness

  // Draw the wall as a filled path
  ctx.beginPath()
  ctx.moveTo(x1a, y1a)
  ctx.lineTo(x2a, y2a)
  ctx.lineTo(x2b, y2b)
  ctx.lineTo(x1b, y1b)
  ctx.closePath()

  ctx.fillStyle = "#4A1D96" // Purple-900 for walls
  ctx.fill()
}

// Draw doors
const drawDoor = (
  ctx: CanvasRenderingContext2D,
  door: Door,
  data: FloorPlanData,
  canvasWidth: number,
  canvasHeight: number,
) => {
  const [x1, y1] = scaleCoordinates(door.start.x, door.start.y, data, canvasWidth, canvasHeight)
  const [x2, y2] = scaleCoordinates(door.end.x, door.end.y, data, canvasWidth, canvasHeight)

  // Draw the door frame
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.strokeStyle = "#FFFFFF"
  ctx.lineWidth = 2
  ctx.stroke()

  // Draw the door swing arc if it's open
  if (door.isOpen && door.openingAngle) {
    const radius = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
    const startAngle = Math.atan2(y2 - y1, x2 - x1)
    const endAngle = startAngle + (door.openingAngle * Math.PI) / 180

    ctx.beginPath()
    ctx.arc(x1, y1, radius, startAngle, endAngle)
    ctx.strokeStyle = "#A855F7" // Purple-500
    ctx.lineWidth = 1
    ctx.stroke()
  }
}

// Draw windows
const drawWindow = (
  ctx: CanvasRenderingContext2D,
  window: Window,
  data: FloorPlanData,
  canvasWidth: number,
  canvasHeight: number,
) => {
  const [x1, y1] = scaleCoordinates(window.start.x, window.start.y, data, canvasWidth, canvasHeight)
  const [x2, y2] = scaleCoordinates(window.end.x, window.end.y, data, canvasWidth, canvasHeight)

  // Calculate the window width in pixels
  const windowWidth = (window.width * canvasWidth) / data.dimensions.width

  // Draw the window opening
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.strokeStyle = "#FFFFFF"
  ctx.lineWidth = windowWidth
  ctx.stroke()

  // Draw the glass
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.strokeStyle = "#E9D5FF" // Purple-200
  ctx.lineWidth = windowWidth - 2
  ctx.stroke()
}

// Draw furniture
const drawFurniture = (
  ctx: CanvasRenderingContext2D,
  furniture: Furniture,
  data: FloorPlanData,
  canvasWidth: number,
  canvasHeight: number,
) => {
  const [x, y] = scaleCoordinates(furniture.position.x, furniture.position.y, data, canvasWidth, canvasHeight)
  const width = (furniture.width * canvasWidth) / data.dimensions.width
  const height = (furniture.height * canvasHeight) / data.dimensions.height

  // Save the current context state
  ctx.save()

  // Apply rotation if specified
  if (furniture.rotation) {
    ctx.translate(x, y)
    ctx.rotate((furniture.rotation * Math.PI) / 180)
    ctx.translate(-x, -y)
  }

  // Draw the furniture based on its type
  ctx.fillStyle = "#C084FC" // Purple-400

  switch (furniture.type) {
    case "bed":
      ctx.fillStyle = "#DDD6FE" // Purple-200
      ctx.fillRect(x - width / 2, y - height / 2, width, height)

      // Draw pillow
      ctx.fillStyle = "#FFFFFF"
      ctx.fillRect(x - width / 2 + width * 0.1, y - height / 2 + height * 0.1, width * 0.35, height * 0.25)
      break

    case "table":
      ctx.fillStyle = "#A78BFA" // Purple-400
      ctx.fillRect(x - width / 2, y - height / 2, width, height)
      break

    case "chair":
      ctx.fillStyle = "#8B5CF6" // Purple-500
      ctx.fillRect(x - width / 2, y - height / 2, width, height)
      break

    case "sofa":
      ctx.fillStyle = "#7C3AED" // Purple-600
      ctx.fillRect(x - width / 2, y - height / 2, width, height)

      // Draw armrests
      ctx.fillStyle = "#6D28D9" // Purple-700
      const armWidth = width * 0.1
      ctx.fillRect(x - width / 2, y - height / 2, armWidth, height)
      ctx.fillRect(x + width / 2 - armWidth, y - height / 2, armWidth, height)
      break

    default:
      ctx.fillRect(x - width / 2, y - height / 2, width, height)
  }

  // Restore the context state
  ctx.restore()
}

// Draw cameras and their field of view
const drawCamera = (
  ctx: CanvasRenderingContext2D,
  camera: Camera,
  data: FloorPlanData,
  canvasWidth: number,
  canvasHeight: number,
) => {
  const [x, y] = scaleCoordinates(camera.position.x, camera.position.y, data, canvasWidth, canvasHeight)

  // Scale the range for canvas dimensions
  const range = (camera.range * canvasWidth) / data.dimensions.width

  // Draw the camera coverage area
  if (camera.isActive) {
    // Calculate the start and end angles for the field of view
    const startAngle = (((camera.direction - camera.fieldOfView / 2) % 360) * Math.PI) / 180
    const endAngle = (((camera.direction + camera.fieldOfView / 2) % 360) * Math.PI) / 180

    // Draw the field of view as a semi-transparent sector
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.arc(x, y, range, startAngle, endAngle)
    ctx.closePath()

    // Fill with semi-transparent purple
    ctx.fillStyle = "rgba(147, 51, 234, 0.2)" // Purple-600 with opacity
    ctx.fill()

    // Draw the outline of the field of view
    ctx.strokeStyle = "rgba(126, 34, 206, 0.5)" // Purple-700 with opacity
    ctx.lineWidth = 1
    ctx.stroke()
  }

  // Draw the camera icon
  const cameraSize = 15

  // Save context for rotation
  ctx.save()

  // Move to the camera position and rotate according to camera direction
  ctx.translate(x, y)
  ctx.rotate((camera.direction * Math.PI) / 180)

  // Draw camera body
  ctx.fillStyle = camera.isActive ? "#8B5CF6" : "#A1A1AA" // Purple-500 or gray
  ctx.fillRect(-cameraSize / 2, -cameraSize / 2, cameraSize, cameraSize)

  // Draw camera lens
  ctx.beginPath()
  ctx.arc(-cameraSize / 2, 0, cameraSize / 4, 0, Math.PI * 2)
  ctx.fillStyle = "#000000"
  ctx.fill()

  // Draw indicator light
  ctx.beginPath()
  ctx.arc(cameraSize / 3, -cameraSize / 3, cameraSize / 6, 0, Math.PI * 2)
  ctx.fillStyle = camera.isActive ? "#10B981" : "#EF4444" // Green or red
  ctx.fill()

  // Restore context
  ctx.restore()
}

// Main render function
export const renderFloorPlan = (
  ctx: CanvasRenderingContext2D,
  data: FloorPlanData,
  canvasWidth: number,
  canvasHeight: number,
) => {
  // Draw border
  ctx.strokeStyle = "#7C3AED" // Purple-600
  ctx.lineWidth = 4
  ctx.strokeRect(2, 2, canvasWidth - 4, canvasHeight - 4)

  // Draw all walls
  data.walls.forEach((wall) => {
    drawWall(ctx, wall, data, canvasWidth, canvasHeight)
  })

  // Draw all windows if any
  if (data.windows) {
    data.windows.forEach((window) => {
      drawWindow(ctx, window, data, canvasWidth, canvasHeight)
    })
  }

  // Draw all doors if any
  if (data.doors) {
    data.doors.forEach((door) => {
      drawDoor(ctx, door, data, canvasWidth, canvasHeight)
    })
  }

  // Draw all furniture items if any
  if (data.furniture) {
    data.furniture.forEach((furniture) => {
      drawFurniture(ctx, furniture, data, canvasWidth, canvasHeight)
    })
  }

  // Draw all cameras and their coverage areas if any
  if (data.cameras) {
    data.cameras.forEach((camera) => {
      drawCamera(ctx, camera, data, canvasWidth, canvasHeight)
    })
  }
}
