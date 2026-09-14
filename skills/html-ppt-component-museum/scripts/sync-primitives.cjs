/* Compile original local primitives into the standalone museum. */
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const names=['text-entry.js','sticker-peel.js','scroll-stack.js'];
const files=names.map(name=>path.join(root,'assets/primitives',name));
const javascript=files.map(file=>fs.readFileSync(file,'utf8')).join('\n');
const text=require(files[0]),peel=require(files[1]),stack=require(files[2]);
const css=[text.css,peel.css,stack.SCROLL_STACK_CSS].join('\n');
const target=path.join(root,'assets/component-museum.html');
let html=fs.readFileSync(target,'utf8');
for(const [kind,body] of [['CSS',css],['JS',javascript]]){
 const start='/* LOCAL_PRIMITIVES_'+kind+'_START */',end='/* LOCAL_PRIMITIVES_'+kind+'_END */';
 const a=html.indexOf(start),b=html.indexOf(end);
 if(a<0||b<a)throw new Error('Missing primitive marker '+kind);
 html=html.slice(0,a)+start+'\n'+body+'\n'+html.slice(b);
}
if(process.argv.includes('--check')){if(html!==fs.readFileSync(target,'utf8')){console.error('Embedded primitives are stale');process.exitCode=1}else console.log('Embedded primitives match original sources')}
else{fs.writeFileSync(target,html);console.log('Embedded 3 local primitives')}
