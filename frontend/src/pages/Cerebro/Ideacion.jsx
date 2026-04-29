import { useState, useRef, useEffect } from 'react';
import { Target, Send, Bot, User, RefreshCw, PenTool } from 'lucide-react';
import { useMarca } from '../../hooks/useMarca';
import { useNavigate } from 'react-router-dom';

export default function Ideacion() {
  const { marca } = useMarca();
  const navigate = useNavigate();
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('estratega_messages');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [media, setMedia] = useState(null);
  const [adnProtagonista, setAdnProtagonista] = useState(() => {
    const saved = localStorage.getItem('estratega_adn');
    return saved ? JSON.parse(saved) : null;
  });
  const [fichaId, setFichaId] = useState(() => {
    return localStorage.getItem('estratega_fichaId') || null;
  });
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('estratega_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (adnProtagonista) localStorage.setItem('estratega_adn', JSON.stringify(adnProtagonista));
    else localStorage.removeItem('estratega_adn');
  }, [adnProtagonista]);

  useEffect(() => {
    if (fichaId) localStorage.setItem('estratega_fichaId', fichaId);
    else localStorage.removeItem('estratega_fichaId');
  }, [fichaId]);

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleMediaUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsAnalyzing(true);
    setMedia({ name: file.name, url: URL.createObjectURL(file) });

    try {
      const b64 = await fileToBase64(file);
      const res = await fetch('/api/claude/analizar-producto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagen_base64: b64 }),
      });
      const json = await res.json();
      if (json.success) {
        setAdnProtagonista(json.data);
      }
    } catch (err) {
      console.error('Error analizando producto:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/claude/chat-estratega', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          marca_config: marca || {},
          ficha_id: fichaId,
          adn_protagonista: adnProtagonista
        }),
      });

      if (!res.ok) {
        let errMsg = 'Error en el servidor';
        try { const errData = await res.json(); errMsg = errData.error || errMsg; } catch {}
        throw new Error(errMsg);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      
      let assistantMessage = { role: 'assistant', content: '' };
      setMessages(prev => [...prev, assistantMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(l => l.startsWith('data: '));
        
        for (const line of lines) {
          try {
            const evt = JSON.parse(line.slice(6));
            if (evt.type === 'meta' && evt.ficha_id) {
              setFichaId(evt.ficha_id);
            } else if (evt.type === 'text') {
              assistantMessage.content += evt.text;
              setMessages(prev => {
                const newArr = [...prev];
                newArr[newArr.length - 1] = { ...assistantMessage };
                return newArr;
              });
            }
          } catch { /* ignore */ }
        }
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${e.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Check if ficha is completed
  const lastMessage = messages[messages.length - 1];
  const isCompletada = lastMessage?.role === 'assistant' && lastMessage.content.includes('[FICHA_COMPLETADA]');

  const handleGenerarGuion = () => {
    if (fichaId) {
      navigate(`/pluma?ficha_id=${fichaId}`);
    }
  };

  return (
    <div className="w-full max-w-[1000px] mx-auto h-[calc(100vh-100px)] flex flex-col">
      {/* Header */}
      <div className="mb-[20px] shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-[10px] mb-[4px]">
              <Target size={20} className="text-magenta" />
              <h2 className="font-bebas text-[1.8rem] tracking-[3px] text-text-main">ESTRATEGA</h2>
            </div>
            <p className="font-jetbrains text-[0.7rem] text-muted">
              Consultor IA que te entrevista para construir una Ficha Estratégica sólida.
              {marca?.nombre_marca && <span className="text-magenta ml-[6px]">Marca: {marca.nombre_marca}</span>}
            </p>
          </div>
          
          <div className="flex items-center gap-[10px]">
            {/* Briefing Flash / Product Context */}
            <div className="flex items-center gap-[8px] bg-white border border-border rounded-[10px] p-[6px_12px] shadow-sm">
              <span className="font-jetbrains text-[0.55rem] text-muted uppercase tracking-[1.5px]">Contexto del Protagonista:</span>
              
              {adnProtagonista ? (
                <div className="flex items-center gap-[6px]">
                  <div className="bg-magenta/10 text-magenta px-[8px] py-[3px] rounded-full font-jetbrains text-[0.6rem] font-bold border border-magenta/20">
                    📦 {adnProtagonista.forma}
                  </div>
                  <div className="bg-violet/10 text-violet px-[8px] py-[3px] rounded-full font-jetbrains text-[0.6rem] font-bold border border-violet/20">
                    ✨ {adnProtagonista.material}
                  </div>
                  <button 
                    onClick={() => {setAdnProtagonista(null); setMedia(null);}}
                    className="text-muted hover:text-magenta transition-colors ml-[4px]"
                  >
                    <RefreshCw size={10} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isAnalyzing}
                  className="font-jetbrains text-[0.6rem] text-magenta hover:underline flex items-center gap-[4px] cursor-pointer"
                >
                  {isAnalyzing ? 'Analizando...' : '+ Cargar Producto (Opcional)'}
                </button>
              )}
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleMediaUpload} 
              />
            </div>

            {messages.length > 0 && (
              <button
                onClick={() => {
                  setMessages([]);
                  setFichaId(null);
                  localStorage.removeItem('estratega_messages');
                  localStorage.removeItem('estratega_fichaId');
                }}
                className="font-jetbrains text-[0.6rem] text-muted border border-border rounded-[6px] px-[9px] py-[5px] hover:text-red hover:border-red/50 transition-all cursor-pointer bg-white flex items-center gap-[5px]"
              >
                <RefreshCw size={11} /> Reiniciar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-[#f7f7fa] border border-border rounded-[14px] flex flex-col min-h-0 overflow-hidden shadow-sm">
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-[20px] space-y-[20px] scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-[16px] opacity-60">
              <div className="w-[60px] h-[60px] rounded-full bg-magenta/10 flex items-center justify-center">
                <Bot size={30} className="text-magenta" />
              </div>
              <div className="font-jetbrains text-[0.8rem] text-text-main max-w-[400px]">
                ¡Hola! Soy tu Estratega de Contenido.<br/><br/>
                {adnProtagonista ? (
                  <span className="text-magenta">He analizado tu <b>{adnProtagonista.forma} ({adnProtagonista.material})</b>.</span>
                ) : (
                  <span>Cuéntame una idea vaga que tengas en mente.</span>
                )}
                <br/>Te haré preguntas estratégicas basadas en tu producto hasta construir el ángulo perfecto.
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const content = msg.content.replace('[FICHA_COMPLETADA]', '');
              
              return (
                <div key={idx} className={`flex gap-[12px] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-[32px] h-[32px] rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === 'user' ? 'bg-white border border-border' : 'bg-magenta text-white shadow-md'
                  }`}>
                    {msg.role === 'user' ? <User size={16} className="text-text-main" /> : <Bot size={16} />}
                  </div>
                  <div className={`max-w-[80%] rounded-[12px] px-[16px] py-[12px] ${
                    msg.role === 'user' 
                      ? 'bg-white border border-border text-text-main shadow-sm' 
                      : 'bg-[var(--magenta-soft,#ffe6ff)] border border-magenta text-text-main shadow-sm'
                  }`}>
                    <div className="prose prose-sm max-w-none font-jetbrains text-[0.78rem] leading-relaxed whitespace-pre-wrap">
                      {content}
                      {isLoading && idx === messages.length - 1 && msg.role === 'assistant' && !isCompletada && (
                        <span className="inline-block w-[6px] h-[12px] bg-magenta ml-[4px] animate-pulse align-middle" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-[16px] border-t border-border-soft bg-white">
          {isCompletada ? (
            <button
              onClick={handleGenerarGuion}
              className="w-full flex justify-center items-center gap-[7px] bg-magenta text-white font-bebas text-[1.2rem] tracking-[1.5px] px-[20px] py-[14px] rounded-[9px] cursor-pointer hover:bg-magenta-bright transition-all shadow-[0_4px_14px_rgba(204,0,204,0.2)]"
            >
              <PenTool size={18} /> GENERAR GUION CON ESTA FICHA
            </button>
          ) : (
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu idea aquí (Shift + Enter para nueva línea)..."
                className="w-full input-base pr-[50px] resize-none overflow-hidden bg-[#f7f7fa]"
                rows={Math.min(5, input.split('\n').length || 1)}
                style={{ minHeight: '44px' }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-[6px] bottom-[6px] w-[32px] h-[32px] flex items-center justify-center rounded-[8px] bg-magenta text-white cursor-pointer hover:bg-magenta-bright transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={14} className="mr-[2px]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
