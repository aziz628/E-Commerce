// we have to seperate things from here
// add_to_cart will change
input_functions={
    "add_to_cart":add_item,
    "increase_number":handle_increase,
    "decrease_number":handle_decrease,
    "product_number_input":handle_manage_input
}
function get_element(){
    let item_id=product_summary.dataset.id;
    for(i=1;i<items_list.children.length;i++){// need to fix template
    let id=items_list.children[i].dataset.id;
    console.log(id)
    if(id===item_id){
        return items_list.children[i]
    }}
    return null
}
// link the element as u load the page if it exist in the cart
function handle_increase(element){
    let num=element.parentElement.querySelector('input')
    const val=num.value; // make number
    num.value=parseInt(val)+1;
    let item=get_element();
    console.log('item increase',item)
 if(item){
    increase_number(item.querySelector('.increase'))
}else{
    add_item()
}
// get the product from the cart if exist
//apply the original cart function to it 
}
function handle_decrease(element){
    let item=get_element();
 if(item){
     decrease_number(item.querySelector('.increase'))
}
let num=element.parentElement.querySelector('input')
    const val=num.value; // make number
    if(val==1)return
    num.value=parseInt(val)-1;
    console.log('item ',item)
}

const input_wrapper=document.querySelector('.input_wrapper')
input_wrapper.addEventListener('click',(e)=>{
if(e.target.dataset.action){
        e.preventDefault()
        // we might need parameters
        const action_function=input_functions[e.target.dataset.action]
        action_function(e.target)
        } 

})
window.addEventListener('storage', function(event) {
 if (event.key === 'cart') {
// check for page item and sync it
// add change event for input if value change then change 
// item page input value 
}

  });