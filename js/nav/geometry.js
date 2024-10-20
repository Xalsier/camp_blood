let currentShape = null;
let currentLineType = 'horizontal';
let userActions = [];
const gridSize = 20;

let isPanning = false;
let startX = 0;
let startY = 0;
let offsetX = 0;
let offsetY = 0;

function drawAllShapes(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.save();
    ctx.translate(offsetX, offsetY); // Apply panning offset

    userActions.forEach(action => {
        if (action.shape === 'square') {
            drawOptimizedSquare(ctx, action.x, action.y, action.size);
        } else if (action.shape === 'line') {
            drawLine(ctx, action.x, action.y, action.size, action.lineType);
        } else if (action.shape === 'circle') {
            drawCircle(ctx, action.x, action.y, action.size);
        }
    });

    ctx.restore();
}

function drawOptimizedSquare(ctx, x, y, size) {
    ctx.beginPath();
    ctx.strokeStyle = '#00f6ff';
    ctx.lineWidth = 2;

    const left = x;
    const right = x + size;
    const top = y;
    const bottom = y + size;

    const drawTopLine = !isSquarePresent(x, y - size);
    const drawRightLine = !isSquarePresent(x + size, y);
    const drawBottomLine = !isSquarePresent(x, y + size);
    const drawLeftLine = !isSquarePresent(x - size, y);

    if (drawTopLine) {
        ctx.moveTo(left, top);
        ctx.lineTo(right, top);
    }
    if (drawRightLine) {
        ctx.moveTo(right, top);
        ctx.lineTo(right, bottom);
    }
    if (drawBottomLine) {
        ctx.moveTo(left, bottom);
        ctx.lineTo(right, bottom);
    }
    if (drawLeftLine) {
        ctx.moveTo(left, top);
        ctx.lineTo(left, bottom);
    }

    ctx.stroke();
    ctx.closePath();
}

function isSquarePresent(x, y) {
    return userActions.some(action => action.shape === 'square' && action.x === x && action.y === y);
}

function drawLine(ctx, x, y, size, lineType) {
    ctx.beginPath();
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 2;

    if (lineType === 'horizontal') {
        ctx.moveTo(x, y);
        ctx.lineTo(x + size, y);
    } else if (lineType === 'vertical') {
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + size);
    }

    ctx.stroke();
    ctx.closePath();
}

function drawCircle(ctx, x, y, size) {
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2, false);
    ctx.fillStyle = '#00ff00';
    ctx.fill();
    ctx.closePath();
}

function populateGeometrySection() {
    const canvas = document.getElementById('geometryCanvas');
    const ctx = canvas.getContext('2d');

    const squareButton = document.getElementById('squareButton');
    const lineButton = document.getElementById('lineButton');
    const circleButton = document.getElementById('circleButton');

    squareButton.addEventListener('click', function() {
        currentShape = 'square';
        canvas.style.cursor = 'crosshair';
    });

    lineButton.addEventListener('click', function() {
        currentShape = 'line';
        canvas.style.cursor = 'crosshair';
    });

    circleButton.addEventListener('click', function() {
        currentShape = 'circle';
        canvas.style.cursor = 'crosshair';
    });

    // Deselect shape when clicking outside buttons (for panning)
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.button-container') && !event.target.closest('#geometryCanvas')) {
            currentShape = null;
            canvas.style.cursor = 'grab';
        }
    });

    // Update line type and rotate the button
    lineButton.addEventListener('dblclick', function() {
        currentLineType = currentLineType === 'horizontal' ? 'vertical' : 'horizontal';
        lineButton.classList.toggle('vertical', currentLineType === 'vertical');
    });

    // Drawing shapes
    canvas.addEventListener('click', function(event) {
        if (currentShape) {
            const rect = canvas.getBoundingClientRect();
            let x = event.clientX - rect.left - offsetX;
            let y = event.clientY - rect.top - offsetY;

            const size = gridSize;

            if (currentShape === 'circle') {
                // Place circle exactly where clicked, smaller size
                userActions.push({ shape: 'circle', x, y, size: size / 2 });
            } else {
                // Snap to grid for squares and lines
                x = Math.floor(x / gridSize) * gridSize;
                y = Math.floor(y / gridSize) * gridSize;

                if (currentShape === 'square') {
                    userActions.push({ shape: 'square', x, y, size });
                } else if (currentShape === 'line') {
                    userActions.push({ shape: 'line', x, y, size, lineType: currentLineType });
                }
            }
            drawAllShapes(ctx);
        }
    });

    // Panning functionality
    canvas.addEventListener('mousedown', function(event) {
        if (!currentShape) {
            isPanning = true;
            startX = event.clientX - offsetX;
            startY = event.clientY - offsetY;
            canvas.style.cursor = 'grabbing';
        }
    });

    canvas.addEventListener('mousemove', function(event) {
        if (isPanning) {
            offsetX = event.clientX - startX;
            offsetY = event.clientY - startY;
            drawAllShapes(ctx);
        }
    });

    canvas.addEventListener('mouseup', function() {
        isPanning = false;
        canvas.style.cursor = 'grab';
    });

    canvas.addEventListener('mouseleave', function() {
        isPanning = false;
        canvas.style.cursor = 'grab';
    });
}

function initializeGeometry() {
    populateGeometrySection();
}

