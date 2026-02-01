const fs = require('fs');
const path = require('path');
const root = path.join(__dirname,'..');
const cssDir = path.join(root,'src','css');
const dc = path.join(cssDir,'dc.scss');
let dcContent = fs.readFileSync(dc,'utf8');
// Extract import list from dc.scss: find @import line with multiple files
const importLine = dcContent.split(/\r?\n/).find(l => l.trim().startsWith('@import')) || '';
let imports = [];
if(importLine){
  // remove @import and semicolon, split by commas
  let rest = importLine.replace(/^@import\s*/,'').replace(/;\s*$/,'');
  // handle quoted paths
  rest.split(',').forEach(p => {
    p = p.trim().replace(/^"|^'|"$|'$/g,'');
    if(p) imports.push(p);
  });
}
// Ensure theme.scss first if present (dc.scss had theme imported first)
// Also handle a separate @import "./theme.scss" prior to the big line
const headerImports = dcContent.split(/\r?\n/).filter(l=>l.trim().startsWith('@import')).map(l=>l.replace(/^@import\s*/,'').replace(/;\s*$/,''));
let ordered = [];
headerImports.forEach(line=>{
  line.split(',').forEach(p=>{
    p = p.trim().replace(/^"|^'|"$|'$/g,''); if(p) ordered.push(p);
  });
});
if(ordered.length===0) ordered = imports;
console.log('Import order:', ordered);
let cumulative=0;
for(const imp of ordered){
  let impPath = imp.replace(/^\.\/|^\//,'');
  if(!/\.scss$/i.test(impPath)) impPath += '.scss';
  const filePath = path.join(cssDir, impPath);
  if(!fs.existsSync(filePath)){
    console.log('Missing imported file:', filePath); continue;
  }
  const text = fs.readFileSync(filePath,'utf8').split(/\r?\n/);
    const whole = fs.readFileSync(filePath,'utf8');
    const opensFile = (whole.match(/\{/g)||[]).length;
    const closesFile = (whole.match(/\}/g)||[]).length;
    console.log(`  (${imp} braces: opens=${opensFile}, closes=${closesFile}, delta=${opensFile-closesFile})`);
  for(let i=0;i<text.length;i++){
    const line = text[i];
    for(const ch of line){
      if(ch==='{') cumulative++;
      if(ch==='}') cumulative--;
    }
    if(cumulative<0){
      console.log(`Brace underflow at ${imp}:${i+1} (cumulative ${cumulative})`);
      process.exit(0);
    }
    // Report when encountering mixin at top-level while cumulative>0 means inside previous block
    if(line.includes('@mixin')){
      console.log(`Found @mixin in ${imp}:${i+1} (cumulative ${cumulative}) -> ${line.trim()}`);
    }
  }
  console.log(`After ${imp}: cumulative braces = ${cumulative}`);
}
console.log('Final cumulative braces =', cumulative);
if(cumulative!==0) console.log('Warning: unmatched braces overall');
