const fs=require('fs');const vm=require('vm');
const src=fs.readFileSync('app.js','utf8');
const store={};
const el=()=>{const e={_h:'',get innerHTML(){return this._h;},set innerHTML(v){this._h=v;},style:{},classList:{add(){},remove(){},toggle(){},contains(){return false;}},value:'',checked:false,appendChild(){},querySelector(){return el();},querySelectorAll(){return[];},addEventListener(){},setAttribute(){},getAttribute(){return null;},focus(){},click(){},remove(){},dataset:{}};return e;};
const doc={getElementById(){return el();},querySelector(){return el();},querySelectorAll(){return[];},createElement(){return el();},addEventListener(){},body:el(),documentElement:el()};
const win={addEventListener(){},location:{hash:'',search:''},matchMedia(){return{matches:false,addEventListener(){}};}};
const ctx={window:win,document:doc,localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>{store[k]=String(v);},removeItem:k=>{delete store[k];}},navigator:{language:'fr'},console,setTimeout,clearTimeout,alert(){},confirm(){return true;},btoa:s=>Buffer.from(s,'binary').toString('base64'),atob:s=>Buffer.from(s,'base64').toString('binary'),Date,Math,JSON,performance:{now:()=>Date.now()}};
ctx.globalThis=ctx;vm.createContext(ctx);vm.runInContext(src,ctx);
const run=c=>vm.runInContext(c,ctx);
run("loadDB(); setLang('fr');");
let ok=0,ko=0;const ck=(n,c)=>{if(c){ok++;console.log('  OK  '+n);}else{ko++;console.log('  KO  '+n);}};

// 1. Modal contient le champ Instruction générale
const modalHTML=run("(function(){ var out=''; var _m=modal; modal=function(title,body,btns){out=body;}; openActivityModal('a_marq'); modal=_m; return out; })()");
ck('modal a un champ #acInstr', /id="acInstr"/.test(modalHTML));
ck('modal libelle Instruction générale', /Instruction générale/.test(modalHTML));
ck('modal pré-rempli avec instr seed', /table des officiels|feuille/i.test(modalHTML));

// 2. Panneau agrandi montre l'instruction générale
const panel=run("activityDetailHTML(activity('a_marq'))");
ck('panneau agrandi montre Instruction générale', /Instruction générale/.test(panel));
ck('panneau agrandi montre le texte instr', /officiels/i.test(panel));
ck('panneau montre aussi Description du poste', /Description du poste/.test(panel));

console.log(`\n${ko?'✗':'✓'} ${ok} OK / ${ko} KO`);
process.exit(ko?1:0);