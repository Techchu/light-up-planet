(function(root){
  'use strict';
  const names=['初见微光','星间来信','月海回声','银河渡口','极光花园','星河苏醒'];
  function solveGraph(n,edges){
    const masks=Array.from({length:n},(_,i)=>1<<i);
    for(const [a,b] of edges){masks[a]|=1<<b;masks[b]|=1<<a;}
    const goal=(1<<n)-1,dist=new Int16Array(1<<n).fill(-1),next=new Int16Array(1<<n).fill(-1),q=[goal];dist[goal]=0;
    for(let j=0;j<q.length;j++){const s=q[j];for(let i=0;i<n;i++){const t=s^masks[i];if(dist[t]<0){dist[t]=dist[s]+1;next[t]=i;q.push(t);}}}
    return {masks,goal,dist,next};
  }
  const cache=new Map();
  function expanded(d,k){
    const n=8+d+Math.floor(k/2),wanted=d+2+Math.floor(k/2);
    for(let attempt=0;attempt<60;attempt++){
      let seed=1709+d*101+k*37+attempt*7919;
      const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
      const edges=Array.from({length:n-1},(_,i)=>[i,i+1]);
      const seen=new Set(edges.map(([a,b])=>`${a}-${b}`));
      for(let j=0;j<d-1+k%3;j++){const a=Math.floor(rand()*n),b=Math.floor(rand()*n);const key=[Math.min(a,b),Math.max(a,b)].join('-');if(a!==b&&!seen.has(key)){seen.add(key);edges.push([Math.min(a,b),Math.max(a,b)]);}}
      const g=solveGraph(n,edges),choices=[];
      for(let s=0;s<g.dist.length;s++)if(g.dist[s]===wanted)choices.push(s);
      if(choices.length){const initial=choices[Math.floor(rand()*choices.length)];return {n,edges,...g,initial,par:wanted,name:names[k]};}
    }
    throw new Error('Unable to prepare verified level');
  }
  function level(d,k){
    if(!Number.isInteger(d)||d<0||d>6||!Number.isInteger(k)||k<0||k>5)throw new RangeError('Invalid level');
    const key=`${d}-${k}`;
    if(cache.has(key))return cache.get(key);
    if(d>=3){const p=expanded(d,k);cache.set(key,p);return p;}
    const n=[[3,4,4,5,5,5],[5,6,6,7,7,7],[7,8,8,9,10,10]][d][k];
    const edges=Array.from({length:n-1},(_,i)=>[i,i+1]);
    if(k%2===1&&d>0)edges.push([0,n-1]);
    if(d===2&&k>2)edges.push([1,n-2]);
    const g=solveGraph(n,edges),wanted=[[1,1,2,2,3,3],[3,3,4,4,4,5],[4,4,5,5,6,6]][d][k];
    const states=Array.from(g.dist,(_,s)=>s).filter(s=>g.dist[s]>0);
    const closest=Math.min(...states.map(s=>Math.abs(g.dist[s]-wanted)));
    const choices=states.filter(s=>Math.abs(g.dist[s]-wanted)===closest);
    const initial=d===0&&k===0?0:choices[(k*17+d*11)%choices.length];
    const p={n,edges,...g,initial,par:g.dist[initial],name:names[k]};cache.set(key,p);return p;
  }
  const api={level,solveGraph};if(typeof module!=='undefined')module.exports=api;else root.PlanetEngine=api;
})(typeof globalThis==='undefined'?this:globalThis);
