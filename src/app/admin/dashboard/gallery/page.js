'use client';

import { useEffect, useState, useCallback } from 'react';
import { get, put, del, upload }            from '@/utils/api';
import Topbar       from '@/components/admin/Topbar';
import Spinner      from '@/components/shared/Spinner';
import Toast        from '@/components/shared/Toast';
import ConfirmModal from '@/components/admin/ConfirmModal';

const TABS = ['Photos', 'Videos'];

export default function AdminGalleryPage() {
  const [tab,          setTab]          = useState('Photos');
  const [photos,       setPhotos]       = useState([]);
  const [videos,       setVideos]       = useState([]);
  const [albums,       setAlbums]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [uploading,    setUploading]    = useState(false);
  const [toast,        setToast]        = useState(null);
  const [confirm,      setConfirm]      = useState(null);
  const [filterAlbum,  setFilterAlbum]  = useState('All');

  // Photo form
  const [showPhotoForm,  setShowPhotoForm]  = useState(false);
  const [photoFile,      setPhotoFile]      = useState(null);
  const [photoPreview,   setPhotoPreview]   = useState('');
  const [photoCaption,   setPhotoCaption]   = useState('');
  const [photoAlbum,     setPhotoAlbum]     = useState('');
  const [newAlbum,       setNewAlbum]       = useState('');

  // Video form
  const [showVideoForm,  setShowVideoForm]  = useState(false);
  const [videoType,      setVideoType]      = useState('youtube');
  const [videoTitle,     setVideoTitle]     = useState('');
  const [youtubeUrl,     setYoutubeUrl]     = useState('');
  const [videoFile,      setVideoFile]      = useState(null);

  const showToast = (msg, type = 'success') => setToast({ message: msg, type });

  const fetchAll = useCallback(async () => {
    try {
      const [photosRes, videosRes, albumsRes] = await Promise.all([
        get('/api/gallery/photos'),
        get('/api/gallery/videos'),
        get('/api/gallery/photos/albums'),
      ]);
      setPhotos(photosRes.data  || []);
      setVideos(videosRes.data  || []);
      setAlbums(albumsRes.data  || []);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── PHOTO handlers ──
  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handlePhotoUpload = async () => {
    if (!photoFile) { showToast('Select an image first', 'error'); return; }
    const album = newAlbum.trim() || photoAlbum || 'General';
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image',   photoFile);
      fd.append('caption', photoCaption);
      fd.append('album',   album);
      await upload('/api/gallery/photos', fd);
      showToast('Photo uploaded');
      setShowPhotoForm(false);
      setPhotoFile(null);
      setPhotoPreview('');
      setPhotoCaption('');
      setPhotoAlbum('');
      setNewAlbum('');
      fetchAll();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const togglePhotoPublish = async (photo) => {
    try {
      await put(`/api/gallery/photos/${photo._id}`, { published: !photo.published });
      showToast(photo.published ? 'Photo unpublished' : 'Photo published');
      fetchAll();
    } catch (err) { showToast(err.message, 'error'); }
  };

  const deletePhoto = async () => {
    try {
      await del(`/api/gallery/photos/${confirm.id}`);
      showToast('Photo deleted');
      setConfirm(null);
      fetchAll();
    } catch (err) { showToast(err.message, 'error'); setConfirm(null); }
  };

  // ── VIDEO handlers ──
  const handleVideoAdd = async () => {
    if (!videoTitle.trim()) { showToast('Title is required', 'error'); return; }
    if (videoType === 'youtube' && !youtubeUrl.trim()) {
      showToast('YouTube URL is required', 'error'); return;
    }
    if (videoType === 'cloudinary' && !videoFile) {
      showToast('Select a video file', 'error'); return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('title', videoTitle);
      fd.append('type',  videoType);
      if (videoType === 'youtube')    fd.append('url',   youtubeUrl);
      if (videoType === 'cloudinary') fd.append('video', videoFile);
      await upload('/api/gallery/videos', fd);
      showToast('Video added');
      setShowVideoForm(false);
      setVideoTitle('');
      setYoutubeUrl('');
      setVideoFile(null);
      setVideoType('youtube');
      fetchAll();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const toggleVideoPublish = async (video) => {
    try {
      await put(`/api/gallery/videos/${video._id}`, { published: !video.published });
      showToast(video.published ? 'Video unpublished' : 'Video published');
      fetchAll();
    } catch (err) { showToast(err.message, 'error'); }
  };

  const deleteVideo = async () => {
    try {
      await del(`/api/gallery/videos/${confirm.id}`);
      showToast('Video deleted');
      setConfirm(null);
      fetchAll();
    } catch (err) { showToast(err.message, 'error'); setConfirm(null); }
  };

  // Filter photos
  const filteredPhotos = photos.filter(p =>
    filterAlbum === 'All' || p.album === filterAlbum
  );

  return (
    <>
      <Topbar
        title="Gallery"
        subtitle={`${photos.length} photos · ${videos.length} videos`}
      />

      <div className="p-5 space-y-4">

        {/* Tab bar */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1">
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-5 py-1.5 rounded-lg text-[12px] font-medium transition-all
                  ${tab === t ? 'bg-[#0F4C81] text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                {t}
                <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full
                  ${tab === t ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {t === 'Photos' ? photos.length : videos.length}
                </span>
              </button>
            ))}
          </div>

          {tab === 'Photos' ? (
            <button onClick={() => setShowPhotoForm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-[12px] font-medium"
              style={{ background: 'linear-gradient(135deg, #0F4C81, #1A6BAD)' }}>
              + Upload Photo
            </button>
          ) : (
            <button onClick={() => setShowVideoForm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-[12px] font-medium"
              style={{ background: 'linear-gradient(135deg, #0F4C81, #1A6BAD)' }}>
              + Add Video
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : tab === 'Photos' ? (

          // ══ PHOTOS TAB ══
          <>
            {/* Album filter */}
            <div className="flex gap-2 flex-wrap">
              {['All', ...albums].map(a => (
                <button key={a} onClick={() => setFilterAlbum(a)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] border transition-all
                    ${filterAlbum === a
                      ? 'bg-[#0F4C81] text-white border-[#0F4C81]'
                      : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'}`}>
                  {a}
                </button>
              ))}
            </div>

            {filteredPhotos.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                <p className="text-gray-300 text-[13px]">No photos yet</p>
                <button onClick={() => setShowPhotoForm(true)} className="mt-2 text-[12px] text-[#0F4C81]">
                  Upload your first photo →
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {filteredPhotos.map(photo => (
                  <div key={photo._id}
                    className={`group relative rounded-xl overflow-hidden border transition-all
                      ${photo.published ? 'border-green-200' : 'border-gray-100'}`}>
                    <img src={photo.imageUrl} alt={photo.caption || ''}
                      className="w-full aspect-square object-cover" />

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100
                      transition-all flex flex-col justify-between p-2">
                      <div className="flex justify-end">
                        <button
                          onClick={() => setConfirm({ id: photo._id, name: photo.caption || 'this photo', type: 'photo' })}
                          className="w-6 h-6 rounded-lg bg-red-500 text-white text-[11px] flex items-center justify-center">
                          ✕
                        </button>
                      </div>
                      <div>
                        {photo.caption && (
                          <p className="text-white text-[10px] mb-1.5 line-clamp-2">{photo.caption}</p>
                        )}
                        <button onClick={() => togglePhotoPublish(photo)}
                          className={`w-full py-1 rounded-lg text-[10px] font-medium transition-all
                            ${photo.published
                              ? 'bg-green-500 text-white hover:bg-red-500'
                              : 'bg-white/20 text-white hover:bg-green-500'}`}>
                          {photo.published ? '✓ Live' : 'Publish'}
                        </button>
                      </div>
                    </div>

                    {/* Album badge */}
                    <div className="absolute top-2 left-2">
                      <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-black/40 text-white">
                        {photo.album}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>

        ) : (

          // ══ VIDEOS TAB ══
          <div className="space-y-3">
            {videos.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                <p className="text-gray-300 text-[13px]">No videos yet</p>
                <button onClick={() => setShowVideoForm(true)} className="mt-2 text-[12px] text-[#0F4C81]">
                  Add your first video →
                </button>
              </div>
            ) : (
              videos.map(video => (
                <div key={video._id}
                  className={`bg-white rounded-xl border overflow-hidden transition-all
                    ${video.published ? 'border-green-100' : 'border-gray-100'}`}>
                  <div className="flex items-start gap-4 p-4">

                    {/* Thumbnail / Preview */}
                    <div className="w-32 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100">
                      {video.thumbnailUrl ? (
                        <img src={video.thumbnailUrl} alt={video.title}
                          className="w-full h-full object-cover" />
                      ) : video.type === 'cloudinary' ? (
                        <video src={video.url} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-[10px] text-gray-300">No preview</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-[13px] font-medium text-gray-800">{video.title}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border
                          ${video.type === 'youtube'
                            ? 'bg-red-50 text-red-600 border-red-100'
                            : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                          {video.type === 'youtube' ? 'YouTube' : 'Cloudinary'}
                        </span>
                        {video.published ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-100 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" /> Live
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-50 text-gray-400 border border-gray-100">
                            Draft
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-300 truncate">{video.url}</p>
                      <p className="text-[10px] text-gray-300 mt-0.5">
                        {new Date(video.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => toggleVideoPublish(video)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all
                          ${video.published
                            ? 'bg-green-50 text-green-600 border-green-100 hover:bg-red-50 hover:text-red-500 hover:border-red-100'
                            : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-green-50 hover:text-green-600 hover:border-green-100'
                          }`}>
                        {video.published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button onClick={() => setConfirm({ id: video._id, name: video.title, type: 'video' })}
                        className="px-3 py-1.5 rounded-lg bg-red-50 border border-red-100 text-[11px] text-red-500 hover:bg-red-100 transition-all">
                        Del
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* ══ PHOTO UPLOAD DRAWER ══ */}
      {showPhotoForm && (
        <div className="fixed inset-0 bg-black/40 z-40 flex justify-end">
          <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-[14px] font-medium text-gray-800">Upload Photo</h2>
              <button onClick={() => setShowPhotoForm(false)}
                className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                ✕
              </button>
            </div>

            <div className="flex-1 px-6 py-5 space-y-4 overflow-auto">

              {/* Photo select */}
              <label className="block w-full aspect-video rounded-xl border-2 border-dashed
                border-gray-200 cursor-pointer hover:border-[#0F4C81] transition-all overflow-hidden">
                {photoPreview ? (
                  <img src={photoPreview} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#0F4C81] text-lg">
                      ↑
                    </div>
                    <p className="text-[12px] text-gray-400">Click to select image</p>
                    <p className="text-[10px] text-gray-300">JPG, PNG, WEBP up to 50MB</p>
                  </div>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoSelect} />
              </label>

              {/* Caption */}
              <div>
                <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1.5 block">
                  Caption (optional)
                </label>
                <input type="text" value={photoCaption}
                  onChange={e => setPhotoCaption(e.target.value)}
                  placeholder="Describe this photo..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[13px]
                    focus:outline-none focus:border-[#0F4C81] transition-all"
                />
              </div>

              {/* Album */}
              <div>
                <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1.5 block">
                  Album
                </label>
                {/* Existing albums */}
                {albums.length > 0 && (
                  <div className="flex gap-2 flex-wrap mb-2">
                    {albums.map(a => (
                      <button key={a} onClick={() => { setPhotoAlbum(a); setNewAlbum(''); }}
                        className={`px-3 py-1 rounded-lg text-[11px] border transition-all
                          ${photoAlbum === a && !newAlbum
                            ? 'bg-[#0F4C81] text-white border-[#0F4C81]'
                            : 'bg-gray-50 text-gray-500 border-gray-100 hover:border-gray-300'}`}>
                        {a}
                      </button>
                    ))}
                  </div>
                )}
                {/* New album */}
                <input type="text" value={newAlbum}
                  onChange={e => { setNewAlbum(e.target.value); setPhotoAlbum(''); }}
                  placeholder="Or type a new album name..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[13px]
                    focus:outline-none focus:border-[#0F4C81] transition-all"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button onClick={() => setShowPhotoForm(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-[12px] text-gray-500 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handlePhotoUpload} disabled={uploading || !photoFile}
                className="flex-1 py-2.5 rounded-xl text-white text-[12px] font-medium
                  flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #0F4C81, #1A6BAD)' }}>
                {uploading ? <Spinner size="sm" /> : null}
                {uploading ? 'Uploading...' : 'Upload Photo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ VIDEO ADD DRAWER ══ */}
      {showVideoForm && (
        <div className="fixed inset-0 bg-black/40 z-40 flex justify-end">
          <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-[14px] font-medium text-gray-800">Add Video</h2>
                <p className="text-[11px] text-gray-400 mt-0.5">YouTube embed or upload file</p>
              </div>
              <button onClick={() => setShowVideoForm(false)}
                className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                ✕
              </button>
            </div>

            <div className="flex-1 px-6 py-5 space-y-4 overflow-auto">

              {/* Video type selector */}
              <div>
                <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2 block">
                  Video Source
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setVideoType('youtube')}
                    className={`py-3 rounded-xl border text-[12px] font-medium transition-all flex flex-col items-center gap-1
                      ${videoType === 'youtube'
                        ? 'bg-red-50 border-red-200 text-red-600'
                        : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-300'}`}>
                    <span className="text-lg">▶</span>
                    YouTube URL
                  </button>
                  <button onClick={() => setVideoType('cloudinary')}
                    className={`py-3 rounded-xl border text-[12px] font-medium transition-all flex flex-col items-center gap-1
                      ${videoType === 'cloudinary'
                        ? 'bg-blue-50 border-blue-200 text-blue-600'
                        : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-300'}`}>
                    <span className="text-lg">↑</span>
                    Upload File
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1.5 block">
                  Video Title *
                </label>
                <input type="text" value={videoTitle}
                  onChange={e => setVideoTitle(e.target.value)}
                  placeholder="e.g. Opening Ceremony 2026"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[13px]
                    focus:outline-none focus:border-[#0F4C81] transition-all"
                />
              </div>

              {/* YouTube URL */}
              {videoType === 'youtube' && (
                <div>
                  <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1.5 block">
                    YouTube URL *
                  </label>
                  <input type="url" value={youtubeUrl}
                    onChange={e => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[13px]
                      focus:outline-none focus:border-[#0F4C81] transition-all"
                  />
                  {/* Preview */}
                  {youtubeUrl && (() => {
                    const ytId = youtubeUrl.match(/(?:v=|youtu\.be\/)([^&?\s]{11})/)?.[1];
                    return ytId ? (
                      <div className="mt-2 rounded-xl overflow-hidden border border-gray-100">
                        <iframe
                          src={`https://www.youtube.com/embed/${ytId}`}
                          className="w-full aspect-video"
                          allowFullScreen
                        />
                      </div>
                    ) : null;
                  })()}
                  <p className="text-[10px] text-gray-300 mt-1">
                    Paste any YouTube watch URL — we convert it automatically
                  </p>
                </div>
              )}

              {/* Cloudinary video upload */}
              {videoType === 'cloudinary' && (
                <div>
                  <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1.5 block">
                    Video File *
                  </label>
                  <label className="block w-full py-8 rounded-xl border-2 border-dashed
                    border-gray-200 cursor-pointer hover:border-[#0F4C81] transition-all text-center">
                    {videoFile ? (
                      <div className="text-[12px] text-gray-600">
                        <p className="font-medium">{videoFile.name}</p>
                        <p className="text-gray-400 mt-1">
                          {(videoFile.size / 1024 / 1024).toFixed(1)} MB
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className="text-[12px] text-gray-400">Click to select video file</p>
                        <p className="text-[10px] text-gray-300 mt-1">MP4, MKV, WEBM up to 50MB</p>
                      </>
                    )}
                    <input type="file" accept="video/*" className="hidden"
                      onChange={e => setVideoFile(e.target.files[0])} />
                  </label>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button onClick={() => setShowVideoForm(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-[12px] text-gray-500 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleVideoAdd} disabled={uploading}
                className="flex-1 py-2.5 rounded-xl text-white text-[12px] font-medium
                  flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #0F4C81, #1A6BAD)' }}>
                {uploading ? <Spinner size="sm" /> : null}
                {uploading ? 'Adding...' : 'Add Video'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm + Toast */}
      {confirm && (
        <ConfirmModal
          message={`Delete "${confirm.name}"? This cannot be undone.`}
          onConfirm={confirm.type === 'photo' ? deletePhoto : deleteVideo}
          onCancel={() => setConfirm(null)}
        />
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}