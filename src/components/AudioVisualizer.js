import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

const VisualizerContainer = styled.div`
  width: 100%;
  height: 60px;
  background-color: #f0f0f0;
  position: relative;
  overflow: hidden;
`;

const VisualizerCanvas = styled.canvas`
  width: 100%;
  height: 100%;
`;

const TimeIndicator = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  background-color: rgba(255, 87, 34, 0.7);
  color: white;
  padding: 2px 4px;
  font-size: 12px;
`;

const AudioVisualizer = ({ audioElement, audioContext }) => {
  const canvasRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!audioElement || !audioContext) return;

    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audioElement);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');

    const draw = () => {
      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      canvasCtx.fillStyle = '#f0f0f0';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / bufferLength * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        const redComponent = Math.min(255, (i * 2) + 50);
        canvasCtx.fillStyle = `rgb(${redComponent}, 87, 34)`;
        canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }

      setCurrentTime(audioElement.currentTime);
    };

    draw();

    return () => {
      source.disconnect();
      analyser.disconnect();
    };
  }, [audioElement, audioContext]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <VisualizerContainer>
      <VisualizerCanvas ref={canvasRef} />
      <TimeIndicator>{formatTime(currentTime)}</TimeIndicator>
    </VisualizerContainer>
  );
};

export default AudioVisualizer;