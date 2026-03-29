const state={snapshot:null,items:[],selectedPath:null,selectedPatternId:null,selectedInstanceId:null,selectedExport:null,currentGraph:null,currentInstanceGraph:null};

const $=id=>document.getElementById(id);
const els={
sourceList:$('source-list'),sourceFilter:$('source-filter'),snapshotMeta:$('snapshot-meta'),
detailTitle:$('detail-title'),detailTag:$('detail-tag'),detailMeta:$('detail-meta'),
structureTag:$('structure-tag'),structureMeta:$('structure-meta'),structureSummary:$('structure-summary'),
patternBrowserMeta:$('pattern-browser-meta'),patternList:$('pattern-list'),patternOverview:$('pattern-overview'),
patternLineage:$('pattern-lineage'),patternConnections:$('pattern-connections'),patternWarnings:$('pattern-warnings'),
instanceOverview:$('instance-overview'),instanceLineage:$('instance-lineage'),
structureMapMeta:$('structure-map-meta'),structureMap:$('structure-map'),
collectionBrowserMeta:$('collection-browser-meta'),collectionDetail:$('collection-detail'),
relationshipBrowserMeta:$('relationship-browser-meta'),relationshipDetail:$('relationship-detail'),
detailSummary:$('detail-summary'),detailRaw:$('detail-raw'),refreshButton:$('refresh-export')
};

const fmtCount=v=>Number.isFinite(Number(v))?Number(v).toLocaleString():'0';
const clear=node=>node.innerHTML='';
const empty=(text,tag='p')=>{const e=document.createElement(tag);e.className='empty-state';e.textContent=text;return e;};
const addBadge=(node,text,tone='')=>{const e=document.createElement('span');e.className=`badge${tone?` ${tone}`:''}`;e.textContent=text;node.appendChild(e);};
const titleOf=(payload,item)=>typeof payload?.title==='string'&&payload.title.trim()&&!payload.title.startsWith('<built-in method title')?payload.title.trim():item?.label||payload?.source?.path?.replace(/\.json$/i,'')||item?.songId||'Untitled';
const fmtRange=r=>!r||typeof r!=='object'?'No range':[`ticks ${r.start??'?'}..${r.end??'?'}`,`pitches ${r.low??'?'}..${r.high??'?'}`].join(', ');

function btn(label,id,type='pattern',compact=false){
  const e=document.createElement('button');e.type='button';e.className=`jump-button${compact?' jump-button-compact':''}`;e.textContent=label;
  const ok=type==='pattern'?state.currentGraph?.byId.has(id):state.currentInstanceGraph?.byId.has(id);
  e.disabled=!ok;
  if(ok)e.addEventListener('click',()=>type==='pattern'?selectPattern(id):selectInstance(id));
  return e;
}

function renderCountList(id,data,fallback){
  const node=$(id);clear(node);const entries=Object.entries(data||{});
  if(!entries.length){node.appendChild(empty(fallback,'li'));return;}
  entries.forEach(([k,v])=>{const li=document.createElement('li');const a=document.createElement('span');const b=document.createElement('span');a.textContent=k;b.textContent=fmtCount(v);li.append(a,b);node.appendChild(li);});
}

function renderLabelVariants(groups){
  const node=$('label-variants');clear(node);
  if(!Array.isArray(groups)||!groups.length){node.appendChild(empty('No label variants detected in the current export.'));return;}
  groups.forEach(g=>{const a=document.createElement('article');a.className='pill';const s=document.createElement('strong');const t=document.createElement('span');s.textContent=g.normalized||'unlabeled';t.textContent=Array.isArray(g.variants)?g.variants.join(', '):'';a.append(s,t);node.appendChild(a);});
}

function renderIssues(issues){
  const node=$('issue-list');clear(node);
  if(!Array.isArray(issues)||!issues.length){node.appendChild(empty('No export warnings were produced.','li'));return;}
  issues.forEach(issue=>{const li=document.createElement('li');const a=document.createElement('span');const b=document.createElement('span');a.textContent=`${issue.kind||'issue'}: ${issue.path||'unknown path'}`;b.textContent=issue.message||'';li.append(a,b);node.appendChild(li);});
}

