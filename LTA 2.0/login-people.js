import * as T from './assets/vendor/three.module.js';
import {cyclingPose} from './login-cycling.js';

export function buildPeople(scene) {
  const mat=c=>new T.MeshStandardMaterial({color:c,roughness:.75});
  const skin=mat('#d6aa86'),hair=mat('#34302c'),pants=mat('#344a5a'),shoe=mat('#eef0e7'),metal=mat('#90a7ad'),rubber=mat('#283a40');
  const sphere=new T.SphereGeometry(1,20,14),rod=new T.CylinderGeometry(1,1,1,12);
  function ball(parent,x,y,z,scale,m){const o=new T.Mesh(sphere,m);o.position.set(x,y,z);o.scale.set(...scale);o.castShadow=true;parent.add(o);return o}
  function bar(parent,a,b,r,m){const o=new T.Mesh(rod,m);o.castShadow=true;parent.add(o);pose(o,a,b,r);return o}
  function pose(o,a,b,r){const from=new T.Vector3(...a),to=new T.Vector3(...b),delta=to.clone().sub(from);o.position.copy(from).add(to).multiplyScalar(.5);o.scale.set(r,delta.length(),r);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize())}
  const trim=mat('#e2e7df'),strap=mat('#52656b'),lips=mat('#aa7766');
  function head(parent,x,y,z,helmet,variant=0){
    const g=new T.Group();g.position.set(x,y,z);parent.add(g);
    ball(g,0,0,0,[.108,.14,.108],skin);
    ball(g,-.025,.089,0,[.114,.078,.114],hair);
    for(let side of [-1,1]){
      ball(g,-.012,-.012,side*.105,[.026,.035,.018],skin);
      ball(g,.091,.023,side*.049,[.012,.013,.012],hair);
      bar(g,[.087,.051,side*.033],[.086,.052,side*.067],.008,hair);
    }
    ball(g,.109,-.011,0,[.035,.024,.025],skin);
    bar(g,[.098,-.063,-.022],[.098,-.063,.022],.006,lips);
    bar(g,[0,-.12,0],[0,-.19,0],.042,skin);
    if(helmet){
      ball(g,-.016,.101,0,[.141,.088,.136],helmet);
      ball(g,.112,.081,0,[.066,.02,.125],helmet);
      for(let z of [-.065,0,.065])bar(g,[-.065,.173,z],[.065,.173,z],.013,strap);
      for(let side of [-1,1]){bar(g,[.02,.07,side*.125],[.018,-.09,side*.08],.009,strap);bar(g,[-.07,.065,side*.1],[.018,-.09,side*.08],.009,strap)}
    }else if(variant%2){
      ball(g,-.105,.015,0,[.065,.1,.09],hair);ball(g,-.15,-.04,0,[.045,.1,.045],hair);
    }else{ball(g,.043,.11,0,[.075,.057,.1],hair)}
    return g;
  }
  function sneaker(parent,x,y,z){
    const g=new T.Group();g.position.set(x,y,z);parent.add(g);
    ball(g,.022,-.024,0,[.12,.022,.066],trim);
    ball(g,.012,.003,0,[.112,.043,.061],shoe);
    ball(g,-.06,.028,0,[.035,.04,.053],strap);
    for(let dx of [-.01,.016,.042])bar(g,[dx,.042,-.027],[dx,.042,.027],.005,trim);
    return g;
  }
  const walkers=[];
  for(const [i,color] of ['#d8a86e','#378c9c','#a66661','#718793'].entries()){
    const g=new T.Group();scene.add(g);const shirt=mat(color);
    ball(g,0,1.08,0,[.16,.24,.17],shirt);head(g,0,1.46,0,null,i);
    ball(g,0,.91,0,[.13,.085,.145],pants);
    bar(g,[.152,.96,0],[.153,1.22,0],.009,trim);
    // Backpack sits behind the direction of travel.
    ball(g,-.17,1.1,0,[.095,.18,.15],mat('#63746b'));
    ball(g,-.245,1.06,0,[.035,.075,.115],strap);
    for(let side of [-1,1])bar(g,[.04,1.28,side*.13],[.08,.99,side*.13],.017,strap);
    const legs=[],arms=[],feet=[];
    for(let side of [-1,1]){
      legs.push({upper:bar(g,[0,0,0],[0,1,0],.06,pants),lower:bar(g,[0,0,0],[0,1,0],.05,pants),knee:ball(g,0,.57,side*.095,[.055,.06,.055],pants)});
      arms.push({upper:bar(g,[0,0,0],[0,1,0],.05,shirt),lower:bar(g,[0,0,0],[0,1,0],.033,skin),hand:ball(g,0,.85,side*.21,[.037,.048,.028],skin)});
      feet.push(sneaker(g,0,.19,side*.095));
    }
    const direction=i%2?-1:1;g.rotation.y=direction<0?Math.PI:0;
    walkers.push({g,legs,arms,feet,direction,offset:i*22,speed:.48+i*.045,z:i%2?15.25:14.75});
  }
  const cyclists=[];
  for(let i=0;i<2;i++){
    const g=new T.Group();scene.add(g);const frame=mat(i?'#be8064':'#298fa6'),shirt=mat(i?'#e0a868':'#2f9aa0');
    const wheels=[];
    for(let x of [-.53,.53]){
      const wheel=new T.Group();wheel.position.set(x,.48,0);g.add(wheel);
      const rim=new T.Mesh(new T.TorusGeometry(.35,.032,8,28),rubber);rim.castShadow=true;wheel.add(rim);
      for(let j=0;j<8;j++){const a=j*Math.PI/4;bar(wheel,[0,0,0],[Math.sin(a)*.34,Math.cos(a)*.34,0],.008,metal)}
      wheels.push(wheel);
    }
    for(const [a,b] of [ [[-.53,.48,0],[-.15,.89,0]],[[-.15,.89,0],[.37,.89,0]],[[.37,.89,0],[.53,.48,0]],[[.53,.48,0],[-.04,.47,0]],[[-.04,.47,0],[-.53,.48,0]],[[-.04,.47,0],[-.15,.89,0]] ])bar(g,a,b,.028,frame);
    bar(g,[-.15,.89,0],[-.2,1.02,0],.026,metal);ball(g,-.22,1.04,0,[.16,.045,.09],rubber);
    bar(g,[.37,.89,0],[.35,1.13,0],.025,metal);bar(g,[.35,1.13,-.18],[.35,1.13,.18],.025,metal);
    const torso=ball(g,-.08,1.3,0,[.14,.25,.17],shirt);torso.rotation.z=-.4;head(g,.03,1.62,0,mat(i?'#ebe6d7':'#426675'));
    for(let side of [-1,1]){bar(g,[0,1.42,side*.17],[.08,1.32,side*.19],.05,shirt);bar(g,[.08,1.32,side*.19],[.18,1.19,side*.2],.036,skin);ball(g,.18,1.19,side*.2,[.04,.04,.04],skin);bar(g,[.18,1.19,side*.2],[.35,1.13,side*.18],.033,skin);ball(g,.35,1.13,side*.18,[.043,.034,.04],strap)}
    bar(g,[.06,1.47,0],[.015,1.19,0],.008,trim);
    ball(g,-.2,1.1,0,[.12,.08,.15],pants);
    const legs=[];
    for(let side of [-1,1])legs.push({side,upper:bar(g,[0,0,0],[0,1,0],.05,pants),lower:bar(g,[0,0,0],[0,1,0],.04,skin),foot:sneaker(g,0,.5,side*.15),joint:ball(g,0,.8,side*.15,[.05,.05,.05],skin),crank:bar(g,[0,0,0],[0,1,0],.018,metal),pedal:bar(g,[0,0,0],[0,1,0],.025,rubber)});
    cyclists.push({g,wheels,legs,offset:i*40,speed:1.35});
  }
  // Bus-stop passengers face the road (+Z), clear of the cycling route and stairs.
  function passenger(x,z,seated,color){
    const root=new T.Group();root.position.set(x,0,z);root.rotation.y=-Math.PI/2;scene.add(root);
    const shirt=mat(color),hipY=seated?.72:.91;
    const body=new T.Group();body.position.y=hipY;root.add(body);
    ball(body,0,.18,0,[.15,.23,.17],shirt);ball(body,-.01,0,0,[.13,.08,.15],pants);
    const face=head(body,0,.57,0,null,seated?0:1);
    bar(body,[.147,.1,0],[.147,.34,0],.008,trim);
    for(let side of [-1,1]){
      const hip=[0,hipY,side*.095],knee=seated?[.31,.68,side*.095]:[.035,.57,side*.095];
      const ankle=seated?[.37,.19,side*.095]:[.015,.21,side*.095];
      bar(root,hip,knee,.06,pants);ball(root,...knee,[.06,.06,.055],pants);bar(root,knee,ankle,.05,pants);
      sneaker(root,ankle[0]+.02,ankle[1]-.035,ankle[2]);
      const elbow=seated?[.16,.15,side*.21]:[.06,.16,side*.21];
      const hand=seated?[.29,.17,side*.09]:[.11,-.08,side*.21];
      bar(body,[0,.35,side*.2],elbow,.05,shirt);ball(body,...elbow,[.038,.04,.04],skin);
      bar(body,elbow,hand,.032,skin);ball(body,...hand,[.043,.03,.034],skin);
    }
    if(seated){
      const phone=new T.Mesh(new T.BoxGeometry(.018,.16,.1),rubber);phone.position.set(.31,.22,0);phone.rotation.z=-.25;body.add(phone);
      const screen=new T.Mesh(new T.BoxGeometry(.006,.125,.077),mat('#87b6c0'));screen.position.set(.322,.22,0);screen.rotation.z=-.25;body.add(screen);
      ball(root,-.02,.75,.37,[.1,.15,.11],mat('#a68c67'));
    }else{
      ball(body,-.17,.19,0,[.09,.18,.15],mat('#687c74'));
      for(let side of [-1,1])bar(body,[.04,.36,side*.13],[.08,.06,side*.13],.014,strap);
    }
    return {root,body,face,hipY,seated};
  }
  const passengers=[passenger(6.4,2.75,true,'#428ca6'),passenger(10,3.05,false,'#c29165')];
  const wrap=x=>((x+45)%90+90)%90-45;
  function update(seconds){
    passengers.forEach((p,i)=>{
      const t=seconds+i*1.7;
      p.body.position.y=p.hipY+Math.sin(t*1.6)*.008;
      p.body.rotation.x=p.seated?Math.sin(t*.8)*.015:Math.sin(t*.65)*.035;
      p.body.rotation.z=p.seated?-.08+Math.sin(t*.7)*.025:Math.sin(t*.8)*.015;
      // Seated passenger glances up from the phone; standing passenger looks along the road.
      p.face.rotation.y=Math.sin(t*.5)*(p.seated?.16:.4);
      p.face.rotation.z=p.seated?-.13+Math.sin(t*.5)*.11:Math.sin(t*.65)*.035;
    });
    walkers.forEach((w,i)=>{
      w.g.position.set(wrap(-13+w.offset+seconds*w.speed*w.direction),.02,w.z);
      const phase=seconds*5.1+i*1.5;
      w.g.position.y=.02+Math.abs(Math.sin(phase))*.022;
      for(let j=0;j<2;j++){const side=j?1:-1,swing=Math.sin(phase+j*Math.PI)*.19,z=side*.095;
        const lift=Math.max(0,Math.cos(phase+j*Math.PI))*.065;
        const knee=[swing*.55+.045,.57,z],ankle=[swing,.24+lift,z];
        pose(w.legs[j].upper,[0,.91,z],knee,.06);pose(w.legs[j].lower,knee,ankle,.05);w.legs[j].knee.position.set(...knee);
        w.feet[j].position.set(swing,.19+lift,z);
        const elbow=[-swing*.3,1.04,side*.21],hand=[-swing*.7,.87,side*.21];
        pose(w.arms[j].upper,[0,1.24,side*.21],elbow,.05);pose(w.arms[j].lower,elbow,hand,.033);w.arms[j].hand.position.set(...hand);
      }
    });
    cyclists.forEach(c=>{
      c.g.position.set(wrap(-7+c.offset+seconds*c.speed),0,13.7);
      c.wheels.forEach(w=>w.rotation.z=-seconds*c.speed/.35);
      c.legs.forEach(l=>{
        const {hip,knee,ankle,pedal,crank}=cyclingPose(seconds,l.side,c.speed);
        pose(l.upper,hip,knee,.052);pose(l.lower,knee,ankle,.038);l.joint.position.set(...knee);
        l.foot.position.set(pedal[0],pedal[1]+.035,pedal[2]);
        pose(l.crank,crank,pedal,.018);
        pose(l.pedal,[pedal[0]-.08,pedal[1],pedal[2]],[pedal[0]+.08,pedal[1],pedal[2]],.025);
      });
    });
  }
  update(0);
  return {update};
}
