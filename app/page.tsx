"use client";

import React, { useState, useEffect, useRef } from "react";

/* ────────────────────────────────────────────────────────
   TYPES
──────────────────────────────────────────────────────── */
type UserProfile = {
  id: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  type: "client" | "contractor" | "admin";
  service?: string;
  createdAt: string;
};

type Message = {
  id: string;
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  text: string;
  timestamp: string;
};

type ChatConversation = {
  partnerId: string;
  partnerName: string;
  partnerInitial: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
};

type Screen = "landing" | "client" | "contractor" | "admin";

/* ────────────────────────────────────────────────────────
   STORAGE HELPERS
──────────────────────────────────────────────────────── */
const STORAGE_USERS    = "todoclean_users";
const STORAGE_SESSION  = "todoclean_session";
const STORAGE_MESSAGES = "todoclean_messages";

function getUsers(): UserProfile[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_USERS) || "[]"); } catch { return []; }
}
function saveUsers(users: UserProfile[]) {
  localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
}
function getSession(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const s = localStorage.getItem(STORAGE_SESSION);
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}
function saveSession(user: UserProfile) {
  localStorage.setItem(STORAGE_SESSION, JSON.stringify(user));
}
function clearSession() {
  localStorage.removeItem(STORAGE_SESSION);
}
function getAllMessages(): Message[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_MESSAGES) || "[]"); } catch { return []; }
}
function saveAllMessages(msgs: Message[]) {
  localStorage.setItem(STORAGE_MESSAGES, JSON.stringify(msgs));
}
function sendMessage(from: UserProfile, toId: string, toName: string, text: string): Message {
  const msg: Message = {
    id: `m_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    fromId: from.id,
    fromName: from.name,
    toId,
    toName,
    text,
    timestamp: new Date().toISOString(),
  };
  const all = getAllMessages();
  saveAllMessages([...all, msg]);
  return msg;
}
function getThread(userId: string, partnerId: string): Message[] {
  return getAllMessages().filter(
    (m) => (m.fromId === userId && m.toId === partnerId) || (m.fromId === partnerId && m.toId === userId)
  ).sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}
function getConversations(userId: string, contacts: { id: string; name: string }[]): ChatConversation[] {
  const all = getAllMessages();
  return contacts.map((c) => {
    const thread = all
      .filter((m) => (m.fromId === userId && m.toId === c.id) || (m.fromId === c.id && m.toId === userId))
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    const last = thread[0];
    return {
      partnerId: c.id,
      partnerName: c.name,
      partnerInitial: c.name.charAt(0).toUpperCase(),
      lastMessage: last ? last.text : "Toca para iniciar conversación",
      lastTime: last ? fmtTime(last.timestamp) : "",
      unread: 0,
    };
  });
}
function fmtTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString("es", { day: "2-digit", month: "short" });
}

/* ────────────────────────────────────────────────────────
   SEED CHAT DATA (demo messages)
──────────────────────────────────────────────────────── */
const SEED_PRO_IDS = [
  { id: "seed_pro_roberto", name: "Roberto S." },
  { id: "seed_pro_ana",     name: "Ana M."     },
  { id: "seed_pro_luis",    name: "Luis P."    },
];
const SEED_CLIENT_IDS = [
  { id: "seed_client_juan",  name: "Juan C."  },
  { id: "seed_client_sofia", name: "Sofía R." },
];

function seedChatIfEmpty(userId: string, userType: "client" | "contractor") {
  const key = `todoclean_seeded_${userId}`;
  if (typeof window === "undefined" || localStorage.getItem(key)) return;
  const now = new Date();
  const mins = (n: number) => new Date(now.getTime() - n * 60000).toISOString();
  const msgs: Message[] = [];
  if (userType === "client") {
    msgs.push(
      { id: "s1", fromId: "seed_pro_roberto", fromName: "Roberto S.", toId: userId, toName: "", text: "¡Hola! Llegará en 15 minutos para el corte de césped.", timestamp: mins(30) },
      { id: "s2", fromId: userId, fromName: "", toId: "seed_pro_roberto", toName: "Roberto S.", text: "Perfecto, lo espero. El portón está abierto.", timestamp: mins(25) },
      { id: "s3", fromId: "seed_pro_roberto", fromName: "Roberto S.", toId: userId, toName: "", text: "Excelente, ahí estaré.", timestamp: mins(20) },
      { id: "s4", fromId: "seed_pro_ana", fromName: "Ana M.", toId: userId, toName: "", text: "Confirmada la limpieza para mañana a las 9am.", timestamp: mins(120) },
      { id: "s5", fromId: userId, fromName: "", toId: "seed_pro_ana", toName: "Ana M.", text: "Gracias Ana, muy amable.", timestamp: mins(115) },
    );
  } else {
    msgs.push(
      { id: "s6", fromId: "seed_client_juan", fromName: "Juan C.", toId: userId, toName: "", text: "¿Puedes llegar más temprano hoy?", timestamp: mins(45) },
      { id: "s7", fromId: userId, fromName: "", toId: "seed_client_juan", toName: "Juan C.", text: "Claro, puedo estar a las 2pm. ¿Le parece bien?", timestamp: mins(40) },
      { id: "s8", fromId: "seed_client_juan", fromName: "Juan C.", toId: userId, toName: "", text: "Perfecto, muchas gracias.", timestamp: mins(35) },
      { id: "s9", fromId: "seed_client_sofia", fromName: "Sofía R.", toId: userId, toName: "", text: "Necesito cotización para limpieza de 3 habitaciones.", timestamp: mins(200) },
      { id: "s10", fromId: userId, fromName: "", toId: "seed_client_sofia", toName: "Sofía R.", text: "Con gusto. El precio es $45 con materiales incluidos.", timestamp: mins(190) },
    );
  }
  const existing = getAllMessages();
  saveAllMessages([...existing, ...msgs]);
  localStorage.setItem(key, "1");
}

/* ────────────────────────────────────────────────────────
   CONSTANTS
──────────────────────────────────────────────────────── */
const WA_SUPPORT = "https://wa.me/50763997122";

const SERVICES = [
  { icon: "yard",                label: "Jardín & Césped",    desc: "Corte, siembra y mantenimiento." },
  { icon: "cleaning_services",   label: "Limpieza del Hogar", desc: "Limpieza profunda y regular." },
  { icon: "forest",              label: "Poda de Árboles",    desc: "Poda y retiro de ramas." },
  { icon: "water_drop",          label: "Riego & Irrigación", desc: "Sistemas de riego automático." },
  { icon: "plumbing",            label: "Plomería",           desc: "Reparaciones e instalaciones." },
  { icon: "electrical_services", label: "Electricidad",       desc: "Instalaciones certificadas." },
];

const TESTIMONIALS = [
  { name: "Carlos M.", role: "Cliente",     stars: 5, text: "Encontré un jardinero excelente en menos de 10 minutos. El jardín quedó impecable y a precio justo." },
  { name: "María R.",  role: "Clienta",     stars: 5, text: "La limpieza fue perfecta. El profesional fue puntual, responsable y muy detallista." },
  { name: "Jorge P.",  role: "Contratista", stars: 5, text: "Gracias a TodoClean consigo trabajos todos los días. Los pagos son rápidos y la app es fácil." },
];

const SAMPLE_JOBS = [
  { id: 1, service: "Corte de Césped",    address: "Vía España, Panamá",    budget: "$25", time: "Hoy 2:00 PM",     icon: "yard",              urgent: true,  clientId: "seed_client_juan",  clientName: "Juan C."  },
  { id: 2, service: "Limpieza del Hogar", address: "Marbella, Panamá",      budget: "$40", time: "Mañana 9:00 AM",  icon: "cleaning_services", urgent: false, clientId: "seed_client_sofia", clientName: "Sofía R." },
  { id: 3, service: "Plomería",           address: "San Francisco, Panamá", budget: "$35", time: "Hoy 5:00 PM",     icon: "plumbing",          urgent: true,  clientId: "seed_client_juan",  clientName: "Juan C."  },
  { id: 4, service: "Poda de Árboles",    address: "Albrook, Panamá",       budget: "$50", time: "Mañana 8:00 AM",  icon: "forest",            urgent: false, clientId: "seed_client_sofia", clientName: "Sofía R." },
];

const SAMPLE_BOOKINGS = [
  { id: 1, service: "Corte de Césped",    pro: "Roberto S.", proId: "seed_pro_roberto", date: "Hoy 2:00 PM",     status: "activo",    icon: "yard"              },
  { id: 2, service: "Limpieza del Hogar", pro: "Ana M.",      proId: "seed_pro_ana",    date: "22 Mar 9:00 AM",  status: "pendiente", icon: "cleaning_services" },
  { id: 3, service: "Plomería",           pro: "Luis P.",     proId: "seed_pro_luis",   date: "15 Mar 10:00 AM", status: "completado",icon: "plumbing"          },
];

/* ────────────────────────────────────────────────────────
   HELPERS
──────────────────────────────────────────────────────── */
function Icon({ name, className = "", style }: { name: string; className?: string; style?: React.CSSProperties }) {
  return <span className={`material-symbols-outlined leading-none ${className}`} style={style}>{name}</span>;
}
function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: n }).map((_, i) => (
        <Icon key={i} name="star" className="text-yellow-400 text-base" style={{ fontVariationSettings: "'FILL' 1" }} />
      ))}
    </div>
  );
}
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    activo:     "bg-blue-100 text-blue-700",
    pendiente:  "bg-yellow-100 text-yellow-700",
    completado: "bg-gray-100 text-gray-500",
    aceptado:   "bg-[#f2efff] text-[#514eb6]",
  };
  return (
    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${map[status] || map.pendiente}`}>
      {status}
    </span>
  );
}

