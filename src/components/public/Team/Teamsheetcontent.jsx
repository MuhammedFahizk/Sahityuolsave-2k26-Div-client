"use client";

import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Award, Flag, Trophy, Medal, ChevronRight, Calendar, TrendingUp } from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import { get } from "@/utils/api";

// ── Helpers ──────────────────────────────────────────────────────────────────

const POSITION_LABELS = { 1: "🥇", 2: "🥈", 3: "🥉" };
const posIcon = (pos) => POSITION_LABELS[pos] || `${pos}`;
const posLabel = (pos) => {
  if (pos === 1) return "1st";
  if (pos === 2) return "2nd";
  if (pos === 3) return "3rd";
  return `${pos}th`;
};

function positionStyle(position) {
  if (position === 1) return { 
    bg: "bg-gradient-to-r from-amber-500/15 to-transparent", 
    text: "text-amber-400",  
    border: "border-l-amber-400/40",
    badge: "from-amber-500/20 to-amber-600/10"
  };
  if (position === 2) return { 
    bg: "bg-gradient-to-r from-slate-400/15 to-transparent", 
    text: "text-slate-300",  
    border: "border-l-slate-400/40",
    badge: "from-slate-400/20 to-slate-500/10"
  };
  if (position === 3) return { 
    bg: "bg-gradient-to-r from-orange-600/15 to-transparent", 
    text: "text-orange-400", 
    border: "border-l-orange-600/40",
    badge: "from-orange-600/20 to-orange-700/10"
  };
  return { 
    bg: "bg-white/[0.03]", 
    text: "text-white/40", 
    border: "border-l-white/10",
    badge: "from-white/5 to-transparent"
  };
}

function rankMeta(rank) {
  const MAP = {
    1: { bg: "bg-amber-400/10", text: "text-amber-400", ring: "ring-amber-400/30", icon: Trophy },
    2: { bg: "bg-slate-400/10", text: "text-slate-300", ring: "ring-slate-400/30", icon: Medal },
    3: { bg: "bg-orange-700/10", text: "text-orange-400", ring: "ring-orange-700/30", icon: Medal },
  };
  const defaultMeta = { bg: "bg-white/5", text: "text-white/40", ring: "ring-white/10", icon: Award };
  return MAP[rank] || defaultMeta;
}

// ── Result Card (Enhanced for Team View) ─────────────────────────────────────