function buildPatternGraph(payload){
  const patterns=Array.isArray(payload?.patterns)?payload.patterns.filter(Boolean):[];
  const byId=new Map(), childrenById=new Map(), norm=new Map();
  patterns.forEach(p=>{byId.set(p.id,p);childrenById.set(p.id,Array.isArray(p.children)?p.children.slice():[]);if(p.normalizedName)norm.set(p.normalizedName,(norm.get(p.normalizedName)||0)+1);});
  const roots=patterns.filter(p=>!p.parentId||!byId.has(p.parentId)).sort((a,b)=>(a.name||a.id).localeCompare(b.name||b.id));
  const flattened=[],seen=new Set();
  const walk=(id,d)=>{if(!byId.has(id)||seen.has(id))return;seen.add(id);flattened.push({patternId:id,depth:d,pattern:byId.get(id)});(childrenById.get(id)||[]).forEach(cid=>walk(cid,d+1));};
  roots.forEach(r=>walk(r.id,0));patterns.forEach(p=>{if(!seen.has(p.id))walk(p.id,0);});
  return {patterns,byId,childrenById,roots,flattened,normalizedCounts:norm};
}

function buildInstanceGraph(payload){
  const instances=Array.isArray(payload?.patternInstances)?payload.patternInstances.filter(Boolean):[];
  const byId=new Map(), childrenById=new Map(), patternMap=new Map();
  instances.forEach(i=>{byId.set(i.id,i);childrenById.set(i.id,Array.isArray(i.childInstanceIds)?i.childInstanceIds.slice():[]);if(i.sourcePatternId){if(!patternMap.has(i.sourcePatternId))patternMap.set(i.sourcePatternId,[]);patternMap.get(i.sourcePatternId).push(i.id);}});
  const roots=Array.isArray(payload?.songPlan?.rootInstanceIds)?payload.songPlan.rootInstanceIds.filter(id=>byId.has(id)):instances.filter(i=>!i.parentInstanceId).map(i=>i.id);
  return {instances,byId,childrenById,roots,patternMap};
}

function syncInstance(){const ids=state.currentInstanceGraph?.patternMap.get(state.selectedPatternId)||[];state.selectedInstanceId=ids[0]||null;}
function scrollPattern(){const el=els.patternList.querySelector('.pattern-item.active');if(el)el.scrollIntoView({block:'nearest'});}

function selectPattern(id,opt={}){
  if(!state.currentGraph?.byId.has(id))return;
  state.selectedPatternId=id;syncInstance();renderSongPlan();renderPatternList();renderPatternInspector();renderInstanceInspector();renderCollections();renderRelationships();
  if(opt.scroll!==false)scrollPattern();
}

function selectInstance(id,opt={}){
  if(!state.currentInstanceGraph?.byId.has(id))return;
  const inst=state.currentInstanceGraph.byId.get(id);state.selectedInstanceId=id;
  if(inst.sourcePatternId&&state.currentGraph?.byId.has(inst.sourcePatternId))state.selectedPatternId=inst.sourcePatternId;
  renderSongPlan();renderPatternList();renderPatternInspector();renderInstanceInspector();renderCollections();renderRelationships();
  if(opt.scroll!==false)scrollPattern();
}

function renderStructureSummary(item,summary){
  clear(els.structureSummary);
  const g=state.selectedExport?.globalContext||{};
  [
    ['Song',titleOf(state.selectedExport,item)],
    ['Source',state.selectedExport?.source?.path||'unknown'],
    ['Patterns',fmtCount(summary?.patternCount||0)],
    ['Instances',fmtCount(summary?.patternInstanceCount||0)],
    ['Relationships',fmtCount(summary?.relationshipCount||0)],
    ['Collections',fmtCount(summary?.collectionCount||0)],
    ['Root Instances',fmtCount(summary?.rootInstanceCount||0)],
    ['Global Context',[g.root,g.scale].filter(v=>v!==null&&v!==undefined&&v!=='').join(' ')||'none'],
    ['BPM',g.bpm??'unknown'],
    ['Issues',fmtCount(summary?.issueCount||0)],
  ].forEach(([k,v])=>{const a=document.createElement('article');a.className='mini-stat';const s=document.createElement('span');const t=document.createElement('strong');s.textContent=k;t.textContent=String(v);a.append(s,t);els.structureSummary.appendChild(a);});
}

