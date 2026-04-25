/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Bike, 
  MapPin, 
  Cpu, 
  ShieldAlert, 
  ChevronRight, 
  Loader2,
  HardHat,
  Construction,
  BookOpen,
  Zap,
  Battery,
  AlertTriangle,
  Map as MapIcon
} from 'lucide-react';

interface Part {
  text: string;
}

interface Message {
  role: 'user' | 'model';
  parts: Part[];
}

function TypewriterText({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[index]);
        setIndex(prev => prev + 1);
      }, 15); // Velocidad del efecto
      return () => clearTimeout(timeout);
    }
  }, [index, text]);

  return <>{displayedText}</>;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      parts: [{ text: input.trim() }]
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      // Verificar si la respuesta es realmente JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("El servidor no devolvió una respuesta válida (código " + response.status + ")");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error desconocido en el servidor');
      }

      setMessages(prev => [...prev, {
        role: 'model',
        parts: [{ text: data.text }]
      }]);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      setMessages(prev => [...prev, {
        role: 'model',
        parts: [{ text: "¡Atención Ingeniero! Parece que tenemos interferencias en la red de Torrelavega. Por favor, inténtalo de nuevo en unos segundos." }]
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden relative">
      {/* Top Navigation Bar */}
      <nav className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-sm shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center shadow-lg shadow-sky-200 text-white">
            <Bike size={24} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-800">
              Bici-IA <span className="text-sky-500">|</span> <span className="font-medium opacity-70">Misión Torrelavega</span>
            </h1>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Enlace de Ingeniería Activo</span>
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <button className="px-4 py-2 bg-slate-900 text-white rounded-full text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm">
            Finalizar Auditoría
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden p-6 gap-6 z-10">
        
        {/* Left Sidebar: Project Status */}
        <aside className="hidden lg:flex w-80 flex-col gap-4 shrink-0">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm"
          >
            <h2 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-4 flex items-center gap-2">
              <BookOpen size={14} /> Cuaderno de Campo
            </h2>
            <div className="space-y-4">
              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-100">
                <p className="text-xs font-semibold text-sky-800 mb-1">Fase Actual</p>
                <p className="text-sm text-sky-900 font-medium">01. Auditoría de Seguridad Vial</p>
              </div>
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-medium text-slate-500">Progreso Misión</span>
                <span className="text-xs font-bold text-slate-800">45%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "45%" }}
                  className="bg-sky-500 h-full"
                ></motion.div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex-1 overflow-y-auto scrollbar-hide"
          >
            <h2 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-4 flex items-center gap-2">
              <Zap size={14} /> Hardware Tale-Bot
            </h2>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
                  <Cpu size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-700">Makey Makey</span>
                  <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-tight flex items-center gap-1">
                    <span className="w-1 h-1 bg-emerald-500 rounded-full"></span> Conectado
                  </span>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-sm">
                  <Battery size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-700">Tale-Bot Pro</span>
                  <span className="text-[10px] text-amber-600 font-bold uppercase tracking-tight">Carga: 82%</span>
                </div>
              </li>
              <li className="flex items-center gap-3 grayscale opacity-60">
                <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                  <AlertTriangle size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold">Sensores Ultra</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Desactivado</span>
                </div>
              </li>
            </ul>
            <div className="mt-8 border-t border-slate-100 pt-4">
              <p className="text-[10px] text-slate-400 font-medium italic leading-relaxed">
                Recordatorio Ingeniero: En nuestra maqueta, 15cm = 1 tramo de calle real en Torrelavega.
              </p>
            </div>
          </motion.div>
        </aside>

        {/* Center Section: Chat Interface */}
        <section className="flex-1 flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
          
          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
            {messages.length === 0 ? (
              <div className="max-w-2xl mx-auto text-center space-y-8 pt-12">
                <div className="relative inline-block mt-4">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-24 h-24 bg-sky-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-sky-200 text-white relative z-10"
                  >
                    <Bike size={48} />
                  </motion.div>
                  <div className="absolute -bottom-2 -right-2 bg-amber-400 p-2 rounded-xl shadow-lg z-20 border-2 border-white">
                    <Construction size={24} className="text-amber-900" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h2 className="text-2xl font-bold text-slate-800 tracking-tight">¡Bienvenidos Equipo de Ingeniería!</h2>
                  <p className="text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
                    Soy vuestra Bici-IA. Estamos en la estación central listos para auditar <span className="text-sky-600 font-bold">Torrelavega</span>.
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                  {["Calle José María Pereda", "Cruce Cuatro Caminos", "Nueva Ciudad"].map((loc) => (
                    <button 
                      key={loc}
                      onClick={() => setInput(`Estamos investigando ${loc}.`)}
                      className="px-6 py-3 bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-200 rounded-2xl text-sm font-semibold text-slate-600 hover:text-sky-700 transition-all flex items-center gap-2 group"
                    >
                      <MapPin size={14} className="text-slate-400 group-hover:text-sky-500" />
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-6 mb-4">
                <AnimatePresence mode="popLayout">
                  {messages.map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center shadow-md text-white text-[10px] font-bold ${
                          m.role === 'user' ? 'bg-slate-800' : 'bg-sky-600'
                        }`}>
                          {m.role === 'user' ? 'U' : 'B'}
                        </div>
                        <div className={`p-4 rounded-2xl shadow-sm leading-relaxed text-sm ${
                          m.role === 'user' 
                            ? 'bg-sky-600 text-white rounded-tr-none shadow-sky-100' 
                            : 'bg-slate-100 text-slate-800 rounded-tl-none'
                        }`}>
                          <p className="whitespace-pre-wrap">
                            {m.role === 'user' ? m.parts[0].text : <TypewriterText text={m.parts[0].text} />}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={chatEndRef} />
              </div>
            )}

            {isLoading && (
              <div className="flex items-start gap-3 max-w-3xl mx-auto">
                <div className="w-8 h-8 bg-sky-600 rounded-full shrink-0 flex items-center justify-center shadow-md text-white text-[10px] font-bold">
                  B
                </div>
                <div className="flex items-center gap-3 px-5 py-3 bg-slate-50 rounded-full border border-slate-100 shadow-sm">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Analizando vulnerabilidades...</span>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input Area */}
          <div className="p-6 pt-0 shrink-0 border-t border-slate-50 pt-6">
            <div className="relative flex items-center max-w-3xl mx-auto">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Informa a la Central de Ingeniería..." 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 pr-32 text-sm font-medium focus:outline-none focus:border-sky-300 focus:bg-white transition-all placeholder:text-slate-400" 
              />
              <div className="absolute right-2 flex items-center gap-2">
                <button 
                  onClick={handleSend}
                  className="px-5 py-2.5 bg-sky-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-200 hover:bg-sky-700 active:scale-95 transition-all flex items-center gap-2"
                >
                  ENVIAR <Send size={12} />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Info (Mobile/Small Screens Only) */}
      <footer className="lg:hidden h-8 bg-white border-t border-slate-200 flex items-center justify-center px-4 text-[9px] font-extrabold uppercase tracking-[0.2em] text-slate-400">
        Torrelavega 2026 • Auditoría Vial en Curso
      </footer>
    </div>
  );
}
