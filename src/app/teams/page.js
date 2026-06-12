"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  ChevronRight,
  RefreshCw,
  Crown,
  AlertCircle,
  MapPin,
  GraduationCap,
} from "lucide-react";

import BottomSheet from "@/components/ui/BottomSheet";
import { get } from "@/utils/api";
import TeamSheetContent from "@/components/public/Team/Teamsheetcontent";

// ── Rank meta ────────────────────────────────────────────────────────────────

const RANK_META = {
  1: { label: "1st", bg: "bg-amber-400/10",   text: "text-amber-400",  ring: "ring-amber-400/30",  dot: "#F59E0B" },
  2: { label: "2nd", bg: "bg-slate-400/10",   text: "text-slate-300",  ring: "ring-slate-400/30",  dot: "#94A3B8" },
  3: { label: "3rd", bg: "bg-orange-700/10",  text: "text-orange-400", ring: "ring-orange-700/30", dot: "#C2410C" },
};

function rankMeta(rank) {
  return RANK_META[rank] || {
    label: `${rank}th`,
    bg:   "bg-white/5",
    text: "text-white/40",
    ring: "ring-white/10",
    dot:  "#ffffff22",
  };
}

// ── Tab config ───────────────────────────────────────────────────────────────

const TABS = [
  {
    key:   "sector",
    label: "Sector",
    Icon:  MapPin,
    // active pill gradient
    gradient: "from-emerald-500/20 to-teal-500/20",
    border:   "border-emerald-500/30",
    text:     "text-emerald-300",
    dot:      "bg-emerald-400",
  },
  {
    key:   "campus",
    label: "Campus",
    Icon:  GraduationCap,
    gradient: "from-violet-500/20 to-indigo-500/20",
    border:   "border-violet-500/30",
    text:     "text-violet-300",
    dot:      "bg-violet-400",
  },
];

// ── Type pill (shown in leaderboard rows) ─────────────────────────────────────

