import { useState, useEffect, useRef } from "react";

// ─── DATA CONSTANTS ───
const LIFESTYLE_OPTIONS = ["Soft Swap","Full Swap","Same Room","Separate Room","Voyeurism","Exhibitionism","Group Play","MFM","FMF","Couples Only","Single Male Friendly","Single Female Friendly"];
const EXPERIENCE_LEVELS = ["Curious","New (< 1 year)","Intermediate (1-3 years)","Experienced (3+ years)","Veteran"];
const MEETING_PREFS = ["Hotel Meetups","House Parties","Clubs/Events","Cruises/Travel","Online Only First","Public Meet & Greet First"];
const BODY_TYPES = ["Slim","Athletic","Average","Curvy","Full Figured","Muscular","Dad Bod","BBW/BHM"];
const PROFILE_TYPES = ["Couple (M/F)","Couple (M/M)","Couple (F/F)","Single Male","Single Female","Single Non-Binary","Poly Group","Married Male — Discreet","Married Female — Discreet","Committed Male — Discreet","Committed Female — Discreet","Attached Male — Hall Pass","Attached Female — Hall Pass"];
const ZODIAC = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
const KINKS = ["Bondage","Role Play","Sensory Play","Dominance","Submission","Tantric","Massage","Hot Tub/Pool","Dancing","Watching","Photography","Fetish Wear","Latex","Lingerie","Toys","Blindfolds","Ice Play","Wax Play","Mirror Play","Outdoor"];
const DISCRETION_LEVELS = ["Ultra Discreet — No Face Pics","Very Discreet — Face After Trust","Discreet — Selective Sharing","Open — Comfortable Sharing"];
const RELATIONSHIP_STATUS = ["Married — Partner Unaware","Married — Partner Aware (Hall Pass)","Married — Open Arrangement","In Committed Relationship","Separated / Complicated","Engaged","It's Complicated"];
const AVAILABILITY_WINDOWS = ["Weekday Daytime Only","Weekday Evenings","Weekday Lunches","Weekend Daytime","Weekend Evenings","Late Night Only","During Travel/Trips Only","Flexible Schedule"];
const HOSTING_OPTIONS = ["Can Host","Cannot Host — Hotels Only","Can Travel","Prefer Their Place","Neutral Location Only","During Business Travel"];
const SEEKING_OPTIONS = ["One-Time Encounter","Ongoing Affair","Friends with Benefits","Emotional + Physical Connection","Physical Only — No Strings","Regular Rendezvous Partner","Travel Companion","Sexting / Online Only"];
const COMMUNICATION_PREFS = ["Disappearing Messages Only","Use App Chat Only — No Personal Number","Separate Burner Phone","Signal/Telegram Only","Email Only","Will Exchange Number After Trust"];
const SECRET_BOUNDARIES = ["No Social Media Contact","No Photos of Face","Never Contact Outside Agreed Hours","No Gifts to My Home","Don't Acknowledge in Public","Separate Communication App Required","Auto-Delete All Messages"];
const TRAVEL_DATES = ["Open to Travel","Hosting Visitors","Traveling Soon","Looking for Travel Partner","International Travel","Weekend Getaways","Resort/Cruise Ready"];
const PARTY_TYPES = ["House Party","Hotel Takeover","Club Night","Pool Party","Masquerade Ball","Yacht Party","Resort Weekend","Meet & Greet"];
const VIBE_TAGS = ["Flirty","Intense","Romantic","Wild","Classy","Down to Earth","Adventurous","Sensual","Playful","Dominant","Submissive","Switch"];

const isDiscreetType = (t) => t && (t.includes("Discreet") || t.includes("Hall Pass"));
const generateId = () => Math.random().toString(36).substr(2, 9);
const hashPw = (pw) => { let h=0; for(let i=0;i<pw.length;i++){h=((h<<5)-h)+pw.charCodeAt(i);h|=0;} return "h_"+Math.abs(h).toString(36); };

