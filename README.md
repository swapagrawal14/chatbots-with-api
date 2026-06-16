# ⚡ NexChat AI — Free Multi-Model Chatbot

A stunning, production-ready chatbot web application that lets users chat with AI models from multiple providers using their own API keys. Features 20+ free models including the latest OpenRouter models like **Owl Alpha** and **Nex-N2 Pro**.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Try%20it%20now!-brightgreen?style=for-the-badge&logo=vercel)](https://chatbots-with-api-i3bn.vercel.app/)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

- 🔥 **20+ Free AI Models** — DeepSeek R1, Llama 4, Qwen3, Owl Alpha, Nex-N2 Pro, and more
- 🌐 **Multi-Provider Support** — OpenRouter, Groq, Google AI Studio, OpenAI, and custom endpoints
- 🔐 **Bring Your Own Key** — API keys stored locally in browser, never sent to any server
- 💬 **Real-time Streaming** — Watch AI responses appear in real-time
- 📝 **Markdown Rendering** — Code blocks, tables, lists, and rich formatting
- 📚 **Chat History** — Conversations saved to browser localStorage
- 🎨 **Beautiful Dark UI** — Modern glassmorphism design with smooth animations
- 📱 **Fully Responsive** — Works perfectly on desktop, tablet, and mobile
- ⚙️ **Customizable** — Temperature, max tokens, system prompts, and more
- 🚀 **Deploy Anywhere** — GitHub Pages, Vercel, Netlify, or any static host

## 🚀 Deploy to GitHub Pages (Easiest!)

### Step 1: Fork or Push to GitHub

```bash
# Create a new repo on GitHub, then:
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2: Enable GitHub Pages

1. Go to your repo on GitHub
2. Click **Settings** → **Pages**
3. Under "Build and deployment", select **GitHub Actions**
4. The workflow will automatically build and deploy your site!

### Step 3: Access Your App

Your app will be live at: `https://YOUR_USERNAME.github.io/YOUR_REPO/`

> **Note**: If deploying to a subdirectory (not root), edit `next.config.ts` and uncomment the `basePath` and `assetPrefix` lines, replacing `your-repo-name` with your actual repo name.

---

## 🚀 Deploy to Vercel

### 🌐 Live Demo

**Try it now:** [https://chatbots-with-api-i3bn.vercel.app/](https://chatbots-with-api-i3bn.vercel.app/)

### One-Click Deploy
1. Push to GitHub
2. Import at [vercel.com/new](https://vercel.com/new)
3. Deploy! (No environment variables needed)

### CLI Deploy
```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## 🚀 Deploy to Netlify

1. Push to GitHub
2. Import at [netlify.com](https://app.netlify.com/start)
3. Build command: `npm run build`
4. Publish directory: `out`
5. Deploy!

---

## 🆓 Supported Free Models

### OpenRouter (Free)
| Model | Best For | Context |
|-------|----------|---------|
| 🔥 Owl Alpha | Coding, math, agentic tasks | 1M |
| 🔥 Nex-N2 Pro | Coding, tool use, deep research | 262K |
| ⭐ DeepSeek R1 | Reasoning, math, logic | 64K |
| 💬 DeepSeek V3 | General chat, content writing | 64K |
| 💻 Qwen3 235B | Coding, analysis, automation | 128K |
| 💻 Qwen3 Coder | Specialized coding | 128K |
| 🎨 Llama 4 Maverick | Multimodal, long context | 1M |
| ⚡ Llama 4 Scout | Fast real-time chat | 128K |
| 🧠 Grok 3 Mini Beta | Lightweight reasoning | 131K |
| 💬 Gemma 3 27B | Summaries, instructions | 128K |
| 💬 Mistral Small 3.1 | Writing, coding, assistants | 128K |
| 🧠 Nemotron 3 Super | High-context tasks | 128K |
| 🧠 GPT-OSS 120B | Tool use & reasoning | 128K |
| 💬 GLM 4.5 Air | Multilingual tasks | 32K |
| 💬 Hermes 3 70B | Assistant-style chat | 128K |

### Groq (Free Tier)
| Model | Best For | Speed |
|-------|----------|-------|
| ⚡ Llama 4 Scout | Fast chat | Ultra-fast |
| ⚡ Llama 3.3 70B | Versatile tasks | Ultra-fast |
| ⚡ Qwen3 32B | Coding | Ultra-fast |

### Google AI Studio (Free)
| Model | Best For | Context |
|-------|----------|---------|
| 🌟 Gemini 2.5 Flash | Fast multimodal | 1M |
| 🌟 Gemini 2.5 Pro | Most capable free | 1M |

## 🔑 Getting Free API Keys

1. **OpenRouter** — [openrouter.ai/keys](https://openrouter.ai/keys) — Free, no credit card
2. **Groq** — [console.groq.com](https://console.groq.com) — Free tier
3. **Google AI Studio** — [aistudio.google.com](https://aistudio.google.com) — Free, generous limits
4. **OpenAI** — [platform.openai.com](https://platform.openai.com) — Free trial credits

## 🛠 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for server deployment (Vercel, etc.)
npm run build

# Build for static export (GitHub Pages, Netlify, etc.)
STATIC_EXPORT=true npm run build

# Preview static build
npx serve out
```

## 🏗 Tech Stack

- **Framework**: Next.js 16 (App Router, Static Export)
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS 4
- **Storage**: Browser localStorage
- **Streaming**: Native Fetch + SSE
- **Markdown**: react-markdown

## 📁 Project Structure

```
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Pages deployment
├── src/
│   ├── app/
│   │   ├── globals.css     # Tailwind + custom styles
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   └── not-found.tsx   # 404 page
│   ├── components/
│   │   ├── ChatApp.tsx     # Main chat application
│   │   ├── ChatMessage.tsx # Message bubble component
│   │   ├── ModelSelector.tsx # Model dropdown
│   │   ├── SettingsModal.tsx # Settings dialog
│   │   └── Sidebar.tsx     # Conversation sidebar
│   └── lib/
│       ├── models.ts       # AI model definitions
│       └── types.ts        # TypeScript types
├── next.config.ts          # Next.js config (static export)
├── package.json
└── README.md
```

## 🔒 Privacy

- ✅ API keys stored **only** in your browser's localStorage
- ✅ Keys sent **directly** to AI providers (OpenRouter, Groq, etc.)
- ✅ **Zero server-side storage** — fully client-side app
- ✅ Chat history stored locally in your browser

## 📄 License

MIT — Use freely for personal and commercial projects.

---

**Made with ⚡ by NexChat AI**
