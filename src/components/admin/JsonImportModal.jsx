// components/admin/JsonImportModal.jsx
import { useState } from 'react';
import Spinner from '@/components/shared/Spinner';

export default function JsonImportModal({ isOpen, onClose, onImport, teams }) {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const [importing, setImporting] = useState(false);

  const validateAndParseJson = () => {
    setError('');
    try {
      const parsed = JSON.parse(jsonInput);
      
      // Validate required fields
      if (!parsed.resultNumber) throw new Error('Missing resultNumber');
      if (!parsed.categoryName) throw new Error('Missing categoryName');
      if (!parsed.entries || !Array.isArray(parsed.entries)) throw new Error('Missing or invalid entries array');
      
      // Validate entries
      parsed.entries.forEach((entry, index) => {
        if (!entry.position) throw new Error(`Entry ${index + 1}: Missing position`);
        if (!entry.participantName) throw new Error(`Entry ${index + 1}: Missing participantName`);
        
        // Handle teamName to teamId conversion
        if (entry.teamName && !entry.teamId) {
          const matchingTeam = teams.find(
            team => team.name.toLowerCase() === entry.teamName.toLowerCase()
          );
          if (matchingTeam) {
            entry.teamId = matchingTeam._id;
          } else {
            throw new Error(`Entry ${index + 1}: Team "${entry.teamName}" not found`);
          }
        }
        
        if (!entry.teamId) throw new Error(`Entry ${index + 1}: Missing teamId or teamName`);
      });
      
      return parsed;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const handleImport = () => {
    const validatedData = validateAndParseJson();
    if (validatedData) {
      setImporting(true);
      // Transform to form format
      const formData = {
        resultNumber: validatedData.resultNumber,
        categoryName: validatedData.categoryName,
        group: validatedData.group || '',
        resultUrl: validatedData.resultUrl || '',
        entries: validatedData.entries.map(entry => ({
          position: entry.position,
          participantName: entry.participantName,
          teamId: entry.teamId,
          points: entry.points || '',
          grade: entry.grade || '',
        }))
      };
      
      onImport(formData);
      setJsonInput('');
      setError('');
      setImporting(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-[14px] font-medium text-gray-800">
              Import Result from JSON
            </h2>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Paste your JSON data and auto-fill the form
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-gray-100 flex items-center
              justify-center text-gray-400 hover:bg-gray-200 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto p-6">
          {/* Example JSON */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                Example Format
              </label>
              <button
                onClick={() => {
                  setJsonInput(`{
  "resultNumber": 3,
  "categoryName": "Social Text",
  "group": "Senior",
  "resultUrl": "",
  "entries": [
    {
      "position": 1,
      "participantName": "MUHAMMED RABEEH K",
      "teamName": "Cherooppa Sector",
      "grade": "B",
      "points": 8
    },
    {
      "position": 2,
      "participantName": "SHABEEB",
      "teamName": "Peruvayal Sector",
      "grade": "B",
      "points": 6
    }
  ]
}`);
                }}
                className="text-[10px] text-[#0F4C81] hover:underline"
              >
                Load Example
              </button>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-[11px] text-gray-500 font-mono">
              Use <span className="text-blue-600">teamName</span> (auto-converts to teamId) or{' '}
              <span className="text-blue-600">teamId</span> directly
            </div>
          </div>

          {/* JSON Input */}
          <div>
            <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2 block">
              Paste JSON Here
            </label>
            <textarea
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value);
                setError('');
              }}
              placeholder={`{
  "resultNumber": 1,
  "categoryName": "Pencil Drawing",
  "group": "Junior",
  "entries": [
    {
      "position": 1,
      "participantName": "John Doe",
      "teamName": "Team Name",
      "grade": "A",
      "points": 10
    }
  ]
}`}
              className="w-full h-64 px-4 py-3 rounded-xl border border-gray-200
                text-[13px] font-mono focus:outline-none focus:border-[#0F4C81]
                focus:ring-2 focus:ring-[#0F4C81]/10 transition-all resize-none"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-100">
              <p className="text-[11px] text-red-600">{error}</p>
            </div>
          )}

          {/* Team Mapping Info */}
          <div className="mt-4 p-3 rounded-xl bg-blue-50 border border-blue-100">
            <p className="text-[10px] text-blue-700">
              💡 <span className="font-medium">Tip:</span> Use "teamName" to auto-match with existing teams.
              Available teams: {teams.map(t => t.name).join(', ')}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200
              text-[12px] text-gray-500 hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!jsonInput.trim() || importing}
            className="flex-1 py-2.5 rounded-xl text-white text-[12px]
              font-medium flex items-center justify-center gap-2
              disabled:opacity-60 transition-all"
            style={{ background: 'linear-gradient(135deg, #0F4C81, #1A6BAD)' }}
          >
            {importing ? <Spinner size="sm" /> : null}
            {importing ? 'Importing...' : 'Import & Fill Form'}
          </button>
        </div>
      </div>
    </div>
  );
}