/* WhatsApp Support Bubble — support/complaints only */
function SupportBubble() {
  const [show, setShow] = useState(false);
  return (
    <div className="fixed bottom-24 right-4 z-[200] flex flex-col items-end gap-2">
      {show && (
        <div className="bg-[#2b2a51] text-white text-xs font-semibold px-3 py-2 rounded-2xl rounded-br-none shadow-xl max-w-[180px] text-right animate-fade-in">
          ¿Tienes alguna queja o consulta? Contáctanos por WhatsApp.
          <a
            href={WA_SUPPORT}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-1 bg-[#25D366] text-white font-bold text-center rounded-full px-3 py-1"
          >
            Abrir Soporte
          </a>
        </div>
      )}
      <button
        onClick={() => setShow((s) => !s)}
        className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-transform"
        aria-label="Soporte"
      >
        <Icon name="support_agent" className="text-white text-2xl" />
      </button>
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   IN-APP CHAT COMPONENTS
──────────────────────────────────────────────────────── */
function ChatList({
  user,
  contacts,
  onOpen,
}: {
  user: UserProfile;
  contacts: { id: string; name: string }[];
  onOpen: (id: string, name: string) => void;
}) {
  const conversations = getConversations(user.id, contacts);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="sticky top-0 glass-header px-5 pt-5 pb-3 z-10">
        <h1 className="text-2xl font-black text-[#2b2a51] mb-1">Mensajes</h1>
        <p className="text-xs text-[#585781] font-medium">Chats con tus profesionales</p>
      </div>
      <div className="px-5 pb-6 mt-2 space-y-2">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-[#f2efff] flex items-center justify-center mb-4">
              <Icon name="chat_bubble_outline" className="text-[#849aff] text-4xl" />
            </div>
            <p className="font-bold text-[#2b2a51]">Sin conversaciones aún</p>
            <p className="text-sm text-[#585781] mt-1">Acepta un trabajo para iniciar el chat.</p>
          </div>
        ) : (
          conversations.map((c) => (
            <button
              key={c.partnerId}
              onClick={() => onOpen(c.partnerId, c.partnerName)}
              className="w-full flex items-center gap-3 p-4 bg-white rounded-2xl card-shadow active:scale-[.98] transition-transform text-left"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0546ed] to-[#849aff] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {c.partnerInitial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#2b2a51] text-sm truncate">{c.partnerName}</p>
                <p className="text-xs text-[#585781] truncate">{c.lastMessage}</p>
              </div>
              {c.lastTime && (
                <span className="text-[10px] text-[#74739e] font-medium flex-shrink-0">{c.lastTime}</span>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

function ChatThread({
  user,
  partnerId,
  partnerName,
  onBack,
}: {
  user: UserProfile;
  partnerId: string;
  partnerName: string;
  onBack: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>(() => getThread(user.id, partnerId));
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage(user, partnerId, partnerName, text.trim());
    setMessages(getThread(user.id, partnerId));
    setText("");
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 glass-header px-4 pt-4 pb-3 flex items-center gap-3 border-b border-[#e2dfff]">
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-[#f2efff] flex items-center justify-center active:scale-90 transition-transform">
          <Icon name="arrow_back" className="text-[#0546ed]" />
        </button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0546ed] to-[#849aff] flex items-center justify-center text-white font-bold flex-shrink-0">
          {partnerName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-[#2b2a51] text-sm truncate">{partnerName}</p>
          <p className="text-[10px] text-[#585781]">En línea</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#f9f5ff]">
        {messages.length === 0 && (
          <p className="text-center text-xs text-[#74739e] py-8">Inicia la conversación con {partnerName}</p>
        )}
        {messages.map((m) => {
          const mine = m.fromId === user.id;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${mine ? "bg-[#0546ed] text-white rounded-br-sm" : "bg-white text-[#2b2a51] rounded-bl-sm"}`}>
                <p>{m.text}</p>
                <p className={`text-[10px] mt-1 ${mine ? "text-white/60" : "text-[#74739e]"} text-right`}>{fmtTime(m.timestamp)}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex-shrink-0 flex items-center gap-2 px-4 py-3 bg-white border-t border-[#e2dfff]">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 h-11 px-4 rounded-full bg-[#f2efff] border border-[#e2dfff] focus:outline-none focus:ring-2 focus:ring-[#0546ed]/30 text-[#2b2a51] placeholder:text-[#aaa9d7] text-sm"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="w-11 h-11 rounded-full bg-[#0546ed] flex items-center justify-center disabled:opacity-40 active:scale-90 transition-transform flex-shrink-0"
        >
          <Icon name="send" className="text-white text-lg" />
        </button>
      </form>
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   AUTH MODAL
──────────────────────────────────────────────────────── */
function AuthModal({
  defaultTab = "login",
  defaultType = "client",
  onClose,
  onSuccess,
}: {
  defaultTab?: "login" | "register";
  defaultType?: "client" | "contractor";
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}) {
  const [tab, setTab]           = useState<"login" | "register">(defaultTab);
  const [utype, setUtype]       = useState<"client" | "contractor">(defaultType);
  const [showPwd, setShowPwd]   = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  const [error, setError]       = useState("");
  const [login, setLogin]       = useState({ email: "", password: "" });
  const [reg, setReg]           = useState({ name: "", phone: "", email: "", password: "", confirm: "", service: "" });

  function handleLogin(e: React.FormEvent) {
    e.preventDefault(); setError("");
    if (!login.email || !login.password) { setError("Completa todos los campos."); return; }
    const found = getUsers().find(u => u.email.toLowerCase() === login.email.toLowerCase() && u.password === login.password);
    if (!found) { setError("Correo o contraseña incorrectos."); return; }
    saveSession(found);
    onSuccess(found);
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault(); setError("");
    if (!reg.name.trim() || !reg.phone.trim() || !reg.email.trim() || !reg.password) { setError("Completa todos los campos obligatorios."); return; }
    if (reg.password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres."); return; }
    if (reg.password !== reg.confirm) { setError("Las contraseñas no coinciden."); return; }
    if (utype === "contractor" && !reg.service) { setError("Selecciona tu servicio principal."); return; }
    const users = getUsers();
    if (users.find(u => u.email.toLowerCase() === reg.email.toLowerCase())) {
      setError("Ya existe una cuenta con ese correo."); return;
    }
    const newUser: UserProfile = {
      id: `u_${Date.now()}`,
      name: reg.name.trim(), phone: reg.phone.trim(),
      email: reg.email.trim().toLowerCase(), password: reg.password,
      type: utype, service: utype === "contractor" ? reg.service : undefined,
      createdAt: new Date().toISOString(),
    };
    saveUsers([...users, newUser]);
    saveSession(newUser);
    if (utype === "contractor") {
      fetch("/api/workers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: newUser.id, name: newUser.name, phone: newUser.phone, email: newUser.email, service: newUser.service }),
      }).catch(() => {});
    }
    onSuccess(newUser);
  }

  const inp = "w-full h-12 px-4 rounded-xl border border-[#e2dfff] bg-[#f9f5ff] focus:outline-none focus:ring-2 focus:ring-[#0546ed]/40 text-[#2b2a51] placeholder:text-[#aaa9d7] text-base";

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center" style={{ background: "rgba(43,42,81,0.65)" }} onClick={onClose}>
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[95vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <img src="/todoclean-logo.png" alt="TodoClean" className="h-9 w-auto object-contain" />
          <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-[#f2efff] flex items-center justify-center">
            <Icon name="close" className="text-[#585781]" />
          </button>
        </div>

        <div className="flex mx-6 mb-5 bg-[#f2efff] rounded-2xl p-1">
          {(["login","register"] as const).map(t => (
            <button key={t} onClick={() => { setTab(t); setError(""); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === t ? "bg-white text-[#2b2a51] shadow-sm" : "text-[#585781]"}`}>
              {t === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
            </button>
          ))}
        </div>

        <div className="px-6 pb-8">
          {tab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#2b2a51] mb-1">Correo electrónico</label>
                <input type="email" placeholder="correo@ejemplo.com" value={login.email}
                  onChange={e => setLogin({...login, email: e.target.value})} className={inp} autoComplete="email" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#2b2a51] mb-1">Contraseña</label>
                <div className="relative">
                  <input type={showPwd ? "text" : "password"} placeholder="Tu contraseña" value={login.password}
                    onChange={e => setLogin({...login, password: e.target.value})} className={inp + " pr-12"} autoComplete="current-password" />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-3 text-[#0546ed] min-h-0 p-0">
                    <Icon name={showPwd ? "visibility_off" : "visibility"} />
                  </button>
                </div>
              </div>
              {error && <p className="text-red-500 text-sm font-semibold bg-red-50 px-3 py-2 rounded-xl">{error}</p>}
              <button type="submit" className="w-full h-12 rounded-full bg-[#0546ed] hover:bg-[#003cd3] text-white font-bold text-base transition-all active:scale-95 shadow-md">
                Iniciar Sesión →
              </button>
              <p className="text-sm text-center text-[#585781]">
                ¿No tienes cuenta?{" "}
                <button type="button" onClick={() => { setTab("register"); setError(""); }} className="text-[#0546ed] font-bold hover:underline min-h-0">
                  Regístrate aquí
                </button>
              </p>
            </form>
          )}

          {tab === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-[#2b2a51] mb-2">Quiero registrarme como…</p>
                <div className="grid grid-cols-2 gap-3">
                  {(["client","contractor"] as const).map(t => (
                    <button key={t} type="button" onClick={() => setUtype(t)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${utype === t ? "border-[#0546ed] bg-[#f2efff]" : "border-[#e2dfff] bg-white"}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${utype === t ? "bg-[#0546ed]" : "bg-[#f2efff]"}`}>
                        <Icon name={t === "client" ? "home" : "construction"} className={utype === t ? "text-white" : "text-[#514eb6]"} />
                      </div>
                      <span className={`text-xs font-bold ${utype === t ? "text-[#2b2a51]" : "text-[#585781]"}`}>
                        {t === "client" ? "Cliente" : "Contratista"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {[
                { label:"Nombre completo *", key:"name",  t:"text",  ph:"Tu nombre completo" },
                { label:"Teléfono *",        key:"phone", t:"tel",   ph:"+507 6000-0000" },
                { label:"Correo electrónico *", key:"email", t:"email", ph:"correo@ejemplo.com" },
              ].map(({ label, key, t, ph }) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-[#2b2a51] mb-1">{label}</label>
                  <input type={t} placeholder={ph} value={reg[key as keyof typeof reg]}
                    onChange={e => setReg({...reg, [key]: e.target.value})} className={inp} />
                </div>
              ))}

              {[
                { label:"Contraseña *",           key:"password", ph:"Mínimo 6 caracteres",  show:showPwd,  toggle:() => setShowPwd(!showPwd)   },
                { label:"Confirmar contraseña *", key:"confirm",  ph:"Repite tu contraseña", show:showPwd2, toggle:() => setShowPwd2(!showPwd2) },
              ].map(({ label, key, ph, show, toggle }) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-[#2b2a51] mb-1">{label}</label>
                  <div className="relative">
                    <input type={show ? "text" : "password"} placeholder={ph} value={reg[key as keyof typeof reg]}
                      onChange={e => setReg({...reg, [key]: e.target.value})} className={inp + " pr-12"} />
                    <button type="button" onClick={toggle} className="absolute right-3 top-3 text-[#0546ed] min-h-0 p-0">
                      <Icon name={show ? "visibility_off" : "visibility"} />
                    </button>
                  </div>
                </div>
              ))}

              {utype === "contractor" && (
                <div>
                  <label className="block text-sm font-semibold text-[#2b2a51] mb-1">Servicio principal *</label>
                  <select value={reg.service} onChange={e => setReg({...reg, service: e.target.value})} className={inp}>
                    <option value="">Selecciona un servicio</option>
                    {SERVICES.map(s => <option key={s.label} value={s.label}>{s.label}</option>)}
                  </select>
                </div>
              )}

              {error && <p className="text-red-500 text-sm font-semibold bg-red-50 px-3 py-2 rounded-xl">{error}</p>}
              <button type="submit" className="w-full h-12 rounded-full bg-[#0546ed] hover:bg-[#003cd3] text-white font-bold text-base transition-all active:scale-95 shadow-md">
                {utype === "contractor" ? "Crear Cuenta de Contratista →" : "Crear Cuenta de Cliente →"}
              </button>
              <p className="text-xs text-center text-[#585781]">
                Al registrarte aceptas nuestros{" "}
                <span className="text-[#0546ed] font-semibold cursor-pointer">Términos y Condiciones</span>
              </p>
              <p className="text-sm text-center text-[#585781]">
                ¿Ya tienes cuenta?{" "}
                <button type="button" onClick={() => { setTab("login"); setError(""); }} className="text-[#0546ed] font-bold hover:underline min-h-0">
                  Inicia sesión
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   LANDING PAGE
═══════════════════════════════════════════════════════ */
function LandingPage({ onGoTo }: { onGoTo: (screen: Screen, user?: UserProfile) => void }) {
  const [auth, setAuth]           = useState<{ tab: "login"|"register"; type: "client"|"contractor" } | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  function openAuth(tab: "login"|"register", type: "client"|"contractor" = "client") {
    setAuth({ tab, type });
    setMobileMenu(false);
  }
  function handleAuthed(user: UserProfile) {
    setAuth(null);
    if (user.type === "admin") onGoTo("admin", user);
    else if (user.type === "client") onGoTo("client", user);
    else onGoTo("contractor", user);
  }

  return (
    <>
      {/* ── Sticky Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#e2dfff] shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="#inicio" className="flex items-center min-h-0">
            <img src="/todoclean-logo.png" alt="TodoClean" className="h-10 w-auto object-contain" />
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#514eb6]">
            <a href="#servicios"     className="hover:text-[#2b2a51] transition-colors">Servicios</a>
            <a href="#como-funciona" className="hover:text-[#2b2a51] transition-colors">¿Cómo funciona?</a>
            <a href="#contratistas"  className="hover:text-[#2b2a51] transition-colors">Para Contratistas</a>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => openAuth("login","client")} className="text-[#514eb6] hover:text-[#2b2a51] font-semibold text-sm transition-colors flex items-center gap-1">
              <Icon name="login" className="text-base" />Iniciar Sesión
            </button>
            <button onClick={() => openAuth("register","client")} className="border-2 border-[#0546ed] text-[#0546ed] hover:bg-[#0546ed] hover:text-white font-bold rounded-full px-5 py-2 text-sm transition-all">
              Soy Cliente
            </button>
            <button onClick={() => openAuth("register","contractor")} className="bg-[#0546ed] hover:bg-[#003cd3] text-white font-bold rounded-full px-5 py-2 text-sm shadow-md transition-all">
              Soy Contratista
            </button>
          </div>
          <button className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#f2efff]" onClick={() => setMobileMenu(!mobileMenu)}>
            <Icon name={mobileMenu ? "close" : "menu"} className="text-[#2b2a51]" />
          </button>
        </div>
        {mobileMenu && (
          <div className="md:hidden border-t border-[#e2dfff] bg-white px-4 py-6 space-y-4">
            {[["#servicios","Servicios"],["#como-funciona","¿Cómo funciona?"],["#contratistas","Para Contratistas"]].map(([href,label]) => (
              <a key={href} href={href} onClick={() => setMobileMenu(false)} className="block font-semibold text-[#2b2a51] py-2">{label}</a>
            ))}
            <div className="flex flex-col gap-3 pt-2">
              <button onClick={() => openAuth("login","client")} className="border border-[#e2dfff] text-[#514eb6] font-bold rounded-full py-3 flex items-center justify-center gap-2">
                <Icon name="login" />Iniciar Sesión
              </button>
              <button onClick={() => openAuth("register","client")} className="border-2 border-[#0546ed] text-[#0546ed] font-bold rounded-full py-3">Soy Cliente</button>
              <button onClick={() => openAuth("register","contractor")} className="bg-[#0546ed] text-white font-bold rounded-full py-3">Soy Contratista</button>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section id="inicio" className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="/man-cutting-grass-with-lawn-mover-back-yard.jpg" alt="Servicios del hogar" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(5,70,237,0.90) 0%, rgba(81,78,182,0.80) 55%, rgba(132,154,255,0.65) 100%)" }} />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-1.5">
              <span className="w-2 h-2 rounded-full bg-[#849aff] animate-pulse" />
              <span className="text-white/90 text-xs font-bold uppercase tracking-widest">Disponible en tu zona</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
              Conectamos <span className="text-[#849aff]">Hogares</span> con <span className="text-[#e2dfff]">Profesionales</span>
            </h1>
            <p className="text-lg text-white/80 max-w-lg leading-relaxed">
              Jardín, limpieza, plomería, electricidad y más. Profesionales verificados, reservas en minutos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => openAuth("register","client")} className="flex items-center justify-center gap-2 bg-white text-[#2b2a51] font-bold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-base">
                <Icon name="home" /> Soy Cliente — Reservar Ahora
              </button>
              <button onClick={() => openAuth("register","contractor")} className="flex items-center justify-center gap-2 border-2 border-white/50 text-white font-bold px-8 py-4 rounded-full hover:bg-white/15 transition-all text-base">
                <Icon name="construction" /> Soy Contratista — Ganar Dinero
              </button>
            </div>
            <div className="flex flex-wrap gap-6 pt-2">
              {[["verified_user","Pros Verificados"],["star","4.9 ★ Promedio"],["groups","+500 Profesionales"]].map(([icon,text]) => (
                <div key={text} className="flex items-center gap-2 text-white/80">
                  <Icon name={icon} className="text-lg" />
                  <span className="text-sm font-semibold">{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden md:flex flex-col gap-4 items-end">
            {[
              { icon:"yard",              name:"Corte de Césped",      price:"$25" },
              { icon:"cleaning_services", name:"Limpieza del Hogar",   price:"$35" },
              { icon:"plumbing",          name:"Servicio de Plomería", price:"$40" },
            ].map((card, i) => (
              <div key={card.name} className="bg-white/95 backdrop-blur rounded-2xl p-4 flex items-center gap-4 shadow-xl w-80" style={{ transform: `translateX(${i % 2 === 1 ? "20px" : "0"})` }}>
                <div className="w-12 h-12 rounded-xl bg-[#f2efff] flex items-center justify-center flex-shrink-0">
                  <Icon name={card.icon} className="text-[#514eb6] text-2xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#2b2a51] text-sm">{card.name}</p>
                  <Stars n={5} />
                </div>
                <span className="text-[#0546ed] font-black text-lg">{card.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="servicios" className="py-20 bg-[#f2efff]/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#514eb6]">Lo que ofrecemos</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#2b2a51] mt-2">Servicios del Hogar</h2>
            <p className="text-[#585781] mt-3 max-w-xl mx-auto">Desde el jardín hasta la plomería, tenemos el profesional correcto para cada necesidad.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((svc) => (
              <div key={svc.label} className="group bg-white rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-[#e2dfff]/60 card-shadow">
                <div className="w-14 h-14 rounded-2xl bg-[#f2efff] flex items-center justify-center mb-4 group-hover:bg-[#e2dfff] transition-colors">
                  <Icon name={svc.icon} className="text-[#514eb6] text-3xl" />
                </div>
                <h3 className="font-extrabold text-[#2b2a51] text-lg mb-2">{svc.label}</h3>
                <p className="text-[#585781] text-sm leading-relaxed">{svc.desc}</p>
                <button onClick={() => openAuth("register","client")} className="mt-4 flex items-center gap-1 text-[#0546ed] font-bold text-sm group-hover:text-[#003cd3] transition-colors">
                  Reservar ahora <Icon name="arrow_forward" className="text-base" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="como-funciona" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#514eb6]">Simple y Rápido</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#2b2a51] mt-2">¿Cómo funciona?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n:"01", icon:"search",    title:"Busca tu servicio",     desc:"Elige entre docenas de servicios en tu zona." },
              { n:"02", icon:"handshake", title:"Conecta con un pro",    desc:"Revisa perfiles, calificaciones y elige al mejor." },
              { n:"03", icon:"thumb_up",  title:"Disfruta el resultado", desc:"Apruebas el trabajo y pagas de forma segura." },
            ].map((step, i) => (
              <div key={step.n} className="relative flex flex-col items-center text-center p-8">
                {i < 2 && <div className="hidden md:block absolute top-14 left-[calc(50%+48px)] w-[calc(100%-96px)] h-0.5 bg-[#e2dfff]" />}
                <div className="w-20 h-20 rounded-full bg-[#f2efff] border-4 border-[#e2dfff] flex items-center justify-center mb-5 relative z-10">
                  <Icon name={step.icon} className="text-[#514eb6] text-3xl" />
                </div>
                <span className="text-5xl font-black text-[#e2dfff] absolute top-2 right-6 select-none">{step.n}</span>
                <h3 className="font-extrabold text-[#2b2a51] text-xl mb-2">{step.title}</h3>
                <p className="text-[#585781] text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── For Clients ── */}
      <section className="py-20 bg-[#f2efff]/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl relative">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIZjD916O899ww1aZGWtNRVMH_uj6LMF_q92cv2Ul70HuL_y5qoSiYtFcgj4wQ4mNEMNG0rkBA6O0dp-0zdFQHyfnWiQaQ2dq4648-s40I7EORxo0_9WTzx4i3SRwduPFbkAmX8b9SXNLu46eVd0zYfxHxECRLHnUnRagZyNlrSRMH53EFVXB1azRu2OIAo_j7nO_hJx75E4xLb3YXEb_ydrBxgljNz3IV5v8hUEqqEO6sTexL5ax9bvPW7v7fNijPnWalx9SCc2g" alt="Servicio" className="w-full h-full object-cover" />
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-4 shadow-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#f2efff] flex items-center justify-center">
                  <Icon name="star" className="text-yellow-400 text-xl" style={{ fontVariationSettings: "'FILL' 1" }} />
                </div>
                <div><p className="font-black text-[#2b2a51] text-lg leading-none">4.9</p><p className="text-xs text-[#585781]">Calificación promedio</p></div>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#514eb6]">Para Clientes</span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#2b2a51] mt-2 leading-tight">Tu hogar, en las mejores manos</h2>
                <p className="text-[#585781] mt-3 leading-relaxed">Contrata profesionales verificados en minutos. Sin contratos forzosos, sin sorpresas.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  ["verified_user","Profesionales Verificados","Todos pasan por verificación."],
                  ["star","Calificaciones Reales","Lee reseñas antes de contratar."],
                  ["payments","Pago Seguro","Paga solo cuando apruebes el trabajo."],
                  ["support_agent","Soporte 24/7","Siempre disponibles para ayudarte."],
                ].map(([icon,title,desc]) => (
                  <div key={title} className="flex gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#f2efff] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon name={icon} className="text-[#514eb6] text-xl" />
                    </div>
                    <div><h4 className="font-bold text-[#2b2a51] text-sm">{title}</h4><p className="text-[#585781] text-xs mt-0.5">{desc}</p></div>
                  </div>
                ))}
              </div>
              <button onClick={() => openAuth("register","client")} className="bg-[#0546ed] hover:bg-[#003cd3] text-white font-bold px-8 py-4 rounded-full shadow-md transition-all text-base">
                Registrarme como Cliente
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── For Contractors ── */}
      <section id="contratistas" className="py-20 dark-gradient">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 order-2 md:order-1">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#849aff]">Para Contratistas</span>
                <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 leading-tight">Convierte tus habilidades en ingresos</h2>
                <p className="text-white/70 mt-3 leading-relaxed">Únete a nuestra red y empieza a recibir trabajo en tu zona.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  ["payments","Gana Dinero","Recibe pagos seguros en tu cuenta."],
                  ["location_on","Trabajos Cercanos","Clientes en tu área."],
                  ["photo_camera","Sube tu Trabajo","Muestra fotos y genera confianza."],
                  ["schedule","Horario Flexible","Trabaja cuando quieras."],
                ].map(([icon,title,desc]) => (
                  <div key={title} className="flex gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon name={icon} className="text-[#849aff] text-xl" />
                    </div>
                    <div><h4 className="font-bold text-white text-sm">{title}</h4><p className="text-white/60 text-xs mt-0.5">{desc}</p></div>
                  </div>
                ))}
              </div>
              <button onClick={() => openAuth("register","contractor")} className="bg-white hover:bg-[#f2efff] text-[#2b2a51] font-bold px-8 py-4 rounded-full transition-all shadow-lg text-base">
                Registrarme como Contratista
              </button>
            </div>
            <div className="relative order-1 md:order-2">
              <div className="rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxgesrZwRVgrWx5JSaWwJzEe7LMededg7sHmVWBQyGysGykXXjYBlzenM_1otPtZ60QtOsNNxWismQeM5Ckt4lvQwFjpQiV87knrfPFx1xdMS0GZhGtiRfJIfC4cq-GE_y8fGMX4FWCDJPo3ccH12Bau10gNyQmuGG4Ce6g2CRmR51IqmJ-BVy263jRlEz38APDVKNKoFja_fEsrHabqSmoKAGIHp2u-N5-7_1gDhftQK1AY11hOAjKi9nJKnEZXSezD5Hn0kaSyg" alt="Contratista" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#f2efff] flex items-center justify-center">
                  <Icon name="payments" className="text-[#514eb6] text-xl" />
                </div>
                <div><p className="font-black text-[#2b2a51] text-lg leading-none">$800+</p><p className="text-xs text-[#585781]">Ingreso mensual promedio</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#514eb6]">Lo que dicen</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#2b2a51] mt-2">Reseñas de la comunidad</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-[#f9f5ff] border border-[#e2dfff] rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <Stars n={t.stars} />
                <p className="text-[#2b2a51] leading-relaxed text-sm my-4">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0546ed] to-[#849aff] flex items-center justify-center text-white font-bold text-sm">{t.name.charAt(0)}</div>
                  <div><p className="font-bold text-[#2b2a51] text-sm">{t.name}</p><p className="text-xs text-[#514eb6] font-semibold">{t.role}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-20 bg-[#f2efff]/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black text-[#2b2a51] leading-tight">¿Listo para empezar?</h2>
          <p className="text-[#585781] text-lg max-w-2xl mx-auto">El registro es gratuito. Empieza en minutos.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <button onClick={() => openAuth("register","client")} className="bg-[#0546ed] hover:bg-[#003cd3] text-white font-bold px-10 py-4 rounded-full shadow-md text-base flex items-center justify-center gap-2">
              <Icon name="home" /> Soy Cliente
            </button>
            <button onClick={() => openAuth("register","contractor")} className="border-2 border-[#0546ed] text-[#0546ed] hover:bg-[#0546ed] hover:text-white font-bold px-10 py-4 rounded-full text-base flex items-center justify-center gap-2 transition-all">
              <Icon name="construction" /> Soy Contratista
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#2b2a51] text-[#dcd9ff]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-3 sm:col-span-2 md:col-span-1">
            <img src="/todoclean-logo.png" alt="TodoClean" className="h-12 w-auto brightness-0 invert" />
            <p className="text-sm text-[#aaa9d7] leading-relaxed">Conectando hogares con profesionales de confianza.</p>
            <a href={WA_SUPPORT} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] text-white text-sm font-bold px-4 py-2 rounded-full hover:bg-green-500 transition-colors">
              <Icon name="support_agent" className="text-base" /> Soporte
            </a>
          </div>
          <div>
            <h4 className="font-bold text-white text-sm mb-3 uppercase tracking-widest">Servicios</h4>
            <ul className="space-y-2 text-sm text-[#aaa9d7]">
              {["Jardín & Césped","Limpieza del Hogar","Plomería","Electricidad","Poda"].map((s) => (
                <li key={s}><a href="#servicios" className="hover:text-white transition-colors">{s}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white text-sm mb-3 uppercase tracking-widest">Empresa</h4>
            <ul className="space-y-2 text-sm text-[#aaa9d7]">
              {["Nosotros","¿Cómo funciona?","Para Contratistas","Testimonios"].map((s) => (
                <li key={s}><span className="hover:text-white transition-colors cursor-pointer">{s}</span></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white text-sm mb-3 uppercase tracking-widest">Contacto</h4>
            <ul className="space-y-2 text-sm text-[#aaa9d7]">
              <li className="flex items-center gap-2"><Icon name="support_agent" className="text-base" /><span>Soporte vía WhatsApp</span></li>
              <li className="flex items-center gap-2"><Icon name="mail" className="text-base" /><span>info@todoclean.app</span></li>
              <li className="flex items-center gap-2"><Icon name="location_on" className="text-base" /><span>Panamá</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#514eb6]/40 max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#aaa9d7]/60">
          <span>© 2025 TodoClean. Todos los derechos reservados.</span>
          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer transition-colors">Privacidad</span>
            <span className="hover:text-white cursor-pointer transition-colors">Términos</span>
          </div>
        </div>
      </footer>

      {/* Mobile bottom nav for landing */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-t border-[#e2dfff] shadow-lg">
        <div className="flex justify-around items-center px-2 py-2" style={{ paddingBottom: "max(8px, env(safe-area-inset-bottom))" }}>
          {[["home","Inicio","#inicio"],["cleaning_services","Servicios","#servicios"],["info","¿Cómo?","#como-funciona"],["construction","Contratistas","#contratistas"]].map(([icon,label,href]) => (
            <a key={label} href={href} className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl hover:bg-[#f2efff] transition-colors text-[#514eb6]">
              <Icon name={icon} className="text-xl" />
              <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
            </a>
          ))}
          <button onClick={() => openAuth("register","client")} className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl bg-[#0546ed] text-white">
            <Icon name="person_add" className="text-xl" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Unirse</span>
          </button>
        </div>
      </div>
      <div className="h-20 md:hidden" />

      {auth && <AuthModal defaultTab={auth.tab} defaultType={auth.type} onClose={() => setAuth(null)} onSuccess={handleAuthed} />}
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   CLIENT DASHBOARD
═══════════════════════════════════════════════════════ */
function ClientDashboard({ user, onLogout }: { user: UserProfile; onLogout: () => void }) {
  const [tab, setTab]               = useState<"home"|"search"|"bookings"|"chat"|"profile">("home");
  const [chatPartner, setChatPartner] = useState<{ id: string; name: string } | null>(null);

  const tabs = [
    { id: "home",     icon: "home",          label: "Inicio"   },
    { id: "search",   icon: "search",        label: "Buscar"   },
    { id: "bookings", icon: "calendar_today",label: "Reservas" },
    { id: "chat",     icon: "chat_bubble",   label: "Chat"     },
    { id: "profile",  icon: "person",        label: "Perfil"   },
  ] as const;

  function openChat(id: string, name: string) {
    setChatPartner({ id, name });
    setTab("chat");
  }

  return (
    <div className="min-h-screen bg-[#f9f5ff] sm:bg-gray-200 sm:flex sm:items-center sm:justify-center sm:p-4">
      <div className="w-full sm:max-w-[420px] min-h-screen sm:min-h-0 sm:h-[860px] bg-[#f9f5ff] relative overflow-hidden sm:rounded-[2.5rem] sm:border-[8px] sm:border-gray-800 sm:shadow-2xl flex flex-col">

        {tab === "home"     && <ClientHome user={user} onOpenChat={openChat} />}
        {tab === "search"   && <ClientSearch onOpenChat={openChat} />}
        {tab === "bookings" && <ClientBookings onOpenChat={openChat} />}
        {tab === "chat"     && (
          chatPartner
            ? <ChatThread user={user} partnerId={chatPartner.id} partnerName={chatPartner.name} onBack={() => setChatPartner(null)} />
            : <ChatList user={user} contacts={SEED_PRO_IDS} onOpen={(id, name) => setChatPartner({ id, name })} />
        )}
        {tab === "profile"  && <ClientProfile user={user} onLogout={onLogout} />}

        {/* Bottom Nav */}
        <nav className="flex-shrink-0 flex justify-around items-center px-1 pt-2 pb-5 bg-white border-t border-[#e2dfff] z-50" style={{ paddingBottom: "max(20px, env(safe-area-inset-bottom))" }}>
          {tabs.map((t) => {
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => { setTab(t.id); if (t.id !== "chat") setChatPartner(null); }}
                className={`flex flex-col items-center gap-0.5 px-2 py-2 rounded-2xl transition-all duration-200 active:scale-90 ${active ? "bg-[#f2efff] text-[#0546ed]" : "text-[#74739e]"}`}>
                <Icon name={t.icon} className="text-xl" style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }} />
                <span className="text-[9px] font-bold uppercase tracking-widest">{t.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
      <SupportBubble />
    </div>
  );
}

function ClientHome({ user, onOpenChat }: { user: UserProfile; onOpenChat: (id: string, name: string) => void }) {
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Top bar */}
      <div className="sticky top-0 z-10 glass-header px-5 pt-5 pb-3 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#514eb6]">Bienvenido</p>
          <h1 className="text-2xl font-black text-[#2b2a51]">Hola, {user.name.split(" ")[0]} 👋</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0546ed] to-[#849aff] flex items-center justify-center text-white font-bold text-lg shadow-md">
          {user.name.charAt(0).toUpperCase()}
        </div>
      </div>

      <div className="px-5 pb-6 space-y-6">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Icon name="search" className="text-[#849aff]" />
          </div>
          <input placeholder="Buscar un servicio..." className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white border border-[#e2dfff] focus:outline-none focus:ring-2 focus:ring-[#0546ed]/30 text-[#2b2a51] placeholder:text-[#aaa9d7] text-sm" />
        </div>

        {/* Promo banner */}
        <div className="rounded-2xl p-5 flex items-center justify-between overflow-hidden relative primary-gradient">
          <div className="absolute top-[-20%] right-[-5%] w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="space-y-1 z-10">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 text-white px-2 py-0.5 rounded-full">Oferta</span>
            <p className="text-xl font-black text-white">45% OFF</p>
            <p className="text-white/80 text-xs">en tu primer servicio</p>
            <button className="mt-2 bg-white text-[#0546ed] text-xs font-bold px-4 py-1.5 rounded-full">Reservar ahora</button>
          </div>
          <Icon name="yard" className="text-white/30 text-8xl" />
        </div>

        {/* Categories */}
        <div>
          <h3 className="font-extrabold text-[#2b2a51] mb-3">Categorías</h3>
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon:"yard",               label:"Jardín",   bg:"bg-[#f2efff]", color:"text-[#514eb6]" },
              { icon:"cleaning_services",  label:"Limpieza", bg:"bg-[#ffeef7]", color:"text-[#913983]" },
              { icon:"plumbing",           label:"Plomería", bg:"bg-[#ffe9e9]", color:"text-[#c0392b]" },
              { icon:"electrical_services",label:"Elec.",    bg:"bg-[#fff3e0]", color:"text-[#e65100]" },
            ].map((c) => (
              <div key={c.label} className="flex flex-col items-center gap-1.5">
                <button className={`w-14 h-14 rounded-2xl ${c.bg} flex items-center justify-center ${c.color} active:scale-90 transition-transform`}>
                  <Icon name={c.icon} className="text-2xl" />
                </button>
                <span className="text-[10px] font-bold text-[#585781] uppercase tracking-tighter">{c.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Active bookings */}
        {SAMPLE_BOOKINGS.filter(b => b.status !== "completado").length > 0 && (
          <div>
            <h3 className="font-extrabold text-[#2b2a51] mb-3">Reservas Activas</h3>
            <div className="space-y-3">
              {SAMPLE_BOOKINGS.filter(b => b.status !== "completado").map((b) => (
                <div key={b.id} className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-[#e2dfff]/40 card-shadow">
                  <div className="w-10 h-10 rounded-xl bg-[#f2efff] flex items-center justify-center flex-shrink-0">
                    <Icon name={b.icon} className="text-[#514eb6]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#2b2a51] text-sm truncate">{b.service}</p>
                    <p className="text-xs text-[#585781]">{b.date} · {b.pro}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={b.status} />
                    {b.status === "activo" && (
                      <button onClick={() => onOpenChat(b.proId, b.pro)} className="w-8 h-8 rounded-full bg-[#f2efff] flex items-center justify-center">
                        <Icon name="chat_bubble" className="text-[#0546ed] text-sm" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Popular services */}
        <div>
          <h3 className="font-extrabold text-[#2b2a51] mb-3">Servicios Populares</h3>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-5 px-5 no-scrollbar">
            {SERVICES.slice(0, 4).map((svc) => (
              <div key={svc.label} className="min-w-[180px] bg-white rounded-2xl p-4 border border-[#e2dfff]/40 flex-shrink-0 card-shadow">
                <div className="w-10 h-10 rounded-xl bg-[#f2efff] flex items-center justify-center mb-3">
                  <Icon name={svc.icon} className="text-[#514eb6] text-xl" />
                </div>
                <p className="font-bold text-[#2b2a51] text-sm">{svc.label}</p>
                <p className="text-xs text-[#585781] mt-1">{svc.desc}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[#0546ed] font-black text-sm">$25<span className="text-xs font-normal text-[#74739e]">/hr</span></span>
                  <Stars n={5} />
                </div>
                <button className="mt-3 w-full bg-[#0546ed] text-white text-xs font-bold py-2 rounded-full">Reservar</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ClientSearch({ onOpenChat }: { onOpenChat: (id: string, name: string) => void }) {
  const [filter, setFilter] = useState("Todos");
  const [query, setQuery]   = useState("");
  const filters = ["Todos","Jardín","Limpieza","Plomería","Electricidad"];
  const shown = SERVICES.filter(s => {
    const matchFilter = filter === "Todos" || s.label.toLowerCase().includes(filter.toLowerCase());
    const matchQuery  = !query || s.label.toLowerCase().includes(query.toLowerCase());
    return matchFilter && matchQuery;
  });

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="sticky top-0 glass-header px-5 pt-5 pb-3 z-10">
        <h1 className="text-2xl font-black text-[#2b2a51] mb-3">Buscar Servicios</h1>
        <div className="relative mb-3">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none"><Icon name="search" className="text-[#849aff]" /></div>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar..." className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white border border-[#e2dfff] focus:outline-none focus:ring-2 focus:ring-[#0546ed]/30 text-sm text-[#2b2a51] placeholder:text-[#aaa9d7]" />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {filters.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${filter === f ? "bg-[#0546ed] text-white" : "bg-[#f2efff] text-[#514eb6]"}`}>{f}</button>
          ))}
        </div>
      </div>
      <div className="px-5 pb-6 space-y-4">
        {shown.map((svc) => (
          <div key={svc.label} className="bg-white rounded-2xl p-4 border border-[#e2dfff]/40 card-shadow">
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-xl bg-[#f2efff] flex items-center justify-center flex-shrink-0">
                <Icon name={svc.icon} className="text-[#514eb6] text-3xl" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-[#2b2a51]">{svc.label}</h3>
                  <Stars n={5} />
                </div>
                <p className="text-xs text-[#585781] mt-1">{svc.desc}</p>
                <p className="text-[#0546ed] font-black mt-1">$25<span className="text-xs font-normal text-[#74739e]">/hr</span></p>
              </div>
            </div>
            <div className="flex gap-3 mt-3">
              <button onClick={() => onOpenChat(SEED_PRO_IDS[0].id, SEED_PRO_IDS[0].name)} className="flex-1 py-2 rounded-full bg-[#f2efff] text-[#514eb6] text-xs font-bold flex items-center justify-center gap-1">
                <Icon name="chat_bubble" className="text-sm" /> Consultar
              </button>
              <button className="flex-1 py-2 rounded-full bg-[#0546ed] text-white text-xs font-bold">Reservar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClientBookings({ onOpenChat }: { onOpenChat: (id: string, name: string) => void }) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-5 pt-5 pb-3 glass-header sticky top-0 z-10">
        <h1 className="text-2xl font-black text-[#2b2a51]">Mis Reservas</h1>
      </div>
      <div className="px-5 pb-6 space-y-4 mt-2">
        {["activo","pendiente","completado"].map((status) => {
          const bookings = SAMPLE_BOOKINGS.filter(b => b.status === status);
          if (!bookings.length) return null;
          return (
            <div key={status}>
              <p className="text-xs font-bold uppercase tracking-widest text-[#514eb6] mb-2 capitalize">{status}s</p>
              <div className="space-y-3">
                {bookings.map((b) => (
                  <div key={b.id} className="bg-white rounded-2xl p-4 border border-[#e2dfff]/40 card-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[#f2efff] flex items-center justify-center">
                        <Icon name={b.icon} className="text-[#514eb6]" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-[#2b2a51] text-sm">{b.service}</p>
                        <p className="text-xs text-[#585781]">Pro: {b.pro}</p>
                      </div>
                      <StatusBadge status={b.status} />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#74739e]">
                      <Icon name="schedule" className="text-sm" />
                      <span>{b.date}</span>
                    </div>
                    {b.status === "activo" && (
                      <div className="flex gap-2 mt-3">
                        <button onClick={() => onOpenChat(b.proId, b.pro)} className="flex-1 py-2 rounded-full bg-[#0546ed] text-white text-xs font-bold flex items-center justify-center gap-1">
                          <Icon name="chat_bubble" className="text-sm" /> Chatear con Pro
                        </button>
                        <button className="flex-1 py-2 rounded-full bg-[#f2efff] text-[#514eb6] text-xs font-bold">Ver Detalles</button>
                      </div>
                    )}
                    {b.status === "pendiente" && (
                      <div className="flex gap-2 mt-3">
                        <button className="flex-1 py-2 rounded-full bg-[#f2efff] text-[#514eb6] text-xs font-bold">Ver Detalles</button>
                        <button className="flex-1 py-2 rounded-full bg-red-50 text-red-500 text-xs font-bold">Cancelar</button>
                      </div>
                    )}
                    {b.status === "completado" && (
                      <button className="w-full mt-3 py-2 rounded-full bg-[#f2efff] text-[#514eb6] text-xs font-bold flex items-center justify-center gap-1">
                        <Icon name="star" className="text-sm" /> Dejar Reseña
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ClientProfile({ user, onLogout }: { user: UserProfile; onLogout: () => void }) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-5 pt-5 pb-3 glass-header sticky top-0 z-10">
        <h1 className="text-2xl font-black text-[#2b2a51]">Mi Perfil</h1>
      </div>
      <div className="px-5 pb-6 space-y-6 mt-2">
        <div className="flex flex-col items-center py-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0546ed] to-[#849aff] flex items-center justify-center text-white text-3xl font-black shadow-lg mb-3">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-xl font-black text-[#2b2a51]">{user.name}</h2>
          <p className="text-sm text-[#514eb6] font-semibold">Cliente Verificado</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#e2dfff]/40 space-y-3 card-shadow">
          {[
            { icon:"mail",  label:"Correo",   value: user.email },
            { icon:"phone", label:"Teléfono", value: user.phone },
            { icon:"badge", label:"Tipo",     value: "Cliente" },
          ].map((row) => (
            <div key={row.label} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#f2efff] flex items-center justify-center">
                <Icon name={row.icon} className="text-[#514eb6] text-lg" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#74739e]">{row.label}</p>
                <p className="text-sm font-semibold text-[#2b2a51]">{row.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          {[
            { icon:"history",       label:"Historial de Reservas" },
            { icon:"location_on",   label:"Mis Direcciones" },
            { icon:"payment",       label:"Métodos de Pago" },
            { icon:"notifications", label:"Notificaciones" },
            { icon:"help",          label:"Ayuda y Soporte" },
          ].map((item) => (
            <button key={item.label} className="w-full flex items-center gap-3 p-4 bg-white rounded-2xl border border-[#e2dfff]/40 active:scale-95 transition-transform text-left card-shadow">
              <div className="w-9 h-9 rounded-xl bg-[#f2efff] flex items-center justify-center">
                <Icon name={item.icon} className="text-[#514eb6]" />
              </div>
              <span className="flex-1 font-semibold text-[#2b2a51] text-sm">{item.label}</span>
              <Icon name="chevron_right" className="text-[#aaa9d7]" />
            </button>
          ))}
          <button onClick={onLogout} className="w-full flex items-center gap-3 p-4 bg-red-50 rounded-2xl border border-red-100 active:scale-95 transition-transform text-left">
            <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center">
              <Icon name="logout" className="text-red-500" />
            </div>
            <span className="flex-1 font-semibold text-red-500 text-sm">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CONTRACTOR DASHBOARD
═══════════════════════════════════════════════════════ */
type ApiBooking = {
  id: string; name: string; phone: string; address: string; service: string;
  date: string; notes: string; status: string; workerId: string | null;
  workerName: string | null; createdAt: string;
};

function ContractorDashboard({ user, onLogout }: { user: UserProfile; onLogout: () => void }) {
  const [tab, setTab]                 = useState<"home"|"jobs"|"myjobs"|"chat"|"profile">("home");
  const [accepted, setAccepted]       = useState<number[]>([1]);
  const [chatPartner, setChatPartner] = useState<{ id: string; name: string } | null>(null);
  const [assignedJobs, setAssignedJobs] = useState<ApiBooking[]>([]);

  useEffect(() => {
    fetch(`/api/bookings?workerId=${user.id}`)
      .then(r => r.json())
      .then(setAssignedJobs)
      .catch(() => {});
  }, [user.id]);

  const tabs = [
    { id: "home",    icon: "home",       label: "Inicio"   },
    { id: "jobs",    icon: "work",       label: "Trabajos" },
    { id: "myjobs",  icon: "task_alt",   label: "Mis Jobs" },
    { id: "chat",    icon: "chat_bubble",label: "Chat"     },
    { id: "profile", icon: "person",     label: "Perfil"   },
  ] as const;

  function acceptJob(id: number) {
    setAccepted(a => a.includes(id) ? a : [...a, id]);
  }
  function completeJob(id: number) {
    setAccepted(a => a.filter(x => x !== id));
  }
  function openChat(id: string, name: string) {
    setChatPartner({ id, name });
    setTab("chat");
  }

  return (
    <div className="min-h-screen bg-[#f9f5ff] sm:bg-gray-200 sm:flex sm:items-center sm:justify-center sm:p-4">
      <div className="w-full sm:max-w-[420px] min-h-screen sm:min-h-0 sm:h-[860px] bg-[#f9f5ff] relative overflow-hidden sm:rounded-[2.5rem] sm:border-[8px] sm:border-gray-800 sm:shadow-2xl flex flex-col">

        {tab === "home"    && <ContractorHome user={user} accepted={accepted} assignedJobs={assignedJobs} onAccept={acceptJob} onOpenChat={openChat} />}
        {tab === "jobs"    && <ContractorJobs accepted={accepted} assignedJobs={assignedJobs} onAccept={acceptJob} onOpenChat={openChat} />}
        {tab === "myjobs"  && <ContractorMyJobs accepted={accepted} assignedJobs={assignedJobs} onComplete={completeJob} onOpenChat={openChat} />}
        {tab === "chat"    && (
          chatPartner
            ? <ChatThread user={user} partnerId={chatPartner.id} partnerName={chatPartner.name} onBack={() => setChatPartner(null)} />
            : <ChatList user={user} contacts={SEED_CLIENT_IDS} onOpen={(id, name) => setChatPartner({ id, name })} />
        )}
        {tab === "profile" && <ContractorProfile user={user} onLogout={onLogout} />}

        <nav className="flex-shrink-0 flex justify-around items-center px-1 pt-2 pb-5 bg-[#2b2a51] z-50" style={{ paddingBottom: "max(20px, env(safe-area-inset-bottom))" }}>
          {tabs.map((t) => {
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => { setTab(t.id); if (t.id !== "chat") setChatPartner(null); }}
                className={`flex flex-col items-center gap-0.5 px-2 py-2 rounded-2xl transition-all duration-200 active:scale-90 ${active ? "bg-[#0546ed] text-white" : "text-[#aaa9d7]"}`}>
                <Icon name={t.icon} className="text-xl" style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }} />
                <span className="text-[9px] font-bold uppercase tracking-widest">{t.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
      <SupportBubble />
    </div>
  );
}

function ContractorHome({ user, accepted, assignedJobs, onAccept, onOpenChat }: { user: UserProfile; accepted: number[]; assignedJobs: ApiBooking[]; onAccept: (id: number) => void; onOpenChat: (id: string, name: string) => void }) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-5 pt-5 pb-4 dark-gradient">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#849aff]">Panel de Contratista</p>
            <h1 className="text-2xl font-black text-white">Hola, {user.name.split(" ")[0]} 👷</h1>
            {user.service && <p className="text-[#e2dfff] text-sm font-semibold">{user.service}</p>}
          </div>
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xl">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[["payments","$0","Ganado hoy"],["task_alt",`${accepted.length + assignedJobs.length}`,"Jobs activos"],["star","5.0","Mi rating"]].map(([icon,val,label]) => (
            <div key={label} className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
              <Icon name={icon} className="text-[#849aff] text-xl mb-1" />
              <p className="text-white font-black text-lg leading-none">{val}</p>
              <p className="text-[#aaa9d7] text-[10px] mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 pb-6 space-y-5 mt-4">
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-extrabold text-[#2b2a51]">Trabajos Disponibles</h3>
            <span className="text-xs text-[#0546ed] font-bold">{SAMPLE_JOBS.length - accepted.length} nuevos</span>
          </div>
          <div className="space-y-3">
            {SAMPLE_JOBS.filter(j => !accepted.includes(j.id)).slice(0, 3).map((job) => (
              <div key={job.id} className="bg-white rounded-2xl p-4 border border-[#e2dfff]/40 card-shadow">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#f2efff] flex items-center justify-center flex-shrink-0">
                    <Icon name={job.icon} className="text-[#514eb6]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <p className="font-bold text-[#2b2a51] text-sm">{job.service}</p>
                      {job.urgent && <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Urgente</span>}
                    </div>
                    <p className="text-xs text-[#585781] mt-0.5">{job.address}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-[#74739e] font-bold">{job.time}</span>
                      <span className="text-[#0546ed] font-black text-sm">{job.budget}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => onAccept(job.id)} className="flex-1 py-2 rounded-full bg-[#0546ed] text-white text-xs font-bold">Aceptar</button>
                  <button onClick={() => onOpenChat(job.clientId, job.clientName)} className="flex-1 py-2 rounded-full bg-[#f2efff] text-[#514eb6] text-xs font-bold flex items-center justify-center gap-1">
                    <Icon name="chat_bubble" className="text-sm" /> Consultar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContractorJobs({ accepted, assignedJobs, onAccept, onOpenChat }: { accepted: number[]; assignedJobs: ApiBooking[]; onAccept: (id: number) => void; onOpenChat: (id: string, name: string) => void }) {
  const [query, setQuery] = useState("");
  const shown = SAMPLE_JOBS.filter(j => !query || j.service.toLowerCase().includes(query.toLowerCase()) || j.address.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="sticky top-0 glass-header px-5 pt-5 pb-3 z-10">
        <h1 className="text-2xl font-black text-[#2b2a51] mb-3">Trabajos Disponibles</h1>
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none"><Icon name="search" className="text-[#849aff]" /></div>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar por servicio o zona..." className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white border border-[#e2dfff] focus:outline-none focus:ring-2 focus:ring-[#0546ed]/30 text-sm text-[#2b2a51] placeholder:text-[#aaa9d7]" />
        </div>
      </div>
      <div className="px-5 pb-6 space-y-4 mt-2">
        {shown.map((job) => {
          const isAccepted = accepted.includes(job.id);
          return (
            <div key={job.id} className="bg-white rounded-2xl p-4 border border-[#e2dfff]/40 card-shadow">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-[#f2efff] flex items-center justify-center flex-shrink-0">
                  <Icon name={job.icon} className="text-[#514eb6] text-2xl" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-[#2b2a51]">{job.service}</p>
                    {job.urgent && <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Urgente</span>}
                  </div>
                  <p className="text-xs text-[#585781] mt-0.5 flex items-center gap-1">
                    <Icon name="location_on" className="text-sm" />{job.address}
                  </p>
                  <p className="text-xs text-[#74739e] mt-0.5 flex items-center gap-1">
                    <Icon name="schedule" className="text-sm" />{job.time}
                  </p>
                </div>
                <span className="text-[#0546ed] font-black text-lg">{job.budget}</span>
              </div>
              <div className="flex gap-2">
                {isAccepted ? (
                  <div className="flex-1 py-2.5 rounded-full bg-[#f2efff] text-[#514eb6] text-xs font-bold text-center flex items-center justify-center gap-1">
                    <Icon name="check_circle" className="text-sm" /> Aceptado
                  </div>
                ) : (
                  <button onClick={() => onAccept(job.id)} className="flex-1 py-2.5 rounded-full bg-[#0546ed] text-white text-xs font-bold">✓ Aceptar Trabajo</button>
                )}
                <button onClick={() => onOpenChat(job.clientId, job.clientName)} className="flex-1 py-2.5 rounded-full bg-[#f2efff] text-[#514eb6] text-xs font-bold flex items-center justify-center gap-1">
                  <Icon name="chat_bubble" className="text-sm" /> Chat
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ContractorMyJobs({ accepted, assignedJobs, onComplete, onOpenChat }: { accepted: number[]; assignedJobs: ApiBooking[]; onComplete: (id: number) => void; onOpenChat: (id: string, name: string) => void }) {
  const totalJobs = accepted.length + assignedJobs.length;
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-5 pt-5 pb-3 glass-header sticky top-0 z-10">
        <h1 className="text-2xl font-black text-[#2b2a51]">Mis Trabajos</h1>
        {totalJobs > 0 && <p className="text-xs text-[#514eb6] font-semibold mt-0.5">{totalJobs} trabajo{totalJobs > 1 ? "s" : ""} activo{totalJobs > 1 ? "s" : ""}</p>}
      </div>
      <div className="px-5 pb-6 space-y-4 mt-2">
        {/* Admin-assigned real jobs */}
        {assignedJobs.length > 0 && (
          <>
            <p className="text-xs font-bold uppercase tracking-widest text-[#0546ed]">Asignados por Admin</p>
            {assignedJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-2xl p-4 border border-[#0546ed]/20 card-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#f2efff] flex items-center justify-center">
                    <Icon name="assignment" className="text-[#514eb6]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[#2b2a51] text-sm">{job.service}</p>
                    <p className="text-xs text-[#585781]">{job.address}</p>
                    <p className="text-xs text-[#74739e]">Cliente: {job.name} · {job.phone}</p>
                  </div>
                  <StatusBadge status="aceptado" />
                </div>
                <div className="flex items-center gap-1 text-xs text-[#74739e] mb-3">
                  <Icon name="calendar_today" className="text-sm" />
                  <span>{job.date}</span>
                </div>
                {job.notes && <p className="text-xs text-[#585781] bg-[#f9f5ff] rounded-xl px-3 py-2 mb-3">{job.notes}</p>}
              </div>
            ))}
          </>
        )}

        {/* Demo accepted jobs */}
        {accepted.length === 0 && assignedJobs.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-[#f2efff] flex items-center justify-center mb-4">
              <Icon name="work_off" className="text-[#849aff] text-4xl" />
            </div>
            <p className="font-bold text-[#2b2a51]">Aún no tienes trabajos activos</p>
            <p className="text-sm text-[#585781] mt-1">El admin te asignará trabajos pronto.</p>
          </div>
        ) : (
          SAMPLE_JOBS.filter(j => accepted.includes(j.id)).map((job) => (
            <div key={job.id} className="bg-white rounded-2xl p-4 border border-[#e2dfff]/40 card-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#f2efff] flex items-center justify-center">
                  <Icon name={job.icon} className="text-[#514eb6]" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[#2b2a51] text-sm">{job.service}</p>
                  <p className="text-xs text-[#585781]">{job.address}</p>
                </div>
                <StatusBadge status="aceptado" />
              </div>
              <div className="flex items-center justify-between text-xs text-[#74739e] mb-3">
                <span className="flex items-center gap-1"><Icon name="schedule" className="text-sm" />{job.time}</span>
                <span className="font-black text-[#0546ed]">{job.budget}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => onOpenChat(job.clientId, job.clientName)} className="flex-1 py-2 rounded-full bg-[#0546ed] text-white text-xs font-bold flex items-center justify-center gap-1">
                  <Icon name="chat_bubble" className="text-sm" /> Chatear
                </button>
                <button onClick={() => onComplete(job.id)} className="flex-1 py-2 rounded-full bg-[#f2efff] text-[#514eb6] text-xs font-bold">Marcar Completado</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ContractorProfile({ user, onLogout }: { user: UserProfile; onLogout: () => void }) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-5 pt-5 pb-4 dark-gradient">
        <div className="flex flex-col items-center py-4">
          <div className="w-24 h-24 rounded-full bg-[#0546ed] flex items-center justify-center text-white text-3xl font-black shadow-lg mb-3 border-4 border-white/20">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-xl font-black text-white">{user.name}</h2>
          <p className="text-sm text-[#849aff] font-semibold">{user.service || "Contratista"}</p>
          <div className="flex gap-1 mt-1"><Stars n={5} /></div>
        </div>
      </div>

      <div className="px-5 pb-6 space-y-4 mt-4">
        <div className="bg-white rounded-2xl p-4 border border-[#e2dfff]/40 space-y-3 card-shadow">
          {[
            { icon:"mail",  label:"Correo",   value: user.email },
            { icon:"phone", label:"Teléfono", value: user.phone },
            { icon:"work",  label:"Servicio", value: user.service || "No especificado" },
          ].map((row) => (
            <div key={row.label} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#f2efff] flex items-center justify-center">
                <Icon name={row.icon} className="text-[#514eb6]" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#74739e]">{row.label}</p>
                <p className="text-sm font-semibold text-[#2b2a51]">{row.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          {[
            ["photo_camera","Mi Portafolio"],
            ["location_on","Mis Zonas de Trabajo"],
            ["payments","Historial de Pagos"],
            ["star_rate","Mis Calificaciones"],
            ["notifications","Notificaciones"],
            ["help","Ayuda y Soporte"],
          ].map(([icon, label]) => (
            <button key={label} className="w-full flex items-center gap-3 p-4 bg-white rounded-2xl border border-[#e2dfff]/40 active:scale-95 transition-transform card-shadow text-left">
              <div className="w-9 h-9 rounded-xl bg-[#f2efff] flex items-center justify-center">
                <Icon name={icon} className="text-[#514eb6]" />
              </div>
              <span className="flex-1 text-left font-semibold text-[#2b2a51] text-sm">{label}</span>
              <Icon name="chevron_right" className="text-[#aaa9d7]" />
            </button>
          ))}
          <button onClick={onLogout} className="w-full flex items-center gap-3 p-4 bg-red-50 rounded-2xl border border-red-100 active:scale-95 transition-transform text-left">
            <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center">
              <Icon name="logout" className="text-red-500" />
            </div>
            <span className="flex-1 text-left font-semibold text-red-500 text-sm">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════ */
/* ════════════════════════════════════════════════════════
   ADMIN DASHBOARD
════════════════════════════════════════════════════════ */
type AdminWorker = { id: string; name: string; phone: string; email: string; service: string; createdAt: string };

function AdminDashboard({ user, onLogout }: { user: UserProfile; onLogout: () => void }) {
  const [tab, setTab]           = useState<"bookings" | "workers" | "profile">("bookings");
  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [workers, setWorkers]   = useState<AdminWorker[]>([]);
  const [loading, setLoading]   = useState(true);
  const [assignModal, setAssignModal] = useState<ApiBooking | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/bookings").then(r => r.json()),
      fetch("/api/workers").then(r => r.json()),
    ]).then(([b, w]) => {
      setBookings((b as ApiBooking[]).sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
      setWorkers(w as AdminWorker[]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function assignWorker(bookingId: string, worker: AdminWorker) {
    const res = await fetch(`/api/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workerId: worker.id, workerName: worker.name }),
    });
    if (res.ok) {
      const updated = await res.json();
      setBookings(bs => bs.map(b => b.id === bookingId ? updated as ApiBooking : b));
    }
    setAssignModal(null);
  }

  const adminTabs = [
    { id: "bookings", icon: "calendar_today", label: "Reservas" },
    { id: "workers",  icon: "construction",   label: "Trabajadores" },
    { id: "profile",  icon: "person",         label: "Perfil" },
  ] as const;

  return (
    <div className="min-h-screen bg-[#f9f5ff] sm:bg-gray-200 sm:flex sm:items-center sm:justify-center sm:p-4">
      <div className="w-full sm:max-w-[420px] min-h-screen sm:min-h-0 sm:h-[860px] bg-[#f9f5ff] relative overflow-hidden sm:rounded-[2.5rem] sm:border-[8px] sm:border-gray-800 sm:shadow-2xl flex flex-col">

        {tab === "bookings" && (
          <div className="flex-1 overflow-y-auto">
            <div className="sticky top-0 glass-header px-5 pt-5 pb-3 z-10">
              <p className="text-xs font-bold uppercase tracking-widest text-[#514eb6]">Panel de Admin</p>
              <h1 className="text-2xl font-black text-[#2b2a51]">Reservas</h1>
              <p className="text-xs text-[#585781] mt-0.5">{bookings.filter(b => b.status === "pending").length} pendientes</p>
            </div>
            <div className="px-5 pb-6 space-y-3 mt-2">
              {loading && <p className="text-center text-[#585781] py-8 text-sm">Cargando...</p>}
              {!loading && bookings.length === 0 && (
                <div className="flex flex-col items-center py-16 text-center">
                  <Icon name="inbox" className="text-5xl text-[#aaa9d7] mb-3" />
                  <p className="font-bold text-[#2b2a51]">Sin reservas aun</p>
                  <p className="text-sm text-[#585781] mt-1">Las reservas de clientes apareceran aqui.</p>
                </div>
              )}
              {bookings.map((b) => (
                <div key={b.id} className="bg-white rounded-2xl p-4 border border-[#e2dfff]/40 card-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-bold text-[#2b2a51] text-sm">{b.service}</p>
                      <p className="text-xs text-[#585781]">{b.name} - {b.phone}</p>
                    </div>
                    <StatusBadge status={b.status === "assigned" ? "aceptado" : b.status === "completed" ? "completado" : "pendiente"} />
                  </div>
                  <p className="text-xs text-[#74739e] flex items-center gap-1 mb-1">
                    <Icon name="location_on" className="text-sm" />{b.address}
                  </p>
                  <p className="text-xs text-[#74739e] flex items-center gap-1 mb-2">
                    <Icon name="calendar_today" className="text-sm" />{b.date}
                  </p>
                  {b.workerName && (
                    <p className="text-xs text-[#0546ed] font-semibold mb-2">Asignado a: {b.workerName}</p>
                  )}
                  {b.status === "pending" && (
                    <button onClick={() => setAssignModal(b)} className="w-full py-2 rounded-full bg-[#0546ed] text-white text-xs font-bold mt-1">
                      Asignar Trabajador
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "workers" && (
          <div className="flex-1 overflow-y-auto">
            <div className="sticky top-0 glass-header px-5 pt-5 pb-3 z-10">
              <h1 className="text-2xl font-black text-[#2b2a51]">Trabajadores</h1>
              <p className="text-xs text-[#585781] mt-0.5">{workers.length} registrados</p>
            </div>
            <div className="px-5 pb-6 space-y-3 mt-2">
              {loading && <p className="text-center text-[#585781] py-8 text-sm">Cargando...</p>}
              {!loading && workers.length === 0 && (
                <div className="flex flex-col items-center py-16 text-center">
                  <Icon name="group" className="text-5xl text-[#aaa9d7] mb-3" />
                  <p className="font-bold text-[#2b2a51]">Sin trabajadores aun</p>
                  <p className="text-sm text-[#585781] mt-1">Los contratistas registrados apareceran aqui.</p>
                </div>
              )}
              {workers.map((w) => (
                <div key={w.id} className="bg-white rounded-2xl p-4 border border-[#e2dfff]/40 card-shadow flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0546ed] to-[#849aff] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {w.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#2b2a51] text-sm truncate">{w.name}</p>
                    <p className="text-xs text-[#514eb6] font-semibold truncate">{w.service}</p>
                    <p className="text-xs text-[#585781] truncate">{w.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "profile" && (
          <div className="flex-1 overflow-y-auto">
            <div className="px-5 pt-5 pb-3 glass-header sticky top-0 z-10">
              <h1 className="text-2xl font-black text-[#2b2a51]">Perfil Admin</h1>
            </div>
            <div className="px-5 pb-6 space-y-6 mt-4">
              <div className="flex flex-col items-center py-4">
                <div className="w-24 h-24 rounded-full primary-gradient flex items-center justify-center text-white text-3xl font-black shadow-lg mb-3">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-black text-[#2b2a51]">{user.name}</h2>
                <p className="text-sm text-[#514eb6] font-semibold">Administrador</p>
              </div>
              <button onClick={onLogout} className="w-full flex items-center gap-3 p-4 bg-red-50 rounded-2xl border border-red-100 active:scale-95 transition-transform text-left">
                <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center">
                  <Icon name="logout" className="text-red-500" />
                </div>
                <span className="flex-1 font-semibold text-red-500 text-sm">Cerrar Sesion</span>
              </button>
            </div>
          </div>
        )}

        {assignModal && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center" style={{ background: "rgba(43,42,81,0.65)" }} onClick={() => setAssignModal(null)}>
            <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[70vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="px-5 pt-5 pb-3 border-b border-[#e2dfff]">
                <h2 className="text-lg font-black text-[#2b2a51]">Asignar Trabajador</h2>
                <p className="text-xs text-[#585781] mt-0.5">Para: {assignModal.service}</p>
              </div>
              <div className="px-5 py-3 space-y-2">
                {workers.length === 0 && <p className="text-sm text-[#585781] py-4 text-center">Sin trabajadores registrados.</p>}
                {workers.map((w) => (
                  <button key={w.id} onClick={() => assignWorker(assignModal.id, w)}
                    className="w-full flex items-center gap-3 p-3 bg-[#f9f5ff] rounded-2xl border border-[#e2dfff] active:scale-[.98] transition-transform text-left">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0546ed] to-[#849aff] flex items-center justify-center text-white font-bold flex-shrink-0">
                      {w.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-[#2b2a51] text-sm">{w.name}</p>
                      <p className="text-xs text-[#514eb6] font-semibold">{w.service}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="px-5 py-3 border-t border-[#e2dfff]">
                <button onClick={() => setAssignModal(null)} className="w-full py-3 rounded-full bg-[#f2efff] text-[#514eb6] font-bold text-sm">Cancelar</button>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-shrink-0 flex justify-around items-center px-1 pt-2 pb-5 bg-white border-t border-[#e2dfff] z-50" style={{ paddingBottom: "max(20px, env(safe-area-inset-bottom))" }}>
          {adminTabs.map((t) => {
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex flex-col items-center gap-0.5 px-2 py-2 rounded-2xl transition-all duration-200 active:scale-90 ${active ? "bg-[#f2efff] text-[#0546ed]" : "text-[#74739e]"}`}>
                <Icon name={t.icon} className="text-xl" style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }} />
                <span className="text-[9px] font-bold uppercase tracking-widest">{t.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
      <SupportBubble />
    </div>
  );
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [user, setUser]     = useState<UserProfile | null>(null);
  const [ready, setReady]   = useState(false);

  useEffect(() => {
    // Seed hardcoded admin account if absent
    const users = getUsers();
    if (!users.find((u: UserProfile) => u.id === "admin_seed")) {
      saveUsers([...users, {
        id: "admin_seed",
        name: "Admin TodoClean",
        email: "admin@todoclean.app",
        password: "Admin2024!",
        type: "admin" as const,
        phone: "",
        createdAt: new Date().toISOString(),
      }]);
    }

    const saved = getSession();
    if (saved) {
      setUser(saved);
      if (saved.type === "admin") setScreen("admin");
      else if (saved.type === "client") setScreen("client");
      else setScreen("contractor");
      if (saved.type !== "admin") seedChatIfEmpty(saved.id, saved.type as "client" | "contractor");
    }
    setReady(true);
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  function handleGoTo(s: Screen, u?: UserProfile) {
    if (u) {
      setUser(u);
      if (u.type !== "admin") seedChatIfEmpty(u.id, u.type as "client" | "contractor");
    }
    setScreen(s);
  }

  function handleLogout() {
    clearSession();
    setUser(null);
    setScreen("landing");
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f5ff]">
        <div className="flex flex-col items-center gap-4">
          <img src="/todoclean-logo.png" alt="TodoClean" className="h-14 w-auto animate-pulse" />
          <div className="w-8 h-8 border-4 border-[#0546ed] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (screen === "client"     && user) return <ClientDashboard     user={user} onLogout={handleLogout} />;
  if (screen === "contractor" && user) return <ContractorDashboard user={user} onLogout={handleLogout} />;
  if (screen === "admin"      && user) return <AdminDashboard      user={user} onLogout={handleLogout} />;
  return <LandingPage onGoTo={handleGoTo} />;
}
