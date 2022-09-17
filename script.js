const canvas = document.getElementById("myCanvas")
canvas.width = document.body.offsetWidth
canvas.height = document.body.offsetHeight
const ctx = canvas.getContext("2d")

const airplaneLocation = [120, 120]
const eAirport = [800, 350]
const distance = 50

const img = new Image(50, 50)
img.src = "airplane.png"

img.addEventListener('load', () => draw([120, 200]))

const vectorSize = (vec) => Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1])
const minus = (b, a) => [b[0] - a[0], b[1] - a[1]]
const plus = (a, b) => [a[0] + b[0], a[1] + b[1]]
const scale = (a, v) => [a * v[0], a * v[1]]

const calculateUnitVector = (vec) => {
   const size = vectorSize(vec)
   return [vec[0] / size, vec[1] / size]
}

function draw(estimatedLocation) {
   const vecAirplaneToEstimation = minus(estimatedLocation, airplaneLocation)
   const dirAirplaneToEstimation = calculateUnitVector(vecAirplaneToEstimation)
   const angle = (dirAirplaneToEstimation[1] < 0 ? -1 : 1) * Math.acos(dirAirplaneToEstimation[0])

   const adjustedDistance = Math.min(vectorSize(minus(estimatedLocation, eAirport)), 2 * distance) / 2

   const bezierControlPoint = plus(scale(adjustedDistance, dirAirplaneToEstimation), estimatedLocation)

   const vecControlPointToEndAirport = minus(eAirport, bezierControlPoint)
   const dirControlPointToEndAirport = calculateUnitVector(vecControlPointToEndAirport)

   const cappedDistance = Math.min(adjustedDistance, vectorSize(vecControlPointToEndAirport))
   const bezierEndPoint = plus(scale(cappedDistance, dirControlPointToEndAirport), bezierControlPoint)

   ctx.save()

   ctx.beginPath();
   ctx.moveTo(...estimatedLocation);
   ctx.quadraticCurveTo(...bezierControlPoint, ...bezierEndPoint);
   ctx.stroke();

   ctx.beginPath();
   ctx.moveTo(...bezierEndPoint);
   ctx.lineTo(...eAirport);
   ctx.strokeStyle = '#ff0000';
   ctx.stroke();

   ctx.beginPath();
   ctx.moveTo(...airplaneLocation);
   ctx.lineTo(...estimatedLocation);
   ctx.strokeStyle = '#ff0000';
   ctx.stroke();

   const pos = [-img.width / 2, -img.height / 2]
   ctx.translate(...airplaneLocation)
   ctx.rotate(Math.PI / 4)
   ctx.rotate(angle)
   ctx.drawImage(img, ...pos, img.width, img.height)
   ctx.restore()
}

canvas.onmousemove = (e) => {
   var rect = canvas.getBoundingClientRect();
   ctx.clearRect(0, 0, canvas.width, canvas.height)
   draw([e.clientX - rect.left, e.clientY - rect.top])
}