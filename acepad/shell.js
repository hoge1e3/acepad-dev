import {getHome} from './states.js';
import {showWidget} from './iframe.js';
/*global process, require, FS*/
export var sh=(function () {   
    var assert=FS.assert;
    var root=window;
    var Shell={};
    var sh;
    var PathUtil=assert(FS.PathUtil);
    Shell.newCommand=function (name,func) {
        this[name]=func;
    };
    Shell.cd=function (dir) {
        Shell.cwd=resolve(dir,true);
        return Shell.pwd();
    };
    Shell.vars=Object.create(FS.getEnv());
    Shell.mount=function (options, path) {
        //var r=resolve(path);
        if (!options || !options.t) {
            var fst=[];
            for (var k in FS.getRootFS().availFSTypes()) {
                fst.push(k);
            }
            sh.err("-t=("+fst.join("|")+") should be specified.");
            return;
        }
        FS.mount(path,options.t, options);
    };
    Shell.unmount=function (path) {
        FS.unmount(path);
    };
    Shell.fstab=function () {
        var rfs=FS.getRootFS();
        var t=rfs.fstab();
        var sh=this;
        //sh.echo(rfs.fstype()+"\t"+"<Root>");
        t.forEach(function (fs) {
            sh.echo(fs.fstype()+"\t"+(fs.mountPoint||"<Default>"));
        });
    };
    Shell.resolve=resolve;
    function resolve(v, mustExist) {
        var r=resolve2(v);
        if (!FS.SFile.is(r)) {console.log(r," is not file");}
        if (mustExist && !r.exists()) throw new Error(r+": no such file or directory");
        return r;
    }
    function resolve2(v) {
        if (typeof v!="string") return v;
        var c=Shell.cwd;
        if (PathUtil.isAbsolutePath(v)) return FS.resolve(v,c);
        return c.rel(v);
    }
    Shell.isOpt=(v)=>{
        return (v&&typeof v=="object"&&
        !FS.SFile.is(v));
    };
    Shell.popOpt=(a)=>{
        if(Shell.isOpt(a[a.length-1])){
            return a.pop();
        }
        return {};
    };
    
    Shell.pwd=function () {
        this.echo(this.cwd+"");
        return this.cwd+"";
    };
    Shell.ls=function (dir){
    	if (!dir) dir=Shell.cwd;
    	else dir=resolve(dir, true);
        return dir.ls().forEach((n)=>sh.echo(n));
    };
    Shell.cp=function (from ,to ,options) {
        if (!options) options={};
        if (options.v) {
            Shell.echo("cp", from ,to);
            options.echo=Shell.echo.bind(Shell);
        }
        var f=resolve(from, true);
        var t=resolve(to);
        return f.copyTo(t,options);
    };
    Shell.mv=function (from ,to ,options) {
        if (!options) options={};
        if (options.v) {
            Shell.echo("mv", from ,to);
            options.echo=Shell.echo.bind(Shell);
        }
        var f=resolve(from, true);
        var t=resolve(to);
        return f.moveTo(t,options);
    };
    Shell.ln=function (to , from ,options) {
        var f=resolve(from);
        var t=resolve(to, true);
        if (f.isDir() && f.exists()) {
            f=f.rel(t.name());
        }
        if (f.exists()) {
            throw new Error(f+" exists");
        }
        return f.link(t,options);
    };
    Shell.rm=function (file, options) {
        if (!options) options={};
        if (options.notrash) {
            file=resolve(file, false);
            file.removeWithoutTrash();
            return 1;
        }
        file=resolve(file, true);
        if (file.isDir() && options.r) {
            var dir=file;
            var sum=0;
            dir.each(function (f) {
                if (f.exists()) {
                    sum+=Shell.rm(f, options);
                }
            });
            dir.rm();
            return sum+1;
        } else {
            file.rm();
            return 1;
        }
    };
    Shell.mkdir=function (file) {
        file=resolve(file, false);
        if (file.exists()) throw new Error(file+" : exists");
        return file.mkdir();
    };
    Shell.cat=function (file/*,options*/) {
        file=resolve(file, true);
        return Shell.echo(file.getContent(function (c) {
            if (file.isText()) {
                return c.toPlainText();
            } else {
                return c.toURL();
            }
        }));
    };
    Shell.resolve=function (file) {
        if (!file) file=".";
        file=resolve(file);
        return file;
    };
    Shell.grep=function (pattern, file, options) {
        file=resolve(file, true);
        if (!options) options={};
        if (!options.res) options.res=[];
        if (file.isDir()) {
            file.each(function (e) {
                Shell.grep(pattern, e, options);
            });
        } else {
            if (typeof pattern=="string") {
                file.lines().forEach(function (line, i) {
                    if (line.indexOf(pattern)>=0) {
                        report(file, i+1, line);
                    }
                });
            }
        }
        return options.res;
        function report(file, lineNo, line) {
            if (options.res) {
                options.res.push({file:file, lineNo:lineNo,line:line});
            }
            Shell.echo(file+"("+lineNo+"): "+line);

        }
    };
    Shell.touch=function (f) {
    	f=resolve(f);
    	f.text(f.exists() ? f.text() : "");
    	return 1;
    };
    Shell.setout=function (ui) {
        Shell.outUI=ui;
    };
    Shell.echo=function (...a) {
        let o=Shell.popOpt(a);
        return Promise.all(a).then(function (a) {
            console.log(...a);
            if (Shell.outUI && Shell.outUI.log) {
                Shell.outUI.log(...a);
                if(!o.n){
                    Shell.outUI.log("\n");
                }
            }
        });
    };
    Shell.err=function (e) {
        console.log.apply(console,arguments);
        if (e && e.stack) console.log(e.stack);
        if (Shell.outUI && Shell.outUI.err) Shell.outUI.err.apply(Shell.outUI,arguments);
    };
    Shell.clone= function () {
        var r=Object.create(this);
        r.vars=Object.create(this.vars);
        return r;
    };
    Shell.getvar=function (k) {
        return this.vars[k] || (process && process.env[k]);
    };
    Shell.get=Shell.getvar;
    Shell.set=function (k,v) {
        this.vars[k]=v;
        return v;
    };
    Shell.strcat=function () {
        if (arguments.length==1) return arguments[0];
        var s="";
        for (var i=0;i<arguments.length;i++) s+=arguments[i];
        return s;
    };
    Shell.exists=function (f) {
        f=this.resolve(f);
        return f.exists();
    };
    Shell.dl=function (f) {
        f=this.resolve(f||".");
        return f.download();
    };
    Shell.zip=function () {
        var t=this;
        var a=Array.prototype.slice.call(arguments).map(function (e) {
            if (typeof e==="string") return t.resolve(e);
            return e;
        });
        return FS.zip.zip.apply(FS.zip,a);
    };
    Shell.unzip=function () {
        var t=this;
        var a=Array.prototype.slice.call(arguments).map(function (e) {
            if (typeof e==="string") return t.resolve(e);
            return e;
        });
        return FS.zip.unzip.apply(FS.zip,a);
    };

    Shell.prompt=function () {
        const home=getHome();
        sh.echo(`[${sh.cwd.relPath(home)}]$ `,{n:1});
    };
    Shell.ASYNC={r:"SH_ASYNC"};
    Shell.help=function () {
        for (var k in Shell) {
            var c=Shell[k];
            if (typeof c=="function") {
                Shell.echo(k+(c.description?" - "+c.description:""));
            }
        }
    };
    if (!root.sh) root.sh=Shell;
    sh=Shell;
    if (typeof process=="object") {
        sh.devtool=function () { require('nw.gui').Window.get().showDevTools();};
        sh.cd(process.cwd().replace(/\\/g,"/"));
    } else {
        sh.cd("/");
    }
    var DU=FS.DeferredUtil;
    var envMulti=/\$\{([^\}]*)\}/;
    //var envSingle=/^\$\{([^\}]*)\}$/;
    var F=DU.throwF;
    sh.enterCommand=function (s) {
        if (!this._history) this._history=[];
        this._history.push(s);
        var args=this.parseCommand(s);
        if (this._skipto) {
            if (args[0]=="label") {
                this.label(args[1]);
            } else {
                this.echo("Skipping command: "+s);
            }
        } else {
            return this.evalCommand(args);
        }
    };
    sh.sleep=function (t) {
        var d=new $.Deferred;
        t=parseFloat(t);
        setTimeout(function () {d.resolve();},t*1000);
        return d.promise();
    };
    sh.include=function (f) {
        f=this.resolve(f,true);
        var t=this;
        var ln=f.lines();
        return DU.each(ln,F(function (l) {
            return t.enterCommand(l);
        }));
    };
    /*
    set a 1
    label loop
    echo ${a}
    calc add ${a} 1
    set a ${_}
    goto loop ( calc lt ${a} 10 )
    */
    sh.parseCommand=function (s) {
        var space=/^\s*/;
        var nospace=/^([^\s]*(\\.)*)*/;
        var dq=/^"([^"]*(\\.)*)*"/;
        var sq=/^'([^']*(\\.)*)*'/;
        var lpar=/^\(/;
        var rpar=/^\)/;
        function parse() {
            var a=[];
            while(s.length) {
                s=s.replace(space,"");
                var r;
                if (r=dq.exec(s)) {
                    a.push(expand( unesc(r[1]) ));
                    s=s.substring(r[0].length);
                } else if (r=sq.exec(s)) {
                    a.push(unesc(r[1]));
                    s=s.substring(r[0].length);
                } else if (r=lpar.exec(s)) {
                    s=s.substring(r[0].length);
                    a.push( parse() );
                } else if (r=rpar.exec(s)) {
                    s=s.substring(r[0].length);
                    break;
                } else if (r=nospace.exec(s)) {
                    a.push(expand(unesc(r[0])));
                    s=s.substring(r[0].length);
                } else {
                    break;
                }
            }
            var options,args=[];
            a.forEach(function (ce) {
                var opt=/^-([A-Za-z_0-9]+)(=(.*))?/.exec(ce);
                if (opt) {
                    if (!options) options={};
                    options[opt[1]]=opt[3]!=null ? opt[3] : true;
                } else {
                    if (options) args.push(options);
                    options=null;
                    args.push(ce);
                }
            });
            if (options) args.push(options);
            return args;
        }
        var args=parse();
        return args;
        /*console.log("parsed:",JSON.stringify(args));
        var res=this.evalCommand(args);
        return res;*/
        function expand(s) {
            var r;
            /*if (r=envSingle.exec(s)) {
                return ["get",r[1]];
            }
            if (!(r=envMulti.exec(s))) return s;*/
            var ex=["strcat"];
            while(s.length) {
                r=envMulti.exec(s);
                if (!r) {
                    ex.push(s);
                    break;
                }
                if (r.index>0) {
                    ex.push(s.substring(0,r.index));
                }
                ex.push(["get",r[1]]);
                s=s.substring(r.index+r[0].length);
            }
            if (ex.length==2) return ex[1];
            return ex;
        }
        function unesc(s) {
            return s.replace(/\\(.)/g,function (_,b){
                return b;
            });
        }
    };
    sh.evalCommand=function (expr) {
        var t=this;
        if (expr instanceof Array) {
            if (expr.length==0) return;
            var c=expr.shift();
            var f=this[c];
            if (typeof f!="function") throw new Error(c+": Command not found");
            var a=[];
            while(expr.length) {
                var e=expr.shift();
                a.push( this.evalCommand(e) );
            }
            return $.when.apply($,a).then(F(function () {
                return f.apply(t,arguments);
            }));
        } else {
            return expr;
        }
    };
    sh.calc=function (op) {
        var i=1;
        var r=parseFloat(arguments[i]);
        for(i=2;i<arguments.length;i++) {
            var b=arguments[i];
            switch(op) {
                case "add":r+=parseFloat(b);break;
                case "sub":r-=parseFloat(b);break;
                case "mul":r*=parseFloat(b);break;
                case "div":r/=parseFloat(b);break;
                case "lt":r=(r<b);break;
            }
        }
        this.set("_",r);
        return r;
    };
    sh.history=function () {
        var t=this;
        this._history.forEach(function (e) {
            t.echo(e);
        });
    };
    sh.upload=function (dst){
        return new Promise((s,err)=>{
        let w=showWidget($("<input>").attr({
            type:"file",
        }).on("input",oninput));
        async function oninput(e){
            w.close();
            try{
            let b=await readFile(this.files[0]);
            let f=this.value.split(/[\\\/]/);
            f=f.pop();
            console.log(b,f);
            if(!dst){
                dst=sh.resolve(f);
            }else{
                dst=sh.resolve(dst);
            }
            dst.setBytes(b);
            s(dst);
            }catch(ex){
                err(ex);
            }
        }
            
        });
    };
    function mapArg(args,spec){
        return args.map((a,i)=>
            spec[i]==="f"?
                sh.resolve(a):a);
    }
    sh.addCmd=function (name,f,spec){
        sh[name]=(...args)=>
            f(...mapArg(args,spec));
    };
    function readFile(file) {
        return new Promise(function (succ) {
            var reader = new FileReader();
            reader.onload = function(e) {
                succ(reader.result);
            };
            reader.readAsArrayBuffer(file);
        });
    }
    window.sh=sh;
    return sh;
})();
