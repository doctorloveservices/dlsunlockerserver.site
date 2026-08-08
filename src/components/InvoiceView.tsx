import React, { useState } from 'react';
import { FileCheck, Printer, Download, Eye, CheckCircle2, ShieldCheck, DollarSign } from 'lucide-react';
import { InvoiceItem, UserProfile } from '../types';

interface InvoiceViewProps {
  invoices: InvoiceItem[];
  user: UserProfile;
}

export function InvoiceView({ invoices, user }: InvoiceViewProps) {
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(invoices[0] || null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 rounded-lg text-teal-600 dark:text-teal-400">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              My Invoices & Billing Receipts
              <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold px-2.5 py-0.5 rounded-full">
                Verified Paid
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Generate and print official reseller invoices for account: {user.fullName || user.username}
            </p>
          </div>
        </div>

        {selectedInvoice && (
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg shadow transition flex items-center justify-center gap-2 text-sm"
            id="print-invoice-btn"
          >
            <Printer className="w-4 h-4" />
            Print / Save PDF
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice List Column */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
            Recent Invoices
          </h2>
          {invoices.map((inv) => (
            <div
              key={inv.id}
              onClick={() => setSelectedInvoice(inv)}
              className={`p-4 rounded-xl border cursor-pointer transition ${
                selectedInvoice?.id === inv.id
                  ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-500 dark:border-teal-500 shadow-sm ring-1 ring-teal-500'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                  {inv.invoiceNumber}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full">
                  {inv.status}
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 line-clamp-1 mb-1">
                {inv.serviceName}
              </p>
              <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>{inv.date}</span>
                <span className="font-bold text-teal-600 dark:text-teal-400">${inv.amount.toFixed(2)} USD</span>
              </div>
            </div>
          ))}
        </div>

        {/* Invoice Preview Sheet */}
        <div className="lg:col-span-2">
          {selectedInvoice ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-md relative print:shadow-none print:border-none">
              
              {/* Invoice Banner */}
              <div className="flex justify-between items-start pb-6 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-600 text-white font-black flex items-center justify-center text-lg">
                      D
                    </div>
                    <span className="text-xl font-extrabold tracking-tight text-teal-700 dark:text-teal-400">
                      DLS UNLOCKER SERVER
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Automated Reseller Unlock Gateway & Server Services
                  </p>
                  <p className="text-xs text-slate-500">
                    Support: support@dlsunlockerserver.site • www.dlsunlockerserver.site
                  </p>
                </div>

                <div className="text-right">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    INVOICE
                  </h3>
                  <p className="font-mono text-sm font-bold text-teal-600 dark:text-teal-400">
                    {selectedInvoice.invoiceNumber}
                  </p>
                  <p className="text-xs text-slate-500 font-mono">Date: {selectedInvoice.date}</p>
                </div>
              </div>

              {/* Bill To Info */}
              <div className="grid grid-cols-2 gap-6 my-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-xs">
                <div>
                  <p className="font-bold text-slate-400 uppercase tracking-wider mb-1">Billed To</p>
                  <p className="font-bold text-sm text-slate-900 dark:text-white">
                    {selectedInvoice.userName}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 font-mono">{selectedInvoice.userEmail}</p>
                  <p className="text-slate-500 font-mono">Role: Distributor Account</p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-slate-400 uppercase tracking-wider mb-1">Payment Status</p>
                  <span className="inline-flex items-center gap-1 font-bold text-sm text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" /> PAID FULLY
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 mt-1">
                    Method: {selectedInvoice.paymentMethod}
                  </p>
                  {selectedInvoice.txHash && (
                    <p className="text-slate-500 font-mono truncate">Ref: {selectedInvoice.txHash}</p>
                  )}
                </div>
              </div>

              {/* Itemized Table */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden my-6">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold text-xs uppercase">
                      <th className="py-2.5 px-4">Item Description</th>
                      <th className="py-2.5 px-4 text-center">Qty</th>
                      <th className="py-2.5 px-4 text-right">Unit Price</th>
                      <th className="py-2.5 px-4 text-right">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr>
                      <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        {selectedInvoice.serviceName}
                      </td>
                      <td className="py-4 px-4 text-center font-mono">1</td>
                      <td className="py-4 px-4 text-right font-mono">${selectedInvoice.amount.toFixed(2)}</td>
                      <td className="py-4 px-4 text-right font-mono font-bold text-teal-600 dark:text-teal-400">
                        ${selectedInvoice.amount.toFixed(2)} USD
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Total Calculation */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-teal-500" />
                  <span>Digitally signed & verified by DLS Unlocker Server Gateway API</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 uppercase tracking-wider block">Total Paid</span>
                  <span className="text-2xl font-black font-mono text-teal-600 dark:text-teal-400">
                    ${selectedInvoice.amount.toFixed(2)} USD
                  </span>
                </div>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-900 border rounded-xl">
              Select an invoice from the list to preview details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
