const fs = require('fs');
const path = require('path');
const file = path.join(__dirname,'..','src','css','_graphical.scss');
const text = fs.readFileSync(file,'utf8').split(/\r?\n/);
let cum=0;
let lastNonZeroLine=-1;
const cumArr = [];
for(let i=0;i<text.length;i++){
  const line=text[i];
  for(const ch of line){ if(ch==='{') cum++; if(ch==='}') cum--; }
  cumArr.push(cum);
  if(cum!==0) lastNonZeroLine=i+1;
}
console.log('final cumulative:', cum, 'lastNonZeroLine:', lastNonZeroLine);

// find earliest index where for all following lines cum >= final
const final = cum;
let startIdx = -1;
for(let i=0;i<cumArr.length;i++){
  let ok = true;
  for(let j=i;j<cumArr.length;j++){
    if(cumArr[j] < final){ ok = false; break; }
  }
  if(ok){ startIdx = i+1; break; }
}
if(startIdx===-1) console.log('Could not find stable start; showing last nonzero context');
else console.log('Unmatched region appears at or after line', startIdx);

// find first line after startIdx where cum equals final (i.e., returns to baseline)
if(startIdx !== -1){
  let returnLine = -1;
  for(let k = startIdx-1; k < cumArr.length; k++){
    if(cumArr[k] === final){ returnLine = k+1; break; }
  }
  console.log('First line returning to final cumulative after startIdx:', returnLine);
}

console.log('\n--- Context around startIdx ---\n');
const start = Math.max(0,(startIdx||lastNonZeroLine)-10);
const end = Math.min(text.length, (startIdx||lastNonZeroLine)+10);
for(let i=start;i<end;i++){
  console.log((i+1).toString().padStart(4,' ')+': '+text[i]);
}

console.log('\n--- per-line cumulative for first 140 lines ---\n');
let running = 0;
for(let i=0;i<Math.min(140,text.length);i++){
  const line = text[i];
  for(const ch of line){ if(ch==='{') running++; if(ch==='}') running--; }
  console.log((i+1).toString().padStart(4,' ')+" cum="+running+': '+line);
}
