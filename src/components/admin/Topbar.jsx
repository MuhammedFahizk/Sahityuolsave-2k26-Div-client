'use client';

export default function Topbar({ title, subtitle }) {
  return (
    <header className="h-[52px] bg-white border-b border-gray-100 px-5
      flex items-center justify-between flex-shrink-0">
      <div>
        <div className="text-[14px] font-medium text-gray-800">{title}</div>
        {subtitle && (
          <div className="text-[10px] text-gray-400">{subtitle}</div>
        )}
      </div>
      <div className="flex items-center gap-2.5">
        {/* Notification dot */}
        <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100
          flex items-center justify-center cursor-pointer">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0F4C81]" />
        </div>
        {/* Avatar */}
        <div className="w-[30px] h-[30px] rounded-full bg-[#0F4C81]
          flex items-center justify-center text-white text-[11px] font-medium">
          AD
        </div>
      </div>
    </header>
  );
}