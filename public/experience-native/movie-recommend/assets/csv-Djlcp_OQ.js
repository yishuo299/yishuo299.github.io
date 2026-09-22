function u(a,r,o){const l=o.map(n=>n.label).join(","),s=r.map(n=>o.map(p=>{let e=n[p.key];return e==null&&(e=""),e=String(e).replace(/"/g,'""'),/[",\n]/.test(e)&&(e='"'+e+'"'),e}).join(",")),i="\uFEFF"+[l,...s].join(`
`),f=new Blob([i],{type:"text/csv;charset=utf-8;"}),c=URL.createObjectURL(f),t=document.createElement("a");t.href=c,t.download=a,t.click(),URL.revokeObjectURL(c)}export{u as e};
