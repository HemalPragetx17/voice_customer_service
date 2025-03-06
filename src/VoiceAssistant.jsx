import React, { useState, useRef, useEffect } from 'react';

// Right Now I'm using static responses, but you can replace this with an API call
const assistantResponses = [
    "I'm happy to help with that. What else would you like to know?",
    "That's a great question. Let me think about that for a moment.",
    "I understand what you're asking. Here's what I can tell you.",
    "Thanks for sharing that information with me.",
    "I appreciate your patience. Is there anything else I can assist you with?",
    "That's an interesting point. Let me respond to that.",
    "I'm here to help. Please continue.",
    "I've noted your request. Let me provide some information about that.",
    "That's a common question I receive. Here's what you should know.",
    "I'm processing your request. Thank you for being specific."
];

const VoiceAssistant = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentUserInput, setCurrentUserInput] = useState('');
    const recognitionRef = useRef(null);
    const conversationRef = useRef(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Your browser does not support speech recognition.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = true;
        recognition.continuous = true;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
            const results = event.results;
            const latestResult = results[results.length - 1];

            if (!latestResult.isFinal) {
                const interimTranscript = latestResult[0].transcript;
                setCurrentUserInput(interimTranscript);
            } else {
                const finalTranscript = latestResult[0].transcript;
                setCurrentUserInput('');
                setTranscript(prev => [...prev, { sender: 'user', text: finalTranscript }]);

                setIsLoading(true);

                setTimeout(() => {
                    const randomIndex = Math.floor(Math.random() * assistantResponses.length);
                    const assistantResponse = assistantResponses[randomIndex];

                    setTranscript(prev => [...prev, { sender: 'assistant', text: assistantResponse }]);
                    setIsLoading(false);

                    const utterance = new SpeechSynthesisUtterance(assistantResponse);

                    window.speechSynthesis.speak(utterance);
                }, 1000 + Math.random() * 1000);
            }
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setTranscript(prev => [...prev, { sender: 'assistant', text: "Your browser does not support microphone access" }]);
            setIsLoading(false);
        };

        recognition.onend = () => {
            if (isRecording) {
                recognition.start();
            }
        };

        recognitionRef.current = recognition;
    }, [isRecording]);

    useEffect(() => {
        if (conversationRef.current) {
            conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
        }
    }, [transcript, currentUserInput, isLoading]);

    const startCall = () => {
        if (recognitionRef.current) {
            setIsRecording(true);
            recognitionRef.current.start();
            setTranscript(prev => [...prev, { sender: 'system', text: 'Connected' }]);
        }
    };

    const hangUp = () => {
        if (recognitionRef.current && isRecording) {
            recognitionRef.current.stop();
            setIsRecording(false);
            window.speechSynthesis.cancel();
            setCurrentUserInput('');
            setTranscript(prev => [...prev, { sender: 'system', text: 'Disconnected' }]);
        }
    };

    return (
        <div className='app'>
            <div className='container'>
                <div className='voice-assistant-outer'>
                    <div className='border-glow'></div>
                    <div className='voice-assistant'>
                        <div className='title'>
                            <h1>Voice Assistant</h1>
                        </div>
                        <div className='conversation' ref={conversationRef}>
                            {transcript?.map((message, index) => (
                                <div key={index} style={{ marginBottom: '10px' }}>
                                    {message?.sender === "user" && (
                                        <div className="user-section">
                                            <div className="user-message">
                                                <p>{message.text}</p>
                                            </div>
                                            <div className="user-icon">
                                                U
                                            </div>
                                        </div>
                                    )}
                                    {message?.sender === "assistant" && (
                                        <div className="assisant-section">
                                            <div className="assisant-icon">
                                                A
                                            </div>
                                            <div className="assisant-message">
                                                <p>{message?.text}</p>
                                            </div>
                                        </div>
                                    )}
                                    {message?.sender === "system" && (
                                        <div className="system-message">
                                            <p>{message.text}</p>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {currentUserInput && (
                                <div className="user-section">
                                    <div className="user-message interim">
                                        <p>{currentUserInput}</p>
                                    </div>
                                    <div className="user-icon">
                                        U
                                    </div>
                                </div>
                            )}

                            {isLoading && (
                                <div className="assisant-section">
                                    <div className="assisant-icon">
                                        A
                                    </div>
                                    <div className="assisant-message loading">
                                        <div className="typing-indicator">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className='controls'>
                            <button className='call-btn' onClick={startCall} disabled={isRecording}>
                                Call
                            </button>
                            <button className='hangup-btn' onClick={hangUp} disabled={!isRecording}>
                                Hang Up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VoiceAssistant;