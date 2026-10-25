'use strict';
/* ------------------------------------------------------------------
   SUPABASE CLIENT – loaded from CDN
   ------------------------------------------------------------------ */
// Replace the placeholder values with the ones you copied from the Supabase UI.
const SUPABASE_URL = "https://supabase.com/dashboard/project/vcejagdoozytgczgrngp/settings/api-keys/legacy";   // ← paste URL
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjZWphZ2Rvb3p5dGdjemdybmdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5MjIyMjksImV4cCI6MjEwODQ5ODIyOX0.lLDxjIgx_fvp3yURbj6ip8kX3y0K4CqtPAA4wlAWYn8";           // ← paste key

// Load the Supabase JavaScript SDK lazily (only once per page load).
if (!window.supabase) {
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js";
  script.onload = initSupabase;   // When the SDK finishes loading, initialise the client.
  document.head.appendChild(script);
} else {
  // SDK already on the page (e.g., after a hot‑reload). Initialise immediately.
  initSupabase();
}

// This variable will hold the Supabase client once `initSupabase` runs.
let supabase = null;

/* ------------------------------------------------------------------
   Initialise Supabase + start realtime listening
   ------------------------------------------------------------------ */
function initSupabase() {
  supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  // Pull any existing orders that may already be in the DB.
  loadOrdersFromDB();
  // Subscribe to INSERT/UPDATE/DELETE events for live sync.
  subscribeToOrders();
}

