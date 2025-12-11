var width, height, canvas, ctx, points, target, animateHeader = true;
var pointDistance = 45; // Distance between points
var pointRadius = 2; // Circle radius

initHeader();
initAnimation();
addListeners();

function initHeader() {
    width = window.innerWidth;
    height = window.innerHeight;
    target = {};

    canvas = document.getElementById('background-canvas');
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext('2d');
    initPoints();
}

function addListeners() {
    if (!('ontouchstart' in window)) {
        window.addEventListener('mousemove', mouseMove);
    }
    window.addEventListener('resize', resize);
}

function initAnimation() {
    animate();
}

function animate() {
    if (animateHeader) {
        drawPoints();
    }
    requestAnimationFrame(animate);
}

function mouseMove(e) {
    target.x = e.clientX || 0;
    target.y = e.clientY || 0;
}

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    points.forEach((point) => gsap.killTweensOf(point));
    initPoints();
}

function initPoints() {
    points = [];
    for (let x = 0; x <= width / pointDistance; x++) {
        for (let y = 0; y <= height / pointDistance; y++) {
            let px = x * pointDistance;
            let py = y * pointDistance;
            let p = { x: px, originX: px, y: py, originY: py };
            points.push(p);
        }
    }

    points.forEach((p1) => {
        let closest = [];
        points.forEach((p2) => {
            if (p1 !== p2) {
                if (closest.length < 5) {
                    closest.push(p2);
                } else {
                    closest.sort((a, b) => getDistance(p1, a) - getDistance(p1, b));
                    if (getDistance(p1, p2) < getDistance(p1, closest[4])) {
                        closest[4] = p2;
                    }
                }
            }
        });
        p1.closest = closest;
    });

    points.forEach((point) => {
        point.circle = new Circle(point, pointRadius, 'rgba(255,255,255,0.3)');
        shiftPoint(point);
    });
}

function drawPoints() {
    ctx.clearRect(0, 0, width, height);

    points.forEach((point) => {
        if (target.x && target.y) {
            let distance = getDistance(target, point);
            point.opacity = distance < 4000 ? 0.3 : distance < 20000 ? 0.1 : distance < 40000 ? 0.02 : 0;
            point.circle.opacity = distance < 4000 ? 1 : distance < 20000 ? 1 : distance < 40000 ? 0.8 : 0.7;
        }
        drawLines(point);
        point.circle.draw();
    });
}

function shiftPoint(p) {
    gsap.to(p, {
        x: p.originX + Math.random() * (pointDistance / 2),
        y: p.originY + Math.random() * (pointDistance / 2),
        duration: 1 + Math.random(),
        ease: "power1.inOut",
        onComplete: () => shiftPoint(p),
    });
}

function drawLines(p) {
    if (p.opacity > 0) {
        p.closest.forEach((neighbor) => {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(neighbor.x, neighbor.y);
            ctx.strokeStyle = `rgba(255,255,255,${p.opacity})`;
            ctx.stroke();
        });
    }
}

function Circle(pos, rad, color) {
    this.pos = pos || null;
    this.radius = rad || null;
    this.color = color || null;

    this.draw = function () {
        if (this.opacity > 0) {
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = `rgba(255,255,255,${this.opacity})`;
            ctx.fill();
        }
    };
}

function getDistance(p1, p2) {
    return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
}