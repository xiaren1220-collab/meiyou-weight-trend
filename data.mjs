export const START=Date.UTC(2025,6,1),END=Date.UTC(2026,5,30),DAY=86400000;
export const comparisonBaselineWeight=47;
export const sparse=[['2025-07-01',46.9],['2025-07-04',47.1],['2025-07-08',47.3],['2025-07-12',47.5],['2025-07-16',47.6],['2025-07-20',47.7],['2025-07-24',47.6],['2025-07-28',47.4],['2025-08-01',47.5],['2025-08-05',47.7],['2025-08-09',47.9],['2025-08-13',47.8],['2025-08-17',47.6],['2025-08-21',47.4],['2025-08-25',47.6],['2025-08-28',48.0],['2025-09-01',48.3],['2026-06-19',44.2],['2026-06-22',44.3],['2026-06-25',44.4],['2026-06-28',44.5],['2026-06-30',44.6]].map(([date,weight],i)=>({id:`s-${i}`,date,time:Date.parse(date+'T00:00:00Z'),weight}));
const anchors=[[0,46.9],[25,47.65],[36,47.3],[50,47.9],[61,48.3],[82,46.3],[113,47.6],[143,47.0],[172,46.0],[211,46.35],[242,44.65],[266,45.1],[288,44.25],[312,44.6],[353,44.2],[364,44.6]];
const days=new Set(anchors.map(a=>a[0]));for(let i=0;i<132;i++)days.add(Math.round(i*364/131));
for(const day of [...days]){if(days.size===132)break;if(!anchors.some(a=>a[0]===day))days.delete(day);}
export const dense=[...days].sort((a,b)=>a-b).map((day,i)=>{let j=anchors.findIndex(a=>a[0]>=day);if(j<1)j=1;let[a,v]=anchors[j-1],[b,w]=anchors[j];let t=(day-a)/(b-a),smooth=t*t*(3-2*t);let weight=v+(w-v)*smooth;return{id:`d-${i}`,date:new Date(START+day*DAY).toISOString().slice(0,10),time:START+day*DAY,weight};});
// Preserve the reference extrema/endpoints while matching the specified rounded annual mean.
for(let iteration=0;iteration<5;iteration++){const mean=dense.reduce((s,p)=>s+p.weight,0)/dense.length;const adjustable=dense.filter(p=>![START,END,START+61*DAY,START+353*DAY].includes(p.time));const shift=(46.3-mean)*dense.length/adjustable.length;for(const p of adjustable)p.weight=Math.max(44.21,Math.min(48.29,p.weight+shift));}
for(const p of dense)p.weight=Math.round(p.weight*10)/10;
// Match the original Pixso time-axis layout, including its non-uniform date-label spacing.
const dateAnchors=[[START,43],[Date.UTC(2025,8,1),105.11],[Date.UTC(2026,5,19),271.5],[END,327]];
export const xFor=time=>{let i=dateAnchors.findIndex(a=>a[0]>=time);if(i<1)i=1;const[a,x]=dateAnchors[i-1],[b,y]=dateAnchors[i];return x+(time-a)/(b-a)*(y-x);};
export const yFor=weight=>16+(50-weight)/8*144;
export function nearestIndex(data,x){let lo=0,hi=data.length-1;while(lo<hi){const mid=(lo+hi)>>1;const boundary=(xFor(data[mid].time)+xFor(data[mid+1].time))/2;if(x>boundary)lo=mid+1;else hi=mid;}return lo;}
export const comparison=weight=>{const n=Math.round((weight-comparisonBaselineWeight)*10)/10;return(n<0?'−':n>0?'+':'')+Math.abs(n).toFixed(1);};
export const clampCard=(target,width,container)=>Math.max(12,Math.min(container-width-12,target-width/2));
