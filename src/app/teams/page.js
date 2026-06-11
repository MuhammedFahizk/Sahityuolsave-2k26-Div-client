"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Trophy,
  
  ChevronRight,
  RefreshCw,
  Crown,
  AlertCircle,
} from "lucide-react";

import BottomSheet from "@/components/ui/BottomSheet";
import { get } from "@/utils/api";
import TeamSheetContent from "@/components/public/Team/Teamsheetcontent";

// ── Position medal helpers ───────────────────────────────────────────────────

const RANK_META = {
  1: { label: "1st", bg: "bg-amber-400/10", text: "text-amber-400", ring: "ring-amber-400/30", dot: "#F59E0B" },
  2: { label: "2nd", bg: "bg-slate-400/10", text: "text-slate-300", ring: "ring-slate-400/30", dot: "#94A3B8" },
  3: { label: "3rd", bg: "bg-orange-700/10", text: "text-orange-400", ring: "ring-orange-700/30", dot: "#C2410C" },
};

function rankMeta(rank) {
  return RANK_META[rank] || {
    label: `${rank}th`,
    bg: "bg-white/5",
    text: "text-white/40",
    ring: "ring-white/10",
    dot: "#ffffff22",
  };
}

// ── Podium ───────────────────────────────────────────────────────────────────

