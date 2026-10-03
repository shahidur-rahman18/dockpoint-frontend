import React from 'react';
import { ChevronDown } from 'lucide-react';
import { recentTransactionsData } from '../../data/mockData';

export const RecentTransactions: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-800">Recent Transactions</h2>
        <div className="relative">
          <select className="appearance-none bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold px-3 py-1.5 pr-7 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option>Weekly</option>
            <option>Monthly</option>
            <option>Yearly</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-3.5">
        {recentTransactionsData.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50/80 transition-colors border border-transparent hover:border-slate-100"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-xs ${
                item.provider === 'stripe' ? 'bg-indigo-600' : 'bg-blue-700'
              }`}>
                {item.provider === 'stripe' ? 'stripe' : 'paypal'}
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-slate-800 truncate">{item.title}</h3>
                <p className="text-[11px] font-medium text-slate-400 truncate mt-0.5">{item.invoiceId}</p>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold shrink-0 ${
              item.isPositive
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60'
                : 'bg-rose-50 text-rose-600 border border-rose-200/60'
            }`}>
              {item.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
