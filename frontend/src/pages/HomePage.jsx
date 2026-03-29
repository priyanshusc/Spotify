import { useQuery } from '@tanstack/react-query';
import api from '../api/api';
import SongCard from '../components/Songcard';
import { usePlayer } from '../context/PlayerContext';
import { useEffect } from 'react';

const HomePage = () => {

    const { setQueue } = usePlayer();

    const { data: songs, isLoading, isError } = useQuery({
        queryKey: ['allSongs'],
        queryFn: async () => {
            const res = await api.get('/music/all');
            return res.data.data;
        },
    });

    useEffect(() => {
        if (songs) {
            setQueue(songs); // 👈 Tell the player: "This is your current queue"
        }
    }, [songs, setQueue]);


    if (isLoading) return <div className="text-white">Tuning the instruments...</div>;
    if (isError) return <div className="text-red-500">Failed to load songs. Check your backend!</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white mb-6">Made for You</h1>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {songs?.map((song) => (
                    <SongCard key={song._id} song={song} />
                ))}
            </div>
        </div>
    );
};

export default HomePage;