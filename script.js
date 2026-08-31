/* =========================================================
   EASY CUSTOMIZATION — edit only this section first.
   ========================================================= */
const birthdayConfig = {
  name: "NAME",
  personalMessage:
    "Happy birthday! I hope this new chapter brings you plenty of reasons to smile, discover new things, and be proud of how far you've come.\n\nThank you for all the little moments that make ordinary days memorable. Keep being yourself, keep dreaming big, and make this year a beautiful one.",
  finalMessage: "Here's to another amazing year.",
  constellationMessage: "Some people make ordinary moments unforgettable.",
  wishMessage: "I hope this year brings you amazing moments.",
  music: "audio/birthday.mp3"
};

/* Replace these paths with your own photos. Missing files get a graceful fallback. */
const memories = [
  { image: "images/photo1.jpg", caption: "A beautiful memory", date: "2026" },
  { image: "images/photo2.jpg", caption: "One of those little moments", date: "2026" },
  { image: "images/photo3.jpg", caption: "Worth remembering", date: "2026" }
];

const screens = [...document.querySelectorAll(".screen")];
const progressButtons = [...document.querySelectorAll(".progress button")];
const byScreen = Object.fromEntries(screens.map(s => [s.dataset.screen, s]));
let current = "intro";
let transitionLock = false;
let reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

const sleep = ms => new Promise(r => setTimeout(r, ms));

function goTo(name, {instant=false} = {}) {
  if (!byScreen[name] || name === current || transitionLock) return;
  transitionLock = true;
  const old = byScreen[current], next = byScreen[name];
  old.classList.add("is-leaving");
  next.classList.add("is-active");
  progressButtons.forEach(b => b.classList.toggle("active", b.dataset.go === name));
  current = name;
  if (name === "reveal") renderBirthday();
  if (name === "constellation") resizeConstellation();
  if (name === "final") startFireworks();
  setTimeout(() => {
    old.classList.remove("is-active", "is-leaving");
    transitionLock = false;
  }, instant || reducedMotion ? 30 : 760);
}

function renderBirthday() {
  const title = document.getElementById("birthdayTitle");
  const text = `Happy Birthday, ${birthdayConfig.name}`;
  title.innerHTML = "";
  [...text].forEach((char, i) => {
    const span = document.createElement("span");
    span.className = "char";
    span.textContent = char === " " ? "\u00a0" : char;
    span.style.animationDelay = `${Math.min(i * 35, 900)}ms`;
    title.appendChild(span);
  });
  document.getElementById("birthdaySubtitle").textContent = "Today is your day.";
  document.getElementById("finalName").textContent = birthdayConfig.name;
  document.getElementById("finalMessage").textContent = birthdayConfig.finalMessage;
}

function particleBurst(x, y, count=70) {
  const canvas = document.getElementById("particleCanvas");
  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  const particles = [];
  for (let i=0;i<count;i++) {
    const a = Math.random()*Math.PI*2, speed = 2+Math.random()*5;
    particles.push({x:x*rect.width,y:y*rect.height,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,r:1+Math.random()*2,life:1});
  }
  function frame(){
    particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.045;p.life-=.018});
    particles.forEach(p=>{ctx.beginPath();ctx.fillStyle=`rgba(241,212,154,${Math.max(0,p.life)})`;ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill()});
    if(particles.some(p=>p.life>0)) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* Ambient particles */
(() => {
  const canvas=document.getElementById("particleCanvas"), ctx=canvas.getContext("2d");
  let particles=[], dpr=1;
  function resize(){
    dpr=Math.min(devicePixelRatio||1,2); canvas.width=innerWidth*dpr; canvas.height=innerHeight*dpr;
    canvas.style.width=innerWidth+"px"; canvas.style.height=innerHeight+"px";
    particles=Array.from({length:innerWidth<600?38:68},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:.4+Math.random()*1.5,s:.1+Math.random()*.35,a:.15+Math.random()*.5}));
  }
  function loop(){
    ctx.setTransform(dpr,0,0,dpr,0,0); ctx.clearRect(0,0,innerWidth,innerHeight);
    particles.forEach(p=>{p.y-=p.s;if(p.y<0)p.y=innerHeight;p.x+=Math.sin(p.y*.006)*.08;
      ctx.beginPath();ctx.fillStyle=`rgba(210,203,255,${p.a})`;ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill()});
    requestAnimationFrame(loop);
  }
  addEventListener("resize",resize,{passive:true}); resize(); loop();
})();