function renderProps(node,rows){
  clear(node);
  rows.forEach(([k,v])=>{const a=document.createElement('article');a.className='property-card';const s=document.createElement('span');const t=document.createElement('strong');s.className='property-label';t.className='property-value';s.textContent=k;t.textContent=String(v);a.append(s,t);node.appendChild(a);});
}

function renderPatternInspector(){
  if(!state.currentGraph?.byId.has(state.selectedPatternId)){renderProps(els.patternOverview,[['Pattern','Select a pattern'],['Status','No pattern selected']]);clear(els.patternLineage);els.patternLineage.appendChild(empty('Select a pattern to inspect its containment path.','li'));clear(els.patternConnections);els.patternConnections.appendChild(empty('Select a pattern to inspect its structural links.','li'));clear(els.patternWarnings);addBadge(els.patternWarnings,'No pattern selected');return;}
  const p=state.currentGraph.byId.get(state.selectedPatternId);
  renderProps(els.patternOverview,[
    ['Name',p.name||p.id],['Pattern ID',p.id],['Canonical ID',p.canonicalId||p.id],['Normalized Name',p.normalizedName||'none'],
    ['Depth',p.depth??0],['Range',fmtRange(p.range)],['Instruments',`${fmtCount(p.instrumentCount??(p.instruments||[]).length)} assigned`],['Mode',p.mode||'none']
  ]);
  clear(els.patternLineage);
  const lineage=[];let cur=p;const seen=new Set();
  while(cur&&!seen.has(cur.id)){seen.add(cur.id);lineage.push(cur);cur=cur.parentId?state.currentGraph.byId.get(cur.parentId):null;}
  lineage.reverse().forEach((entry,i)=>{const li=document.createElement('li');li.className='detail-list-item';const n=document.createElement('strong');n.textContent=`${i+1}.`;li.append(n,btn(`${entry.name||entry.id} (${entry.id})`,entry.id));els.patternLineage.appendChild(li);});
  clear(els.patternConnections);
  const rows=[
    ['Parent',p.parentId&&state.currentGraph.byId.has(p.parentId)?[{id:p.parentId,label:`${state.currentGraph.byId.get(p.parentId).name||p.parentId} (${p.parentId})`}]:[],p.parentId||'none'],
    ['Children',(p.children||[]).filter(id=>state.currentGraph.byId.has(id)).map(id=>({id,label:`${state.currentGraph.byId.get(id).name||id} (${id})`})), 'none'],
    ['Variant Of',p.variantOf&&state.currentGraph.byId.has(p.variantOf)?[{id:p.variantOf,label:`${state.currentGraph.byId.get(p.variantOf).name||p.variantOf} (${p.variantOf})`}]:[], p.variantOfName||p.variantOf||'none'],
  ];
  rows.forEach(([label,items,fallback])=>{const li=document.createElement('li');li.className='detail-list-item';const s=document.createElement('strong');s.textContent=`${label}:`;li.appendChild(s);if(items.length){const row=document.createElement('div');row.className='jump-row';items.forEach(it=>row.appendChild(btn(it.label,it.id,'pattern',true)));li.appendChild(row);}else{const f=document.createElement('span');f.className='connection-fallback';f.textContent=fallback;li.appendChild(f);}els.patternConnections.appendChild(li);});
  const tags=document.createElement('li');tags.className='detail-list-item';const a=document.createElement('strong');const b=document.createElement('span');a.textContent='Relation Tags:';b.className='connection-fallback';b.textContent=(p.relationTags||[]).join(', ')||'none';tags.append(a,b);els.patternConnections.appendChild(tags);
  clear(els.patternWarnings);
  const warnings=[];if(p.parentId&&!state.currentGraph.byId.has(p.parentId))warnings.push('Missing parent reference');if(p.variantOf&&!state.currentGraph.byId.has(p.variantOf))warnings.push('Dangling variant reference');if(!p.range)warnings.push('Missing range');if(!(p.instruments||[]).length)warnings.push('No instruments attached');if(p.normalizedName&&(state.currentGraph.normalizedCounts.get(p.normalizedName)||0)>1)warnings.push(`Duplicate normalized label: ${p.normalizedName}`);
  if(!warnings.length)addBadge(els.patternWarnings,'No structural warnings','badge-good');else warnings.forEach(w=>addBadge(els.patternWarnings,w,'badge-warn'));
}

