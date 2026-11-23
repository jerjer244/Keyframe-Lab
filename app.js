const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
/* Theme (dark mode) */
const root=document.documentElement;let saved=null;try{saved=localStorage.getItem('theme')}catch(e){}
root.dataset.theme=saved||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
const tb=$('#theme');function paint(){tb.textContent=root.dataset.theme==='dark'?'☀ Light':'☾ Dark';tb.setAttribute('aria-pressed',root.dataset.theme==='dark')}
paint();tb.onclick=()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem('theme',root.dataset.theme)}catch(e){}paint()};
$('#menu').onclick=e=>{const o=$('nav').classList.toggle('open');e.target.setAttribute('aria-expanded',o)};
/* Three.js hero: a Blender-style donut */
const box=$('#three');if(box){if(window.THREE){const w=box.clientWidth,h=box.clientHeight,r=new THREE.WebGLRenderer({antialias:true,alpha:true});
r.setSize(w,h);r.setPixelRatio(devicePixelRatio);box.textContent='';box.appendChild(r.domElement);const s=new THREE.Scene(),c=new THREE.PerspectiveCamera(45,w/h,.1,100);c.position.z=5;
const m=new THREE.Mesh(new THREE.TorusGeometry(1.2,.55,32,80),new THREE.MeshStandardMaterial({color:0xe8590c,roughness:.35}));s.add(m);
const ic=new THREE.Mesh(new THREE.TorusGeometry(1.2,.57,16,60,Math.PI*1.2),new THREE.MeshStandardMaterial({color:0xfff1e6,roughness:.6}));ic.position.z=.02;m.add(ic);
s.add(new THREE.AmbientLight(0xffffff,.6));const l=new THREE.DirectionalLight(0xffffff,.9);l.position.set(3,4,5);s.add(l);
let drag=false,px=0,py=0;r.domElement.onpointerdown=e=>{drag=true;px=e.clientX;py=e.clientY};addEventListener('pointerup',()=>drag=false);
addEventListener('pointermove',e=>{if(drag){m.rotation.y+=(e.clientX-px)*.01;m.rotation.x+=(e.clientY-py)*.01;px=e.clientX;py=e.clientY}});
const rm=matchMedia('(prefers-reduced-motion:reduce)').matches;(function a(){requestAnimationFrame(a);if(!drag&&!rm){m.rotation.y+=.008;m.rotation.x+=.004}r.render(s,c)})();
}else box.textContent='3D preview needs an internet connection (Three.js).'}
/* Clickable infographic */
const fl=$('#flow');if(fl){const d={Model:'Build shapes from vertices, edges and faces in Edit Mode.',Rig:'Add an armature (bones) so a character can pose.',Animate:'Set keyframes on the timeline; Blender fills in the motion between them.',Render:'Choose Eevee (fast) or Cycles (realistic) and export a video.'};
Object.keys(d).forEach((k,i)=>{const b=document.createElement('button');b.textContent=(i+1)+'. '+k;b.setAttribute('aria-pressed','false');b.onclick=()=>{$$('button',fl).forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');$('#flowinfo').textContent=d[k]};fl.appendChild(b)})}
/* MCQ helper */
function mcq(host,q,done){host.innerHTML='';const p=document.createElement('p');p.innerHTML='<b></b>';p.firstChild.textContent=q.q;host.appendChild(p);let pick=-1;
const bs=q.o.map((t,i)=>{const b=document.createElement('button');b.className='opt';b.textContent=t;b.onclick=()=>{pick=i;bs.forEach((x,j)=>{x.setAttribute('aria-pressed',j===i);x.style.outline=j===i?'3px solid var(--acc)':''})};host.appendChild(b);return b});
const sub=document.createElement('button');sub.textContent='Submit answer';const fb=document.createElement('p');fb.className='fb';fb.setAttribute('role','status');host.append(sub,fb);
sub.onclick=()=>{if(pick<0){fb.textContent='Pick an option first.';return}bs.forEach((b,i)=>{b.disabled=true;b.classList.toggle('ok',i===q.a);b.classList.toggle('bad',i===pick&&i!==q.a)});sub.disabled=true;
fb.textContent=(pick===q.a?'Correct! ':'Not quite. ')+q.e;done&&done(pick===q.a)}}
/* Tutorial stepper */
if(window.TUT){const T=TUT;let n=0;const pr=$('#prog');T.steps.forEach(s=>{const li=document.createElement('li');li.textContent=s[0];pr.appendChild(li)});
function show(){$$('li',pr).forEach((li,i)=>{li.className=i<n?'done':i===n?'on':'';i===n?li.setAttribute('aria-current','step'):li.removeAttribute('aria-current')});
$('#st').textContent=T.steps[n][0];$('#sx').textContent=T.steps[n][1];$('#md').textContent=T.steps[n][2];$('#prev').disabled=n===0;$('#next').disabled=n===T.steps.length-1}
$('#prev').onclick=()=>{n--;show()};$('#next').onclick=()=>{n++;show()};show();mcq($('#mcq'),T.q)}
/* Gallery lightbox */
const lb=$('#lb');if(lb){$$('.thumb').forEach(t=>t.onclick=()=>{$('#lbt').textContent=t.dataset.t;const v=$('video',lb);v.src='videos/'+t.dataset.v;lb.showModal();v.play().catch(()=>{})});
$('#close').onclick=()=>lb.close();lb.onclose=()=>{const v=$('video',lb);v.pause();v.removeAttribute('src');v.load()};lb.onclick=e=>{if(e.target===lb)lb.close()}}
/* Quiz */
const qz=$('#quiz');if(qz){let i=0,sc=0;const go=()=>{$('#res').hidden=true;qz.hidden=false;$('#qn').textContent='Question '+(i+1)+' of '+QUIZ.length;
mcq(qz,QUIZ[i],ok=>{if(ok)sc++;const b=document.createElement('button');b.className='ghost';b.textContent=i<QUIZ.length-1?'Next question':'See my score';b.onclick=()=>{i++;i<QUIZ.length?go():end()};qz.appendChild(b);b.focus()})};
const end=()=>{qz.hidden=true;$('#qn').textContent='Quiz complete';const r=$('#res');r.hidden=false;$('#score').textContent='You scored '+sc+' / '+QUIZ.length;
$('#msg').textContent=sc===QUIZ.length?'Perfect! You are ready to animate.':sc>=3?'Good work. Revisit the tutorials for the ones you missed.':'Keep going: review Tutorials 1–3 and try again.'};
$('#again').onclick=()=>{i=0;sc=0;go()};go()}
/* Liquid paint background: WebGL shader; the cursor drags the paint, a click splashes it */
(function(){const cv=document.createElement('canvas');cv.id='fluid';cv.setAttribute('aria-hidden','true');document.body.prepend(cv);
const gl=cv.getContext('webgl',{antialias:false,alpha:false});if(!gl){cv.remove();return}
const vs='attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
const fs=`precision mediump float;uniform vec2 R;uniform float T,D;uniform vec4 P[24];
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
vec3 fld(vec2 p){vec2 q=vec2(fbm(p+T*.04),fbm(p+vec2(5.2,1.3)-T*.03));vec2 r=vec2(fbm(p+3.*q+vec2(1.7,9.2)+T*.05),fbm(p+3.*q+vec2(8.3,2.8)-T*.04));return vec3(fbm(p+3.*r),q.x,r.y);}
void main(){vec2 p=gl_FragCoord.xy/R.y*2.;
for(int i=0;i<24;i++){vec2 d=p-P[i].xy;p-=P[i].zw*1.6*exp(-dot(d,d)*26.);}
vec3 f=fld(p);float e=.015;float s=(fld(p+vec2(e,e)).x-f.x)/e;
vec3 base=mix(vec3(.969,.961,.984),vec3(.078,.071,.122),D);
vec3 c1=mix(vec3(1.,.87,.77),vec3(.42,.2,.1),D),c2=mix(vec3(.98,.82,.91),vec3(.36,.1,.2),D),c3=mix(vec3(.86,.82,1.),vec3(.2,.14,.42),D),c4=mix(vec3(.8,.96,.93),vec3(.06,.28,.3),D);
vec3 c=mix(c1,c2,smoothstep(.2,.8,f.y));c=mix(c,c3,smoothstep(.3,.9,f.z));c=mix(c,c4,smoothstep(.55,.85,f.x)*.7);
float m=mix(.5,.6,D)*smoothstep(.25,.75,f.x);
c=mix(base,c,m);c+=smoothstep(.0,.9,s)*mix(.035,.04,D);c-=smoothstep(.0,.9,-s)*mix(.015,.015,D);
gl_FragColor=vec4(c,1.);}`;
const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);return o};
const pg=gl.createProgram();gl.attachShader(pg,sh(gl.VERTEX_SHADER,vs));gl.attachShader(pg,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pg);
if(!gl.getProgramParameter(pg,gl.LINK_STATUS)){cv.remove();return}
gl.useProgram(pg);gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
const a=gl.getAttribLocation(pg,'a');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
const uR=gl.getUniformLocation(pg,'R'),uT=gl.getUniformLocation(pg,'T'),uD=gl.getUniformLocation(pg,'D'),uP=gl.getUniformLocation(pg,'P');
const pts=new Float32Array(96);let idx=0,lx=null,ly=null,dk=root.dataset.theme==='dark'?1:0,H=1;
function size(){const sc=Math.min(devicePixelRatio,1)*.5;cv.width=Math.max(2,innerWidth*sc|0);cv.height=Math.max(2,innerHeight*sc|0);H=innerHeight;gl.viewport(0,0,cv.width,cv.height);gl.uniform2f(uR,cv.width,cv.height)}
size();addEventListener('resize',size);
const add=(x,y,vx,vy)=>{const i=idx*4;pts[i]=x;pts[i+1]=y;pts[i+2]=vx;pts[i+3]=vy;idx=(idx+1)%24};
const g=(cx,cy)=>[cx/H*2,(1-cy/H)*2];
addEventListener('pointermove',e=>{const[x,y]=g(e.clientX,e.clientY);if(lx!==null){const vx=(x-lx)*.9,vy=(y-ly)*.9,m=Math.hypot(vx,vy);if(m>.002){const k=Math.min(1,.04/m);add(x,y,vx*k,vy*k)}}lx=x;ly=y},{passive:true});
addEventListener('pointerdown',e=>{const[x,y]=g(e.clientX,e.clientY);for(let k=0;k<8;k++){const t=k/8*6.283;add(x+Math.cos(t)*.04,y+Math.sin(t)*.04,Math.cos(t)*.03,Math.sin(t)*.03)}},{passive:true});
const still=matchMedia('(prefers-reduced-motion:reduce)').matches;let t0=performance.now();
function frame(now){const tg=root.dataset.theme==='dark'?1:0;dk+=(tg-dk)*.08;
for(let i=0;i<24;i++){pts[i*4+2]*=.94;pts[i*4+3]*=.94}
const t=still?12:(now-t0)/1000;
/* gentle idle swirl so the paint is alive even without a cursor */
if(!still){const w=t*.4;add(2*(innerWidth/H)*(.5+.4*Math.sin(w*.7)),1+.8*Math.cos(w*.9),.0012*Math.cos(w),.0012*Math.sin(w*1.3))}
gl.uniform1f(uT,t);gl.uniform1f(uD,dk);gl.uniform4fv(uP,pts);gl.drawArrays(gl.TRIANGLES,0,3);if(!still)requestAnimationFrame(frame)}
requestAnimationFrame(frame);if(still)tb.addEventListener('click',()=>requestAnimationFrame(frame))})();