const SAMPLE = [
  { id:"s1",username:"VelvetNights",passwordHash:hashPw("velvet123"),profileType:"Couple (M/F)",age1:34,age2:31,city:"Dallas",state:"TX",tagline:"Sophisticated couple seeking genuine connections",bio:"Fun, fit couple in the lifestyle 3 years. We love upscale events, great wine, and meeting like-minded people who value discretion above all. We play together, always. Looking for real chemistry — not just physical. Wine us, dine us, then let's see where the night goes.",experience:"Experienced (3+ years)",lifestylePrefs:["Soft Swap","Full Swap","Same Room","Couples Only"],meetingPrefs:["Hotel Meetups","Clubs/Events","Public Meet & Greet First"],bodyType1:"Athletic",bodyType2:"Curvy",kinks:["Role Play","Sensory Play","Hot Tub/Pool","Dancing","Lingerie","Mirror Play"],zodiac1:"Scorpio",zodiac2:"Leo",verified:true,online:true,lastActive:"Just now",profilePhoto:"https://api.dicebear.com/7.x/lorelei/svg?seed=VelvetNights&backgroundColor=c9a84c",publicPhotos:["https://api.dicebear.com/7.x/shapes/svg?seed=vn1","https://api.dicebear.com/7.x/shapes/svg?seed=vn2","https://api.dicebear.com/7.x/shapes/svg?seed=vn3"],privatePhotos:["https://api.dicebear.com/7.x/shapes/svg?seed=vnp1","https://api.dicebear.com/7.x/shapes/svg?seed=vnp2"],hotScore:92,vibes:["Classy","Sensual","Flirty"],travelDates:["Resort/Cruise Ready","Weekend Getaways"],lookingTonight:true,partyInterests:["Club Night","Hotel Takeover","Pool Party"] },
  { id:"s3",username:"SilkAndSatin",passwordHash:hashPw("silk789"),profileType:"Single Female",age1:29,age2:null,city:"Plano",state:"TX",tagline:"Unicorn who knows what she wants ✨",bio:"Confident, selective, adventurous. I prefer couples who communicate well and respect boundaries. Start with coffee, see where the vibe takes us. Not here to fix your marriage — here to enhance your Saturday night.",experience:"Intermediate (1-3 years)",lifestylePrefs:["Soft Swap","FMF","Same Room","Couples Only"],meetingPrefs:["Public Meet & Greet First","Hotel Meetups"],bodyType1:"Athletic",bodyType2:null,kinks:["Dancing","Role Play","Fetish Wear","Lingerie","Toys"],zodiac1:"Libra",zodiac2:null,verified:true,online:true,lastActive:"Just now",profilePhoto:"https://api.dicebear.com/7.x/lorelei/svg?seed=SilkSatin&backgroundColor=e8536e",publicPhotos:["https://api.dicebear.com/7.x/shapes/svg?seed=ss1","https://api.dicebear.com/7.x/shapes/svg?seed=ss2","https://api.dicebear.com/7.x/shapes/svg?seed=ss3"],privatePhotos:["https://api.dicebear.com/7.x/shapes/svg?seed=ssp1"],hotScore:96,vibes:["Wild","Playful","Adventurous"],travelDates:["Open to Travel"],lookingTonight:true,partyInterests:["Pool Party","Masquerade Ball"] },
  { id:"s5",username:"TheChemists",passwordHash:hashPw("chem456"),profileType:"Couple (M/F)",age1:45,age2:40,city:"Houston",state:"TX",tagline:"If the chemistry isn't there, nothing else matters",bio:"Seasoned lifestyle couple. Events on 4 continents. Looking for intellectual equals who enjoy deep conversation and deeper connection. We don't rush. We select.",experience:"Veteran",lifestylePrefs:["Full Swap","Separate Room","Voyeurism","Exhibitionism"],meetingPrefs:["Cruises/Travel","Clubs/Events","Public Meet & Greet First"],bodyType1:"Average",bodyType2:"Curvy",kinks:["Tantric","Role Play","Dancing","Massage","Wax Play"],zodiac1:"Sagittarius",zodiac2:"Taurus",verified:true,online:true,lastActive:"Just now",profilePhoto:"https://api.dicebear.com/7.x/lorelei/svg?seed=Chemists45&backgroundColor=8a7535",publicPhotos:["https://api.dicebear.com/7.x/shapes/svg?seed=tc1","https://api.dicebear.com/7.x/shapes/svg?seed=tc2"],privatePhotos:["https://api.dicebear.com/7.x/shapes/svg?seed=tcp1","https://api.dicebear.com/7.x/shapes/svg?seed=tcp2","https://api.dicebear.com/7.x/shapes/svg?seed=tcp3"],hotScore:88,vibes:["Classy","Intense","Romantic"],travelDates:["International Travel","Resort/Cruise Ready"],lookingTonight:false,partyInterests:["Yacht Party","Resort Weekend","Masquerade Ball"] },
  { id:"s6",username:"UrbanExplorer",passwordHash:hashPw("urban123"),profileType:"Single Male",age1:33,age2:null,city:"San Antonio",state:"TX",tagline:"Respectful, fit, and ready",bio:"I understand lifestyle etiquette. I don't push boundaries, I respect them. Gentleman with an edge. References available.",experience:"Intermediate (1-3 years)",lifestylePrefs:["MFM","Soft Swap","Full Swap","Single Male Friendly"],meetingPrefs:["Public Meet & Greet First","Hotel Meetups","Online Only First"],bodyType1:"Muscular",bodyType2:null,kinks:["Massage","Sensory Play","Role Play","Dominance"],zodiac1:"Leo",zodiac2:null,verified:false,online:false,lastActive:"5h ago",profilePhoto:"https://api.dicebear.com/7.x/lorelei/svg?seed=Urban33&backgroundColor=c9a84c",publicPhotos:["https://api.dicebear.com/7.x/shapes/svg?seed=ue1"],privatePhotos:["https://api.dicebear.com/7.x/shapes/svg?seed=uep1"],hotScore:74,vibes:["Down to Earth","Adventurous"],travelDates:[],lookingTonight:false,partyInterests:["Meet & Greet"] },
  { id:"s4",username:"MidnightRendezvous",passwordHash:hashPw("mid789"),profileType:"Couple (M/F)",age1:37,age2:35,city:"Austin",state:"TX",tagline:"Late nights, good vibes, no drama 🌙",bio:"We host private gatherings and attend events around Texas. Respectful, clean, communicative. No single males.",experience:"Experienced (3+ years)",lifestylePrefs:["Full Swap","Same Room","Group Play","Couples Only"],meetingPrefs:["House Parties","Clubs/Events","Hotel Meetups"],bodyType1:"Muscular",bodyType2:"Athletic",kinks:["Hot Tub/Pool","Bondage","Sensory Play","Photography","Outdoor"],zodiac1:"Aries",zodiac2:"Gemini",verified:true,online:false,lastActive:"1d ago",profilePhoto:"https://api.dicebear.com/7.x/lorelei/svg?seed=Midnight99&backgroundColor=c9a84c",publicPhotos:["https://api.dicebear.com/7.x/shapes/svg?seed=mr1","https://api.dicebear.com/7.x/shapes/svg?seed=mr2"],privatePhotos:["https://api.dicebear.com/7.x/shapes/svg?seed=mrp1","https://api.dicebear.com/7.x/shapes/svg?seed=mrp2","https://api.dicebear.com/7.x/shapes/svg?seed=mrp3","https://api.dicebear.com/7.x/shapes/svg?seed=mrp4"],hotScore:85,vibes:["Wild","Intense","Playful"],travelDates:["Weekend Getaways"],lookingTonight:false,partyInterests:["House Party","Hotel Takeover","Pool Party"] },
  // DISCREET
  { id:"s7",username:"QuietStorm",passwordHash:hashPw("quiet123"),profileType:"Married Male — Discreet",age1:41,age2:null,city:"Dallas",state:"TX",tagline:"What happens between us, stays between us 🤫",bio:"Professional, successful, missing something at home. Not looking to change my situation — just a genuine connection with someone who understands discretion isn't optional, it's everything.",experience:"Curious",lifestylePrefs:[],meetingPrefs:["Hotel Meetups","Online Only First"],bodyType1:"Athletic",bodyType2:null,kinks:["Massage","Tantric","Sensory Play"],zodiac1:"Scorpio",zodiac2:null,verified:false,online:true,lastActive:"Just now",profilePhoto:null,publicPhotos:[],privatePhotos:["https://api.dicebear.com/7.x/shapes/svg?seed=qsp1","https://api.dicebear.com/7.x/shapes/svg?seed=qsp2","https://api.dicebear.com/7.x/shapes/svg?seed=qsp3"],hotScore:78,vibes:["Intense","Romantic"],relationshipStatus:"Married — Partner Unaware",discretionLevel:"Ultra Discreet — No Face Pics",availabilityWindows:["Weekday Lunches","Weekday Evenings","During Travel/Trips Only"],hostingOptions:["Cannot Host — Hotels Only","During Business Travel"],seekingType:["Ongoing Affair","Friends with Benefits","Emotional + Physical Connection"],commPrefs:["Use App Chat Only — No Personal Number","Disappearing Messages Only"],secretBoundaries:["No Social Media Contact","No Photos of Face","Never Contact Outside Agreed Hours","Don't Acknowledge in Public","Auto-Delete All Messages"] },
  { id:"s8",username:"GardenOfSecrets",passwordHash:hashPw("garden123"),profileType:"Married Female — Discreet",age1:36,age2:null,city:"Frisco",state:"TX",tagline:"Craving butterflies I forgot existed 🦋",bio:"Devoted mother, professional, everything on paper — except passion. Looking for someone intelligent, emotionally aware, patient enough to build real chemistry. I need to feel safe. I need to feel wanted. This stays our secret.",experience:"Curious",lifestylePrefs:[],meetingPrefs:["Public Meet & Greet First","Hotel Meetups","Online Only First"],bodyType1:"Curvy",bodyType2:null,kinks:["Tantric","Role Play","Dancing","Sensory Play"],zodiac1:"Cancer",zodiac2:null,verified:true,online:true,lastActive:"Just now",profilePhoto:"https://api.dicebear.com/7.x/lorelei/svg?seed=Garden36&backgroundColor=9b59b6",publicPhotos:["https://api.dicebear.com/7.x/shapes/svg?seed=gs1"],privatePhotos:["https://api.dicebear.com/7.x/shapes/svg?seed=gsp1","https://api.dicebear.com/7.x/shapes/svg?seed=gsp2","https://api.dicebear.com/7.x/shapes/svg?seed=gsp3"],hotScore:91,vibes:["Romantic","Sensual"],relationshipStatus:"Married — Partner Unaware",discretionLevel:"Very Discreet — Face After Trust",availabilityWindows:["Weekday Daytime Only","Weekday Lunches"],hostingOptions:["Cannot Host — Hotels Only","Neutral Location Only"],seekingType:["Ongoing Affair","Emotional + Physical Connection","Regular Rendezvous Partner"],commPrefs:["Signal/Telegram Only","Disappearing Messages Only"],secretBoundaries:["No Social Media Contact","Never Contact Outside Agreed Hours","No Gifts to My Home","Don't Acknowledge in Public"] },
  { id:"s10",username:"SatinWhisper",passwordHash:hashPw("satin123"),profileType:"Attached Female — Hall Pass",age1:33,age2:null,city:"Arlington",state:"TX",tagline:"He said yes. Now I'm saying hello 💋",bio:"Partner knows and supports. This is my hall pass and I intend to use it wisely. Confident, clean, respectful people only. Not replacing a relationship — adding excitement.",experience:"Curious",lifestylePrefs:["FMF","Soft Swap","Single Male Friendly","Single Female Friendly"],meetingPrefs:["Public Meet & Greet First","Hotel Meetups"],bodyType1:"Slim",bodyType2:null,kinks:["Dancing","Fetish Wear","Bondage","Photography","Lingerie","Toys"],zodiac1:"Leo",zodiac2:null,verified:true,online:true,lastActive:"Just now",profilePhoto:"https://api.dicebear.com/7.x/lorelei/svg?seed=SatinW33&backgroundColor=c084fc",publicPhotos:["https://api.dicebear.com/7.x/shapes/svg?seed=sw1","https://api.dicebear.com/7.x/shapes/svg?seed=sw2","https://api.dicebear.com/7.x/shapes/svg?seed=sw3"],privatePhotos:["https://api.dicebear.com/7.x/shapes/svg?seed=swp1","https://api.dicebear.com/7.x/shapes/svg?seed=swp2","https://api.dicebear.com/7.x/shapes/svg?seed=swp3"],hotScore:94,vibes:["Wild","Flirty","Playful"],relationshipStatus:"Married — Partner Aware (Hall Pass)",discretionLevel:"Discreet — Selective Sharing",availabilityWindows:["Weekend Evenings","Weekday Evenings","Flexible Schedule"],hostingOptions:["Can Host","Can Travel"],seekingType:["One-Time Encounter","Friends with Benefits","Physical Only — No Strings"],commPrefs:["Will Exchange Number After Trust"],secretBoundaries:["No Social Media Contact","Don't Acknowledge in Public"] },
  { id:"s12",username:"WildOrchid",passwordHash:hashPw("wild123"),profileType:"Committed Female — Discreet",age1:30,age2:null,city:"Fort Worth",state:"TX",tagline:"Good girl with a secret side 🌺",bio:"Boyfriend is wonderful but predictable. I crave novelty and the thrill of something secret. Educated, fit, know what I want. Be patient — once I trust you, you won't be disappointed.",experience:"Curious",lifestylePrefs:[],meetingPrefs:["Public Meet & Greet First","Hotel Meetups","Online Only First"],bodyType1:"Athletic",bodyType2:null,kinks:["Bondage","Dominance","Submission","Fetish Wear","Blindfolds"],zodiac1:"Gemini",zodiac2:null,verified:false,online:false,lastActive:"1d ago",profilePhoto:null,publicPhotos:[],privatePhotos:["https://api.dicebear.com/7.x/shapes/svg?seed=wop1","https://api.dicebear.com/7.x/shapes/svg?seed=wop2","https://api.dicebear.com/7.x/shapes/svg?seed=wop3"],hotScore:87,vibes:["Intense","Submissive","Adventurous"],relationshipStatus:"In Committed Relationship",discretionLevel:"Very Discreet — Face After Trust",availabilityWindows:["Weekday Daytime Only","Weekend Daytime"],hostingOptions:["Cannot Host — Hotels Only","Neutral Location Only"],seekingType:["Ongoing Affair","Emotional + Physical Connection","Sexting / Online Only"],commPrefs:["Disappearing Messages Only","Signal/Telegram Only"],secretBoundaries:["No Social Media Contact","No Photos of Face","Never Contact Outside Agreed Hours","No Gifts to My Home","Auto-Delete All Messages"] },
  { id:"s11",username:"MidtownGhost",passwordHash:hashPw("ghost123"),profileType:"Married Male — Discreet",age1:47,age2:null,city:"Houston",state:"TX",tagline:"Invisible to the world, unforgettable to you 👻",bio:"Senior executive, frequent traveler. Marriage stable on paper but spark gone. Intelligent, independent woman who values privacy. Generous with time and attention. Rules exist for a reason.",experience:"Intermediate (1-3 years)",lifestylePrefs:[],meetingPrefs:["Hotel Meetups","Cruises/Travel","Online Only First"],bodyType1:"Average",bodyType2:null,kinks:["Tantric","Massage","Role Play","Sensory Play","Wax Play"],zodiac1:"Virgo",zodiac2:null,verified:true,online:false,lastActive:"4h ago",profilePhoto:"https://api.dicebear.com/7.x/lorelei/svg?seed=Midtown47&backgroundColor=9b59b6",publicPhotos:[],privatePhotos:["https://api.dicebear.com/7.x/shapes/svg?seed=mtp1","https://api.dicebear.com/7.x/shapes/svg?seed=mtp2","https://api.dicebear.com/7.x/shapes/svg?seed=mtp3"],hotScore:80,vibes:["Classy","Romantic","Dominant"],relationshipStatus:"Married — Partner Unaware",discretionLevel:"Ultra Discreet — No Face Pics",availabilityWindows:["During Travel/Trips Only","Weekday Lunches"],hostingOptions:["Cannot Host — Hotels Only","Can Travel"],seekingType:["Ongoing Affair","Emotional + Physical Connection","Travel Companion"],commPrefs:["Signal/Telegram Only","Disappearing Messages Only"],secretBoundaries:["No Social Media Contact","No Photos of Face","Never Contact Outside Agreed Hours","No Gifts to My Home","Don't Acknowledge in Public","Auto-Delete All Messages"] },
];

const store = {
  async get(k){try{const r=await window.storage.get(k);return r?JSON.parse(r.value):null;}catch{return null;}},
  async set(k,v){try{await window.storage.set(k,JSON.stringify(v));}catch(e){console.error(e);}},
};

