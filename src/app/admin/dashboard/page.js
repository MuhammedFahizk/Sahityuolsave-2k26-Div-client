'use client';

import { useEffect, useState } from 'react';
import { get }                 from '@/utils/api';
import Topbar                  from '@/components/admin/Topbar';
import StatCard                from '@/components/admin/StatCard';
import Spinner                 from '@/components/shared/Spinner';
import Link from 'next/link';

export default function AdminOverviewPage() {
  const [stats,   setStats]   = useState(null);
  const [teams,   setTeams]   = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, teamsRes, resultsRes] = await Promise.all([
          get('/api/dashboard/stats'),
          get('/api/teams'),
          get('/api/results'),
        ]);
        setStats(statsRes.data);
        setTeams(teamsRes.data   || []);
        setResults(resultsRes.data || []);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <>
        <Topbar title="Dashboard Overview" subtitle="SSF Sahityolsavam 2026" />
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" />
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar title="Dashboard Overview" subtitle="SSF Sahityolsavam 2026" />

      <div className="p-5 space-y-5">

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            label="Total Teams"
            value={stats?.totalTeams}
            tag="All active"
            tagColor="blue"
            borderColor="#0F4C81"
          />
          <StatCard
            label="Results Published"
            value={stats?.totalResults}
            tag="View all"
            tagColor="green"
            borderColor="#1D9E75"
          />
          <StatCard
            label="Total Entries"
            value={stats?.totalEntries}
            tag="Participants"
            tagColor="amber"
            borderColor="#D4AF37"
          />
          <StatCard
            label="Top Team"
            value={stats?.topTeam?.points ?? 0}
            tag={stats?.topTeam?.name || 'No data'}
            tagColor="red"
            borderColor="#D85A30"
          />
        </div>

        {/* ── Bottom Row ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Leaderboard */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[13px] font-medium text-gray-800">
                Team Leaderboard
              </h3>
              <Link href="/admin/dashboard/teams"
                className="text-[11px] text-[#0F4C81] bg-blue-50
                  px-3 py-1 rounded-lg border border-blue-100">
                Manage
              </Link>
            </div>

            {teams.length === 0 ? (
              <p className="text-[12px] text-gray-300 text-center py-6">
                No teams yet
              </p>
            ) : (
              <div className="space-y-0">
                {teams.slice(0, 5).map((team, index) => {
                  const rankColors = {
                    0: { bg: 'bg-amber-50',  text: 'text-amber-700'  },
                    1: { bg: 'bg-gray-50',   text: 'text-gray-500'   },
                    2: { bg: 'bg-orange-50', text: 'text-orange-600' },
                  };
                  const rank = rankColors[index] || { bg: 'bg-blue-50', text: 'text-blue-600' };

                  return (
                    <div key={team._id}
                      className="flex items-center justify-between
                        py-2.5 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-2.5">
                        {/* Rank badge */}
                        <div className={`w-5 h-5 rounded-md flex items-center
                          justify-center text-[10px] font-medium
                          ${rank.bg} ${rank.text}`}>
                          {index + 1}
                        </div>
                        {/* Team dot */}
                        <div className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ background: team.color || '#ccc' }} />
                        <div>
                          <div className="text-[12px] text-gray-800">{team.name}</div>
                          <div className="text-[10px] text-gray-400">
                            {team.totalMembers} members
                          </div>
                        </div>
                      </div>
                      <div className="text-[12px] font-medium text-[#0F4C81]">
                        {team.totalPoints} pts
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Results */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[13px] font-medium text-gray-800">
                Recent Results
              </h3>
              <Link href="/admin/dashboard/results"
                className="text-[11px] text-[#0F4C81] bg-blue-50
                  px-3 py-1 rounded-lg border border-blue-100">
                + Add
              </Link>
            </div>

            {results.length === 0 ? (
              <p className="text-[12px] text-gray-300 text-center py-6">
                No results yet
              </p>
            ) : (
              <div className="space-y-0">
                {results.slice(0, 5).map(result => {
                  const groupColors = {
                    'high school': { bg: 'bg-blue-50',   text: 'text-blue-700'  },
                    'junior':      { bg: 'bg-green-50',  text: 'text-green-700' },
                    'senior':      { bg: 'bg-amber-50',  text: 'text-amber-700' },
                  };
                  const grp = groupColors[result.group?.toLowerCase()] ||
                    { bg: 'bg-gray-50', text: 'text-gray-500' };

                  return (
                    <div key={result._id}
                      className="flex items-center gap-2.5 py-2.5
                        border-b border-gray-50 last:border-0">
                      {/* Result number */}
                      <div className="w-7 h-7 rounded-lg bg-blue-50 border
                        border-blue-100 flex items-center justify-center
                        text-[10px] font-medium text-[#0F4C81] flex-shrink-0">
                        {String(result.resultNumber).padStart(2, '0')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] text-gray-800 truncate">
                          {result.categoryName}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          {result.entries?.length} entries
                        </div>
                      </div>
                      {result.group && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full
                          flex-shrink-0 ${grp.bg} ${grp.text}`}>
                          {result.group}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}