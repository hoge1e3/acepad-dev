function loadPromise(n){
    return new Promise((s,e)=>{ 
		n.onload=s;
		n.onerror=e;
    });
}
export async function appendNode(src,dst,opt) {
    opt.doc=opt.doc||document;
    let {doc,open,resolve,toURL}=opt;
    const colon=":";
	const c=src.childNodes;
	const loadings=[];
	//console.log(src,dst);
	for(let n of c){
	    switch (n.nodeType) {
		case Node.ELEMENT_NODE:
			let nn=doc.createElement(n.tagName);
			let at=Array.from(n.attributes);
			// should charset must be set first than src
			const names=at.map(a=>a.name);
			var idx=names.indexOf("charset");
			if (idx>=0) {
				names.splice(idx,1);
				names.unshift("charset");
			}
			let w;
			for(let name of names) {
				let value=n.getAttribute(name);
				let isrel=FS.PathUtil.isRelativePath(value);
				let tag=n.tagName.toLowerCase();
				if (name=="href" && isrel) {
				    if(tag=="a"){
				        let f=resolve(value);

				        nn.addEventListener(
				            "click",
				        ()=>{
				            open(f);
				        });
				        value="javascript"+colon+";";
				    }else{
						value=toURL(value,n);
						
				    }
				}
				if (name=="src") {
					if(isrel)value=toURL(value,n);
					if (tag=="script") {
					    //alert(value);
					    w=loadPromise(nn);
					}
				}
				nn.setAttribute(name, value);
			}
			dst.appendChild(nn);
			await w;
			await appendNode(n ,nn,opt);
			break;
		case Node.TEXT_NODE:
			dst.appendChild(doc.createTextNode(n.textContent));
			break;
		}
	}
}