const TRANSLATIONS = {
  en: {
    shop_sub: "College Print Hub",
    role_student: "Student View",
    role_staff: "Shop Staff",
    order_token_label: "Your Order Token",
    step_received: "Received",
    step_printing: "Printing",
    step_ready: "Ready",
    step_completed: "Picked Up",
    step_cancelled: "Cancelled",
    detail_student: "Student",
    detail_specs: "Job Specs",
    detail_amount: "Total Amount",
    detail_payment: "Payment",
    pay_counter: "Pay at Counter",
    pay_upi: "Paid via UPI",
    upi_title: "Pay with UPI QR Code",
    upi_sub: "Scan using Google Pay, PhonePe, or Paytm",
    upi_pay_to: "Pay to UPI ID:",
    btn_mark_paid: "I Have Paid via UPI",
    btn_cancel_order: "Cancel Order",
    btn_another_order: "+ Place Another Order",
    form_title: "Place a Print Order",
    form_sub: "Fast, hassle-free campus printing. Get your token & skip the crowd.",
    label_name: "Your Name",
    name_placeholder: "e.g., Shaswat Mishra",
    label_pages: "Total Pages",
    label_copies: "Copies (Sets)",
    label_color: "Print Colour Mode",
    mode_bw: "Black & White",
    mode_color: "Colour",
    label_sides: "Paper Sides",
    side_double: "Double-sided",
    side_double_note: "Saves paper (standard)",
    side_single: "Single-sided",
    side_single_note: "One side only",
    label_binding: "Binding Option",
    bind_none: "No Binding",
    bind_free: "Free",
    bind_staple: "Stapling",
    bind_spiral: "Spiral Binding",
    est_total_label: "Estimated Total Price",
    btn_submit_order: "Place Print Order & Get Token",
    lookup_title: "Have a Token Already?",
    lookup_sub: "Enter your order token to view live status on this phone.",
    lookup_placeholder: "e.g. CQ-101",
    btn_track: "Track",
    staff_title: "Print Queue Management",
    staff_sub: "Live orders in queue. Click buttons on any card to update stages or cancel.",
    btn_rates_settings: "Rates & UPI Settings",
    btn_reset_demo: "Reset Demo Orders",
    col_received: "Received",
    col_printing: "Printing",
    col_ready: "Ready for Pickup",
    col_completed: "Completed",
    modal_title: "Shop Rates & UPI Configuration",
    setting_name: "Print Shop Name",
    setting_upi: "Shopkeeper UPI ID",
    setting_upi_hint: "Used to dynamically generate students' payment QR code.",
    setting_bw: "B&W Rate (₹ / page)",
    setting_color: "Colour Rate (₹ / page)",
    setting_staple: "Stapling Fee (₹ / set)",
    setting_spiral: "Spiral Fee (₹ / set)",
    btn_cancel: "Cancel",
    btn_save_rates: "Save Rates",
    toast_order_placed: "Order Placed! Token: ",
    toast_payment_confirmed: "Payment confirmed! Marked as Paid via UPI.",
    toast_order_cancelled: "Order was cancelled.",
    toast_rates_saved: "Shop rates and UPI settings saved!",
    toast_demo_reset: "Demo orders reset successfully!",
    queue_next: "You're next! The shop will start printing shortly.",
    queue_printing_msg: "Your document is currently printing on the machine!",
    queue_ready_msg: "Your prints are ready! Please proceed to the counter for pickup.",
    order_cancelled_msg: "This order has been cancelled.",
    btn_start_printing: "Start Printing →",
    btn_mark_ready: "Mark Ready →",
    btn_complete_pickup: "Complete Pick-up ✓",
    btn_back: "← Back",
    btn_reopen: "← Reopen",
    no_orders_in: "No orders in "
  },
  hi: {
    shop_sub: "कॉलेज प्रिंट हब",
    role_student: "छात्र दृश्य (Student)",
    role_staff: "दुकानदार (Staff)",
    order_token_label: "आपका ऑर्डर टोकन",
    step_received: "प्राप्त हुआ",
    step_printing: "प्रिंटिंग जारी",
    step_ready: "तैयार है",
    step_completed: "प्राप्त किया",
    step_cancelled: "रद्द किया गया",
    detail_student: "छात्र",
    detail_specs: "विवरण",
    detail_amount: "कुल राशि",
    detail_payment: "भुगतान",
    pay_counter: "काउंटर पर नकद दें",
    pay_upi: "UPI द्वारा भुगतान संपन्न",
    upi_title: "UPI QR कोड से भुगतान करें",
    upi_sub: "Google Pay, PhonePe, या Paytm से स्कैन करें",
    upi_pay_to: "UPI आईडी:",
    btn_mark_paid: "मैंने UPI से भुगतान कर दिया",
    btn_cancel_order: "ऑर्डर रद्द करें",
    btn_another_order: "+ नया ऑर्डर दें",
    form_title: "प्रिंट ऑर्डर दें",
    form_sub: "आसान और तेज़ कॉलेज प्रिंटिंग। टोकन लें और कतार से बचें।",
    label_name: "आपका नाम",
    name_placeholder: "उदा. शाश्वत मिश्रा",
    label_pages: "कुल पृष्ठ (Pages)",
    label_copies: "प्रतियां (Copies)",
    label_color: "प्रिंट रंग मोड",
    mode_bw: "श्वेत-श्याम (B&W)",
    mode_color: "रंगीन (Colour)",
    label_sides: "कागज़ के पहलू",
    side_double: "दोनों तरफ (Double)",
    side_double_note: "कागज़ की बचत",
    side_single: "एक तरफ (Single)",
    side_single_note: "केवल एक तरफ",
    label_binding: "बाइंडिंग विकल्प",
    bind_none: "कोई बाइंडिंग नहीं",
    bind_free: "मुफ़्त",
    bind_staple: "स्टेपलिंग",
    bind_spiral: "स्पाइरल बाइंडिंग",
    est_total_label: "अनुमानित कुल मूल्य",
    btn_submit_order: "ऑर्डर दें और टोकन पाएं",
    lookup_title: "क्या आपके पास पहले से टोकन है?",
    lookup_sub: "अपने ऑर्डर की स्थिति देखने के लिए टोकन दर्ज करें।",
    lookup_placeholder: "उदा. CQ-101",
    btn_track: "ट्रैक करें",
    staff_title: "प्रिंट कतार प्रबंधन",
    staff_sub: "कतार में सक्रिय ऑर्डर। चरण बदलने या रद्द करने के लिए बटन दबाएं।",
    btn_rates_settings: "दरें और UPI सेटिंग्स",
    btn_reset_demo: "डेमो रीसेट करें",
    col_received: "प्राप्त (Received)",
    col_printing: "प्रिंटिंग (Printing)",
    col_ready: "तैयार (Ready)",
    col_completed: "पूर्ण (Completed)",
    modal_title: "दुकान दरें और UPI विन्यास",
    setting_name: "दुकान का नाम",
    setting_upi: "दुकानदार UPI आईडी",
    setting_upi_hint: "छात्रों के QR कोड के लिए उपयोग किया जाता है।",
    setting_bw: "B&W दर (₹ / पेज)",
    setting_color: "रंगीन दर (₹ / पेज)",
    setting_staple: "स्टेपलिंग शुल्क (₹ / प्रति)",
    setting_spiral: "स्पाइरल शुल्क (₹ / प्रति)",
    btn_cancel: "रद्द करें",
    btn_save_rates: "दरें सहेजें",
    toast_order_placed: "ऑर्डर दर्ज! टोकन: ",
    toast_payment_confirmed: "भुगतान की पुष्टि हुई! UPI चिह्नित किया गया।",
    toast_order_cancelled: "ऑर्डर रद्द कर दिया गया।",
    toast_rates_saved: "दुकान की दरें और UPI विवरण सहेज लिए गए!",
    toast_demo_reset: "डेमो डेटा रीसेट हो गया!",
    queue_next: "अगला नंबर आपका है! प्रिंटिंग जल्द शुरू होगी।",
    queue_printing_msg: "आपका दस्तावेज़ अभी मशीन पर प्रिंट हो रहा है!",
    queue_ready_msg: "आपके प्रिंट तैयार हैं! कृपया काउंटर से प्राप्त करें।",
    order_cancelled_msg: "यह ऑर्डर रद्द कर दिया गया है।",
    btn_start_printing: "प्रिंट शुरू करें →",
    btn_mark_ready: "तैयार चिह्नित करें →",
    btn_complete_pickup: "पूरा हुआ ✓",
    btn_back: "← वापस",
    btn_reopen: "← पुनः खोलें",
    no_orders_in: "कोई ऑर्डर नहीं है: "
  },
  mr: {
    shop_sub: "कॉलेज प्रिंट हब",
    role_student: "विद्यार्थी दृश्य",
    role_staff: "दुकानदार दृश्य",
    order_token_label: "तुमचा ऑर्डर टोकन",
    step_received: "मिळाले",
    step_printing: "प्रिंटिंग सुरू",
    step_ready: "तयार आहे",
    step_completed: "नेले आहे",
    step_cancelled: "रद्द केले",
    detail_student: "विद्यार्थी",
    detail_specs: "तपशील",
    detail_amount: "एकूण रक्कम",
    detail_payment: "पेमेंट",
    pay_counter: "काउंटरवर रोख द्या",
    pay_upi: "UPI द्वारे भरले",
    upi_title: "UPI QR कोडने पैसे भरा",
    upi_sub: "Google Pay, PhonePe किंवा Paytm ने स्कॅन करा",
    upi_pay_to: "UPI आयडी:",
    btn_mark_paid: "मी UPI द्वारे पैसे भरले आहेत",
    btn_cancel_order: "ऑर्डर रद्द करा",
    btn_another_order: "+ नवीन ऑर्डर द्या",
    form_title: "प्रिंट ऑर्डर द्या",
    form_sub: "जलद आणि सोपी कॉलेज प्रिंटिंग. टोकन घ्या आणि गर्दी टाळा.",
    label_name: "तुमचे नाव",
    name_placeholder: "उदा. शाश्वत मिश्रा",
    label_pages: "एकूण पृष्ठे (Pages)",
    label_copies: "प्रती (Copies)",
    label_color: "प्रिंट रंग प्रकार",
    mode_bw: "कृष्ण-धवल (B&W)",
    mode_color: "रंगीत (Colour)",
    label_sides: "कागदाच्या बाजू",
    side_double: "दोन्ही बाजू (Double)",
    side_double_note: "कागद बचत (मानक)",
    side_single: "एका बाजूला (Single)",
    side_single_note: "फक्त एक बाजू",
    label_binding: "बाइंडिंग पर्याय",
    bind_none: "बाइंडिंग नाही",
    bind_free: "मोफत",
    bind_staple: "स्टेपलिंग",
    bind_spiral: "स्पायरल बाइंडिंग",
    est_total_label: "अंदाजे एकूण किंमत",
    btn_submit_order: "ऑर्डर द्या आणि टोकन मिळवा",
    lookup_title: "तुमच्याकडे आधीच टोकन आहे का?",
    lookup_sub: "ऑर्डरची सद्यस्थिती तपासण्यासाठी टोकन नंबर टाका.",
    lookup_placeholder: "उदा. CQ-101",
    btn_track: "ट्रॅक करा",
    staff_title: "प्रिंट रांग व्यवस्थापन",
    staff_sub: "सक्रिय ऑर्डर्सची रांग. स्थिती बदलण्यासाठी किंवा रद्द करण्यासाठी बटणावर क्लिक करा.",
    btn_rates_settings: "दर आणि UPI सेटिंग्ज",
    btn_reset_demo: "डेमो रीसेट करा",
    col_received: "मिळालेले (Received)",
    col_printing: "प्रिंटिंग (Printing)",
    col_ready: "तयार (Ready)",
    col_completed: "पूर्ण (Completed)",
    modal_title: "दुकान दर आणि UPI व्यवस्थापन",
    setting_name: "दुकानाचे नाव",
    setting_upi: "दुकानदार UPI आयडी",
    setting_upi_hint: "विद्यार्थ्यांच्या QR कोडसाठी वापरले जाते.",
    setting_bw: "B&W दर (₹ / पान)",
    setting_color: "रंगीत दर (₹ / पान)",
    setting_staple: "स्टेपलिंग दर (₹ / सेट)",
    setting_spiral: "स्पायरल दर (₹ / सेट)",
    btn_cancel: "रद्द करा",
    btn_save_rates: "दर सेव्ह करा",
    toast_order_placed: "ऑर्डर दिली! टोकन: ",
    toast_payment_confirmed: "पेमेंट निश्चित झाले! UPI द्वारे भरले.",
    toast_order_cancelled: "ऑर्डर रद्द करण्यात आली.",
    toast_rates_saved: "दर आणि UPI माहिती सेव्ह झाली!",
    toast_demo_reset: "डेमो ऑर्डर्स रीसेट झाल्या!",
    queue_next: "पुढचा नंबर तुमचा आहे! प्रिंटिंग लवकरच सुरू होईल.",
    queue_printing_msg: "तुमचे कागदपत्र सध्या मशीनवर प्रिंट होत आहे!",
    queue_ready_msg: "तुमचे प्रिंट तयार आहे! कृपया काउंटरवरून घेऊन जा.",
    order_cancelled_msg: "हा ऑर्डर रद्द करण्यात आला आहे.",
    btn_start_printing: "प्रिंट सुरू करा →",
    btn_mark_ready: "तयार मार्क करा →",
    btn_complete_pickup: "पूर्ण झाले ✓",
    btn_back: "← मागे",
    btn_reopen: "← पुन्हा उघडा",
    no_orders_in: "यात ऑर्डर्स नाहीत: "
  },
  gu: {
    shop_sub: "કોલેજ પ્રિન્ટ હબ",
    role_student: "વિદ્યાર્થી દૃશ્ય",
    role_staff: "દુકાનદાર દૃશ્ય",
    order_token_label: "તમારો ઓર્ડર ટોકન",
    step_received: "મળ્યો",
    step_printing: "પ્રિન્ટિંગ ચાલુ",
    step_ready: "તૈયાર છે",
    step_completed: "લઈ લીધું",
    step_cancelled: "રદ કરેલ",
    detail_student: "વિદ્યાર્થી",
    detail_specs: "વિગત",
    detail_amount: "કુલ રકમ",
    detail_payment: "ચૂકવણી",
    pay_counter: "કાઉન્ટર પર રોકડા આપો",
    pay_upi: "UPI દ્વારા ચૂકવેલ",
    upi_title: "UPI QR કોડથી ચૂકવો",
    upi_sub: "Google Pay, PhonePe અથવા Paytm થી સ્કેન કરો",
    upi_pay_to: "UPI આઈડી:",
    btn_mark_paid: "મેં UPI થી ચૂકવણી કરી દીધી",
    btn_cancel_order: "ઓર્ડર રદ કરો",
    btn_another_order: "+ નવો ઓર્ડર આપો",
    form_title: "પ્રિન્ટ ઓર્ડર આપો",
    form_sub: "ઝડપી અને સરળ કોલેજ પ્રિન્ટિંગ. ટોકન મેળવો અને લાઇનથી બચો.",
    label_name: "તમારું નામ",
    name_placeholder: "દા.ત., શાશ્વત મિશ્રા",
    label_pages: "કુલ પાના (Pages)",
    label_copies: "નકલો (Copies)",
    label_color: "પ્રિન્ટ રંગ મોડ",
    mode_bw: "બ્લેક એન્ડ વ્હાઇટ",
    mode_color: "રંગીન (Colour)",
    label_sides: "કાગળની બાજુઓ",
    side_double: "બંને બાજુ (Double)",
    side_double_note: "કાગળ બચાવો",
    side_single: "એક બાજુ (Single)",
    side_single_note: "માત્ર એક બાજુ",
    label_binding: "બાઇન્ડિંગ વિકલ્પ",
    bind_none: "બાઇન્ડિંગ વિના",
    bind_free: "મફત",
    bind_staple: "સ્ટેપલિંગ",
    bind_spiral: "સ્પાઇરલ બાઇન્ડિંગ",
    est_total_label: "અંદાજિત કુલ કિંમત",
    btn_submit_order: "ઓર્ડર આપો અને ટોકન મેળવો",
    lookup_title: "શું તમારી પાસે પહેલેથી ટોકન છે?",
    lookup_sub: "ઓર્ડર સ્ટેટસ જોવા માટે ટોકન નંબર દાખલ કરો.",
    lookup_placeholder: "દા.ત. CQ-101",
    btn_track: "ટ્રેક કરો",
    staff_title: "પ્રિન્ટ કતાર વ્યવસ્થાપન",
    staff_sub: "કતારમાં સક્રિય ઓર્ડર. સ્થિતિ બદલવા અથવા રદ કરવા માટે બટન દબાવો.",
    btn_rates_settings: "ભાવ અને UPI સેટિંગ્સ",
    btn_reset_demo: "ડેમો રીસેટ કરો",
    col_received: "મળેલ (Received)",
    col_printing: "પ્રિન્ટિંગ (Printing)",
    col_ready: "તૈયાર (Ready)",
    col_completed: "પૂર્ણ (Completed)",
    modal_title: "દુકાન ભાવ અને UPI સેટિંગ્સ",
    setting_name: "દુકાનનું નામ",
    setting_upi: "દુકાનદાર UPI આઈડી",
    setting_upi_hint: "વિદ્યાર્થીઓના QR કોડ માટે વપરાય છે.",
    setting_bw: "B&W ભાવ (₹ / પાનું)",
    setting_color: "રંગીન ભાવ (₹ / પાનું)",
    setting_staple: "સ્ટેપલિંગ ફી (₹ / સેટ)",
    setting_spiral: "સ્પાઇરલ ફી (₹ / સેટ)",
    btn_cancel: "રદ કરો",
    btn_save_rates: "ભાવ સાચવો",
    toast_order_placed: "ઓર્ડર અપાયો! ટોકન: ",
    toast_payment_confirmed: "ચૂકવણીની ખાતરી થઈ! UPI નોંધાયું.",
    toast_order_cancelled: "ઓર્ડર રદ કરવામાં આવ્યો.",
    toast_rates_saved: "દુકાનના ભાવ અને UPI વિગતો સાચવાઈ!",
    toast_demo_reset: "ડેમો ડેટા રીસેટ થઈ ગયો!",
    queue_next: "આગળનો વારો તમારો છે! પ્રિન્ટિંગ ટૂંક સમયમાં શરૂ થશે.",
    queue_printing_msg: "તમારો દસ્તાવેજ અત્યારે મશીન પર પ્રિન્ટ થઈ રહ્યો છે!",
    queue_ready_msg: "તમારી પ્રિન્ટ તૈયાર છે! કૃપા કરીને કાઉન્ટર પરથી લઈ જાઓ.",
    order_cancelled_msg: "આ ઓર્ડર રદ કરવામાં આવ્યો છે.",
    btn_start_printing: "પ્રિન્ટ શરૂ કરો →",
    btn_mark_ready: "તૈયાર ચિહ્નિત કરો →",
    btn_complete_pickup: "પૂર્ણ થયું ✓",
    btn_back: "← પાછળ",
    btn_reopen: "← ફરી ખોલો",
    no_orders_in: "કોઈ ઓર્ડર નથી: "
  }
};

