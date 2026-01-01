import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Copy, Check, RefreshCw, Trash2, Download, Moon, Sun, Zap, Code, Sparkles, MessageSquare, TrendingUp, Settings } from 'lucide-react';

// Configuration
const URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAFbl6IXiQYc80-75G2Uzcht0o4Q3JDC18";
const RATE_LIMIT_DELAY = 6000;
const MAX_RETRIES = 3;


// Particle Animation Component
function ParticleBackground({ darkMode }) {
    const canvasRef = useRef(null);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        const particles = [];
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 1.5 + 0.5
            });
        }
        
        function animate() {
            ctx.fillStyle = darkMode ? 'rgba(13, 17, 23, 0.1)' : 'rgba(249, 250, 251, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
                
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = darkMode ? 'rgba(6, 182, 212, 0.3)' : 'rgba(37, 99, 235, 0.3)';
                ctx.fill();
            });
            
            requestAnimationFrame(animate);
        }
        
        animate();
    }, [darkMode]);
    
    return <canvas ref={canvasRef} className='absolute inset-0 pointer-events-none' />;
}

// Advanced Answer Component with Syntax Highlighting
function AdvancedAnswer({ text, darkMode }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatText = (str) => {
        // Multi-line code blocks with language detection
        if (str.trim().startsWith('```')) {
            const lines = str.trim().split('\n');
            const language = lines[0].replace('```', '') || 'code';
            const code = lines.slice(1, -1).join('\n');
            
            return (
                <div className='relative group'>
                    <div className={`absolute top-2 right-2 text-[10px] px-2 py-1 rounded ${darkMode ? 'bg-gray-900 text-cyan-400' : 'bg-gray-200 text-blue-600'}`}>
                        {language}
                    </div>
                    <pre className={`${darkMode ? 'bg-black/60 border-cyan-500/20' : 'bg-gray-900 border-blue-500/20'} border-2 rounded-xl p-5 overflow-x-auto backdrop-blur-sm`}>
                        <code className={`text-sm ${darkMode ? 'text-cyan-300' : 'text-emerald-400'} font-mono`}>{code}</code>
                    </pre>
                </div>
            );
        }

        // Inline code
        if (str.includes('`')) {
            const parts = str.split('`');
            return (
                <p className='text-[15px] leading-relaxed'>
                    {parts.map((part, i) => 
                        i % 2 === 0 ? part : (
                            <code key={i} className={`${darkMode ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-blue-100 text-blue-700 border-blue-300'} border px-2 py-0.5 rounded-md text-sm font-mono`}>
                                {part}
                            </code>
                        )
                    )}
                </p>
            );
        }

        // Bold and italic
        let formatted = str;
        if (str.includes('**')) {
            const parts = str.split('**');
            return (
                <p className='text-[15px] leading-relaxed'>
                    {parts.map((part, i) => 
                        i % 2 === 0 ? part : (
                            <strong key={i} className={`font-bold ${darkMode ? 'text-cyan-300' : 'text-blue-600'}`}>
                                {part}
                            </strong>
                        )
                    )}
                </p>
            );
        }

        // Bullet points
        if (str.trim().startsWith('* ') || str.trim().startsWith('- ')) {
            return (
                <li className='ml-4 text-[15px] leading-relaxed flex items-start gap-2'>
                    <span className={`${darkMode ? 'text-cyan-400' : 'text-blue-500'} mt-1.5`}>▹</span>
                    <span>{str.replace(/^[*-]\s/, '')}</span>
                </li>
            );
        }

        // Numbered lists
        if (/^\d+\.\s/.test(str.trim())) {
            return (
                <li className='ml-4 text-[15px] leading-relaxed flex items-start gap-2'>
                    <span className={`${darkMode ? 'text-cyan-400' : 'text-blue-500'} font-mono text-sm mt-0.5`}>
                        {str.match(/^\d+/)[0]}.
                    </span>
                    <span>{str.replace(/^\d+\.\s/, '')}</span>
                </li>
            );
        }

        // Headers
        if (str.startsWith('# ')) {
            return (
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mt-6 mb-3 flex items-center gap-2`}>
                    <Sparkles size={20} className={darkMode ? 'text-cyan-400' : 'text-blue-500'} />
                    {str.replace('# ', '')}
                </h3>
            );
        }

        return <p className='text-[15px] leading-relaxed'>{str}</p>;
    };

    return (
        <div className='space-y-2 relative group'>
            {formatText(text)}
            <button
                onClick={handleCopy}
                className={`absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-all p-2.5 ${darkMode ? 'bg-gray-800/90 hover:bg-gray-700' : 'bg-white/90 hover:bg-gray-100'} rounded-lg shadow-lg backdrop-blur-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                title='Copy text'
            >
                {copied ? (
                    <Check size={14} className='text-green-400' />
                ) : (
                    <Copy size={14} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
                )}
            </button>
        </div>
    );
}

function API() {
    // State Management
    const [question, setQuestion] = useState('');
    const [result, setResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [recentHistory, setRecentHistory] = useState([]);
    const [darkMode, setDarkMode] = useState(true);
    const [streamingText, setStreamingText] = useState('');
    const [retryCount, setRetryCount] = useState(0);
    const [stats, setStats] = useState({ totalMessages: 0, totalTokens: 0, avgResponseTime: 0 });
    const [showSettings, setShowSettings] = useState(false);
    const [typingSpeed, setTypingSpeed] = useState(30);

    const scrollRef = useRef(null);
    const inputRef = useRef(null);
    const lastRequestTime = useRef(0);

    // Load history and stats
    useEffect(() => {
        const savedHistory = sessionStorage.getItem("gemini_history");
        const savedStats = sessionStorage.getItem("gemini_stats");
        
        if (savedHistory) {
            try {
                const parsed = JSON.parse(savedHistory);
                if (Array.isArray(parsed)) setRecentHistory(parsed);
            } catch (e) {
                console.error("History corrupted");
            }
        }

        if (savedStats) {
            try {
                setStats(JSON.parse(savedStats));
            } catch (e) {
                console.error("Stats corrupted");
            }
        }
    }, []);

    // Auto scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [result, loading, streamingText]);

    const updateHistory = useCallback((q) => {
        const newHistory = [q, ...recentHistory.filter(item => item !== q)].slice(0, 20);
        setRecentHistory(newHistory);
        sessionStorage.setItem("gemini_history", JSON.stringify(newHistory));
    }, [recentHistory]);

    const updateStats = useCallback((tokens, responseTime) => {
        const newStats = {
            totalMessages: stats.totalMessages + 1,
            totalTokens: stats.totalTokens + tokens,
            avgResponseTime: stats.avgResponseTime === 0 
                ? responseTime 
                : (stats.avgResponseTime + responseTime) / 2
        };
        setStats(newStats);
        sessionStorage.setItem("gemini_stats", JSON.stringify(newStats));
    }, [stats]);

    const clearAllData = () => {
        setResult([]);
        setRecentHistory([]);
        setStats({ totalMessages: 0, totalTokens: 0, avgResponseTime: 0 });
        sessionStorage.clear();
        setQuestion('');
        setError(null);
    };

    const exportChat = () => {
        const chatText = result.map(msg => {
            if (msg.type === 'user') return `USER: ${msg.text}`;
            if (msg.type === 'ai') return `AI: ${msg.text.join('\n')}`;
            return '';
        }).join('\n\n');

        const blob = new Blob([chatText], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `askai-chat-${Date.now()}.txt`;
        a.click();
    };

   const fetchWithRetry = async (url, options, attempt = 1) => {
    try {
        const response = await fetch(url, options);

        if (response.status === 429) {
            if (attempt >= MAX_RETRIES) {
                throw new Error("API Limit Reached. Please wait 1 minute before trying again.");
            }

            // Exponential backoff: 2s, 4s, 8s...
            const waitTime = Math.pow(2, attempt) * 2000; 
            setRetryCount(attempt);
            
            await new Promise(resolve => setTimeout(resolve, waitTime));
            return fetchWithRetry(url, options, attempt + 1);
        }
        return response;
    } catch (err) {
        throw err;
    }
};

    const handleAsk = async () => {
        if (!question.trim() || loading) return;

        const now = Date.now();
        const timeSinceLastRequest = now - lastRequestTime.current;
        
        if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
            const waitTime = Math.ceil((RATE_LIMIT_DELAY - timeSinceLastRequest) / 1000);
            setError(`Please wait ${waitTime} seconds between requests to avoid rate limits.`);
            return;
        }

        const startTime = Date.now();
        lastRequestTime.current = now;
        const userQ = question.trim();
        setQuestion('');
        setLoading(true);
        setError(null);
        setStreamingText('');

        setResult(prev => [...prev, { type: "user", text: userQ, timestamp: new Date() }]);

        try {
            const response = await fetchWithRetry(URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: userQ }] }]
                })
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response found.";

            // Streaming effect
            const words = aiText.split(' ');
            let currentText = '';
            
            for (let i = 0; i < words.length; i++) {
                currentText += (i > 0 ? ' ' : '') + words[i];
                setStreamingText(currentText);
                await new Promise(resolve => setTimeout(resolve, typingSpeed));
            }

            const formatted = aiText.split('\n').filter(line => line.trim() !== "");
            const responseTime = Date.now() - startTime;

            setResult(prev => [...prev, { 
                type: "ai", 
                text: formatted, 
                timestamp: new Date(),
                tokens: Math.ceil(aiText.length / 4),
                responseTime
            }]);

            updateHistory(userQ);
            updateStats(Math.ceil(aiText.length / 4), responseTime);
            setStreamingText('');

        } catch (err) {
            setError(err.message || "Connection lost. Please try again.");
            setResult(prev => [...prev, { 
                type: "error", 
                text: err.message,
                timestamp: new Date()
            }]);
        } finally {
            setLoading(false);
            inputRef.current?.focus();
        }
    };

    const regenerateResponse = async () => {
        if (result.length < 2) return;
        
        const lastUserMsg = result.slice().reverse().find(msg => msg.type === 'user');
        if (!lastUserMsg) return;

        // Remove last AI response
        setResult(prev => prev.filter((_, i) => i !== prev.length - 1));
        setQuestion(lastUserMsg.text);
        setTimeout(() => handleAsk(), 100);
    };

    return (
        <div className={`flex h-screen ${darkMode ? 'bg-gradient-to-br from-[#0d1117] via-[#1a1f2e] to-[#0d1117]' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50'} text-gray-200 font-sans overflow-hidden transition-all duration-500 relative`}>
            
            {/* Animated Background */}
            <ParticleBackground darkMode={darkMode} />
            
            {/* Sidebar */}
            <aside className={`w-80 ${darkMode ? 'bg-black/40 border-cyan-500/10' : 'bg-white/40 border-blue-500/10'} border-r flex flex-col backdrop-blur-xl transition-all duration-300 relative z-10`}>
                {/* Glow effect */}
                <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-b from-cyan-500/5 to-transparent' : 'bg-gradient-to-b from-blue-500/5 to-transparent'} pointer-events-none`} />
                
                <div className='p-4 space-y-3 relative z-10'>
                    <button 
                        onClick={() => { setResult([]); setQuestion(''); setError(null); }}
                        className={`w-full flex items-center justify-center gap-2 p-3 border-2 ${darkMode ? 'border-cyan-500/30 hover:border-cyan-500/50 hover:bg-cyan-500/5' : 'border-blue-500/30 hover:border-blue-500/50 hover:bg-blue-500/5'} rounded-xl transition-all text-sm font-semibold backdrop-blur-sm group`}
                    >
                        <Sparkles size={18} className='group-hover:rotate-12 transition-transform' />
                        New Conversation
                    </button>

                    <div className='flex gap-2'>
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`flex-1 p-3 rounded-xl ${darkMode ? 'bg-gradient-to-br from-cyan-600 to-blue-600 shadow-lg shadow-cyan-500/20' : 'bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-500/20'} transition-all hover:scale-105`}
                            title='Toggle theme'
                        >
                            {darkMode ? <Sun size={18} className='text-yellow-300' /> : <Moon size={18} className='text-white' />}
                        </button>
                        <button
                            onClick={exportChat}
                            disabled={result.length === 0}
                            className={`flex-1 p-3 rounded-xl ${darkMode ? 'bg-gray-800/50 hover:bg-gray-700/50' : 'bg-white/50 hover:bg-white/70'} disabled:opacity-30 transition-all backdrop-blur-sm`}
                            title='Export chat'
                        >
                            <Download size={18} className={darkMode ? 'text-cyan-400' : 'text-blue-600'} />
                        </button>
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className={`flex-1 p-3 rounded-xl ${darkMode ? 'bg-gray-800/50 hover:bg-gray-700/50' : 'bg-white/50 hover:bg-white/70'} transition-all backdrop-blur-sm`}
                            title='Settings'
                        >
                            <Settings size={18} className={darkMode ? 'text-cyan-400' : 'text-blue-600'} />
                        </button>
                        <button
                            onClick={clearAllData}
                            className={`flex-1 p-3 rounded-xl ${darkMode ? 'bg-red-500/10 hover:bg-red-500/20 border border-red-500/20' : 'bg-red-100 hover:bg-red-200'} transition-all`}
                            title='Clear all'
                        >
                            <Trash2 size={18} className='text-red-400' />
                        </button>
                    </div>
                </div>

                {/* Settings Panel */}
                {showSettings && (
                    <div className={`mx-4 p-4 rounded-xl ${darkMode ? 'bg-gray-900/60 border border-cyan-500/20' : 'bg-white/60 border border-blue-500/20'} backdrop-blur-sm`}>
                        <p className='text-xs font-semibold mb-3 flex items-center gap-2'>
                            <Zap size={14} className={darkMode ? 'text-cyan-400' : 'text-blue-600'} />
                            Typing Speed
                        </p>
                        <input 
                            type='range' 
                            min='10' 
                            max='100' 
                            value={typingSpeed} 
                            onChange={(e) => setTypingSpeed(Number(e.target.value))}
                            className='w-full'
                        />
                        <p className='text-[10px] text-gray-500 mt-1'>{typingSpeed}ms per word</p>
                    </div>
                )}

                {/* Enhanced Stats */}
                <div className={`mx-4 p-4 rounded-xl ${darkMode ? 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20' : 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20'} text-xs space-y-3 backdrop-blur-sm`}>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                            <MessageSquare size={14} className={darkMode ? 'text-cyan-400' : 'text-blue-600'} />
                            <span className='text-gray-500'>Messages</span>
                        </div>
                        <span className={`font-mono font-bold ${darkMode ? 'text-cyan-300' : 'text-blue-600'}`}>{stats.totalMessages}</span>
                    </div>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                            <Code size={14} className={darkMode ? 'text-cyan-400' : 'text-blue-600'} />
                            <span className='text-gray-500'>Tokens</span>
                        </div>
                        <span className={`font-mono font-bold ${darkMode ? 'text-cyan-300' : 'text-blue-600'}`}>{stats.totalTokens.toLocaleString()}</span>
                    </div>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                            <TrendingUp size={14} className={darkMode ? 'text-cyan-400' : 'text-blue-600'} />
                            <span className='text-gray-500'>Avg Time</span>
                        </div>
                        <span className={`font-mono font-bold ${darkMode ? 'text-cyan-300' : 'text-blue-600'}`}>
                            {stats.avgResponseTime > 0 ? `${(stats.avgResponseTime / 1000).toFixed(1)}s` : '-'}
                        </span>
                    </div>
                </div>
                
                {/* History */}
                <div className='flex-1 overflow-y-auto px-3 mt-4 space-y-1 scrollbar-thin'>
                    <p className={`text-[10px] uppercase tracking-widest ${darkMode ? 'text-cyan-400/70' : 'text-blue-600/70'} font-bold px-2 mb-3 flex items-center gap-2`}>
                        <div className={`w-1 h-1 rounded-full ${darkMode ? 'bg-cyan-400' : 'bg-blue-600'} animate-pulse`} />
                        Recent ({recentHistory.length})
                    </p>
                    {recentHistory.map((h, i) => (
                        <div 
                            key={i} 
                            onClick={() => setQuestion(h)}
                            className={`p-3 text-sm rounded-xl ${darkMode ? 'hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20' : 'hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20'} cursor-pointer truncate transition-all group backdrop-blur-sm`}
                        >
                            <span className='opacity-50 group-hover:opacity-100 mr-2'>💬</span>
                            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{h}</span>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Main Chat */}
            <main className='flex-1 flex flex-col relative z-10'>
                
                {/* Header */}
                <header className={`h-20 border-b ${darkMode ? 'border-cyan-500/10 bg-black/20' : 'border-blue-500/10 bg-white/20'} backdrop-blur-xl flex items-center justify-between px-6 relative`}>
                    <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-r from-cyan-500/5 via-transparent to-blue-500/5' : 'bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5'}`} />
                    
                    <div className='flex items-center gap-4 relative z-10'>
                        <div className={`w-12 h-12 bg-gradient-to-tr ${darkMode ? 'from-cyan-500 via-blue-500 to-purple-500' : 'from-blue-600 via-purple-600 to-pink-600'} rounded-2xl flex items-center justify-center shadow-lg ${darkMode ? 'shadow-cyan-500/30' : 'shadow-blue-500/30'} animate-pulse`}>
                            <Zap className='text-white' size={24} />
                        </div>
                        <div>
                            <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                                ASK AI
                                <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-cyan-500/20 text-cyan-300' : 'bg-blue-500/20 text-blue-600'}`}>PRO</span>
                            </h1>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Your intelligent coding companion powered by Gemini 2.0</p>
                        </div>
                    </div>
                    
                    {result.length > 0 && (
                        <button 
                            onClick={regenerateResponse}
                            className={`px-4 py-2 rounded-xl ${darkMode ? 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20' : 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 border border-blue-500/20'} flex items-center gap-2 text-sm font-medium transition-all hover:scale-105 backdrop-blur-sm relative z-10`}
                        >
                            <RefreshCw size={16} />
                            Regenerate
                        </button>
                    )}
                </header>

                {/* Chat Stream */}
                <div ref={scrollRef} className='flex-1 overflow-y-auto relative'>
                    <div className='max-w-5xl mx-auto w-full py-12 px-6 space-y-8'>
                        {result.length === 0 && (
                            <div className='flex flex-col items-center justify-center h-[calc(100vh-300px)] text-center'>
                                <div className={`w-24 h-24 bg-gradient-to-tr ${darkMode ? 'from-cyan-500 via-blue-500 to-purple-500' : 'from-blue-600 via-purple-600 to-pink-600'} rounded-3xl mb-8 animate-pulse shadow-2xl ${darkMode ? 'shadow-cyan-500/30' : 'shadow-blue-500/30'} flex items-center justify-center`}>
                                    <Sparkles className='text-white' size={40} />
                                </div>
                                <h2 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 bg-gradient-to-r ${darkMode ? 'from-cyan-400 to-blue-400' : 'from-blue-600 to-purple-600'} bg-clip-text text-transparent`}>
                                    Welcome to ASK AI
                                </h2>
                                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl text-base leading-relaxed mb-8`}>
                                    Experience next-generation AI assistance with advanced code generation, intelligent problem-solving, and creative solutions at your fingertips.
                                </p>
                                <div className='flex gap-4 flex-wrap justify-center'>
                                    {['Code Generation', 'Problem Solving', 'Creative Writing', 'Data Analysis'].map((tag, i) => (
                                        <span key={i} className={`px-4 py-2 rounded-full text-xs ${darkMode ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20' : 'bg-blue-500/10 text-blue-600 border border-blue-500/20'} backdrop-blur-sm`}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {result.map((msg, i) => (
                            <div key={i} className={`flex gap-4 ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                                <div className={`max-w-[85%] rounded-3xl p-6 ${
                                    msg.type === 'user' 
                                    ? darkMode 
                                        ? 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white shadow-xl shadow-cyan-500/20 rounded-br-lg border border-cyan-400/20' 
                                        : 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-xl shadow-blue-500/20 rounded-br-lg'
                                    : msg.type === 'error'
                                    ? darkMode
                                        ? 'bg-red-500/10 border-2 border-red-500/30 text-red-300 backdrop-blur-sm'
                                        : 'bg-red-50 border-2 border-red-300 text-red-900'
                                    : darkMode
                                        ? 'bg-black/40 border-2 border-cyan-500/20 backdrop-blur-xl shadow-lg rounded-bl-lg'
                                        : 'bg-white/80 border-2 border-blue-500/20 backdrop-blur-xl shadow-lg rounded-bl-lg'
                                }`}>
                                    {msg.type === 'ai' ? (
                                        <div className='space-y-4'>
                                            {msg.text.map((t, idx) => (
                                                <AdvancedAnswer key={idx} text={t} darkMode={darkMode} />
                                            ))}
                                        </div>
                                    ) : (
                                        <p className='text-[15px] leading-relaxed font-medium'>{msg.text}</p>
                                    )}
                                    {msg.timestamp && (
                                        <div className='flex items-center justify-between mt-4 pt-3 border-t border-white/10'>
                                            <p className='text-[10px] opacity-60'>
                                                {msg.timestamp.toLocaleTimeString()}
                                            </p>
                                            {msg.responseTime && (
                                                <p className='text-[10px] opacity-60 flex items-center gap-1'>
                                                    <Zap size={10} />
                                                    {(msg.responseTime / 1000).toFixed(2)}s
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {streamingText && (
                            <div className='flex gap-4 justify-start animate-fadeIn'>
                                <div className={`max-w-[85%] rounded-3xl p-6 ${darkMode ? 'bg-black/40 border-2 border-cyan-500/20 backdrop-blur-xl' : 'bg-white/80 border-2 border-blue-500/20 backdrop-blur-xl'} rounded-bl-lg shadow-lg`}>
                                    <p className='text-[15px] leading-relaxed'>
                                        {streamingText}
                                        <span className={`inline-block w-1 h-4 ml-1 ${darkMode ? 'bg-cyan-400' : 'bg-blue-600'} animate-pulse`}>▊</span>
                                    </p>
                                </div>
                            </div>
                        )}

                        {loading && !streamingText && (
                            <div className='flex gap-4 items-center justify-center'>
                                <div className='flex space-x-2'>
                                    <div className={`w-3 h-3 ${darkMode ? 'bg-cyan-500' : 'bg-blue-600'} rounded-full animate-bounce [animation-delay:-0.3s] shadow-lg ${darkMode ? 'shadow-cyan-500/50' : 'shadow-blue-500/50'}`}></div>
                                    <div className={`w-3 h-3 ${darkMode ? 'bg-blue-500' : 'bg-purple-600'} rounded-full animate-bounce [animation-delay:-0.15s] shadow-lg ${darkMode ? 'shadow-blue-500/50' : 'shadow-purple-500/50'}`}></div>
                                    <div className={`w-3 h-3 ${darkMode ? 'bg-purple-500' : 'bg-pink-600'} rounded-full animate-bounce shadow-lg ${darkMode ? 'shadow-purple-500/50' : 'shadow-pink-500/50'}`}></div>
                                </div>
                                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-medium`}>
                                    Processing{retryCount > 0 && ` (Retry ${retryCount}/${MAX_RETRIES})`}
                                </span>
                            </div>
                        )}

                        
                    </div>
                </div>

                {/* Advanced Input */}
                <div className={`p-8 ${darkMode ? 'bg-gradient-to-t from-black/60 via-black/40' : 'bg-gradient-to-t from-white/60 via-white/40'} to-transparent backdrop-blur-sm relative`}>
                    <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-t from-cyan-500/5 to-transparent' : 'bg-gradient-to-t from-blue-500/5 to-transparent'} pointer-events-none`} />
                    
                    <div className='max-w-5xl mx-auto relative z-10'>
                        <div className='relative'>
                            <textarea
                                ref={inputRef}
                                rows="1"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleAsk();
                                    }
                                }}
                                placeholder='Ask anything... (Shift+Enter for new line)'
                                className={`w-full ${darkMode ? 'bg-black/60 border-cyan-500/30 focus:border-cyan-500/60 text-white placeholder-gray-500' : 'bg-white/80 border-blue-500/30 focus:border-blue-500/60 text-gray-900 placeholder-gray-400'} border-2 rounded-2xl py-5 pl-6 pr-20 focus:ring-4 ${darkMode ? 'focus:ring-cyan-500/10' : 'focus:ring-blue-500/10'} outline-none transition-all resize-none shadow-2xl backdrop-blur-xl font-medium`}
                                style={{ maxHeight: '200px' }}
                            />
                            <button 
                                onClick={handleAsk}
                                disabled={loading || !question.trim()}
                                className={`absolute right-3 top-1/2 -translate-y-1/2 p-3.5 rounded-xl bg-gradient-to-r ${darkMode ? 'from-cyan-600 via-blue-600 to-purple-600 shadow-lg shadow-cyan-500/30' : 'from-blue-600 via-purple-600 to-pink-600 shadow-lg shadow-blue-500/30'} text-white hover:scale-110 disabled:opacity-30 disabled:hover:scale-100 transition-all duration-300`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                            </button>
                        </div>
                        <p className={`text-[10px] text-center ${darkMode ? 'text-gray-500' : 'text-gray-600'} mt-4 flex items-center justify-center gap-2`}>
                            <Zap size={10} className={darkMode ? 'text-cyan-400' : 'text-blue-600'} />
                            Powered by Gemini 2.0 Flash • Rate limited for optimal performance
                        </p>
                    </div>
                </div>

            </main>
            
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
                .scrollbar-thin::-webkit-scrollbar {
                    width: 6px;
                }
                .scrollbar-thin::-webkit-scrollbar-track {
                    background: transparent;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb {
                    background: ${darkMode ? 'rgba(6, 182, 212, 0.3)' : 'rgba(37, 99, 235, 0.3)'};
                    border-radius: 3px;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                    background: ${darkMode ? 'rgba(6, 182, 212, 0.5)' : 'rgba(37, 99, 235, 0.5)'};
                }
            `}</style>
        </div>
    );
}

export default API;