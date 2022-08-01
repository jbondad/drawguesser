import React from "react";
import { useEffect, useState, useRef } from "react";
import socket from "../socket/socket";
import { useSelector } from "react-redux";

export default function Canvas({ color, strokeWidth }) {
  // todo: change stroke width
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
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
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;

    const context = canvas.getContext("2d");
    context.scale(2, 2);
    context.lineCap = "round";
    context.lineWidth = 4;
    contextRef.current = context;

    socket.on("clearDrawing", () => {
      clearCanvas(canvas);
    });
  }, [canvasRef]);

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

  const clearCanvas = (canvas) => {
    contextRef.current.clearRect(
      0,
      0,
      canvas.offsetWidth * 2,
      canvas.offsetHeight * 2
    );
  };

  const handleMouseMove = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
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
