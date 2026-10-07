// Side view: +X is forward, +Y is up. Forward pedalling is clockwise.
export function cyclingPose(seconds, side, speed=1.35) {
  const phase=-seconds*(speed/.35)/2.2+(side>0?Math.PI:0);
  const z=side*.15;
  const crank=[-.04,.47,z];
  const pedal=[crank[0]+Math.cos(phase)*.16,crank[1]+Math.sin(phase)*.16,z];
  const ankle=[pedal[0]-.035,pedal[1]+.055,z];
  const hip=[-.22,1.08,z];
  const dx=ankle[0]-hip[0],dy=ankle[1]-hip[1],distance=Math.hypot(dx,dy);
  const thigh=.43,shin=.43;
  const along=(thigh*thigh-shin*shin+distance*distance)/(2*distance);
  const height=Math.sqrt(Math.max(0,thigh*thigh-along*along));
  // Choose the forward knee solution; the other intersection folds backwards.
  const knee=[hip[0]+dx/distance*along-dy/distance*height,hip[1]+dy/distance*along+dx/distance*height,z];
  return {hip,knee,ankle,pedal,crank};
}
