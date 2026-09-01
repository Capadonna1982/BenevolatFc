// Build a self-contained single-file version: inline app.js into index.html
const fs = require('fs');
const path = require('path');
const dir = __dirname;
const html = fs.readFileSync(path.join(dir,'index.html'),'utf8');
const js = fs.readFileSync(path.join(dir,'app.js'),'utf8');
const out = html.replace(
  /<script src="app\.js"><\/script>/,
  '<script>\n' + js + '\n</script>'
);
if(out === html){ console.error('ERROR: script tag not found/replaced'); process.exit(1); }
fs.writeFileSync(path.join(dir,'benevolat-fc.html'), out);
console.log('OK — benevolat-fc.html écrit ('+out.length+' caractères, script inliné)');
