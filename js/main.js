
document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const clamp = (v,min,max) => Math.min(Math.max(v,min),max);

  const hero = document.querySelector(".hero");
  const heroCard = document.getElementById("heroCard");
  const heroCard3d = document.getElementById("heroCard3d");
  const heroFront = document.getElementById("heroFront");
  const counter = document.getElementById("rotationCounter");
  const heroFaces = [
    "assets/images/hero-card-01.png",
    "assets/images/hero-card-02.png",
    "assets/images/hero-card-03.png",
    "assets/images/hero-card-01.png"
  ];

  function updateHero() {
    const rect = hero.getBoundingClientRect();
    const scrollable = hero.offsetHeight - innerHeight;
    const progress = clamp(-rect.top / scrollable,0,1);
    heroCard3d.style.transform = `rotateY(${progress*1080}deg) rotateX(${Math.sin(progress*Math.PI*3)*7}deg)`;
    const index = Math.min(3,Math.floor(progress*3.999));
    const file = heroFaces[index];
    if (!heroFront.src.endsWith(file.replace("assets/images/",""))) heroFront.src = file;
    counter.textContent = `${String(Math.min(3,Math.floor(progress*3))).padStart(2,"0")} / 03`;
  }
  addEventListener("scroll",updateHero,{passive:true});addEventListener("resize",updateHero);updateHero();

  addEventListener("pointermove",e=>{
    if(innerWidth<900)return;
    const x=(e.clientX/innerWidth-.5)*10;
    const y=(e.clientY/innerHeight-.5)*-8;
    heroCard.style.rotate=`${y}deg ${x}deg`;
    document.querySelectorAll(".gee-field span").forEach((n,i)=>{
      const d=(i%5+1)*1.8;n.style.translate=`${x*d*.25}px ${y*d*.25}px`
    });
  });

  if(window.gsap&&window.ScrollTrigger){
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(".hero-word",{xPercent:-7,ease:"none",scrollTrigger:{trigger:".hero",start:"top top",end:"bottom bottom",scrub:true}});
    gsap.to(".gee-field",{yPercent:-8,ease:"none",scrollTrigger:{trigger:".hero",start:"top top",end:"bottom bottom",scrub:true}});

    gsap.utils.toArray(".chapter,.final-section").forEach(section=>{
      gsap.from(section.querySelectorAll(".chapter-number,.mega-title,.deck-copy,.story-lines article,.pattern-copy,.easter-game,.card-library,.numerals"),{
        y:60,opacity:0,duration:1,stagger:.07,ease:"power3.out",
        scrollTrigger:{trigger:section,start:"top 78%",once:true}
      })
    });

    const ornaments=gsap.utils.toArray(".ornament");
    gsap.set(ornaments,{opacity:0,scale:.05,rotation:()=>gsap.utils.random(-25,25)});
    gsap.to(ornaments,{
      opacity:1,scale:1,rotation:0,duration:.7,stagger:.13,ease:"back.out(1.5)",
      scrollTrigger:{trigger:".pattern-stage",start:"top 72%",once:true}
    });

    gsap.to(".organic-cluster",{
      scale:.84,rotation:0,ease:"none",
      scrollTrigger:{trigger:".pattern-stage",start:"center center",end:"bottom top",scrub:true}
    });
  } else {
    const ornaments=[...document.querySelectorAll(".ornament")];
    const observer=new IntersectionObserver(entries=>{
      if(!entries.some(e=>e.isIntersecting))return;
      ornaments.forEach((o,i)=>setTimeout(()=>{o.style.opacity=1;o.style.transform="scale(1)"},i*130));
      observer.disconnect()
    },{threshold:.2});
    observer.observe(document.querySelector(".pattern-stage"));
  }

  const galleryItems=[
    ["assets/images/illus-lion.jpg","THE LION","A SYMBOL OF STRENGTH AND SOVEREIGNTY. THE FORM IS REDUCED INTO ANGULAR, ORNAMENTAL PLANES."],
    ["assets/images/illus-jack.jpg","THE JACK","A CONTEMPORARY FIGURE CARRYING AN ETHIOPIAN ORTHODOX CROSS."],
    ["assets/images/illus-queen.jpg","THE QUEEN","THE COFFEE BRANCH CONNECTS THE FIGURE TO ETHIOPIA’S COFFEE CULTURE."],
    ["assets/images/illus-king.jpg","THE KING","A REGAL FIGURE BUILT FROM STRONG VERTICALS, GEOMETRIC TEXTILES AND A REDUCED CROWN."],
    ["assets/images/illus-animal-1.jpg","NATIVE FAUNA","THE ANIMAL CARDS DRAW FROM SPECIES ASSOCIATED WITH ETHIOPIA AND THE SURROUNDING HIGHLANDS."],
    ["assets/images/illus-animal-2.jpg","PATTERNED WILDLIFE","EACH ANIMAL CARRIES A DISTINCT INTERNAL PATTERN."]
  ];
  const gallery=document.querySelector(".scroll-gallery"),galleryCard=document.getElementById("galleryCard"),galleryImage=document.getElementById("galleryImage"),galleryTitle=document.getElementById("galleryTitle"),galleryText=document.getElementById("galleryText"),galleryCount=document.getElementById("galleryCount"),galleryProgress=document.getElementById("galleryProgress");
  let lastGallery=-1;
  function updateGallery(){
    if(innerWidth<900)return;
    const r=gallery.getBoundingClientRect(),scrollable=gallery.offsetHeight-innerHeight;
    const p=clamp(-r.top/scrollable,0,1),idx=Math.min(galleryItems.length-1,Math.floor(p*galleryItems.length));
    galleryProgress.style.setProperty("--progress",`${p*100}%`);
    if(idx===lastGallery)return;lastGallery=idx;
    const item=galleryItems[idx];
    if(window.gsap){
      gsap.to(galleryCard,{rotationY:90,x:35,opacity:0,duration:.25,onComplete:()=>{
        galleryImage.src=item[0];galleryTitle.textContent=item[1];galleryText.textContent=item[2];galleryCount.textContent=`${String(idx+1).padStart(2,"0")} / 06`;
        gsap.set(galleryCard,{rotationY:-90,x:-35});gsap.to(galleryCard,{rotationY:0,x:0,opacity:1,duration:.5,ease:"power3.out"})
      }})
    }else{galleryImage.src=item[0];galleryTitle.textContent=item[1];galleryText.textContent=item[2]}
  }
  addEventListener("scroll",updateGallery,{passive:true});updateGallery();

  const classicGames=[
    ["MAU MAU","2–6 PLAYERS. PLAY A CARD OF THE SAME SUIT OR VALUE. 7 = DRAW TWO, 8 = SKIP, JACK = CHOOSE A SUIT."],
    ["ARSCHLOCH","4–8 PLAYERS. PLAY THE SAME NUMBER OF CARDS AT A HIGHER VALUE OR PASS. TWO IS HIGHEST."],
    ["SCHWIMMEN","2–9 PLAYERS. COLLECT UP TO 31 POINTS IN ONE SUIT. ACE = 11, FACE CARDS = 10."],
    ["LÜGEN","3–8 PLAYERS. PLACE CARDS FACE DOWN AND ANNOUNCE A VALUE — TRUTHFULLY OR NOT."]
  ];
  const partyGames=[
    ["KING'S CUP","EACH DRAWN CARD TRIGGERS A PREDEFINED ACTION. THE FINAL KING DECIDES THE KING'S CUP."],
    ["BUSFAHRER","GUESS RED OR BLACK, HIGHER OR LOWER, INSIDE OR OUTSIDE AND THE SUIT."],
    ["PYRAMIDE","REVEAL A PYRAMID ROW BY ROW. MATCHING VALUES CAN DISTRIBUTE DRINKS. BLUFFING IS ALLOWED."],
    ["HIGHER OR LOWER","GUESS WHETHER THE NEXT CARD WILL BE HIGHER OR LOWER. A WRONG GUESS MEANS DRINKING."]
  ];
  const rules=document.getElementById("rules"),modeToggle=document.getElementById("modeToggle"),playTitle=document.getElementById("playTitle"),modeLabel=document.querySelector(".mode-label"),wipe=document.querySelector(".mode-wipe");
  function renderRules(data){
    rules.innerHTML=data.map((g,i)=>`<article class="rule"><button class="rule-button" type="button"><span class="rule-index">${String(i+1).padStart(2,"0")}</span><span class="rule-name">${g[0]}</span><span class="rule-plus">+</span></button><div class="rule-content"><p>${g[1]}</p></div></article>`).join("");
    rules.querySelectorAll(".rule-button").forEach(b=>b.addEventListener("click",()=>b.closest(".rule").classList.toggle("open")))
  }
  renderRules(classicGames);
  modeToggle.addEventListener("click",()=>{
    const party=root.dataset.mode!=="party";
    if(window.gsap){
      gsap.timeline().set(wipe,{scaleY:0,transformOrigin:"bottom"}).to(wipe,{scaleY:1,duration:.42,ease:"power3.in"}).add(()=>{
        root.dataset.mode=party?"party":"classic";playTitle.innerHTML=party?"TURN UP<br>THE NIGHT.":"KEEP IT<br>CLASSIC.";modeLabel.textContent=party?"PARTY MODE":"CLASSIC MODE";renderRules(party?partyGames:classicGames);document.querySelector('meta[name="theme-color"]').content=party?"#101110":"#FCFCF7"
      }).set(wipe,{transformOrigin:"top"}).to(wipe,{scaleY:0,duration:.42,ease:"power3.out"})
    }else{root.dataset.mode=party?"party":"classic";renderRules(party?partyGames:classicGames)}
  });

  const found=new Set(),easterCounter=document.getElementById("easterCounter"),easterText=document.getElementById("easterText"),completion=document.getElementById("completion");
  document.querySelectorAll(".hotspot").forEach((h,i)=>h.addEventListener("click",()=>{
    h.classList.add("found");found.add(i);easterText.textContent=h.dataset.note;easterCounter.textContent=`${String(found.size).padStart(2,"0")} / 05 FOUND`;if(found.size===5)completion.classList.add("show")
  }));
});
