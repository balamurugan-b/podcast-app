import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

const VisualizerContainer = styled.div`
  width: 100%;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
`;

const AudioVisualizer = ({ audio }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [audioContext] = useState(() => new (window.AudioContext || window.webkitAudioContext)());
  const [analyser] = useState(() => audioContext.createAnalyser());
  const [sourceNode, setSourceNode] = useState(null);

  useEffect(() => {
    if (!audio) return;

    if (!sourceNode) {
      const newSourceNode = audioContext.createMediaElementSource(audio);
      newSourceNode.connect(analyser);
      analyser.connect(audioContext.destination);
      setSourceNode(newSourceNode);
    }

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = 'rgb(255, 255, 255)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 2;

        ctx.fillStyle = `rgb(${barHeight + 100}, 50, 200)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [audio, audioContext, analyser, sourceNode]);

  return (
    <VisualizerContainer>
      <Canvas ref={canvasRef} />
    </VisualizerContainer>
  );
};

export default AudioVisualizer;