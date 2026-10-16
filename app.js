const A='./assets/';
const range=(prefix,n,ext='jpg')=>Array.from({length:n},(_,i)=>`${prefix}-${String(i+1).padStart(2,'0')}.${ext}`);
const projects=[
 {slug:'cshow',title:'C SHOW',zh:'《C Show》',year:'2019',place:'海南 · 三亚',role:'视觉导演',intro:'一次让西方神话与东方水墨相遇的舞台实验。海面成为流动的画布，亚特兰蒂斯式的奇幻想象在水、光与巨幅影像之间苏醒。',quote:'让海成为舞台，也让神话在水墨中重生。',images:['cshow-hero.jpg',...range('cshow',18)]},
 {slug:'hansong',title:'HAN SONG',zh:'《汉颂》',year:'2018',place:'湖北 · 枣阳',role:'视觉导演｜编剧',intro:'以汉光武帝刘秀的故乡为历史坐标，用宏阔影像打破剧场尺度，将汉代礼乐、建筑与漆器色彩转译成可进入的视觉史诗。',quote:'在有限的空间里，展开千年山河',images:['hansong-hero.jpg','hansong-theatre-01.gif','hansong-theatre-02.gif','hansong-theatre-03.gif','hansong-award.jpg',...range('hansong',11),'hansong-motion.gif']},
 {slug:'yunhu',title:'YUNHU YELAN',zh:'《云湖夜澜》',year:'2025',place:'湖北 · 随州',role:'视觉导演',intro:'以炎帝故里与曾侯乙编钟为文化声部，让桥体、水幕与城市夜色共同起伏。天地和鸣，时代随声，用一记编钟敲响千年印记。',quote:'当编钟的余韵越过水面，整座城市成为回声。',images:['yunhu-hero.jpg',...range('yunhu',21)]},
 {slug:'qutan',title:'QUTAN',zh:'《大明瞿昙》',year:'2026',place:'青海 · 西宁',role:'编剧',intro:'一位西域高僧，一座千年古寺。故事从碑刻出发，在汉藏交融的历史经纬中，寻找跨越地域与信仰的共同记忆。',quote:'一块碑记录时间，一座寺见证相知。',images:['qutan-hero.jpg',...range('qutan',8)]},
 {slug:'tide',title:'TIDE',zh:'《潮 · Tide》',year:'2021',place:'秦皇岛 · 阿那亚',role:'新媒体艺术设计',intro:'十一个夜晚，十一次潮汐。当瑶光再次化作流萤，点亮海边的孤帆，光影轮转之间，照见短暂与永恒。',quote:'建筑是岸，潮汐是安',images:['tide-hero.jpg',...range('tide',4),'tide-motion.gif']},
 {slug:'fuling',title:'FIVE BLESSINGS',zh:'《五涪临门》',year:'2021',place:'重庆 · 涪陵',role:'新媒体艺术设计',intro:'符、富、付、福、涪——五个同音字成为城市视觉的五重回响。地域文脉被拆解为光影符号，在公共空间中重新汇聚。',quote:'一座城的气韵，一座城的福音',images:['fuling-hero.jpg',...range('fuling',8)]},
 {slug:'kaleido',title:'KALEIDOSCOPE',zh:'《万花镜》',year:'2024',place:'空间装置',role:'新媒体艺术装置设计',intro:'以 MBTI 的十六型人格为入口，借镜面、色彩与观看路径创造不断重组的自我肖像。人格不止十六种，最精彩的人格是做自己。',quote:'镜子给出无数答案，而你是唯一的解。',images:['kaleido-hero.jpg',...range('kaleido',10)]}
];
const allImages=projects.flatMap((p,pi)=>p.images.map((src,ii)=>({src,title:p.zh,project:pi,index:ii})));
const orbitImages=range('orbit',24).filter(src=>src!=='orbit-14.jpg').map((src,i)=>({src,title:projects[i%projects.length].zh,project:i%projects.length}));
const wallProjectMap=[0,0,0,0,0,6,4,5,5,4,3,3,3,1,2,1];
const wallImages=range('wall',16).map((src,i)=>({src,title:projects[wallProjectMap[i]].zh,project:wallProjectMap[i]}));

