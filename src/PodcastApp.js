import React, { useState, useRef } from 'react';
import axios from 'axios';
import './App.css';

const PodcastApp = () => {
    const [urls, setUrls] = useState('');
    const [audios, setAudios] = useState([]);
    const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const audioRef = useRef(null);

    const validateUrls = (urls) => {
        return urls.split('\n').every(url => url.startsWith('http'));
    };

    const handleSubmit = async () => {
        if (!validateUrls(urls)) {
            alert('Please enter valid URLs.');
            return;
        }

        const urlList = (urls || '').split('\n').filter(url => url.trim() !== '');

        setLoading(true);
        setAudios([]);  // Clear previous audios
        for (const url of urlList) {
            try {
                const response = await axios.post('http://127.0.0.1:8000/generate_podcast', {
                    url: url,
                    two_speakers: true,
                    add_background: true
                }, {
                    responseType: 'blob' // Important for handling binary data (audio file)
                });
                
                const audioUrl = URL.createObjectURL(new Blob([response.data], { type: 'audio/mpeg' }));
                setAudios(prevAudios => [...prevAudios, audioUrl]);

            } catch (error) {
                console.error('Error generating podcast:', error);
            }
        }
        setLoading(false);
    };

    const handleNext = () => {
        setCurrentAudioIndex((prevIndex) => (prevIndex + 1) % audios.length);
    };

    const handlePrevious = () => {
        setCurrentAudioIndex((prevIndex) => (prevIndex - 1 + audios.length) % audios.length);
    };

    const handleAudioEnded = () => {
        handleNext();
    };

    return (
        <div className="container">
            <h1>Podcast Generator</h1>
            <textarea
                className="textarea"
                value={urls}
                onChange={(e) => setUrls(e.target.value)}
                placeholder="Enter URLs, one per line"
            />
            <button className="button" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Generating Podcasts...' : 'Generate Podcasts'}
            </button>
            <div className="audio-container">
                {audios.length > 0 && (
                    <>
                        <audio
                            className="audio-player"
                            controls
                            src={audios[currentAudioIndex]}
                            ref={audioRef}
                            autoPlay
                            onEnded={handleAudioEnded}
                        />
                        <div className="controls">
                            <button className="control-button" onClick={handlePrevious} disabled={audios.length <= 1}>Previous</button>
                            <button className="control-button" onClick={handleNext} disabled={audios.length <= 1}>Next</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PodcastApp;