const I18n = {
  currentLang: localStorage.getItem('campusqueue_lang') || 'en',

  t(key) {
    const langDict = TRANSLATIONS[this.currentLang] || TRANSLATIONS.en;
    return langDict[key] || TRANSLATIONS.en[key] || key;
  },

  setLanguage(lang) {
    if (!TRANSLATIONS[lang]) lang = 'en';
    this.currentLang = lang;
    localStorage.setItem('campusqueue_lang', lang);
    this.applyToDOM();
    window.dispatchEvent(new CustomEvent('campusqueue:lang_changed', { detail: lang }));
  },

  applyToDOM() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = this.t(key);
      if (text) el.textContent = text;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const text = this.t(key);
      if (text) el.setAttribute('placeholder', text);
    });

    const langSelect = document.getElementById('langSelect');
    if (langSelect) langSelect.value = this.currentLang;
  }
};

const Theme = {
  currentTheme: localStorage.getItem('campusqueue_theme') || 'light',

  init() {
    this.apply(this.currentTheme);
  },

  toggle() {
    const nextTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.apply(nextTheme);
  },

  apply(theme) {
    this.currentTheme = theme;
    localStorage.setItem('campusqueue_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);

    const sunIcon = document.getElementById('themeIconSun');
    const moonIcon = document.getElementById('themeIconMoon');
    if (sunIcon && moonIcon) {
      if (theme === 'dark') {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
      } else {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
      }
    }
  }
};

const DEFAULT_SETTINGS = {
  shopName: "Campus Print Hub",
  upiId: "campusprints@upi",
  bwRate: 2.0,
  colorRate: 10.0,
  stapleRate: 5.0,
  spiralRate: 30.0
};

const SettingsService = {
  STORAGE_KEY: 'campusqueue_settings',

  getSettings() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error(e);
    }
    this.saveSettings(DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  },

  saveSettings(newSettings) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newSettings));
      window.dispatchEvent(new CustomEvent('campusqueue:settings_changed', { detail: newSettings }));
    } catch (e) {
      console.error(e);
    }
  }
};

