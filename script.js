const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const sizeInput = document.getElementById('size-input');
const colorInput = document.getElementById('color-input');
const toolButtons = document.querySelectorAll('[data-tool]');

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let brushSize = Number(sizeInput.value);
let brushColor = colorInput.value;
let currentTool = 'draw';

function startDrawing(event){
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

canvas.addEventListener('pointerdown', startDrawing);
canvas.addEventListener('pointermove', draw);
canvas.addEventListener('pointerup', stopDrawing);
canvas.addEventListener('pointerleave', stopDrawing);

sizeInput.addEventListener('input', sizeChange);
colorInput.addEventListener('input', colorChange);

for (const button of toolButtons){
    button.addEventListener('click', toolClick);
}

setTool(currentTool);
