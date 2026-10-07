import * as T from './assets/vendor/three.module.js';
import {buildCity} from './login-city.js';
const host=document.querySelector('#scene'),status=document.querySelector('#scene-status'),motion=document.querySelector('#motion'),depart=document.querySelector('#depart');
try {
  const renderer=new T.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1;host.appendChild(renderer.domElement);
  const scene=new T.Scene();scene.background=new T.Color('#b7dfe5');scene.fog=new T.Fog('#b7dfe5',45,145);
  const camera=new T.PerspectiveCamera(49,1,.5,220);camera.position.set(0,7.5,27);camera.lookAt(0,3.5,-50);
  scene.add(new T.HemisphereLight('#f7fcff','#88a3a0',2));const sun=new T.DirectionalLight('#fff5df',2.8);sun.position.set(-22,38,20);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-35,right:35,top:50,bottom:-50,near:1,far:160});sun.shadow.normalBias=.035;scene.add(sun);
  const mat=c=>new T.MeshStandardMaterial({color:c,roughness:.7});const white=mat('#f2f0e6'),concrete=mat('#c5d5d5'),steel=mat('#647d86'),glass=mat('#91bdca'),green=mat('#609a78'),trunk=mat('#8c8068'),road=mat('#7396a5'),yellow=mat('#e9d592');
  const cube=new T.BoxGeometry(1,1,1),sphere=new T.SphereGeometry(1,12,8);
  function box(w,h,d,x,y,z,m){const o=new T.Mesh(cube,m);o.scale.set(w,h,d);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;scene.add(o);return o}
  function ball(x,y,z,sx,sy,sz,m){const o=new T.Mesh(sphere,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=true;scene.add(o);return o}
  box(160,.4,220,0,-.5,-65,mat('#d6e4db'));
  // Both transport corridors share a vanishing point behind the central panel.
  box(5.6,.35,180,-8,.45,-65,white);box(5,.12,180,-8,.7,-65,mat('#a1acaa'));
  for(const x of [-8.8,-7.2])box(.13,.13,180,x,.87,-65,steel);
  for(let z=-145;z<25;z+=.52)box(2.3,.09,.17,-8,.78,z,concrete);
  for(const x of [-10.65,-5.35])box(.14,.25,180,x,.85,-65,white);
  box(7,.08,180,8,-.2,-65,road);
  for(const x of [4.6,11.4])box(.085,.025,180,x,-.145,-65,yellow);
  for(let z=-145;z<26;z+=4)box(.12,.028,1.9,8,-.14,z,white);
  box(2.5,.15,180,13,-.1,-65,white);box(2.2,.15,180,-12,-.1,-65,white);
  // A quiet landscaped median remains behind the login card.
  box(6.5,.15,180,0,-.13,-65,mat('#adcdbb'));
  for(let z=-130;z<22;z+=9){
    for(let side of [-1,1]){
      const x=side*13.4;box(.16,3.2,.16,x,1.5,z,trunk);
      ball(x,3.3,z,1.6,.6,1.25,green);ball(x+.55,3.55,z+.15,.9,.45,.85,mat('#75a889'));
      box(.085,4.6,.085,side*11.7,2.2,z+4,steel);box(1,.12,.3,side*11.3,4.5,z+4,white);
    }
  }
  for(let i=0;i<10;i++)for(let side of [-1,1]){
    const z=4-i*15,h=15+(i%4)*3.2,x=side*(18+(i%2)*1.4);
    box(6,h,8,x,h/2-.2,z,i%2?white:concrete);
    // Separate window strips and frame bands make the perspective readable.
    for(let y=1;y<h-.4;y+=1.4){box(6.03,.82,8.03,x,y,z,glass);box(6.12,.12,8.12,x,y+.49,z,white)}
    for(let dx of [-2,0,2])box(.1,h,8.08,x+dx,h/2-.2,z,white);
  }
  // Station and shelter flank the scene instead of competing with the central form.
  box(3,.28,13,-11.7,1,-18,white);box(4,.25,15,-11.7,4.9,-18,white);
  for(let z=-24;z<=-12;z+=3)box(.18,3.9,.18,-13,2.9,z,concrete);
  box(2.8,.18,8,12.2,3,-6,white);for(let z of [-9,-3])box(.1,3,.1,13.2,1.4,z,steel);
  // Reuse the detailed vehicles, detached from the first version's city layout.
  const source=new T.Group();const models=buildCity(source);
  const train=models.train;scene.add(train);train.rotation.y=-Math.PI/2;train.position.set(-8,1.02,6);
  const bus=models.bus;scene.add(bus);bus.rotation.y=-Math.PI/2;bus.position.set(7.3,0,4);
  const secondTrain=train.clone(true);scene.add(secondTrain);
  const secondBus=bus.clone(true);scene.add(secondBus);
  const cars=models.cars.slice(0,4);cars.forEach((car,i)=>{scene.add(car);car.rotation.y=-Math.PI/2;car.position.set(10.1,0,-i*23)});
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');let paused=reduced.matches,time=0,last=performance.now();const pointer=new T.Vector2(),smoothed=new T.Vector2();
  function sync(){motion.textContent=paused?'Resume motion':'Pause motion';motion.setAttribute('aria-pressed',String(paused));status.textContent=paused?'Motion paused':'Move to explore';depart.hidden=true}
  motion.onclick=()=>{paused=!paused;sync()};reduced.addEventListener('change',e=>{paused=e.matches;sync()});
  host.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'){const r=host.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width-.5,(e.clientY-r.top)/r.height-.5)}});host.addEventListener('pointerleave',()=>pointer.set(0,0));
  function resize(){const {width,height}=host.getBoundingClientRect();camera.aspect=width/height;camera.fov=width<900?64:49;camera.updateProjectionMatrix();renderer.setSize(width,height,false)}new ResizeObserver(resize).observe(host);resize();sync();
  function loop(now){requestAnimationFrame(loop);const dt=Math.min((now-last)/1000,.05);last=now;if(document.hidden)return;if(!paused){time+=dt;train.position.z=((time*3+76)%110)-70;bus.position.z=((time*2.2+69)%95)-65;secondTrain.position.z=((time*3+21)%110)-70;secondBus.position.z=((time*2.2+21.5)%95)-65;cars.forEach((car,i)=>car.position.z=((time*3.4+i*23+50)%100)-65);smoothed.lerp(pointer,1-Math.exp(-dt*3));camera.position.x=smoothed.x*.9;camera.position.y=7.5+smoothed.y*.5;camera.lookAt(0,3.5,-50)}renderer.render(scene,camera)}requestAnimationFrame(loop);
} catch(e){console.error(e);status.textContent='The 3D scene could not load. Please refresh.';motion.disabled=true;document.querySelector('#scene-fallback').hidden=false}
