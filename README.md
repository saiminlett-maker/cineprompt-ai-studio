# 📹 AI Video Prompt Master (with Google Gemini API, User Profiles & History)

ရုပ်ရှင်ဆန်ဆန် AI Video များ ဖန်တီးရန် ပြီးပြည့်စုံသော English Video Prompts၊ Camera Angles၊ Lighting၊ Series (ဇာတ်လမ်းတွဲ) / Single (တစ်ခန်းရပ်) ပုံစံများနှင့် မြန်မာလို အခန်းလိုက် ဇာတ်ညွှန်းများ (Scene-by-Scene Script & Voiceover) ကို လွယ်ကူလျင်မြန်စွာ ထုတ်ယူနိုင်သော Web Application ဖြစ်ပါသည်။

---

## 🌟 အဓိက လုပ်ဆောင်ချက်များ (Key Features)

1. **ဇာတ်လမ်းပုံစံ ရွေးချယ်မှု (Story Structure: Series vs Single Episode)**:
   - **🎬 Single Episode (တစ်ခန်းရပ် ဇာတ်လမ်းပြီး)**
   - **📺 Series - Episode 1: Origin & Pilot (အပိုင်း ၁ - စတင်မိတ်ဆက်)**
   - **📺 Series - Episode 2: Rising Conflict (အပိုင်း ၂ - အရှိန်တက်ခြင်း)**
   - **📺 Series - Episode 3: Climax & Twist (အပိုင်း ၃ - အထွတ်အထိပ်)**
   - **📺 Series - Season Finale (ဇာတ်သိမ်းပိုင်း)**
   - **🔥 Continuous Web Series (with Cliffhanger Ending)** — ပရိသတ် နောက်အပိုင်းကို ဆက်ကြည့်ချင်အောင် စိတ်ဝင်စားဖွယ် Cliffhanger Hook များ ထည့်သွင်းပေးခြင်း။

2. **👤 User Profile & Login System (အကောင့်စနစ်)**:
   - Username နှင့် Cool Avatar များ (`👨‍💻`, `🎬`, `🚀`, `🐱`, `🧙`, `🌟`) ရွေးချယ်နိုင်ခြင်း။
   - အကောင့်အလိုက် မိမိ Generate ပြုလုပ်ခဲ့သော Prompt History များကို သီးသန့် ခွဲခြားမှတ်သားပေးခြင်း။
   - အကောင့်များစွာကို 1-Click ဖြင့် အလွယ်တကူ Switch ပြောင်းလဲအသုံးပြုနိုင်ခြင်း။

3. **📜 Prompt History & Saved Projects (မှတ်တမ်းစနစ်)**:
   - Generate လုပ်လိုက်သော Prompts များကို အလိုအလျောက် Autosave ပြုလုပ်ပေးခြင်း။
   - ခေါင်းစဉ် (Title) သို့မဟုတ် Genre ဖြင့် ရှာဖွေနိုင်သော Search Bar။
   - **"📂 Load (ပြန်ဖွင့်မည်)"** ကို နှိပ်ရုံဖြင့် ယခင်ဇာတ်လမ်းနှင့် Dropdown ဆက်တင်များကို Studio ထဲသို့ ချက်ချင်း ပြန်လည် ထည့်သွင်းပေးခြင်း။
   - Prompts များကို Copy ကူးယူခြင်း၊ ဖျက်ပစ်ခြင်းနှင့် `.json` ဖိုင်အဖြစ် Export ရယူနိုင်ခြင်း။

4. **AI Video Model Presets**:
   - **Kling AI**, **Runway Gen-3 Alpha**, **Hailuo / Minimax**, **OpenAI Sora**, **Luma Dream Machine** & **Midjourney / Flux**

5. **Google Gemini AI Integration & Help Guide**:
   - Google Gemini 2.0 Flash / 1.5 Flash / 1.5 Pro တို့ဖြင့် ချိတ်ဆက်နိုင်ခြင်း။
   - အဆင့် ၅ ဆင့်ပါဝင်သော **"❓ ချိတ်ဆက်နည်း လမ်းညွှန်"** Help Modal။
   - **Offline Mode Fallback**: Gemini API Key မထည့်ထားချိန်တွင်လည်း အသုံးပြုနိုင်ခြင်း။

---

## 🚀 အသုံးပြုနည်း (How to Run)

### နည်းလမ်း (၁) - 1-Click Double Click (အလွယ်ဆုံး)
1. Project folder ထဲရှိ `run.bat` ဖိုင်ကို Double-Click နှိပ်လိုက်ပါ။
2. သင်၏ Browser တွင် `index.html` အလိုအလျောက် ပွင့်လာပါမည်။

### နည်းလမ်း (၂) - Browser တွင် တိုက်ရိုက်ဖွင့်ခြင်း
- `index.html` ဖိုင်ကို Chrome / Edge ဖြင့် တိုက်ရိုက် Double-Click နှိပ်၍ ဖွင့်ပါ။

---

## 📁 File Structure

```text
ai-video-prompt-master/
├── index.html        # Main Web Application UI (User Login, History, Series Pickers)
├── app.js            # Gemini API Client, User Auth, History Autosave & Script Generator
├── styles.css         # Modern Dark Glassmorphism Styles & Animations
├── server.py         # Local Python Web Server
├── run.bat           # 1-Click Windows Launcher
└── README.md         # Documentation & User Guide
```