/* Intro → gift */
document.getElementById("openBtn").addEventListener("click", e => {
  const r=e.currentTarget.getBoundingClientRect(); particleBurst((r.left+r.width/2)/innerWidth,(r.top+r.height/2)/innerHeight,35);
  startAudio(); setTimeout(()=>goTo("gift"),220);
});

/* Gift */
document.getElementById("giftBox").addEventListener("click", e => {
  if(e.currentTarget.classList.contains("opened")) return;
  e.currentTarget.classList.add("opened");
  particleBurst(.5,.48,120);
  document.getElementById("giftHint").textContent="A little surprise...";
  setTimeout(()=>goTo("reveal"),900);
});

/* Message */
document.getElementById("readMessageBtn").addEventListener("click", async e => {
  e.currentTarget.hidden=true;
  const box=document.getElementById("messageContent"); box.hidden=false; box.innerHTML="";
  const cursor=document.createElement("span"); cursor.className="cursor"; box.appendChild(cursor);
  const full=birthdayConfig.personalMessage;
  for(let i=0;i<full.length;i++){
    cursor.before(document.createTextNode(full[i]));
    if(!reducedMotion) await sleep(full[i]==="."||full[i]==="\n"?18:9);
  }
  cursor.remove();
  document.querySelector(".message-next").hidden=false;
});

/* Navigation */
document.querySelectorAll("[data-next]").forEach(btn=>btn.addEventListener("click",()=>goTo(btn.dataset.next)));
progressButtons.forEach(btn=>btn.addEventListener("click",()=>goTo(btn.dataset.go)));

/* Gallery */
let photoIndex=0;
const img=document.getElementById("memoryImage"), frame=document.getElementById("photoFrame");
const dateEl=document.getElementById("memoryDate"), captionEl=document.getElementById("memoryCaption"), dots=document.getElementById("galleryDots");
function placeholderSvg(i){
  const palettes=[["5c4b8a","a18bd0"],["334b75","9aa7df"],["754f78","d5a0bd"]];
  const [a,b]=palettes[i%palettes.length];
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#${a}"/><stop offset="1" stop-color="#${b}"/></linearGradient></defs><rect width="1200" height="900" fill="url(#g)"/><circle cx="850" cy="270" r="190" fill="white" opacity=".08"/><circle cx="300" cy="690" r="260" fill="white" opacity=".06"/><text x="600" y="450" fill="white" opacity=".7" font-family="Georgia" font-size="54" text-anchor="middle">Your photo ${i+1}</text></svg>`)}`;
}
memories.forEach((_,i)=>{const b=document.createElement("button");b.type="button";b.ariaLabel=`Memory ${i+1}`;b.addEventListener("click",()=>showPhoto(i));dots.appendChild(b)});
function showPhoto(i){
  photoIndex=(i+memories.length)%memories.length; const m=memories[photoIndex];
  frame.classList.add("changing");
  img.onerror=()=>{img.onerror=null;img.src=placeholderSvg(photoIndex)};
  img.src=m.image; img.alt=m.caption; dateEl.textContent=m.date||""; captionEl.textContent=m.caption;
  [...dots.children].forEach((d,j)=>d.classList.toggle("active",j===photoIndex));
  setTimeout(()=>frame.classList.remove("changing"),280);
}
document.getElementById("prevPhoto").addEventListener("click",()=>showPhoto(photoIndex-1));
document.getElementById("nextPhoto").addEventListener("click",()=>showPhoto(photoIndex+1));
showPhoto(0);
let touchX=0;
frame.addEventListener("touchstart",e=>touchX=e.changedTouches[0].clientX,{passive:true});
frame.addEventListener("touchend",e=>{const dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>45)showPhoto(photoIndex+(dx<0?1:-1))},{passive:true});
frame.addEventListener("pointermove",e=>{
  if(innerWidth<700)return; const r=frame.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
  frame.style.transform=`perspective(800px) rotateY(${x*4}deg) rotateX(${-y*4}deg)`;
});
frame.addEventListener("pointerleave",()=>frame.style.transform="");

