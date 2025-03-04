import React, { useState, useRef, useEffect } from 'react';

const VoiceAssistant = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState([]);
    const recognitionRef = useRef(null);

    useEffect(() => {
        // Check for browser support of the Web Speech API
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        console.log("🚀 ~ useEffect ~ SpeechRecognition:", SpeechRecognition)
        if (!SpeechRecognition) {
            alert("Your browser does not support speech recognition.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        // On successful speech recognition result
        recognition.onresult = async (event) => {
            const userText = event.results[0][0].transcript;
            setTranscript(prev => [...prev, { sender: 'user', text: userText }]);

            // Call the backend API with the recognized text
            try {
                const response = await fetch('https://bankingcsapi.techvantage.ai/get_question', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ question: userText })
                });
                const data = await response.json();
                // Assuming API returns { answer: '...' }
                if (data.answer) {
                    setTranscript(prev => [...prev, { sender: 'assistant', text: data.answer }]);
                    // Convert assistant response to speech
                    const utterance = new SpeechSynthesisUtterance(data.answer);
                    window.speechSynthesis.speak(utterance);
                } else {
                    setTranscript(prev => [...prev, { sender: 'assistant', text: 'Sorry, I did not understand that.' }]);
                }
            } catch (error) {
                console.error("Error calling get_question API:", error);
                setTranscript(prev => [...prev, { sender: 'assistant', text: 'Error processing your request.' }]);
            }
        };

        // Handle errors during speech recognition
        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setTranscript(prev => [...prev, { sender: 'assistant', text: `Speech recognition error: ${event.error}` }]);
        };

        recognitionRef.current = recognition;
    }, []);

    // Start the conversation (start speech recognition)
    const startCall = () => {
        if (recognitionRef.current) {
            setIsRecording(true);
            recognitionRef.current.start();
        }
    };

    // End the conversation, stop speech recognition, and notify backend
    const hangUp = async () => {
        if (recognitionRef.current && isRecording) {
            recognitionRef.current.stop();
            setIsRecording(false);
        }
        // Call the disconnect API endpoint
        try {
            await fetch('https://bankingcsapi.techvantage.ai/disconnect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ disconnect: true })
            });
            setTranscript(prev => [...prev, { sender: 'system', text: 'Disconnected' }]);
        } catch (error) {
            console.error("Error calling disconnect API:", error);
            setTranscript(prev => [...prev, { sender: 'system', text: 'Error disconnecting call' }]);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2>Voice Interaction for Customer Service Request</h2>
            <div
                style={{
                    border: '1px solid #ccc',
                    padding: '10px',
                    height: '300px',
                    overflowY: 'auto',
                    marginBottom: '20px'
                }}
            >
                {transcript.map((entry, index) => (
                    <div key={index} style={{ marginBottom: '10px' }}>
                        <strong>
                            {entry.sender === 'user' ? 'You' : entry.sender === 'assistant' ? 'Assistant' : 'System'}:
                        </strong> {entry.text}
                    </div>
                ))}
            </div>
            <div>
                <button onClick={startCall} disabled={isRecording}>
                    Call
                </button>
                <button onClick={hangUp} disabled={!isRecording}>
                    Hang Up
                </button>
            </div>
        </div>
    );
};

export default VoiceAssistant;
