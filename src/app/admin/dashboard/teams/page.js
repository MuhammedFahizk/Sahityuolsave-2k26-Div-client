'use client';

import { useEffect, useState, useCallback } from 'react';
import { get, post, put, del, upload }      from '@/utils/api';
import Topbar                               from '@/components/admin/Topbar';
import Spinner                              from '@/components/shared/Spinner';
import Toast                                from '@/components/shared/Toast';
import ConfirmModal                         from '@/components/admin/ConfirmModal';

// ── Empty form state ──
const emptyForm = {
  name:         '',
  description:  '',
  color:        '#0F4C81',
  managerName:  '',
  totalMembers: '',
  totalPoints:  '',
  logoUrl:      '',
};

export default function AdminTeamsPage() {
  const [teams,        setTeams]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [saving,       setSaving]       = useState(false);
  const [uploading,    setUploading]    = useState(false);
  const [toast,        setToast]        = useState(null);
  const [confirm,      setConfirm]      = useState(null); // { id, name }
  const [showForm,     setShowForm]     = useState(false);
  const [editingId,    setEditingId]    = useState(null);
  const [form,         setForm]         = useState(emptyForm);
  const [logoPreview,  setLogoPreview]  = useState('');

  // Points edit inline
  const [editingPoints, setEditingPoints] = useState(null); // teamId
  const [pointsValue,   setPointsValue]   = useState('');

  // ── Fetch all teams ──
  const fetchTeams = useCallback(async () => {
    try {
      const res = await get('/api/teams');
      setTeams(res.data || []);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTeams(); }, [fetchTeams]);

  const showToast = (message, type = 'success') => setToast({ message, type });

  // ── Open add form ──
  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setLogoPreview('');
    setShowForm(true);
  };

  // ── Open edit form ──
  const openEdit = (team) => {
    setEditingId(team._id);
    setForm({
      name:         team.name         || '',
      description:  team.description  || '',
      color:        team.color        || '#0F4C81',
      managerName:  team.managerName  || '',
      totalMembers: team.totalMembers || '',
      totalPoints:  team.totalPoints  || '',
      logoUrl:      team.logoUrl      || '',
    });
    setLogoPreview(team.logoUrl || '');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setLogoPreview('');
  };

  // ── Handle logo upload ──
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await upload(
        '/api/media/upload-image?folder=festival/teams',
        formData
      );
      setForm(f => ({ ...f, logoUrl: res.url }));
      setLogoPreview(res.url);
      showToast('Logo uploaded');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  // ── Submit form (create or update) ──
  const handleSubmit = async () => {
    if (!form.name.trim()) {
      showToast('Team name is required', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        totalMembers: Number(form.totalMembers) || 0,
        totalPoints:  Number(form.totalPoints)  || 0,
      };

      if (editingId) {
        await put(`/api/teams/${editingId}`, payload);
        showToast('Team updated successfully');
      } else {
        await post('/api/teams', payload);
        showToast('Team created successfully');
      }

      closeForm();
      fetchTeams();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── Delete team ──
  const handleDelete = async () => {
    try {
      await del(`/api/teams/${confirm.id}`);
      showToast('Team deleted');
      setConfirm(null);
      fetchTeams();
    } catch (err) {
      showToast(err.message, 'error');
      setConfirm(null);
    }
  };

  // ── Update points inline ──
  const openPointsEdit = (team) => {
    setEditingPoints(team._id);
    setPointsValue(String(team.totalPoints));
  };

  const savePoints = async (teamId) => {
    try {
      await put(`/api/teams/${teamId}`, {
        totalPoints: Number(pointsValue) || 0,
      });
      showToast('Points updated');
      setEditingPoints(null);
      fetchTeams();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // ── Input helper ──
  const setField = (key, value) => setForm(f => ({ ...f, [key]: value }));

  return (
    <>
      <Topbar
        title="Manage Teams"
        subtitle={`${teams.length} teams registered`}
      />

      <div className="p-5">

        {/* ── Header row ── */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[12px] text-gray-400">
              Add, edit or delete teams. Click points to update directly.
            </p>
          </div>
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-xl
              text-white text-[12px] font-medium transition-all"
            style={{ background: 'linear-gradient(135deg, #0F4C81, #1A6BAD)' }}>
            + Add Team
          </button>
        </div>

        {/* ── Loading ── */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : teams.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12
            text-center">
            <p className="text-gray-300 text-[13px]">No teams yet</p>
            <button onClick={openAdd}
              className="mt-3 text-[12px] text-[#0F4C81]">
              Add your first team →
            </button>
          </div>
        ) : (

          /* ── Teams Table ── */
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-2 px-4 py-2.5
              bg-gray-50 border-b border-gray-100 text-[10px]
              font-medium text-gray-400 uppercase tracking-wider">
              <div className="col-span-1">#</div>
              <div className="col-span-4">Team</div>
              <div className="col-span-2">Manager</div>
              <div className="col-span-1 text-center">Members</div>
              <div className="col-span-2 text-center">Points</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Team rows */}
            {teams.map((team, index) => (
              <div key={team._id}
                className="grid grid-cols-12 gap-2 px-4 py-3
                  border-b border-gray-50 last:border-0
                  hover:bg-gray-50/50 transition-all items-center">

                {/* Rank */}
                <div className="col-span-1">
                  <div className={`w-6 h-6 rounded-md flex items-center
                    justify-center text-[10px] font-medium
                    ${index === 0 ? 'bg-amber-50 text-amber-700'
                    : index === 1 ? 'bg-gray-100 text-gray-500'
                    : index === 2 ? 'bg-orange-50 text-orange-600'
                    : 'bg-blue-50 text-blue-600'}`}>
                    {index + 1}
                  </div>
                </div>

                {/* Team name + logo */}
                <div className="col-span-4 flex items-center gap-2.5">
                  {team.logoUrl ? (
                    <img src={team.logoUrl} alt={team.name}
                      className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-lg flex-shrink-0
                      flex items-center justify-center text-white text-[10px]
                      font-medium"
                      style={{ background: team.color || '#0F4C81' }}>
                      {team.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="text-[12px] font-medium text-gray-800">
                      {team.name}
                    </div>
                    {team.description && (
                      <div className="text-[10px] text-gray-400 truncate max-w-[120px]">
                        {team.description}
                      </div>
                    )}
                  </div>
                </div>

                {/* Manager */}
                <div className="col-span-2 text-[12px] text-gray-500 truncate">
                  {team.managerName || '—'}
                </div>

                {/* Members */}
                <div className="col-span-1 text-center text-[12px] text-gray-600">
                  {team.totalMembers || 0}
                </div>

                {/* Points — click to edit inline */}
                <div className="col-span-2 flex items-center justify-center">
                  {editingPoints === team._id ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={pointsValue}
                        onChange={e => setPointsValue(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') savePoints(team._id);
                          if (e.key === 'Escape') setEditingPoints(null);
                        }}
                        className="w-16 px-2 py-1 text-[12px] border border-[#0F4C81]
                          rounded-lg text-center focus:outline-none"
                        autoFocus
                      />
                      <button onClick={() => savePoints(team._id)}
                        className="w-6 h-6 rounded-md bg-green-50 text-green-600
                          text-[11px] flex items-center justify-center">
                        ✓
                      </button>
                      <button onClick={() => setEditingPoints(null)}
                        className="w-6 h-6 rounded-md bg-red-50 text-red-400
                          text-[11px] flex items-center justify-center">
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => openPointsEdit(team)}
                      className="flex items-center gap-1.5 px-3 py-1
                        rounded-lg bg-blue-50 border border-blue-100
                        text-[12px] font-medium text-[#0F4C81]
                        hover:bg-blue-100 transition-all group">
                      {team.totalPoints || 0}
                      <span className="text-[9px] text-blue-300
                        group-hover:text-blue-500">pts ✎</span>
                    </button>
                  )}
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-end gap-2">
                  <button onClick={() => openEdit(team)}
                    className="px-3 py-1.5 rounded-lg bg-blue-50
                      border border-blue-100 text-[11px] text-[#0F4C81]
                      hover:bg-blue-100 transition-all">
                    Edit
                  </button>
                  <button onClick={() => setConfirm({ id: team._id, name: team.name })}
                    className="px-3 py-1.5 rounded-lg bg-red-50
                      border border-red-100 text-[11px] text-red-500
                      hover:bg-red-100 transition-all">
                    Del
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Add / Edit Form Drawer ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-40 flex justify-end">
          <div className="w-full max-w-md bg-white h-full overflow-auto
            shadow-2xl flex flex-col">

            {/* Drawer header */}
            <div className="flex items-center justify-between px-6 py-4
              border-b border-gray-100">
              <h2 className="text-[14px] font-medium text-gray-800">
                {editingId ? 'Edit Team' : 'Add New Team'}
              </h2>
              <button onClick={closeForm}
                className="w-7 h-7 rounded-lg bg-gray-100 flex items-center
                  justify-center text-gray-400 hover:bg-gray-200 text-sm">
                ✕
              </button>
            </div>

            {/* Drawer body */}
            <div className="flex-1 px-6 py-5 space-y-4 overflow-auto">

              {/* Logo upload */}
              <div>
                <label className="text-[11px] font-medium text-gray-400
                  uppercase tracking-wider mb-2 block">
                  Team Logo
                </label>
                <div className="flex items-center gap-4">
                  {logoPreview ? (
                    <img src={logoPreview} alt="logo"
                      className="w-14 h-14 rounded-xl object-cover
                        border border-gray-100" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-gray-50
                      border border-dashed border-gray-200 flex items-center
                      justify-center text-gray-300 text-xs">
                      Logo
                    </div>
                  )}
                  <label className="flex items-center gap-2 px-4 py-2
                    rounded-xl bg-blue-50 border border-blue-100 text-[12px]
                    text-[#0F4C81] cursor-pointer hover:bg-blue-100 transition-all">
                    {uploading ? <Spinner size="sm" /> : null}
                    {uploading ? 'Uploading...' : 'Upload Image'}
                    <input type="file" accept="image/*" className="hidden"
                      onChange={handleLogoUpload} />
                  </label>
                </div>
              </div>

              {/* Team Name */}
              <div>
                <label className="text-[11px] font-medium text-gray-400
                  uppercase tracking-wider mb-1.5 block">
                  Team Name *
                </label>
                <input type="text" value={form.name}
                  onChange={e => setField('name', e.target.value)}
                  placeholder="e.g. Afdal Nagar"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200
                    text-[13px] focus:outline-none focus:border-[#0F4C81]
                    focus:ring-2 focus:ring-[#0F4C81]/10 transition-all" />
              </div>

              {/* Description */}
              <div>
                <label className="text-[11px] font-medium text-gray-400
                  uppercase tracking-wider mb-1.5 block">
                  Description
                </label>
                <textarea value={form.description}
                  onChange={e => setField('description', e.target.value)}
                  placeholder="Short team bio..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200
                    text-[13px] resize-none focus:outline-none
                    focus:border-[#0F4C81] focus:ring-2
                    focus:ring-[#0F4C81]/10 transition-all" />
              </div>

              {/* Color + Manager in a row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-gray-400
                    uppercase tracking-wider mb-1.5 block">
                    Team Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={form.color}
                      onChange={e => setField('color', e.target.value)}
                      className="w-10 h-10 rounded-lg border border-gray-200
                        cursor-pointer p-0.5" />
                    <input type="text" value={form.color}
                      onChange={e => setField('color', e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-gray-200
                        text-[12px] focus:outline-none focus:border-[#0F4C81]
                        transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-medium text-gray-400
                    uppercase tracking-wider mb-1.5 block">
                    Manager Name
                  </label>
                  <input type="text" value={form.managerName}
                    onChange={e => setField('managerName', e.target.value)}
                    placeholder="Manager name"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200
                      text-[12px] focus:outline-none focus:border-[#0F4C81]
                      transition-all" />
                </div>
              </div>

              {/* Members + Points in a row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-gray-400
                    uppercase tracking-wider mb-1.5 block">
                    Total Members
                  </label>
                  <input type="number" value={form.totalMembers}
                    onChange={e => setField('totalMembers', e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200
                      text-[12px] focus:outline-none focus:border-[#0F4C81]
                      transition-all" />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-gray-400
                    uppercase tracking-wider mb-1.5 block">
                    Total Points
                  </label>
                  <input type="number" value={form.totalPoints}
                    onChange={e => setField('totalPoints', e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200
                      text-[12px] focus:outline-none focus:border-[#0F4C81]
                      transition-all" />
                </div>
              </div>

            </div>

            {/* Drawer footer */}
            <div className="px-6 py-4 border-t border-gray-100
              flex gap-3">
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
                {saving
                  ? 'Saving...'
                  : editingId ? 'Update Team' : 'Create Team'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Confirm Delete Modal ── */}
      {confirm && (
        <ConfirmModal
          message={`Delete "${confirm.name}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}