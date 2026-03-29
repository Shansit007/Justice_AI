import { useState, useEffect, useRef } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const chatEndRef = useRef(null);

  const [displayText, setDisplayText] = useState("");
  const [currentResponse, setCurrentResponse] = useState("");

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // typing effect
  useEffect(() => {
    if (!currentResponse) return;

    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(currentResponse.slice(0, i));
      i++;
      if (i > currentResponse.length) clearInterval(interval);
    }, 8);

    return () => clearInterval(interval);
  }, [currentResponse]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    let updatedMessages = [...messages];

    if (editingIndex !== null) {
      updatedMessages[editingIndex].text = input;
      setEditingIndex(null);
    } else {
      updatedMessages.push({ role: "user", text: input });
    }

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    setDisplayText("");
    setCurrentResponse("");

    try {
      const res = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: input }),
      });

      const data = await res.json();

      let raw = data.response || "No response";

      let formatted = raw
        .replace(/Found guilty:/gi, "\n\n🔴 Found Guilty:\n")
        .replace(/Found innocent:/gi, "\n\n🟢 Found Innocent:\n")
        .replace(/likelihood/gi, "\n\n📊 Likelihood:\n")
        .replace(/advice/gi, "\n\n💡 Advice:\n");

      let responseText = formatted;

      if (input.length < 5) {
        responseText = "👋 Hey! Tell me your legal case and I’ll help you.";
      }

      setCurrentResponse(responseText);

      setMessages((prev) => [
        ...prev,
        { role: "bot", text: responseText },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "❌ Backend error" },
      ]);
    }

    setLoading(false);
  };

  const editMessage = (index, text) => {
    setInput(text);
    setEditingIndex(index);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-black text-white">

      {/* HEADER */}
      <div className="text-center py-4 text-xl font-semibold bg-white/10 backdrop-blur-md border-b border-white/20">
        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          ⚖️ Justice AI
        </span>
      </div>

      {/* WELCOME */}
      {messages.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Welcome to Justice AI ⚖️
          </h1>
          <p className="text-gray-400 max-w-xl">
            Describe your legal case and get AI-powered analysis with judgment,
            likelihood, and legal advice.
          </p>
        </div>
      )}

      {/* CHAT */}
      <div className="flex-1 overflow-y-auto flex justify-center px-4 py-6">
        <div className="w-full max-w-3xl space-y-6">

          {messages.map((msg, i) => {
            if (msg.role === "user") {
              return (
                <div key={i} className="flex justify-end">
                  <div className="relative group max-w-[70%]">

                    <div className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg break-words">
                      {msg.text}
                    </div>

                    {/* EDIT BUTTON */}
                    <button
                      onClick={() => editMessage(i, msg.text)}
                      className="absolute -left-8 top-2 opacity-0 group-hover:opacity-100 text-xs bg-white/10 px-2 py-1 rounded"
                    >
                      ✏️
                    </button>

                  </div>
                </div>
              );
            }

const isLastBot = i === messages.length - 1 && msg.role === "bot";

const content = isLastBot
  ? displayText || null
  : msg.text;

// ❌ DON'T RENDER EMPTY BOT MESSAGE
if (msg.role === "bot" && !content) return null;

const sections = content.split("\n\n");

            return (
              <div key={i} className="flex justify-start">
                <div className="space-y-3 max-w-[75%]">

                  {sections.map((sec, idx) => {
                    let style =
                      "bg-white/10 border border-white/20 backdrop-blur-md";

                    if (sec.includes("Guilty"))
                      style = "bg-red-500/20 border border-red-400/40";
                    else if (sec.includes("Innocent"))
                      style = "bg-green-500/20 border border-green-400/40";
                    else if (sec.includes("Likelihood"))
                      style = "bg-yellow-500/20 border border-yellow-400/40";

                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl shadow-lg transition hover:scale-[1.02] ${style}`}
                      >
                        <pre className="whitespace-pre-wrap text-sm break-words">
                          {sec}
                        </pre>
                      </div>
                    );
                  })}

                </div>
              </div>
            );
          })}

{loading && (
  <div className="flex justify-start">
    <div className="px-4 py-3 rounded-2xl bg-white/10 border border-white/20 flex items-center gap-1">
      <span className="text-sm text-gray-300 mr-2">⚡Thinking</span>
      <span className="typing-dot">.</span>
      <span className="typing-dot">.</span>
      <span className="typing-dot">.</span>
    </div>
  </div>
)}

          <div ref={chatEndRef}></div>
        </div>
      </div>

      {/* INPUT */}
      <div className="p-4 border-t border-white/20 backdrop-blur-md bg-white/10 flex justify-center">
        <div className="w-full max-w-3xl flex gap-3">

          <input
            type="text"
            className="flex-1 bg-black/30 border border-white/20 rounded-full px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your legal case..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button
            onClick={sendMessage}
            className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 rounded-full hover:scale-110 transition"
          >
            Send
          </button>

        </div>
      </div>
    </div>
  );
}

export default App;