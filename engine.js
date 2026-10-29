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
  function level(d,k){
    const n=[[3,4,4,5,5,5],[5,6,6,7,7,7],[7,8,8,9,10,10]][d][k];
    const edges=Array.from({length:n-1},(_,i)=>[i,i+1]);
    if(k%2===1&&d>0)edges.push([0,n-1]);
    if(d===2&&k>2)edges.push([1,n-2]);
    const g=solveGraph(n,edges),wanted=[[1,1,2,2,3,3],[3,3,4,4,4,5],[4,4,5,5,6,6]][d][k];
    const states=Array.from(g.dist,(_,s)=>s).filter(s=>g.dist[s]>0);
    const closest=Math.min(...states.map(s=>Math.abs(g.dist[s]-wanted)));
    const choices=states.filter(s=>Math.abs(g.dist[s]-wanted)===closest);
    const initial=d===0&&k===0?0:choices[(k*17+d*11)%choices.length];
    return {n,edges,...g,initial,par:g.dist[initial],name:names[k]};
  }
  const api={level,solveGraph};if(typeof module!=='undefined')module.exports=api;else root.PlanetEngine=api;
})(typeof globalThis==='undefined'?this:globalThis);
