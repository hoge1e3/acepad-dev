#!run

export async function main(){
       /*           localStorage.nomobile=true;
                delete localStorage.mobile;
 */
   let acepad=this.$acepad;//.selectKeyDevice("s");
sel(false);
 
  return ;
    function sel(m){
        return function (){
            if(m){
                localStorage.mobile=true;
                delete localStorage.nomobile;
                if(acepad)acepad.selectKeyDevice("s");
            }else {
                localStorage.nomobile=true;
                delete localStorage.mobile;
                if(acepad)acepad.selectKeyDevice("p");
            }
//            w.close();
        };
    }
}