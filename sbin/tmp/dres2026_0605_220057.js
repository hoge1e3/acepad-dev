#!run
let max=55,cur=21;
export async function main(){
  return (max-cur)/restday();
}
function restday() {
  // return the rest day of this month from today
  const today = new Date();
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return lastDay.getDate() - today.getDate();
}