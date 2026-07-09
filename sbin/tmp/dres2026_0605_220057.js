#!run
let max=60,cur=26;
export async function main(){
  return (max-cur)/restday();
}
function restday() {
  // return the rest day of this month from today
  const today = new Date();
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return lastDay.getDate() - today.getDate();
}