const orbit=document.querySelector('#orbit'),scene=document.querySelector('#scene'),zoom=document.querySelector('#zoomRange');
const mobileLayout=matchMedia('(max-width:900px)'),stage=document.querySelector('#orbitStage'),heroCopy=document.querySelector('.hero-copy'),touchZone=document.querySelector('#orbitTouchZone');
let rotX=-18,rotY=0,scale=mobileLayout.matches?.5:.65,radius=0,dragDistance=0,suppressClickUntil=0,flat=false;
const orbitPointers=new Map();
const reducedOrbitMotion=matchMedia('(prefers-reduced-motion:reduce)');
let orbitAutoFrame=0,orbitAutoTimer=0,orbitAutoLast=0,orbitAutoResumeAt=0,orbitInView=true,orbitZoomHeld=false,orbitAutoHitAt=0;
function stopOrbitAuto(){cancelAnimationFrame(orbitAutoFrame);clearTimeout(orbitAutoTimer);orbitAutoFrame=0;orbitAutoLast=0}
function startOrbitAuto(){stopOrbitAuto();if(flat||!orbitInView||document.hidden||reducedOrbitMotion.matches||orbitPointers.size||orbitZoomHeld||document.querySelector('.modal.open'))return;const delay=orbitAutoResumeAt-performance.now();if(delay>0){orbitAutoTimer=setTimeout(startOrbitAuto,delay);return}orbitAutoFrame=requestAnimationFrame(rotateOrbitAuto)}
function pauseOrbitAuto(){orbitAutoResumeAt=performance.now()+10000;startOrbitAuto()}
function rotateOrbitAuto(now){orbitAutoFrame=0;if(orbitAutoLast){rotY=(rotY+Math.min(now-orbitAutoLast,50)*.004)%360;orbit.style.transform=`rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`;if(mobileLayout.matches&&now-orbitAutoHitAt>100){updateOrbitHitArea();orbitAutoHitAt=now}}orbitAutoLast=now;orbitAutoFrame=requestAnimationFrame(rotateOrbitAuto)}
new IntersectionObserver(entries=>{orbitInView=entries[0].isIntersecting;startOrbitAuto()}).observe(stage);
document.addEventListener('visibilitychange',startOrbitAuto);
reducedOrbitMotion.addEventListener('change',startOrbitAuto);
const zoomBounds=()=>mobileLayout.matches?[.28,.85]:[.35,.95];
function syncHeroCopy(){const visible=!mobileLayout.matches||!stage.classList.contains('is-rotating');heroCopy.inert=!visible;heroCopy.setAttribute('aria-hidden',String(!visible));stage.classList.add('copy-visible')}
function buildOrbit(){radius=mobileLayout.matches?Math.min(300,innerWidth*.7):Math.min(510,innerWidth*.39);orbit.innerHTML='';orbitImages.forEach((item,i)=>{const b=document.createElement('button');b.type='button';b.className='orbit-card';b.tabIndex=mobileLayout.matches&&!flat?-1:0;b.innerHTML=`<img draggable="false" src="${A+item.src}" alt="${item.title}">`;b.style.transform=`rotateY(${i*360/orbitImages.length}deg) translateZ(${radius}px) rotateX(${i%3===0?-2:0}deg)`;b.onclick=e=>{if((mobileLayout.matches&&!flat)||performance.now()<suppressClickUntil||dragDistance>7){e.preventDefault();return}openViewerByItem(item)};orbit.appendChild(b)});renderOrbit();syncHeroCopy()}
let orbitHitFrame=0;
function updateOrbitHitArea(){if(!mobileLayout.matches||flat)return;const rects=[...orbit.children].map(card=>card.getBoundingClientRect()),box=scene.getBoundingClientRect();const left=Math.min(...rects.map(r=>r.left)),right=Math.max(...rects.map(r=>r.right)),top=Math.min(...rects.map(r=>r.top)),bottom=Math.max(...rects.map(r=>r.bottom));touchZone.style.width=(right-left+12)+'px';touchZone.style.height=(bottom-top+12)+'px';touchZone.style.left=((left+right)/2-box.left)+'px';touchZone.style.top=((top+bottom)/2-box.top)+'px'}
function renderOrbit(){if(!flat)orbit.style.transform=`rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`;const [min,max]=zoomBounds();zoom.value=(scale-min)/(max-min)*100;cancelAnimationFrame(orbitHitFrame);orbitHitFrame=requestAnimationFrame(updateOrbitHitArea)}
function markOrbitMotion(){stage.classList.add('is-rotating');syncHeroCopy()}
scene.addEventListener('dragstart',e=>e.preventDefault());
scene.addEventListener('pointerdown',e=>{if(flat||(e.pointerType==='mouse'&&e.button!==0)||(mobileLayout.matches&&e.target!==touchZone))return;if(!orbitPointers.size)dragDistance=0;orbitPointers.set(e.pointerId,{x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY});pauseOrbitAuto();if(e.pointerType==='mouse')e.preventDefault();else scene.setPointerCapture(e.pointerId);scene.classList.add('dragging')});
scene.addEventListener('pointermove',e=>{const point=orbitPointers.get(e.pointerId);if(!point||flat)return;const points=[...orbitPointers.values()];const previousDistance=points.length===2?Math.hypot(points[0].x-points[1].x,points[0].y-points[1].y):0;const dx=e.clientX-point.x,dy=e.clientY-point.y;point.x=e.clientX;point.y=e.clientY;dragDistance=Math.max(dragDistance,Math.hypot(point.x-point.startX,point.y-point.startY));if(dragDistance>6&&!scene.hasPointerCapture(e.pointerId))scene.setPointerCapture(e.pointerId);if(points.length===2&&previousDistance>0){const distance=Math.hypot(points[0].x-points[1].x,points[0].y-points[1].y);const [min,max]=zoomBounds();scale=Math.max(min,Math.min(max,scale*distance/previousDistance));markOrbitMotion()}else if(dragDistance>6){rotY+=dx*.34;rotX=Math.max(-65,Math.min(65,rotX-dy*.23));markOrbitMotion()}renderOrbit()});
function endOrbitPointer(e){if(!orbitPointers.has(e.pointerId))return;orbitPointers.delete(e.pointerId);if(dragDistance>6||stage.classList.contains('is-rotating'))suppressClickUntil=performance.now()+450;if(!orbitPointers.size){scene.classList.remove('dragging');stage.classList.remove('is-rotating');syncHeroCopy()}pauseOrbitAuto()}
scene.addEventListener('pointerup',endOrbitPointer);scene.addEventListener('pointercancel',endOrbitPointer);scene.addEventListener('lostpointercapture',endOrbitPointer);
window.addEventListener('pointerup',endOrbitPointer);window.addEventListener('pointercancel',endOrbitPointer);
scene.addEventListener('wheel',e=>{if(!e.ctrlKey||flat)return;e.preventDefault();pauseOrbitAuto();const [min,max]=zoomBounds();scale=Math.max(min,Math.min(max,scale-e.deltaY*.004));renderOrbit()},{passive:false});
zoom.min=0;zoom.max=100;zoom.oninput=()=>{pauseOrbitAuto();const [min,max]=zoomBounds();scale=min+(zoom.value/100)*(max-min);renderOrbit()};
zoom.addEventListener('pointerdown',()=>{orbitZoomHeld=true;pauseOrbitAuto()});
function endOrbitZoom(){if(!orbitZoomHeld)return;orbitZoomHeld=false;pauseOrbitAuto()}
window.addEventListener('pointerup',endOrbitZoom);window.addEventListener('pointercancel',endOrbitZoom);
touchZone.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();pauseOrbitAuto();if(e.key==='ArrowLeft')rotY-=8;if(e.key==='ArrowRight')rotY+=8;if(e.key==='ArrowUp')rotX=Math.max(-65,rotX-5);if(e.key==='ArrowDown')rotX=Math.min(65,rotX+5);renderOrbit()});
mobileLayout.addEventListener('change',()=>{scale=mobileLayout.matches?.5:.65;buildOrbit()});
document.querySelector('#unfoldBtn').onclick=()=>{flat=!flat;pauseOrbitAuto();dragDistance=0;orbit.classList.toggle('flat',flat);stage.classList.toggle('is-flat',flat);document.querySelector('#unfoldBtn').textContent=flat?'FORM ORBIT':'UNFOLD';document.querySelector('#orbitMode').textContent=flat?'CONTACT SHEET / 2D':'ORBIT / 360°';orbit.querySelectorAll('button').forEach(b=>b.tabIndex=mobileLayout.matches&&!flat?-1:0);renderOrbit()};
const wallSpans=Array(16).fill(3);
const wall=document.querySelector('#wallGrid');wallImages.forEach((item,i)=>{const b=document.createElement('figure');b.className='wall-item';b.style.gridColumn=`span ${wallSpans[i]}`;b.innerHTML=`<img loading="lazy" draggable="false" src="${A+item.src}" alt="精选视觉作品 ${i+1}">`;wall.appendChild(b)});
const grid=document.querySelector('#projectGrid');projects.forEach((p,i)=>{const c=document.createElement('article');c.className='project-card';c.innerHTML=`<div class="project-thumb"><img src="${A+p.images[0]}" alt="${p.zh}"></div><small>0${i+1} / ${p.role} / ${p.year} ↗</small><h3>${p.zh} · ${p.title}</h3>`;c.onclick=()=>openProject(i);grid.appendChild(c)});