/* Constellation */
const cCanvas=document.getElementById("constellationCanvas"), cctx=cCanvas.getContext("2d");
let stars=[], cDpr=1, connected=0;
function resizeConstellation(){
  cDpr=Math.min(devicePixelRatio||1,2); cCanvas.width=innerWidth*cDpr;cCanvas.height=innerHeight*cDpr;
  cCanvas.style.width=innerWidth+"px";cCanvas.style.height=innerHeight+"px";
  const count=innerWidth<600?25:42;
  stars=Array.from({length:count},(_,i)=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.5+.5,active:false,seed:i}));
}
function drawConstellation(pointer=null){
  cctx.setTransform(cDpr,0,0,cDpr,0,0);cctx.clearRect(0,0,innerWidth,innerHeight);
  stars.forEach(s=>{
    if(pointer){const d=Math.hypot(s.x-pointer.x,s.y-pointer.y);if(d<95)s.active=true}
  });
  for(let i=0;i<stars.length;i++)for(let j=i+1;j<stars.length;j++){
    const a=stars[i],b=stars[j],d=Math.hypot(a.x-b.x,a.y-b.y);
    if(d<150&&(a.active||b.active)){cctx.strokeStyle=`rgba(167,139,250,${Math.max(.05,.25-d/700)})`;cctx.lineWidth=.7;cctx.beginPath();cctx.moveTo(a.x,a.y);cctx.lineTo(b.x,b.y);cctx.stroke()}
  }
  stars.forEach(s=>{cctx.beginPath();cctx.fillStyle=s.active?"#f1d49a":"rgba(230,228,255,.65)";cctx.shadowBlur=s.active?14:0;cctx.shadowColor="#f1d49a";cctx.arc(s.x,s.y,s.r+(s.active?1:0),0,Math.PI*2);cctx.fill();cctx.shadowBlur=0});
  const now=stars.filter(s=>s.active).length;
  if(now!==connected){connected=now;if(connected>7){document.getElementById("constellationMessage").textContent=birthdayConfig.constellationMessage;document.getElementById("constellationHint").textContent="You found it.";}}
}
function constellationLoop(){if(current==="constellation")drawConstellation();requestAnimationFrame(constellationLoop)}
cCanvas.addEventListener("pointermove",e=>drawConstellation({x:e.clientX,y:e.clientY}));
cCanvas.addEventListener("pointerdown",e=>drawConstellation({x:e.clientX,y:e.clientY}));
addEventListener("resize",()=>{resizeConstellation();});
resizeConstellation();constellationLoop();

/* Cake */
let candlesOut=0;
document.querySelectorAll(".candle").forEach(c=>c.addEventListener("click",()=>{
  const id=c.dataset.candle;
  if(c.classList.contains("off"))return;
  c.classList.add("off");document.querySelector(`.flame[data-candle="${id}"]`).classList.add("off");candlesOut++;
  particleBurst(.5,.65,12);
  if(candlesOut===3){
    document.querySelector(".cake-screen").classList.add("wished");
    document.getElementById("wishMessage").textContent=birthdayConfig.wishMessage;
    document.querySelector(".cake-next").hidden=false;
    confettiBurst();
  }
}));

function confettiBurst(){
  const canvas=document.getElementById("particleCanvas"),ctx=canvas.getContext("2d"),rect=canvas.getBoundingClientRect();
  const ps=Array.from({length:110},()=>({x:rect.width/2,y:rect.height*.5,vx:(Math.random()-.5)*9,vy:-3-Math.random()*8,s:.8+Math.random()*2,l:1,rot:Math.random()*6}));
  function f(){ps.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.16;p.rot+=.1;p.l-=.009;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.fillStyle=`hsla(${Math.random()*360},60%,75%,${p.l})`;ctx.fillRect(-p.s,-p.s,p.s*2,p.s*2);ctx.restore()});if(ps.some(p=>p.l>0))requestAnimationFrame(f)}requestAnimationFrame(f)
}

