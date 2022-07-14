import React, { useEffect } from 'react'
import socket from '../socket/socket';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function GamePage() {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  
  useEffect(() => {
    socket.on('roomCode');

  },[])

  return (
    <div>GamePage</div>
  )
}
