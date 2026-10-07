// Shared active time freezes both lanes when motion is paused or the tab is hidden.
export function trafficAt(seconds) {
  const phase = (seconds + 10) % 22;
  let busX;
  if (phase < 8) {
    const t = phase / 8;
    busX = 5.1 - 65.1 * (1 - t) ** 2;
  } else if (phase < 12) {
    busX = 5.1;
  } else if (phase < 20) {
    const t = (phase - 12) / 8;
    busX = 5.1 + 54.9 * t ** 2;
  } else {
    busX = 60;
  }
  return {
    busX,
    busVisible: phase < 20,
    // Wrap only beyond the visible road, keeping the same lane and direction.
    taxiX: ((seconds * 4.2 + 60.2) % 120) - 60,
  };
}

// Six vehicles per lane, 20 units apart. Wrap beyond both viewport edges.
export function carPositionsAt(seconds) {
  return Array.from({length:12},(_,i)=>{
    const lane=i<6?0:1,slot=i%6;
    return ((seconds*(lane?3.6:4.2)+60.2+slot*20+lane*9)%120)-60;
  });
}
