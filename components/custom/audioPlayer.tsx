import { useRef } from "react";
import { Play, Pause } from "lucide-react";

type AudioPlayerProps = {
  src: string;
};

const AudioPlayer = ({ src }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioRef.current?.play();
  };

  const handlePause = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioRef.current?.pause();
  };

  return (
    <>
      <div className="flex items-center gap-3 bg-slate-800/80 p-3 rounded-xl">
        <button
          onClick={handlePlay}
          className="p-2 rounded-full bg-green-400/20 text-green-300 border border-green-400/30 hover:bg-green-600"
        >
          <Play className="text-white" size={18} />
        </button>

        <button
          onClick={handlePause}
          className="p-2 rounded-full bg-red-400/20 text-red-400 border border-red-400/30 hover:bg-red-600"
        >
          <Pause className="text-white" size={18} />
        </button>

        <audio ref={audioRef} src={src} preload="auto" />
      </div>
    </>
  );
};

export default AudioPlayer;
