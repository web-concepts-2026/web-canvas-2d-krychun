const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const sizeInput = document.getElementById('size-input');
const colorInput = document.getElementById('color-input');
const toolButtons = document.querySelectorAll('[data-tool]');
const undoButton = document.getElementById('undo-btn');
const clearButton = document.getElementById('clear-btn');

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let brushSize = Number(sizeInput.value);
let brushColor = colorInput.value;
let currentTool = 'draw';
const max_undo = 30;
let undoStack = [];

function startDrawing(event){
    saveSnapshot();

    if (currentTool === 'stamp'){
        placeStamp(event.offsetX, event.offsetY);
        return;
    }

    isDrawing = true;
    lastX = event.offsetX;
    lastY = event.offsetY;
}

function draw(event){
    if (!isDrawing) return;

    ctx.lineWidth = brushSize;
    ctx.strokeStyle = brushColor;
    ctx.lineCap = 'round';

    if (currentTool === 'erase'){
        ctx.globalCompositeOperation = 'destination-out';
    } else{
        ctx.globalCompositeOperation = 'source-over';
    }

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();

    lastX = event.offsetX;
    lastY = event.offsetY;
}

function stopDrawing(){
    isDrawing = false;
}

function sizeChange(){
    brushSize = Number(sizeInput.value);
}

function colorChange(){
    brushColor = colorInput.value;
}

function setTool(tool){
    currentTool = tool;

    for (const button of toolButtons){
        button.classList.toggle('active', button.dataset.tool === tool);
    }
}

function toolClick(event){
    setTool(event.currentTarget.dataset.tool);
}

function saveSnapshot(){
    const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    undoStack.push(snapshot);

    if (undoStack.length > max_undo){
        undoStack.shift();
    }
}

function undo(){
    if (undoStack.length === 0) return;

    const previous = undoStack.pop();
    ctx.putImageData(previous, 0, 0);
}

function clearCanvas(){
    saveSnapshot();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function placeStamp(x, y){
    const outerRadius = brushSize * 2 + 8;
    const innerRadius = outerRadius * 0.4;

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = brushColor;
    ctx.beginPath();

    for (let i = 0; i < 10; i++){
        const angle = -Math.PI / 2 + (i * Math.PI) / 5;
        let radius;
        if (i % 2 === 0){
            radius = outerRadius;
        } else{
            radius = innerRadius;
        }

        const pointX = x + radius * Math.cos(angle);
        const pointY = y + radius * Math.sin(angle);

        if (i === 0){
            ctx.moveTo(pointX, pointY);
        } else{
            ctx.lineTo(pointX, pointY);
        }
    }

    ctx.closePath();
    ctx.fill();
}

canvas.addEventListener('pointerdown', startDrawing);
canvas.addEventListener('pointermove', draw);
canvas.addEventListener('pointerup', stopDrawing);
canvas.addEventListener('pointerleave', stopDrawing);

sizeInput.addEventListener('input', sizeChange);
colorInput.addEventListener('input', colorChange);

for (const button of toolButtons){
    button.addEventListener('click', toolClick);
}

undoButton.addEventListener('click', undo);
clearButton.addEventListener('click', clearCanvas);

setTool(currentTool);