function PodiumItem({ team, rank, onClick }) {
  const meta = rankMeta(rank);
  const isFirst = rank === 1;

  return (
    <button
      onClick={() => onClick(team, rank)}
      className={`flex flex-col items-center gap-2  flex-1 transition-transform active:scale-95 focus:outline-none`}
    >
      {/* Crown for rank 1 */}
      {isFirst && (
        <Crown size={18} className="text-amber-400 mb-0.5" />
      )}

      {/* Avatar */}
      <div
        className={`relative flex items-center justify-center rounded-full ring-2 ${meta.ring} transition-shadow
          ${isFirst ? "w-[72px] h-[72px] text-2xl" : "w-[58px] h-[58px] text-xl"}`}
        style={{ backgroundColor: (team.color || "#888") + "25" }}
      >
        {team.logoUrl ? (
          <img
            src={team.logoUrl}
            alt={team.name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span
            className="font-bold leading-none"
            style={{ color: team.color || "#888" }}
          >
            {team.name.charAt(0)}
          </span>
        )}

        {/* Rank badge */}
        <span
          className={`absolute -bottom-1.5 -right-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${meta.bg} ${meta.text} ring-1 ${meta.ring}`}
        >
          {meta.label}
        </span>
      </div>

      {/* Name */}
      <span className="text-xs font-semibold text-white/80 text-center leading-tight max-w-[80px] line-clamp-2">
        {team.name}
      </span>

      {/* Points */}
      <span className={`text-[11px] font-bold tabular-nums ${meta.text}`}>
        {team.totalPoints.toLocaleString()} pts
      </span>

      {/* Podium base */}
      <div
        className={`w-full rounded-t-md ${meta.bg} border-t border-white/10
          ${isFirst ? "h-10" : "h-6"}`}
      />
    </button>
  );
}

function Podium({ top3, onTeamClick }) {
  if (top3.length < 3) return null;

  // Display order: 2nd | 1st | 3rd
  const order = [top3[1], top3[0], top3[2]];
  const ranks = [2, 1, 3];

  return (
    <div className="flex items-end gap-3 px-4 pt-6 pb-0">
      {order.map((team, i) => (
        <PodiumItem
          key={team._id}
          team={team}
          rank={ranks[i]}
          onClick={onTeamClick}
        />
      ))}
    </div>
  );
}

// ── Leaderboard Row ──────────────────────────────────────────────────────────

const ROW_TINTS = {
  1: "bg-amber-400/[0.05]",
  2: "bg-slate-400/[0.05]",
  3: "bg-orange-700/[0.04]",
};

function TeamRow({ team, rank, onClick }) {
  const meta = rankMeta(rank);
  const tint = ROW_TINTS[rank] || "";

  return (
    <button
      onClick={() => onClick(team, rank)}
      className={`w-full flex items-center gap-4 px-4 py-3.5 ${tint} border-b border-white/[0.05]
        hover:bg-white/[0.04] active:bg-white/[0.07] transition-colors text-left focus:outline-none`}
    >
      {/* Rank number */}
      <span className={`w-6 text-sm font-bold tabular-nums ${meta.text} flex-shrink-0`}>
        {rank}
      </span>

      {/* Color dot / avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
        style={{
          backgroundColor: (team.color || "#888") + "28",
          color: team.color || "#888",
        }}
      >
        {team.logoUrl ? (
          <img src={team.logoUrl} alt={team.name} className="w-full h-full rounded-full object-cover" />
        ) : (
          team.name.charAt(0)
        )}
      </div>

      {/* Name + manager */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white/90 truncate">{team.name}</p>
        {/* <p className="text-[11px] text-white/40 truncate">{team.managerName}</p> */}
      </div>

      {/* Points */}
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
          <div
            className="rounded-full bg-white/[0.07] animate-pulse"
            style={{ width: size, height: size }}
          />
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

// ── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-white/[0.03] flex items-center justify-center mb-4">
        <Trophy size={36} className="text-white/20" />
      </div>
      <h3 className="text-lg font-semibold text-white/70 mb-1">No teams yet</h3>
      <p className="text-sm text-white/40 max-w-[220px]">
        Teams will appear here once they join the league
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 flex items-center gap-2 text-sm px-4 py-2 rounded-xl bg-white/[0.07] hover:bg-white/[0.12] transition-colors"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      )}
    </motion.div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-20   px-6 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
        <AlertCircle size={36} className="text-red-400/60" />
      </div>
      <h3 className="text-lg font-semibold text-white/70 mb-1">Failed to load</h3>
      <p className="text-sm text-white/40 max-w-[260px]">{message}</p>
      <button
        onClick={onRetry}
        className="mt-6 flex items-center gap-2 text-sm px-5 py-2.5 rounded-xl bg-white/[0.07] hover:bg-white/[0.12] transition-colors"
      >
        <RefreshCw size={14} /> Try again
      </button>
    </motion.div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function TeamsPage() {
  const router = useRouter();

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Bottom sheet state
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeTeam, setActiveTeam] = useState(null);
  const [activeRank, setActiveRank] = useState(null);
  const [teamResults, setTeamResults] = useState([]);
  const [resultsLoading, setResultsLoading] = useState(false);

  // ── Fetch teams list ──
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

  // ── Fetch results for a specific team ──
  const fetchTeamResults = useCallback(async (teamId) => {
    try {
      setResultsLoading(true);
      // Use pagination params to fetch all results (or at least more than default)
      const res = await get(`/api/results/public/?teamId=${teamId}&page=1&limit=2`);
      console.log("Fetched team results:", res);
      setTeamResults(res.data || []);
    } catch (err) {
      console.log("Failed to load team results", err);
      setTeamResults([]);
    } finally {
      setResultsLoading(false);
    }
  }, []);

  // ── Open sheet ──
  const handleTeamClick = useCallback((team, rank) => {
    setActiveTeam(team);
    setActiveRank(rank);
    setTeamResults([]);
    setSheetOpen(true);
    fetchTeamResults(team._id);
  }, [fetchTeamResults]);

  // ── Navigate to full detail page ──
  const handleViewDetail = useCallback((id) => {
    setSheetOpen(false);
    router.push(`/teams/${id}`);
  }, [router]);

  const closeSheet = useCallback(() => {
    setSheetOpen(false);
  }, []);

  // Derive podium and list
  const top3 = teams.slice(0, 3);
  const rest = teams.slice(3);

  // ── Render ──
  return (
    <div className="min-h-screen pt-10 bg-[#080808] text-white">
      {/* ── Header ── */}
      <div className="px-4 pt-10 pb-2">
        <h1 className="text-2xl font-bold tracking-tight">Teams</h1>
        <p className="text-sm text-white/40 mt-0.5">
          {loading ? "Loading…" : `${teams.length} teams · sorted by total points`}
        </p>
      </div>

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
      ) : teams.length === 0 ? (
        <EmptyState onRetry={fetchTeams} />
      ) : (
        <>
          {/* Podium */}
          <Podium top3={top3} onTeamClick={handleTeamClick} />

          {/* Divider */}
          <div className="mx-4 mt-6 mb-0 border-t border-white/[0.07]" />

          {/* Full leaderboard */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            {teams.map((team, i) => (
              <TeamRow
                key={team._id}
                team={team}
                rank={i + 1}
                onClick={handleTeamClick}
              />
            ))}
          </motion.div>
        </>
      )}

      {/* ── Reusable Bottom Sheet ── */}
      <BottomSheet
        isOpen={sheetOpen}
        onClose={closeSheet}
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