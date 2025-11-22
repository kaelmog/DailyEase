'use client';
import { useEffect, useState, useMemo, useRef } from 'react';
import { Calendar, Briefcase, CreditCard, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { fetcher } from '@/utils/fetcher';
import { getIndonesianFullDate } from '@/utils/dates';
import { formatIdNumber } from '@/utils/format';
import { Popover } from '@headlessui/react';
import Loader from '@/components/ui/loader';

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('');
  const [weekFilter, setWeekFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [err, setErr] = useState('');

  const dateRef = useRef(null);
  const monthRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await fetcher('/api/reports/list');
        if (mounted) setReports(data || []);
      } catch (e) {
        if (mounted) setErr(e.message || String(e));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function toYMD(dateLike) {
    const dt = new Date(dateLike);
    return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
  }

  function monthRangeFromMonthStr(monthStr) {
    const [y, m] = monthStr.split('-').map(Number);
    const start = new Date(y, m - 1, 1);
    const end = new Date(y, m, 0);
    return { start: toYMD(start), end: toYMD(end) };
  }

  function generateWeeksForMonth(year, mIndex) {
    const weeks = [];
    const firstDay = new Date(year, mIndex, 1);
    const firstWeekday = firstDay.getDay();
    let currentStart = new Date(year, mIndex, 1 - firstWeekday);

    while (true) {
      const start = new Date(currentStart);
      const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);

      if (
        start.getFullYear() > year ||
        (start.getMonth() > mIndex && start.getFullYear() >= year)
      ) {
        break;
      }

      if (start.getMonth() === mIndex || end.getMonth() === mIndex) {
        weeks.push({ start, end });
      }

      currentStart = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 7);

      if (weeks.length > 8) break;
    }
    return weeks;
  }

  function displayDayOnly(v) {
    if (!v) return '';
    try {
      return String(new Date(v).getDate());
    } catch {
      return v;
    }
  }

  function displayWeekLabel(w) {
    if (!w) return '';
    return `Minggu ${w}`;
  }

  function displayMonthName(v) {
    if (!v) return '';
    const [year, month] = v.split('-');
    try {
      return new Date(`${year}-${month}-01`).toLocaleString('id-ID', { month: 'long' });
    } catch {
      return v;
    }
  }

  useEffect(() => {
    if (!monthFilter) {
      if (dateRef.current) {
        dateRef.current.min = '';
        dateRef.current.max = '';
      }
      return;
    }

    const { start, end } = monthRangeFromMonthStr(monthFilter);

    if (dateRef.current) {
      dateRef.current.min = start;
      dateRef.current.max = end;
      if (dateFilter && (dateFilter < start || dateFilter > end)) {
        setDateFilter('');
      }
    }

    if (weekFilter) {
      const [y, mm] = monthFilter.split('-').map(Number);
      const weeks = generateWeeksForMonth(y, mm - 1);
      const wkIndex = Number(weekFilter) - 1;
      if (wkIndex >= 0 && wkIndex < weeks.length) {
        const wkStart = toYMD(weeks[wkIndex].start);
        const wkEnd = toYMD(weeks[wkIndex].end);
        if (dateRef.current) {
          dateRef.current.min = wkStart;
          dateRef.current.max = wkEnd;
        }
        if (dateFilter && (dateFilter < wkStart || dateFilter > wkEnd)) {
          setDateFilter('');
        }
      }
    }
  }, [monthFilter, weekFilter]);

  useEffect(() => {
    if (!dateFilter) return;
    const dt = new Date(dateFilter);
    const monthStr = `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}`;
    setMonthFilter((prev) => (prev === monthStr ? prev : monthStr));

    const firstDay = new Date(dt.getFullYear(), dt.getMonth(), 1);
    const firstWeekday = firstDay.getDay();
    const weekInMonth = Math.ceil((dt.getDate() + firstWeekday) / 7);
    setWeekFilter(String(weekInMonth));
  }, [dateFilter]);

  const weeklySummary = useMemo(() => {
    let list = Array.isArray(reports) ? [...reports] : [];
    list.sort((a, b) => new Date(b.report_date) - new Date(a.report_date));

    if (monthFilter) {
      list = list.filter((r) => r.report_date.startsWith(monthFilter));
    }

    if (weekFilter && monthFilter) {
      const [y, m] = monthFilter.split('-').map(Number);
      const weeks = generateWeeksForMonth(y, m - 1);
      const wkIndex = Number(weekFilter) - 1;
      if (wkIndex >= 0 && wkIndex < weeks.length) {
        const wkStart = toYMD(weeks[wkIndex].start);
        const wkEnd = toYMD(weeks[wkIndex].end);
        list = list.filter((r) => r.report_date >= wkStart && r.report_date <= wkEnd);
      } else {
        list = [];
      }
    }

    if (dateFilter) {
      if (monthFilter) {
        list = list.filter((r) => r.report_date === dateFilter);
      } else {
        const targetDay = new Date(dateFilter).getDate();
        list = list.filter((r) => new Date(r.report_date).getDate() === targetDay);
      }
    }

    return list.map((r) => ({ ...r, formatted_date: getIndonesianFullDate(r.report_date) }));
  }, [reports, monthFilter, weekFilter, dateFilter]);

  const PickerWrapper = ({ children }) => {
    return <div className="text-center">{children}</div>;
  };

  const NativeOverlaidPicker = ({
    type,
    label,
    value,
    onChange,
    inputRef,
    formatValue,
    placeholder,
  }) => {
    return (
      <PickerWrapper label={label}>
        <label className="text-sm text-text-secondary block mb-1">{label}</label>
        <div className="relative w-full">
          <button
            type="button"
            className="w-full p-2 rounded bg-input text-text-secondary border border-border text-center text-sm"
            aria-hidden
          >
            {value ? formatValue(value) : placeholder}
          </button>

          <input
            ref={inputRef}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 z-10"
            aria-label={label}
          />
        </div>
      </PickerWrapper>
    );
  };

  const CustomWeekPicker = ({ month, value, onChange }) => {
    if (!month) {
      return (
        <div className="text-center">
          <label className="text-sm text-text-secondary block mb-1">Minggu</label>
          <button className="w-full p-2 rounded bg-input text-text-secondary border border-border text-center opacity-50 text-sm">
            Pilih Bulan
          </button>
        </div>
      );
    }

    const [year, monthNum] = month.split('-').map(Number);
    const weeks = generateWeeksForMonth(year, monthNum - 1);

    const formatRange = (w) =>
      `${w.start.getDate()}–${w.end.getDate()} ${w.start.toLocaleString('id-ID', { month: 'short' })}`;

    return (
      <div className="text-center">
        <label className="text-sm text-text-secondary block mb-1">Minggu</label>
        <Popover className="relative w-full">
          <Popover.Button className="w-full flex justify-between items-center p-2 rounded bg-input border border-border text-text-secondary text-sm">
            <span>{value ? displayWeekLabel(value) : 'Pilih'}</span>
            <ChevronDown className="w-4 h-4" />
          </Popover.Button>

          <Popover.Panel className="absolute z-50 mt-2 w-full bg-secondary border border-border rounded-lg shadow-lg p-2">
            <div className="space-y-1">
              {weeks.map((w, idx) => (
                <button
                  key={idx}
                  onClick={() => onChange(String(idx + 1))}
                  className={`block w-full text-left px-3 py-2 rounded transition ${
                    value === String(idx + 1)
                      ? 'bg-accent-primary text-white font-semibold'
                      : 'bg-input text-text-secondary hover:bg-row-hover'
                  }`}
                >
                  Minggu {idx + 1} • {formatRange(w)}
                </button>
              ))}
            </div>
          </Popover.Panel>
        </Popover>
      </div>
    );
  };

  function clearAll() {
    setDateFilter('');
    setWeekFilter('');
    setMonthFilter('');
    if (dateRef.current) {
      dateRef.current.min = '';
      dateRef.current.max = '';
    }
  }

  return (
    <div className="min-h-screen px-4 py-6 max-w-md mx-auto bg-primary">
      <header className="mb-4 px-2">
        <div className="flex px-2 items-center space-x-3">
          <h1 className="flex-1 text-3xl font-bold text-text-primary">Riwayat Laporan</h1>

          <Link href="/reports/new">
            <button className="flex-none bg-accent-primary px-3 py-2 hover:bg-btn-primary-hover active:bg-btn-primary-hover rounded-lg text-white">
              Buat Baru
            </button>
          </Link>
        </div>

        <div className="my-6 w-full bg-secondary p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-3">
            <label className="w-full text-lg font-bold text-text-secondary">Filter</label>
          </div>

          <div className="grid grid-cols-3 gap-2 w-full">
            <NativeOverlaidPicker
              type="date"
              label="Tanggal"
              value={dateFilter}
              onChange={setDateFilter}
              inputRef={dateRef}
              formatValue={(v) => displayDayOnly(v)}
              placeholder="Pilih Hari"
            />

            <div className="text-center">
              <CustomWeekPicker month={monthFilter} value={weekFilter} onChange={setWeekFilter} />
            </div>

            <NativeOverlaidPicker
              type="month"
              label="Bulan"
              value={monthFilter}
              onChange={(val) => {
                setMonthFilter(val);
                setWeekFilter('');
                setDateFilter('');
              }}
              inputRef={monthRef}
              formatValue={(v) => displayMonthName(v)}
              placeholder="Pilih Bulan"
            />
          </div>

          <div className="mt-3 flex items-center space-x-2">
            {monthFilter && (
              <span className="px-2 py-1 bg-accent-primary text-white rounded text-xs">
                {displayMonthName(monthFilter)}
              </span>
            )}
            {weekFilter && (
              <span className="px-2 py-1 bg-accent-primary text-white rounded text-xs">
                {displayWeekLabel(weekFilter)}
              </span>
            )}
            {dateFilter && (
              <span className="px-2 py-1 bg-accent-primary text-white rounded text-xs">
                Tanggal {displayDayOnly(dateFilter)}
              </span>
            )}
          </div>

          <button
            onClick={clearAll}
            className="w-full text-lg mt-3 px-2 py-1 rounded border border-row-hover bg-accent-primary text-text-primary hover:bg-btn-primary-hover active:bg-btn-primary-hover"
          >
            Clear Filter
          </button>
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-primary">
          <Loader />
          <span className="text-text-primary">Memuat Data Laporan ....</span>
        </div>
      ) : err ? (
        <p className="text-red-500">{err}</p>
      ) : reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-primary">
          <p>Belum ada laporan.</p>
        </div>
      ) : (
        weeklySummary.map((r) => (
          <div
            key={r.id}
            className="m-2 mb-3 py-2 px-4 rounded-lg bg-secondary text-text-primary active:bg-btn-secondary-hover hover:bg-btn-secondary-hover"
          >
            <Link href={`/reports/view/${r.id}`} className="block flex-1">
              <h1 className="text-3xl font-extrabold mb-1 text-text-secondary">Laporan Closing</h1>

              <div className="flex items-center text-text-secondary text-base mb-6 space-x-2">
                <Calendar className="w-4 h-4 text-accent-primary" />
                <span>{r.formatted_date}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-primary rounded-xl shadow-md border border-row-hover/50">
                  <div className="flex items-center space-x-3 mb-2">
                    <CreditCard className="w-5 h-5 text-text-primary" />
                    <span className="text-text-primary text-sm font-medium uppercase tracking-wider">
                      Penjualan
                    </span>
                  </div>
                  <div className="text-lg font-extrabold text-text-primary">
                    Rp{formatIdNumber(r.total_sales)}
                  </div>
                </div>

                <div className="p-4 bg-primary rounded-xl shadow-md border border-row-hover/50">
                  <div className="flex items-center space-x-3 mb-2">
                    <Briefcase className="w-5 h-5 text-text-primary" />
                    <span className="text-text-primary text-sm font-medium uppercase tracking-wider">
                      Transaksi
                    </span>
                  </div>
                  <div className="text-lg font-extrabold text-text-primary">
                    {r.transactions ?? 0}
                  </div>
                </div>
              </div>

              {r.notes && (
                <div className="pt-6 border-t border-row-hover">
                  <p className="text-text-secondary text-sm font-semibold mb-2">Catatan:</p>
                  <div className="px-4 py-2 bg-input rounded-lg border border-row-hover max-h-14 overflow-y-auto">
                    <p className="text-text-secondary text-sm italic">{r.notes}</p>
                  </div>
                </div>
              )}
            </Link>
          </div>
        ))
      )}
    </div>
  );
}
