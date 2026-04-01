import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Users,
  TrendingUp,
  AlertTriangle,
  Heart,
  Menu,
  LogOut,
  BarChart3,
  PieChart,
} from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

const PAGE_BG = '#eef5f7';

const BRANCH_STATS = [
  { branch: 'Computer Science', students: 420, avgStress: 6.4, highRiskPct: 22, checkInRate: 68 },
  { branch: 'Electronics & Comm.', students: 310, avgStress: 6.1, highRiskPct: 18, checkInRate: 61 },
  { branch: 'Mechanical', students: 280, avgStress: 5.8, highRiskPct: 15, checkInRate: 55 },
  { branch: 'Civil', students: 190, avgStress: 5.5, highRiskPct: 12, checkInRate: 52 },
  { branch: 'Business / MBA', students: 240, avgStress: 6.7, highRiskPct: 26, checkInRate: 71 },
];

const YOUTH_BUCKETS = [
  { label: 'UG years 1–2', pct: 38, stressIndex: 6.2 },
  { label: 'UG years 3–4', pct: 34, stressIndex: 6.5 },
  { label: 'PG / research', pct: 28, stressIndex: 6.0 },
];

const STRESS_DRIVERS = [
  { category: 'Academic load & exams', share: 34 },
  { category: 'Career / placement anxiety', share: 22 },
  { category: 'Sleep & routine', share: 18 },
  { category: 'Social / relationships', share: 14 },
  { category: 'Family / financial', share: 12 },
];

function barWidth(v, max) {
  return `${Math.min(100, Math.round((v / max) * 100))}%`;
}