// Each overlay keeps its parent and scroll position until that overlay closes.
const modalStack=[];let pageScrollBeforeModal=0;
function openModal(modal){if(modalStack.some(entry=>entry.modal===modal))return;if(!modalStack.length){pageScrollBeforeModal=scrollY;document.body.style.overflow='hidden'}modalStack.push({modal,focus:document.activeElement});modal.style.zIndex=100+modalStack.length*10;modal.classList.add('open');modal.setAttribute('aria-hidden','false');syncModalInert()}
function syncModalInert(){const top=modalStack.at(-1)?.modal;document.querySelectorAll('body>header,body>main,.modal').forEach(el=>{el.inert=Boolean(top&&el!==top)});startOrbitAuto()}
function closeModal(modal=modalStack.at(-1)?.modal){const index=modalStack.findIndex(entry=>entry.modal===modal);if(index<0)return;const removed=modalStack.splice(index);removed.forEach(entry=>{entry.modal.classList.remove('open');entry.modal.setAttribute('aria-hidden','true');entry.modal.style.zIndex=''});syncModalInert();if(!modalStack.length){document.body.style.overflow='';if(Math.abs(scrollY-pageScrollBeforeModal)>1)window.scrollTo({top:pageScrollBeforeModal,behavior:'instant'})}const target=removed[0].focus;if(target?.isConnected&&!target.closest('[inert]'))target.focus({preventScroll:true})}