function TypePill({ type }) {
  const cfg = type === "campus"
    ? { label: "Campus", cls: "bg-violet-500/10 text-violet-400 border-violet-500/20" }
    : { label: "Sector", cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" };
  return (
    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

// ── Segment switcher ─────────────────────────────────────────────────────────

function TypeSwitcher({ active, onChange, counts }) {
  return (
    <div className="flex gap-2 px-4 pt-3 pb-1">
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
              border transition-all duration-200 focus:outline-none flex-1 justify-center
              ${isActive
                ? `bg-gradient-to-r ${tab.gradient} ${tab.border} ${tab.text}`
                : "bg-white/[0.04] border-white/10 text-white/40 hover:text-white/60 hover:bg-white/[0.07]"
              }`}
          >
            <tab.Icon size={13} />
            {tab.label}
            {counts[tab.key] != null && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium
                ${isActive ? "bg-white/10 text-white/70" : "bg-white/[0.06] text-white/30"}`}>
                {counts[tab.key]}
              </span>
            )}
            {/* Active indicator dot */}
            {isActive && (
              <motion.span
                layoutId="tab-dot"
                className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${tab.dot}`}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ── Podium ───────────────────────────────────────────────────────────────────

function PodiumItem({ team, rank, onClick }) {
  const meta = rankMeta(rank);
  const isFirst = rank === 1;

  return (
    <button
      onClick={() => onClick(team, rank)}
      className="flex flex-col items-center gap-2 flex-1 transition-transform active:scale-95 focus:outline-none"
    >
      {isFirst && <Crown size={18} className="text-amber-400 mb-0.5" />}

      <div
        className={`relative flex items-center justify-center rounded-full ring-2 ${meta.ring}
          ${isFirst ? "w-[72px] h-[72px] text-2xl" : "w-[58px] h-[58px] text-xl"}`}
        style={{ backgroundColor: (team.color || "#888") + "25" }}
      >
        {team.logoUrl ? (
          <img src={team.logoUrl} alt={team.name}
            className="w-full h-full rounded-full object-cover" />
        ) : (
          <span className="font-bold leading-none" style={{ color: team.color || "#888" }}>
            {team.name.charAt(0)}
          </span>
        )}
        <span className={`absolute -bottom-1.5 -right-1.5 text-[10px] font-bold
          px-1.5 py-0.5 rounded-full ${meta.bg} ${meta.text} ring-1 ${meta.ring}`}>
          {meta.label}
        </span>
      </div>

      <span className="text-xs font-semibold text-white/80 text-center leading-tight max-w-[80px] line-clamp-2">
        {team.name}
      </span>
      <span className={`text-[11px] font-bold tabular-nums ${meta.text}`}>
        {team.totalPoints.toLocaleString()} pts
      </span>
      <div className={`w-full rounded-t-md ${meta.bg} border-t border-white/10
        ${isFirst ? "h-10" : "h-6"}`} />
    </button>
  );
}

function Podium({ top3, onTeamClick }) {
  if (top3.length < 3) {
    // Fewer than 3: just show as plain rows, no podium
    return null;
  }
  const order = [top3[1], top3[0], top3[2]];
  const ranks = [2, 1, 3];
  return (
    <div className="flex items-end gap-3 px-4 pt-4 pb-0">
      {order.map((team, i) => (
        <PodiumItem key={team._id} team={team} rank={ranks[i]} onClick={onTeamClick} />
      ))}
    </div>
  );
}

// ── Leaderboard row ──────────────────────────────────────────────────────────

const ROW_TINTS = {
  1: "bg-amber-400/[0.05]",
  2: "bg-slate-400/[0.05]",
  3: "bg-orange-700/[0.04]",
};

function TeamRow({ team, rank, onClick }) {
  const meta = rankMeta(rank);
  return (
    <button
      onClick={() => onClick(team, rank)}
      className={`w-full flex items-center gap-4 px-4 py-3.5
        ${ROW_TINTS[rank] || ""} border-b border-white/[0.05]
        hover:bg-white/[0.04] active:bg-white/[0.07] transition-colors text-left focus:outline-none`}
    >
      <span className={`w-6 text-sm font-bold tabular-nums ${meta.text} flex-shrink-0`}>
        {rank}
      </span>
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
        style={{ backgroundColor: (team.color || "#888") + "28", color: team.color || "#888" }}
      >
        {team.logoUrl ? (
          <img src={team.logoUrl} alt={team.name} className="w-full h-full rounded-full object-cover" />
        ) : team.name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white/90 truncate">{team.name}</p>
        {team.affiliation && (
          <p className="text-[10px] text-white/30 truncate mt-0.5">{team.affiliation}</p>
        )}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className={`text-sm font-bold tabular-nums ${meta.text}`}>
          {team.totalPoints.toLocaleString()}
          <span className="text-[10px] font-normal text-white/30 ml-0.5">pts</span>
        </span>
        <ChevronRight size={14} className="text-white/20" />
      </div>
    </button>
  );
}

// ── Skeletons ────────────────────────────────────────────────────────────────

function PodiumSkeleton() {
  return (
    <div className="flex items-end gap-3 px-4 pt-6 pb-0">
      {[58, 72, 58].map((size, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <div className="rounded-full bg-white/[0.07] animate-pulse"
            style={{ width: size, height: size }} />
          <div className="h-2 w-14 rounded bg-white/[0.07] animate-pulse" />
          <div className="h-2 w-10 rounded bg-white/[0.07] animate-pulse" />
          <div className={`w-full rounded-t-md bg-white/[0.04] animate-pulse ${i === 1 ? "h-10" : "h-6"}`} />
        </div>
      ))}
    </div>
  );
}

function RowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-4 py-3.5 border-b border-white/[0.05]">
      <div className="w-6 h-3 rounded bg-white/[0.07] animate-pulse" />
      <div className="w-8 h-8 rounded-full bg-white/[0.07] animate-pulse" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 w-32 rounded bg-white/[0.07] animate-pulse" />
        <div className="h-2 w-20 rounded bg-white/[0.07] animate-pulse" />
      </div>
      <div className="h-3 w-16 rounded bg-white/[0.07] animate-pulse" />
    </div>
  );
}

// ── Empty / Error states ─────────────────────────────────────────────────────

function EmptyState({ label, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-white/[0.03] flex items-center justify-center mb-4">
        <Trophy size={28} className="text-white/20" />
      </div>
      <p className="text-sm text-white/50">No {label} teams yet</p>
      {onRetry && (
        <button onClick={onRetry}
          className="mt-5 flex items-center gap-2 text-sm px-4 py-2
            rounded-xl bg-white/[0.07] hover:bg-white/[0.12] transition-colors">
          <RefreshCw size={13} /> Refresh
        </button>
      )}
    </motion.div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
        <AlertCircle size={28} className="text-red-400/60" />
      </div>
      <p className="text-sm text-white/50">{message}</p>
      <button onClick={onRetry}
        className="mt-5 flex items-center gap-2 text-sm px-5 py-2.5
          rounded-xl bg-white/[0.07] hover:bg-white/[0.12] transition-colors">
        <RefreshCw size={13} /> Try again
      </button>
    </motion.div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function TeamsPage() {
  const router = useRouter();

  const [teams,          setTeams]          = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(null);
  const [activeTab,      setActiveTab]      = useState("sector");

  const [sheetOpen,      setSheetOpen]      = useState(false);
  const [activeTeam,     setActiveTeam]     = useState(null);
  const [activeRank,     setActiveRank]     = useState(null);
  const [teamResults,    setTeamResults]    = useState([]);
  const [resultsLoading, setResultsLoading] = useState(false);

  // ── Fetch ──
  const fetchTeams = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await get("/api/teams");
      setTeams(res.data || []);
    } catch (err) {
      setError(err.message || "Failed to load teams");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTeams(); }, [fetchTeams]);

  const fetchTeamResults = useCallback(async (teamId) => {
    try {
      setResultsLoading(true);
      const res = await get(`/api/results/public/?teamId=${teamId}&page=1&limit=2`);
      setTeamResults(res.data || []);
    } catch {
      setTeamResults([]);
    } finally {
      setResultsLoading(false);
    }
  }, []);

  const handleTeamClick = useCallback((team, rank) => {
    setActiveTeam(team);
    setActiveRank(rank);
    setTeamResults([]);
    setSheetOpen(true);
    fetchTeamResults(team._id);
  }, [fetchTeamResults]);

  const handleViewDetail = useCallback((id) => {
    setSheetOpen(false);
    router.push(`/teams/${id}`);
  }, [router]);

  // ── Derived lists — already sorted by totalPoints from API ──
  const sectorTeams = teams.filter(t => (t.teamType || "sector") === "sector");
  const campusTeams = teams.filter(t => t.teamType === "campus");

  const counts = { sector: sectorTeams.length, campus: campusTeams.length };

  const visibleTeams = activeTab === "sector" ? sectorTeams : campusTeams;
  const top3         = visibleTeams.slice(0, 3);
  const activeTabCfg = TABS.find(t => t.key === activeTab);

  return (
    <div className="min-h-screen pt-10 bg-[#080808] text-white">

      {/* ── Header ── */}
      <div className="px-4 pt-10 pb-1">
        <h1 className="text-2xl font-bold tracking-tight">Teams</h1>
        <p className="text-sm text-white/40 mt-0.5">
          {loading ? "Loading…" : `${teams.length} teams · sorted by total points`}
        </p>
      </div>

      {/* ── Switcher ── */}
      {!loading && !error && teams.length > 0 && (
        <TypeSwitcher active={activeTab} onChange={setActiveTab} counts={counts} />
      )}

      {/* ── Content ── */}
      {loading ? (
        <>
          <PodiumSkeleton />
          <div className="mt-6">
            {Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)}
          </div>
        </>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchTeams} />
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
          >
            {visibleTeams.length === 0 ? (
              <EmptyState label={activeTabCfg.label} onRetry={fetchTeams} />
            ) : (
              <>
                {/* Section label */}
                <div className={`mx-4 mt-3 mb-1 flex items-center gap-2
                  text-[11px] font-semibold uppercase tracking-widest ${activeTabCfg.text}`}>
                  <activeTabCfg.Icon size={11} />
                  {activeTabCfg.label} Leaderboard
                </div>

                {/* Podium — only if 3+ teams */}
                {top3.length >= 3 && (
                  <Podium top3={top3} onTeamClick={handleTeamClick} />
                )}

                <div className="mx-4 mt-5 mb-0 border-t border-white/[0.07]" />

                {/* Full list */}
                {visibleTeams.map((team, i) => (
                  <TeamRow
                    key={team._id}
                    team={team}
                    rank={i + 1}
                    onClick={handleTeamClick}
                  />
                ))}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* ── Bottom Sheet ── */}
      <BottomSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        accentColor={activeTeam?.color}
        showHandle
      >
        {activeTeam && (
          <TeamSheetContent
            team={activeTeam}
            rank={activeRank}
            results={teamResults}
            totalPoints={activeTeam.totalPoints}
            resultsLoading={resultsLoading}
            onViewDetail={handleViewDetail}
          />
        )}
      </BottomSheet>
    </div>
  );
}