// ─── CSS KEYFRAMES ───
const injectStyles = () => {
  if (document.getElementById("vc-styles")) return;
  const style = document.createElement("style");
  style.id = "vc-styles";
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Raleway:wght@300;400;500;600;700&display=swap');
    * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    body { margin:0; overscroll-behavior:none; }
    ::-webkit-scrollbar { width:4px; }
    ::-webkit-scrollbar-track { background:transparent; }
    ::-webkit-scrollbar-thumb { background:#2a2a3a; border-radius:4px; }
    @keyframes pulseGlow { 0%,100%{box-shadow:0 0 8px #c9a84c33;} 50%{box-shadow:0 0 20px #c9a84c66;} }
    @keyframes pulseSecret { 0%,100%{box-shadow:0 0 8px #9b59b633;} 50%{box-shadow:0 0 20px #9b59b666;} }
    @keyframes slideUp { from{transform:translateY(20px);opacity:0;} to{transform:translateY(0);opacity:1;} }
    @keyframes fadeIn { from{opacity:0;} to{opacity:1;} }
    @keyframes shimmer { 0%{background-position:-200% 0;} 100%{background-position:200% 0;} }
    @keyframes hotPulse { 0%,100%{transform:scale(1);} 50%{transform:scale(1.05);} }
    @keyframes float { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-6px);} }
    @keyframes gradientShift { 0%{background-position:0% 50%;} 50%{background-position:100% 50%;} 100%{background-position:0% 50%;} }
    .vc-card:hover { border-color:#c9a84c55!important; transform:translateY(-2px); }
    .vc-card-secret:hover { border-color:#9b59b655!important; transform:translateY(-2px); }
    .vc-glow { animation:pulseGlow 3s ease-in-out infinite; }
    .vc-glow-secret { animation:pulseSecret 3s ease-in-out infinite; }
    .vc-slide { animation:slideUp 0.4s ease-out; }
    .vc-fade { animation:fadeIn 0.3s ease-out; }
    .vc-hot { animation:hotPulse 2s ease-in-out infinite; }
    .vc-float { animation:float 4s ease-in-out infinite; }
    .vc-shimmer { background:linear-gradient(90deg,transparent,rgba(201,168,76,0.08),transparent); background-size:200% 100%; animation:shimmer 3s infinite; }
    .vc-gradient-bg { background:linear-gradient(-45deg,#0a0a0f,#1a1028,#0f1a2a,#0a0a0f); background-size:400% 400%; animation:gradientShift 15s ease infinite; }
    .vc-tonight { position:relative; }
    .vc-tonight::after { content:"🔥"; position:absolute; top:-4px; right:-4px; font-size:14px; animation:hotPulse 1.5s infinite; }
    @media(max-width:600px) {
      .vc-desktop-nav { display:none!important; }
      .vc-mobile-nav { display:flex!important; }
      .vc-hero-title { font-size:36px!important; }
      .vc-grid-2 { grid-template-columns:1fr!important; }
      .vc-grid-4 { grid-template-columns:repeat(2,1fr)!important; }
      .vc-grid-photos { grid-template-columns:repeat(3,1fr)!important; }
      .vc-container { padding:0 12px!important; }
      .vc-card-inner { padding:16px!important; }
    }
    @media(min-width:601px) {
      .vc-mobile-nav { display:none!important; }
      .vc-desktop-nav { display:flex!important; }
    }
  `;
  document.head.appendChild(style);
};

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("splash");
  const [profiles, setProfiles] = useState(SAMPLE);
  const [messages, setMessages] = useState({});
  const [selProfile, setSelProfile] = useState(null);
  const [activeConvo, setActiveConvo] = useState(null);
  const [newMsg, setNewMsg] = useState("");
  const [filters, setFilters] = useState({profileType:"",city:"",category:"all"});
  const [regStep, setRegStep] = useState(0);
  const [form, setForm] = useState({});
  const [notif, setNotif] = useState(null);
  const [panicMode, setPanicMode] = useState(false);
  const [loginForm, setLoginForm] = useState({username:"",password:""});
  const [showPw, setShowPw] = useState(false);
  const [photoAccess, setPhotoAccess] = useState({});
  const [viewer, setViewer] = useState(null);
  const [viewerIdx, setViewerIdx] = useState(0);
  const [hotTab, setHotTab] = useState("trending");
  const msgEnd = useRef(null);

  useEffect(() => { injectStyles(); load(); }, []);
  useEffect(() => { msgEnd.current?.scrollIntoView({behavior:"smooth"}); }, [activeConvo,messages]);

  const load = async () => {
    const u=await store.get("vc4_user"),m=await store.get("vc4_msgs"),p=await store.get("vc4_profs"),pa=await store.get("vc4_pa");
    if(u){setUser(u);setView("home");}if(m)setMessages(m);
    if(p)setProfiles(pr=>[...SAMPLE,...p.filter(x=>!SAMPLE.find(s=>s.id===x.id))]);
    if(pa)setPhotoAccess(pa);
  };
  const saveMsgs=async m=>{setMessages(m);await store.set("vc4_msgs",m);};
  const saveProfs=async p=>{await store.set("vc4_profs",p.filter(x=>!SAMPLE.find(s=>s.id===x.id)));};
  const savePa=async pa=>{setPhotoAccess(pa);await store.set("vc4_pa",pa);};
  const notify=m=>{setNotif(m);setTimeout(()=>setNotif(null),3500);};
  const uf=(k,v)=>setForm(p=>({...p,[k]:v}));
  const ta=(k,item)=>{const a=form[k]||[];uf(k,a.includes(item)?a.filter(i=>i!==item):[...a,item]);};

  const handleRegister=async()=>{
    if(!form.username?.trim())return notify("Username required.");
    if(!form.password||form.password.length<6)return notify("Password: min 6 chars.");
    if(form.password!==form.confirmPassword)return notify("Passwords don't match.");
    if(profiles.find(p=>p.username.toLowerCase()===form.username.toLowerCase()))return notify("Username taken.");
    const profile={...form,passwordHash:hashPw(form.password),id:generateId(),verified:false,online:true,lastActive:"Just now",profilePhoto:form.profilePhoto||null,publicPhotos:form.publicPhotos||[],privatePhotos:form.privatePhotos||[],hotScore:Math.floor(Math.random()*30)+60,vibes:form.vibes||[],lookingTonight:false};
    delete profile.password;delete profile.confirmPassword;
    const np=[...profiles,profile];setProfiles(np);await saveProfs(np);
    setUser(profile);await store.set("vc4_user",profile);setView("home");
    notify(isDiscreetType(profile.profileType)?"Welcome. Your secret is safe.":"Welcome to Velvet Circle! 🔥");
  };
  const handleLogin=async()=>{
    const f=profiles.find(p=>p.username.toLowerCase()===loginForm.username.toLowerCase());
    if(!f)return notify("Account not found.");
    if(f.passwordHash!==hashPw(loginForm.password))return notify("Wrong password.");
    setUser(f);await store.set("vc4_user",f);setView("home");setLoginForm({username:"",password:""});notify("Welcome back 🔥");
  };
  const handleLogout=async()=>{setUser(null);await store.set("vc4_user",null);setView("splash");setForm({});};
  const sendMsg=async toId=>{if(!newMsg.trim())return;const k=[user.id,toId].sort().join("_"),u={...messages};if(!u[k])u[k]=[];u[k].push({from:user.id,to:toId,text:newMsg.trim(),time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),ts:Date.now()});setNewMsg("");await saveMsgs(u);};
  const grantAccess=async toId=>{const k=[user.id,toId].sort().join("_");await savePa({...photoAccess,[`${k}_${user.id}`]:true});notify("Private photos shared! 🔓");};
  const hasAccess=pid=>{if(!user)return false;if(pid===user.id)return true;const k=[user.id,pid].sort().join("_");return!!photoAccess[`${k}_${pid}`];};
  const getConvos=()=>{if(!user)return[];return Object.entries(messages).filter(([k])=>k.includes(user.id)).map(([k,ms])=>{const oid=k.split("_").find(id=>id!==user.id),o=profiles.find(p=>p.id===oid);return{key:k,otherId:oid,other:o,lastMsg:ms[ms.length-1],count:ms.length};}).filter(c=>c.other).sort((a,b)=>(b.lastMsg?.ts||0)-(a.lastMsg?.ts||0));};
  const filtered=profiles.filter(p=>{if(user&&p.id===user.id)return false;if(filters.category==="discreet"&&!isDiscreetType(p.profileType))return false;if(filters.category==="lifestyle"&&isDiscreetType(p.profileType))return false;if(filters.category==="tonight"&&!p.lookingTonight)return false;if(filters.profileType&&p.profileType!==filters.profileType)return false;if(filters.city&&!p.city?.toLowerCase().includes(filters.city.toLowerCase()))return false;return true;});
  const handlePhotoUpload=(e,type)=>{Array.from(e.target.files).forEach(file=>{const r=new FileReader();r.onload=ev=>{if(type==="profile")uf("profilePhoto",ev.target.result);else if(type==="public")uf("publicPhotos",[...(form.publicPhotos||[]),ev.target.result]);else uf("privatePhotos",[...(form.privatePhotos||[]),ev.target.result]);};r.readAsDataURL(file);});e.target.value="";};
  const removePhoto=(type,idx)=>{if(type==="profile")uf("profilePhoto",null);else if(type==="public")uf("publicPhotos",(form.publicPhotos||[]).filter((_,i)=>i!==idx));else uf("privatePhotos",(form.privatePhotos||[]).filter((_,i)=>i!==idx));};

  // ─── THEME ───
  const C={bg:"#0a0a0f",sf:"#12121a",sf2:"#1a1a26",bd:"#252535",gold:"#d4a843",gL:"#f0d878",gD:"#8a7535",tx:"#ede9e3",txD:"#918a9e",txM:"#5e5870",red:"#ff4757",on:"#2ed573",sec:"#a855f7",secD:"#7e22ce",secG:"#d8b4fe",rose:"#f43f5e",ff:"'Cormorant Garamond',Georgia,serif",fb:"'Raleway','Helvetica Neue',sans-serif"};

  if(panicMode)return(<div style={{fontFamily:"Arial",background:"#f5f5f5",minHeight:"100vh",padding:32}}><h2 style={{color:"#333"}}>Weather — Dallas, TX</h2><p style={{color:"#666"}}>72°F Partly Cloudy</p><p style={{color:"#666"}}>Sat: 78°F Sunny · Sun: 65°F Rain</p><button onClick={()=>setPanicMode(false)} style={{position:"fixed",bottom:8,right:8,background:"transparent",border:"none",color:"#eee",fontSize:8,cursor:"pointer"}}>·</button></div>);

  const openViewer = (photos, index, title) => { setViewerIdx(index); setViewer({photos, title}); };

  // Viewer
  const Viewer=()=>{if(!viewer)return null;const{photos,title}=viewer;const ci=viewerIdx;
    return(<div className="vc-fade" style={{position:"fixed",inset:0,background:"rgba(0,0,0,.95)",zIndex:600,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:16}} onClick={()=>setViewer(null)}>
      <div style={{color:C.txD,fontSize:11,letterSpacing:1.5,textTransform:"uppercase",marginBottom:12}}>{title} · {ci+1}/{photos.length}</div>
      <div style={{position:"relative",maxWidth:"85vw",maxHeight:"70vh"}} onClick={e=>e.stopPropagation()}>
        <img src={photos[ci]} style={{maxWidth:"85vw",maxHeight:"70vh",borderRadius:12,border:`1px solid ${C.bd}`}} alt="" />
        {photos.length>1&&<><button onClick={()=>setViewerIdx((ci-1+photos.length)%photos.length)} style={{position:"absolute",left:-40,top:"50%",transform:"translateY(-50%)",background:`${C.sf}cc`,border:"none",color:C.gold,fontSize:28,cursor:"pointer",borderRadius:"50%",width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
        <button onClick={()=>setViewerIdx((ci+1)%photos.length)} style={{position:"absolute",right:-40,top:"50%",transform:"translateY(-50%)",background:`${C.sf}cc`,border:"none",color:C.gold,fontSize:28,cursor:"pointer",borderRadius:"50%",width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center"}}>›</button></>}
      </div>
      <button onClick={()=>setViewer(null)} style={{marginTop:20,background:"none",border:`1px solid ${C.gold}44`,color:C.gold,padding:"8px 24px",borderRadius:20,cursor:"pointer",fontFamily:C.fb,fontSize:12,letterSpacing:1}}>Close</button>
    </div>);
  };

  // Styles
  const pg={fontFamily:C.fb,color:C.tx,minHeight:"100vh",fontSize:14,position:"relative"};
  const Btn=({sec,children,onClick,full,small,outline,glow,style:sx,...rest})=>{
    const base={border:"none",borderRadius:small?20:6,fontSize:small?11:13,fontWeight:600,cursor:"pointer",letterSpacing:small?0.8:1,textTransform:"uppercase",fontFamily:C.fb,padding:small?"6px 14px":"12px 28px",transition:"all 0.3s",display:"inline-flex",alignItems:"center",gap:6,justifyContent:"center",...(full?{width:"100%"}:{})};
    if(outline)return<button style={{...base,background:"transparent",color:sec?C.secG:C.gold,border:`1px solid ${sec?C.sec+"55":C.gold+"44"}`,...sx}} onClick={onClick} {...rest}>{children}</button>;
    return<button className={glow?(sec?"vc-glow-secret":"vc-glow"):""} style={{...base,background:sec?`linear-gradient(135deg,${C.sec},${C.secD})`:`linear-gradient(135deg,#d4a843,#c49630,#b8862b)`,color:sec?"#fff":"#0a0a0f",boxShadow:sec?`0 4px 15px ${C.sec}33`:`0 4px 15px ${C.gold}33`,...sx}} onClick={onClick} {...rest}>{children}</button>;
  };

  const Card=({sec,children,className,onClick,style:sx,...rest})=><div className={`${sec?"vc-card-secret":"vc-card"} vc-slide ${className||""}`} style={{background:sec?`linear-gradient(145deg,${C.sf},#1a1428,${C.sf})`:C.sf,border:`1px solid ${sec?C.sec+"20":C.bd}`,borderRadius:12,padding:20,marginBottom:14,transition:"all 0.3s",cursor:onClick?"pointer":"default",...sx}} onClick={onClick} {...rest}>{children}</div>;

  const Avt=({src,size=48,sc,name,tonight})=>{
    const wrapper={position:"relative",flexShrink:0};
    const imgStyle={width:size,height:size,borderRadius:"50%",objectFit:"cover",border:`2px solid ${sc?C.sec+"66":C.gold+"66"}`};
    const placeholderStyle={width:size,height:size,borderRadius:"50%",background:`linear-gradient(135deg,${sc?C.sec:C.gold}55,${sc?C.sec:C.gold}15)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.38,color:sc?C.secG:C.gold,fontFamily:C.ff,border:`2px solid ${sc?C.sec+"33":C.gold+"33"}`};
    return<div style={wrapper} className={tonight?"vc-tonight":""}>{src?<img src={src} style={imgStyle} alt="" />:<div style={placeholderStyle}>{name?.[0]?.toUpperCase()||"?"}</div>}</div>;
  };

  const Dot=({on})=><span style={{width:8,height:8,borderRadius:"50%",background:on?C.on:C.txM,display:"inline-block",marginRight:6,boxShadow:on?`0 0 6px ${C.on}`:""}} />;

  const HotBadge=({score})=>{if(!score)return null;const color=score>=90?"#ff4757":score>=80?C.gold:"#aaa";return<span style={{background:`${color}20`,color,padding:"2px 8px",borderRadius:10,fontSize:10,fontWeight:700,letterSpacing:0.5}}>🔥 {score}</span>;};

  const Tag=({active,sec,children,onClick})=><span style={{display:"inline-block",padding:"5px 12px",borderRadius:20,fontSize:11,cursor:onClick?"pointer":"default",letterSpacing:0.5,margin:2,border:`1px solid ${active?(sec?C.sec:C.gold):C.bd}`,background:active?(sec?`${C.sec}18`:`${C.gold}15`):"transparent",color:active?(sec?C.secG:C.gold):C.txD,fontFamily:C.fb,transition:"all 0.2s"}} onClick={onClick}>{children}</span>;

  const Badge=({sec,children})=><span style={{display:"inline-block",padding:"2px 8px",borderRadius:10,fontSize:10,letterSpacing:0.8,textTransform:"uppercase",fontWeight:600,background:sec?`${C.sec}22`:`${C.gold}18`,color:sec?C.secG:C.gold}}>{children}</span>;

  const MobileNav=()=>user?(
    <div className="vc-mobile-nav" style={{position:"fixed",bottom:0,left:0,right:0,background:`${C.bg}f5`,backdropFilter:"blur(20px)",borderTop:`1px solid ${C.bd}`,display:"flex",justifyContent:"space-around",padding:"8px 0 max(8px, env(safe-area-inset-bottom))",zIndex:100}}>
      {[{v:"home",i:"🏠",l:"Home"},{v:"browse",i:"🔍",l:"Browse"},{v:"hot",i:"🔥",l:"Hot"},{v:"messages",i:"💬",l:"Chat"},{v:"profile",i:"👤",l:"Me"}].map(n=>
        <button key={n.v} onClick={()=>setView(n.v)} style={{background:"none",border:"none",display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",padding:"4px 8px"}}>
          <span style={{fontSize:20}}>{n.i}</span>
          <span style={{fontSize:9,letterSpacing:0.5,textTransform:"uppercase",color:view===n.v?C.gold:C.txM,fontFamily:C.fb,fontWeight:view===n.v?600:400}}>{n.l}</span>
        </button>
      )}
    </div>
  ):null;

  const DesktopNav=()=>(
    <nav className="vc-desktop-nav" style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 0",borderBottom:`1px solid ${C.bd}`,marginBottom:20,flexWrap:"wrap",gap:8}}>
      <div style={{fontFamily:C.ff,fontSize:22,fontWeight:600,color:C.gold,letterSpacing:3,textTransform:"uppercase",cursor:"pointer"}} onClick={()=>setView("home")}>Velvet Circle</div>
      <div style={{display:"flex",gap:2,alignItems:"center"}}>
        {[{v:"home",l:"Home"},{v:"browse",l:"Browse"},{v:"hot",l:"🔥 Hot"},{v:"messages",l:"Messages"},{v:"photos",l:"Photos"},{v:"profile",l:"Profile"}].map(n=>
          <button key={n.v} style={{background:view===n.v?`${C.gold}12`:"none",border:"none",color:view===n.v?C.gold:C.txD,fontSize:12,letterSpacing:1.2,textTransform:"uppercase",cursor:"pointer",padding:"8px 14px",fontFamily:C.fb,borderRadius:4}} onClick={()=>setView(n.v)}>{n.l}</button>
        )}
        <button style={{background:"none",border:"none",color:C.red,fontSize:12,letterSpacing:1.2,textTransform:"uppercase",cursor:"pointer",padding:"8px 14px",fontFamily:C.fb}} onClick={handleLogout}>Exit</button>
      </div>
    </nav>
  );

  const PanicBtn=()=><button onClick={()=>setPanicMode(true)} style={{position:"fixed",bottom:70,right:12,background:`${C.sf}ee`,border:`1px solid ${C.bd}`,borderRadius:20,padding:"8px 16px",fontSize:11,cursor:"pointer",zIndex:99,letterSpacing:1,color:C.txM,fontFamily:C.fb}}>⚡ EXIT</button>;

  const Notif=()=>notif?<div className="vc-slide" style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",background:`${C.sf}f5`,backdropFilter:"blur(10px)",border:`1px solid ${C.gold}44`,borderRadius:20,padding:"10px 24px",color:C.gold,fontSize:13,zIndex:300,fontFamily:C.fb,boxShadow:`0 8px 30px ${C.gold}15`}}>{notif}</div>:null;

  const Section=({title,sec,right,children})=><div style={{marginBottom:24}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><h3 style={{fontFamily:C.ff,fontSize:20,fontWeight:400,color:sec?C.secG:C.gold,margin:0}}>{title}</h3>{right}</div>{children}</div>;

  const PhotoGallery=({photos,title,locked,sc,onRequest})=>{
    if(!photos?.length)return<p style={{color:C.txM,fontSize:12}}>None yet.</p>;
    if(locked)return<div style={{padding:24,borderRadius:12,border:`1px dashed ${sc?C.sec+"44":C.gold+"33"}`,textAlign:"center"}}><div style={{fontSize:32,marginBottom:8}}>🔒</div><p style={{color:C.txD,fontSize:13,marginBottom:12}}>{photos.length} private photo{photos.length!==1?"s":""}</p>{onRequest&&<Btn sec={sc} small onClick={onRequest}>Request Access</Btn>}</div>;
    return<div className="vc-grid-photos" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(85px,1fr))",gap:6}}>{photos.map((p,i)=><div key={i} style={{position:"relative",cursor:"pointer",borderRadius:8,overflow:"hidden",aspectRatio:"1",border:`1px solid ${C.bd}`}} onClick={()=>openViewer(photos,i,title)}><img src={p} style={{width:"100%",height:"100%",objectFit:"cover"}} alt="" /></div>)}</div>;
  };

  // ─── SPLASH ───
  if(view==="splash")return(
    <div style={pg} className="vc-gradient-bg">
      <div style={{position:"fixed",inset:0,background:"radial-gradient(ellipse at 50% 0%,rgba(212,168,67,0.06) 0%,transparent 60%)",pointerEvents:"none"}} />
      <div className="vc-container" style={{maxWidth:900,margin:"0 auto",padding:"0 20px",position:"relative",zIndex:1,textAlign:"center",paddingTop:"8vh"}}>
        <div className="vc-float" style={{fontSize:11,letterSpacing:8,textTransform:"uppercase",color:C.gD,marginBottom:20}}>⬥ Members Only ⬥</div>
        <h1 className="vc-hero-title" style={{fontFamily:C.ff,fontSize:60,fontWeight:300,color:C.tx,marginBottom:8,lineHeight:1.05}}>Velvet <span style={{color:C.gold,textShadow:`0 0 40px ${C.gold}33`}}>Circle</span></h1>
        <div style={{width:80,height:2,background:`linear-gradient(90deg,transparent,${C.gold},transparent)`,margin:"20px auto"}} />
        <p style={{color:C.txD,fontSize:16,lineHeight:1.8,maxWidth:500,margin:"0 auto 48px",fontFamily:C.fb}}>The private playground for adventurous adults. Swingers. Secret affairs. No judgment. Total discretion.</p>
        <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap",marginBottom:56}}>
          <Btn glow onClick={()=>{setRegStep(0);setForm({});setView("register");}}>Join Free</Btn>
          <Btn outline onClick={()=>setView("login")}>Sign In</Btn>
        </div>
        <div className="vc-grid-2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,maxWidth:700,margin:"0 auto 56px"}}>
          <Card><div style={{fontSize:36,marginBottom:12}}>🔥</div><h3 style={{fontFamily:C.ff,fontSize:22,color:C.gold,marginBottom:8}}>Lifestyle & Swingers</h3><p style={{color:C.txD,fontSize:13,lineHeight:1.6}}>Couples, singles, unicorns. Full swap, soft swap, parties, clubs, travel. Your lifestyle, your rules.</p><div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:14}}>{["Couples","Singles","Parties","Clubs","Travel"].map(t=><Badge key={t}>{t}</Badge>)}</div></Card>
          <Card sec><div style={{fontSize:36,marginBottom:12}}>🤫</div><h3 style={{fontFamily:C.ff,fontSize:22,color:C.secG,marginBottom:8}}>Our Secret</h3><p style={{color:C.txD,fontSize:13,lineHeight:1.6}}>Married. Committed. Looking for excitement on the side. Ghost mode, vanishing messages, panic button.</p><div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:14}}>{["Married","Affairs","Hall Pass","Ghost Mode"].map(t=><Badge sec key={t}>{t}</Badge>)}</div></Card>
        </div>
        <div className="vc-grid-4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,maxWidth:700,margin:"0 auto 48px"}}>
          {[{i:"🔥",t:"Hot or Not",d:"Rate & get rated"},{i:"👻",t:"Ghost Mode",d:"Zero face photos"},{i:"🎉",t:"Party Finder",d:"Events near you"},{i:"🔒",t:"Panic Button",d:"Instant hide"},{i:"📸",t:"Private Vault",d:"Locked galleries"},{i:"✈️",t:"Travel Dates",d:"Play on the road"},{i:"💬",t:"Secret Chat",d:"Vanishing messages"},{i:"🌙",t:"Tonight Mode",d:"Who's free now?"}].map((f,i)=>
            <div key={i} className="vc-card vc-shimmer" style={{background:C.sf,border:`1px solid ${C.bd}`,borderRadius:10,padding:14,textAlign:"center",transition:"all 0.3s"}}>
              <div style={{fontSize:22,marginBottom:6}}>{f.i}</div>
              <div style={{color:C.gold,fontSize:10,fontWeight:700,letterSpacing:0.8,marginBottom:3}}>{f.t}</div>
              <div style={{color:C.txM,fontSize:10}}>{f.d}</div>
            </div>
          )}
        </div>
        <div style={{color:C.txM,fontSize:10,letterSpacing:2,paddingBottom:32,textTransform:"uppercase"}}>🔐 Password Protected · No Social Media · Discreet Billing · Your Secret Dies Here</div>
      </div>
      <PanicBtn />
    </div>
  );

  // ─── LOGIN ───
  if(view==="login")return(
    <div style={pg} className="vc-gradient-bg"><Notif />
      <div className="vc-container" style={{maxWidth:400,margin:"0 auto",padding:"0 20px",paddingTop:"10vh"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontFamily:C.ff,fontSize:24,fontWeight:600,color:C.gold,letterSpacing:3,textTransform:"uppercase",cursor:"pointer"}} onClick={()=>setView("splash")}>Velvet Circle</div>
          <p style={{color:C.txD,fontSize:13,marginTop:8}}>Sign in to your account</p>
        </div>
        <Card className="vc-card-inner">
          <div style={{marginBottom:16}}><label style={{display:"block",color:C.txD,fontSize:11,letterSpacing:1.5,textTransform:"uppercase",marginBottom:6}}>Username</label><input style={{background:C.sf2,border:`1px solid ${C.bd}`,borderRadius:6,padding:"12px 14px",color:C.tx,fontSize:14,width:"100%",boxSizing:"border-box",fontFamily:C.fb,outline:"none"}} value={loginForm.username} onChange={e=>setLoginForm(f=>({...f,username:e.target.value}))} /></div>
          <div style={{marginBottom:20}}><label style={{display:"block",color:C.txD,fontSize:11,letterSpacing:1.5,textTransform:"uppercase",marginBottom:6}}>Password</label><div style={{position:"relative"}}><input style={{background:C.sf2,border:`1px solid ${C.bd}`,borderRadius:6,padding:"12px 14px",paddingRight:50,color:C.tx,fontSize:14,width:"100%",boxSizing:"border-box",fontFamily:C.fb,outline:"none"}} type={showPw?"text":"password"} value={loginForm.password} onChange={e=>setLoginForm(f=>({...f,password:e.target.value}))} onKeyDown={e=>{if(e.key==="Enter")handleLogin();}} /><button onClick={()=>setShowPw(!showPw)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:C.txM,fontSize:12,cursor:"pointer"}}>{showPw?"Hide":"Show"}</button></div></div>
          <Btn full onClick={handleLogin}>Sign In</Btn>
          <div style={{textAlign:"center",marginTop:16}}><button style={{background:"none",border:"none",color:C.gold,fontSize:12,cursor:"pointer",fontFamily:C.fb}} onClick={()=>{setForm({});setRegStep(0);setView("register");}}>New? Join free →</button></div>
          <div style={{marginTop:20,padding:12,borderRadius:8,background:`${C.gold}06`,border:`1px solid ${C.gold}12`}}><div style={{color:C.txM,fontSize:10,lineHeight:1.7}}><strong style={{color:C.txD}}>Demo:</strong> VelvetNights/velvet123 · SilkAndSatin/silk789 · QuietStorm/quiet123 · GardenOfSecrets/garden123 · SatinWhisper/satin123</div></div>
        </Card>
      </div>
      <PanicBtn />
    </div>
  );

  // ─── REGISTER ───
  if(view==="register"){
    const isSec=isDiscreetType(form.profileType);
    const inp={background:C.sf2,border:`1px solid ${C.bd}`,borderRadius:6,padding:"12px 14px",color:C.tx,fontSize:14,width:"100%",boxSizing:"border-box",fontFamily:C.fb,outline:"none"};
    const lbl={display:"block",color:C.txD,fontSize:11,letterSpacing:1.5,textTransform:"uppercase",marginBottom:6};
    const steps=isSec?["Account","About","Situation","Seeking","Photos","Boundaries"]:["Account","About","Lifestyle","Photos","Vibes & Prefs"];
    const mx=steps.length-1;
    return(
      <div style={pg} className="vc-gradient-bg"><Notif />
        <div className="vc-container" style={{maxWidth:560,margin:"0 auto",padding:"0 16px",paddingTop:"4vh",paddingBottom:40}}>
          <div style={{textAlign:"center",marginBottom:20}}>
            <div style={{fontFamily:C.ff,fontSize:22,fontWeight:600,color:C.gold,letterSpacing:3,cursor:"pointer"}} onClick={()=>setView("splash")}>VELVET CIRCLE</div>
            {isSec&&<div style={{marginTop:6,fontSize:10,letterSpacing:2,color:C.secG}}>🤫 OUR SECRET MODE</div>}
          </div>
          <div style={{display:"flex",gap:3,marginBottom:28}}>{steps.map((_,i)=><div key={i} style={{flex:1,height:3,borderRadius:2,background:i<=regStep?(isSec?C.sec:C.gold):C.bd}} />)}</div>
          <h2 style={{fontFamily:C.ff,fontSize:26,fontWeight:400,color:C.tx,marginBottom:6}}>{steps[regStep]}</h2>
          <Card sec={isSec} className="vc-card-inner">
            {regStep===0&&(<>
              <div style={{marginBottom:14}}><label style={lbl}>Username</label><input style={inp} placeholder="Choose untraceable name" value={form.username||""} onChange={e=>uf("username",e.target.value)} /></div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
                <div><label style={lbl}>Password</label><input style={inp} type="password" placeholder="Min 6 chars" value={form.password||""} onChange={e=>uf("password",e.target.value)} /></div>
                <div><label style={lbl}>Confirm</label><input style={inp} type="password" value={form.confirmPassword||""} onChange={e=>uf("confirmPassword",e.target.value)} /></div>
              </div>
              <div style={{marginBottom:14}}><label style={lbl}>Profile Type</label>
                <select style={inp} value={form.profileType||""} onChange={e=>uf("profileType",e.target.value)}>
                  <option value="">Select...</option>
                  <optgroup label="── Lifestyle ──">{["Couple (M/F)","Couple (M/M)","Couple (F/F)","Single Male","Single Female","Single Non-Binary","Poly Group"].map(t=><option key={t}>{t}</option>)}</optgroup>
                  <optgroup label="── 🤫 Our Secret ──">{["Married Male — Discreet","Married Female — Discreet","Committed Male — Discreet","Committed Female — Discreet","Attached Male — Hall Pass","Attached Female — Hall Pass"].map(t=><option key={t}>{t}</option>)}</optgroup>
                </select>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div><label style={lbl}>Age</label><input style={inp} type="number" value={form.age1||""} onChange={e=>uf("age1",parseInt(e.target.value)||"")} /></div>
                <div><label style={lbl}>{isSec?"Area":"City"}</label><input style={inp} value={form.city||""} onChange={e=>uf("city",e.target.value)} /></div>
              </div>
              <div style={{marginTop:10}}><label style={lbl}>State</label><input style={inp} value={form.state||""} onChange={e=>uf("state",e.target.value)} /></div>
            </>)}
            {regStep===1&&(<>
              <div style={{marginBottom:14}}><label style={lbl}>Tagline</label><input style={inp} placeholder={isSec?"Intriguing, revealing nothing...":"Something that makes them stop scrolling..."} value={form.tagline||""} onChange={e=>uf("tagline",e.target.value)} maxLength={80} /></div>
              <div style={{marginBottom:14}}><label style={lbl}>Bio</label><textarea style={{...inp,minHeight:90,resize:"vertical"}} placeholder="What makes you irresistible?" value={form.bio||""} onChange={e=>uf("bio",e.target.value)} /></div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div><label style={lbl}>Body</label><select style={inp} value={form.bodyType1||""} onChange={e=>uf("bodyType1",e.target.value)}><option value="">Select...</option>{BODY_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
                <div><label style={lbl}>Experience</label><select style={inp} value={form.experience||""} onChange={e=>uf("experience",e.target.value)}><option value="">Select...</option>{EXPERIENCE_LEVELS.map(t=><option key={t}>{t}</option>)}</select></div>
              </div>
            </>)}
            {!isSec&&regStep===2&&(<><label style={lbl}>Lifestyle Interests</label><div style={{marginBottom:16}}>{LIFESTYLE_OPTIONS.map(o=><Tag key={o} active={(form.lifestylePrefs||[]).includes(o)} onClick={()=>ta("lifestylePrefs",o)}>{o}</Tag>)}</div><label style={lbl}>Kinks</label><div>{KINKS.map(o=><Tag key={o} active={(form.kinks||[]).includes(o)} onClick={()=>ta("kinks",o)}>{o}</Tag>)}</div></>)}
            {!isSec&&regStep===3&&(<>
              <div style={{marginBottom:20}}>
                <label style={lbl}>Profile Picture</label>
                <div style={{display:"flex",alignItems:"center",gap:14}}>
                  {form.profilePhoto?<div style={{position:"relative"}}><img src={form.profilePhoto} style={{width:80,height:80,borderRadius:"50%",objectFit:"cover",border:`2px solid ${C.gold}55`}} alt="" /><button onClick={()=>uf("profilePhoto",null)} style={{position:"absolute",top:-4,right:-4,background:"#000",color:"#fff",border:"none",borderRadius:"50%",width:20,height:20,fontSize:12,cursor:"pointer"}}>×</button></div>
                  :<label style={{width:80,height:80,borderRadius:"50%",border:`2px dashed ${C.gold}33`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:28}}>📷<input type="file" accept="image/*" style={{display:"none"}} onChange={e=>handlePhotoUpload(e,"profile")} /></label>}
                </div>
              </div>
              <label style={lbl}>Public Photos</label>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(70px,1fr))",gap:6,marginBottom:16}}>{(form.publicPhotos||[]).map((p,i)=><div key={i} style={{position:"relative",borderRadius:6,overflow:"hidden",aspectRatio:"1",border:`1px solid ${C.bd}`}}><img src={p} style={{width:"100%",height:"100%",objectFit:"cover"}} alt="" /><button onClick={()=>removePhoto("public",i)} style={{position:"absolute",top:2,right:2,background:"#000c",color:"#fff",border:"none",borderRadius:"50%",width:18,height:18,fontSize:11,cursor:"pointer"}}>×</button></div>)}<label style={{borderRadius:6,aspectRatio:"1",border:`2px dashed ${C.gold}22`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:18,color:C.txM}}>+<input type="file" accept="image/*" multiple style={{display:"none"}} onChange={e=>handlePhotoUpload(e,"public")} /></label></div>
              <label style={lbl}>🔒 Private Photos</label>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(70px,1fr))",gap:6}}>{(form.privatePhotos||[]).map((p,i)=><div key={i} style={{position:"relative",borderRadius:6,overflow:"hidden",aspectRatio:"1",border:`1px solid ${C.bd}`}}><img src={p} style={{width:"100%",height:"100%",objectFit:"cover"}} alt="" /><button onClick={()=>removePhoto("private",i)} style={{position:"absolute",top:2,right:2,background:"#000c",color:"#fff",border:"none",borderRadius:"50%",width:18,height:18,fontSize:11,cursor:"pointer"}}>×</button></div>)}<label style={{borderRadius:6,aspectRatio:"1",border:`2px dashed ${C.sec}22`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:18,color:C.txM}}>+<input type="file" accept="image/*" multiple style={{display:"none"}} onChange={e=>handlePhotoUpload(e,"private")} /></label></div>
            </>)}
            {!isSec&&regStep===4&&(<>
              <label style={lbl}>Your Vibe</label><div style={{marginBottom:16}}>{VIBE_TAGS.map(o=><Tag key={o} active={(form.vibes||[]).includes(o)} onClick={()=>ta("vibes",o)}>{o}</Tag>)}</div>
              <label style={lbl}>Meeting Style</label><div style={{marginBottom:16}}>{MEETING_PREFS.map(o=><Tag key={o} active={(form.meetingPrefs||[]).includes(o)} onClick={()=>ta("meetingPrefs",o)}>{o}</Tag>)}</div>
              <label style={lbl}>Party Interests</label><div style={{marginBottom:16}}>{PARTY_TYPES.map(o=><Tag key={o} active={(form.partyInterests||[]).includes(o)} onClick={()=>ta("partyInterests",o)}>{o}</Tag>)}</div>
              <label style={lbl}>Travel</label><div>{TRAVEL_DATES.map(o=><Tag key={o} active={(form.travelDates||[]).includes(o)} onClick={()=>ta("travelDates",o)}>{o}</Tag>)}</div>
            </>)}
            {isSec&&regStep===2&&(<>
              <div style={{marginBottom:14}}><label style={lbl}>Status</label><select style={inp} value={form.relationshipStatus||""} onChange={e=>uf("relationshipStatus",e.target.value)}><option value="">Select...</option>{RELATIONSHIP_STATUS.map(t=><option key={t}>{t}</option>)}</select></div>
              <label style={lbl}>Discretion</label><div style={{marginBottom:14}}>{DISCRETION_LEVELS.map(o=><Tag key={o} sec active={form.discretionLevel===o} onClick={()=>uf("discretionLevel",o)}>{o}</Tag>)}</div>
              <label style={lbl}>Availability</label><div style={{marginBottom:14}}>{AVAILABILITY_WINDOWS.map(o=><Tag key={o} sec active={(form.availabilityWindows||[]).includes(o)} onClick={()=>ta("availabilityWindows",o)}>{o}</Tag>)}</div>
              <label style={lbl}>Hosting</label><div>{HOSTING_OPTIONS.map(o=><Tag key={o} sec active={(form.hostingOptions||[]).includes(o)} onClick={()=>ta("hostingOptions",o)}>{o}</Tag>)}</div>
            </>)}
            {isSec&&regStep===3&&(<>
              <label style={lbl}>Seeking</label><div style={{marginBottom:14}}>{SEEKING_OPTIONS.map(o=><Tag key={o} sec active={(form.seekingType||[]).includes(o)} onClick={()=>ta("seekingType",o)}>{o}</Tag>)}</div>
              <label style={lbl}>Kinks</label><div style={{marginBottom:14}}>{KINKS.map(o=><Tag key={o} sec active={(form.kinks||[]).includes(o)} onClick={()=>ta("kinks",o)}>{o}</Tag>)}</div>
              <label style={lbl}>Meeting</label><div>{MEETING_PREFS.map(o=><Tag key={o} sec active={(form.meetingPrefs||[]).includes(o)} onClick={()=>ta("meetingPrefs",o)}>{o}</Tag>)}</div>
            </>)}
            {isSec&&regStep===4&&(<>
              <div style={{marginBottom:20}}>
                <label style={lbl}>Profile Pic (optional)</label>
                <div style={{display:"flex",alignItems:"center",gap:14}}>
                  {form.profilePhoto?<div style={{position:"relative"}}><img src={form.profilePhoto} style={{width:80,height:80,borderRadius:"50%",objectFit:"cover",border:`2px solid ${C.sec}55`}} alt="" /><button onClick={()=>uf("profilePhoto",null)} style={{position:"absolute",top:-4,right:-4,background:"#000",color:"#fff",border:"none",borderRadius:"50%",width:20,height:20,fontSize:12,cursor:"pointer"}}>×</button></div>
                  :<label style={{width:80,height:80,borderRadius:"50%",border:`2px dashed ${C.sec}33`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:28}}>👻<input type="file" accept="image/*" style={{display:"none"}} onChange={e=>handlePhotoUpload(e,"profile")} /></label>}
                  <div style={{color:C.txD,fontSize:11}}>Ultra discreet = no face required</div>
                </div>
              </div>
              <label style={lbl}>🔒 Private Photos Only</label>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(70px,1fr))",gap:6}}>{(form.privatePhotos||[]).map((p,i)=><div key={i} style={{position:"relative",borderRadius:6,overflow:"hidden",aspectRatio:"1",border:`1px solid ${C.bd}`}}><img src={p} style={{width:"100%",height:"100%",objectFit:"cover"}} alt="" /><button onClick={()=>removePhoto("private",i)} style={{position:"absolute",top:2,right:2,background:"#000c",color:"#fff",border:"none",borderRadius:"50%",width:18,height:18,fontSize:11,cursor:"pointer"}}>×</button></div>)}<label style={{borderRadius:6,aspectRatio:"1",border:`2px dashed ${C.sec}22`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:18,color:C.txM}}>+<input type="file" accept="image/*" multiple style={{display:"none"}} onChange={e=>handlePhotoUpload(e,"private")} /></label></div>
            </>)}
            {isSec&&regStep===5&&(<>
              <label style={lbl}>Boundaries</label><div style={{marginBottom:14}}>{SECRET_BOUNDARIES.map(o=><Tag key={o} sec active={(form.secretBoundaries||[]).includes(o)} onClick={()=>ta("secretBoundaries",o)}>{o}</Tag>)}</div>
              <label style={lbl}>Communication</label><div>{COMMUNICATION_PREFS.map(o=><Tag key={o} sec active={(form.commPrefs||[]).includes(o)} onClick={()=>ta("commPrefs",o)}>{o}</Tag>)}</div>
            </>)}
            <div style={{display:"flex",justifyContent:"space-between",marginTop:24}}>
              {regStep>0?<Btn outline sec={isSec} onClick={()=>setRegStep(regStep-1)}>Back</Btn>:<Btn outline onClick={()=>setView("splash")}>Cancel</Btn>}
              {regStep<mx?<Btn sec={isSec} onClick={()=>setRegStep(regStep+1)}>Next</Btn>:<Btn sec={isSec} glow onClick={handleRegister}>{isSec?"Enter":"Create Account"}</Btn>}
            </div>
          </Card>
        </div>
        <PanicBtn />
      </div>
    );
  }

  if(!user){setView("splash");return null;}

  const PCard=({profile:p,compact})=>{if(!p)return null;const sc=isDiscreetType(p.profileType);
    return<Card sec={sc} onClick={()=>{setSelProfile(p);setView("viewProfile");}} style={{display:"flex",gap:compact?12:16,alignItems:compact?"center":"flex-start",padding:compact?14:20}}>
      <Avt src={p.profilePhoto} size={compact?42:54} sc={sc} name={p.username} tonight={p.lookingTonight} />
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3,flexWrap:"wrap"}}>
          <span style={{fontFamily:C.ff,fontSize:compact?15:18,color:C.tx}}>{p.username}</span>
          {p.verified&&<Badge>✓</Badge>}{sc&&<Badge sec>🤫</Badge>}<HotBadge score={p.hotScore} />
          <span style={{fontSize:11,color:C.txM,display:"flex",alignItems:"center"}}><Dot on={p.online} />{p.online?"Now":p.lastActive}</span>
        </div>
        {!compact&&<><div style={{color:C.txD,fontSize:12,marginBottom:5}}>{p.profileType} · {p.age1}{p.age2?`/${p.age2}`:""} · {p.city}</div>
        <div style={{color:sc?C.secG:C.gold,fontSize:13,fontStyle:"italic",fontFamily:C.ff,marginBottom:6}}>{p.tagline}</div>
        {p.vibes?.length>0&&<div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{p.vibes.slice(0,3).map(v=><span key={v} style={{fontSize:10,padding:"2px 8px",borderRadius:10,background:`${sc?C.sec:C.gold}10`,color:sc?C.secG:C.gL}}>{v}</span>)}</div>}</>}
        {compact&&<div style={{color:C.txD,fontSize:12}}>{p.profileType} · {p.city}</div>}
      </div>
      <div style={{color:C.txM,fontSize:10,textAlign:"right",flexShrink:0,lineHeight:1.8}}>📸{(p.publicPhotos||[]).length}<br/>🔒{(p.privatePhotos||[]).length}{p.lookingTonight&&<><br/><span style={{color:C.red}}>🔥 Tonight</span></>}</div>
    </Card>;
  };

  // ─── HOME ───
  if(view==="home"){const cv=getConvos();const sc=isDiscreetType(user.profileType);
    return(<div style={pg} className="vc-gradient-bg"><div className="vc-container" style={{maxWidth:900,margin:"0 auto",padding:"0 16px",paddingBottom:80}}><DesktopNav />
      <div className="vc-slide" style={{display:"flex",alignItems:"center",gap:16,marginBottom:28}}>
        <Avt src={user.profilePhoto} size={64} sc={sc} name={user.username} />
        <div><h1 style={{fontFamily:C.ff,fontSize:28,fontWeight:400,color:C.tx,margin:0}}>Hey, <span style={{color:sc?C.secG:C.gold}}>{user.username}</span></h1><p style={{color:C.txD,fontSize:13,margin:"4px 0 0"}}>{sc?"Your secret is safe.":"What are you in the mood for?"}</p></div>
      </div>
      <div className="vc-grid-4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:28}}>
        {[{n:profiles.filter(p=>!isDiscreetType(p.profileType)&&p.id!==user.id).length,l:"Lifestyle",i:"🔥"},{n:profiles.filter(p=>isDiscreetType(p.profileType)&&p.id!==user.id).length,l:"Secret",i:"🤫"},{n:profiles.filter(p=>p.online&&p.id!==user.id).length,l:"Online",i:"🟢"},{n:profiles.filter(p=>p.lookingTonight&&p.id!==user.id).length,l:"Tonight",i:"🌙"}].map((x,i)=>
          <Card key={i} style={{textAlign:"center",padding:14,marginBottom:0}}><div style={{fontSize:16,marginBottom:2}}>{x.i}</div><div style={{fontSize:22,fontFamily:C.ff,color:C.gold,fontWeight:600}}>{x.n}</div><div style={{fontSize:9,color:C.txM,letterSpacing:1,textTransform:"uppercase"}}>{x.l}</div></Card>
        )}
      </div>
      <div className="vc-grid-2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:28}}>
        <Btn full glow onClick={()=>{setFilters(f=>({...f,category:"tonight"}));setView("browse");}}>🌙 Who's Free Tonight</Btn>
        <Btn full sec glow onClick={()=>{setFilters(f=>({...f,category:"discreet"}));setView("browse");}}>🤫 Our Secret</Btn>
      </div>
      <Section title="🔥 Online Now"><div>{profiles.filter(p=>p.online&&p.id!==user.id).slice(0,5).map(p=><PCard key={p.id} profile={p} compact />)}</div></Section>
      <Section title="💬 Recent Chats" right={cv.length>0&&<Btn small outline onClick={()=>setView("messages")}>See All</Btn>}>
        {cv.length===0?<p style={{color:C.txM,fontSize:13}}>No conversations yet. Browse and connect!</p>:cv.slice(0,3).map(c=>{const csc=isDiscreetType(c.other.profileType);return<Card key={c.key} sec={csc} onClick={()=>{setActiveConvo(c.otherId);setView("conversation");}} style={{display:"flex",alignItems:"center",gap:12,padding:14}}>
          <Avt src={c.other.profilePhoto} size={40} sc={csc} name={c.other.username} />
          <div style={{flex:1,minWidth:0}}><div style={{fontFamily:C.ff,fontSize:15,color:C.tx}}>{c.other.username}</div><div style={{color:C.txD,fontSize:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.lastMsg.from===user.id?"You: ":""}{c.lastMsg.text}</div></div>
          <Badge sec={csc}>{c.count}</Badge>
        </Card>;})}
      </Section>
    </div><MobileNav /><PanicBtn /><Notif /><Viewer /></div>);
  }

  // ─── HOT / TRENDING ───
  if(view==="hot"){
    const sorted=[...profiles].filter(p=>p.id!==user.id).sort((a,b)=>(b.hotScore||0)-(a.hotScore||0));
    const tonight=profiles.filter(p=>p.lookingTonight&&p.id!==user.id);
    return(<div style={pg} className="vc-gradient-bg"><div className="vc-container" style={{maxWidth:900,margin:"0 auto",padding:"0 16px",paddingBottom:80}}><DesktopNav />
      <div style={{display:"flex",gap:8,marginBottom:20}}>
        {[{k:"trending",l:"🔥 Trending"},{k:"tonight",l:"🌙 Tonight"},{k:"newMembers",l:"✨ New"}].map(t=>
          <button key={t.k} onClick={()=>setHotTab(t.k)} style={{padding:"8px 18px",borderRadius:20,fontSize:12,cursor:"pointer",fontFamily:C.fb,border:hotTab===t.k?`1px solid ${C.gold}`:`1px solid ${C.bd}`,background:hotTab===t.k?`${C.gold}15`:"transparent",color:hotTab===t.k?C.gold:C.txD,letterSpacing:0.5}}>{t.l}</button>
        )}
      </div>
      {hotTab==="trending"&&<>{sorted.map((p,i)=><div key={p.id} style={{position:"relative"}}>{i<3&&<div style={{position:"absolute",top:8,left:8,zIndex:2,background:`${C.gold}dd`,color:"#000",padding:"2px 10px",borderRadius:10,fontSize:11,fontWeight:700}}>#{i+1}</div>}<PCard profile={p} /></div>)}</>}
      {hotTab==="tonight"&&<>{tonight.length===0?<Card style={{textAlign:"center",padding:40}}><div style={{fontSize:36,marginBottom:8}}>🌙</div><p style={{color:C.txD}}>Nobody's marked as available tonight yet.</p></Card>:tonight.map(p=><PCard key={p.id} profile={p} />)}</>}
      {hotTab==="newMembers"&&<>{sorted.slice(-3).reverse().map(p=><PCard key={p.id} profile={p} />)}</>}
    </div><MobileNav /><PanicBtn /><Viewer /></div>);
  }

  // ─── BROWSE ───
  if(view==="browse"){
    const inp={background:C.sf2,border:`1px solid ${C.bd}`,borderRadius:6,padding:"10px 12px",color:C.tx,fontSize:13,width:"100%",boxSizing:"border-box",fontFamily:C.fb,outline:"none"};
    return(<div style={pg} className="vc-gradient-bg"><div className="vc-container" style={{maxWidth:900,margin:"0 auto",padding:"0 16px",paddingBottom:80}}><DesktopNav />
      <h2 style={{fontFamily:C.ff,fontSize:26,fontWeight:400,color:C.tx,marginBottom:14}}>Browse</h2>
      <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
        {[{k:"all",l:"All"},{k:"lifestyle",l:"🔥 Lifestyle"},{k:"discreet",l:"🤫 Secret"},{k:"tonight",l:"🌙 Tonight"}].map(t=>
          <button key={t.k} onClick={()=>setFilters(f=>({...f,category:t.k}))} style={{padding:"7px 16px",borderRadius:20,fontSize:11,cursor:"pointer",fontFamily:C.fb,border:filters.category===t.k?`1px solid ${t.k==="discreet"?C.sec:C.gold}`:`1px solid ${C.bd}`,background:filters.category===t.k?(t.k==="discreet"?`${C.sec}18`:`${C.gold}12`):"transparent",color:filters.category===t.k?(t.k==="discreet"?C.secG:C.gold):C.txD}}>{t.l}</button>
        )}
      </div>
      <Card style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,padding:14,marginBottom:14}}>
        <select style={inp} value={filters.profileType} onChange={e=>setFilters(f=>({...f,profileType:e.target.value}))}><option value="">All Types</option>{PROFILE_TYPES.map(t=><option key={t}>{t}</option>)}</select>
        <input style={inp} placeholder="City..." value={filters.city} onChange={e=>setFilters(f=>({...f,city:e.target.value}))} />
      </Card>
      <div style={{color:C.txM,fontSize:11,marginBottom:12}}>{filtered.length} members</div>
      {filtered.map(p=><PCard key={p.id} profile={p} />)}
    </div><MobileNav /><PanicBtn /><Viewer /></div>);
  }

  // ─── VIEW PROFILE ───
  if(view==="viewProfile"&&selProfile){const p=selProfile;const sc=isDiscreetType(p.profileType);
    return(<div style={pg} className="vc-gradient-bg"><div className="vc-container" style={{maxWidth:900,margin:"0 auto",padding:"0 16px",paddingBottom:80}}><DesktopNav />
      <Btn small outline onClick={()=>setView("browse")} style={{marginBottom:14}}>← Back</Btn>
      <Card sec={sc}>
        {/* Header */}
        <div style={{display:"flex",gap:16,alignItems:"flex-start",flexWrap:"wrap",marginBottom:16}}>
          <Avt src={p.profilePhoto} size={80} sc={sc} name={p.username} tonight={p.lookingTonight} />
          <div style={{flex:1,minWidth:180}}>
            <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:6}}>
              <span style={{fontFamily:C.ff,fontSize:26,color:C.tx}}>{p.username}</span>{p.verified&&<Badge>✓</Badge>}{sc&&<Badge sec>🤫</Badge>}<HotBadge score={p.hotScore} />
            </div>
            <div style={{color:C.txD,fontSize:13,marginBottom:4}}>{p.profileType} · {p.age1}{p.age2?`/${p.age2}`:""} · {p.city}, {p.state}</div>
            <div style={{color:sc?C.secG:C.gold,fontSize:16,fontStyle:"italic",fontFamily:C.ff,marginBottom:12}}>{p.tagline}</div>
            {p.vibes?.length>0&&<div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:12}}>{p.vibes.map(v=><span key={v} style={{fontSize:10,padding:"3px 10px",borderRadius:10,background:`${sc?C.sec:C.gold}12`,color:sc?C.secG:C.gL,border:`1px solid ${sc?C.sec:C.gold}22`}}>{v}</span>)}</div>}
            {p.id!==user.id&&<div style={{display:"flex",gap:8,flexWrap:"wrap"}}><Btn sec={sc} small onClick={()=>{setActiveConvo(p.id);setView("conversation");}}>💬 Message</Btn><Btn sec={sc} small outline onClick={()=>grantAccess(p.id)}>🔓 Share Photos</Btn></div>}
          </div>
        </div>
        <hr style={{border:"none",borderTop:`1px solid ${C.bd}`,margin:"16px 0"}} />
        {/* Bio */}
        <Section title="About" sec={sc}><p style={{color:C.txD,lineHeight:1.7,fontSize:14}}>{p.bio}</p></Section>
        {/* Photos */}
        <Section title={`📸 Photos (${(p.publicPhotos||[]).length})`} sec={sc}><PhotoGallery photos={p.publicPhotos} title="Photos" sc={sc} /></Section>
        <Section title={`🔒 Private (${(p.privatePhotos||[]).length})`} sec={sc}><PhotoGallery photos={p.privatePhotos} title="Private" locked={p.id!==user.id&&!hasAccess(p.id)} sc={sc} onRequest={()=>{const k=[user.id,p.id].sort().join("_"),u={...messages};if(!u[k])u[k]=[];u[k].push({from:user.id,to:p.id,text:"🔓 Requesting private photo access",time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),ts:Date.now()});saveMsgs(u);notify("Request sent!");}} /></Section>
        {/* Details */}
        <div className="vc-grid-2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <Section title="Details" sec={sc}><div style={{color:C.txD,fontSize:13,lineHeight:2.2}}>{p.experience&&<div>✦ {p.experience}</div>}{p.bodyType1&&<div>✦ {p.bodyType1}</div>}{p.zodiac1&&<div>✦ {p.zodiac1}</div>}</div></Section>
          <Section title="Meeting" sec={sc}><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{p.meetingPrefs?.map(m=><Tag key={m} active sec={sc}>{m}</Tag>)}</div></Section>
        </div>
        {p.partyInterests?.length>0&&<Section title="🎉 Parties" sec={sc}><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{p.partyInterests.map(t=><Tag key={t} active sec={sc}>{t}</Tag>)}</div></Section>}
        {p.travelDates?.length>0&&<Section title="✈️ Travel" sec={sc}><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{p.travelDates.map(t=><Tag key={t} active sec={sc}>{t}</Tag>)}</div></Section>}
        {/* Secret sections */}
        {sc&&(<>
          {p.relationshipStatus&&<Section title="Situation" sec><div style={{display:"flex",gap:4,flexWrap:"wrap"}}><Tag active sec>{p.relationshipStatus}</Tag>{p.discretionLevel&&<Tag active sec>{p.discretionLevel}</Tag>}</div></Section>}
          {p.seekingType?.length>0&&<Section title="Seeking" sec><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{p.seekingType.map(t=><Tag key={t} active sec>{t}</Tag>)}</div></Section>}
          {p.availabilityWindows?.length>0&&<Section title="🕐 Available" sec><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{p.availabilityWindows.map(t=><Tag key={t} active sec>{t}</Tag>)}</div></Section>}
          {p.secretBoundaries?.length>0&&<Section title="🚫 Boundaries" sec><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{p.secretBoundaries.map(t=><span key={t} style={{display:"inline-block",padding:"5px 12px",borderRadius:20,fontSize:11,margin:2,border:`1px solid ${C.rose}44`,background:`${C.rose}10`,color:C.rose}}>{t}</span>)}</div></Section>}
        </>)}
        {p.lifestylePrefs?.length>0&&<Section title="Lifestyle" sec={sc}><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{p.lifestylePrefs.map(l=><Tag key={l} active sec={sc}>{l}</Tag>)}</div></Section>}
        {p.kinks?.length>0&&<Section title="Kinks" sec={sc}><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{p.kinks.map(k=><Tag key={k} active sec={sc}>{k}</Tag>)}</div></Section>}
      </Card>
    </div><MobileNav /><PanicBtn /><Viewer /></div>);
  }

  // ─── MESSAGES ───
  if(view==="messages"){const cv=getConvos();
    return(<div style={pg} className="vc-gradient-bg"><div className="vc-container" style={{maxWidth:900,margin:"0 auto",padding:"0 16px",paddingBottom:80}}><DesktopNav />
      <h2 style={{fontFamily:C.ff,fontSize:26,fontWeight:400,color:C.tx,marginBottom:14}}>Messages</h2>
      {cv.length===0?<Card style={{textAlign:"center",padding:48}}><div style={{fontSize:40,marginBottom:12}}>💬</div><p style={{color:C.txD}}>No conversations yet.</p><Btn style={{marginTop:16}} onClick={()=>setView("browse")}>Browse</Btn></Card>
      :cv.map(c=>{const sc=isDiscreetType(c.other.profileType);return<Card key={c.key} sec={sc} onClick={()=>{setActiveConvo(c.otherId);setView("conversation");}} style={{display:"flex",alignItems:"center",gap:12,padding:14}}>
        <Avt src={c.other.profilePhoto} size={44} sc={sc} name={c.other.username} tonight={c.other.lookingTonight} />
        <div style={{flex:1,minWidth:0}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontFamily:C.ff,fontSize:15,color:C.tx}}>{c.other.username}</span><span style={{fontSize:10,color:C.txM}}>{c.lastMsg.time}</span></div><div style={{color:C.txD,fontSize:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.lastMsg.from===user.id?"You: ":""}{c.lastMsg.text}</div></div>
        <Badge sec={sc}>{c.count}</Badge>
      </Card>;})}
    </div><MobileNav /><PanicBtn /></div>);
  }

  // ─── CONVERSATION ───
  if(view==="conversation"&&activeConvo){const oth=profiles.find(p=>p.id===activeConvo);const k=[user.id,activeConvo].sort().join("_");const ms=messages[k]||[];const sc=isDiscreetType(oth?.profileType);
    return(<div style={pg} className="vc-gradient-bg">
      <div className="vc-container" style={{maxWidth:900,margin:"0 auto",padding:"0 12px",display:"flex",flexDirection:"column",height:"100vh"}}><DesktopNav />
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,paddingBottom:12,borderBottom:`1px solid ${C.bd}`}}>
          <Btn small outline onClick={()=>setView("messages")}>←</Btn>
          <Avt src={oth?.profilePhoto} size={36} sc={sc} name={oth?.username} />
          <div style={{flex:1}}><div style={{fontFamily:C.ff,fontSize:15,color:C.tx}}>{oth?.username}</div><div style={{fontSize:10,color:C.txM}}><Dot on={oth?.online} />{oth?.online?"Online":oth?.lastActive}</div></div>
          <Btn small outline sec={sc} onClick={()=>grantAccess(activeConvo)}>🔓</Btn>
          <Btn small outline onClick={()=>{setSelProfile(oth);setView("viewProfile");}}>Profile</Btn>
        </div>
        <div style={{flex:1,overflowY:"auto",marginBottom:8,paddingRight:4}}>
          {ms.length===0&&<div style={{textAlign:"center",padding:40}}><div style={{fontSize:32,marginBottom:8}}>{sc?"🤫":"💬"}</div><p style={{color:C.txM,fontSize:13}}>{sc?"Secret conversation. Stay safe.":"Say hello!"}</p></div>}
          {ms.map((m,i)=>{const mine=m.from===user.id;return<div key={i} style={{display:"flex",justifyContent:mine?"flex-end":"flex-start",marginBottom:8}}><div style={{maxWidth:"75%",padding:"10px 16px",borderRadius:mine?"16px 16px 4px 16px":"16px 16px 16px 4px",background:mine?`linear-gradient(135deg,${sc?C.sec:C.gold}28,${sc?C.sec:C.gold}10)`:C.sf2,border:`1px solid ${mine?(sc?C.sec:C.gold)+"28":C.bd}`}}><div style={{color:C.tx,fontSize:14,lineHeight:1.5}}>{m.text}</div><div style={{color:C.txM,fontSize:9,marginTop:4,textAlign:"right"}}>{m.time}</div></div></div>;})}
          <div ref={msgEnd} />
        </div>
        <div style={{display:"flex",gap:8,paddingBottom:"max(16px,env(safe-area-inset-bottom))"}}>
          <input style={{background:C.sf2,border:`1px solid ${C.bd}`,borderRadius:20,padding:"10px 16px",color:C.tx,fontSize:14,flex:1,fontFamily:C.fb,outline:"none"}} placeholder={sc?"Type discreetly...":"Message..."} value={newMsg} onChange={e=>setNewMsg(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")sendMsg(activeConvo);}} />
          <Btn sec={sc} small onClick={()=>sendMsg(activeConvo)} style={{borderRadius:20,padding:"10px 20px"}}>Send</Btn>
        </div>
      </div>
      <PanicBtn /><Notif />
    </div>);
  }

  // ─── PHOTOS ───
  if(view==="photos"){const sc=isDiscreetType(user.profileType);
    return(<div style={pg} className="vc-gradient-bg"><div className="vc-container" style={{maxWidth:900,margin:"0 auto",padding:"0 16px",paddingBottom:80}}><DesktopNav />
      <h2 style={{fontFamily:C.ff,fontSize:26,fontWeight:400,color:C.tx,marginBottom:14}}>My Photos</h2>
      <Card sec={sc}>
        <Section title="Profile Picture" sec={sc}>
          <div style={{display:"flex",alignItems:"center",gap:16}}>
            <Avt src={user.profilePhoto} size={80} sc={sc} name={user.username} />
            <label style={{display:"inline-block",cursor:"pointer"}}><Btn small outline sec={sc}>{user.profilePhoto?"Change":"Upload"}</Btn><input type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{const up={...user,profilePhoto:ev.target.result};setUser(up);store.set("vc4_user",up);setProfiles(ps=>ps.map(p=>p.id===user.id?up:p));};r.readAsDataURL(f);e.target.value="";}} /></label>
          </div>
        </Section>
        <hr style={{border:"none",borderTop:`1px solid ${C.bd}`,margin:"16px 0"}} />
        <Section title={`📸 Public (${(user.publicPhotos||[]).length})`} sec={sc} right={<label style={{cursor:"pointer"}}><Btn small outline>+ Add</Btn><input type="file" accept="image/*" multiple style={{display:"none"}} onChange={e=>{Array.from(e.target.files).forEach(f=>{const r=new FileReader();r.onload=ev=>{const up={...user,publicPhotos:[...(user.publicPhotos||[]),ev.target.result]};setUser(up);store.set("vc4_user",up);setProfiles(ps=>ps.map(p=>p.id===user.id?up:p));};r.readAsDataURL(f);});e.target.value="";}} /></label>}>
          {(user.publicPhotos||[]).length>0?<div className="vc-grid-photos" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(85px,1fr))",gap:6}}>{user.publicPhotos.map((p,i)=><div key={i} style={{position:"relative",borderRadius:8,overflow:"hidden",aspectRatio:"1",border:`1px solid ${C.bd}`,cursor:"pointer"}} onClick={()=>openViewer(user.publicPhotos,i,"My Photos")}><img src={p} style={{width:"100%",height:"100%",objectFit:"cover"}} alt="" /><button onClick={e=>{e.stopPropagation();const up={...user,publicPhotos:user.publicPhotos.filter((_,j)=>j!==i)};setUser(up);store.set("vc4_user",up);setProfiles(ps=>ps.map(p=>p.id===user.id?up:p));}} style={{position:"absolute",top:2,right:2,background:"#000c",color:"#fff",border:"none",borderRadius:"50%",width:20,height:20,fontSize:12,cursor:"pointer"}}>×</button></div>)}</div>:<p style={{color:C.txM,fontSize:12}}>None yet.</p>}
        </Section>
        <hr style={{border:"none",borderTop:`1px solid ${C.bd}`,margin:"16px 0"}} />
        <Section title={`🔒 Private (${(user.privatePhotos||[]).length})`} sec={sc} right={<label style={{cursor:"pointer"}}><Btn small outline sec>+ Add</Btn><input type="file" accept="image/*" multiple style={{display:"none"}} onChange={e=>{Array.from(e.target.files).forEach(f=>{const r=new FileReader();r.onload=ev=>{const up={...user,privatePhotos:[...(user.privatePhotos||[]),ev.target.result]};setUser(up);store.set("vc4_user",up);setProfiles(ps=>ps.map(p=>p.id===user.id?up:p));};r.readAsDataURL(f);});e.target.value="";}} /></label>}>
          <p style={{color:C.txM,fontSize:11,marginBottom:8}}>🔒 Only visible to members you grant access</p>
          {(user.privatePhotos||[]).length>0?<div className="vc-grid-photos" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(85px,1fr))",gap:6}}>{user.privatePhotos.map((p,i)=><div key={i} style={{position:"relative",borderRadius:8,overflow:"hidden",aspectRatio:"1",border:`1px solid ${C.sec}22`,cursor:"pointer"}} onClick={()=>openViewer(user.privatePhotos,i,"Private")}><img src={p} style={{width:"100%",height:"100%",objectFit:"cover"}} alt="" /><button onClick={e=>{e.stopPropagation();const up={...user,privatePhotos:user.privatePhotos.filter((_,j)=>j!==i)};setUser(up);store.set("vc4_user",up);setProfiles(ps=>ps.map(p=>p.id===user.id?up:p));}} style={{position:"absolute",top:2,right:2,background:"#000c",color:"#fff",border:"none",borderRadius:"50%",width:20,height:20,fontSize:12,cursor:"pointer"}}>×</button></div>)}</div>:<p style={{color:C.txM,fontSize:12}}>None yet.</p>}
        </Section>
      </Card>
    </div><MobileNav /><PanicBtn /><Viewer /></div>);
  }

  // ─── PROFILE ───
  if(view==="profile"){const p=user;const sc=isDiscreetType(p.profileType);
    return(<div style={pg} className="vc-gradient-bg"><div className="vc-container" style={{maxWidth:900,margin:"0 auto",padding:"0 16px",paddingBottom:80}}><DesktopNav />
      <h2 style={{fontFamily:C.ff,fontSize:26,fontWeight:400,color:C.tx,marginBottom:14}}>My Profile</h2>
      <Card sec={sc}>
        <div style={{display:"flex",gap:16,alignItems:"flex-start",flexWrap:"wrap",marginBottom:16}}>
          <Avt src={p.profilePhoto} size={72} sc={sc} name={p.username} />
          <div style={{flex:1,minWidth:180}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{fontFamily:C.ff,fontSize:24,color:C.tx}}>{p.username}</span>{sc&&<Badge sec>🤫</Badge>}<HotBadge score={p.hotScore} /></div>
            <div style={{color:C.txD,fontSize:13}}>{p.profileType} · {p.age1} · {p.city||"—"}, {p.state||"—"}</div>
            <div style={{color:sc?C.secG:C.gold,fontSize:15,fontStyle:"italic",fontFamily:C.ff,marginTop:6}}>{p.tagline||"No tagline"}</div>
            <div style={{display:"flex",gap:8,marginTop:12}}><Btn small outline sec={sc} onClick={()=>setView("photos")}>📸 Photos</Btn>
              <Btn small outline sec={sc} onClick={()=>{const up={...user,lookingTonight:!user.lookingTonight};setUser(up);store.set("vc4_user",up);setProfiles(ps=>ps.map(pr=>pr.id===user.id?up:pr));notify(up.lookingTonight?"🔥 You're visible in Tonight mode!":"Tonight mode off.");}}>{user.lookingTonight?"🌙 Tonight: ON":"🌙 Tonight: OFF"}</Btn>
            </div>
          </div>
        </div>
        <hr style={{border:"none",borderTop:`1px solid ${C.bd}`,margin:"16px 0"}} />
        <Section title="Bio" sec={sc}><p style={{color:C.txD,lineHeight:1.7}}>{p.bio||"No bio yet."}</p></Section>
        <div className="vc-grid-2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <Card style={{textAlign:"center",padding:16,marginBottom:0}}><div style={{fontSize:22,fontFamily:C.ff,color:C.gold}}>{(p.publicPhotos||[]).length}</div><div style={{fontSize:10,color:C.txM,letterSpacing:1,textTransform:"uppercase"}}>Public</div></Card>
          <Card sec style={{textAlign:"center",padding:16,marginBottom:0}}><div style={{fontSize:22,fontFamily:C.ff,color:C.secG}}>{(p.privatePhotos||[]).length}</div><div style={{fontSize:10,color:C.txM,letterSpacing:1,textTransform:"uppercase"}}>Private</div></Card>
        </div>
        {p.vibes?.length>0&&<Section title="Vibe" sec={sc}><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{p.vibes.map(v=><Tag key={v} active sec={sc}>{v}</Tag>)}</div></Section>}
        {sc&&(<>
          {p.relationshipStatus&&<Section title="Situation" sec><div style={{display:"flex",gap:4,flexWrap:"wrap"}}><Tag active sec>{p.relationshipStatus}</Tag>{p.discretionLevel&&<Tag active sec>{p.discretionLevel}</Tag>}</div></Section>}
          {p.seekingType?.length>0&&<Section title="Seeking" sec><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{p.seekingType.map(t=><Tag key={t} active sec>{t}</Tag>)}</div></Section>}
          {p.secretBoundaries?.length>0&&<Section title="🚫 Boundaries" sec><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{p.secretBoundaries.map(t=><span key={t} style={{display:"inline-block",padding:"5px 12px",borderRadius:20,fontSize:11,margin:2,border:`1px solid ${C.rose}44`,background:`${C.rose}10`,color:C.rose}}>{t}</span>)}</div></Section>}
        </>)}
        {p.kinks?.length>0&&<Section title="Kinks" sec={sc}><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{p.kinks.map(k=><Tag key={k} active sec={sc}>{k}</Tag>)}</div></Section>}
      </Card>
    </div><MobileNav /><PanicBtn /><Notif /><Viewer /></div>);
  }

  setView("home");return null;
}