let viewerIndex=0,viewerZoom=1;const viewer=document.querySelector('#viewer');
function openViewerByItem(item){const idx=allImages.findIndex(x=>x.src===item.src);if(idx>=0)openViewer(idx);else openProject(item.project)}
function openViewer(i){viewerIndex=(i+allImages.length)%allImages.length;viewerZoom=1;const x=allImages[viewerIndex];document.querySelector('#viewerImage').src=A+x.src;document.querySelector('#viewerTitle').textContent=x.title;document.querySelector('#viewerKicker').textContent=`IMAGE STUDY / ${projects[x.project].title}`;document.querySelector('#viewerCount').textContent=`${viewerIndex+1} / ${allImages.length}`;setViewerZoom(1);openModal(viewer)}
document.querySelector('#viewerPrev').onclick=()=>openViewer(viewerIndex-1);document.querySelector('#viewerNext').onclick=()=>openViewer(viewerIndex+1);document.querySelector('#viewerPlus').onclick=()=>setViewerZoom(viewerZoom+.25);document.querySelector('#viewerMinus').onclick=()=>setViewerZoom(viewerZoom-.25);document.querySelector('#viewerFit').onclick=()=>setViewerZoom(1);
function setViewerZoom(v){viewerZoom=Math.max(.5,Math.min(2.5,v));document.querySelector('#viewerImage').style.transform=`scale(${viewerZoom})`;document.querySelector('#viewerScale').textContent=Math.round(viewerZoom*100)+'%'}
document.querySelector('#viewerProject').onclick=()=>{const p=allImages[viewerIndex].project;closeModal(viewer);openProject(p)};

