/* Lance toutes les suites de tests et renvoie un code de sortie non nul si l'une échoue. */
const { execSync } = require('child_process');
const path = require('path');
const suites = ['logic.test.js', 'dom.test.js', 'render.test.js'];
let failed = false;
for(const s of suites){
  console.log('\n\x1b[1m\x1b[36m▶ '+s+'\x1b[0m');
  try {
    execSync('node ' + path.join(__dirname, s), { stdio:'inherit' });
  } catch(e){
    failed = true;
  }
}
console.log('\n' + '='.repeat(50));
if(failed){ console.log('\x1b[31m\x1b[1m✗ Au moins une suite a échoué.\x1b[0m'); process.exit(1); }
console.log('\x1b[32m\x1b[1m✓ TOUTES LES SUITES PASSENT.\x1b[0m');
