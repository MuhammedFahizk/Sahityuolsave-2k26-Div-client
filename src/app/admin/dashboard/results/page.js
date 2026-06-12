'use client';

import { useEffect, useState, useCallback } from 'react';
import { get, post, put, del, upload } from '@/utils/api';
import Topbar from '@/components/admin/Topbar';
import Spinner from '@/components/shared/Spinner';
import Toast from '@/components/shared/Toast';
import ConfirmModal from '@/components/admin/ConfirmModal';

// ── Empty form ──
const emptyEntry = { position: '', participantName: '', teamId: '', points: '', grade: '' };
const emptyForm = { resultNumber: '', categoryName: '', group: '', entries: [{ ...emptyEntry }] };

// ── Group options ──
const GROUP_OPTIONS = ['High School', 'Junior', 'Senior', 'Lower Primary', 'General', 'Upper Primary', 'Higher Secondary', 'General Category-A', 'General Category-B', 'Campus'];

// ── Group color pills ──
const groupStyle = (group) => {
  const map = {
    'lower primary': 'bg-yellow-50 text-yellow-700 border-yellow-100',
    'upper primary': 'bg-yellow-50 text-yellow-700 border-yellow-100',
    'high school': 'bg-blue-50 text-blue-700 border-blue-100',
    'junior': 'bg-green-50 text-green-700 border-green-100',
    'senior': 'bg-amber-50 text-amber-700 border-amber-100',
    'higher secondary': 'bg-green-50 text-green-700 border-green-100',
    'general category-a': 'bg-purple-50 text-purple-700 border-purple-100',
    'general category-b': 'bg-purple-50 text-purple-700 border-purple-100',
    'general': 'bg-purple-50 text-purple-700 border-purple-100',
    "campus": 'bg-gray-50 text-gray-500 border-gray-100',
  };
  return map[group?.toLowerCase()] || 'bg-gray-50 text-gray-500 border-gray-100';
};

