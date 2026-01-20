import axios from "axios";
import type { RefObject, SetStateAction } from "react";
import type React from "react";
import type { UsageData, Voice } from "./types";

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const fetchVoices = async (setVoices:React.Dispatch<SetStateAction<Voice[]>>, setError:React.Dispatch<SetStateAction<string | null>>) => {
    try {
      const response = await axios.get(`${API_URL}/api/voices`);
      console.log(response)
      setVoices(response.data.voices);
    } catch (err) {
      console.error('Error fetching voices:', err);
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError('Invalid API key. Please check your ElevenLabs configuration.');
      }
    }
  };

export const fetchUsage = async (setUsage:React.Dispatch<SetStateAction<UsageData | null>>) => {
    try {
      const response = await axios.get(`${API_URL}/api/tts/usage`);
      setUsage(response.data);
    } catch (err) {
      console.error('Error fetching usage:', err);
    }
  };

 export const handleSynthesize = async (
  setError:React.Dispatch<SetStateAction<string | null>>, 
  text:string, setIsLoading:React.Dispatch<SetStateAction<boolean>>, 
  audioUrl:string | null, 
  setAudioUrl:React.Dispatch<SetStateAction<string | null>>,
  outputFormat:string,
  selectedVoiceId:string,
  audioRef:RefObject<HTMLAudioElement | null> ,
  setUsage:React.Dispatch<SetStateAction<UsageData | null>>

) => {
  if (!text.trim()) {
    setError('Please enter some text');
    return;
  }

  setIsLoading(true);
  setError(null);


  if (audioUrl) {
    URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
  }

  try {
    const response = await axios.post(
      `${API_URL}/api/tts`,
      {
        voiceId: selectedVoiceId,
        text: text,
        outputFormat: outputFormat
      },
      {
        responseType: 'arraybuffer'
      }
    );

    console.log('Response size:', response.data.byteLength);
    
    const mimeType = outputFormat.startsWith('mp3') 
      ? 'audio/mpeg' 
      : outputFormat.startsWith('pcm') || outputFormat.startsWith('wav')
      ? 'audio/wav'
      : 'audio/basic';

    const blob = new Blob([response.data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    console.log('Blob URL created:', url);
    
    // Set the URL first, then the audio element will appear and we can configure it
    setAudioUrl(url);

    // Wait for React to render the audio element
    setTimeout(() => {
      if (audioRef.current) {
        console.log('Setting up audio element');
        
        audioRef.current.onloadedmetadata = () => {
          console.log('Metadata loaded, duration:', audioRef.current?.duration);
        };
        
        audioRef.current.oncanplaythrough = () => {
          console.log('Can play through');
        };
        
        audioRef.current.onerror = () => {
          console.error('Audio error:', audioRef.current?.error);
        };
        
        // Explicitly set the src and load
        audioRef.current.src = url;
        audioRef.current.load();
        
        // Try playing after load
        audioRef.current.oncanplay = async () => {
          console.log('Can play - attempting playback');
          try {
            await audioRef.current?.play();
            console.log('Playing!');
          } catch (playError) {
            console.error(' Play failed:', playError);
          }
        };
      }
    }, 100);

    fetchUsage(setUsage);

  } catch (err) {
    if (axios.isAxiosError(err)) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Failed to synthesize speech';
      setError(errorMessage);
      
      if (err.response?.status === 401) {
        setError('Authentication error: Invalid API key or missing permissions');
      } else if (err.response?.status === 429) {
        setError('Rate limit exceeded! Too many requests. Please try again later.');
      } else if (err.response?.status === 400) {
        setError(`Bad request: ${err.response?.data?.message || 'Invalid parameters'}`);
      }
    } else {
      setError('An unexpected error occurred');
    }
    console.error('TTS Error:', err);
  } finally {
    setIsLoading(false);
  }
 };

 export const handleDownload = ( audioUrl:string | null,outputFormat:string,) => {
    if (!audioUrl) return;

    const a = document.createElement('a');
    a.href = audioUrl;
    const extension = outputFormat.startsWith('mp3') ? 'mp3' : 'wav';
    a.download = `tts-${Date.now()}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

export const playPreview = async (previewUrl: string,audioRef:RefObject<HTMLAudioElement | null> ,) => {
    if (audioRef.current) {
      audioRef.current.src = previewUrl;
      try {
        await audioRef.current.play();
      } catch (err) {
        console.error('Preview play failed:', err);
      }
    }
  };
