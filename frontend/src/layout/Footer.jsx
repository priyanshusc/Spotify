import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Volume2, VolumeX, Volume1 } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { memo } from 'react';

// --- REUSABLE SMOOTH SLIDER COMPONENT ---
const SmoothSlider = ({ value, onChange, className = "" }) => {
  return (
    <div className={`relative h-1 bg-[#4d4d4d] rounded-full group cursor-pointer ${className}`}>
      {/* The Smooth "Filled" Green/White Bar */}
      <motion.div
        className="absolute top-0 left-0 h-full bg-white group-hover:bg-spotify-green rounded-full z-10"
        initial={false}
        animate={{ width: `${value}%` }}
        transition={{ type: "spring", bounce: 0, duration: 0.1 }} // The "Smoothness" secret
      />

      {/* The Actual Invisible Input for Logic */}
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
      />

      {/* The White Dot (Thumb) that appears on hover */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 z-20"
        initial={false}
        animate={{ left: `calc(${value}% - 6px)` }}
        transition={{ type: "spring", bounce: 0, duration: 0.1 }}
      />
    </div>
  );
};

const SongInfo = memo(({ song }) => {
  console.log("SongInfo rendered!");

  if (!song) return <div className="text-gray-500 italic text-sm w-[30%]">No song selected</div>;

  return (
    <div className="flex items-center gap-4 w-[30%]">
      <img src={song.thumbnail_uri} alt="" className="h-14 w-14 rounded shadow-md" />
      <div className="flex flex-col truncate">
        <span className="text-white text-sm font-semibold hover:underline cursor-pointer truncate">
          {song.title}
        </span>
        <span className="text-spotify-text-muted text-xs hover:underline cursor-pointer">
          {song.artist?.username || "Unknown Artist"}
        </span>
      </div>
    </div>
  );
});

const Footer = () => {
  const {
    currentSong, isPlaying, togglePlay, progress,
    currentTime, duration, seek, skipNext, skipPrevious,
    volume, handleVolumeChange, repeatMode, toggleRepeat
  } = usePlayer();

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX size={20} className="text-gray-400" />;
    if (volume < 0.5) return <Volume1 size={20} className="text-white" />;
    return <Volume2 size={20} className="text-white" />;
  };

  const formatTime = (time) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <footer className="h-20 bg-black border-t border-[#282828] px-4 flex items-center justify-between fixed bottom-0 w-full z-50">

      {/* 1. Left: Current Song Info */}
      <SongInfo song={currentSong} />

      {/* 2. Center: Playback Controls */}
      <div className="flex flex-col items-center max-w-[40%] w-full gap-2">
        <div className="flex items-center gap-6">
          <Shuffle size={18} className="text-spotify-text-muted hover:text-white cursor-pointer" />
          <SkipBack size={24} className="text-white hover:scale-105 cursor-pointer" onClick={skipPrevious} />

          <button onClick={togglePlay} className="bg-white rounded-full p-2 hover:scale-105 transition active:scale-95">
            {isPlaying ? <Pause size={24} className="text-black fill-black" /> : <Play size={24} className="text-black fill-black ml-0.5" />}
          </button>

          <SkipForward size={24} className="text-white hover:scale-105 cursor-pointer" onClick={skipNext} />
          <button
            onClick={toggleRepeat}
            className="relative flex items-center justify-center group"
          >
            <Repeat
              size={20}
              className={`transition-colors ${repeatMode > 0 ? 'text-spotify-green' : 'text-spotify-text-muted hover:text-white'
                }`}
            />

            {/* The "Repeat One" Badge */}
            {repeatMode === 2 && (
              <span className="absolute -top-1.5 -right-1.5 bg-spotify-green text-black text-[9px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full border border-black">
                1
              </span>
            )}

            {/* The "Active Dot" (Optional: Spotify uses a tiny dot below active buttons) */}
            {repeatMode > 0 && (
              <div className="absolute -bottom-1.5 w-1 h-1 bg-spotify-green rounded-full" />
            )}
          </button>
        </div>

        {/* --- SMOOTH PROGRESS BAR --- */}
        <div className="w-full flex items-center gap-2 px-4">
          <span className="text-[10px] text-spotify-text-muted min-w-[30px] text-right">
            {formatTime(currentTime)}
          </span>

          <SmoothSlider
            value={progress}
            onChange={seek}
            className="flex-1"
          />

          <span className="text-[10px] text-spotify-text-muted min-w-[30px]">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* 3. Right: Volume Control */}
      <div className="flex items-center justify-end gap-3 w-[30%]">
        {getVolumeIcon()}

        {/* --- SMOOTH VOLUME SLIDER --- */}
        <SmoothSlider
          value={volume * 100}
          onChange={handleVolumeChange}
          className="w-24"
        />
      </div>

    </footer>
  );
};

export default Footer;