let activeProject=0;const pm=document.querySelector('#projectModal');
function openProject(i){
 activeProject=(i+projects.length)%projects.length;const p=projects[activeProject];
 document.querySelector('#pmTitle').textContent=p.slug==='kaleido'?p.title:p.zh;
 document.querySelector('#pmMeta').innerHTML=`${p.year} / ${p.place}<br>${p.role} / ${p.images.length} 张作品`;
 document.querySelector('#pmCount').textContent=`0${activeProject+1} / 0${projects.length}`;document.querySelector('#pmRole').textContent=p.zh;document.querySelector('#pmIntro').textContent=p.intro;document.querySelector('#pmQuote').textContent='“'+p.quote+'”';
 const g=document.querySelector('#projectGallery');g.innerHTML='';p.images.forEach((src,j)=>{const f=document.createElement('figure');f.className=(j===0||j%5===0)?'wide':'';f.innerHTML=`<img loading="lazy" src="${A+src}" alt="${p.zh} 项目图 ${j+1}">`;f.onclick=()=>openViewer(allImages.findIndex(x=>x.src===src));if(src.endsWith('.gif'))f.classList.add('motion');g.appendChild(f)});
 openModal(pm);document.querySelector('#projectSheet').scrollTop=0;
}
document.querySelector('#pmPrev').onclick=()=>openProject(activeProject-1);document.querySelector('#pmNext').onclick=()=>openProject(activeProject+1);
const overviewSets={
 cshow:[range('ov-cshow',12).slice(0,3),range('ov-cshow',12).slice(3,6),range('ov-cshow',12).slice(6,9),range('ov-cshow',12).slice(9,12)],
 hansong:[range('ov-hansong',9).slice(0,3),range('ov-hansong',9).slice(3,6),range('ov-hansong',9).slice(6,9)],
 yunhu:[range('ov-yunhu',9).slice(0,3),range('ov-yunhu',9).slice(3,6),range('ov-yunhu',9).slice(6,9)],
 qutan:[['ov-qutan-01.jpg'],['ov-qutan-02.jpg'],['ov-qutan-03.jpg'],['ov-qutan-04.jpg','ov-qutan-05.jpg']],
 tide:[['ov-tide-01.jpg'],['ov-tide-02.jpg'],['ov-tide-03.jpg'],['ov-tide-04.jpg']],
 fuling:[['ov-fuling-01.jpg'],['ov-fuling-02.jpg'],['ov-fuling-03.jpg']],
 kaleido:[['ov-kaleido-01.jpg'],['ov-kaleido-02.jpg'],['ov-kaleido-03.jpg']]
};
const overview=document.querySelector('#overview'),ovp=document.querySelector('#overviewProjects');projects.forEach((p,i)=>{const cols=overviewSets[p.slug];const s=document.createElement('section');s.className='overview-project';s.innerHTML=`<header><h3>0${i+1}. ${p.zh}</h3><span>${p.year} / ${p.role}</span></header><div class="overview-grid cols-${cols.length}">${cols.map(col=>`<button class="overview-strip">${col.map(src=>`<img loading="lazy" src="${A+src}" alt="${p.zh}">`).join('')}</button>`).join('')}</div>`;s.querySelectorAll('.overview-strip').forEach(btn=>btn.onclick=()=>openProject(i));ovp.appendChild(s)});
document.querySelectorAll('[data-open-overview]').forEach(b=>b.onclick=()=>{openModal(overview);overview.scrollTop=0});document.querySelector('#overviewTop').onclick=()=>overview.scrollTo({top:0,behavior:'smooth'});