export default function InstituteDashboard() {
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const displayName =
    currentUser?.displayName ||
    localStorage.getItem('devDisplayName') ||
    localStorage.getItem('devEmail')?.split('@')[0] ||
    'Institute';

  const totals = useMemo(() => {
    const n = BRANCH_STATS.reduce((s, b) => s + b.students, 0);
    const wStress = BRANCH_STATS.reduce((s, b) => s + b.avgStress * b.students, 0);
    const wRisk = BRANCH_STATS.reduce((s, b) => s + b.highRiskPct * b.students, 0);
    const wCheck = BRANCH_STATS.reduce((s, b) => s + b.checkInRate * b.students, 0);
    return {
      students: n,
      avgStress: n ? (wStress / n).toFixed(1) : '—',
      highRiskPct: n ? Math.round(wRisk / n) : 0,
      checkInRate: n ? Math.round(wCheck / n) : 0,
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: PAGE_BG }}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="lg:ml-72 min-h-screen">
        <header className="bg-white border-b sticky top-0 z-30" style={{ borderColor: '#c8ced1' }}>
          <div className="px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2.5 rounded-lg"
                style={{ background: '#c8ced1' }}
              >
                <Menu className="w-5 h-5 text-[#2e2f34]" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#4F46E5] flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[#111827]">Wellbeing overview</h1>
                  <p className="text-sm text-[#6b7280]">Stress by branch</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#6b7280] hidden sm:inline">{displayName}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="p-2.5 rounded-lg border border-[#e5e7eb] text-[#b91c1c] hover:bg-red-50"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        <main className="p-6 space-y-8 max-w-7xl mx-auto">
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border p-5 shadow-sm" style={{ borderColor: '#dbe3ea' }}>
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-[#4F46E5]" />
                <span className="text-xs font-semibold uppercase text-[#6b7280]">Total</span>
              </div>
              <p className="text-3xl font-bold text-[#111827]">{totals.students.toLocaleString()}</p>
              <p className="text-sm text-[#6b7280] mt-1">Students</p>
            </div>
            <div className="bg-white rounded-2xl border p-5 shadow-sm" style={{ borderColor: '#dbe3ea' }}>
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-[#f59e0b]" />
                <span className="text-xs font-semibold uppercase text-[#6b7280]">Avg. stress (1–10)</span>
              </div>
              <p className="text-3xl font-bold text-[#111827]">{totals.avgStress}</p>
              <p className="text-sm text-[#6b7280] mt-1">Across branches</p>
            </div>
            <div className="bg-white rounded-2xl border p-5 shadow-sm" style={{ borderColor: '#dbe3ea' }}>
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-5 h-5 text-[#ef4444]" />
                <span className="text-xs font-semibold uppercase text-[#6b7280]">Elevated risk</span>
              </div>
              <p className="text-3xl font-bold text-[#111827]">{totals.highRiskPct}%</p>
              <p className="text-sm text-[#6b7280] mt-1">Screening</p>
            </div>
            <div className="bg-white rounded-2xl border p-5 shadow-sm" style={{ borderColor: '#dbe3ea' }}>
              <div className="flex items-center gap-3 mb-2">
                <Heart className="w-5 h-5 text-[#10b981]" />
                <span className="text-xs font-semibold uppercase text-[#6b7280]">Daily check-in</span>
              </div>
              <p className="text-3xl font-bold text-[#111827]">{totals.checkInRate}%</p>
              <p className="text-sm text-[#6b7280] mt-1">Last 14 days</p>
            </div>
          </section>

          <section className="bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: '#dbe3ea' }}>
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-[#4F46E5]" />
              <h2 className="text-xl font-bold text-[#111827]">By branch</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-[#6b7280] border-b" style={{ borderColor: '#e5e7eb' }}>
                    <th className="pb-3 pr-4 font-semibold">Branch</th>
                    <th className="pb-3 pr-4 font-semibold">Students</th>
                    <th className="pb-3 pr-4 font-semibold">Avg. stress</th>
                    <th className="pb-3 pr-4 font-semibold">High-risk %</th>
                    <th className="pb-3 font-semibold">Check-in rate</th>
                  </tr>
                </thead>
                <tbody>
                  {BRANCH_STATS.map((row) => (
                    <tr key={row.branch} className="border-b border-[#f3f4f6]">
                      <td className="py-3 pr-4 font-medium text-[#111827]">{row.branch}</td>
                      <td className="py-3 pr-4 text-[#374151]">{row.students}</td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <span>{row.avgStress}</span>
                          <div className="flex-1 max-w-[120px] h-2 bg-[#f3f4f6] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#6366F1] rounded-full"
                              style={{ width: barWidth(row.avgStress, 10) }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-[#374151]">{row.highRiskPct}%</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span>{row.checkInRate}%</span>
                          <div className="flex-1 max-w-[120px] h-2 bg-[#f3f4f6] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#10b981] rounded-full"
                              style={{ width: `${row.checkInRate}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section className="bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: '#dbe3ea' }}>
              <div className="flex items-center gap-2 mb-4">
                <PieChart className="w-5 h-5 text-[#7c3aed]" />
                <h2 className="text-lg font-bold text-[#111827]">Age groups</h2>
              </div>
              <ul className="space-y-4">
                {YOUTH_BUCKETS.map((b) => (
                  <li key={b.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-[#374151]">{b.label}</span>
                      <span className="text-[#6b7280]">
                        {b.pct}% · stress {b.stressIndex}
                      </span>
                    </div>
                    <div className="h-2.5 bg-[#f3f4f6] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#a78bfa] rounded-full"
                        style={{ width: `${b.pct}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: '#dbe3ea' }}>
              <h2 className="text-lg font-bold text-[#111827] mb-4">Common themes</h2>
              <ul className="space-y-3">
                {STRESS_DRIVERS.map((d) => (
                  <li key={d.category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[#374151]">{d.category}</span>
                      <span className="font-semibold text-[#4F46E5]">{d.share}%</span>
                    </div>
                    <div className="h-2 bg-[#eef2ff] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#4F46E5] rounded-full"
                        style={{ width: `${d.share}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
