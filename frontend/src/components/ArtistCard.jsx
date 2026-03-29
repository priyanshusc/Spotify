import { useNavigate } from 'react-router-dom';

const ArtistCard = ({ artist }) => {
    const navigate = useNavigate();

    return (
        <div 
            onClick={() => navigate(`/artist/${artist._id}`)}
            className="bg-[#181818] p-4 rounded-md hover:bg-[#282828] transition-all group cursor-pointer flex flex-col items-center text-center"
        >
            <div className="relative mb-4 w-full aspect-square">
                <img 
                    src={artist.profilePicture || "https://via.placeholder.com/150"} 
                    alt={artist.username} 
                    className="object-cover w-full h-full rounded-full shadow-lg" 
                />
            </div>
            <h3 className="text-white font-bold truncate w-full">{artist.username}</h3>
            <p className="text-spotify-text-muted text-sm capitalize">Artist</p>
        </div>
    );
};

export default ArtistCard;