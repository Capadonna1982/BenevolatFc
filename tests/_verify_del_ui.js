// Vérifie que les boutons de suppression apparaissent dans la vue Effectif
const fs=require('fs'), path=require('path'), vm=require('vm');
const src=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
const sb={console,JSON,Math,Date,setTimeout:()=>{},localStorage:{getItem:()=>null,setItem(){},removeItem(){}},navigator:{language:'fr'},location:{search:''},addEventListener(){},URL:{createObjectURL:()=>'',revokeObjectURL(){}}};
const els={}; const mk=id=>els[id]||(els[id]={innerHTML:'',value:'',style:{},querySelectorAll:()=>[],appendChild(){},setAttribute(){}});
sb.document={getElementById:mk,createElement:()=>({style:{},appendChild(){},setAttribute(){},click(){}}),body:{appendChild(){},removeChild(){}},addEventListener(){}};
sb.window=sb; vm.createContext(sb); vm.runInContext(src,sb);
const R=c=>vm.runInContext(c,sb);
R("DB=seedDB(); state.me=DB.users.find(function(u){return u.role==='coach';});");
// Ajoute un joueur invité pour tester le bouton d'annulation d'invitation
R("DB.users.push({id:'u_inv9',first:'Test',last:'Invite',email:'t@ex.ca',pass:'x',role:'player',status:'invited'});");
R("_c={innerHTML:''}; renderMembers(_c);");
const html=R("_c.innerHTML");
const checks={
 'Bouton Retirer (confirmDeletePlayer) sur les joueurs':/confirmDeletePlayer\('u_/.test(html),
 'Icône corbeille présente':/🗑️/.test(html),
 'Bouton Copier le lien toujours présent (invités)':/copyInvite\(/.test(html),
 'Bouton annuler invitation (confirmDeletePlayer) sur invités':/confirmDeletePlayer\('u_inv9'\)/.test(html),
};
let ok=true; for(const[k,v]of Object.entries(checks)){console.log('— '+k+' :',v); ok=ok&&v;}
// Confirme aussi la fonction de confirmation produit un modal avec bouton danger
R("_pid=DB.users.find(function(u){return u.role==='player'&&u.status!=='invited';}).id; confirmDeletePlayer(_pid);");
const modalHTML=mk('modalRoot').innerHTML;
const mok=/btn-danger/.test(modalHTML) && /(Retirer|irr[ée]versible)/i.test(modalHTML);
console.log('— Modal de confirmation avec bouton danger :', mok); ok=ok&&mok;
console.log(ok?'\n✅ UI de suppression de joueurs OK.':'\n✗ manquant'); if(!ok)process.exit(1);
