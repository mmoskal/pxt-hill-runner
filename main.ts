const bg = screen.clone()
let frac = 0
let pos = 0
let speed = 100

function scroll(dx: number) {
    // waits for https://github.com/microsoft/pxt-arcade/issues/1293
    if (control.ramSize() > 1000000) {
        const copy = bg.clone()
        bg.drawImage(copy, dx, 0)
    } else {
        bg.scroll(dx, 0)
    }
}
scene.setBackgroundImage(bg)

const spr = sprites.create(circuitplayground.Adabot)
spr.x = 40
spr.ay = 300

let currH = 20
let targetH = currH
function drawRow(x: number) {
    if (currH == targetH) {
        if (Math.randomRange(0, 20) == 0) {
            targetH += Math.randomRange(-30, 30)
            targetH = Math.clamp(60, 100, targetH)
        }
    }
    currH += Math.sign(targetH - currH)
    bg.drawLine(x, 0, x, currH, 0)
    bg.drawLine(x, currH, x, bg.height, 2)
    bg.drawLine(x, currH + 3, x, bg.height, 4)
}

for (let i = 0; i < bg.width; ++i)
    drawRow(i)

function moveToFloor(spr: Sprite) {
    let y = spr.y
    while (bg.getPixel(spr.x, y)) {
        y--
    }
    while (!bg.getPixel(spr.x, y)) {
        y++
    }
    y -= 5
    if (spr.y > y) {
        spr.y = y
        spr.vy = 0
    }
}

controller.anyButton.onEvent(ControllerButtonEvent.Pressed, function () {
    spr.vy = -100
})

game.onUpdate(function () {
    let delta = speed * control.eventContext().deltaTime + frac
    let deltaI = Math.floor(delta)
    frac = delta - deltaI
    if (deltaI) {
        scroll(-deltaI)
        for (let i = bg.width - deltaI; i < bg.width; ++i)
            drawRow(i)
    }
    moveToFloor(spr)
})