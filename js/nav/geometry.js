let currentShape = null;
let currentLineType = 'horizontal';
let userActions = [];
const gridSize = 20;

let isPanning = false;
let startX = 0;
let startY = 0;
let offsetX = 0;
let offsetY = 0;

const canvas = document.getElementById('geometryCanvas');
const ctx = canvas.getContext('2d');

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
            drawCircle(ctx, action.x, action.y, action.size, action.label);
        }
    });

    ctx.restore();
}

function drawOptimizedSquare(ctx, x, y, size) {
    ctx.beginPath();
    ctx.strokeStyle = 'white';
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

function drawCircle(ctx, x, y, size, label) {
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2, false);
    ctx.fillStyle = '#00ff00';
    ctx.fill();
    ctx.closePath();

    if (label) {
        ctx.font = '12px Arial';
        const textWidth = ctx.measureText(label).width;
        const textHeight = 12; // Approximate height of the text
        const labelOffset = 10; // Number of pixels to offset the label above the circle

        // Draw the text label above the circle
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, x, y - size / 2 - labelOffset);
    }
}


function isCircleNearby(x, y, radius) {
    return userActions.some(action => {
        if (action.shape === 'circle') {
            const dx = action.x - x;
            const dy = action.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < radius;
        }
        return false;
    });
}

function showLabelInput(x, y, callback) {
    const input = document.createElement('input');
    input.type = 'text';
    input.style.position = 'absolute';

    const canvasRect = canvas.getBoundingClientRect();
    input.style.left = (x + offsetX + canvasRect.left) + 'px';
    input.style.top = (y + offsetY + canvasRect.top) + 'px';

    input.style.transform = 'translate(-50%, -50%)'; // Center over the circle
    input.style.background = 'white';
    input.style.color = 'black';
    input.style.border = '1px solid black';
    input.style.fontSize = '12px';
    document.body.appendChild(input);
    input.focus();

    function onInputKeyDown(e) {
        if (e.key === 'Enter') {
            const label = input.value;
            document.body.removeChild(input);
            input.removeEventListener('keydown', onInputKeyDown);
            callback(label);
        }
    }

    input.addEventListener('keydown', onInputKeyDown);
}

function populateGeometrySection() {
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

            if (currentShape === 'circle') {
                const size = gridSize / 2;
                if (!isCircleNearby(x, y, size)) {
                    userActions.push({ shape: 'circle', x, y, size, label: '' });
                    drawAllShapes(ctx);
                    // Show label input
                    showLabelInput(x, y, function(label) {
                        userActions[userActions.length - 1].label = label;
                        drawAllShapes(ctx);
                    });
                } else {
                    alert('A circle is already placed too close to this position.');
                }
            } else {
                // Snap to grid for squares and lines
                x = Math.floor(x / gridSize) * gridSize;
                y = Math.floor(y / gridSize) * gridSize;
                const size = gridSize;

                if (currentShape === 'square') {
                    userActions.push({ shape: 'square', x, y, size });
                } else if (currentShape === 'line') {
                    userActions.push({ shape: 'line', x, y, size, lineType: currentLineType });
                }
                drawAllShapes(ctx);
            }
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

document.addEventListener('DOMContentLoaded', function() {
    initializeGeometry();
});