function renderInstanceInspector(){
  if(!state.currentInstanceGraph?.byId.has(state.selectedInstanceId)){renderProps(els.instanceOverview,[['Instance','Select a pattern'],['Status','No instance selected']]);clear(els.instanceLineage);els.instanceLineage.appendChild(empty('Select a pattern or instance to inspect the song plan path.','li'));return;}
  const i=state.currentInstanceGraph.byId.get(state.selectedInstanceId);
  renderProps(els.instanceOverview,[
    ['Instance ID',i.id],['Source Pattern',i.sourcePatternId||'none'],['Canonical Pattern',i.canonicalPatternId||'none'],['Material Role',i.materialRole||'unknown'],
    ['Instance Type',i.instanceType||'unknown'],['Order Path',Array.isArray(i.orderPath)?i.orderPath.join('.'):'none'],['Depth',i.depth??0],['Children',fmtCount((i.childInstanceIds||[]).length)]
  ]);
  clear(els.instanceLineage);
  const lineage=[];let cur=i;const seen=new Set();
  while(cur&&!seen.has(cur.id)){seen.add(cur.id);lineage.push(cur);cur=cur.parentInstanceId?state.currentInstanceGraph.byId.get(cur.parentInstanceId):null;}
  lineage.reverse().forEach((entry,n)=>{const li=document.createElement('li');li.className='detail-list-item';const s=document.createElement('strong');s.textContent=`${n+1}.`;li.append(s,btn(`${entry.id} [${entry.materialRole||'unknown'}]`,entry.id,'instance'));els.instanceLineage.appendChild(li);});
}

function songPlanNode(id,depth=0){
  const i=state.currentInstanceGraph.byId.get(id);
  const wrap=document.createElement('article');wrap.className='map-node';wrap.style.setProperty('--map-depth',String(depth));
  const row=document.createElement('div');row.className='map-node-row';if(id===state.selectedInstanceId)row.classList.add('active');
  const main=document.createElement('div');main.className='map-node-main';main.appendChild(btn(`${i.id} [${i.materialRole||'unknown'}]`,id,'instance',true));
  const meta=document.createElement('div');meta.className='map-node-meta';addBadge(meta,i.sourcePatternId||'no pattern');addBadge(meta,fmtRange(i.range));addBadge(meta,i.instanceType||'unknown');
  row.append(main,meta);wrap.appendChild(row);
  const children=state.currentInstanceGraph.childrenById.get(id)||[];
  if(children.length){const list=document.createElement('div');list.className='map-children';children.forEach(cid=>list.appendChild(songPlanNode(cid,depth+1)));wrap.appendChild(list);}
  return wrap;
}

function renderSongPlan(){
  clear(els.structureMap);
  if(!state.currentInstanceGraph?.instances.length){els.structureMapMeta.textContent='No whole-song instance plan loaded.';els.structureMap.appendChild(empty('Select an exported song to view its recursive instance plan.'));return;}
  els.structureMapMeta.textContent=`${state.currentInstanceGraph.roots.length} root instances and ${state.currentInstanceGraph.instances.length} total pattern instances in traversal order.`;
  state.currentInstanceGraph.roots.forEach(id=>{const i=state.currentInstanceGraph.byId.get(id);const sec=document.createElement('section');sec.className='map-group';const head=document.createElement('div');head.className='map-group-head';const tw=document.createElement('div');const h=document.createElement('h4');const p=document.createElement('p');h.textContent=i.id;p.className='collection-meta';p.textContent=`${i.sourcePatternId||'no source pattern'} | material role: ${i.materialRole||'unknown'}`;tw.append(h,p);const act=document.createElement('div');act.className='jump-row';act.appendChild(btn(`Jump to ${i.id}`,i.id,'instance',true));head.append(tw,act);sec.append(head,songPlanNode(id,0));els.structureMap.appendChild(sec);});
}

function renderCollections(){
  const collections=Array.isArray(state.selectedExport?.collectionCandidates)?state.selectedExport.collectionCandidates:[];
  clear(els.collectionDetail);
  if(!collections.length){els.collectionBrowserMeta.textContent='No collection candidates were exported for this song.';els.collectionDetail.appendChild(empty('No collection candidates were exported for this song.'));return;}
  const selected=state.selectedPatternId;
  const visible=selected?collections.filter(c=>c.sourcePatternId===selected||c.parentPatternId===selected||(c.memberPatternIds||[]).includes(selected)):collections;
  const display=visible.length?visible:collections.slice(0,10);
  els.collectionBrowserMeta.textContent=`${collections.length} collection candidates exported. Showing ${display.length}${visible.length?' related to the selected pattern':''}.`;
  display.forEach(c=>{const card=document.createElement('article');card.className='collection-card';const head=document.createElement('div');head.className='collection-card-head';const t=document.createElement('strong');const type=document.createElement('span');t.textContent=c.name||c.id;type.className='badge';type.textContent=c.collectionType||'collection';head.append(t,type);const meta=document.createElement('p');meta.className='collection-meta';meta.textContent='Source and parent links are navigable below.';const anchors=document.createElement('div');anchors.className='jump-row';if(state.currentGraph?.byId.has(c.sourcePatternId))anchors.appendChild(btn(`Source: ${state.currentGraph.byId.get(c.sourcePatternId).name||c.sourcePatternId} (${c.sourcePatternId})`,c.sourcePatternId,'pattern',true));if(c.parentPatternId&&state.currentGraph?.byId.has(c.parentPatternId))anchors.appendChild(btn(`Parent: ${state.currentGraph.byId.get(c.parentPatternId).name||c.parentPatternId} (${c.parentPatternId})`,c.parentPatternId,'pattern',true));const members=document.createElement('div');members.className='jump-row';(c.memberPatternIds||[]).forEach(id=>state.currentGraph?.byId.has(id)?members.appendChild(btn(`${state.currentGraph.byId.get(id).name||id} (${id})`,id,'pattern',true)):addBadge(members,id));card.append(head,meta);if(anchors.childNodes.length)card.appendChild(anchors);card.appendChild(members);els.collectionDetail.appendChild(card);});
}

function renderRelationships(){
  const rels=Array.isArray(state.selectedExport?.relationships)?state.selectedExport.relationships:[];
  clear(els.relationshipDetail);
  if(!rels.length){els.relationshipBrowserMeta.textContent='No relationships were exported for this song.';els.relationshipDetail.appendChild(empty('No relationships were exported for this song.','li'));return;}
  const selected=state.selectedPatternId;
  const visible=selected?rels.filter(r=>r.from===selected||r.to===selected):rels.slice(0,12);
  if(!visible.length){els.relationshipBrowserMeta.textContent='No relationships touch the selected pattern.';els.relationshipDetail.appendChild(empty('The selected pattern has no explicit exported relationships.','li'));return;}
  els.relationshipBrowserMeta.textContent=`${rels.length} relationships exported. Showing ${visible.length}${selected?' linked to the selected pattern':''}.`;
  visible.forEach(r=>{const li=document.createElement('li');li.className='detail-list-item';const sum=document.createElement('div');sum.className='relationship-row';const a=document.createElement('strong');a.textContent=r.type||'relationship';const nav=document.createElement('div');nav.className='relationship-nav';state.currentGraph?.byId.has(r.from)?nav.appendChild(btn(`${state.currentGraph.byId.get(r.from).name||r.from} (${r.from})`,r.from,'pattern',true)):addBadge(nav,r.from||'unknown');const arrow=document.createElement('span');arrow.className='relationship-arrow';arrow.textContent='->';nav.appendChild(arrow);state.currentGraph?.byId.has(r.to)?nav.appendChild(btn(`${state.currentGraph.byId.get(r.to).name||r.to} (${r.to})`,r.to,'pattern',true)):addBadge(nav,r.to||'unknown');sum.append(a,nav);li.appendChild(sum);if(r.label){const d=document.createElement('div');d.className='relationship-subrow';d.textContent=`Label: ${r.label}`;li.appendChild(d);}els.relationshipDetail.appendChild(li);});
}

