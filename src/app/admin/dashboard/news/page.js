'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { get, post, put, del, upload }              from '@/utils/api';
import Topbar      from '@/components/admin/Topbar';
import Spinner     from '@/components/shared/Spinner';
import Toast       from '@/components/shared/Toast';
import ConfirmModal from '@/components/admin/ConfirmModal';
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import Quill — avoids SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const CATEGORIES  = ['Announcement', 'Update', 'Result', 'General'];
const emptyForm   = { title: '', content: '', category: 'General', published: false };

// Quill toolbar — supports Malayalam (Unicode) naturally
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    [{ direction: 'rtl' }],  // for right-to-left scripts
    ['link', 'image'],
    [{ color: [] }, { background: [] }],
    ['clean'],
  ],
};

const categoryStyle = (cat) => ({
  Announcement: 'bg-blue-50 text-blue-700 border-blue-100',
  Update:       'bg-amber-50 text-amber-700 border-amber-100',
  Result:       'bg-green-50 text-green-700 border-green-100',
  General:      'bg-gray-50 text-gray-500 border-gray-100',
}[cat] || 'bg-gray-50 text-gray-500 border-gray-100');

export default function AdminNewsPage() {
  const [posts,       setPosts]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [uploading,   setUploading]   = useState(false);
  const [toast,       setToast]       = useState(null);
  const [confirm,     setConfirm]     = useState(null);
  const [showForm,    setShowForm]     = useState(false);
  const [editingId,   setEditingId]   = useState(null);
  const [form,        setForm]        = useState(emptyForm);
  const [coverPreview, setCoverPreview] = useState('');
  const [coverFile,   setCoverFile]   = useState(null);
  const [filterCat,   setFilterCat]   = useState('All');
  const fileRef = useRef();

  const fetchPosts = useCallback(async () => {
    try {
      const res = await get('/api/news');
      setPosts(res.data || []);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const filtered = posts.filter(p =>
    filterCat === 'All' || p.category === filterCat
  );

  // Stats
  const published = posts.filter(p => p.published).length;
  const draft     = posts.length - published;

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setCoverPreview('');
    setCoverFile(null);
    setShowForm(true);
  };

  const openEdit = (post) => {
    setEditingId(post._id);
    setForm({
      title:     post.title     || '',
      content:   post.content   || '',
      category:  post.category  || 'General',
      published: post.published || false,
    });
    setCoverPreview(post.coverImageUrl || '');
    setCoverFile(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setCoverPreview('');
    setCoverFile(null);
  };

  const handleCoverSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      showToast('Title and content are required', 'error'); return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('title',     form.title);
      formData.append('content',   form.content);
      formData.append('category',  form.category);
      formData.append('published', form.published);
      if (coverFile) formData.append('coverImage', coverFile);

      if (editingId) {
        await upload(`/api/news/${editingId}`, formData);
        showToast('Post updated');
      } else {
        await upload('/api/news', formData);
        showToast('Post created');
      }

      closeForm();
      fetchPosts();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (NewsPost) => {
    try {
      await post(`/api/news/${NewsPost._id}`, { published: !NewsPost.published });
      showToast(NewsPost.published ? 'Post unpublished' : 'Post published!');
      fetchPosts();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await del(`/api/news/${confirm.id}`);
      showToast('Post deleted');
      setConfirm(null);
      fetchPosts();
    } catch (err) {
      showToast(err.message, 'error');
      setConfirm(null);
    }
  };

  return (
    <>
      <Topbar title="News & Announcements" subtitle={`${published} published · ${draft} draft`} />

      <div className="p-5 space-y-4">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Posts',  value: posts.length, color: '#0F4C81', bg: 'bg-blue-50'  },
            { label: 'Published',    value: published,    color: '#1D9E75', bg: 'bg-green-50' },
            { label: 'Draft',        value: draft,        color: '#D85A30', bg: 'bg-orange-50'},
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center text-[13px] font-semibold`}
                style={{ color: s.color }}>{s.value}</div>
              <div className="text-[11px] text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex gap-1.5 bg-white border border-gray-100 rounded-xl p-1">
            {['All', ...CATEGORIES].map(c => (
              <button key={c} onClick={() => setFilterCat(c)}
                className={`px-3 py-1 rounded-lg text-[11px] transition-all
                  ${filterCat === c ? 'bg-[#0F4C81] text-white font-medium' : 'text-gray-400 hover:text-gray-600'}`}>
                {c}
              </button>
            ))}
          </div>
          <button onClick={openAdd}
            className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl text-white text-[12px] font-medium"
            style={{ background: 'linear-gradient(135deg, #0F4C81, #1A6BAD)' }}>
            + New Post
          </button>
        </div>

        {/* Posts list */}
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <p className="text-gray-300 text-[13px]">No posts yet</p>
            <button onClick={openAdd} className="mt-2 text-[12px] text-[#0F4C81]">Write your first post →</button>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(post => (
              <div key={post._id}
                className={`bg-white rounded-xl border transition-all overflow-hidden
                  ${post.published ? 'border-green-100' : 'border-gray-100'}`}>
                <div className="flex items-center gap-4 p-4">

                  {/* Cover image */}
                  {post.coverImageUrl ? (
                    <img src={post.coverImageUrl} alt={post.title}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-gray-100" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gray-50 border border-dashed
                      border-gray-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-300 text-[10px]">No img</span>
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-[13px] font-medium text-gray-800 truncate">
                        {post.title}
                      </h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${categoryStyle(post.category)}`}>
                        {post.category}
                      </span>
                      {post.published ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-100 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" /> Live
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-50 text-gray-400 border border-gray-100">
                          Draft
                        </span>
                      )}
                    </div>
                    {/* Content preview — strip HTML */}
                    <p className="text-[11px] text-gray-400 truncate max-w-lg"
                      dangerouslySetInnerHTML={{
                        __html: post.content?.replace(/<[^>]+>/g, '').slice(0, 120) + '...'
                      }}
                    />
                    <div className="text-[10px] text-gray-300 mt-1">
                      {new Date(post.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => togglePublish(post)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all
                        ${post.published
                          ? 'bg-green-50 text-green-600 border-green-100 hover:bg-red-50 hover:text-red-500 hover:border-red-100'
                          : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-green-50 hover:text-green-600 hover:border-green-100'
                        }`}>
                      {post.published ? 'Unpublish' : 'Publish'}
                    </button>
                    <button onClick={() => openEdit(post)}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-100 text-[11px] text-[#0F4C81] hover:bg-blue-100 transition-all">
                      Edit
                    </button>
                    <button onClick={() => setConfirm({ id: post._id, name: post.title })}
                      className="px-3 py-1.5 rounded-lg bg-red-50 border border-red-100 text-[11px] text-red-500 hover:bg-red-100 transition-all">
                      Del
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ══ FORM DRAWER ══ */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-40 flex justify-end">
          <div className="w-full max-w-2xl bg-white h-full flex flex-col shadow-2xl">

            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-[14px] font-medium text-gray-800">
                  {editingId ? 'Edit Post' : 'New Post'}
                </h2>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Supports Malayalam and all Unicode text
                </p>
              </div>
              <button onClick={closeForm}
                className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 text-sm">
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-auto px-6 py-5 space-y-4">

              {/* Cover Image */}
              <div>
                <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2 block">
                  Cover Image
                </label>
                <div className="flex items-center gap-4">
                  {coverPreview ? (
                    <img src={coverPreview} alt="cover"
                      className="w-24 h-16 rounded-xl object-cover border border-gray-100" />
                  ) : (
                    <div className="w-24 h-16 rounded-xl bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center">
                      <span className="text-gray-300 text-[10px]">No image</span>
                    </div>
                  )}
                  <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 border border-blue-100 text-[12px] text-[#0F4C81] cursor-pointer hover:bg-blue-100 transition-all">
                    {uploading ? <Spinner size="sm" /> : null}
                    Choose Image
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleCoverSelect} />
                  </label>
                  {coverPreview && (
                    <button onClick={() => { setCoverPreview(''); setCoverFile(null); }}
                      className="text-[11px] text-red-400 hover:text-red-600">
                      Remove
                    </button>
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1.5 block">
                  Title *
                </label>
                <input type="text" value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Post title — can be in Malayalam too"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[13px]
                    focus:outline-none focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/10 transition-all"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1.5 block">
                  Category
                </label>
                <div className="flex gap-2 flex-wrap">
                  {CATEGORIES.map(c => (
                    <button key={c}
                      onClick={() => setForm(f => ({ ...f, category: c }))}
                      className={`px-3 py-1.5 rounded-xl text-[12px] border transition-all
                        ${form.category === c
                          ? 'bg-[#0F4C81] text-white border-[#0F4C81]'
                          : 'bg-gray-50 text-gray-500 border-gray-100 hover:border-gray-300'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quill Editor */}
              <div>
                <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1.5 block">
                  Content * (supports Malayalam)
                </label>
                <div className="rounded-xl border border-gray-200 overflow-hidden">
                  <ReactQuill
                    theme="snow"
                    value={form.content}
                    onChange={val => setForm(f => ({ ...f, content: val }))}
                    modules={quillModules}
                    placeholder="Write your post here... ഇവിടെ മലയാളത്തിൽ എഴുതാം"
                    style={{ minHeight: '250px' }}
                  />
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 items-center">
              {/* Draft / Publish toggle */}
              <button
                onClick={() => setForm(f => ({ ...f, published: !f.published }))}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] border transition-all
                  ${form.published
                    ? 'bg-green-50 text-green-600 border-green-100'
                    : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                <span className={`w-2 h-2 rounded-full ${form.published ? 'bg-green-500' : 'bg-gray-300'}`} />
                {form.published ? 'Will Publish' : 'Save as Draft'}
              </button>

              <div className="flex gap-3 ml-auto">
                <button onClick={closeForm}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-[12px] text-gray-500 hover:bg-gray-50 transition-all">
                  Cancel
                </button>
                <button onClick={handleSubmit} disabled={saving}
                  className="px-6 py-2.5 rounded-xl text-white text-[12px] font-medium flex items-center gap-2 disabled:opacity-60 transition-all"
                  style={{ background: 'linear-gradient(135deg, #0F4C81, #1A6BAD)' }}>
                  {saving ? <Spinner size="sm" /> : null}
                  {saving ? 'Saving...' : editingId ? 'Update Post' : 'Save Post'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirm && (
        <ConfirmModal
          message={`Delete "${confirm.name}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirm(null)}
        />
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}