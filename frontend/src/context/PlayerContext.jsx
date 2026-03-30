import { createContext, useContext, useState, useRef, useEffect } from "react";
import { useAuth } from "./AuthContext";

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {

    const { user } = useAuth()
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [queue, setQueue] = useState([]);
    const [volume, setVolume] = useState(1); // Default to max volume (1.0)
    const [repeatMode, setRepeatMode] = useState(0); // 0: Off, 1: Repeat All, 2: Repeat One
    // const [isShuffle, setIsShuffle] = useState(false);

    // 1. New Time States
    const [progress, setProgress] = useState(0); // 0 to 100%
    const [currentTime, setCurrentTime] = useState(0); // In seconds
    const [duration, setDuration] = useState(0); // Total song length

    const audioRef = useRef(new Audio());

    useEffect(() => {
        if (!user) {
            // Stop the music immediately
            audioRef.current.pause();
            audioRef.current.src = "";

            // Reset all player states to default
            setCurrentSong(null);
            setIsPlaying(false);
            setQueue([]);
            setProgress(0);
            setCurrentTime(0);
            setDuration(0);
        }
    }, [user]);

    const skipNext = () => {
        if (!currentSong || queue.length === 0) return;

        const currentIndex = queue.findIndex(s => s._id === currentSong._id);
        const nextIndex = (currentIndex + 1) % queue.length;

        // BUG FIX: If the next song is the same as the current song (Queue of 1)
        if (nextIndex === currentIndex) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(err => console.error(err));
        } else {
            playSong(queue[nextIndex]);
        }
    };

    const skipPrevious = () => {
        if (!currentSong || queue.length === 0) return;

        const currentIndex = queue.findIndex(s => s._id === currentSong._id);
        const prevIndex = (currentIndex - 1 + queue.length) % queue.length;

        // BUG FIX: Same logic for previous
        if (prevIndex === currentIndex) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(err => console.error(err));
        } else {
            playSong(queue[prevIndex]);
        }
    };

    useEffect(() => {
        const audio = audioRef.current;

        // 2. The "Ticker" - Runs multiple times per second while playing
        const handleTimeUpdate = () => {
            const p = (audio.currentTime / audio.duration) * 100;
            setProgress(p || 0); // Update the percentage
            setCurrentTime(audio.currentTime); // Update the seconds
        };

        // 3. The "Duration Loader" - Runs once when song starts
        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
        };

        const handleEnded = () => {
            // 1. Reset visuals immediately
            setProgress(0);
            setCurrentTime(0);

            // 2. REPEAT ONE (Mode 2)
            if (repeatMode === 2) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(err => console.error("Replay failed", err));
                return; // Stop here; don't skip to next
            }

            // 3. REPEAT OFF (Mode 0)
            if (repeatMode === 0) {
                const currentIndex = queue.findIndex(s => s._id === currentSong._id);
                const isLastSong = currentIndex === queue.length - 1;

                if (isLastSong) {
                    setIsPlaying(false); // Stop playback at the end of the list
                    return;
                }
            }

            // 4. REPEAT ALL (Mode 1) or REPEAT OFF (if not last song)
            // This calls your existing skipNext logic
            skipNext();
        };

        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("loadedmetadata", handleLoadedMetadata);
        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
            audio.removeEventListener("ended", handleEnded);
        };
    }, [currentSong, queue, repeatMode]);

    // 4. Function to skip to a specific part of the song
    const seek = (val) => {
        const time = (val / 100) * audioRef.current.duration;
        audioRef.current.currentTime = time;
        setProgress(val);
    };

    const playSong = async (song) => {
        if (currentSong?._id !== song._id) {
            setCurrentSong(song);
            audioRef.current.src = song.uri;
            try {
                await audioRef.current.play();
                setIsPlaying(true);
            } catch (err) {
                console.error("Playback failed:", err);
                setIsPlaying(false);
            }
        } else {
            togglePlay();
        }
    };

    const togglePlay = async () => {
        // 1. THE GUARD: If no song is selected, don't do anything
        if (!currentSong) {
            console.warn("No song selected to play");
            return;
        }

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            try {
                // 2. THE PROMISE: Await the play request
                // This prevents the "Interrupted by pause" error
                await audioRef.current.play();
                setIsPlaying(true);
            } catch (err) {
                // This catches the AbortError gracefully
                console.error("Playback was prevented:", err.message);
                setIsPlaying(false);
            }
        }
    };

    const handleVolumeChange = (val) => {
        const newVolume = val / 100; // Convert 0-100 scale to 0-1
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    const toggleRepeat = () => {
        setRepeatMode((prev) => (prev + 1) % 3);
    };

    return (
        <PlayerContext.Provider value={{
            currentSong, isPlaying, progress, currentTime, duration,
            queue, setQueue, volume, handleVolumeChange,
            playSong, togglePlay, seek, skipNext, skipPrevious, repeatMode, toggleRepeat,
            audioRef
        }}>
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => useContext(PlayerContext);