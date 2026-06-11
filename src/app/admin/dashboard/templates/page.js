'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { get, post, put, del, upload } from '@/utils/api';
import Topbar from '@/components/admin/Topbar';
import Spinner from '@/components/shared/Spinner';
import Toast from '@/components/shared/Toast';
import ConfirmModal from '@/components/admin/ConfirmModal';

// ── Constants ─────────────────────────────────────────────────────────────────

const emptyTemplate = {
  name: '',
  imagePath: '',
  active: true,
  resultNumber: { x: 100, y: 150, fontSize: 48, color: '#ffffff', fontWeight: 'bold',   textAlign: 'center' },
  categoryName: { x: 100, y: 220, fontSize: 32, color: '#ffffff', fontWeight: 'normal', textAlign: 'center' },
  group:        { x: 100, y: 280, fontSize: 24, color: '#dddddd', fontWeight: 'normal', textAlign: 'center' },
  winners:      { startX: 100, startY: 380, gapY: 60, fontSize: 28, color: '#FFD700', textAlign: 'center' },
};

const sampleResult = {
  resultNumber: 102,
  categoryName: 'Arabic Poem',
  group: 'High School',
  entries: [
    { position: 1, participantName: 'Ibrahim Ahmed',  teamId: { name: 'Blue House'  }, grade: 'A+' },
    { position: 2, participantName: 'Razi Mohammed',  teamId: { name: 'Red House'   }, grade: 'A'  },
    { position: 3, participantName: 'Nabeel Hassan',  teamId: { name: 'Green House' }, grade: 'A-' },
  ],
};

function resolveX(align, x, canvasWidth) {
  if (align === 'center') return canvasWidth / 2;
  if (align === 'right')  return canvasWidth - x;
  return x;
}

// ── FieldSection — defined OUTSIDE the parent so it never remounts on state change ──

