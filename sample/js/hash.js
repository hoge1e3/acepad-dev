import * as $ from "@acepad/ajax";

const url="hash.php";
export async function put(data) { 
    let r=await $.post(url,{
        data:JSON.stringify(data)
    });
    return r.id;
}
export async function get(id) {
    return await $.get("hash.php",{id});
}
export async function init(branch,data={}) {
    await $.post("hash.php",{
        key:branch,
        data:JSON.stringify(data),
    });
    return await checkout(branch);
}
export async function checkout(branch) {
    const data=await $.get("hash.php",{key:branch});
    return checkoutD(branch, data);
}
function checkoutD(branch, data) {
    let head=data.__id__;
    return {
        data,
        async commit(data) {
            data.__prev__=head;
            let r=await $.post("hash.php",{
                key:branch,
                data:JSON.stringify(data),
            });
            data.__id__=r.id;
            return checkout(branch, data);
        }
    };
}