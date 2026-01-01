import React from "react"
import { useNavigate } from "react-router-dom"


const HERO_IMG = "/blob.svg"


export default function Home() {
  const navigate = useNavigate()
  const history = JSON.parse(localStorage.getItem("history") || "[]")

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
     
      <div className="pointer-events-none absolute -left-32 -top-40 w-[600px] h-[600px] rounded-full bg-gradient-t-tr from-cyan-600 via-violet-600 to-pink-500 opacity-20 blur-3xl animate-blob"></div>
      <div className="pointer-events-none absolute -right-40 -bottom-48 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-indigo-600 via-sky-600 to-emerald-400 opacity-14 blur-3xl animate-blob animation-delay-2000"></div>

      <header className="max-w-6xl mx-auto px-6 lg:px-8 py-8 flex items-center justify-between">
        <div className="text-2xl font-bold">AskAi</div>
        <nav className="space-x-4 hidden md:flex items-center">
          <button onClick={() => navigate("/")} className="text-sm opacity-80">Home</button>
          <button onClick={() => navigate("/chat")} className="bg-cyan-600 px-4 py-2 rounded-lg text-sm hover:bg-cyan-500 transition">Open Chat</button>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 lg:px-8 pt-8 pb-20">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
         
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
              Ask anything. Get crisp answers. Fast.
            </h1>

            <p className="text-zinc-300 max-w-xl">
               Built with React + Tailwind
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <button
                onClick={() => navigate("/chat")}
                className="bg-cyan-600 px-6 py-3 rounded-full text-black font-medium hover:bg-cyan-500 transition"
              >
                Start a conversation
              </button>

              <button
                onClick={() => window.scrollTo({ top: 800, behavior: "smooth" })}
                className="px-4 py-3 rounded-full border border-zinc-700 text-sm"
              >
                See features
              </button>
            </div>

            <div className="mt-4">
              <small className="text-zinc-400">Trusted by devs · No signup required</small>
            </div>
          </div>

          
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md bg-zinc-900/40 border border-zinc-800 p-6 rounded-2xl shadow-lg">
              <img src={HERO_IMG} alt="hero" className="w-full h-48 object-contain" />
              <div className="mt-4">
                <div className="text-sm text-zinc-300 mb-2">Quick demo</div>
                <div className="bg-black/60 p-3 rounded-md">
                  <div className="text-xs text-zinc-400">You:</div>
                  <div className="text-sm text-white">How to center a div in CSS?</div>
                  <div className="mt-2 text-xs text-zinc-400">AI:</div>
                  <div className="text-sm text-cyan-300">Use flexbox: display:flex; place-items:center; justify-content:center;</div>
                </div>
              </div>
            </div>
          </div>
        </section>

       
        <section id="features" className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Markdown + Code", desc: "Answers render markdown and highlight code blocks automatically." },
            { title: "History", desc: "Your recent questions saved locally for quick reuse." },
            { title: "Fast UX", desc: "Typing placeholder, smooth scroll and minimal latency." }
          ].map((f, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
              <div className="text-cyan-400 font-semibold mb-2">{f.title}</div>
              <div className="text-zinc-300 text-sm">{f.desc}</div>
            </div>
          ))}
        </section>

        
        <section className="mt-12">
          <h3 className="text-lg font-semibold mb-3">Recent questions</h3>

          {history.length === 0 ? (
            <div className="text-zinc-500">No recent questions  try asking something in the chat.</div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {history.slice(0, 6).map((q, i) => (
                <div
                  key={i}
                  onClick={() => { localStorage.setItem("prefill", q); window.location.href = "/chat"; }}
                  className="cursor-pointer p-3 rounded-lg bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 transition"
                >
                  <div className="text-sm text-zinc-300">{q}</div>
                </div>
              ))}
            </div>
          )}
        </section>

     
        <footer className="mt-16 text-center text-zinc-400">
          <div className="max-w-xl mx-auto">
            Built with React + Tailwind  <button className="text-cyan-400 underline ml-2" onClick={() => navigate("/chat")}>Open chat</button>
          </div>
        </footer>
      </main>

      
      <style jsx>{`
        @keyframes blob {
          0% { transform: translateY(0) scale(1); }
          33% { transform: translateY(-10px) scale(1.05); }
          66% { transform: translateY(0) scale(0.95); }
          100% { transform: translateY(0) scale(1); }
        }
        .animate-blob { animation: blob 8s ease-in-out infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  )
}
