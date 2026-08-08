import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertTriangle, 
  Copy, 
  Check, 
  Eye, 
  FileText, 
  Download, 
  RefreshCw,
  Code
} from 'lucide-react';
import { Order } from '../types';
import { formatUSD } from '../utils/imei';

interface OrderHistoryViewProps {
  orders: Order[];
}

export const OrderHistoryView: React.FC<OrderHistoryViewProps> = ({ orders }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.imei.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ord.clientRef && ord.clientRef.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || ord.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCopyCode = (codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-[#141414] border border-[#222] rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono font-semibold uppercase tracking-[0.2em] mb-2">
              <Clock className="w-3.5 h-3.5" />
              <span>LIVE SERVER ORDER TRACKER</span>
            </div>
            <h2 className="text-xl font-serif italic text-white tracking-wide">
              Order History & Delivered Unlock Codes
            </h2>
            <p className="text-slate-500 text-xs mt-1">
              Track live processing status, retrieve generated factory unlock codes, and download wholesale invoices.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">
              Total: <strong className="text-white">{filteredOrders.length} Orders</strong>
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order #, IMEI, Service, or Reference tag..."
              className="w-full bg-[#0a0a0a] border border-[#333] focus:border-blue-500 text-white pl-10 pr-4 py-2.5 rounded-lg text-xs focus:outline-none transition-all placeholder:text-slate-600"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#333] focus:border-blue-500 text-white px-3 py-2.5 rounded-lg text-xs focus:outline-none transition-all"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed / Unlocked</option>
              <option value="in_process">In Process</option>
              <option value="waiting_carrier">Waiting on Carrier</option>
              <option value="rejected">Rejected / Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#141414] border border-[#222] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0a0a0a] text-slate-500 border-b border-[#222] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Order #</th>
                <th className="p-4">Submitted At</th>
                <th className="p-4">Service</th>
                <th className="p-4">IMEI / Ident</th>
                <th className="p-4">Cost</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f1f1f] text-slate-300 text-[11px]">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#0a0a0a] transition-colors">
                  <td className="p-4 font-bold text-blue-400">{ord.orderNumber}</td>
                  <td className="p-4 text-slate-500">{ord.submittedAt}</td>
                  <td className="p-4 font-sans font-semibold text-white max-w-xs truncate">
                    {ord.serviceName}
                  </td>
                  <td className="p-4 font-bold text-slate-200">{ord.imei}</td>
                  <td className="p-4 font-bold text-emerald-400">{formatUSD(ord.cost)}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
                        ord.status === 'completed'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/50'
                          : ord.status === 'in_process'
                          ? 'bg-amber-950 text-amber-400 border border-amber-900/50 animate-pulse'
                          : ord.status === 'waiting_carrier'
                          ? 'bg-blue-950 text-blue-400 border border-blue-900/50'
                          : 'bg-red-950 text-red-400 border border-red-900/50'
                      }`}
                    >
                      {ord.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                      {ord.status === 'in_process' && <Clock className="w-3 h-3" />}
                      {ord.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedOrder(ord);
                        setShowReceipt(false);
                      }}
                      className="bg-[#1e1e1e] hover:bg-[#282828] text-slate-200 border border-[#333] px-3 py-1.5 rounded-lg transition-all font-semibold uppercase tracking-wider text-[10px] cursor-pointer inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="p-12 text-center text-slate-500 font-mono text-xs">
            No orders match your search query or status filter.
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#222] rounded-xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative animate-fadeIn">
            <div className="flex justify-between items-center border-b border-[#222] pb-3">
              <div>
                <h3 className="text-sm font-bold text-white font-mono">
                  Order Details: {selectedOrder.orderNumber}
                </h3>
                <p className="text-xs text-slate-400">{selectedOrder.serviceName}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-white p-1 text-base font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Order Fields */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-[#0a0a0a] p-3 rounded-lg border border-[#222]">
                <span className="text-slate-500 block text-[10px] uppercase tracking-wider">IMEI:</span>
                <span className="text-white font-bold text-xs">{selectedOrder.imei}</span>
              </div>
              <div className="bg-[#0a0a0a] p-3 rounded-lg border border-[#222]">
                <span className="text-slate-500 block text-[10px] uppercase tracking-wider">Wholesale Cost:</span>
                <span className="text-emerald-400 font-bold text-xs">{formatUSD(selectedOrder.cost)}</span>
              </div>
              <div className="bg-[#0a0a0a] p-3 rounded-lg border border-[#222]">
                <span className="text-slate-500 block text-[10px] uppercase tracking-wider">Status:</span>
                <span className="text-blue-400 font-bold uppercase text-xs">{selectedOrder.status}</span>
              </div>
              <div className="bg-[#0a0a0a] p-3 rounded-lg border border-[#222]">
                <span className="text-slate-500 block text-[10px] uppercase tracking-wider">Client Ref Tag:</span>
                <span className="text-slate-200 text-xs">{selectedOrder.clientRef || 'None'}</span>
              </div>
            </div>

            {/* Delivered Code / Result */}
            {selectedOrder.code ? (
              <div className="bg-[#0a0a0a] border border-emerald-900/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-4 h-4" /> Delivered Unlock Code / Cert Token
                  </span>
                  <button
                    onClick={() => handleCopyCode(selectedOrder.code!)}
                    className="text-slate-300 hover:text-white bg-[#1a1a1a] px-2 py-1 rounded text-[10px] border border-[#2a2a2a] flex items-center gap-1 cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                  </button>
                </div>
                <div className="bg-[#141414] p-3 rounded-lg border border-[#222] font-mono text-xs text-blue-300 font-bold break-all select-all">
                  {selectedOrder.code}
                </div>
              </div>
            ) : (
              <div className="bg-amber-950/40 border border-amber-900/50 p-4 rounded-lg text-xs font-mono text-amber-300 space-y-1">
                <div className="font-bold flex items-center gap-1 text-[11px]">
                  <Clock className="w-4 h-4 animate-spin" /> In Process With Server
                </div>
                <p className="text-[10px] text-amber-200/80">
                  {selectedOrder.replyMessage || 'Server handshake active. Code will appear automatically.'}
                </p>
              </div>
            )}

            {/* Raw JSON Payload */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">API Payload Logs</span>
              <pre className="bg-[#0a0a0a] p-3 rounded-lg border border-[#222] text-[10px] font-mono text-slate-400 overflow-x-auto">
{JSON.stringify(selectedOrder, null, 2)}
              </pre>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-[#1e1e1e] hover:bg-[#282828] text-slate-200 border border-[#333] px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
