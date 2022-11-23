function createCanvas(width, height) {
    let canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.style.border = "1px dashed #efefef";
    return canvas;
}

function Point(x, y, color = "green") {
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 10;
    this.color = color;
}

/**
 *
 * @param {CanvasRenderingContext2D} context
 */
Point.prototype.draw = function (context) {
    context.save();
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height);
    context.restore();
};

let width = 200;
let height = 200;
let score = 0;
let canvas = createCanvas(width, height);
let context = canvas.getContext("2d");
let isCheat = false;

document.body.append(canvas);

let objectPool = [];

objectPool.push(new Point(Math.floor(width / 2), Math.floor(height / 2), "red"));
objectPool.push(new Point(Math.floor(Math.random() * width), Math.floor(Math.random() * height)));

function draw() {
    context.clearRect(0, 0, width, height);
    operate();
    let length = objectPool.length;
    for (let i = 0; i < length; i++) {
        objectPool[i].draw(context);
    }
    context.fillText("score:" + score, 10, 15);
    isCheat && cheat();
}

requestAnimationFrame(function () {
    draw();
    requestAnimationFrame(arguments.callee);
});

let op = {
    ArrowRight: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowUp: false,
};

function checkCollision(p1, p2) {
    let x = Math.max(p1.x, p2.x);
    let y = Math.max(p1.y, p2.y);
    let w = Math.min(p1.x + p1.width, p2.x + p2.width) - x;
    let h = Math.min(p1.y + p1.height, p2.y + p2.height) - y;
    if (w > 0 && h > 0) return true;
    return false;
}

function operate() {
    if (checkCollision(objectPool[0], objectPool.at(-1))) {
        score++;
        objectPool.at(-1).color = "red";
        objectPool.push(new Point(Math.floor(Math.random() * width), Math.floor(Math.random() * height)));
    }

    let headPoint = new Point(objectPool[0].x, objectPool[0].y, 'red');
    if (op.ArrowRight) headPoint.x = (headPoint.x + width + 1) % width;
    else if (op.ArrowDown) headPoint.y = (headPoint.y + height + 1) % height;
    else if (op.ArrowLeft) headPoint.x = (headPoint.x + width - 1) % width;
    else if (op.ArrowUp) headPoint.y = (headPoint.y + height - 1) % height;
    objectPool.unshift(headPoint);
    objectPool.splice(objectPool.length-2, 1);
}

document.body.onkeydown = function (e) {
    // console.log(e);
    op = {
        ArrowRight: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowUp: false,
    };
    op[e.key] = true;
    if (e.key == "k") {
        isCheat = !isCheat;
    }
};
document.body.onkeyup = function (e) {
    // console.log(e);
    // op[e.key] = false;
};

function cheat() {
    // console.log('cheat');
    op = {
        ArrowRight: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowUp: false,
    };
    let a = objectPool[0];
    let b = objectPool.at(-1);
    if (Math.abs(a.x - b.x) > Math.abs(a.y - b.y)) {
        if (a.x < b.x) op["ArrowRight"] = true;
        else op["ArrowLeft"] = true;
    } else {
        if (a.y < b.y) op["ArrowDown"] = true;
        else op["ArrowUp"] = true;
    }
}
