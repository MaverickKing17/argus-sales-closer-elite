import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Zap, 
  Map as MapIcon, 
  Users, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  ChevronRight, 
  Activity, 
  Clock, 
  CheckCircle2, 
  Lock, 
  Globe, 
  Info,
  ExternalLink,
  ShieldAlert,
  MessageSquare,
  Send,
  X,
  Bot,
  User,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { cn, MOCK_LEADS, type Lead } from './utils';

// --- AI Chat Agent Component ---

const AIChatAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: "Greetings. I am the Argus Intelligence Core. How can I assist with your GCI protection strategy today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMessage,
        config: {
          systemInstruction: "You are the Argus Intelligence Core, a professional AI assistant for elite Canadian real estate professionals. Your tone is sophisticated, precise, and authoritative. You specialize in GCI protection, lead qualification, and Canadian real estate compliance (CASL, PIPEDA). Use industry terminology like 'GCI', 'Enclaves', 'Handshake Verified'. Keep responses concise and high-value.",
        }
      });

      const aiText = response.text || "I apologize, my neural link is temporarily disrupted. Please re-initialize your query.";
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: "Protocol error detected. Please check your secure connection." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-argus-accent text-argus-bg rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform group"
        aria-label="Open AI Intelligence Core"
      >
        <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-argus-success rounded-full border-2 border-argus-bg animate-pulse" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-8 z-50 w-96 h-[500px] glass-card flex flex-col overflow-hidden shadow-[0_0_50px_rgba(197,160,89,0.1)]"
          >
            {/* Chat Header */}
            <div className="p-4 border-b border-argus-border flex items-center justify-between bg-argus-accent/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-argus-accent flex items-center justify-center text-argus-bg">
                  <Bot size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest">Argus Intel Core</div>
                  <div className="text-[8px] mono-label text-argus-success">Secure Uplink Active</div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-argus-muted hover:text-argus-ink transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Chat Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
              {messages.map((msg, i) => (
                <div key={i} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "")}>
                  <div className={cn(
                    "w-6 h-6 rounded flex items-center justify-center shrink-0",
                    msg.role === 'ai' ? "bg-argus-accent/20 text-argus-accent" : "bg-argus-muted/20 text-argus-muted"
                  )}>
                    {msg.role === 'ai' ? <Bot size={12} /> : <User size={12} />}
                  </div>
                  <div className={cn(
                    "text-[11px] leading-relaxed p-3 rounded-xl max-w-[80%]",
                    msg.role === 'ai' ? "bg-white/5 text-argus-ink font-serif italic" : "bg-argus-accent text-argus-bg font-bold"
                  )}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded bg-argus-accent/20 text-argus-accent flex items-center justify-center animate-pulse">
                    <Bot size={12} />
                  </div>
                  <div className="flex gap-1 items-center p-3">
                    <span className="w-1 h-1 bg-argus-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 h-1 bg-argus-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-1 bg-argus-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-argus-border bg-argus-bg/50">
              <div className="relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Inquire about GCI protocols..."
                  className="w-full input-dark pr-10"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-argus-accent hover:scale-110 disabled:opacity-30 transition-all"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// --- SEO & Accessibility Components ---
const SEO = () => (
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Argus Sales Closer",
      "operatingSystem": "Web",
      "applicationCategory": "Real Estate SaaS",
      "description": "Elite AI-driven GCI protection suite for Canadian real estate professionals.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "CAD"
      }
    })}
  </script>
);

// --- UI Components ---

const SidebarItem = ({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex flex-col items-center gap-1 py-4 w-full transition-all duration-300 group relative",
      active ? "text-argus-accent" : "text-argus-muted hover:text-argus-ink"
    )}
    aria-label={label}
  >
    <Icon size={20} strokeWidth={active ? 2.5 : 2} />
    <span className="text-[9px] font-bold uppercase tracking-widest">{label}</span>
    {active && (
      <motion.div 
        layoutId="sidebar-active"
        className="absolute left-0 w-1 h-8 bg-argus-accent rounded-r-full"
      />
    )}
  </button>
);

