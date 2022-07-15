import React from 'react'
import { useEffect, useState, useRef } from 'react';
import socket from '../socket/socket';

export default function Canvas() {

    
const canvasRef = useRef(null); // useRef is a hook that creates a reference to the dom element.
const contextRef = useRef(null) // al can be used to preserve information between rerenders
const [isDrawing, setIsDrawing] = useState(false);

useEffect(() => {
  if(contextRef){
    socket.on('drawLine', (line) => {
      draw(line.x,line.y, line.state);
    })

  }

}, [contextRef])

useEffect(()=> {
  const canvas = canvasRef.current;
  canvas.style.width = `100%`;
  canvas.style.height = `80%`;
  canvas.style.border = '1px solid black'
  canvas.width = canvas.offsetWidth * 2;
  canvas.height = canvas.offsetHeight * 2;


  const context = canvas.getContext("2d")
  context.scale(2,2)
  context.lineCap = "round" // lines will have round endinges
  context.strokeStyle = "black" // color
  context.lineWidth = 5
  contextRef.current = context;

},[])

const draw = (x, y, state) => {
  if(state === 'startDrawing'){
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
  } else if (state === 'drawing'){
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  } else {
    contextRef.current.closePath()
  }
}

const handleMouseDown = ({nativeEvent}) => {
  const {offsetX, offsetY} = nativeEvent;
  draw(offsetX, offsetY, 'startDrawing')
  setIsDrawing(true);
  socket.emit('draw', {x: offsetX,y:offsetY,state:'startDrawing'});
}

const handleMouseUp = ({nativeEvent}) => {
  const {offsetX, offsetY} = nativeEvent;
  draw(offsetX, offsetY, 'endDrawing')
  setIsDrawing(false);
  socket.emit('draw', {x: offsetX,y:offsetY,state:'endDrawing'});
}

const clearCanvas = () => {
  contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
}

const handleMouseMove =({nativeEvent}) => {
  const {offsetX, offsetY} = nativeEvent; // everytime moouse is moved we draw a line to new coordinate, offsetx and offset y are relative to the parent container
  if(!isDrawing){
    return;
  }
  draw(offsetX,offsetY,'drawing');
  socket.emit('draw', {x: offsetX,y:offsetY,state:'drawing'});
}

const handleMouseLeave= () =>{
    setIsDrawing(false);
    contextRef.current.closePath()
}

  return (
    <canvas
    onMouseDown={handleMouseDown}
    onMouseUp={handleMouseUp}
    onMouseMove={handleMouseMove}
    onMouseLeave={handleMouseLeave}
    ref={canvasRef}
  />
  )
}
