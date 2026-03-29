// components/PlaylistImage.jsx
import { Library } from 'lucide-react';
import { useState } from 'react';

const PlaylistImage = ({ src, name, size = 20, className = "" }) => {
    const [isError, setIsError] = useState(false);

    // If there is no src OR the image failed to load
    if (!src || isError) {
        return (
            <div className={`w-full h-full bg-gradient-to-br from-indigo-700 to-blue-300 flex items-center justify-center ${className}`}>
                <Library size={size} className="text-gray-700" />   
            </div>
        );
    }

    return (
        <img 
            src={src} 
            alt={name} 
            className={`w-full h-full object-cover ${className}`}
            onError={() => setIsError(true)} // Switches to fallback if URL is dead
        />
    );
};

export default PlaylistImage;