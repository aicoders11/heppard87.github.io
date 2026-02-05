import React, { useState, useRef, useEffect } from 'react';
import { ai } from '../services/geminiService';
// FIX: Removed non-exported 'LiveSession' type from import.
import { type LiveServerMessage, Modality, type Blob } from '@google/genai';
// FIX: Imported LUMINA_SYSTEM_PROMPT.
import { GAME_PROMPTS, LUMINA_SYSTEM_PROMPT } from '../constants';
import { GameMode } from '../types';

// --- Audio Helper Functions ---
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}
// --- End Audio Helper Functions ---

type TranscriptionEntry = {
    author: 'user' | 'lumina';
    text: string;
};

type SessionStatus = 'idle' | 'connecting' | 'active' | 'error';

const VoiceChatPanel: React.FC = () => {
    const [status, setStatus] = useState<SessionStatus>('idle');
    const [userTranscript, setUserTranscript] = useState('');
    const [luminaTranscript, setLuminaTranscript] = useState('');
    const [history, setHistory] = useState<TranscriptionEntry[]>([]);

    // FIX: Updated ref type to use `any` since LiveSession is not an exported type.
    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const audioContextRefs = useRef<{ input: AudioContext | null, output: AudioContext | null }>({ input: null, output: null });
    const streamRef = useRef<MediaStream | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const nextStartTimeRef = useRef<number>(0);

    const stopSession = () => {
        console.log('Stopping session...');
        setStatus('idle');
        
        if (sessionPromiseRef.current) {
            sessionPromiseRef.current.then(session => session.close());
            sessionPromiseRef.current = null;
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        
        if (processorRef.current) {
            processorRef.current.disconnect();
            processorRef.current = null;
        }

        if (audioContextRefs.current.input) {
            audioContextRefs.current.input.close();
            audioContextRefs.current.input = null;
        }
        if (audioContextRefs.current.output) {
             audioContextRefs.current.output.close();
             audioContextRefs.current.output = null;
        }
        
        audioSourcesRef.current.forEach(source => source.stop());
        audioSourcesRef.current.clear();
        nextStartTimeRef.current = 0;
    };

    const startSession = async () => {
        setStatus('connecting');
        try {
            // FIX: Cast window to `any` to allow for `webkitAudioContext` for cross-browser compatibility.
            audioContextRefs.current.input = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            // FIX: Cast window to `any` to allow for `webkitAudioContext` for cross-browser compatibility.
            audioContextRefs.current.output = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            
            streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        console.log('Session opened.');
                        setStatus('active');
                        const source = audioContextRefs.current.input!.createMediaStreamSource(streamRef.current!);
                        const scriptProcessor = audioContextRefs.current.input!.createScriptProcessor(4096, 1, 1);
                        processorRef.current = scriptProcessor;

                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob = createBlob(inputData);
                            sessionPromiseRef.current?.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(audioContextRefs.current.input!.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        if (message.serverContent?.inputTranscription) {
                            setUserTranscript(prev => prev + message.serverContent.inputTranscription.text);
                        }
                        if (message.serverContent?.outputTranscription) {
                            setLuminaTranscript(prev => prev + message.serverContent.outputTranscription.text);
                        }
                        if (message.serverContent?.turnComplete) {
                            setHistory(prev => [...prev, { author: 'user', text: userTranscript }, { author: 'lumina', text: luminaTranscript }]);
                            const currentUserTranscript = userTranscript;
                            const currentLuminaTranscript = luminaTranscript;
                            setUserTranscript('');
                            setLuminaTranscript('');
                        }

                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (base64Audio) {
                            const outputContext = audioContextRefs.current.output!;
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputContext.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64Audio), outputContext, 24000, 1);
                            const source = outputContext.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputContext.destination);
                            source.addEventListener('ended', () => audioSourcesRef.current.delete(source));
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                            audioSourcesRef.current.add(source);
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Session error:', e);
                        setStatus('error');
                    },
                    onclose: (e: CloseEvent) => {
                        console.log('Session closed.');
                        stopSession();
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    outputAudioTranscription: {},
                    inputAudioTranscription: {},
                    systemInstruction: `${LUMINA_SYSTEM_PROMPT} ${GAME_PROMPTS[GameMode.VoiceChat]}`,
                },
            });
        } catch (err) {
            console.error('Failed to start session:', err);
            setStatus('error');
        }
    };
    
    useEffect(() => {
        return () => stopSession();
    }, []);

    const toggleSession = () => {
        if (status === 'active' || status === 'connecting') {
            stopSession();
        } else {
            startSession();
        }
    };
    
    const orbStateClasses = {
        idle: 'bg-cyan-500/30 border-cyan-400 shadow-[0_0_20px_theme(colors.cyan.500)]',
        connecting: 'bg-yellow-500/30 border-yellow-400 shadow-[0_0_30px_theme(colors.yellow.400)] animate-pulse',
        active: 'bg-pink-500/30 border-pink-400 shadow-[0_0_40px_theme(colors.pink.400)] animate-pulse-slow',
        error: 'bg-red-500/30 border-red-400 shadow-[0_0_30px_theme(colors.red.400)]',
    };

    return (
        <div className="flex flex-col items-center justify-center flex-grow w-full my-4 min-h-0 bg-black/30 backdrop-blur-sm rounded-lg border border-cyan-500/20 p-4 space-y-4">
            <div className="flex-grow w-full flex flex-col items-center justify-center space-y-4">
                <div className="text-center">
                    <p className="text-purple-300">You</p>
                    <p className="text-2xl h-8">{userTranscript || '...'}</p>
                </div>
                <div className="text-center">
                    <p className="text-cyan-300">Lumina</p>
                    <p className="text-2xl font-bold h-8">{luminaTranscript || '...'}</p>
                </div>
            </div>
            <button
                onClick={toggleSession}
                className={`w-32 h-32 rounded-full border-2 transition-all duration-500 flex items-center justify-center ${orbStateClasses[status]}`}
            >
                {status === 'idle' && 'Start'}
                {status === 'connecting' && '...'}
                {status === 'active' && 'Stop'}
                {status === 'error' && 'Retry'}
            </button>
            <div className="w-full text-sm text-center text-gray-400 h-8">
                {status === 'error' && <p>Connection failed. Please check microphone permissions and try again.</p>}
                {status === 'active' && <p>Listening...</p>}
            </div>
        </div>
    );
};

export default VoiceChatPanel;