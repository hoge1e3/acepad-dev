#!run
const         MAX=0x80000000;
const         MIN=-MAX;
export default class{
    constructor (seed){
        this.setSeed(seed);
    }
    setSeed(seed) {
        this.x = 123456789;
        this.y = 362436069;
        this.z = 521288629;
        this.w = seed || new Date().getTime();
    }
    next() {
        const t = this.x ^ (this.x << 11);
        this.x = this.y; 
        this.y = this.z; 
        this.z = this.w;
        this.w = (this.w ^ (this.w >>> 19)) 
        ^ (t ^ (t >>> 8));
        return this.w
    }
    
    nextInt(min, max) {
        const  res= Math.floor(min + this.next01()*(max-min));
        return res;
    }
    next01() {
        return (this.next()-MIN)/(MAX-MIN);
    }
}