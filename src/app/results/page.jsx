"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, X, RefreshCw, Trophy,
  ArrowDownUp, Clock, AlignLeft, Hash,
} from "lucide-react";

import ResultCard, { groupMeta }  from "@/components/public/Result/Resultcard";
import SkeletonCard               from "@/components/ui/Skeletoncard";
import ResultDetailSheet          from "@/components/public/Result/ResultDetailSheet";
import Pagination                 from "@/components/ui/Pagination";
import { get }                    from "@/utils/api";

const LIMIT = 10;

const SORT_OPTIONS = [
  { value: "newest", label: "Newest", icon: Clock     },
  { value: "oldest", label: "Oldest", icon: Clock     },
  { value: "az",     label: "A – Z",  icon: AlignLeft },
  { value: "number", label: "1 → N",  icon: Hash      },
];

// ── Sort Dropdown ─────────────────────────────────────────────────────────────

function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref             = useRef(null);
  const active          = SORT_OPTIONS.find(o => o.value === value) || SORT_OPTIONS[0];

  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold
         border border-white/[0.08] text-white/50
          hover:bg-white/[0.09] hover:text-white/70 transition-colors"
      >
        <ArrowDownUp size={12} /> {active.label}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.13 }}
            className="absolute right-0 top-full mt-1.5 z-30 min-w-[130px]
              rounded-xl border border-white/[0.10] bg-[#161616] shadow-2xl overflow-hidden"
          >
            {SORT_OPTIONS.map(opt => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold
                    transition-colors text-left
                    ${opt.value === value
                      ? "text-white bg-white/[0.08]"
                      : "text-white/45 hover:text-white/75 hover:bg-white/[0.05]"}`}
                >
                  <Icon size={12} /> {opt.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Filter Tab ────────────────────────────────────────────────────────────────

function FilterTab({ label, active, onClick }) {
  const gm = label === "All" ? null : groupMeta(label);
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold border
        transition-all duration-200 focus:outline-none
        ${active
          ? label === "All"
            ? "bg-white text-black border-white"
            : `${gm.bg} ${gm.text} ${gm.border}`
          : "bg-transparent border-white/[0.08] text-white/40 hover:border-white/20 hover:text-white/65"
        }`}
    >
      {label === "All" ? "All" : (gm?.short || label)}
    </button>
  );
}

// ── Search Bar ────────────────────────────────────────────────────────────────

function SearchBar({ value, onChange, onCommit }) {
  return (
    <div className="relative flex-1">
      <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onCommit()}
        placeholder="Search category…"
        className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl
          pl-9 pr-8 py-2.5 text-sm text-white placeholder-white/20
          focus:outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all"
      />
      <AnimatePresence>
        {value && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1   }}
            exit={{    opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.12 }}
            onClick={() => { onChange(""); onCommit(""); }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5
              flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X size={10} className="text-white/60" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Latest Banner ─────────────────────────────────────────────────────────────

function LatestBanner({ result, onClick }) {
  if (!result) return null;
  const top = [...(result.entries || [])].sort((a, b) => a.position - b.position)[0];
  const gm  = groupMeta(result.group);

  return (
    <motion.button
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0  }}
      transition={{ duration: 0.35, delay: 0.1 }}
      onClick={() => onClick(result)}
      className="w-full mx-0 mb-4 rounded-2xl border border-white/[0.07] bg-[#111]
        overflow-hidden text-left hover:border-white/[0.13] transition-colors active:scale-[0.99]"
    >
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-bold text-white/25 uppercase tracking-widest">Latest</span>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${gm.bg} ${gm.text} ${gm.border}`}>
          {gm.short}
        </span>
      </div>
      <div className="px-4 pb-3 flex items-center gap-3">
        <div className="w-9 h-9 flex-shrink-0 rounded-xl bg-white/[0.05] border border-white/[0.07]
          flex items-center justify-center">
          <span className="text-[11px] font-bold text-white/40 tabular-nums">
            {String(result.resultNumber).padStart(2, "0")}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white/85 truncate">{result.categoryName}</p>
          {top && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-bold text-amber-400">1st</span>
              <span className="text-[10px] text-white/40 truncate">{top.participantName}</span>
              {top.teamId?.color && (
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: top.teamId.color }} />
              )}
              <span className="text-[10px] text-white/30 truncate">{top.teamId?.name}</span>
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );
}

// ── Empty / Error ─────────────────────────────────────────────────────────────

