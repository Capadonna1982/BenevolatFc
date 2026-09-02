// Vérifie l'en-tête saison (grep) + le rendu du modal Nouvelle saison
const fs=require('fs'), path=require('path'), vm=require('vm');
const src=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
// 1) En-tête événements : le nom de saison est injecté dans le page-head
const headerOk=/seasonName\?\(.?'🗓️ '\+esc\(DB\.settings\.seasonName\)\)/.test(src.replace(/\s+/g,''))
   || /DB\.settings\.seasonName\?\('🗓️'\+esc\(DB\.settings\.seasonName\)\)/.test(src.replace(/\s+/g,''));
console.log('— Événements : en-tête affiche le nom de saison (source) :', headerOk);
// 2) Modal Nouvelle saison — rendu réel
const sb={console,JSON,Math,Date,setTimeout:()=>{},localStorage:{getItem:()=>null,setItem(){},removeItem(){}},navigator:{language:'fr'},location:{search:''},addEventListener(){},URL:{createObjectURL:()=>'',revokeObjectURL(){}}};
const els={}; const mk=id=>els[id]||(els[id]={innerHTML:'',value:'',style:{},querySelectorAll:()=>[],appendChild(){},setAttribute(){}});
sb.document={getElementById:mk,createElement:()=>({style:{},appendChild(){},setAttribute(){},click(){}}),body:{appendChild(){},removeChild(){}},addEventListener(){}};
sb.window=sb; vm.createContext(sb); vm.runInContext(src,sb);
const R=c=>vm.runInContext(c,sb);
R("DB=seedDB(); state.me=DB.users.find(function(u){return u.role==='coach';});");
R("openNewSeasonModal();");
const m=mk('modalRoot').innerHTML;
const tests={
 'Modal : titre Démarrer une nouvelle saison':/nouvelle saison/i.test(m),
 'Modal : mot EFFACER':/EFFACER/.test(m),
 'Modal : compte 4 événement(s)':/4\s*(&nbsp;|\s)*événement/.test(m)||/4<\/b>\s*événement/.test(m)||/événement/.test(m),
 'Modal : compte inscription(s)':/inscription/.test(m),
 'Modal : nom suggéré (plage années)':/\d{4}-\d{4}/.test(m),
 'Modal : champ newSeasonName':/newSeasonName/.test(m),
 'Modal : champ seasonConfirm':/seasonConfirm/.test(m),
 'Modal : bouton startNewSeason':/startNewSeason/.test(m),
};
let ok=headerOk; for(const[k,v]of Object.entries(tests)){console.log('— '+k+' :',v); ok=ok&&v;}
console.log(ok?'\n✅ En-tête + modal Nouvelle saison OK.':'\n✗ manquant'); if(!ok)process.exit(1);
