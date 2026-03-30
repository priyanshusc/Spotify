import { useState } from 'react';
import { MoreVertical, Plus, ChevronRight, Share, Radio, User, MinusCircle, Search } from 'lucide-react';
import { 
    useFloating, 
    autoUpdate, 
    offset, 
    flip, 
    shift, 
    useDismiss, 
    useInteractions, 
    useClick, 
    useHover, 
    safePolygon 
} from '@floating-ui/react';

const SongMenu = ({ song, playlists = [], onAddToPlaylist, onRemoveFromPlaylist, onRemoveLike, context: menuContext }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubOpen, setIsSubOpen] = useState(false);

    // --- Main Menu Configuration ---
    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        placement: 'bottom-end',
        whileElementsMounted: autoUpdate,
        middleware: [
            offset(8),
            flip({ fallbackPlacements: ['top-end', 'right-start'] }),
            shift({ padding: 8 })
        ],
    });

    // --- Submenu Configuration (The Fix) ---
    const { 
        refs: subRefs, 
        floatingStyles: subStyles, 
        context: subContext 
    } = useFloating({
        open: isSubOpen,
        onOpenChange: setIsSubOpen,
        placement: 'left-start', // Tries left first
        middleware: [
            offset({ mainAxis: 4, alignmentAxis: -5 }),
            flip(), // Automatically flips to 'right-start' if left is blocked!
            shift({ padding: 8 })
        ],
        whileElementsMounted: autoUpdate,
    });

    // Interactions for Main Menu
    const click = useClick(context);
    const dismiss = useDismiss(context);
    const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

    // Interactions for Submenu (Hover logic)
    const subHover = useHover(subContext, {
        handleClose: safePolygon(), // Allows diagonal mouse movement without closing
    });
    const { getReferenceProps: getSubRefProps, getFloatingProps: getSubProps } = useInteractions([subHover]);

    return (
        <>
            {/* --- Trigger Button --- */}
            <button
                ref={refs.setReference}
                {...getReferenceProps()}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className={`p-1 hover:text-white transition-opacity ${isOpen ? 'text-white opacity-100' : 'text-gray-400 opacity-0 group-hover:opacity-100'}`}
            >
                <MoreVertical size={18} />
            </button>

            {/* --- Main Floating Menu --- */}
            {isOpen && (
                <div
                    ref={refs.setFloating}
                    style={floatingStyles}
                    {...getFloatingProps()}
                    className="w-60 bg-[#282828] shadow-2xl rounded-md z-[100] p-1 border border-white/10 outline-none"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* 1. Liked Page Context */}
                    {menuContext === 'liked' && (
                        <>
                            <button
                                onClick={(e) => {
                                    if (onRemoveLike) onRemoveLike(e, song._id);
                                    setIsOpen(false);
                                }}
                                className="w-full text-left px-3 py-2.5 hover:bg-white/10 rounded-sm text-sm text-gray-200 flex items-center gap-3 transition"
                            >
                                <MinusCircle size={16} className="text-gray-400" />
                                <span>Remove from Liked Songs</span>
                            </button>
                            <div className="h-[1px] bg-white/10 my-1 mx-2"></div>
                        </>
                    )}

                    {/* 2. Add to Playlist (With Smart Submenu) */}
                    {menuContext !== 'playlist' && (
                        <div 
                            ref={subRefs.setReference} 
                            {...getSubRefProps()}
                            className={`relative w-full rounded-sm text-sm text-gray-200 flex items-center justify-between transition cursor-default px-3 py-2.5 hover:bg-white/10 ${isSubOpen ? 'bg-white/10' : ''}`}
                        >
                            <div className="flex items-center gap-3">
                                <Plus size={16} className="text-gray-400" />
                                <span>Add to playlist</span>
                            </div>
                            <ChevronRight size={16} className="text-gray-400" />

                            {/* --- The Smart Submenu --- */}
                            {isSubOpen && (
                                <div
                                    ref={subRefs.setFloating}
                                    style={subStyles}
                                    {...getSubProps()}
                                    className="w-64 bg-[#282828] shadow-2xl rounded-md border border-white/10 flex flex-col py-1 z-[110] outline-none"
                                >
                                    {/* Submenu Search */}
                                    <div className="px-2 py-2">
                                        <div className="bg-white/10 rounded-sm flex items-center px-2 py-1.5 gap-2">
                                            <Search size={14} className="text-gray-400" />
                                            <input 
                                                autoFocus
                                                type="text" 
                                                placeholder="Find a playlist" 
                                                className="bg-transparent border-none text-xs text-white outline-none w-full placeholder:text-gray-400" 
                                            />
                                        </div>
                                    </div>

                                    <button className="w-full text-left px-3 py-2 hover:bg-white/10 text-sm text-gray-200 flex items-center gap-3 transition">
                                        <Plus size={16} className="text-gray-400" />
                                        <span className="font-medium">New playlist</span>
                                    </button>

                                    <div className="h-[1px] bg-white/10 my-1 mx-2"></div>

                                    {/* Playlist List */}
                                    <div className="max-h-48 overflow-y-auto custom-scrollbar">
                                        {playlists.map(p => (
                                            <button
                                                key={p._id}
                                                onClick={(e) => {
                                                    if (onAddToPlaylist) onAddToPlaylist(e, p._id, song._id);
                                                    setIsOpen(false);
                                                    setIsSubOpen(false);
                                                }}
                                                className="w-full text-left px-3 py-2.5 hover:bg-white/10 text-sm text-gray-200 transition truncate"
                                            >
                                                {p.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 3. Playlist Context */}
                    {menuContext === 'playlist' && (
                        <button
                            onClick={(e) => {
                                if (onRemoveFromPlaylist) onRemoveFromPlaylist(e, song._id);
                                setIsOpen(false);
                            }}
                            className="w-full text-left px-3 py-2.5 hover:bg-white/10 rounded-sm text-sm text-red-500 flex items-center gap-3 transition"
                        >
                            <MinusCircle size={16} className="text-red-500" />
                            <span>Remove from this playlist</span>
                        </button>
                    )}

                    {/* Common Items */}
                    <button className="w-full text-left px-3 py-2.5 hover:bg-white/10 rounded-sm text-sm text-gray-200 flex items-center gap-3 transition mt-1">
                        <Radio size={16} className="text-gray-400" />
                        <span>Go to song radio</span>
                    </button>
                    <button className="w-full text-left px-3 py-2.5 hover:bg-white/10 rounded-sm text-sm text-gray-200 flex items-center gap-3 transition">
                        <User size={16} className="text-gray-400" />
                        <span>Go to artist</span>
                    </button>
                    <button className="w-full text-left px-3 py-2.5 hover:bg-white/10 rounded-sm text-sm text-gray-200 flex items-center gap-3 transition border-t border-white/5">
                        <Share size={16} className="text-gray-400" />
                        <span>Share</span>
                    </button>
                </div>
            )}
        </>
    );
};

export default SongMenu;