"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, X, RefreshCw, Trophy,
  ArrowDownUp, Clock, AlignLeft, Hash,
  ChevronDown, MapPin, GraduationCap,
} from "lucide-react";

import ResultCard             from "@/components/public/Result/Resultcard";
import SkeletonCard           from "@/components/ui/Skeletoncard";
import ResultDetailSheet      from "@/components/public/Result/ResultDetailSheet";
import Pagination             from "@/components/ui/Pagination";
import { get }                from "@/utils/api";

const LIMIT = 10;

const SORT_OPTIONS = [
  { value: "newest", label: "Newest", icon: Clock     },
  { value: "oldest", label: "Oldest", icon: Clock     },
  { value: "az",     label: "A – Z",  icon: AlignLeft },
  { value: "number", label: "1 → N",  icon: Hash      },
];

// Type options for the pill toggle
const TYPE_OPTIONS = [
  { value: "sector", label: "Sector",  icon: MapPin       },
  { value: "campus", label: "Campus",  icon: GraduationCap },
];

// ── Generic Select Dropdown ──────────────────────────────────────────────────

function SelectDropdown({ value, onChange, options, placeholder = "All", icon: Icon }) {
  const [open, setOpen] = useState(false);
  const ref             = useRef(null);
  const active          = options.find(o => o.value === value);

  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  return (
    <div ref={ref} className="relative flex-1">
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold
          border transition-colors focus:outline-none
          ${value
            ? "bg-white/[0.08] border-white/20 text-white/80"
            : "bg-white/[0.04] border-white/[0.08] text-white/40 hover:bg-white/[0.06] hover:text-white/60"
          }`}
      >
        {Icon && <Icon size={12} className="flex-shrink-0 text-white/30" />}
        <span className="flex-1 text-left truncate">
          {active ? active.label : placeholder}
        </span>
        <ChevronDown
          size={12}
          className={`flex-shrink-0 transition-transform duration-200 text-white/30
            ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.13 }}
            className="absolute left-0 top-full mt-1.5 z-30 w-full max-h-52 overflow-y-auto
              rounded-xl border border-white/[0.10] bg-[#161616] shadow-2xl"
          >
            <button
              onClick={() => { onChange(""); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold
                transition-colors text-left
                ${!value
                  ? "text-white bg-white/[0.08]"
                  : "text-white/45 hover:text-white/75 hover:bg-white/[0.05]"}`}
            >
              All
            </button>
            {options.map(opt => (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold
                  transition-colors text-left
                  ${opt.value === value
                    ? "text-white bg-white/[0.08]"
                    : "text-white/45 hover:text-white/75 hover:bg-white/[0.05]"}`}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Sort Dropdown ────────────────────────────────────────────────────────────

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
        className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold
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

// ── Search Bar ───────────────────────────────────────────────────────────────

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

// ── Type Pill Toggle ─────────────────────────────────────────────────────────
// Shows Sector / Campus pills. Selecting the active one clears the filter (back to All).

function TypePillToggle({ value, onChange }) {
  return (
    <div className="flex items-center gap-2 px-4">
      {/* "All" pill — shown highlighted when nothing selected */}
      <button
        onClick={() => onChange("")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold
          border transition-all duration-150
          ${!value
            ? "bg-white/[0.10] border-white/[0.18] text-white"
            : "bg-transparent border-white/[0.07] text-white/35 hover:border-white/[0.14] hover:text-white/55"
          }`}
      >
        All
      </button>

      {TYPE_OPTIONS.map(opt => {
        const Icon    = opt.icon;
        const active  = value === opt.value;
        const colors  = opt.value === "sector"
          ? { on: "bg-emerald-500/[0.12] border-emerald-500/30 text-emerald-400",
              off: "border-white/[0.07] text-white/35 hover:border-emerald-500/20 hover:text-emerald-400/60" }
          : { on: "bg-violet-500/[0.12] border-violet-500/30 text-violet-400",
              off: "border-white/[0.07] text-white/35 hover:border-violet-500/20 hover:text-violet-400/60" };

        return (
          <button
            key={opt.value}
            onClick={() => onChange(active ? "" : opt.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold
              border transition-all duration-150
              ${active ? colors.on : `bg-transparent ${colors.off}`}`}
          >
            <Icon size={11} />
            {opt.label}
            {active && (
              <X size={9} className="ml-0.5 opacity-60" />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ── Active filter chips ───────────────────────────────────────────────────────

function ActiveFilters({ group, teamName, onClearGroup, onClearTeam }) {
  const chips = [
    group    && { label: group,    onClear: onClearGroup },
    teamName && { label: teamName, onClear: onClearTeam  },
  ].filter(Boolean);

  if (!chips.length) return null;

  return (
    <div className="flex items-center gap-2 px-4 pt-1 flex-wrap">
      {chips.map(chip => (
        <motion.span
          key={chip.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1   }}
          exit={{    opacity: 0, scale: 0.9 }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px]
            font-semibold bg-white/[0.07] border border-white/[0.10] text-white/55"
        >
          {chip.label}
          <button onClick={chip.onClear} className="hover:text-white/90 transition-colors">
            <X size={9} />
          </button>
        </motion.span>
      ))}
    </div>
  );
}

// ── Empty / Error ────────────────────────────────────────────────────────────

function EmptyState({ onReset }) {
  return (
    <div className="flex flex-col items-center py-14 text-center">
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
    <div className="flex flex-col items-center py-14 text-center">
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

function SectionSkeleton({ count = 6 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function ResultsPage() {
  // ── Filter state ──
  const [searchInput,    setSearchInput]    = useState("");
  const [search,         setSearch]         = useState("");
  const [sort,           setSort]           = useState("newest");
  const [activeGroup,    setActiveGroup]    = useState("");
  const [activeTeamId,   setActiveTeamId]   = useState("");
  const [activeType,     setActiveType]     = useState(""); // "" | "sector" | "campus"

  // ── Results state ──
  const [results,  setResults]  = useState([]);
  const [meta,     setMeta]     = useState({ total: 0, page: 1, pages: 1 });
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [page,     setPage]     = useState(1);

  // ── Filter options ──
  const [groups, setGroups] = useState([]);
  const [teams,  setTeams]  = useState([]);

  // ── Detail sheet ──
  const [detailOpen,   setDetailOpen]   = useState(false);
  const [activeResult, setActiveResult] = useState(null);

  // ── Fetch filter options once ──
  useEffect(() => {
    get("/api/results/filters")
      .then(res => setGroups(res?.data?.groups || []))
      .catch(() => {});

    get("/api/teams")
      .then(res => setTeams(res.data || []))
      .catch(() => {});
  }, []);

  // ── Fetch results ──
  const fetchResults = useCallback(async (pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page:  pageNum,
        limit: LIMIT,
        sort,
        ...(activeGroup  && { group:        activeGroup  }),
        ...(search       && { categoryName: search       }),
        ...(activeTeamId && { teamId:       activeTeamId }),
        ...(activeType   && { teamType:     activeType   }),
      };

      const qs = new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ""))
      ).toString();

      const res = await get(`/api/results/public/?${qs}`);
      setResults(res.data  || []);
      setMeta({
        total: res.total || 0,
        page:  res.page  || 1,
        pages: res.pages || 1,
      });
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [sort, activeGroup, search, activeTeamId, activeType]);

  // Re-fetch when filters or page change
  useEffect(() => {
    fetchResults(page);
  }, [page, fetchResults]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [sort, activeGroup, search, activeTeamId, activeType]);

  // ── Handlers ──
  const handleSearchCommit = (val) => {
    const v = val !== undefined ? val : searchInput;
    setSearch(v);
  };

  const resetFilters = () => {
    setActiveGroup("");
    setSearch("");
    setSearchInput("");
    setSort("newest");
    setActiveTeamId("");
    setActiveType("");
  };

  const openDetail  = (result) => { setActiveResult(result); setDetailOpen(true); };
  const closeDetail = () => setDetailOpen(false);

  // Derived
  const activeTeamName = teams.find(t => t._id === activeTeamId)?.name || "";
  const hasFilters     = activeGroup || search || sort !== "newest" || activeTeamId || activeType;

  const groupOptions = groups.map(g => ({ value: g, label: g }));
  const teamOptions  = teams
    // When a type is selected, show only teams of that type for cleaner UX
    .filter(t => !activeType || t.teamType === activeType)
    .map(t => ({ value: t._id, label: t.name }));

  // ── Type label for header ──
  const typeLabel = activeType === "sector"
    ? { text: "Sector", color: "text-emerald-400", icon: MapPin }
    : activeType === "campus"
    ? { text: "Campus", color: "text-violet-400",  icon: GraduationCap }
    : { text: "All",    color: "text-white/40",    icon: Trophy };

  return (
    <div className="min-h-screen pt-20 text-white">

      {/* ── Hero ── */}
      <div className="px-4 pb-4">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-display tracking-tight ">Results</h1>
            {!loading && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full
                bg-white/[0.07] border border-white/[0.07] text-white/35 tabular-nums">
                {meta.total}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <typeLabel.icon size={12} className={typeLabel.color} />
            <p className={`text-sm ${typeLabel.color}`}>
              {loading ? "Loading…" : `${meta.total} result${meta.total !== 1 ? "s" : ""}`}
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── Filter bar ── */}
      <div className="sticky top-0 z-20 bg-[#080808]/90 backdrop-blur-md
        border-b border-white/[0.05] pb-3 space-y-2.5">

        {/* Row 1: search + sort */}
        <div className="flex items-center gap-2 px-4 pt-3">
          <SearchBar
            value={searchInput}
            onChange={setSearchInput}
            onCommit={handleSearchCommit}
          />
          <SortDropdown value={sort} onChange={setSort} />
        </div>

        {/* Row 2: type pill toggle */}
        <TypePillToggle value={activeType} onChange={setActiveType} />

        {/* Row 3: category + team dropdowns */}
        <div className="flex items-center gap-2 px-4">
          <SelectDropdown
            value={activeGroup}
            onChange={setActiveGroup}
            options={groupOptions}
            placeholder="All categories"
            icon={AlignLeft}
          />
          <SelectDropdown
            value={activeTeamId}
            onChange={setActiveTeamId}
            options={teamOptions}
            placeholder="All teams"
            icon={Trophy}
          />
        </div>

        {/* Active filter chips */}
        <AnimatePresence>
          {(activeGroup || activeTeamName) && (
            <ActiveFilters
              group={activeGroup}
              teamName={activeTeamName}
              onClearGroup={() => setActiveGroup("")}
              onClearTeam={() => setActiveTeamId("")}
            />
          )}
        </AnimatePresence>

        {/* Reset row */}
        <AnimatePresence>
          {hasFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex justify-end px-4"
            >
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-[11px] text-white/30
                  hover:text-white/55 transition-colors"
              >
                <X size={10} /> Reset all
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Results list ── */}
      <div className="px-4 pt-5 pb-12">
        {loading ? (
          <SectionSkeleton />
        ) : error ? (
          <ErrorState message={error} onRetry={() => fetchResults(page)} />
        ) : results.length === 0 ? (
          <EmptyState onReset={resetFilters} />
        ) : (
          <>
            <motion.div
              key={`results-${page}-${activeType}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {results.map((result, i) => (
                <ResultCard key={result._id} result={result} index={i} onClick={openDetail} />
              ))}
            </motion.div>

            {meta.pages > 1 && (
              <Pagination
                page={meta.page}
                pages={meta.pages}
                total={meta.total}
                onPage={setPage}
                loading={loading}
                className="mt-6"
              />
            )}
          </>
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