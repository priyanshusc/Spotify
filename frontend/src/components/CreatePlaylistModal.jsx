import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { playlistService } from '../services/playlist.service';
import { X } from 'lucide-react';
import { toast } from 'sonner';

// Notice: We don't strictly *need* onPlaylistCreated/Updated anymore if everything uses React Query, 
// but we keep them for backward compatibility with your current PlaylistPage setup.
const CreatePlaylistModal = ({ isOpen, onClose, onPlaylistCreated, onPlaylistUpdated, initialData = null }) => {

    const isEdit = !!initialData;
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({ name: '', description: '', thumbnail: '' });

    useEffect(() => {
        if (isEdit && isOpen) {
            setFormData({
                name: initialData.name || "",
                description: initialData.description || "",
                thumbnail: initialData.thumbnail || ""
            });
        } else if (!isOpen) {
            setFormData({ name: '', description: '', thumbnail: '' });
        }
    }, [initialData, isOpen, isEdit]);

    const updateMutation = useMutation({
        mutationFn: (data) => playlistService.update(initialData._id, data),
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ['playlists'] });

            toast.success('Playlist updated successfully!');

            if (onPlaylistUpdated) onPlaylistUpdated(res.data);
            onClose();
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to update playlist");
        }
    });

    const createMutation = useMutation({
        mutationFn: (data) => playlistService.create(data.name, data.description, data.thumbnail),
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ['playlists'] });

            if (onPlaylistCreated) onPlaylistCreated(res.data);

            toast.success('Playlist created successfully!');

            setFormData({ name: '', description: '', thumbnail: '' });
            onClose();
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to create playlist");
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEdit) {
            updateMutation.mutate(formData);
        } else {
            createMutation.mutate(formData);
        }
    };

    // Determine loading state from either mutation
    const isPending = updateMutation.isPending || createMutation.isPending;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[999] p-4" onClick={onClose}>
            <div className="bg-[#282828] w-full max-w-[480px] rounded-xl shadow-2xl p-8 flex flex-col gap-6 border border-white/10" onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-white">
                        {isEdit ? "Edit details" : "Create playlist"}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Name</label>
                        <input
                            type="text"
                            placeholder="Playlist Name"
                            className="bg-[#3E3E3E] text-white p-3 rounded-md outline-none focus:bg-[#4E4E4E] border border-transparent focus:border-gray-500 transition"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Thumbnail URL</label>
                        <input
                            type="text"
                            placeholder="https://example.com/image.jpg"
                            className="bg-[#3E3E3E] text-white p-3 rounded-md outline-none focus:bg-[#4E4E4E] border border-transparent focus:border-gray-500 transition"
                            value={formData.thumbnail}
                            onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</label>
                        <textarea
                            placeholder="Add an optional description"
                            rows="3"
                            className="bg-[#3E3E3E] text-white p-3 rounded-md outline-none focus:bg-[#4E4E4E] border border-transparent focus:border-gray-500 transition resize-none"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-4 mt-4">
                        <button type="button" onClick={onClose} className="text-white font-bold hover:scale-105 transition py-2 px-4">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending} // 👈 Use the automated pending state
                            className="bg-white text-black font-bold py-3 px-8 rounded-full hover:scale-105 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isPending ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePlaylistModal;