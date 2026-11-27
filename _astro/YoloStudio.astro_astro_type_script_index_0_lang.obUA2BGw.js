import{c as e,l as t,s as n,t as r,u as i}from"./backend.B0J7feXh.js";var a=class{base;token;live=!0;label;constructor(e,t){this.base=e,this.token=t,this.label=e.replace(/^https?:\/\//,``)}url(e,t={},n=!1){let r=new URL(e,this.base);for(let[e,n]of Object.entries(t))n!==``&&n!==void 0&&r.searchParams.set(e,String(n));return n&&r.searchParams.set(`token`,this.token),r.toString()}async call(e,t,n={},i){let a;try{a=await fetch(this.url(t,n),{method:e,headers:{Authorization:`Bearer ${this.token}`,...i===void 0?{}:{"Content-Type":`application/json`}},body:i===void 0?void 0:JSON.stringify(i)})}catch{throw new r(`无法连接本地 Sunday Server (${this.label})，请确认服务已启动`,0)}let o={};try{o=await a.json()}catch{if(a.ok)throw new r(`服务端返回了无效 JSON (${t})`,a.status)}if(!a.ok)throw new r(String(o.error??`HTTP ${a.status}`),a.status,o);return o}ping(){return this.call(`GET`,`/api/ping`)}hosts(){return this.call(`GET`,`/api/hosts`)}connect(e){return this.call(`POST`,`/api/connect`,{host:e})}async listDir(e,t){return(await this.call(`GET`,`/api/fs/list`,{host:e,path:t})).entries}async readText(e,t){return(await this.call(`GET`,`/api/fs/read`,{host:e,path:t})).content??``}async rawImageUrl(e,t){let n=await fetch(this.url(`/api/fs/raw`,{host:e,path:t}),{headers:{Authorization:`Bearer ${this.token}`}});if(!n.ok)throw new r(`无法读取图片 (HTTP ${n.status})`,n.status);let i=await n.blob(),a=URL.createObjectURL(i);return{url:a,revoke:()=>URL.revokeObjectURL(a)}}getConfig(){return this.call(`GET`,`/api/yolo/config`)}async saveConfig(e){await this.call(`PUT`,`/api/yolo/config`,{},e)}discover(e,t,n=``){return this.call(`POST`,`/api/yolo/discover`,{},{host:e,runtime:t,wslDistro:n})}probe(e,t,n,r=``,i=``,a=``){return this.call(`POST`,`/api/yolo/probe`,{},{host:e,runtime:t,python:n,wslDistro:r,profileId:i,workspace:a})}scanDataset(e,t){return this.call(`POST`,`/api/yolo/dataset/scan`,{},{host:e,path:t})}discoverWorkspace(e,t,n=!0){return this.call(`POST`,`/api/yolo/workspace/discover`,{},{host:e,path:t,saveToRoot:n})}async scanWeights(e,t,n=``,r=``){return(await this.call(`POST`,`/api/yolo/weights/scan`,{},{host:e,path:t,runtime:n,wslDistro:r})).items}async listRuns(e=!1,t=``){let n={};return e&&(n.refresh=1),t&&(n.profileId=t),(await this.call(`GET`,`/api/yolo/runs`,n)).runs}async startRun(e,t){let n=await fetch(this.url(`/api/yolo/runs/start`),{method:`POST`,headers:{Authorization:`Bearer ${this.token}`,"Content-Type":`application/json`},body:JSON.stringify(e)});if(!n.ok||!n.body){let e=await n.json().catch(()=>({}));throw new r(String(e.error??`HTTP ${n.status}`),n.status)}let i=n.body.pipeThrough(new TextDecoderStream).getReader(),a=``,o=null;for(;;){let{value:e,done:n}=await i.read();if(n)break;a+=e;let s;for(;(s=a.indexOf(`
`))>=0;){let e=a.slice(0,s).trim();if(a=a.slice(s+1),!e)continue;let n=JSON.parse(e);if(t(n),n.stage===`error`)throw new r(n.error||`启动训练失败`,400);n.stage===`started`&&n.run&&(o=n.run)}}if(!o)throw new r(`启动流意外中断`,0);return o}getRun(e){return this.call(`GET`,`/api/yolo/runs/${encodeURIComponent(e)}`)}async stopRun(e,t=!1){await this.call(`POST`,`/api/yolo/runs/${encodeURIComponent(e)}/stop`,{},{force:t})}prioritizeRun(e){return this.call(`POST`,`/api/yolo/runs/${encodeURIComponent(e)}/prioritize`)}resumeRun(e){return this.call(`POST`,`/api/yolo/runs/${encodeURIComponent(e)}/resume`)}renameRun(e,t){return this.call(`POST`,`/api/yolo/runs/${encodeURIComponent(e)}/rename`,{},{name:t})}colabStatus(){return this.call(`GET`,`/api/yolo/colab/status`)}colabStopAll(){return this.call(`POST`,`/api/yolo/colab/stop-all`)}async deleteRun(e,t=!1){await this.call(`DELETE`,`/api/yolo/runs/${encodeURIComponent(e)}`,t?{remote:1}:{})}ws(e,t){return new WebSocket(this.url(e,t,!0).replace(/^http/,`ws`))}followLog(e,t,n){let r=this.ws(`/ws/yolo/log`,{id:e}),i=!1;return r.onmessage=e=>{let r=JSON.parse(e.data);r.type===`data`&&t(r.text||``,r.size||0),r.type===`error`&&n(r.message||`日志流出错`)},r.onclose=()=>!i&&n(`日志连接已关闭`),{close:()=>{i=!0,r.close(1e3)}}}stats(e,t){let n=this.ws(`/ws/stats`,{host:e}),r=!1;return n.onmessage=e=>t(JSON.parse(e.data)),n.onclose=()=>!r&&t({type:`error`,message:`资源监控已断开`}),{close:()=>{r=!0,n.close(1e3)}}}async artifactImageUrl(e,t,n=``){let i={path:t};n&&(i.v=n);let a=await fetch(this.url(`/api/yolo/runs/${encodeURIComponent(e)}/artifact`,i),{headers:{Authorization:`Bearer ${this.token}`}});if(!a.ok)throw new r(`无法读取产物 (HTTP ${a.status})`,a.status);let o=await a.blob(),s=URL.createObjectURL(o);return{url:s,revoke:()=>URL.revokeObjectURL(s)}}downloadArtifact(e,t){let n=document.createElement(`a`);n.href=this.url(`/api/yolo/runs/${encodeURIComponent(e)}/artifact`,{path:t,download:1},!0),n.rel=`noopener`,n.click()}events(){let e=null,t=!1,n=0,r=()=>{e=this.ws(`/ws/events`,{}),e.onclose=()=>{t||(n=window.setTimeout(r,4e3))}};return r(),{close:()=>{t=!0,clearTimeout(n),e?.close(1e3)}}}},o=[{name:`weng`,hostname:`192.168.1.42`,user:`ShengGu`,port:`22`},{name:`lab-nas`,hostname:`192.168.1.10`,user:`sunday`,port:`22`},{name:`coffee`,hostname:`100.82.14.9`,user:`win`,port:`22`}],s=[{name:`yolo26n.pt`,path:`/data/weights/yolo26n.pt`,size:542e4,mtime:17319e5,family:`yolo26`,tier:`n`,task:`hbb`,custom:!1},{name:`yolo26s.pt`,path:`/data/weights/yolo26s.pt`,size:198e5,mtime:17319e5,family:`yolo26`,tier:`s`,task:`hbb`,custom:!1},{name:`yolo26s-obb.pt`,path:`/data/weights/yolo26s-obb.pt`,size:204e5,mtime:17319e5,family:`yolo26`,tier:`s`,task:`obb`,custom:!1},{name:`yolo26n-seg.pt`,path:`/data/weights/yolo26n-seg.pt`,size:621e4,mtime:17319e5,family:`yolo26`,tier:`n`,task:`seg`,custom:!1},{name:`yolo26n-pose.pt`,path:`/data/weights/yolo26n-pose.pt`,size:618e4,mtime:17319e5,family:`yolo26`,tier:`n`,task:`pose`,custom:!1},{name:`yolo11n.pt`,path:`/data/weights/yolo11n.pt`,size:561e4,mtime:17318e5,family:`yolo11`,tier:`n`,task:`hbb`,custom:!1},{name:`yolo11m-seg.pt`,path:`/data/weights/yolo11m-seg.pt`,size:452e5,mtime:17318e5,family:`yolo11`,tier:`m`,task:`seg`,custom:!1},{name:`yolo11s-obb.pt`,path:`/data/weights/yolo11s-obb.pt`,size:199e5,mtime:17318e5,family:`yolo11`,tier:`s`,task:`obb`,custom:!1},{name:`pcb_v3_best.pt`,path:`/data/weights/pcb_v3_best.pt`,size:201e5,mtime:1732e6,family:null,tier:null,task:null,custom:!0}];function c(e,t=1){let n=[],r=[],i=[],a=[],o=[],s=[],c=[],l=[];for(let u=1;u<=e;u++){let d=u/Math.max(e,1),f=Math.sin(u*1.9+t)*.012*(1-d*.5);n.push(u),r.push(Number((1.65*Math.exp(-2.6*d)+.36+f).toFixed(4))),i.push(Number((2.15*Math.exp(-3.1*d)+.28+f*.9).toFixed(4))),a.push(Number((1.05*Math.exp(-2.2*d)+.19+f*.4).toFixed(4))),o.push(Number(Math.min(.985,.34+.61*(1-Math.exp(-4.2*d))+f).toFixed(4))),s.push(Number(Math.min(.89,.16+.62*(1-Math.exp(-3.4*d))+f).toFixed(4))),c.push(Number(Math.min(.98,.42+.52*(1-Math.exp(-3.9*d))+f*1.1).toFixed(4))),l.push(Number(Math.min(.96,.31+.59*(1-Math.exp(-3.7*d))+f*1.2).toFixed(4)))}return{epochs:n,series:{"train/box_loss":r,"train/cls_loss":i,"train/dfl_loss":a,"metrics/mAP50(B)":o,"metrics/mAP50-95(B)":s,"metrics/precision(B)":c,"metrics/recall(B)":l}}}function l(e,t){let n=document.createElement(`canvas`);n.width=640,n.height=420;let r=n.getContext(`2d`),i=r.createLinearGradient(0,0,640,420);i.addColorStop(0,`#2a352f`),i.addColorStop(1,`#18211d`),r.fillStyle=i,r.fillRect(0,0,640,420),r.strokeStyle=`rgba(130, 195, 160, 0.14)`,r.lineWidth=1.5;for(let e=24;e<640;e+=36)r.beginPath(),r.moveTo(e,0),r.lineTo(e,420),r.stroke();for(let e=24;e<420;e+=36)r.beginPath(),r.moveTo(0,e),r.lineTo(640,e),r.stroke();return r.fillStyle=`#333b3f`,r.fillRect(105+e%3*10,92,138,92),r.fillStyle=`#b98f4a`,r.fillRect(345,168+e%2*14,130,62),r.fillStyle=`#5c6670`,r.fillRect(210,265,96,54),r.fillStyle=`rgba(255,255,255,0.45)`,r.font=`13px monospace`,r.fillText(`DEMO SAMPLE · ${t}`,18,28),new Promise(e=>{n.toBlob(t=>{let n=URL.createObjectURL(t);e({url:n,revoke:()=>URL.revokeObjectURL(n)})},`image/png`)})}var u=class{live=!1;label=`Demo 模式`;cfg={profiles:[{id:`demo-weng-wsl`,name:`weng · WSL Ubuntu · yolo`,host:`weng`,runtime:`wsl`,wslDistro:`Ubuntu`,python:`/home/shenggu/miniconda3/envs/yolo/bin/python`,workspace:`/home/shenggu/.yolo-studio`,probe:{pythonVersion:`3.11.17`,executable:`/home/shenggu/miniconda3/envs/yolo/bin/python`,platform:`Linux`,home:`/home/shenggu`,torchVersion:`2.14.1+cu132`,cudaAvailable:!0,cudaVersion:`13.2`,gpus:[{index:0,name:`RTX 4060 Ti`,totalMemMB:8188}],ultralyticsVersion:`8.4.177`,supportsYolo11:!0,supportsYolo26:!0,storage:{workspacePath:`/home/shenggu/.yolo-studio`,mountLabel:`/`,disk:{totalBytes:0xfbb6a6d000,usedBytes:425e8,freeBytes:0xf1d1744700,percent:3.9},hostDrive:{drive:`C:`,basePath:`C:\\Users\\ShengGu\\AppData\\Local\\Packages\\CanonicalGroupLimited.Ubuntu\\LocalState`,totalBytes:864266711040,usedBytes:599871741952,freeBytes:264394969088,percent:69.4,note:`WSL 虚拟盘所在盘`},workspaceUsage:{totalBytes:682e6,datasetsBytes:42e7,weightsBytes:98e6,runsBytes:164e6}},errors:[],probedAt:Date.now()/1e3}},{id:`demo-coffee-win`,name:`coffee · Windows · conda-yolo`,host:`coffee`,runtime:`windows`,python:`C:\\Users\\win\\miniconda3\\envs\\yolo\\python.exe`,workspace:`D:\\yolo-studio`,probe:{pythonVersion:`3.10.14`,executable:`C:\\Users\\win\\miniconda3\\envs\\yolo\\python.exe`,platform:`Windows`,home:`C:\\Users\\win`,torchVersion:`2.5.1+cu124`,cudaAvailable:!0,cudaVersion:`12.4`,gpus:[{index:0,name:`RTX 3080 Ti`,totalMemMB:12288}],ultralyticsVersion:`8.4.46`,supportsYolo11:!0,supportsYolo26:!0,storage:{workspacePath:`D:\\yolo-studio`,mountLabel:`D:`,disk:{totalBytes:0xe8e0db6000,usedBytes:412e9,freeBytes:588204886016,percent:41.2},hostDrive:null,workspaceUsage:{totalBytes:124e7,datasetsBytes:81e7,weightsBytes:12e7,runsBytes:31e7}},errors:[],probedAt:Date.now()/1e3}}],modelHub:{host:`lab-nas`,path:`/data/weights`,weights:s,scannedAt:Date.now()/1e3-3600},dataSources:[{id:`ds-pcb`,name:`PCB 旋转元件 (OBB)`,host:`lab-nas`,path:`/data/labels/pcb_obb`},{id:`ds-fruit`,name:`产线分拣检测 (HBB)`,host:`lab-nas`,path:`/data/labels/line_hbb`}],browser:{datasetHost:`lab-nas`,lastPaths:{"lab-nas":`/data/labels`},bookmarks:[{host:`lab-nas`,path:`/data/labels`,label:`labels`}]},projectRoot:{host:`lab-nas`,path:`/data/SundayLearning`,scannedAt:Math.floor(Date.now()/1e3)-600,elapsedMs:420,totalProjects:3,totalDatasets:5,recommendations:[{path:`/data/SundayLearning/Betelnut/BetelnutUpDown/AI/labels/camera5`,relPath:`Betelnut/BetelnutUpDown/AI/labels/camera5`,projectKey:`Betelnut / BetelnutUpDown`,projectName:`BetelnutUpDown`,folderLabel:`camera5`,layout:`flat`,totalImages:167,labeledImages:162,totalBytes:584e5,latestMtime:Math.floor(Date.now()/1e3)-1800,detectedTask:`hbb`,poseKpts:null,classNames:{0:`up`,1:`down`,2:`clean`},classNamesSource:`../class.txt`,classCount:3},{path:`/data/SundayLearning/TrackCounting/labels/pins`,relPath:`TrackCounting/labels/pins`,projectKey:`TrackCounting`,projectName:`TrackCounting`,folderLabel:`pins`,layout:`flat`,totalImages:384,labeledImages:342,totalBytes:1242e5,latestMtime:Math.floor(Date.now()/1e3)-9600,detectedTask:`obb`,poseKpts:null,classNames:{0:`pins`},classNamesSource:`../pins.txt`,classCount:1},{path:`/data/SundayLearning/Fries/labels/seg`,relPath:`Fries/labels/seg`,projectKey:`Fries`,projectName:`Fries`,folderLabel:`seg`,layout:`flat`,totalImages:818,labeledImages:818,totalBytes:245e6,latestMtime:Math.floor(Date.now()/1e3)-86400,detectedTask:`seg`,poseKpts:null,classNames:{0:`fry`},classNamesSource:`../class.txt`,classCount:1}],projects:[{projectKey:`Betelnut / BetelnutUpDown`,projectName:`BetelnutUpDown`,latestMtime:Math.floor(Date.now()/1e3)-1800,totalImages:972,datasetCount:2,datasets:[{path:`/data/SundayLearning/Betelnut/BetelnutUpDown/AI/labels/camera5`,relPath:`Betelnut/BetelnutUpDown/AI/labels/camera5`,projectKey:`Betelnut / BetelnutUpDown`,projectName:`BetelnutUpDown`,folderLabel:`camera5`,layout:`flat`,totalImages:167,labeledImages:162,totalBytes:584e5,latestMtime:Math.floor(Date.now()/1e3)-1800,detectedTask:`hbb`,poseKpts:null,classNames:{0:`up`,1:`down`,2:`clean`},classNamesSource:`../class.txt`,classCount:3},{path:`/data/SundayLearning/Betelnut/BetelnutUpDown/AI/labels/camera1`,relPath:`Betelnut/BetelnutUpDown/AI/labels/camera1`,projectKey:`Betelnut / BetelnutUpDown`,projectName:`BetelnutUpDown`,folderLabel:`camera1`,layout:`flat`,totalImages:805,labeledImages:798,totalBytes:281e6,latestMtime:Math.floor(Date.now()/1e3)-5400,detectedTask:`hbb`,poseKpts:null,classNames:{0:`up`,1:`down`,2:`clean`},classNamesSource:`../class.txt`,classCount:3}]},{projectKey:`TrackCounting`,projectName:`TrackCounting`,latestMtime:Math.floor(Date.now()/1e3)-9600,totalImages:687,datasetCount:2,datasets:[{path:`/data/SundayLearning/TrackCounting/labels/pins`,relPath:`TrackCounting/labels/pins`,projectKey:`TrackCounting`,projectName:`TrackCounting`,folderLabel:`pins`,layout:`flat`,totalImages:384,labeledImages:342,totalBytes:1242e5,latestMtime:Math.floor(Date.now()/1e3)-9600,detectedTask:`obb`,poseKpts:null,classNames:{0:`pins`},classNamesSource:`../pins.txt`,classCount:1},{path:`/data/SundayLearning/TrackCounting/labels/ram`,relPath:`TrackCounting/labels/ram`,projectKey:`TrackCounting`,projectName:`TrackCounting`,folderLabel:`ram`,layout:`flat`,totalImages:303,labeledImages:303,totalBytes:986e5,latestMtime:Math.floor(Date.now()/1e3)-21e3,detectedTask:`hbb`,poseKpts:null,classNames:{0:`ram`},classNamesSource:`../ram.txt`,classCount:1}]},{projectKey:`Fries`,projectName:`Fries`,latestMtime:Math.floor(Date.now()/1e3)-86400,totalImages:818,datasetCount:1,datasets:[{path:`/data/SundayLearning/Fries/labels/seg`,relPath:`Fries/labels/seg`,projectKey:`Fries`,projectName:`Fries`,folderLabel:`seg`,layout:`flat`,totalImages:818,labeledImages:818,totalBytes:245e6,latestMtime:Math.floor(Date.now()/1e3)-86400,detectedTask:`seg`,poseKpts:null,classNames:{0:`fry`},classNamesSource:`../class.txt`,classCount:1}]}]}};runs=[{runId:`20261124-174012_pcb-yolo26s-obb`,name:`PCB 元件旋转检测 · YOLO26s`,seriesId:`series-pcb-obb`,seriesName:`PCB 元件旋转检测 · YOLO26s`,version:2,parentRunId:`20261123-102000_pcb-yolo26s-obb-v1`,versionNote:`补标 32 张反光样本，epochs 80→100`,datasetStats:{mode:`remote_cache`,copied:64,skipped:896,totalFiles:960,reusedCache:!0},profileId:`demo-weng-wsl`,profileName:`weng · WSL Ubuntu · yolo`,host:`weng`,runtime:`wsl`,wslDistro:`Ubuntu`,python:`/home/shenggu/miniconda3/envs/yolo/bin/python`,runDir:`/home/shenggu/.yolo-studio/runs/20261124-174012_pcb-yolo26s-obb`,family:`yolo26`,task:`obb`,model:`yolo26s-obb.pt`,datasetHost:`lab-nas`,datasetPath:`/data/labels/pcb_obb`,createdAt:Date.now()/1e3-1100,startedAt:Date.now()/1e3-1080,status:`running`,pid:4821,winPid:11204,epoch:64,totalEpochs:100,bestMap50:.9462,bestMap5095:.7428,etaSec:420},{runId:`20261123-102000_pcb-yolo26s-obb-v1`,name:`PCB 元件旋转检测 · YOLO26s`,seriesId:`series-pcb-obb`,seriesName:`PCB 元件旋转检测 · YOLO26s`,version:1,parentRunId:null,versionNote:`初版基线训练`,datasetStats:{mode:`remote_cache`,copied:896,skipped:0,totalFiles:896,reusedCache:!1},profileId:`demo-weng-wsl`,profileName:`weng · WSL Ubuntu · yolo`,host:`weng`,runtime:`wsl`,wslDistro:`Ubuntu`,python:`/home/shenggu/miniconda3/envs/yolo/bin/python`,runDir:`/home/shenggu/.yolo-studio/runs/20261123-102000_pcb-yolo26s-obb-v1`,family:`yolo26`,task:`obb`,model:`yolo26s-obb.pt`,datasetHost:`lab-nas`,datasetPath:`/data/labels/pcb_obb`,createdAt:Date.now()/1e3-95e3,startedAt:Date.now()/1e3-94980,endedAt:Date.now()/1e3-92100,status:`done`,epoch:80,totalEpochs:80,bestMap50:.9184,bestMap5095:.7015,etaSec:0},{runId:`20261123-221504_belt-yolo11m-seg`,name:`传送带缺陷分割 · YOLO11m`,seriesId:`20261123-221504_belt-yolo11m-seg`,seriesName:`传送带缺陷分割 · YOLO11m`,version:1,profileId:`demo-coffee-win`,profileName:`coffee · Windows · conda-yolo`,host:`coffee`,runtime:`windows`,python:`C:\\Users\\win\\miniconda3\\envs\\yolo\\python.exe`,runDir:`C:\\Users\\win\\.yolo-studio\\runs\\20261123-221504_belt-yolo11m-seg`,family:`yolo11`,task:`seg`,model:`yolo11m-seg.pt`,datasetHost:`lab-nas`,datasetPath:`/data/labels/belt_seg`,createdAt:Date.now()/1e3-72e3,startedAt:Date.now()/1e3-72e3,endedAt:Date.now()/1e3-69500,status:`done`,epoch:120,totalEpochs:120,bestMap50:.9614,bestMap5095:.7812,etaSec:0}];async ping(){return{ok:!0,name:`Demo Mode`,version:`0.8.0`,features:[`remote`,`yolo`]}}async hosts(){return o}async connect(e){let t=e===`weng`||e===`coffee`;return{home:t?`/C:/Users/ShengGu`:`/data`,windows:t}}async listDir(e,t){return t===`/data`||t===`/`?[{name:`labels`,type:`dir`,size:0,mtime:1732e6,mode:16877},{name:`weights`,type:`dir`,size:0,mtime:1732e6,mode:16877}]:t.endsWith(`/labels`)?[{name:`pcb_obb`,type:`dir`,size:0,mtime:1732e6,mode:16877},{name:`line_hbb`,type:`dir`,size:0,mtime:1732e6,mode:16877}]:[{name:`pcb_0001.jpg`,type:`file`,size:32e4,mtime:1732e6,mode:33188},{name:`pcb_0001.txt`,type:`file`,size:420,mtime:1732e6,mode:33188},{name:`classes.txt`,type:`file`,size:32,mtime:1732e6,mode:33188}]}async readText(e,t){return t.includes(`line_hbb`)?`0 0.275 0.33 0.21 0.22
1 0.64 0.47 0.20 0.15
2 0.40 0.69 0.15 0.13
`:`0 0.17 0.22 0.38 0.20 0.39 0.43 0.18 0.45
1 0.54 0.39 0.74 0.42 0.73 0.57 0.53 0.54
2 0.33 0.63 0.48 0.62 0.48 0.76 0.33 0.77
`}async rawImageUrl(e,t){return l(Number(t.match(/(\d+)/)?.[1]??1),t.split(`/`).pop()||`sample.jpg`)}async getConfig(){return structuredClone(this.cfg)}async saveConfig(e){this.cfg=structuredClone(e)}async discover(e,t){return t===`wsl`?{host:e,windowsHost:!0,runtime:t,distros:[`Ubuntu`],pythons:[`/home/shenggu/miniconda3/envs/yolo/bin/python`,`/home/shenggu/miniconda3/bin/python`,`/usr/bin/python3`],home:`/home/shenggu`,defaultWorkspace:`/home/shenggu/.yolo-studio`}:{host:e,windowsHost:t===`windows`,runtime:t,distros:t===`windows`?[`Ubuntu`]:[],pythons:t===`windows`?[`C:\\Users\\ShengGu\\anaconda3\\envs\\yolo\\python.exe`,`C:\\Users\\ShengGu\\anaconda3\\python.exe`]:[`/home/sunday/miniconda3/envs/yolo26/bin/python`,`/usr/bin/python3`],home:t===`windows`?`C:\\Users\\ShengGu`:`/home/sunday`,defaultWorkspace:t===`windows`?`D:\\remote`:`/home/sunday/.yolo-studio`}}async probe(e,t,n,r=``,i=``,a=``){let o=a||(t===`windows`?`D:\\remote`:`/home/shenggu/.yolo-studio`);return{pythonVersion:`3.11.17`,executable:n,platform:t===`windows`?`Windows`:`Linux`,home:t===`windows`?`C:\\Users\\ShengGu`:`/home/shenggu`,torchVersion:`2.14.1+cu132`,cudaAvailable:!0,cudaVersion:`13.2`,gpus:[{index:0,name:`RTX 4060 Ti`,totalMemMB:8188}],ultralyticsVersion:`8.4.177`,supportsYolo11:!0,supportsYolo26:!0,storage:{workspacePath:o,mountLabel:t===`windows`?o.slice(0,2).toUpperCase():`/`,disk:{totalBytes:864266711040,usedBytes:599871741952,freeBytes:264394969088,percent:69.4},hostDrive:t===`wsl`?{drive:`C:`,basePath:`C:\\Users\\ShengGu\\AppData\\Local\\Packages\\CanonicalGroupLimited.Ubuntu\\LocalState`,totalBytes:864266711040,usedBytes:599871741952,freeBytes:264394969088,percent:69.4,note:`WSL 虚拟盘所在盘`}:null,workspaceUsage:{totalBytes:682e6,datasetsBytes:42e7,weightsBytes:98e6,runsBytes:164e6}},errors:[],probedAt:Date.now()/1e3}}async scanDataset(e,t){let n=t.includes(`hbb`),r=Array.from({length:12},(e,n)=>{let r=String(n+1).padStart(4,`0`);return{name:`sample_${r}.jpg`,imagePath:`${t.replace(/\/$/,``)}/sample_${r}.jpg`,labelPath:`${t.replace(/\/$/,``)}/sample_${r}.txt`,size:29e4+n*14e3,objects:3,classes:[0,1,2]}});return{host:e,path:t,windows:!1,layout:`flat`,totalImages:486,labeledImages:480,backgroundImages:6,emptyLabelFiles:2,orphanLabels:0,totalBytes:1624e5,detectedTask:n?`hbb`:`obb`,colHist:n?{5:1642}:{9:1824},poseKpts:null,classCounts:{0:740,1:612,2:472},classNames:n?{0:`chip`,1:`pad`,2:`defect`}:{0:`ic_chip`,1:`capacitor`,2:`resistor`},classNamesSource:`classes.txt`,warnings:[`有 6 张无标注图片（将作为负样本/背景图参与训练）`],samples:r}}async discoverWorkspace(e,t,n=!0){let r=this.cfg.projectRoot,i=Math.floor(Date.now()/1e3),a={host:e,rootPath:t||r.path,scannedAt:i,scannedDirs:128,elapsedMs:380,truncated:!1,totalProjects:r.projects.length,totalDatasets:r.projects.reduce((e,t)=>e+t.datasetCount,0),recommendations:structuredClone(r.recommendations),projects:structuredClone(r.projects)};return n&&(this.cfg.projectRoot={host:a.host,path:a.rootPath,scannedAt:a.scannedAt,elapsedMs:a.elapsedMs,totalProjects:a.totalProjects,totalDatasets:a.totalDatasets,projects:structuredClone(a.projects),recommendations:structuredClone(a.recommendations)}),a}async scanWeights(){return s}deviceKey(e){return`${e.host}::${e.runtime}::${e.wslDistro||``}`}recalcDemoQueue(){let e=new Map;for(let t of this.runs)if(t.queuePosition=null,t.status===`queued`){let n=this.deviceKey(t),r=e.get(n)??[];r.push(t),e.set(n,r)}for(let t of e.values())t.sort((e,t)=>(e.queueOrder??e.createdAt)-(t.queueOrder??t.createdAt)),t.forEach((e,t)=>{e.queuePosition=t+1})}promoteDemoQueue(e){if(!this.runs.some(t=>this.deviceKey(t)===e&&(t.status===`running`||t.status===`starting`||t.status===`exporting`))){let t=this.runs.filter(t=>this.deviceKey(t)===e&&t.status===`queued`).sort((e,t)=>(e.queueOrder??e.createdAt)-(t.queueOrder??t.createdAt))[0];t&&(t.status=`running`,t.startedAt=Date.now()/1e3,t.pid=9e3+Math.floor(Math.random()*900),t.epoch=Math.max(1,t.epoch),t.etaSec=t.totalEpochs*8)}this.recalcDemoQueue()}async listRuns(){return this.recalcDemoQueue(),structuredClone(this.runs)}async startRun(e,t){let n=this.cfg.profiles.find(t=>t.id===e.profileId)??this.cfg.profiles[0],r=this.deviceKey(n),i=this.runs.some(e=>this.deviceKey(e)===r&&(e.status===`running`||e.status===`starting`||e.status===`exporting`||e.status===`queued`)),a=(e.queueMode??`queue`)!==`parallel`&&i,o=[{stage:`checking`,message:`正在连接训练节点（Demo 演示）…`},{stage:`syncing_weights`,message:`命中模型库权重 ${e.weight.name}，流式同步中…`,bytesDone:12e6,bytesTotal:2e7},{stage:`syncing_dataset`,message:`增量同步数据集（Demo：跳过 460 个缓存，更新 26 个文件）…`,done:26,total:26,bytesDone:92e5,bytesTotal:92e5},{stage:`writing_job`,message:`正在写入 job.json & runner.py…`},{stage:`launching`,message:a?`已写入远程训练队列，前序任务结束后将自动接力开训…`:`以脱离模式启动远程训练进程…`}];for(let e of o)t(e),await new Promise(e=>setTimeout(e,240));let s=Date.now()/1e3,c=`demo-${Date.now()}`,l=e.seriesId||c,u=e.seriesName||e.name||`${e.modelLabel} · ${e.task.toUpperCase()}`,d=this.runs.filter(e=>(e.seriesId||e.runId)===l).map(e=>e.version??1),f=e.seriesId?Math.max(1,...d)+1:1,p={runId:c,name:e.name||u,seriesId:l,seriesName:u,version:f,parentRunId:e.parentRunId??null,versionNote:e.versionNote||``,datasetStats:{mode:`remote_cache`,copied:26,skipped:460,totalFiles:486,reusedCache:!0},profileId:n.id,profileName:n.name,host:n.host,runtime:n.runtime,wslDistro:n.wslDistro,python:n.python,runDir:`${n.workspace}/runs/${c}`,family:e.family,task:e.task,model:e.weight.name,datasetHost:e.datasetHost,datasetPath:e.datasetPath,createdAt:s,startedAt:a?null:s,status:a?`queued`:`running`,queueOrder:s,queuePosition:null,pid:a?null:9012,epoch:+!a,totalEpochs:Number(e.params.epochs??100),bestMap50:a?null:.412,bestMap5095:a?null:.204,etaSec:a?null:600};return this.runs.unshift(p),this.recalcDemoQueue(),t({stage:`started`,message:a?`已加入 Demo 训练队列（第 ${p.queuePosition??1} 位）！前序任务完成后会自动接力训练。`:`Demo 训练已启动！`,run:structuredClone(p)}),structuredClone(p)}async getRun(e){this.recalcDemoQueue();let t=this.runs.find(t=>t.runId===e)??this.runs[0];t.status===`running`&&t.epoch<t.totalEpochs&&(t.epoch=Math.min(t.totalEpochs,t.epoch+1),t.etaSec=Math.max(0,(t.totalEpochs-t.epoch)*11),t.epoch>=t.totalEpochs&&(t.status=`done`,t.endedAt=Date.now()/1e3,this.promoteDemoQueue(this.deviceKey(t))));let n=t.status===`queued`,r=n?null:c(Math.max(t.epoch,8),t.runId.length);return{summary:structuredClone(t),job:{runId:t.runId,model:t.model,family:t.family,task:t.task,datasetHost:t.datasetHost,datasetPath:t.datasetPath,params:{epochs:t.totalEpochs,imgsz:640,batch:-1,optimizer:`MuSGD`,lr0:.01,device:`0`}},state:{status:t.status,pid:t.pid,epoch:t.epoch,totalEpochs:t.totalEpochs,queueOrder:t.queueOrder},alive:t.status===`running`,curves:r,artifacts:n?{images:[],weights:[],hasDataYaml:!1}:{images:[{name:`val_batch0_pred.jpg`,rel:`output/val_batch0_pred.jpg`,size:284e3,mtime:1732e6},{name:`train_batch0.jpg`,rel:`output/train_batch0.jpg`,size:312e3,mtime:1732e6},{name:`confusion_matrix.png`,rel:`output/confusion_matrix.png`,size:142e3,mtime:1732e6},{name:`results.png`,rel:`output/results.png`,size:215e3,mtime:1732e6}],weights:[{name:`best.pt`,rel:`output/weights/best.pt`,size:2042e4,mtime:1732e6},{name:`last.pt`,rel:`output/weights/last.pt`,size:2042e4,mtime:1732e6}],hasDataYaml:!0},dataYaml:n?``:`path: ${t.runDir}\ntrain: ${t.runDir}/train.txt\nval: ${t.runDir}/val.txt\nnames:\n  0: "ic_chip"\n  1: "capacitor"\n  2: "resistor"\n`,logSize:n?0:18420}}async stopRun(e){let t=this.runs.find(t=>t.runId===e);if(t){let e=t.status===`queued`;t.status=`stopped`,t.endedAt=Date.now()/1e3,e&&(t.error=`已取消排队`),this.promoteDemoQueue(this.deviceKey(t))}}async prioritizeRun(e){let t=this.runs.find(t=>t.runId===e);if(!t||t.status!==`queued`)return{ok:!1,queuePosition:null};let n=this.deviceKey(t);return t.queueOrder=Math.min(Date.now()/1e3,...this.runs.filter(e=>this.deviceKey(e)===n&&e.status===`queued`).map(e=>e.queueOrder??e.createdAt))-10,this.recalcDemoQueue(),{ok:!0,queuePosition:t.queuePosition}}async resumeRun(e){let t=this.runs.find(t=>t.runId===e);if(t){let e=this.deviceKey(t);t.status=this.runs.some(n=>n.runId!==t.runId&&this.deviceKey(n)===e&&(n.status===`running`||n.status===`starting`||n.status===`exporting`))?`queued`:`running`,t.queueOrder=Date.now()/1e3,t.error=null,this.recalcDemoQueue()}return this.getRun(e)}async renameRun(e,t){let n=this.runs.find(t=>t.runId===e);if(!n)throw new r(`未找到该任务`,404);return n.name=t.trim(),{ok:!0,run:structuredClone(n),remoteSynced:!0}}async colabStatus(){return{installed:!0,authenticated:!0,version:`demo`,balance:200,usageRate:0,activeAssignments:0,sessions:[],tiers:[{gpu:`T4`,label:`T4 · 省额度`,vram:`16 GB`,cuPerHr:`~1.2 CU/h`,desc:`轻量省额度，适合小样本快速验证`},{gpu:`A100`,label:`A100 · 主力超速`,vram:`40/80 GB`,cuPerHr:`~5.4 CU/h`,desc:`主力旗舰加速，训练速度大幅飞跃`},{gpu:`H100`,label:`H100 · 极限超速`,vram:`80 GB`,cuPerHr:`~10+ CU/h`,desc:`顶级算力怪兽，大尺寸大模型极速拉满`}],error:null}}async colabStopAll(){return{ok:!0,stopped:[],status:await this.colabStatus()}}async deleteRun(e){let t=this.runs.find(t=>t.runId===e);this.runs=this.runs.filter(t=>t.runId!==e),t&&this.promoteDemoQueue(this.deviceKey(t))}followLog(e,t){let n=this.runs.find(t=>t.runId===e)??this.runs[0];if(n.status===`queued`){let e=`[sunday-yolo] 任务 ${n.runId} 正在队列中等待（第 #${n.queuePosition??1} 位），前序任务完成后将自动接力启动…\n`;return t(e,e.length),{close:()=>{}}}let r=[`[sunday-yolo] Run ${n.runId} started (pid=${n.pid??4821})`,`[sunday-yolo] Model=${n.model} Task=${n.task} Python=${n.python}`,`Ultralytics 8.4.177 🚀 Python-3.11.17 torch-2.14.1+cu132 CUDA:0 (NVIDIA GeForce RTX 4060 Ti, 8188MiB)`,`optimizer: MuSGD(lr=0.01, momentum=0.937) with parameter groups 68 weight, 74 bias`,`      Epoch    GPU_mem   box_loss   cls_loss   dfl_loss  Instances       Size`,`     ${String(Math.max(1,n.epoch-2)).padStart(3)}/${n.totalEpochs}      3.42G     0.5124     0.4218     0.2891         42        640  mAP50=0.931 mAP50-95=0.728`,`     ${String(Math.max(1,n.epoch-1)).padStart(3)}/${n.totalEpochs}      3.44G     0.4980     0.4052     0.2784         39        640  mAP50=0.941 mAP50-95=0.736`,`     ${String(n.epoch).padStart(3)}/${n.totalEpochs}      3.43G     0.4831     0.3914     0.2712         44        640  mAP50=0.946 mAP50-95=0.743`,``].join(`
`);t(r,r.length);let i=n.epoch,a=window.setInterval(()=>{n.status===`running`&&(i=Math.min(n.totalEpochs,i+1),t(`     ${String(i).padStart(3)}/${n.totalEpochs}      3.44G     ${(.47-i*5e-4).toFixed(4)}     ${(.38-i*4e-4).toFixed(4)}     0.2680         41        640  mAP50=${Math.min(.97,.946+(i-n.epoch)*.001).toFixed(3)} mAP50-95=0.749\n`,r.length+i*90))},3500);return{close:()=>clearInterval(a)}}stats(e,t){let n=()=>{t({type:`stats`,t:Date.now()/1e3,cpu:28+Math.round(Math.random()*14),cores:16,load:2.1,mem:{used:11.4*1024**3,total:32*1024**3},cpuTemp:56,temps:[],gpus:[{name:`RTX 4060 Ti`,util:92+Math.round(Math.random()*6),memUsed:4620+Math.round(Math.random()*120),memTotal:8188,temp:64+Math.round(Math.random()*3),power:142+Math.round(Math.random()*12)}]})};n();let r=window.setInterval(n,2200);return{close:()=>clearInterval(r)}}async artifactImageUrl(e,t){return l(t.length,t.split(`/`).pop()||`artifact`)}downloadArtifact(){alert(`Demo 模式仅供界面体验，连接本地 Sunday Server 后可直接下载远程权重文件。`)}events(){return{close:()=>{}}}},d=[`#ff4fa3`,`#00d4ff`,`#ff9259`,`#a259ff`,`#26e2a5`,`#ffcb47`,`#ff5c77`,`#5390ff`];function f(e){return d[Math.abs(e)%d.length]}function p(e,t,n,r,i){e.font=`600 12px Inter, -apple-system, BlinkMacSystemFont, sans-serif`;let a=Math.ceil(e.measureText(r).width)+14,o=Math.max(4,Math.min(t,e.canvas.width-a-4)),s=Math.max(4,n-20-4<4?n+4:n-20-4);e.save(),e.fillStyle=i,e.beginPath(),e.roundRect(o,s,a,20,6),e.fill(),e.fillStyle=`#fff`,e.textBaseline=`middle`,e.fillText(r,o+7,s+10+.5),e.restore()}function m(e,t,n,r,i,a){let o=Math.min(1,920/t.naturalWidth,560/t.naturalHeight),s=Math.max(1,Math.round(t.naturalWidth*o)),c=Math.max(1,Math.round(t.naturalHeight*o));e.width=s,e.height=c;let l=e.getContext(`2d`);l.clearRect(0,0,s,c),l.drawImage(t,0,0,s,c);let u=n.split(/\r?\n/).map(e=>e.trim()).filter(Boolean),d=0;for(let e of u){let t=e.split(/\s+/);if(t.length<5)continue;let n=Math.round(Number(t[0])),o=t.slice(1).map(Number);if(Number.isNaN(n)||o.some(Number.isNaN))continue;let u=f(n),m=i[String(n)]??`cls_${n}`;d++;let h=r===`obb`&&o.length===8?`obb`:r===`seg`&&o.length>=6&&o.length%2==0?`seg`:r===`pose`&&o.length>4?`pose`:o.length===4?`hbb`:o.length===8?`obb`:o.length>=6&&o.length%2==0?`seg`:`pose`;if(l.save(),l.strokeStyle=u,l.lineWidth=2.2,l.lineJoin=`round`,h===`hbb`){let[e,t,n,r]=o,i=(e-n/2)*s,a=(t-r/2)*c,d=n*s,f=r*c;l.fillStyle=`${u}22`,l.beginPath(),l.roundRect(i,a,d,f,6),l.fill(),l.stroke(),p(l,i,a,m,u)}else if(h===`obb`&&o.length>=8){let e=[[o[0]*s,o[1]*c],[o[2]*s,o[3]*c],[o[4]*s,o[5]*c],[o[6]*s,o[7]*c]];l.fillStyle=`${u}26`,l.beginPath(),l.moveTo(e[0][0],e[0][1]);for(let t=1;t<4;t++)l.lineTo(e[t][0],e[t][1]);l.closePath(),l.fill(),l.stroke(),l.fillStyle=`#fff`,l.beginPath(),l.arc((e[0][0]+e[1][0])/2,(e[0][1]+e[1][1])/2,3.8,0,Math.PI*2),l.fill(),l.stroke();let t=e.reduce((e,t)=>t[1]<e[1]?t:e);p(l,t[0],t[1],m,u)}else if(h===`seg`&&o.length>=6){l.fillStyle=`${u}38`,l.beginPath();let e=1/0,t=0;for(let n=0;n+1<o.length;n+=2){let r=o[n]*s,i=o[n+1]*c;n===0?l.moveTo(r,i):l.lineTo(r,i),i<e&&(e=i,t=r)}l.closePath(),l.fill(),l.stroke(),p(l,t,e,m,u)}else if(h===`pose`&&o.length>4){let[e,t,n,r]=o,i=(e-n/2)*s,d=(t-r/2)*c;l.fillStyle=`${u}16`,l.setLineDash([5,4]),l.beginPath(),l.roundRect(i,d,n*s,r*c,6),l.fill(),l.stroke(),l.setLineDash([]);let h=o.slice(4),g=a?.[1]??(h.length%3==0?3:2);for(let e=0;e+g-1<h.length;e+=g){let t=h[e]*s,n=h[e+1]*c,r=g===3?h[e+2]:2;if(r<=0&&t===0&&n===0)continue;let i=f(Math.floor(e/g)+1);l.beginPath(),l.arc(t,n,4.2,0,Math.PI*2),l.fillStyle=r>=2?i:`#fff`,l.fill(),l.lineWidth=2,l.strokeStyle=r>=2?`#fff`:i,l.stroke()}p(l,i,d,m,u)}l.restore()}return d}function h(e){let t=Object.keys(e.series),n=[[/^train\/box_loss$/,`Box`,`#ff4fa3`,!0,!1],[/^train\/cls_loss$/,`Cls`,`#00d4ff`,!1,!1],[/^train\/dfl_loss$/,`DFL`,`#ff9259`,!1,!1],[/^val\/box_loss$/,`Val Box`,`#ff85c0`,!1,!0],[/^train\/seg_loss$/,`Seg`,`#26e2a5`,!1,!1],[/^train\/pose_loss$/,`Pose`,`#a259ff`,!1,!1],[/^train\/kobj_loss$/,`Kpt`,`#ffcb47`,!1,!1]],r=[];for(let[e,i,a,o,s]of n){let n=t.find(t=>e.test(t));n&&r.push({key:n,label:i,color:a,primary:o,dashed:s})}return r}function g(e){let t=Object.keys(e.series),n=[[/^metrics\/mAP50\(B\)$/,`mAP50`,`#ff4fa3`,!0],[/^metrics\/mAP50-95\(B\)$/,`mAP50-95`,`#00d4ff`,!1],[/^metrics\/mAP50\(M\)$/,`mAP50(M)`,`#a259ff`,!1],[/^metrics\/mAP50\(P\)$/,`mAP50(P)`,`#ff9259`,!1],[/^metrics\/precision\(B\)$/,`Precision`,`#26e2a5`,!1],[/^metrics\/recall\(B\)$/,`Recall`,`#ffcb47`,!1]],r=[];for(let[e,i,a,o]of n){let n=t.find(t=>e.test(t));n&&r.push({key:n,label:i,color:a,primary:o})}return r}function _(e){if(!e)return null;for(let t=e.length-1;t>=0;t--){let n=e[t];if(typeof n==`number`&&Number.isFinite(n))return n}return null}function v(e,t,n,r,i){if(e.innerHTML=``,!n||!n.epochs.length||!r.length){e.innerHTML=`<div class="chart-empty">等待首个 Epoch 数据写入 results.csv…</div>`;return}let a=n.epochs,o=a.length,s=[];for(let e of r)for(let t of n.series[e.key]??[])typeof t==`number`&&Number.isFinite(t)&&s.push(t);if(!s.length){e.innerHTML=`<div class="chart-empty">暂无有效数值</div>`;return}let c=[...s].sort((e,t)=>e-t),l=c[0],u=c[c.length-1],d=!1,f=u;if(i===`loss`&&o>=8){let e=c[Math.min(c.length-1,Math.floor(c.length*.92))];e>0&&u>e*2.2&&(f=e*1.35,d=!0)}let p=i===`percent`?Math.max(0,Math.floor(l*10)/10-.05):Math.max(0,l*.88),m=i===`percent`?Math.min(1.02,Math.max(u*1.04,p+.1)):Math.max(f*1.08,p+.05),h=e=>46+(o===1?240:e/(o-1)*480),g=e=>208-(Math.max(p,Math.min(m,e))-p)/Math.max(m-p,1e-6)*194,v=e=>i===`percent`?`${(e*100).toFixed(1)}%`:e.toFixed(3),y=document.createElement(`div`);y.className=`chart-head`,y.innerHTML=`
		<div class="chart-title-wrap">
			<span class="chart-title">${t}</span>
			${d?`<span class="chart-clip-tag" title="已自动忽略早期尖峰以清晰展示主收敛区间">已聚焦收敛区间</span>`:``}
		</div>
		<div class="chart-legend">
			${r.map(e=>{let t=_(n.series[e.key]);return`<span class="leg-item"><i style="background:${e.color}"></i>${e.label}${t==null?``:` <b>${v(t)}</b>`}</span>`}).join(``)}
		</div>
	`,e.appendChild(y);let b=document.createElement(`div`);b.className=`chart-svg-wrap`;let x=``;for(let e=0;e<=4;e++){let t=p+(m-p)*e/4,n=g(t),r=i===`percent`?`${Math.round(t*100)}%`:t.toFixed(t<1?2:1);x+=`<line x1="46" y1="${n.toFixed(1)}" x2="526" y2="${n.toFixed(1)}" class="c-grid" />`,x+=`<text x="38" y="${(n+3.5).toFixed(1)}" text-anchor="end" class="c-axis">${r}</text>`}let S=o<=5?a.map((e,t)=>[t,e]):[0,Math.floor((o-1)/2),o-1].map(e=>[e,a[e]]);for(let[e,t]of S)x+=`<text x="${h(e).toFixed(1)}" y="229" text-anchor="middle" class="c-axis">E${t}</text>`;let ee=`cg-${Math.random().toString(36).slice(2,8)}`,C=``,te=``;for(let e of r){let t=n.series[e.key]??[],r=[];for(let e=0;e<Math.min(o,t.length);e++){let n=t[e];typeof n==`number`&&Number.isFinite(n)&&r.push([h(e),g(n)])}if(!r.length)continue;let i=r.map(([e,t],n)=>`${n===0?`M`:`L`}${e.toFixed(1)},${t.toFixed(1)}`).join(` `);e.primary&&r.length>1&&(te=`<defs><linearGradient id="${ee}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${e.color}" stop-opacity="0.24"/><stop offset="100%" stop-color="${e.color}" stop-opacity="0.01"/></linearGradient></defs><path d="${i} L${r[r.length-1][0].toFixed(1)},${208 .toFixed(1)} L${r[0][0].toFixed(1)},${208 .toFixed(1)} Z" fill="url(#${ee})" />`);let a=e.dashed?` stroke-dasharray="4 3"`:``;C+=`<path d="${i}" fill="none" stroke="${e.color}" stroke-width="${e.primary?2.5:1.75}"${a} stroke-linecap="round" stroke-linejoin="round" opacity="${e.primary?1:e.dashed?.72:.88}" />`;let s=r[r.length-1];C+=`<circle cx="${s[0].toFixed(1)}" cy="${s[1].toFixed(1)}" r="${e.primary?3.8:2.5}" fill="${e.color}" />`}b.innerHTML=`
		<svg viewBox="0 0 540 236" class="curve-svg" preserveAspectRatio="none">
			${x}
			${te}
			${C}
			<line class="c-cross" x1="0" y1="14" x2="0" y2="208" visibility="hidden" />
		</svg>
		<div class="chart-tip" hidden></div>
	`,e.appendChild(b);let ne=b.querySelector(`svg`),re=b.querySelector(`.c-cross`),w=b.querySelector(`.chart-tip`);ne.addEventListener(`mousemove`,e=>{let t=ne.getBoundingClientRect(),s=(e.clientX-t.left)/t.width*540,c=Math.max(0,Math.min(1,(s-46)/480)),l=Math.round(c*(o-1)),u=h(l);re.setAttribute(`x1`,u.toFixed(1)),re.setAttribute(`x2`,u.toFixed(1)),re.setAttribute(`visibility`,`visible`);let d=r.map(e=>{let t=n.series[e.key]?.[l];if(typeof t!=`number`||!Number.isFinite(t))return``;let r=i===`percent`?`${(t*100).toFixed(2)}%`:t.toFixed(4);return`<div><i style="background:${e.color}"></i><span>${e.label}</span><b>${r}</b></div>`}).join(``);w.innerHTML=`<div class="tip-ep">Epoch ${a[l]}</div>${d}`,w.hidden=!1;let f=u/540*100;w.style.left=f>62?``:`${Math.min(f+2,62)}%`,w.style.right=f>62?`${Math.min(100-f+2,62)}%`:``}),ne.addEventListener(`mouseleave`,()=>{re.setAttribute(`visibility`,`hidden`),w.hidden=!0})}var y=`remotedesk:server`,b=`sunday:yolo-prefs`,x={get(){try{let e=JSON.parse(localStorage.getItem(b)??`{}`);return{datasetHost:typeof e.datasetHost==`string`?e.datasetHost:``,lastPaths:e.lastPaths&&typeof e.lastPaths==`object`?e.lastPaths:{},bookmarks:Array.isArray(e.bookmarks)?e.bookmarks:[],lastDataset:e.lastDataset&&e.lastDataset.host&&e.lastDataset.path?e.lastDataset:null,lastProfileId:typeof e.lastProfileId==`string`?e.lastProfileId:``}}catch{return{datasetHost:``,lastPaths:{},bookmarks:[],lastDataset:null,lastProfileId:``}}},set(e){try{localStorage.setItem(b,JSON.stringify(e))}catch{}}};function S(e){return{layout:e.layout,totalImages:e.totalImages,labeledImages:e.labeledImages,backgroundImages:e.backgroundImages,totalBytes:e.totalBytes,detectedTask:e.detectedTask,poseKpts:e.poseKpts,classCounts:e.classCounts,classNames:e.classNames,classNamesSource:e.classNamesSource,warnings:e.warnings,scannedAt:Date.now()/1e3}}function ee(e,t,n){return{host:e,path:t,windows:/^\/[A-Za-z]:/.test(t),layout:n.layout,totalImages:n.totalImages,labeledImages:n.labeledImages,backgroundImages:n.backgroundImages,emptyLabelFiles:0,orphanLabels:0,totalBytes:n.totalBytes,detectedTask:n.detectedTask,colHist:{},poseKpts:n.poseKpts,classCounts:n.classCounts,classNames:n.classNames,classNamesSource:n.classNamesSource,warnings:n.warnings,samples:[]}}var C={get(){try{return JSON.parse(localStorage.getItem(y)??`null`)}catch{return null}},set(e){try{e?localStorage.setItem(y,JSON.stringify(e)):localStorage.removeItem(y)}catch{}}},te=[{id:`n`,name:`Nano`,desc:`超轻极速`},{id:`s`,name:`Small`,desc:`均衡主力`},{id:`m`,name:`Medium`,desc:`进阶高精`},{id:`l`,name:`Large`,desc:`重载精细`},{id:`x`,name:`XLarge`,desc:`极限旗舰`}],ne=[{id:`hbb`,label:`HBB 水平框`,short:`HBB`,desc:`常规目标检测`},{id:`obb`,label:`OBB 旋转框`,short:`OBB`,desc:`任意角度航拍/工业元件`},{id:`seg`,label:`Seg 实例分割`,short:`Seg`,desc:`像素级轮廓掩码`},{id:`pose`,label:`Pose 姿态点`,short:`Pose`,desc:`边界框 + 关键点`}],re=[{gpu:`T4`,icon:`⚡`,name:`省额度`,vram:`16 GB`,cu:`~1.2 CU/h`,desc:`轻量省额度，适合小样本与快速验证`},{gpu:`A100`,icon:`🚀`,name:`主力超速`,vram:`40/80 GB`,cu:`~5.4 CU/h`,desc:`主力旗舰显卡，训练速度大幅飞跃`},{gpu:`H100`,icon:`🔥`,name:`极限超速`,vram:`80 GB`,cu:`~10+ CU/h`,desc:`顶级算力怪兽，大尺寸模型极速拉满`}],w={seed:null,lr0:null,patience:null,amp:``,cosLr:``,cache:``,end2end:``,mosaic:null,closeMosaic:null,mixup:null,degrees:null,fliplr:null,flipud:null,extraParams:``},ie={quick:{label:`快速试跑`,emoji:`⚡`,hint:`30 轮验证数据与管线（进阶全走官方默认）`,patch:{...w,epochs:30,imgsz:640,batch:-1}},standard:{label:`官方默认`,emoji:`🎯`,hint:`100 轮 640，所有进阶参数不覆写，纯走 Ultralytics 官方默认`,patch:{...w,epochs:100,imgsz:640,batch:-1}},smallObj:{label:`小目标高分`,emoji:`🔍`,hint:`150 轮 960 高分辨率（进阶走官方默认）`,patch:{...w,epochs:150,imgsz:960,batch:-1}},industrial:{label:`工业固定视角`,emoji:`🏭`,hint:`120 轮 640 · 关闭上下/左右翻转 · 轻度 Mosaic`,patch:{...w,epochs:120,imgsz:640,batch:-1,mosaic:.6,degrees:5,fliplr:0,flipud:0}}};function T(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`)}function E(e){return!Number.isFinite(e)||e<=0?`0 B`:e<1024?`${e} B`:e<1024**2?`${(e/1024).toFixed(1)} KB`:e<1024**3?`${(e/1024**2).toFixed(1)} MB`:`${(e/1024**3).toFixed(2)} GB`}function ae(e){if(e==null||!Number.isFinite(e)||e<0)return`—`;let t=Math.round(e);if(t<60)return`${t}s`;let n=Math.floor(t/60),r=t%60;return n<60?`${n}m ${r}s`:`${Math.floor(n/60)}h ${n%60}m`}function D(e){if(!e)return`—`;let t=new Date(e*1e3),n=e=>String(e).padStart(2,`0`);return`${n(t.getMonth()+1)}-${n(t.getDate())} ${n(t.getHours())}:${n(t.getMinutes())}`}function O(e){if(!e)return`—`;let t=Math.max(0,Math.floor(Date.now()/1e3-e));if(t<120)return`刚刚`;if(t<3600)return`${Math.floor(t/60)} 分钟前`;if(t<86400)return`${Math.floor(t/3600)} 小时前`;if(t<604800)return`${Math.floor(t/86400)} 天前`;let n=new Date(e*1e3),r=e=>String(e).padStart(2,`0`);return`${n.getFullYear()}-${r(n.getMonth()+1)}-${r(n.getDate())}`}function oe(e,t){let n={};for(let e of Object.keys(t.classNames||{}))n[e]=0;return{host:e,path:t.path,windows:/^\/[A-Za-z]:/.test(t.path),layout:t.layout,totalImages:t.totalImages,labeledImages:t.labeledImages,backgroundImages:Math.max(0,t.totalImages-t.labeledImages),emptyLabelFiles:0,orphanLabels:0,totalBytes:t.totalBytes,detectedTask:t.detectedTask,colHist:{},poseKpts:t.poseKpts,classCounts:n,classNames:{...t.classNames||{}},classNamesSource:t.classNamesSource||``,warnings:[],samples:[]}}function k(e,t,n){return`${e}${t}${n===`hbb`?``:`-${n}`}.pt`}function se(e){return e.replace(/\x1b\[[0-9;?]*[A-Za-z]/g,``).replace(/\x1b\][^\x07]*\x07/g,``).split(`
`).map(e=>{if(!e.includes(`\r`))return e;let t=e.split(`\r`).filter(e=>e.length>0);return t.length?t[t.length-1]:``}).join(`
`)}function A(e){switch(e){case`queued`:return{label:`排队中`,cls:`st-queued`,active:!0};case`running`:return{label:`训练中`,cls:`st-running`,active:!0};case`starting`:return{label:`启动中`,cls:`st-starting`,active:!0};case`exporting`:return{label:`导出中`,cls:`st-starting`,active:!0};case`done`:return{label:`已完成`,cls:`st-done`,active:!1};case`stopped`:return{label:`已停止`,cls:`st-stopped`,active:!1};case`failed`:return{label:`失败`,cls:`st-failed`,active:!1};case`lost`:return{label:`已中断`,cls:`st-failed`,active:!1};default:return{label:e||`未知`,cls:`st-stopped`,active:!1}}}function j(r){let o=new u,s=[],c={profiles:[],modelHub:{host:``,path:``},dataSources:[]},l=[],d=[],p=`compose`,_=`all`,y=null,b=null,j=`curves`,M=`datasets`,N=!1,P=!1,ce=!1,le=!1,ue=``,F=new Map,de=new Map,fe=new Map,pe=`sunday:yolo-run-cache`,I=new Map,me=new Map,he=new Map,L=x.get();try{let e=JSON.parse(sessionStorage.getItem(pe)??`{}`);for(let[t,n]of Object.entries(e))n?.detail?.summary?.runId&&I.set(t,n)}catch{}function R(){try{let e=Array.from(I.entries()).sort((e,t)=>t[1].fetchedAt-e[1].fetchedAt).slice(0,10);sessionStorage.setItem(pe,JSON.stringify(Object.fromEntries(e)))}catch{}}function ge(){for(let e of me.values())try{e.revoke()}catch{}me.clear()}window.addEventListener(`beforeunload`,ge);function _e(e=!0){x.set(L),c.browser={datasetHost:L.datasetHost,lastPaths:{...L.lastPaths},bookmarks:[...L.bookmarks]},e&&o.live&&o.saveConfig(c).catch(()=>{})}function ve(){let e=new Set(s.map(e=>e.name));for(let t of[L.datasetHost,c.dataSources[0]?.host,c.modelHub.host,s[0]?.name])if(t&&(!e.size||e.has(t)))return t;return s[0]?.name??``}function ye(e,t,n=!1){e&&t&&(L.lastPaths[e]=t,n&&(L.datasetHost=e),_e(!0))}async function be(e,t,n,r){let a=t.replace(/\/+$/,``)||t,s=a.split(`/`).pop()||`dataset`,l=c.dataSources.find(t=>t.host===e&&(t.path.replace(/\/+$/,``)||t.path)===a);return l?(n&&(l.name=n),r&&(l.lastScan=S(r))):(l={id:`ds-${Date.now()}`,name:n||s,host:e,path:a,lastScan:r?S(r):null},c.dataSources.unshift(l)),L.datasetHost=e,L.lastDataset={host:e,path:l.path},L.lastPaths[e]=i(l.path)||l.path,c.browser={datasetHost:L.datasetHost,lastPaths:{...L.lastPaths},bookmarks:[...L.bookmarks]},x.set(L),await o.saveConfig(c),st(),l}let xe=null,Se=null,Ce=null,we=0,Te=0,Ee=!1,z=null,De=!1,Oe=``,B=null,ke=null,Ae=``,je=``,Me=``,Ne=!1,Pe=null,V={name:``,host:``,path:``,scan:null,classNames:{}},H=null,U={name:``,host:``,runtime:`wsl`,wslDistro:``,colabGpu:`A100`,python:``,workspace:`~/.yolo-studio`,weightsDir:``,discoveredDistros:[],discoveredPythons:[],probe:null},W={name:``,iterateFrom:null,versionNote:``,finetuneParent:!1,datasetHost:``,datasetPath:``,datasetScan:null,classNames:{},profileId:``,family:`yolo26`,task:`hbb`,tier:`s`,customWeight:null,preset:`standard`,epochs:100,imgsz:640,batch:-1,workers:4,trainRatio:.8,optimizer:`auto`,device:``,seed:null,lr0:null,patience:null,amp:``,cosLr:``,cache:``,end2end:``,mosaic:null,closeMosaic:null,mixup:null,degrees:null,fliplr:null,flipud:null,poseKpts:[17,3],flipIdxStr:``,exportFormat:``,exportHalf:!1,extraParams:``,overrideSplit:!1,queueMode:`queue`,colabGpu:`A100`};function Fe(){let e={};for(let[t,n]of[[`lr0`,`lr0`],[`patience`,`patience`],[`seed`,`seed`],[`mosaic`,`mosaic`],[`closeMosaic`,`close_mosaic`],[`mixup`,`mixup`],[`degrees`,`degrees`],[`fliplr`,`fliplr`],[`flipud`,`flipud`]]){let r=W[t];typeof r==`number`&&Number.isFinite(r)&&(e[n]=r)}W.amp&&(e.amp=W.amp===`true`),W.cosLr&&(e.cos_lr=W.cosLr===`true`),W.cache&&(e.cache=W.cache),W.family===`yolo26`&&W.end2end&&(e.end2end=W.end2end===`true`);for(let t of W.extraParams.split(/\r?\n/)){let n=t.trim();if(!n||n.startsWith(`#`)||!n.includes(`=`))continue;let[r,...i]=n.split(`=`),a=r.trim(),o=i.join(`=`).trim();a&&(e[a]=o===`true`||o===`True`?!0:o===`false`||o===`False`?!1:o!==``&&!Number.isNaN(Number(o))?Number(o):o.replace(/^['"]|['"]$/g,``))}return e}let G=e=>r.querySelector(e),Ie=G(`.ys-mode-text`),Le=G(`.ys-mode-detail`),Re=G(`.ys-connect-btn`),ze=G(`.ys-disconnect-btn`),Be=G(`.ys-buddy`),Ve=G(`.ys-buddy-bubble`),He=G(`.ys-runs-list`),K=G(`.ys-stage`),Ue=G(`.ys-toast`),We=G(`.ys-ds-count`),Ge=G(`.ys-node-count`),Ke=G(`.ys-hub-count`),qe=G(`.ys-connect-dialog`),q=G(`.ys-folder-dialog`),J=G(`.ys-radar-dialog`),Je=G(`.ys-preview-dialog`),Ye=G(`.ys-lightbox-dialog`),Xe=0;function Y(e,t=`info`){Ue.textContent=e,Ue.dataset.kind=t,Ue.hidden=!1,clearTimeout(Xe),Xe=window.setTimeout(()=>Ue.hidden=!0,3600)}let Ze=0;function X(e,t){Be.dataset.mood=e,t&&(Ve.textContent=t,Ve.hidden=!1,clearTimeout(Ze),Ze=window.setTimeout(()=>Ve.hidden=!0,3800))}let Qe=[`关掉 Mac 也能在远程继续训哦 ✨`,`选好模型库，权重自动匹配同步！`,`YOLO26 免 NMS，部署超丝滑～`,`图片和 txt 放一块也没关系，我会自动整理！`,`WSL 训练时我会保活，训完自动休眠省资源～`,`同台机器可连续排队多个任务，训完自动接力、空队自动退出 📋`];Be.addEventListener(`click`,()=>{X(`happy`,Qe[Math.floor(Math.random()*Qe.length)]),window.setTimeout(()=>{X(d.some(e=>A(e.status).active)?`busy`:`idle`)},1200)});function $e(){let e=location.hash.replace(/^#/,``);if(!e.includes(`server=`))return null;let t=new URLSearchParams(e),n=t.get(`server`)?.trim(),r=t.get(`token`)?.trim();return n&&r?(history.replaceState(null,``,location.pathname+location.search),{url:n,token:r}):null}function et(){Se?.close(),Se=null,Ce?.close(),Ce=null,clearInterval(we),we=0,Ne=!1}async function tt(e,t){et(),ge(),I.clear(),he.clear(),ke=null,xe?.close(),xe=null,o=e,r.dataset.mode=e.live?`live`:`demo`,Ie.textContent=e.live?`Sunday Server`:`Demo 演示`,Le.textContent=e.live?e.label:`未连本地服务`,Re.hidden=e.live,ze.hidden=!e.live,t&&C.set(t),e.live&&(xe=e.events());try{let[t,n,r]=await Promise.all([e.hosts(),e.getConfig(),e.listRuns(!1)]);s=t,c=n,d=r,de.clear(),fe.clear();let i=x.get(),a=n.browser,o=[];for(let e of[...a?.bookmarks??[],...i.bookmarks])e?.host&&e?.path&&!o.some(t=>t.host===e.host&&t.path===e.path)&&o.push(e);L={datasetHost:a?.datasetHost||i.datasetHost||n.dataSources[0]?.host||n.modelHub.host||t[0]?.name||``,lastPaths:{...i.lastPaths,...a?.lastPaths??{}},bookmarks:o,lastDataset:i.lastDataset??null,lastProfileId:i.lastProfileId||``},x.set(L);for(let e of c.dataSources)e.lastScan&&!F.has(`${e.host}::${e.path}`)&&F.set(`${e.host}::${e.path}`,ee(e.host,e.path,e.lastScan));let u=c.profiles.find(e=>e.id===(W.profileId||L.lastProfileId))??c.profiles[0];if(u&&(W.profileId=u.id,rt(u)),!W.datasetPath){let e=L.lastDataset,t=e&&c.dataSources.find(t=>t.host===e.host&&t.path===e.path)||c.dataSources[0];if(t){W.datasetHost=t.host,W.datasetPath=t.path;let e=F.get(`${t.host}::${t.path}`);e&&(W.datasetScan=e,W.classNames={...e.classNames},(e.detectedTask===`hbb`||e.detectedTask===`obb`||e.detectedTask===`seg`||e.detectedTask===`pose`)&&(W.task=e.detectedTask),e.poseKpts&&(W.poseKpts=e.poseKpts))}else e?(W.datasetHost=e.host,W.datasetPath=e.path):W.datasetHost=ve()}!U.host&&s.length&&(U.host=s[0].name),V.host=V.host||ve(),c.modelHub.weights?.length?l=c.modelHub.weights:c.modelHub.host&&c.modelHub.path&&!c.modelHub.scannedAt?(l=[],e.scanWeights(c.modelHub.host,c.modelHub.path).then(e=>{l=e,c.modelHub.weights=e,c.modelHub.scannedAt=Date.now()/1e3,st(),(p===`compose`||p===`nodes`)&&ht()}).catch(()=>{})):l=[],!e.live&&d.length&&(y=d[0].runId,p=`compose`),st(),Z(),ht(),at(),it(!0);let f=d.filter(e=>A(e.status).active).length;X(f>0?`busy`:`happy`,e.live?`已连上 Sunday Server（${s.length} 台主机）`:`当前为 Demo 演示模式，可自由点按体验～`)}catch(e){Y(e instanceof Error?e.message:String(e),`err`)}}async function nt(e,t,n=!1){let r=new a(e.replace(/\/+$/,``),t);try{let e=await r.ping();if(!e.features?.includes(`yolo`)){let t=`检测到旧版服务 (v${e.version})，请在菜单栏点击 Restart Server 升级到 Sunday Server 0.8+`;return n||Y(t,`err`),t}return await tt(r,{url:r.base,token:t}),null}catch(e){let t=e instanceof Error?e.message:`连接失败`;return n||Y(t,`err`),t}}function rt(e){e.runtime===`colab`?(W.colabGpu=e.colabGpu||`A100`,W.workers=4,W.device=`0`):(W.workers=e.runtime===`windows`?2:4,e.probe?.gpus?.length?W.device=`0`:e.probe&&!e.probe.cudaAvailable&&(W.device=`cpu`))}async function it(e=!1){if(De)return z;De=!0;try{let e=await o.colabStatus();return z=e,p===`nodes`&&M===`nodes`?$():p===`compose`&&_t()?.runtime===`colab`&&Q(),e}catch(t){return e||Y(t instanceof Error?t.message:String(t),`err`),null}finally{De=!1}}function at(){d.some(e=>A(e.status).active)?Te||=window.setInterval(async()=>{if(!(document.hidden||Ee)){if(!d.some(e=>A(e.status).active))clearInterval(Te),Te=0;else{Ee=!0;try{d=await o.listRuns(!1),Z()}catch{}finally{Ee=!1}}}},12e3):Te&&=(clearInterval(Te),0)}async function ot(e,t){let n=t.trim();if(!n)return Y(`任务名不能为空`,`err`);try{let t=await o.renameRun(e,n),r=t.run;if(d=d.map(t=>t.runId===e?r:t),b&&b.summary.runId===e)b={...b,summary:r,job:{...b.job,name:r.name,nameUpdatedAt:r.nameUpdatedAt}},I.set(e,{detail:b,fetchedAt:Date.now()}),R();else{let t=I.get(e);t&&(t.detail.summary=r,I.set(e,t),R())}if(Z(),p===`run`&&y===e){let t=K.querySelector(`.rm-title-row h2`);t&&(t.textContent=r.name||r.seriesName||e)}Y(t.remoteSynced===!1?`已改名为「${n}」（已本地保存，远程离线暂未同步）`:`已改名为「${n}」`,`ok`)}catch(e){Y(e instanceof Error?e.message:String(e),`err`)}}function st(){We.textContent=`${c.dataSources.length}`,Ge.textContent=`${c.profiles.length}`,Ke.textContent=l.length?`${l.length}`:c.modelHub.path?`已配`:`0`,r.querySelectorAll(`.ys-nav-card`).forEach(e=>{e.classList.toggle(`active`,e.dataset.nav===`compose`&&p===`compose`||e.dataset.nav===`nodes`&&p===`nodes`)})}function ct(e){M=e,mt(`nodes`)}function lt(e){return e.seriesId||e.runId}function ut(e){let t=lt(e);return d.filter(e=>lt(e)===t).sort((e,t)=>(t.version??1)-(e.version??1)||(t.createdAt??0)-(e.createdAt??0))}function dt(e){if(!e)return``;let t=e.hostDrive,n=t??e.disk;if(!n||!n.totalBytes)return``;let r=t?t.drive:e.mountLabel||`/`,i=(n.freeBytes/1024**3).toFixed(0);return`<span class="mini-tag ${n.percent>=90?`err`:n.percent>=80?`warn`:``}" title="${T(e.workspacePath)}${t?.basePath?` · 宿主盘 ${t.basePath}`:``}">💾 ${T(r)} 剩 ${i}G</span>`}function ft(e,t){if(!e)return t?`<div class="sn-storage-empty mono">📂 工作区：${T(t)} <span class="sn-st-hint">（点「🩺 体检」查看对应磁盘剩余空间）</span></div>`:``;let n=e.hostDrive,r=n??e.disk,i=Math.min(100,Math.max(0,r?.percent??0)),a=i>=90?`crit`:i>=80?`warn`:`ok`,o=n?`${n.drive} 盘（${n.note||`WSL 所在盘`}）`:`${e.mountLabel||`/`} 分区`,s=E(r?.freeBytes??0),c=E(r?.totalBytes??0),l=e.workspaceUsage,u=l&&l.totalBytes>0?`已占 ${E(l.totalBytes)}（数据 ${E(l.datasetsBytes)} · 权重 ${E(l.weightsBytes)} · 任务 ${E(l.runsBytes)}）`:`工作区暂无历史占用`;return`
		<div class="sn-storage ${a}" title="${T(n?.basePath?`WSL 虚拟盘路径：${n.basePath}`:e.workspacePath)}">
			<div class="sn-st-top">
				<span class="sn-st-path mono" title="${T(e.workspacePath)}">📂 ${T(e.workspacePath)}</span>
				<span class="sn-st-disk">💾 ${T(o)} · 剩 <b>${s}</b> / ${c} (${i.toFixed(0)}%)</span>
			</div>
			<div class="sn-st-bar"><i style="width:${i}%"></i></div>
			<div class="sn-st-sub">${u}</div>
		</div>`}function pt(e,t){let n=ut(e),r=A(e.status),i=e.status===`queued`,a=e.totalEpochs>0?Math.min(Math.max(0,e.epoch),e.totalEpochs):Math.max(0,e.epoch),o=e.totalEpochs>0?Math.min(100,Math.round(a/e.totalEpochs*100)):0,s=p===`run`&&y===e.runId?`selected`:``,c=e.family===`yolo26`?`pill-y26`:`pill-y11`,l=i&&e.queuePosition?`${r.label} #${e.queuePosition}`:r.label,u=e.version??1,d=u>1||n.length>1,f=e.name||e.seriesName||e.runId,m=e.model?e.model.replace(/\.pt$/i,``):``,h=e.runtime===`colab`?`<span class="pill pill-colab">⚡ Colab·${T(e.colabGpu||`GPU`)}</span>`:`<span class="pill pill-node">${T(e.host)}${e.runtime===`wsl`?`·WSL`:e.runtime===`windows`?`·Win`:``}</span>`;return`
		<div class="ys-run-item ${s} ${t?`is-live`:``}" role="button" tabindex="0" data-run-id="${T(e.runId)}">
			<div class="ri-top">
				<span class="ri-name" title="${T(f)}">${d?`<em class="ver-tag">v${u}</em>`:``}${T(f)}</span>
				<button type="button" class="ri-rename-btn" data-rename-run="${T(e.runId)}" title="重命名任务">✏️</button>
				<span class="st-pill ${r.cls}"><i class="st-dot"></i>${l}</span>
			</div>
			<div class="ri-tags">
				<span class="pill ${c}">${e.family.toUpperCase()}</span>
				<span class="pill pill-task-${e.task}">${e.task.toUpperCase()}</span>
				${m?`<span class="pill pill-model-mini" title="${T(e.model)}">${T(m)}</span>`:``}
				${h}
			</div>
			${i?`<div class="ri-wait">⏳ 等待前序任务结束后自动接力 · ${e.totalEpochs} 轮</div>`:`<div class="ri-bar-row">
						<div class="ri-bar"><i style="width:${o}%"></i></div>
						<span class="ri-ep">E${a}/${e.totalEpochs}</span>
					</div>`}
			<div class="ri-foot">
				<span>${e.bestMap50==null?T(e.model):`mAP50 <b>${(e.bestMap50*100).toFixed(1)}%</b>`}</span>
				<span>${D(e.createdAt)}</span>
			</div>
			${n.length>1?`<div class="ri-vers" aria-label="同系列版本">
							${n.slice(0,6).map(t=>{let n=A(t.status),r=t.runId===e.runId?`cur`:``,i=t.runtime===`colab`?`Colab·${t.colabGpu||`GPU`}`:t.host,a=`v${t.version??1} · ${t.name||t.seriesName} · ${i} · ${t.model} · ${n.label}${t.bestMap50==null?``:` · mAP50 ${(t.bestMap50*100).toFixed(1)}%`}${t.versionNote?` · ${t.versionNote}`:``}`;return`<button type="button" class="ri-ver-pill ${r}" data-ver-run="${T(t.runId)}" title="${T(a)}"><i class="vdot ${n.cls}"></i>v${t.version??1}</button>`}).join(``)}
							${n.length>6?`<span class="ri-ver-more">+${n.length-6}</span>`:``}
						</div>`:``}
		</div>`}function Z(){let e=d.filter(e=>_===`active`?A(e.status).active:_!==`done`||!A(e.status).active);if(r.querySelectorAll(`.ys-filter-btn`).forEach(e=>{e.classList.toggle(`active`,e.dataset.filter===_)}),!e.length){He.innerHTML=`<div class="ys-empty-mini">还没有训练任务<br/>点上方按钮开始第一次训练吧 ✨</div>`;return}let t=e.filter(e=>A(e.status).active).sort((e,t)=>{let n=+(e.status===`queued`),r=+(t.status===`queued`);return n===r?(t.createdAt??0)-(e.createdAt??0):n-r}),n=e.filter(e=>!A(e.status).active),i=new Set(t.map(e=>lt(e))),a=[],o=new Map;for(let e of n){let t=lt(e),n=p===`run`&&e.runId===y;if(_===`all`&&i.has(t)&&!n)continue;let r=o.get(t);r||(r=[],o.set(t,r),a.push({sid:t,items:r})),r.push(e)}let s=[];if(t.length){let e=t.filter(e=>e.status!==`queued`).length,n=t.length-e,r=e>1?`${e} 台并行中${n?` · ${n} 排队`:``}`:n?`${e} 训 · ${n} 排队`:`运行中`;s.push(`<div class="ri-section-label live"><span>🔥 进行中</span><span>${r}</span></div>`),s.push(t.map(e=>pt(e,!0)).join(``))}a.length&&(t.length&&s.push(`<div class="ri-section-label"><span>📦 历史归档</span><span>${a.length} 组</span></div>`),s.push(a.map(({items:e})=>(e.sort((e,t)=>(t.version??1)-(e.version??1)||(t.createdAt??0)-(e.createdAt??0)),pt((p===`run`?e.find(e=>e.runId===y):void 0)??e[0],!1))).join(``))),He.innerHTML=s.join(``),He.querySelectorAll(`.ys-run-item`).forEach(e=>{e.addEventListener(`click`,t=>{t.target.closest(`[data-ver-run],[data-rename-run],input,button`)||Mt(e.dataset.runId)}),e.addEventListener(`keydown`,t=>{t.target.tagName!==`INPUT`&&(t.key===`Enter`||t.key===` `)&&(t.preventDefault(),Mt(e.dataset.runId))})}),He.querySelectorAll(`[data-ver-run]`).forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation(),Mt(e.dataset.verRun)})}),He.querySelectorAll(`[data-rename-run]`).forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation();let n=e.dataset.renameRun,r=d.find(e=>e.runId===n);if(!r)return;let i=e.closest(`.ys-run-item`),a=i?.querySelector(`.ri-name`);if(!i||!a)return;let o=r.name||r.seriesName||r.runId,s=document.createElement(`input`);s.className=`ys-input sm`,s.value=o,s.style.flex=`1`,s.style.minWidth=`0`,s.style.padding=`0.16rem 0.4rem`,s.style.fontSize=`0.78rem`;let c=!1,l=()=>{c||(c=!0,Z())},u=async()=>{if(c)return;c=!0;let e=s.value.trim();!e||e===o?Z():await ot(n,e)};s.addEventListener(`click`,e=>e.stopPropagation()),s.addEventListener(`keydown`,e=>{e.stopPropagation(),e.key===`Enter`?(e.preventDefault(),u()):e.key===`Escape`&&(e.preventDefault(),l())}),s.addEventListener(`blur`,()=>u()),a.replaceWith(s),e.style.display=`none`,s.focus(),s.select()})})}function mt(e){e!==`run`&&et(),p=e,st(),Z(),ht()}function ht(){p===`compose`?Q():p===`run`?Rt():$()}function gt(e,t,n){let r=k(e,t,n).toLowerCase();return l.find(e=>e.name.toLowerCase()===r)}function _t(){return c.profiles.find(e=>e.id===W.profileId)??c.profiles[0]}function vt(e){if(!e||e.runtime===`colab`)return{running:0,queued:0,busy:!1};let t=t=>t.host===e.host&&t.runtime===e.runtime&&(t.wslDistro||``)===(e.wslDistro||``),n=0,r=0;for(let e of d)t(e)&&(e.status===`queued`?r++:(e.status===`running`||e.status===`starting`||e.status===`exporting`)&&n++);return{running:n,queued:r,busy:n>0||r>0}}function yt(e){return e?e.runtime===`colab`?{badge:`⚡ Colab 云端超速 · 训完自动归档停机`,desc:`单包上传数据集到 Google Colab GPU，训完自动把权重/图表拉回 Mac 本地并立刻释放 VM`}:W.datasetHost?W.datasetHost===e.host?e.runtime===`wsl`?{badge:`🚀 Win→WSL 本地极速缓存`,desc:`同机从 Windows 盘增量复制到 WSL ext4，大幅加速训练 IO`}:{badge:`⚡ 同机零拷贝`,desc:`无需网络传输，自动零拷贝映射 images/labels 目录`}:{badge:`📡 跨机增量流式同步`,desc:`${W.datasetHost} → ${e.host}（仅传新增/变更文件，训练机自动缓存）`}:{badge:`待选择`,desc:`选好数据源和训练节点后自动规划传输策略`}:{badge:`待选择`,desc:`选好数据源和训练节点后自动规划传输策略`}}function Q(){let e=_t(),t=W.datasetScan,n=yt(e),r=l.filter(e=>e.custom),i=k(W.family,W.tier,W.task),a=gt(W.family,W.tier,W.task),o=!e?.probe||e.probe.supportsYolo26,s=`${W.datasetPath?W.datasetPath.replace(/\/+$/,``).split(`/`).pop():`train`}-${W.customWeight?W.customWeight.name.replace(/\.pt$/i,``):i.replace(/\.pt$/i,``)}`,u=Object.entries(W.classNames).sort((e,t)=>Number(e[0])-Number(t[0])),d=W.datasetHost&&W.datasetPath?`${W.datasetHost}::${W.datasetPath}`:``,p=c.dataSources.find(e=>`${e.host}::${e.path}`===d),m=e?.probe?.gpus?.[0],h=vt(e),g=h.busy&&W.queueMode!==`parallel`,_=W.iterateFrom,v=!!(_?.parentBestPt&&e&&e.host===_.parentHost&&e.runtime===_.parentRuntime&&(e.wslDistro||``)===(_.parentWslDistro||``));!v&&W.finetuneParent&&(W.finetuneParent=!1);let y=Fe(),b=Object.keys(y).length,x=b?Object.entries(y).map(([e,t])=>`${e}=${t}`).join(`, `):`无（100% 沿用 Ultralytics 官方默认）`;K.innerHTML=`
		<div class="ys-compose">
			<div class="ys-hero-bar">
				<div>
					<h2 class="ys-page-title">✨ 新建 YOLO 训练任务</h2>
					<p class="ys-page-sub">在顶部快捷选好数据集与训练节点，下方专注调模型与参数，启动后脱离 Mac 后台静默开训。</p>
				</div>
				<div class="ys-preset-strip" aria-label="快捷场景预设">
					${Object.entries(ie).map(([e,t])=>`<button type="button" class="ys-preset-chip ${W.preset===e?`active`:``}" data-preset="${e}" title="${t.hint}"><span>${t.emoji}</span>${t.label}</button>`).join(``)}
				</div>
			</div>

			<!-- 版本迭代模式全息提示条 -->
			${_?`<section class="ys-iter-banner">
							<div class="iter-head">
								<div class="iter-title">
									<span class="ver-tag lg">v${_.parentVersion} → v${_.nextVersion}</span>
									<b>正在迭代「${T(_.seriesName)}」新版本</b>
									<span class="mini-tag ok">♻️ 复用同一数据集缓存 · 仅增量同步变动文件，不重复占盘</span>
								</div>
								<button type="button" class="ys-btn ghost xs" data-act="cancel-iter">✕ 改为全新任务</button>
							</div>
							<div class="iter-row">
								<label class="iter-note-wrap">
									<span>迭代备注</span>
									<input class="ys-input sm" data-bind="versionNote" value="${T(W.versionNote)}" placeholder="如：补标 30 张反光样本，epochs 调整为 150" />
								</label>
								${v?`<div class="iter-wt-seg" role="group" aria-label="权重起点">
												<button type="button" class="ld-q-opt ${W.finetuneParent?``:`active`}" data-finetune="0">📦 原预训练 (${T(_.parentModel)})</button>
												<button type="button" class="ld-q-opt ${W.finetuneParent?`active`:``}" data-finetune="1">🔥 基于 v${_.parentVersion} best.pt 微调</button>
											</div>`:``}
							</div>
						</section>`:``}

			<!-- 紧凑顶部上下文栏：数据集 + 计算节点一键切换，不占主画面 -->
			<section class="ys-context-bar">
				<div class="ctx-slot">
					<div class="ctx-head">
						<span class="ctx-title">📁 数据集</span>
						<div class="ys-chip-row">
							<button type="button" class="ys-btn neon xs" data-act="open-radar" title="从母文件夹自动探测最新项目、标签类型与类名">✨ 智能探测</button>
							<button type="button" class="ys-btn primary xs" data-act="quick-pick-ds">📂 选文件夹</button>
							<button type="button" class="ys-btn soft xs" data-act="scan-ds" ${W.datasetHost&&W.datasetPath?``:`disabled`}>🔍 ${t?`重扫`:`体检`}</button>
							${t?`<button type="button" class="ys-btn soft xs" data-act="open-preview">🖼️ 抽查标注</button>`:``}
							${t?`<button type="button" class="ys-btn ghost xs" data-act="toggle-classes">${P?`收起类别 ▲`:`类别 (${u.length}) ▼`}</button>`:``}
							<button type="button" class="ys-btn ghost xs" data-act="go-res" data-tab="datasets">管理</button>
						</div>
					</div>
					<div class="ctx-row">
						<select class="ys-input" data-act="pick-ds">
							${!c.dataSources.length&&!d?`<option value="">暂无已配置数据集 — 点「✨ 智能探测」或「📂 选文件夹」…</option>`:`<option value="">选择已配置数据集…</option>`}
							${c.dataSources.map(e=>`<option value="${T(e.id)}" ${p?.id===e.id?`selected`:``}>${T(e.name)} · ${T(e.host)} (${T(e.path)})</option>`).join(``)}
							${!p&&d?`<option value="__custom__" selected>当前目录 · ${T(W.datasetHost)}:${T(W.datasetPath)}</option>`:``}
						</select>
					</div>
					<div class="ctx-meta">
						${t?`<span class="mini-tag ok">🖼️ ${t.totalImages} 图（${t.labeledImages} 已标）</span>
								   <span class="mini-tag">${E(t.totalBytes)}</span>
								   <span class="pill pill-task-${t.detectedTask===`mixed`||t.detectedTask===`unknown`?`hbb`:t.detectedTask}">${t.detectedTask.toUpperCase()}</span>
								   ${t.classNamesSource?`<span class="mini-tag" title="自动匹配的类名文件">📄 ${T(t.classNamesSource)}</span>`:``}
								   ${t.warnings.length?`<span class="mini-tag warn" title="${T(t.warnings.join(`；`))}">⚠️ ${t.warnings.length} 项提示</span>`:``}`:W.datasetHost&&W.datasetPath?`<span>点击右侧 <b>🔍 体检</b> 自动统计图片、识别任务并预览标注</span>`:`<span>点 <b>✨ 智能探测</b> 自动发现母文件夹里的最新项目与类名</span>`}
					</div>
					${c.projectRoot?.recommendations?.length?`<div class="ctx-rec-strip" aria-label="智能探测最新推荐">
									<span class="ctx-rec-lbl" title="来源：${T(c.projectRoot.host)} · ${T(c.projectRoot.path)}">🛰️ 推荐</span>
									${c.projectRoot.recommendations.slice(0,3).map((e,t)=>{let n=W.datasetHost===c.projectRoot.host&&W.datasetPath===e.path,r=Object.values(e.classNames||{}).slice(0,5).join(`, `),i=e.detectedTask===`mixed`||e.detectedTask===`unknown`?`hbb`:e.detectedTask,a=e.projectName===e.folderLabel?e.folderLabel:`${e.projectName}/${e.folderLabel}`;return`<button type="button" class="ctx-rec-chip ${n?`active`:``}" data-quick-rec="${t}" title="${T(e.relPath)} · ${e.labeledImages}/${e.totalImages} 图${r?` · 类别: ${r}`:``}${e.classNamesSource?` (${e.classNamesSource})`:``} · ${O(e.latestMtime)}">
												<span class="rc-task pill-task-${i}">${T(e.detectedTask)}</span>
												<span class="rc-name">${T(a)}</span>
												<small>${e.totalImages}图</small>
											</button>`}).join(``)}
									<button type="button" class="ys-btn ghost xs" data-act="open-radar">全部 (${c.projectRoot.totalDatasets??c.projectRoot.recommendations.length}) ›</button>
								</div>`:``}
				</div>

				<div class="ctx-slot">
					<div class="ctx-head">
						<span class="ctx-title">🖥️ 远程训练节点</span>
						<button type="button" class="ys-btn ghost xs" data-act="go-res" data-tab="nodes">⚙️ 管理节点</button>
					</div>
					<div class="ctx-row">
						<select class="ys-input" data-act="pick-profile">
							${c.profiles.length?c.profiles.map(t=>{if(t.runtime===`colab`)return`<option value="${T(t.id)}" ${t.id===(e?.id??``)?`selected`:``}>⚡ ${T(t.name)} · Colab 超速 (${T(t.colabGpu||`A100`)})</option>`;let n=t.probe?.gpus?.[0],r=t.runtime===`wsl`?`WSL ${t.wslDistro||``}`.trim():t.runtime;return`<option value="${T(t.id)}" ${t.id===(e?.id??``)?`selected`:``}>${T(t.name)} · ${T(r)}${n?` · ${T(n.name)}`:``}</option>`}).join(``):`<option value="">暂无已配置节点 — 点右侧「⚙️ 管理节点」添加…</option>`}
						</select>
					</div>
					<div class="ctx-meta">
						${e?.runtime===`colab`?`<div class="colab-inline-tiers" role="group" aria-label="选择 Colab 显卡档位">
										${re.map(e=>`<button type="button" class="colab-inline-chip ${W.colabGpu===e.gpu?`active`:``}" data-compose-colab-gpu="${e.gpu}" title="${e.vram} · ${e.cu} · ${e.desc}">${e.icon} ${e.gpu} ${e.name}</button>`).join(``)}
									</div>
									${z?.balance==null?``:`<span class="colab-cu-badge" title="当前 Google Colab 账号剩余 Compute Units">💎 ${z.balance.toFixed(1)} CU</span>`}
									<span class="mini-tag ok" title="${T(n.desc)}">🛡️ 训完自动归档并停机</span>`:e?`${m?`<span class="mini-tag gpu">🎮 ${T(m.name)} · ${(m.totalMemMB/1024).toFixed(0)}G</span>`:`<span class="mini-tag">未体检 GPU</span>`}
									   ${e.probe?.ultralyticsVersion?`<span class="mini-tag">ultralytics ${T(e.probe.ultralyticsVersion)}</span>`:``}
									   ${dt(e.probe?.storage)}
									   ${h.busy?`<span class="mini-tag busy">⏳ 忙碌：${h.running} 训${h.queued?` · ${h.queued} 排`:``}</span>`:`<span class="mini-tag ok">空闲</span>`}
									   <span class="mini-tag" title="${T(n.desc)}">${n.badge}</span>`:`<span>支持 Linux / Windows / WSL 及 ⚡ Google Colab 云端超速 GPU</span>`}
					</div>
				</div>

				${t&&P?`<div class="ctx-classes-panel">
								<div class="ds-classes-head">
									<span>点击标签可直接修改训练时写入 data.yaml 的类别名：</span>
									${t.warnings.length?`<span class="mini-tag warn">${T(t.warnings[0])}</span>`:``}
								</div>
								<div class="ds-classes">
									${u.map(([e,n])=>{let r=t.classCounts[e]??0;return`<label class="cls-pill" style="--cc:${f(Number(e))}">
												<i class="cls-dot"></i>
												<span class="cls-id">${e}</span>
												<input class="cls-edit" data-cls-id="${e}" value="${T(n)}" />
												<span class="cls-cnt">${r}</span>
											</label>`}).join(``)}
								</div>
							</div>`:``}
			</section>

			<!-- 主舞台：左 ① 模型架构与权重  ↔  右 ② 训练超参数（严格单排等高） -->
			<div class="ys-steps-grid">
				<!-- ① 模型架构与预训练权重 -->
				<section class="ys-card ys-step-card">
					<header class="ys-card-head">
						<span class="step-badge">1</span>
						<div>
							<h3>模型架构与预训练权重</h3>
							<p class="card-sub">${c.modelHub.path?`已关联权重库 ${T(c.modelHub.host)}:${T(c.modelHub.path)}`:`可在资源配置中指定已有 .pt 权重目录`}</p>
						</div>
						<button type="button" class="ys-btn ghost xs" data-act="go-res" data-tab="hub">📦 模型库 (${l.length})</button>
					</header>

					<div class="ys-step-body">
						<div class="ys-seg-row">
							<button type="button" class="ys-seg-btn ${W.family===`yolo26`?`active y26`:``}" data-family="yolo26">
								<b>YOLO26</b><span>✨ 端到端免 NMS · 新一代</span>
							</button>
							<button type="button" class="ys-seg-btn ${W.family===`yolo11`?`active y11`:``}" data-family="yolo11">
								<b>YOLO11</b><span>经典稳定 · 生态最全</span>
							</button>
						</div>
						${!o&&W.family===`yolo26`?`<div class="inline-warn">⚠️ 当前所选节点的 ultralytics 版本似乎不支持 YOLO26，建议切换虚拟环境或改选 YOLO11。</div>`:``}

						<div class="ys-label-sm"><span>任务类型</span></div>
						<div class="task-grid">
							${ne.map(e=>{let n=t&&t.detectedTask===e.id;return`<button type="button" class="task-pill ${W.task===e.id?`active t-${e.id}`:``}" data-task="${e.id}">
									<div class="tp-head"><b>${e.label}</b>${n?`<i class="rec-tag">推荐</i>`:``}</div>
									<span>${e.desc}</span>
								</button>`}).join(``)}
						</div>

						${W.task===`pose`?`<div class="pose-bar">
										<label>关键点数 K <input type="number" min="1" max="128" class="ys-input sm" data-bind="poseK" value="${W.poseKpts[0]}" /></label>
										<label>坐标维度
											<div class="chip-inline">
												<button type="button" class="opt-chip ${W.poseKpts[1]===3?`active`:``}" data-pose-dim="3">3 (x,y,vis)</button>
												<button type="button" class="opt-chip ${W.poseKpts[1]===2?`active`:``}" data-pose-dim="2">2 (x,y)</button>
											</div>
										</label>
										<label class="grow">flip_idx（可选，逗号分隔）<input class="ys-input sm mono" data-bind="flipIdxStr" value="${T(W.flipIdxStr)}" placeholder="如 0,2,1,4,3..." /></label>
									</div>`:``}

						<div class="ys-label-sm"><span>模型规模</span></div>
						<div class="tier-grid">
							${te.map(e=>{let t=gt(W.family,e.id,W.task);return`<button type="button" class="tier-card ${!W.customWeight&&W.tier===e.id?`active`:``}" data-tier="${e.id}">
									<div class="tc-top"><b>${e.id.toUpperCase()}</b><span>${e.name}</span></div>
									<div class="tc-desc">${e.desc}</div>
									<div class="tc-src ${t?`hit`:`cloud`}">${t?`📦 仓库已有`:`☁️ 自动拉取`}</div>
								</button>`}).join(``)}
						</div>

						${r.length?`<div class="custom-weights-box">
										<span class="ys-label-sm">或直接微调权重库中的自定义 .pt / .yaml：</span>
										<div class="ys-chip-row">
											${r.map(e=>`<button type="button" class="opt-chip ${W.customWeight?.path===e.path?`active`:``}" data-custom-weight="${T(e.path)}" data-cw-name="${T(e.name)}">🎯 ${T(e.name)} <small>${E(e.size)}</small></button>`).join(``)}
										</div>
									</div>`:``}
					</div>

					<div class="weight-summary ys-card-foot">
						当前选用：<code>${T(_&&W.finetuneParent&&v?`v${_.parentVersion} best.pt`:W.customWeight?W.customWeight.name:i)}</code>
						${_&&W.finetuneParent&&v?`<span class="pill pill-hub">🔥 复用 v${_.parentVersion} 训练权重微调（零传输）</span>`:W.customWeight?`<span class="pill pill-hub" title="${T(W.customWeight.host?`${W.customWeight.host}:${W.customWeight.path}`:W.customWeight.path)}">📦 ${T(W.customWeight.host||`远程`)} 自定义权重</span><button type="button" class="ys-btn ghost xs" data-act="clear-custom-weight" title="恢复官方默认权重">✕</button>`:a?`<span class="pill pill-hub">📦 命中模型库 · ${E(a.size)}</span>`:`<span class="pill pill-cloud">☁️ 训练机自动拉取</span>`}
						<button type="button" class="ys-btn soft xs fp-pick-weight" data-act="browse-custom-weight" title="浏览远程目录直接选择任意 .pt / .yaml 权重文件">📂 选权重文件</button>
					</div>
				</section>

				<!-- ② 训练超参数 -->
				<section class="ys-card ys-step-card">
					<header class="ys-card-head">
						<span class="step-badge">2</span>
						<div>
							<h3>训练超参数</h3>
							<p class="card-sub">基础项点选即可；进阶项留空不传参，100% 走 Ultralytics 官方默认</p>
						</div>
						<button type="button" class="ys-btn ${b?`soft`:`ghost`} xs" data-act="toggle-adv">
							${N?`收起进阶 ▲`:b?`进阶调参 (已改 ${b} 项) ▼`:`进阶调参 (官方默认) ▼`}
						</button>
					</header>

					<div class="ys-step-body">
						<div class="param-rows">
							<div class="param-row">
								<span class="pr-label">训练轮数</span>
								<div class="pr-chips">
									${[30,50,100,150,200,300].map(e=>`<button type="button" class="opt-chip ${W.epochs===e?`active`:``}" data-set="epochs" data-val="${e}">${e}</button>`).join(``)}
									<input type="number" min="1" max="5000" class="ys-mini-num" data-bind-num="epochs" value="${W.epochs}" title="自定义 Epochs" />
								</div>
							</div>

							<div class="param-row">
								<span class="pr-label">输入尺寸</span>
								<div class="pr-chips">
									${[320,512,640,800,960,1024,1280].map(e=>`<button type="button" class="opt-chip ${W.imgsz===e?`active`:``}" data-set="imgsz" data-val="${e}">${e}</button>`).join(``)}
									<input type="number" step="32" min="64" max="4096" class="ys-mini-num" data-bind-num="imgsz" value="${W.imgsz}" title="自定义尺寸（32 的倍数）" />
								</div>
							</div>

							<div class="param-row">
								<span class="pr-label">批次大小</span>
								<div class="pr-chips">
									${[[-1,`Auto`],[4,`4`],[8,`8`],[16,`16`],[32,`32`],[64,`64`]].map(([e,t])=>`<button type="button" class="opt-chip ${W.batch===Number(e)?`active`:``}" data-set="batch" data-val="${e}">${t}</button>`).join(``)}
									<input type="number" min="-1" max="512" class="ys-mini-num" data-bind-num="batch" value="${W.batch}" title="-1 为自动探测显存" />
								</div>
							</div>

							<div class="param-row">
								<span class="pr-label">优化器</span>
								<div class="pr-chips">
									${[`auto`,`MuSGD`,`AdamW`,`SGD`].map(e=>`<button type="button" class="opt-chip ${W.optimizer===e?`active`:``}" data-set-str="optimizer" data-val="${e}">${e}</button>`).join(``)}
								</div>
							</div>
							${W.family===`yolo26`&&W.optimizer===`auto`?`<div class="inline-tip">💡 YOLO26 在 <code>auto</code> 下若总步数 ≤ 10,000 会切回 AdamW 忽略 lr0；想稳定用 MuSGD 可直接点 <b>MuSGD</b>。</div>`:``}

							<div class="param-row">
								<span class="pr-label">数据划分</span>
								<div class="pr-chips">
									${[[.7,`70 / 30`],[.8,`80 / 20`],[.85,`85 / 15`],[.9,`90 / 10`]].map(([e,t])=>`<button type="button" class="opt-chip ${Math.abs(W.trainRatio-Number(e))<.001?`active`:``}" data-set="trainRatio" data-val="${e}">${t}</button>`).join(``)}
								</div>
							</div>

							<div class="param-row">
								<span class="pr-label">计算设备</span>
								<div class="pr-chips">
									${e?.probe?.gpus?.length?e.probe.gpus.map(e=>`<button type="button" class="opt-chip ${W.device===String(e.index)?`active`:``}" data-set-str="device" data-val="${e.index}">🎮 GPU ${e.index} (${T(e.name)})</button>`).join(``):`<button type="button" class="opt-chip ${W.device===``||W.device===`0`?`active`:``}" data-set-str="device" data-val="0">🎮 GPU 0</button>`}
									<button type="button" class="opt-chip ${W.device===`cpu`?`active`:``}" data-set-str="device" data-val="cpu">CPU</button>
								</div>
							</div>

							<div class="param-row">
								<span class="pr-label">Workers</span>
								<div class="pr-chips">
									${[0,2,4,8].map(e=>`<button type="button" class="opt-chip ${W.workers===e?`active`:``}" data-set="workers" data-val="${e}">${e}</button>`).join(``)}
									<span class="pr-hint">${e?.runtime===`windows`?`Windows 建议 0 或 2`:`Linux/WSL 建议 4 或 8`}</span>
								</div>
							</div>

							<div class="param-row">
								<span class="pr-label">训完导出</span>
								<div class="pr-chips">
									<button type="button" class="opt-chip ${W.exportFormat?``:`active`}" data-export="">不导出</button>
									<button type="button" class="opt-chip ${W.exportFormat===`onnx`&&!W.exportHalf?`active`:``}" data-export="onnx">ONNX FP32</button>
									<button type="button" class="opt-chip ${W.exportFormat===`onnx`&&W.exportHalf?`active`:``}" data-export="onnx-fp16">ONNX FP16</button>
								</div>
							</div>
						</div>

						${N?`<div class="adv-drawer">
										<div class="ds-classes-head">
											<span>以下全部为可选覆写项：<b>留空 = 不传参，完全使用当前 Ultralytics 官方默认</b></span>
											${b?`<button type="button" class="ys-btn ghost xs" data-act="reset-adv">↺ 恢复全部官方默认</button>`:``}
										</div>
										<div class="adv-grid">
											<label>初始学习率 lr0 <input type="number" step="0.001" class="ys-input sm" data-bind-opt-num="lr0" value="${W.lr0??``}" placeholder="默认 0.01" /></label>
											<label>早停 Patience <input type="number" min="0" class="ys-input sm" data-bind-opt-num="patience" value="${W.patience??``}" placeholder="默认 100" /></label>
											<label>随机种子 Seed <input type="number" class="ys-input sm" data-bind-opt-num="seed" value="${W.seed??``}" placeholder="默认 0" /></label>
											<label>Mosaic <input type="number" step="0.1" min="0" max="1" class="ys-input sm" data-bind-opt-num="mosaic" value="${W.mosaic??``}" placeholder="默认 1.0" /></label>
											<label>Close Mosaic <input type="number" min="0" class="ys-input sm" data-bind-opt-num="closeMosaic" value="${W.closeMosaic??``}" placeholder="默认 10" /></label>
											<label>Mixup <input type="number" step="0.05" min="0" max="1" class="ys-input sm" data-bind-opt-num="mixup" value="${W.mixup??``}" placeholder="默认 0.0" /></label>
											<label>旋转 Degrees <input type="number" step="5" min="0" max="180" class="ys-input sm" data-bind-opt-num="degrees" value="${W.degrees??``}" placeholder="默认 0.0" /></label>
											<label>水平翻转 FlipLR <input type="number" step="0.1" min="0" max="1" class="ys-input sm" data-bind-opt-num="fliplr" value="${W.fliplr??``}" placeholder="默认 0.5" /></label>
											<label>垂直翻转 FlipUD <input type="number" step="0.1" min="0" max="1" class="ys-input sm" data-bind-opt-num="flipud" value="${W.flipud??``}" placeholder="默认 0.0" /></label>
										</div>
										<div class="adv-toggles">
											<span class="ys-label-inline">AMP：</span>
											${[[``,`默认`],[`true`,`开`],[`false`,`关`]].map(([e,t])=>`<button type="button" class="opt-chip ${W.amp===e?`active`:``}" data-set-str="amp" data-val="${e}">${t}</button>`).join(``)}
											<span class="pr-sep">|</span>
											<span class="ys-label-inline">cos_lr：</span>
											${[[``,`默认`],[`true`,`开`],[`false`,`关`]].map(([e,t])=>`<button type="button" class="opt-chip ${W.cosLr===e?`active`:``}" data-set-str="cosLr" data-val="${e}">${t}</button>`).join(``)}
											${W.family===`yolo26`?`<span class="pr-sep">|</span>
													   <span class="ys-label-inline">end2end：</span>
													   ${[[``,`默认`],[`true`,`开`],[`false`,`关`]].map(([e,t])=>`<button type="button" class="opt-chip ${W.end2end===e?`active`:``}" data-set-str="end2end" data-val="${e}">${t}</button>`).join(``)}`:``}
											<span class="pr-sep">|</span>
											<span class="ys-label-inline">缓存：</span>
											${[[``,`默认(关)`],[`ram`,`RAM`],[`disk`,`Disk`]].map(([e,t])=>`<button type="button" class="opt-chip ${W.cache===e?`active`:``}" data-set-str="cache" data-val="${e}">${t}</button>`).join(``)}
										</div>
										<label class="ys-field">
											<span>额外 Ultralytics 透传参数（每行一个 key=value）</span>
											<textarea class="ys-input mono" rows="2" data-bind="extraParams" placeholder="留空不传，例如 weight_decay=0.0005">${T(W.extraParams)}</textarea>
										</label>
										<div class="inline-tip">📌 当前进阶覆写：<code>${T(x)}</code></div>
									</div>`:``}
					</div>
				</section>
			</div>

			<!-- 仿 macOS Dock 自动隐藏启动坞：平时完全收起只留底部极细隐形感应线，鼠标移到工作区下方平滑钻出（远离屏幕最底边，不触发系统 Dock） -->
			<div class="ys-dock-zone ${le?`pinned`:``} ${ce?`launching`:``}">
				<div class="ys-dock-sensor" aria-hidden="true">
					<span class="ys-dock-bar"></span>
				</div>
				<div class="ys-launch-dock">
					<div class="ld-left">
						<label class="ld-name-wrap">
							<span>任务名称</span>
							<input class="ys-input" data-bind="name" value="${T(W.name)}" placeholder="${T(s)}" />
						</label>
						<div class="ld-progress" hidden>
							<div class="ld-prog-text">准备中…</div>
							<div class="ld-prog-bar"><i></i></div>
						</div>
					</div>
					<div class="ld-right">
						${h.busy?`<div class="ld-queue-bar" title="同台设备默认按序排队接力，避免爆显存；也可以强制并行">
										<span class="ld-q-info">⏳ ${h.running} 训${h.queued?` · ${h.queued} 排`:``}</span>
										<div class="ld-q-seg" role="group" aria-label="执行方式">
											<button type="button" class="ld-q-opt ${W.queueMode===`parallel`?``:`active`}" data-queue-mode="queue">📋 排队接力</button>
											<button type="button" class="ld-q-opt ${W.queueMode===`parallel`?`active`:``}" data-queue-mode="parallel">⚡ 立即并行</button>
										</div>
									</div>`:``}
						<button type="button" class="ys-btn ghost xs dock-pin-btn ${le?`active`:``}" data-act="toggle-dock-pin" title="${le?`取消固定，鼠标离开后自动收起`:`固定展开启动栏`}">${le?`📌 已固定`:`📍 固定`}</button>
						<button type="button" class="ys-btn launch-btn ${g?`is-queue`:``}" data-act="start-run" ${ce?`disabled`:``}>
							${g?`📋 加入训练队列 (#${h.queued+1})${_?` · v${_.nextVersion}`:``}`:h.busy?`⚡ 立即并行启动${_?` v${_.nextVersion}`:``}`:_?`🚀 启动 v${_.nextVersion} 迭代训练`:`🚀 开始后台训练`}
						</button>
					</div>
				</div>
			</div>
		</div>`,xt(s)}function bt(e,t,n=!0){W.datasetHost=e,W.datasetPath=t,L.lastDataset={host:e,path:t},L.datasetHost=e,x.set(L);let r=F.get(`${e}::${t}`);r?(W.datasetScan=r,W.classNames={...r.classNames},(r.detectedTask===`hbb`||r.detectedTask===`obb`||r.detectedTask===`seg`||r.detectedTask===`pose`)&&(W.task=r.detectedTask),r.poseKpts&&(W.poseKpts=r.poseKpts),Q()):(W.datasetScan=null,Q(),n&&e&&t&&St())}function xt(e){K.querySelectorAll(`[data-preset]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.preset;W.preset=t,Object.assign(W,ie[t].patch),Q()})}),K.querySelector(`[data-act="pick-ds"]`)?.addEventListener(`change`,e=>{let t=e.target.value;if(!t||t===`__custom__`)return;let n=c.dataSources.find(e=>e.id===t);n&&bt(n.host,n.path,!0)}),K.querySelector(`[data-act="pick-profile"]`)?.addEventListener(`change`,e=>{let t=e.target.value;if(!t)return;W.profileId=t,L.lastProfileId=t,x.set(L);let n=_t();n&&rt(n),n?.runtime===`colab`&&!z&&it(!0),Q()}),K.querySelectorAll(`[data-compose-colab-gpu]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.composeColabGpu;W.colabGpu=t,Q()})}),K.querySelectorAll(`[data-bind]`).forEach(e=>{e.addEventListener(`change`,()=>{let t=e.dataset.bind;t===`poseK`?W.poseKpts=[Math.max(1,Number(e.value)||17),W.poseKpts[1]]:W[t]=e.value.trim()})}),K.querySelectorAll(`[data-bind-num]`).forEach(e=>{e.addEventListener(`change`,()=>{let t=e.dataset.bindNum,n=Number(e.value);Number.isFinite(n)&&(W[t]=n),W.preset=``,Q()})}),K.querySelectorAll(`[data-bind-opt-num]`).forEach(e=>{e.addEventListener(`change`,()=>{let t=e.dataset.bindOptNum,n=e.value.trim();if(n===``)W[t]=null;else{let e=Number(n);Number.isFinite(e)&&(W[t]=e)}W.preset=``,Q()})}),K.querySelector(`[data-act="reset-adv"]`)?.addEventListener(`click`,()=>{Object.assign(W,w),Q()}),K.querySelectorAll(`.cls-edit`).forEach(e=>{e.addEventListener(`change`,()=>{W.classNames[e.dataset.clsId]=e.value.trim()||`class_${e.dataset.clsId}`})}),K.querySelectorAll(`[data-family]`).forEach(e=>{e.addEventListener(`click`,()=>{W.family=e.dataset.family,W.customWeight=null,Q()})}),K.querySelectorAll(`[data-task]`).forEach(e=>{e.addEventListener(`click`,()=>{W.task=e.dataset.task,W.customWeight=null,Q()})}),K.querySelectorAll(`[data-tier]`).forEach(e=>{e.addEventListener(`click`,()=>{W.tier=e.dataset.tier,W.customWeight=null,Q()})}),K.querySelectorAll(`[data-custom-weight]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.customWeight;W.customWeight?.path===t?W.customWeight=null:W.customWeight={source:`hub`,name:e.dataset.cwName,host:c.modelHub.host,path:t},Q()})}),K.querySelector(`[data-act="clear-custom-weight"]`)?.addEventListener(`click`,()=>{W.customWeight=null,Q()}),K.querySelector(`[data-act="browse-custom-weight"]`)?.addEventListener(`click`,()=>{let e=W.customWeight?.host||c.modelHub.host||_t()?.host||ve();qt({title:`🎯 选择远程预训练权重文件 (.pt / .yaml)`,host:e,initialPath:W.customWeight?.path?i(W.customWeight.path):c.modelHub.path||L.lastPaths[e]||``,allowHostSwitch:!0,asDatasetHost:!1,mode:`file`,fileFilter:/\.(pt|pth|yaml|yml|onnx)$/i,onSelect:(e,t)=>{let n=t.replace(/[\\/]+$/,``).split(/[\\/]/).pop()||`custom.pt`;W.customWeight={source:`hub`,name:n,host:e,path:t},W.finetuneParent=!1,Y(`已选用权重文件「${n}」`,`ok`),Q()}})}),K.querySelectorAll(`[data-pose-dim]`).forEach(e=>{e.addEventListener(`click`,()=>{W.poseKpts=[W.poseKpts[0],Number(e.dataset.poseDim)],Q()})}),K.querySelectorAll(`[data-set]`).forEach(e=>{e.addEventListener(`click`,()=>{W[e.dataset.set]=Number(e.dataset.val),W.preset=``,Q()})}),K.querySelectorAll(`[data-set-str]`).forEach(e=>{e.addEventListener(`click`,()=>{W[e.dataset.setStr]=e.dataset.val,Q()})}),K.querySelectorAll(`[data-export]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.export;W.exportFormat=t?`onnx`:``,W.exportHalf=t===`onnx-fp16`,Q()})}),K.querySelector(`[data-act="toggle-adv"]`)?.addEventListener(`click`,()=>{N=!N,Q()}),K.querySelector(`[data-act="toggle-classes"]`)?.addEventListener(`click`,()=>{P=!P,Q()}),K.querySelectorAll(`[data-act="go-res"]`).forEach(e=>{e.addEventListener(`click`,()=>ct(e.dataset.tab||`datasets`))}),K.querySelectorAll(`[data-act="open-radar"]`).forEach(e=>{e.addEventListener(`click`,()=>Kt())}),K.querySelectorAll(`[data-quick-rec]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=c.projectRoot,n=t?.recommendations?.[Number(e.dataset.quickRec)];t&&n&&Gt(t.host,n)})}),K.querySelector(`[data-act="quick-pick-ds"]`)?.addEventListener(`click`,()=>{let e=W.datasetHost||ve();qt({title:`📂 快速选择数据集文件夹`,host:e,initialPath:(W.datasetPath?i(W.datasetPath):``)||L.lastPaths[e]||``,allowHostSwitch:!0,asDatasetHost:!0,onSelect:async(e,t)=>{let n=await be(e,t);Y(`已选中并记住数据集「${n.name}」`,`ok`),bt(n.host,n.path,!0)}})}),K.querySelector(`[data-act="scan-ds"]`)?.addEventListener(`click`,()=>St()),K.querySelector(`[data-act="open-preview"]`)?.addEventListener(`click`,async()=>{W.datasetScan&&!W.datasetScan.samples.length&&await St(),Jt()}),K.querySelector(`[data-act="cancel-iter"]`)?.addEventListener(`click`,()=>{W.iterateFrom=null,W.versionNote=``,W.finetuneParent=!1,Q()}),K.querySelectorAll(`[data-finetune]`).forEach(e=>{e.addEventListener(`click`,()=>{W.finetuneParent=e.dataset.finetune===`1`,Q()})}),K.querySelectorAll(`[data-queue-mode]`).forEach(e=>{e.addEventListener(`click`,()=>{W.queueMode=e.dataset.queueMode===`parallel`?`parallel`:`queue`,Q()})}),K.querySelector(`[data-act="toggle-dock-pin"]`)?.addEventListener(`click`,()=>{le=!le,Q()});let t=K.querySelector(`.ys-dock-zone`);if(t){let e=0,n=()=>{clearTimeout(e),t.classList.add(`open`)};t.querySelector(`.ys-dock-sensor`)?.addEventListener(`mouseenter`,n),t.querySelector(`.ys-launch-dock`)?.addEventListener(`mouseenter`,n),t.addEventListener(`mouseleave`,()=>{clearTimeout(e),e=window.setTimeout(()=>{!t.matches(`:hover`)&&!t.matches(`:focus-within`)&&!le&&!ce&&t.classList.remove(`open`)},280)})}K.querySelector(`[data-act="start-run"]`)?.addEventListener(`click`,()=>Ct(e))}async function St(){if(!W.datasetHost||!W.datasetPath)return Y(`请先选择数据集（点「📂 选文件夹」即可快速添加）`,`err`);X(`busy`,`正在高速体检数据集…`),Y(`正在扫描图片与 .txt 标签…`,`info`);try{let e=await o.scanDataset(W.datasetHost,W.datasetPath);F.set(`${W.datasetHost}::${e.path}`,e),F.set(`${W.datasetHost}::${W.datasetPath}`,e),W.datasetScan=e,W.datasetPath=e.path,W.classNames={...e.classNames},(e.detectedTask===`hbb`||e.detectedTask===`obb`||e.detectedTask===`seg`||e.detectedTask===`pose`)&&(W.task=e.detectedTask),e.poseKpts&&(W.poseKpts=e.poseKpts),await be(W.datasetHost,e.path,void 0,e),X(`happy`,`扫描完成！共 ${e.totalImages} 张图，识别为 ${e.detectedTask.toUpperCase()}`),Y(`体检完成并已记住：${e.totalImages} 张图 · ${Object.keys(e.classNames).length} 个类别`,`ok`),Q()}catch(e){X(`err`,`扫描失败啦`),Y(e instanceof Error?e.message:String(e),`err`)}}async function Ct(e){let t=_t();if(!t)return Y(`请先在「计算节点」里添加至少一台训练机`,`err`);if(!W.datasetHost||!W.datasetPath)return Y(`请先选择数据集主机与目录`,`err`);if(!W.datasetScan&&(await St(),!W.datasetScan)||ce)return;ce=!0;let n=K.querySelector(`.ld-progress`),r=K.querySelector(`.ld-prog-text`),i=K.querySelector(`.ld-prog-bar i`),a=K.querySelector(`[data-act="start-run"]`),s=K.querySelector(`.ys-dock-zone`);a&&(a.disabled=!0),n&&(n.hidden=!1),s&&s.classList.add(`launching`,`open`),X(`busy`,`准备同步并脱离启动训练…`);let l={epochs:W.epochs,imgsz:W.imgsz,batch:W.batch,workers:W.workers,...Fe()};W.optimizer&&W.optimizer!==`auto`&&(l.optimizer=W.optimizer),W.device&&(l.device=W.device);let u=k(W.family,W.tier,W.task),f=gt(W.family,W.tier,W.task),p=W.iterateFrom,m=!!(p?.parentBestPt&&t.host===p.parentHost&&t.runtime===p.parentRuntime&&(t.wslDistro||``)===(p.parentWslDistro||``)),h=p&&W.finetuneParent&&m&&p.parentBestPt?{source:`remote_run`,name:`v${p.parentVersion}_best.pt`,path:p.parentBestPt}:W.customWeight?{source:W.customWeight.source,name:W.customWeight.name,host:W.customWeight.host,path:W.customWeight.path}:f?{source:`hub`,name:f.name,host:c.modelHub.host,path:f.path}:{source:`official`,name:u},g=W.task===`pose`&&W.flipIdxStr.trim()?W.flipIdxStr.split(`,`).map(e=>Number(e.trim())).filter(e=>Number.isInteger(e)):null,_=(W.name||p?.seriesName||e).trim(),v={name:_,seriesId:p?.seriesId,seriesName:p?.seriesName||_,parentRunId:p?.parentRunId??null,versionNote:W.versionNote.trim()||void 0,profileId:t.id,datasetHost:W.datasetHost,datasetPath:W.datasetPath,datasetLayout:W.datasetScan?.layout??`flat`,overrideSplit:W.overrideSplit,trainRatio:W.trainRatio,seed:W.seed??42,family:W.family,task:W.task,modelLabel:h.name,weight:h,classNames:W.classNames,kptShape:W.task===`pose`?W.poseKpts:null,flipIdx:g,params:l,exportFormat:W.exportFormat,exportHalf:W.exportHalf,queueMode:W.queueMode,colabGpu:t.runtime===`colab`?W.colabGpu:void 0};try{let e=``,t=await o.startRun(v,t=>{if(t.stage===`started`&&t.message&&(e=t.message),r&&t.message&&(r.textContent=t.message),i){let e=t.bytesTotal&&t.bytesTotal>0?Math.min(95,Math.round((t.bytesDone??0)/t.bytesTotal*80)+10):t.stage===`checking`?12:t.stage===`syncing_weights`?30:t.stage===`syncing_dataset`?60:t.stage===`writing_job`?85:t.stage===`launching`?94:100;i.style.width=`${e}%`}});d=[t,...d.filter(e=>e.runId!==t.runId)],at();let n=t.status===`queued`;Y(e||(n?`已加入训练队列（第 #${t.queuePosition??1} 位），前序任务完成后将自动接力训练 ✨`:`训练已在远程后台启动！现在关闭网页或 Mac 也不会中断 ✨`),`ok`),X(`happy`,n?`已入队排在第 #${t.queuePosition??1} 位，训完自动接力 📋`:`已经脱离 Mac 在后台开训啦 🚀`),W.queueMode=`queue`,W.iterateFrom=null,W.versionNote=``,W.finetuneParent=!1,ce=!1,Mt(t.runId)}catch(e){ce=!1,a&&(a.disabled=!1),s&&s.classList.remove(`launching`);let t=e instanceof Error?e.message:String(e);r&&(r.textContent=`❌ 启动失败：${t}`),i&&(i.style.width=`0%`),X(`err`,`启动遇到点小问题`),Y(t,`err`)}}function wt(e){return e===`queued`?`queued`:A(e).active?`active`:`ended:${e}`}function Tt(e){if(!e||!e.epochs.length)return`empty`;let t=e.epochs.length;return`${t}:${e.epochs[t-1]}:${e.series[`metrics/mAP50(B)`]?.[t-1]??e.series[`metrics/mAP50(M)`]?.[t-1]??``}:${e.series[`train/box_loss`]?.[t-1]??``}`}function Et(e){return e?`${e.weights.map(e=>`${e.name}:${e.size}:${e.mtime}`).join(`|`)}##${e.images.map(e=>`${e.name}:${e.size}:${e.mtime}`).join(`|`)}`:`none`}function Dt(e){if(!e)return[null,null];let t=null,n=null;for(let r=e.length-1;r>=0;r--){let i=e[r];if(typeof i==`number`&&Number.isFinite(i)){if(t===null)t=i;else{n=i;break}}}return[t,n]}function Ot(e,t){let n=e?.curves?.series;if(n){for(let e of t)if(n[e]){let t=Dt(n[e]);if(t[0]!==null)return t}}let r=e?.state?.metrics??{};for(let e of t){let t=r[e];if(typeof t==`number`&&Number.isFinite(t))return[t,null]}return[null,null]}function kt(e,t){for(let n of t)if(e[n]?.length)return e[n];return null}function At(e,t){let n=e?.curves;if(!n?.epochs?.length)return null;let r=n.series,i=kt(r,[`metrics/mAP50(B)`,`metrics/mAP50(M)`,`metrics/mAP50(P)`]),a=kt(r,[`metrics/mAP50-95(B)`,`metrics/mAP50-95(M)`,`metrics/mAP50-95(P)`]),o=kt(r,[`metrics/precision(B)`,`metrics/precision(M)`,`metrics/precision(P)`]),s=kt(r,[`metrics/recall(B)`,`metrics/recall(M)`,`metrics/recall(P)`]),c=n.epochs.length,l=-1,u=-1,d=null,f=null,p=null,m=null,h=(e,t)=>{let n=e?.[t];return typeof n==`number`&&Number.isFinite(n)?n:null};for(let e=0;e<c;e++){let t=h(i,e),n=h(a,e),r=h(o,e),c=h(s,e);if(t!=null&&(d==null||t>d)&&(d=t),n!=null&&(f==null||n>f)&&(f=n),r!=null&&(p==null||r>p)&&(p=r),c!=null&&(m==null||c>m)&&(m=c),t!=null||n!=null){let r=.1*(t??0)+.9*(n??0);r>=u&&(u=r,l=e)}}if(l<0)return null;let g=n.epochs[l],_=t>0?Math.min(g,t):g,v=h(o,l),y=h(s,l),b=v!=null&&y!=null&&v+y>0?2*v*y/(v+y):null;return{epoch:_,m50:h(i,l),m5095:h(a,l),prec:v,rec:y,f1:b,peakM50:d,peakM5095:f,peakPrec:p,peakRec:m}}function jt(e,t){let[n,r]=Ot(t,[`metrics/mAP50(B)`,`metrics/mAP50(M)`,`metrics/mAP50(P)`]),[i,a]=Ot(t,[`metrics/mAP50-95(B)`,`metrics/mAP50-95(M)`,`metrics/mAP50-95(P)`]),[o]=Ot(t,[`metrics/precision(B)`,`metrics/precision(M)`,`metrics/precision(P)`]),[s]=Ot(t,[`metrics/recall(B)`,`metrics/recall(M)`,`metrics/recall(P)`]),[c]=Ot(t,[`train/box_loss`]),[l]=Ot(t,[`train/cls_loss`]),[u]=Ot(t,[`train/dfl_loss`]),[d]=Ot(t,[`lr/pg0`]),f=At(t,e.totalEpochs),p=e.totalEpochs>0?Math.min(Math.max(0,e.epoch),e.totalEpochs):Math.max(0,e.epoch),m=o!=null&&s!=null&&o+s>0?2*o*s/(o+s):null,h=e=>e==null?`—`:`${(e*100).toFixed(2)}%`,g=e=>e==null?`—`:`${(e*100).toFixed(1)}%`,_=(e,t)=>{if(e==null||t==null)return``;let n=(e-t)*100;return Math.abs(n)<.01?``:`<em class="hud-delta ${n>0?`up`:`dn`}">${n>0?`▲`:`▼`}${Math.abs(n).toFixed(2)}%</em>`},v=f?.m50??e.bestMap50??n,y=f?.peakM50??e.bestMap50??v,b=f?.m5095??e.bestMap5095??i,x=f?.peakM5095??e.bestMap5095??b,S=n??v,ee=i??b,C=f?`<em>E${f.epoch}</em>`:``,te=f&&(f.prec!=null||f.rec!=null)?`<div class="hud-best-pill gold" title="best.pt（第 E${f.epoch} 轮）详细精度 · 单项历史峰值 P ${g(f.peakPrec)} / R ${g(f.peakRec)}">
						<i>🏆</i><span>best.pt</span><b>P ${g(f.prec)} · R ${g(f.rec)}</b>${f.f1==null?``:`<em>F1 ${g(f.f1)}</em>`}
					</div>`:`<span class="hud-sub">${p>0?`第 ${p} 轮验证`:`等待首轮验证`}</span>`;return`
			<div class="hud-tile hl-pink">
				<div class="hud-head"><span>实时 mAP50</span>${_(n,r)}</div>
				<b class="hud-val">${h(S)}</b>
				<div class="hud-best-pill pink" title="best.pt 对应 mAP50：${h(v)} · 全程单指标最高：${h(y)}">
					<i>🏆</i><span>最高</span><b>${h(y)}</b>${C}
				</div>
			</div>
			<div class="hud-tile hl-cyan">
				<div class="hud-head"><span>实时 mAP50-95</span>${_(i,a)}</div>
				<b class="hud-val">${h(ee)}</b>
				<div class="hud-best-pill cyan" title="Ultralytics 按 0.1×mAP50 + 0.9×mAP50-95 综合选出 best.pt（E${f?.epoch??`—`}：${h(b)}）">
					<i>🏆</i><span>最高</span><b>${h(x)}</b>${C}
				</div>
			</div>
			<div class="hud-tile hl-gold">
				<div class="hud-head"><span>Precision / Recall</span>${m==null?``:`<em class="hud-f1">F1 ${(m*100).toFixed(1)}%</em>`}</div>
				<div class="hud-pair">
					<span>P <b>${g(o)}</b></span>
					<span>R <b>${g(s)}</b></span>
				</div>
				${te}
			</div>
			<div class="hud-tile">
				<div class="hud-head"><span>Train Loss</span>${d==null?``:`<em class="hud-lr">lr ${d.toExponential(1)}</em>`}</div>
				<div class="hud-loss-row">
					<span>Box <b>${c==null?`—`:c.toFixed(3)}</b></span>
					<span>Cls <b>${l==null?`—`:l.toFixed(3)}</b></span>
					<span>DFL <b>${u==null?`—`:u.toFixed(3)}</b></span>
				</div>
				<span class="hud-sub">${f?`🏆 best.pt @ <b>E${f.epoch}</b> · `:``}开始 ${D(e.startedAt??e.createdAt)}</span>
			</div>
		`}async function Mt(e){et(),y=e;let t=I.get(e);b=t?.detail??null,B=null,Oe=he.get(e)??``,p=`run`,ke=null,je=``,Me=``,st(),Z(),Rt();let n=d.find(t=>t.runId===e)??b?.summary,r=!n||A(n.status).active,i=t?Date.now()-t.fetchedAt:1/0;(!t||r&&i>3500)&&await Nt(!t);let a=d.find(t=>t.runId===e)??b?.summary;if(a&&y===e&&p===`run`){if(A(a.status).active)a.runtime===`colab`?Ft():Ce=o.stats(a.host,e=>{e.type===`stats`&&(B=e,Ft())}),Se=o.followLog(e,t=>{t&&(Oe+=t,Oe.length>26e4&&(Oe=Oe.slice(-2e5)),he.set(e,Oe),p===`run`&&j===`log`&&It())},()=>{}),we=window.setInterval(()=>{p===`run`&&y===e&&(A(b?.summary.status??a.status).active?Nt(!1):et())},5e3);else if(!Oe){let t=o.followLog(e,n=>{n&&(Oe=n,he.set(e,Oe),p===`run`&&j===`log`&&It()),t.close()},()=>t.close())}}}async function Nt(e){if(!y||!e&&Ne)return;let t=y,n=b?.summary.status??d.find(e=>e.runId===t)?.status;Ne=!0;try{let e=await o.getRun(t);if(!e?.summary?.runId||(I.set(t,{detail:e,fetchedAt:Date.now()}),R(),y!==t))return;if(b=e,d=d.map(t=>t.runId===e.summary.runId?e.summary:t),n&&n!==e.summary.status&&o.listRuns(!1).then(e=>{d=e,Z()}).catch(()=>{}),Z(),p===`run`){let n=wt(e.summary.status);ke===t&&Ae===n&&K.querySelector(`.ys-monitor`)?Pt(e):Rt()}X(A(e.summary.status).active?`busy`:e.summary.status===`done`?`happy`:`idle`)}catch(t){e&&Y(t instanceof Error?t.message:String(t),`err`)}finally{Ne=!1}}function Pt(e){let t=e.summary,n=A(t.status),r=t.totalEpochs>0?Math.min(Math.max(0,t.epoch),t.totalEpochs):Math.max(0,t.epoch),i=t.totalEpochs>0?Math.min(100,Math.round(r/t.totalEpochs*100)):0,a=K.querySelector(`.rm-prog-fill`),o=K.querySelector(`.rm-ep-txt`);a&&(a.style.width=`${i}%`),o&&(o.textContent=`Epoch ${r} / ${t.totalEpochs} (${i}%)${n.active?` · ETA ${ae(t.etaSec)}`:``}`);let s=K.querySelector(`.rm-metrics-hud`);s&&(s.innerHTML=jt(t,e)),t.runtime===`colab`&&Ft();let c=K.querySelector(`[data-rtab="artifacts"]`);c&&e.artifacts&&(c.textContent=`🖼️ 产物 & 权重 (${e.artifacts.weights.length+e.artifacts.images.length})`);let l=K.querySelector(`.rm-body`);if(l){if(j===`curves`){let t=Tt(e.curves);t!==je&&(je=t,zt(l))}else if(j===`artifacts`){let n=Et(e.artifacts);n!==Me&&(Me=n,Vt(l,t.runId))}}}function Ft(){let e=K.querySelector(`.ys-telemetry`);if(!e)return;let t=b?.summary??d.find(e=>e.runId===y);if(t?.runtime===`colab`){let n=b?.colabGpu;if(!A(t.status).active){e.innerHTML=`<div class="tel-chip gpu"><span>⚡ Google Colab · ${T(t.colabGpuName||t.colabGpu||`GPU`)}</span><b>${t.colabArchived?`📦 已拉回 Mac 本地归档`:`已结束`}</b><span class="tc-sub">🛡️ 云端 VM 已释放，停止计费</span></div>`;return}e.innerHTML=n?`<div class="tel-chip gpu">
						<span class="tc-k">⚡ Colab · ${T(n.name||t.colabGpu||`GPU`)}</span>
						${n.util==null?``:`<b>${Math.round(n.util)}%</b>`}
						<span class="tc-sub">${n.memUsed!=null&&n.memTotal!=null?`${(n.memUsed/1024).toFixed(1)}/${(n.memTotal/1024).toFixed(1)} GB`:n.memTotal==null?``:`${(n.memTotal/1024).toFixed(0)} GB`}</span>
						${n.temp==null?``:`<span class="tc-temp ${n.temp>80?`hot`:``}">${Math.round(n.temp)}°C</span>`}
						${n.power==null?``:`<span class="tc-sub">${Math.round(n.power)}W</span>`}
					</div>
					<div class="tel-chip"><span>🛡️ 训完自动拉回 Mac 本地并立刻停机释放 VM</span></div>`:`<div class="tel-chip"><span>⚡ 正在同步 Colab (${T(t.colabGpu||`GPU`)}) 显卡遥测…</span></div>`;return}if(!B){t&&!A(t.status).active&&(e.innerHTML=`<div class="tel-chip"><span>☁️ 已结束 · 未占用远端监控连接</span></div>`);return}let n=B.gpus?.[0],r=B.mem.total?Math.round(B.mem.used/B.mem.total*100):0;e.innerHTML=`
			${n?`<div class="tel-chip gpu">
							<span class="tc-k">🎮 ${T(n.name)}</span>
							<b>${n.util??0}%</b>
							<span class="tc-sub">${n.memUsed!=null&&n.memTotal!=null?`${(n.memUsed/1024).toFixed(1)}/${(n.memTotal/1024).toFixed(1)} GB`:``}</span>
							${n.temp==null?``:`<span class="tc-temp ${n.temp>80?`hot`:``}">${n.temp}°C</span>`}
							${n.power==null?``:`<span class="tc-sub">${Math.round(n.power)}W</span>`}
						</div>`:`<div class="tel-chip"><span>未检测到 NVIDIA GPU</span></div>`}
			<div class="tel-chip">
				<span class="tc-k">CPU</span>
				<b>${B.cpu==null?`—`:`${Math.round(B.cpu)}%`}</b>
				${B.cpuTemp==null?``:`<span class="tc-sub">${Math.round(B.cpuTemp)}°C</span>`}
			</div>
			<div class="tel-chip">
				<span class="tc-k">内存</span>
				<b>${r}%</b>
				<span class="tc-sub">${(B.mem.used/1024**3).toFixed(1)}/${(B.mem.total/1024**3).toFixed(0)}G</span>
			</div>
		`}function It(){let e=K.querySelector(`.ys-log-pre`);if(!e)return;let t=e.scrollHeight-e.scrollTop-e.clientHeight<60;e.textContent=se(Oe)||`等待日志输出…`,t&&(e.scrollTop=e.scrollHeight)}function Lt(){let e=K.querySelector(`.rm-body`),t=b?.summary??d.find(e=>e.runId===y);e&&t&&(j===`curves`?(je=Tt(b?.curves),zt(e)):j===`log`?Bt(e):j===`artifacts`?(Me=Et(b?.artifacts),Vt(e,t.runId)):Ht(e))}function Rt(){let e=b?.summary??d.find(e=>e.runId===y);if(!e){K.innerHTML=`<div class="ys-card"><p>请选择左侧的一个训练任务。</p></div>`;return}ke=e.runId,Ae=wt(e.status);let t=A(e.status),n=e.status===`queued`,r=e.totalEpochs>0?Math.min(Math.max(0,e.epoch),e.totalEpochs):Math.max(0,e.epoch),i=e.totalEpochs>0?Math.min(100,Math.round(r/e.totalEpochs*100)):0,a=!!b?.artifacts?.weights?.some(e=>e.name===`last.pt`),s=e.family===`yolo26`?`pill-y26`:`pill-y11`,c=n&&e.queuePosition?`${t.label} #${e.queuePosition}`:t.label,l=ut(e),u=e.version??1,f=Math.max(u,...l.map(e=>e.version??1))+1,p=e.datasetStats;K.innerHTML=`
		<div class="ys-monitor">
			<section class="ys-card rm-hero">
				<div class="rm-top">
					<div>
						<div class="rm-title-row">
							<span class="ver-tag lg">v${u}</span>
							<h2>${T(e.name||e.seriesName)}</h2>
							<button type="button" class="rm-rename-btn" data-run-act="rename" title="重命名此训练任务">✏️</button>
							<span class="st-pill ${t.cls}"><i class="st-dot"></i>${c}${e.stopRequested?` · 正在收尾`:``}</span>
						</div>
						<div class="rm-tags">
							<span class="pill ${s}">${e.family.toUpperCase()}</span>
							<span class="pill pill-task-${e.task}">${e.task.toUpperCase()}</span>
							<span class="pill pill-model">📦 ${T(e.model)}</span>
							<span class="pill ${e.runtime===`colab`?`pill-colab`:`pill-node`}">${e.runtime===`colab`?`⚡ ${T(e.profileName||`Colab · ${e.colabGpu||`GPU`}`)}`:`🖥️ ${T(e.profileName||e.host)}`}</span>
							<span class="pill">📁 ${T(e.datasetHost)}:${T(e.datasetPath)}</span>
							${e.splitStats?`<span class="pill" title="按类别分层随机划分（seed=${e.splitStats.seed}，比例 ${Math.round(e.splitStats.ratio*100)}/${Math.round((1-e.splitStats.ratio)*100)}）">🎲 分层 ${e.splitStats.train}训/${e.splitStats.val}验</span>`:``}
							${e.runtime===`colab`&&e.colabArchived?`<span class="pill pill-hub" title="${T(e.runDir)}">📦 已归档 Mac 本地</span>`:p?`<span class="pill pill-hub" title="同一数据集共用远程缓存目录，仅同步变更文件，不会重复占盘">${p.mode===`direct`?`⚡ 同机零拷贝`:p.mode===`colab_upload`?`☁️ Colab 直传 ${p.totalFiles} 文件`:p.reusedCache?`♻️ 复用缓存 · 增量 ${p.copied} / 跳过 ${p.skipped}`:`📦 已缓存 ${p.totalFiles} 文件`}</span>`:``}
						</div>
						${e.versionNote?`<div class="rm-ver-note">📝 v${u} 备注：${T(e.versionNote)}</div>`:``}
					</div>
					<div class="rm-actions">
						<button type="button" class="ys-btn primary sm" data-run-act="iterate" title="继承当前全部配置并增量更新数据集，创建 v${f} 新版本（历史版本完整归档）">✨ 迭代 v${f}</button>
						${n?`${(e.queuePosition??1)>1?`<button type="button" class="ys-btn soft sm" data-run-act="prioritize">⬆️ 置顶优先</button>`:``}
								   <button type="button" class="ys-btn warn sm" data-run-act="cancel-queue">✕ 取消排队</button>
								   <button type="button" class="ys-btn ghost sm" data-run-act="delete">🗑️ 删除</button>`:t.active?`<button type="button" class="ys-btn soft sm" data-run-act="queue-another" title="保持当前训练不变，新建下一个任务排在它后面">➕ 排下一个</button>
									   <button type="button" class="ys-btn warn sm" data-run-act="stop" ${e.stopRequested?`disabled`:``}>⏹ 优雅停止</button>
									   <button type="button" class="ys-btn danger sm" data-run-act="kill">⚡ 强杀</button>`:`${a&&e.status!==`done`?`<button type="button" class="ys-btn soft sm" data-run-act="resume">▶️ 续训</button>`:``}
									   <button type="button" class="ys-btn soft sm" data-run-act="clone">📋 复用配置</button>
									   <button type="button" class="ys-btn ghost sm" data-run-act="delete">🗑️ 删除</button>`}
						<button type="button" class="ys-btn soft sm" data-run-act="refresh" title="强制从远程拉取最新状态与曲线">↻</button>
					</div>
				</div>

				${l.length>1?`<div class="rm-ver-bar">
								<span class="rm-vb-label">🗂️ 历史归档（${l.length} 版）</span>
								<div class="rm-vb-list">
									${l.map(t=>{let n=A(t.status);return`<button type="button" class="rm-vb-pill ${t.runId===e.runId?`active`:``}" data-switch-ver="${T(t.runId)}" title="${T(t.versionNote||D(t.createdAt))}">
												<i class="vdot ${n.cls}"></i>
												<b>v${t.version??1}</b>
												<span>${t.bestMap50==null?n.label:`${(t.bestMap50*100).toFixed(1)}%`}</span>
											</button>`}).join(``)}
								</div>
							</div>`:``}

				${n?`<div class="rm-queue-banner">
								<span>🕒 <b>正在队列中等待（第 #${e.queuePosition??1} 位）</b> · 该节点当前任务结束后会在远程自动接力启动，关闭网页或 Mac 都不影响；整条队列跑完后自动退出，不留后台进程。</span>
							</div>`:`<div class="rm-progress-row">
								<div class="rm-prog-bar"><i class="rm-prog-fill" style="width:${i}%"></i></div>
								<span class="rm-ep-txt">Epoch ${r} / ${e.totalEpochs} (${i}%)${t.active?` · ETA ${ae(e.etaSec)}`:``}</span>
							</div>`}

				<!-- 实时关键指标 HUD（mAP50 / mAP50-95 / Precision & Recall / Loss / LR） -->
				<div class="rm-metrics-hud">${jt(e,b)}</div>

				<div class="rm-telemetry-row">
					<div class="ys-telemetry"><div class="tel-chip">${t.active?`正在读取 ${T(e.host)} 显卡状态…`:`☁️ 已结束 · 未占用远端监控连接`}</div></div>
				</div>
				${e.error?`<div class="rm-err">⚠️ ${T(e.error)}</div>`:``}
			</section>

			<div class="rm-tabs-bar">
				<div class="rm-tabs">
					<button type="button" class="rm-tab ${j===`curves`?`active`:``}" data-rtab="curves">📈 训练曲线</button>
					<button type="button" class="rm-tab ${j===`log`?`active`:``}" data-rtab="log">📜 实时日志</button>
					<button type="button" class="rm-tab ${j===`artifacts`?`active`:``}" data-rtab="artifacts">🖼️ 产物 & 权重 ${b?.artifacts?`(${b.artifacts.weights.length+b.artifacts.images.length})`:``}</button>
					<button type="button" class="rm-tab ${j===`config`?`active`:``}" data-rtab="config">⚙️ 配置详情</button>
				</div>
				<span class="rm-detach-note">💾 已启用本机缓存 · 切页零重拉（点 ↻ 可手动强刷）</span>
			</div>

			<div class="rm-body"></div>
		</div>`,Ft(),K.querySelectorAll(`[data-rtab]`).forEach(e=>{e.addEventListener(`click`,()=>{j=e.dataset.rtab,K.querySelectorAll(`[data-rtab]`).forEach(e=>{e.classList.toggle(`active`,e.dataset.rtab===j)}),Lt()})}),K.querySelectorAll(`[data-switch-ver]`).forEach(t=>{t.addEventListener(`click`,()=>{t.dataset.switchVer&&t.dataset.switchVer!==e.runId&&Mt(t.dataset.switchVer)})}),K.querySelector(`[data-run-act="rename"]`)?.addEventListener(`click`,()=>{let t=K.querySelector(`.rm-title-row`),n=t?.querySelector(`h2`),r=t?.querySelector(`[data-run-act="rename"]`);if(!t||!n)return;let i=e.name||e.seriesName||e.runId,a=document.createElement(`form`);a.className=`rm-rename-form`,a.innerHTML=`<input class="ys-input rm-rename-input" value="${T(i)}" maxlength="80" /><button type="submit" class="ys-btn primary xs">✓</button><button type="button" class="ys-btn ghost xs">✕</button>`;let o=a.querySelector(`input`),s=a.querySelector(`button[type="button"]`),c=()=>{a.replaceWith(n),r&&(r.hidden=!1)};a.addEventListener(`submit`,async t=>{t.preventDefault();let r=o.value.trim();if(!r||r===i)return c();n.textContent=r,c(),await ot(e.runId,r)}),s.addEventListener(`click`,c),o.addEventListener(`keydown`,e=>{e.key===`Escape`&&c()}),n.replaceWith(a),r&&(r.hidden=!0),o.focus(),o.select()}),K.querySelector(`[data-run-act="iterate"]`)?.addEventListener(`click`,()=>{let t=b?.job??{},n=t.params??{},r=e.runtime===`windows`?`\\`:`/`,i=b?.artifacts?.weights?.some(e=>e.name===`best.pt`)?`${e.runDir.replace(/[\\/]+$/,``)}${r}output${r}weights${r}best.pt`:null;W.datasetHost=e.datasetHost,W.datasetPath=e.datasetPath,W.datasetScan=null,W.profileId=e.profileId||W.profileId,W.family=e.family,W.task=e.task;let a=e.model.match(/^yolo(?:11|26)([nsmlx])(?:-(?:obb|seg|pose))?\.pt$/i);a&&(W.tier=a[1].toLowerCase(),W.customWeight=null),t.classNames&&typeof t.classNames==`object`&&(W.classNames={...t.classNames}),typeof n.epochs==`number`&&(W.epochs=n.epochs),typeof n.imgsz==`number`&&(W.imgsz=n.imgsz),typeof n.batch==`number`&&(W.batch=n.batch),typeof n.workers==`number`&&(W.workers=n.workers),typeof n.optimizer==`string`?W.optimizer=n.optimizer:W.optimizer=`auto`,typeof n.device==`string`&&(W.device=n.device),typeof t.trainRatio==`number`&&(W.trainRatio=t.trainRatio),W.exportFormat=t.exportFormat===`onnx`?`onnx`:``,W.exportHalf=!!t.exportHalf,Object.assign(W,w),typeof n.lr0==`number`&&(W.lr0=n.lr0),typeof n.patience==`number`&&(W.patience=n.patience),typeof n.seed==`number`&&(W.seed=n.seed),typeof n.mosaic==`number`&&(W.mosaic=n.mosaic),typeof n.close_mosaic==`number`&&(W.closeMosaic=n.close_mosaic),typeof n.mixup==`number`&&(W.mixup=n.mixup),typeof n.degrees==`number`&&(W.degrees=n.degrees),typeof n.fliplr==`number`&&(W.fliplr=n.fliplr),typeof n.flipud==`number`&&(W.flipud=n.flipud),typeof n.amp==`boolean`&&(W.amp=n.amp?`true`:`false`),typeof n.cos_lr==`boolean`&&(W.cosLr=n.cos_lr?`true`:`false`),typeof n.end2end==`boolean`&&(W.end2end=n.end2end?`true`:`false`),(n.cache===`ram`||n.cache===`disk`)&&(W.cache=n.cache);let o=e.seriesName||e.name;W.name=o,W.versionNote=``,W.finetuneParent=!1,W.queueMode=`queue`,W.iterateFrom={seriesId:lt(e),seriesName:o,nextVersion:f,parentRunId:e.runId,parentVersion:u,parentHost:e.host,parentRuntime:e.runtime,parentWslDistro:e.wslDistro||``,parentBestPt:i,parentModel:e.model},mt(`compose`),Y(`已进入「${o}」v${f} 迭代模式！正在重新扫描数据集以检测新增/修改文件…`,`ok`),St()}),K.querySelector(`[data-run-act="refresh"]`)?.addEventListener(`click`,()=>{je=``,Me=``,Nt(!0)}),K.querySelector(`[data-run-act="queue-another"]`)?.addEventListener(`click`,()=>{e.profileId&&(W.profileId=e.profileId),W.queueMode=`queue`,W.name=``,mt(`compose`),Y(`已切回新建页面，配置好点「加入训练队列」即可接力开跑 ✨`,`info`)}),K.querySelector(`[data-run-act="prioritize"]`)?.addEventListener(`click`,async()=>{try{await o.prioritizeRun(e.runId),d=await o.listRuns(!1),Y(`已置顶为下一顺位优先训练 ⬆️`,`ok`),await Nt(!0)}catch(e){Y(e instanceof Error?e.message:String(e),`err`)}}),K.querySelector(`[data-run-act="cancel-queue"]`)?.addEventListener(`click`,async()=>{try{await o.stopRun(e.runId,!1),d=await o.listRuns(!1),Y(`已取消排队，不会影响当前正在运行的训练`,`info`),await Nt(!0)}catch(e){Y(e instanceof Error?e.message:String(e),`err`)}}),K.querySelector(`[data-run-act="stop"]`)?.addEventListener(`click`,async()=>{await o.stopRun(e.runId,!1),Y(`已发送优雅停止信号（STOP），当前轮结束并保存权重后退出`,`ok`),Nt(!0)}),K.querySelector(`[data-run-act="kill"]`)?.addEventListener(`click`,async()=>{confirm(`确认强制终止该训练进程？当前 epoch 未保存进度将丢失。`)&&(await o.stopRun(e.runId,!0),Y(`已强制终止训练进程`,`info`),Nt(!0))}),K.querySelector(`[data-run-act="resume"]`)?.addEventListener(`click`,async()=>{try{Y(`正在从 last.pt 恢复后台训练…`,`info`);let t=await o.resumeRun(e.runId);b=t,d=d.map(n=>n.runId===e.runId?t.summary:n),Y(`已重新拉起断点续训！`,`ok`),Mt(e.runId)}catch(e){Y(e instanceof Error?e.message:String(e),`err`)}}),K.querySelector(`[data-run-act="clone"]`)?.addEventListener(`click`,()=>{let t=b?.job?.params||{};W.datasetHost=e.datasetHost,W.datasetPath=e.datasetPath,W.datasetScan=null,W.profileId=e.profileId||W.profileId,W.family=e.family,W.task=e.task,typeof t.epochs==`number`&&(W.epochs=t.epochs),typeof t.imgsz==`number`&&(W.imgsz=t.imgsz),typeof t.batch==`number`&&(W.batch=t.batch),typeof t.optimizer==`string`&&(W.optimizer=t.optimizer),W.name=``,mt(`compose`),Y(`已载入该任务配置，可直接微调后重训`,`ok`)}),K.querySelector(`[data-run-act="delete"]`)?.addEventListener(`click`,async()=>{let t=e.runtime===`colab`?`同时删除 Mac 本地的该 Colab 归档目录（含权重与图表）吗？
点「确定」彻底删除归档；点「取消」仅从列表中移除记录。`:`同时删除远程服务器上的该任务目录吗？
点「确定」删除远程文件；点「取消」仅从列表中移除记录。`,n=confirm(t);await o.deleteRun(e.runId,n),d=d.filter(t=>t.runId!==e.runId),y=null,b=null,Y(`已移除训练记录`,`info`),mt(`compose`)}),Lt()}function zt(e){e.innerHTML=`<div class="charts-grid"><div class="ys-card chart-box" id="ch-loss"></div><div class="ys-card chart-box" id="ch-metric"></div></div>`;let t=b?.curves??null;v(e.querySelector(`#ch-loss`),`训练损失 Loss`,t,t?h(t):[],`loss`),v(e.querySelector(`#ch-metric`),`验证指标 mAP / P / R`,t,t?g(t):[],`percent`)}function Bt(e){e.innerHTML=`
		<div class="ys-card log-card">
			<div class="log-head">
				<span>train.log · 实时流</span>
				<button type="button" class="ys-btn ghost xs" data-act="copy-log">📋 复制日志</button>
			</div>
			<pre class="ys-log-pre"></pre>
		</div>`,It(),e.querySelector(`[data-act="copy-log"]`)?.addEventListener(`click`,()=>{navigator.clipboard?.writeText(se(Oe)),Y(`日志已复制`,`ok`)})}function Vt(e,t){let n=b?.artifacts,r=b?.summary,i=r?A(r.status).active:!1;if(!n||!n.weights.length&&!n.images.length)e.innerHTML=`<div class="ys-card"><div class="ds-placeholder">训练尚未生成权重或可视化图片，请稍候刷新～</div></div>`;else{e.innerHTML=`
		<div class="arts-wrap">
			${n.weights.length?`<section class="ys-card">
							<div class="sub-h-row">
								<h3 class="sub-h">⚖️ 模型权重与导出文件</h3>
								${i?`<span class="arts-weight-tip">💡 训练中保存的 .pt 含优化器与 EMA 状态以便断点续训（体积约 4×），全部训完后会自动 strip 瘦身</span>`:``}
							</div>
							<div class="weights-dl-grid">
								${n.weights.map(e=>`<div class="wdl-item">
											<div>
												<b>${T(e.name)}</b>
												<span>${E(e.size)} · ${D(e.mtime)}</span>
											</div>
											<button type="button" class="ys-btn primary xs" data-dl="${T(e.rel)}">⬇️ 下载</button>
										</div>`).join(``)}
							</div>
						</section>`:``}
			${n.images.length?`<section class="ys-card">
							<h3 class="sub-h">🖼️ 验证预测与评估图表（点击放大 · 本机已缓存零闪屏）</h3>
							<div class="img-gallery">
								${n.images.map(e=>{let n=`${t}::${e.rel}::${e.size}::${e.mtime}`,r=me.get(n);return`<button type="button" class="gal-item" data-art-img="${T(e.rel)}" data-art-name="${T(e.name)}" data-art-key="${T(n)}">
											<div class="gal-thumb" data-thumb="${T(e.rel)}">${r?`<img src="${r.url}" alt="${T(e.name)}" />`:`<span>加载中…</span>`}</div>
											<div class="gal-cap">${T(e.name)}</div>
										</button>`}).join(``)}
							</div>
						</section>`:``}
		</div>`,e.querySelectorAll(`[data-dl]`).forEach(e=>{e.addEventListener(`click`,()=>o.downloadArtifact(t,e.dataset.dl))});for(let r of n.images){let n=`${t}::${r.rel}::${r.size}::${r.mtime}`,i=e.querySelector(`[data-thumb="${CSS.escape(r.rel)}"]`);if(!i)continue;let a=me.get(n);if(a){i.closest(`.gal-item`)?.addEventListener(`click`,()=>Yt(a.url,r.name));continue}let s=`${r.size}_${r.mtime}`;o.artifactImageUrl(t,r.rel,s).then(e=>{me.set(n,e),i.isConnected&&(i.innerHTML=`<img src="${e.url}" alt="${T(r.name)}" />`,i.closest(`.gal-item`)?.addEventListener(`click`,()=>Yt(e.url,r.name)))}).catch(()=>{i.isConnected&&(i.innerHTML=`<span>加载失败（点 ↻ 重试）</span>`)})}}}function Ht(e){e.innerHTML=`
		<div class="ys-grid-2">
			<section class="ys-card">
				<h3 class="sub-h">📄 data.yaml</h3>
				<pre class="code-box">${T(b?.dataYaml||`（训练初始化后生成）`)}</pre>
			</section>
			<section class="ys-card">
				<h3 class="sub-h">🧾 job.json</h3>
				<pre class="code-box">${T(JSON.stringify(b?.job??{},null,2))}</pre>
			</section>
		</div>`}function $(){let e=V.scan,t=Object.entries(V.classNames).sort((e,t)=>Number(e[0])-Number(t[0]));K.innerHTML=`
		<div class="ys-nodes-page">
			<div class="ys-hero-bar">
				<div>
					<h2 class="ys-page-title">⚙️ 资源与环境配置</h2>
					<p class="ys-page-sub">统一管理常用数据集、远程训练节点与本地预训练权重库；配置好后，新建训练页里点下拉框直接切换。</p>
				</div>
				<button type="button" class="ys-btn primary sm" data-act="back-compose">← 返回新建训练</button>
			</div>

			<div class="res-tabs" role="tablist">
				<button type="button" class="res-tab ${M===`datasets`?`active`:``}" data-res-tab="datasets">📁 数据集管理 <i>${c.dataSources.length}</i></button>
				<button type="button" class="res-tab ${M===`nodes`?`active`:``}" data-res-tab="nodes">🖥️ 计算节点 <i>${c.profiles.length}</i></button>
				<button type="button" class="res-tab ${M===`hub`?`active`:``}" data-res-tab="hub">📦 模型权重库 <i>${l.length}</i></button>
			</div>

			${M===`datasets`?`<div class="res-radar-bar">
							<div class="rrb-info">
								<span class="step-badge">🛰️</span>
								<div class="rrb-txt">
									<b>项目母文件夹 · 智能探测雷达</b>
									<span>${c.projectRoot?.path?`${T(c.projectRoot.host)} · <code>${T(n(c.projectRoot.path,/^\/[A-Za-z]:/.test(c.projectRoot.path)))}</code> · 已探测 ${c.projectRoot.totalProjects??c.projectRoot.projects.length} 个项目 / ${c.projectRoot.totalDatasets??0} 个数据集${c.projectRoot.scannedAt?`（${O(c.projectRoot.scannedAt)}）`:``}`:`指定存放所有 YOLO 项目的母文件夹（如 D:\\SundayLearning），一键扫描并智能推荐最新项目、任务类型与类名`}</span>
								</div>
							</div>
							<div class="rrb-acts">
								${c.projectRoot?.path?`<button type="button" class="ys-btn soft xs" data-act="rescan-root">🔄 重新探测</button>`:``}
								<button type="button" class="ys-btn neon sm" data-act="open-radar">🛰️ 打开项目雷达</button>
							</div>
						</div>
						<div class="ys-grid-2">
							<section class="ys-card">
								<header class="ys-card-head">
									<span class="step-badge">📁</span>
									<div>
										<h3>已保存的数据集（${c.dataSources.length}）</h3>
										<p class="card-sub">永久记住在本地，刷新不丢失；点右上角可一步选目录添加</p>
									</div>
									<button type="button" class="ys-btn primary xs" data-act="quick-add-ds">📂 选文件夹添加</button>
								</header>
								${c.dataSources.length?`<div class="saved-nodes-list">
												${c.dataSources.map(e=>{let t=F.get(`${e.host}::${e.path}`);return`<div class="sn-item ${Pe===e.id?`editing`:``}">
															<div class="sn-main">
																<div class="sn-top">
																	<b>${T(e.name)}</b>
																	<span class="pill">${T(e.host)}</span>
																	${t?`<span class="pill pill-task-${t.detectedTask===`mixed`||t.detectedTask===`unknown`?`hbb`:t.detectedTask}">${t.detectedTask.toUpperCase()}</span>`:``}
																</div>
																<div class="sn-py mono">${T(e.path)}</div>
																${t?`<div class="npc-tags"><span class="mini-tag ok">${t.totalImages} 图（${t.labeledImages} 已标）</span><span class="mini-tag">${E(t.totalBytes)}</span><span class="mini-tag">${Object.keys(t.classNames).length} 类</span></div>`:``}
															</div>
															<div class="sn-acts">
																<button type="button" class="ys-btn primary xs" data-ds-use="${T(e.id)}">🚀 去训练</button>
																<button type="button" class="ys-btn soft xs" data-ds-edit="${T(e.id)}">编辑</button>
																<button type="button" class="ys-btn ghost xs" data-ds-del="${T(e.id)}">删</button>
															</div>
														</div>`}).join(``)}
											</div>`:`<div class="ds-placeholder">还没有添加数据集，在右侧选择 SSH 主机与 labels 目录保存即可，支持图片和 .txt 放在一起。</div>`}
							</section>

							<section class="ys-card">
								<header class="ys-card-head">
									<span class="step-badge">✏️</span>
									<div>
										<h3>${Pe?`编辑数据集`:`添加数据集`}</h3>
										<p class="card-sub">支持浏览目录、体检统计与 Canvas 标注抽查</p>
									</div>
									${Pe?`<button type="button" class="ys-btn ghost xs" data-act="cancel-ds-edit">取消编辑</button>`:``}
								</header>
								<div class="nf-stack">
									<div class="ys-form-row">
										<label class="ys-field grow">
											<span>数据所在 SSH 主机</span>
											<select class="ys-input" data-df="host">
												<option value="">选择主机…</option>
												${s.map(e=>`<option value="${T(e.name)}" ${e.name===V.host?`selected`:``}>${T(e.name)}${e.hostname?` (${T(e.hostname)})`:``}</option>`).join(``)}
											</select>
										</label>
										<label class="ys-field grow">
											<span>数据集别名</span>
											<input class="ys-input" data-df="name" value="${T(V.name)}" placeholder="如 PCB 缺陷检测" />
										</label>
									</div>

									<label class="ys-field">
										<span>labels 目录路径（图片和 .txt 可混放）</span>
										<div class="ys-input-group">
											<input class="ys-input mono" data-df="path" value="${T(V.path)}" placeholder="/data/labels/my_dataset" spellcheck="false" />
											<button type="button" class="ys-btn soft sm" data-act="browse-df">📂 浏览</button>
											<button type="button" class="ys-btn soft sm" data-act="scan-df">🔍 体检</button>
										</div>
									</label>

									${e?`<div class="ds-report">
													<div class="ds-metrics">
														<div class="dm-pill"><b>${e.totalImages}</b><span>总图片</span></div>
														<div class="dm-pill ok"><b>${e.labeledImages}</b><span>已标注</span></div>
														<div class="dm-pill"><b>${e.backgroundImages}</b><span>背景图</span></div>
														<div class="dm-pill"><b>${E(e.totalBytes)}</b><span>总大小</span></div>
														<div class="dm-pill accent"><b>${e.detectedTask.toUpperCase()}</b><span>任务</span></div>
													</div>
													${e.warnings.length?`<div class="ds-warns">${e.warnings.map(e=>`<span>⚠️ ${T(e)}</span>`).join(``)}</div>`:``}
													<div class="ds-classes-head">
														<span>类别（${t.length} 类）</span>
														<button type="button" class="ys-btn soft xs" data-act="preview-df" ${e.samples.length?``:`disabled`}>🖼️ 抽查标注 (${e.samples.length})</button>
													</div>
													<div class="ds-classes">
														${t.map(([t,n])=>`<span class="cls-pill" style="--cc:${f(Number(t))}"><i class="cls-dot"></i><span class="cls-id">${t}</span><b>${T(n)}</b><span class="cls-cnt">${e.classCounts[t]??0}</span></span>`).join(``)}
													</div>
												</div>`:``}

									<div class="nf-actions">
										<button type="button" class="ys-btn primary sm" data-act="save-df">💾 ${Pe?`保存修改`:`添加数据集`}</button>
									</div>
								</div>
							</section>
						</div>`:M===`nodes`?`<div class="ys-grid-2">
								<section class="ys-card">
									<header class="ys-card-head">
										<span class="step-badge">🖥️</span>
										<div>
											<h3>已配置的计算节点（${c.profiles.length}）</h3>
											<p class="card-sub">一台主机可添加多个虚拟环境，也支持一键接入 Google Colab 云端超速 GPU</p>
										</div>
										<div class="ys-chip-row">
											${c.profiles.some(e=>e.runtime===`colab`)?``:`<button type="button" class="ys-btn neon xs" data-act="quick-add-colab" title="一键添加 Google Colab 超速训练节点（支持 T4 / A100 / H100）">⚡ +Colab 超速</button>`}
											<button type="button" class="ys-btn soft xs" data-act="new-node">+ 新增</button>
										</div>
									</header>

									${c.profiles.length?`<div class="saved-nodes-list">
													${c.profiles.map(e=>{let t=e.probe?.gpus?.[0],n=e.runtime===`colab`;return`<div class="sn-item ${H===e.id?`editing`:``}">
																<div class="sn-main">
																	<div class="sn-top">
																		<b>${T(e.name)}</b>
																		<span class="pill pill-rt-${e.runtime}">${n?`⚡ COLAB · ${T(e.colabGpu||`A100`)}`:e.runtime===`wsl`?`WSL · ${T(e.wslDistro||`Ubuntu`)}`:e.runtime.toUpperCase()}</span>
																		${n?z?.balance==null?``:`<span class="colab-cu-badge">💎 ${z.balance.toFixed(1)} CU</span>`:`<span class="pill">${T(e.host)}</span>`}
																	</div>
																	<div class="sn-py mono">${n?`云端弹性算力（T4 / A100 / H100 三档切换 · 训完自动拉回 Mac 本地并停机）`:T(e.python)}</div>
																	${n?`<div class="npc-tags"><span class="mini-tag ok">📦 本地归档 ~/.config/remotedesk/colab_runs</span><span class="mini-tag ok">🛡️ 自动释放 VM</span></div>`:`<div class="npc-tags">
																					${t?`<span class="mini-tag gpu">🎮 ${T(t.name)} · ${(t.totalMemMB/1024).toFixed(0)}G</span>`:``}
																					${e.probe?.torchVersion?`<span class="mini-tag">PyTorch ${T(e.probe.torchVersion)}</span>`:``}
																					${e.probe?.ultralyticsVersion?`<span class="mini-tag">ultralytics ${T(e.probe.ultralyticsVersion)}</span>`:``}
																					${e.probe?.supportsYolo26?`<span class="mini-tag ok">YOLO26 ✓</span>`:``}
																				</div>
																				${ft(e.probe?.storage,e.workspace)}`}
																</div>
																<div class="sn-acts">
																	${n?``:`<button type="button" class="ys-btn soft xs" data-node-probe="${T(e.id)}">🩺 体检</button>`}
																	<button type="button" class="ys-btn soft xs" data-node-edit="${T(e.id)}">编辑</button>
																	<button type="button" class="ys-btn ghost xs" data-node-del="${T(e.id)}">删</button>
																</div>
															</div>`}).join(``)}
												</div>`:`<div class="ds-placeholder">还没有训练节点，在右侧选一台 SSH 主机（如 <code>weng</code>）点「自动发现」，或直接点上方「⚡ +Colab 超速」接入云端 A100/H100！</div>`}
								</section>

								<section class="ys-card">
									<header class="ys-card-head">
										<span class="step-badge">✏️</span>
										<div>
											<h3>${H?`编辑训练节点`:`添加训练节点`}</h3>
											<p class="card-sub">自动扫描 Conda / venv，或切换「⚡ Colab 超速」直连 Google 云端显卡</p>
										</div>
										${H?`<button type="button" class="ys-btn ghost xs" data-act="cancel-edit">取消编辑</button>`:``}
									</header>

									<div class="nf-stack">
										<div class="ys-field">
											<span>运行环境类型</span>
											<div class="ys-chip-row">
												<button type="button" class="opt-chip ${U.runtime===`linux`?`active`:``}" data-nf-rt="linux">🐧 原生 Linux</button>
												<button type="button" class="opt-chip ${U.runtime===`windows`?`active`:``}" data-nf-rt="windows">🪟 原生 Windows</button>
												<button type="button" class="opt-chip ${U.runtime===`wsl`?`active`:``}" data-nf-rt="wsl">🧩 Windows 里的 WSL</button>
												<button type="button" class="opt-chip ${U.runtime===`colab`?`active`:``}" data-nf-rt="colab">⚡ Colab 超速</button>
												${U.runtime===`colab`?``:`<button type="button" class="ys-btn primary xs" data-act="discover-env">🔍 自动发现 WSL & Python</button>`}
											</div>
										</div>

										${U.runtime===`colab`?`<label class="ys-field">
														<span>节点别名</span>
														<input class="ys-input" data-nf="name" value="${T(U.name)}" placeholder="如 Google Colab 超速训练" />
													</label>
													<div class="colab-panel">
														<div class="colab-balance-bar">
															<div class="colab-balance-main">
																<b>⚡ Google Colab 云端超速</b>
																${z?z.authenticated?`<span class="colab-cu-badge">💎 余额 ${z.balance?.toFixed(2)??`—`} CU</span>
																			   <span class="mini-tag ${z.activeAssignments>0?`busy`:`ok`}">活跃实例 ${z.activeAssignments}</span>`:`<span class="mini-tag warn">⚠️ ${T(z.error||`未登录 colab CLI`)}</span>`:`<span class="mini-tag">点击右侧检测额度</span>`}
															</div>
															<div class="ys-chip-row">
																<button type="button" class="ys-btn soft xs" data-act="refresh-colab">🔄 查额度</button>
																${z&&(z.activeAssignments>0||z.sessions.length>0)?`<button type="button" class="ys-btn danger xs" data-act="stop-all-colab" title="立即关闭账号下所有活跃 Colab VM 防止空烧额度">🛑 释放全部实例</button>`:``}
															</div>
														</div>
														<div class="ys-label-sm"><span>默认显卡档位（开训前也可在新建训练页随时一键切换三档）：</span></div>
														<div class="colab-tier-grid">
															${re.map(e=>`<button type="button" class="colab-tier-card ${U.colabGpu===e.gpu?`active`:``}" data-nf-colab-gpu="${e.gpu}">
																	<div class="ct-top"><b>${e.icon} ${e.gpu}</b><span class="ct-cu">${e.cu}</span></div>
																	<div class="ct-sub">${e.name} · ${e.vram}</div>
																	<div class="ct-desc">${e.desc}</div>
																</button>`).join(``)}
														</div>
														<div class="colab-safe-note">🛡️ <b>额度安全保障</b>：开训时单包极速上传数据集，实时回传曲线 / 日志 / GPU 监控；训练完成、停止或报错后，自动将 <code>best.pt</code>、<code>last.pt</code>、ONNX 与图表拉回 Mac 本地 <code>~/.config/remotedesk/colab_runs/</code> 归档，并<b>立刻关闭 Colab VM</b>，绝不空转扣额度。</div>
													</div>
													<div class="nf-actions">
														<button type="button" class="ys-btn primary sm" data-act="save-node">💾 ${H?`保存修改`:`添加 Colab 超速节点`}</button>
													</div>`:`<div class="ys-form-row">
														<label class="ys-field grow">
															<span>SSH 主机</span>
															<select class="ys-input" data-nf="host">
																<option value="">选择主机…</option>
																${s.map(e=>`<option value="${T(e.name)}" ${e.name===U.host?`selected`:``}>${T(e.name)}${e.hostname?` (${T(e.hostname)})`:``}</option>`).join(``)}
															</select>
														</label>
														<label class="ys-field grow">
															<span>节点别名</span>
															<input class="ys-input" data-nf="name" value="${T(U.name)}" placeholder="如 weng · WSL · yolo" />
														</label>
													</div>

													${U.runtime===`wsl`?`<label class="ys-field">
																	<span>WSL 发行版名称</span>
																	<div class="ys-chip-row">
																		<input class="ys-input sm mono" data-nf="wslDistro" value="${T(U.wslDistro)}" placeholder="Ubuntu" />
																		${U.discoveredDistros.map(e=>`<button type="button" class="opt-chip ${U.wslDistro===e?`active`:``}" data-pick-distro="${T(e)}">${T(e)}</button>`).join(``)}
																	</div>
																</label>`:``}

													<label class="ys-field">
														<span>Python 解释器路径（自定义虚拟环境）</span>
														<div class="ys-input-group">
															<input class="ys-input mono" data-nf="python" value="${T(U.python)}" placeholder="${U.runtime===`windows`?`D:\\anaconda3\\envs\\yolo\\python.exe`:`/home/user/miniconda3/envs/yolo/bin/python`}" spellcheck="false" />
															${U.runtime===`wsl`?``:`<button type="button" class="ys-btn soft sm fp-inline-btn" data-act="browse-nf-py" title="浏览远程文件选择 Python 解释器">📂</button>`}
														</div>
													</label>
													${U.discoveredPythons.length?`<div class="ys-chip-row">
																	${U.discoveredPythons.map(e=>`<button type="button" class="opt-chip mono-chip ${U.python===e?`active`:``}" data-pick-py="${T(e)}">🐍 ${T(e)}</button>`).join(``)}
																</div>`:``}

													<label class="ys-field">
														<span>远程工作区目录（存放 runs / 日志 / 缓存，不存在自动创建）</span>
														<div class="ys-input-group">
															<input class="ys-input mono" data-nf="workspace" value="${T(U.workspace)}" placeholder="${U.runtime===`windows`?`D:\\remote`:`~/.yolo-studio`}" spellcheck="false" />
															${U.runtime===`wsl`?``:`<button type="button" class="ys-btn soft sm fp-inline-btn" data-act="browse-nf-ws" title="浏览远程目录选择工作区文件夹">📂</button>`}
														</div>
													</label>

													${U.probe?`<div class="probe-card">
																	<div class="npc-tags">
																		<span class="mini-tag ok">Python ${T(U.probe.pythonVersion)}</span>
																		${U.probe.torchVersion?`<span class="mini-tag">PyTorch ${T(U.probe.torchVersion)}</span>`:``}
																		${U.probe.cudaAvailable?`<span class="mini-tag ok">CUDA ${T(U.probe.cudaVersion??``)} ✓</span>`:`<span class="mini-tag warn">仅 CPU</span>`}
																		${U.probe.gpus.map(e=>`<span class="mini-tag gpu">🎮 ${T(e.name)} (${(e.totalMemMB/1024).toFixed(1)} GB)</span>`).join(``)}
																		${U.probe.ultralyticsVersion?`<span class="mini-tag ok">ultralytics ${T(U.probe.ultralyticsVersion)}</span>`:`<span class="mini-tag warn">未安装 ultralytics</span>`}
																		${U.probe.supportsYolo26?`<span class="mini-tag ok">YOLO26 ✓</span>`:``}
																		${U.probe.supportsYolo11?`<span class="mini-tag ok">YOLO11 ✓</span>`:``}
																	</div>
																	${ft(U.probe.storage,U.workspace)}
																	${U.probe.errors.length?`<div class="ds-warns">${U.probe.errors.map(e=>`<span>⚠️ ${T(e)}</span>`).join(``)}</div>`:``}
																</div>`:``}

													<div class="nf-actions">
														<button type="button" class="ys-btn soft sm" data-act="probe-form">🩺 测试这个 Python 环境</button>
														<button type="button" class="ys-btn primary sm" data-act="save-node">💾 ${H?`保存修改`:`添加节点`}</button>
													</div>`}
									</div>
								</section>
							</div>`:`<section class="ys-card">
								<header class="ys-card-head">
									<span class="step-badge">📦</span>
									<div>
										<h3>预训练模型权重仓库 (Model Hub)</h3>
										<p class="card-sub">指向存放 <code>yolo11*.pt</code> / <code>yolo26*.pt</code> 的主机目录，训练时自动匹配并缓存同步到训练机。</p>
									</div>
								</header>

								<div class="ys-form-row">
									<label class="ys-field w-host">
										<span>权重库主机</span>
										<select class="ys-input" data-hub="host">
											<option value="">选择主机…</option>
											${s.map(e=>`<option value="${T(e.name)}" ${e.name===c.modelHub.host?`selected`:``}>${T(e.name)}</option>`).join(``)}
										</select>
									</label>
									<label class="ys-field grow">
										<span>权重存放目录</span>
										<div class="ys-input-group">
											<input class="ys-input mono" data-hub="path" value="${T(c.modelHub.path)}" placeholder="/data/weights" spellcheck="false" />
											<button type="button" class="ys-btn soft sm" data-act="browse-hub">📂 浏览</button>
											<button type="button" class="ys-btn primary sm" data-act="save-scan-hub">${l.length?`🔄 重新扫描`:`🔍 保存并扫描`}</button>
										</div>
									</label>
								</div>

								${l.length?`<div class="hub-matrix">
												<div class="ys-label-sm">
													<span>官方权重自动匹配矩阵（共命中 ${l.filter(e=>!e.custom).length} 个官方权重）</span>
													<span class="sub-note">✅ 已本地记住${c.modelHub.scannedAt?` · 上次扫描 ${D(c.modelHub.scannedAt)}`:``}（增删权重后再点重新扫描即可）</span>
												</div>
												<div class="ys-grid-2">
													${[`yolo26`,`yolo11`].map(e=>`<div class="hm-family">
																<span class="pill ${e===`yolo26`?`pill-y26`:`pill-y11`}">${e.toUpperCase()}</span>
																<div class="hm-grid">
																	${ne.map(t=>`<div class="hm-row">
																			<span class="hm-task">${t.short}</span>
																			${te.map(n=>{let r=gt(e,n.id,t.id);return`<span class="hm-cell ${r?`hit`:``}" title="${r?`${r.name} (${E(r.size)})`:`${k(e,n.id,t.id)} 未找到`}">${n.id.toUpperCase()}</span>`}).join(``)}
																		</div>`).join(``)}
																</div>
															</div>`).join(``)}
												</div>
												${l.some(e=>e.custom)?`<div class="ys-label-sm" style="margin-top:0.85rem">自定义权重（.pt / .yaml）</div>
															<div class="ys-chip-row">
																${l.filter(e=>e.custom).map(e=>`<span class="mini-tag">🎯 ${T(e.name)} (${E(e.size)})</span>`).join(``)}
															</div>`:``}
											</div>`:`<div class="ds-placeholder">配置好目录后点 <b>保存并扫描</b>，所有 <code>yolo11*.pt</code>、<code>yolo26*.pt</code> 与自定义权重都会自动识别归类！</div>`}
							</section>`}
		</div>`,Ut()}function Ut(){K.querySelector(`[data-act="back-compose"]`)?.addEventListener(`click`,()=>mt(`compose`)),K.querySelectorAll(`[data-res-tab]`).forEach(e=>{e.addEventListener(`click`,()=>{M=e.dataset.resTab,$()})}),K.querySelector(`[data-act="open-radar"]`)?.addEventListener(`click`,()=>Kt()),K.querySelector(`[data-act="rescan-root"]`)?.addEventListener(`click`,async()=>{let e=c.projectRoot;if(!e?.host||!e?.path)return Kt();X(`busy`,`正在重新探测母文件夹…`),Y(`正在扫描 ${e.host}:${n(e.path,/^\/[A-Za-z]:/.test(e.path))}…`,`info`);try{let t=await Wt(e.host,e.path);X(`happy`,`探测完成：${t.totalProjects} 个项目 · ${t.totalDatasets} 个数据集`),Y(`探测完成（${(t.elapsedMs/1e3).toFixed(1)}s）：发现 ${t.totalProjects} 个项目 / ${t.totalDatasets} 个数据集`,`ok`),$()}catch(e){X(`err`),Y(e instanceof Error?e.message:String(e),`err`)}}),K.querySelector(`[data-act="quick-add-ds"]`)?.addEventListener(`click`,()=>{let e=V.host||ve();qt({title:`📂 选择数据集文件夹（自动保存记住）`,host:e,initialPath:L.lastPaths[e]||``,allowHostSwitch:!0,asDatasetHost:!0,onSelect:async(e,t)=>{let n=await be(e,t);V={name:n.name,host:n.host,path:n.path,scan:F.get(`${n.host}::${n.path}`)??null,classNames:{}},Y(`已添加并记住数据集「${n.name}」`,`ok`),$()}})}),K.querySelector(`[data-act="cancel-ds-edit"]`)?.addEventListener(`click`,()=>{Pe=null,$()}),K.querySelectorAll(`[data-df]`).forEach(e=>{e.addEventListener(`change`,()=>{let t=e.dataset.df;V[t]=e.value.trim(),t===`host`&&(L.datasetHost=V.host,_e(!0)),(t===`host`||t===`path`)&&(V.scan=null)})}),K.querySelector(`[data-act="browse-df"]`)?.addEventListener(`click`,()=>{let e=V.host||ve();qt({title:`📂 选择数据集目录`,host:e,initialPath:V.path?i(V.path):L.lastPaths[e]||``,allowHostSwitch:!0,asDatasetHost:!0,onSelect:(e,t)=>{V.host=e,V.path=t,V.name||(V.name=t.replace(/\/+$/,``).split(`/`).pop()||`dataset`),V.scan=null,$()}})}),K.querySelector(`[data-act="scan-df"]`)?.addEventListener(`click`,async()=>{if(!V.host||!V.path)return Y(`请先选择主机和目录`,`err`);X(`busy`,`正在体检数据集…`),Y(`正在扫描图片与 .txt 标签…`,`info`);try{let e=await o.scanDataset(V.host,V.path);F.set(`${V.host}::${e.path}`,e),F.set(`${V.host}::${V.path}`,e),V.path=e.path,V.scan=e,V.classNames={...e.classNames},V.name||(V.name=e.path.replace(/\/+$/,``).split(`/`).pop()||`dataset`),Pe=(await be(V.host,e.path,V.name,e)).id,X(`happy`,`扫描完成 · ${e.totalImages} 张图`),Y(`体检完成并已自动保存记住：${e.totalImages} 张图 · ${e.detectedTask.toUpperCase()}`,`ok`),$()}catch(e){X(`err`),Y(e instanceof Error?e.message:String(e),`err`)}}),K.querySelector(`[data-act="preview-df"]`)?.addEventListener(`click`,()=>{V.scan&&Jt(V.scan,V.classNames)}),K.querySelector(`[data-act="save-df"]`)?.addEventListener(`click`,async()=>{if(!V.host||!V.path)return Y(`主机和目录路径为必填项`,`err`);let e=Pe??`ds-${Date.now()}`,t={id:e,name:V.name||V.path.replace(/\/+$/,``).split(`/`).pop()||`dataset`,host:V.host,path:V.path,lastScan:V.scan?S(V.scan):c.dataSources.find(t=>t.id===e)?.lastScan??null};Pe?c.dataSources=c.dataSources.map(n=>n.id===e?t:n):c.dataSources.unshift(t),L.datasetHost=t.host,L.lastPaths[t.host]=i(t.path)||t.path,c.browser={datasetHost:L.datasetHost,lastPaths:{...L.lastPaths},bookmarks:[...L.bookmarks]},x.set(L),W.datasetPath||(W.datasetHost=t.host,W.datasetPath=t.path,V.scan&&(W.datasetScan=V.scan,W.classNames={...V.classNames})),await o.saveConfig(c),Pe=null,Y(`已保存数据集「${t.name}」`,`ok`),st(),$()}),K.querySelectorAll(`[data-ds-use]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=c.dataSources.find(t=>t.id===e.dataset.dsUse);t&&(p=`compose`,st(),Z(),bt(t.host,t.path,!0))})}),K.querySelectorAll(`[data-ds-edit]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=c.dataSources.find(t=>t.id===e.dataset.dsEdit);if(!t)return;Pe=t.id;let n=F.get(`${t.host}::${t.path}`)??null;V={name:t.name,host:t.host,path:t.path,scan:n,classNames:n?{...n.classNames}:{}},$()})}),K.querySelectorAll(`[data-ds-del]`).forEach(e=>{e.addEventListener(`click`,async()=>{confirm(`确认删除这条数据集记录？（不会删远程任何图片和标签）`)&&(c.dataSources=c.dataSources.filter(t=>t.id!==e.dataset.dsDel),await o.saveConfig(c),st(),$())})}),K.querySelector(`[data-act="new-node"]`)?.addEventListener(`click`,()=>{H=null,U={name:``,host:s[0]?.name??``,runtime:`wsl`,wslDistro:``,colabGpu:`A100`,python:``,workspace:`~/.yolo-studio`,weightsDir:``,discoveredDistros:[],discoveredPythons:[],probe:null},$()}),K.querySelector(`[data-act="quick-add-colab"]`)?.addEventListener(`click`,()=>{H=null,U={name:`Google Colab 超速训练`,host:`colab`,runtime:`colab`,wslDistro:``,colabGpu:`A100`,python:`colab-managed`,workspace:`~/.config/remotedesk/colab_runs`,weightsDir:``,discoveredDistros:[],discoveredPythons:[],probe:null},$(),it(!0)}),K.querySelector(`[data-act="cancel-edit"]`)?.addEventListener(`click`,()=>{H=null,$()}),K.querySelectorAll(`[data-nf]`).forEach(e=>{e.addEventListener(`change`,()=>{let t=e.dataset.nf;U[t]=e.value.trim(),t===`host`&&!H&&(U.discoveredDistros=[],U.discoveredPythons=[],U.probe=null)})}),K.querySelectorAll(`[data-nf-rt]`).forEach(e=>{e.addEventListener(`click`,()=>{U.runtime=e.dataset.nfRt,U.runtime===`colab`?(U.name||(U.name=`Google Colab 超速训练`),z||it(!0)):U.runtime===`windows`&&(!U.workspace||U.workspace===`~/.yolo-studio`||U.workspace.startsWith(`/`))?U.workspace=`D:\\remote`:U.runtime!==`windows`&&(U.workspace.includes(`\\`)||/^[A-Za-z]:/.test(U.workspace))&&(U.workspace=`~/.yolo-studio`),$()})}),K.querySelectorAll(`[data-nf-colab-gpu]`).forEach(e=>{e.addEventListener(`click`,()=>{U.colabGpu=e.dataset.nfColabGpu,$()})}),K.querySelector(`[data-act="refresh-colab"]`)?.addEventListener(`click`,async()=>{Y(`正在查询 Google Colab 账号余额与会话状态…`,`info`);let e=await it(!1);e?.authenticated&&Y(`Colab 就绪 · 当前余额 ${e.balance?.toFixed(2)} CU`,`ok`)}),K.querySelector(`[data-act="stop-all-colab"]`)?.addEventListener(`click`,async()=>{if(confirm(`确认立即关闭 Google Colab 账号下所有活跃实例？`))try{let e=await o.colabStopAll();z=e.status,Y(`已释放 ${e.stopped.length} 个 Colab 实例，当前余额 ${e.status.balance?.toFixed(2)??`—`} CU`,`ok`),d=await o.listRuns(!1),Z(),$()}catch(e){Y(e instanceof Error?e.message:String(e),`err`)}}),K.querySelector(`[data-act="browse-nf-py"]`)?.addEventListener(`click`,()=>{if(!U.host)return Y(`请先选择 SSH 主机`,`err`);let t=U.runtime===`windows`,n=U.python?i(e(U.python,t)):t?`/D:/`:``;qt({title:`🐍 选择远程 Python 解释器文件`,host:U.host,initialPath:n,allowHostSwitch:!1,mode:`file`,fileFilter:/^python(\d+(\.\d+)*)?(\.exe)?$/i,nativePathResult:t,onSelect:(e,t)=>{if(U.python=t,!U.name&&U.host){let e=t.match(/envs[\\/]([^\\/]+)/)?.[1]??`py`;U.name=`${U.host} · ${U.runtime} · ${e}`}$()}})}),K.querySelector(`[data-act="browse-nf-ws"]`)?.addEventListener(`click`,()=>{if(!U.host)return Y(`请先选择 SSH 主机`,`err`);let t=U.runtime===`windows`,n=U.workspace&&U.workspace!==`~/.yolo-studio`?e(U.workspace,t):t?`/D:/`:``;qt({title:`📂 选择远程工作区目录（存放 runs / 缓存）`,host:U.host,initialPath:n,allowHostSwitch:!1,mode:`dir`,nativePathResult:t,onSelect:(e,t)=>{U.workspace=t,$()}})}),K.querySelectorAll(`[data-pick-distro]`).forEach(e=>{e.addEventListener(`click`,()=>{U.wslDistro=e.dataset.pickDistro,$()})}),K.querySelectorAll(`[data-pick-py]`).forEach(e=>{e.addEventListener(`click`,()=>{if(U.python=e.dataset.pickPy,!U.name&&U.host){let e=U.python.match(/envs[\\/]([^\\/]+)/)?.[1]??`py`;U.name=`${U.host} · ${U.runtime===`wsl`?`WSL ${U.wslDistro||``}`.trim():U.runtime} · ${e}`}$()})}),K.querySelector(`[data-act="discover-env"]`)?.addEventListener(`click`,async()=>{if(!U.host)return Y(`请先选择 SSH 主机`,`err`);X(`busy`,`正在扫描 ${U.host} 的环境…`),Y(`正在扫描 ${U.host} 上的虚拟环境…`,`info`);try{let e=await o.discover(U.host,U.runtime,U.wslDistro);if(U.discoveredDistros=e.distros,U.discoveredPythons=e.pythons,U.runtime===`wsl`&&!U.wslDistro&&e.distros.length&&(U.wslDistro=e.distros[0]),e.defaultWorkspace){let t=U.workspace.trim();(!t||t===`~/.yolo-studio`||t===`C:\\Users\\Public\\.yolo-studio`||t===`D:\\remote`||/[\\/]\.yolo-studio$/.test(t))&&(U.workspace=e.defaultWorkspace)}if(!U.python&&e.pythons.length&&(U.python=e.pythons.find(e=>/yolo/i.test(e))??e.pythons[0]),!U.name&&U.python){let e=U.python.match(/envs[\\/]([^\\/]+)/)?.[1]??`python`;U.name=`${U.host} · ${U.runtime===`wsl`?`WSL ${U.wslDistro||``}`.trim():U.runtime} · ${e}`}X(`happy`,`发现了 ${e.pythons.length} 个 Python 环境！`),Y(`发现 ${e.pythons.length} 个 Python${e.distros.length?` · ${e.distros.length} 个 WSL 发行版`:``}`,`ok`),$()}catch(e){X(`err`),Y(e instanceof Error?e.message:String(e),`err`)}}),K.querySelector(`[data-act="probe-form"]`)?.addEventListener(`click`,async()=>{if(!U.host||!U.python)return Y(`请先填写主机和 Python 路径`,`err`);X(`busy`,`正在检测 PyTorch / GPU / Ultralytics…`);try{let e=await o.probe(U.host,U.runtime,U.python,U.wslDistro,H??``,U.workspace);U.probe=e,X(`happy`,e.ultralyticsVersion?`体检通过 · ultralytics ${e.ultralyticsVersion}`:`体检完成`),Y(`环境体检完成`,`ok`),$()}catch(e){X(`err`),Y(e instanceof Error?e.message:String(e),`err`)}}),K.querySelector(`[data-act="save-node"]`)?.addEventListener(`click`,async()=>{let e=U.runtime===`colab`;if(!e&&(!U.host||!U.python))return Y(`主机和 Python 路径为必填项`,`err`);let t=H??`node-${Date.now()}`,n=e?{id:t,name:U.name||`Google Colab · ${U.colabGpu}`,host:`colab`,runtime:`colab`,wslDistro:``,colabGpu:U.colabGpu||`A100`,python:`colab-managed`,workspace:`~/.config/remotedesk/colab_runs`,probe:null}:{id:t,name:U.name||`${U.host} · ${U.runtime}`,host:U.host,runtime:U.runtime,wslDistro:U.runtime===`wsl`?U.wslDistro||`Ubuntu`:``,python:U.python,workspace:U.workspace||(U.runtime===`windows`?`D:\\remote`:`~/.yolo-studio`),probe:U.probe};H?c.profiles=c.profiles.map(e=>e.id===t?n:e):c.profiles.push(n),W.profileId||=t,await o.saveConfig(c),H=null,Y(`已保存计算节点「${n.name}」`,`ok`),st(),$()}),K.querySelectorAll(`[data-node-edit]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=c.profiles.find(t=>t.id===e.dataset.nodeEdit);t&&(H=t.id,U={name:t.name,host:t.host,runtime:t.runtime,wslDistro:t.wslDistro??``,colabGpu:t.colabGpu??`A100`,python:t.python,workspace:t.workspace,weightsDir:t.weightsDir??``,discoveredDistros:t.wslDistro?[t.wslDistro]:[],discoveredPythons:t.runtime===`colab`?[]:[t.python],probe:t.probe??null},t.runtime===`colab`&&!z&&it(!0),$())})}),K.querySelectorAll(`[data-node-probe]`).forEach(e=>{e.addEventListener(`click`,async()=>{let t=c.profiles.find(t=>t.id===e.dataset.nodeProbe);if(t){Y(`正在体检 ${t.name}…`,`info`);try{t.probe=await o.probe(t.host,t.runtime,t.python,t.wslDistro,t.id,t.workspace),Y(`${t.name} 体检完成！`,`ok`),$()}catch(e){Y(e instanceof Error?e.message:String(e),`err`)}}})}),K.querySelectorAll(`[data-node-del]`).forEach(e=>{e.addEventListener(`click`,async()=>{confirm(`确认删除这个计算节点配置？（不会删远程机器任何文件）`)&&(c.profiles=c.profiles.filter(t=>t.id!==e.dataset.nodeDel),await o.saveConfig(c),st(),$())})}),K.querySelectorAll(`[data-hub]`).forEach(e=>{e.addEventListener(`change`,()=>{let t=e.dataset.hub;c.modelHub[t]=e.value.trim(),c.modelHub.weights=[],c.modelHub.scannedAt=null,l=[],$()})}),K.querySelector(`[data-act="browse-hub"]`)?.addEventListener(`click`,()=>{let e=c.modelHub.host||ve();qt({title:`📦 选择预训练权重目录`,host:e,initialPath:c.modelHub.path||L.lastPaths[e]||``,allowHostSwitch:!0,asDatasetHost:!1,onSelect:(e,t)=>{c.modelHub.host=e,c.modelHub.path=t,c.modelHub.weights=[],c.modelHub.scannedAt=null,l=[],$()}})}),K.querySelector(`[data-act="save-scan-hub"]`)?.addEventListener(`click`,async()=>{if(!c.modelHub.host||!c.modelHub.path)return Y(`请先选权重库主机和目录`,`err`);X(`busy`,`正在扫描预训练权重库…`);try{await o.saveConfig(c),l=await o.scanWeights(c.modelHub.host,c.modelHub.path),c.modelHub.weights=l,c.modelHub.scannedAt=Date.now()/1e3,await o.saveConfig(c),st(),X(`happy`,`已记住 ${l.length} 个权重，下次打开无需重扫！`),Y(`扫描完成并已本地记住（${l.length} 个权重）`,`ok`),$()}catch(e){X(`err`),Y(e instanceof Error?e.message:String(e),`err`)}})}async function Wt(e,t){let n=await o.discoverWorkspace(e,t,!0),r={host:n.host,path:n.rootPath,scannedAt:n.scannedAt,elapsedMs:n.elapsedMs,totalProjects:n.totalProjects,totalDatasets:n.totalDatasets,projects:n.projects,recommendations:n.recommendations};return c.projectRoot=r,n}async function Gt(e,t){let n=t.projectName===t.folderLabel?t.folderLabel:`${t.projectName} / ${t.folderLabel}`,r=t.projectName===t.folderLabel?t.folderLabel:`${t.projectName}-${t.folderLabel}`;W.datasetHost=e,W.datasetPath=t.path,(t.detectedTask===`hbb`||t.detectedTask===`obb`||t.detectedTask===`seg`||t.detectedTask===`pose`)&&(W.task=t.detectedTask),t.poseKpts&&(W.poseKpts=[t.poseKpts[0],t.poseKpts[1]]),W.classNames={...t.classNames||{}},!W.iterateFrom&&(!W.name||W.name===ue)&&(ue=r,W.name=r);let i=`${e}::${t.path}`,a=F.get(i),s=a&&a.samples.length>0?a:oe(e,t);W.datasetScan=s,a||F.set(i,s),p=`compose`,st(),Z(),Q();let c=Object.values(t.classNames||{}),l=c.length?`${c.length} 类 (${c.slice(0,3).join(`, `)}${c.length>3?`…`:``})`:`未匹配类名`,u=t.classNamesSource?` · ${t.classNamesSource}`:``;Y(`✨ 已智能匹配：${n} · ${t.detectedTask.toUpperCase()} · ${l}${u}`,`ok`),X(`happy`,`智能匹配 ${n} (${t.detectedTask.toUpperCase()}) ✨`),be(e,t.path,n,s).catch(()=>{}),(!a||!a.samples.length)&&o.scanDataset(e,t.path).then(r=>{F.set(`${e}::${r.path}`,r),F.set(i,r),be(e,r.path,n,r).catch(()=>{}),W.datasetHost===e&&(W.datasetPath===t.path||W.datasetPath===r.path)&&(W.datasetScan=r,W.datasetPath=r.path,Object.keys(r.classNames).length>=Object.keys(W.classNames).length&&(W.classNames={...r.classNames}),p===`compose`&&Q())}).catch(()=>{})}function Kt(){let e=J.querySelector(`.rd-sub`),t=J.querySelector(`.rd-host-sel`),r=J.querySelector(`.rd-path-inp`),i=J.querySelector(`.rd-browse`),a=J.querySelector(`.rd-scan-btn`),o=J.querySelector(`.rd-search`),l=Array.from(J.querySelectorAll(`[data-rd-task]`)),u=J.querySelector(`.rd-body`),d=J.querySelector(`.rd-close`),f=J.querySelector(`.rd-cancel`),m=c.projectRoot,h=new Set(s.map(e=>e.name)),g=(m?.host&&h.has(m.host)?m.host:``)||ve()||s[0]?.name||``;t.innerHTML=s.map(e=>`<option value="${T(e.name)}">${T(e.name)}${e.hostname?` (${T(e.hostname)})`:``}</option>`).join(``),t.value=g;let _=!!(m?.path&&/^\/[A-Za-z]:/.test(m.path));r.value=m?.path?n(m.path,_):``,o.value=``;let v=`all`,y=new Set,b=!1;function x(e){b=e,J.dataset.loading=e?`1`:`0`,a.disabled=e,a.textContent=e?`🛰️ 探测中…`:`🛰️ 立即探测`}function S(e,t){if(v!==`all`&&e.detectedTask!==v)return!1;if(!t)return!0;let n=Object.values(e.classNames||{}).join(` `).toLowerCase();return e.projectKey.toLowerCase().includes(t)||e.folderLabel.toLowerCase().includes(t)||e.relPath.toLowerCase().includes(t)||n.includes(t)||e.detectedTask.toLowerCase().includes(t)}function ee(e){let t=Object.values(e.classNames||{}),n=t.slice(0,5).map(e=>`<span class="rd-cls-tag">${T(e)}</span>`).join(``),r=t.length>5?`<span class="rd-cls-tag">+${t.length-5}</span>`:``,i=e.classNamesSource?`<span class="rd-cls-src" title="自动匹配的类名文件">📄 ${T(e.classNamesSource)}</span>`:``;return`<div class="rd-cls-list">${n||`<span class="rd-cls-tag">未命名</span>`}${r}${i}</div>`}function C(){let t=c.projectRoot;if(t?.path&&t.projects.length){let r=/^\/[A-Za-z]:/.test(t.path),i=t.elapsedMs?` · 耗时 ${(t.elapsedMs/1e3).toFixed(1)}s`:``,a=t.scannedAt?` · 上次探测 ${O(t.scannedAt)}`:``;e.textContent=`${t.host} · ${n(t.path,r)} · ${t.totalProjects??t.projects.length} 项目 / ${t.totalDatasets??0} 数据集${i}${a}`}else e.textContent=`指定存放所有 YOLO 项目的母文件夹，一键探测最新标注目录、任务类型与类名`;if(l.forEach(e=>e.classList.toggle(`active`,e.dataset.rdTask===v)),!t||!t.projects.length){u.innerHTML=`<div class="rd-empty">
					<h4>🛰️ 还没有探测过项目母文件夹</h4>
					<p>在上方选择数据所在主机（如 <code>Shenggu_PC</code>），点击 <b>📂 选目录</b> 指定母文件夹（例如 <code>D:\\SundayLearning</code>），再点 <b>🛰️ 立即探测</b>。</p>
					<p>雷达会自动跳过空模板夹与非数据目录，按最新标注时间排序，并智能匹配 <code>class.txt</code> / <code>classes.txt</code> / 同名 <code>.txt</code> 类名文件与 HBB / OBB / Seg / Pose 任务类型。</p>
				</div>`;return}let r=o.value.trim().toLowerCase(),i=new Map,a=(t.recommendations||[]).filter(e=>S(e,r)),s=[];for(let e of t.projects){let t=e.datasets.filter(e=>S(e,r));if(t.length){s.push({...e,datasets:t});for(let e of t)i.set(e.path,e)}}for(let e of a)i.set(e.path,e);if(!s.length){u.innerHTML=`<div class="rd-empty">
					<h4>🔍 没有匹配 “${T(o.value.trim()||v.toUpperCase())}” 的数据集</h4>
					<p>试试清空关键词或切换回「全部」任务类型，也可以点击上方 <b>🛰️ 立即探测</b> 刷新最新文件夹。</p>
				</div>`;return}let d=a.length?`<section>
						<div class="rd-sec-head">
							<h4>🔥 最新活跃推荐</h4>
							<span>按最近标注时间智能排序 · 点击即填入</span>
						</div>
						<div class="rd-rec-grid">
							${a.slice(0,6).map(e=>{let n=W.datasetHost===t.host&&W.datasetPath===e.path,r=e.detectedTask===`mixed`||e.detectedTask===`unknown`?`hbb`:e.detectedTask;return`<button type="button" class="rd-rec-card ${n?`current`:``}" data-rd-pick="${T(e.path)}">
										<div class="rd-rc-top">
											<span class="rd-rc-proj" title="${T(e.relPath)}">${T(e.projectKey)}</span>
											<span class="rd-rc-fresh">🕒 ${O(e.latestMtime)}</span>
										</div>
										<div class="rd-rc-main">
											<span class="rd-rc-folder">📁 ${T(e.folderLabel)}</span>
											<span class="pill pill-task-${r}">${T(e.detectedTask.toUpperCase())}</span>
										</div>
										<div class="rd-rc-stats">
											<span>🖼️ <b>${e.totalImages}</b> 图（<b>${e.labeledImages}</b> 已标）</span>
											<span>${E(e.totalBytes)}</span>
										</div>
										${ee(e)}
									</button>`}).join(``)}
						</div>
					</section>`:``,f=`<section>
				<div class="rd-sec-head">
					<h4>🗂️ 全部探测到的项目（${s.length} 个项目 · ${s.reduce((e,t)=>e+t.datasets.length,0)} 个标注目录）</h4>
					<span>已自动跳过空模板目录，项目内按最新文件倒序</span>
				</div>
				<div class="rd-proj-list">
					${s.map(e=>{let n=r||y.has(e.projectKey)||e.datasets.length<=4?e.datasets:e.datasets.slice(0,4),i=e.datasets.length-n.length;return`<div class="rd-proj-group">
								<div class="rd-pg-head">
									<div class="rd-pg-title"><span>📦 ${T(e.projectKey)}</span></div>
									<div class="rd-pg-meta">
										<span>${e.datasets.length} 个目录 · ${e.totalImages} 图</span>
										<span>最新 ${O(e.latestMtime)}</span>
									</div>
								</div>
								<div class="rd-ds-rows">
									${n.map(e=>{let n=W.datasetHost===t.host&&W.datasetPath===e.path,r=e.detectedTask===`mixed`||e.detectedTask===`unknown`?`hbb`:e.detectedTask;return`<div class="rd-ds-row ${n?`current`:``}" role="button" tabindex="0" data-rd-pick="${T(e.path)}">
												<div class="rd-ds-left">
													<div class="rd-ds-line1">
														<b>📁 ${T(e.folderLabel)}</b>
														<span class="pill pill-task-${r}">${T(e.detectedTask.toUpperCase())}</span>
														<span class="rd-ds-rel" title="${T(e.relPath)}">${T(e.relPath)}</span>
													</div>
													<div class="rd-ds-line2">
														<span>🖼️ ${e.totalImages} 图（${e.labeledImages} 已标 · ${E(e.totalBytes)}）</span>
														${ee(e)}
													</div>
												</div>
												<div class="rd-ds-right">
													<span class="rd-rc-fresh">${O(e.latestMtime)}</span>
													<button type="button" class="ys-btn ${n?`soft`:`primary`} xs" data-rd-pick="${T(e.path)}">${n?`✓ 当前`:`选用`}</button>
												</div>
											</div>`}).join(``)}
								</div>
								${i>0?`<button type="button" class="rd-pg-more" data-rd-expand="${T(e.projectKey)}">展开其余 ${i} 个标注目录 ▼</button>`:``}
							</div>`}).join(``)}
				</div>
			</section>`;u.innerHTML=d+f,u.querySelectorAll(`[data-rd-pick]`).forEach(e=>{e.addEventListener(`click`,n=>{n.stopPropagation();let r=i.get(e.dataset.rdPick);r&&(J.close(),Gt(t.host,r))})}),u.querySelectorAll(`[data-rd-expand]`).forEach(e=>{e.addEventListener(`click`,()=>{y.add(e.dataset.rdExpand),C()})})}async function te(){let e=t.value.trim(),i=r.value.trim();if(!e)return Y(`请先选择母文件夹所在的 SSH 主机`,`err`);if(!i)return Y(`请先填写或选择母文件夹路径`,`err`);if(!b){x(!0),X(`busy`,`正在高速扫描 ${e} 母文件夹…`);try{let t=await Wt(e,i),a=/^\/[A-Za-z]:/.test(t.rootPath);r.value=n(t.rootPath,a),y.clear(),C(),p===`compose`?Q():p===`nodes`&&$(),X(`happy`,`扫描完成！发现 ${t.totalProjects} 个项目 · ${t.totalDatasets} 个标注目录`),Y(`🛰️ 探测完成（${(t.elapsedMs/1e3).toFixed(1)}s）：${t.totalProjects} 个项目 / ${t.totalDatasets} 个数据集`,`ok`)}catch(e){X(`err`,`项目雷达扫描失败`),Y(e instanceof Error?e.message:String(e),`err`)}finally{x(!1)}}}i.onclick=()=>{let e=t.value||ve();qt({title:`🛰️ 选择项目母文件夹（存放多个 YOLO 项目的根目录）`,host:e,initialPath:r.value.trim()||L.lastPaths[e]||``,allowHostSwitch:!0,asDatasetHost:!0,onSelect:(e,i)=>{t.value=e;let a=/^\/[A-Za-z]:/.test(i);r.value=n(i,a),te()}})},a.onclick=()=>te(),r.onkeydown=e=>{e.key===`Enter`&&(e.preventDefault(),te())},o.oninput=()=>C(),l.forEach(e=>{e.onclick=()=>{v=e.dataset.rdTask||`all`,C()}}),d.onclick=()=>J.close(),f.onclick=()=>J.close(),x(!1),C(),J.showModal()}async function qt(r){let a=r.mode===`file`,c=q.querySelector(`.fp-title`),l=q.querySelector(`.fp-host-sel`),u=q.querySelector(`.fp-back`),d=q.querySelector(`.fp-fwd`),f=q.querySelector(`.fp-up`),p=q.querySelector(`.fp-refresh`),m=q.querySelector(`.fp-star`),h=q.querySelector(`.fp-close`),g=q.querySelector(`.fp-cancel`),_=q.querySelector(`.fp-ok`),v=q.querySelector(`.fp-bookmarks`),y=q.querySelector(`.fp-places`),b=q.querySelector(`.fp-recent`),S=q.querySelector(`.fp-crumbs`),ee=q.querySelector(`.fp-path-form`),C=q.querySelector(`.fp-path`),te=q.querySelector(`.fp-path-cancel`),ne=q.querySelector(`.fp-edit-path`),re=q.querySelector(`.fp-filter`),w=q.querySelector(`.fp-list`),ie=q.querySelector(`.fp-dir-meta`),ae=q.querySelector(`.fp-sel-path`);c.textContent=r.title,re.placeholder=a?`🔍 筛选目录或文件…`:`🔍 筛选文件夹…`,l.innerHTML=s.map(e=>`<option value="${T(e.name)}">${T(e.name)}${e.hostname?` (${T(e.hostname)})`:``}</option>`).join(``);let D=r.host||ve()||s[0]?.name||``;l.value=D,l.disabled=r.allowHostSwitch===!1;let O=!1,oe=`/`,k=``,se=[],A=null,j=!1,M=!r.fileFilter,N=[],P=-1,ce=0,le=/\.(jpg|jpeg|png|bmp|webp|tif|tiff)$/i;function ue(e){q.dataset.loading=e?`1`:`0`}function F(){return a?j&&A?A:``:A||k}function pe(){let e=F();ae.textContent=e?`${D} · ${n(e,O)}`:a?`请先点选一个目标文件`:`—`,_.textContent=a?`✓ 选用此文件`:A?`✓ 选用选中文件夹`:`✓ 选用当前目录`,_.disabled=!e,u.disabled=P<=0,d.disabled=P<0||P>=N.length-1;let t=!!(k&&L.bookmarks.some(e=>e.host===D&&e.path===k));m.classList.toggle(`starred`,t),m.textContent=t?`★ 已收藏`:`☆ 收藏`}function I(){L.bookmarks.length?(v.innerHTML=L.bookmarks.map((e,t)=>`<div class="fp-side-row ${e.host===D&&e.path===k?`active`:``}">
							<button type="button" class="fp-side-btn" data-bm="${t}" title="${T(e.host)} · ${T(e.path)}">
								<i>⭐</i><span>${T(e.label)}</span><small>${T(e.host)}</small>
							</button>
							<button type="button" class="fp-side-del" data-bm-del="${t}" title="取消收藏">×</button>
						</div>`).join(``),v.querySelectorAll(`[data-bm]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=L.bookmarks[Number(e.dataset.bm)];t&&(t.host===D?R(t.path,!0):ge(t.host,t.path))})}),v.querySelectorAll(`[data-bm-del]`).forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation(),L.bookmarks.splice(Number(e.dataset.bmDel),1),_e(!0),I(),pe()})})):v.innerHTML=`<div class="fp-side-empty">点右上「☆ 收藏」钉住常用目录</div>`;let e=[{icon:`🏠`,label:`家目录`,path:oe}];if(O)for(let t of[`C`,`D`,`E`,`F`])e.push({icon:`💽`,label:`${t}: 盘`,path:`/${t}:/`});else e.push({icon:`🗂️`,label:`根目录 /`,path:`/`});y.innerHTML=e.map(e=>`<div class="fp-side-row ${k.replace(/\/+$/,``)===e.path.replace(/\/+$/,``)?`active`:``}">
						<button type="button" class="fp-side-btn" data-place="${T(e.path)}"><i>${e.icon}</i><span>${T(e.label)}</span></button>
					</div>`).join(``),y.querySelectorAll(`[data-place]`).forEach(e=>{e.addEventListener(`click`,()=>R(e.dataset.place,!0))});let t=Object.entries(L.lastPaths).filter(([,e])=>!!e).slice(0,6);t.length?(b.innerHTML=t.map(([e,t])=>{let n=t.replace(/\/+$/,``).split(`/`).pop()||t;return`<div class="fp-side-row ${e===D&&t===k?`active`:``}">
							<button type="button" class="fp-side-btn" data-rec-h="${T(e)}" data-rec-p="${T(t)}" title="${T(e)} · ${T(t)}">
								<i>🕒</i><span>${T(n)}</span><small>${T(e)}</small>
							</button>
						</div>`}).join(``),b.querySelectorAll(`[data-rec-h]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.recH,n=e.dataset.recP;t===D?R(n,!0):ge(t,n)})})):b.innerHTML=`<div class="fp-side-empty">浏览后自动记住</div>`}function me(){let e=k.replace(/\/+$/,``),t=[];if(O&&/^\/[A-Za-z]:/.test(k)){let n=e.split(`/`).filter(Boolean),r=``;for(let e=0;e<n.length;e++)r+=`/`+n[e],t.push({label:e===0?`${n[e]}\\`:n[e],path:e===0?`${r}/`:r})}else{t.push({label:`/`,path:`/`});let n=e.split(`/`).filter(Boolean),r=``;for(let e of n)r+=`/`+e,t.push({label:e,path:r})}S.innerHTML=t.map((e,n)=>`${n>0?`<span class="fp-crumb-sep">›</span>`:``}<button type="button" class="fp-crumb ${n===t.length-1?`last`:``}" data-cp="${T(e.path)}">${T(e.label)}</button>`).join(``),S.scrollLeft=S.scrollWidth,S.querySelectorAll(`.fp-crumb`).forEach(e=>{e.addEventListener(`click`,()=>R(e.dataset.cp,!0))})}function he(){let e=re.value.trim().toLowerCase(),n=se.filter(t=>(t.type===`dir`||t.type===`dir-link`)&&(!e||t.name.toLowerCase().includes(e))),i=se.filter(e=>e.type===`dir`||e.type===`dir-link`),o=se.filter(e=>e.type!==`dir`&&e.type!==`dir-link`),s=a?o.filter(t=>e&&!t.name.toLowerCase().includes(e)?!1:!M&&r.fileFilter&&!e?r.fileFilter.test(t.name):!0):[],c=a&&!M&&r.fileFilter&&!e?Math.max(0,o.length-s.length):0,l=o.filter(e=>le.test(e.name)).length,u=o.filter(e=>/\.txt$/i.test(e.name)).length;if(!n.length&&!s.length)w.innerHTML=`<div class="fp-empty">${e?`没有名称包含 “${T(e)}” 的项目`:a?c?`当前目录没有匹配筛选的文件（另有 <b>${c}</b> 个其它文件，可点下方「显示全部」）`:`此目录下没有子文件夹或可选文件`:l||u?`这里已是底层数据目录（含 <b>${l}</b> 张图片、<b>${u}</b> 个 .txt）<br/>直接点右下角 <b>✓ 选用当前目录</b> 即可！`:`此目录下没有子文件夹`}</div>`;else{let e=n.map((e,n)=>{let r=t(k,e.name),i=!j&&A===r?`selected`:``;return`<div class="fp-item ${i}" style="--i:${Math.min(n,16)}" role="option" aria-selected="${i?`true`:`false`}" data-full="${T(r)}" data-kind="dir">
							<div class="fp-item-name"><i>📁</i><span>${T(e.name)}</span></div>
							<div class="fp-item-acts">
								<button type="button" class="ys-btn soft xs" data-fp-open="${T(r)}">进入</button>
								${a?``:`<button type="button" class="ys-btn primary xs" data-fp-pick="${T(r)}">✓ 选用</button>`}
							</div>
						</div>`}).join(``),r=s.map((e,r)=>{let i=t(k,e.name),a=j&&A===i?`selected`:``,o=/python/i.test(e.name)?`🐍`:/\.(pt|onnx|engine)$/i.test(e.name)?`📦`:`📄`;return`<div class="fp-item is-file ${a}" style="--i:${Math.min(n.length+r,20)}" role="option" aria-selected="${a?`true`:`false`}" data-full="${T(i)}" data-kind="file">
							<div class="fp-item-name"><i>${o}</i><span class="mono">${T(e.name)}</span>${e.size?`<small class="fp-fsize">${E(e.size)}</small>`:``}</div>
							<div class="fp-item-acts">
								<button type="button" class="ys-btn primary xs" data-fp-pick="${T(i)}">✓ 选用</button>
							</div>
						</div>`}).join(``);w.innerHTML=e+r,w.querySelectorAll(`.fp-item`).forEach(e=>{let t=e.dataset.full,n=e.dataset.kind===`file`;e.addEventListener(`click`,e=>{e.target.closest(`button`)||(A===t&&j===n?(A=null,j=!1):(A=t,j=n),w.querySelectorAll(`.fp-item`).forEach(e=>{let t=e.dataset.full===A&&e.dataset.kind===`file`===j;e.classList.toggle(`selected`,t),e.setAttribute(`aria-selected`,t?`true`:`false`)}),pe())}),e.addEventListener(`dblclick`,()=>{n?be(t):R(t,!0)})}),w.querySelectorAll(`[data-fp-open]`).forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation(),R(e.dataset.fpOpen,!0)})}),w.querySelectorAll(`[data-fp-pick]`).forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation(),be(e.dataset.fpPick)})})}let d=a&&r.fileFilter?`<button type="button" class="fp-meta-toggle">${M?`仅看匹配文件`:`显示全部文件 (${o.length})`}</button>`:``;ie.innerHTML=`<span>本层：<b>${i.length}</b> 个文件夹${l?` · <b>${l}</b> 张图片`:``}${u?` · <b>${u}</b> 个 .txt`:``}${o.length&&!l&&!u?` · <b>${o.length}</b> 个文件`:``} ${d}</span><span>${a?`双击文件夹进入 · 双击文件选用`:`单击高亮 · 双击进入`}</span>`,ie.querySelector(`.fp-meta-toggle`)?.addEventListener(`click`,()=>{M=!M,he()})}async function R(e,t,n=!1,i=!1){let a=++ce,s=`${D}::${e}`;ue(!0);try{let i=!n&&de.has(s)?de.get(s):await o.listDir(D,e);return a===ce&&(de.set(s,i),k=e,se=i,A=null,j=!1,re.value=``,ee.hidden=!0,S.hidden=!1,t&&(N=N.slice(0,P+1),N[N.length-1]!==e&&(N.push(e),P=N.length-1)),L.lastPaths[D]=e,r.asDatasetHost&&(L.datasetHost=D),x.set(L),me(),he(),I(),pe(),w.scrollTop=0,!0)}catch(e){return a===ce&&(i||(Y(e instanceof Error?e.message:String(e),`err`),k||(w.innerHTML=`<div class="fp-err">${T(e instanceof Error?e.message:String(e))}</div>`))),!1}finally{a===ce&&ue(!1)}}async function ge(t,n){D=t,l.value=t,N=[],P=-1,A=null,j=!1,ue(!0);try{let r=fe.get(t);r||(r=await o.connect(t),fe.set(t,r)),O=r.windows,oe=r.home;let a=n?e(n,O):L.lastPaths[t]?e(L.lastPaths[t],O):oe,s=await R(a,!0,!1,a!==oe);if(!s&&a!==oe){let e=i(a);e&&e!==a&&(s=await R(e,!0,!1,e!==oe))}!s&&a!==oe&&await R(oe,!0)}catch(e){ue(!1),w.innerHTML=`<div class="fp-err">无法连接 ${T(t)}：${T(e instanceof Error?e.message:String(e))}</div>`}}function be(e){if(!e)return;ye(D,i(e)||e,!!r.asDatasetHost),q.close();let t=r.nativePathResult?n(e,O):e;r.onSelect(D,t)}l.onchange=()=>ge(l.value),u.onclick=()=>{P>0&&(P--,R(N[P],!1))},d.onclick=()=>{P<N.length-1&&(P++,R(N[P],!1))},f.onclick=()=>k&&R(i(k),!0),p.onclick=()=>k&&R(k,!1,!0),m.onclick=()=>{if(!k)return;let e=L.bookmarks.findIndex(e=>e.host===D&&e.path===k);if(e>=0)L.bookmarks.splice(e,1),Y(`已取消收藏该目录`,`info`);else{let e=k.replace(/\/+$/,``).split(`/`).pop()||k;L.bookmarks.unshift({host:D,path:k,label:e}),Y(`已收藏目录「${e}」到左侧快捷栏`,`ok`)}_e(!0),I(),pe()},ne.onclick=()=>{C.value=n(k,O),S.hidden=!0,ee.hidden=!1,C.focus(),C.select()},te.onclick=()=>{ee.hidden=!0,S.hidden=!1},ee.onsubmit=t=>{t.preventDefault();let n=C.value.trim();n&&R(e(n,O),!0)},re.oninput=()=>he(),_.onclick=()=>be(F()),h.onclick=()=>q.close(),g.onclick=()=>q.close();let xe=e=>{q.open&&document.activeElement!==C&&document.activeElement!==re&&(e.key===`Enter`&&A?(e.preventDefault(),j?be(A):R(A,!0)):e.key===`Backspace`&&k&&(e.preventDefault(),R(i(k),!0)))};window.addEventListener(`keydown`,xe),q.onclose=()=>{window.removeEventListener(`keydown`,xe),_e(!0)},w.innerHTML=`<div class="fp-empty">正在读取 ${T(D||`远程主机`)} 目录…</div>`,ie.innerHTML=``,ae.textContent=`—`,q.showModal(),I(),D?ge(D,r.initialPath):w.innerHTML=`<div class="fp-err">请先在上方选择一台 SSH 主机</div>`}function Jt(e,t){let n=e??W.datasetScan,r=t??W.classNames;if(!n||!n.samples.length)return;let i=0,a=null,s=n.detectedTask===`hbb`||n.detectedTask===`obb`||n.detectedTask===`seg`||n.detectedTask===`pose`?n.detectedTask:W.task,c=Je.querySelector(`.pv-canvas`),l=Je.querySelector(`.pv-info`),u=Je.querySelector(`.pv-prev`),d=Je.querySelector(`.pv-next`),f=Je.querySelector(`.pv-filter`);f.innerHTML=`<option value="all">全部样本 (${n.samples.length})</option>`+Object.entries(r).sort((e,t)=>Number(e[0])-Number(t[0])).map(([e,t])=>`<option value="${e}">仅含类别 ${e}: ${T(t)}</option>`).join(``);let p=()=>{let e=f.value;if(e===`all`)return n.samples;let t=Number(e);return n.samples.filter(e=>e.classes.includes(t))};async function h(){let e=p();if(!e.length){l.textContent=`该筛选下没有样本`;return}i=(i%e.length+e.length)%e.length;let t=e[i];l.textContent=`[${i+1}/${e.length}] ${t.name} · 加载中…`,a?.(),a=null;try{let[{url:u,revoke:d},f]=await Promise.all([o.rawImageUrl(n.host,t.imagePath),t.labelPath?o.readText(n.host,t.labelPath).catch(()=>``):Promise.resolve(``)]);a=d;let p=new Image;p.onload=()=>{let a=m(c,p,f,s,r,n.poseKpts??W.poseKpts);l.textContent=`[${i+1}/${e.length}] ${t.name} · ${p.naturalWidth}×${p.naturalHeight} · ${a} 个目标 (${s.toUpperCase()})`},p.src=u}catch(e){l.textContent=`加载失败：${e instanceof Error?e.message:String(e)}`}}u.onclick=()=>{i--,h()},d.onclick=()=>{i++,h()},f.onchange=()=>{i=0,h()};let g=e=>{Je.open&&(e.key===`ArrowLeft`?(i--,h()):e.key===`ArrowRight`&&(i++,h()))};window.addEventListener(`keydown`,g),Je.onclose=()=>{window.removeEventListener(`keydown`,g),a?.()},Je.showModal(),h()}function Yt(e,t){let n=Ye.querySelector(`img`),r=Ye.querySelector(`.lb-cap`);n.src=e,r.textContent=t,Ye.showModal()}Ye.addEventListener(`click`,e=>{e.target===Ye&&Ye.close()}),r.querySelector(`[data-nav="compose"]`)?.addEventListener(`click`,()=>mt(`compose`)),r.querySelector(`[data-nav="nodes"]`)?.addEventListener(`click`,()=>mt(`nodes`)),r.querySelectorAll(`.ys-filter-btn`).forEach(e=>{e.addEventListener(`click`,()=>{_=e.dataset.filter,Z()})}),r.querySelector(`[data-act="refresh-runs"]`)?.addEventListener(`click`,async()=>{X(`busy`,`正在刷新远程任务状态…`);try{d=await o.listRuns(!0),Z(),p===`run`&&y&&await Nt(!0),Y(`已同步所有节点任务状态`,`ok`),X(`happy`,`状态已同步 ✨`)}catch(e){X(`err`),Y(e instanceof Error?e.message:String(e),`err`)}});let Xt=qe.querySelector(`.cd-url`),Zt=qe.querySelector(`.cd-token`),Qt=qe.querySelector(`.cd-error`);function $t(e){let t=e.match(/#?.*server=([^&\s]+)&token=([^&\s]+)/)??e.match(/token=([^&\s]+)/);return t?t.length>=3?(Xt.value=decodeURIComponent(t[1]),Zt.value=decodeURIComponent(t[2]),!0):(Zt.value=decodeURIComponent(t[1]),!0):!1}Xt.addEventListener(`input`,()=>$t(Xt.value.trim())),Zt.addEventListener(`input`,()=>$t(Zt.value.trim())),Re.addEventListener(`click`,()=>{let e=C.get();Xt.value=e?.url??`http://127.0.0.1:8765`,Zt.value=e?.token??``,Qt.textContent=``,qe.showModal()}),qe.querySelector(`form`)?.addEventListener(`submit`,async e=>{if(e.submitter?.value===`cancel`)return;e.preventDefault(),$t(Xt.value.trim()),$t(Zt.value.trim());let t=Xt.value.trim(),n=Zt.value.trim();if(!t){Qt.textContent=`请填写服务地址（如 http://127.0.0.1:8765）`;return}if(!n){Qt.textContent=`请填写访问令牌 Token（或直接把菜单栏 Copy Link 的整条链接粘贴进来）`;return}Qt.textContent=`正在连接…`;let r=await nt(t,n,!1);r?Qt.textContent=r:qe.close()}),ze.addEventListener(`click`,()=>{C.set(null),tt(new u)}),(async()=>{let e=$e();if(e&&!await nt(e.url,e.token,!1))return;let t=C.get();(!t||await nt(t.url,t.token,!0))&&await tt(new u)})()}var M=document.querySelector(`.yolo-studio`);M&&j(M);