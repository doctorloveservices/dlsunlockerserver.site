import React, { useState } from 'react';
import { 
  Key, 
  ShieldCheck, 
  Globe, 
  Copy, 
  Check, 
  Code, 
  Play, 
  Terminal, 
  Layers, 
  Plus, 
  Trash2,
  Cpu
} from 'lucide-react';
import { UserProfile } from '../types';

interface ResellerAPIViewProps {
  user: UserProfile;
}

export const ResellerAPIView: React.FC<ResellerAPIViewProps> = ({ user }) => {
  const [apiKey, setApiKey] = useState(user.apiKey);
  const [ips, setIps] = useState<string[]>(user.whitelistedIPs);
  const [newIp, setNewIp] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'curl' | 'php' | 'nodejs' | 'python'>('curl');

  // Interactive Sandbox state
  const [sandboxAction, setSandboxAction] = useState('getservices');
  const [sandboxImei, setSandboxImei] = useState('352843110294812');
  const [sandboxResponse, setSandboxResponse] = useState<string | null>(null);
  const [sandboxLoading, setSandboxLoading] = useState(false);

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleGenerateNewKey = () => {
    if (confirm('Are you sure you want to generate a new API key? Existing scripts will need updating.')) {
      const newKey = `dls_live_pk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      setApiKey(newKey);
    }
  };

  const handleAddIp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIp.trim() || ips.includes(newIp.trim())) return;
    setIps([...ips, newIp.trim()]);
    setNewIp('');
  };

  const handleRemoveIp = (ipToRemove: string) => {
    setIps(ips.filter((ip) => ip !== ipToRemove));
  };

  const handleRunSandbox = () => {
    setSandboxLoading(true);
    setTimeout(() => {
      if (sandboxAction === 'getservices') {
        setSandboxResponse(JSON.stringify({
          status: "SUCCESS",
          gateway: "DLS UNLOCKER DHRU FUSION V4.1",
          services: [
            { id: "srv-101", name: "Apple GSX Pro Check", price: 0.85, time: "Instant" },
            { id: "srv-201", name: "Samsung Knox FRP Key", price: 6.50, time: "1-10 Mins" },
            { id: "srv-103", name: "AT&T USA iPhone Unlock", price: 8.50, time: "1-24 Hours" }
          ]
        }, null, 2));
      } else if (sandboxAction === 'placeorder') {
        setSandboxResponse(JSON.stringify({
          status: "SUCCESS",
          order_id: `DLS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          imei: sandboxImei,
          service_id: "srv-101",
          deducted_credits: 0.85,
          remaining_balance: user.balance,
          code: "UNLOCKED_IN_APPLE_GSX_DATABASE [Status: Factory Unlocked]"
        }, null, 2));
      } else {
        setSandboxResponse(JSON.stringify({
          status: "SUCCESS",
          order_id: "DLS-2026-8812",
          imei: sandboxImei,
          order_status: "COMPLETED",
          delivered_code: "NCK: 88102941 | MCK: 99182041"
        }, null, 2));
      }
      setSandboxLoading(false);
    }, 500);
  };

  const apiEndpointUrl = typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? `${window.location.origin}/api/orders` : 'https://dlsunlockerserver.site/api/orders';

  const codeSnippets = {
    curl: `curl -X POST "${apiEndpointUrl}" \\
  -H "Content-Type: application/json" \\
  -H "X-DLS-API-KEY: ${apiKey}" \\
  -d '{
    "action": "placeorder",
    "service_id": "srv-101",
    "imei": "352843110294812",
    "client_ref": "DHRU-SYNC-01"
  }'`,
    php: `<?php
// DLS Unlocker Server - Dhru Fusion Compatible Curl Request
$api_url = "${apiEndpointUrl}";
$api_key = "${apiKey}";

$payload = [
    "action" => "placeorder",
    "service_id" => "srv-101",
    "imei" => "352843110294812"
];

$ch = curl_init($api_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "X-DLS-API-KEY: " . $api_key
]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));

$response = curl_exec($ch);
curl_close($ch);
echo $response;
?>`,
    nodejs: `import fetch from 'node-fetch';

const apiKey = '${apiKey}';
const response = await fetch('${apiEndpointUrl}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-DLS-API-KEY': apiKey
  },
  body: JSON.stringify({
    action: 'placeorder',
    service_id: 'srv-101',
    imei: '352843110294812'
  })
});

const data = await response.json();
console.log(data);`,
    python: `import requests

api_key = "${apiKey}"
url = "${apiEndpointUrl}"

headers = {
    "Content-Type": "application/json",
    "X-DLS-API-KEY": api_key
}

payload = {
    "action": "placeorder",
    "service_id": "srv-101",
    "imei": "352843110294812"
}

res = requests.post(url, json=payload, headers=headers)
print(res.json())`
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-[#141414] border border-[#222] rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono font-semibold uppercase tracking-[0.2em] mb-2">
              <Code className="w-3.5 h-3.5" />
              <span>DHRU FUSION & REST API V2 INTEGRATION</span>
            </div>
            <h2 className="text-xl font-serif italic text-white tracking-wide">
              Reseller API Credentials & Developer Hub
            </h2>
            <p className="text-slate-500 text-xs mt-1">
              Connect your website or GSM server software (Dhru Fusion, GSM Server, Custom Webstore) directly to DLS Unlocker Server.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Credentials & IP Manager (1 Column) */}
        <div className="space-y-6">
          {/* API Key Box */}
          <div className="bg-[#141414] border border-[#222] rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-blue-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Key className="w-4 h-4" />
              <span>Reseller Secret API Key</span>
            </div>

            <div className="space-y-2">
              <div className="bg-[#0a0a0a] border border-[#222] p-3 rounded-lg flex items-center justify-between font-mono text-xs text-white">
                <span className="truncate max-w-[200px] text-xs">{apiKey}</span>
                <button
                  onClick={handleCopyApiKey}
                  className="p-1.5 rounded hover:bg-[#1f1f1f] text-slate-400 hover:text-white cursor-pointer"
                >
                  {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <button
                onClick={handleGenerateNewKey}
                className="w-full bg-[#1e1e1e] hover:bg-[#282828] text-slate-200 border border-[#333] text-xs font-mono font-semibold py-2 rounded-lg transition-all cursor-pointer uppercase tracking-wider"
              >
                Regenerate New API Key
              </button>
            </div>
          </div>

          {/* Whitelisted IP Manager */}
          <div className="bg-[#141414] border border-[#222] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-400 font-mono text-xs font-bold uppercase tracking-wider">
                <Globe className="w-4 h-4" />
                <span>Whitelisted Server IPs</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">{ips.length} IPs Authorized</span>
            </div>

            <form onSubmit={handleAddIp} className="flex gap-2">
              <input
                type="text"
                value={newIp}
                onChange={(e) => setNewIp(e.target.value)}
                placeholder="e.g. 192.168.1.1"
                className="bg-[#0a0a0a] border border-[#333] text-white px-3 py-2 rounded-lg text-xs font-mono focus:outline-none flex-1"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-2 rounded-lg text-xs cursor-pointer flex items-center gap-1 uppercase tracking-wider"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </form>

            <div className="space-y-1.5">
              {ips.map((ip) => (
                <div key={ip} className="bg-[#0a0a0a] p-2.5 rounded-lg border border-[#222] flex justify-between items-center font-mono text-xs text-slate-300">
                  <span>{ip}</span>
                  <button
                    onClick={() => handleRemoveIp(ip)}
                    className="text-slate-500 hover:text-red-400 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Code Snippet Generator & Interactive Sandbox (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Code Snippets Card */}
          <div className="bg-[#141414] border border-[#222] rounded-xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222] pb-3">
              <div className="flex items-center gap-2 text-white font-mono text-xs font-bold uppercase tracking-wider">
                <Terminal className="w-4 h-4 text-blue-400" />
                <span>Integration Code Snippets</span>
              </div>

              <div className="flex gap-1 bg-[#0a0a0a] p-1 rounded-lg border border-[#222]">
                {(['curl', 'php', 'nodejs', 'python'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-3 py-1 rounded text-xs font-mono uppercase font-bold cursor-pointer transition-all ${
                      selectedLanguage === lang
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <pre className="bg-[#0a0a0a] p-4 rounded-lg border border-[#1f1f1f] font-mono text-xs text-blue-300 overflow-x-auto leading-relaxed">
              {codeSnippets[selectedLanguage]}
            </pre>
          </div>

          {/* Interactive API Sandbox */}
          <div className="bg-[#141414] border border-[#222] rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#222] pb-3">
              <div className="flex items-center gap-2 text-white font-mono text-xs font-bold uppercase tracking-wider">
                <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                <span>Interactive Reseller API Sandbox</span>
              </div>
              <span className="text-xs text-emerald-400 font-mono font-bold">200 OK Gateway Live</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-500 block mb-1">API Action</label>
                <select
                  value={sandboxAction}
                  onChange={(e) => setSandboxAction(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#333] text-white px-3 py-2 rounded-lg text-xs font-mono focus:outline-none"
                >
                  <option value="getservices">getservices</option>
                  <option value="placeorder">placeorder</option>
                  <option value="checkorder">checkorder</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Target IMEI</label>
                <input
                  type="text"
                  value={sandboxImei}
                  onChange={(e) => setSandboxImei(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#333] text-white px-3 py-2 rounded-lg text-xs font-mono focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleRunSandbox}
              disabled={sandboxLoading}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-all uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {sandboxLoading ? (
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
              ) : (
                <Play className="w-3.5 h-3.5 fill-white" />
              )}
              <span>Execute API Call</span>
            </button>

            {sandboxResponse && (
              <div className="space-y-1 pt-2">
                <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">Response JSON Body</span>
                <pre className="bg-[#0a0a0a] p-4 rounded-lg border border-[#222] font-mono text-xs text-emerald-400 overflow-x-auto">
                  {sandboxResponse}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
