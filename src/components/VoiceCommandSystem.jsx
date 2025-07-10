import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, XCircle, Command, HelpCircle, Volume, Zap } from 'lucide-react';

const VoiceCommandSystem = ({ onCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [showCommands, setShowCommands] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const recognitionRef = useRef(null);
  
  // Available voice commands
  const commands = {
    'generate': () => onCommand('generate'),
    'create qr': () => onCommand('generate'),
    'generate qr': () => onCommand('generate'),
    'customize': () => onCommand('customize'),
    'change color': () => onCommand('change_color'),
    'change style': () => onCommand('change_style'),
    'download': () => onCommand('download'),
    'download png': () => onCommand('download_png'),
    'download svg': () => onCommand('download_svg'),
    'save': () => onCommand('save'),
    'add logo': () => onCommand('add_logo'),
    'remove logo': () => onCommand('remove_logo'),
    'templates': () => onCommand('templates'),
    'show templates': () => onCommand('templates'),
    'dark mode': () => onCommand('toggle_dark_mode'),
    'light mode': () => onCommand('toggle_dark_mode'),
    'switch theme': () => onCommand('toggle_dark_mode'),
    'scan': () => onCommand('scanner'),
    'scan qr': () => onCommand('scanner'),
    'scanner': () => onCommand('scanner'),
    'show history': () => onCommand('history'),
    'qr history': () => onCommand('history'),
    'help': () => setShowCommands(true),
    'show commands': () => setShowCommands(true),
    'close': () => {
      setShowCommands(false);
      return 'dialog_closed';
    },
    'exit': () => {
      setShowCommands(false);
      return 'dialog_closed';
    }
  };
  
  // Setup speech recognition
  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSpeechSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      // First check if microphone permissions are granted
      navigator.permissions.query({name: 'microphone'}).then((permissionStatus) => {
        if (permissionStatus.state === 'denied') {
          provideFeedback('Microphone access denied. Please enable microphone permissions in your browser settings.');
        } else if (permissionStatus.state === 'prompt') {
          provideFeedback('Please allow microphone access when prompted to use voice commands.');
        }
        
        // Monitor permission changes
        permissionStatus.onchange = () => {
          if (permissionStatus.state === 'granted') {
            provideFeedback('Microphone access granted. Voice commands are now available.');
          } else if (permissionStatus.state === 'denied') {
            provideFeedback('Microphone access denied. Voice commands are unavailable.');
            if (isListening) {
              recognitionRef.current.abort();
              setIsListening(false);
            }
          }
        };
      }).catch(() => {
        // Permission query not supported, fallback to normal operation
        console.log('Permission query not supported');
      });
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        provideFeedback('Listening...');
      };
      
      recognitionRef.current.onresult = (event) => {
        const current = event.resultIndex;
        const result = event.results[current];
        const transcript = result[0].transcript.toLowerCase().trim();
        
        setTranscript(transcript);
        setConfidence(result[0].confidence * 100);
        
        // Only process the command if this is a final result
        if (result.isFinal) {
          processCommand(transcript);
        }
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        
        if (event.error === 'not-allowed') {
          provideFeedback('Microphone access denied. Please enable permissions.');
        } else if (event.error === 'no-speech') {
          provideFeedback('No speech detected. Please try again.');
        } else {
          provideFeedback(`Error: ${event.error}`);
        }
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);
  
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.abort();
      setIsListening(false);
    } else {
      try {
        // Check permission before attempting to start
        if (navigator.permissions && navigator.permissions.query) {
          navigator.permissions.query({name: 'microphone'}).then((permissionStatus) => {
            if (permissionStatus.state === 'granted' || permissionStatus.state === 'prompt') {
              startListening();
            } else {
              provideFeedback('Microphone access denied. Please enable permissions in your browser settings.');
            }
          }).catch(() => {
            // If permission check fails, try starting anyway
            startListening();
          });
        } else {
          // Older browsers without permission API
          startListening();
        }
      } catch (error) {
        console.error('Speech recognition error:', error);
        provideFeedback('Could not start speech recognition. Please try again.');
      }
    }
  };
  
  const startListening = () => {
    try {
      recognitionRef.current.start();
      setTranscript('');
      setConfidence(0);
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      provideFeedback('Failed to start speech recognition. Please try again.');
    }
  };
  
  const processCommand = (text) => {
    let foundCommand = false;
    
    for (const [commandText, action] of Object.entries(commands)) {
      if (text.includes(commandText)) {
        const result = action();
        foundCommand = true;
        
        if (result !== 'dialog_closed') {
          provideFeedback(`Executing: ${commandText}`);
        }
        
        break;
      }
    }
    
    if (!foundCommand) {
      provideFeedback(`Command not recognized: "${text}"`);
    }
  };
  
  const provideFeedback = (message) => {
    setFeedback(message);
    // Keep feedback visible for 3 seconds
    setTimeout(() => setFeedback(''), 3000);
  };
  
  // Get the command categories for help display
  const commandCategories = {
    'Navigation': ['generate', 'templates', 'scan qr', 'show history'],
    'QR Actions': ['download', 'download png', 'download svg', 'save'],
    'Customization': ['customize', 'change color', 'change style', 'add logo', 'remove logo'],
    'Settings': ['dark mode', 'light mode', 'switch theme'],
    'Help': ['help', 'show commands', 'close', 'exit']
  };
  
  // Don't render the component if speech recognition is not supported
  if (!isSpeechSupported) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400 p-2 rounded-lg bg-gray-100 dark:bg-gray-800/50 flex items-center">
        <Volume className="w-4 h-4 mr-2 text-gray-400" />
        Voice commands not supported in this browser
      </div>
    );
  }
  
  return (
    <div className="relative">
      {/* Voice command toggle button */}
      <div className="flex items-center space-x-2">
        <button
          onClick={toggleListening}
          className={`p-2 rounded-full transition-colors ${
            isListening 
              ? 'bg-red-500 text-white animate-pulse' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
          aria-label={isListening ? 'Stop listening' : 'Start voice command'}
          title={isListening ? 'Stop listening' : 'Start voice command'}
        >
          {isListening ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </button>
        
        <button
          onClick={() => setShowCommands(true)}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label="Voice command help"
          title="Voice command help"
        >
          <HelpCircle className="h-5 w-5" />
        </button>
        
        {isListening && (
          <div className="text-sm font-medium text-gray-600 dark:text-gray-300 animate-pulse flex items-center">
            <span className="mr-1">Listening</span>
            <span className="flex space-x-0.5">
              <span className="h-1.5 w-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="h-1.5 w-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></span>
              <span className="h-1.5 w-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></span>
            </span>
          </div>
        )}
      </div>
      
      {/* Feedback toast */}
      {feedback && (
        <div className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-sm z-10 min-w-[200px] animate-fade-in">
          <div className="flex items-center">
            {feedback.startsWith('Executing') ? (
              <Zap className="w-4 h-4 mr-2 text-green-500" />
            ) : feedback === 'Listening...' ? (
              <Volume className="w-4 h-4 mr-2 text-blue-500 animate-pulse" />
            ) : feedback.startsWith('Command not recognized') ? (
              <XCircle className="w-4 h-4 mr-2 text-red-500" />
            ) : (
              <Command className="w-4 h-4 mr-2 text-gray-500" />
            )}
            <span className={`${
              feedback.startsWith('Executing') ? 'text-green-600 dark:text-green-400' :
              feedback === 'Listening...' ? 'text-blue-600 dark:text-blue-400' :
              feedback.startsWith('Command not recognized') ? 'text-red-600 dark:text-red-400' :
              'text-gray-700 dark:text-gray-300'
            }`}>
              {feedback}
            </span>
          </div>
          
          {/* Only show confidence for recognized speech */}
          {confidence > 0 && (
            <div className="mt-1 flex items-center">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full ${
                    confidence > 80 ? 'bg-green-500' : 
                    confidence > 60 ? 'bg-yellow-500' : 
                    'bg-red-500'
                  }`} 
                  style={{ width: `${confidence}%` }}
                ></div>
              </div>
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{Math.round(confidence)}%</span>
            </div>
          )}
          
          {/* Transcript display */}
          {transcript && isListening && (
            <div className="mt-1 text-xs text-gray-600 dark:text-gray-400 italic">
              "{transcript}"
            </div>
          )}
        </div>
      )}
      
      {/* Commands help dialog */}
      {showCommands && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Command className="w-5 h-5 mr-2 text-blue-500" />
                Available Voice Commands
              </h3>
              <button 
                onClick={() => setShowCommands(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <p className="text-gray-700 dark:text-gray-300">
                Use these voice commands to control the QR code generator. Click the microphone icon and speak a command.
              </p>
              
              {Object.entries(commandCategories).map(([category, commandList]) => (
                <div key={category}>
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">
                    {category}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {commandList.map(cmd => (
                      <div 
                        key={cmd} 
                        className="bg-gray-100 dark:bg-gray-700/50 px-3 py-2 rounded-lg flex items-center"
                      >
                        <span className="text-blue-600 dark:text-blue-400 font-mono text-sm mr-2">
                          "{cmd}"
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-3">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Tip:</strong> For best results, speak clearly and use the exact command phrases.
                </p>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 flex justify-end">
              <button
                onClick={() => setShowCommands(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceCommandSystem;