/* Fireworks */
let fwRunning=false, rockets=[];
function startFireworks(){
  if(fwRunning)return;fwRunning=true;
  const canvas=document.getElementById("fireworksCanvas"),ctx=canvas.getContext("2d");
  function resize(){const d=Math.min(devicePixelRatio||1,2);canvas.width=innerWidth*d;canvas.height=innerHeight*d;canvas.style.width=innerWidth+"px";canvas.style.height=innerHeight+"px";return d}
  let dpr=resize(); addEventListener("resize",()=>dpr=resize(),{passive:true});
  const particles=[];
  function launch(){rockets.push({x:innerWidth*(.15+Math.random()*.7),y:innerHeight+10,tx:innerWidth*(.15+Math.random()*.7),ty:innerHeight*(.18+Math.random()*.42),v:8});setTimeout(launch,850+Math.random()*1100)}
  launch();
  function loop(){
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle="rgba(5,6,17,.22)";ctx.fillRect(0,0,innerWidth,innerHeight);
    rockets.forEach((r,i)=>{const dx=r.tx-r.x,dy=r.ty-r.y,len=Math.hypot(dx,dy);if(len<r.v){for(let j=0;j<38;j++){const a=Math.random()*Math.PI*2,s=1+Math.random()*4;particles.push({x:r.x,y:r.y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:1})}rockets.splice(i,1)}else{r.x+=dx/len*r.v;r.y+=dy/len*r.v;ctx.fillStyle="#f1d49a";ctx.fillRect(r.x-1,r.y-1,2,2)}});
    particles.forEach((p,i)=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.045;p.vx*=.99;p.l-=.018;ctx.fillStyle=`rgba(230,220,255,${p.l})`;ctx.fillRect(p.x,p.y,1.5,1.5);if(p.l<=0)particles.splice(i,1)});
    if(current==="final")requestAnimationFrame(loop);else fwRunning=false;
  } loop();
}

/* Optional music — no autoplay. Missing audio is silently ignored. */
const audio=document.getElementById("birthdayAudio"),musicBtn=document.getElementById("musicToggle");
audio.src=birthdayConfig.music;
let audioUnavailable=false;
function startAudio(){ if(audioUnavailable)return; audio.play().then(()=>setMusicState(true)).catch(()=>{}); }
function setMusicState(on){musicBtn.classList.toggle("playing",on);musicBtn.setAttribute("aria-pressed",String(on));musicBtn.textContent=on?"♫":"♪";musicBtn.setAttribute("aria-label",on?"Pause background music":"Play background music")}
musicBtn.addEventListener("click",()=>{if(audio.paused)startAudio();else{audio.pause();setMusicState(false)}});
audio.addEventListener("error",()=>{audioUnavailable=true;musicBtn.disabled=true;musicBtn.title="Add audio/birthday.mp3 to enable music";musicBtn.style.opacity=".4"});

/* Replay */
document.getElementById("replayBtn").addEventListener("click",()=>{
  current="final";
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("is-active","is-leaving"));
  document.querySelector('[data-screen="intro"]').classList.add("is-active");
  progressButtons.forEach(b=>b.classList.toggle("active",b.dataset.go==="intro"));
  document.getElementById("giftBox").classList.remove("opened");
  document.getElementById("giftHint").textContent="Tap the gift ✨";
  document.getElementById("readMessageBtn").hidden=false;
  document.getElementById("messageContent").hidden=true;
  document.getElementById("messageContent").textContent="";
  document.querySelector(".message-next").hidden=true;
  document.querySelector(".cake-screen").classList.remove("wished");
  document.querySelectorAll(".candle").forEach(c=>c.classList.remove("off"));
  document.querySelectorAll(".flame").forEach(f=>f.classList.remove("off"));
  candlesOut=0; document.getElementById("wishMessage").textContent="";
  renderBirthday();
});

/* Keyboard convenience */
addEventListener("keydown",e=>{
  if(e.key==="ArrowRight"){const i=screens.findIndex(s=>s.dataset.screen===current);if(i<screens.length-1)goTo(screens[i+1].dataset.screen)}
  if(e.key==="ArrowLeft"){const i=screens.findIndex(s=>s.dataset.screen===current);if(i>0)goTo(screens[i-1].dataset.screen)}
});
