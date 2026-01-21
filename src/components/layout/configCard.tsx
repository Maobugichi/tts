import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Download, RefreshCw, Play, Volume2, AlertCircle } from 'lucide-react'
import type { UsageData, Voice } from '@/types';
import { fetchUsage, handleDownload, handleSynthesize, playPreview } from '@/utils';
import type { RefObject, SetStateAction } from 'react';
import { outputFormats, popularVoices } from '@/constants';
import type React from 'react';

interface ConfigCardProps {
    voices:Voice[];
    selectedVoiceId:string;
    audioRef:RefObject<HTMLAudioElement | null> ,
    setSelectedVoiceId:React.Dispatch<SetStateAction<string>>;
    outputFormat:string; 
    setOutputFormat:React.Dispatch<SetStateAction<string>>;
    text:string;
    setText:React.Dispatch<SetStateAction<string>>;
    error:string | null;
    setError:React.Dispatch<SetStateAction<string | null>>
    setIsLoading:React.Dispatch<SetStateAction<boolean>>; 
    audioUrl:string | null; 
    setAudioUrl:React.Dispatch<SetStateAction<string | null>>;
    isLoading:boolean;
    setUsage:React.Dispatch<SetStateAction<UsageData |null>>;
}

// Helper function to truncate text
const truncate = (text: string, maxLength: number = 30) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const ConfigCard = ({
     voices,
     selectedVoiceId,
     audioRef , 
     setSelectedVoiceId, 
     outputFormat, 
     setOutputFormat , 
     text, 
     setText,
     error,
     setError,
     setIsLoading, 
     audioUrl, 
     setAudioUrl,
     isLoading,
     setUsage
    }:ConfigCardProps) => {
    return (
        <Card>
          <CardHeader>
            <CardTitle>Voice Configuration</CardTitle>
            <CardDescription>
              Choose your preferred voice and output settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Voice Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="voice" className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  Voice
                </Label>
                {voices.find(v => v.voiceId === selectedVoiceId)?.previewUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => playPreview(voices.find(v => v.voiceId === selectedVoiceId)!.previewUrl, audioRef)}
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                )}
              </div>
              <Select value={selectedVoiceId} onValueChange={setSelectedVoiceId}>
                <SelectTrigger id="voice" className="w-full">
                  <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Popular Voices</SelectLabel>
                    {popularVoices.map(voice => (
                      <SelectItem key={voice.id} value={voice.id}>
                        {truncate(voice.name)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  {voices.length > 0 && (
                    <SelectGroup>
                      <SelectLabel>All Voices</SelectLabel>
                      {voices.map(voice => (
                        <SelectItem key={voice.voiceId} value={voice.voiceId}>
                          {truncate(`${voice.name} - ${voice.labels?.accent || voice.category}`, 35)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  )}
                </SelectContent>
              </Select>
            </div>

          
            <div className="space-y-2">
              <Label htmlFor="format">Output Format</Label>
              <Select value={outputFormat} onValueChange={setOutputFormat}>
                <SelectTrigger id="format">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  {outputFormats.map(format => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500">
                Some formats require Creator or Pro tier subscription
              </p>
            </div>

           
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="text">Text to Convert</Label>
                <span className="text-xs text-slate-500">
                  {text.length} / 5000
                </span>
              </div>
              <Textarea
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter the text you want to convert to speech..."
                className="min-h-[150px] resize-none"
                maxLength={5000}
              />
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => handleSynthesize(
                  setError, 
                  text, 
                  setIsLoading, 
                  audioUrl, 
                  setAudioUrl,
                  outputFormat,
                  selectedVoiceId,
                  audioRef,
                  setUsage
                )}
                disabled={isLoading || !text.trim()}
                size="lg"
                className="flex-1 min-w-[200px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Synthesizing...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Convert to Speech
                  </>
                )}
              </Button>

              {audioUrl && (
                <Button
                  onClick={() => handleDownload(audioUrl, outputFormat)}
                  variant="secondary"
                  size="lg"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              )}

              <Button
                onClick={() => fetchUsage(setUsage)}
                variant="outline"
                size="lg"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
    )
}