#!run

export async function main(){
  const cmt=[
  "chown",
  "chmod",
  "copyFile",
  "fchown",
  "fchmod",
  "fdatasync",
  "fstat",
  "fsync",
  "ftruncate",
  "futimes",
  "lchown",
  "lchmod",
  "lutimes",
  "mkdtemp",
  "read",
  "readv",
  "statfs",
  "truncate",
  "writev",
  "opendir"
];
return [
  'appendFileSync', 'accessSync',    'chownSync',
  'chmodSync',      'closeSync',     'copyFileSync',
  'cpSync',         'existsSync',    'fchownSync',
  'fchmodSync',     'fdatasyncSync', 'fstatSync',
  'fsyncSync',      'ftruncateSync', 'futimesSync',
  'lchownSync',     'lchmodSync',    'linkSync',
  'lstatSync',      'lutimesSync',   'mkdirSync',
  'mkdtempSync',    'openSync',      'readdirSync',
  'readSync',       'readvSync',     'readFileSync',
  'readlinkSync',   'realpathSync',  'renameSync',
  'rmSync',         'rmdirSync',     'statSync',
  'statfsSync',     'symlinkSync',   'truncateSync',
  'unlinkSync',     'utimesSync',    'writeFileSync',
  'writeSync',      'writevSync',    'opendirSync'
].filter(s=>s.endsWith("Sync")).
map(s=>s.substring(0,s.length-4)).
filter(s=>!cmt.includes(s)).
map(s=>`
async ${s}(...args:Parameters<FileSystem["${s}Sync"]>) {
    return await retry(()=>this.fs.${s}Sync(...args));
}`).join("");
}