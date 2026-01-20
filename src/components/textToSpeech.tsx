import React, { useState, useRef, useEffect } from 'react';
import {  fetchUsage, fetchVoices,  } from '../utils';
import type { Voice } from '../types';
import { Header } from './layout/header';
import { UsageCard } from './layout/usageCard';
import { ConfigCard } from './layout/configCard';
import { AudioPlayer } from './layout/audioPlayer';

interface UsageData {
  characterCount: number;
  characterLimit: number;
  charactersRemaining: number;
  tier: string;
}

export const TextToSpeech: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('EXAVITQu4vr4xnSDxMaL');
  const [outputFormat, setOutputFormat] = useState<string>('mp3_44100_128');
  const [usage, setUsage] = useState<UsageData | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    fetchVoices(setVoices, setError);
    fetchUsage(setUsage);
  }, []);

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
       
        <Header/>

        
        <UsageCard usage={usage}/>

       
         <ConfigCard 
          voices={voices} 
          selectedVoiceId={selectedVoiceId}
          audioRef={audioRef}
          setSelectedVoiceId={setSelectedVoiceId}
          outputFormat={outputFormat}
          setOutputFormat={setOutputFormat}
          text={text}
          setText={setText}
          error={error}
          setError={setError}
          audioUrl={audioUrl}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setAudioUrl={setAudioUrl}
          setUsage={setUsage}
          />

        
        <AudioPlayer audioRef={audioRef} audioUrl={audioUrl}/>
      </div>
    </div>
  );
};