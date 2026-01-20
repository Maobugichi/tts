import { Card, CardContent,  CardHeader, CardTitle } from '@/components/ui/card';
import { Volume2 } from 'lucide-react';
import type { RefObject } from 'react';

interface AudioPlayerProps  {
    audioUrl:string | null;
    audioRef:RefObject<HTMLAudioElement | null> ,
}

export const AudioPlayer = ({audioUrl, audioRef}:AudioPlayerProps) => {
    return(
        <>
          {audioUrl && (
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5" />
                    Audio Player
                </CardTitle>
                </CardHeader>
                <CardContent>
                <audio
                    ref={audioRef}
                    controls
                    preload="auto"
                    className="w-full"
                    key={audioUrl}
                >
                    <source src={audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
                </CardContent>
            </Card>
          )}
        </>
    )
}