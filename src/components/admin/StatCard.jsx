export default function StatCard({ label, value, tag, tagColor, borderColor }) {
  const tagColors = {
    blue:  'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    amber: 'bg-amber-50 text-amber-700',
    red:   'bg-red-50 text-red-700',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4"
      style={{ borderTop: `3px solid ${borderColor}` }}>
      <div className="text-[11px] text-gray-400 mb-1.5">{label}</div>
      <div className="text-[26px] font-semibold text-gray-800 leading-none">
        {value ?? '—'}
      </div>
      {tag && (
        <span className={`inline-block mt-2 text-[10px] px-2 py-0.5
          rounded-full ${tagColors[tagColor] || tagColors.blue}`}>
          {tag}
        </span>
      )}
    </div>
  );
}