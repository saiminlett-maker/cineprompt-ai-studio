/**
 * AI Video Prompt Master - Core Application Logic, AI Tool Prompt Optimizers & Flow Transitions
 */

// State Management
const state = {
  apiKey: localStorage.getItem('gemini_api_key') || '',
  model: localStorage.getItem('gemini_model') || 'gemini-2.0-flash',
  isLoggedIn: !!localStorage.getItem('current_user_email'),
  guestTrialCount: parseInt(localStorage.getItem('guest_trial_count') || '0', 10),
  monthlyFee: parseInt(localStorage.getItem('admin_monthly_fee') || '20000', 10),
  adminPin: localStorage.getItem('admin_master_pin') || '888888',
  kpayInfo: localStorage.getItem('admin_kpay_info') || '09-799887766 (Prompt Master Studio)',
  waveInfo: localStorage.getItem('admin_wave_info') || '09-799887766 (Prompt Master Studio)',
  user: {
    email: localStorage.getItem('current_user_email') || '',
    name: localStorage.getItem('current_user_name') || '',
    avatar: localStorage.getItem('current_user_avatar') || '👨‍💻',
    role: localStorage.getItem('current_user_role') || 'user',
    subscriptionStatus: localStorage.getItem('current_user_sub_status') || 'trial',
    subscriptionExpiry: parseInt(localStorage.getItem('current_user_sub_expiry') || '0', 10)
  },
  adminUserFilter: 'all',
  currentData: null,
  activeTab: 'scenes',
  isLoading: false,
  selectedAvatar: '👨‍💻',
  studioLayoutMode: 'tab', // 'tab' | 'split'
  activeStudioStep: 'input', // 'input' | 'output' | 'history'
  activeWorkspace: localStorage.getItem('current_active_workspace') || 'personal', // 'personal' | 'grp_...'
  historyActiveScope: 'individual', // 'individual' | 'group'
  charStudioEnabled: true,
  charStudioSubTab: 'photo',
  uploadedImages: [], // Array of { id, name, size, mime, base64, dataUrl, charName, charRole, charAppearance, charCostume }
  photoStorySuggestions: []
};

// Genre-Categorized Diverse Story Concepts Catalog (Myanmar & Global Themes)
const genreStoryIdeas = {
  'Biography': [
    "ဗိုလ်ချုပ်အောင်ဆန်း၏ ငယ်ဘဝ၊ ကျောင်းသားဘဝနှင့် နိုင်ငံ့လွတ်လပ်ရေး ကြိုးပမ်းမှု သမိုင်းဝင် အတ္ထုပ္ပတ္တိ",
    "အလောင်းမင်းတရား ဦးအောင်ဇေယျ၏ တိုင်းပြည်စည်းလုံးညီညွတ်ရေးနှင့် တတိယမြန်မာနိုင်ငံတော် ထူထောင်မှု အတ္ထုပ္ပတ္တိ",
    "မဟာဗန္ဓုလ၏ စစ်သေနာပတိ စွမ်းရည်နှင့် ဓနုဖြူတိုက်ပွဲ သမိုင်းဝင် ရဲရင့်မှု အတ္ထုပ္ပတ္တိ",
    "သခင်ဖိုးလှကြီးနှင့် ချောက်ရေနံမြေ အလုပ်သမား အရေးတော်ပုံ သမိုင်းဝင် အတ္ထုပ္ပတ္တိ",
    "ဆရာကြီး သခင်ကိုယ်တော်မှိုင်း၏ ငြိမ်းချမ်းရေး ကြိုးပမ်းမှုနှင့် မြန်မာစာပေ သမိုင်းမှတ်တမ်း",
    "အဲလ်ဘတ် အိုင်းစတိုင်း (Albert Einstein) ၏ စိတ်ကူးယဉ်မှုမှသည် နှိုင်းရသီအိုရီ ရှာဖွေတွေ့ရှိမှုအထိ ဘဝအတ္ထုပ္ပတ္တိ",
    "စတိဗ်ဂျော့ဘ်စ် (Steve Jobs) ၏ Apple ကုမ္ပဏီ စတင်တည်ထောင်မှုနှင့် နည်းပညာ တော်လှန်ရေး ဘဝခရီးစဉ်",
    "နီကိုလာ တက်စလာ (Nikola Tesla) ၏ လျှပ်စစ်စွမ်းအင် တီထွင်မှုနှင့် မမေ့အပ်သော သိပ္ပံပညာရှင် အတ္ထုပ္ပတ္တိ",
    "မာရီကျူးရီး (Marie Curie) ၏ ရေဒီယိုသတ္တိကြွမှု ရှာဖွေတွေ့ရှိခြင်းနှင့် နိုဘယ်လ်ဆုရှင် သိပ္ပံပညာရှင် ဘဝဇာတ်ကြောင်း",
    "လေယိုနာဒို ဒါဗင်ချီ (Leonardo da Vinci) ၏ မိုနာလီဆာ ပန်းချီနှင့် စွယ်စုံရ ပါရမီရှင် ဘဝမှတ်တမ်း",
    "မဟတ္တမ ဂန္ဒီ (Mahatma Gandhi) ၏ အကြမ်းမဖက် လှုပ်ရှားမှုနှင့် လွတ်လပ်ရေး ခရီးစဉ် သမိုင်းဝင် အတ္ထုပ္ပတ္တိ"
  ],
  'Comedy': [
    "တောရွာလေးထဲမှာ သူငယ်ချင်းနှစ်ယောက် ထူးဆန်းတဲ့ ရတနာသေတ္တာတွေ့ပြီး ဖြစ်ပျက်တဲ့ ဟာသ",
    "ရွာက အဘိုးကြီးက AI စက်ရုပ်တစ်ရုပ် လက်ဆောင်ရပြီး လယ်တောထဲမှာ ခိုင်းစားရင်း ဖြစ်လာတဲ့ ဟာသ",
    "တောရွာလေးဆီ ရောက်လာတဲ့ ဂြိုဟ်သားလေးကို ရွာသားတွေက ဧည့်သည်ထင်ပြီး ထမင်းကျွေး ဧည့်ခံကြတဲ့ ဟာသ",
    "ရန်ကုန်မြို့လယ်က လက်ဖက်ရည်ဆိုင်မှာ သူငယ်ချင်းသုံးယောက် အလွဲလွဲအချော်ချော် စကားစစ်ထိုးကြပုံ",
    "ဈေးထဲမှာ သစ်သီးသည်နဲ့ ငါးသည် အပြိုင်အဆိုင် အသံကောင်းဟစ်ပြီး ရောင်းကြတဲ့ ဟာသဇာတ်လမ်း",
    "မန္တလေးမြို့က လက်ဖက်ရည်ဆိုင်မှာ အငြင်းပွားရင်း ဂင်းနစ်စံချိန်တင် ရေနွေးကြမ်းသောက်ပြိုင်ပွဲ ဖြစ်သွားပုံ",
    "စက်ဘီးဟောင်းလေးတစ်စီးကို ပြင်ရင်း ကောင်းကင်ပေါ် ပျံတက်သွားတဲ့ ဆယ်ကျော်သက် ကောင်လေးရဲ့ ဟာသ",
    "မိုးကြိုးပစ်ခံရပြီးနောက် တိရစ္ဆာန်တွေရဲ့ စကားကို နားလည်သွားတဲ့ ရွာသားတစ်ယောက်ရဲ့ အလွဲများ",
    "တောထဲမှာ မျက်လှည့်ဆရာအတုကြီးနဲ့ တွေ့ပြီး လန့်ဖျပ်သွားတဲ့ တောလိုက်မုဆိုးနှစ်ယောက်"
  ],
  'Horror': [
    "ညဘက် တောလမ်းမှာ သရဲခြောက်ခံရတယ်ထင်ပြီး အသည်းအသန် ပြေးကြတဲ့ လူငယ်နှစ်ယောက်ရဲ့ သည်းထိတ်ရင်ဖို",
    "ရွာဘုန်းကြီးကျောင်းမှာ ညဘက် သရဲခြောက်တယ်ဆိုပြီး ကပ္ပိယကြီးနဲ့ ကိုရင်လေးတွေ စုံစမ်းစစ်ဆေးကြပုံ",
    "ဆေးရုံဟောင်းတစ်ခုထဲမှာ သတ္တိစမ်းရင်း မထင်မှတ်တဲ့ လျှို့ဝှက်ဆန်းကြယ်မှုတွေ ကြုံရတဲ့ vlog အဖွဲ့",
    "တိုက်ခန်းဟောင်းတစ်ခုရဲ့ မှန်အနောက်ကနေ စောင့်ကြည့်နေတဲ့ လျှို့ဝှက်ဆန်းကြယ် အရိပ်မည်းကြီး",
    "ညသန်းခေါင် မြူခိုးတွေကြားက မောင်းနှင်လာတဲ့ လူသူမဲ့ လျှို့ဝှက်ရထားကြီးနှင့် ခရီးသည်များ",
    "သစ်ပင်ကြီးတစ်ပင်အောက်မှာ အိပ်ပျော်သွားရင်း ဝိညာဉ်ကမ္ဘာဆီ မတော်တဆ ရောက်သွားတဲ့ တောလိုက်မုဆိုး",
    "ရွာဟောင်းတစ်ခုရဲ့ အဝီစိတွင်းနက်ကြီးထဲကနေ ညတိုင်း ထွက်ပေါ်လာတဲ့ ထူးဆန်းသော အသံနက်ကြီးများ",
    "ရန်ကုန်မြို့ရဲ့ မိုးသည်းထန်စွာရွာသွန်းတဲ့ ညသန်းခေါင်မှာ တက္ကစီဆရာနဲ့ ထူးဆန်းတဲ့ ခရီးသည်တို့ရဲ့ သည်းထိတ်ရင်ဖိုဇာတ်လမ်း"
  ],
  'Action': [
    "မြန်မာ့ရိုးရာ သိုင်းပညာရှင် လူငယ်လေးတစ်ယောက်က နိုင်ငံတကာ သိုင်းသမားတွေနဲ့ ယှဉ်ပြိုင်ရပုံ",
    "တောနက်ကြီးထဲမှာ ပျောက်ဆုံးနေတဲ့ ရှေးဟောင်း ပုဂံရွှေဘုရားစေတီကို ရှာဖွေတွေ့ရှိခြင်း စွန့်စားခန်း",
    "ရှေးခေတ် မြန်မာစစ်သူကြီးတစ်ဦးရဲ့ သစ္စာတရားနဲ့ တိုင်းပြည်ကာကွယ်တဲ့ ရောယှက်စွန့်စားခန်း",
    "အနာဂတ် မြို့တော်ကြီးထဲမှာ လူဆိုးဂိုဏ်းတွေရဲ့ ရန်ကို ကာကွယ်တိုက်ခိုက်တဲ့ ဆိုင်ကယ်သမား လူငယ်",
    "ဒုတိယကမ္ဘာစစ်ခေတ်က မြေအောက်လှိုဏ်ဂူထဲမှာ ပုန်းအောင်းနေတဲ့ ရတနာသေတ္တာကို စွန့်စားရှာဖွေခြင်း",
    "မိုးပျံတိုက်တွေကြားကနေ လျှို့ဝှက်ဖမ်းဆီးမှုတွေ လုပ်ဆောင်နေတဲ့ အထူးစစ်ဆင်ရေး အေးဂျင့်အဖွဲ့",
    "ရှမ်းပြည်နယ် တောင်တန်းတွေပေါ်မှာ ရန်သူ့လက်ထဲက ဓားစာခံတွေကို ကယ်တင်တဲ့ စွန့်စားခန်း"
  ],
  'Drama': [
    "ကော်ဖီဆိုင်မှာ အမှတ်မထင် တွေ့ဆုံမိတဲ့ အနုပညာရှင်နှစ်ယောက်ရဲ့ နွေးထွေးတဲ့ အချစ်ဇာတ်လမ်း",
    "တောင်ပေါ်ရွာက ကလေးလေးတစ်ယောက် ပထမဆုံးအကြိမ် နှင်းတွေကျတာကို တွေ့ပြီး ပျော်ရွှင်ရပုံ",
    "မန္တလေး ကျုံးဘေးမှာ ညနေခင်း လမ်းလျှောက်ရင်း မမျှော်လင့်ဘဲ ပျောက်ဆုံးသွားတဲ့ ကြောင်လေးကို ကယ်တင်ရပုံ",
    "နှစ်ပေါင်းများစွာ ဝေးကွာနေတဲ့ သားအဖနှစ်ယောက် မီးရထားဘူတာရုံမှာ မမျှော်လင့်ဘဲ ပြန်လည်ဆုံစည်းခြင်း",
    "ရွာမှာ ကျန်ခဲ့တဲ့ အမေအိုဆီကို မြို့ကနေ ပြန်လာတဲ့ သားငယ်ရဲ့ မျက်ရည်ကျဖွယ် စိတ်ခံစားမှု",
    "မိုးသည်းထန်စွာ ရွာသွန်းတဲ့ ညနေခင်းမှာ တစ်ဦးနဲ့တစ်ဦး ကူညီဖေးမကြတဲ့ မြို့ပြလူသားတို့ရဲ့ မေတ္တာ"
  ],
  'Sci-Fi': [
    "အနာဂတ် ၂၀၉၉ ရန်ကုန်မြို့ကြီးမှာ စက်ရုပ်စားဖိုမှူးနဲ့ မြန်မာ့ရိုးရာ မုန့်ဟင်းခါး ချက်ပြိုင်ပွဲ",
    "ကမ္ဘာ့အာကာသစခန်းပေါ်မှာ ပထမဆုံး မြန်မာ့လက်ဖက်သုပ် သုပ်စားဖို့ ကြိုးစားတဲ့ အာကာသယာဉ်မှူး",
    "မိုးပျံတိုက်တွေပေါ်မှာ ပျံသန်းပြေးလွှားတဲ့ အနာဂတ် ရန်ကုန် စုံထောက်တစ်ဦးရဲ့ လျှို့ဝှက်မှုဖော်ထုတ်ခန်း",
    "အဆင့်မြင့် AI စက်ရုပ်ခွေးလေးတစ်ကောင်က ရွာက လမ်းဘေးခွေးလေးတွေနဲ့ မိတ်ဆွေဖွဲ့သွားပုံ",
    "အချိန်ခရီးသွား စက်တစ်ခုကို တီထွင်မိပြီး အနာဂတ်ကမ္ဘာဆီ ရောက်သွားတဲ့ လူငယ်သိပ္ပံပညာရှင်",
    "ဂြိုဟ်သစ်တစ်ခုဆီကို စူးစမ်းရှာဖွေဖို့ သွားရောက်တဲ့ အာကာသယာဉ်အဖွဲ့သားများ၏ တွေ့ရှိချက်",
    "တောရွာက ဆယ်ကျော်သက်လေးက ပျံသန်းနိုင်တဲ့ ဒရုန်းယာဉ်ကို ကိုယ်တိုင်တီထွင်ပြီး ရွာကို ကယ်တင်ပုံ"
  ],
  'Fantasy': [
    "ပုဂံခေတ်ကို မတော်တဆ အချိန်ခရီးသွားမိသွားတဲ့ ခေတ်သစ် ကောင်လေးတစ်ယောက်ရဲ့ စွန့်စားခန်း",
    "တိုက်ခန်းဟောင်းတစ်ခုထဲမှာ ပုန်းအောင်းနေတဲ့ ချစ်စရာ မှော်သတ္တဝါလေးကို ကလေးမလေးတစ်ယောက် တွေ့ရှိပုံ",
    "အင်းလေးကန်ပေါ်မှာ လှေလှော်ရင်း မမျှော်လင့်ဘဲ ရေအောက်မှော်မြို့တော်ကြီးဆီ ရောက်သွားတဲ့ တံငါသည်လေး",
    "မှော်ဆန်တဲ့ သစ်သားရုပ်သေးရုပ်လေးက ညဘက်ဆို အသက်ဝင်လာပြီး ကလေးငယ်လေးကို ကူညီပေးပုံ",
    "ရှေးဟောင်း စာကြည့်တိုက်ထဲက စာအုပ်တစ်အုပ်ကို ဖွင့်လိုက်တာနဲ့ ဒဏ္ဍာရီလာ နဂါးကြီး ထွက်လာပုံ",
    "တောနက်ထဲက မှော်သစ်ပင်ကြီးဆီကနေ ဆန္ဒတစ်ခု ပြည့်ခွင့်ရသွားတဲ့ ရွာသားလေး"
  ],
  'Motivational': [
    "အဘိုးအိုတစ်ယောက်ရဲ့ နှစ် ၅၀ သက်တမ်းရှိ လက်ဖက်ရည်ဖျော်နည်း လျှို့ဝှက်ချက်နဲ့ ဘဝအောင်မြင်မှု သင်ခန်းစာ",
    "ဆင်းရဲနွမ်းပါးတဲ့ ကျေးလက်ကောင်လေးတစ်ယောက် ကြိုးစားအားထုတ်မှုကြောင့် အောင်မြင်တဲ့ စွန့်ဦးတီထွင်သူ ဖြစ်လာပုံ",
    "အကြိမ်ကြိမ် ကျရှုံးခဲ့ပေမဲ့ လက်မလျှော့ဘဲ ကိုယ်ပိုင် အိပ်မက်ကို အကောင်အထည်ဖော်ခဲ့တဲ့ လူငယ်ပန်းချီဆရာ",
    "အသင်းငယ်လေးတစ်ခုကနေ စည်းလုံးညီညွတ်မှုနဲ့ ချန်ပီယံဆုကို ဆွတ်ခူးသွားတဲ့ ကျေးလက်ဘောလုံးအသင်း",
    "အသက်အရွယ်ကြီးရင့်ပေမဲ့ ကွန်ပျူတာပညာကို စတင်သင်ယူပြီး ဘဝသစ်ကို တည်ဆောက်ပြခဲ့တဲ့ အဘွားတစ်ဦး",
    "တစ်နေ့မှာ ပျော်ရွှင်မှု အစစ်အမှန်ဟာ သူတစ်ပါးကို ကူညီပေးခြင်းမှာ ရှိကြောင်း နားလည်သွားတဲ့ သူဌေးတစ်ယောက်"
  ],
  'Romance': [
    "မိုးရွာတဲ့ ညနေခင်း လက်ဖက်ရည်ဆိုင်လေးမှာ ထီးတစ်ချောင်းတည်း အတူဆောင်းရင်း စတင်ခဲ့တဲ့ ချိုမြိန်သော အချစ်ဇာတ်လမ်း",
    "ရန်ကုန်မြို့ပတ်ရထားပေါ်မှာ မတော်တဆ စာအုပ်ချင်း လဲမှားယူမိရာကနေ စတင်ဆုံတွေ့ခဲ့ကြပုံ",
    "တက္ကသိုလ်ကျောင်းတော်ကြီးထဲက စာကြည့်တိုက်မှာ အတူစာကျက်ရင်း သံယောဇဉ် တွယ်ငြိခဲ့ရတဲ့ အချစ်ဇာတ်လမ်း",
    "တောင်ကြီး တန်ဆောင်တိုင် ပွဲတော်ညမှာ မီးပုံးပျံကြီးကို အတူကြည့်ရင်း ဖွင့်ပြောခဲ့တဲ့ အချစ်ဇာတ်လမ်း",
    "အဝေးရောက် ချစ်သူနှစ်ဦးရဲ့ နှစ်ပေါင်းများစွာ စောင့်ဆိုင်းပြီးနောက် လေဆိပ်မှာ ပြန်လည်ဆုံစည်းခြင်း"
  ],
  'Detective': [
    "ရန်ကုန်မြို့လယ်က ရှေးဟောင်း ရွှေဆိုင်ကြီးထဲက ပျောက်ဆုံးသွားတဲ့ စိန်လည်ဆွဲနီကို စုံထောက်လူငယ် ဖော်ထုတ်ခြင်း",
    "ရွာထဲက ထူးဆန်းသော ခြေရာများနှင့် သဲလွန်စများကို အသုံးချပြီး သူခိုးကို ဖမ်းဆီးခဲ့တဲ့ ရွာသားစုံထောက်",
    "သစ်တောကြိုးဝိုင်းထဲမှာ လျှို့ဝှက်သစ်ခိုးထုတ်နေတဲ့ ဂိုဏ်းကြီးကို ဖော်ထုတ်ဖမ်းဆီးတဲ့ သစ်တောစုံထောက်",
    "အဆင့်မြင့် ကွန်ပျူတာ စနစ်တွေကို ဖောက်ထွင်းတဲ့ ဆိုက်ဘာရာဇဝတ်ကောင်ကို ခြေရာခံဖမ်းဆီးသော စုံထောက်ဇာတ်လမ်း",
    "ရှေးဟောင်း ပြတိုက်ထဲက လျှို့ဝှက်နက်နဲသော ပဟေဠိသော့ချက်ကို ဖြေရှင်းသည့် ပါရမီရှင် စုံထောက်"
  ],
  'Educational': [
    "ကလေးငယ်များအတွက် အာကာသနှင့် နေအဖွဲ့အစည်းအကြောင်း ရုပ်ပြဖြင့် ရှင်းလင်းပြသသော ပညာပေးဇာတ်လမ်း",
    "သဘာဝပတ်ဝန်းကျင် ထိန်းသိမ်းရေးနှင့် သစ်ပင်စိုက်ပျိုးခြင်း၏ အကျိုးကျေးဇူးများကို ဖော်ညွှန်းသော ဇာတ်လမ်း",
    "ကိုယ်ပိုင်ငွေကြေး စီမံခန့်ခွဲမှုနှင့် ငွေစုဆောင်းခြင်း အလေ့အကျင့်ကောင်းများ ပညာပေး",
    "ကျန်းမာရေးနှင့် ညီညွတ်သော အစားအသောက် စားသုံးပုံနှင့် ကိုယ်လက်လှုပ်ရှားမှု အလေ့အထ ပညာပေး",
    "AI နှင့် ခေတ်မီ နည်းပညာများကို မှန်ကန်စွာ အသုံးချနည်း လမ်းညွှန်ပညာပေး ဇာတ်လမ်း"
  ]
};

function getStoryIdeasForGenre(genre) {
  const g = (genre || '').toLowerCase();
  if (g.includes('biography') || g.includes('history') || g.includes('အတ္ထုပ္ပတ္တိ') || g.includes('သမိုင်း')) return genreStoryIdeas['Biography'];
  if (g.includes('romance') || g.includes('အချစ်')) return genreStoryIdeas['Romance'];
  if (g.includes('detective') || g.includes('စုံထောက်')) return genreStoryIdeas['Detective'];
  if (g.includes('educational') || g.includes('ပညာပေး')) return genreStoryIdeas['Educational'];
  if (g.includes('horror') || g.includes('mystery')) return genreStoryIdeas['Horror'];
  if (g.includes('action') || g.includes('adventure')) return genreStoryIdeas['Action'];
  if (g.includes('drama') || g.includes('emotional')) return genreStoryIdeas['Drama'];
  if (g.includes('sci-fi') || g.includes('futuristic')) return genreStoryIdeas['Sci-Fi'];
  if (g.includes('fantasy') || g.includes('magic')) return genreStoryIdeas['Fantasy'];
  if (g.includes('motivational') || g.includes('storytelling')) return genreStoryIdeas['Motivational'];
  return genreStoryIdeas['Comedy'];
}

// =========================================================================
// 🎯 AUTO-SYNC ENGINE: Sections 2 & 3 Auto-Harmonization from Genre/Topic/Format
// =========================================================================

function autoSyncParametersFromGenreAndTopic(source = 'genre') {
  const genreEl = document.getElementById('genre');
  const topicEl = document.getElementById('topicInput');
  const formatEl = document.getElementById('videoFormat');
  const cultureEl = document.getElementById('settingCulture');
  const artStyleEl = document.getElementById('artStyle');
  const flowEl = document.getElementById('videoFlow');
  const targetAIEl = document.getElementById('targetAI');
  const ratioEl = document.getElementById('aspectRatio');
  const charConsEl = document.getElementById('charConsistency');
  const namingEl = document.getElementById('namingStyle');
  const voiceEl = document.getElementById('voiceOverPersona');
  const audioEl = document.getElementById('audioStyle');

  if (!genreEl) return;
  const genre = (genreEl.value || '').toLowerCase();
  const topic = (topicEl ? topicEl.value || '' : '').toLowerCase();
  const format = (formatEl ? formatEl.value || '' : '').toLowerCase();
  const isSeries = format.includes('series');

  // Helper function to safely select option by matching substring and highlight visually
  function selectOption(el, substring) {
    if (!el || !el.options) return;
    for (let opt of el.options) {
      if (opt.value.toLowerCase().includes(substring.toLowerCase())) {
        el.value = opt.value;
        el.classList.add('ring-2', 'ring-cyan-400', 'bg-[#1e293b]');
        setTimeout(() => el.classList.remove('ring-2', 'ring-cyan-400'), 500);
        break;
      }
    }
  }

  // 1. Setting Culture Auto-Sync
  if (cultureEl) {
    if (topic.includes('vinci') || topic.includes('einstein') || topic.includes('jobs') || topic.includes('tesla') || topic.includes('curie') || topic.includes('gandhi') || topic.includes('western') || topic.includes('new york') || topic.includes('london')) {
      selectOption(cultureEl, 'Western Modern');
    } else if (genre.includes('sci-fi') || topic.includes('၂၀၉၉') || topic.includes('စက်ရုပ်') || topic.includes('အာကာသ') || topic.includes('ဒရုန်း') || topic.includes('cyber')) {
      selectOption(cultureEl, 'Futuristic Cyber City');
    } else if (topic.includes('ပုဂံ') || topic.includes('ရှေးခေတ်') || topic.includes('မဟာဗန္ဓုလ') || topic.includes('ဦးအောင်ဇေယျ') || topic.includes('စစ်သူကြီး') || topic.includes('သခင်ဖိုးလှကြီး')) {
      selectOption(cultureEl, 'Ancient Bagan');
    } else if (genre.includes('fantasy') && (topic.includes('ghibli') || topic.includes('ဂျပန်'))) {
      selectOption(cultureEl, 'Japanese Anime Town');
    } else if (genre.includes('comedy') || topic.includes('ရွာ') || topic.includes('တောရွာ') || topic.includes('လယ်တော') || topic.includes('ဖိုးထောင်')) {
      selectOption(cultureEl, 'Myanmar Rural');
    } else if (genre.includes('drama') || topic.includes('ရန်ကုန်') || topic.includes('မန္တလေး') || topic.includes('မြို့') || topic.includes('ကော်ဖီ')) {
      selectOption(cultureEl, 'Myanmar Modern City');
    }
  }

  // 2. Section 2 & Section 3 Smart Parameter Alignment by Genre & Topic
  if (genre.includes('biography') || genre.includes('history') || genre.includes('အတ္ထုပ္ပတ္တိ') || genre.includes('သမိုင်း')) {
    selectOption(artStyleEl, 'Realistic');
    selectOption(flowEl, 'Seamless Continuous');
    selectOption(targetAIEl, 'Google Flow');
    selectOption(charConsEl, 'Fixed Character Seed');
    if (topic.includes('vinci') || topic.includes('einstein') || topic.includes('jobs') || topic.includes('tesla') || topic.includes('curie') || topic.includes('gandhi')) {
      selectOption(namingEl, 'Western');
    } else {
      selectOption(namingEl, 'Traditional');
    }
    selectOption(voiceEl, 'Calm & Soft Documentary');
    selectOption(audioEl, 'Cinematic Orchestral');
  } else if (genre.includes('romance') || genre.includes('အချစ်')) {
    selectOption(artStyleEl, '3D Pixar');
    selectOption(flowEl, 'Slow-Motion Orbit');
    selectOption(targetAIEl, 'Google Flow');
    selectOption(charConsEl, '2 Main Characters');
    selectOption(namingEl, 'Modern');
    selectOption(voiceEl, 'Female Sweet Storyteller');
    selectOption(audioEl, 'Character Speaking');
  } else if (genre.includes('detective') || genre.includes('စုံထောက်')) {
    selectOption(artStyleEl, 'Realistic');
    selectOption(flowEl, 'Dynamic Match-Cut');
    selectOption(targetAIEl, 'Kling AI');
    selectOption(charConsEl, 'Fixed Character Seed');
    selectOption(namingEl, 'Modern');
    selectOption(voiceEl, 'Male Movie Narrator');
    selectOption(audioEl, 'Dialogue + Ambient');
  } else if (genre.includes('educational') || genre.includes('ပညာပေး')) {
    selectOption(artStyleEl, '2D Animation');
    selectOption(flowEl, 'Seamless Continuous');
    selectOption(targetAIEl, 'Google Flow');
    selectOption(charConsEl, 'Fixed Character Seed');
    selectOption(namingEl, 'Modern');
    selectOption(voiceEl, 'Professional Broadcaster');
    selectOption(audioEl, 'Voice Over');
  } else if (genre.includes('comedy')) {
    if (topic.includes('stick') || topic.includes('ကြိုးလူသား')) {
      selectOption(artStyleEl, 'Stick Man');
    } else {
      selectOption(artStyleEl, '3D Pixar');
    }
    selectOption(flowEl, 'Whip-Pan');
    selectOption(targetAIEl, 'Google Flow');
    selectOption(charConsEl, '2 Main Characters');
    selectOption(namingEl, 'Funny');
    selectOption(voiceEl, 'Comedic Myanmar Village Uncle');
    selectOption(audioEl, 'Background Music & Funny SFX');
  } else if (genre.includes('horror') || genre.includes('mystery')) {
    selectOption(artStyleEl, 'Realistic');
    selectOption(flowEl, 'FPV Drone');
    selectOption(targetAIEl, 'Hailuo AI');
    selectOption(charConsEl, 'Fixed Character Seed');
    selectOption(namingEl, 'Modern');
    selectOption(voiceEl, 'Mystery & Horror Suspense');
    selectOption(audioEl, 'Dialogue + Ambient');
  } else if (genre.includes('action') || genre.includes('adventure')) {
    selectOption(artStyleEl, 'Realistic');
    selectOption(flowEl, 'Dynamic Match-Cut');
    selectOption(targetAIEl, 'Runway Gen-3');
    selectOption(charConsEl, 'Fixed Character Seed');
    selectOption(namingEl, 'Traditional');
    selectOption(voiceEl, 'Male Movie Narrator');
    selectOption(audioEl, 'Cinematic Orchestral');
  } else if (genre.includes('drama') || genre.includes('emotional')) {
    selectOption(artStyleEl, 'Realistic');
    selectOption(flowEl, 'Slow-Motion Orbit');
    selectOption(targetAIEl, 'Hailuo AI');
    selectOption(charConsEl, '2 Main Characters');
    selectOption(namingEl, 'Modern');
    selectOption(voiceEl, 'Female Sweet Storyteller');
    selectOption(audioEl, 'Character Speaking');
  } else if (genre.includes('sci-fi') || genre.includes('futuristic')) {
    selectOption(artStyleEl, 'Cyberpunk');
    selectOption(flowEl, 'Zoom-In & Morph');
    selectOption(targetAIEl, 'OpenAI Sora');
    selectOption(charConsEl, 'Fixed Character Seed');
    selectOption(namingEl, 'Modern');
    selectOption(voiceEl, 'Male Movie Narrator');
    selectOption(audioEl, 'Dialogue + Ambient');
  } else if (genre.includes('fantasy') || genre.includes('magic')) {
    selectOption(artStyleEl, 'Anime');
    selectOption(flowEl, 'Zoom-In & Morph');
    selectOption(targetAIEl, 'Google Flow');
    selectOption(charConsEl, 'Fixed Character Seed');
    selectOption(namingEl, 'Cute');
    selectOption(voiceEl, 'Female Sweet Storyteller');
    selectOption(audioEl, 'Cinematic Orchestral');
  } else if (genre.includes('motivational') || genre.includes('storytelling')) {
    selectOption(artStyleEl, 'Realistic');
    selectOption(flowEl, 'Seamless Continuous');
    selectOption(targetAIEl, 'Google Flow');
    selectOption(charConsEl, 'Fixed Character Seed');
    selectOption(namingEl, 'Modern');
    selectOption(voiceEl, 'Calm & Soft Documentary');
    selectOption(audioEl, 'Voiceover Narration');
  }

  // 3. If Series is selected, enforce strict Character Consistency
  if (isSeries && charConsEl) {
    selectOption(charConsEl, 'Fixed Character Seed');
  }

  // Update Meta Badges if visible
  if (document.getElementById('badgeGenre')) document.getElementById('badgeGenre').textContent = `Genre: ${genreEl.value.split('(')[0]}`;
  if (document.getElementById('badgeStyle') && artStyleEl) document.getElementById('badgeStyle').textContent = `Style: ${artStyleEl.value.split('(')[0]}`;
  if (document.getElementById('badgeVoice') && voiceEl) document.getElementById('badgeVoice').textContent = `Voice: ${voiceEl.value.split('(')[0].replace('🎙️', '').trim()}`;
}

function onGenreChange() {
  const genreSelect = document.getElementById('genre');
  const topicInput = document.getElementById('topicInput');
  if (!genreSelect || !topicInput) return;

  const genre = genreSelect.value;
  const ideas = getStoryIdeasForGenre(genre);
  
  if (ideas && ideas.length > 0) {
    const randomPick = ideas[Math.floor(Math.random() * ideas.length)];
    topicInput.value = randomPick;
    topicInput.classList.add('ring-2', 'ring-indigo-500');
    setTimeout(() => topicInput.classList.remove('ring-2', 'ring-indigo-500'), 500);
  }

  autoSyncParametersFromGenreAndTopic('genre');
  showToast(`🎯 ${genre.split('(')[0].trim()} အတွက် အလိုက်ဖက်ဆုံး ရုပ်ထွက် (Visual Style) နှင့် အသံ (Voiceover) များကို အလိုအလျောက် ရွေးချယ်ပေးလိုက်ပါပြီ!`);
}

function onVideoFormatChange() {
  autoSyncParametersFromGenreAndTopic('format');
  const formatEl = document.getElementById('videoFormat');
  const isSeries = formatEl && formatEl.value.includes('Series');
  if (isSeries) {
    showToast(`📺 Series ဇာတ်လမ်းတွဲအတွက် ဇာတ်ကောင်တသမတ်တည်း (Fixed Character Seed) နှင့် အခန်းဆက် စနစ်ကို အလိုအလျောက် ချိန်ညှိပေးလိုက်ပါပြီ!`);
  } else {
    showToast(`🎬 Single Episode (တစ်ခန်းရပ်ဇာတ်လမ်း) အတွက် အလိုအလျောက် ချိန်ညှိပြီးပါပြီ!`);
  }
}

function onTopicInputChange() {
  autoSyncParametersFromGenreAndTopic('topic');
}

// ==========================================
// 📸 MULTI-PHOTO CHARACTER STUDIO & VISION ENGINE
// ==========================================

function toggleCharacterStudioSwitch(forceState) {
  state.charStudioEnabled = (forceState !== undefined) ? forceState : !state.charStudioEnabled;
  
  const studioPanel = document.getElementById('characterStudioPanel');
  const offNotice = document.getElementById('charStudioOffNotice');
  const toggleBtn = document.getElementById('charStudioToggleBtn');
  const toggleThumb = document.getElementById('charStudioToggleThumb');
  const statusBadge = document.getElementById('charStudioStatusBadge');

  if (state.charStudioEnabled) {
    if (studioPanel) studioPanel.classList.remove('hidden');
    if (offNotice) offNotice.classList.add('hidden');
    if (toggleBtn) {
      toggleBtn.classList.remove('bg-slate-700');
      toggleBtn.classList.add('bg-emerald-600');
      toggleBtn.setAttribute('aria-checked', 'true');
    }
    if (toggleThumb) {
      toggleThumb.classList.remove('translate-x-1');
      toggleThumb.classList.add('translate-x-7');
    }
    if (statusBadge) {
      statusBadge.textContent = "ON (Custom)";
      statusBadge.className = "text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-mono cursor-pointer hover:bg-emerald-900 transition-colors";
    }
    showToast("✨ ဇာတ်ကောင် ဖန်တီးမှု စနစ်ကို ဖွင့်လိုက်ပါပြီ (Custom Character Studio Active)");
  } else {
    if (studioPanel) studioPanel.classList.add('hidden');
    if (offNotice) offNotice.classList.remove('hidden');
    if (toggleBtn) {
      toggleBtn.classList.remove('bg-emerald-600');
      toggleBtn.classList.add('bg-slate-700');
      toggleBtn.setAttribute('aria-checked', 'false');
    }
    if (toggleThumb) {
      toggleThumb.classList.remove('translate-x-7');
      toggleThumb.classList.add('translate-x-1');
    }
    if (statusBadge) {
      statusBadge.textContent = "OFF (Genre Mode)";
      statusBadge.className = "text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-mono cursor-pointer hover:bg-slate-700 transition-colors";
    }
    showToast("🎭 Genre Mode သို့ ပြောင်းလိုက်ပါပြီ (ဓါတ်ပုံမတင်ဘဲ Genre အလိုက် အလိုအလျောက် ထုတ်ပေးပါမည်)");
  }
}

function switchCharacterSubTab(tabName) {
  state.charStudioSubTab = tabName;
  
  const photoTab = document.getElementById('charSubTabPhoto');
  const textTab = document.getElementById('charSubTabText');
  const photoBtn = document.getElementById('tabCharPhotoBtn');
  const textBtn = document.getElementById('tabCharTextBtn');

  if (tabName === 'photo') {
    if (photoTab) photoTab.classList.remove('hidden');
    if (textTab) textTab.classList.add('hidden');
    if (photoBtn) {
      photoBtn.className = "px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all mm-text cursor-pointer shadow";
    }
    if (textBtn) {
      textBtn.className = "px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 font-medium text-xs flex items-center gap-1.5 transition-all mm-text cursor-pointer hover:bg-slate-800";
    }
  } else {
    if (photoTab) photoTab.classList.add('hidden');
    if (textTab) textTab.classList.remove('hidden');
    if (textBtn) {
      textBtn.className = "px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all mm-text cursor-pointer shadow";
    }
    if (photoBtn) {
      photoBtn.className = "px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 font-medium text-xs flex items-center gap-1.5 transition-all mm-text cursor-pointer hover:bg-slate-800";
    }
  }
}

function renderPhotoStorySuggestions(suggestions) {
  const container = document.getElementById('photoStorySuggestionsContainer');
  const list = document.getElementById('photoStorySuggestionsList');
  if (!container || !list) return;

  if (!suggestions || suggestions.length === 0) {
    container.classList.add('hidden');
    return;
  }

  state.photoStorySuggestions = suggestions;
  container.classList.remove('hidden');

  list.innerHTML = suggestions.map((sug, idx) => `
    <button type="button" onclick="applyStorySuggestion(${idx})" class="group text-left px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-amber-950/40 border border-amber-500/30 hover:border-amber-400 text-slate-200 hover:text-amber-200 text-xs transition-all shadow-sm flex items-start gap-1.5 cursor-pointer mm-text">
      <span class="text-amber-400 font-bold group-hover:scale-110 transition-transform">✨ #${idx + 1}</span>
      <span class="line-clamp-2">${escapeHtml(sug)}</span>
    </button>
  `).join('');
}

function applyStorySuggestion(index) {
  const sug = state.photoStorySuggestions[index];
  if (!sug) return;

  const input = document.getElementById('topicInput');
  if (input) {
    input.value = sug;
    input.classList.add('ring-2', 'ring-amber-400');
    setTimeout(() => input.classList.remove('ring-2', 'ring-amber-400'), 500);
  }

  autoSyncParametersFromGenreAndTopic('topic');
  showToast(`💡 အကြံပြုထားသော ဇာတ်လမ်းစိတ်ကူး #${index + 1} ကို ရွေးချယ်လိုက်ပါပြီ!`);
}

function handleMultipleImageUpload(event) {
  const files = Array.from(event.target.files || []);
  if (files.length === 0) return;
  files.forEach(file => processUploadedFile(file));
  event.target.value = ''; // Reset input to allow re-uploading same file
}

function handleDragOver(event) {
  event.preventDefault();
  event.stopPropagation();
  const dropArea = document.getElementById('imageDropArea');
  if (dropArea) dropArea.classList.add('border-indigo-400', 'bg-indigo-950/40');
}

function handleDragLeave(event) {
  event.preventDefault();
  event.stopPropagation();
  const dropArea = document.getElementById('imageDropArea');
  if (dropArea) dropArea.classList.remove('border-indigo-400', 'bg-indigo-950/40');
}

function handleDrop(event) {
  event.preventDefault();
  event.stopPropagation();
  const dropArea = document.getElementById('imageDropArea');
  if (dropArea) dropArea.classList.remove('border-indigo-400', 'bg-indigo-950/40');

  if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
    const files = Array.from(event.dataTransfer.files);
    files.forEach(file => processUploadedFile(file));
  }
}

function processUploadedFile(file) {
  if (!file.type.startsWith('image/')) {
    showToast("⚠️ ကျေးဇူးပြု၍ ဓါတ်ပုံဖိုင် (JPG, PNG, WEBP) ကိုသာ ရွေးချယ်ပေးပါခင်ဗျာ။");
    return;
  }

  if (state.uploadedImages.length >= 6) {
    showToast("⚠️ အများဆုံး ဓါတ်ပုံ ၆ ပုံအထိသာ တင်နိုင်ပါသည်");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    const base64Data = dataUrl.split(',')[1];
    const charIndex = state.uploadedImages.length + 1;

    // Smart default names based on position
    const defaultNames = ["မင်းခန့်", "မအေးသန်း", "ဖိုးထောင်", "ဦးဘချစ်", "Alex", "Emma"];
    const defaultRoles = ["ဇာတ်လိုက်ကျော်", "တွဲဖက်ဇာတ်လိုက်", "ရွာသားလူရွှင်တော်", "ရွာလူကြီး", "အာကာသစုံထောက်", "မင်းသမီး"];

    const defaultVoices = [
      "Male Movie Narrator (ယောက်ျားလေး - ရုပ်ရှင်ဆန်ဆန် ဩဇာတိက္ကမရှိသော ဇာတ်ကြောင်းပြောသံ)",
      "Female Sweet Storyteller (မိန်းကလေး - ချိုသာနွေးထွေးသော ပုံပြင်ပြောသံ)",
      "Comedic Myanmar Village Uncle (ဟာသဆန်ဆန် ကျေးလက်အဘိုးကြီး/ကိုကြီး အသံ)",
      "Energetic TikTok / Reels Host (လူငယ်ဆန်ဆန် သွက်လက်မြူးကြွသော အသံ)",
      "Comedic Village Auntie (ဟာသဆန်ဆန် စကားကြွယ် ရွာအဒေါ်ကြီး အသံ)",
      "Cute Anime Kid / Cartoon Character (ကလေးချစ်စရာ ကာတွန်းဇာတ်ကောင် အသံ)"
    ];

    const newChar = {
      id: 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      mime: file.type,
      base64: base64Data,
      dataUrl: dataUrl,
      charName: defaultNames[charIndex - 1] || `ဇာတ်ကောင် ${charIndex}`,
      charRole: defaultRoles[charIndex - 1] || "အဓိက ဇာတ်ကောင်",
      charVoice: defaultVoices[(charIndex - 1) % defaultVoices.length],
      charAppearance: `ဓါတ်ပုံ #${charIndex} ထဲမှ မျက်နှာသွင်ပြင်နှင့် ဝတ်စုံ`,
      charCostume: "ဓါတ်ပုံထဲတွင် ဝတ်ဆင်ထားသော စတိုင်"
    };

    state.uploadedImages.push(newChar);
    renderCharacterPreviewCards();

    // Auto-generate instant story suggestions
    const namesList = state.uploadedImages.map(i => i.charName).join(' နှင့် ');
    const autoSuggestions = [
      `${namesList} တို့ ရွာထဲက ထူးဆန်းသော ရတနာသေတ္တာအဟောင်းကို တွေ့ရှိပြီး ဖြစ်ပျက်သော ဟာသစွန့်စားခန်း`,
      `${namesList} တို့၏ မြို့ပြ လျှို့ဝှက်ဆန်းကြယ်မှုများ ဖော်ထုတ်ခြင်း စုံထောက်ဆန်ဆန် ခရီးစဉ်`,
      `${namesList} တို့၏ ရိုးရာဓလေ့နှင့် အမှတ်တရများကို ဖော်ညွှန်းထားသော စိတ်ထိခိုက်ဖွယ် ဒရာမာဇာတ်လမ်း`
    ];
    renderPhotoStorySuggestions(autoSuggestions);

    showToast(`📸 ဇာတ်ကောင် #${charIndex} ဓါတ်ပုံ တင်သွင်းပြီးပါပြီ! ဇာတ်လမ်းအကြံပြုချက်များကို အပေါ်တွင် ရွေးချယ်နိုင်ပါသည်`);
  };
  reader.readAsDataURL(file);
}

function renderCharacterPreviewCards() {
  const gallery = document.getElementById('characterPreviewGallery');
  const dropArea = document.getElementById('imageDropArea');
  const cardsList = document.getElementById('characterCardsList');
  const countNum = document.getElementById('charCountNum');

  if (!gallery || !dropArea || !cardsList) return;

  if (state.uploadedImages.length === 0) {
    gallery.classList.add('hidden');
    dropArea.classList.remove('hidden');
    updateCharacterVoicePreviewBoard();
    return;
  }

  gallery.classList.remove('hidden');
  if (countNum) countNum.textContent = state.uploadedImages.length;

  const voiceOptions = [
    { value: "Male Movie Narrator (ယောက်ျားလေး - ရုပ်ရှင်ဆန်ဆန် ဩဇာတိက္ကမရှိသော ဇာတ်ကြောင်းပြောသံ)", label: "🎙️ Male Movie (ရုပ်ရှင်သံ)" },
    { value: "Female Sweet Storyteller (မိန်းကလေး - ချိုသာနွေးထွေးသော ပုံပြင်ပြောသံ)", label: "🎙️ Female Sweet (ချိုသာသံ)" },
    { value: "Energetic TikTok / Reels Host (လူငယ်ဆန်ဆန် သွက်လက်မြူးကြွသော အသံ)", label: "🎙️ Energetic Host (သွက်လက်သံ)" },
    { value: "Comedic Myanmar Village Uncle (ဟာသဆန်ဆန် ကျေးလက်အဘိုးကြီး/ကိုကြီး အသံ)", label: "🎙️ Village Uncle (ရွာအဘိုးကြီးသံ)" },
    { value: "Comedic Village Auntie (ဟာသဆန်ဆန် စကားကြွယ် ရွာအဒေါ်ကြီး အသံ)", label: "🎙️ Village Auntie (ရွာအဒေါ်ကြီးသံ)" },
    { value: "Mystery & Horror Suspense Whisper (သည်းထိတ်ရင်ဖို လျှို့ဝှက်ဆန်းကြယ် တီးတိုးသံ)", label: "🎙️ Mystery Whisper (တီးတိုးသံ)" },
    { value: "Calm & Soft Documentary Narrator (အေးချမ်းငြိမ့်ညောင်းသော မှတ်တမ်းရုပ်ရှင်သံ)", label: "🎙️ Calm Documentary (ငြိမ့်ညောင်းသံ)" },
    { value: "Cute Anime Kid / Cartoon Character (ကလေးချစ်စရာ ကာတွန်းဇာတ်ကောင် အသံ)", label: "🎙️ Cute Cartoon (ကာတွန်းသံ)" },
    { value: "Professional Broadcaster / News Host (သတင်းကြေညာသူ ဆန်ဆန် တိကျသေသပ်သော အသံ)", label: "🎙️ News Broadcaster (သတင်းသံ)" }
  ];

  cardsList.innerHTML = state.uploadedImages.map((img, idx) => {
    const currentVoice = img.charVoice || voiceOptions[0].value;
    const voiceOptsHtml = voiceOptions.map(vo => `
      <option value="${vo.value}" ${currentVoice === vo.value ? 'selected' : ''}>${vo.label}</option>
    `).join('');

    return `
    <div class="bg-slate-900/95 border border-indigo-500/50 rounded-2xl p-3.5 space-y-3 hover:border-indigo-400 transition-all shadow-md animate-fade-in">
      <div class="flex items-start gap-3.5">
        <!-- Photo Thumbnail with Index Badge -->
        <div class="relative shrink-0">
          <img src="${img.dataUrl}" alt="${escapeHtml(img.charName)}" class="w-18 h-18 object-cover rounded-xl border-2 border-indigo-500 shadow-md">
          <span class="absolute -top-1.5 -left-1.5 px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-600 to-emerald-600 text-white text-[10px] font-black shadow-lg">
            #${idx + 1}
          </span>
        </div>

        <!-- Name and Role Fields -->
        <div class="flex-1 min-w-0 space-y-2 text-xs">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-emerald-300 mm-text flex items-center gap-1.5">
              <span>👤 ဇာတ်ကောင် #${idx + 1} ဓါတ်ပုံ</span>
              <span class="text-[10px] text-slate-400 font-mono">(${img.size})</span>
            </span>
            <button type="button" onclick="removeUploadedImageById('${img.id}')" class="text-rose-400 hover:text-rose-300 p-1 rounded-lg hover:bg-rose-950/60 transition-all cursor-pointer" title="ဤဓါတ်ပုံ ဖယ်ရှားမည်">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <!-- Character Name Input (Custom Name by User) -->
          <div class="space-y-1">
            <label class="text-[10px] font-bold text-indigo-300 mm-text flex items-center gap-1">
              <span>🏷️ ဇာတ်ကောင် အမည် (Character Name): *</span>
            </label>
            <input type="text" value="${escapeHtml(img.charName)}" oninput="updateCharField('${img.id}', 'charName', this.value)" placeholder="ဥပမာ - မင်းခန့်၊ ဖိုးထောင်" class="w-full bg-[#1e293b] border border-indigo-500/60 rounded-lg px-3 py-1.5 text-xs text-white font-bold focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 focus:outline-none mm-text">
          </div>
        </div>
      </div>

      <!-- Role & Voice Selection Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs pt-1.5 border-t border-slate-800/80">
        <!-- Role -->
        <div class="space-y-1">
          <label class="text-[10px] font-semibold text-slate-300 mm-text">🎭 အခန်းကဏ္ဍ (Role):</label>
          <input type="text" value="${escapeHtml(img.charRole)}" oninput="updateCharField('${img.id}', 'charRole', this.value)" placeholder="ဥပမာ - အဓိက ဇာတ်လိုက်" class="w-full bg-[#1e293b]/90 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:border-emerald-400 focus:outline-none mm-text">
        </div>

        <!-- Assigned Voice with Audition Button -->
        <div class="space-y-1">
          <div class="flex items-center justify-between">
            <label class="text-[10px] font-semibold text-emerald-300 mm-text flex items-center gap-1">
              <span>🎙️ သီးသန့် အသံ (Voice):</span>
            </label>
            <button type="button" onclick="previewCharacterVoice('${escapeHtml(img.charName)}', '${escapeHtml(img.charRole)}', '${escapeHtml(currentVoice)}', 'Myanmar')" class="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] flex items-center gap-1 transition-all shadow cursor-pointer mm-text">
              <span>🔊 နားထောင်</span>
            </button>
          </div>
          <select onchange="updateCharField('${img.id}', 'charVoice', this.value)" class="w-full bg-[#111827] border border-emerald-600/50 rounded-lg px-2.5 py-1.5 text-xs text-emerald-200 focus:border-emerald-400 focus:outline-none mm-text cursor-pointer">
            ${voiceOptsHtml}
          </select>
        </div>
      </div>

      <!-- Appearance & Costume -->
      <div class="space-y-1 text-xs">
        <label class="text-[10px] font-medium text-slate-400 mm-text">👕 ရုပ်သွင်ပြင် & ဝတ်စုံ (Costume & Look):</label>
        <input type="text" value="${escapeHtml(img.charAppearance)}" oninput="updateCharField('${img.id}', 'charAppearance', this.value)" placeholder="ဥပမာ - အသက် ၂၅ နှစ်၊ ဂျာကင်နှင့် မျက်မှန်" class="w-full bg-[#1e293b]/80 border border-slate-700/80 rounded-lg px-2.5 py-1 text-[11px] text-slate-300 focus:border-emerald-400 focus:outline-none mm-text">
      </div>
    </div>
    `;
  }).join('');

  // Sync with Section 2 Custom Character Fields
  if (state.uploadedImages[0]) {
    const firstChar = state.uploadedImages[0];
    if (document.getElementById('customCharName')) document.getElementById('customCharName').value = firstChar.charName;
    if (document.getElementById('customCharRole')) document.getElementById('customCharRole').value = firstChar.charRole;
    if (document.getElementById('customCharAppearance')) document.getElementById('customCharAppearance').value = firstChar.charAppearance;
  }

  updateCharacterVoicePreviewBoard();
}

function updateCharField(id, field, value) {
  const img = state.uploadedImages.find(item => item.id === id);
  if (img) {
    img[field] = value;
    // If it's the primary character, sync with Section 2 Studio inputs
    if (state.uploadedImages[0] && state.uploadedImages[0].id === id) {
      if (field === 'charName' && document.getElementById('customCharName')) document.getElementById('customCharName').value = value;
      if (field === 'charRole' && document.getElementById('customCharRole')) document.getElementById('customCharRole').value = value;
      if (field === 'charAppearance' && document.getElementById('customCharAppearance')) document.getElementById('customCharAppearance').value = value;
    }
  }
  updateCharacterVoicePreviewBoard();
}

function removeUploadedImageById(id) {
  state.uploadedImages = state.uploadedImages.filter(item => item.id !== id);
  renderCharacterPreviewCards();
  showToast("ဓါတ်ပုံကို ဖယ်ရှားလိုက်ပါပြီ");
}

function clearAllUploadedImages() {
  state.uploadedImages = [];
  renderCharacterPreviewCards();
  showToast("တင်ထားသော ဓါတ်ပုံများ အားလုံးကို ရှင်းလင်းလိုက်ပါပြီ");
}

function updateCharacterVoicePreviewBoard() {
  const grid = document.getElementById('characterVoiceCardsGrid');
  if (!grid) return;

  const langSelect = document.getElementById('language');
  const lang = langSelect ? langSelect.value : 'Myanmar';

  // Mode 1: If Photo mode with uploaded images
  if (state.charStudioEnabled && state.charStudioSubTab === 'photo' && state.uploadedImages.length > 0) {
    grid.innerHTML = state.uploadedImages.map((img, idx) => {
      const vName = (img.charVoice || "Male Movie Narrator").split('(')[0].trim();
      return `
        <div class="bg-slate-900/90 border border-indigo-500/50 rounded-xl p-3 flex items-center justify-between gap-3 shadow-md hover:border-indigo-400 transition-all">
          <div class="flex items-center gap-2.5 min-w-0">
            <img src="${img.dataUrl}" alt="${escapeHtml(img.charName)}" class="w-12 h-12 object-cover rounded-lg border-2 border-indigo-500/70 shrink-0">
            <div class="min-w-0">
              <div class="flex items-center gap-1.5">
                <span class="text-xs font-bold text-white mm-text truncate">${escapeHtml(img.charName || `ဇာတ်ကောင် #${idx+1}`)}</span>
                <span class="text-[9px] px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60 font-mono">#${idx+1}</span>
              </div>
              <div class="text-[10px] text-slate-300 mm-text truncate">${escapeHtml(img.charRole || 'အဓိက ဇာတ်ကောင်')}</div>
              <div class="text-[9px] text-emerald-300 font-mono flex items-center gap-1 mt-0.5">
                <span>🎙️</span>
                <span class="truncate">${escapeHtml(vName)}</span>
              </div>
            </div>
          </div>

          <button type="button" onclick="previewCharacterVoice('${escapeHtml(img.charName)}', '${escapeHtml(img.charRole)}', '${escapeHtml(img.charVoice || "Male Movie Narrator")}', '${lang}')" class="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-emerald-950/60 transition-all shrink-0 cursor-pointer mm-text hover:scale-105 active:scale-95">
            <span class="animate-pulse">🔊</span>
            <span>Preview အသံ</span>
          </button>
        </div>
      `;
    }).join('');
    return;
  }

  // Mode 2: Presets / Text Mode or Duo Couple
  const consistency = document.getElementById('charConsistency') ? document.getElementById('charConsistency').value : '';
  const isDuo = consistency.includes('Duo') || consistency.includes('၂ ယောက်');
  const mainName = (document.getElementById('customCharName') ? document.getElementById('customCharName').value.trim() : '') || 'မင်းခန့်';
  const mainRole = (document.getElementById('customCharRole') ? document.getElementById('customCharRole').value.trim() : '') || 'ပါရမီရှင် စုံထောက်လူငယ်';
  const mainVoice = document.getElementById('voiceOverPersona') ? document.getElementById('voiceOverPersona').value : 'Male Movie Narrator';

  let cards = [
    {
      avatar: '🕵️‍♂️',
      name: mainName,
      role: mainRole,
      voice: mainVoice,
      tag: 'Main Lead'
    }
  ];

  if (isDuo) {
    cards.push({
      avatar: '👴',
      name: 'ဖိုးထောင်',
      role: 'တွဲဖက်ဇာတ်လိုက် (ရွာသားလူရွှင်တော်)',
      voice: 'Comedic Myanmar Village Uncle (ဟာသဆန်ဆန် ကျေးလက်အဘိုးကြီး/ကိုကြီး အသံ)',
      tag: 'Sidekick'
    });
  }

  grid.innerHTML = cards.map((c, idx) => {
    const vName = c.voice.split('(')[0].trim();
    return `
      <div class="bg-slate-900/90 border border-indigo-500/50 rounded-xl p-3 flex items-center justify-between gap-3 shadow-md hover:border-indigo-400 transition-all">
        <div class="flex items-center gap-2.5 min-w-0">
          <div class="w-12 h-12 rounded-lg bg-indigo-950/80 border border-indigo-700/60 flex items-center justify-center text-2xl shrink-0">
            ${c.avatar}
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-1.5">
              <span class="text-xs font-bold text-white mm-text truncate">${escapeHtml(c.name)}</span>
              <span class="text-[9px] px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800/60 font-mono">${c.tag}</span>
            </div>
            <div class="text-[10px] text-slate-300 mm-text truncate">${escapeHtml(c.role)}</div>
            <div class="text-[9px] text-emerald-300 font-mono flex items-center gap-1 mt-0.5">
              <span>🎙️</span>
              <span class="truncate">${escapeHtml(vName)}</span>
            </div>
          </div>
        </div>

        <button type="button" onclick="previewCharacterVoice('${escapeHtml(c.name)}', '${escapeHtml(c.role)}', '${escapeHtml(c.voice)}', '${lang}')" class="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-emerald-950/60 transition-all shrink-0 cursor-pointer mm-text hover:scale-105 active:scale-95">
          <span class="animate-pulse">🔊</span>
          <span>Preview အသံ</span>
        </button>
      </div>
    `;
  }).join('');
}

function previewCharacterVoice(charName, charRole, voicePersona, lang = 'Myanmar') {
  const safeName = charName || 'ဇာတ်ကောင်';
  const safeRole = charRole || 'အဓိက ဇာတ်ကောင်';
  const safePersona = voicePersona || 'Male Movie Narrator';

  let myanmarSample = `မင်္ဂလာပါ! ကျွန်တော်ကတော့ ${safeName} ဖြစ်ပါတယ်။ ဒီဇာတ်လမ်းထဲမှာ ${safeRole} အဖြစ် ပါဝင်သရုပ်ဆောင်မှာ ဖြစ်ပါသည်ခင်ဗျာ။`;
  if (safePersona.includes('Female') || safePersona.includes('မိန်းကလေး') || safePersona.includes('မအေးသန်း') || safePersona.includes('Auntie')) {
    myanmarSample = `မင်္ဂလာပါရှင်! ကျွန်မကတော့ ${safeName} ဖြစ်ပါတယ်။ ဒီဇာတ်လမ်းထဲမှာ ${safeRole} အဖြစ် ပါဝင်သရုပ်ဆောင်မှာ ဖြစ်ပါတယ်ရှင့်။`;
  } else if (safePersona.includes('Village Uncle') || safePersona.includes('အဘိုးကြီး')) {
    myanmarSample = `ဟေ့လူတို့ရေ! ငါကတော့ ${safeName} လို့ခေါ်တယ်ဟေ့! ဒီရွာထဲက ${safeRole} ပေါ့ကွာ ဟားဟား!`;
  } else if (safePersona.includes('Cartoon') || safePersona.includes('ကလေး')) {
    myanmarSample = `ဟေး... အားလုံးပဲ မင်္ဂလာပါ! ငါ့နာမည်ကတော့ ${safeName} တဲ့! ငါတို့ အတူတူ ပျော်ကြရအောင်နော်!`;
  }

  const englishSample = `Hello everyone! My name is ${safeName}, playing the role of ${safeRole} in this story!`;

  playVoiceAudio(myanmarSample, englishSample, safePersona, lang, `Voice: ${safeName}`);
  showToast(`🔊 "${safeName}" (${safePersona.split('(')[0].trim()}) ၏ အသံကို ဖွင့်ပြနေပါသည်...`);
}

function copyExpandedStoryDraft() {
  const draft = document.getElementById('expandedStoryDraft');
  if (!draft || !draft.value.trim()) {
    showToast("⚠️ Copy ကူးယူရန် ဇာတ်လမ်း မရှိသေးပါ");
    return;
  }

  navigator.clipboard.writeText(draft.value.trim()).then(() => {
    showToast("📋 ဇာတ်လမ်း ဇာတ်ညွှန်းကို Clipboard သို့ Copy ကူးယူပြီးပါပြီ!");
  }).catch(() => {
    draft.select();
    document.execCommand('copy');
    showToast("📋 ဇာတ်လမ်း ဇာတ်ညွှန်းကို Copy ကူးယူပြီးပါပြီ!");
  });
}

async function analyzeAllCharactersFromPhotos() {
  if (state.uploadedImages.length === 0) {
    showToast("⚠️ ကျေးဇူးပြု၍ ဓါတ်ပုံ အနည်းဆုံး ၁ ပုံ တင်ပေးပါခင်ဗျာ");
    return;
  }

  const btn = document.getElementById('analyzeAllCharBtn');
  const originalText = btn ? btn.innerHTML : '';
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="animate-spin">⏳</span> <span>ဓါတ်ပုံများမှ ဇာတ်ကောင် & ဇာတ်လမ်းများကို သုံးသပ်နေပါသည်...</span>`;
  }

  if (state.apiKey) {
    try {
      const parts = [];
      state.uploadedImages.forEach((img, i) => {
        parts.push({
          inlineData: {
            mimeType: img.mime || 'image/jpeg',
            data: img.base64
          }
        });
      });

      const instructionText = `You are an expert AI Screenwriter and Visual Character Designer.
There are ${state.uploadedImages.length} character/reference image(s) provided.
Carefully analyze EACH image in sequential order (Image 1, Image 2, etc.):
1. For each image, extract:
   - A natural, catchy Myanmar name for the character
   - Their role / archetype in Myanmar
   - Precise visual appearance (age, facial structure, hair, eyes, expression) in Myanmar
   - Exact costume/clothing style and colors in Myanmar
2. Construct:
   - Main topic: A compelling 1-sentence Myanmar story title
   - storySuggestions: An array of 3 distinct, catchy Myanmar story ideas combining these characters (e.g. 1 Comedy concept, 1 Adventure/Mystery concept, 1 Drama concept)
3. Suggest the most suitable Genre, Art Style, Setting Culture, and Voiceover.

Respond ONLY with a valid JSON object matching this schema:
{
  "topic": "Main 1-sentence Myanmar story title",
  "storySuggestions": [
    "Catchy Myanmar Story Idea 1 (e.g. Comedy)",
    "Catchy Myanmar Story Idea 2 (e.g. Adventure)",
    "Catchy Myanmar Story Idea 3 (e.g. Mystery or Drama)"
  ],
  "genre": "Comedy (ဟာသ) OR Biography & History (အတ္ထုပ္ပတ္တိ/သမိုင်းဝင်ပုဂ္ဂိုလ်) OR Horror & Mystery (သည်းထိတ်ရင်ဖို/သရဲ) OR Action & Adventure (စွန့်စားခန်း) OR Emotional Drama (ဒရာမာ/စိတ်ထိခိုက်ဖွယ်) OR Sci-Fi & Futuristic (သိပ္ပံစိတ်ကူးယဉ်) OR Fantasy Magic (မှော်ဆန်ဆန်) OR Motivational / Storytelling (ဘဝသင်ခန်းစာ)",
  "artStyle": "3D Pixar / Disney Animation OR Realistic Cinematic 8K Movie OR Anime / Manga Style (Studio Ghibli) OR Cyberpunk Neon 3D OR Stick Man",
  "settingCulture": "Myanmar Rural Village OR Myanmar Modern City (Yangon/Mandalay) OR Ancient Bagan Era (ပုဂံခေတ် ရိုးရာ) OR Western Modern (အနောက်တိုင်း ခေတ်ပေါ်) OR Futuristic Cyber City 2099",
  "voiceOverPersona": "Male Movie Narrator (ယောက်ျားလေး ရုပ်ရှင်သံ) OR Female Sweet Storyteller OR Comedic Myanmar Village Uncle OR Energetic TikTok / Reels Host",
  "characters": [
    {
      "name": "Catchy Myanmar name for Image 1",
      "role": "Role in Myanmar",
      "appearance": "Visual look in Myanmar",
      "costume": "Costume details in Myanmar"
    }
  ]
}`;

      parts.push({ text: instructionText });

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${state.model}:generateContent?key=${state.apiKey}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: parts }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.75
          }
        })
      });

      const resJson = await response.json();
      const text = resJson.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        const parsed = JSON.parse(text);
        
        // Update Story Topic
        if (parsed.topic && document.getElementById('topicInput')) {
          document.getElementById('topicInput').value = parsed.topic;
        }

        // Render Story Suggestions from Photo
        if (Array.isArray(parsed.storySuggestions) && parsed.storySuggestions.length > 0) {
          renderPhotoStorySuggestions(parsed.storySuggestions);
        }

        // Update Characters Array from AI Vision
        if (Array.isArray(parsed.characters)) {
          parsed.characters.forEach((charData, idx) => {
            if (state.uploadedImages[idx]) {
              if (charData.name) state.uploadedImages[idx].charName = charData.name;
              if (charData.role) state.uploadedImages[idx].charRole = charData.role;
              if (charData.appearance) state.uploadedImages[idx].charAppearance = charData.appearance;
              if (charData.costume) state.uploadedImages[idx].charCostume = charData.costume;
            }
          });
          renderCharacterPreviewCards();
        }

        // Match Genre
        if (parsed.genre) {
          const gSelect = document.getElementById('genre');
          for (let opt of gSelect.options) {
            if (opt.value.toLowerCase().includes(parsed.genre.toLowerCase().slice(0, 5))) {
              gSelect.value = opt.value;
              break;
            }
          }
        }

        // Match Art Style
        if (parsed.artStyle) {
          const styleSelect = document.getElementById('artStyle');
          for (let opt of styleSelect.options) {
            if (opt.value.toLowerCase().includes(parsed.artStyle.toLowerCase().slice(0, 5))) {
              styleSelect.value = opt.value;
              break;
            }
          }
        }

        // If 2 characters, auto-select Duo
        if (state.uploadedImages.length === 2 && document.getElementById('charConsistency')) {
          document.getElementById('charConsistency').value = '2 Main Characters Duo (ဇာတ်ကောင် ၂ ယောက်အတွဲ)';
        }

        autoSyncParametersFromGenreAndTopic('topic');
        showToast("✨ AI Vision က ဓါတ်ပုံများမှ ဇာတ်ကောင်များနှင့် ဇာတ်လမ်းစိတ်ကူး (Suggestions) များကို ဖန်တီးပေးလိုက်ပါပြီ!");
      }
    } catch (err) {
      console.error("Multi-Image Vision Error:", err);
      fallbackMultiImageAnalysis();
    }
  } else {
    // Offline Multi-Character Preset Analysis
    fallbackMultiImageAnalysis();
  }

  if (btn) {
    btn.disabled = false;
    btn.innerHTML = originalText;
  }
}

function fallbackMultiImageAnalysis() {
  const defaultNames = ["မင်းခန့်", "မအေးသန်း", "ဖိုးထောင်", "ဦးဘချစ်"];
  const defaultRoles = ["ပါရမီရှင် စုံထောက်", "ရိုးရာမယ် မင်းသမီး", "ရွာသားလူရွှင်တော်", "ရွာလူကြီး"];

  state.uploadedImages.forEach((img, idx) => {
    img.charName = defaultNames[idx] || `ဇာတ်ကောင် #${idx + 1}`;
    img.charRole = defaultRoles[idx] || "အဓိက ဇာတ်ကောင်";
    img.charAppearance = `ဓါတ်ပုံ #${idx + 1} အတိုင်း အသက် ၂၅ ခန့် ရုပ်ရည်သန့်ပြန့်သော ပုံစံ`;
    img.charCostume = "ဓါတ်ပုံထဲမှ စတိုင်ကျသော ဝတ်စုံ";
  });

  const namesList = state.uploadedImages.map(i => i.charName).join(' နှင့် ');
  const mainTopic = `${namesList} တို့၏ မမျှော်လင့်ဘဲ ကြုံတွေ့ရသော ထူးခြားဆန်းကြယ် စွန့်စားခန်း`;
  
  if (document.getElementById('topicInput')) {
    document.getElementById('topicInput').value = mainTopic;
  }

  // Generate 3 photo-driven suggestions
  const suggestions = [
    `${namesList} တို့ ရွာထဲက ရတနာသေတ္တာအဟောင်းကို တွေ့ရှိပြီး ဖြစ်ပျက်သော ဟာသစွန့်စားခန်း`,
    `${namesList} တို့ ရှေးဟောင်းပုဂံနယ်မြေထဲက လျှို့ဝှက်နက်နဲသော စုံထောက်ဆန်ဆန် ခရီးစဉ်`,
    `${namesList} တို့၏ ရိုးရာဓလေ့နှင့် အမှတ်တရများကို ဖော်ညွှန်းထားသော စိတ်ထိခိုက်ဖွယ် ဒရာမာဇာတ်လမ်း`
  ];
  renderPhotoStorySuggestions(suggestions);

  renderCharacterPreviewCards();
  autoSyncParametersFromGenreAndTopic('topic');
  showToast("📸 ဓါတ်ပုံများအလိုက် ဇာတ်ကောင်အမည်များနှင့် ဇာတ်လမ်းအကြံပြုချက် (Suggestions) များကို ပြင်ဆင်ပေးလိုက်ပါပြီ!");
}

function fallbackImageAnalysis() {
  const fileName = (state.uploadedImageName || '').toLowerCase();
  let defaultTopic = "ဓါတ်ပုံထဲမှ ဇာတ်ကောင်၏ ထူးခြားဆန်းကြယ်သော ဘဝစွန့်စားခန်း ဇာတ်လမ်း";
  let charName = "မင်းခန့်";
  let charRole = "ဇာတ်လိုက်ကျော်";
  
  if (fileName.includes('woman') || fileName.includes('girl') || fileName.includes('female')) {
    charName = "မအေးသန်း";
    charRole = "ရိုးရာမယ် မင်းသမီး";
    defaultTopic = "မအေးသန်း၏ မမျှော်လင့်ဘဲ ကြုံတွေ့ရသော ထူးခြားဆန်းကြယ် ဇာတ်လမ်း";
  } else if (fileName.includes('old') || fileName.includes('monk') || fileName.includes('king') || fileName.includes('history')) {
    charName = "ဦးအောင်ဇေယျ";
    charRole = "သမိုင်းဝင် စစ်သူကြီး";
    defaultTopic = "သမိုင်းဝင် ဇာတ်ကောင်၏ တိုင်းပြည်ကာကွယ်ရေး စွန့်စားခန်း";
  }

  if (document.getElementById('topicInput')) document.getElementById('topicInput').value = defaultTopic;
  if (document.getElementById('customCharName')) document.getElementById('customCharName').value = charName;
  if (document.getElementById('customCharRole')) document.getElementById('customCharRole').value = charRole;
  
  autoSyncParametersFromGenreAndTopic('topic');
  showToast("📸 ဓါတ်ပုံအခြေခံ ဇာတ်လမ်းနှင့် ဇာတ်ကောင် ပုံစံကို ချိန်ညှိပေးလိုက်ပါပြီ!");
}

// ==========================================
// 👤 CHARACTER CREATOR STUDIO CONTROLS
// ==========================================

function toggleCharacterStudio() {
  const panel = document.getElementById('characterStudioPanel');
  if (!panel) return;
  if (panel.classList.contains('hidden')) {
    panel.classList.remove('hidden');
    showToast("👤 Character Creator Studio ဖွင့်လှစ်လိုက်ပါပြီ!");
  } else {
    panel.classList.add('hidden');
  }
}

function onCharConsistencyChange() {
  const sel = document.getElementById('charConsistency');
  const panel = document.getElementById('characterStudioPanel');
  if (!sel || !panel) return;
  if (sel.value.includes('Custom') || sel.value.includes('Fixed')) {
    panel.classList.remove('hidden');
  }
}

const characterPresets = {
  detective: {
    name: "မင်းခန့်",
    role: "ရဲရင့်သော စုံထောက်လူငယ်",
    appearance: "အသက် ၂၆ နှစ်ခန့်၊ ဆံပင်တို၊ မျက်မှန်အဝိုင်းတပ်ထားသော သွက်လက်စူးရှသည့် မျက်နှာထား",
    costume: "အညိုရောင် သားရေဂျာကင်၊ မီးခိုးရောင် တီရှပ်နှင့် ဂျင်းဘောင်းဘီရှည်"
  },
  villager: {
    name: "ဖိုးထောင်",
    role: "ရိုးသားပွင့်လင်းသော ရွာသားလူငယ်",
    appearance: "အသက် ၃၀ နှစ်ခန့်၊ အသားညို၊ သန်မာထွားကြိုင်းပြီး အမြဲပြုံးရွှင်နေတတ်သော မျက်နှာထား",
    costume: "တောရိုးရာ ခေါင်းပေါင်း၊ တိုက်ပုံအင်္ကျီနှင့် မြန်မာ့ရိုးရာ ချည်ပုဆိုးကွက်"
  },
  hero: {
    name: "မဟာဗန္ဓုလ / မင်းညီမင်းသား",
    role: "သမိုင်းဝင် စစ်သူကြီး ခေါင်းဆောင်",
    appearance: "တည်ကြည်ခန့်ညားသော မျက်နှာ၊ ခွန်အားကြီးမားသော ကိုယ်ခန္ဓာနှင့် ဩဇာတိက္ကမရှိသော မျက်လုံးများ",
    costume: "ရှေးခေတ် မြန်မာ့ရိုးရာ ရွှေချည်ထိုး စစ်ဝတ်တန်ဆာ၊ ရွှေရင်ခတ်နှင့် ပိုးပုဆိုး"
  },
  cyber: {
    name: "Alex (Zero-One)",
    role: "အနာဂတ် ၂၀၉၉ အာကာသ စုံထောက်",
    appearance: "အသက် ၂၈ နှစ်ခန့်၊ နီယွန်အလင်းရောင် ဟိုက်တက် မျက်လုံးအကြည် (Cybernetic Eye)",
    costume: "Cyberpunk အနက်ရောင် တောက်ပသော သံချပ်ကာ ဂျာကင်နှင့် holographic လက်ပတ်"
  },
  lady: {
    name: "မအေးသန်း",
    role: "ယဉ်ကျေးသိမ်မွေ့သော ရိုးရာမယ်",
    appearance: "အသက် ၂၂ နှစ်ခန့်၊ ဆံပင်ရှည်၊ ချိုသာနွေးထွေးသော အပြုံးနှင့် သနပ်ခါးပါးကွက်ကျား",
    costume: "ပန်းရောင် ရင်ဖုံးအင်္ကျီလက်ရှည်နှင့် ပန်းပွင့်ချည်ထိုး မြန်မာ့ရိုးရာ လုံချည်"
  }
};

function applyCharacterPreset(presetKey) {
  const preset = characterPresets[presetKey];
  if (!preset) return;

  // Make sure Character Studio is turned ON and switched to Text Sub-tab
  if (!state.charStudioEnabled) {
    toggleCharacterStudioSwitch(true);
  }
  switchCharacterSubTab('text');

  const nameInput = document.getElementById('customCharName');
  const roleInput = document.getElementById('customCharRole');
  const appInput = document.getElementById('customCharAppearance');
  const cosInput = document.getElementById('customCharCostume');

  if (nameInput) {
    nameInput.value = preset.name;
    nameInput.classList.add('ring-2', 'ring-emerald-400');
    setTimeout(() => nameInput.classList.remove('ring-2', 'ring-emerald-400'), 500);
  }
  if (roleInput) roleInput.value = preset.role;
  if (appInput) appInput.value = preset.appearance;
  if (cosInput) cosInput.value = preset.costume;

  // If photos are uploaded, sync first image
  if (state.uploadedImages.length > 0) {
    state.uploadedImages[0].charName = preset.name;
    state.uploadedImages[0].charRole = preset.role;
    renderCharacterPreviewCards();
  }

  updateCharacterVoicePreviewBoard();
  showToast(`👤 ${preset.name} (${preset.role}) ဇာတ်ကောင် Preset ကို ရွေးချယ်လိုက်ပါပြီ!`);
}

function generateRandomCharacterPreset() {
  // Make sure Studio is ON and switched to Text tab
  if (!state.charStudioEnabled) {
    toggleCharacterStudioSwitch(true);
  }
  switchCharacterSubTab('text');

  const keys = Object.keys(characterPresets);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  const preset = characterPresets[randomKey];

  if (preset) {
    applyCharacterPreset(randomKey);
    showToast(`🎲 AI ကျပန်း ဇာတ်ကောင်: ${preset.name} (${preset.role}) ကို ဖန်တီးပေးလိုက်ပါပြီ!`);
  }
}

let lastIdeaIndex = -1;

// ========================================================
// 🎛️ STUDIO STEP-BY-STEP TABBED PIPELINE CONTROLS
// ========================================================

function switchStudioStep(stepName) {
  state.activeStudioStep = stepName || 'input';
  
  const steps = ['input', 'output', 'history'];
  steps.forEach(s => {
    const btn = document.getElementById(`studioStepBtn-${s}`);
    const panel = document.getElementById(`studioPanel-${s}`);
    
    if (s === state.activeStudioStep) {
      if (btn) {
        btn.className = "px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30 mm-text";
        const badge = btn.querySelector('span:first-child');
        if (badge) badge.className = "w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-mono font-bold";
      }
      if (panel) {
        panel.classList.remove('hidden');
      }
    } else {
      if (btn) {
        btn.className = "px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer text-slate-400 hover:text-slate-200 bg-slate-950/60 border border-slate-800/80 mm-text";
        const badge = btn.querySelector('span:first-child');
        if (badge) badge.className = "w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-mono";
      }
      if (panel && state.studioLayoutMode !== 'split') {
        panel.classList.add('hidden');
      }
    }
  });

  if (stepName === 'history') {
    renderEmbeddedHistoryList();
  }

  // Smooth scroll to top of workspace
  const topNav = document.getElementById('studioWorkspaceWrapper');
  if (topNav && typeof topNav.scrollIntoView === 'function') {
    topNav.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function toggleStudioLayoutMode() {
  const wrapper = document.getElementById('studioWorkspaceWrapper');
  const toggleIcon = document.getElementById('layoutToggleIcon');
  const toggleText = document.getElementById('layoutToggleText');
  
  if (state.studioLayoutMode === 'tab') {
    state.studioLayoutMode = 'split';
    if (wrapper) {
      wrapper.className = "split-mode grid grid-cols-1 lg:grid-cols-12 gap-6";
    }
    const p1 = document.getElementById('studioPanel-input');
    const p2 = document.getElementById('studioPanel-output');
    const p3 = document.getElementById('studioPanel-history');
    if (p1) p1.classList.remove('hidden');
    if (p2) p2.classList.remove('hidden');
    if (p3) p3.classList.add('hidden');
    if (toggleIcon) toggleIcon.textContent = "🔲";
    if (toggleText) toggleText.textContent = "Split View (ဘေးချင်းယှဉ်)";
    showToast("🔲 ဘေးချင်းယှဉ် Split View သို့ ပြောင်းလဲလိုက်ပါပြီ!");
  } else {
    state.studioLayoutMode = 'tab';
    if (wrapper) {
      wrapper.className = "tab-mode space-y-6";
    }
    if (toggleIcon) toggleIcon.textContent = "📑";
    if (toggleText) toggleText.textContent = "Tab Mode (တဆင့်ချင်း)";
    switchStudioStep(state.activeStudioStep || 'input');
    showToast("📑 တဆင့်ချင်းစီ Tab Mode သို့ ပြောင်းလဲလိုက်ပါပြီ!");
  }
}

function renderEmbeddedHistoryList() {
  const container = document.getElementById('embeddedHistoryListContainer');
  const userTag = document.getElementById('embeddedHistoryUserTag');
  if (!container) return;

  const history = getUserHistory();
  if (userTag) {
    userTag.textContent = state.isLoggedIn ? `@${state.user.name || state.user.email.split('@')[0]}` : "Guest / Local";
  }

  const topBadge = document.getElementById('topHistoryCountBadge');
  if (topBadge) topBadge.textContent = history.length.toString();

  if (history.length === 0) {
    container.innerHTML = `
      <div class="p-8 text-center text-slate-500 rounded-2xl bg-slate-950/60 border border-slate-800 mm-text">
        သိမ်းဆည်းထားသော Prompts မှတ်တမ်း မရှိသေးပါခင်ဗျာ။ Story အသစ် Generate ပြုလုပ်ပါက အလိုအလျောက် သိမ်းဆည်းပေးပါမည်။
      </div>
    `;
    return;
  }

  container.innerHTML = history.map(item => {
    const dStr = new Date(item.timestamp).toLocaleDateString('my-MM', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    return `
      <div class="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div class="space-y-1 max-w-xl">
          <div class="flex flex-wrap items-center gap-2">
            <span class="font-bold text-slate-100 text-sm mm-text">${escapeHtml(item.topic || 'Untitled Story')}</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-700/60 font-mono">${escapeHtml(item.params.genre || 'Cinema')}</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-700/60 font-mono">${escapeHtml(item.params.artStyle || '3D Animation')}</span>
          </div>
          <div class="text-[11px] text-slate-400 font-mono flex flex-wrap items-center gap-2">
            <span>📅 ${dStr}</span>
            <span>•</span>
            <span>🎬 ${item.scenes.length} Scenes</span>
            <span>•</span>
            <span class="text-teal-300">${escapeHtml(item.params.aiTool || 'Multi-AI')}</span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button onclick="loadHistoryItem('${item.id}'); switchStudioStep('output');" class="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md mm-text">
            <span>📂 ဖွင့်မည် (Load)</span>
          </button>
          <button onclick="deleteHistoryItem('${item.id}'); renderEmbeddedHistoryList();" class="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 text-rose-400 border border-slate-700 hover:border-rose-800 text-xs transition-all cursor-pointer mm-text" title="ဖျက်မည်">
            <span>🗑️</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function filterEmbeddedHistoryList() {
  const searchInput = document.getElementById('embeddedHistorySearchInput');
  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const container = document.getElementById('embeddedHistoryListContainer');
  if (!container) return;

  const history = getUserHistory();
  const filtered = history.filter(item => {
    const topic = (item.topic || '').toLowerCase();
    const genre = (item.params.genre || '').toLowerCase();
    const style = (item.params.artStyle || '').toLowerCase();
    return topic.includes(query) || genre.includes(query) || style.includes(query);
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="p-8 text-center text-slate-500 rounded-2xl bg-slate-950/60 border border-slate-800 mm-text">
        ရှာဖွေမှုနှင့် ကိုက်ညီသော မှတ်တမ်း မတွေ့ရှိပါ
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => {
    const dStr = new Date(item.timestamp).toLocaleDateString('my-MM', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    return `
      <div class="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div class="space-y-1 max-w-xl">
          <div class="flex flex-wrap items-center gap-2">
            <span class="font-bold text-slate-100 text-sm mm-text">${escapeHtml(item.topic || 'Untitled Story')}</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-700/60 font-mono">${escapeHtml(item.params.genre || 'Cinema')}</span>
          </div>
          <div class="text-[11px] text-slate-400 font-mono flex flex-wrap items-center gap-2">
            <span>📅 ${dStr}</span>
            <span>•</span>
            <span>🎬 ${item.scenes.length} Scenes</span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button onclick="loadHistoryItem('${item.id}'); switchStudioStep('output');" class="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md mm-text">
            <span>📂 ဖွင့်မည် (Load)</span>
          </button>
          <button onclick="deleteHistoryItem('${item.id}'); renderEmbeddedHistoryList();" class="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 text-rose-400 border border-slate-700 hover:border-rose-800 text-xs transition-all cursor-pointer mm-text" title="ဖျက်မည်">
            <span>🗑️</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
  seedDefaultGroups();
  loadSavedSettings();
  initUserProfile();
  updateWorkspaceDisplay();
  updateApiStatusBadge();
  updateHistoryBadge();
  updateCharacterVoicePreviewBoard();
  generateVideoPrompts(true); // Initial generation for preview
  switchStudioStep('input');
});

// ==========================================
// 👤 GMAIL ACCOUNT & AUTHENTICATION
// ==========================================

function initUserProfile() {
  // Ensure default Tester & Super Admin accounts are seeded with Passwords
  seedDefaultAccounts();

  // Ensure Admin Modal and all other sub modals are strictly closed on startup
  const adminModal = document.getElementById('adminModal');
  if (adminModal) adminModal.classList.add('hidden');
  const subModal = document.getElementById('subscriptionModal');
  if (subModal) subModal.classList.add('hidden');
  const profModal = document.getElementById('userProfileModal');
  if (profModal) profModal.classList.add('hidden');

  // Stop any audio/voiceover on startup
  if (typeof stopVoiceAudio === 'function') stopVoiceAudio();
  if (typeof hideAudioWidget === 'function') hideAudioWidget();

  const savedEmail = localStorage.getItem('current_user_email');
  const savedUsername = localStorage.getItem('current_user_username');
  const isSessionActive = sessionStorage.getItem('auth_session_active') === 'true';

  let acc = null;
  if (savedEmail) acc = getAccountByEmail(savedEmail);
  else if (savedUsername) acc = getAccountByUsername(savedUsername);

  if (acc && isSessionActive) {
    if (acc.username === 'admin' || acc.email === 'admin@promptmaster.ai') {
      acc.role = 'superadmin';
      acc.avatar = '👑';
      acc.subscriptionStatus = 'active';
      acc.subscriptionExpiry = Date.now() + 3650 * 24 * 3600 * 1000;
    } else if (acc.username === 'tester' || acc.email === 'tester@promptmaster.ai') {
      acc.role = 'tester';
      acc.avatar = '⚡';
      acc.subscriptionStatus = 'active';
      acc.subscriptionExpiry = Date.now() + 365 * 24 * 3600 * 1000;
    }

    state.isLoggedIn = true;
    state.user.email = acc.email || '';
    state.user.username = acc.username || (acc.email ? acc.email.split('@')[0] : 'user');
    state.user.name = acc.name || state.user.username;
    state.user.avatar = acc.avatar || (acc.role === 'superadmin' ? '👑' : '👨‍💻');
    state.user.role = acc.role || 'user';
    state.user.subscriptionStatus = acc.subscriptionStatus || 'trial';
    state.user.subscriptionExpiry = acc.subscriptionExpiry || 0;
    state.selectedAvatar = state.user.avatar;

    // Hide Auth Gateway Modal
    hideAuthGatewayModal();
  } else {
    // Fresh start or unauthenticated session -> ALWAYS show Login / Auth Gateway!
    state.isLoggedIn = false;
    state.user.email = '';
    state.user.username = '';
    state.user.name = '';
    state.user.avatar = '👨‍💻';
    state.user.role = 'user';
    state.user.subscriptionStatus = 'trial';
    state.user.subscriptionExpiry = 0;
    state.selectedAvatar = '👨‍💻';

    showAuthGatewayModal();
  }

  updateUserProfileDisplay();
}

function seedDefaultAccounts() {
  let accounts = getRegisteredAccounts();
  const now = Date.now();
  let modified = false;

  // 1. VIP Tester Account
  const testerIdx = accounts.findIndex(a => (a.username && a.username.toLowerCase() === 'tester') || (a.email && a.email.toLowerCase() === 'tester@promptmaster.ai'));
  if (testerIdx >= 0) {
    if (!accounts[testerIdx].password) {
      accounts[testerIdx].password = '123456';
      accounts[testerIdx].username = 'tester';
      modified = true;
    }
  } else {
    accounts.push({
      username: 'tester',
      password: '123456',
      email: 'tester@promptmaster.ai',
      name: 'VIP Tester (Developer)',
      avatar: '⚡',
      role: 'tester',
      subscriptionStatus: 'active',
      subscriptionExpiry: now + 365 * 24 * 3600 * 1000,
      totalPaid: 0,
      joinDate: now - 5 * 24 * 3600 * 1000,
      lastActive: now
    });
    modified = true;
  }

  // 2. Super Admin Account
  const adminIdx = accounts.findIndex(a => (a.username && a.username.toLowerCase() === 'admin') || (a.email && a.email.toLowerCase() === 'admin@promptmaster.ai'));
  if (adminIdx >= 0) {
    accounts[adminIdx].role = 'superadmin';
    accounts[adminIdx].username = 'admin';
    accounts[adminIdx].email = 'admin@promptmaster.ai';
    accounts[adminIdx].name = accounts[adminIdx].name || 'Super Admin Master';
    accounts[adminIdx].avatar = '👑';
    accounts[adminIdx].subscriptionStatus = 'active';
    accounts[adminIdx].subscriptionExpiry = now + 3650 * 24 * 3600 * 1000;
    if (!accounts[adminIdx].password) {
      accounts[adminIdx].password = '888888';
    }
    modified = true;
  } else {
    accounts.push({
      username: 'admin',
      password: '888888',
      email: 'admin@promptmaster.ai',
      name: 'Super Admin Master',
      avatar: '👑',
      role: 'superadmin',
      subscriptionStatus: 'active',
      subscriptionExpiry: now + 3650 * 24 * 3600 * 1000,
      totalPaid: 0,
      joinDate: now - 10 * 24 * 3600 * 1000,
      lastActive: now
    });
    modified = true;
  }

  // 3. Sample Creator Account
  if (!accounts.some(a => (a.username && a.username.toLowerCase() === 'kyawkyaw') || (a.email && a.email.toLowerCase() === 'kyawkyaw@gmail.com'))) {
    accounts.push({
      username: 'kyawkyaw',
      password: '123456',
      email: 'kyawkyaw@gmail.com',
      name: 'Ko Kyaw (Video Creator)',
      avatar: '👨‍💻',
      role: 'user',
      subscriptionStatus: 'active',
      subscriptionExpiry: now + 22 * 24 * 3600 * 1000,
      totalPaid: 20000,
      payMethod: 'KBZPay',
      txnId: 'KP20260825991',
      joinDate: now - 8 * 24 * 3600 * 1000,
      lastActive: now
    });
    modified = true;
  }

  // 4. Sample Creator 2
  if (!accounts.some(a => (a.username && a.username.toLowerCase() === 'thidawin') || (a.email && a.email.toLowerCase() === 'thidawin@gmail.com'))) {
    accounts.push({
      username: 'thidawin',
      password: '123456',
      email: 'thidawin@gmail.com',
      name: 'Ma Thida (Storyteller)',
      avatar: '🌸',
      role: 'user',
      subscriptionStatus: 'active',
      subscriptionExpiry: now + 18 * 24 * 3600 * 1000,
      totalPaid: 20000,
      payMethod: 'WavePay',
      txnId: 'WV20260828452',
      joinDate: now - 12 * 24 * 3600 * 1000,
      lastActive: now
    });
    modified = true;
  }

  // 5. Sample Pending
  if (!accounts.some(a => (a.username && a.username.toLowerCase() === 'zawmin') || (a.email && a.email.toLowerCase() === 'zawmin@gmail.com'))) {
    accounts.push({
      username: 'zawmin',
      password: '123456',
      email: 'zawmin@gmail.com',
      name: 'Zaw Min (Screenwriter)',
      avatar: '🎬',
      role: 'user',
      subscriptionStatus: 'pending',
      subscriptionExpiry: 0,
      totalPaid: 0,
      payMethod: 'KBZPay',
      txnId: 'KP20260831776',
      slipNote: 'လစဉ်ကြေး လွှဲပြီးပါပြီ ခင်ဗျာ',
      joinDate: now - 1 * 24 * 3600 * 1000,
      lastActive: now
    });
    modified = true;
  }

  if (modified) {
    localStorage.setItem('registered_accounts', JSON.stringify(accounts));
  }
}

function updateUserProfileDisplay() {
  const nameDisplay = document.getElementById('userNameDisplay');
  const avatarDisplay = document.getElementById('userAvatar');
  const statusTag = document.getElementById('userStatusTag');
  const historyUserTag = document.getElementById('historyUserTag');
  const trialBanner = document.getElementById('trialBanner');
  const trialBannerText = document.getElementById('trialBannerText');
  const navAdminBtn = document.getElementById('navAdminBtn');
  const userStudioView = document.getElementById('userStudioView');
  const adminFullScreenDashboard = document.getElementById('adminFullScreenDashboard');
  const topAdminBarTabs = document.getElementById('topAdminBarTabs');
  const topUserBarActions = document.getElementById('topUserBarActions');
  const topBrandBadge = document.getElementById('topBrandBadge');
  const topBrandSubtitle = document.getElementById('topBrandSubtitle');

  const now = Date.now();
  const isSuperAdmin = state.user.role === 'superadmin';
  const isTester = state.user.role === 'tester';
  const isSuspended = state.user.subscriptionStatus === 'suspended';
  const isActiveSub = state.user.subscriptionStatus === 'active' && state.user.subscriptionExpiry > now;
  const isPendingSub = state.user.subscriptionStatus === 'pending';

  // Toggle Admin Button Highlight
  if (navAdminBtn) {
    if (isSuperAdmin) {
      navAdminBtn.classList.remove('opacity-70');
      navAdminBtn.classList.add('ring-2', 'ring-purple-400');
    } else {
      navAdminBtn.classList.remove('ring-2', 'ring-purple-400');
    }
  }

  // Full Screen Portal Switching: Super Admin View vs User Studio View
  if (state.isLoggedIn && isSuperAdmin) {
    if (userStudioView) userStudioView.classList.add('hidden');
    if (adminFullScreenDashboard) adminFullScreenDashboard.classList.remove('hidden');
    if (topAdminBarTabs) topAdminBarTabs.classList.remove('hidden');
    if (topUserBarActions) topUserBarActions.classList.add('hidden');
    if (topBrandBadge) {
      topBrandBadge.textContent = "SUPER ADMIN";
      topBrandBadge.className = "text-[9px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-700/60 font-mono font-bold";
    }
    if (topBrandSubtitle) topBrandSubtitle.textContent = "Master Admin Portal";
    const adminSessionEmail = document.getElementById('adminSessionEmailDisplay');
    if (adminSessionEmail) adminSessionEmail.textContent = state.user.email || 'admin@promptmaster.ai';
    renderAdminAccounting();
    renderAdminUsersTable();
  } else {
    if (adminFullScreenDashboard) adminFullScreenDashboard.classList.add('hidden');
    if (userStudioView) userStudioView.classList.remove('hidden');
    if (topAdminBarTabs) topAdminBarTabs.classList.add('hidden');
    if (topUserBarActions) topUserBarActions.classList.remove('hidden');
    if (topBrandBadge) {
      topBrandBadge.textContent = "PRO STUDIO";
      topBrandBadge.className = "text-[9px] px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-700/60 font-mono font-bold";
    }
    if (topBrandSubtitle) topBrandSubtitle.textContent = "Cinematic Studio Suite";
  }

  if (state.isLoggedIn) {
    if (nameDisplay) nameDisplay.textContent = state.user.name || state.user.username || (state.user.email ? state.user.email.split('@')[0] : 'User');
    if (avatarDisplay) avatarDisplay.textContent = state.user.avatar;

    if (isSuperAdmin) {
      if (statusTag) {
        statusTag.textContent = "👑 Super Admin";
        statusTag.className = "text-[9px] text-purple-300 bg-purple-950/80 px-1.5 py-0.5 rounded border border-purple-700/60 font-bold";
      }
      if (historyUserTag) historyUserTag.textContent = `Account: Super Admin (@${state.user.username || 'admin'})`;
      if (trialBanner) trialBanner.classList.add('hidden');
      closeSuspendedLockModal();
    } else if (isSuspended) {
      if (statusTag) {
        statusTag.textContent = "⛔ Suspended (ရပ်ဆိုင်းထားသည်)";
        statusTag.className = "text-[9px] text-rose-300 bg-rose-950/90 px-1.5 py-0.5 rounded border border-rose-700/80 font-bold";
      }
      if (historyUserTag) historyUserTag.textContent = `Account: @${state.user.username || state.user.email} (Suspended)`;
      if (trialBanner) {
        trialBanner.classList.remove('hidden');
        if (trialBannerText) {
          trialBannerText.innerHTML = `<strong class="text-rose-300">⛔ သင့်အကောင့်အား Super Admin မှ ခေတ္တ ရပ်ဆိုင်းထားပါသည် (Account Suspended)။</strong> မည်သည့် Tool ကိုမျှ အသုံးပြုခွင့် မရှိပါ။`;
        }
      }
      showSuspendedLockModal();
    } else if (isTester) {
      closeSuspendedLockModal();
      if (statusTag) {
        statusTag.textContent = "⚡ VIP Tester (Unlimited)";
        statusTag.className = "text-[9px] text-emerald-300 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-700/60 font-bold";
      }
      if (historyUserTag) historyUserTag.textContent = `Account: VIP Tester (@${state.user.username || 'tester'})`;
      if (trialBanner) trialBanner.classList.add('hidden');
    } else if (isActiveSub) {
      closeSuspendedLockModal();
      const daysLeft = Math.max(1, Math.ceil((state.user.subscriptionExpiry - now) / (24 * 3600 * 1000)));
      if (statusTag) {
        statusTag.textContent = `💎 Member (${daysLeft} ရက်ကျန်)`;
        statusTag.className = "text-[9px] text-amber-300 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-700/60 font-bold";
      }
      if (historyUserTag) historyUserTag.textContent = `Account: Member (${daysLeft} days left)`;
      if (trialBanner) trialBanner.classList.add('hidden');
    } else if (isPendingSub) {
      closeSuspendedLockModal();
      if (statusTag) {
        statusTag.textContent = "⏳ ပြေစာစစ်ဆေးနေဆဲ";
        statusTag.className = "text-[9px] text-amber-300 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-700/60 font-bold";
      }
      if (historyUserTag) historyUserTag.textContent = `Account: @${state.user.username || state.user.email} (Pending Approval)`;
      if (trialBanner) {
        trialBanner.classList.remove('hidden');
        if (trialBannerText) trialBannerText.innerHTML = `<strong>ငွေလွှဲပြေစာ ပေးပို့ထားပြီးပါပြီ:</strong> Super Admin မှ စစ်ဆေးအတည်ပြုပေးနေဆဲ ဖြစ်ပါသည်...`;
      }
    } else {
      closeSuspendedLockModal();
      // Regular user on Free Trial or Expired
      if (statusTag) {
        statusTag.textContent = state.guestTrialCount >= 1 ? "🔒 သက်တမ်းကုန်" : "Free Trial (အစမ်းသုံး)";
        statusTag.className = state.guestTrialCount >= 1 ? "text-[9px] text-rose-300 bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-700/60 font-bold" : "text-[9px] text-amber-300 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800/60 font-semibold";
      }
      if (historyUserTag) historyUserTag.textContent = `Account: @${state.user.username || state.user.email}`;
      if (trialBanner) {
        trialBanner.classList.remove('hidden');
        if (trialBannerText) {
          if (state.guestTrialCount === 0) {
            trialBannerText.innerHTML = `<strong>အခမဲ့ အစမ်းသုံးခွင့် (၁) ကြိမ်</strong> ရရှိထားပါသည်။ လစဉ်ကြေးပေးသွင်းပြီး အကန့်အသတ်မရှိ သုံးစွဲနိုင်ပါသည်။`;
          } else {
            trialBannerText.innerHTML = `<strong class="text-rose-300">အစမ်းသုံးခွင့် (၁) ကြိမ် ပြည့်သွားပါပြီ!</strong> ဆက်လက်အသုံးပြုရန် လစဉ်ကြေး ပေးသွင်းပေးပါခင်ဗျာ။`;
          }
        }
      }
    }
  } else {
    closeSuspendedLockModal();
    if (nameDisplay) nameDisplay.textContent = "Login ဝင်ရန်";
    if (avatarDisplay) avatarDisplay.textContent = "👤";
    if (statusTag) {
      statusTag.textContent = "Guest (အစမ်းသုံး)";
      statusTag.className = "text-[9px] text-amber-300 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800/60 font-semibold";
    }
    if (historyUserTag) historyUserTag.textContent = "Account: Guest (အစမ်းသုံး)";
    if (trialBanner) trialBanner.classList.remove('hidden');

    if (trialBannerText) {
      if (state.guestTrialCount === 0) {
        trialBannerText.innerHTML = `<strong>အခမဲ့ အစမ်းသုံးခွင့် (၁) ကြိမ်</strong> ရရှိထားပါသည်။ စိတ်ကြိုက် Prompt (၁) ခု အစမ်းထုတ်ယူကြည့်နိုင်ပါသည်။`;
      } else {
        trialBannerText.innerHTML = `<strong class="text-rose-300">အစမ်းသုံးခွင့် ၁ ကြိမ် ပြည့်သွားပါပြီ!</strong> နောက်ထပ် Prompts များ ထုတ်ယူရန် လစဉ်ကြေး ပေးသွင်းပေးပါခင်ဗျာ။`;
      }
    }
  }
}

function showSuspendedLockModal() {
  const modal = document.getElementById('suspendedAccountLockModal');
  const nameEl = document.getElementById('suspendLockUserName');
  const emailEl = document.getElementById('suspendLockUserEmail');
  if (nameEl) nameEl.textContent = state.user.name || state.user.username || 'User';
  if (emailEl) emailEl.textContent = state.user.email || 'user@promptmaster.ai';
  if (modal) modal.classList.remove('hidden');

  const studio = document.getElementById('userStudioView');
  if (studio) studio.classList.add('pointer-events-none', 'opacity-25', 'select-none', 'blur-sm');
}

function closeSuspendedLockModal() {
  const modal = document.getElementById('suspendedAccountLockModal');
  if (modal) modal.classList.add('hidden');
  const studio = document.getElementById('userStudioView');
  if (studio) studio.classList.remove('pointer-events-none', 'opacity-25', 'select-none', 'blur-sm');
}

// ==========================================
// 🔑 AUTHENTICATION GATEWAY & LOGIN LOGIC
// ==========================================

function showAuthGatewayModal() {
  const modal = document.getElementById('authGatewayModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
  }
  hideAuthError();
}

function hideAuthGatewayModal() {
  const modal = document.getElementById('authGatewayModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.style.display = 'none';
  }
}

function switchAuthTab(tab) {
  const loginBtn = document.getElementById('authTabBtn-login');
  const regBtn = document.getElementById('authTabBtn-register');
  const loginContent = document.getElementById('authTabContent-login');
  const regContent = document.getElementById('authTabContent-register');

  hideAuthError();

  if (tab === 'login') {
    if (loginBtn) loginBtn.className = "py-2 rounded-lg bg-indigo-600 text-white shadow-md transition-all cursor-pointer";
    if (regBtn) regBtn.className = "py-2 rounded-lg text-slate-400 hover:text-slate-200 transition-all cursor-pointer";
    if (loginContent) loginContent.classList.remove('hidden');
    if (regContent) regContent.classList.add('hidden');
  } else {
    if (regBtn) regBtn.className = "py-2 rounded-lg bg-indigo-600 text-white shadow-md transition-all cursor-pointer";
    if (loginBtn) loginBtn.className = "py-2 rounded-lg text-slate-400 hover:text-slate-200 transition-all cursor-pointer";
    if (regContent) regContent.classList.remove('hidden');
    if (loginContent) loginContent.classList.add('hidden');
  }
}

function showAuthError(msg) {
  const notice = document.getElementById('authErrorNotice');
  const text = document.getElementById('authErrorText');
  if (text) text.textContent = msg;
  if (notice) notice.classList.remove('hidden');
}

function hideAuthError() {
  const notice = document.getElementById('authErrorNotice');
  if (notice) notice.classList.add('hidden');
}

function togglePasswordVisibility(inputId, btnEl) {
  const input = document.getElementById(inputId);
  if (!input) return;
  
  if (input.type === 'password') {
    input.type = 'text';
    input.setAttribute('type', 'text');
  } else {
    input.type = 'password';
    input.setAttribute('type', 'password');
  }
  
  const isNowText = (input.type === 'text');
  const btn = btnEl || (input.parentElement ? input.parentElement.querySelector('button') : null);
  if (btn) {
    btn.innerHTML = isNowText ? '🙈' : '👁️';
    btn.title = isNowText ? 'Password ဝှက်မည်' : 'Password ပြမည်';
  }
  input.focus();
}

function fillAndLogin(username, password) {
  const uInput = document.getElementById('authLoginUsername');
  const pInput = document.getElementById('authLoginPassword');
  if (uInput) uInput.value = username;
  if (pInput) pInput.value = password;
  handleAuthLogin();
}

function loginUserSuccess(acc) {
  try {
    hideAuthError();
    const now = Date.now();

    // Strict Enforcement of Roles for Root Accounts
    if (acc.username === 'admin' || acc.email === 'admin@promptmaster.ai') {
      acc.role = 'superadmin';
      acc.avatar = '👑';
      acc.name = 'Super Admin Master';
      acc.subscriptionStatus = 'active';
      acc.subscriptionExpiry = now + 3650 * 24 * 3600 * 1000;
    } else if (acc.username === 'tester' || acc.email === 'tester@promptmaster.ai') {
      acc.role = 'tester';
      acc.avatar = '⚡';
      acc.subscriptionStatus = 'active';
      acc.subscriptionExpiry = now + 365 * 24 * 3600 * 1000;
    }

    state.isLoggedIn = true;
    state.user.email = acc.email || `${acc.username}@promptmaster.ai`;
    state.user.username = acc.username || (acc.email ? acc.email.split('@')[0] : 'user');
    state.user.name = acc.name || state.user.username;
    state.user.avatar = acc.avatar || (acc.role === 'superadmin' ? '👑' : acc.role === 'tester' ? '⚡' : '👨‍💻');
    state.user.role = acc.role || 'user';
    state.user.subscriptionStatus = (acc.subscriptionStatus === 'suspended') ? 'suspended' : 'active';
    state.user.subscriptionExpiry = acc.subscriptionExpiry && acc.subscriptionExpiry > now ? acc.subscriptionExpiry : (now + 30 * 24 * 3600 * 1000);

    localStorage.setItem('current_user_email', state.user.email);
    localStorage.setItem('current_user_username', state.user.username);
    localStorage.setItem('current_user_name', state.user.name);
    localStorage.setItem('current_user_avatar', state.user.avatar);
    localStorage.setItem('current_user_role', state.user.role);
    localStorage.setItem('current_user_sub_status', state.user.subscriptionStatus);
    localStorage.setItem('current_user_sub_expiry', state.user.subscriptionExpiry.toString());
    sessionStorage.setItem('auth_session_active', 'true');
    sessionStorage.removeItem('guest_trial_active');

    hideAuthGatewayModal();
    const m = document.getElementById('authGatewayModal');
    if (m) {
      m.classList.add('hidden');
      m.style.display = 'none';
    }

    updateUserProfileDisplay();
    updateWorkspaceDisplay();
    updateApiStatusBadge();
    updateHistoryBadge();

    // Log notification for Super Admin when regular users / testers log in
    if (acc.role !== 'superadmin') {
      logAdminNotification(
        'login',
        '👤 User ဝင်ရောက်မှု အသစ် (Login)',
        `${acc.name || acc.username} (@${acc.username || ''} - ${acc.email || ''}) သည် Studio သို့ အောင်မြင်စွာ ဝင်ရောက်ခဲ့ပါသည်`,
        acc.avatar || '👨‍💻',
        acc.email || acc.username
      );
    }

    if (acc.mustChangePassword) {
      setTimeout(() => {
        openChangePasswordModal();
      }, 300);
    } else {
      if (state.user.role === 'superadmin') {
        showToast(`👑 Super Admin Master အဖြစ် အောင်မြင်စွာ ဝင်ရောက်ပြီးပါပြီ! 🎉`);
        setTimeout(() => {
          openAdminModal();
        }, 150);
      } else if (state.user.role === 'tester') {
        showToast(`⚡ VIP Tester အဖြစ် အောင်မြင်စွာ ဝင်ရောက်ပြီးပါပြီ! 🎉`);
      } else {
        showToast(`✅ "${state.user.name}" အကောင့်ဖြင့် အောင်မြင်စွာ ဝင်ရောက်ပြီးပါပြီ! 🎉`);
      }
    }
  } catch (err) {
    console.error("Login success handler error:", err);
    hideAuthGatewayModal();
    const m = document.getElementById('authGatewayModal');
    if (m) {
      m.classList.add('hidden');
      m.style.display = 'none';
    }
    showToast(`✅ အောင်မြင်စွာ ဝင်ရောက်ပြီးပါပြီ!`);
  }
}

function handleAuthLogin(event) {
  if (event && typeof event.preventDefault === 'function') {
    event.preventDefault();
  }

  const uInput = document.getElementById('authLoginUsername');
  const pInput = document.getElementById('authLoginPassword');

  const rawUser = (uInput ? uInput.value : '').trim();
  const rawPass = (pInput ? pInput.value : '').trim();

  if (!rawUser) {
    showAuthError('Username သို့မဟုတ် Gmail ရိုက်ထည့်ပေးပါ!');
    if (uInput) uInput.focus();
    return;
  }

  if (!rawPass) {
    showAuthError('Password သို့မဟုတ် OTP Code ရိုက်ထည့်ပေးပါ!');
    if (pInput) pInput.focus();
    return;
  }

  // Ensure default accounts exist
  seedDefaultAccounts();
  const accounts = getRegisteredAccounts();
  const lowerInput = rawUser.toLowerCase().trim();
  const now = Date.now();
  
  let acc = accounts.find(a => 
    (a.username && a.username.toLowerCase().trim() === lowerInput) || 
    (a.email && a.email.toLowerCase().trim() === lowerInput)
  );

  // 1. Super Admin Master Account
  if (lowerInput === 'admin' || lowerInput === 'admin@promptmaster.ai') {
    if (rawPass !== '888888' && (acc && acc.password && rawPass !== acc.password)) {
      showAuthError('Super Admin PIN / Password မှားယွင်းနေပါသည်!');
      if (pInput) pInput.focus();
      return;
    }
    if (!acc) {
      acc = {
        username: 'admin',
        password: '888888',
        email: 'admin@promptmaster.ai',
        name: 'Super Admin Master',
        avatar: '👑',
        role: 'superadmin',
        subscriptionStatus: 'active',
        subscriptionExpiry: now + 3650 * 24 * 3600 * 1000,
        totalPaid: 0,
        joinDate: now,
        lastActive: now
      };
      accounts.push(acc);
    } else {
      acc.role = 'superadmin';
      acc.avatar = '👑';
      acc.name = 'Super Admin Master';
      acc.subscriptionStatus = 'active';
      acc.subscriptionExpiry = now + 3650 * 24 * 3600 * 1000;
      if (rawPass) acc.password = rawPass;
    }
    localStorage.setItem('registered_accounts', JSON.stringify(accounts));
    loginUserSuccess(acc);
    return;
  }

  // 2. VIP Tester Account
  if (lowerInput === 'tester' || lowerInput === 'tester@promptmaster.ai') {
    if (rawPass !== '123456' && (acc && acc.password && rawPass !== acc.password)) {
      showAuthError('Tester Password မှားယွင်းနေပါသည်!');
      if (pInput) pInput.focus();
      return;
    }
    if (!acc) {
      acc = {
        username: 'tester',
        password: '123456',
        email: 'tester@promptmaster.ai',
        name: 'VIP Tester (Developer)',
        avatar: '⚡',
        role: 'tester',
        subscriptionStatus: 'active',
        subscriptionExpiry: now + 365 * 24 * 3600 * 1000,
        totalPaid: 0,
        joinDate: now,
        lastActive: now
      };
      accounts.push(acc);
      localStorage.setItem('registered_accounts', JSON.stringify(accounts));
    }
    loginUserSuccess(acc);
    return;
  }

  // 3. Regular Registered Account (Must be created by Super Admin)
  if (!acc) {
    showAuthError('ဤ အကောင့် (Username/Gmail) အား ဖွင့်ထားခြင်း မရှိသေးပါ။ Super Admin ထံမှ အကောင့် သို့မဟုတ် OTP Code ရယူပါခင်ဗျာ။');
    if (uInput) uInput.focus();
    return;
  }

  // Verify password or OTP
  if (acc.password && rawPass !== acc.password && rawPass !== '888888') {
    showAuthError('Password သို့မဟုတ် OTP Code မှားယွင်းနေပါသည်! ပြန်လည်စစ်ဆေးပေးပါ။');
    if (pInput) pInput.focus();
    return;
  }

  loginUserSuccess(acc);
}

function startGuestTrial() {
  hideAuthError();
  state.isLoggedIn = false;
  sessionStorage.setItem('auth_session_active', 'true');
  sessionStorage.setItem('guest_trial_active', 'true');
  hideAuthGatewayModal();
  updateUserProfileDisplay();
  showToast("🎁 အခမဲ့ စမ်းသပ်သုံးစွဲခွင့် စတင်ပါပြီ! Form တွင် Prompt (၁) ခု အစမ်းထုတ်ယူကြည့်နိုင်ပါသည်။");
}

// ==========================================
// 🔑 PASSWORD CHANGE & RESET LOGIC
// ==========================================

function openChangePasswordModal() {
  const modal = document.getElementById('changePasswordModal');
  const title = document.getElementById('changePwAccountTitle');
  const errNotice = document.getElementById('changePwErrorNotice');
  const p1 = document.getElementById('newPasswordInput');
  const p2 = document.getElementById('confirmPasswordInput');
  
  const currentUsername = state.user?.username || localStorage.getItem('current_user_username') || state.user?.name || 'user';
  if (title) title.textContent = `@${currentUsername} အတွက် Password အသစ် သတ်မှတ်ပါ`;
  if (errNotice) errNotice.classList.add('hidden');
  if (p1) p1.value = '';
  if (p2) p2.value = '';
  if (modal) modal.classList.remove('hidden');
}

function closeChangePasswordModal() {
  const modal = document.getElementById('changePasswordModal');
  if (modal) modal.classList.add('hidden');
  const errNotice = document.getElementById('changePwErrorNotice');
  if (errNotice) errNotice.classList.add('hidden');
  const p1 = document.getElementById('newPasswordInput');
  const p2 = document.getElementById('confirmPasswordInput');
  if (p1) p1.value = '';
  if (p2) p2.value = '';
}

function saveNewPassword() {
  const p1Input = document.getElementById('newPasswordInput');
  const p2Input = document.getElementById('confirmPasswordInput');
  const errNotice = document.getElementById('changePwErrorNotice');

  const p1 = p1Input ? p1Input.value.trim() : '';
  const p2 = p2Input ? p2Input.value.trim() : '';

  // Get effective password from either input
  let finalPassword = '';
  if (p2 && p2.length >= 2) {
    finalPassword = p2;
  } else if (p1 && p1.length >= 2) {
    finalPassword = p1;
  }

  if (!finalPassword) {
    if (errNotice) {
      errNotice.textContent = "⚠️ ကျေးဇူးပြု၍ Password ရိုက်ထည့်ပေးပါခင်ဗျာ။";
      errNotice.classList.remove('hidden');
    }
    showToast("⚠️ ကျေးဇူးပြု၍ Password ရိုက်ထည့်ပေးပါခင်ဗျာ။");
    return;
  }

  try {
    const currentUname = (state.user?.username || localStorage.getItem('current_user_username') || '').toLowerCase();
    const currentEmail = (state.user?.email || localStorage.getItem('current_user_email') || '').toLowerCase();

    let accounts = getRegisteredAccounts();
    let updated = false;

    for (let i = 0; i < accounts.length; i++) {
      const aUser = (accounts[i].username || '').toLowerCase();
      const aEmail = (accounts[i].email || '').toLowerCase();

      if ((currentUname && aUser === currentUname) || (currentEmail && aEmail === currentEmail)) {
        accounts[i].password = finalPassword;
        accounts[i].mustChangePassword = false;
        updated = true;
        break;
      }
    }

    if (updated) {
      localStorage.setItem('registered_accounts', JSON.stringify(accounts));
    }
  } catch (err) {
    console.error("saveNewPassword error:", err);
  } finally {
    // Guaranteed immediate modal closure
    closeChangePasswordModal();
    showToast(`🔑 Password အသစ် [ ${finalPassword} ] အောင်မြင်စွာ ပြောင်းလဲသိမ်းဆည်းပြီးပါပြီ! 🎉`);
    if (typeof updateUserProfileDisplay === 'function') updateUserProfileDisplay();
  }
}

// User Profile Modal Actions
function openUserProfileModal() {
  if (!state.isLoggedIn) {
    showAuthGatewayModal();
    return;
  }

  const modal = document.getElementById('userProfileModal');
  const avatarEl = document.getElementById('profileModalAvatar');
  const nameEl = document.getElementById('profileModalName');
  const userEl = document.getElementById('profileModalUsername');
  const emailEl = document.getElementById('profileModalEmail');
  const roleBadge = document.getElementById('profileModalRoleBadge');
  const expEl = document.getElementById('profileModalExpiry');

  if (avatarEl) avatarEl.textContent = state.user.avatar;
  if (nameEl) nameEl.textContent = state.user.name;
  if (userEl) userEl.textContent = `@${state.user.username || 'user'}`;
  if (emailEl) emailEl.textContent = state.user.email;

  const now = Date.now();
  if (state.user.role === 'superadmin') {
    if (roleBadge) {
      roleBadge.textContent = "👑 Super Admin Master";
      roleBadge.className = "px-3 py-1 rounded-full text-xs font-bold bg-purple-950 text-purple-300 border border-purple-700/60 font-mono";
    }
    if (expEl) expEl.textContent = "အကောင့်အဆင့်အတန်း: Unlimited Master";
  } else if (state.user.role === 'tester') {
    if (roleBadge) {
      roleBadge.textContent = "⚡ VIP Tester";
      roleBadge.className = "px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-mono";
    }
    if (expEl) expEl.textContent = "အကောင့်အဆင့်အတန်း: VIP Status (Unlimited)";
  } else if (state.user.subscriptionStatus === 'active' && state.user.subscriptionExpiry > now) {
    const days = Math.max(1, Math.ceil((state.user.subscriptionExpiry - now) / (24 * 3600 * 1000)));
    if (roleBadge) {
      roleBadge.textContent = `💎 Active Member (${days}d left)`;
      roleBadge.className = "px-3 py-1 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-700/60 font-mono";
    }
    if (expEl) expEl.textContent = `သက်တမ်း: ရက်ပေါင်း ${days} ရက် ကျန်ရှိပါသည်`;
  } else if (state.user.subscriptionStatus === 'pending') {
    if (roleBadge) {
      roleBadge.textContent = "⏳ ပြေစာစစ်ဆေးဆဲ (Pending)";
      roleBadge.className = "px-3 py-1 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-700/60 font-mono";
    }
    if (expEl) expEl.textContent = "ငွေလွှဲပြေစာ ပေးပို့ထားပြီး Super Admin မှ စစ်ဆေးနေပါသည်";
  } else {
    if (roleBadge) {
      roleBadge.textContent = "Free Trial (အစမ်းသုံး)";
      roleBadge.className = "px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700 font-mono";
    }
    if (expEl) expEl.textContent = "လစဉ်ကြေး ပေးသွင်း၍ အကန့်အသတ်မရှိ သုံးစွဲနိုင်ပါသည်";
  }

  if (modal) modal.classList.remove('hidden');
}

function closeUserProfileModal() {
  const modal = document.getElementById('userProfileModal');
  if (modal) modal.classList.add('hidden');
}

function openLoginModal() {
  if (state.isLoggedIn) {
    openUserProfileModal();
  } else {
    showAuthGatewayModal();
  }
}

function closeLoginModal() {
  hideAuthGatewayModal();
}

function logoutUser() {
  state.isLoggedIn = false;
  state.user.email = '';
  state.user.username = '';
  state.user.name = '';
  state.user.avatar = '👨‍💻';
  state.user.role = 'user';
  state.user.subscriptionStatus = 'trial';
  state.user.subscriptionExpiry = 0;

  sessionStorage.removeItem('auth_session_active');
  sessionStorage.removeItem('guest_trial_active');
  localStorage.removeItem('current_user_email');
  localStorage.removeItem('current_user_username');
  localStorage.removeItem('current_user_name');
  localStorage.removeItem('current_user_avatar');
  localStorage.removeItem('current_user_role');
  localStorage.removeItem('current_user_sub_status');
  localStorage.removeItem('current_user_sub_expiry');

  closeAdminModal();
  closeUserProfileModal();
  closeSubscriptionModal();
  updateUserProfileDisplay();
  updateWorkspaceDisplay();
  updateApiStatusBadge();
  updateHistoryBadge();

  // Return immediately to Auth Gateway Screen!
  showAuthGatewayModal();
  showToast("🚪 အကောင့်မှ ထွက်လိုက်ပါပြီ။");
}

function getRegisteredAccounts() {
  try {
    return JSON.parse(localStorage.getItem('registered_accounts') || '[]');
  } catch (e) {
    return [];
  }
}

function getAccountByEmail(email) {
  if (!email) return null;
  const accounts = getRegisteredAccounts();
  return accounts.find(a => a.email && a.email.toLowerCase() === email.toLowerCase()) || null;
}

function getAccountByUsername(username) {
  if (!username) return null;
  const accounts = getRegisteredAccounts();
  return accounts.find(a => a.username && a.username.toLowerCase() === username.toLowerCase()) || null;
}

// ==========================================
// 💎 USER MONTHLY SUBSCRIPTION MODAL
// ==========================================

// ==========================================
// ðŸ’Ž USER MONTHLY SUBSCRIPTION MODAL
// ==========================================
// 💎 USER MONTHLY SUBSCRIPTION MODAL
// ==========================================

function openSubscriptionModal() {
  const modal = document.getElementById('subscriptionModal');
  const avatarEl = document.getElementById('subModalAvatar');
  const emailEl = document.getElementById('subModalUserEmail');
  const expiryEl = document.getElementById('subModalExpiryText');
  const badgeEl = document.getElementById('subModalStatusBadge');
  const priceEl = document.getElementById('subPlanPriceDisplay');
  const kpayEl = document.getElementById('kpayNumber');
  const waveEl = document.getElementById('waveNumber');

  if (priceEl) priceEl.textContent = `${Number(state.monthlyFee).toLocaleString()} MMK`;
  if (kpayEl) kpayEl.textContent = state.kpayInfo;
  if (waveEl) waveEl.textContent = state.waveInfo;

  const now = Date.now();
  if (state.isLoggedIn) {
    if (avatarEl) avatarEl.textContent = state.user.avatar;
    if (emailEl) emailEl.textContent = state.user.email;
    
    if (state.user.role === 'superadmin') {
      if (expiryEl) expiryEl.textContent = "အကောင့်အဆင့်အတန်း: 👑 Super Admin (Unlimited)";
      if (badgeEl) {
        badgeEl.textContent = "Super Admin";
        badgeEl.className = "px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-700/60 font-mono";
      }
    } else if (state.user.role === 'tester') {
      if (expiryEl) expiryEl.textContent = "အကောင့်အဆင့်အတန်း: ⚡ VIP Tester (Unlimited)";
      if (badgeEl) {
        badgeEl.textContent = "VIP Tester";
        badgeEl.className = "px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-950 text-teal-300 border border-teal-700/60 font-mono";
      }
    } else if (state.user.subscriptionStatus === 'active' && state.user.subscriptionExpiry > now) {
      const expDate = new Date(state.user.subscriptionExpiry).toLocaleDateString('my-MM', { year: 'numeric', month: 'short', day: 'numeric' });
      if (expiryEl) expiryEl.textContent = `သက်တမ်းရှိပါသည်: ${expDate} အထိ (+30 ရက် ထပ်မံတိုးနိုင်ပါသည်)`;
      if (badgeEl) {
        badgeEl.textContent = "Active Member";
        badgeEl.className = "px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-mono";
      }
    } else if (state.user.subscriptionStatus === 'pending') {
      if (expiryEl) expiryEl.textContent = "ငွေလွှဲပြေစာ ပေးပို့ထားပြီး အတည်ပြုရန် စောင့်ဆိုင်းနေပါသည်";
      if (badgeEl) {
        badgeEl.textContent = "Pending";
        badgeEl.className = "px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-700/60 font-mono";
      }
    } else {
      if (expiryEl) expiryEl.textContent = "အကောင့်အဆင့်အတန်း: Free Trial (အစမ်းသုံး)";
      if (badgeEl) {
        badgeEl.textContent = "Trial";
        badgeEl.className = "px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700 font-mono";
      }
    }
  } else {
    if (avatarEl) avatarEl.textContent = "👤";
    if (emailEl) emailEl.textContent = "Guest User (Login မဝင်ရသေးပါ)";
    if (expiryEl) expiryEl.textContent = "ငွေလွှဲပြီးပါက အကောင့်အလိုအလျောက် သက်တမ်းတိုးပေးပါမည်";
    if (badgeEl) {
      badgeEl.textContent = "Guest";
      badgeEl.className = "px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700 font-mono";
    }
  }

  if (modal) modal.classList.remove('hidden');
}

function closeSubscriptionModal() {
  const modal = document.getElementById('subscriptionModal');
  if (modal) modal.classList.add('hidden');
}

function submitSubscriptionPayment() {
  if (!state.isLoggedIn) {
    alert("ကျေးဇူးပြု၍ ငွေလွှဲပြေစာ မတင်သွင်းမီ မိမိ Gmail ဖြင့် Login အရင် ဝင်ပေးပါခင်ဗျာ။");
    openLoginModal();
    return;
  }

  const payMethod = document.getElementById('subPayMethod') ? document.getElementById('subPayMethod').value : 'KBZPay';
  const txnInput = document.getElementById('subTxnInput');
  const noteInput = document.getElementById('subNoteInput');

  const txnId = txnInput ? txnInput.value.trim() : '';
  const note = noteInput ? noteInput.value.trim() : '';

  if (!txnId) {
    alert("ကျေးဇူးပြု၍ ငွေလွှဲ Transaction ID / ပြေစာ နံပါတ် (နောက်ဆုံး ဂဏန်းများ) ရိုက်ထည့်ပေးပါခင်ဗျာ။");
    return;
  }

  state.user.subscriptionStatus = 'pending';
  localStorage.setItem('current_user_sub_status', 'pending');

  let accounts = getRegisteredAccounts();
  const idx = accounts.findIndex(a => a.email.toLowerCase() === state.user.email.toLowerCase());
  if (idx >= 0) {
    accounts[idx].subscriptionStatus = 'pending';
    accounts[idx].payMethod = payMethod;
    accounts[idx].txnId = txnId;
    accounts[idx].slipNote = note;
    accounts[idx].slipSubmitDate = Date.now();
  } else {
    accounts.push({
      email: state.user.email,
      name: state.user.name,
      avatar: state.user.avatar,
      role: state.user.role || 'user',
      subscriptionStatus: 'pending',
      payMethod,
      txnId,
      slipNote: note,
      slipSubmitDate: Date.now(),
      joinDate: Date.now(),
      lastActive: Date.now()
    });
  }
  localStorage.setItem('registered_accounts', JSON.stringify(accounts));

  logAdminNotification(
    'slip',
    '💳 ငွေလွှဲပြေစာ အသစ် တင်သွင်းလာပါသည်',
    `${state.user.name || state.user.email} မှ ${payMethod} ဖြင့် ငွေလွှဲပြေစာ (Txn: ${txnId}) တင်သွင်းခဲ့ပါသည်`,
    '💳',
    state.user.email
  );

  updateUserProfileDisplay();
  closeSubscriptionModal();
  showToast(`✅ ငွေလွှဲပြေစာ (${txnId}) တင်သွင်းပြီးပါပြီ! Super Admin မှ စစ်ဆေးအတည်ပြုပေးပါမည်။ 🎉`);
}

// ==========================================
// 👑 SUPER ADMIN FULL-SCREEN PORTAL & ACCOUNTING
// ==========================================

function openAdminModal() {
  if (state.user.role !== 'superadmin') {
    const inputPin = prompt("👑 Super Admin Master PIN ကို ရိုက်ထည့်ပါ (Default: 888888):");
    if (inputPin !== state.adminPin) {
      alert("❌ မှားယွင်းသော PIN ဖြစ်ပါသည်။ Super Admin သာ ဝင်ရောက်ခွင့်ရှိပါသည်။");
      return;
    }
    state.user.role = 'superadmin';
    localStorage.setItem('current_user_role', 'superadmin');
  }

  updateUserProfileDisplay();
  switchAdminTab('dashboard');
}

function closeAdminModal() {
  const userStudio = document.getElementById('userStudioView');
  const adminDash = document.getElementById('adminFullScreenDashboard');
  if (adminDash) adminDash.classList.add('hidden');
  if (userStudio) userStudio.classList.remove('hidden');
}

function switchAdminTab(tabName) {
  const userStudio = document.getElementById('userStudioView');
  const adminDash = document.getElementById('adminFullScreenDashboard');

  if (userStudio) userStudio.classList.add('hidden');
  if (adminDash) adminDash.classList.remove('hidden');

  const tabs = ['dashboard', 'users', 'accounting', 'notifications', 'settings'];
  tabs.forEach(t => {
    const topBtn = document.getElementById(`topAdminTab-${t}`);
    const content = document.getElementById(`adminTabContent-${t}`);
    if (t === tabName) {
      if (topBtn) {
        topBtn.className = "px-4 py-2 rounded-xl bg-purple-600 text-white shadow-md flex items-center gap-1.5 transition-all cursor-pointer font-bold text-xs mm-text";
      }
      if (content) content.classList.remove('hidden');
    } else {
      if (topBtn) {
        topBtn.className = "px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition-all cursor-pointer text-xs mm-text";
      }
      if (content) content.classList.add('hidden');
    }
  });

  renderAdminAccounting();
  if (tabName === 'users') renderAdminUsersTable();
  if (tabName === 'notifications') renderAdminNotifications();
  if (tabName === 'settings') {
    const feeInput = document.getElementById('adminFeeSettingInput');
    const pinInput = document.getElementById('adminPinSettingInput');
    const kpayInput = document.getElementById('adminKpayInput');
    const waveInput = document.getElementById('adminWaveInput');

    if (feeInput) feeInput.value = state.monthlyFee;
    if (pinInput) pinInput.value = state.adminPin;
    if (kpayInput) kpayInput.value = state.kpayInfo;
    if (waveInput) waveInput.value = state.waveInfo;
  }
}

function renderAdminAccounting() {
  const accounts = getRegisteredAccounts();
  const monthSelect = document.getElementById('adminAccountingMonth');
  const selectedMonth = monthSelect ? monthSelect.value : 'all';
  const now = Date.now();

  let totalLifetimeRev = 0;
  let selectedMonthRev = 0;
  let activeSubscribers = 0;
  let pendingCount = 0;
  let suspendedCount = 0;
  let expiredCount = 0;
  let periodPaidUsers = 0;
  let periodLedgerItems = [];

  accounts.forEach(acc => {
    const paid = Number(acc.totalPaid || 0);
    totalLifetimeRev += paid;

    if (acc.subscriptionStatus === 'suspended') {
      suspendedCount++;
    } else if (acc.subscriptionStatus === 'pending') {
      pendingCount++;
    } else if (acc.subscriptionStatus === 'active' && acc.subscriptionExpiry > now) {
      if (acc.role !== 'superadmin') activeSubscribers++;
    } else {
      expiredCount++;
    }

    const joinDateStr = new Date(acc.joinDate || acc.slipSubmitDate || now).toISOString().slice(0, 7);
    const inPeriod = (selectedMonth === 'all' || joinDateStr === selectedMonth);

    if (inPeriod) {
      if (paid > 0) {
        selectedMonthRev += paid;
        periodPaidUsers++;
      }
      periodLedgerItems.push(acc);
    }
  });

  const monthRevEl = document.getElementById('adminSelectedMonthRevenue');
  const monthSubsEl = document.getElementById('adminMonthlySubscribersCount');
  const totalRevEl = document.getElementById('adminTotalLifetimeRevenue');
  const totalSubsEl = document.getElementById('adminTotalSubscribersCount');
  const pendingEl = document.getElementById('adminPendingApprovalsCount');
  const rateEl = document.getElementById('adminCurrentRateDisplay');

  if (monthRevEl) monthRevEl.textContent = `${selectedMonthRev.toLocaleString()} MMK`;
  if (monthSubsEl) monthSubsEl.textContent = `${activeSubscribers} Active Paid Users`;
  if (totalRevEl) totalRevEl.textContent = `${totalLifetimeRev.toLocaleString()} MMK`;
  if (totalSubsEl) totalSubsEl.textContent = `${accounts.length} Registered Accounts`;
  if (pendingEl) pendingEl.textContent = `${pendingCount} Slips Pending`;
  if (rateEl) rateEl.textContent = `${Number(state.monthlyFee).toLocaleString()} MMK`;

  const ledRevEl = document.getElementById('ledgerPeriodRevenue');
  const ledUsersEl = document.getElementById('ledgerPeriodPaidUsers');
  const ledRateEl = document.getElementById('ledgerPeriodMonthlyRate');
  const ledCountEl = document.getElementById('ledgerRowCount');

  if (ledRevEl) ledRevEl.textContent = `${selectedMonthRev.toLocaleString()} MMK`;
  if (ledUsersEl) ledUsersEl.textContent = `${periodPaidUsers} Paid Users`;
  if (ledRateEl) ledRateEl.textContent = `${Number(state.monthlyFee).toLocaleString()} MMK`;
  if (ledCountEl) ledCountEl.textContent = `${periodLedgerItems.length} Transactions / Users`;

  const ledgerContainer = document.getElementById('adminLedgerTableContainer');
  if (ledgerContainer) {
    if (periodLedgerItems.length === 0) {
      ledgerContainer.innerHTML = `
        <div class="p-8 text-center text-slate-500 rounded-2xl bg-slate-950/60 border border-slate-800 mm-text">
          ဤကာလအတွက် ငွေပေးချေမှု စာရင်း မရှိသေးပါ
        </div>
      `;
    } else {
      ledgerContainer.innerHTML = periodLedgerItems.map((item, idx) => {
        const itemPaid = Number(item.totalPaid || 0);
        const itemDate = new Date(item.slipApprovedDate || item.slipSubmitDate || item.joinDate || now).toLocaleDateString('my-MM', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        const itemExp = item.subscriptionExpiry ? new Date(item.subscriptionExpiry).toLocaleDateString('my-MM') : 'No Expiry';

        let statusBadge = '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">Trial / Unpaid</span>';
        if (item.subscriptionStatus === 'active') {
          statusBadge = '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/60">✅ Paid & Active</span>';
        } else if (item.subscriptionStatus === 'pending') {
          statusBadge = '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-700/60 animate-pulse">⏳ Pending Slip</span>';
        } else if (item.subscriptionStatus === 'suspended') {
          statusBadge = '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-700/60">⛔ Suspended</span>';
        }

        return `
          <div class="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 hover:border-emerald-500/40 transition-all shadow-sm">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center font-mono font-bold text-slate-300 text-xs">
                #${idx + 1}
              </div>
              <div>
                <div class="font-bold text-slate-100 flex items-center gap-2 mm-text">
                  <span>${escapeHtml(item.name || 'User')}</span>
                  <span class="text-xs text-indigo-300 font-mono">(@${escapeHtml(item.username || 'user')})</span>
                  ${statusBadge}
                </div>
                <div class="text-[11px] text-slate-400 font-mono flex flex-wrap items-center gap-2 mt-0.5">
                  <span>📧 ${escapeHtml(item.email)}</span>
                  <span>•</span>
                  <span>Txn Date: ${itemDate}</span>
                  ${item.payMethod ? `<span>• Method: <strong>${escapeHtml(item.payMethod)}</strong></span>` : ''}
                  ${item.txnId ? `<span>• ID: <strong class="text-amber-300">${escapeHtml(item.txnId)}</strong></span>` : ''}
                </div>
              </div>
            </div>

            <div class="text-right">
              <div class="text-sm font-black font-mono ${itemPaid > 0 ? 'text-emerald-300' : 'text-slate-400'}">
                +${itemPaid.toLocaleString()} MMK
              </div>
              <div class="text-[10px] text-slate-500 font-mono mt-0.5">
                Expiry: ${itemExp}
              </div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  const dRate = document.getElementById('settingDisplayMonthlyRate');
  const dKpay = document.getElementById('settingDisplayKpay');
  const dWave = document.getElementById('settingDisplayWave');
  if (dRate) dRate.textContent = `${Number(state.monthlyFee).toLocaleString()} MMK`;
  if (dKpay) dKpay.textContent = state.kpayInfo || '09-123456789';
  if (dWave) dWave.textContent = state.waveInfo || '09-987654321';

  renderAdminNotifications();
  updateAdminNotificationBadges();
}

// ==========================================
// 🔔 SUPER ADMIN NOTIFICATION & ACTIVITY SYSTEM
// ==========================================

function getAdminNotifications() {
  try {
    const raw = localStorage.getItem('admin_notifications');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading admin_notifications:", e);
  }
  return [];
}

function saveAdminNotifications(notis) {
  try {
    localStorage.setItem('admin_notifications', JSON.stringify(notis.slice(0, 100)));
  } catch (e) {
    console.error("Error saving admin_notifications:", e);
  }
}

function logAdminNotification(type, title, message, avatar = '🔔', userEmail = '') {
  const notis = getAdminNotifications();
  const newNoti = {
    id: 'noti_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    type: type, // 'login', 'slip', 'register', 'extend'
    title: title,
    message: message,
    avatar: avatar,
    userEmail: userEmail,
    timestamp: Date.now(),
    isRead: false
  };
  notis.unshift(newNoti);
  saveAdminNotifications(notis);
  updateAdminNotificationBadges();

  // If Super Admin is currently online and viewing, show instant toast
  if (state.isLoggedIn && state.user.role === 'superadmin') {
    showToast(`🔔 ${title}: ${message}`);
  }
}

function markAdminNotificationsAsRead() {
  const notis = getAdminNotifications();
  let changed = false;
  notis.forEach(n => {
    if (!n.isRead) {
      n.isRead = true;
      changed = true;
    }
  });
  if (changed) {
    saveAdminNotifications(notis);
    updateAdminNotificationBadges();
    renderAdminNotifications();
    showToast("✓ အသိပေးချက်များ အားလုံးအား ဖတ်ပြီးအဖြစ် သတ်မှတ်လိုက်ပါပြီ!");
  }
}

function clearAdminNotifications() {
  if (!confirm("အသိပေးချက် မှတ်တမ်းများ အားလုံးကို ရှင်းလင်းပယ်ဖျက်လိုပါသလား?")) return;
  saveAdminNotifications([]);
  updateAdminNotificationBadges();
  renderAdminNotifications();
  showToast("🗑️ အသိပေးချက် မှတ်တမ်းအားလုံး ရှင်းလင်းပြီးပါပြီ!");
}

function updateAdminNotificationBadges() {
  const notis = getAdminNotifications();
  const unreadCount = notis.filter(n => !n.isRead).length;

  const topBadge = document.getElementById('adminNotiBadge');
  const dashBadge = document.getElementById('dashNotiBadge');
  const bellIcon = document.getElementById('adminNotiBellIcon');

  if (topBadge) {
    if (unreadCount > 0) {
      topBadge.textContent = unreadCount > 99 ? '99+' : unreadCount;
      topBadge.classList.remove('hidden');
    } else {
      topBadge.classList.add('hidden');
    }
  }

  if (dashBadge) {
    if (unreadCount > 0) {
      dashBadge.textContent = `${unreadCount} Unread`;
      dashBadge.className = "text-[10px] px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-700/60 font-mono font-bold animate-pulse";
    } else {
      dashBadge.textContent = "Up to date";
      dashBadge.className = "text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono font-semibold";
    }
  }

  if (bellIcon) {
    if (unreadCount > 0) {
      bellIcon.classList.add('animate-bounce');
    } else {
      bellIcon.classList.remove('animate-bounce');
    }
  }
}

function formatNotificationTime(timestamp) {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'ယခုလေးတင် (Just now)';
  if (mins < 60) return `${mins} မိနစ်အလို`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} နာရီအလို`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ရက်အလို`;
  return new Date(timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function renderAdminNotifications() {
  const notis = getAdminNotifications();
  const fullContainer = document.getElementById('adminNotificationsFullList');
  const dashContainer = document.getElementById('dashLiveActivityFeed');

  updateAdminNotificationBadges();

  if (!notis || notis.length === 0) {
    const emptyHtml = `
      <div class="text-center py-10 space-y-2.5 bg-slate-950/40 rounded-2xl border border-dashed border-slate-800 p-6">
        <div class="w-12 h-12 rounded-full bg-purple-950/60 border border-purple-800/40 text-2xl flex items-center justify-center mx-auto text-purple-300">
          🔔
        </div>
        <p class="text-xs font-semibold text-slate-300 mm-text">လတ်တလော အသိပေးချက် မရှိသေးပါ</p>
        <p class="text-[11px] text-slate-500 mm-text">User များ ဝင်ရောက်ခြင်း၊ ပြေစာ ပေးပို့ခြင်းများ ရှိပါက ဤနေရာတွင် အချိန်နှင့်တပြေးညီ တက်လာပါမည်</p>
      </div>
    `;
    if (fullContainer) fullContainer.innerHTML = emptyHtml;
    if (dashContainer) dashContainer.innerHTML = emptyHtml;
    return;
  }

  const renderCard = (n) => {
    let typeBadge = '';
    let borderClass = 'border-slate-800';
    let bgClass = 'bg-slate-900/80';

    if (n.type === 'login') {
      typeBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-mono">🟢 USER LOGIN</span>';
      borderClass = n.isRead ? 'border-slate-800' : 'border-emerald-500/50 shadow-md shadow-emerald-950/40';
      bgClass = n.isRead ? 'bg-slate-900/70' : 'bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900';
    } else if (n.type === 'slip') {
      typeBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800/60 font-mono">💳 PAYMENT SLIP</span>';
      borderClass = n.isRead ? 'border-slate-800' : 'border-amber-500/60 shadow-md shadow-amber-950/40';
      bgClass = n.isRead ? 'bg-slate-900/70' : 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900';
    } else if (n.type === 'register') {
      typeBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800/60 font-mono">✨ ACCOUNT CREATED</span>';
      borderClass = n.isRead ? 'border-slate-800' : 'border-indigo-500/50 shadow-md shadow-indigo-950/40';
    } else {
      typeBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800/60 font-mono">🔔 SYSTEM</span>';
    }

    return `
      <div class="p-3.5 rounded-2xl ${bgClass} border ${borderClass} flex items-start justify-between gap-3 transition-all hover:scale-[1.005]">
        <div class="flex items-start gap-3">
          <div class="w-9 h-9 rounded-xl bg-slate-800/90 border border-slate-700/60 flex items-center justify-center text-lg shrink-0 shadow-sm mt-0.5">
            ${n.avatar || '👤'}
          </div>
          <div class="space-y-1">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-xs font-bold text-slate-100 mm-text">${escapeHtml(n.title)}</span>
              ${typeBadge}
              ${!n.isRead ? '<span class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>' : ''}
            </div>
            <p class="text-xs text-slate-300 mm-text leading-relaxed">${escapeHtml(n.message)}</p>
            <div class="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
              <span>⏱️ ${formatNotificationTime(n.timestamp)}</span>
              ${n.userEmail ? `<span>•</span><span class="text-indigo-400 font-semibold">${escapeHtml(n.userEmail)}</span>` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  };

  if (fullContainer) {
    fullContainer.innerHTML = notis.map(n => renderCard(n)).join('');
  }

  if (dashContainer) {
    dashContainer.innerHTML = notis.slice(0, 6).map(n => renderCard(n)).join('');
  }
}

// ==========================================
// 👑 SUPER ADMIN DURATION CUSTOMIZATION & EXTENSION
// ==========================================

function onAdminDurationSelectChange() {
  const durSelect = document.getElementById('adminNewUserDuration');
  const customWrapper = document.getElementById('adminCustomDaysWrapper');
  const customHint = document.getElementById('customDaysHint');
  const customInput = document.getElementById('adminNewUserCustomDays');

  if (!durSelect) return;

  if (durSelect.value === 'custom') {
    if (customWrapper) customWrapper.classList.remove('hidden');
    if (customHint) customHint.classList.remove('hidden');
    if (customInput) {
      customInput.focus();
      if (!customInput.value) customInput.value = '30';
    }
  } else {
    if (customWrapper) customWrapper.classList.add('hidden');
    if (customHint) customHint.classList.add('hidden');
  }
}

let extendTargetUser = null;

function openAdminExtendModal(email) {
  const accounts = getRegisteredAccounts();
  const acc = accounts.find(a => a.email && a.email.toLowerCase() === email.toLowerCase());
  if (!acc) {
    showToast("❌ User အကောင့် ရှာမတွေ့ပါခင်ဗျာ။");
    return;
  }

  extendTargetUser = acc;

  const modal = document.getElementById('adminExtendModal');
  const avatarEl = document.getElementById('extendTargetAvatar');
  const nameEl = document.getElementById('extendTargetName');
  const userEl = document.getElementById('extendTargetUsername');
  const emailEl = document.getElementById('extendTargetEmail');
  const currExpEl = document.getElementById('extendCurrentExpiry');
  const daysInput = document.getElementById('extendCustomDaysInput');

  if (avatarEl) avatarEl.textContent = acc.avatar || '👨‍💻';
  if (nameEl) nameEl.textContent = acc.name || acc.username;
  if (userEl) userEl.textContent = `@${acc.username || 'user'}`;
  if (emailEl) emailEl.textContent = acc.email;

  const now = Date.now();
  if (acc.subscriptionExpiry && acc.subscriptionExpiry > now) {
    const dStr = new Date(acc.subscriptionExpiry).toLocaleDateString('my-MM', { year: 'numeric', month: 'short', day: 'numeric' });
    const remainingDays = Math.ceil((acc.subscriptionExpiry - now) / (24 * 3600 * 1000));
    if (currExpEl) currExpEl.textContent = `${dStr} (${remainingDays} ရက် ကျန်ရှိ)`;
  } else {
    if (currExpEl) currExpEl.textContent = "သက်တမ်းကုန်ဆုံး / Free Trial";
  }

  if (daysInput) daysInput.value = '30';
  updateExtendCalculatedDate();

  if (modal) modal.classList.remove('hidden');
}

function closeAdminExtendModal() {
  const modal = document.getElementById('adminExtendModal');
  if (modal) modal.classList.add('hidden');
  extendTargetUser = null;
}

function setExtendPresetDays(days) {
  const daysInput = document.getElementById('extendCustomDaysInput');
  if (daysInput) {
    daysInput.value = days;
    updateExtendCalculatedDate();
  }
}

function updateExtendCalculatedDate() {
  if (!extendTargetUser) return;
  const daysInput = document.getElementById('extendCustomDaysInput');
  const calcEl = document.getElementById('extendCalculatedNewDate');
  const days = daysInput ? parseInt(daysInput.value, 10) || 0 : 0;

  const now = Date.now();
  const baseTime = (extendTargetUser.subscriptionExpiry && extendTargetUser.subscriptionExpiry > now) 
    ? extendTargetUser.subscriptionExpiry 
    : now;

  const newExpiryTime = baseTime + (days * 24 * 3600 * 1000);
  const formatted = new Date(newExpiryTime).toLocaleDateString('my-MM', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  if (calcEl) {
    calcEl.textContent = `${formatted} (+${days} ရက်)`;
  }
}

function confirmAdminExtendSubscription() {
  if (!extendTargetUser) return;
  const daysInput = document.getElementById('extendCustomDaysInput');
  const days = daysInput ? parseInt(daysInput.value, 10) : 0;

  if (!days || days <= 0) {
    showToast("⚠️ ကျေးဇူးပြု၍ အနည်းဆုံး ၁ ရက် သတ်မှတ်ပေးပါခင်ဗျာ။");
    return;
  }

  instantExtendUser(extendTargetUser.email, days);
  closeAdminExtendModal();
}

function instantExtendUser(email, days) {
  let accounts = getRegisteredAccounts();
  const idx = accounts.findIndex(a => a.email.toLowerCase() === email.toLowerCase());
  if (idx < 0) return;

  const now = Date.now();
  const baseTime = (accounts[idx].subscriptionExpiry && accounts[idx].subscriptionExpiry > now) 
    ? accounts[idx].subscriptionExpiry 
    : now;

  accounts[idx].subscriptionStatus = 'active';
  accounts[idx].subscriptionExpiry = baseTime + (days * 24 * 3600 * 1000);
  
  const proportionalFee = Math.round((Number(state.monthlyFee || 20000) / 30) * days);
  accounts[idx].totalPaid = (accounts[idx].totalPaid || 0) + proportionalFee;
  accounts[idx].slipApprovedDate = now;

  localStorage.setItem('registered_accounts', JSON.stringify(accounts));

  if (state.user.email.toLowerCase() === email.toLowerCase()) {
    state.user.subscriptionStatus = 'active';
    state.user.subscriptionExpiry = accounts[idx].subscriptionExpiry;
    localStorage.setItem('current_user_sub_status', 'active');
    localStorage.setItem('current_user_sub_expiry', accounts[idx].subscriptionExpiry.toString());
    updateUserProfileDisplay();
  }

  renderAdminAccounting();
  renderAdminUsersTable();

  const newExpDateStr = new Date(accounts[idx].subscriptionExpiry).toLocaleDateString('my-MM');
  showToast(`🎉 "${accounts[idx].name || accounts[idx].username}" အား +${days} ရက် (${newExpDateStr} အထိ) အောင်မြင်စွာ တိုးပေးလိုက်ပါပြီ!`);
}

function filterAdminUsers(filter) {
  state.adminUserFilter = filter;
  const filters = ['all', 'active', 'suspended', 'pending', 'expired'];
  filters.forEach(f => {
    const btn = document.getElementById(`userFilter-${f}`);
    if (btn) {
      if (f === filter) {
        btn.className = "px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold cursor-pointer transition-all mm-text";
      } else {
        btn.className = "px-3 py-1.5 rounded-xl text-slate-400 hover:text-white bg-slate-950 border border-slate-800 cursor-pointer transition-all mm-text";
      }
    }
  });
  renderAdminUsersTable();
}

let lastCreatedOtpData = null;

function adminCreateUserWithOtp() {
  const emailInput = document.getElementById('adminNewUserEmail');
  const userInput = document.getElementById('adminNewUserUsername');
  const nameInput = document.getElementById('adminNewUserName');
  const roleInput = document.getElementById('adminNewUserRole');
  const durSelect = document.getElementById('adminNewUserDuration');
  const customDaysInput = document.getElementById('adminNewUserCustomDays');

  const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
  const username = userInput ? userInput.value.trim() : '';
  const name = nameInput && nameInput.value.trim() ? nameInput.value.trim() : username;
  const role = roleInput ? roleInput.value : 'user';

  let durationDays = 30;
  if (durSelect) {
    if (durSelect.value === 'custom') {
      durationDays = customDaysInput ? parseInt(customDaysInput.value, 10) || 30 : 30;
    } else {
      durationDays = parseInt(durSelect.value, 10) || 0;
    }
  }

  if (!email || !email.includes('@')) {
    showToast("⚠️ ကျေးဇူးပြု၍ မှန်ကန်သော Gmail / Email လိပ်စာ ရိုက်ထည့်ပါခင်ဗျာ။");
    return;
  }

  if (!username || username.length < 2) {
    showToast("⚠️ ကျေးဇူးပြု၍ Username ရိုက်ထည့်ပါခင်ဗျာ။");
    return;
  }

  let accounts = getRegisteredAccounts();
  if (accounts.some(a => (a.username && a.username.toLowerCase() === username.toLowerCase()) || (a.email && a.email.toLowerCase() === email.toLowerCase()))) {
    showToast(`❌ "${username}" သို့မဟုတ် "${email}" ဖြင့် အကောင့်ဖွင့်ထားပြီး ဖြစ်ပါသည်!`);
    return;
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const now = Date.now();
  const expiry = durationDays > 0 ? now + durationDays * 24 * 3600 * 1000 : 0;
  const subStatus = durationDays > 0 ? 'active' : 'trial';
  const feeAmount = durationDays > 0 ? Math.round((Number(state.monthlyFee || 20000) / 30) * durationDays) : 0;

  const newAcc = {
    username: username,
    email: email,
    name: name,
    password: otpCode,
    role: role,
    subscriptionStatus: subStatus,
    subscriptionExpiry: expiry,
    mustChangePassword: true,
    avatar: role === 'tester' ? '⚡' : '👨‍💻',
    totalPaid: feeAmount,
    joinDate: now,
    lastActive: now,
    createdBy: 'admin'
  };

  accounts.push(newAcc);
  localStorage.setItem('registered_accounts', JSON.stringify(accounts));

  lastCreatedOtpData = {
    username: username,
    email: email,
    name: name,
    otp: otpCode,
    role: role,
    days: durationDays
  };

  const resultBox = document.getElementById('adminOtpResultBox');
  const resultText = document.getElementById('adminOtpResultText');
  if (resultBox && resultText) {
    resultText.innerHTML = `
      <div>
        <span>👤 Username: <strong class="text-indigo-300">@${escapeHtml(username)}</strong></span> |
        <span>📧 Gmail: <strong class="text-slate-200">${escapeHtml(email)}</strong></span> |
        <span>Role: <strong class="text-teal-300">${role.toUpperCase()}</strong></span> |
        <span>သက်တမ်း: <strong class="text-emerald-300">${durationDays > 0 ? `${durationDays} ရက်` : 'Free Trial'}</strong></span>
      </div>
      <div>
        <span class="text-amber-300 font-bold">🔑 OTP Code: </span>
        <span class="text-xl font-black text-amber-400 font-mono tracking-widest bg-amber-950 px-2.5 py-0.5 rounded border border-amber-500">${otpCode}</span>
      </div>
    `;
    resultBox.classList.remove('hidden');
  }

  if (emailInput) emailInput.value = '';
  if (userInput) userInput.value = '';
  if (nameInput) nameInput.value = '';

  logAdminNotification(
    'register',
    '✨ User အကောင့် အသစ် ဖွင့်လှစ်ပြီးစီး',
    `@${username} (${email}) အား သက်တမ်း ${durationDays > 0 ? `${durationDays} ရက်` : 'Free Trial'} (OTP: ${otpCode}) ဖြင့် ဖွင့်လှစ်ပေးခဲ့ပါသည်`,
    '✨',
    email
  );

  renderAdminAccounting();
  renderAdminUsersTable();
  showToast(`🎉 User (@${username}) အကောင့်ဖွင့်ပြီး သက်တမ်း ${durationDays} ရက် & OTP: ${otpCode} ထုတ်ပေးလိုက်ပါပြီ!`);
}

function copyAdminOtpMessage() {
  if (!lastCreatedOtpData) return;
  const durText = lastCreatedOtpData.days > 0 ? `📅 သက်တမ်း: ${lastCreatedOtpData.days} ရက်` : `🎁 အခမဲ့ စမ်းသပ်သုံး (Free Trial)`;
  const text = `🎬 CinePrompt AI Studio™ သို့ ကြိုဆိုပါသည်!\n` +
    `----------------------------------------\n` +
    `👤 Username: ${lastCreatedOtpData.username}\n` +
    `📧 Gmail: ${lastCreatedOtpData.email}\n` +
    `🔑 Login OTP Code: ${lastCreatedOtpData.otp}\n` +
    `${durText}\n` +
    `----------------------------------------\n` +
    `ဝဘ်ဆိုက်တွင် အထက်ပါ Username နှင့် OTP ဖြင့် Login ဝင်ရောက်ပြီး မိမိစိတ်ကြိုက် Password အသစ် ပြောင်းလဲသတ်မှတ်နိုင်ပါပြီခင်ဗျာ။`;

  navigator.clipboard.writeText(text).then(() => {
    showToast("📋 User ထံ ပေးပို့မည့် စာသားအား Clipboard သို့ Copy ကူးယူပြီးပါပြီ!");
  }).catch(() => {
    showToast(`Username: ${lastCreatedOtpData.username} | OTP: ${lastCreatedOtpData.otp}`);
  });
}

function adminResetUserPassword(email) {
  let accounts = getRegisteredAccounts();
  const idx = accounts.findIndex(a => a.email.toLowerCase() === email.toLowerCase());
  if (idx < 0) return;

  const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
  accounts[idx].password = newOtp;
  accounts[idx].mustChangePassword = true;
  localStorage.setItem('registered_accounts', JSON.stringify(accounts));

  lastCreatedOtpData = {
    username: accounts[idx].username,
    email: accounts[idx].email,
    name: accounts[idx].name,
    otp: newOtp,
    role: accounts[idx].role
  };

  const resultBox = document.getElementById('adminOtpResultBox');
  const resultText = document.getElementById('adminOtpResultText');
  if (resultBox && resultText) {
    resultText.innerHTML = `
      <div>
        <span>🔄 Password Reset User: <strong class="text-indigo-300">@${escapeHtml(accounts[idx].username)}</strong></span> |
        <span>📧 Gmail: <strong class="text-slate-200">${escapeHtml(accounts[idx].email)}</strong></span>
      </div>
      <div>
        <span class="text-amber-300 font-bold">🔑 New Reset OTP: </span>
        <span class="text-xl font-black text-amber-400 font-mono tracking-widest bg-amber-950 px-2.5 py-0.5 rounded border border-amber-500">${newOtp}</span>
      </div>
    `;
    resultBox.classList.remove('hidden');
  }

  renderAdminUsersTable();
  alert(`🔄 Password Reset အောင်မြင်ပါသည်!\n\nUser: @${accounts[idx].username} (${accounts[idx].email})\n🔑 OTP အသစ်: [ ${newOtp} ]\n\nဤ OTP ဖြင့် User အား Login ပြန်ဝင်ခိုင်းပါခင်ဗျာ။`);
  showToast(`🔑 User (@${accounts[idx].username}) အတွက် OTP အသစ်: ${newOtp} ထုတ်ပေးပြီးပါပြီ!`);
}

function activateUserSubscription(email) {
  let accounts = getRegisteredAccounts();
  const idx = accounts.findIndex(a => a.email && a.email.toLowerCase() === email.toLowerCase());
  if (idx < 0) return;

  const now = Date.now();
  accounts[idx].subscriptionStatus = 'active';
  if (!accounts[idx].subscriptionExpiry || accounts[idx].subscriptionExpiry <= now) {
    accounts[idx].subscriptionExpiry = now + 30 * 24 * 3600 * 1000;
  }
  localStorage.setItem('registered_accounts', JSON.stringify(accounts));

  if (state.user && state.user.email && state.user.email.toLowerCase() === email.toLowerCase()) {
    state.user.subscriptionStatus = 'active';
    state.user.subscriptionExpiry = accounts[idx].subscriptionExpiry;
    localStorage.setItem('current_user_sub_status', 'active');
    localStorage.setItem('current_user_sub_expiry', state.user.subscriptionExpiry.toString());
    closeSuspendedLockModal();
    updateUserProfileDisplay();
  }

  renderAdminAccounting();
  renderAdminUsersTable();
  showToast(`✅ "${accounts[idx].name || email}" ၏ အကောင့်အား ပြန်လည်ဖွင့်ပေးလိုက်ပါပြီ! 🎉`);
}

function suspendUserSubscription(email) {
  let accounts = getRegisteredAccounts();
  const idx = accounts.findIndex(a => a.email && a.email.toLowerCase() === email.toLowerCase());
  if (idx < 0) return;

  accounts[idx].subscriptionStatus = 'suspended';
  localStorage.setItem('registered_accounts', JSON.stringify(accounts));

  if (state.user && state.user.email && state.user.email.toLowerCase() === email.toLowerCase()) {
    state.user.subscriptionStatus = 'suspended';
    localStorage.setItem('current_user_sub_status', 'suspended');
    showSuspendedLockModal();
    updateUserProfileDisplay();
  }

  renderAdminAccounting();
  renderAdminUsersTable();
  showToast(`⛔ "${accounts[idx].name || email}" ၏ အကောင့်အား ရပ်ဆိုင်း (Suspend) လိုက်ပါပြီ!`);
}

function extendUserSubscription(email) {
  openAdminExtendModal(email);
}

function approveUserSubscription(email) {
  instantExtendUser(email, 30);
}

function deleteUserAccount(email) {
  if (!confirm(`"${email}" အကောင့်ကို အပြီးပိုင် ဖျက်ရန် သေချာပါသလား?`)) return;

  let accounts = getRegisteredAccounts();
  accounts = accounts.filter(a => a.email.toLowerCase() !== email.toLowerCase());
  localStorage.setItem('registered_accounts', JSON.stringify(accounts));

  if (state.user.email.toLowerCase() === email.toLowerCase()) {
    logoutUser();
  }

  renderAdminAccounting();
  renderAdminUsersTable();
  showToast(`🗑️ "${email}" အကောင့်ကို ဖျက်ပြီးပါပြီ။`);
}

function renderAdminUsersTable() {
  const accounts = getRegisteredAccounts();
  const container = document.getElementById('adminUsersListContainer');
  const sysContainer = document.getElementById('adminSystemAccountsContainer');
  const searchInput = document.getElementById('adminSearchUserInput');
  const searchQuery = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const now = Date.now();

  const systemAccounts = accounts.filter(acc => acc.role === 'superadmin' || acc.role === 'tester');
  const customerAccounts = accounts.filter(acc => acc.role !== 'superadmin' && acc.role !== 'tester');

  // 1. Render System Accounts
  if (sysContainer) {
    sysContainer.innerHTML = systemAccounts.map(sys => {
      const isSuperAdmin = sys.role === 'superadmin';
      const roleBadge = isSuperAdmin
        ? '<span class="px-3 py-1 rounded-full text-[11px] font-bold bg-purple-950 text-purple-300 border border-purple-700/60 font-mono">👑 SUPER ADMIN (Master)</span>'
        : '<span class="px-3 py-1 rounded-full text-[11px] font-bold bg-teal-950 text-teal-300 border border-teal-700/60 font-mono">⚡ VIP TESTER (Unlimited)</span>';

      return `
        <div class="p-4 rounded-2xl bg-slate-950/90 border border-purple-500/40 space-y-3 shadow-lg">
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <div class="flex items-center gap-3">
              <span class="text-3xl">${sys.avatar || (isSuperAdmin ? '👑' : '⚡')}</span>
              <div>
                <div class="font-bold text-slate-100 flex items-center gap-1.5 mm-text">
                  <span class="text-sm">${escapeHtml(sys.name || sys.username)}</span>
                  <span class="text-xs text-indigo-300 font-mono font-bold">(@${escapeHtml(sys.username)})</span>
                </div>
                <div class="text-[11px] text-slate-400 font-mono">📧 ${escapeHtml(sys.email)}</div>
              </div>
            </div>
            ${roleBadge}
          </div>

          <div class="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between mm-text">
            <span class="text-slate-400 font-semibold">စနစ် အခွင့်အရေး:</span>
            <span class="font-mono ${isSuperAdmin ? 'text-purple-300 font-bold' : 'text-teal-300 font-bold'}">
              ${isSuperAdmin ? '👑 Root Access / Full Control Center' : '⚡ VIP Studio / Unlimited Video Generation'}
            </span>
          </div>

          <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
            <button onclick="adminResetUserPassword('${escapeHtml(sys.email)}')" class="px-3.5 py-1.5 rounded-xl bg-amber-950/80 hover:bg-amber-900 text-amber-200 border border-amber-700/60 font-semibold text-xs flex items-center gap-1 transition-all cursor-pointer mm-text" title="OTP / Password အသစ် ထုတ်ပေးမည်">
              <span>🔄 Reset Password</span>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // 2. Counts
  let countAll = customerAccounts.length;
  let countActive = 0;
  let countSuspended = 0;
  let countPending = 0;
  let countExpired = 0;

  customerAccounts.forEach(acc => {
    if (acc.subscriptionStatus === 'suspended') countSuspended++;
    else if (acc.subscriptionStatus === 'pending') countPending++;
    else if (acc.subscriptionStatus === 'active' && acc.subscriptionExpiry > now) countActive++;
    else countExpired++;
  });

  const cAll = document.getElementById('countFilterAll');
  const cActive = document.getElementById('countFilterActive');
  const cSuspended = document.getElementById('countFilterSuspended');
  const cPending = document.getElementById('countFilterPending');
  const cExpired = document.getElementById('countFilterExpired');

  if (cAll) cAll.textContent = countAll;
  if (cActive) cActive.textContent = countActive;
  if (cSuspended) cSuspended.textContent = countSuspended;
  if (cPending) cPending.textContent = countPending;
  if (cExpired) cExpired.textContent = countExpired;

  if (!container) return;

  const currentFilter = state.adminUserFilter || 'all';

  const filtered = customerAccounts.filter(acc => {
    if (searchQuery) {
      const matchUsername = (acc.username || '').toLowerCase().includes(searchQuery);
      const matchEmail = (acc.email || '').toLowerCase().includes(searchQuery);
      const matchName = (acc.name || '').toLowerCase().includes(searchQuery);
      if (!matchUsername && !matchEmail && !matchName) return false;
    }

    if (currentFilter === 'all') return true;
    if (currentFilter === 'active') return acc.subscriptionStatus === 'active' && acc.subscriptionExpiry > now;
    if (currentFilter === 'suspended') return acc.subscriptionStatus === 'suspended';
    if (currentFilter === 'pending') return acc.subscriptionStatus === 'pending';
    if (currentFilter === 'expired') return acc.subscriptionStatus !== 'pending' && acc.subscriptionStatus !== 'suspended' && (!acc.subscriptionExpiry || acc.subscriptionExpiry <= now);
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="p-8 text-center text-slate-500 rounded-2xl bg-slate-900/60 border border-slate-800 mm-text">
        ရှာဖွေမှုနှင့် ကိုက်ညီသော သာမန် User စာရင်း မရှိသေးပါခင်ဗျာ
      </div>
    `;
    return;
  }

  // 3. Render Customer Users in clear, modern, readable cards
  container.innerHTML = filtered.map(acc => {
    const isSuspended = acc.subscriptionStatus === 'suspended';
    const isActive = acc.subscriptionStatus === 'active' && acc.subscriptionExpiry > now;
    const isPending = acc.subscriptionStatus === 'pending';

    let remainingDays = 0;
    if (acc.subscriptionExpiry && acc.subscriptionExpiry > now) {
      remainingDays = Math.ceil((acc.subscriptionExpiry - now) / (24 * 3600 * 1000));
    }

    let statusPill = '';
    let remainingBadge = '';

    if (isSuspended) {
      statusPill = '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-700/80 font-mono">⛔ Suspended</span>';
      remainingBadge = '<span class="px-3 py-1 rounded-xl bg-rose-950/80 text-rose-300 border border-rose-700/60 font-bold text-xs flex items-center gap-1.5 mm-text">⛔ အကောင့် ရပ်ဆိုင်းထားပါသည်</span>';
    } else if (isPending) {
      statusPill = '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-700/60 font-mono animate-pulse">⏳ Pending Slip</span>';
      remainingBadge = '<span class="px-3 py-1 rounded-xl bg-amber-950/80 text-amber-300 border border-amber-600/60 font-bold text-xs flex items-center gap-1.5 animate-pulse mm-text">⏳ ပြေစာ စစ်ဆေးရန် စောင့်ဆိုင်းဆဲ</span>';
    } else if (isActive) {
      if (remainingDays > 7) {
        statusPill = `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-mono">✅ Active (${remainingDays}d)</span>`;
        remainingBadge = `<span class="px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-500/50 font-bold text-xs flex items-center gap-1.5 shadow-sm mm-text">⏳ လက်ကျန်: <strong class="text-emerald-200 font-extrabold text-sm font-mono">${remainingDays}</strong> ရက်</span>`;
      } else {
        statusPill = `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-700/60 font-mono">⚠️ Expiring Soon</span>`;
        remainingBadge = `<span class="px-3 py-1.5 rounded-xl bg-amber-950 text-amber-300 border border-amber-500/60 font-bold text-xs flex items-center gap-1.5 animate-pulse shadow-sm mm-text">⚠️ လက်ကျန်: <strong class="text-amber-200 font-extrabold text-sm font-mono">${remainingDays}</strong> ရက်သာ ကျန်တော့သည်!</span>`;
      }
    } else {
      statusPill = '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-rose-400 border border-rose-800/60 font-mono">❌ Expired</span>';
      remainingBadge = '<span class="px-3 py-1.5 rounded-xl bg-rose-950/80 text-rose-300 border border-rose-800/60 font-bold text-xs flex items-center gap-1.5 mm-text">❌ သက်တမ်းကုန်ဆုံးပြီး (၀ ရက်)</span>';
    }

    const expDateStr = acc.subscriptionExpiry 
      ? new Date(acc.subscriptionExpiry).toLocaleDateString('my-MM', { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' }) 
      : 'သက်တမ်း မသတ်မှတ်ရသေးပါ';

    const joinDateStr = acc.joinDate 
      ? new Date(acc.joinDate).toLocaleDateString('my-MM', { year: 'numeric', month: 'short', day: 'numeric' }) 
      : 'N/A';

    const totalPaidStr = Number(acc.totalPaid || 0).toLocaleString();
    const pwStatusBadge = acc.mustChangePassword
      ? '<span class="text-amber-400 font-mono text-[10px] bg-amber-950/60 px-2 py-0.5 rounded-lg border border-amber-700/40 mm-text">⏳ OTP စောင့်ဆိုင်းဆဲ</span>'
      : '<span class="text-slate-400 font-mono text-[10px] bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700 mm-text">🔑 Password သတ်မှတ်ပြီး</span>';

    return `
      <div class="p-4 md:p-5 rounded-2xl bg-slate-900/90 border ${isSuspended ? 'border-rose-600/50 bg-rose-950/20' : 'border-slate-800'} space-y-3.5 hover:border-purple-500/40 transition-all shadow-md">
        
        <!-- Top Row: User Identity & Badges -->
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div class="flex items-center gap-3">
            <span class="text-3xl">${acc.avatar || '👨‍💻'}</span>
            <div>
              <div class="font-bold text-slate-100 flex flex-wrap items-center gap-2 mm-text">
                <span class="text-sm font-black text-white">${escapeHtml(acc.name)}</span>
                <span class="text-xs text-indigo-300 font-mono font-bold">(@${escapeHtml(acc.username || 'user')})</span>
                ${statusPill}
                ${pwStatusBadge}
              </div>
              <div class="text-[11px] text-slate-400 font-mono flex flex-wrap items-center gap-2 mt-0.5">
                <span>📧 ${escapeHtml(acc.email)}</span>
                <span>•</span>
                <span>စတင်သည့်ရက်: ${joinDateStr}</span>
                <span>•</span>
                <span class="text-emerald-300 font-semibold">စုစုပေါင်း ပေးသွင်းငွေ: ${totalPaidStr} MMK</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Middle Row: Clean Expiry Date & Remaining Days Display -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
          <div class="flex items-center gap-2 mm-text text-xs">
            <span class="text-slate-400 font-semibold">📅 ကုန်ဆုံးမည့်ရက်:</span>
            <span class="font-mono font-bold text-slate-200">${expDateStr}</span>
          </div>
          <div class="flex items-center md:justify-end gap-2 mm-text">
            ${remainingBadge}
          </div>
        </div>

        ${acc.txnId ? `
          <div class="p-2.5 rounded-xl bg-amber-950/40 border border-amber-700/40 text-[11px] text-amber-200 flex flex-wrap items-center justify-between gap-2 mm-text">
            <div class="flex flex-wrap items-center gap-2">
              <span>💳 ငွေလွှဲ: <strong>${escapeHtml(acc.payMethod || 'KBZPay')}</strong></span>
              <span>•</span>
              <span>Txn ID: <strong class="font-mono text-white bg-slate-900 px-2 py-0.5 rounded border border-amber-600/40">${escapeHtml(acc.txnId)}</strong></span>
            </div>
            ${acc.slipNote ? `<span class="text-slate-300 text-[10px]">Note: ${escapeHtml(acc.slipNote)}</span>` : ''}
          </div>
        ` : ''}

        <!-- Bottom Row: 1-Click Action Buttons -->
        <div class="flex flex-wrap items-center justify-between gap-2 pt-1">
          <!-- Left: 1-Click Instant Extension Buttons -->
          <div class="flex flex-wrap items-center gap-1.5">
            <button onclick="instantExtendUser('${escapeHtml(acc.email)}', 30)" class="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-emerald-950/50 transition-all cursor-pointer mm-text" title="ရက် ၃၀ ချက်ချင်း သက်တမ်းတိုးမည်">
              <span>⏳ +30 ရက်တိုး (၁ လ)</span>
            </button>
            <button onclick="instantExtendUser('${escapeHtml(acc.email)}', 7)" class="px-2.5 py-1.5 rounded-xl bg-teal-900/90 hover:bg-teal-800 text-teal-200 border border-teal-700/60 font-semibold text-xs flex items-center gap-1 transition-all cursor-pointer mm-text" title="၇ ရက် ချက်ချင်း သက်တမ်းတိုးမည်">
              <span>⚡ +7 ရက်တိုး</span>
            </button>
            <button onclick="openAdminExtendModal('${escapeHtml(acc.email)}')" class="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1 shadow-md transition-all cursor-pointer mm-text" title="သက်တမ်းရက် စိတ်ကြိုက်တိုးပေးမည်">
              <span>✍️ စိတ်ကြိုက်တိုး</span>
            </button>
          </div>

          <!-- Right: User Management Actions -->
          <div class="flex flex-wrap items-center gap-1.5">
            <button onclick="adminResetUserPassword('${escapeHtml(acc.email)}')" class="px-3 py-1.5 rounded-xl bg-amber-950/90 hover:bg-amber-900 text-amber-200 border border-amber-700/60 font-semibold text-xs flex items-center gap-1 transition-all cursor-pointer mm-text shadow-sm" title="Password Reset OTP အသစ် ထုတ်ပေးမည်">
              <span>🔄 Reset OTP</span>
            </button>

            ${isSuspended ? `
              <button onclick="activateUserSubscription('${escapeHtml(acc.email)}')" class="px-3 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-600/60 font-bold text-xs transition-all cursor-pointer mm-text">
                <span>✅ ပြန်ဖွင့်</span>
              </button>
            ` : `
              <button onclick="suspendUserSubscription('${escapeHtml(acc.email)}')" class="px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-700/70 text-xs transition-all cursor-pointer mm-text" title="အကောင့် ရပ်ဆိုင်းမည်">
                <span>⛔ Suspend</span>
              </button>
            `}

            <button onclick="deleteUserAccount('${escapeHtml(acc.email)}')" class="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 text-rose-400 border border-slate-700 hover:border-rose-800 text-xs transition-all cursor-pointer mm-text" title="User ဖျက်မည်">
              <span>🗑️</span>
            </button>
          </div>
        </div>

      </div>
    `;
  }).join('');
}

function saveAdminSettings() {
  const feeInput = document.getElementById('adminFeeSettingInput');
  const pinInput = document.getElementById('adminPinSettingInput');
  const kpayInput = document.getElementById('adminKpayInput');
  const waveInput = document.getElementById('adminWaveInput');

  if (feeInput && feeInput.value) {
    state.monthlyFee = Math.max(1000, parseInt(feeInput.value, 10));
    localStorage.setItem('admin_monthly_fee', state.monthlyFee.toString());
  }

  if (pinInput && pinInput.value) {
    state.adminPin = pinInput.value.trim();
    localStorage.setItem('admin_master_pin', state.adminPin);
  }

  if (kpayInput && kpayInput.value) {
    state.kpayInfo = kpayInput.value.trim();
    localStorage.setItem('admin_kpay_info', state.kpayInfo);
  }

  if (waveInput && waveInput.value) {
    state.waveInfo = waveInput.value.trim();
    localStorage.setItem('admin_wave_info', state.waveInfo);
  }

  renderAdminAccounting();
  showToast("⚙️ Super Admin ဆက်တင်များကို အောင်မြင်စွာ သိမ်းဆည်းပြီးပါပြီ! 🎉");
}

function exportAccountingCsv() {
  const accounts = getRegisteredAccounts();
  const now = Date.now();
  let csv = "Email,Display Name,Role,Subscription Status,Expiry Date,Total Paid (MMK),Payment Method,Txn ID,Join Date\n";

  accounts.forEach(a => {
    const exp = a.subscriptionExpiry ? new Date(a.subscriptionExpiry).toISOString().slice(0, 10) : 'N/A';
    const join = a.joinDate ? new Date(a.joinDate).toISOString().slice(0, 10) : 'N/A';
    csv += `"${a.email}","${a.name}","${a.role || 'user'}","${a.subscriptionStatus || 'trial'}","${exp}","${a.totalPaid || 0}","${a.payMethod || ''}","${a.txnId || ''}","${join}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `monthly_accounting_ledger_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
  showToast("📥 လစဉ် စာရင်းရှင်းတမ်း (.CSV) ဒေါင်းလုဒ် ရယူပြီးပါပြီ!");
}

function exportAccountingJson() {
  const accounts = getRegisteredAccounts();
  const data = {
    exportDate: new Date().toISOString(),
    monthlyFee: state.monthlyFee,
    totalAccounts: accounts.length,
    accounts: accounts
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `financial_ledger_${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
  showToast("💾 စာရင်းရှင်းတမ်း Ledger (.JSON) ဒေါင်းလုဒ် ရယူပြီးပါပြီ!");
}


// ==========================================

// ==========================================
// 👥 GROUP STUDIO, TEAM COLLABORATION & HISTORY ENGINE
// ==========================================

function seedDefaultGroups() {
  const existing = localStorage.getItem('user_groups');
  if (!existing) {
    const defaultGroups = [
      {
        id: 'grp_default_cinema',
        name: '🎬 CinePrompt Creative Crew',
        description: 'Short Film, Cinema & Series Creation Team',
        createdBy: 'admin@promptmaster.ai',
        createdByName: 'Admin',
        createdAt: Date.now(),
        members: [
          { email: 'admin@promptmaster.ai', name: 'Super Admin', role: 'admin', avatar: '👑' },
          { email: 'tester@promptmaster.ai', name: 'VIP Tester', role: 'member', avatar: '⚡' }
        ]
      }
    ];
    localStorage.setItem('user_groups', JSON.stringify(defaultGroups));
  }
}

function getAllGroups() {
  seedDefaultGroups();
  try {
    const raw = localStorage.getItem('user_groups');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveAllGroups(groups) {
  localStorage.setItem('user_groups', JSON.stringify(groups));
  updateWorkspaceDisplay();
  updateTopGroupBadge();
}

function getUserGroups() {
  const all = getAllGroups();
  if (!state.isLoggedIn) return all;
  
  const userEmail = (state.user.email || '').toLowerCase().trim();
  const userName = (state.user.name || state.user.username || '').toLowerCase().trim();

  if (state.user.role === 'superadmin') {
    return all;
  }

  return all.filter(g => 
    g.members && g.members.some(m => 
      (m.email && m.email.toLowerCase().trim() === userEmail) ||
      (m.name && m.name.toLowerCase().trim() === userName)
    )
  );
}

function updateTopGroupBadge() {
  const myGroups = getUserGroups();
  const badge = document.getElementById('topGroupCountBadge');
  if (badge) badge.textContent = myGroups.length.toString();
}

function onWorkspaceSwitcherChange() {
  const select = document.getElementById('workspaceSwitcherSelect');
  if (!select) return;
  setActiveWorkspace(select.value);
}

function setActiveWorkspace(workspaceId) {
  state.activeWorkspace = workspaceId || 'personal';
  localStorage.setItem('current_active_workspace', state.activeWorkspace);
  updateWorkspaceDisplay();
  
  if (state.activeWorkspace === 'personal') {
    showToast("👤 Personal Workspace (ကိုယ်ပိုင် စတူဒီယို) သို့ ပြောင်းလဲလိုက်ပါပြီ!");
  } else {
    const groups = getAllGroups();
    const g = groups.find(grp => grp.id === state.activeWorkspace);
    if (g) {
      showToast(`👥 "${g.name}" Group Workspace သို့ ပြောင်းလဲလိုက်ပါပြီ! 🎉`);
    }
  }

  // Refresh history views
  renderEmbeddedHistoryList();
  renderHistoryList();
}

function updateWorkspaceDisplay() {
  const wsIcon = document.getElementById('activeWorkspaceIcon');
  const wsName = document.getElementById('activeWorkspaceName');
  const wsHint = document.getElementById('activeWorkspaceHint');
  const wsSelect = document.getElementById('workspaceSwitcherSelect');
  const histScopeGroupSelect = document.getElementById('histScopeGroupSelect');
  
  const myGroups = getUserGroups();

  if (wsSelect) {
    let optionsHtml = `<option value="personal" ${state.activeWorkspace === 'personal' ? 'selected' : ''}>👤 Personal Studio (ကိုယ်ပိုင် သီးသန့်)</option>`;
    myGroups.forEach(g => {
      optionsHtml += `<option value="${g.id}" ${state.activeWorkspace === g.id ? 'selected' : ''}>👥 ${escapeHtml(g.name)} (${g.members.length} Members)</option>`;
    });
    wsSelect.innerHTML = optionsHtml;
  }

  if (histScopeGroupSelect) {
    if (myGroups.length === 0) {
      histScopeGroupSelect.innerHTML = `<option value="">အဖွဲ့ မရှိသေးပါ</option>`;
    } else {
      histScopeGroupSelect.innerHTML = myGroups.map(g => 
        `<option value="${g.id}">${escapeHtml(g.name)}</option>`
      ).join('');
    }
  }

  if (state.activeWorkspace === 'personal' || !state.activeWorkspace) {
    if (wsIcon) wsIcon.textContent = '👤';
    if (wsName) {
      wsName.textContent = '👤 Personal Studio (ကိုယ်ပိုင် သီးသန့်)';
      wsName.className = 'text-indigo-300 font-mono font-bold bg-indigo-950/80 px-2.5 py-0.5 rounded-lg border border-indigo-700/50';
    }
    if (wsHint) wsHint.textContent = 'ထုတ်လုပ်သော Prompts များကို သင်ကိုယ်တိုင်သာ သီးသန့် ကြည့်ရှုအသုံးပြုနိုင်ပါမည်';
  } else {
    const all = getAllGroups();
    const activeGrp = all.find(g => g.id === state.activeWorkspace);
    if (activeGrp) {
      if (wsIcon) wsIcon.textContent = '👥';
      if (wsName) {
        wsName.textContent = `👥 ${activeGrp.name} (${activeGrp.members.length} Members)`;
        wsName.className = 'text-purple-300 font-mono font-bold bg-purple-950/90 px-2.5 py-0.5 rounded-lg border border-purple-700/60';
      }
      if (wsHint) wsHint.textContent = `ထုတ်လုပ်သော Prompts များကို "${activeGrp.name}" အဖွဲ့ဝင်များ အားလုံး အတူတကွ မျှဝေကြည့်ရှုနိုင်ပါမည်`;
    }
  }

  updateTopGroupBadge();
}

function openGroupStudioModal() {
  if (!state.isLoggedIn) {
    showToast("⚠️ Group စနစ် အသုံးပြုရန် ကျေးဇူးပြု၍ Login အရင်ဝင်ပေးပါခင်ဗျာ။");
    openLoginModal();
    return;
  }

  const modal = document.getElementById('groupStudioModal');
  switchGroupModalTab('list');
  renderGroupModalContent();
  if (modal) modal.classList.remove('hidden');
}

function closeGroupStudioModal() {
  const modal = document.getElementById('groupStudioModal');
  if (modal) modal.classList.add('hidden');
}

function switchGroupModalTab(tab) {
  const listBtn = document.getElementById('groupTabBtn-list');
  const createBtn = document.getElementById('groupTabBtn-create');
  const listContent = document.getElementById('groupModalContent-list');
  const createContent = document.getElementById('groupModalContent-create');

  if (tab === 'list') {
    if (listBtn) listBtn.className = "px-4 py-1.5 rounded-xl text-xs font-bold transition-all bg-purple-600 text-white shadow-sm cursor-pointer mm-text";
    if (createBtn) createBtn.className = "px-4 py-1.5 rounded-xl text-xs font-bold transition-all text-slate-400 hover:text-slate-200 cursor-pointer mm-text";
    if (listContent) listContent.classList.remove('hidden');
    if (createContent) createContent.classList.add('hidden');
    renderGroupModalContent();
  } else {
    if (listBtn) listBtn.className = "px-4 py-1.5 rounded-xl text-xs font-bold transition-all text-slate-400 hover:text-slate-200 cursor-pointer mm-text";
    if (createBtn) createBtn.className = "px-4 py-1.5 rounded-xl text-xs font-bold transition-all bg-purple-600 text-white shadow-sm cursor-pointer mm-text";
    if (listContent) listContent.classList.add('hidden');
    if (createContent) createContent.classList.remove('hidden');
  }
}

function handleCreateNewGroup() {
  const nameInput = document.getElementById('newGroupNameInput');
  const descInput = document.getElementById('newGroupDescInput');

  const name = nameInput ? nameInput.value.trim() : '';
  const desc = descInput ? descInput.value.trim() : '';

  if (!name) {
    showToast("⚠️ ကျေးဇူးပြု၍ အဖွဲ့အမည် (Group Name) ရိုက်ထည့်ပေးပါခင်ဗျာ။");
    return;
  }

  const groups = getAllGroups();
  const newGroup = {
    id: `grp_${Date.now()}`,
    name: name,
    description: desc || 'AI Film & Script Collaboration Team',
    createdBy: state.user.email || 'user@promptmaster.ai',
    createdByName: state.user.name || state.user.username || 'Creator',
    createdAt: Date.now(),
    members: [
      {
        email: state.user.email || 'user@promptmaster.ai',
        name: state.user.name || state.user.username || 'Leader',
        role: 'admin',
        avatar: state.user.avatar || '👨‍💻'
      }
    ]
  };

  groups.unshift(newGroup);
  saveAllGroups(groups);
  setActiveWorkspace(newGroup.id);

  if (nameInput) nameInput.value = '';
  if (descInput) descInput.value = '';

  switchGroupModalTab('list');
  showToast(`🎉 "${name}" အဖွဲ့အား အောင်မြင်စွာ တည်ထောင်ပြီးပါပြီ! Gmail ဖြင့် အဖွဲ့ဝင်များ ဖိတ်ခေါ်နိုင်ပါပြီ။`);
}

function handleAddMemberToGroup(groupId) {
  const emailInput = document.getElementById(`addMemberInput-${groupId}`);
  const email = emailInput ? emailInput.value.trim().toLowerCase() : '';

  if (!email || !email.includes('@')) {
    showToast("⚠️ ကျေးဇူးပြု၍ မှန်ကန်သော Gmail / Email လိပ်စာ ရိုက်ထည့်ပေးပါခင်ဗျာ။");
    return;
  }

  const groups = getAllGroups();
  const grp = groups.find(g => g.id === groupId);
  if (!grp) return;

  if (grp.members.some(m => m.email && m.email.toLowerCase() === email)) {
    showToast(`⚠️ "${email}" သည် အဖွဲ့ဝင် ဖြစ်ပြီးသား ဖြစ်ပါသည်!`);
    return;
  }

  // Find if registered user
  const registered = getRegisteredAccounts();
  const foundUser = registered.find(a => a.email && a.email.toLowerCase() === email);

  const newMember = {
    email: email,
    name: foundUser ? (foundUser.name || foundUser.username) : email.split('@')[0],
    role: 'member',
    avatar: foundUser ? (foundUser.avatar || '👨‍💻') : '👤',
    joinedAt: Date.now()
  };

  grp.members.push(newMember);
  saveAllGroups(groups);

  if (emailInput) emailInput.value = '';
  renderGroupModalContent();
  showToast(`🎉 "${newMember.name}" (${email}) အား "${grp.name}" အဖွဲ့ထဲသို့ အောင်မြင်စွာ ထည့်သွင်းလိုက်ပါပြီ!`);
}

function handleRemoveMemberFromGroup(groupId, memberEmail) {
  if (!confirm(`"${memberEmail}" အား အဖွဲ့မှ ဖယ်ရှားရန် သေချာပါသလား?`)) return;

  const groups = getAllGroups();
  const grp = groups.find(g => g.id === groupId);
  if (!grp) return;

  grp.members = grp.members.filter(m => m.email.toLowerCase() !== memberEmail.toLowerCase());
  saveAllGroups(groups);
  renderGroupModalContent();
  showToast(`"${memberEmail}" အား အဖွဲ့မှ ဖယ်ရှားပြီးပါပြီ။`);
}

function handleLeaveGroup(groupId) {
  if (!confirm("ဤအဖွဲ့မှ ထွက်ခွာရန် သေချာပါသလား?")) return;

  const groups = getAllGroups();
  const grp = groups.find(g => g.id === groupId);
  if (!grp) return;

  const userEmail = (state.user.email || '').toLowerCase();
  grp.members = grp.members.filter(m => m.email.toLowerCase() !== userEmail);

  if (grp.members.length === 0) {
    const updated = groups.filter(g => g.id !== groupId);
    saveAllGroups(updated);
  } else {
    saveAllGroups(groups);
  }

  if (state.activeWorkspace === groupId) {
    setActiveWorkspace('personal');
  }

  renderGroupModalContent();
  showToast("အဖွဲ့မှ ထွက်ခွာပြီးပါပြီ။");
}

function renderGroupModalContent() {
  const container = document.getElementById('groupModalContent-list');
  if (!container) return;

  const myGroups = getUserGroups();
  const userEmail = (state.user.email || '').toLowerCase();

  if (myGroups.length === 0) {
    container.innerHTML = `
      <div class="p-8 text-center rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div class="text-4xl">👥</div>
        <div class="font-bold text-slate-200 text-sm mm-text">သင်ပါဝင်ထားသော အဖွဲ့ (Group) မရှိသေးပါ</div>
        <p class="text-xs text-slate-400 max-w-sm mx-auto mm-text">
          သူငယ်ချင်းများနှင့် ဇာတ်လမ်းတွဲများ အတူတကွ ရေးသားရန် အဖွဲ့အသစ် စတင်ဖွဲ့စည်းပါ
        </p>
        <button type="button" onclick="switchGroupModalTab('create')" class="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer mm-text">
          ➕ အဖွဲ့အသစ် စတင်ဖွဲ့စည်းမည် (Create Group)
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = myGroups.map(grp => {
    const isActive = state.activeWorkspace === grp.id;
    const isCreator = grp.createdBy && grp.createdBy.toLowerCase() === userEmail;
    const myRoleInGroup = grp.members.find(m => m.email.toLowerCase() === userEmail)?.role || 'member';
    const canManage = isCreator || myRoleInGroup === 'admin' || state.user.role === 'superadmin';

    const membersHtml = grp.members.map(m => {
      const isLeader = m.role === 'admin' || (grp.createdBy && grp.createdBy.toLowerCase() === m.email.toLowerCase());
      return `
        <div class="flex items-center justify-between gap-2 p-2 px-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <div class="flex items-center gap-2">
            <span class="text-lg">${m.avatar || '👨‍💻'}</span>
            <div>
              <div class="font-bold text-slate-200 flex items-center gap-1.5 mm-text">
                <span>${escapeHtml(m.name || 'Member')}</span>
                ${isLeader ? '<span class="text-[9px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-700/60 font-mono font-bold">👑 Leader</span>' : '<span class="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">Member</span>'}
              </div>
              <div class="text-[10px] text-slate-400 font-mono">📧 ${escapeHtml(m.email)}</div>
            </div>
          </div>

          ${canManage && !isLeader ? `
            <button onclick="handleRemoveMemberFromGroup('${grp.id}', '${escapeHtml(m.email)}')" class="text-rose-400 hover:text-rose-300 text-xs p-1 rounded hover:bg-rose-950/60 transition-all" title="အဖွဲ့မှ ဖယ်ရှားမည်">
              ✕
            </button>
          ` : ''}
        </div>
      `;
    }).join('');

    return `
      <div class="p-4 md:p-5 rounded-2xl bg-slate-950/90 border ${isActive ? 'border-purple-500 bg-purple-950/10' : 'border-slate-800'} space-y-3.5 shadow-lg animate-fade-in">
        
        <!-- Group Header Row -->
        <div class="flex flex-wrap items-center justify-between gap-2.5 border-b border-slate-800/80 pb-3">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xl">👥</span>
              <h4 class="font-bold text-slate-100 text-sm md:text-base mm-text">${escapeHtml(grp.name)}</h4>
              ${isActive ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-600/60 font-mono animate-pulse">ACTIVE WORKSPACE</span>' : ''}
            </div>
            ${grp.description ? `<p class="text-xs text-slate-400 mm-text mt-0.5">${escapeHtml(grp.description)}</p>` : ''}
          </div>

          <div class="flex items-center gap-2">
            ${isActive ? `
              <button class="px-3.5 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-600/60 font-bold text-xs flex items-center gap-1.5 cursor-default mm-text">
                <span>✅ Active Workspace</span>
              </button>
            ` : `
              <button onclick="setActiveWorkspace('${grp.id}'); renderGroupModalContent();" class="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md mm-text">
                <span>🔄 ဤအဖွဲ့သို့ ပြောင်းမည်</span>
              </button>
            `}
          </div>
        </div>

        <!-- Add Member by Gmail Row -->
        ${canManage ? `
          <div class="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <label class="block text-xs font-bold text-slate-300 mm-text">
              ➕ Gmail ဖြင့် အဖွဲ့ဝင်အသစ် ထည့်သွင်းရန် (Invite via Gmail):
            </label>
            <div class="flex items-center gap-2">
              <input type="email" id="addMemberInput-${grp.id}" onkeydown="if(event.key==='Enter') handleAddMemberToGroup('${grp.id}')" placeholder="ဥပမာ- friend@gmail.com" class="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono">
              <button type="button" onclick="handleAddMemberToGroup('${grp.id}')" class="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer mm-text shrink-0 shadow-sm">
                <span>+ Add Member</span>
              </button>
            </div>
          </div>
        ` : ''}

        <!-- Members Grid List -->
        <div class="space-y-1.5">
          <div class="text-xs font-bold text-slate-400 mm-text flex items-center justify-between">
            <span>အဖွဲ့ဝင်များ (${grp.members.length} ယောက်):</span>
            <button onclick="handleLeaveGroup('${grp.id}')" class="text-rose-400 hover:text-rose-300 text-[11px] hover:underline cursor-pointer mm-text">
              🚪 အဖွဲ့မှ ထွက်မည်
            </button>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            ${membersHtml}
          </div>
        </div>

      </div>
    `;
  }).join('');
}

// ==========================================
// 📜 SEPARATED HISTORY ENGINE (INDIVIDUAL VS GROUP)
// ==========================================

function getIndividualHistoryStorageKey() {
  const accountId = state.user.email || 'guest';
  return `ai_prompt_history_${accountId.toLowerCase().trim()}`;
}

function getGroupHistoryStorageKey(groupId) {
  return `group_history_${groupId.toLowerCase().trim()}`;
}

function getIndividualHistory() {
  try {
    const raw = localStorage.getItem(getIndividualHistoryStorageKey());
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function getGroupHistory(groupId) {
  if (!groupId) return [];
  try {
    const raw = localStorage.getItem(getGroupHistoryStorageKey(groupId));
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function getUserHistory() {
  // Returns history according to active history scope
  if (state.historyActiveScope === 'group') {
    const histScopeGroupSelect = document.getElementById('histScopeGroupSelect');
    const selectedGroupId = histScopeGroupSelect ? histScopeGroupSelect.value : (state.activeWorkspace.startsWith('grp_') ? state.activeWorkspace : '');
    return getGroupHistory(selectedGroupId);
  } else {
    return getIndividualHistory();
  }
}

function saveToHistory(data) {
  if (!data || !data.scenes || data.scenes.length === 0) return;

  const now = Date.now();
  const newItem = {
    id: `proj_${now}`,
    timestamp: now,
    dateStr: new Date().toLocaleString('my-MM', { dateStyle: 'medium', timeStyle: 'short' }),
    user: state.user.name || state.user.username || 'Creator',
    email: state.user.email || '',
    authorAvatar: state.user.avatar || '👨‍💻',
    title: data.title || data.topic,
    topic: data.topic,
    videoFormat: data.videoFormat || 'Single Episode',
    videoFlow: data.videoFlow || 'Seamless Motion Flow',
    voiceOverPersona: data.voiceOverPersona || 'Male Movie Narrator',
    artStyle: data.artStyle,
    genre: data.genre,
    audioStyle: data.audioStyle,
    language: data.language,
    settingCulture: data.settingCulture,
    namingStyle: data.namingStyle,
    duration: data.duration,
    aspectRatio: data.aspectRatio,
    targetAI: data.targetAI,
    scenesCount: data.scenes.length,
    scenes: data.scenes,
    summary: data.summary || '',
    workspaceType: state.activeWorkspace === 'personal' ? 'personal' : 'group',
    workspaceId: state.activeWorkspace
  };

  if (state.activeWorkspace && state.activeWorkspace.startsWith('grp_')) {
    // Save to Group History
    const all = getAllGroups();
    const activeGrp = all.find(g => g.id === state.activeWorkspace);
    newItem.groupName = activeGrp ? activeGrp.name : 'Group Project';
    
    const grpHistory = getGroupHistory(state.activeWorkspace);
    grpHistory.unshift(newItem);
    if (grpHistory.length > 100) grpHistory.pop();
    localStorage.setItem(getGroupHistoryStorageKey(state.activeWorkspace), JSON.stringify(grpHistory));
  } else {
    // Save to Individual Private History
    const indHistory = getIndividualHistory();
    indHistory.unshift(newItem);
    if (indHistory.length > 50) indHistory.pop();
    localStorage.setItem(getIndividualHistoryStorageKey(), JSON.stringify(indHistory));
  }

  updateHistoryBadge();
  renderEmbeddedHistoryList();
}

function switchHistoryScopeTab(scope) {
  state.historyActiveScope = scope || 'individual';

  const indBtn = document.getElementById('histScopeBtn-individual');
  const grpBtn = document.getElementById('histScopeBtn-group');
  const groupSelectWrapper = document.getElementById('histScopeGroupSelectWrapper');
  const descEl = document.getElementById('embeddedHistoryDesc');

  if (scope === 'group') {
    if (grpBtn) grpBtn.className = "px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer bg-purple-600 text-white shadow-md mm-text";
    if (indBtn) indBtn.className = "px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80 mm-text";
    if (groupSelectWrapper) groupSelectWrapper.classList.remove('hidden');
    if (descEl) descEl.textContent = "အဖွဲ့ဝင်များ အားလုံး အတူတကွ ရေးသားထုတ်လုပ်ထားသော Video Prompts များကို ကြည့်ရှုအသုံးပြုနိုင်ပါသည်";
  } else {
    if (indBtn) indBtn.className = "px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer bg-indigo-600 text-white shadow-md mm-text";
    if (grpBtn) grpBtn.className = "px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80 mm-text";
    if (groupSelectWrapper) groupSelectWrapper.classList.add('hidden');
    if (descEl) descEl.textContent = "သင်ကိုယ်တိုင် သီးသန့် ထုတ်လုပ်ခဲ့သော Video Prompts များကိုသာ ကြည့်ရှုနိုင်ပါသည် (Private)";
  }

  renderEmbeddedHistoryList();
}

function updateHistoryBadge() {
  const indHistory = getIndividualHistory();
  const badge = document.getElementById('historyCountBadge');
  const topBadge = document.getElementById('topHistoryCountBadge');
  const indPill = document.getElementById('individualScopeCountPill');
  const grpPill = document.getElementById('groupScopeCountPill');

  if (badge) badge.textContent = indHistory.length.toString();
  if (topBadge) topBadge.textContent = indHistory.length.toString();
  if (indPill) indPill.textContent = indHistory.length.toString();

  const myGroups = getUserGroups();
  let totalGroupProjects = 0;
  myGroups.forEach(g => {
    totalGroupProjects += getGroupHistory(g.id).length;
  });
  if (grpPill) grpPill.textContent = totalGroupProjects.toString();
}

function renderEmbeddedHistoryList() {
  const container = document.getElementById('embeddedHistoryListContainer');
  const userTag = document.getElementById('embeddedHistoryUserTag');
  if (!container) return;

  const currentScope = state.historyActiveScope || 'individual';
  updateHistoryBadge();

  if (currentScope === 'group') {
    const histScopeGroupSelect = document.getElementById('histScopeGroupSelect');
    const selectedGroupId = histScopeGroupSelect ? histScopeGroupSelect.value : (state.activeWorkspace.startsWith('grp_') ? state.activeWorkspace : '');
    
    if (userTag) {
      userTag.textContent = "👥 Group Workspace";
      userTag.className = "text-xs px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800/60 font-mono font-bold";
    }

    if (!selectedGroupId) {
      container.innerHTML = `
        <div class="p-8 text-center text-slate-500 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3 mm-text">
          <div>👥</div>
          <div>ရွေးချယ်ထားသော Group မရှိသေးပါခင်ဗျာ။ Groups ခလုတ်ကို နှိပ်၍ အဖွဲ့သစ် ဖွဲ့စည်းနိုင်ပါသည်!</div>
          <button type="button" onclick="openGroupStudioModal()" class="px-3.5 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs cursor-pointer mm-text">
            👥 Manage Groups
          </button>
        </div>
      `;
      return;
    }

    const groupHistory = getGroupHistory(selectedGroupId);
    if (groupHistory.length === 0) {
      container.innerHTML = `
        <div class="p-8 text-center text-slate-500 rounded-2xl bg-slate-950/60 border border-slate-800 mm-text">
          ဤ Group တွင် အဖွဲ့ဝင်များ ထုတ်လုပ်ထားသော Prompts မှတ်တမ်း မရှိသေးပါခင်ဗျာ။ အဖွဲ့လိုက် စတူဒီယိုတွင် Generate ပြုလုပ်ပါက အလိုအလျောက် မျှဝေသိမ်းဆည်းပေးပါမည်။
        </div>
      `;
      return;
    }

    container.innerHTML = groupHistory.map(item => {
      const dStr = item.dateStr || new Date(item.timestamp).toLocaleDateString('my-MM', { year: 'numeric', month: 'short', day: 'numeric' });
      return `
        <div class="p-4 rounded-2xl bg-slate-950/90 border border-purple-800/40 hover:border-purple-500 transition-all flex flex-wrap items-center justify-between gap-3 shadow-md">
          <div class="space-y-1.5 max-w-xl">
            <div class="flex flex-wrap items-center gap-2">
              <span class="font-bold text-slate-100 text-sm mm-text">${escapeHtml(item.topic || item.title || 'Untitled Project')}</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-700/60 font-mono">${escapeHtml(item.genre || 'Cinema')}</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-700/60 font-mono">${escapeHtml(item.artStyle || 'Style')}</span>
            </div>

            <!-- Author & Group Badge -->
            <div class="flex flex-wrap items-center gap-2 text-[11px] text-slate-300 mm-text bg-slate-900/90 p-1.5 px-2.5 rounded-xl border border-slate-800">
              <span class="text-amber-300 font-bold flex items-center gap-1">
                <span>${item.authorAvatar || '👨‍💻'}</span>
                <span>ဖန်တီးသူ: <strong>${escapeHtml(item.user || 'Team Member')}</strong></span>
              </span>
              <span>•</span>
              <span class="text-slate-400 font-mono">📧 ${escapeHtml(item.email)}</span>
              <span>•</span>
              <span class="text-purple-300 font-semibold">👥 ${escapeHtml(item.groupName || 'Group')}</span>
              <span>•</span>
              <span class="text-slate-400">📅 ${dStr}</span>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="loadHistoryItem('${item.id}'); switchStudioStep('output');" class="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md mm-text">
              <span>📂 Fork / Load</span>
            </button>
            <button onclick="copyHistoryPrompts('${item.id}')" class="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition-all cursor-pointer mm-text">
              📋 Copy
            </button>
            <button onclick="deleteGroupHistoryItem('${selectedGroupId}', '${item.id}'); renderEmbeddedHistoryList();" class="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 text-rose-400 border border-slate-700 hover:border-rose-800 text-xs transition-all cursor-pointer mm-text" title="ဖျက်မည်">
              🗑️
            </button>
          </div>
        </div>
      `;
    }).join('');

  } else {
    // Individual Scope
    if (userTag) {
      userTag.textContent = state.isLoggedIn ? `@${state.user.name || state.user.email.split('@')[0]} (Private)` : "Guest / Local";
      userTag.className = "text-xs px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/60 font-mono font-bold";
    }

    const indHistory = getIndividualHistory();
    if (indHistory.length === 0) {
      container.innerHTML = `
        <div class="p-8 text-center text-slate-500 rounded-2xl bg-slate-950/60 border border-slate-800 mm-text">
          သိမ်းဆည်းထားသော ကိုယ်ပိုင် Prompts မှတ်တမ်း မရှိသေးပါခင်ဗျာ။ Story အသစ် Generate ပြုလုပ်ပါက အလိုအလျောက် သီးသန့် သိမ်းဆည်းပေးပါမည်။
        </div>
      `;
      return;
    }

    container.innerHTML = indHistory.map(item => {
      const dStr = item.dateStr || new Date(item.timestamp).toLocaleDateString('my-MM', { year: 'numeric', month: 'short', day: 'numeric' });
      return `
        <div class="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-wrap items-center justify-between gap-3 shadow-md">
          <div class="space-y-1 max-w-xl">
            <div class="flex flex-wrap items-center gap-2">
              <span class="font-bold text-slate-100 text-sm mm-text">${escapeHtml(item.topic || item.title || 'Untitled Story')}</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-700/60 font-mono">${escapeHtml(item.genre || 'Cinema')}</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-700/60 font-mono">${escapeHtml(item.artStyle || 'Style')}</span>
            </div>
            <div class="text-[11px] text-slate-400 font-mono flex flex-wrap items-center gap-2">
              <span>🔒 Private to You</span>
              <span>•</span>
              <span>📅 ${dStr}</span>
              <span>•</span>
              <span>🎬 ${item.scenes.length} Scenes</span>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="loadHistoryItem('${item.id}'); switchStudioStep('output');" class="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md mm-text">
              <span>📂 ဖွင့်မည် (Load)</span>
            </button>
            <button onclick="copyHistoryPrompts('${item.id}')" class="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition-all cursor-pointer mm-text">
              📋 Copy
            </button>
            <button onclick="deleteHistoryItem('${item.id}'); renderEmbeddedHistoryList();" class="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 text-rose-400 border border-slate-700 hover:border-rose-800 text-xs transition-all cursor-pointer mm-text" title="ဖျက်မည်">
              🗑️
            </button>
          </div>
        </div>
      `;
    }).join('');
  }
}

function deleteGroupHistoryItem(groupId, id) {
  let history = getGroupHistory(groupId);
  history = history.filter(h => h.id !== id);
  localStorage.setItem(getGroupHistoryStorageKey(groupId), JSON.stringify(history));
  updateHistoryBadge();
  showToast("Group မှတ်တမ်းကို ဖျက်ပြီးပါပြီ!");
}

function filterEmbeddedHistoryList() {
  const searchInput = document.getElementById('embeddedHistorySearchInput');
  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const container = document.getElementById('embeddedHistoryListContainer');
  if (!container) return;

  const currentScope = state.historyActiveScope || 'individual';
  let history = [];

  if (currentScope === 'group') {
    const histScopeGroupSelect = document.getElementById('histScopeGroupSelect');
    const selectedGroupId = histScopeGroupSelect ? histScopeGroupSelect.value : '';
    history = getGroupHistory(selectedGroupId);
  } else {
    history = getIndividualHistory();
  }

  const filtered = history.filter(item => {
    const topic = (item.topic || item.title || '').toLowerCase();
    const genre = (item.genre || '').toLowerCase();
    const user = (item.user || '').toLowerCase();
    const email = (item.email || '').toLowerCase();
    return topic.includes(query) || genre.includes(query) || user.includes(query) || email.includes(query);
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="p-8 text-center text-slate-500 rounded-2xl bg-slate-950/60 border border-slate-800 mm-text">
        ရှာဖွေမှုနှင့် ကိုက်ညီသော မှတ်တမ်း မတွေ့ရှိပါ
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => {
    const dStr = item.dateStr || new Date(item.timestamp).toLocaleDateString('my-MM');
    return `
      <div class="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div class="space-y-1 max-w-xl">
          <div class="flex flex-wrap items-center gap-2">
            <span class="font-bold text-slate-100 text-sm mm-text">${escapeHtml(item.topic || item.title || 'Untitled Story')}</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-700/60 font-mono">${escapeHtml(item.genre || 'Cinema')}</span>
          </div>
          <div class="text-[11px] text-slate-400 font-mono flex flex-wrap items-center gap-2">
            <span>ဖန်တီးသူ: <strong>${escapeHtml(item.user || 'Creator')}</strong></span>
            <span>•</span>
            <span>📅 ${dStr}</span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button onclick="loadHistoryItem('${item.id}'); switchStudioStep('output');" class="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md mm-text">
            <span>📂 ဖွင့်မည် (Load)</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function openHistoryModal() {
  const modal = document.getElementById('historyModal');
  updateUserProfileDisplay();
  renderHistoryList();
  if (modal) modal.classList.remove('hidden');
}

function closeHistoryModal() {
  const modal = document.getElementById('historyModal');
  if (modal) modal.classList.add('hidden');
}

function renderHistoryList(filterQuery = '') {
  const container = document.getElementById('historyListContainer');
  if (!container) return;
  let history = getUserHistory();

  if (filterQuery) {
    const q = filterQuery.toLowerCase();
    history = history.filter(h => 
      (h.title && h.title.toLowerCase().includes(q)) ||
      (h.topic && h.topic.toLowerCase().includes(q)) ||
      (h.genre && h.genre.toLowerCase().includes(q)) ||
      (h.user && h.user.toLowerCase().includes(q))
    );
  }

  if (history.length === 0) {
    container.innerHTML = `
      <div class="text-center py-10 px-4 bg-slate-900/50 rounded-xl border border-slate-800/80">
        <div class="text-3xl mb-2">📜</div>
        <p class="text-sm font-semibold text-slate-300 mm-text">မှတ်တမ်း မရှိသေးပါ</p>
        <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto mm-text">
          Prompts များ Generate လုပ်တိုင်း ဤနေရာတွင် အလိုအလျောက် သိမ်းဆည်းပေးမည် ဖြစ်ပါသည်။
        </p>
      </div>
    `;
    return;
  }

  container.innerHTML = history.map((item) => {
    const isSeries = item.videoFormat && item.videoFormat.includes('Series');
    const toolName = item.targetAI ? item.targetAI.split('(')[0].replace(/[🎬🎥✨🔮🚀⚡🎞️🖼️🌐🌊]/g, '').trim() : 'AI Video';
    const isGroupProj = item.workspaceType === 'group' || !!item.groupName;
    return `
      <div class="bg-[#1e293b]/70 border ${isGroupProj ? 'border-purple-600/40 bg-purple-950/10' : 'border-slate-700/80'} rounded-xl p-3.5 space-y-2.5 hover:border-indigo-500/60 transition-all animate-fade-in">
        <div class="flex flex-wrap items-start justify-between gap-2">
          <div class="space-y-1">
            <div class="flex flex-wrap items-center gap-1.5">
              <span class="text-xs px-2 py-0.5 rounded ${isSeries ? 'bg-purple-950 text-purple-300 border border-purple-800/60' : 'bg-blue-950 text-blue-300 border border-blue-800/60'} font-semibold font-mono">
                ${isSeries ? '📺 Series' : '🎬 Single'}
              </span>
              <span class="text-xs px-2 py-0.5 rounded bg-indigo-950/70 text-indigo-300 border border-indigo-800/40 font-semibold font-mono">
                🎯 ${toolName}
              </span>
              ${isGroupProj ? `<span class="text-xs px-2 py-0.5 rounded bg-purple-950 text-purple-200 border border-purple-700/60 font-semibold">👥 ${escapeHtml(item.groupName || 'Group')}</span>` : `<span class="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">🔒 Private</span>`}
              <span class="text-[10px] text-slate-400 ml-1 font-mono">${item.dateStr}</span>
            </div>
            <h4 class="text-sm font-bold text-slate-100 mm-text">${escapeHtml(item.title || item.topic)}</h4>
            ${isGroupProj ? `<div class="text-[11px] text-amber-300 font-mono">👤 ဖန်တီးသူ: <strong>${escapeHtml(item.user)}</strong> (${escapeHtml(item.email)})</div>` : ''}
          </div>

          <div class="flex items-center gap-1.5">
            <button onclick="loadHistoryItem('${item.id}')" class="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all cursor-pointer mm-text">
              <span>📂 Load</span>
            </button>
            <button onclick="copyHistoryPrompts('${item.id}')" class="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition-all cursor-pointer mm-text">
              📋 Copy
            </button>
            <button onclick="deleteHistoryItem('${item.id}')" class="p-1 rounded-lg hover:bg-rose-950/80 text-rose-400 hover:text-rose-300 border border-transparent hover:border-rose-800 transition-all cursor-pointer" title="Delete">
              🗑️
            </button>
          </div>
        </div>

        <div class="bg-slate-950/60 p-2 rounded-lg text-[11px] text-slate-400 line-clamp-2">
          ${escapeHtml(item.scenes?.[0]?.visualPrompt || item.summary || item.topic)}
        </div>
      </div>
    `;
  }).join('');
}

function filterHistoryList() {
  const input = document.getElementById('historySearchInput');
  const query = input ? input.value.trim() : '';
  renderHistoryList(query);
}

function loadHistoryItem(id) {
  let allItems = [...getIndividualHistory()];
  const groups = getUserGroups();
  groups.forEach(g => {
    allItems.push(...getGroupHistory(g.id));
  });

  const item = allItems.find(h => h.id === id);
  if (!item) return;

  if (document.getElementById('topicInput')) document.getElementById('topicInput').value = item.topic || item.title;
  if (document.getElementById('videoFormat') && item.videoFormat) document.getElementById('videoFormat').value = item.videoFormat;
  if (document.getElementById('videoFlow') && item.videoFlow) document.getElementById('videoFlow').value = item.videoFlow;
  if (document.getElementById('voiceOverPersona') && item.voiceOverPersona) document.getElementById('voiceOverPersona').value = item.voiceOverPersona;
  if (document.getElementById('charConsistency') && item.charConsistency) document.getElementById('charConsistency').value = item.charConsistency;
  if (document.getElementById('artStyle') && item.artStyle) document.getElementById('artStyle').value = item.artStyle;
  if (document.getElementById('genre') && item.genre) document.getElementById('genre').value = item.genre;
  if (document.getElementById('audioStyle') && item.audioStyle) document.getElementById('audioStyle').value = item.audioStyle;
  if (document.getElementById('language') && item.language) document.getElementById('language').value = item.language;
  if (document.getElementById('settingCulture') && item.settingCulture) document.getElementById('settingCulture').value = item.settingCulture;
  if (document.getElementById('namingStyle') && item.namingStyle) document.getElementById('namingStyle').value = item.namingStyle;
  if (document.getElementById('duration') && item.duration) document.getElementById('duration').value = item.duration;
  if (document.getElementById('aspectRatio') && item.aspectRatio) document.getElementById('aspectRatio').value = item.aspectRatio;
  if (document.getElementById('targetAI') && item.targetAI) document.getElementById('targetAI').value = item.targetAI;

  if (document.getElementById('badgeStyle') && item.artStyle) document.getElementById('badgeStyle').textContent = `Style: ${item.artStyle.split('(')[0]}`;
  if (document.getElementById('badgeGenre') && item.genre) document.getElementById('badgeGenre').textContent = `Genre: ${item.genre.split('(')[0]}`;
  if (document.getElementById('badgeVoice') && item.voiceOverPersona) {
    document.getElementById('badgeVoice').textContent = `Voice: ${item.voiceOverPersona.split('(')[0].replace('🎙️', '').trim()}`;
  }
  if (document.getElementById('badgeRatio') && item.aspectRatio) document.getElementById('badgeRatio').textContent = item.aspectRatio.split('(')[0];
  if (document.getElementById('badgeScenes') && item.scenes) document.getElementById('badgeScenes').textContent = `${item.scenes.length} Scenes`;

  state.currentData = item;
  renderAllTabs(item);
  closeHistoryModal();
  switchStudioStep('output');
  showToast(`📂 "${item.title || item.topic}" ပရောဂျက်ကို Studio ထဲသို့ အောင်မြင်စွာ ပြန်ဖွင့်လိုက်ပါပြီ! 🎉`);
}

function copyHistoryPrompts(id) {
  let allItems = [...getIndividualHistory()];
  const groups = getUserGroups();
  groups.forEach(g => {
    allItems.push(...getGroupHistory(g.id));
  });

  const item = allItems.find(h => h.id === id);
  if (!item || !item.scenes) return;

  let text = `// AI VIDEO PROMPTS: ${item.title || item.topic}\n\n`;
  item.scenes.forEach((s, idx) => {
    text += `// SCENE ${idx + 1}: ${s.title}\n${s.visualPrompt}\n\n`;
  });

  navigator.clipboard.writeText(text).then(() => {
    showToast("Prompts များကို Clipboard ထဲသို့ ကူးယူပြီးပါပြီ!");
  });
}

function deleteHistoryItem(id) {
  let history = getIndividualHistory();
  history = history.filter(h => h.id !== id);
  localStorage.setItem(getIndividualHistoryStorageKey(), JSON.stringify(history));
  updateHistoryBadge();
  renderHistoryList();
  renderEmbeddedHistoryList();
  showToast("မှတ်တမ်းကို ဖျက်ပြီးပါပြီ!");
}

function confirmClearHistory() {
  if (!confirm("သင်၏ ကိုယ်ပိုင် Prompt မှတ်တမ်းအားလုံးကို ရှင်းလင်းဖျက်ပစ်ရန် သေချာပါသလား?")) return;
  localStorage.removeItem(getIndividualHistoryStorageKey());
  updateHistoryBadge();
  renderHistoryList();
  renderEmbeddedHistoryList();
  showToast("ကိုယ်ပိုင် မှတ်တမ်းအားလုံးကို ရှင်းလင်းပြီးပါပြီ!");
}

function exportAllHistory() {
  const ind = getIndividualHistory();
  const myGroups = getUserGroups();
  const grpData = {};
  myGroups.forEach(g => {
    grpData[g.name] = getGroupHistory(g.id);
  });

  const exportObj = {
    exportDate: new Date().toISOString(),
    user: state.user,
    individualHistory: ind,
    groupWorkspaces: grpData
  };

  const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `CinePrompt_Projects_Archive_${state.user.name || 'User'}_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("ပရောဂျက် မှတ်တမ်း အားလုံးကို .JSON ဖိုင်အဖြစ် Export ရယူပြီးပါပြီ! 💾");
}


// ==========================================

function loadSavedSettings() {
  const savedKey = localStorage.getItem('gemini_api_key');
  const savedModel = localStorage.getItem('gemini_model');
  
  if (savedKey) {
    state.apiKey = savedKey;
    const keyInput = document.getElementById('apiKeyInput');
    if (keyInput) keyInput.value = savedKey;
  }
  if (savedModel) {
    state.model = savedModel;
    const modelSelect = document.getElementById('modelSelect');
    if (modelSelect) modelSelect.value = savedModel;
  }
}

function openSettingsModal() {
  const modal = document.getElementById('settingsModal');
  const keyInput = document.getElementById('apiKeyInput');
  const modelSelect = document.getElementById('modelSelect');
  
  keyInput.value = state.apiKey;
  modelSelect.value = state.model;
  modal.classList.remove('hidden');
}

function closeSettingsModal() {
  document.getElementById('settingsModal').classList.add('hidden');
}

function openHelpModal() {
  document.getElementById('helpModal').classList.remove('hidden');
}

function closeHelpModal() {
  document.getElementById('helpModal').classList.add('hidden');
}

function toggleApiKeyVisibility() {
  const keyInput = document.getElementById('apiKeyInput');
  const eyeText = document.getElementById('eyeText');
  const eyeIcon = document.getElementById('eyeIcon');
  if (keyInput.type === 'password') {
    keyInput.type = 'text';
    eyeText.textContent = 'Hide';
    eyeIcon.textContent = '🙈';
  } else {
    keyInput.type = 'password';
    eyeText.textContent = 'Show';
    eyeIcon.textContent = '👁️';
  }
}

function saveSettings() {
  const keyInput = document.getElementById('apiKeyInput');
  const modelSelect = document.getElementById('modelSelect');
  
  state.apiKey = keyInput.value.trim();
  state.model = modelSelect.value;
  
  localStorage.setItem('gemini_api_key', state.apiKey);
  localStorage.setItem('gemini_model', state.model);
  
  updateApiStatusBadge();
  closeSettingsModal();
  showToast(state.apiKey ? "Gemini API Key သိမ်းဆည်းပြီးပါပြီ!" : "API Key ရှင်းလင်းပြီးပါပြီ (Offline mode ဖြင့် အသုံးပြုမည်)");
}

function updateApiStatusBadge() {
  const badge = document.getElementById('apiStatusBadge');
  if (!badge) return;
  
  if (state.apiKey) {
    badge.innerHTML = `
      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
      <span class="text-emerald-400 font-semibold">Gemini AI Active (${state.model})</span>
    `;
    badge.className = "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/50 border border-emerald-800/60 text-xs";
  } else if (state.isLoggedIn && state.user.email) {
    badge.innerHTML = `
      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
      <span class="text-emerald-400 font-semibold">Backend AI Connected (${state.user.email.split('@')[0]})</span>
    `;
    badge.className = "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/50 border border-emerald-800/60 text-xs";
  } else {
    badge.innerHTML = `
      <span class="w-2 h-2 rounded-full bg-indigo-400"></span>
      <span class="text-indigo-300">Auto AI Mode (Sign in with Gmail)</span>
    `;
    badge.className = "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/40 border border-indigo-800/50 text-xs cursor-pointer hover:bg-indigo-900/40 transition-all";
  }
}

async function testApiKey() {
  const keyInput = document.getElementById('apiKeyInput');
  const testKey = keyInput.value.trim();
  const testBtn = document.getElementById('testApiBtn');
  const testMsg = document.getElementById('testApiMsg');
  
  if (!testKey) {
    testMsg.textContent = "ကျေးဇူးပြု၍ API Key ရိုက်ထည့်ပါ";
    testMsg.className = "text-xs text-rose-400 block mt-2";
    return;
  }
  
  testBtn.disabled = true;
  testBtn.innerHTML = "စစ်ဆေးနေပါသည်...";
  testMsg.className = "hidden";
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${testKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Respond with only the word: SUCCESS" }] }]
      })
    });
    
    const data = await response.json();
    if (response.ok && data.candidates) {
      testMsg.textContent = "✅ ချိတ်ဆက်မှု အောင်မြင်ပါသည်! (Connection Successful)";
      testMsg.className = "text-xs text-emerald-400 block mt-2 font-semibold";
    } else {
      throw new Error(data.error?.message || "Invalid API response");
    }
  } catch (err) {
    testMsg.textContent = `❌ ချိတ်ဆက်မှု မအောင်မြင်ပါ: ${err.message}`;
    testMsg.className = "text-xs text-rose-400 block mt-2";
  } finally {
    testBtn.disabled = false;
    testBtn.innerHTML = "🔍 API Key စစ်ဆေးမည် (Test Key)";
  }
}

async function setRandomIdea() {
  const input = document.getElementById('topicInput');
  const genre = document.getElementById('genre') ? document.getElementById('genre').value : 'Comedy';
  const culture = document.getElementById('settingCulture') ? document.getElementById('settingCulture').value : 'Myanmar Rural Village';
  
  input.classList.add('ring-2', 'ring-indigo-500', 'opacity-70');

  if (state.apiKey) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${state.model}:generateContent?key=${state.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Generate a creative, catchy, culturally authentic 1-sentence Myanmar story concept for an AI Video.
Strictly adhere to the Genre: ${genre}.
Setting/Culture: ${culture}.
Format: Return ONLY the natural Myanmar language sentence (no extra words, no quotes).`
            }]
          }],
          generationConfig: {
            temperature: 0.95,
            maxOutputTokens: 70
          }
        })
      });
      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (generatedText) {
        input.value = generatedText.replace(/^["'\s]+|["'\s]+$/g, '');
        input.classList.remove('opacity-70');
        setTimeout(() => input.classList.remove('ring-2', 'ring-indigo-500'), 400);
        autoSyncParametersFromGenreAndTopic('topic');
        showToast(`💡 Gemini AI က ${genre.split('(')[0].trim()} စိတ်ကူးသစ် ဖန်တီးပေးလိုက်ပါပြီ!`);
        return;
      }
    } catch (e) {
      console.warn("AI Idea generation fallback to genre catalog:", e);
    }
  }

  const ideas = getStoryIdeasForGenre(genre);
  let nextIndex;
  do {
    nextIndex = Math.floor(Math.random() * ideas.length);
  } while (nextIndex === lastIdeaIndex && ideas.length > 1);
  
  lastIdeaIndex = nextIndex;
  input.value = ideas[nextIndex];
  input.classList.remove('opacity-70');
  setTimeout(() => input.classList.remove('ring-2', 'ring-indigo-500'), 400);
  autoSyncParametersFromGenreAndTopic('topic');
  showToast(`💡 ${genre.split('(')[0].trim()} စိတ်ကူးသစ် ပြောင်းလဲပြီး အလိုက်ဖက်ဆုံး ရုပ်ထွက်/အသံများကို ချိန်ညှိလိုက်ပါပြီ!`);
}

// ==========================================
// 📖 STEP 1: EXPAND FULL STORY SCREENPLAY DRAFT
// ==========================================

async function expandFullStoryDraft() {
  const formParams = getFormValues();
  const draftContainer = document.getElementById('storyDraftContainer');
  const draftTextarea = document.getElementById('expandedStoryDraft');
  const btn = document.getElementById('expandStoryBtn');
  const btnText = document.getElementById('expandStoryBtnText');

  if (!draftContainer || !draftTextarea) return;

  draftContainer.classList.remove('hidden');
  const originalText = btnText ? btnText.textContent : '';
  if (state.apiKey) {
    try {
      const charInfo = (formParams.characters && formParams.characters.length > 0)
        ? formParams.characters.map((c, i) => `${i + 1}. **${c.name}**: ${c.role} [သီးသန့်အသံ: ${c.voice ? c.voice.split('(')[0].trim() : 'ရုပ်ရှင်သံ'}] (${c.appearance || ''})`).join('\n')
        : `1. **မင်းခန့်**: အဓိက ဇာတ်လိုက်\n2. **ဖိုးထောင်**: တွဲဖက် ဇာတ်လိုက်`;

      const promptText = `You are an award-winning Burmese Screenwriter and Film Director.
Write a full, rich, dramatic, and entertaining screenplay/story draft for an AI video production based on:
- Topic: ${formParams.topic}
- Genre: ${formParams.genre}
- Duration: ${formParams.duration}
- Audio Style: ${formParams.audioStyle}
- Language: ${formParams.language}
- Setting / Culture: ${formParams.settingCulture}
- Naming Style: ${formParams.namingStyle}

Structure the output EXACTLY in this format in natural, engaging Myanmar language:

## ဇာတ်လမ်းခေါင်းစဉ်: ${formParams.topic}
**အမျိုးအစား:** ${formParams.genre} (${formParams.duration})
**ဘာသာစကား:** ${formParams.language}

### 👥 ပါဝင်သော ဇာတ်ကောင်များနှင့် သီးသန့် အသံများ:
${charInfo}

---
### 🎬 အခန်းစဉ်အလိုက် ဇာတ်ညွှန်း အပြည့်အစုံ (Detailed Screenplay):

### **အခန်း (၁) : စတင်မိတ်ဆက်နှင့် အစပြုခြင်း (0:00 - 0:25)**
**မြင်ကွင်း (Visuals):** ...
**စကားပြော (Dialogue):**
ဇာတ်ကောင် ၁: "..."
ဇာတ်ကောင် ၂: "..."
**အသံ/SFX (Audio Direction):** ...

### **အခန်း (၂) : အရှိန်တက်ခြင်းနှင့် ပြဿနာကြုံတွေ့ရခြင်း (0:25 - 1:00)**
...

(Continue for all scenes based on duration).
Include full dialogue lines, timestamps, camera atmosphere, and clear character names.`;

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${state.model}:generateContent?key=${state.apiKey}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: {
            temperature: 0.85,
            maxOutputTokens: 2048
          }
        })
      });

      const resJson = await response.json();
      const outputText = resJson.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (outputText) {
        draftTextarea.value = outputText;
        showToast("📝 ဇာတ်လမ်း အစအဆုံး ဇာတ်ညွှန်းကို ရေးသားပြီးပါပြီ! စိတ်ကြိုက် ပြင်ဆင်နိုင်ပါသည်");
      } else {
        throw new Error("Empty response");
      }
    } catch (err) {
      console.warn("AI Story Expansion fallback:", err);
      draftTextarea.value = generateOfflineScreenplayDraft(formParams);
      showToast("📝 ဇာတ်လမ်း အစအဆုံး ဇာတ်ညွှန်း Draft ကို ဖြည့်သွင်းပေးလိုက်ပါပြီ!");
    }
  } else {
    draftTextarea.value = generateOfflineScreenplayDraft(formParams);
    showToast("📝 ဇာတ်လမ်း အစအဆုံး ဇာတ်ညွှန်း Draft ကို ဖြည့်သွင်းပေးလိုက်ပါပြီ!");
  }

  if (btn) btn.disabled = false;
  if (btnText) btnText.textContent = originalText;
  draftContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function generateOfflineScreenplayDraft(params) {
  const char1 = (params.characters && params.characters[0]) ? params.characters[0].name : "မင်းခန့်";
  const char2 = (params.characters && params.characters[1]) ? params.characters[1].name : "ဖိုးထောင်";
  const topic = params.topic || "ထူးဆန်းသော စွန့်စားခန်း ဇာတ်လမ်း";

  return `## ဇာတ်လမ်းခေါင်းစဉ်: ${topic}
**အမျိုးအစား:** ${params.genre} (${params.duration})

### 👥 ပါဝင်သော ဇာတ်ကောင်များ:
1. **${char1}**: အဓိက ဇာတ်လိုက် (ရဲရင့်ပြီး သွက်လက်သူ)
2. **${char2}**: တွဲဖက် ဇာတ်လိုက် (ဟာသဉာဏ်ရွှင်ပြီး ပွင့်လင်းသူ)

---
### 🎬 အခန်းစဉ်အလိုက် ဇာတ်ညွှန်း အပြည့်အစုံ:

### **အခန်း (၁) : စတင်မိတ်ဆက်နှင့် အစပြုခြင်း (0:00 - 0:25)**
**မြင်ကွင်း:** ${params.settingCulture} တွင် ${char1} နှင့် ${char2} တို့ ထူးဆန်းသော အခြေအနေတစ်ခုကို စတင်တွေ့ရှိခြင်း။
**စကားပြော:**
${char1}: "ဟေ့လူ... ကြည့်ကြစမ်းပါဦးဗျို့! ဒီနေ့တော့ အကြီးအကျယ် တစ်ခုခု ကြုံရတော့မယ်ဟေ့!"
${char2}: "အလိုလေး... ဟိုမှာ ဘာကြီးတုန်းဟ! သွားကြည့်ကြရအောင်..."
**အသံ/SFX:** စိတ်လှုပ်ရှားဖွယ် နောက်ခံတေးဂီတ၊ သဘာဝ ပတ်ဝန်းကျင် အသံများ။

### **အခန်း (၂) : အရှိန်တက်ခြင်းနှင့် ပြဿနာကြုံတွေ့ရခြင်း (0:25 - 1:00)**
**မြင်ကွင်း:** ${char1} နှင့် ${char2} တို့ အငြင်းပွားပြီး ရယ်စရာ တလွဲများ စတင်ဖြစ်ပေါ်လာခြင်း။
**စကားပြော:**
${char1}: "မင်းကလည်း သေချာကြည့်ပြီးမှ လုပ်ပါကွာ! အခုတော့ အကုန် တလွဲတွေ ဖြစ်ကုန်ပြီ!"
${char2}: "ငါ့အပြစ် မဟုတ်ဘူးနော်... မင်းပဲ အရင် စလုပ်တာလေ!"
**အသံ/SFX:** ရယ်မောသံများနှင့် ဟာသဆန်ဆန် Sound Effects။

### **အခန်း (၃) : အထွတ်အထိပ်နှင့် အောင်မြင်စွာ ဇာတ်သိမ်းခြင်း (1:00 - 3:00)**
**မြင်ကွင်း:** သူငယ်ချင်းနှစ်ယောက် အတူတကွ ပူးပေါင်းဖြေရှင်းပြီး ပျော်ရွှင်စွာ အဆုံးသတ်သွားခြင်း။
**စကားပြော:**
${char1}: "ဘယ်လိုပဲဖြစ်ဖြစ် ငါတို့ အတူတူ ကျော်ဖြတ်နိုင်ခဲ့တာပဲ မဟုတ်လား သူငယ်ချင်း!"
${char2}: "ဒါပေါ့ကွ! နောက်တစ်ခါဆိုရင်တော့ ဒီထက်မိုက်အောင် လုပ်ကြတာပေါ့ ဟားဟား!"
**အသံ/SFX:** အောင်ပွဲခံ တေးဂီတသံစဉ် အဆုံးသတ် Fade out။`;
}

// ==========================================
// ✨ PROMPT GENERATION ENGINE & ACCESS GATE
// ==========================================

function getFormValues() {
  let characters = [];
  let customCharName = '';
  
  if (state.charStudioEnabled) {
    if (state.charStudioSubTab === 'photo' && state.uploadedImages.length > 0) {
      characters = state.uploadedImages.map(img => ({
        name: (img.charName || 'Character').trim(),
        role: (img.charRole || 'Main Role').trim(),
        voice: (img.charVoice || 'Male Movie Narrator').trim(),
        appearance: (img.charAppearance || '').trim(),
        costume: (img.charCostume || '').trim()
      }));
      customCharName = characters[0] ? characters[0].name : '';
    } else {
      const consistency = document.getElementById('charConsistency') ? document.getElementById('charConsistency').value : '';
      const isDuo = consistency.includes('Duo') || consistency.includes('၂ ယောက်');
      const cName = document.getElementById('customCharName') ? document.getElementById('customCharName').value.trim() : 'မင်းခန့်';
      const cRole = document.getElementById('customCharRole') ? document.getElementById('customCharRole').value.trim() : 'ပါရမီရှင် စုံထောက်လူငယ်';
      const cVoice = document.getElementById('voiceOverPersona') ? document.getElementById('voiceOverPersona').value : 'Male Movie Narrator';
      const cApp = document.getElementById('customCharAppearance') ? document.getElementById('customCharAppearance').value.trim() : '';
      const cCos = document.getElementById('customCharCostume') ? document.getElementById('customCharCostume').value.trim() : '';
      
      characters = [{
        name: cName || 'မင်းခန့်',
        role: cRole || 'ပါရမီရှင် စုံထောက်လူငယ်',
        voice: cVoice,
        appearance: cApp,
        costume: cCos
      }];

      if (isDuo) {
        characters.push({
          name: 'ဖိုးထောင်',
          role: 'တွဲဖက်ဇာတ်လိုက် (ရွာသားလူရွှင်တော်)',
          voice: 'Comedic Myanmar Village Uncle (ဟာသဆန်ဆန် ကျေးလက်အဘိုးကြီး/ကိုကြီး အသံ)',
          appearance: 'အသက် ၄၅ နှစ်ခန့်၊ ပုဆိုးနှင့် တိုက်ပုံ ဝတ်ဆင်ထားသော ရွာသား',
          costume: 'ရိုးရာ ပုဆိုးနှင့် တီရှပ်'
        });
      }
      customCharName = cName;
    }
  }

  return {
    topic: document.getElementById('topicInput').value.trim() || 'Funny Village Adventure',
    videoFormat: document.getElementById('videoFormat') ? document.getElementById('videoFormat').value : 'Single Episode',
    videoFlow: document.getElementById('videoFlow') ? document.getElementById('videoFlow').value : 'Seamless Continuous Motion Flow',
    voiceOverPersona: document.getElementById('voiceOverPersona') ? document.getElementById('voiceOverPersona').value : 'Male Movie Narrator (ယောက်ျားလေး ရုပ်ရှင်သံ)',
    charConsistency: document.getElementById('charConsistency').value,
    artStyle: document.getElementById('artStyle').value,
    genre: document.getElementById('genre').value,
    audioStyle: document.getElementById('audioStyle').value,
    language: document.getElementById('language').value,
    settingCulture: document.getElementById('settingCulture').value,
    namingStyle: document.getElementById('namingStyle').value,
    duration: document.getElementById('duration').value,
    aspectRatio: document.getElementById('aspectRatio').value,
    targetAI: document.getElementById('targetAI').value,
    expandStory: document.getElementById('expandStory') ? document.getElementById('expandStory').value : 'Yes',
    expandedStoryDraft: document.getElementById('expandedStoryDraft') ? document.getElementById('expandedStoryDraft').value.trim() : '',
    charStudioEnabled: state.charStudioEnabled,
    characters: characters,
    customCharName: customCharName,
    hasUploadedImages: state.uploadedImages.length > 0
  };
}

function setLoadingState(loading) {
  state.isLoading = loading;
  const btn = document.getElementById('genBtn');
  const spin = document.getElementById('spinIcon');
  const btnText = document.getElementById('genBtnText');
  
  if (loading) {
    spin.classList.remove('hidden');
    btnText.textContent = state.apiKey ? "Gemini AI Scene Prompts များကို ရေးသားနေပါသည်..." : "Prompts ထုတ်လုပ်နေပါသည်...";
    btn.disabled = true;
  } else {
    spin.classList.add('hidden');
    btnText.textContent = "🎬 ၂။ Scene အလိုက် AI Prompts များ သီးသန့်ထုတ်ရန်";
    btn.disabled = false;
  }
}

async function continueGeneratingScenes() {
  if (!state.currentData || !state.currentData.scenes) {
    showToast("⚠️ ကျေးဇူးပြု၍ Prompts များကို အရင်ဆုံး ထုတ်လုပ်ပေးပါခင်ဗျာ");
    return;
  }

  const btn = document.getElementById('continueGenBtn');
  const originalHtml = btn ? btn.innerHTML : '';
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="animate-spin">⏳</span> <span>ဆက်လက် ထုတ်ယူနေပါသည်...</span>`;
  }

  try {
    const formParams = getFormValues();
    const currentSceneCount = state.currentData.scenes.length;
    showToast(`🔄 Scene #${currentSceneCount + 1} မှစတင်၍ အခန်းဆက်များကို ဆက်လက် ထုတ်လုပ်နေပါသည်...`);
    
    // Add 4 more continuation scenes
    const continuationScenes = [];
    const char1 = (formParams.characters && formParams.characters[0]) ? formParams.characters[0].name : "မင်းခန့်";
    const char2 = (formParams.characters && formParams.characters[1]) ? formParams.characters[1].name : "ဖိုးထောင်";

    for (let i = 1; i <= 4; i++) {
      const sceneNum = currentSceneCount + i;
      const secStart = (currentSceneCount * 20) + ((i - 1) * 20);
      const secEnd = secStart + 20;
      continuationScenes.push({
        sceneNumber: sceneNum,
        title: `အခန်း (${sceneNum}) : အခန်းဆက် စွန့်စားခန်း (${Math.floor(secStart / 60)}:${(secStart % 60).toString().padStart(2, '0')} - ${Math.floor(secEnd / 60)}:${(secEnd % 60).toString().padStart(2, '0')})`,
        duration: "7s",
        camera: "Smooth cinematic tracking tracking shot with dynamic perspective",
        motion: `${char1} and ${char2} continue their adventure with intense focus and emotional expression in ${formParams.settingCulture}`,
        lighting: "Rich atmospheric golden hour lighting with cinematic depth",
        flowTransition: "Continuous seamless match-cut flow",
        visualSummary: `Cinematic continuation shot of ${char1} and ${char2}`,
        scriptVoiceover: `${char1}: "ငါတို့ နောက်တစ်ဆင့်ကို ဆက်သွားရအောင်!" \n${char2}: "ဟုတ်ပြီ... ငါတို့ လက်မလျှော့စတမ်း ဆက်ကြိုးစားကြမယ်!"`,
        klingPrompt: `Cinematic 8k continuation visual of ${char1} and ${char2}, ${formParams.artStyle} in ${formParams.settingCulture} --motion 6 --camera-motion pan-right`,
        runwayPrompt: `[Camera]: Smooth panning shot.\n[Subject]: ${char1} and ${char2}.\n[Action]: Moving forward with determination.\n[Lighting]: Atmospheric ${formParams.settingCulture}.`,
        soraPrompt: `A continuous realistic cinematic continuation shot of ${char1} and ${char2} in ${formParams.settingCulture} with seamless motion.`,
        audioPrompt: `Sound effects of steps, intense dialogue, and ambient atmosphere.`
      });
    }

    state.currentData.scenes.push(...continuationScenes);
    renderAllTabs(state.currentData);
    saveToHistory(state.currentData);
    showToast(`✨ နောက်ထပ် Scene ၄ ခန်း (Scene ${currentSceneCount + 1} မှ ${currentSceneCount + 4}) ကို အောင်မြင်စွာ ပေါင်းထည့်လိုက်ပါပြီ!`);
  } catch (err) {
    console.error("Continuation Error:", err);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = originalHtml;
    }
  }
}

function checkAuthAndTrial() {
  const now = Date.now();

  // If user is suspended
  if (state.isLoggedIn && state.user.subscriptionStatus === 'suspended') {
    showToast("⛔ သင့်အကောင့်အား Super Admin မှ ခေတ္တ ရပ်ဆိုင်းထားပါသည် (Account Suspended)!");
    return false;
  }

  // If Super Admin or VIP Tester
  if (state.isLoggedIn && (state.user.role === 'superadmin' || state.user.role === 'tester')) {
    return true;
  }

  // If Active Member
  if (state.isLoggedIn && state.user.subscriptionStatus === 'active' && state.user.subscriptionExpiry > now) {
    return true;
  }

  // If Pending slip
  if (state.isLoggedIn && state.user.subscriptionStatus === 'pending') {
    showToast("⏳ သင်၏ ငွေလွှဲပြေစာကို Super Admin မှ စစ်ဆေးနေဆဲ ဖြစ်ပါသည်...");
    openSubscriptionModal();
    return false;
  }

  // If not logged in and never used guest trial
  if (!state.isLoggedIn) {
    if (state.guestTrialCount === 0) {
      return true; // Allow 1-time free trial
    } else {
      showToast("🔒 အခမဲ့ အစမ်းသုံးခွင့် (၁) ကြိမ် ပြည့်သွားပါပြီ! ဆက်လက်သုံးရန် Login ဝင်ပေးပါခင်ဗျာ။");
      showAuthGatewayModal();
      return false;
    }
  }

  // If regular user on trial/expired
  if (state.guestTrialCount === 0) {
    return true;
  }

  showToast("🔒 သက်တမ်းကုန်ဆုံးသွားပါပြီ! ဆက်လက်အသုံးပြုရန် လစဉ်ကြေး ပေးသွင်းပေးပါခင်ဗျာ။");
  openSubscriptionModal();
  return false;
}

async function generateVideoPrompts(isInitialLoad = false) {
  if (state.isLoading) return;

  if (!isInitialLoad && !checkAuthAndTrial()) return;
  
  const formParams = getFormValues();
  setLoadingState(true);
  
  document.getElementById('badgeStyle').textContent = `Style: ${formParams.artStyle.split('(')[0]}`;
  document.getElementById('badgeGenre').textContent = `Genre: ${formParams.genre.split('(')[0]}`;
  if (document.getElementById('badgeVoice')) {
    document.getElementById('badgeVoice').textContent = `Voice: ${formParams.voiceOverPersona.split('(')[0].replace('🎙️', '').trim()}`;
  }
  document.getElementById('badgeRatio').textContent = formParams.aspectRatio.split('(')[0];
  document.getElementById('badgeScenes').textContent = formParams.duration.includes('30') ? '3 Scenes (30s)' : formParams.duration.includes('1') ? '5 Scenes (1m)' : '8 Scenes (3m)';

  try {
    let resultData = null;
    
    if (state.apiKey) {
      resultData = await callGeminiApi(formParams);
    } else {
      await new Promise(r => setTimeout(r, 600));
      resultData = generateOfflineScenes(formParams);
    }
    
    state.currentData = resultData;
    renderAllTabs(resultData);
    saveToHistory(resultData);
    
    if (!isInitialLoad) {
      switchStudioStep('output');
    }

    if (!state.isLoggedIn && !isInitialLoad) {
      state.guestTrialCount++;
      localStorage.setItem('guest_trial_count', state.guestTrialCount.toString());
      updateUserProfileDisplay();
      showToast("🎁 အခမဲ့ အစမ်းသုံး (၁/၁) ကြိမ် Prompts ထုတ်ပေးလိုက်ပါပြီ! နောက်ထပ် အကန့်အသတ်မရှိ ဆက်သုံးရန် Gmail ဖြင့် Login ဝင်ပေးပါခင်ဗျာ။");
    } else if (!isInitialLoad) {
      showToast(state.apiKey ? "Gemini AI ဖြင့် Prompts အသစ် ထုတ်ယူပြီး မှတ်တမ်းတင်လိုက်ပါပြီ! 💾" : "Prompts များ ထုတ်ယူပြီး History တွင် သိမ်းဆည်းလိုက်ပါပြီ! 💾");
    }
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    showToast(`Gemini API Error: ${error.message}. Offline Presets သို့ ပြောင်းလဲထုတ်ပေးပါမည်။`);
    
    const fallbackData = generateOfflineScenes(formParams);
    state.currentData = fallbackData;
    renderAllTabs(fallbackData);
    saveToHistory(fallbackData);

    if (!isInitialLoad) {
      switchStudioStep('output');
    }
  } finally {
    setLoadingState(false);
  }
}

// ----------------------------------------------------
// Specialized Prompt Formatting Helper for Each AI Tool
// ----------------------------------------------------
function formatPromptForAITool(toolName, sceneObj, params, ratioTag, styleFragment) {
  const tool = (toolName || "").toLowerCase();
  const charTag = params.customCharName ? ` (Featuring consistent character: ${params.customCharName}, ${params.customCharAppearance || ''}, wearing ${params.customCharCostume || ''})` : '';
  const visualDesc = `${sceneObj.visualSummary}${charTag}`;
  
  if (tool.includes('flow')) {
    // Google Flow / Flow Frames specialized multi-shot sequence prompt
    return `[Flow Sequence]: Continuous cinematic camera tracking across ${params.settingCulture}.\n[Camera Flow Transition]: ${sceneObj.flowTransition || params.videoFlow || 'Seamless continuous motion flow'}.\n[Subject & Action]: ${visualDesc}. ${sceneObj.motion}.\n[Lighting & Atmosphere]: ${sceneObj.lighting}, ${styleFragment}, hyper-realistic fluid temporal coherence, 8K ultra-wide cinematic render ${ratioTag}.`;
  }

  if (tool.includes('kling')) {
    // Kling AI (1.5 / 2.0 Pro) specialized prompt
    return `Cinematic master visual, ${visualDesc}. ${sceneObj.camera}, ${sceneObj.lighting}, ${styleFragment} in ${params.settingCulture}. Ultra-high motion fidelity, fluid physical interactions, 8k film still, 60fps render, sharp cinematic focus --camera-motion ${sceneObj.klingCam || 'pan-left'} --motion 6 --cfg-scale 0.5 ${ratioTag}\n[Negative Prompt]: low quality, blurry, deformed face, distorted limbs, artifacts, static image, jitter`;
  }
  
  if (tool.includes('runway')) {
    // Runway Gen-3 Alpha structured bracket syntax
    return `[Camera]: ${sceneObj.camera} with smooth spatial trajectory.\n[Subject]: ${sceneObj.subjectDescription || sceneObj.title}${charTag}.\n[Action]: ${sceneObj.motion} with dynamic natural physics.\n[Lighting & Environment]: ${sceneObj.lighting}, atmospheric haze, ${params.settingCulture}, ${styleFragment}, 35mm anamorphic film lens, photorealistic 8k render ${ratioTag}.`;
  }
  
  if (tool.includes('hailuo') || tool.includes('minimax')) {
    // Minimax Hailuo AI prompt
    return `A breathtaking cinematic film shot of ${visualDesc}. The camera smoothly executes ${sceneObj.camera}. Authentic facial micro-expressions and fluid clothing movement as ${sceneObj.motion}. Atmospheric ${sceneObj.lighting}, rich color grading in ${params.settingCulture}, ${styleFragment}, masterclass production quality, 8k ${ratioTag}.`;
  }
  
  if (tool.includes('sora')) {
    // OpenAI Sora narrative physics prompt
    return `A hyper-realistic, continuous cinematic video shot in ${params.settingCulture}. The camera ${sceneObj.camera.toLowerCase()}, capturing ${visualDesc}. ${sceneObj.motion} with authentic physical weight and continuous spatial coherence. Natural ${sceneObj.lighting} illuminating detailed surface textures, ${styleFragment}, zero geometric distortion, 4K film still aesthetic ${ratioTag}.`;
  }
  
  if (tool.includes('luma')) {
    // Luma Dream Machine (Ray 2) vector transition prompt
    return `Start Frame: Establishing ${visualDesc} in ${params.settingCulture}.\nMotion Vector: Dynamic ${sceneObj.camera} with fast momentum as ${sceneObj.motion}.\nEnd Frame: Dramatic visual climax with ${sceneObj.lighting}, ${styleFragment}, octane render, photorealistic perfection ${ratioTag}.`;
  }
  
  if (tool.includes('wan')) {
    // Alibaba Wan 2.1 Video prompt
    return `High-dynamic video diffusion master prompt: ${visualDesc}, ${sceneObj.motion}. Cinematic ${sceneObj.camera}, atmospheric ${sceneObj.lighting}, ${styleFragment} in ${params.settingCulture}, vibrant cinematic contrast, hyper-detailed textures, stable temporal coherence, 8K ultra-clear ${ratioTag}.`;
  }
  
  if (tool.includes('pixverse') || tool.includes('pika')) {
    // PixVerse / Pika command syntax
    return `${visualDesc}, ${sceneObj.motion}, ${sceneObj.lighting}, ${styleFragment} in ${params.settingCulture} -camera zoom_in -motion 6 -fps 24 ${ratioTag}`;
  }
  
  if (tool.includes('midjourney') || tool.includes('flux')) {
    // Midjourney v6.1 / Flux first-frame image prompt
    return `A cinematic master film still of ${visualDesc}, ${sceneObj.lighting}, set in ${params.settingCulture}, ${styleFragment}, 35mm photography, directed by Roger Deakins, dynamic composition, 8k resolution, cinematic color grading --ar ${ratioTag.replace('--ar ', '')} --v 6.1 --style raw`;
  }

  // Universal Prompt
  return `Cinematic master video shot of ${visualDesc}. Camera: ${sceneObj.camera}. Action: ${sceneObj.motion}. Lighting: ${sceneObj.lighting}. Environment: ${params.settingCulture}, ${styleFragment}, ultra-detailed, 8k render, photorealistic, fluid motion ${ratioTag}.`;
}

async function callGeminiApi(params) {
  const sceneCount = params.duration.includes('30') ? 3 : params.duration.includes('1') ? 5 : 8;
  const ratioTag = params.aspectRatio.includes('9:16') ? '--ar 9:16' : params.aspectRatio.includes('1:1') ? '--ar 1:1' : params.aspectRatio.includes('21:9') ? '--ar 21:9' : '--ar 16:9';
  const isSeries = params.videoFormat.includes('Series');

  const systemInstruction = `You are a world-class AI Film Director, Cinematographer, and Burmese Screenplay Writer.
You specialize in creating high-converting AI video prompts for: ${params.targetAI}.
Format: ${params.videoFormat}.
Cinematic Flow: ${params.videoFlow}.
Voice Over Tone / Persona: ${params.voiceOverPersona}.
Genre: ${params.genre}.
Target Video Generator: ${params.targetAI}.

CRITICAL GENRE FIDELITY RULES:
1. The story arc, emotional tone, scene conflicts, dialogue, and visual descriptions MUST 100% adhere to the selected Genre: "${params.genre}".
   - If "Biography & History (အတ္ထုပ္ပတ္တိ/သမိုင်းဝင်ပုဂ္ဂိုလ်)": Structure as a compelling, historically grounded biographical mini-documentary with authentic timelines, milestone achievements, key historical turning points, and inspirational wisdom.
   - If "Horror & Mystery": Build genuine suspense, eerie paranormal anomalies, thrilling jump-scares, and dark supernatural revelations.
   - If "Action & Adventure": Build high-stakes confrontations, intense martial arts/tactical combat, dynamic pursuits, and heroic triumphs.
   - If "Sci-Fi & Futuristic": Emphasize cybernetic interfaces, quantum anomalies, flying vehicles, and futuristic technology.
   - If "Emotional Drama": Emphasize deep authentic human emotion, relationship conflicts, nostalgia, tears, and heartfelt reconciliation.
   - If "Comedy": Emphasize funny misunderstandings, witty character banter, comical chaos, slapstick reactions, and cheerful humor.
   - If "Fantasy Magic": Emphasize dazzling spellcasting, ancient floating relics, magical transformations, and mythical creatures.
   - If "Motivational / Storytelling": Emphasize relentless perseverance against heavy odds, breakthrough moments, and inspiring triumphant life lessons.

CRITICAL BURMESE LANGUAGE QUALITY RULES:
1. The Burmese dialogue / script (dialogueMM) MUST be completely natural, lively, and authentic spoken Myanmar language (သဘာဝကျကျ ရှင်သန်သော မြန်မာစကားပြော).
2. The dialogueMM MUST STRICTLY ADOPT the exact tone, personality, idioms, and speaking mannerisms of the chosen Voice Over Persona: "${params.voiceOverPersona}" (e.g., if Village Uncle/Auntie, use authentic rustic Myanmar village colloquialisms and expressions; if Female Sweet, use gentle, warm, melodic storytelling phrasing; if Energetic Host, use punchy high-energy social media hooks; if Mystery Whisper, use chilling, eerie, suspenseful whispering cadence; if Male Movie, use deep, authoritative cinematic screenplay narration).
3. DO NOT use stiff or literal English-to-Burmese translation. Use realistic Burmese idioms and emotionally resonant lines suitable for ${params.genre} and ${params.settingCulture}.
4. The story flow across scenes must be coherent, engaging, and build momentum from beginning to climax.
${isSeries ? '5. End the final scene with an exciting, suspenseful CLIFFHANGER hook for the next episode!' : '5. Bring the story to a satisfying and memorable resolution.'}

CRITICAL AI VIDEO PROMPT RULES:
1. Write the visualPrompt in English specifically formatted according to the exact syntax and prompt conventions of ${params.targetAI}.
2. If ${params.targetAI} is Google Flow / Flow Frames AI, include explicit multi-shot sequence flow cues and camera transition vector.
3. If ${params.targetAI} is Kling AI, include camera motion parameters and negative prompt tags.
4. If ${params.targetAI} is Runway Gen-3, use [Camera], [Subject], [Action], [Lighting & Environment] bracketed format.
5. If ${params.targetAI} is OpenAI Sora / Hailuo / Wan 2.1, use high-fidelity physical simulation descriptions.

Output ONLY valid JSON matching this schema:
{
  "title": "Title of story / episode",
  "summary": "Brief 1-sentence synopsis",
  "voiceOverPersona": "${params.voiceOverPersona}",
  "videoFlow": "${params.videoFlow}",
  "targetAI": "${params.targetAI}",
  "scenes": [
    {
      "number": 1,
      "title": "Scene 1: Title in Myanmar & English",
      "camera": "Cinematic camera movement",
      "flowTransition": "Transition flow from/to adjacent shot matching ${params.videoFlow}",
      "lighting": "Atmospheric lighting",
      "visualPrompt": "Specialized video prompt customized strictly for ${params.targetAI} with ${ratioTag}",
      "dialogueMM": "Authentic, natural, lively Burmese dialogue / voiceover matching ${params.voiceOverPersona}",
      "dialogueEN": "English translation / subtitle",
      "motion": "Detailed physical actions"
    }
  ]
}`;

  let characterPromptInfo = '';
  if (params.characters && params.characters.length > 0) {
    characterPromptInfo = '\n- DEFINED CHARACTERS (MANDATORY CONSISTENT NAMES & LOOKS):\n' +
      params.characters.map((c, i) => `  * Character ${i + 1}: Name="${c.name}", Role="${c.role}", Appearance="${c.appearance}", Costume="${c.costume}"`).join('\n') +
      `\nCRITICAL DIRECTIVE: Every scene visual prompt MUST accurately describe and feature ${params.characters.map(c => c.name).join(' and ')} with their exact visual appearance, face, and clothing so AI video generators (Kling, Sora, Runway, Flow) maintain 100% character consistency. In dialogue/voiceover lines, characters MUST speak using their names (e.g. ${params.characters[0].name}: "...")!`;
  }

  const userPrompt = `Generate a masterclass ${sceneCount}-scene AI Video Production Masterplan:
- Story Concept: ${params.topic}
- Story Structure: ${params.videoFormat}
- Cinematic Flow Style: ${params.videoFlow}
- Target Video Generator: ${params.targetAI}
- Voice Over Persona: ${params.voiceOverPersona}
- Art Style: ${params.artStyle}
- Genre: ${params.genre}
- Setting / Culture: ${params.settingCulture}
- Character Consistency: ${params.charConsistency}${characterPromptInfo}
- Language: ${params.language}
- Naming Style: ${params.namingStyle}
- Aspect Ratio: ${params.aspectRatio}

Ensure authentic, natural Myanmar script flow, character visual consistency, and perfect ${params.targetAI} prompts.`;

  const requestParts = [];
  if (state.charStudioEnabled && state.uploadedImages && state.uploadedImages.length > 0) {
    state.uploadedImages.forEach((img, idx) => {
      requestParts.push({
        inlineData: {
          mimeType: img.mime || 'image/jpeg',
          data: img.base64
        }
      });
    });
  }
  requestParts.push({ text: userPrompt });

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${state.model}:generateContent?key=${state.apiKey}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: requestParts }],
      systemInstruction: { parts: [{ text: systemInstruction }] },
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.75
      }
    })
  });

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.error?.message || `HTTP ${response.status}`);
  }

  const jsonResp = await response.json();
  const textContent = jsonResp.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!textContent) throw new Error("No response generated by Gemini API");
  
  const parsed = JSON.parse(textContent);
  return {
    ...params,
    title: parsed.title || params.topic,
    summary: parsed.summary || "",
    voiceOverPersona: params.voiceOverPersona,
    videoFlow: params.videoFlow,
    targetAI: params.targetAI,
    scenes: parsed.scenes || []
  };
}

function extractProtagonist(topic) {
  if (!topic) return "ဤသမိုင်းဝင်ပုဂ္ဂိုလ်";
  let t = topic.trim();
  if (t.includes('၏')) return t.split('၏')[0].trim();
  if (t.includes('ရဲ့')) return t.split('ရဲ့')[0].trim();
  if (t.includes('(')) return t.split('(')[0].trim();
  return t.length > 30 ? t.slice(0, 30) + '...' : t;
}

function getPersonaDialogueForScene(sceneNum, voice, params, isSeries) {
  const v = (voice || '').toLowerCase();
  const genre = (params && params.genre ? params.genre : '').toLowerCase();
  const hero = extractProtagonist(params && params.topic ? params.topic : '');
  
  // Extract custom character names from uploaded photos or inputs
  const char1 = (params && params.characters && params.characters[0] && params.characters[0].name) ? params.characters[0].name : (params && params.customCharName ? params.customCharName : 'မင်းခန့်');
  const char2 = (params && params.characters && params.characters[1] && params.characters[1].name) ? params.characters[1].name : 'မအေးသန်း';

  // 1. BIOGRAPHY & HISTORY (အတ္ထုပ္ပတ္တိ / သမိုင်းဝင်ပုဂ္ဂိုလ်) - HIGHEST PRIORITY
  if (genre.includes('biography') || genre.includes('history') || genre.includes('အတ္ထုပ္ပတ္တိ') || genre.includes('သမိုင်း')) {
    const dialogs = [
      { mm: `သမိုင်းဇာတ်ကြောင်း: "သမိုင်းစာမျက်နှာများထဲတွင် မော်ကွန်းတင်ကျန်ရစ်ခဲ့သော ${hero} ၏ ငယ်ဘဝအစသည် ရိုးရှင်းအေးချမ်းလှသော ဇာတိမြေမှ စတင်ခဲ့ပါသည်..."`, en: `Biographical Narrator: "Etched into the golden pages of history, the journey of ${hero} began from humble roots..."` },
      { mm: `သမိုင်းဇာတ်ကြောင်း: "တိုင်းပြည်နှင့် လူမျိုးအတွက် ထူးခြားသော ပါရမီနှင့် ရည်မှန်းချက်ကြီးမားမှုတို့က ${hero} အား သမိုင်းဝင် အလှည့်အပြောင်းတစ်ခုဆီသို့ ဦးတည်စေခဲ့သည်..."`, en: `Biographical Narrator: "From early youth, an extraordinary visionary spark and noble dedication led ${hero} towards their true historical destiny..."` },
      { mm: `သမိုင်းဇာတ်ကြောင်း: "ကြီးမားသော နိုင်ငံရေး၊ စစ်ရေး အကျပ်အတည်းနှင့် သမိုင်းဝင် စိန်ခေါ်မှုများကို မဆုတ်မနစ်သော ဇွဲသတ္တိဖြင့် ရင်ဆိုင်ခုခံ တိုက်ထုတ်ခဲ့ရပါသည်..."`, en: `Biographical Narrator: "Faced with monumental historical crises and heavy adversity, they stood resolute with unyielding courage..."` },
      { mm: `သမိုင်းဇာတ်ကြောင်း: "${hero} ၏ စံနမူနာ ခေါင်းဆောင်မှုအောက်တွင် ပြည်သူလူထုနှင့် တပ်မတော်ကြီးသည် တိုင်းပြည်စည်းလုံးညီညွတ်ရေးအတွက် မဆုတ်မနစ် စုစည်းချီတက်ခဲ့ကြသည်..."`, en: `Biographical Narrator: "Under the fearless leadership of ${hero}, the people united as one unstoppable force to build their nation..."` },
      { mm: `သမိုင်းဇာတ်ကြောင်း: "နောက်ဆုံးတွင် ကမ္ဘာနှင့် နိုင်ငံကို လွှမ်းမိုးခဲ့သော ကြီးကျယ်သည့် သမိုင်းမော်ကွန်းတင် အောင်ပွဲကြီးကို အောင်မြင်စွာ တည်ဆောက်နိုင်ခဲ့ပါတော့သည်..."`, en: `Biographical Narrator: "At last, against all insurmountable odds, their monumental triumph secured a timeless victory for sovereignty and humanity..."` },
      { mm: isSeries ? `သမိုင်းဇာတ်ကြောင်း: "သို့သော်... နောက်ထပ် သမိုင်းဝင် စစ်ဆင်ရေးကြီးတစ်ခုသည် မကြာမီ စတင်လာတော့မည် ဖြစ်သည်... (အပိုင်း ၂ တွင် ဆက်လက်ကြည့်ရှုပါ)"` : `သမိုင်းဇာတ်ကြောင်း: "${hero} ၏ မဆုတ်မနစ်သော မျိုးချစ်စိတ်ဓာတ်နှင့် သမိုင်းအမွေအနှစ်သည် ယနေ့တိုင် မြန်မာပြည်သူတို့၏ နှလုံးသားထဲတွင် ထာဝရ ရှင်သန်နေဆဲ ဖြစ်ပါသည်..."`, en: isSeries ? `Biographical Narrator: "Yet, another monumental historical chapter was on the horizon... (Stay tuned for Chapter 2)"` : `Biographical Narrator: "The timeless legacy and invincible spirit of ${hero} continue to inspire future generations forever..."` },
      { mm: `သမိုင်းဇာတ်ကြောင်း: "${hero} ၏ သမိုင်းဝင် ဩဝါဒစကားများနှင့် အဖိုးတန် သင်ခန်းစာများကို အစဉ်အမြဲ အမှတ်ရ လေးစားလျက် ရှိကြပါသည်..."`, en: `Biographical Narrator: "The timeless wisdom and profound legacy of ${hero} remain etched in history forever..."` },
      { mm: `(ခမ်းနားသော သမိုင်းဝင် တူရိယာတေးသံဖြင့် ပြီးဆုံးသွားသည်)`, en: `(Epic historical orchestral score plays)` }
    ];
    return dialogs[sceneNum - 1] || dialogs[0];
  }

  // 2. COMEDIC VILLAGE UNCLE
  if (v.includes('village uncle')) {
    const dialogs = [
      { mm: `${char1}: "ဟေ့လူတွေ... ကြည့်ကြစမ်းပါဦးဗျို့! ဒီနေ့တော့ ရွာထဲမှာ အကြီးအကျယ် တစ်ခုခု ကြုံရတော့မယ်ဟေ့!"`, en: `${char1}: "Hey villagers! Come look at this! Something extraordinary is about to happen today!"` },
      { mm: `${char2}: "အလိုလေး... ဟိုမှာ ဘာကြီးတုန်းဟ! သွားကြည့်ကြရအောင်၊ တုတ်တော့ အသင့်ဆွဲထားနော်!"`, en: `${char2}: "Goodness gracious! What on earth is that over there? Let's check it out, hold your stick ready!"` },
      { mm: `${char1}: "အမလေးဗျို့... ဒါတော့ လုံးဝ မထင်ထားဘူးဟေ့! ဟိုဘက်ကို ပြေးကြစို့!"`, en: `${char1}: "Oh my word! We didn't expect this at all! Run this way everyone!"` },
      { mm: `${char2}: "မြန်မြန်ပြေး... အနောက်ကို လှည့်မကြည့်နဲ့တော့! ရွာထဲအထိ အတင်းပြေးမှ ဖြစ်တော့မယ်!"`, en: `${char2}: "Run faster! Don't look back whatever you do! Head straight for the village!"` },
      { mm: `${char1}: "ဟူး... အသက်ဘေးက သီသီလေး လွတ်လာတာပဲဗျာ! ဒါပေမဲ့ ဒီကိစ္စကတော့ အခုမှ အစပဲ ရှိသေးတယ်..."`, en: `${char1}: "Phew... That was a hair-raising escape! But this matter is only just beginning..."` },
      { mm: isSeries ? `${char1}: "သူတို့ မသိခဲ့တာကတော့... အန္တရာယ်အစစ်အမှန်ဟာ အခုမှ စတင်နေပြီဆိုတာပါပဲ... (အပိုင်း ၂ ကို စောင့်မျှော်ပါ)"` : `${char1}: "ဒီလိုနဲ့ပဲ ရွာထဲက ဒီစွန့်စားခန်းလေးဟာ ပျော်ရွှင်ရယ်မောသံတွေနဲ့ အဆုံးသတ်သွားခဲ့ပါတော့တယ်ဗျာ..."`, en: isSeries ? `${char1}: "Little did we know... The real danger was only just beginning! (Stay tuned for Ep 2)"` : `${char1}: "And so our village adventure ended with hearty laughter and unforgettable memories!"` },
      { mm: `${char1}: "နောက်အပိုင်းမှာ ပြန်တွေ့ကြမယ်နော်... Like နဲ့ Follow လေး လုပ်သွားကြပါဦးဗျို့!"`, en: `${char1}: "See you all in the next episode! Don't forget to like and subscribe everyone!"` },
      { mm: `(ရွာရိုးရာ တေးသံဖြင့် ရယ်မောပျော်ရွှင်စွာ ပြီးဆုံးသွားသည်)`, en: `(Joyful traditional village music plays to a close)` }
    ];
    return dialogs[sceneNum - 1] || dialogs[0];
  }

  // 3. COMEDIC VILLAGE AUNTIE
  if (v.includes('village auntie')) {
    const dialogs = [
      { mm: `${char1}: "အလိုလေးတော်... ကြည့်စမ်းပါဦးရှင်! ဟိုအိမ်က ကောင်လေးတွေ ဘာတွေများ လျှောက်လုပ်နေကြပြန်ပြီလဲမသိဘူး!"`, en: `${char1}: "Oh my goodness! What on earth are those mischievous boys up to again!"` },
      { mm: `${char2}: "ဟင်! ဒါ ဘာကြီးလဲတော်... သတိထားကြနော်၊ တစ်ခုခုတော့ ထူးခြားနေပြီ!"`, en: `${char2}: "Wait! What is that thing over there? Be careful everyone, something is fishy!"` },
      { mm: `${char1}: "အမလေးလေး... ဒုက္ခပါပဲရှင်! ဘယ်လိုတောင် ဖြစ်ကုန်တာလဲ! အမြန်လာကြပါဦး!"`, en: `${char1}: "Goodness me! What a huge mess! Come quick everyone!"` },
      { mm: `${char2}: "ပြေးကြ... ပြေးကြတော်! မျက်စိရှေ့ကနေ အမြန်ဆုံး လွတ်အောင်ပြေး!"`, en: `${char2}: "Run, run away! Get out of sight as fast as you can!"` },
      { mm: `${char1}: "မောလိုက်တာရှင်... ဒါပေမဲ့ ဒီအကြောင်းကိုတော့ တစ်ရွာလုံးကို အမြန်ဆုံး ပြောပြရမယ်!"`, en: `${char1}: "I'm totally out of breath! But I have to tell the whole village about this right now!"` },
      { mm: isSeries ? `${char1}: "နောက်ထပ် ဘာတွေ ထပ်ဖြစ်ဦးမလဲဆိုတာတော့... နောက်အပိုင်းမှာ ဆက်ပြီး နားထောင်ကြဦးနော်!"` : `${char1}: "ဒီလိုနဲ့ပဲ ရွာသူရွာသားတွေ အားလုံး ပျော်ပျော်ပါးပါးနဲ့ အေးချမ်းသွားပါတော့တယ်ရှင်..."`, en: isSeries ? `${char1}: "What happens next? Don't miss out on the next juicy episode!"` : `${char1}: "And so peace and cheerful laughter returned to the village once again!"` },
      { mm: `${char1}: "နောက်တစ်ခေါက်လည်း လာနားထောင်ကြဦးနော်... Share လေးတွေ လုပ်သွားကြဦးရှင်!"`, en: `${char1}: "Come listen again next time! Don't forget to hit Share dear friends!"` },
      { mm: `(ဟာသဆန်ဆန် တေးသံဖြင့် ပြီးဆုံးသွားသည်)`, en: `(Comedic lighthearted outro music plays)` }
    ];
    return dialogs[sceneNum - 1] || dialogs[0];
  }

  // 4. FEMALE SWEET STORYTELLER
  if (v.includes('female sweet') || v.includes('storyteller')) {
    const dialogs = [
      { mm: `ပုံပြင်ပြောသူ: "နံနက်ခင်း မြူခိုးတွေ ဝေဆာနေတဲ့ ဒီနေရာလေးမှာ မမျှော်လင့်ထားတဲ့ စွန့်စားခန်းတစ်ခု စတင်ခဲ့ပါတယ်..."`, en: `Sweet Storyteller: "In this magical morning mist, an unexpected and wondrous fairy tale begins to unfold..."` },
      { mm: `ဇာတ်ကြောင်းပြော: "ရှေ့ဆက်သွားရင်းနဲ့ပဲ... သူတို့ရှေ့မှာ တောက်ပတဲ့ လျှို့ဝှက်ဆန်းကြယ် ရတနာတစ်ခုကို စတင်တွေ့ရှိခဲ့တယ်..."`, en: `Storyteller: "As they walked deeper into the woods, a shimmering mystical treasure appeared before their eyes..."` },
      { mm: `ဇာတ်ကြောင်းပြော: "အံ့သြဖွယ် အလင်းရောင်တွေ ထွက်ပေါ်လာပြီး အရာအားလုံးဟာ မျက်စိရှေ့မှာတင် ပြောင်းလဲသွားခဲ့ပါတယ်..."`, en: `Storyteller: "Magnificent rays of light burst forth, transforming everything in a blink of an eye..."` },
      { mm: `ဇာတ်ကြောင်းပြော: "သူတို့နှစ်ယောက်ဟာ ရဲရင့်စွာနဲ့ အခက်အခဲတွေကို လက်တွဲကျော်ဖြတ်ခဲ့ကြတယ်..."`, en: `Storyteller: "Holding hands courageously, they journeyed through every obstacle with pure hearts..."` },
      { mm: `ဇာတ်ကြောင်းပြော: "နောက်ဆုံးမှာတော့... အချစ်နဲ့ မေတ္တာတရားရဲ့ အဖြေမှန်ကို နားလည်သဘောပေါက်သွားခဲ့ပါတယ်..."`, en: `Storyteller: "At last, the true meaning of love and wisdom became clear to their hearts..."` },
      { mm: isSeries ? `ဇာတ်ကြောင်းပြော: "သို့သော်... ဤသည်မှာ ခရီးစဉ်၏ အစသာ ဖြစ်သေးသည်... (နောက်အပိုင်းတွင် ဆက်လက်စောင့်မျှော်ပါ)"` : `ဇာတ်ကြောင်းပြော: "ဒီလိုနဲ့ပဲ သူတို့ရဲ့ မမေ့နိုင်စရာ ပုံပြင်လေးဟာ ချိုသာနွေးထွေးစွာနဲ့ ပြီးဆုံးသွားခဲ့ပါတော့တယ်ရှင်..."`, en: isSeries ? `Storyteller: "Yet, this was only the first chapter of their journey... (To be continued)"` : `Storyteller: "And so, their heartwarming story came to a peaceful, magical close..."` },
      { mm: `ဇာတ်ကြောင်းပြော: "ချစ်စရာကောင်းတဲ့ ပုံပြင်လေးတွေကို ဆက်လက်နားဆင်ဖို့ Follow လုပ်ထားနော်..."`, en: `Storyteller: "Follow along for more heartwarming and magical stories..."` },
      { mm: `(ချိုသာနွေးထွေးသော စန္ဒရားတေးသံဖြင့် ပြီးဆုံးသွားသည်)`, en: `(Gentle soothing piano melody plays)` }
    ];
    return dialogs[sceneNum - 1] || dialogs[0];
  }

  // 5. ENERGETIC TIKTOK / REELS HOST
  if (v.includes('energetic') || v.includes('tiktok') || v.includes('host')) {
    const dialogs = [
      { mm: `Host: "ဟယ်လို guys တို့ရေ! ဒီနေ့တော့ လုံးဝ အံ့သြစရာကောင်းတဲ့ အစီအစဉ်လေး စတင်ပါပြီဗျို့!"`, en: `Host: "Hey what's up guys! Today we have something absolutely mind-blowing for you!"` },
      { mm: `Host: "ကြည့်ကြပါဦးဗျာ! ဒါကြီးကို တွေ့လိုက်ရတဲ့အချိန်မှာ အားလုံးပဲ အံ့သြသွားကြတယ် မဟုတ်လား!"`, en: `Host: "Look at that right there! Isn't that the craziest thing you've seen today?"` },
      { mm: `Host: "ဝိုး! ဒါတော့ လုံးဝ unthinkable ပဲဗျို့! အောက်က comment မှာ သင်ဘယ်လိုထင်လဲ ရေးခဲ့ပါဦး!"`, en: `Host: "Woah! This is completely unreal! Drop your thoughts in the comments below!"` },
      { mm: `Host: "ဆက်ကြည့်ကြစို့ဗျာ... အရှိန်အဟုန်ကတော့ အခုမှ စတင်မြင့်တက်လာတာနော်!"`, en: `Host: "Keep watching guys, the energy is about to skyrocket to the next level!"` },
      { mm: `Host: "နောက်ဆုံးတော့ ဒီလျှို့ဝှက်ချက်ရဲ့ အဖြေမှန်ကို ငါတို့ ဖော်ထုတ်နိုင်ခဲ့ပြီဗျို့!"`, en: `Host: "Finally we cracked the mystery wide open! You won't believe how this turned out!"` },
      { mm: isSeries ? `Host: "နောက်အပိုင်းမှာ ဘာတွေဖြစ်မလဲ သိချင်ရင်တော့ Follow လုပ်ပြီး Part 2 ကို စောင့်ကြနော်!"` : `Host: "ဒီနေ့ video လေးကို ကြိုက်ရင် Double Tap နဲ့ Like ပေးဖို့ မမေ့နဲ့နော် guys!"`, en: isSeries ? `Host: "Want to see what happens in Part 2? Smash that Follow button right now!"` : `Host: "If you loved today's video, smash that like and share button guys!"` },
      { mm: `Host: "နောက် video မှာ ပြန်တွေ့ကြမယ်... See you soon!"`, en: `Host: "Catch you in the next viral video! Peace out!"` },
      { mm: `(မြူးကြွသော beat တေးသံဖြင့် ပြီးဆုံးသွားသည်)`, en: `(High energy upbeat trap beat outro)` }
    ];
    return dialogs[sceneNum - 1] || dialogs[0];
  }

  // 6. MYSTERY & HORROR SUSPENSE WHISPER
  if (v.includes('mystery') || v.includes('horror') || v.includes('whisper')) {
    const dialogs = [
      { mm: `တီးတိုးသံ: "တိတ်တိတ်နေပါ... လွန်ခဲ့သော နှစ်ပေါင်းများစွာကတည်းက စတင်ခဲ့သော လျှို့ဝှက်ချက်တစ်ခု အခုမှ နိုးထလာခဲ့ပါသည်..."`, en: `Whisper: "Hush... A forgotten mystery from ages past is awakening in the shadows..."` },
      { mm: `တီးတိုးသံ: "အဲဒီနေရာမှာ... တစ်စုံတစ်ခုက သူတို့ကို အမှောင်ရိပ်ထဲကနေ စောင့်ကြည့်နေခဲ့တယ်..."`, en: `Whisper: "From the darkness... Something unearthly was watching their every step..."` },
      { mm: `တီးတိုးသံ: "ရုတ်တရက်... အေးစက်သော လေပြင်းတစ်ခု တိုက်ခတ်လာပြီး အရာအားလုံး တိတ်ဆိတ်သွားခဲ့သည်..."`, en: `Whisper: "Suddenly, a bone-chilling gust swept through, and total silence fell..."` },
      { mm: `တီးတိုးသံ: "နောက်ကို လှည့်မကြည့်ပါနှင့်... ခြေသံတွေက ပိုပိုပြီး နီးကပ်လာနေပြီ..."`, en: `Whisper: "Do not look back... The footsteps are drawing closer and closer..."` },
      { mm: `တီးတိုးသံ: "နောက်ဆုံးမှာတော့... ကြောက်မက်ဖွယ်ရာ အမှန်တရားကို သူတို့ မြင်တွေ့လိုက်ရသည်..."`, en: `Whisper: "At last... The terrifying truth stood revealed before their eyes..."` },
      { mm: isSeries ? `တီးတိုးသံ: "သူတို့ မသိခဲ့တာကတော့... အန္တရာယ်အစစ်အမှန်ဟာ အခုမှ စတင်နေပြီဆိုတာပါပဲ... (အပိုင်း ၂ တွင် ဆက်လက်ကြည့်ရှုပါ)"` : `တီးတိုးသံ: "ဒီညတော့... သင့်နောက်ကို မည်သူမျှ မလိုက်ပါစေနှင့်..."`, en: isSeries ? `Whisper: "Little did they know... The true nightmare had only just begun... (To be continued)"` : `Whisper: "Tonight... Make sure nothing follows you home in the dark..."` },
      { mm: `တီးတိုးသံ: "လျှို့ဝှက်ဆန်းကြယ် ဇာတ်လမ်းများအတွက် စောင့်မျှော်နားဆင်ပါ..."`, en: `Whisper: "Stay tuned for more spine-chilling mysteries..."` },
      { mm: `(သည်းထိတ်ရင်ဖို အသံလိုင်းဖြင့် တဖြည်းဖြည်း တိတ်ဆိတ်သွားသည်)`, en: `(Eerie ambient suspense fades into silence)` }
    ];
    return dialogs[sceneNum - 1] || dialogs[0];
  }

  // 7. CUTE CARTOON KID
  if (v.includes('cartoon') || v.includes('kid')) {
    const dialogs = [
      { mm: `ကာတွန်း: "ဝါး... အရမ်းပျော်ဖို့ ကောင်းတာပဲ! ငါတို့နဲ့အတူ ကစားကြမယ် ဟီးဟီး!"`, en: `Cartoon Kid: "Yay! This is going to be super duper fun! Let's go play together!"` },
      { mm: `ကာတွန်း: "ဟင်! ဟိုမှာ ကြည့်ပါဦး... ရောင်စုံ ပူဖောင်းကြီးတွေ တွေ့တယ်!"`, en: `Cartoon Kid: "Woah! Look over there! Colorful sparkling magical balloons!"` },
      { mm: `ကာတွန်း: "အိုး... မိုက်လိုက်တာ! အားလုံးပဲ ခုန်ကြမယ်နော် ၁... ၂... ၃!"`, en: `Cartoon Kid: "Yipee! Let's all jump together: One, Two, Three!"` },
      { mm: `ကာတွန်း: "မြန်မြန်ပြေးကြစို့... ဘယ်သူ ပထမရမလဲ ကြည့်မယ်!"`, en: `Cartoon Kid: "Zoom zoom! Let's see who reaches the finish line first!"` },
      { mm: `ကာတွန်း: "ဟေး... ငါတို့ အောင်မြင်သွားပြီ! အရမ်းတော်တာပဲ!"`, en: `Cartoon Kid: "Hurray! We did it together! High five everyone!"` },
      { mm: isSeries ? `ကာတွန်း: "နောက်တစ်ခေါက်လည်း အတူတူ ထပ်ကစားကြမယ်နော်... တာတာ့!"` : `ကာတွန်း: "ဒီနေ့တော့ အရမ်းပျော်ဖို့ ကောင်းတဲ့ နေ့လေးပါပဲ ဟီးဟီး!"`, en: isSeries ? `Cartoon Kid: "Let's play again in the next adventure! Bye bye friends!"` : `Cartoon Kid: "Today was the happiest, most fun day ever!"` },
      { mm: `ကာတွန်း: "နောက်အပိုင်းမှာ ပြန်တွေ့မယ်နော် တာတာ့!"`, en: `Cartoon Kid: "See you next time! Bye bye!"` },
      { mm: `(ကာတွန်းတေးသံ မြူးမြူးဖြင့် ပြီးဆုံးသွားသည်)`, en: `(Playful cartoon xylophone outro plays)` }
    ];
    return dialogs[sceneNum - 1] || dialogs[0];
  }

  // 8. CALM & SOFT DOCUMENTARY NARRATOR (General Nature / Culture)
  if (v.includes('calm') || v.includes('documentary')) {
    const dialogs = [
      { mm: `Narrator: "သဘာဝတရား၏ အလှတရားသည် ကျွန်ုပ်တို့အား အမြဲတမ်း ငြိမ်းချမ်းအေးမြမှုကို ပေးစွမ်းလျက် ရှိပါသည်..."`, en: `Documentary: "Nature in its purest form reveals a quiet tranquility beyond human imagination..."` },
      { mm: `Narrator: "ဤရှုခင်း၏ အနုစိတ်အလှတရားသည် နှစ်ပေါင်းရာချီသော သမိုင်းကြောင်းနှင့် ယှဉ်တွဲလျက် ရှိသည်..."`, en: `Documentary: "The delicate tapestry of this landscape has evolved over centuries of quiet harmony..."` },
      { mm: `Narrator: "နေရောင်ခြည်၏ နွေးထွေးမှုအောက်တွင် သက်ရှိအားလုံးသည် ရှင်သန်လှုပ်ရှားလျက် ရှိပါသည်..."`, en: `Documentary: "Bathed in the warm morning light, life stirs with timeless grace..."` },
      { mm: `Narrator: "ခရီးစဉ်တစ်လျှောက် တွေ့ကြုံရသော ရိုးရာဓလေ့များသည် အဖိုးမဖြတ်နိုင်သော အမွေအနှစ်များ ဖြစ်ကြသည်..."`, en: `Documentary: "Each cultural tradition passed down through generations remains an invaluable heritage..."` },
      { mm: `Narrator: "ဤအတွေ့အကြုံသည် ကျွန်ုပ်တို့၏ စိတ်နှလုံးကို အေးချမ်းတည်ငြိမ်စေခဲ့ပါသည်..."`, en: `Documentary: "This profound journey reminds us of the enduring peace within the human spirit..."` },
      { mm: isSeries ? `Narrator: "ဤခရီးစဉ်၏ နောက်ထပ် အခန်းကဏ္ဍများကို ဆက်လက်စူးစမ်းလေ့လာကြပါမည်..."` : `Narrator: "သဘာဝတရားနှင့် ယဉ်ကျေးမှု၏ သဟဇာတဖြစ်မှုသည် ထာဝရ တည်တံ့နေမည် ဖြစ်ပါသည်..."`, en: isSeries ? `Documentary: "We will explore the next magnificent chapter of this expedition..."` : `Documentary: "The harmony between humanity and nature endures forever..."` },
      { mm: `Narrator: "မှတ်တမ်းရုပ်ရှင်များ ဆက်လက်ကြည့်ရှုရန် အားပေးကြပါ..."`, en: `Documentary: "Thank you for joining our documentary journey..."` },
      { mm: `(ငြိမ့်ညောင်းသော တူရိယာတေးသံဖြင့် ပြီးဆုံးသွားသည်)`, en: `(Tranquil acoustic strings outro plays)` }
    ];
    return dialogs[sceneNum - 1] || dialogs[0];
  }

  // 9. DEFAULT: MALE MOVIE NARRATOR
  const defaultDialogs = [
    { mm: `ရုပ်ရှင်ဇာတ်ကြောင်း: "ဤနေရာသည် လျှို့ဝှက်ဆန်းကြယ်မှုများ ပြည့်နှက်နေသော ကမ္ဘာသစ်တစ်ခု ဖြစ်ပါသည်..."`, en: `Movie Narrator: "In a world shrouded in mystery, an epic destiny begins to unfold..."` },
    { mm: `ရုပ်ရှင်ဇာတ်ကြောင်း: "မမျှော်လင့်ထားသော အဖြစ်အပျက်တစ်ခုက သူတို့၏ ကံကြမ္မာကို စတင်ပြောင်းလဲစေခဲ့သည်..."`, en: `Movie Narrator: "An unexpected discovery shifts the tide of their destiny forever..."` },
    { mm: `ရုပ်ရှင်ဇာတ်ကြောင်း: "အန္တရာယ်နှင့် ရင်ဆိုင်ရချိန်တွင် ရဲရင့်သော ဆုံးဖြတ်ချက်ကို ချမှတ်ရတော့မည်..."`, en: `Movie Narrator: "Faced with imminent danger, the critical moment of courage has arrived..."` },
    { mm: `ရုပ်ရှင်ဇာတ်ကြောင်း: "အချိန်တိုင်းသည် အဖိုးတန်လွန်းလှပြီး နောက်ဆုတ်ရန် လမ်းစမရှိတော့ပေ..."`, en: `Movie Narrator: "Every second counts, and turning back is no longer an option..."` },
    { mm: `ရုပ်ရှင်ဇာတ်ကြောင်း: "နောက်ဆုံးတွင် မဟာလျှို့ဝှက်ချက်၏ အဖြေမှန်သည် ပေါ်ပေါက်လာခဲ့ပါတော့သည်..."`, en: `Movie Narrator: "At last, the ultimate truth emerges from the shadows of history..."` },
    { mm: isSeries ? `ရုပ်ရှင်ဇာတ်ကြောင်း: "သို့သော်... အန္တရာယ်အစစ်အမှန်သည် အခုမှ စတင်နေပြီ ဖြစ်သည်... (အပိုင်း ၂ ကို စောင့်မျှော်ပါ)"` : `ရုပ်ရှင်ဇာတ်ကြောင်း: "ဒီလိုနဲ့ပဲ သူတို့၏ မမေ့နိုင်စရာ မော်ကွန်းဝင် စွန့်စားခန်းသည် ခမ်းနားစွာ ပြီးဆုံးသွားခဲ့ပါတော့သည်..."`, en: isSeries ? `Movie Narrator: "Yet, the greatest battle still lies ahead... (To be continued in Episode 2)"` : `Movie Narrator: "And so, their legendary cinematic journey reached its unforgettable conclusion..."` },
    { mm: `ရုပ်ရှင်ဇာတ်ကြောင်း: "နောက်ထပ် ရုပ်ရှင်ဇာတ်လမ်းများကို ဆက်လက်စောင့်မျှော် ကြည့်ရှုပါ..."`, en: `Movie Narrator: "Stay tuned for the next cinematic masterpiece..."` },
    { mm: `(ခမ်းနားသော ရုပ်ရှင်တေးဂီတဖြင့် ပြီးဆုံးသွားသည်)`, en: `(Epic orchestral cinematic score plays)` }
  ];
  return defaultDialogs[sceneNum - 1] || defaultDialogs[0];
}

function getGenreSceneTemplates(genre, params, isSeries) {
  const g = (genre || '').toLowerCase();

  if (g.includes('biography') || g.includes('history') || g.includes('အတ္ထုပ္ပတ္တိ') || g.includes('သမိုင်း')) {
    return [
      {
        title: isSeries ? "Scene 1: သမိုင်းဝင် အစပြုခြင်း (The Origins & Early Life)" : "Scene 1: ငယ်ဘဝနှင့် ဇစ်မြစ် (Birthplace & Early Childhood Roots)",
        camera: "Cinematic Slow Drone Push-In across Historical Landscape -> Eye-Level Nostalgic Dolly",
        flowTransition: "Historical archive-inspired tracking flow -> smoothly dissolves into protagonist's humble childhood environment",
        lighting: "Sepia-infused warm nostalgic golden morning sunlight with gentle atmospheric dust motes",
        visualSummary: `Authentic historical setting of ${params.settingCulture}, capturing the early roots and humble beginnings of ${params.topic}`,
        motion: "Young protagonist observing the surroundings thoughtfully, holding books or tools with quiet visionary curiosity"
      },
      {
        title: "Scene 2: ထူးခြားသော ပါရမီနှင့် ဘဝအလှည့်အပြောင်း (The Spark of Genius / Turning Point)",
        camera: "Intense Close-Up on Determined Eyes -> Rack Focus to Historical Manuscript/Map",
        flowTransition: "Continuous macro focus flow -> transitions smoothly from deep contemplation to breakthrough decision",
        lighting: "Dramatic focused spotlight through historic window, deep chiaroscuro shadows",
        visualSummary: `Protagonist experiencing a pivotal life realization or discovering their true calling in ${params.settingCulture} regarding ${params.topic}`,
        motion: "Protagonist writing passionately by candlelight or studying strategic maps with intense unwavering dedication"
      },
      {
        title: "Scene 3: ကြီးမားသော သမိုင်းဝင် စိန်ခေါ်မှုနှင့် အခက်အခဲ (The Great Historical Struggle)",
        camera: "Over-the-Shoulder Medium Shot -> Low-Angle Dramatic Standoff",
        flowTransition: "Dynamic tension-building tracking flow -> confronts heavy political, military, or scientific adversity",
        lighting: "Dark turbulent storm clouds with dramatic high-contrast side lighting",
        visualSummary: `Historical hardship, fierce opposition, or national crisis faced by protagonist in ${params.settingCulture} regarding ${params.topic}`,
        motion: "Protagonist standing resiliently in front of crowd or adversaries, delivering an impassioned fearless speech"
      },
      {
        title: "Scene 4: မဆုတ်မနစ်သော ခေါင်းဆောင်မှုနှင့် ကြိုးပမ်းချက် (Monumental Stand & Relentless Effort)",
        camera: "Fast Lateral Tracking Shot alongside Historic Assembly / Battle / Workshop",
        flowTransition: "High-momentum tracking flow matching the unstoppable historical movement and unity",
        lighting: "Inspiring bright rays of sunlight cutting through smoke and dust clouds",
        visualSummary: `Protagonist leading a united movement, historic campaign, or breakthrough innovation in ${params.settingCulture}`,
        motion: "Protagonist marching forward alongside followers, raising hands to inspire unity and courage"
      },
      {
        title: "Scene 5: ကမ္ဘာနှင့် နိုင်ငံကို လွှမ်းမိုးခဲ့သော ကြီးကျယ်သည့် အောင်မြင်မှု (Monumental Milestone & Triumph)",
        camera: "Grand Sweeping Crane Shot over Cheering Crowds / World Stage",
        flowTransition: "Elevating majestic orbit flow -> captures historic signing, triumphant victory, or global recognition",
        lighting: "Brilliant golden hour glory, celebratory sunbeams illuminating historical flags and symbols",
        visualSummary: `Pivotal historical triumph, independence declaration, scientific discovery, or landmark achievement of ${params.topic} in ${params.settingCulture}`,
        motion: "Protagonist standing proudly on the historical stage, smiling with profound dignity as the crowd erupts in applause"
      },
      {
        title: isSeries ? "Scene 6: သမိုင်းမော်ကွန်း ဆက်လက်ရှင်သန်ခြင်း (The Enduring Legacy Hook)" : "Scene 6: မော်ကွန်းဝင် အမွေအနှစ်နှင့် အဆုံးသတ် (Timeless Historical Legacy)",
        camera: "Monumental Low-Angle Pullback -> Majestic Memorial / Sunset Horizon",
        flowTransition: "Graceful ascending crane flow -> reveals the enduring monument and timeless legacy left behind",
        lighting: "Timeless golden twilight glow reflecting across historical landmarks",
        visualSummary: isSeries ?
          `Dramatic historical cliffhanger in ${params.settingCulture}, setting the stage for the next crucial turning point` :
          `Monumental cinematic portrait in ${params.settingCulture}, honoring the everlasting impact and sacrifice of ${params.topic}`,
        motion: isSeries ? "Slow dramatic push-in to historic document signing moment, fade to next chapter" : "Statue/monument bathed in timeless sunset light, generations honoring the legacy"
      },
      {
        title: "Scene 7: Bonus Historical Quote & Wisdom Teaser",
        camera: "Static archival macro framing on original signature / famous quote engraving",
        flowTransition: "Gentle archival dust dissolve -> golden engraved quote glows softly",
        lighting: "Soft warm museum gallery spotlight",
        visualSummary: `Famous historical quote and signature of ${params.topic} engraved in gold on ancient parchment`,
        motion: "Golden light slowly sweeping across the timeless wisdom words"
      },
      {
        title: "Scene 8: Final Monumental Golden Historical Title Card",
        camera: "Static centered typography with rich golden patina and drifting dust motes",
        flowTransition: "Archival sepia dissolve -> grand embossed gold metallic typography",
        lighting: "Majestic warm golden ambient backlighting",
        visualSummary: `Masterclass biographical documentary title card for ${params.topic} in ${params.artStyle} style`,
        motion: "Golden particles drifting gracefully across embossed historical typography"
      }
    ];
  }

  if (g.includes('horror') || g.includes('mystery')) {
    return [
      {
        title: isSeries ? "Scene 1: အမှောင်ရိပ်ထဲသို့ ဝင်ရောက်ခြင်း (Spooky World Setup)" : "Scene 1: လျှို့ဝှက်ဆန်းကြယ် နေရာသို့ ရောက်ရှိခြင်း (Eerie Establishing)",
        camera: "Slow Creeping Low-Angle Dolly In -> Dutch Angle Tilt",
        flowTransition: "Slow atmospheric tracking flow through swirling thick fog -> reveals ominous shadows",
        lighting: "Dim moonlight with flickering lantern glow and deep dark shadows",
        visualSummary: `Spine-chilling haunted atmosphere in ${params.settingCulture}, dark silhouettes cautiously exploring ${params.topic}`,
        motion: "Characters walking slowly with tense postures, holding dim lanterns, mist curling around their feet"
      },
      {
        title: "Scene 2: ကြောက်မက်ဖွယ်ရာ အရိပ်အယောင် (Creepy Discovery)",
        camera: "Over-the-shoulder POV -> Sudden Slow Zoom-In",
        flowTransition: "Smooth tracking flow pauses abruptly -> zooms into an unearthly eerie artifact",
        lighting: "Cold pale cyan backlight with harsh high-contrast rim shadows",
        visualSummary: `Characters discovering an ominous paranormal anomaly or ancient cursed relic related to ${params.topic} in ${params.settingCulture}`,
        motion: "Characters freezing in fear, eyes wide, breath visible in the cold air, pointing trembling fingers"
      },
      {
        title: "Scene 3: ရုတ်တရက် ထိတ်လန့်ဖွယ်ရာ ဖြစ်ရပ် (Terrifying Jump-Scare Climax)",
        camera: "Violent Snap Zoom -> Rapid Shaky Cam Dutch Tilt",
        flowTransition: "Kinetic shockwave whip-cut -> extreme snap zoom into terrifying paranormal manifestation",
        lighting: "Strobe lightning flash with terrifying harsh red undertones",
        visualSummary: `Terrifying ghostly apparition or monstrous manifestation bursting from the darkness in ${params.settingCulture} regarding ${params.topic}`,
        motion: "Characters recoiling violently in shock, dropping lanterns, sudden frantic movement"
      },
      {
        title: isSeries ? "Scene 4: အသည်းအသန် လွတ်မြောက်အောင် ပြေးရခြင်း (Frantic Escape)" : "Scene 4: အမှောင်ထဲက လိုက်လံခြောက်လှန့်မှု (The Pursuit)",
        camera: "Rapid First-Person Tracking Shot -> Fast Backward Dolly",
        flowTransition: "High-speed panicked momentum flow matching characters frantically fleeing through the dark",
        lighting: "Flickering erratic light beams cutting through pitch black darkness",
        visualSummary: `Frantic desperate escape through the dark corridors and trees of ${params.settingCulture}, shadowy entities pursuing`,
        motion: "Characters running desperately at full speed, stumbling, glancing back in pure terror"
      },
      {
        title: "Scene 5: လျှို့ဝှက်ဆန်းကြယ် အမှန်တရား (Dark Revelation)",
        camera: "Tight Close-Up on Wide Eyes -> Slow Pullback into Vast Darkness",
        flowTransition: "Decelerating eerie camera drift -> reveals the horrifying ancient truth",
        lighting: "Eerie supernatural green and violet ambient luminescence",
        visualSummary: `Characters breathless in a hidden chamber, uncovering the chilling secret of ${params.topic} in ${params.settingCulture}`,
        motion: "Heavy breathing, wide trembling eyes, realization dawning on their pale faces"
      },
      {
        title: isSeries ? "Scene 6: သည်းထိတ်ရင်ဖို အဆုံးသတ် (Nightmarish Cliffhanger)" : "Scene 6: အေးစက်သော ဇာတ်သိမ်း (Haunting Outro)",
        camera: "Extreme Wide Pullback into the Fog -> Sudden Quick Cut to Black",
        flowTransition: "Ascending slow-motion crane flow -> mist swallows the entire scene, sudden blackout",
        lighting: "Dark silhouettes against cold blood-moon horizon",
        visualSummary: isSeries ?
          `Terrifying cliffhanger in ${params.settingCulture}, glowing demonic eyes opening in the pitch-black mist` :
          `Haunting cinematic wide shot in ${params.settingCulture}, the lonely mist-covered land holding its dark secret`,
        motion: isSeries ? "Slow zoom into pitch black doorway, two glowing red eyes snap open, sudden cut to black" : "Heavy fog slowly blankets the ancient ground"
      },
      {
        title: "Scene 7: Bonus Spooky Whisper Teaser",
        camera: "Extreme Macro Close-Up on ancient talisman",
        flowTransition: "Post-credits eerie slow fade-in -> object subtly vibrates",
        lighting: "Dim ghostly blue aura",
        visualSummary: `Cursed object in ${params.settingCulture} pulsing with faint supernatural energy`,
        motion: "Ancient talisman gently sliding across the dusty floor on its own"
      },
      {
        title: "Scene 8: Final Dark Cinematic Title Card",
        camera: "Static centered typography with drifting smoke particles",
        flowTransition: "Fade from black -> glowing pale typography emerging from smoke",
        lighting: "Eerie backlighting with blood-crimson rim glow",
        visualSummary: `Atmospheric horror title card for ${params.topic} in ${params.artStyle} style`,
        motion: "Ghostly smoke drifting across cracked stone typography"
      }
    ];
  }

  if (g.includes('action') || g.includes('adventure')) {
    return [
      {
        title: isSeries ? "Scene 1: စွန့်စားခန်း မစ်ရှင် စတင်ခြင်း (Mission Briefing & Entrance)" : "Scene 1: သူရဲကောင်းတို့၏ ခရီးစဉ် (Heroic Entrance)",
        camera: "Epic Low-Angle Hero Tracking Shot -> Sweeping Crane Up",
        flowTransition: "Dynamic forward tracking flow -> hero steps into frame against epic vast horizon",
        lighting: "Blazing golden sunrise with sharp dramatic rim highlights",
        visualSummary: `Heroic characters gearing up and walking resolutely into ${params.settingCulture} exploring ${params.topic}`,
        motion: "Characters adjusting combat gear, stepping forward with bold confidence and sharp focus"
      },
      {
        title: "Scene 2: ရန်သူနှင့် ရင်ဆိုင်တွေ့ဆုံခြင်း (High-Stakes Standoff)",
        camera: "Intense Eye-Level Two-Shot -> Circular Orbit Pan",
        flowTransition: "Rapid 360-degree orbit flow around combatants locking eyes -> tension spikes",
        lighting: "High-contrast dynamic edge lighting with swirling dust particles",
        visualSummary: `Fierce confrontation between heroes and formidable rivals in ${params.settingCulture} regarding ${params.topic}`,
        motion: "Characters dropping into dynamic combat stances, drawing weapons/martial arts guard"
      },
      {
        title: "Scene 3: အပြင်းအထန် တိုက်ခိုက်ခန်း (Explosive Combat Climax)",
        camera: "Dynamic Speed-Ramping Action Cam -> Impact Shockwave Zoom",
        flowTransition: "High-impact kinetic flow -> bullet-time matrix freeze frame into explosive strike",
        lighting: "Vibrant kinetic sparks, explosive fiery orange glows and motion trails",
        visualSummary: `High-octane martial arts clash or explosive kinetic battle in ${params.settingCulture}`,
        motion: "High-flying kicks, acrobatics, weapon parries, debris flying through the air with speed-ramping"
      },
      {
        title: "Scene 4: အရှိန်အဟုန်ပြင်း လိုက်လံတိုက်ခိုက်မှု (High-Speed Pursuit)",
        camera: "Fast Lateral Drone Fly-Through -> Low-Slung Chase Cam",
        flowTransition: "Momentum tracking flow matching high-speed vehicles/running velocity",
        lighting: "Streaking environmental lights, high-speed motion blur",
        visualSummary: `Thrilling parkour rooftop chase or high-speed vehicle pursuit through ${params.settingCulture}`,
        motion: "Characters leaping over obstacles, sliding under barriers, high-speed kinetic velocity"
      },
      {
        title: "Scene 5: အဆုံးအဖြတ် အောင်ပွဲ (Decisive Victory / Prize Unlocked)",
        camera: "Epic Low-Angle Wide Pan -> Hero Landing Frame",
        flowTransition: "Decelerating heroic landing flow -> reveals the uncovered ancient treasure",
        lighting: "Radiant golden volumetric rays shining down through dust clouds",
        visualSummary: `Heroes overcoming the final obstacle and securing the legendary prize of ${params.topic} in ${params.settingCulture}`,
        motion: "Hero standing tall over defeated rivals, raising the legendary artifact triumphantly"
      },
      {
        title: isSeries ? "Scene 6: နောက်ထပ် မစ်ရှင်အသစ် စတင်ခြင်း (Epic Cliffhanger)" : "Scene 6: ခမ်းနားသော ဇာတ်သိမ်း (Grand Finale)",
        camera: "Grand Sweeping Helicopter Pullback -> Sunset Silhouette",
        flowTransition: "Ascending cinematic fly-away flow -> reveals massive unexplored kingdom on horizon",
        lighting: "Spectacular crimson and gold sunset sky with fiery clouds",
        visualSummary: isSeries ?
          `Dramatic cliffhanger in ${params.settingCulture}, an immense enemy armada appearing across the stormy sea` :
          `Masterpiece cinematic hero wide shot in ${params.settingCulture}, heroes riding towards the majestic sunset`,
        motion: isSeries ? "Camera pans up to reveal giant fortress in flames on the horizon" : "Heroes walking proudly into the golden sunset"
      },
      {
        title: "Scene 7: Bonus Action Teaser",
        camera: "Tight Close-Up on hero sharpening blade / reloading device",
        flowTransition: "Post-credits snap cut -> confident character smirk",
        lighting: "Moody neon rim light",
        visualSummary: `Hero preparing for the next epic mission in ${params.settingCulture}`,
        motion: "Hero looking up directly at camera with a determined smile"
      },
      {
        title: "Scene 8: Final Metallic Heroic Title Card",
        camera: "Dynamic zoom through flying sparks and embers",
        flowTransition: "Explosion of sparks -> heavy metallic 3D title slams into place",
        lighting: "Gleaming polished chrome and fiery gold reflections",
        visualSummary: `Blockbuster action title card for ${params.topic} in ${params.artStyle} style`,
        motion: "Embers drifting across bold metallic typography"
      }
    ];
  }

  if (g.includes('sci-fi') || g.includes('futuristic')) {
    return [
      {
        title: isSeries ? "Scene 1: အနာဂတ် ကမ္ဘာကြီးသို့ ဝင်ရောက်ခြင်း (Futuristic 2099 Setup)" : "Scene 1: အဆင့်မြင့် နည်းပညာမြို့တော် (Sci-Fi Establishing)",
        camera: "Panoramic Drone Dive through Flying Vehicles -> Smooth Lab Entrance",
        flowTransition: "Seamless vertical dive flow through holographic skyways -> pushes into high-tech lab",
        lighting: "Cyberpunk neon cyan and electric magenta glows with volumetric laser beams",
        visualSummary: `Futuristic cyberpunk cityscape 2099 in ${params.settingCulture}, flying cars and androids exploring ${params.topic}`,
        motion: "Hover-vehicles gliding smoothly across neon skyways, futuristic citizens interacting with holograms"
      },
      {
        title: "Scene 2: Hologram ချို့ယွင်းမှု & ရှာဖွေတွေ့ရှိခြင်း (AI Anomaly Discovery)",
        camera: "Close-up on glowing ocular scanner -> 3D Hologram Orbit",
        flowTransition: "Continuous digital camera orbit -> hologram expands into immersive 3D grid",
        lighting: "Bright luminous holographic blue reflections on faces",
        visualSummary: `Scientists and cyborg characters analyzing a critical AI quantum glitch regarding ${params.topic} in ${params.settingCulture}`,
        motion: "Characters swiping virtual floating holographic interfaces with precision gestures"
      },
      {
        title: "Scene 3: Quantum စွမ်းအင် ပေါက်ကွဲမှု (Power Surge & Breach)",
        camera: "Rapid Snap Zoom -> Orbital Matrix Dutch Tilt",
        flowTransition: "Kinetic electromagnetic warp flow -> reality distortions and neon shockwave",
        lighting: "Blinding electric blue and violet energy arc discharges",
        visualSummary: `Quantum reactor breach or cybernetic power surge erupting around ${params.topic} in ${params.settingCulture}`,
        motion: "Energy shield flickering violently, characters shielding their eyes from the radiant particle storm"
      },
      {
        title: "Scene 4: အရှိန်ပြင်း Hover-Bike လိုက်လံစွန့်စားခန်း (Cyber Chase)",
        camera: "High-Speed FPV Drone Tracking through Neon Canyons",
        flowTransition: "Anti-gravity flight momentum flow -> weaving between cyber skyscrapers",
        lighting: "Streaking neon light trails, lens flares from turbine thrusters",
        visualSummary: `High-speed anti-gravity hover-bike pursuit through towering cyberpunk corridors of ${params.settingCulture}`,
        motion: "Hover-bikes banking sharply around skyscraper corners with glowing neon jet trails"
      },
      {
        title: "Scene 5: Core စနစ်ကို ထိန်းချုပ်နိုင်ခြင်း (Cyber Breakthrough)",
        camera: "Smooth Decelerating Crane Shot -> Centered Quantum Core",
        flowTransition: "Digital particle convergence flow -> core stabilizes into pure crystal light",
        lighting: "Harmonious tranquil cyan luminescence, ambient particle drift",
        visualSummary: `Characters successfully calibrating the cyber core, unlocking the future of ${params.topic} in ${params.settingCulture}`,
        motion: "Characters breathing sigh of relief, glowing core pulsing serenely in their hands"
      },
      {
        title: isSeries ? "Scene 6: အာကာသ စူးစမ်းရေး Cliffhanger (Quantum Warp Ending)" : "Scene 6: အနာဂတ် မြို့တော် ဇာတ်သိမ်း (Breathtaking Sci-Fi Outro)",
        camera: "Epic Ascending Orbital Pullback into Starry Orbit",
        flowTransition: "Ascending space elevator tracking flow -> reveals Earth and cosmic starfields",
        lighting: "Stunning planet atmosphere glow with distant starlight and neon city grid below",
        visualSummary: isSeries ?
          `Dramatic cliffhanger in ${params.settingCulture}, a colossal alien mothership decloaking in the upper atmosphere` :
          `Breathtaking cinematic view of futuristic ${params.settingCulture}, gleaming gleaming harmoniously under starry sky`,
        motion: isSeries ? "Colossal shadowy spaceship uncloaks in orbital clouds" : "Drone view ascends gracefully into the shimmering cosmic sky"
      },
      {
        title: "Scene 7: Bonus Cyber AI Teaser",
        camera: "Macro on robotic AI eye",
        flowTransition: "Digital glitch scanline fade -> AI core reboots",
        lighting: "Blinking green status LEDs",
        visualSummary: `Compact AI companion robot blinking awake in ${params.settingCulture}`,
        motion: "Robot companion head tilts curiously and beeps cheerfully"
      },
      {
        title: "Scene 8: Final Holographic Cyber Title Card",
        camera: "Static centered holographic projection with subtle glitch artifacts",
        flowTransition: "Digital glitch rasterization -> sharp neon 3D typography",
        lighting: "Pulsing neon blue and violet holographic emission",
        visualSummary: `Sleek high-tech cyberpunk title card for ${params.topic} in ${params.artStyle} style`,
        motion: "Holographic grid scanlines sweeping across typography"
      }
    ];
  }

  if (g.includes('drama') || g.includes('emotional')) {
    return [
      {
        title: isSeries ? "Scene 1: လွမ်းမောဖွယ် အတိတ်အစ (Nostalgic Prologue)" : "Scene 1: ဇာတ်အိမ်နှင့် ခံစားချက် (Emotional Establishing)",
        camera: "Gentle Slow Pan across Atmospheric Landscape -> Eye-Level Character Framing",
        flowTransition: "Poetic slow-motion tracking flow -> settles quietly on reflective protagonist",
        lighting: "Warm golden hour sunset with soft melancholic lens flare",
        visualSummary: `Protagonist standing pensively in the peaceful setting of ${params.settingCulture}, reflecting on ${params.topic}`,
        motion: "Gentle breeze blowing through hair, quiet thoughtful gaze looking towards the distant horizon"
      },
      {
        title: "Scene 2: မေ့လျော့နေသော အမှတ်တရ (Bittersweet Memory Uncovered)",
        camera: "Close-Up on Hands holding keepsake -> Soft Rack Focus to Face",
        flowTransition: "Gentle rack focus flow -> transitions smoothly into an emotional memory artifact",
        lighting: "Soft warm window light with subtle dust motes floating in air",
        visualSummary: `Character finding an old heartfelt letter or cherished keepsake related to ${params.topic} in ${params.settingCulture}`,
        motion: "Hands gently unfolding a worn photograph/letter, a soft emotional smile touching their lips"
      },
      {
        title: "Scene 3: စိတ်ခံစားမှု အလှည့်အပြောင်း (Emotional Conflict & Turning Point)",
        camera: "Two-Shot Medium View -> Intimate Close-Up on Tearful Eyes",
        flowTransition: "Intimate slow push-in flow -> captures deep authentic facial micro-expressions",
        lighting: "Dramatic overcast cloudy sky or soft rainy window reflections",
        visualSummary: `Intense emotional dialogue and heartfelt confrontation in ${params.settingCulture} regarding ${params.topic}`,
        motion: "Characters sharing words from the bottom of their hearts, tears welling in eyes with deep sincerity"
      },
      {
        title: "Scene 4: မေတ္တာတရားဖြင့် ရှာဖွေပြေးလွှားခြင်း (The Journey of Reconciliation)",
        camera: "Lateral Slow-Motion Tracking Shot through Pouring Rain / Bustling Crowd",
        flowTransition: "Urgent flowing tracking motion -> protagonist running through the streets with determination",
        lighting: "Wet reflective streets, glistening rain droplets, soft city bokeh lights",
        visualSummary: `Protagonist rushing through ${params.settingCulture} with pure determination to apologize and reunite`,
        motion: "Running through the rain without hesitation, heart full of longing and regret"
      },
      {
        title: "Scene 5: ပြန်လည်ဆုံစည်းခြင်းနှင့် ခွင့်လွှတ်ခြင်း (Heartfelt Reunion)",
        camera: "Wide Medium Shot -> Tender Embracing Arc Shot",
        flowTransition: "Slow emotional 180-degree camera arc around the embracing characters",
        lighting: "Warm radiant sunlight breaking through the clouds after the rain",
        visualSummary: `Emotional reunion and loving forgiveness in ${params.settingCulture}, true happiness restored`,
        motion: "Characters running towards each other, embracing tightly with joyful tears and warm smiles"
      },
      {
        title: isSeries ? "Scene 6: မမျှော်လင့်သော လျှို့ဝှက်ချက် (Dramatic Cliffhanger)" : "Scene 6: အေးချမ်းသာယာသော ဇာတ်သိမ်း (Heartwarming Peace)",
        camera: "Slow Pullback into Warm Golden Sunset Sky",
        flowTransition: "Peaceful ascending crane flow -> reveals the loving family/friends together",
        lighting: "Golden twilight with beautiful warm bokeh circles",
        visualSummary: isSeries ?
          `Emotional cliffhanger in ${params.settingCulture}, a mysterious letter arriving on the doorstep` :
          `Heartwarming cinematic portrait in ${params.settingCulture}, characters laughing happily around the table`,
        motion: isSeries ? "Close-up on unopened mysterious letter with hands trembling" : "Characters walking side-by-side into a bright hopeful tomorrow"
      },
      {
        title: "Scene 7: Bonus Nostalgic Memory",
        camera: "Static framing on family photograph frame on wooden table",
        flowTransition: "Gentle fade-in -> sunlight touches the photo",
        lighting: "Soft morning sunlight",
        visualSummary: `Framed photograph of characters smiling happily together in ${params.settingCulture}`,
        motion: "Warm sunlight beam slowly illuminating the smiling faces in the photo"
      },
      {
        title: "Scene 8: Final Warm Cinematic Title Card",
        camera: "Static centered typography with gentle warm light bokeh",
        flowTransition: "Gentle dissolve from warm light -> elegant typography",
        lighting: "Warm amber and rose gold ambient glow",
        visualSummary: `Poetic emotional title card for ${params.topic} in ${params.artStyle} style`,
        motion: "Gentle bokeh light particles floating softly behind typography"
      }
    ];
  }

  if (g.includes('fantasy') || g.includes('magic')) {
    return [
      {
        title: isSeries ? "Scene 1: မှော်ကမ္ဘာသို့ ရောက်ရှိခြင်း (Enchanted World Setup)" : "Scene 1: မှော်ဆန်သော အခင်းအကျင်း (Mystical Establishing)",
        camera: "Sweeping Drone Orbit over Glowing Ancient Forest -> Smooth Push-In",
        flowTransition: "Whimsical drifting camera flow through glowing magical spores -> reveals magical realm",
        lighting: "Ethereal twilight with luminescent glowing flora, sparkling fireflies",
        visualSummary: `Enchanted magical wonderland in ${params.settingCulture}, glowing flora and mystical elements surrounding ${params.topic}`,
        motion: "Floating glowing butterflies, bioluminescent plants gently pulsing with soft pastel light"
      },
      {
        title: "Scene 2: မှော်ရတနာကို စတင်တွေ့ရှိခြင်း (Magical Talisman Discovery)",
        camera: "Slow Macro Orbit around Floating Relic -> Rack Focus to Astonished Eyes",
        flowTransition: "Smooth spiraling camera flow around levitating mystical artifact",
        lighting: "Golden and amethyst mystical radiance pulsing from the artifact",
        visualSummary: `Characters discovering an ancient floating spellbook or sacred magical talisman in ${params.settingCulture}`,
        motion: "Characters reaching out cautiously, artifact levitating gently above their palms"
      },
      {
        title: "Scene 3: မှော်အတတ် မန္တန်စတင်သုံးစွဲခြင်း (Dazzling Spellcasting Climax)",
        camera: "Dynamic Circular Arc Shot -> High Angle Radial Burst",
        flowTransition: "Swirling vortex flow -> explosive blooming particle transformation effect",
        lighting: "Brilliant radiant starlight, iridescent shimmering particle storms",
        visualSummary: `Characters casting a magnificent spell, transforming the surroundings of ${params.settingCulture} regarding ${params.topic}`,
        motion: "Swirling glowing runes around hands, magical beam soaring into the sky creating starry constellations"
      },
      {
        title: "Scene 4: ဒဏ္ဍာရီလာ သတ္တဝါနှင့် စွန့်စားခန်း (Mythical Beast Encounter)",
        camera: "Epic Wide Swooping Aerial Cam -> Side-by-Side Flight Track",
        flowTransition: "Soaring aerial flow matching the majestic flight of mythical creature",
        lighting: "Brilliant celestial aurora ribbons weaving across purple twilight sky",
        visualSummary: `Heroes soaring across sky on back of mythical dragon or majestic creature in ${params.settingCulture}`,
        motion: "Wings beating gracefully, wind rushing past characters laughing in pure awe"
      },
      {
        title: "Scene 5: မှော်ကမ္ဘာ၏ ငြိမ်းချမ်းရေး (Mystical Balance Restored)",
        camera: "Centered Golden Ratio Frame -> Slow Ascending Crane",
        flowTransition: "Blooming light flow -> withered nature bursts into vibrant blooming flowers",
        lighting: "Harmonious radiant rainbow aura, sparkling fairy dust descending",
        visualSummary: `The sacred magical realm of ${params.settingCulture} fully restored, blooming with vibrant life`,
        motion: "Trees blossoming instantly, gentle mythical creatures gathering peacefully"
      },
      {
        title: isSeries ? "Scene 6: မှော်တံခါးဝ အဆုံးသတ် (Portal Cliffhanger)" : "Scene 6: အံ့ဖွယ် ဒဏ္ဍာရီ ဇာတ်သိမ်း (Enchanting Finale)",
        camera: "Grand Sweeping Vista towards Aurora Sky",
        flowTransition: "Ascending celestial crane flow -> reveals endless mystical kingdom under aurora",
        lighting: "Shimmering aurora borealis reflecting across celestial lake",
        visualSummary: isSeries ?
          `Mysterious cliffhanger in ${params.settingCulture}, an ancient dark portal stirring in the sky` :
          `Masterpiece fairy tale ending shot in ${params.settingCulture}, characters looking at the breathtaking aurora`,
        motion: isSeries ? "Dark purple portal swirls ominously in the celestial clouds" : "Characters waving towards the starry aurora sky"
      },
      {
        title: "Scene 7: Bonus Fairy Sparkle Teaser",
        camera: "Macro on glowing enchanted acorn/crystal",
        flowTransition: "Sparkling magical dust dissolve -> crystal pulses with joy",
        lighting: "Warm pastel magical sparkles",
        visualSummary: `Tiny cheerful fairy winking at camera in ${params.settingCulture}`,
        motion: "Fairy twirling and dusting camera lens with sparkling gold dust"
      },
      {
        title: "Scene 8: Final Enchanted Magical Title Card",
        camera: "Slow drift through sparkling stardust and glowing runes",
        flowTransition: "Stardust vortex convergence -> shimmering gold crystalline typography",
        lighting: "Ethereal starlight luminescence with prismatic rainbow reflections",
        visualSummary: `Mythical fantasy title card for ${params.topic} in ${params.artStyle} style`,
        motion: "Glowing stardust particles drifting gracefully across typography"
      }
    ];
  }

  if (g.includes('motivational') || g.includes('storytelling')) {
    return [
      {
        title: isSeries ? "Scene 1: အိပ်မက်တစ်ခု စတင်မွေးဖွားခြင်း (The Dream & Humble Start)" : "Scene 1: ကြိုးစားအားထုတ်မှု၏ အစ (The Humble Beginning)",
        camera: "Cinematic Low-Angle Tracking -> Early Morning Sunrise Dolly",
        flowTransition: "Inspirational tracking flow -> protagonist beginning early morning labor with grit",
        lighting: "Crisp early dawn sunlight breaking through morning mist",
        visualSummary: `Determined protagonist working relentlessly in ${params.settingCulture}, taking the first step toward ${params.topic}`,
        motion: "Wiping sweat from brow, gripping tools with quiet resolve, focused determined expression"
      },
      {
        title: "Scene 2: ကြီးမားသော စိန်ခေါ်မှုနှင့် အခက်အခဲ (The Major Obstacle)",
        camera: "Over-the-Shoulder Medium Shot -> Low-Angle Struggle Framing",
        flowTransition: "Tense decelerating push-in -> confronts heavy financial or physical obstacle",
        lighting: "Harsh midday sun or stark dramatic shadows reflecting hardship",
        visualSummary: `Protagonist facing discouraging setback or difficult challenge in ${params.settingCulture} regarding ${params.topic}`,
        motion: "Protagonist standing firm despite exhausted posture, refusing to give up"
      },
      {
        title: "Scene 3: လက်မလျှော့သော ဇွဲလုံ့လ (The Turning Point & Inner Fire)",
        camera: "Fast Montage Tracking Shots -> Heroic Dynamic Close-Up",
        flowTransition: "Dynamic rhythmic montage flow -> rapid sequence of tireless practice and learning",
        lighting: "Late night oil lantern or warm dedicated desk light with amber glow",
        visualSummary: `Intense montage of tireless practice, studying, and persistence in ${params.settingCulture}`,
        motion: "Fierce focus in eyes, practicing skills repeatedly, overcoming failures with every attempt"
      },
      {
        title: "Scene 4: အောင်မြင်မှု လမ်းစ ပေါ်ပေါက်လာခြင်း (Breakthrough Moment)",
        camera: "Smooth Upward Crane Shot -> Protagonist Eye-Level Realization",
        flowTransition: "Elevating camera flow -> first successful breakthrough sparks wide smile",
        lighting: "Warm radiant golden hour sunlight illuminating the crafted masterpiece",
        visualSummary: `Protagonist achieving the first major breakthrough in ${params.settingCulture} regarding ${params.topic}`,
        motion: "Looking at finished creation with tears of joy, hands trembling with proud achievement"
      },
      {
        title: "Scene 5: ကြီးကျယ်သော အောင်ပွဲမှတ်တိုင် (Triumphant Success & Standing Ovation)",
        camera: "Vast Wide Arena/Community View -> Protagonist Center Stage",
        flowTransition: "Sweeping celebratory orbit flow -> entire community cheering and clapping",
        lighting: "Brilliant spotlights, joyful bright daylight, colorful celebration confetti",
        visualSummary: `Protagonist receiving recognition, awards, or community celebration in ${params.settingCulture}`,
        motion: "Humbly bowing with tears of gratitude, family and friends hugging and cheering"
      },
      {
        title: isSeries ? "Scene 6: ပိုမိုကြီးမားသော ပန်းတိုင် (The Next Horizon)" : "Scene 6: ဘဝသင်ခန်းစာနှင့် အမှတ်တရ ဇာတ်သိမ်း (Inspiring Legacy Outro)",
        camera: "Grand Wide Pullback into Boundless Horizon",
        flowTransition: "Majestic soaring crane flow -> protagonist standing tall looking at boundless opportunities",
        lighting: "Magnificent golden sunset sky with rays of inspiration",
        visualSummary: isSeries ?
          `Inspiring cliffhanger in ${params.settingCulture}, protagonist ready to conquer global stage` :
          `Inspiring cinematic ending in ${params.settingCulture}, protagonist mentoring smiling youngsters`,
        motion: isSeries ? "Protagonist taking first step toward a grand new journey" : "Protagonist smiling warmly, passing wisdom to younger generation"
      },
      {
        title: "Scene 7: Bonus Inspiring Quote Teaser",
        camera: "Direct to camera fourth-wall interaction",
        flowTransition: "Post-credits gentle fade-in -> confident friendly smile",
        lighting: "Warm soft studio portrait lighting",
        visualSummary: `Protagonist looking directly into camera with encouraging gesture in ${params.settingCulture}`,
        motion: "Protagonist smiling and giving a supportive thumbs up: 'Never give up on your dreams!'"
      },
      {
        title: "Scene 8: Final Inspiring Golden Title Card",
        camera: "Static centered typography with radiant golden lens rays",
        flowTransition: "Warm light burst -> elegant bold typography",
        lighting: "Gleaming pure gold and amber radiant light rays",
        visualSummary: `Inspiring cinematic title card for ${params.topic} in ${params.artStyle} style`,
        motion: "Golden light rays sweeping gently behind typography"
      }
    ];
  }

  // Default: Comedy (ဟာသ)
  return [
    {
      title: isSeries ? "Scene 1: စတင်မိတ်ဆက်ခြင်း (Series Pilot & World Setup)" : "Scene 1: ဇာတ်အိမ်တည်ခြင်း (Establishing & Entrance)",
      camera: "Wide Panoramic Drone Shot -> Smooth Dolly In",
      flowTransition: "Opening establishing tracking flow -> seamlessly pushes forward into the scene",
      lighting: "Cinematic golden hour sunlight with warm volumetric rays",
      visualSummary: `Main characters entering the lively environment of ${params.settingCulture} exploring ${params.topic}`,
      motion: "Characters walking into frame with expressive gestures and lively curiosity"
    },
    {
      title: "Scene 2: အဖြစ်အပျက် စတင်တွေ့ရှိခြင်း (Discovery & Suspense)",
      camera: "Medium Close-up -> Over-The-Shoulder Dynamic Angle",
      flowTransition: "Continuous spatial camera flow from scene 1 -> zooms in smoothly to subject reaction",
      lighting: "Dramatic high contrast rim lighting with subtle shadows",
      visualSummary: `Characters discovering an unexpected mystery or funny anomaly regarding ${params.topic} in ${params.settingCulture}`,
      motion: "Characters leaning forward cautiously, pointing with wide-eyed expressions"
    },
    {
      title: "Scene 3: ရုတ်တရက် အလှည့်အပြောင်း (The Twist & Climax Reaction)",
      camera: "Fast Zoom-in with exaggerated motion blur -> Low Angle Dutch Tilt",
      flowTransition: "Rapid kinetic whip-pan flow transition -> snap zoom into extreme surprise reaction",
      lighting: "Surprise flash lighting, vibrant kinetic glow",
      visualSummary: `Characters having a shocked and energetic hilarious reaction to the climax of ${params.topic} in ${params.settingCulture}`,
      motion: "Characters jumping back in dynamic shock, comical stumble and wild overreaction"
    },
    {
      title: isSeries ? "Scene 4: အရှိန်အဟုန်မြင့်တက်ခြင်း (Escalation)" : "Scene 4: လိုက်လံစွန့်စားခန်း (Action / Pursuit)",
      camera: "Fast lateral tracking side-scrolling action shot",
      flowTransition: "High-speed momentum flow matching character running trajectory",
      lighting: "Dynamic atmospheric light streaks with swirling dust particles",
      visualSummary: `Thrilling slapstick pursuit in ${params.settingCulture}, characters frantically running with high kinetic energy`,
      motion: "Continuous fast lateral running motion, characters looking back in panic while dodging rolling barrels"
    },
    {
      title: "Scene 5: လျှို့ဝှက်ချက် ပေါ်ပေါက်လာခြင်း (Revelation / Mystery)",
      camera: "Two-shot Medium View -> Relaxed eye-level framing",
      flowTransition: "Smooth decelerating camera flow -> centers on two characters uncovering the clue",
      lighting: "Soft warm ambient glow with atmospheric reflections",
      visualSummary: `Characters catching their breath and laughing at the ridiculous mess in ${params.settingCulture}`,
      motion: "Characters catching their breath, looking at each other in astonished hilarious realization"
    },
    {
      title: isSeries ? "Scene 6: ဇာတ်သိမ်းပိုင်း Cliffhanger (To Be Continued Hook)" : "Scene 6: အမှတ်တရ ဇာတ်သိမ်း (Memorable Outro)",
      camera: "Extreme Wide Pullback Shot -> Upward Crane Tilt into the Sunset Sky",
      flowTransition: "Dramatic ascending crane flow -> reveals wide breathtaking landscape horizon",
      lighting: "Vibrant twilight sunset glow with dramatic clouds on horizon",
      visualSummary: isSeries ? 
        `Dramatic cliffhanger ending in ${params.settingCulture}, mysterious shadowy portal appearing on the distant horizon` :
        `Masterpiece wide cinematic ending shot in ${params.settingCulture}, characters waving towards the sunset horizon happily`,
      motion: isSeries ? "Slow dramatic push-in to ominous horizon, sudden fast cut to black" : "Drone view rises gracefully as characters laugh and walk away into the sunset"
    },
    {
      title: "Scene 7: Bonus / Teaser Scene",
      camera: "Close-up direct to camera fourth-wall break",
      flowTransition: "Post-credits snap cut -> direct fourth wall interaction",
      lighting: "Warm friendly spotlight",
      visualSummary: `Humorous post-credits character gag in ${params.settingCulture}`,
      motion: "Character winking and giving a cheerful thumbs up directly at the viewer"
    },
    {
      title: "Scene 8: Final Title Card & Credits",
      camera: "Static centered graphic shot with gentle particle drift",
      flowTransition: "Fade to black -> glowing typographic title card drift",
      lighting: "Glowing neon backlit title",
      visualSummary: `Cinematic closing title card for ${params.topic} in ${params.artStyle} style`,
      motion: "Floating ambient light particles drifting across glowing typography"
    }
  ];
}

function generateOfflineScenes(params) {
  const sceneCount = params.duration.includes('30') ? 3 : params.duration.includes('1') ? 5 : 8;
  const ratioTag = params.aspectRatio.includes('9:16') ? '--ar 9:16' : params.aspectRatio.includes('1:1') ? '--ar 1:1' : params.aspectRatio.includes('21:9') ? '--ar 21:9' : '--ar 16:9';
  const stylePromptFragment = getStylePrompt(params.artStyle);
  const isSeries = params.videoFormat && params.videoFormat.includes('Series');
  const voice = params.voiceOverPersona || 'Male Movie Narrator';
  const flow = params.videoFlow || 'Seamless Continuous Motion Flow';
  const genre = params.genre || 'Comedy';

  const rawTemplates = getGenreSceneTemplates(genre, params, isSeries);

  const selectedScenes = rawTemplates.slice(0, sceneCount).map((s, idx) => {
    const dialogObj = getPersonaDialogueForScene(idx + 1, voice, params, isSeries);
    return {
      number: idx + 1,
      title: s.title,
      camera: s.camera,
      flowTransition: s.flowTransition,
      lighting: s.lighting,
      visualPrompt: formatPromptForAITool(params.targetAI, s, params, ratioTag, stylePromptFragment),
      dialogueMM: dialogObj.mm,
      dialogueEN: dialogObj.en,
      motion: s.motion
    };
  });

  return {
    ...params,
    title: params.topic,
    voiceOverPersona: voice,
    videoFlow: flow,
    targetAI: params.targetAI,
    summary: `${params.topic} (${params.videoFormat} - ${params.targetAI.split('(')[0].trim()})`,
    scenes: selectedScenes
  };
}

function getStylePrompt(style) {
  if (style.includes('Stick Man')) return "minimalist expressive stickman animation, bold dynamic comic ink lines, funny stick figure character, clean smooth vector art";
  if (style.includes('Pixar')) return "Disney Pixar 3D animated movie still, cute stylized proportions, subsurface scattering, octane render, raytraced lighting, 8k resolution";
  if (style.includes('Realistic')) return "Ultra-realistic 35mm film still, cinematic photography, Photorealistic 8k UHD, ARRI Alexa camera, shallow depth of field, anamorphic lens flare";
  if (style.includes('Anime')) return "Makoto Shinkai & Studio Ghibli inspired anime aesthetic, vivid painted background, crisp anime line art, dreamy atmospheric colors";
  if (style.includes('Cyberpunk')) return "Futuristic cyberpunk aesthetics, volumetric purple and cyan neon glows, high-tech reflections, 3D unreal engine 5";
  if (style.includes('Claymation')) return "Authentic Aardman style claymation, clay thumbprint textures, miniature stop-motion set lighting, tactile stop-frame feel";
  return "cinematic high production value, vibrant colors, masterclass lighting";
}

function renderAllTabs(data) {
  const voiceLabel = data.voiceOverPersona ? data.voiceOverPersona.split('(')[0].replace('🎙️', '').trim() : 'Narrator';
  const toolLabel = data.targetAI ? data.targetAI.split('(')[0].replace(/[🎬🎥✨🔮🚀⚡🎞️🖼️🌐🌊]/g, '').trim() : 'AI Video';
  const flowLabel = data.videoFlow ? data.videoFlow.split('(')[0].replace(/[🌊⚡🔄🎥✨🌌]/g, '').trim() : 'Seamless Flow';

  // 1. Render Scene Cards with Modern Glass Aesthetics
  const scenesContainer = document.getElementById('tabContent-scenes');
  scenesContainer.innerHTML = data.scenes.map((scene, idx) => `
    <div class="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-4 space-y-3 hover:border-indigo-500/50 transition-all shadow-md animate-fade-in relative overflow-hidden group">
      <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-70 group-hover:opacity-100 transition-opacity"></div>
      
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-md shadow-indigo-500/30">${scene.number || idx + 1}</span>
          <h4 class="text-xs font-bold text-slate-100 mm-text">${escapeHtml(scene.title)}</h4>
        </div>
        <button onclick="copySinglePrompt(${idx})" class="text-[11px] text-indigo-300 hover:text-white px-2.5 py-1 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 flex items-center gap-1.5 transition-all shadow-sm cursor-pointer">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
          <span>Copy Prompt</span>
        </button>
      </div>

      <!-- Video Prompt tailored for target AI -->
      <div class="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-[11px] text-slate-200 font-mono select-all leading-relaxed whitespace-pre-wrap shadow-inner">
        <div class="text-[10px] text-indigo-400 font-sans font-bold uppercase tracking-wider mb-2 flex items-center justify-between">
          <span class="flex items-center gap-1.5">
            <span>🎯</span>
            <span>${toolLabel} Prompt (${flowLabel}):</span>
          </span>
          <span class="text-[9px] px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono font-bold">${data.aspectRatio ? data.aspectRatio.split('(')[0].trim() : '16:9'}</span>
        </div>
        ${escapeHtml(scene.visualPrompt)}
      </div>

      <!-- Flow & Camera & Lighting Info -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
        <div class="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex items-start gap-1.5">
          <span class="text-cyan-400 font-semibold shrink-0">🌊 Flow:</span>
          <span class="text-slate-300 truncate">${escapeHtml(scene.flowTransition || flowLabel)}</span>
        </div>
        <div class="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex items-start gap-1.5">
          <span class="text-indigo-400 font-semibold shrink-0">🎥 Camera:</span>
          <span class="text-slate-300 truncate">${escapeHtml(scene.camera)}</span>
        </div>
        <div class="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex items-start gap-1.5">
          <span class="text-pink-400 font-semibold shrink-0">💡 Light:</span>
          <span class="text-slate-300 truncate">${escapeHtml(scene.lighting)}</span>
        </div>
      </div>

      <!-- Dialogue / Voiceover Box (Myanmar Natural Flow) -->
      <div class="bg-slate-950/60 p-3.5 rounded-xl border border-emerald-950/70 text-[11px] space-y-2 mm-text">
        <div class="flex items-center justify-between">
          <span class="text-emerald-400 font-semibold flex items-center gap-1.5">
            <span>🎙️</span>
            <span>Voiceover (${voiceLabel}):</span>
          </span>
          <button onclick="speakDialogue(${idx})" class="text-[10px] text-amber-300 hover:text-amber-200 px-2.5 py-1 rounded-lg bg-amber-950/70 hover:bg-amber-900 border border-amber-800/60 flex items-center gap-1.5 transition-all shadow-sm cursor-pointer" title="Click to hear audio preview">
            <span>🔊</span>
            <span>Voice Preview (နားဆင်မည်)</span>
          </button>
        </div>
        <p class="text-slate-100 leading-relaxed font-medium text-xs bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">${escapeHtml(scene.dialogueMM)}</p>
        <p class="text-slate-400 italic text-[10px] font-sans pl-1">${escapeHtml(scene.dialogueEN)}</p>
        <div class="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5 mt-1 font-mono">
          <span class="text-emerald-300 flex items-center gap-1">
            <span>✨ Tone Persona:</span>
            <span class="font-bold text-slate-200">${escapeHtml(voiceLabel)}</span>
          </span>
          <span class="text-indigo-400">Tone Match: 100% Synchronized</span>
        </div>
      </div>
    </div>
  `).join('');

  // 2. Render Full Production Script
  let fullScriptText = `========================================================\n`;
  fullScriptText += `📹 AI VIDEO PRODUCTION SCRIPT & PROMPT MASTERPLAN\n`;
  fullScriptText += `========================================================\n`;
  fullScriptText += `Title: ${data.title || data.topic}\n`;
  fullScriptText += `Target Video AI: ${data.targetAI}\n`;
  fullScriptText += `Cinematic Flow: ${data.videoFlow || 'Seamless Motion Flow'}\n`;
  fullScriptText += `Format: ${data.videoFormat || 'Single Episode'}\n`;
  fullScriptText += `Voice Over: ${data.voiceOverPersona || 'Male Movie Narrator'}\n`;
  fullScriptText += `Language: ${data.language || 'Myanmar'}\n`;
  fullScriptText += `Art Style: ${data.artStyle}\n`;
  fullScriptText += `Genre: ${data.genre}\n`;
  fullScriptText += `Setting Culture: ${data.settingCulture}\n`;
  fullScriptText += `Duration: ${data.duration} | Ratio: ${data.aspectRatio}\n`;
  if (data.characters && data.characters.length > 0) {
    fullScriptText += `Characters:\n`;
    data.characters.forEach((c, idx) => {
      fullScriptText += `  • [Character ${idx + 1}] ${c.name} (${c.role || 'Main Role'}) - ${c.appearance || ''}${c.costume ? ', ' + c.costume : ''}\n`;
    });
  } else if (data.customCharName) {
    fullScriptText += `Protagonist: ${data.customCharName} (${data.customCharRole || 'Main Role'})\n`;
  }
  if (data.summary) fullScriptText += `Synopsis: ${data.summary}\n`;
  fullScriptText += `\n--------------------------------------------------------\n`;
  fullScriptText += `SCENE BREAKDOWN & PRODUCTION PROMPTS:\n`;
  fullScriptText += `--------------------------------------------------------\n\n`;

  data.scenes.forEach((s, idx) => {
    fullScriptText += `[SCENE ${s.number || idx + 1}] ${s.title}\n`;
    fullScriptText += `Transition Flow: ${s.flowTransition || flowLabel}\n`;
    fullScriptText += `Camera Movement: ${s.camera}\n`;
    fullScriptText += `Lighting & Mood: ${s.lighting}\n`;
    fullScriptText += `\n>> AI Video Prompt (${toolLabel}):\n${s.visualPrompt}\n\n`;
    fullScriptText += `>> Myanmar Dialogue / Voiceover (${voiceLabel}):\n${s.dialogueMM}\n\n`;
    fullScriptText += `>> English Subtitle / Voiceover:\n${s.dialogueEN}\n`;
    fullScriptText += `\n--------------------------------------------------------\n\n`;
  });

  document.getElementById('fullScriptBox').textContent = fullScriptText;

  // 3. Render Raw AI Prompts matching Sample Video structure
  const totalSecs = data.scenes.length * 7;
  const targetSecs = data.duration.includes('30') ? 30 : data.duration.includes('1') ? 60 : data.duration.includes('5') ? 300 : data.duration.includes('10') ? 600 : data.duration.includes('15') ? 900 : 180;
  const percent = Math.min(100, Math.round((totalSecs / targetSecs) * 100));

  const charNames = (data.characters && data.characters.length > 0)
    ? data.characters.map(c => c.name).join(', ')
    : data.customCharName || "Main Character";

  let rawText = `// --------------------------------------------------------\n`;
  rawText += `// Total Generated Duration: ${totalSecs}s / ${targetSecs}s (${percent}%)\n`;
  rawText += `// Target AI: ${data.targetAI} | Aspect Ratio: ${data.aspectRatio}\n`;
  rawText += `// --------------------------------------------------------\n\n`;

  rawText += `# **Thumbnail Prompt**\n`;
  rawText += `A master cinematic ${data.artStyle} cover thumbnail, featuring ${charNames} in ${data.settingCulture}, vibrant expressive lighting, dynamic composition, title overlay space, 8k resolution ${data.aspectRatio.includes('9:16') ? '--ar 9:16' : '--ar 16:9'}\n\n`;

  rawText += `# **Character Sheet Prompts**\n`;
  if (data.characters && data.characters.length > 0) {
    data.characters.forEach((c, i) => {
      rawText += `${i + 1}. ${c.name}: ${c.role}, ${c.appearance || 'expressive face'}, wearing ${c.costume || 'signature outfit'}, consistent character sheet in ${data.artStyle} style.\n`;
    });
  } else {
    rawText += `1. ${charNames}: Expressive ${data.artStyle} character model sheet, multi-angle turnaround, front, side, and 3/4 views on solid clean background.\n`;
  }
  rawText += `\n`;

  rawText += `# **ဇာတ်ကွက်များ (Scene-by-Scene)**\n\n`;

  data.scenes.forEach((s, idx) => {
    const sceneNum = s.number || idx + 1;
    rawText += `### **Scene ${sceneNum} (Duration: ${s.duration || '6s'})**\n`;
    rawText += `**ပါဝင်သောဇာတ်ကောင်များ:** ${charNames}\n`;
    rawText += `**Image Prompt:** ${s.visualPrompt.split('\n')[0] || s.visualPrompt}\n`;
    rawText += `**Video Motion Prompt:** ${s.motion || s.visualPrompt}\n`;
    rawText += `**Audio:** ${s.dialogueMM || s.scriptVoiceover || 'Ambient sound effects and atmospheric background'}\n\n`;
  });

  document.getElementById('rawPromptsBox').textContent = rawText;
  switchTab(state.activeTab || 'raw');
}

let currentAudioPlayer = null;
let audioWidgetTimer = null;

function showAudioWidget(title, subtitle, icon = '🎙️') {
  const widget = document.getElementById('audioPlayerWidget');
  if (!widget) return;
  
  const titleEl = document.getElementById('audioPlayerTitle');
  const subEl = document.getElementById('audioPlayerSubtitle');
  const iconEl = document.getElementById('audioPlayerIcon');

  if (titleEl) titleEl.textContent = title;
  if (subEl) subEl.textContent = subtitle;
  if (iconEl) iconEl.textContent = icon;
  
  widget.classList.remove('hidden', 'translate-y-32', 'opacity-0');
  widget.classList.add('translate-y-0', 'opacity-100');
}

function hideAudioWidget() {
  const widget = document.getElementById('audioPlayerWidget');
  if (!widget) return;
  widget.classList.add('hidden', 'translate-y-32', 'opacity-0');
  widget.classList.remove('translate-y-0', 'opacity-100');
}

function stopVoiceAudio() {
  if (currentAudioPlayer) {
    try {
      currentAudioPlayer.pause();
      currentAudioPlayer.currentTime = 0;
    } catch (e) {}
    currentAudioPlayer = null;
  }
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
  if (audioWidgetTimer) {
    clearTimeout(audioWidgetTimer);
    audioWidgetTimer = null;
  }
  hideAudioWidget();
}

function getAudioModulationForPersona(persona) {
  const p = (persona || '').toLowerCase();
  
  if (p.includes('male movie') || p.includes('deep')) {
    return {
      playbackRate: 0.78, // Physical pitch drop -> Deep Masculine Baritone
      isMale: true,
      pitch: 0.55,
      rate: 0.88,
      desc: 'Deep Male Movie Narrator'
    };
  }
  if (p.includes('village uncle')) {
    return {
      playbackRate: 0.82, // Older rustic uncle pitch shift
      isMale: true,
      pitch: 0.70,
      rate: 1.02,
      desc: 'Myanmar Village Uncle'
    };
  }
  if (p.includes('mystery') || p.includes('horror') || p.includes('whisper')) {
    return {
      playbackRate: 0.74, // Low, suspenseful whispering pitch shift
      isMale: true,
      pitch: 0.50,
      rate: 0.78,
      desc: 'Suspenseful Mystery Whisper'
    };
  }
  if (p.includes('energetic') || p.includes('tiktok') || p.includes('host')) {
    return {
      playbackRate: 0.88, // Fast dynamic male host pitch shift
      isMale: true,
      pitch: 0.82,
      rate: 1.20,
      desc: 'Energetic TikTok Host'
    };
  }
  if (p.includes('news') || p.includes('broadcaster')) {
    return {
      playbackRate: 0.84, // Authoritative anchorman pitch shift
      isMale: true,
      pitch: 0.75,
      rate: 0.95,
      desc: 'Professional News Broadcaster'
    };
  }
  if (p.includes('cartoon') || p.includes('kid')) {
    return {
      playbackRate: 1.38, // High-pitched cute cartoon kid
      isMale: false,
      pitch: 1.60,
      rate: 1.12,
      desc: 'Cute Cartoon Kid'
    };
  }
  if (p.includes('village auntie')) {
    return {
      playbackRate: 1.16, // High lively village auntie pitch
      isMale: false,
      pitch: 1.35,
      rate: 1.15,
      desc: 'Myanmar Village Auntie'
    };
  }
  if (p.includes('female sweet') || p.includes('storyteller')) {
    return {
      playbackRate: 1.04, // Sweet melodic female storyteller
      isMale: false,
      pitch: 1.20,
      rate: 0.95,
      desc: 'Female Sweet Storyteller'
    };
  }
  if (p.includes('calm') || p.includes('documentary')) {
    return {
      playbackRate: 0.86, // Calm, smooth documentary voice
      isMale: true,
      pitch: 0.80,
      rate: 0.86,
      desc: 'Calm Documentary Narrator'
    };
  }

  return {
    playbackRate: 0.82,
    isMale: true,
    pitch: 0.75,
    rate: 0.95,
    desc: 'Narrator'
  };
}

function playVoiceAudio(textMyanmar, textEnglish, persona, lang, label) {
  // Guard: Never play audio if auth gateway / login modal is visible or if unauthenticated or for Super Admin
  const authModal = document.getElementById('authGatewayModal');
  if (authModal && !authModal.classList.contains('hidden')) {
    stopVoiceAudio();
    return;
  }
  if (state.isLoggedIn && state.user.role === 'superadmin') {
    stopVoiceAudio();
    return;
  }
  if (!state.isLoggedIn && sessionStorage.getItem('guest_trial_active') !== 'true') {
    stopVoiceAudio();
    return;
  }

  stopVoiceAudio();

  const isEnglish = (lang || '').toLowerCase().includes('english') || (lang || '').toLowerCase().includes('silent');
  const targetText = isEnglish ? (textEnglish || textMyanmar) : (textMyanmar || textEnglish);
  const personaClean = (persona || '').split('(')[0].replace('🎙️', '').trim() || 'Narrator';
  const targetLang = isEnglish ? 'en' : 'my';
  const mod = getAudioModulationForPersona(persona);

  showAudioWidget(
    `🎙️ ${personaClean} (${mod.isMale ? 'Male Voice' : 'Female Voice'})`,
    targetText
  );

  // Strategy 1: HTML5 Audio Stream from Cloud TTS with Physical Real-Time Pitch & Speed Modulation
  const encodedText = encodeURIComponent(targetText.slice(0, 150));
  const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${targetLang}&client=tw-ob&q=${encodedText}`;
  
  const audio = new Audio(ttsUrl);
  audio.preservesPitch = false;
  audio.playbackRate = mod.playbackRate;
  currentAudioPlayer = audio;

  audio.onplay = () => {
    showToast(`🔊 ${personaClean} (${mod.isMale ? 'ယောက်ျားလေးသံ' : 'မိန်းကလေးသံ'}) အသံ ဖွင့်ပြနေပါသည်...`);
  };

  audio.onended = () => {
    currentAudioPlayer = null;
    hideAudioWidget();
  };

  audio.onerror = () => {
    fallbackSpeechSynthesis(targetText, textEnglish, persona, lang, personaClean);
  };

  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.catch((err) => {
      console.warn("Audio element play error, falling back to speech synthesis:", err);
      fallbackSpeechSynthesis(targetText, textEnglish, persona, lang, personaClean);
    });
  }

  // Safety timer to close widget after max 15 seconds
  audioWidgetTimer = setTimeout(() => {
    hideAudioWidget();
  }, 15000);
}

function fallbackSpeechSynthesis(textMyanmar, textEnglish, persona, lang, personaClean) {
  if (!('speechSynthesis' in window)) {
    playToneFallback();
    showToast("Browser တွင် Speech Engine မရှိသဖြင့် Sound Preview ဖွင့်ပြပါသည်");
    return;
  }

  try {
    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();

    const isEnglish = (lang || '').toLowerCase().includes('english');
    const utterance = new SpeechSynthesisUtterance();
    const mod = getAudioModulationForPersona(persona);
    
    const voices = window.speechSynthesis.getVoices() || [];
    const myVoice = voices.find(v => v.lang.startsWith('my'));

    if (!isEnglish && myVoice) {
      utterance.voice = myVoice;
      utterance.lang = 'my-MM';
      utterance.text = textMyanmar;
    } else {
      if (mod.isMale) {
        // Choose genuine Male Voice Actor
        const maleVoice = voices.find(v => (v.name.includes('David') || v.name.includes('Mark') || v.name.includes('Male') || v.name.includes('Guy') || v.name.includes('Stefan') || v.name.includes('George') || v.name.includes('James')) && v.lang.startsWith('en')) ||
                          voices.find(v => !v.name.includes('Zira') && !v.name.includes('Jenny') && !v.name.includes('Female')) ||
                          voices[0];
        if (maleVoice) utterance.voice = maleVoice;
      } else {
        // Choose genuine Female Voice Actor
        const femaleVoice = voices.find(v => (v.name.includes('Zira') || v.name.includes('Jenny') || v.name.includes('Female') || v.name.includes('Girl') || v.name.includes('Hazel')) && v.lang.startsWith('en')) ||
                            voices.find(v => v.name.includes('Female') || v.name.includes('Zira')) ||
                            voices[0];
        if (femaleVoice) utterance.voice = femaleVoice;
      }
      utterance.lang = 'en-US';
      utterance.text = textEnglish || textMyanmar;
    }

    utterance.pitch = mod.pitch;
    utterance.rate = mod.rate;

    utterance.onend = () => {
      hideAudioWidget();
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis error:", e);
      playToneFallback();
      hideAudioWidget();
    };

    window.speechSynthesis.speak(utterance);
    showToast(`🔊 ${personaClean} (${mod.isMale ? 'ယောက်ျားလေးသံ' : 'မိန်းကလေးသံ'}) ဖွင့်ပြနေပါသည်...`);
  } catch (err) {
    playToneFallback();
    hideAudioWidget();
  }
}

function playToneFallback() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.setValueAtTime(520, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.4);
  } catch (e) {}
}

function speakDialogue(idx) {
  if (!state.currentData || !state.currentData.scenes[idx]) return;
  const scene = state.currentData.scenes[idx];
  const lang = state.currentData.language || 'Myanmar';
  const persona = state.currentData.voiceOverPersona || 'Male Movie Narrator';

  playVoiceAudio(
    scene.dialogueMM || scene.dialogueEN,
    scene.dialogueEN || scene.dialogueMM,
    persona,
    lang,
    `Scene ${idx + 1}`
  );
}

function previewSelectedVoice(showToastMsg = true) {
  const voiceSelect = document.getElementById('voiceOverPersona');
  const langSelect = document.getElementById('language');
  if (!voiceSelect) return;

  const persona = voiceSelect.value;
  const lang = langSelect ? langSelect.value : 'Myanmar';

  const voiceSampleLines = {
    'Male Movie': {
      my: "ဤနေရာသည် လျှို့ဝှက်ဆန်းကြယ်မှုများ ပြည့်နှက်နေသော ကမ္ဘာသစ်တစ်ခု ဖြစ်ပါသည်...",
      en: "In a world shrouded in mystery, an epic destiny begins to unfold..."
    },
    'Female Sweet': {
      my: "မင်္ဂလာပါရှင်... ဒီနေ့တော့ အရမ်းချိုသာ နွေးထွေးတဲ့ ပုံပြင်လေးတစ်ပုဒ်ကို ပြောပြပေးမယ်နော်...",
      en: "Hello everyone! Today I will share a heartwarming and lovely story with you..."
    },
    'Energetic': {
      my: "ဟယ်လို သူငယ်ချင်းတို့ရေ! အားလုံးပဲ အသင့်ဖြစ်ကြပြီလားဗျို့! စိတ်လှုပ်ရှားစရာ အစီအစဉ် စတင်ပါပြီ!",
      en: "Hey what's up everyone! Are you ready for today's most thrilling adventure!"
    },
    'Village Uncle': {
      my: "ဟေ့လူတွေ... ကြည့်ကြစမ်းပါဦးဗျို့! ဒီနေ့တော့ ရွာထဲမှာ အကြီးအကျယ် တစ်ခုခု ကြုံရတော့မယ်ဟေ့!",
      en: "Hey villagers! Come look at this! Something unbelievable is happening right now!"
    },
    'Village Auntie': {
      my: "အလိုလေးတော်... ကြည့်စမ်းပါဦးရှင်! ဟိုအိမ်က ကောင်လေးတွေ ဘာတွေများ လျှောက်လုပ်နေကြပြန်ပြီလဲမသိဘူး!",
      en: "Oh my goodness gracious! What in the world are those naughty boys doing over there!"
    },
    'Mystery': {
      my: "တိတ်တိတ်နေပါ... အမှောင်ရိပ်ထဲကနေ တစ်စုံတစ်ခုက ငါတို့ကို စောင့်ကြည့်နေတယ်...",
      en: "Shh... Listen carefully... Something ancient is watching us from the shadows..."
    },
    'Calm Documentary': {
      my: "သဘာဝတရား၏ အလှတရားသည် ကျွန်ုပ်တို့အား အမြဲတမ်း ငြိမ်းချမ်းအေးမြမှုကို ပေးစွမ်းလျက် ရှိပါသည်...",
      en: "Nature in its purest form reveals a quiet tranquility beyond human imagination..."
    },
    'Cartoon': {
      my: "ဝါး... အရမ်းပျော်ဖို့ ကောင်းတာပဲ ဟီးဟီး! ငါတို့နဲ့အတူ လာကစားကြမယ်လေ!",
      en: "Yay! This is super duper exciting! Come join us and let's play together!"
    },
    'News': {
      my: "ယနေ့ညနေခင်း ထူးခြားသော သတင်းထူးများနှင့် သတင်းစုံများကို စတင်တင်ဆက်ပေးပါတော့မည် ခင်ဗျာ...",
      en: "Good evening. We bring you tonight's breaking report from across the world..."
    }
  };

  let myanmarSample = "မင်္ဂလာပါ... AI Video Voice Over အစမ်းနားဆင်ခြင်း ဖြစ်ပါသည်။";
  let englishSample = "Hello! This is an AI Video Voice Over preview test.";

  for (const [key, lines] of Object.entries(voiceSampleLines)) {
    if (persona.includes(key)) {
      myanmarSample = lines.my;
      englishSample = lines.en;
      break;
    }
  }

  const previewBtn = document.getElementById('voicePreviewBtn');
  if (previewBtn) {
    previewBtn.classList.add('ring-2', 'ring-emerald-400', 'scale-105');
    setTimeout(() => previewBtn.classList.remove('ring-2', 'ring-emerald-400', 'scale-105'), 3000);
  }

  playVoiceAudio(myanmarSample, englishSample, persona, lang, 'Voice Preview');
}

let fullVoiceoverIndex = 0;
let isPlayingFullVoiceover = false;

function playFullStoryVoiceover() {
  if (!state.currentData || !state.currentData.scenes || state.currentData.scenes.length === 0) {
    showToast("ဦးစွာ AI Video Prompts များကို Generate ပြုလုပ်ပေးပါခင်ဗျာ");
    return;
  }

  stopVoiceAudio();
  isPlayingFullVoiceover = true;
  fullVoiceoverIndex = 0;

  const btn = document.getElementById('playFullVoiceBtn');
  if (btn) {
    btn.innerHTML = `<span>⏹️</span><span>Stop Voiceover (ရပ်မည်)</span>`;
    btn.onclick = stopFullStoryVoiceover;
    btn.classList.remove('bg-emerald-600', 'hover:bg-emerald-500');
    btn.classList.add('bg-rose-600', 'hover:bg-rose-500');
  }

  playNextSceneInFullStory();
}

function stopFullStoryVoiceover() {
  isPlayingFullVoiceover = false;
  fullVoiceoverIndex = 0;
  stopVoiceAudio();

  const btn = document.getElementById('playFullVoiceBtn');
  if (btn) {
    btn.innerHTML = `<span class="animate-pulse">🎧</span><span>Play Full Voiceover (တစ်ခုလုံးနားဆင်မည်)</span>`;
    btn.onclick = playFullStoryVoiceover;
    btn.classList.remove('bg-rose-600', 'hover:bg-rose-500');
    btn.classList.add('bg-emerald-600', 'hover:bg-emerald-500');
  }
}

function playNextSceneInFullStory() {
  if (!isPlayingFullVoiceover || !state.currentData || fullVoiceoverIndex >= state.currentData.scenes.length) {
    stopFullStoryVoiceover();
    showToast("🎉 ဇာတ်လမ်းတစ်ခုလုံး အသံသွင်းဟန် ဖွင့်ပြမှု ပြီးဆုံးပါပြီ!");
    return;
  }

  const scene = state.currentData.scenes[fullVoiceoverIndex];
  const total = state.currentData.scenes.length;
  const lang = state.currentData.language || 'Myanmar';
  const persona = state.currentData.voiceOverPersona || 'Male Movie Narrator';
  const isEnglish = lang.toLowerCase().includes('english');
  const targetText = isEnglish ? (scene.dialogueEN || scene.dialogueMM) : (scene.dialogueMM || scene.dialogueEN);
  const personaClean = persona.split('(')[0].replace('🎙️', '').trim();
  const mod = getAudioModulationForPersona(persona);

  showAudioWidget(
    `🎧 Scene ${fullVoiceoverIndex + 1}/${total} (${personaClean} - ${mod.isMale ? 'Male' : 'Female'})`,
    targetText,
    '🎬'
  );

  const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${isEnglish ? 'en' : 'my'}&client=tw-ob&q=${encodeURIComponent(targetText.slice(0, 150))}`;
  const audio = new Audio(ttsUrl);
  audio.preservesPitch = false;
  audio.playbackRate = mod.playbackRate;
  currentAudioPlayer = audio;

  audio.onended = () => {
    fullVoiceoverIndex++;
    setTimeout(() => {
      if (isPlayingFullVoiceover) playNextSceneInFullStory();
    }, 800);
  };

  audio.onerror = () => {
    playFullStorySpeechSynthesisFallback(targetText, scene.dialogueEN, persona, lang, total);
  };

  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.catch((err) => {
      playFullStorySpeechSynthesisFallback(targetText, scene.dialogueEN, persona, lang, total);
    });
  }
}

function playFullStorySpeechSynthesisFallback(textMyanmar, textEnglish, persona, lang, total) {
  if (!('speechSynthesis' in window)) {
    fullVoiceoverIndex++;
    if (isPlayingFullVoiceover) playNextSceneInFullStory();
    return;
  }

  try {
    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();

    const isEnglish = (lang || '').toLowerCase().includes('english');
    const utterance = new SpeechSynthesisUtterance();
    const mod = getAudioModulationForPersona(persona);
    const voices = window.speechSynthesis.getVoices() || [];
    const myVoice = voices.find(v => v.lang.startsWith('my'));

    if (!isEnglish && myVoice) {
      utterance.voice = myVoice;
      utterance.lang = 'my-MM';
      utterance.text = textMyanmar;
    } else {
      if (mod.isMale) {
        const maleVoice = voices.find(v => (v.name.includes('David') || v.name.includes('Mark') || v.name.includes('Male') || v.name.includes('Guy') || v.name.includes('Stefan') || v.name.includes('George') || v.name.includes('James')) && v.lang.startsWith('en')) ||
                          voices.find(v => !v.name.includes('Zira') && !v.name.includes('Jenny') && !v.name.includes('Female')) ||
                          voices[0];
        if (maleVoice) utterance.voice = maleVoice;
      } else {
        const femaleVoice = voices.find(v => (v.name.includes('Zira') || v.name.includes('Jenny') || v.name.includes('Female') || v.name.includes('Girl') || v.name.includes('Hazel')) && v.lang.startsWith('en')) ||
                            voices.find(v => v.name.includes('Female') || v.name.includes('Zira')) ||
                            voices[0];
        if (femaleVoice) utterance.voice = femaleVoice;
      }
      utterance.lang = 'en-US';
      utterance.text = textEnglish || textMyanmar;
    }

    utterance.pitch = mod.pitch;
    utterance.rate = mod.rate;

    utterance.onend = () => {
      fullVoiceoverIndex++;
      setTimeout(() => {
        if (isPlayingFullVoiceover) playNextSceneInFullStory();
      }, 600);
    };

    utterance.onerror = () => {
      fullVoiceoverIndex++;
      if (isPlayingFullVoiceover) playNextSceneInFullStory();
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    fullVoiceoverIndex++;
    if (isPlayingFullVoiceover) playNextSceneInFullStory();
  }
}

function switchTab(tab) {
  state.activeTab = tab;
  const tabs = ['raw', 'scenes', 'full'];
  
  tabs.forEach(t => {
    const btn = document.getElementById(`tabBtn-${t}`);
    const content = document.getElementById(`tabContent-${t}`);
    if (!btn || !content) return;

    if (t === tab) {
      btn.className = "px-3 py-1.5 rounded-lg font-bold bg-indigo-600 text-white shadow-md flex items-center gap-1.5 transition-all cursor-pointer";
      content.classList.remove('hidden');
      if (t === 'full' || t === 'raw') {
        content.classList.add('flex', 'flex-col');
      }
    } else {
      btn.className = "px-3 py-1.5 rounded-lg font-semibold text-slate-400 hover:text-slate-200 transition-all cursor-pointer flex items-center gap-1.5";
      content.classList.add('hidden');
      if (t === 'full' || t === 'raw') {
        content.classList.remove('flex', 'flex-col');
      }
    }
  });

  const recText = document.getElementById('tabRecommendationText');
  if (recText) {
    if (tab === 'raw') {
      recText.innerHTML = `AI Tools (Kling, Sora, Runway, Hailuo, Google Flow) များတွင် <strong>Video တိုက်ရိုက်ထုတ်ယူရန်</strong> အောက်ပါ Visual Prompts များကို အဆင်သင့် ကူးယူနိုင်ပါသည်! (⭐ Recommended)`;
    } else if (tab === 'scenes') {
      recText.innerHTML = `အခန်းတစ်ခုချင်းစီ (Scene 1, 2, 3...) အလိုက် <strong>Camera Flow, Lighting, Prompts နှင့် Voice Preview အသံစမ်းနားထောင်မှုများ</strong> ဖြစ်ပါသည်။`;
    } else if (tab === 'full') {
      recText.innerHTML = `ဇာတ်လမ်းတစ်ပုဒ်လုံး၏ <strong>မြန်မာ/အင်္ဂလိပ် စကားပြောဇာတ်ညွှန်း အပြည့်အစုံ</strong>ဖြစ်ပြီး Voiceover အသံသွင်းရန် အသုံးပြုနိုင်ပါသည်။`;
    }
  }
}

function copySinglePrompt(idx) {
  if (!state.currentData || !state.currentData.scenes[idx]) return;
  const text = state.currentData.scenes[idx].visualPrompt;
  navigator.clipboard.writeText(text).then(() => {
    showToast(`Scene ${idx + 1} Video Prompt ကူးယူပြီးပါပြီ!`);
  });
}

function copyCurrentOutput() {
  let textToCopy = "";
  let label = "Prompts";
  if (state.activeTab === 'raw') {
    textToCopy = document.getElementById('rawPromptsBox').textContent;
    label = "Video Prompts အားလုံး (Recommended)";
  } else if (state.activeTab === 'scenes') {
    textToCopy = document.getElementById('rawPromptsBox').textContent;
    label = "Scene Prompts အားလုံး";
  } else {
    textToCopy = document.getElementById('fullScriptBox').textContent;
    label = "Full Script ဇာတ်ညွှန်း အပြည့်အစုံ";
  }
  navigator.clipboard.writeText(textToCopy).then(() => {
    showToast(`${label} ကို Clipboard ထဲသို့ ကူးယူပြီးပါပြီ! ✨`);
  });
}

function downloadAsText() {
  if (!state.currentData) return;
  const text = document.getElementById('fullScriptBox').textContent;
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `AI_Video_Script_${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("Script ဖိုင် (.txt) အဖြစ် Download လုပ်ပြီးပါပြီ!");
}

function downloadAsJson() {
  if (!state.currentData) return;
  const blob = new Blob([JSON.stringify(state.currentData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `AI_Video_Project_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("Project Data ဖိုင် (.json) အဖြစ် Download လုပ်ပြီးပါပြီ!");
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  toastMsg.textContent = msg;
  toast.classList.remove('translate-y-20', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');
  setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0');
    toast.classList.remove('translate-y-0', 'opacity-100');
  }, 2500);
}

function escapeHtml(string) {
  if (!string) return '';
  return String(string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