const StatCard = ({ label, value, subValue, icon: Icon, trend, onClick }: { label: string, value: string, subValue: string, icon: any, trend?: string, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={cn(
      "glass-card p-6 flex-1 min-w-[240px] transition-all duration-300",
      onClick && "cursor-pointer hover:bg-white/5 hover:scale-[1.02] active:scale-[0.98]"
    )}
  >
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-white/5 rounded-lg">
        <Icon size={18} className="text-argus-accent" />
      </div>
      {trend && (
        <span className="text-[10px] font-mono text-argus-accent font-bold">{trend}</span>
      )}
    </div>
    <div className="mono-label mb-1">{label}</div>
    <div className="text-2xl font-serif font-medium tracking-tight mb-1 text-argus-ink">{value}</div>
    <div className="text-[10px] font-mono opacity-40 uppercase tracking-tighter">{subValue}</div>
  </div>
);

const CookieBanner = ({ onOpenSettings }: { onOpenSettings: () => void }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('argus-cookie-consent');
    if (!consent) setShow(true);
  }, []);

  const accept = () => {
    localStorage.setItem('argus-cookie-consent', 'true');
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4"
        >
          <div className="bg-argus-surface text-argus-ink p-6 rounded-2xl shadow-2xl border border-white/10 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h4 className="font-serif text-lg mb-1">Privacy & Compliance Protocol</h4>
              <p className="text-xs text-argus-muted leading-relaxed">
                Argus uses essential cookies to ensure PIPEDA and GDPR compliance. By continuing, you agree to our 2026 Data Governance standards for Canadian Real Estate.
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={onOpenSettings}
                className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                Settings
              </button>
              <button 
                onClick={accept}
                className="text-[10px] font-bold uppercase tracking-widest px-6 py-2 bg-argus-accent text-argus-bg rounded-lg hover:brightness-110 transition-all"
              >
                Accept All
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- Modal Component ---

const InfoModal = ({ isOpen, onClose, title, content }: { isOpen: boolean, onClose: () => void, title: string, content: React.ReactNode }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-argus-bg/80 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl max-h-[80vh] overflow-hidden glass-card flex flex-col shadow-[0_0_100px_rgba(197,160,89,0.15)]"
        >
          <div className="p-6 border-b border-argus-border flex items-center justify-between bg-argus-accent/5">
            <div>
              <h2 className="text-xl font-serif text-argus-accent">{title}</h2>
              <div className="text-[10px] mono-label">Secure Intelligence Node</div>
            </div>
            <button onClick={onClose} className="p-2 text-argus-muted hover:text-argus-ink transition-colors rounded-lg hover:bg-white/5">
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-8 space-y-6 text-sm leading-relaxed text-argus-ink/90 font-sans">
            {content}
          </div>
          <div className="p-4 border-t border-argus-border bg-argus-bg/50 flex justify-end">
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-argus-accent text-argus-bg text-[10px] font-bold uppercase tracking-widest rounded-lg hover:brightness-110 transition-all"
            >
              Acknowledge & Close
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default function App() {
  const [selectedLead, setSelectedLead] = useState<Lead>(MOCK_LEADS[0]);
  const [modalData, setModalData] = useState<{ isOpen: boolean, title: string, content: React.ReactNode }>({
    isOpen: false,
    title: '',
    content: null
  });

  const openModal = (title: string, content: React.ReactNode) => {
    setModalData({ isOpen: true, title, content });
  };

  const closeModal = () => setModalData(prev => ({ ...prev, isOpen: false }));

  const MODAL_CONTENT = {
    privacy: (
      <div className="space-y-4">
        <p className="font-bold text-argus-accent">Argus Privacy Accord v2026.1</p>
        <p>Our commitment to data sovereignty for Toronto's elite real estate professionals is absolute. All lead data intercepted via the Argus Sales Closer is subject to triple-layer encryption (AES-256) before entering the secure vault.</p>
        <h3 className="text-argus-accent font-bold uppercase text-xs tracking-widest mt-6">PIPEDA Compliance</h3>
        <p>We strictly adhere to the Personal Information Protection and Electronic Documents Act (PIPEDA). All client data remains within Canadian sovereign data centers, ensuring that sensitive financial disclosures and GCI projections are never exposed to foreign jurisdiction.</p>
        <h3 className="text-argus-accent font-bold uppercase text-xs tracking-widest mt-6">Data Handshake Protocol</h3>
        <p>Every interaction is logged with a unique cryptographic signature. We do not sell lead data. We protect it. Your Yorkville, Bridle Path, and Forest Hill client lists are your most valuable assets; Argus ensures they stay that way.</p>
      </div>
    ),
    terms: (
      <div className="space-y-4">
        <p className="font-bold text-argus-accent">Terms of Engagement & GCI Protection</p>
        <p>By utilizing the Argus Sales Closer, you enter into a tactical partnership designed to eliminate lead leakage. Our service level agreement (SLA) guarantees 99.99% uptime for the AI Intercept Node.</p>
        <h3 className="text-argus-accent font-bold uppercase text-xs tracking-widest mt-6">CASL Compliance Mandate</h3>
        <p>Users are required to maintain strict adherence to the Canadian Anti-Spam Legislation (CASL). Argus provides the tools for 'Handshake Verification,' but the final authority on client communication rests with the licensed professional.</p>
        <h3 className="text-argus-accent font-bold uppercase text-xs tracking-widest mt-6">Territory Exclusivity</h3>
        <p>Authorization for specific Toronto enclaves (e.g., Rosedale, The Annex) is granted on a per-license basis. Unauthorized interception outside of assigned territory is a breach of the Engagement Accord.</p>
      </div>
    ),
    cookies: (
      <div className="space-y-4">
        <p className="font-bold text-argus-accent">Cookie Mandate & Tracking Protocols</p>
        <p>Argus utilizes high-fidelity session cookies to maintain the integrity of the Lead Intelligence Core. These are not standard marketing trackers; they are functional nodes required for real-time sentiment analysis.</p>
        <h3 className="text-argus-accent font-bold uppercase text-xs tracking-widest mt-6">Lead Interception Cookies</h3>
        <p>Our proprietary 'Handshake Cookie' tracks the origin of missed calls and website inquiries to ensure that GCI is correctly attributed to your team. This data is purged every 90 days unless converted to a 'Vault Asset'.</p>
      </div>
    ),
    dmca: (
      <div className="space-y-4">
        <p className="font-bold text-argus-accent">DMCA & Intellectual Property Compliance</p>
        <p>Argus respects the creative assets of the Toronto real estate community. This includes architectural photography, drone cinematography, and proprietary listing descriptions used in our AI training models.</p>
        <h3 className="text-argus-accent font-bold uppercase text-xs tracking-widest mt-6">Listing Integrity</h3>
        <p>If you believe your proprietary marketing materials are being utilized by an Argus node without authorization, please submit a formal 'Node Disruption Request' to our compliance department.</p>
      </div>
    ),
    antispam: (
      <div className="space-y-4">
        <p className="font-bold text-argus-accent">Anti-SPAM Policy (CASL) - Handshake Protocol</p>
        <p>In the high-stakes Toronto market, reputation is everything. Argus is built to prevent 'Spam-Induced Reputation Decay'. Our AI never sends unsolicited bulk communications.</p>
        <h3 className="text-argus-accent font-bold uppercase text-xs tracking-widest mt-6">Handshake Verification</h3>
        <p>Every outbound message from the Argus node requires a 'Handshake Event'—a documented inquiry or missed call from the lead. This ensures 100% CASL compliance and maintains the prestige of your brand.</p>
      </div>
    ),
    gci_dashboard: (
      <div className="space-y-4">
        <p className="font-bold text-argus-accent">GCI Protection Dashboard v4.2</p>
        <p>The GCI Dashboard provides a real-time visualization of commission assets currently under AI oversight. It calculates projected revenue based on Toronto Real Estate Board (TRREB) historical averages for specific enclaves.</p>
        <h3 className="text-argus-accent font-bold uppercase text-xs tracking-widest mt-6">Leakage Prevention</h3>
        <p>Our algorithm identifies 'At-Risk GCI'—leads that have not been contacted within the 10-minute golden window. By intercepting these calls, Argus has historically recovered over $1.4M in annual commission for top-tier teams.</p>
      </div>
    ),
    mctb: (
      <div className="space-y-4">
        <p className="font-bold text-argus-accent">MCTB Efficiency Lab (Missed Call Text Back)</p>
        <p>The MCTB Lab is where we refine the 'Instant Handshake' protocol. When a high-value lead calls and you're in a showing, Argus immediately initiates a sophisticated, AI-driven text conversation.</p>
        <h3 className="text-argus-accent font-bold uppercase text-xs tracking-widest mt-6">Sentiment Analysis</h3>
        <p>We don't just send a text; we analyze the response. If the lead mentions 'Yorkville' or 'Listing Price', the AI escalates the priority and attempts to book a viewing immediately, securing the lead before they call a competitor.</p>
      </div>
    ),
    fub_sync: (
      <div className="space-y-4">
        <p className="font-bold text-argus-accent">FUB Elite Sync - Follow Up Boss Integration</p>
        <p>Argus acts as a high-performance layer on top of Follow Up Boss. Our 'Elite Sync' ensures that every intercepted lead is pushed to FUB with full sentiment notes and asset class tags.</p>
        <h3 className="text-argus-accent font-bold uppercase text-xs tracking-widest mt-6">Automated Action Plans</h3>
        <p>Once synced, Argus can trigger specific FUB Action Plans based on the AI's qualification score. A 'HOT' lead from the Bridle Path gets a different tactical response than a 'NEUTRAL' condo inquiry.</p>
      </div>
    ),
    api: (
      <div className="space-y-4">
        <p className="font-bold text-argus-accent">Secure API Documentation & Node Access</p>
        <p>For teams with custom tech stacks, Argus offers a secure REST API. Access is restricted to 'Authorized Nodes' only, requiring OAuth2 authentication and IP whitelisting.</p>
        <h3 className="text-argus-accent font-bold uppercase text-xs tracking-widest mt-6">Webhooks & Real-time Events</h3>
        <p>Subscribe to `lead.intercepted`, `sentiment.escalated`, and `handshake.verified` events to build custom automation workflows that respond at the speed of AI.</p>
      </div>
    ),
    audit: (
      <div className="space-y-4">
        <p className="font-bold text-argus-accent">Security Audit 2026 - SOC2 Type II Status</p>
        <p>Argus undergoes quarterly independent security audits to ensure the safety of your GCI data. We are currently SOC2 Type II compliant and maintain a 'Zero Trust' architecture.</p>
        <h3 className="text-argus-accent font-bold uppercase text-xs tracking-widest mt-6">Encryption Standards</h3>
        <p>Data at rest is encrypted using AES-256-GCM. Data in transit is secured via TLS 1.3. Our infrastructure is hosted on dedicated, high-security Canadian server clusters with physical biometric access controls.</p>
      </div>
    ),
    pulse: (
      <div className="space-y-4">
        <p className="font-bold text-argus-accent">Pulse: Real-time Interaction Matrix</p>
        <p>The Pulse view is your mission control. It displays every live encounter across your territory. Use this to monitor the AI's performance as it qualifies leads in real-time.</p>
        <p>Current system health: <span className="text-argus-success">OPTIMAL</span>. All nodes reporting 100% efficiency in the Yorkville and Forest Hill sectors.</p>
      </div>
    ),
    vault: (
      <div className="space-y-4">
        <p className="font-bold text-argus-accent">Vault: Secured Asset Archive</p>
        <p>The Vault stores every 'Handshake Verified' lead. These are high-value assets that have been fully qualified by the Argus Intelligence Core. Access is restricted to Principal Partners.</p>
        <p>Total Assets Secured: <span className="text-argus-accent font-bold">1,284 Leads</span>. Estimated GCI Value: <span className="text-argus-accent font-bold">$14.2M</span>.</p>
      </div>
    ),
    gci_view: (
      <div className="space-y-4">
        <p className="font-bold text-argus-accent">GCI: Commission Protection Analytics</p>
        <p>Analyze your GCI recovery trends. See exactly how much revenue Argus has saved your team by intercepting missed opportunities. Our analytics show a 22% increase in conversion for teams using the 2026 Protocol.</p>
      </div>
    ),
    admin: (
      <div className="space-y-4">
        <p className="font-bold text-argus-accent">Admin: System Configuration & Node Authorization</p>
        <p>Configure your AI's personality, set territory boundaries, and manage team access. Here you can also update your CASL handshake templates and MCTB escalation triggers.</p>
      </div>
    ),
    logout: (
      <div className="space-y-4">
        <p className="font-bold text-argus-accent">Secure Session Termination</p>
        <p>You are about to terminate your secure uplink with the Argus Intelligence Core. All active interceptions will continue under autonomous AI oversight.</p>
        <p className="text-xs text-argus-muted italic">Note: In a production environment, this would redirect to the login portal.</p>
      </div>
    ),
    notifications: (
      <div className="space-y-4">
        <p className="font-bold text-argus-accent">Notifications Center</p>
        <div className="space-y-3">
          <div className="p-3 bg-white/5 rounded-lg border-l-2 border-argus-accent">
            <div className="text-[10px] font-bold uppercase">High Intent Detected</div>
            <p className="text-xs">Lead "Sarah Jenkins" mentioned 'Yorkville Penthouse' in MCTB session.</p>
          </div>
          <div className="p-3 bg-white/5 rounded-lg border-l-2 border-argus-success">
            <div className="text-[10px] font-bold uppercase">Handshake Verified</div>
            <p className="text-xs">CASL compliance confirmed for lead "Michael Chen".</p>
          </div>
          <div className="p-3 bg-white/5 rounded-lg border-l-2 border-argus-warning">
            <div className="text-[10px] font-bold uppercase">System Update</div>
            <p className="text-xs">Argus Protocol v4.2.1 deployment scheduled for 02:00 AM.</p>
          </div>
        </div>
      </div>
    ),
    archive: (
      <div className="space-y-4">
        <p className="font-bold text-argus-accent">Lead Intelligence Archive</p>
        <p>Accessing the full historical matrix of all intercepted leads across the Toronto territory. This view includes archived sentiment trends and multi-year GCI recovery data.</p>
        <div className="p-4 bg-white/5 rounded-xl border border-dashed border-white/20 text-center">
          <p className="text-xs text-argus-muted italic">Full archive decryption in progress... (Demo Mode)</p>
        </div>
      </div>
    ),
    mapping: (
      <div className="space-y-4">
        <p className="font-bold text-argus-accent">Initialize Mapping Protocol</p>
        <p>Deploying real-time geospatial visualization of active lead clusters. This protocol identifies 'Hot Zones' where missed call frequency is highest, allowing for tactical team deployment.</p>
        <div className="aspect-video bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
          <MapIcon size={48} className="text-argus-accent opacity-20 animate-pulse" />
        </div>
      </div>
    ),
    expansion: (
      <div className="space-y-4">
        <p className="font-bold text-argus-accent">Territory Expansion Request</p>
        <p>Requesting authorization for additional Toronto enclaves. Current license covers Yorkville, Bridle Path, and Forest Hill. Expansion into Oakville or King City requires Principal Partner approval.</p>
      </div>
    ),
    casl_valid: (
      <div className="space-y-4">
        <p className="font-bold text-argus-accent">CASL Handshake Verification</p>
        <p>This lead has successfully completed the 'Double Opt-In' protocol. You are legally authorized under Canadian Anti-Spam Legislation to initiate direct commercial electronic messages.</p>
        <div className="flex items-center gap-2 text-argus-success text-xs font-bold">
          <ShieldCheck size={16} /> VERIFIED BY ARGUS COMPLIANCE ENGINE
        </div>
      </div>
    ),
    init_link: (
      <div className="space-y-4">
        <p className="font-bold text-argus-accent">Initialize Tactical Link</p>
        <p>Establishing a high-priority communication channel with the lead. This will trigger a personalized, enclave-specific briefing to be sent via the Argus node.</p>
        <button className="w-full py-3 bg-argus-accent text-argus-bg font-bold uppercase text-[10px] rounded-lg">Confirm Link Initiation</button>
      </div>
    ),
    transfer: (
      <div className="space-y-4">
        <p className="font-bold text-argus-accent">Asset Transfer Protocol</p>
        <p>Transferring lead intelligence and historical interaction data to an external node or team member. This action is logged for audit purposes.</p>
      </div>
    ),
    enclave_yorkville: (
      <div className="space-y-4">
        <p className="font-bold text-argus-accent">Yorkville Mastery Enclave</p>
        <p>Monitoring the core of Toronto's luxury market. Yorkville represents the highest concentration of high-net-worth individuals and premium retail assets in Canada.</p>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-white/5 rounded-lg">
            <div className="text-[10px] mono-label">Avg Sale</div>
            <div className="text-lg font-serif">$4.2M</div>
          </div>
          <div className="p-3 bg-white/5 rounded-lg">
            <div className="text-[10px] mono-label">Demand</div>
            <div className="text-lg font-serif text-argus-success">EXCEPTIONAL</div>
          </div>
        </div>
      </div>
    ),
    enclave_bridle: (
      <div className="space-y-4">
        <p className="font-bold text-argus-accent">The Bridle Path Enclave</p>
        <p>Exclusive oversight of Canada's most prestigious residential street. Argus monitors estate-level inquiries and international buyer sentiment for this specific district.</p>
      </div>
    ),
    enclave_forest: (
      <div className="space-y-4">
        <p className="font-bold text-argus-accent">Forest Hill South Enclave</p>
        <p>Strategic monitoring of multi-generational wealth assets. Forest Hill South remains a primary target for domestic consolidation and family estate planning.</p>
      </div>
    ),
    enclave_rosedale: (
      <div className="space-y-4">
        <p className="font-bold text-argus-accent">Rosedale Valley Enclave</p>
        <p>Monitoring the historic heart of Toronto's old-money enclaves. Rosedale inquiries often display the highest degree of discretion and require 'Silent Handshake' protocols.</p>
      </div>
    ),
    enclave_annex: (
      <div className="space-y-4">
        <p className="font-bold text-argus-accent">The Annex Collection</p>
        <p>Oversight of architectural heritage assets and high-density luxury developments near the University of Toronto corridor.</p>
      </div>
    ),
    search: (
      <div className="space-y-4">
        <p className="font-bold text-argus-accent">Search Protocol Initialized</p>
        <p>Argus is scanning the Lead Intelligence Core, Secure Vault, and Territory Matrix for your query.</p>
        <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
          <Activity size={20} className="text-argus-accent animate-spin" />
          <span className="text-xs italic">Scanning encrypted nodes...</span>
        </div>
      </div>
    )
  };

  return (
    <div className="flex min-h-screen bg-argus-bg text-argus-ink selection:bg-argus-accent selection:text-argus-bg">
      <SEO />
      
      {/* Sidebar */}
      <aside className="w-20 border-r border-argus-border flex flex-col items-center py-6 sticky top-0 h-screen bg-argus-surface/50 backdrop-blur-sm z-40">
        <div className="w-10 h-10 bg-argus-accent rounded-xl flex items-center justify-center text-argus-bg mb-12 shadow-lg shadow-argus-accent/20">
          <ShieldCheck size={24} />
        </div>
        
        <nav className="flex-1 w-full space-y-2">
          <SidebarItem icon={Activity} label="Pulse" active onClick={() => openModal("Pulse Intelligence", MODAL_CONTENT.pulse)} />
          <SidebarItem icon={Zap} label="Vault" onClick={() => openModal("Secure Vault", MODAL_CONTENT.vault)} />
          <SidebarItem icon={Users} label="GCI" onClick={() => openModal("GCI Analytics", MODAL_CONTENT.gci_view)} />
          <SidebarItem icon={Settings} label="Admin" onClick={() => openModal("System Admin", MODAL_CONTENT.admin)} />
        </nav>

        <button 
          onClick={() => openModal("Secure Logout", MODAL_CONTENT.logout)}
          className="mt-auto text-argus-muted hover:text-argus-ink transition-colors p-4" 
          aria-label="Logout"
        >
          <LogOut size={20} />
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 border-b border-argus-border flex items-center justify-between px-8 bg-argus-surface/30 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h1 className="text-sm font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                Argus <span className="text-argus-accent">Sales Closer</span>
              </h1>
              <div className="flex items-center gap-2 text-[9px] font-mono text-argus-muted">
                <span className="w-1.5 h-1.5 bg-argus-success rounded-full animate-pulse" />
                LIVE AI OVERSIGHT | 2026 PROTOCOL ACTIVE
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="relative group hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-argus-muted group-focus-within:text-argus-accent transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search leads, GCI, or territory..."
                onKeyDown={(e) => e.key === 'Enter' && openModal("Search Intelligence", MODAL_CONTENT.search)}
                className="bg-white/5 border border-white/5 rounded-full py-2 pl-10 pr-4 text-xs w-64 focus:ring-2 focus:ring-argus-accent/20 transition-all outline-none"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => openModal("Notifications", MODAL_CONTENT.notifications)}
                className="relative p-2 text-argus-muted hover:text-argus-ink transition-colors" 
                aria-label="Notifications"
              >
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-argus-warning rounded-full border-2 border-argus-bg" />
              </button>
              
              <div className="flex items-center gap-3 pl-4 border-l border-argus-border">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold">Barry Cohen Group</div>
                  <div className="text-[10px] mono-label">Principal Partner</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden border-2 border-argus-border shadow-sm">
                  <img src="https://picsum.photos/seed/agent/100/100" alt="Profile" referrerPolicy="no-referrer" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8 max-w-[1600px] mx-auto w-full">
          {/* Stats Row */}
          <div className="flex flex-wrap gap-6">
            <StatCard 
              label="GCI Protected" 
              value="$1,424,501+" 
              subValue="Gross Commission Income" 
              icon={ShieldCheck} 
              trend="+12% VS LY" 
              onClick={() => openModal("GCI Protection Analytics", MODAL_CONTENT.gci_view)}
            />
            <StatCard 
              label="Live Encounters" 
              value="57" 
              subValue="AI-Handled Conversations" 
              icon={Activity} 
              onClick={() => openModal("Pulse Intelligence", MODAL_CONTENT.pulse)}
            />
            <StatCard 
              label="Response Latency" 
              value="6.3s" 
              subValue="Under 10s Benchmark" 
              icon={Clock} 
              trend="INSTANT" 
              onClick={() => openModal("MCTB Efficiency Lab", MODAL_CONTENT.mctb)}
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8">
            <div className="space-y-8">
              {/* Lead Intelligence Core */}
              <section className="glass-card overflow-hidden">
                <div className="p-6 border-b border-argus-border flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-serif">Lead Intelligence Core</h2>
                    <div className="mono-label">Real-time Interaction Matrix</div>
                  </div>
                  <button 
                    onClick={() => openModal("Lead Archive", MODAL_CONTENT.archive)}
                    className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 hover:text-argus-accent transition-colors"
                  >
                    View Full Archive <ChevronRight size={14} />
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <div className="min-w-[700px]">
                    <div className="grid grid-cols-[1fr_1fr_1fr_2fr_1fr] p-4 bg-white/[0.02] mono-label">
                      <div>Identity</div>
                      <div>Asset Class</div>
                      <div>Sentiment</div>
                      <div>Intercepted Message</div>
                      <div>Temporal</div>
                    </div>
                    {MOCK_LEADS.map((lead) => (
                      <div 
                        key={lead.id} 
                        onClick={() => setSelectedLead(lead)}
                        className={cn(
                          "data-grid-row",
                          selectedLead.id === lead.id && "bg-white/5 shadow-sm border-l-4 border-l-argus-accent"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-bold">
                            {lead.initials}
                          </div>
                          <span className="text-xs font-bold">{lead.name}</span>
                        </div>
                        <div className="text-xs text-argus-muted">{lead.assetClass}</div>
                        <div>
                          <span className={cn(
                            "status-pill",
                            lead.sentiment === 'HOT' && "bg-orange-500/10 text-orange-400",
                            lead.sentiment === 'WARM' && "bg-yellow-500/10 text-yellow-400",
                            lead.sentiment === 'NEUTRAL' && "bg-blue-500/10 text-blue-400",
                            lead.sentiment === 'COLD' && "bg-zinc-500/10 text-zinc-400",
                          )}>
                            {lead.sentiment}
                          </span>
                        </div>
                        <div className="text-xs italic font-serif text-argus-ink/80">{lead.message}</div>
                        <div className="text-[10px] font-mono text-argus-muted">{lead.temporal}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Territory Mastery */}
              <section className="glass-card p-8">
                <div className="flex items-start gap-4 mb-8">
                  <div className="p-3 bg-argus-accent/10 text-argus-accent rounded-xl">
                    <MapIcon size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif">Toronto Enclave Mastery</h2>
                    <div className="mono-label text-argus-accent">District Authorization: Active</div>
                  </div>
                </div>
                
                <p className="text-sm text-argus-muted leading-relaxed max-w-2xl mb-8">
                  ARGUS is currently monitoring missed-call interceptions across the <span className="text-argus-ink font-bold">Golden Triangle</span> of Toronto real estate. Exclusive response rights for your team are locked until Dec 2026.
                </p>

                <div className="bg-white/[0.03] border border-argus-border rounded-xl p-6 mb-8 relative overflow-hidden">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-argus-accent rounded-full" />
                    <span className="mono-label">Market Briefing: Yorkville Core</span>
                  </div>
                  <p className="text-sm italic font-serif text-argus-ink/80 leading-relaxed">
                    "In the Yorkville/Forest Hill enclave, we are observing a significant consolidation of luxury assets. High-net-worth sentiment remains bullish with a distinct preference for turn-key detached estates and full-floor penthouses. Supply scarcity in the Yorkville core is currently driving a 4.2% month-over-month increase in price-per-square-foot benchmarks."
                  </p>
                  <div className="absolute -right-12 -bottom-12 opacity-5">
                    <MapIcon size={200} />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => openModal("Mapping Protocol", MODAL_CONTENT.mapping)}
                    className="bg-argus-accent text-argus-bg text-[10px] font-bold uppercase tracking-widest px-6 py-3 rounded-lg hover:brightness-110 transition-all"
                  >
                    Initialize Mapping
                  </button>
                  <button 
                    onClick={() => openModal("Territory Expansion", MODAL_CONTENT.expansion)}
                    className="border border-white/10 text-[10px] font-bold uppercase tracking-widest px-6 py-3 rounded-lg hover:bg-white/5 transition-all"
                  >
                    Territory Expansion
                  </button>
                </div>
              </section>
            </div>

            {/* Right Sidebar: Elite Profile */}
            <aside className="space-y-8">
              <section className="glass-card p-8">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-xl font-serif">Elite Profile</h2>
                    <div className="mono-label text-argus-accent">{selectedLead.name}</div>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-white/5 overflow-hidden border-4 border-argus-surface shadow-md">
                    <img src={`https://picsum.photos/seed/${selectedLead.id}/100/100`} alt="Lead" referrerPolicy="no-referrer" />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="mono-label mb-3">Asset Parameters</div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-argus-muted">Phone</span>
                        <span className="text-xs font-bold">+1 (416) 555-0192</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-argus-muted">Email</span>
                        <span className="text-xs font-bold">{selectedLead.name.toLowerCase().replace(' ', '.')}@luxury-v.com</span>
                      </div>
                    </div>
                  </div>

                  <div className="py-8 flex flex-col items-center justify-center border-y border-argus-border">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90">
                        <circle cx="64" cy="64" r="58" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/5" />
                        <circle cx="64" cy="64" r="58" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="364" strokeDashoffset="44" className="text-argus-accent" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-serif">88%</span>
                        <span className="text-[8px] mono-label">Qualified</span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-[9px] font-bold text-argus-success uppercase tracking-widest">
                      <ShieldCheck size={12} /> Verified Integrity
                    </div>
                  </div>

                  <div className="bg-white/[0.02] p-4 rounded-xl border border-argus-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap size={14} className="text-argus-accent" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Tactical Intelligence</span>
                    </div>
                    <p className="text-[11px] italic font-serif text-argus-ink/70 leading-relaxed mb-4">
                      "Lead displays high intent based on tactical historical pattern recognition. Handshake verified."
                    </p>
                    <div className="flex items-center gap-2 text-[9px] text-argus-muted">
                      <Info size={10} /> RECOMMENDATION: INITIALIZE HIGH-PRIORITY LINK
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button 
                      onClick={() => openModal("CASL Verification", MODAL_CONTENT.casl_valid)}
                      className="w-full bg-argus-success text-argus-bg text-[10px] font-bold uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 hover:brightness-110 transition-all"
                    >
                      <Zap size={14} /> CASL Handshake Valid
                    </button>
                    <button 
                      onClick={() => openModal("Link Initiation", MODAL_CONTENT.init_link)}
                      className="w-full bg-argus-accent text-argus-bg text-[10px] font-bold uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 hover:brightness-110 transition-all"
                    >
                      <Activity size={14} /> Initialize Link
                    </button>
                    <button 
                      onClick={() => openModal("Asset Transfer", MODAL_CONTENT.transfer)}
                      className="w-full border border-white/10 text-[10px] font-bold uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white/5 transition-all"
                    >
                      Transfer Assets
                    </button>
                  </div>
                </div>
              </section>

              <div className="glass-card p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-lg">
                      <ShieldCheck size={16} className="text-argus-muted" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest">Sync Protocol</div>
                      <div className="text-[9px] text-argus-muted">SECURED IN VAULT</div>
                    </div>
                  </div>
                  <div className="w-10 h-5 bg-argus-success/20 rounded-full relative">
                    <div className="absolute right-1 top-1 w-3 h-3 bg-argus-success rounded-full" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-lg">
                      <Lock size={16} className="text-argus-muted" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest">End-to-End Encryption</div>
                      <div className="text-[9px] text-argus-muted">FUB SECURE NODE ACTIVE</div>
                    </div>
                  </div>
                  <div className="w-10 h-5 bg-argus-success/20 rounded-full relative">
                    <div className="absolute right-1 top-1 w-3 h-3 bg-argus-success rounded-full" />
                  </div>
                </div>
                <div className="pt-4 border-t border-argus-border flex justify-between items-center text-[8px] mono-label">
                  <span>PROTOCOL: TLS 1.3 / AES-256</span>
                  <span>11:07:31 AM</span>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-auto border-t border-argus-border bg-argus-surface/50 p-12">
          <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-argus-accent" size={24} />
                <h3 className="text-sm font-bold uppercase tracking-widest">Argus <span className="text-argus-accent">Sales Closer</span></h3>
              </div>
              <p className="text-xs text-argus-ink leading-relaxed max-w-xs">
                The premier AI-driven GCI (Gross Commission Income) protection suite for elite Toronto real estate professionals. ARGUS intercepts, qualifies, and converts missed opportunities into multi-million dollar closings.
              </p>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-white/5 rounded text-[8px] font-mono text-argus-ink">SECURE PROTOCOL V4.2</span>
              </div>
            </div>

            <div>
              <h4 className="mono-label mb-6 text-argus-ink">Enclaves</h4>
              <ul className="space-y-3 text-[11px] font-medium text-argus-ink">
                <li onClick={() => openModal("Yorkville Mastery", MODAL_CONTENT.enclave_yorkville)} className="hover:text-argus-accent cursor-pointer transition-colors">Yorkville Mastery</li>
                <li onClick={() => openModal("The Bridle Path", MODAL_CONTENT.enclave_bridle)} className="hover:text-argus-accent cursor-pointer transition-colors">The Bridle Path</li>
                <li onClick={() => openModal("Forest Hill South", MODAL_CONTENT.enclave_forest)} className="hover:text-argus-accent cursor-pointer transition-colors">Forest Hill South</li>
                <li onClick={() => openModal("Rosedale Valley", MODAL_CONTENT.enclave_rosedale)} className="hover:text-argus-accent cursor-pointer transition-colors">Rosedale Valley</li>
                <li onClick={() => openModal("The Annex Collection", MODAL_CONTENT.enclave_annex)} className="hover:text-argus-accent cursor-pointer transition-colors">The Annex Collection</li>
              </ul>
            </div>

            <div>
              <h4 className="mono-label mb-6 text-argus-ink">Governance</h4>
              <ul className="space-y-3 text-[11px] font-medium text-argus-ink">
                <li onClick={() => openModal("Privacy Accord", MODAL_CONTENT.privacy)} className="hover:text-argus-accent cursor-pointer transition-colors">Privacy Accord</li>
                <li onClick={() => openModal("Terms of Engagement", MODAL_CONTENT.terms)} className="hover:text-argus-accent cursor-pointer transition-colors">Terms of Engagement</li>
                <li onClick={() => openModal("Cookie Mandate", MODAL_CONTENT.cookies)} className="hover:text-argus-accent cursor-pointer transition-colors">Cookie Mandate</li>
                <li onClick={() => openModal("DMCA Compliance", MODAL_CONTENT.dmca)} className="hover:text-argus-accent cursor-pointer transition-colors">DMCA Compliance</li>
                <li onClick={() => openModal("Anti-SPAM Policy", MODAL_CONTENT.antispam)} className="hover:text-argus-accent cursor-pointer transition-colors">Anti-SPAM Policy (CASL)</li>
              </ul>
            </div>

            <div>
              <h4 className="mono-label mb-6 text-argus-ink">Ecosystem</h4>
              <ul className="space-y-3 text-[11px] font-medium text-argus-ink">
                <li onClick={() => openModal("GCI Dashboard", MODAL_CONTENT.gci_dashboard)} className="hover:text-argus-accent cursor-pointer transition-colors">GCI Protection Dashboard</li>
                <li onClick={() => openModal("MCTB Efficiency Lab", MODAL_CONTENT.mctb)} className="hover:text-argus-accent cursor-pointer transition-colors">MCTB Efficiency Lab</li>
                <li onClick={() => openModal("FUB Elite Sync", MODAL_CONTENT.fub_sync)} className="hover:text-argus-accent cursor-pointer transition-colors">FUB Elite Sync</li>
                <li onClick={() => openModal("API Documentation", MODAL_CONTENT.api)} className="hover:text-argus-accent cursor-pointer transition-colors">API Documentation</li>
                <li onClick={() => openModal("Security Audit", MODAL_CONTENT.audit)} className="hover:text-argus-accent cursor-pointer transition-colors">Security Audit 2026</li>
              </ul>
            </div>
          </div>

          <div className="max-w-[1600px] mx-auto mt-12 pt-8 border-t border-argus-border flex flex-wrap justify-between items-center gap-6 text-argus-ink">
            <div className="text-[12px] mono-label !text-argus-ink">© 2026 ARGUS ELITE. ALL RIGHTS RESERVED.</div>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 text-[12px] mono-label !text-argus-ink">
                <div className="w-1.5 h-1.5 bg-argus-success rounded-full" /> PCI-DSS LEVEL 1 COMPLIANT
              </div>
              <div className="flex items-center gap-2 text-[12px] mono-label !text-argus-ink">
                <div className="w-1.5 h-1.5 bg-argus-success rounded-full" /> SYSTEMS OPERATIONAL
              </div>
            </div>
            <div className="text-[12px] mono-label !text-argus-ink">DESIGNED FOR THE TOP 1% OF REAL ESTATE</div>
          </div>
        </footer>
      </main>

      <AIChatAgent />
      <CookieBanner onOpenSettings={() => openModal("Cookie Mandate", MODAL_CONTENT.cookies)} />
      <InfoModal 
        isOpen={modalData.isOpen} 
        onClose={closeModal} 
        title={modalData.title} 
        content={modalData.content} 
      />

      {/* Accessibility: Skip to Content */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-argus-accent focus:text-argus-bg focus:px-4 focus:py-2 focus:rounded-lg">
        Skip to content
      </a>
    </div>
  );
}