function EmptyState({ onReset }) {
  return (
    <div className="flex flex-col items-center py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
        <Trophy size={24} className="text-white/15" />
      </div>
      <p className="text-sm font-semibold text-white/45 mb-1">No results found</p>
      <p className="text-xs text-white/25 mb-5">Try a different filter or search term</p>
      <button onClick={onReset}
        className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl
          bg-white/[0.06] border border-white/[0.08] text-white/45
          hover:bg-white/[0.10] transition-colors">
        <X size={11} /> Clear filters
      </button>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-red-500/[0.07] flex items-center justify-center mb-4">
        <RefreshCw size={22} className="text-red-400/45" />
      </div>
      <p className="text-sm font-semibold text-white/45 mb-1">Failed to load</p>
      <p className="text-xs text-white/25 mb-5 max-w-[220px]">{message}</p>
      <button onClick={onRetry}
        className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl
          bg-white/[0.06] border border-white/[0.08] text-white/45
          hover:bg-white/[0.10] transition-colors">
        <RefreshCw size={11} /> Try again
      </button>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ResultsPage() {
  const [results, setResults]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [meta, setMeta]               = useState({ total: 0, page: 1, pages: 1 });
  const [groups, setGroups]           = useState([]);
  const [bannerResult, setBanner]     = useState(null);

  // Controls
  const [activeGroup, setActiveGroup] = useState("All");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch]           = useState("");
  const [sort, setSort]               = useState("newest");
  const [page, setPage]               = useState(1);

  // Detail sheet
  const [detailOpen, setDetailOpen]   = useState(false);
  const [activeResult, setActiveResult] = useState(null);

  // ── Fetch ──
  const fetchResults = useCallback(async (overrides = {}) => {
    try {
      setLoading(true);
      setError(null);

      const p = {
        page:  overrides.page  ?? page,
        limit: LIMIT,
        sort:  overrides.sort  ?? sort,
        ...(( overrides.group ?? activeGroup) !== "All" && { group: overrides.group ?? activeGroup }),
        ...((overrides.search ?? search) && { categoryName: overrides.search ?? search }),
      };
      const qs = new URLSearchParams(
        Object.fromEntries(Object.entries(p).filter(([, v]) => v !== undefined && v !== ""))
      ).toString();

      const res = await get(`/api/results/public/?${qs}`);
      setResults(res.data  || []);
      setMeta({ total: res.total || 0, page: res.page || 1, pages: res.pages || 1 });

      // Capture banner on fresh default load
      const isDefault = !overrides.group && !overrides.search &&
        (overrides.page ?? page) === 1 && (overrides.sort ?? sort) === "newest";
      if (isDefault) setBanner(res.data?.[0] || null);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [page, sort, activeGroup, search]); // eslint-disable-line

  useEffect(() => { fetchResults(); }, [page, sort, activeGroup, search]); // eslint-disable-line

  useEffect(() => {
    get("/api/results/filters")
      .then(res => setGroups(res?.data?.groups || []))
      .catch(() => {});
  }, []);

  // ── Handlers ──
  const handleGroup = (g) => { setActiveGroup(g); setPage(1); };
  const handleSort  = (s) => { setSort(s);         setPage(1); };
  const handleSearchCommit = (val) => {
    const v = val !== undefined ? val : searchInput;
    setSearch(v); setPage(1);
  };
  const resetFilters = () => {
    setActiveGroup("All"); setSearch(""); setSearchInput(""); setSort("newest"); setPage(1);
  };

  const openDetail = (result) => { setActiveResult(result); setDetailOpen(true); };
  const closeDetail = () => setDetailOpen(false);

  const hasFilters = activeGroup !== "All" || search.length > 0 || sort !== "newest";

  return (
    <div className="min-h-screen  pt-20  text-white">

      {/* ── Hero ── */}
      <div className="px-4  pb-5">
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight">Results</h1>
            {!loading && meta.total > 0 && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full
                bg-white/[0.07] border border-white/[0.07] text-white/35 tabular-nums">
                {meta.total}
              </span>
            )}
          </div>
          <p className="text-sm text-white/30">
            {loading ? "Loading…" : groups.length
              ? `${meta.total} results · ${groups.join(", ")}`
              : `${meta.total} results`}
          </p>
        </motion.div>
      </div>

      {/* ── Latest banner ── */}
      {!loading && !error && (
        <div className="px-4">
          <LatestBanner result={bannerResult} onClick={openDetail} />
        </div>
      )}

      {/* ── Sticky filters ── */}
      <div className="sticky top-0 z-20 bg-[#080808]/90 backdrop-blur-md
        border-b border-white/[0.05] pb-3 space-y-2.5">
        <div className="flex gap-2 px-4 pt-3 overflow-x-auto scrollbar-none">
          {["All", ...groups].map(g => (
            <FilterTab key={g} label={g} active={activeGroup === g} onClick={() => handleGroup(g)} />
          ))}
        </div>
        <div className="flex items-center gap-2 px-4">
          <SearchBar value={searchInput} onChange={setSearchInput} onCommit={handleSearchCommit} />
          <SortDropdown value={sort} onChange={handleSort} />
        </div>
      </div>

      {/* ── Body ── */}
      <div className="px-4 pt-4 pb-10">
        <AnimatePresence>
          {hasFilters && !loading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center justify-between mb-3"
            >
              <span className="text-[11px] text-white/30">{meta.total} result{meta.total !== 1 ? "s" : ""}</span>
              <button onClick={resetFilters}
                className="flex items-center gap-1 text-[11px] text-white/30 hover:text-white/55 transition-colors">
                <X size={10} /> Reset
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {!loading && error && <ErrorState message={error} onRetry={() => fetchResults()} />}

        {!loading && !error && results.length > 0 && (
          <motion.div
            key={`${page}-${sort}-${activeGroup}-${search}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {results.map((result, i) => (
              <ResultCard key={result._id} result={result} index={i} onClick={openDetail} />
            ))}
          </motion.div>
        )}

        {!loading && !error && results.length === 0 && <EmptyState onReset={resetFilters} />}

        {!loading && !error && meta.pages > 1 && (
          <Pagination
            page={meta.page} pages={meta.pages} total={meta.total}
            onPage={setPage} loading={loading} className="mt-6"
          />
        )}
      </div>

      {/* ── Detail Sheet ── */}
      <ResultDetailSheet
        result={activeResult}
        isOpen={detailOpen}
        onClose={closeDetail}
      />
    </div>
  );
}