#!run

export async function main(){
  const s=`4 r
5 gb
6 b
7 gr
8 b
9 g
10 rr
11 g
12 r
13 rb
16 r
24 rg
25 r
26 b
27 r
28 rb
30 g
31 r
1 rg
2 bb
3 r
4 rr
6 b
7 b
8 rg
9 gr
10 gb
`;
  /*each number in line shows date
  from 2026/03/04
  to 2026/04/10
  convert the number into yyyy/mm/dd
  */
  const lines = s.trim().split("\n");
  let year = 2026;
  let month = 3;
  const results = [];

  for (const line of lines) {
    const [dayStr, ...tags] = line.trim().split(/\s+/);
    const day = parseInt(dayStr);

    // detect month rollover (day resets to small number after 28+)
    if (results.length > 0) {
      const prevDay = results[results.length - 1].day;
      if (day < prevDay) {
        month++;
        if (month > 12) { month = 1; year++; }
      }
    }

    const date = `${year}/${String(month).padStart(2,"0")}/${String(day).padStart(2,"0")}`;
    results.push({ day, date, tags: tags[0] ?? "" });
  }
  for(let r of results){
    this.echo(r.date,r.tags)
  }
  return results;
}