const OrderService = {
  STORAGE_KEY_ORDERS: 'campusqueue_orders',
  STORAGE_KEY_TOKEN_SEQ: 'campusqueue_token_seq',
  ACTIVE_TOKEN_KEY: 'campusqueue_active_token',

  getOrders() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY_ORDERS);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  saveOrders(orders) {
    try {
      localStorage.setItem(this.STORAGE_KEY_ORDERS, JSON.stringify(orders));
      window.dispatchEvent(new CustomEvent('campusqueue:orders_changed', { detail: orders }));
    } catch (e) {
      console.error(e);
    }
  },

  getNextToken() {
    let seq = parseInt(localStorage.getItem(this.STORAGE_KEY_TOKEN_SEQ) || '100', 10);
    seq += 1;
    localStorage.setItem(this.STORAGE_KEY_TOKEN_SEQ, seq.toString());
    return `#CQ-${seq}`;
  },

  createOrder(orderData) {
    const orders = this.getOrders();
    const token = this.getNextToken();

    const newOrder = {
      id: 'ord_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      token: token,
      studentName: orderData.studentName.trim(),
      pages: parseInt(orderData.pages, 10),
      copies: parseInt(orderData.copies, 10),
      colorMode: orderData.colorMode,
      sides: orderData.sides,
      binding: orderData.binding,
      totalPrice: Number(orderData.totalPrice),
      paymentStatus: 'unpaid',
      status: 'received',
      createdAt: new Date().toISOString()
    };

    orders.push(newOrder);
    this.saveOrders(orders);
    this.setActiveToken(token);
    return newOrder;
  },

  getOrderById(orderId) {
    const orders = this.getOrders();
    return orders.find(o => o.id === orderId) || null;
  },

  getOrderByToken(tokenStr) {
    if (!tokenStr) return null;
    const cleanToken = tokenStr.trim().toUpperCase().replace(/^#/, '');
    const orders = this.getOrders();
    return orders.find(o => o.token.toUpperCase().replace(/^#/, '') === cleanToken) || null;
  },

  updateOrderStatus(orderId, newStatus) {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index !== -1) {
      orders[index].status = newStatus;
      orders[index].updatedAt = new Date().toISOString();
      this.saveOrders(orders);
      return orders[index];
    }
    return null;
  },

  updatePaymentStatus(orderId, paymentStatus) {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index !== -1) {
      orders[index].paymentStatus = paymentStatus;
      this.saveOrders(orders);
      return orders[index];
    }
    return null;
  },

  cancelOrder(orderId) {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index !== -1) {
      orders[index].status = 'cancelled';
      orders[index].updatedAt = new Date().toISOString();
      this.saveOrders(orders);
      return orders[index];
    }
    return null;
  },

  deleteOrder(orderId) {
    const orders = this.getOrders().filter(o => o.id !== orderId);
    this.saveOrders(orders);
  },

  getQueuePosition(token) {
    const orders = this.getOrders();
    const targetOrder = this.getOrderByToken(token);
    if (!targetOrder || targetOrder.status === 'completed' || targetOrder.status === 'cancelled') {
      return 0;
    }

    const activeOrders = orders.filter(o =>
      (o.status === 'received' || o.status === 'printing') &&
      new Date(o.createdAt) < new Date(targetOrder.createdAt)
    );

    return activeOrders.length;
  },

  getActiveToken() {
    return localStorage.getItem(this.ACTIVE_TOKEN_KEY) || null;
  },

  setActiveToken(token) {
    if (token) {
      localStorage.setItem(this.ACTIVE_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(this.ACTIVE_TOKEN_KEY);
    }
  },

  seedDemoData(force = false) {
    const currentOrders = this.getOrders();
    if (!force && currentOrders.length > 0) return;

    const now = Date.now();
    const demoOrders = [
      {
        id: 'ord_demo_1',
        token: '#CQ-101',
        studentName: 'Aarav Sharma',
        pages: 18,
        copies: 1,
        colorMode: 'bw',
        sides: 'double',
        binding: 'staple',
        totalPrice: 41,
        paymentStatus: 'paid',
        status: 'printing',
        createdAt: new Date(now - 1000 * 60 * 18).toISOString()
      },
      {
        id: 'ord_demo_2',
        token: '#CQ-102',
        studentName: 'Priya Patel',
        pages: 35,
        copies: 2,
        colorMode: 'bw',
        sides: 'double',
        binding: 'spiral',
        totalPrice: 200,
        paymentStatus: 'paid',
        status: 'received',
        createdAt: new Date(now - 1000 * 60 * 10).toISOString()
      },
      {
        id: 'ord_demo_3',
        token: '#CQ-103',
        studentName: 'Rohan Verma',
        pages: 6,
        copies: 1,
        colorMode: 'color',
        sides: 'single',
        binding: 'none',
        totalPrice: 60,
        paymentStatus: 'unpaid',
        status: 'ready',
        createdAt: new Date(now - 1000 * 60 * 35).toISOString()
      },
      {
        id: 'ord_demo_4',
        token: '#CQ-104',
        studentName: 'Sneha Rao',
        pages: 12,
        copies: 1,
        colorMode: 'bw',
        sides: 'double',
        binding: 'none',
        totalPrice: 24,
        paymentStatus: 'paid',
        status: 'completed',
        createdAt: new Date(now - 1000 * 60 * 70).toISOString()
      }
    ];

    localStorage.setItem(this.STORAGE_KEY_ORDERS, JSON.stringify(demoOrders));
    localStorage.setItem(this.STORAGE_KEY_TOKEN_SEQ, '104');
    window.dispatchEvent(new CustomEvent('campusqueue:orders_changed', { detail: demoOrders }));
  }
};