function ResultCard({ result, teamId, index }) {
  const teamEntries = useMemo(
    () => result.entries.filter(e => (e.teamId?._id || e.teamId) === teamId),
    [result.entries, teamId]
  );

  if (!teamEntries.length) return null;

  const bestEntry = teamEntries.reduce((best, current) => 
    current.position < best.position ? current : best, teamEntries[0]
  );
  const totalPoints = teamEntries.reduce((sum, e) => sum + e.points, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative"
    >
      <div className="rounded-xl bg-white/[0.03] border border-white/[0.07] overflow-hidden
        hover:border-white/[0.12] transition-all duration-200">
        
        {/* Header */}
        <div className="px-4 py-3 border-b border-white/[0.05] bg-white/[0.02] 
          flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-white/[0.06] 
              flex items-center justify-center">
              <span className="text-[10px] font-bold text-white/40 tabular-nums">
                #{String(result.resultNumber).slice(-3)}
              </span>
            </div>
            <span className="text-sm font-semibold text-white/90 truncate">
              {result.categoryName}
            </span>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            {result.group && (
              <span className="text-[9px] px-2 py-1 rounded-full bg-white/[0.07] text-white/40 font-medium">
                {result.group}
              </span>
            )}
            <span className="text-[11px] font-bold text-white/50 tabular-nums">
              {totalPoints} pts
            </span>
          </div>
        </div>

        {/* This team's entries only - Enhanced display */}
        <div className="divide-y divide-white/[0.04]">
          {teamEntries.map((entry, idx) => {
            const ps = positionStyle(entry.position);
            const PositionIcon = entry.position === 1 ? Trophy : entry.position === 2 ? Medal : null;
            
            return (
              <motion.div 
                key={entry._id} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`px-4 py-3 flex items-center gap-3 ${ps.bg} border-l-2 ${ps.border}`}
              >
                {/* Position Badge */}
                <div className="flex-shrink-0 text-center min-w-[44px]">
                  <div className={`text-lg ${ps.text}`}>
                    {posIcon(entry.position)}
                  </div>
                  <span className={`text-[9px] font-semibold ${ps.text} opacity-70`}>
                    {posLabel(entry.position)}
                  </span>
                </div>
                
                {/* Participant Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white/85 truncate">
                    {entry.participantName}
                  </p>
                  {entry.grade && (
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded 
                      bg-white/[0.06] text-white/35 inline-block mt-0.5">
                      Grade: {entry.grade}
                    </span>
                  )}
                </div>
                
                {/* Points */}
                <div className="flex-shrink-0 text-right">
                  <span className={`text-base font-bold ${ps.text} tabular-nums`}>
                    {entry.points}
                  </span>
                  <span className="text-[9px] font-normal text-white/25 ml-0.5">pts</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Best performance badge */}
        {bestEntry && (
          <div className="px-4 py-1.5 bg-white/[0.02] border-t border-white/[0.04]
            flex items-center justify-between text-[10px]">
            <span className="text-white/30">Best Performance</span>
            <div className="flex items-center gap-1.5">
              <span className="text-white/40">{bestEntry.participantName}</span>
              <span className={`font-semibold ${positionStyle(bestEntry.position).text}`}>
                {posLabel(bestEntry.position)} · {bestEntry.points} pts
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── TeamSheetContent (Enhanced) ──────────────────────────────────────────────

export default function TeamSheetContent({ team, rank, totalPoints ,  onViewDetail }) {
  const meta = rankMeta(rank);
  const RankIcon = meta.icon;

  const [results, setResults] = useState([]);
  const [resultsLoading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [fetched, setFetched] = useState(false);

  const LIMIT = 5;

  const fetchPage = useCallback(async (p) => {
    try {
      setLoading(true);
      const res = await get(`/api/results/public/?teamId=${team._id}&page=${p}&limit=${LIMIT}`);
      setResults(res.data || []);
      setPage(res.page || p);
      setPages(res.pages || 1);
      setTotal(res.total || 0);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
      setFetched(true);
    }
  }, [team._id]);

  React.useEffect(() => {
    if (!fetched) fetchPage(1);
  }, [fetched, fetchPage]);

  // Calculate team statistics
  const stats = useMemo(() => {
    const allEntries = results.flatMap(r =>
      r.entries.filter(e => (e.teamId?._id || e.teamId) === team._id)
    );
    const positions = allEntries.map(e => e.position);
    const totalPoints = allEntries.reduce((sum, e) => sum + e.points, 0);
    const bestPosition = positions.length ? Math.min(...positions) : null;
    const goldCount = positions.filter(p => p === 1).length;
    const silverCount = positions.filter(p => p === 2).length;
    const bronzeCount = positions.filter(p => p === 3).length;
    
    return { bestPosition, totalPoints, goldCount, silverCount, bronzeCount, totalEntries: allEntries.length };
  }, [results, team._id]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#080808]">
      <div className="px-4 pt-6 pb-8 space-y-5">
        
        {/* ── Hero Section ── */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent 
            border border-white/[0.07] p-5"
        >
          {/* Background accent */}
          <div 
            className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: team.color || "#888" }}
          />
          
          <div className="flex items-center gap-4 relative">
            {/* Team Avatar */}
            <div
              className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold 
                ring-2 ${meta.ring} flex-shrink-0 shadow-lg`}
              style={{ 
                background: `linear-gradient(135deg, ${(team.color || "#888")}30, ${(team.color || "#888")}10)`,
                color: team.color || "#888"
              }}
            >
              {team.logoUrl
                ? <img src={team.logoUrl} alt={team.name} className="w-full h-full rounded-2xl object-cover" />
                : team.name.charAt(0).toUpperCase()
              }
            </div>

            {/* Team Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-white leading-tight line-clamp-2">
                {team.name}
              </h2>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full 
                  ${meta.bg} ${meta.text} ring-1 ${meta.ring}`}>
                  <RankIcon size={10} />
                  Rank #{rank}
                </span>
                <span className="text-[11px] font-semibold text-white/60">
                  {totalPoints.toLocaleString()} total pts
                </span>
              </div>
            </div>
          </div>

          
        </motion.div>

        {/* ── Team Description ── */}
        {team.description && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4"
          >
            <p className="text-xs text-white/60 leading-relaxed">{team.description}</p>
          </motion.div>
        )}

        {/* ── Results Section ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy size={14} className="text-white/30" />
              <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                Results & Achievements
              </p>
            </div>
            {total > 0 && (
              <span className="text-[10px] text-white/35">
                {total} result{total !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Loading State */}
          <AnimatePresence>
            {resultsLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-4 animate-pulse">
                    <div className="h-4 bg-white/[0.05] rounded w-3/4 mb-3" />
                    <div className="h-10 bg-white/[0.03] rounded" />
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty State */}
          {!resultsLoading && results.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-12 text-center rounded-xl 
                bg-white/[0.02] border border-white/[0.06]"
            >
              <Flag size={32} className="text-white/15 mb-3" />
              <p className="text-sm font-medium text-white/40">No results yet</p>
              <p className="text-xs text-white/25 mt-1">Check back after competitions</p>
            </motion.div>
          )}

          {/* Results Cards */}
          {!resultsLoading && results.length > 0 && (
            <div className="space-y-3">
              <AnimatePresence>
                {results.map((result, idx) => (
                  <ResultCard 
                    key={result._id} 
                    result={result} 
                    teamId={team._id}
                    index={idx}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && !resultsLoading && (
            <div className="mt-5 pt-2">
              <Pagination
                page={page}
                pages={pages}
                total={total}
                onPage={fetchPage}
                loading={resultsLoading}
                className="justify-center"
              />
            </div>
          )}
        </div>

        {/* ── View Full Profile CTA ── */}
      
      </div>
    </div>
  );
}