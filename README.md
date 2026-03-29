# ⚖️ Justice AI — AI-Powered Legal Assistant

Justice AI is an intelligent legal analysis system that uses **LLM + Retrieval-Augmented Generation (RAG)** to analyze real-world case descriptions and provide structured legal insights including judgments, likelihood, and professional advice.

---

## 🚀 Features

* 🧠 AI-powered legal reasoning (LLaMA via Ollama)
* 📚 Case-law retrieval using Vector Database (ChromaDB)
* ⚖️ Dual judgment output:

  * Found Guilty
  * Found Innocent
* 📊 Likelihood estimation
* 💡 Lawyer-style advice
* 💬 Modern ChatGPT-like UI (React + Tailwind)
* ✏️ Edit previous queries
* ⚡ Typing animation & smooth UX

---

## 🏗️ Tech Stack

### 🔹 Backend

* Python
* Flask
* LangChain
* Ollama (LLaMA model)
* ChromaDB (Vector Database)

### 🔹 Frontend

* React (Vite)
* Tailwind CSS

---

## 📁 Project Structure

```
justice-ai-project/
│
├── backend/
│   ├── app.py
│   ├── main.py
│   ├── vector.py
│   ├── chroma_langchain_db/
│   └── data/
│
├── frontend/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── tailwind.config.js
```

---

## ⚙️ Installation & Setup

### 🔥 1. Clone the Repository

```
git clone <your-repo-link>
cd justice-ai-project
```

---

### 🧠 2. Setup Backend

```
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
```

---

### 🤖 3. Install & Run Ollama

Download from: https://ollama.com/download

Then run:

```
ollama run llama3.2
```

👉 Also pull embedding model (IMPORTANT):

```
ollama pull mxbai-embed-large
```

---

### ▶️ 4. Start Backend Server

```
cd backend
.\.venv\Scripts\activate
python app.py
```

Server runs at:

```
http://127.0.0.1:5000
```

---

### 🎨 5. Setup Frontend

```
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## 🧪 How to Use

1. Open the frontend in browser
2. Enter a legal case description
3. Click **Send**
4. Get AI-generated:

   * Legal analysis
   * Judgment (Guilty / Innocent)
   * Likelihood
   * Advice

---


---


---

## 🚀 Future Improvements

* 🌐 Deployment (Render / Vercel)
* 🎤 Voice input
* 📊 Case history & dashboard
* 🔐 User authentication
* ⚡ Streaming responses

---

## 👨‍💻 Author

Developed as part of AI/ML academic project.

---

## 📌 Note

This system is for **educational purposes only** and does not replace professional legal advice.

---
