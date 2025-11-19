'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { fetcher } from '@/utils/fetcher';
import { getIndonesianFullDate, getIndonesianShortDate } from '@/utils/dates';
import { formatIdNumber } from '@/utils/format';
import ReportItem from '@/components/report/ReportItem';
import SectionWrapper from '@/components/report/SectionWrapper';
import Loader from '@/components/ui/loader';
import ErrorBanner from '@/components/ui/errorBanner';
import {
  DollarSign,
  ShoppingBag,
  Truck,
  ScrollText,
  ArrowLeft,
  Receipt,
  Calendar,
} from 'lucide-react';

export default function ViewReportPage() {
  const { id } = useParams();
  const router = useRouter();

  const [report, setReport] = useState();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [activeTab, setActiveTab] = useState('payments');

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const data = await fetcher(`/api/reports/get?id=${id}`);
        if (mounted)
          setReport({
            ...data,
            payments: {
              cash: data.payments.cash,
              qris: data.payments.qris,
              grabfood: data.payments.grabfood,
              gofood: data.payments.gofood,
              debit: data.payments.debit,
              credit_card: data.payments.credit_card,
              transfer: data.payments.transfer,
              voucher: data.payments.voucher,
              transfer_outstanding: data.payments.transfer_outstanding,
            },
            category_sales: {
              pastry: data.category_sales.pastry,
              bread: data.category_sales.bread,
              daily: data.category_sales.daily,
              drink: data.category_sales.drink,
              susu_kurma: data.category_sales.susu_kurma,
              mineral_water: data.category_sales.mineral_water,
              fresh_juice: data.category_sales.fresh_juice,
              susu_uht: data.category_sales.susu_uht,
              coffee_spoke: data.category_sales.coffee_spoke,
              ongkir: data.category_sales.ongkir,
              pb1: data.category_sales.pb1,
            },
          });
      } catch (e) {
        if (mounted) setErr(e.message || 'Failed to load report');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, [id]);

  const tabs = useMemo(() => {
    if (!report) return [];

    return [
      {
        id: 'payments',
        title: 'Metode',
        icon: DollarSign,
        data: report.payments,
        render: (key, val) => (
          <ReportItem key={key} label={key} value={val} transactions={val.transactions} />
        ),
      },
      {
        id: 'sales',
        title: 'Kategori',
        icon: ShoppingBag,
        data: report.summary_sales || report.category_sales,
        render: (key, val) => <ReportItem key={key} label={key} value={val} />,
      },
      {
        id: 'leftovers',
        title: 'Sisa',
        icon: Truck,
        data: (() => {
          const items = report.leftovers || report.stock_remaining?.leftovers || [];

          const groups = items.reduce((acc, item) => {
            const catName = item.product_category?.name || 'Lainnya';
            if (!acc[catName]) acc[catName] = [];
            acc[catName].push(item);
            return acc;
          }, {});

          const sortedCategories = Object.keys(groups).sort((a, b) => {
            const aOrder = groups[a][0]?.product_category?.sort_order ?? 9999;
            const bOrder = groups[b][0]?.product_category?.sort_order ?? 9999;
            return aOrder - bOrder;
          });

          sortedCategories.forEach((cat) => {
            groups[cat] = groups[cat].sort(
              (a, b) => (a.sort_order ?? 9999) - (b.sort_order ?? 9999)
            );
          });

          return sortedCategories.map((cat) => ({
            category: cat,
            items: groups[cat],
          }));
        })(),
        render: (group) => (
          <div key={group.category} className="mb-4">
            <h3 className="text-sm font-semibold text-accent-primary mb-2 tracking-wide uppercase">
              {group.category}
            </h3>

            <ul className="divide-y divide-row-hover">
              {group.items.map((item) => (
                <li key={item.product_id} className="flex justify-between items-center py-2">
                  <span className="capitalize text-text-secondary">{item.name}</span>
                  <span className="text-lg font-bold text-text-secondary">
                    {item.quantity_left} pcs
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ),
      },
    ];
  }, [report]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-primary">
        <Loader />
        <span className="text-text-primary">Memuat Data Laporan ....</span>
      </div>
    );

  if (err)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-primary p-4">
        <ErrorBanner message={err} />
      </div>
    );

  if (!report) return <div className="p-4 bg-primary text-text-primary">Report not found.</div>;

  return (
    <div className="min-h-screen text-text-primary">
      <div className="min-h-screen px-4 py-6 max-w-md mx-auto bg-primary">
        <header className="flex items-center justify-between mb-6 pb-4 border-b border-row-hover">
          <button
            onClick={() => router.back()}
            className="text-text-secondary hover:text-accent-primary p-1 rounded transition-colors shrink-0"
          >
            <ArrowLeft className="w-6 h-6 text-text-primary hover:text-accent-primary" />
          </button>

          <div className="flex flex-col text-right">
            <h1 className="text-xl font-extrabold">THE WHEAT RS PURI CINERE</h1>
            <p className="text-sm text-text-primary">
              {getIndonesianShortDate(report.report_date)}
            </p>
          </div>
        </header>

        <SectionWrapper title="Summary" icon={Receipt}>
          <div className="bg-secondary p-5 rounded-xl shadow-lg mb-6">
            <div className="flex items-center mb-3">
              <Calendar className="w-5 h-5 text-accent-primary mr-2" />
              <h2 className="text-lg font-medium text-text-secondary">
                {getIndonesianFullDate(report.report_date)}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-row-hover pt-4">
              <div className="p-2 border-b border-row-hover md:border-b-0 md:border-r">
                <p className="text-sm text-text-secondary">Total Sales</p>
                <p className="text-3xl font-extrabold text-text-secondary">
                  Rp{formatIdNumber(report.total_sales || 0)}
                </p>
              </div>

              <div className="p-2">
                <p className="text-sm text-text-secondary">Transactions</p>
                <p className="text-3xl font-extrabold text-text-secondary">
                  {report.transactions || 0}
                </p>
              </div>
            </div>
          </div>
        </SectionWrapper>

        <div className="grid grid-cols-3 border-b border-row-hover my-6 overflow-x-auto whitespace-nowrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center py-2 px-3 text-sm font-semibold transition-colors rounded-lg rounded-b-none ${
                activeTab === tab.id
                  ? 'border-b-2 border-accent-primary text-text-primary bg-accent-primary hover:bg-btn-primary-hover'
                  : 'text-text-primary hover:text-text-secondary hover:bg-row-hover'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.title}
            </button>
          ))}
        </div>

        {tabs.map(
          (tab) =>
            activeTab === tab.id && (
              <SectionWrapper key={tab.id} title={tab.title} icon={tab.icon}>
                <ul className="divide-y divide-row-hover">
                  {Array.isArray(tab.data)
                    ? tab.data.map(tab.render)
                    : Object.entries(tab.data || {}).map(([key, val]) => tab.render(key, val))}
                </ul>
              </SectionWrapper>
            )
        )}

        {report.notes && (
          <div className="mt-6">
            <SectionWrapper title="Internal Notes" icon={ScrollText}>
              <p className="text-sm text-text-secondary p-3 bg-input rounded-lg italic">
                {report.notes}
              </p>
            </SectionWrapper>
          </div>
        )}
      </div>
    </div>
  );
}