export default function AdminResultsPage() {
  const [results, setResults] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [filterGroup, setFilterGroup] = useState('All');
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [resultPreview, setResultPreview] = useState('');


  // ── Fetch results + teams ──
  const fetchData = useCallback(async () => {
    try {
      const [resultsRes, teamsRes] = await Promise.all([
        get('/api/results'),
        get('/api/teams'),
      ]);
      setResults(resultsRes.data || []);
      setTeams(teamsRes.data || []);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const showToast = (message, type = 'success') => setToast({ message, type });

  // ── Filter results ──
  const filtered = results.filter(r => {
    const matchGroup = filterGroup === 'All' || r.group?.toLowerCase() === filterGroup.toLowerCase();
    const matchSearch = r.categoryName?.toLowerCase().includes(search.toLowerCase()) ||
      String(r.resultNumber).includes(search);
    return matchGroup && matchSearch;
  });

  // ── Stats ──
  const total = results.length;
  const published = results.filter(r => r.published).length;
  const draft = total - published;

  // ── Open add form ──
  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  // ── Open edit form ──
  const openEdit = (result) => {
    setEditingId(result._id);
    setForm({
      resultNumber: result.resultNumber || '',
      categoryName: result.categoryName || '',
      group: result.group || '',
      resultUrl: result.resultUrl || '',
      entries: result.entries.map(e => ({
        position: e.position || '',
        participantName: e.participantName || '',
        teamId: e.teamId?._id || e.teamId || '',
        points: e.points || '',
        grade: e.grade || '',
      })),
    });
    setResultPreview(result.resultUrl || '');
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditingId(null); setForm(emptyForm); };

  // ── Entry helpers ──
  const addEntry = () => setForm(f => ({ ...f, entries: [...f.entries, { ...emptyEntry }] }));
  const removeEntry = (i) => setForm(f => ({ ...f, entries: f.entries.filter((_, idx) => idx !== i) }));
  const setEntry = (i, key, val) => setForm(f => ({
    ...f,
    entries: f.entries.map((e, idx) => idx === i ? { ...e, [key]: val } : e)
  }));

  // ── Submit ──
  const handleSubmit = async () => {
    if (!form.resultNumber || !form.categoryName) {
      showToast('Result number and category are required', 'error'); return;
    }
    if (form.entries.some(e => !e.participantName || !e.teamId || e.position === '')) {
      showToast('All entry fields (position, name, team) are required', 'error'); return;
    }

    setSaving(true);
    try {
      const payload = {
        resultNumber: Number(form.resultNumber),
        categoryName: form.categoryName,
        group: form.group,
        resultUrl: form.resultUrl,
        entries: form.entries.map(e => ({
          position: Number(e.position),
          participantName: e.participantName,
          teamId: e.teamId,
          points: Number(e.points) || 0,
          grade: e.grade || '',
        })),
      };

      if (editingId) {
        await put(`/api/results/${editingId}`, payload);
        showToast('Result updated');
      } else {
        await post('/api/results', payload);
        showToast('Result created');
      }
      closeForm();
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };
  const handleResultImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await upload(
        '/api/media/upload-image?folder=festival/results',
        formData
      );
      setForm(f => ({ ...f, resultUrl: res.url }));
      setResultPreview(res.url);
      showToast('Result image uploaded');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  // ── Toggle publish / unpublish ──
  const togglePublish = async (result) => {
    try {
      await put(`/api/results/${result._id}`, { published: !result.published });
      showToast(result.published ? 'Result unpublished' : 'Result published!');
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // ── Delete ──
  const handleDelete = async () => {
    try {
      await del(`/api/results/${confirm.id}`);
      showToast('Result deleted');
      setConfirm(null);
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
      setConfirm(null);
    }
  };

  return (
    <>
      <Topbar
        title="Manage Results"
        subtitle={`${published} published · ${draft} draft`}
      />

      <div className="p-5 space-y-4">

        {/* ── Top stat strip ── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Results', value: total, color: '#0F4C81', bg: 'bg-blue-50' },
            { label: 'Published', value: published, color: '#1D9E75', bg: 'bg-green-50' },
            { label: 'Draft', value: draft, color: '#D85A30', bg: 'bg-orange-50' },
          ].map(s => (
            <div key={s.label}
              className="bg-white rounded-xl border border-gray-100
                px-4 py-3 flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center
                justify-center text-[13px] font-semibold`}
                style={{ color: s.color }}>
                {s.value}
              </div>
              <div className="text-[11px] text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Toolbar ── */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <input
            type="text"
            placeholder="Search by category or number..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 min-w-[180px] px-4 py-2 rounded-xl border
              border-gray-200 text-[12px] focus:outline-none
              focus:border-[#0F4C81] transition-all bg-white"
          />

          {/* Group filter tabs */}
          <div className="flex gap-1.5 bg-white border border-gray-100
            rounded-xl p-1">
            {['All', ...GROUP_OPTIONS].map(g => (
              <button key={g}
                onClick={() => setFilterGroup(g)}
                className={`px-3 py-1 rounded-lg text-[11px] transition-all
                  ${filterGroup === g
                    ? 'bg-[#0F4C81] text-white font-medium'
                    : 'text-gray-400 hover:text-gray-600'}`}>
                {g}
              </button>
            ))}
          </div>

          {/* Add button */}
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-xl
              text-white text-[12px] font-medium whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg, #0F4C81, #1A6BAD)' }}>
            + Add Result
          </button>
        </div>

        {/* ── Results list ── */}
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100
            p-12 text-center">
            <p className="text-gray-300 text-[13px]">No results found</p>
            <button onClick={openAdd}
              className="mt-2 text-[12px] text-[#0F4C81]">
              Add your first result →
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(result => (
              <div key={result._id}
                className={`bg-white rounded-xl border transition-all
                  ${result.published
                    ? 'border-green-100 shadow-sm shadow-green-50'
                    : 'border-gray-100'}`}>

                <div className="flex items-center gap-3 px-4 py-3">

                  {/* Result number */}
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border
                    border-blue-100 flex items-center justify-center
                    text-[12px] font-semibold text-[#0F4C81] flex-shrink-0">
                    {String(result.resultNumber).padStart(2, '0')}
                  </div>

                  {/* Category + group */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[13px] font-medium text-gray-800">
                        {result.categoryName}
                      </span>
                      {result.group && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full
                          border ${groupStyle(result.group)}`}>
                          {result.group}
                        </span>
                      )}
                      {/* Published badge */}
                      {result.published ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full
                          bg-green-50 text-green-600 border border-green-100
                          flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500
                            inline-block" />
                          Live
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full
                          bg-gray-50 text-gray-400 border border-gray-100">
                          Draft
                        </span>
                      )}
                    </div>

                    {/* Entries preview */}
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      {result.entries?.slice(0, 3).map((entry, i) => (
                        <div key={i}
                          className="flex items-center gap-1.5 text-[10px]
                            text-gray-400">
                          <span className={`w-4 h-4 rounded-md flex items-center
                            justify-center text-[9px] font-medium
                            ${entry.position === 1 ? 'bg-amber-50 text-amber-600'
                              : entry.position === 2 ? 'bg-gray-100 text-gray-500'
                                : entry.position === 3 ? 'bg-orange-50 text-orange-500'
                                  : 'bg-blue-50 text-blue-500'}`}>
                            {entry.position}
                          </span>
                          <span className="text-gray-600 font-medium">
                            {entry.participantName}
                          </span>
                          <span>·</span>
                          <span>{entry.teamId?.name || '—'}</span>
                        </div>
                      ))}
                      {result.entries?.length > 3 && (
                        <span className="text-[10px] text-gray-300">
                          +{result.entries.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">

                    {/* Publish toggle */}
                    <button onClick={() => togglePublish(result)}
                      className={`px-3 py-1.5 rounded-lg text-[11px]
                        font-medium border transition-all
                        ${result.published
                          ? 'bg-green-50 text-green-600 border-green-100 hover:bg-red-50 hover:text-red-500 hover:border-red-100'
                          : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-green-50 hover:text-green-600 hover:border-green-100'
                        }`}>
                      {result.published ? 'Unpublish' : 'Publish'}
                    </button>

                    <button onClick={() => openEdit(result)}
                      className="px-3 py-1.5 rounded-lg bg-blue-50
                        border border-blue-100 text-[11px] text-[#0F4C81]
                        hover:bg-blue-100 transition-all">
                      Edit
                    </button>

                    <button
                      onClick={() => setConfirm({ id: result._id, name: result.categoryName })}
                      className="px-3 py-1.5 rounded-lg bg-red-50
                        border border-red-100 text-[11px] text-red-500
                        hover:bg-red-100 transition-all">
                      Del
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ══ ADD / EDIT DRAWER ══ */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-40 flex justify-end">
          <div className="w-full max-w-lg bg-white h-full flex flex-col shadow-2xl">

            {/* Drawer header */}
            <div className="flex items-center justify-between px-6 py-4
              border-b border-gray-100">
              <div>
                <h2 className="text-[14px] font-medium text-gray-800">
                  {editingId ? 'Edit Result' : 'Add New Result'}
                </h2>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Fill details and add participant entries
                </p>
              </div>
              <button onClick={closeForm}
                className="w-7 h-7 rounded-lg bg-gray-100 flex items-center
                  justify-center text-gray-400 hover:bg-gray-200 text-sm">
                ✕
              </button>
            </div>

            {/* Drawer body */}
            <div className="flex-1 overflow-auto px-6 py-5 space-y-5">

              {/* Result Number + Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-gray-400
                    uppercase tracking-wider mb-1.5 block">
                    Result Number *
                  </label>
                  <input type="number"
                    value={form.resultNumber}
                    onChange={e => setForm(f => ({ ...f, resultNumber: e.target.value }))}
                    placeholder="e.g. 2"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200
                      text-[13px] focus:outline-none focus:border-[#0F4C81]
                      focus:ring-2 focus:ring-[#0F4C81]/10 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-gray-400
                    uppercase tracking-wider mb-1.5 block">
                    Group
                  </label>
                  <select
                    value={form.group}
                    onChange={e => setForm(f => ({ ...f, group: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200
                      text-[13px] focus:outline-none focus:border-[#0F4C81]
                      transition-all bg-white">
                    <option value="">Select group</option>
                    {GROUP_OPTIONS.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[11px] font-medium text-gray-400
                                   uppercase tracking-wider mb-2 block">
                  Result Image (optional)
                </label>
                <div className="flex items-center gap-4">
                  {resultPreview ? (
                    <img src={resultPreview} alt="logo"
                      className="w-14 h-14 rounded-xl object-cover
                                         border border-gray-100" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-gray-50
                                       border border-dashed border-gray-200 flex items-center
                                       justify-center text-gray-300 text-xs">
                      Result Image
                    </div>
                  )}
                  <label className="flex items-center gap-2 px-4 py-2
                                     rounded-xl bg-blue-50 border border-blue-100 text-[12px]
                                     text-[#0F4C81] cursor-pointer hover:bg-blue-100 transition-all">
                    {uploading ? <Spinner size="sm" /> : null}
                    {uploading ? 'Uploading...' : 'Upload Image'}
                    <input type="file" accept="image/*" className="hidden"
                      onChange={handleResultImageUpload} />
                  </label>
                </div>
              </div>
              {/* Category Name */}
              <div>
                <label className="text-[11px] font-medium text-gray-400
                  uppercase tracking-wider mb-1.5 block">
                  Category Name *
                </label>
                <input type="text"
                  value={form.categoryName}
                  onChange={e => setForm(f => ({ ...f, categoryName: e.target.value }))}
                  placeholder="e.g. Pencil Drawing, Story Writing"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200
                    text-[13px] focus:outline-none focus:border-[#0F4C81]
                    focus:ring-2 focus:ring-[#0F4C81]/10 transition-all"
                />
              </div>

              {/* Entries */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[11px] font-medium text-gray-400
                    uppercase tracking-wider">
                    Participant Entries
                  </label>
                  <button onClick={addEntry}
                    className="text-[11px] text-[#0F4C81] bg-blue-50
                      border border-blue-100 px-3 py-1 rounded-lg
                      hover:bg-blue-100 transition-all">
                    + Add Entry
                  </button>
                </div>

                <div className="space-y-3">
                  {form.entries.map((entry, i) => (
                    <div key={i}
                      className="bg-gray-50 rounded-xl p-3 border border-gray-100">

                      {/* Entry header */}
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-[10px] font-medium text-gray-400
                          uppercase tracking-wider">
                          Entry {i + 1}
                        </span>
                        {form.entries.length > 1 && (
                          <button onClick={() => removeEntry(i)}
                            className="text-[10px] text-red-400
                              hover:text-red-600 transition-all">
                            Remove
                          </button>
                        )}
                      </div>

                      {/* Position + Points */}
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div>
                          <label className="text-[10px] text-gray-400 mb-1 block">
                            Position *
                          </label>
                          <input type="number"
                            value={entry.position}
                            onChange={e => setEntry(i, 'position', e.target.value)}
                            placeholder="1"
                            className="w-full px-3 py-2 rounded-lg border border-gray-200
                              text-[12px] bg-white focus:outline-none
                              focus:border-[#0F4C81] transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400 mb-1 block">
                            Points
                          </label>
                          <input type="number"
                            value={entry.points}
                            onChange={e => setEntry(i, 'points', e.target.value)}
                            placeholder="0"
                            className="w-full px-3 py-2 rounded-lg border border-gray-200
                              text-[12px] bg-white focus:outline-none
                              focus:border-[#0F4C81] transition-all"
                          />
                        </div>


                      </div>

                      {/* Participant Name */}
                      <div className="mb-2 grid grid-cols-3 gap-2">
                        <div className='col-span-2'>  <label className="text-[10px] text-gray-400 mb-1 block">
                          Participant Name *
                        </label>
                          <input type="text"
                            value={entry.participantName}
                            onChange={e => setEntry(i, 'participantName', e.target.value)}
                            placeholder="e.g. Afsal T"
                            className="w-full px-3 py-2 rounded-lg border border-gray-200
                            text-[12px] bg-white focus:outline-none
                            focus:border-[#0F4C81] transition-all"
                          /></div>

                        <div>
                          <label className="text-[10px] text-gray-400 mb-1 block">
                            Grade
                          </label>
                          <input type="text"
                            value={entry.grade}
                            onChange={e => setEntry(i, 'grade', e.target.value.toUpperCase())}
                            placeholder="A"
                            className="w-full px-3 py-2 rounded-lg border border-gray-200
                              text-[12px] bg-white focus:outline-none
                              focus:border-[#0F4C81] uppercase transition-all"
                          />
                        </div>
                      </div>

                      {/* Team dropdown */}
                      <div>
                        <label className="text-[10px] text-gray-400 mb-1 block">
                          Team *
                        </label>
                        <select
                          value={entry.teamId}
                          onChange={e => setEntry(i, 'teamId', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200
                            text-[12px] bg-white focus:outline-none
                            focus:border-[#0F4C81] transition-all">
                          <option value="">Select team</option>
                          {teams
                            .filter(t => {
                              const isCampus = form.group?.toLowerCase() === 'campus';
                              return isCampus ? t.teamType === 'campus' : t.teamType !== 'campus';
                            })
                            .map(team => (
                            <option key={team._id} value={team._id}>
                              {team.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button onClick={closeForm}
                className="flex-1 py-2.5 rounded-xl border border-gray-200
                  text-[12px] text-gray-500 hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={saving}
                className="flex-1 py-2.5 rounded-xl text-white text-[12px]
                  font-medium flex items-center justify-center gap-2
                  disabled:opacity-60 transition-all"
                style={{ background: 'linear-gradient(135deg, #0F4C81, #1A6BAD)' }}>
                {saving ? <Spinner size="sm" /> : null}
                {saving ? 'Saving...' : editingId ? 'Update Result' : 'Create Result'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Confirm delete ── */}
      {confirm && (
        <ConfirmModal
          message={`Delete "${confirm.name}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </>
  );
}