function renderPatternList(){
  clear(els.patternList);
  if(!state.currentGraph?.patterns.length){els.patternBrowserMeta.textContent='No exported patterns loaded.';els.patternList.appendChild(empty('This export does not contain any patterns.','li'));return;}
  els.patternBrowserMeta.textContent=`${state.currentGraph.patterns.length} exported patterns loaded from the dedicated heuristic export.`;
  state.currentGraph.flattened.forEach(entry=>{const li=document.createElement('li');li.className='pattern-item';if(entry.patternId===state.selectedPatternId)li.classList.add('active');li.style.marginLeft=`${entry.depth*18}px`;const t=document.createElement('div');t.className='pattern-item-title';const dot=document.createElement('span');dot.className='pattern-depth';dot.style.opacity=`${Math.max(0.35,1-entry.depth*0.08)}`;const label=document.createElement('span');label.textContent=entry.pattern.name||entry.pattern.id;t.append(dot,label);const m=document.createElement('div');m.className='pattern-item-meta';const range=document.createElement('span');range.textContent=fmtRange(entry.pattern.range);m.appendChild(range);(entry.pattern.relationTags||[]).forEach(tag=>{const s=document.createElement('span');s.textContent=tag;m.appendChild(s);});li.append(t,m);li.addEventListener('click',()=>selectPattern(entry.patternId,{scroll:false}));els.patternList.appendChild(li);});
}

function setSummaryCards(snapshot){
  $('song-count').textContent=fmtCount(snapshot?.summaryCards?.songCount??0);
  $('export-pattern-count').textContent=fmtCount(snapshot?.summaryCards?.patternInstanceCount??snapshot?.summaryCards?.patternCount??0);
  $('relationship-count').textContent=fmtCount(snapshot?.summaryCards?.relationshipCount??0);
  $('collection-count').textContent=fmtCount(snapshot?.summaryCards?.collectionCount??0);
}

function renderSourceList(){
  clear(els.sourceList);
  const q=els.sourceFilter.value.trim().toLowerCase();
  const items=state.items.filter(item=>!q||[item.label,item.songId,item.path,item.sourcePath].join(' ').toLowerCase().includes(q));
  if(!items.length){els.sourceList.appendChild(empty('No exported songs match the current filter.','li'));return;}
  items.forEach(item=>{const li=document.createElement('li');li.className='source-item';if(item.path===state.selectedPath)li.classList.add('active');const h=document.createElement('h3');const p=document.createElement('p');const meta=document.createElement('div');meta.className='source-meta';h.textContent=item.label||item.songId||item.path;p.textContent=`${item.path} <- ${item.sourcePath||'user_settings'}`;[`${fmtCount(item.patternInstanceCount??item.patternCount)} instances`,`${fmtCount(item.relationshipCount)} relationships`,`${fmtCount(item.collectionCount)} collections`].forEach(text=>{const s=document.createElement('span');s.textContent=text;meta.appendChild(s);});li.append(h,p,meta);li.addEventListener('click',()=>loadDetail(item));els.sourceList.appendChild(li);});
}

function renderEmptyDetail(message){
  state.currentGraph=null;state.currentInstanceGraph=null;state.selectedExport=null;state.selectedInstanceId=null;
  els.detailTitle.textContent='Select an exported song';els.detailTag.textContent='No export selected';els.detailMeta.textContent=message;
  els.structureTag.textContent='No structure selected';els.structureMeta.textContent='This panel reflects the dedicated heuristic export once a song is selected.';
  clear(els.structureSummary);clear(els.structureMap);els.structureMap.appendChild(empty('Select an exported song to view its recursive instance plan.'));els.structureMapMeta.textContent='No whole-song instance plan loaded.';
  clear(els.patternList);els.patternBrowserMeta.textContent='No exported pattern graph loaded.';renderPatternInspector();renderInstanceInspector();
  clear(els.collectionDetail);els.collectionDetail.appendChild(empty('Collection candidates will appear here once an export is selected.'));els.collectionBrowserMeta.textContent='No exported collections loaded.';
  clear(els.relationshipDetail);els.relationshipDetail.appendChild(empty('Select a pattern to inspect incoming and outgoing structural links.','li'));els.relationshipBrowserMeta.textContent='Select a pattern to inspect incoming and outgoing structural links.';
  els.detailSummary.textContent='Awaiting selection.';els.detailRaw.textContent='Awaiting selection.';
}

