import * as T from './assets/vendor/three.module.js';

// All objects share a single coordinate system: trains travel on X; the bay is -Z.
export function buildCity(scene) {
  const material = (color, roughness=.65, metalness=0) => new T.MeshStandardMaterial({color,roughness,metalness});
  const cream=material('#f7f4e9'), white=material('#ffffff'), concrete=material('#d7ddd9'), edge=material('#aebdc0'), blue=material('#079ed1'), dark=material('#173b4b',.25), glass=material('#64bbce',.2,.18), steel=material('#829ca5',.38,.4), asphalt=material('#69899d'), yellow=material('#f9d468'), mint=material('#a1d77d'), bark=material('#826f51'), tire=material('#243643');
  const paint = color => new T.MeshPhysicalMaterial({color,roughness:.27,metalness:.18,clearcoat:.8,clearcoatRoughness:.2,envMapIntensity:.65});
  const trainPaint=paint('#f2f5f2'),busPaint=paint('#9ad36f'),taxiPaint=paint('#008ac9');
  const autoGlass=new T.MeshPhysicalMaterial({color:'#173e52',roughness:.13,metalness:.24,clearcoat:1,clearcoatRoughness:.1,envMapIntensity:1.25});
  const rubber=material('#253137',.92),chrome=material('#c0d0d3',.22,.8),lamp=new T.MeshStandardMaterial({color:'#fff6d9',emissive:'#ffe7b4',emissiveIntensity:.55});
  glass.transparent=true;glass.opacity=.76;glass.depthWrite=false;glass.envMapIntensity=.8;
  concrete.roughness=.94;asphalt.roughness=.96;steel.roughness=.28;steel.metalness=.72;
  const cube=new T.BoxGeometry(1,1,1), sphere=new T.SphereGeometry(1,12,8);
  function mesh(geo,mat,x,y,z,parent=scene){const m=new T.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
  function box(w,h,d,x,y,z,mat,parent=scene){const m=mesh(cube,mat,x,y,z,parent);m.scale.set(w,h,d);return m}
  function round(w,h,d,x,y,z,mat,parent=scene,r=.1){r=Math.min(r,w*.45,h*.45);const bevel=Math.min(r*.45,d*.2);const shape=new T.Shape();const a=w/2-r,b=h/2-r;shape.moveTo(-a,-h/2);shape.lineTo(a,-h/2);shape.quadraticCurveTo(w/2,-h/2,w/2,-b);shape.lineTo(w/2,b);shape.quadraticCurveTo(w/2,h/2,a,h/2);shape.lineTo(-a,h/2);shape.quadraticCurveTo(-w/2,h/2,-w/2,b);shape.lineTo(-w/2,-b);shape.quadraticCurveTo(-w/2,-h/2,-a,-h/2);const geo=new T.ExtrudeGeometry(shape,{depth:d-2*bevel,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:bevel,bevelThickness:bevel,curveSegments:6});geo.translate(0,0,-(d-2*bevel)/2);return mesh(geo,mat,x,y,z,parent)}
  function ball(x,y,z,sx,sy,sz,mat,parent=scene){const m=mesh(sphere,mat,x,y,z,parent);m.scale.set(sx,sy,sz);return m}
  function pole(a,b,r,mat,parent=scene){const va=new T.Vector3(...a),vb=new T.Vector3(...b);const m=mesh(new T.CylinderGeometry(r,r,va.distanceTo(vb),8),mat,0,0,0,parent);m.position.copy(va).add(vb).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),vb.sub(va).normalize());return m}
  function label(text,w,h,x,y,z,color='#ffffff',bg='#087ba7',parent=scene){const canvas=document.createElement('canvas');canvas.width=512;canvas.height=128;const ctx=canvas.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,512,128);ctx.fillStyle=color;ctx.font='600 74px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,256,67,480);const tex=new T.CanvasTexture(canvas);tex.colorSpace=T.SRGBColorSpace;const m=mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:tex}),x,y,z,parent);return m}
  let seed=14;function random(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}
  // Ground and water extend beyond the camera, avoiding the floating-square edge.
  box(240,.3,160,0,-.7,-35,material('#35b9d1',.3));box(150,.6,48,0,-.4,14,material('#d8e3d9'));box(150,.25,1.2,0,-.02,-9.5,cream);
  const rippleMat=material('#76d5e2',.3);for(let i=0;i<95;i++){box(.3+random()*1.7,.012,.035,-55+random()*105,-.53,-12-random()*47,rippleMat)}
  // Foreground boulevard, roadside pavement and protected cycling strip.
  box(120,.07,8.8,0,-.035,8.5,asphalt);box(120,.16,2.2,0,.02,2.95,cream);box(120,.16,3,0,.02,14.4,cream);box(120,.03,1.25,0,.12,13.7,material('#79bba9'));
  for(let x=-55;x<56;x+=3.2){box(1.6,.018,.1,x,.02,8.4,white);box(1.6,.018,.1,x,.02,11.1,white)}
  for(let z of [4.2,12.85])box(120,.022,.09,0,.035,z,yellow);
  for(let x=-38;x<40;x+=1.2){box(.023,.018,2.05,x,.12,2.9,edge);box(.023,.018,2.8,x,.13,14.5,edge)}
  for(let z of [2.4,3.1,14.8,15.4])box(100,.016,.022,0,.13,z,edge);
  // Zebra crossing and raised refuge.
  for(let z=4.5;z<12.8;z+=.72)box(2.9,.022,.36,-7,.025,z,white);
  box(3.2,.025,.4,-7,.13,3.7,yellow);box(3.2,.025,.4,-7,.13,13.2,yellow);
  for(let x of [-2,11])for(let z of [8.8,11.6]){box(1,.025,.15,x,.04,z,white);const a=box(.7,.025,.14,x+.5,.04,z-.22,white);a.rotation.y=.65;const b=box(.7,.025,.14,x+.5,.04,z+.22,white);b.rotation.y=-.65}
  // Continuous elevated double rail, sleepers, edge parapets and detailed pier caps.
  box(120,.62,3.25,0,4.85,-1,cream);box(120,.11,2.7,0,5.2,-1,material('#a2aaa7'));for(let z of [-2.55,.55])box(120,.24,.17,0,5.28,z,cream);
  for(let x=-56;x<60;x+=5.5){box(.65,4.45,.95,x,2.1,-1,concrete);box(1.5,.4,2.6,x,4.35,-1,cream);box(1.3,.3,1.7,x,.05,-1,concrete)}
  for(let x=-60;x<60;x+=.42)box(.13,.10,2.25,x,5.3,-1,material('#746f65'));
  for(let z of [-1.78,-.22]){box(120,.12,.11,0,5.41,z,steel);box(120,.04,.18,0,5.46,z,edge)}
  // Station behind the train: glazed hall, roof slab, railings and entrance tower.
  box(13,.4,3.2,2,4.85,-4.2,cream);round(14,.24,4,2,8.4,-4.2,white,scene,.12);box(13,.14,3.3,2,8.15,-4.2,concrete);
  for(let x=-3.5;x<=8;x+=2.8){box(.28,3.2,.3,x,6.65,-5.6,cream);box(.28,3.2,.3,x,6.65,-2.9,cream)}
  box(12.3,2.6,.08,2,6.55,-5.6,glass);for(let x=-4;x<8.5;x+=.8)box(.045,2.7,.09,x,6.55,-5.52,steel);box(12.3,.05,.11,2,6.65,-5.5,steel);
  for(let x=-4;x<9;x+=.7)pole([x,5.1,-2.62],[x,6,-2.62],.025,steel);pole([-4,6,-2.62],[8.5,6,-2.62],.04,steel);
  label('MRT',2.3,.38,1.6,7.67,-2.59,'#ffffff','#167b8b');
  round(1.7,7.5,1.8,10.2,3.75,-4.2,glass,scene,.12);round(2,.22,2.1,10.2,7.6,-4.2,cream,scene,.14);
  for(let x of [9.45,10.95])for(let z of [-5,-3.4])box(.09,7.5,.09,x,3.75,z,cream);for(let y=1;y<7;y+=1.1)box(1.7,.055,1.85,10.2,y,-4.2,steel);
  // Stair runs from station level to the bus-stop walkway.
  for(let i=0;i<21;i++)box(1.65,(21-i)*.245,.32,8.2,(21-i)*.1225,-2.8+i*.32,cream);
  for(let x of [7.3,9.1]){pole([x,6.05,-2.9],[x,1.15,3.6],.045,steel);for(let i=0;i<11;i++)pole([x,5.1-i*.47,-2.9+i*.62],[x,6.05-i*.47,-2.9+i*.62],.025,steel)}
  // One softly curved shelter roof shared by the bus stop and station walkway.
  function shelter(x,z,length){round(length,.22,1.85,x,2.95,z,cream,scene,.13);for(let a=x-length/2+.3;a<x+length/2;a+=2){pole([a,.1,z-.6],[a,2.9,z-.6],.06,steel);box(.9,1.75,.045,a+.55,1.45,z-.64,glass)} }
  shelter(6.8,2.8,9.2);box(3,.13,.45,6.5,.6,2.7,bark);for(let x of [5.4,7.6])box(.07,.6,.3,x,.3,2.7,steel);box(.65,1.65,.13,3.2,1.15,2.6,cream);label('BUS',.54,.32,3.2,1.65,2.68,'#ffffff','#167b8b');label('36  97',.53,.3,3.2,1.1,2.68,'#276574','#eef6ee');
  for(let z of [4.5,6.65])box(8,.025,.085,5.8,.06,z,yellow);for(let x of [1.8,9.8])box(.085,.025,2.2,x,.06,5.6,yellow);
  const busMark=label('BUS',2.5,.75,6,.065,6.15,'#ffffff','#69899d');busMark.rotation.x=-Math.PI/2;
  // Vehicles have individual windows, seals, doors, wheels and lamps.
  function wheel(x,y,z,r,parent){
    const w=mesh(new T.CylinderGeometry(r,r,.2,28),rubber,x,y,z,parent);w.rotation.x=Math.PI/2;
    const hub=mesh(new T.CylinderGeometry(r*.57,r*.57,.215,24),chrome,x,y,z,parent);hub.rotation.x=Math.PI/2;
    const cap=mesh(new T.CylinderGeometry(r*.18,r*.18,.23,16),steel,x,y,z,parent);cap.rotation.x=Math.PI/2;
    for(let i=0;i<6;i++){const a=i*Math.PI/3;for(let side of [-1,1])ball(x+Math.sin(a)*r*.39,y+Math.cos(a)*r*.39,z+side*.111,r*.08,r*.08,.012,rubber,parent)}
  }
  function sideWindow(w,h,x,y,z,parent){round(w+.06,h+.06,.033,x,y,z,rubber,parent,.065);round(w,h,.037,x,y,z+Math.sign(z)*.017,autoGlass,parent,.06);box(w*.77,.035,.012,x,y+h*.34,z+Math.sign(z)*.041,glass,parent)}
  function frontPanel(w,h,x,y,mat,parent){const m=round(w,h,.05,x,y,0,mat,parent,.09);m.rotation.y=Math.PI/2;return m}
  const bus=new T.Group();bus.position.set(5.1,0,5.35);scene.add(bus);
  round(5.4,2.95,1.7,0,1.95,0,busPaint,bus,.24);round(4.5,.17,1.37,-.25,3.48,0,cream,bus,.07);
  box(4.9,.15,1.73,0,.55,0,steel,bus);
  for(let z of [-.87,.87]){
    for(let x=-2.08;x<2.3;x+=.78){sideWindow(.67,.7,x,2.7,z,bus);if(x<.8)sideWindow(.67,.65,x,1.53,z,bus)}
    box(5,.065,.035,0,2.1,z,chrome,bus);round(.74,1.66,.045,1.28,1.43,z,rubber,bus,.065);
    for(let x of [1.09,1.47])sideWindow(.29,1.47,x,1.45,z+Math.sign(z)*.03,bus);
    box(.025,1.6,.08,1.28,1.45,z,busPaint,bus);
    for(let x of [-1.85,-1.1,1.75])wheel(x,.5,z,.43,bus);
    for(let y=.77;y<1.16;y+=.085)box(.65,.025,.025,-2.12,y,z+Math.sign(z)*.02,rubber,bus);
    pole([2.38,2.25,z],[2.72,2.25,z+Math.sign(z)*.24],.035,steel,bus);round(.2,.35,.13,2.74,2.1,z+Math.sign(z)*.25,rubber,bus,.06);
    box(4.6,.027,.025,-.1,.98,z+Math.sign(z)*.02,busPaint,bus);
  }
  frontPanel(1.46,.89,2.85,2.76,autoGlass,bus);frontPanel(1.45,.88,2.85,1.45,autoGlass,bus);
  const route=label('36  CITY',1.42,.28,2.89,2.16,0,'#ffe9a4','#142a30',bus);route.rotation.y=Math.PI/2;
  for(let z of [-.55,.55]){box(.045,.15,.3,2.9,.81,z,lamp,bus);box(.035,.06,.22,2.9,.67,z,chrome,bus);pole([2.77,1.03,z],[2.79,1.46,z-.2],.014,rubber,bus)}
  frontPanel(.72,.18,2.77,.45,chrome,bus);frontPanel(.5,.12,2.80,.48,cream,bus);
  // Sedan profile has a sloped bonnet, raked windscreen and narrower roof.
  function profile(points,depth,mat,parent){const shape=new T.Shape();points.forEach(([x,y],i)=>i?shape.lineTo(x,y):shape.moveTo(x,y));shape.closePath();const geo=new T.ExtrudeGeometry(shape,{depth:depth-.08,bevelEnabled:true,bevelSize:.035,bevelThickness:.04,bevelSegments:3,curveSegments:6,steps:1});geo.translate(0,0,-(depth-.08)/2);return mesh(geo,mat,0,0,0,parent)}
  const taxi=new T.Group();taxi.position.set(.2,0,10);scene.add(taxi);
  profile([[-1.65,.5],[1.65,.5],[1.63,.86],[1.35,.99],[.7,1.02],[-1.25,1.02],[-1.65,.88]],1.5,taxiPaint,taxi);
  profile([[-1.05,1.01],[-.63,1.58],[.32,1.58],[.88,1.01]],1.25,taxiPaint,taxi);
  for(let z of [-.642,.642]){
    const window=profile([[-.92,1.09],[-.57,1.49],[.27,1.49],[.72,1.09]],.025,autoGlass,taxi);window.position.z=z;
    box(.047,.41,.05,-.18,1.29,z,taxiPaint,taxi);box(1.57,.027,.05,-.12,1.055,z,chrome,taxi);
    for(let x of [-.52,.35])box(.18,.035,.06,x,.96,z*1.17,chrome,taxi);
    box(.023,.45,.025,-.18,.77,z*1.17,rubber,taxi);ball(.66,1.13,z*1.22,.16,.065,.095,taxiPaint,taxi);
  }
  const windscreen=box(.04,.55,1.1,.60,1.3,0,autoGlass,taxi);windscreen.rotation.z=.74;
  const rearGlass=box(.035,.52,1.1,-.82,1.3,0,autoGlass,taxi);rearGlass.rotation.z=-.65;
  for(let z of [-.77,.77])for(let x of [-1.05,1.05])wheel(x,.4,z,.34,taxi);
  round(.64,.2,.38,-.12,1.73,0,white,taxi,.06);label('TAXI',.59,.16,-.12,1.73,.205,'#ffffff','#087bb2',taxi);
  for(let z of [-.48,.48]){box(.045,.14,.35,1.67,.83,z,lamp,taxi);box(.04,.15,.26,-1.67,.83,z,material('#a93338'),taxi)}
  frontPanel(.78,.16,1.68,.61,rubber,taxi);for(let y of [.57,.63,.69])box(.025,.013,.74,1.71,y,0,chrome,taxi);frontPanel(.35,.12,1.72,.47,white,taxi);
  // Two staggered through-lanes; the bus keeps its separate kerbside lane.
  const cars=[taxi];taxi.position.z=11.25;
  const carColors=['#ede9df','#557c88','#b76453','#819a87','#42657c'];
  for(let i=1;i<12;i++){
    const car=taxi.clone(true),bodyPaint=paint(carColors[(i-1)%carColors.length]);
    car.traverse(part=>{if(part.isMesh&&part.material===taxiPaint)part.material=bodyPaint});
    // Remove the roof taxi sign on ordinary passenger cars.
    for(const part of [...car.children])if(part.position.y>1.65)car.remove(part);
    car.position.z=i<6?11.25:8.5;scene.add(car);cars.push(car);
  }
  // ERP spans the road perpendicular to traffic, on the left of the crossing.
  for(let z of [3.9,13]){box(.35,4.5,.4,-12,2.2,z,concrete);box(.75,.2,.75,-12,.1,z,cream)}box(.4,.7,9.5,-12,4.4,8.45,cream);
  const erp=label('ERP',2.3,.62,-11.77,4.42,8.45);erp.rotation.y=Math.PI/2;for(let z of [5.7,8.3,11])box(.55,.24,.4,-11.7,3.85,z,dark);
  for(let z of [3.5,13.3]){pole([-5.2,.1,z],[-5.2,2.6,z],.06,steel);round(.34,.9,.26,-5.2,2.3,z,tire,scene,.05);for(let i=0;i<3;i++)ball(-5.2,2.57-i*.26,z+.15,.09,.09,.035,material(i===2?'#3de0a0':i===0?'#aa514e':'#a59865'))}
  for(let x of [-16,-1,15]){pole([x,.1,13],[x,4,13],.065,steel);pole([x,4,13],[x,4.2,11.7],.065,steel);round(.27,.14,.8,x,4.2,11.4,cream,scene,.055)}
  // Lush umbrella trees, shrubs and flowers use instancing to limit draw calls.
  const leafTransforms=[],leafColors=[],dummy=new T.Object3D();
  function leaf(x,y,z,sx,sy,sz,c){dummy.position.set(x,y,z);dummy.scale.set(sx,sy,sz);dummy.updateMatrix();leafTransforms.push(dummy.matrix.clone());leafColors.push(new T.Color(c))}
  function tree(x,z,s=1){
    // Broad, layered rain-tree crown with visible branching and a darker underside.
    const lean=(random()-.5)*.25*s;
    pole([x,.05,z],[x+lean,1.65*s,z],.12*s,bark);
    for(let i=0;i<5;i++){
      const angle=i*Math.PI*2/5+random()*.3;
      const bx=x+Math.cos(angle)*.9*s,bz=z+Math.sin(angle)*.8*s;
      pole([x+lean,1.15*s,z],[bx,2.15*s,bz],.067*s,bark);
      pole([bx,2.15*s,bz],[bx+Math.cos(angle)*.45*s,2.42*s,bz+Math.sin(angle)*.4*s],.035*s,bark);
    }
    leaf(x,2.13*s,z,1.25*s,.25*s,1.1*s,'#34785a');
    for(let i=0;i<28;i++){
      const angle=random()*Math.PI*2,r=Math.sqrt(random())*1.4*s;
      const height=(2.35+.27*(1-r/(1.5*s))+random()*.13)*s;
      leaf(x+Math.cos(angle)*r,height,z+Math.sin(angle)*r,.38*s+random()*.16*s,.21*s+random()*.08*s,.36*s+random()*.13*s,['#498d61','#609f68','#70a572','#408c66'][i%4]);
    }
  }
  function shrub(x,z,s=.4){
    for(let i=0;i<5;i++)leaf(x+(random()-.5)*s,.19+random()*.13,z+(random()-.5)*s,s*.62,s*.36,s*.55,['#528f64','#70a376','#448264'][i%3]);
  }
  for(let x=-30;x<=28;x+=3.3){tree(x+(random()-.5)*.6,-7+(random()-.5)*.35,.9+random()*.3);if(x<0||x>12)tree(x,2,.85+random()*.25);if(x<-13||x>17)tree(x,18,1.25+random()*.3)}
  for(let x=-32;x<34;x+=.8){shrub(x,1.25);shrub(x,15.8);if(x<-10||x>0)shrub(x,3.65,.3)}
  for(let x=-40;x<35;x+=2.5)tree(x,-32,.45+random()*.13);
  const foliage=new T.InstancedMesh(sphere,material('#ffffff'),leafTransforms.length);leafTransforms.forEach((m,i)=>{foliage.setMatrixAt(i,m);foliage.setColorAt(i,leafColors[i])});foliage.castShadow=true;foliage.receiveShadow=true;scene.add(foliage);
  // Small people and bicycle details establish scale.
  function bicycle(x,z){for(let a of [-.45,.45]){const w=mesh(new T.TorusGeometry(.33,.025,6,20),tire,x+a,.45,z);w.rotation.y=0}for(let a of [[-.45,.45,0,.78],[0,.78,.45,.45],[.45,.45,-.1,.45],[-.1,.45,-.45,.45],[-.1,.45,0,.78]])pole([x+a[0],a[1],z],[x+a[2],a[3],z],.025,blue);pole([x+.45,.45,z],[x+.3,1,z],.025,steel);box(.22,.06,.15,x, .83,z,tire)}bicycle(11.7,3);bicycle(12.4,3.3);
  // A west-to-east bay composition: near-bank Merlion, Flyer north/left,
  // Sands south/right. Distances are compressed for the transport illustration.
  function land(points,y,mat){const shape=new T.Shape();points.forEach(([x,z],i)=>i?shape.lineTo(x,-z):shape.moveTo(x,-z));shape.closePath();const geo=new T.ShapeGeometry(shape);geo.rotateX(-Math.PI/2);return mesh(geo,mat,0,y,0)}
  const shore=[[-65,-23],[-30,-23],[-22,-24],[-12,-27],[-2,-28],[8,-26],[18,-24],[65,-24],[65,-85],[-65,-85]];
  land(shore,-.25,cream);
  const inland=land(shore.map(([x,z])=>[x,z-1.1]),-.20,material('#b9d2ba'));
  inland.material.polygonOffset=true;inland.material.polygonOffsetFactor=-1;inland.material.polygonOffsetUnits=-1;
  // Far-bank promenade edge: a single continuous waterfront rather than islands.
  const shoreCurve=new T.CatmullRomCurve3(shore.slice(0,8).map(([x,z])=>new T.Vector3(x,-.15,z)));
  mesh(new T.TubeGeometry(shoreCurve,90,.09,6,false),concrete,0,0,0);
  // Promenade follows the same coast curve; all fixtures stay on its land side.
  const walkPoints=shoreCurve.getPoints(100);
  for(let i=0;i<walkPoints.length-1;i++){
    const a=walkPoints[i],b=walkPoints[i+1];
    pole([a.x,-.1,a.z-.45],[b.x,-.1,b.z-.45],.22,cream);
    pole([a.x,.52,a.z-.3],[b.x,.52,b.z-.3],.022,steel);
    pole([a.x,.25,a.z-.3],[b.x,.25,b.z-.3],.014,steel);
    if(i%2===0)pole([a.x,-.1,a.z-.3],[a.x,.55,a.z-.3],.025,steel);
  }
  for(const t of [.35,.48,.66]){
    const p=shoreCurve.getPoint(t);
    box(1.25,.1,.42,p.x,.3,p.z-1.3,bark);
    box(1.25,.35,.06,p.x,.52,p.z-1.5,bark);
    for(let dx of [-.45,.45])box(.055,.43,.3,p.x+dx,.1,p.z-1.3,steel);
    pole([p.x+1.8,-.15,p.z-1.25],[p.x+1.8,1.4,p.z-1.25],.032,steel);
    ball(p.x+1.8,1.45,p.z-1.25,.12,.07,.12,cream);
  }
  // Three paired, tapering hotel towers with a continuous cantilevered SkyPark.
  const sands=new T.Group();sands.position.set(-6,-.18,-29.5);scene.add(sands);
  round(9,.5,3.7,0,.25,0,cream,sands,.12);
  for(let x of [-2.7,0,2.7]){
    for(let side of [-1,1]){
      const tower=box(.84,5.3,1.5,x+side*.36,2.95,0,glass,sands);tower.rotation.z=-side*.055;
      for(let y=.55;y<5.6;y+=.24)box(1.62,.027,1.55,x,y,0,concrete,sands);
      box(.12,5.4,1.58,x+side*.82,2.95,0,cream,sands).rotation.z=-side*.055;
    }
  }
  const deck=round(10.2,.35,2.35,.3,5.78,0,cream,sands,.17);
  round(9.3,.08,1.65,.3,6.02,0,material('#6baf94'),sands,.035);
  box(5.4,.035,.42,-.5,6.075,.45,material('#57c6d9'),sands);
  for(let x=-3.8;x<4.4;x+=.5)ball(x,6.16,-.48,.1,.13,.1,material('#568767'),sands);
  // Low waterfront mall podium connects the towers to the promenade.
  round(10.8,.55,2.1,.2,.46,2.15,cream,sands,.1);
  for(let x=-4.9;x<5.4;x+=.48)box(.3,.35,.04,x,.52,3.22,glass,sands);
  // Flyer is inland on the northern shore, on a supported base.
  // Shared anchor keeps the wheel, supports and foundation parallel to this shore segment.
  const flyerSite=new T.Group();flyerSite.position.set(-17.8,0,-27.5);flyerSite.rotation.y=Math.atan2(3,10);scene.add(flyerSite);
  const flyer=new T.Group();flyer.position.set(0,2.3,0);flyer.scale.setScalar(.78);flyerSite.add(flyer);
  const rotor=new T.Group(),cabins=[];flyer.add(rotor);
  mesh(new T.TorusGeometry(2.6,.045,8,80),white,0,0,0,rotor);
  mesh(new T.TorusGeometry(2.55,.03,8,80),steel,0,0,-.22,rotor);
  // Opaque coated glass avoids transparent-shell sorting flicker at this distance.
  const cabinGlass=material('#80bbc7',.8,0);
  for(let i=0;i<28;i++){
    const a=i*Math.PI/14,sin=Math.sin(a),cos=Math.cos(a),x=sin*2.6,y=cos*2.6;
    pole([sin*.16,cos*.16,0],[x,y,0],.022,white,rotor);
    cabins.push(round(.25,.16,.38,x,y,0,cabinGlass,rotor,.045));
  }
  ball(0,0,0,.18,.18,.16,cream,flyer);
  for(let x of [-1.1,1.1])for(let z of [-.35,.35])pole([x,-3,z],[0,0,z],.075,white,flyer);
  box(3.7,.6,2,0,.05,0,cream,flyerSite);box(4.4,.22,2.5,0,-.12,0,concrete,flyerSite);
  // Thin distant members should not receive/cast animated shadow-map noise.
  flyerSite.traverse(part=>{
    if(!part.isMesh)return;
    part.castShadow=false;part.receiveShadow=false;
    // Stable distant shading: no sharp environment reflections as the camera turns.
    const stable=part.material.clone();stable.roughness=1;stable.metalness=0;
    stable.envMapIntensity=0;stable.transparent=false;stable.opacity=1;stable.depthWrite=true;
    part.material=stable;
  });
  // Merlion Park projects from the near western shore and faces the open bay.
  land([[-45,-9.5],[-14,-9.5],[-14,-12],[-17,-14.2],[-24,-14.2],[-30,-12.8],[-45,-12.8]],-.08,cream);
  for(let x=-28;x<-15;x+=.7)box(.025,.022,2.5,x,-.05,-12.5,edge);
  const merlion=new T.Group();merlion.position.set(-18.4,0,-13.4);merlion.rotation.y=Math.PI/2;scene.add(merlion);
  round(1.35,.2,1.15,0,.04,0,concrete,merlion,.08);
  ball(0,.68,0,.31,.62,.28,white,merlion);ball(-.07,1.38,0,.3,.34,.29,white,merlion);
  ball(.2,1.38,.02,.24,.13,.18,white,merlion);ball(.17,1.5,.22,.028,.032,.02,dark,merlion);
  for(let i=0;i<9;i++)ball(-.13+Math.sin(i*.7)*.2,1.34+Math.cos(i*.7)*.31,-.06,.11,.12,.12,cream,merlion);
  for(let y=.25;y<.9;y+=.13)for(let z of [-.18,0,.18])ball(.18,y,z,.075,.045,.085,cream,merlion);
  const waterAt=t=>new T.Vector3(-18.38,1.38+.65*t-2.56*t*t,-13.64-t*2.5);
  const waterCurve=new T.CatmullRomCurve3(Array.from({length:33},(_,i)=>waterAt(i/32)));
  const waterMat=new T.MeshBasicMaterial({color:'#b6edf5'});
  const stream=mesh(new T.TubeGeometry(waterCurve,48,.026,8,false),waterMat,0,0,0);
  stream.castShadow=false;stream.receiveShadow=false;
  const droplets=Array.from({length:24},()=>{
    const drop=ball(0,0,0,.035,.045,.035,waterMat);drop.castShadow=false;drop.receiveShadow=false;return drop;
  });
  const landing=waterAt(1);
  const ripples=Array.from({length:3},(_,i)=>{
    const m=new T.MeshBasicMaterial({color:'#d1f5f7',transparent:true,opacity:.5,depthWrite:false});
    const ring=mesh(new T.TorusGeometry(1,.025,6,48),m,landing.x,-.525+i*.002,landing.z);
    ring.rotation.x=-Math.PI/2;ring.castShadow=false;ring.receiveShadow=false;return ring;
  });
  const spray=Array.from({length:10},()=>{
    const drop=ball(0,0,0,.025,.035,.025,waterMat);drop.castShadow=false;drop.receiveShadow=false;return drop;
  });
  function updateLandmarks(seconds){
    // One revolution per 90 seconds, with cabins counter-rotated to remain level.
    const angle=-seconds*Math.PI*2/90;
    rotor.rotation.z=angle;cabins.forEach(c=>c.rotation.z=-angle);
    droplets.forEach((drop,i)=>{
      const t=(seconds*.65+i/droplets.length)%1;drop.position.copy(waterAt(t));
      drop.scale.set(.03+t*.018,.045+t*.025,.03+t*.018);
    });
    ripples.forEach((ring,i)=>{
      const t=(seconds*.6+i/3)%1;ring.scale.setScalar(.08+t*.52);ring.material.opacity=(1-t)*.48;
    });
    spray.forEach((drop,i)=>{
      const t=(seconds*1.3+i/10)%1,angle=i*2.399;
      drop.position.set(landing.x+Math.cos(angle)*t*.32,-.52+Math.sin(t*Math.PI)*.18,landing.z+Math.sin(angle)*t*.32);
      drop.visible=t<.92;
    });
  }
  updateLandmarks(0);
  // Background residential block, partly cropped at the right edge.
  box(4.5,8,3,16,3.6,-5.5,cream);for(let x=14.3;x<18;x+=.8)for(let y=1;y<7.4;y+=1.15){box(.48,.65,.04,x,y,-3.97,glass);box(.62,.07,.3,x,y-.35,-3.86,white)}
  const train=new T.Group();train.position.set(-5,5.55,-1);train.rotation.y=Math.PI;scene.add(train);
  for(let i=0;i<4;i++){const x=-i*3.65;round(3.45,1.42,1.65,x,.99,0,trainPaint,train,.19);box(3.43,.18,1.69,x,.53,0,blue,train);round(2.7,.13,1.2,x,1.76,0,white,train,.05);for(let z of [-.84,.84]){for(let wx of [-1.1,-.52,.65,1.2])sideWindow(.44,.62,x+wx,1.12,z,train);round(.51,1.12,.045,x+.08,.98,z,blue,train,.045);box(.018,1.08,.06,x+.08,.98,z,cream,train);for(let dx of [-.07,.23])box(.105,.53,.06,x+dx,1.2,z,dark,train);for(let a of [-1.03,1.03])wheel(x+a,.25,z,.19,train)}if(i<3)round(.18,1.05,1.2,x-1.82,.95,0,steel,train,.05)}
  // Rounded cab shell and layered windscreen, destination panel and running lights.
  const nose=round(1.62,1.34,.35,1.76,1,0,trainPaint,train,.18);nose.rotation.y=Math.PI/2;
  frontPanel(1.31,.77,1.96,1.18,autoGlass,train);
  box(.06,.69,.045,2.0,1.18,0,steel,train);
  const destination=label('01  MRT',.75,.18,2.0,1.68,0,'#bcf4f5','#173b4b',train);destination.rotation.y=Math.PI/2;
  for(let z of [-.56,.56]){box(.04,.11,.24,2,.62,z,lamp,train);pole([2.01,.86,z],[2.01,1.15,z-.15],.012,rubber,train)}
  frontPanel(1.38,.16,1.98,.43,blue,train);box(.3,.12,.22,2,.28,0,steel,train);
  for(let i=0;i<4;i++){const x=-i*3.65;box(2.65,.16,1.22,x,.28,0,rubber,train);
    for(let z of [-.87,.87]){box(3.25,.025,.02,x,.70,z,chrome,train);for(let dx of [-.12,.27])box(.035,.12,.04,x+dx,.97,z,chrome,train)}
    for(let dx of [-.65,.65]){round(.62,.12,.75,x+dx,1.84,0,steel,train,.04);for(let j=0;j<5;j++)box(.48,.014,.025,x+dx,1.913,-.25+j*.12,rubber,train)}
  }
  return {train,restX:-5,bus,cars,updateLandmarks};
}
