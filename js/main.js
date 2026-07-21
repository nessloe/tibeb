
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
    const heroWord = document.querySelector(".hero-word");
    if (innerWidth < 900) {
      const travel = innerHeight * 0.64;
      heroWord.style.setProperty("--hero-y", `${progress * travel}px`);
      heroWord.style.setProperty("--hero-shift", "0px");
    } else {
      heroWord.style.setProperty("--hero-shift", `${progress * -90}px`);
      heroWord.style.setProperty("--hero-y", "0px");
    }
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
    gsap.to(".gee-field",{yPercent:-8,ease:"none",scrollTrigger:{trigger:".hero",start:"top top",end:"bottom bottom",scrub:true}});

    gsap.utils.toArray(".chapter,.final-section").forEach(section=>{
      gsap.from(section.querySelectorAll(".chapter-number,.mega-title,.deck-copy,.story-lines article,.pattern-copy,.easter-game,.card-library,.numerals"),{
        y:42,opacity:0,filter:"blur(8px)",duration:1.05,stagger:.07,ease:"power3.out",clearProps:"filter",
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
    ["assets/images/illus-lion.png","THE LION","A LONG-STANDING SYMBOL OF ETHIOPIA, THE LION REPRESENTS STRENGTH, COURAGE AND RESILIENCE. DEEPLY ROOTED IN THE COUNTRY’S HISTORY, IT REMAINS ONE OF ITS MOST RECOGNIZABLE NATIONAL SYMBOLS."],
    ["assets/images/illus-ethiopian-wolf.png","THE ETHIOPIAN WOLF","THE ETHIOPIAN WOLF IS THE RAREST WOLF IN THE WORLD AND CAN ONLY BE FOUND IN ETHIOPIA’S HIGH-ALTITUDE LANDSCAPES. ITS STRIKING RED COAT HAS MADE IT A SYMBOL OF THE COUNTRY’S UNIQUE WILDLIFE."],
    ["assets/images/illus-walia-ibex.png","THE WALIA IBEX","FOUND ONLY IN THE ETHIOPIAN HIGHLANDS, THE WALIA IBEX HAS ADAPTED TO SOME OF THE COUNTRY’S STEEPEST CLIFFS. ITS DISTINCTIVE CURVED HORNS MAKE IT ONE OF ETHIOPIA’S MOST ICONIC ENDEMIC SPECIES."],
    ["assets/images/illus-black-crowned-crane.png","THE BLACK-CROWNED CRANE","RECOGNIZABLE BY ITS GOLDEN CROWN OF FEATHERS, THE BLACK-CROWNED CRANE INHABITS ETHIOPIA’S WETLANDS AND OPEN GRASSLANDS. ITS GRACEFUL APPEARANCE HAS MADE IT ONE OF EAST AFRICA’S MOST ADMIRED BIRDS."],
    ["assets/images/illus-jack.png","THE JACK","INSPIRED BY THE ETHIOPIAN ORTHODOX CHURCH, THE CROSS REFLECTS ONE OF THE COUNTRY’S OLDEST TRADITIONS. INTRICATE PATTERNS AND HANDCRAFTED DETAILS HAVE SHAPED ITS DISTINCTIVE DESIGN FOR CENTURIES."],
    ["assets/images/illus-queen.png","THE QUEEN","COFFEE HAS ITS ROOTS IN ETHIOPIA, WHERE IT HAS BEEN CULTIVATED AND CELEBRATED FOR CENTURIES. MORE THAN A CROP, IT IS A SYMBOL OF HOSPITALITY, COMMUNITY AND EVERYDAY LIFE THROUGH THE TRADITIONAL COFFEE CEREMONY."]
  ];

  const mobileTapCard=document.getElementById("mobileTapCard");
  const mobileTapImage=document.getElementById("mobileTapImage");
  const mobileTapTitle=document.getElementById("mobileTapTitle");
  const mobileTapText=document.getElementById("mobileTapText");
  const mobileTapCount=document.getElementById("mobileTapCount");
  let mobileTapIndex=0;
  let mobileTapAnimating=false;

  function showNextMobileIllustration(){
    if(mobileTapAnimating)return;
    mobileTapAnimating=true;

    const nextIndex=(mobileTapIndex+1)%galleryItems.length;
    const nextItem=galleryItems[nextIndex];

    const finishSwap=()=>{
      mobileTapIndex=nextIndex;
      mobileTapImage.src=nextItem[0];
      mobileTapImage.alt=nextItem[1];
      mobileTapTitle.textContent=nextItem[1];
      mobileTapText.textContent=nextItem[2];
      mobileTapCount.textContent=
        `${String(mobileTapIndex+1).padStart(2,"0")} / ${String(galleryItems.length).padStart(2,"0")}`;
    };

    if(window.gsap){
      gsap.timeline({
        onComplete:()=>{mobileTapAnimating=false}
      })
      .to(mobileTapImage,{
        rotationY:88,
        scale:.96,
        opacity:0,
        duration:.28,
        ease:"power2.in"
      })
      .add(finishSwap)
      .set(mobileTapImage,{rotationY:-88})
      .to(mobileTapImage,{
        rotationY:0,
        scale:1,
        opacity:1,
        duration:.46,
        ease:"power3.out"
      });
    }else{
      mobileTapImage.animate(
        [
          {transform:"rotateY(0deg) scale(1)",opacity:1},
          {transform:"rotateY(88deg) scale(.96)",opacity:0}
        ],
        {duration:260,easing:"ease-in",fill:"forwards"}
      ).onfinish=()=>{
        finishSwap();
        mobileTapImage.animate(
          [
            {transform:"rotateY(-88deg) scale(.96)",opacity:0},
            {transform:"rotateY(0deg) scale(1)",opacity:1}
          ],
          {duration:420,easing:"ease-out",fill:"forwards"}
        ).onfinish=()=>{mobileTapAnimating=false};
      };
    }
  }

  if(mobileTapCard){
    mobileTapCard.addEventListener("click",showNextMobileIllustration);
  }

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

  if(galleryStage){
    galleryStage.addEventListener("pointermove",e=>{
      if(innerWidth<900||!window.gsap)return;
      const r=galleryStage.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      gsap.to(galleryCard,{x:x*10,y:y*8,rotationZ:x*.8,duration:.55,ease:"power3.out",overwrite:"auto"});
    });
    galleryStage.addEventListener("pointerleave",()=>{
      if(window.gsap)gsap.to(galleryCard,{x:0,y:0,rotationZ:0,duration:.7,ease:"power3.out",overwrite:"auto"});
    });
  }

  const classicGames=[
    ["MAU MAU","EACH PLAYER STARTS WITH A HAND OF CARDS. TAKE TURNS PLAYING A CARD THAT MATCHES THE SUIT OR VALUE OF THE PREVIOUS ONE. IF YOU CAN'T PLAY, DRAW A CARD. THE FIRST PLAYER TO GET RID OF EVERY CARD WINS. 7 = DRAW TWO, 8 = SKIP, JACK = CHOOSE A SUIT."],
    ["ARSCHLOCH","PLAY CARDS IN ASCENDING ORDER TO GET RID OF YOUR HAND AS QUICKLY AS POSSIBLE. THE FIRST PLAYER BECOMES THE KING, WHILE THE LAST BECOMES THE ASSHOLE. THESE RANKS DETERMINE ADVANTAGES IN THE NEXT ROUND."],
    ["SCHWIMMEN","EACH PLAYER STARTS WITH THREE CARDS. ON YOUR TURN, EXCHANGE ONE CARD OR ALL THREE WITH THE OPEN CARDS IN THE MIDDLE TO BUILD THE STRONGEST HAND OF A SINGLE SUIT. IF YOU REACH 31 POINTS OR DECIDE YOUR HAND IS GOOD ENOUGH, KNOCK. AFTER THE FINAL ROUND, THE PLAYER WITH THE HIGHEST SCORE WINS. ACE = 11, FACE CARDS = 10."],
    ["LÜGEN","PLAY ONE OR MORE CARDS FACE DOWN AND ANNOUNCE THEIR VALUE. OTHER PLAYERS MAY CHALLENGE YOUR CLAIM IF THEY THINK YOU'RE BLUFFING. IF THEY'RE RIGHT, YOU TAKE THE PILE. IF THEY'RE WRONG, THEY DO."]
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

  const hotspots=[...document.querySelectorAll(".hotspot")];
  const easterCounter=document.getElementById("easterCounter");
  const easterTitle=document.getElementById("easterTitle");
  const easterText=document.getElementById("easterText");
  const easterCardWrap=document.querySelector(".easter-card-wrap");
  hotspots.forEach((h,i)=>h.addEventListener("click",()=>{
    hotspots.forEach(other=>{
      other.classList.toggle("active",other===h);
      other.classList.toggle("muted",other!==h);
    });
    easterCardWrap?.classList.add("is-focused");
    easterTitle.textContent=h.dataset.title;
    easterText.textContent=h.dataset.note;
    easterCounter.textContent=`DETAIL ${String(i+1).padStart(2,"0")} / ${String(hotspots.length).padStart(2,"0")}`;
  }));

  if(window.gsap&&window.ScrollTrigger){
    gsap.from(".final-section h2",{y:70,opacity:0,filter:"blur(10px)",duration:1.2,ease:"power3.out",clearProps:"filter",scrollTrigger:{trigger:".final-section",start:"top 72%",once:true}});
    gsap.from(".final-section p",{y:28,opacity:0,duration:.9,delay:.15,ease:"power3.out",scrollTrigger:{trigger:".final-section",start:"top 72%",once:true}});
  }
});
