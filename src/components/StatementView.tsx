import React, { useState } from 'react';
import { FileText, ArrowDownLeft, ArrowUpRight, Search, Calendar, Filter, DollarSign, Download, CheckCircle, RefreshCcw } from 'lucide-react';
import { StatementItem, UserProfile } from '../types';

interface StatementViewProps {
  statements: StatementItem[];
  user: UserProfile;
  onOpenTopUp: () => void;
}

export function StatementView({ statements, user, onOpenTopUp }: StatementViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'deposit' | 'order_charge' | 'refund'>('all');

  const filteredStatements = statements.filter((st) => {
    const matchesSearch =
      st.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (st.referenceId && st.referenceId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'all' || st.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalDeposits = statements
    .filter((s) => s.type === 'deposit')
    .reduce((sum, s) => sum + s.amount, 0);

  const totalSpent = Math.abs(
    statements
      .filter((s) => s.type === 'order_charge')
      .reduce((sum, s) => sum + s.amount, 0)
  );

  return (
    <div className="space-y-6">
      {/* Page Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 rounded-lg text-teal-600 dark:text-teal-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              My Financial Statement
              <span className="text-xs bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 font-semibold px-2.5 py-0.5 rounded-full">
                Ledger
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Complete transaction log of credits, top-ups, and service charges for account: {user.fullName || user.username}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenTopUp}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow transition flex items-center justify-center gap-2 text-sm"
          id="statement-add-balance-btn"
        >
          <DollarSign className="w-4 h-4" />
          Add Balance Now
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Balance</p>
            <p className="text-2xl font-black text-teal-600 dark:text-teal-400 font-mono mt-1">
              ${user.balance.toFixed(2)} USD
            </p>
          </div>
          <div className="p-3 bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Credits Added</p>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">
              +${totalDeposits.toFixed(2)} USD
            </p>
          </div>
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <ArrowDownLeft className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Service Deductions</p>
            <p className="text-2xl font-black text-rose-500 dark:text-rose-400 font-mono mt-1">
              -${totalSpent.toFixed(2)} USD
            </p>
          </div>
          <div className="p-3 bg-rose-100 dark:bg-rose-900/40 text-rose-500 dark:text-rose-400 rounded-xl">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search reference # or description..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white"
            id="statement-search-input"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'deposit', 'order_charge', 'refund'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                typeFilter === t
                  ? 'bg-teal-600 text-white shadow'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              id={`filter-stmt-${t}`}
            >
              {t === 'all'
                ? 'All Transactions'
                : t === 'deposit'
                ? 'Deposits (+)'
                : t === 'order_charge'
                ? 'Charges (-)'
                : 'Refunds'}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Reference ID</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-right">Running Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStatements.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-sm">
                    No financial statement records found.
                  </td>
                </tr>
              ) : (
                filteredStatements.map((st) => {
                  const isPositive = st.amount > 0;
                  return (
                    <tr key={st.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {st.date}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                            st.type === 'deposit'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                              : st.type === 'order_charge'
                              ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800'
                              : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800'
                          }`}
                        >
                          {st.type === 'deposit' && <ArrowDownLeft className="w-3 h-3" />}
                          {st.type === 'order_charge' && <ArrowUpRight className="w-3 h-3" />}
                          {st.type === 'deposit'
                            ? 'Credit Add'
                            : st.type === 'order_charge'
                            ? 'Order Charge'
                            : 'Refund'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                        {st.description}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-500 dark:text-slate-400">
                        {st.referenceId || 'N/A'}
                      </td>
                      <td
                        className={`py-3.5 px-4 font-mono font-bold text-right text-sm ${
                          isPositive
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {isPositive ? `+$${st.amount.toFixed(2)}` : `-$${Math.abs(st.amount).toFixed(2)}`}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-right text-slate-700 dark:text-slate-300 font-medium">
                        ${st.balanceAfter.toFixed(2)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
