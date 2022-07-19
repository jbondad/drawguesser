import React from "react";
import { useEffect, useState, useRef } from "react";
import socket from "../socket/socket";
import { useSelector } from "react-redux";

export default function Canvas({ color, strokeWidth }) {
  const canvasRef = useRef(null); // useRef is a hook that creates a reference to the dom element.
  const contextRef = useRef(null); // al can be used to preserve information between rerenders
  const [isDrawing, setIsDrawing] = useState(false);
  const currentDrawer = useSelector((state) => state.lobby.game.currentDrawer);
  const code = useSelector((state) => state.lobby.roomCode);
  const username = useSelector((state) => state.auth.user.username);

  useEffect(() => {
    if (contextRef) {
      socket.on("drawLine", (line) => {
        draw(line.x, line.y, line.state, line.color);
      });
    }
  }, [contextRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.style.width = `100%`;
    canvas.style.height = `100%`;
    console.log(canvas.offsetWidth);
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    console.log(canvas.height);
    console.log(canvasRef.current.height);

    const context = canvas.getContext("2d");
    context.scale(2, 2);
    context.lineCap = "round"; // lines will have round endinges
    context.lineWidth = 4;
    contextRef.current = context;

    socket.on("clearDrawing", () => {
      clearCanvas();
    });
  }, []);

  const draw = (x, y, state, color) => {
    if (state === "startDrawing") {
      contextRef.current.strokeStyle = color;
      contextRef.current.beginPath();
      contextRef.current.moveTo(x, y);
    } else if (state === "drawing") {
      contextRef.current.lineTo(x, y);
      contextRef.current.stroke();
    } else {
      contextRef.current.closePath();
    }
  };

  const handleMouseDown = ({ nativeEvent }) => {
    if (username == currentDrawer) {
      const { offsetX, offsetY } = nativeEvent;
      draw(offsetX, offsetY, "startDrawing", color);
      setIsDrawing(true);
      emitDrawingData({ x: offsetX, y: offsetY, state: "startDrawing", color });
    }
  };

  function emitDrawingData(data) {
    socket.emit("draw", { code: code, line: data });
  }

  const handleMouseUp = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    draw(offsetX, offsetY, "endDrawing", color);
    setIsDrawing(false);
    emitDrawingData({ x: offsetX, y: offsetY, state: "endDrawing", color });
  };

  const clearCanvas = () => {
    console.log("clearing", canvasRef.current.height);
    contextRef.current.clearRect(
      0,
      0,
      canvasRef.current.offsetWidth * 2,
      canvasRef.current.offsetHeight * 2
    );
  };

  const handleMouseMove = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent; // everytime moouse is moved we draw a line to new coordinate, offsetx and offset y are relative to the parent container
    if (!isDrawing) {
      return;
    }
    draw(offsetX, offsetY, "drawing", color);
    emitDrawingData({ x: offsetX, y: offsetY, state: "drawing", color });
  };

  const handleMouseLeave = () => {
    setIsDrawing(false);
    contextRef.current.closePath();
  };

  return (
    <>
      <canvas
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        ref={canvasRef}
      />
    </>
  );
}
