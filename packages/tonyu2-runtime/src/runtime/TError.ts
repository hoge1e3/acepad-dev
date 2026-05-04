import { SFile } from "@hoge1e3/sfile";
import { SrcMeta } from "./RuntimeTypes";

function isSrcMeta(src:any): src is SrcMeta{
	return src?.src;
}
export function isTError(e:any): e is TError{
	return e?.isTError;
}
export type TError=Error&{
	isTError:true,
	src:{
		path():string,
		name():string,
		text():string,
	},
	pos:number, row:number, col:number, len:number,
	klass?: SrcMeta,
	raise():void,
}
export default function TError(message:string, src: SFile|string|SrcMeta, pos:number, len=0):TError {
	let rc;
	let klass:SrcMeta|null=null;
	let srcFile:TError["src"];
	//const extend=(dst,src)=>{for (var k in src) dst[k]=src[k];return dst;};
	if (typeof src=="string") {
		rc=TError.calcRowCol(src,pos);
		message+=" at "+(rc.row)+":"+(rc.col);
		return Object.assign(new Error(message),{
			isTError:true as true,
			src:{
				path:function () {return "/";},
				name:function () { return "unknown";},
				text:function () { return src;}
			},
			pos,row:rc.row, col:rc.col,len,
			raise: function () {
				throw this;
			}
		});
	} else if (isSrcMeta(src)) {
		klass=src;
		if (klass?.src?.tonyu) srcFile=klass.src.tonyu;
		else srcFile={
			path() {return "/";},
			name() { return "unknown name";},
			text() { return "unknown src";}
		};
	} else if (SFile.is(src)) {
		srcFile=src;
	} else {
		throw new Error("src="+src+" should be file object");
	}
	const s=srcFile.text();
	rc=TError.calcRowCol(s,pos);
	message+=" at "+srcFile.name()+":"+rc.row+":"+rc.col;
	return Object.assign(new Error(message),{
		isTError:true as true,
		src:srcFile,
		pos,row:rc.row, col:rc.col, len, klass:klass??undefined,
		raise: function () {
			throw this;
		}
	});
};
TError.calcRowCol=function (text:string ,pos:number) {// returns 1 origin row,col
	const lines=text.split("\n");
	let pp=0,row:number ,col:number;
	/*
aaa\n
bb\n
cc!cc
pp = 4  7   11
row=2  pp=11  pos=9
lines[row].length=4
	*/
	col=0;
	for (row=0;row<lines.length ; row++) {
		const ppp=pp;
		pp+=lines[row].length+1;
		if (pp>pos) {
			col=pos-ppp;
			break;
		}
	}
	return {row:row+1,col:col+1};
};
//module.exports=TError;