const experiences=[['2026.01','舞台剧《大明瞿昙》'],['2025.08','夜游《云湖夜澜》'],['2025.03','香港启德体育园开幕典礼'],['2024.04','首届中国喜剧电影周开闭幕式'],['2023.10','第十届丝绸之路国际电影节'],['2023.07','第31届世界大学生夏季运动会运动员联欢会'],['2023.04','电影频道M榜暨中国电影大数据盛典'],['2023.04','首届楚文化节开幕式'],['2022.03','北京2022冬残奥会开幕式'],['2021.09','沉浸式互动投影《未来的约定》'],['2021.09','中国科幻大会开幕式光影秀'],['2021.08','3D Mapping《五涪临门》'],['2021.06','阿那亚戏剧节 3D Mapping《潮 · Tide》'],['2021.04','第39届中国洛阳牡丹文化节开幕式'],['2020.09','第29届中国金鸡百花电影节闭幕式'],['2019.04','第37届中国洛阳牡丹文化节开幕式'],['2019.03','水上舞台剧《C Show》'],['2018.07','文旅驻场秀《汉颂》'],['2018.07','第四届成龙国际动作电影周闭幕式'],['2018.04','第36届中国洛阳牡丹文化节开幕式']];
const timeline=document.querySelector('#timeline');
function timelineCenter(item){return item.offsetTop-timeline.clientHeight/2+item.offsetHeight/2}
function nearestTimelineItem(){return [...timeline.children].reduce((nearest,item)=>Math.abs(timelineCenter(item)-timeline.scrollTop)<Math.abs(timelineCenter(nearest)-timeline.scrollTop)?item:nearest)}
let timelineFocusFrame=0;
function updateTimelineFocus(){const nearest=nearestTimelineItem();for(const item of timeline.children){const distance=Math.abs(timelineCenter(item)-timeline.scrollTop),proximity=Math.max(0,1-distance/item.offsetHeight),focus=proximity*proximity*(3-2*proximity);item.style.setProperty('--timeline-focus',focus.toFixed(4));item.classList.toggle('active',item===nearest)}}
function queueTimelineFocus(){if(!timelineFocusFrame)timelineFocusFrame=requestAnimationFrame(()=>{timelineFocusFrame=0;updateTimelineFocus()})}
function selectTimeline(item,scroll=true){if(scroll){timeline.scrollTo({top:timelineCenter(item),behavior:'smooth'});queueTimelineFocus();return}timeline.querySelectorAll('.active').forEach(n=>n.classList.remove('active'));item.classList.add('active')}
experiences.forEach((x)=>{const item=document.createElement('button');item.className='timeline-item';item.innerHTML=`<time>${x[0]}</time><i></i><span>${x[1]}</span>`;item.onclick=()=>selectTimeline(item);timeline.appendChild(item)});
const wheel=document.querySelector('.timeline-wheel'),timelineWrap=document.querySelector('.timeline-wrap');
let timelineLayoutFrame=0;
function layoutTimeline(){const selected=timeline.querySelector('.active')||timeline.children[3];if(mobileLayout.matches){timelineWrap.style.marginTop='';wheel.style.marginTop='';wheel.style.setProperty('--wheel-height','392px')}else{const heading=document.querySelector('.about-intro h2').getBoundingClientRect(),intro=document.querySelector('.about-intro').getBoundingClientRect(),copy=document.querySelector('.about-copy').getBoundingClientRect();timelineWrap.style.marginTop=(heading.top-intro.top)+'px';const headerHeight=timelineWrap.querySelector('header').getBoundingClientRect().height;const top=copy.top-24;wheel.style.marginTop=Math.max(24,top-heading.top-headerHeight)+'px';wheel.style.setProperty('--wheel-height',Math.max(392,copy.bottom-top)+'px')}const rowHeight=wheel.clientHeight/7;wheel.style.setProperty('--wheel-row',rowHeight+'px');timeline.scrollTop=timelineCenter(selected);updateTimelineFocus()}
new ResizeObserver(()=>{cancelAnimationFrame(timelineLayoutFrame);timelineLayoutFrame=requestAnimationFrame(layoutTimeline)}).observe(document.querySelector('.about-intro'));
timeline.addEventListener('keydown',e=>{if(!['ArrowUp','ArrowDown','Home','End'].includes(e.key))return;e.preventDefault();const rows=[...timeline.children],active=rows.indexOf(timeline.querySelector('.active')||nearestTimelineItem());const index=e.key==='Home'?0:e.key==='End'?rows.length-1:Math.max(0,Math.min(rows.length-1,active+(e.key==='ArrowDown'?1:-1)));selectTimeline(rows[index])});
timeline.addEventListener('scroll',queueTimelineFocus,{passive:true});
timeline.addEventListener('scrollend',queueTimelineFocus);
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>closeModal(b.closest('.modal')));document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
let projectFocusFrame=0;
function updateProjectFocus(){let nearest=null,distance=innerHeight*.35;grid.querySelectorAll('.project-card').forEach(card=>{const rect=card.querySelector('.project-thumb').getBoundingClientRect(),delta=Math.abs(rect.top+rect.height/2-innerHeight/2);if(delta<distance){distance=delta;nearest=card}});grid.querySelectorAll('.project-card').forEach(card=>card.classList.toggle('is-in-focus',mobileLayout.matches&&card===nearest))}
window.addEventListener('scroll',()=>{cancelAnimationFrame(projectFocusFrame);projectFocusFrame=requestAnimationFrame(updateProjectFocus)},{passive:true});
buildOrbit();updateProjectFocus();window.addEventListener('resize',()=>{clearTimeout(window.__orbitResize);window.__orbitResize=setTimeout(()=>{buildOrbit();layoutTimeline();updateProjectFocus()},180)});