function FieldSection({ title, field, isWinners, data, onUpdate }) {
  const upd = (k, v) => onUpdate(field, k, v);

  return (
    <div className="bg-white rounded-xl border p-5">
      <h3 className="text-base font-semibold mb-4 text-gray-800">{title}</h3>
      <div className="grid grid-cols-2 gap-3">

        {/* X / startX */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            {isWinners ? 'Start X (px)' : 'X Position (px)'}
          </label>
          <input
            type="number"
            value={isWinners ? (data.startX ?? 0) : (data.x ?? 0)}
            onChange={e => upd(isWinners ? 'startX' : 'x', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:border-blue-400"
          />
        </div>

        {/* Y / startY */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            {isWinners ? 'Start Y (px)' : 'Y Position (px)'}
          </label>
          <input
            type="number"
            value={isWinners ? (data.startY ?? 0) : (data.y ?? 0)}
            onChange={e => upd(isWinners ? 'startY' : 'y', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:border-blue-400"
          />
        </div>

        {/* gapY — winners only */}
        {isWinners && (
          <div>
            <label className="block text-xs text-gray-500 mb-1">Gap Between Rows (px)</label>
            <input
              type="number"
              value={data.gapY ?? 60}
              onChange={e => upd('gapY', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
        )}

        {/* Font Size */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Font Size</label>
          <input
            type="number"
            value={data.fontSize ?? 24}
            onChange={e => upd('fontSize', parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:border-blue-400"
          />
        </div>

        {/* Color */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Font Color</label>
          <input
            type="color"
            value={data.color || '#000000'}
            onChange={e => upd('color', e.target.value)}
            className="w-full h-10 rounded-lg border cursor-pointer"
          />
        </div>

        {/* Font Weight — non-winners only */}
        {!isWinners && (
          <div>
            <label className="block text-xs text-gray-500 mb-1">Font Weight</label>
            <select
              value={data.fontWeight || 'normal'}
              onChange={e => upd('fontWeight', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border text-sm bg-white focus:outline-none focus:border-blue-400"
            >
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
            </select>
          </div>
        )}

        {/* Text Align */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Alignment</label>
          <select
            value={data.textAlign || 'center'}
            onChange={e => upd('textAlign', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border text-sm bg-white focus:outline-none focus:border-blue-400"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
      </div>

      {isWinners && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-600">
            💡 Each winner row is drawn {data.gapY || 60}px below the previous.
            Text baseline sits <strong>at</strong> the Y coordinate — same as the public poster.
          </p>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AdminTemplatesPage() {
  const [templates,    setTemplates]    = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [saving,       setSaving]       = useState(false);
  const [uploading,    setUploading]    = useState(false);
  const [showForm,     setShowForm]     = useState(false);
  const [toast,        setToast]        = useState(null);
  const [confirm,      setConfirm]      = useState(null);
  const [editingId,    setEditingId]    = useState(null);
  const [template,     setTemplate]     = useState(emptyTemplate);
  const [previewImage, setPreviewImage] = useState(null);
  const previewCanvasRef = useRef(null);

  // ── Fetch ──
  const fetchTemplates = useCallback(async () => {
    try {
      const res = await get('/api/templates');
      setTemplates(res.data || []);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTemplates(); }, [fetchTemplates]);

  const showToast = (message, type = 'success') => setToast({ message, type });

  // ── Update handler passed to FieldSection ──
  // field = 'resultNumber' | 'categoryName' | 'group' | 'winners'
  const handleFieldUpdate = useCallback((field, key, value) => {
    setTemplate(prev => ({
      ...prev,
      [field]: { ...prev[field], [key]: value },
    }));
  }, []);

  // ── Canvas preview ──
  const drawPreview = useCallback(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas || !template.imagePath) return;

    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width  = img.width;
      canvas.height = img.height;
      const W = canvas.width;

      ctx.drawImage(img, 0, 0, W, canvas.height);

      const draw = (cfg, text) => {
        if (!cfg || !text) return;
        ctx.save();
        ctx.font         = `${cfg.fontWeight || 'normal'} ${cfg.fontSize}px "Poppins", "Segoe UI", system-ui`;
        ctx.fillStyle    = cfg.color;
        ctx.textAlign    = cfg.textAlign;
        ctx.textBaseline = 'alphabetic';
        ctx.fillText(text, resolveX(cfg.textAlign, cfg.x ?? cfg.startX, W), cfg.y ?? cfg.startY);
        ctx.restore();
      };

      draw(template.resultNumber, String(sampleResult.resultNumber));
      draw(template.categoryName, sampleResult.categoryName);
      draw(template.group,        sampleResult.group);

      if (template.winners) {
        const w = template.winners;
        sampleResult.entries.forEach((winner, i) => {
          ctx.save();
          ctx.font         = `${w.fontSize}px "Poppins", "Segoe UI", system-ui`;
          ctx.fillStyle    = w.color;
          ctx.textAlign    = w.textAlign;
          ctx.textBaseline = 'alphabetic';
          ctx.fillText(
            `${winner.position}. ${winner.participantName}`,
            resolveX(w.textAlign, w.startX, W),
            w.startY + i * (w.gapY || 60)
          );
          ctx.restore();
        });
      }
    };

    img.src = template.imagePath;
  }, [template]);

  useEffect(() => {
    if (template.imagePath) drawPreview();
  }, [drawPreview, template]);

  // ── Image upload ──
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await upload('/api/media/upload-image?folder=templates', formData);
      setTemplate(prev => ({ ...prev, imagePath: res.url }));
      setPreviewImage(res.url);
      showToast('Background image uploaded');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  // ── Submit ──
  const handleSubmit = async () => {
    if (!template.name || !template.imagePath) {
      showToast('Template name and background image are required', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: template.name, imagePath: template.imagePath, active: template.active,
        resultNumber: template.resultNumber, categoryName: template.categoryName,
        group: template.group, winners: template.winners,
      };
      if (editingId) {
        await put(`/api/templates/${editingId}`, payload);
        showToast('Template updated');
      } else {
        await post('/api/templates', payload);
        showToast('Template created');
      }
      setShowForm(false); setEditingId(null);
      setTemplate({ ...emptyTemplate }); setPreviewImage(null);
      fetchTemplates();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (temp) => {
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (temp) {
      setEditingId(temp._id);
      setTemplate({
        name:         temp.name         || '',
        imagePath:    temp.imagePath    || '',
        active:       temp.active       !== false,
        resultNumber: temp.resultNumber || emptyTemplate.resultNumber,
        categoryName: temp.categoryName || emptyTemplate.categoryName,
        group:        temp.group        || emptyTemplate.group,
        winners:      temp.winners      || emptyTemplate.winners,
      });
      setPreviewImage(temp.imagePath);
    } else {
      setEditingId(null);
      setTemplate({ ...emptyTemplate });
      setPreviewImage(null);
    }
  };

  const closeForm = () => {
    setShowForm(false); setEditingId(null);
    setTemplate({ ...emptyTemplate }); setPreviewImage(null);
  };

  const handleDelete = async () => {
    try {
      await del(`/api/templates/${confirm.id}`);
      showToast('Template deleted'); setConfirm(null); fetchTemplates();
    } catch (err) { showToast(err.message, 'error'); setConfirm(null); }
  };

  const toggleActive = async (t) => {
    try {
      await put(`/api/templates/${t._id}`, { active: !t.active });
      showToast(`Template ${!t.active ? 'activated' : 'deactivated'}`);
      fetchTemplates();
    } catch (err) { showToast(err.message, 'error'); }
  };

  return (
    <>
      <Topbar title="Template Management" subtitle="Create and configure result poster templates" />

      <div className="p-5 space-y-4">

        {/* ── List View ── */}
        {!showForm && (
          <>
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <div className="bg-white rounded-xl px-4 py-2 border">
                  <span className="text-xs text-gray-400">Total Templates</span>
                  <p className="text-xl font-semibold text-gray-800">{templates.length}</p>
                </div>
                <div className="bg-white rounded-xl px-4 py-2 border">
                  <span className="text-xs text-gray-400">Active</span>
                  <p className="text-xl font-semibold text-green-600">
                    {templates.filter(t => t.active).length}
                  </p>
                </div>
              </div>
              <button
                onClick={() => openEdit(null)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium"
                style={{ background: 'linear-gradient(135deg, #0F4C81, #1A6BAD)' }}
              >
                + Create Template
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-16"><Spinner size="lg" /></div>
            ) : templates.length === 0 ? (
              <div className="bg-white rounded-xl border p-12 text-center">
                <p className="text-gray-400">No templates yet</p>
                <button onClick={() => openEdit(null)} className="mt-2 text-[#0F4C81] text-sm">
                  Create your first template →
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {templates.map(temp => (
                  <div key={temp._id} className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-all">
                    <div className="relative h-52 bg-gray-100">
                      {temp.imagePath
                        ? <img src={temp.imagePath} alt={temp.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">No Preview</div>
                      }
                      <div className="absolute top-3 right-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                          ${temp.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {temp.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800">{temp.name}</h3>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => toggleActive(temp)}
                          className={`flex-1 px-3 py-1.5 rounded-lg border text-xs transition-all
                            ${temp.active
                              ? 'border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-500'
                              : 'border-green-200 text-green-600 hover:bg-green-50'}`}
                        >
                          {temp.active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button onClick={() => openEdit(temp)}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs hover:bg-blue-100">
                          Edit
                        </button>
                        <button onClick={() => setConfirm({ id: temp._id, name: temp.name })}
                          className="px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs hover:bg-red-100">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Create / Edit Form ── */}
        {showForm && (
          <div className="space-y-5">
            {/* Sticky header */}
            <div className="flex items-center justify-between bg-white rounded-xl p-4 border sticky top-0 z-20 shadow-sm">
              <div className="flex items-center gap-4">
                <button onClick={closeForm} className="p-2 rounded-lg hover:bg-gray-100 transition-all">
                  ← Back
                </button>
                <h2 className="text-lg font-semibold">
                  {editingId ? 'Edit Template' : 'Create New Template'}
                </h2>
              </div>
              <button
                onClick={handleSubmit} disabled={saving || uploading}
                className="px-6 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50 flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg, #0F4C81, #1A6BAD)' }}
              >
                {saving && <Spinner size="sm" />}
                {editingId ? 'Update' : 'Save Template'}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Left: config */}
              <div className="space-y-5 col-span-3">

                {/* Template info */}
                <div className="bg-white rounded-xl border p-5">
                  <h3 className="text-base font-semibold mb-4 text-gray-800">Template Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Template Name *</label>
                      <input
                        type="text"
                        value={template.name}
                        onChange={e => setTemplate(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Arabic Poem Certificate"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#0F4C81] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Background Image *</label>
                      <div className="flex items-center gap-4">
                        {template.imagePath && (
                          <img src={template.imagePath} alt="Preview" className="w-20 h-20 rounded-lg object-cover border" />
                        )}
                        <label className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 text-sm cursor-pointer hover:bg-blue-100 transition-all">
                          {uploading ? <Spinner size="sm" /> : '📷 Upload Image'}
                          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </label>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">Upload a PNG/JPG poster background</p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={template.active}
                        onChange={e => setTemplate(prev => ({ ...prev, active: e.target.checked }))}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Active (available for public use)</span>
                    </label>
                  </div>
                </div>

                {/* Field sections — each is a stable component outside, no remount on keystroke */}
                <FieldSection
                  title="Result Number Position"
                  field="resultNumber"
                  data={template.resultNumber}
                  onUpdate={handleFieldUpdate}
                />
                <FieldSection
                  title="Category Name Position"
                  field="categoryName"
                  data={template.categoryName}
                  onUpdate={handleFieldUpdate}
                />
                <FieldSection
                  title="Group Name Position"
                  field="group"
                  data={template.group}
                  onUpdate={handleFieldUpdate}
                />
                <FieldSection
                  title="Winners Block"
                  field="winners"
                  isWinners
                  data={template.winners}
                  onUpdate={handleFieldUpdate}
                />
              </div>

              {/* Right: live preview */}
              <div className="col-span-2">
                <div className="bg-white rounded-xl border p-5 sticky top-5">
                  <h3 className="text-base font-semibold mb-4 text-gray-800">Live Preview</h3>

                  {template.imagePath ? (
                    <div className="relative rounded-lg overflow-hidden border">
                      <canvas ref={previewCanvasRef} className="w-full h-auto" style={{ maxHeight: '70vh' }} />
                    </div>
                  ) : (
                    <div className="bg-gray-100 rounded-lg p-12 text-center">
                      <p className="text-gray-400">Upload a background image to see preview</p>
                    </div>
                  )}

                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-2">Sample data used for preview:</p>
                    <div className="space-y-1 text-xs text-gray-600">
                      <p>📊 Result Number: {sampleResult.resultNumber}</p>
                      <p>🏷️ Category: {sampleResult.categoryName}</p>
                      <p>👥 Group: {sampleResult.group}</p>
                      <p>🏆 Winners: {sampleResult.entries.map(e => `${e.position}. ${e.participantName}`).join(', ')}</p>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit} disabled={saving || uploading}
                    className="mt-4 w-full py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #0F4C81, #1A6BAD)' }}
                  >
                    {saving ? <><Spinner size="sm" /> Saving…</> : (editingId ? 'Update Template' : 'Create Template')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {confirm && (
        <ConfirmModal
          message={`Delete template "${confirm.name}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirm(null)}
        />
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}