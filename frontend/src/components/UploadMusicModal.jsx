import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/api';
import { toast } from 'sonner';
import { X, Upload, Loader2 } from 'lucide-react';

const UploadMusicModal = ({ isOpen, onClose }) => {
    const queryClient = useQueryClient();
    const [title, setTitle] = useState('');
    const [audio, setAudio] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);

    const uploadMutation = useMutation({
        mutationFn: async (formData) => {
            const res = await api.post('/music/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return res.data;
        },
        onSuccess: () => {
            toast.success('Music uploaded successfully!');
            // Invalidate multiple queries where songs might be displayed
            queryClient.invalidateQueries({ queryKey: ['songs'] });
            queryClient.invalidateQueries({ queryKey: ['allSongs'] });
            queryClient.invalidateQueries({ queryKey: ['artistProfile'] });
            queryClient.invalidateQueries({ queryKey: ['authUser'] });
            
            // Reset state
            setTitle('');
            setAudio(null);
            setThumbnail(null);
            onClose();
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to upload music');
        }
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!title || !audio || !thumbnail) {
            toast.error("Please provide title, audio, and thumbnail.");
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('audio', audio);
        formData.append('thumbnail', thumbnail);

        uploadMutation.mutate(formData);
    };

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-[#282828] w-full max-w-md rounded-xl p-6 shadow-2xl relative border border-white/10">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="mb-6 text-center">
                    <div className="mx-auto w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                        <Upload size={24} className="text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Upload Music</h2>
                    <p className="text-sm text-zinc-400 mt-1">Share your latest track with the world.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Track Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Midnight City"
                            className="w-full bg-[#1e1e1e] border border-white/10 rounded-lg p-3 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Audio File</label>
                        <div className="relative">
                            <input
                                type="file"
                                accept="audio/*"
                                onChange={(e) => setAudio(e.target.files[0])}
                                className="w-full bg-[#1e1e1e] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-emerald-500/10 file:text-emerald-500 hover:file:bg-emerald-500/20 cursor-pointer"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Thumbnail Image</label>
                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setThumbnail(e.target.files[0])}
                                className="w-full bg-[#1e1e1e] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-emerald-500/10 file:text-emerald-500 hover:file:bg-emerald-500/20 cursor-pointer"
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={uploadMutation.isPending}
                            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 rounded-full transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploadMutation.isPending ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload size={20} />
                                    Upload Track
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadMusicModal;