function renderExportDetail(item,payload){
  state.selectedExport=payload?.rawPayload||{};
  state.currentGraph=buildPatternGraph(state.selectedExport);
  state.currentInstanceGraph=buildInstanceGraph(state.selectedExport);
  state.selectedPatternId=state.currentGraph.byId.has(state.selectedPatternId)?state.selectedPatternId:(state.currentGraph.byId.has('root')?'root':state.currentGraph.flattened[0]?.patternId||null);
  syncInstance();
  els.detailTitle.textContent=titleOf(state.selectedExport,item);els.detailTag.textContent='heuristic export';els.detailMeta.textContent=`${item.path} from ${state.selectedExport?.source?.path||item.sourcePath||'user_settings'}`;
  els.structureTag.textContent='dedicated structural export';els.structureMeta.textContent='This export now exposes both pattern structure and recursive song-plan instances for the heuristic North Star.';
  els.detailSummary.textContent=JSON.stringify(payload.summary||{},null,2);els.detailRaw.textContent=JSON.stringify(state.selectedExport,null,2);
  renderStructureSummary(item,payload.summary||{});selectPattern(state.selectedPatternId,{scroll:false});
}

async function loadDetail(item){
  state.selectedPath=item.path;renderSourceList();els.detailTitle.textContent=item.label||item.songId||item.path;els.detailTag.textContent='heuristic export';els.detailMeta.textContent=`Loading ${item.path}...`;els.detailSummary.textContent='Loading export summary...';els.detailRaw.textContent='Loading export JSON...';
  try{
    const res=await fetch(`/api/heuristic-export/source?${new URLSearchParams({path:item.path})}`);
    if(!res.ok)throw new Error(`detail request failed with ${res.status}`);
    renderExportDetail(item,await res.json());
  }catch(error){
    renderEmptyDetail('The selected export could not be loaded.');
    els.detailMeta.textContent=`Failed to load ${item.path}.`;els.detailSummary.textContent=String(error);els.detailRaw.textContent='';els.structureTag.textContent='Load failed';els.structureMeta.textContent='The dedicated export could not be loaded.';
  }
}

async function loadSnapshot(){
  els.snapshotMeta.textContent='Rebuilding heuristic export...';els.refreshButton.disabled=true;
  try{
    const res=await fetch('/api/heuristic-export');
    if(!res.ok)throw new Error(`snapshot request failed with ${res.status}`);
    const snapshot=await res.json();state.snapshot=snapshot;state.items=Array.isArray(snapshot.items)?snapshot.items:[];
    setSummaryCards(snapshot);renderCountList('relationship-types',snapshot.relationshipTypeCounts,'No relationship types were exported.');renderCountList('collection-types',snapshot.collectionTypeCounts,'No collection types were exported.');renderLabelVariants(snapshot.labelVariantGroups);renderIssues(snapshot.issues);
    const example=snapshot.workedExample?.title?` Representative example: ${snapshot.workedExample.title} (${fmtCount(snapshot.workedExample.patternInstanceCount)} instances).`:'';
    els.snapshotMeta.textContent=`Export generated ${snapshot.generatedAt} at ${snapshot.exportPath}.${example}`;
    renderSourceList();
    if(!state.items.length){renderEmptyDetail('No heuristic exports were generated.');return;}
    await loadDetail(state.items.find(item=>item.path===state.selectedPath)||state.items[0]);
  }catch(error){
    els.snapshotMeta.textContent=`Failed to rebuild heuristic export. ${String(error)}`;clear(els.sourceList);els.sourceList.appendChild(empty('Heuristic export data is unavailable.','li'));renderEmptyDetail('Heuristic export data is unavailable.');
  }finally{els.refreshButton.disabled=false;}
}

els.sourceFilter.addEventListener('input',renderSourceList);
els.refreshButton.addEventListener('click',()=>loadSnapshot());
renderEmptyDetail('Choose an exported song to inspect the dedicated heuristic structure export.');
loadSnapshot();
