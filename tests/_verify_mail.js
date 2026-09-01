// Vérification de rendu : modale d'aperçu des rappels courriel
const fs=require('fs'), vm=require('vm');
const src=fs.readFileSync('app.js','utf8');
let captured='';
const store={};
const elFactory=()=>({ _h:'', set innerHTML(v){this._h=v; captured=v;}, get innerHTML(){return this._h;},
  classList:{add(){},remove(){},toggle(){},contains(){return false;}}, style:{}, value:'',
  querySelector(){return null;}, querySelectorAll(){return [];}, addEventListener(){}, appendChild(){}, setAttribute(){}, focus(){} });
const sb={ console, Date, Math, JSON, localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>{store[k]=String(v);},removeItem:k=>{delete store[k];}},
  document:{ getElementById:()=>elFactory(), querySelector:()=>elFactory(), querySelectorAll:()=>[], createElement:()=>elFactory(), addEventListener(){}, body:elFactory() },
  window:{addEventListener(){},matchMedia:()=>({matches:false})}, navigator:{language:'fr'}, location:{hash:'',search:''}, setTimeout:()=>0, clearTimeout(){}, btoa:s=>Buffer.from(s,'binary').toString('base64'), atob:s=>Buffer.from(s,'base64').toString('binary'), encodeURIComponent, decodeURIComponent, alert(){}, confirm:()=>true };
sb.window.location=sb.location; sb.globalThis=sb;
vm.createContext(sb); vm.runInContext(src,sb);
const run=code=>vm.runInContext(code,sb);
run("loadDB(); SESSION={uid:DB.users.find(u=>u.role==='coach').id}; lang='fr';");
// inscrire 2 joueurs à n1 (Chaîneur, qty=2) de e_p2
run("var pls=DB.users.filter(u=>u.role==='player'&&u.status!=='invited'); DB.regs=DB.regs.filter(r=>!(r.eid==='e_p2')); DB.regs.push({id:'x1',eid:'e_p2',nid:'n1',pid:pls[0].id,ts:1}); DB.regs.push({id:'x2',eid:'e_p2',nid:'n1',pid:pls[1].id,ts:2});");
run("openReminders('e_p2');");
const checks=[
  ["la modale affiche le titre Rappels", /Rappels\s*—/.test(captured)],
  ["avertissement prototype présent", /aucun courriel r[ée]el/i.test(captured)],
  ["aperçu courriel (email-head) rendu", /email-head/.test(captured)],
  ["contient le lieu", /Stade municipal/.test(captured)],
  ["contient l'instruction spécifique", /veste orange/i.test(captured)],
  ["contient la description du poste", /cha[îi]ne de mesure/i.test(captured)],
  ["note d'intégration (SendGrid/Mailgun)", /SendGrid|Mailgun|SES/.test(captured)],
  ["bouton envoi simulé", /Simuler l'envoi|sendEventReminders/.test(captured)],
];
let ok=0; checks.forEach(([l,p])=>{console.log((p?'✓':'✗')+' '+l); if(p)ok++;});
console.log(`\n${ok}/${checks.length} vérifications de rendu`);
process.exit(ok===checks.length?0:1);