const PriceCalculator = {
  calculate({ pages, copies, colorMode, binding }, settings) {
    const pageCount = Math.max(1, parseInt(pages, 10) || 1);
    const copyCount = Math.max(1, parseInt(copies, 10) || 1);

    const perPageRate = colorMode === 'color' ? settings.colorRate : settings.bwRate;

    let bindingFee = 0;
    if (binding === 'staple') bindingFee = settings.stapleRate;
    else if (binding === 'spiral') bindingFee = settings.spiralRate;

    const costPerCopy = (pageCount * perPageRate) + bindingFee;
    const totalPrice = Math.round(costPerCopy * copyCount);

    const colorText = colorMode === 'color' ? `₹${perPageRate} (${I18n.t('mode_color')})` : `₹${perPageRate} (${I18n.t('mode_bw')})`;
    const bindingText = bindingFee > 0 ? ` + ₹${bindingFee}` : '';
    const formulaHint = `(${pageCount} pgs × ${colorText}${bindingText}) × ${copyCount} ${copyCount > 1 ? 'copies' : 'copy'}`;

    return {
      pageCount,
      copyCount,
      perPageRate,
      bindingFee,
      totalPrice,
      formulaHint
    };
  }
};

const UpiService = {
  generateUpiUri(upiId, shopName, amount, token) {
    const cleanUpi = encodeURIComponent(upiId.trim());
    const cleanName = encodeURIComponent(shopName.trim());
    const cleanToken = encodeURIComponent(`CampusQueue Order ${token}`);
    return `upi://pay?pa=${cleanUpi}&pn=${cleanName}&am=${amount}&cu=INR&tn=${cleanToken}`;
  },

  getQrCodeUrl(upiUri) {
    const encodedUri = encodeURIComponent(upiUri);
    return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodedUri}&margin=6`;
  }
};

const App = {
  isStaffPage: false,
  isStudentPage: false,

  init() {
    Theme.init();
    I18n.applyToDOM();

    this.isStaffPage = !!document.getElementById('cardsReceived');
    this.isStudentPage = !!document.getElementById('orderForm');

    OrderService.seedDemoData();

    this.bindCommonEvents();

    if (this.isStudentPage) {
      this.initStudent();
    }

    if (this.isStaffPage) {
      this.initStaff();
    }

    this.setupCrossTabSync();
  },

  bindCommonEvents() {
    const themeBtn = document.getElementById('btnThemeToggle');
    if (themeBtn) themeBtn.addEventListener('click', () => Theme.toggle());

    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
      langSelect.addEventListener('change', (e) => {
        I18n.setLanguage(e.target.value);
      });
    }

    window.addEventListener('campusqueue:lang_changed', () => {
      this.applyShopBranding();
      if (this.isStudentPage) {
        this.updatePriceEstimation();
        this.checkAndRenderActiveOrder();
      }
      if (this.isStaffPage) {
        this.renderStaffKanban();
      }
    });

    window.addEventListener('campusqueue:settings_changed', () => {
      this.applyShopBranding();
      if (this.isStudentPage) {
        this.updatePriceEstimation();
        this.checkAndRenderActiveOrder();
      }
    });

    this.applyShopBranding();
  },

  applyShopBranding() {
    const settings = SettingsService.getSettings();
    const navShop = document.getElementById('navShopName');
    if (navShop) navShop.textContent = settings.shopName;
  },

  setupCrossTabSync() {
    window.addEventListener('storage', (event) => {
      if (event.key === OrderService.STORAGE_KEY_ORDERS) {
        if (this.isStaffPage) this.renderStaffKanban();
        if (this.isStudentPage) this.checkAndRenderActiveOrder();
      }
      if (event.key === SettingsService.STORAGE_KEY) {
        this.applyShopBranding();
        if (this.isStudentPage) {
          this.updatePriceEstimation();
          this.checkAndRenderActiveOrder();
        }
      }
    });

    window.addEventListener('campusqueue:orders_changed', () => {
      if (this.isStaffPage) this.renderStaffKanban();
      if (this.isStudentPage) this.checkAndRenderActiveOrder();
    });
  },

  initStudent() {
    const form = document.getElementById('orderForm');
    const formInputs = form.querySelectorAll('input');
    formInputs.forEach(input => {
      input.addEventListener('input', () => this.updatePriceEstimation());
      input.addEventListener('change', () => this.updatePriceEstimation());
    });

    document.querySelectorAll('.num-step-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetId = e.currentTarget.getAttribute('data-target');
        const delta = parseInt(e.currentTarget.getAttribute('data-delta'), 10);
        const input = document.getElementById(targetId);
        if (input) {
          const min = parseInt(input.min, 10) || 1;
          const max = parseInt(input.max, 10) || 1000;
          let val = (parseInt(input.value, 10) || min) + delta;
          if (val < min) val = min;
          if (val > max) val = max;
          input.value = val;
          this.updatePriceEstimation();
        }
      });
    });

    form.addEventListener('submit', (e) => this.handleOrderSubmit(e));

    const lookupForm = document.getElementById('lookupForm');
    if (lookupForm) {
      lookupForm.addEventListener('submit', (e) => this.handleLookupSubmit(e));
    }

    const markPaidBtn = document.getElementById('btnMarkPaid');
    if (markPaidBtn) markPaidBtn.addEventListener('click', () => this.handleMarkPaid());

    const cancelBtn = document.getElementById('btnCancelOrder');
    if (cancelBtn) cancelBtn.addEventListener('click', () => this.handleStudentCancelOrder());

    const newOrderBtn = document.getElementById('btnNewOrderToggle');
    if (newOrderBtn) {
      newOrderBtn.addEventListener('click', () => {
        document.getElementById('newOrderCard').scrollIntoView({ behavior: 'smooth' });
      });
    }

    this.updatePriceEstimation();
    this.checkAndRenderActiveOrder();
  },

  getStudentFormData() {
    const form = document.getElementById('orderForm');
    const colorMode = form.querySelector('input[name="colorMode"]:checked')?.value || 'bw';
    const sides = form.querySelector('input[name="sides"]:checked')?.value || 'double';
    const binding = form.querySelector('input[name="binding"]:checked')?.value || 'none';

    return {
      studentName: document.getElementById('studentName').value,
      pages: document.getElementById('pageCount').value,
      copies: document.getElementById('copyCount').value,
      colorMode,
      sides,
      binding
    };
  },

  updatePriceEstimation() {
    const settings = SettingsService.getSettings();

    const bwLabel = document.getElementById('formBwRateLabel');
    const colorLabel = document.getElementById('formColorRateLabel');
    const stapleLabel = document.getElementById('formStapleRateLabel');
    const spiralLabel = document.getElementById('formSpiralRateLabel');

    if (bwLabel) bwLabel.textContent = `₹${settings.bwRate} / page`;
    if (colorLabel) colorLabel.textContent = `₹${settings.colorRate} / page`;
    if (stapleLabel) stapleLabel.textContent = `+₹${settings.stapleRate} / set`;
    if (spiralLabel) spiralLabel.textContent = `+₹${settings.spiralRate} / set`;

    const data = this.getStudentFormData();
    const calc = PriceCalculator.calculate(data, settings);

    const priceEl = document.getElementById('calculatedPrice');
    const formulaEl = document.getElementById('priceFormulaHint');
    if (priceEl) priceEl.textContent = calc.totalPrice;
    if (formulaEl) formulaEl.textContent = calc.formulaHint;
  },

  handleOrderSubmit(e) {
    e.preventDefault();
    const nameInput = document.getElementById('studentName');
    const studentName = nameInput.value.trim();
    if (!studentName) {
      alert("Please enter your name to place an order.");
      nameInput.focus();
      return;
    }

    const formData = this.getStudentFormData();
    const settings = SettingsService.getSettings();
    const calc = PriceCalculator.calculate(formData, settings);

    const newOrder = OrderService.createOrder({
      ...formData,
      totalPrice: calc.totalPrice
    });

    this.showToast(`${I18n.t('toast_order_placed')} ${newOrder.token}`);
    nameInput.value = '';

    this.renderActiveOrder(newOrder);
    document.getElementById('activeOrderCard').scrollIntoView({ behavior: 'smooth' });
  },

  checkAndRenderActiveOrder() {
    const card = document.getElementById('activeOrderCard');
    if (!card) return;

    const activeToken = OrderService.getActiveToken();
    if (!activeToken) {
      card.classList.add('hidden');
      return;
    }

    const order = OrderService.getOrderByToken(activeToken);
    if (!order) {
      card.classList.add('hidden');
      return;
    }

    this.renderActiveOrder(order);
  },

  renderActiveOrder(order) {
    const card = document.getElementById('activeOrderCard');
    if (!card) return;
    card.classList.remove('hidden');

    document.getElementById('trackToken').textContent = order.token;

    const statusBadge = document.getElementById('trackStatusBadge');
    statusBadge.className = `status-pill status-${order.status}`;
    const statusKey = `step_${order.status}`;
    statusBadge.textContent = I18n.t(statusKey) || order.status;

    document.getElementById('trackStudentName').textContent = order.studentName;

    const colorLabel = order.colorMode === 'color' ? I18n.t('mode_color') : I18n.t('mode_bw');
    const bindingLabel = order.binding === 'spiral' ? I18n.t('bind_spiral') : (order.binding === 'staple' ? I18n.t('bind_staple') : I18n.t('bind_none'));
    const sideLabel = order.sides === 'double' ? I18n.t('side_double') : I18n.t('side_single');

    document.getElementById('trackSpecs').textContent = `${order.pages} Pgs × ${order.copies} ${order.copies > 1 ? 'Sets' : 'Set'}, ${colorLabel}, ${sideLabel}, ${bindingLabel}`;
    document.getElementById('trackTotal').textContent = `₹${order.totalPrice}`;

    const payBadge = document.getElementById('trackPaymentBadge');
    const markPaidBtn = document.getElementById('btnMarkPaid');
    const upiSection = document.getElementById('upiPaymentSection');

    if (order.status === 'cancelled') {
      payBadge.innerHTML = `<span class="pay-pill cancelled">✕ ${I18n.t('step_cancelled')}</span>`;
      if (markPaidBtn) markPaidBtn.style.display = 'none';
      if (upiSection) upiSection.style.display = 'none';
    } else {
      if (upiSection) upiSection.style.display = 'block';
      if (order.paymentStatus === 'paid') {
        payBadge.innerHTML = `<span class="pay-pill paid">🟢 ${I18n.t('pay_upi')}</span>`;
        if (markPaidBtn) markPaidBtn.style.display = 'none';
      } else {
        payBadge.innerHTML = `<span class="pay-pill unpaid">🟡 ${I18n.t('pay_counter')}</span>`;
        if (markPaidBtn) markPaidBtn.style.display = 'inline-flex';
      }
    }

    this.updateStepperUI(order.status);

    const queueAlert = document.getElementById('queuePositionAlert');
    const queueText = document.getElementById('queuePositionText');

    if (order.status === 'cancelled') {
      queueAlert.style.display = 'flex';
      queueAlert.style.background = 'var(--color-danger-light)';
      queueAlert.style.color = 'var(--color-danger)';
      queueAlert.style.borderColor = 'rgba(239, 68, 68, 0.4)';
      queueText.textContent = I18n.t('order_cancelled_msg');
    } else if (order.status === 'received') {
      const positionAhead = OrderService.getQueuePosition(order.token);
      queueAlert.style.display = 'flex';
      queueAlert.style.background = 'var(--color-info-light)';
      queueAlert.style.color = 'var(--color-info)';
      queueAlert.style.borderColor = 'rgba(56, 189, 248, 0.35)';
      if (positionAhead === 0) {
        queueText.textContent = I18n.t('queue_next');
      } else {
        queueText.textContent = `There ${positionAhead === 1 ? 'is' : 'are'} ${positionAhead} ${positionAhead === 1 ? 'order' : 'orders'} ahead in queue.`;
      }
    } else if (order.status === 'printing') {
      queueAlert.style.display = 'flex';
      queueAlert.style.background = 'var(--color-warning-light)';
      queueAlert.style.color = '#f59e0b';
      queueAlert.style.borderColor = 'rgba(245, 158, 11, 0.4)';
      queueText.textContent = I18n.t('queue_printing_msg');
    } else if (order.status === 'ready') {
      queueAlert.style.display = 'flex';
      queueAlert.style.background = '#ecfdf5';
      queueAlert.style.color = '#047857';
      queueAlert.style.borderColor = '#a7f3d0';
      queueText.textContent = I18n.t('queue_ready_msg');
    } else {
      queueAlert.style.display = 'none';
    }

    if (order.status !== 'cancelled') {
      const settings = SettingsService.getSettings();
      const upiUri = UpiService.generateUpiUri(settings.upiId, settings.shopName, order.totalPrice, order.token);
      document.getElementById('upiQrImage').src = UpiService.getQrCodeUrl(upiUri);
      document.getElementById('trackUpiId').textContent = settings.upiId;
      document.getElementById('trackUpiAmount').textContent = `${I18n.t('detail_amount')}: ₹${order.totalPrice}`;
    }

    const cancelBtn = document.getElementById('btnCancelOrder');
    if (cancelBtn) {
      if (order.status === 'received') {
        cancelBtn.style.display = 'inline-flex';
      } else {
        cancelBtn.style.display = 'none';
      }
    }
  },

  updateStepperUI(status) {
    const steps = ['received', 'printing', 'ready', 'completed'];
    const currentIndex = steps.indexOf(status);

    steps.forEach((stepName, idx) => {
      const stepEl = document.querySelector(`.step[data-step="${stepName}"]`);
      if (!stepEl) return;

      stepEl.classList.remove('done', 'active');
      if (status === 'cancelled') {
        stepEl.classList.remove('done', 'active');
      } else if (idx < currentIndex) {
        stepEl.classList.add('done');
      } else if (idx === currentIndex) {
        stepEl.classList.add('active');
      }
    });

    for (let i = 1; i <= 3; i++) {
      const lineEl = document.querySelector(`.step-line[data-line="${i}"]`);
      if (lineEl) {
        if (status === 'cancelled') {
          lineEl.classList.remove('done');
        } else if (i <= currentIndex) {
          lineEl.classList.add('done');
        } else {
          lineEl.classList.remove('done');
        }
      }
    }
  },

  handleMarkPaid() {
    const activeToken = OrderService.getActiveToken();
    const order = OrderService.getOrderByToken(activeToken);
    if (order) {
      OrderService.updatePaymentStatus(order.id, 'paid');
      this.showToast(I18n.t('toast_payment_confirmed'));
    }
  },

  handleStudentCancelOrder() {
    const activeToken = OrderService.getActiveToken();
    const order = OrderService.getOrderByToken(activeToken);
    if (!order) return;

    if (order.status !== 'received') {
      alert('This order is already being processed and cannot be cancelled.');
      return;
    }

    if (confirm(`Are you sure you want to cancel order ${order.token}?`)) {
      OrderService.cancelOrder(order.id);
      this.renderActiveOrder({ ...order, status: 'cancelled' });
      this.showToast(I18n.t('toast_order_cancelled'));
    }
  },

  handleLookupSubmit(e) {
    e.preventDefault();
    const input = document.getElementById('lookupTokenInput');
    const inputToken = input.value.trim();
    if (!inputToken) return;

    const order = OrderService.getOrderByToken(inputToken);
    if (!order) {
      alert(`No order found matching token "${inputToken}".`);
      return;
    }

    OrderService.setActiveToken(order.token);
    this.renderActiveOrder(order);
    document.getElementById('activeOrderCard').scrollIntoView({ behavior: 'smooth' });
    input.value = '';
    this.showToast(`Found Order ${order.token}`);
  },

  initStaff() {
    const openSettingsBtn = document.getElementById('btnOpenSettings');
    const closeSettingsBtn = document.getElementById('btnCloseSettingsModal');
    const cancelSettingsBtn = document.getElementById('btnCancelSettings');
    const settingsForm = document.getElementById('settingsForm');
    const resetDemoBtn = document.getElementById('btnResetDemo');

    if (openSettingsBtn) openSettingsBtn.addEventListener('click', () => this.openSettingsModal());
    if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', () => this.closeSettingsModal());
    if (cancelSettingsBtn) cancelSettingsBtn.addEventListener('click', () => this.closeSettingsModal());
    if (settingsForm) settingsForm.addEventListener('submit', (e) => this.handleSettingsSubmit(e));

    if (resetDemoBtn) {
      resetDemoBtn.addEventListener('click', () => {
        if (confirm('Reset queue with fresh sample demo orders?')) {
          OrderService.seedDemoData(true);
          this.showToast(I18n.t('toast_demo_reset'));
        }
      });
    }

    this.renderStaffKanban();
  },

  openSettingsModal() {
    const settings = SettingsService.getSettings();
    document.getElementById('settingShopName').value = settings.shopName;
    document.getElementById('settingUpiId').value = settings.upiId;
    document.getElementById('settingBwRate').value = settings.bwRate;
    document.getElementById('settingColorRate').value = settings.colorRate;
    document.getElementById('settingStapleRate').value = settings.stapleRate;
    document.getElementById('settingSpiralRate').value = settings.spiralRate;

    document.getElementById('settingsModal').showModal();
  },

  closeSettingsModal() {
    document.getElementById('settingsModal').close();
  },

  handleSettingsSubmit(e) {
    e.preventDefault();
    const updated = {
      shopName: document.getElementById('settingShopName').value.trim(),
      upiId: document.getElementById('settingUpiId').value.trim(),
      bwRate: parseFloat(document.getElementById('settingBwRate').value) || 2,
      colorRate: parseFloat(document.getElementById('settingColorRate').value) || 10,
      stapleRate: parseFloat(document.getElementById('settingStapleRate').value) || 5,
      spiralRate: parseFloat(document.getElementById('settingSpiralRate').value) || 30
    };

    SettingsService.saveSettings(updated);
    this.closeSettingsModal();
    this.showToast(I18n.t('toast_rates_saved'));
  },

  renderStaffKanban() {
    const orders = OrderService.getOrders();

    const receivedOrders = orders.filter(o => o.status === 'received');
    const printingOrders = orders.filter(o => o.status === 'printing');
    const readyOrders = orders.filter(o => o.status === 'ready');
    const completedOrders = orders.filter(o => o.status === 'completed');

    const countRec = document.getElementById('countReceived');
    const countPrn = document.getElementById('countPrinting');
    const countRdy = document.getElementById('countReady');
    const countCmp = document.getElementById('countCompleted');

    if (countRec) countRec.textContent = receivedOrders.length;
    if (countPrn) countPrn.textContent = printingOrders.length;
    if (countRdy) countRdy.textContent = readyOrders.length;
    if (countCmp) countCmp.textContent = completedOrders.length;

    const pendingBadge = document.getElementById('pendingCountBadge');
    if (pendingBadge) {
      pendingBadge.textContent = receivedOrders.length + printingOrders.length;
    }

    this.renderColumnCards(document.getElementById('cardsReceived'), receivedOrders, 'received');
    this.renderColumnCards(document.getElementById('cardsPrinting'), printingOrders, 'printing');
    this.renderColumnCards(document.getElementById('cardsReady'), readyOrders, 'ready');
    this.renderColumnCards(document.getElementById('cardsCompleted'), completedOrders, 'completed');
  },

  renderColumnCards(containerEl, orders, columnType) {
    if (!containerEl) return;
    containerEl.innerHTML = '';

    if (orders.length === 0) {
      containerEl.innerHTML = `<div class="empty-placeholder">${I18n.t('no_orders_in')} ${columnType}</div>`;
      return;
    }

    const sorted = [...orders].sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return columnType === 'completed' ? timeB - timeA : timeA - timeB;
    });

    sorted.forEach(order => {
      const card = document.createElement('div');
      card.className = 'order-card';
      card.setAttribute('data-order-id', order.id);

      const createdTime = new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const colorLabel = order.colorMode === 'color' ? I18n.t('mode_color') : I18n.t('mode_bw');
      const bindingLabel = order.binding === 'spiral' ? I18n.t('bind_spiral') : (order.binding === 'staple' ? I18n.t('bind_staple') : I18n.t('bind_none'));

      const payPill = order.paymentStatus === 'paid'
        ? `<span class="pay-pill paid">🟢 ${I18n.t('pay_upi')}</span>`
        : `<span class="pay-pill unpaid">🟡 ${I18n.t('pay_counter')}</span>`;

      let actionButtonsHtml = '';
      if (columnType === 'received') {
        actionButtonsHtml = `
          <button type="button" class="btn-card-action btn-advance" onclick="App.advanceOrder('${order.id}', 'printing')">
            ${I18n.t('btn_start_printing')}
          </button>
          <button type="button" class="btn-card-action btn-card-cancel" title="Cancel this order" onclick="App.cancelStaffOrder('${order.id}')">
            ${I18n.t('btn_cancel')}
          </button>
        `;
      } else if (columnType === 'printing') {
        actionButtonsHtml = `
          <button type="button" class="btn-card-action btn-revert" onclick="App.advanceOrder('${order.id}', 'received')">
            ${I18n.t('btn_back')}
          </button>
          <button type="button" class="btn-card-action btn-advance" onclick="App.advanceOrder('${order.id}', 'ready')">
            ${I18n.t('btn_mark_ready')}
          </button>
          <button type="button" class="btn-card-action btn-card-cancel" title="Cancel this order" onclick="App.cancelStaffOrder('${order.id}')">
            ${I18n.t('btn_cancel')}
          </button>
        `;
      } else if (columnType === 'ready') {
        actionButtonsHtml = `
          <button type="button" class="btn-card-action btn-revert" onclick="App.advanceOrder('${order.id}', 'printing')">
            ${I18n.t('btn_back')}
          </button>
          <button type="button" class="btn-card-action btn-advance" onclick="App.advanceOrder('${order.id}', 'completed')">
            ${I18n.t('btn_complete_pickup')}
          </button>
        `;
      } else if (columnType === 'completed') {
        actionButtonsHtml = `
          <button type="button" class="btn-card-action btn-revert" onclick="App.advanceOrder('${order.id}', 'ready')">
            ${I18n.t('btn_reopen')}
          </button>
          <button type="button" class="btn-card-action btn-delete" title="Delete record" onclick="App.deleteOrderPrompt('${order.id}')">
            ✕
          </button>
        `;
      }

      card.innerHTML = `
        <div class="order-card-header">
          <span class="card-token">${order.token}</span>
          <span class="card-time">${createdTime}</span>
        </div>
        <div class="card-student-name">${this.escapeHtml(order.studentName)}</div>
        <div class="card-chips">
          <span class="chip chip-highlight">${order.pages} Pgs × ${order.copies}</span>
          <span class="chip">${colorLabel}</span>
          <span class="chip">${order.sides}-sided</span>
          <span class="chip">${bindingLabel}</span>
        </div>
        <div class="card-footer">
          <span class="card-price">₹${order.totalPrice}</span>
          ${payPill}
        </div>
        <div class="card-actions">
          ${actionButtonsHtml}
        </div>
      `;

      containerEl.appendChild(card);
    });
  },

  advanceOrder(orderId, nextStatus) {
    OrderService.updateOrderStatus(orderId, nextStatus);
    const statusKey = `step_${nextStatus}`;
    this.showToast(`${I18n.t(statusKey) || nextStatus.toUpperCase()}`);
  },

  cancelStaffOrder(orderId) {
    const order = OrderService.getOrderById(orderId);
    if (!order) return;
    if (confirm(`Cancel order ${order.token} for ${order.studentName}?`)) {
      OrderService.cancelOrder(orderId);
      this.renderStaffKanban();
      this.showToast(`${order.token} ${I18n.t('toast_order_cancelled')}`);
    }
  },

  deleteOrderPrompt(orderId) {
    const order = OrderService.getOrderById(orderId);
    if (!order) return;
    if (confirm(`Remove order ${order.token} for ${order.studentName}?`)) {
      OrderService.deleteOrder(orderId);
      this.showToast(`Order ${order.token} removed.`);
    }
  },

  showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span>${this.escapeHtml(message)}</span>
    `;
    toast.appendChild(el);
    setTimeout(() => {
      el.remove();
    }, 3000);
  },

  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
};

window.App = App;

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});