
//capture logout or cart edit on other page or 
window.addEventListener('storage', function(event) {
    if (event.key === 'login') {
    check_login()
// storage event don't detect 
// from same tab
}
else if (event.key === 'cart') {
    document.querySelector('.cart .p-nb p').textContent=0
    load_cart();
    console.log("load cart from storage")
  }

  });

//show aside page (cart)
 aside_bt.addEventListener('click',()=>{
console.log("aside")
 aside_page.classList.add('show');
 cover.classList.add('show');
})

// hiding cart
aside_del_bt.addEventListener('click',()=>{
     hide_aside_page();
    })

// cart functions :

// event functions for handling products number inputs
function clean_event(e){
    // when blur (lose focus) delete input and the blur for effeincy
    const num=e.target;
    num.removeEventListener('input', manage_input);
    num.removeEventListener('blur',clean_event);
/* i need to make sure if deleting event with every
 blur better than delete all of them after the click hide cart_aside_page */
}
function handle_manage_input(item) {
    // after clicking the text area this happens
    //select all to handle invalid input better
    item.setSelectionRange(0, item.value.length); 
     // make event for input and blur
     item.addEventListener('input',manage_input)
     item.addEventListener('blur',clean_event)
     
}
function manage_input(e){
    let num=e.target;
    const old_value = num.dataset.old_value;
    let number=num.value
    //modify regex so it can accept only digit >=1
    number=number.replace(/[^1-9]/g,''); 
    // try use parsent with | (it handles error somehow)
    num.value=number;
    if (isNaN(parseInt(number))) {
        num.value = old_value
        num.setSelectionRange(0, num.value.length);       
    }else{
        num.dataset.old_value=number;
        save_products();
        price_calc()
    }
}


//event delegation remove handle (getting right target for remove )
function handle_remove(button){
    // don't work unless you press on the button div  not the icon
    //this because of e.target wil fix later
let item=button.parentElement
console.log('to delete',item)

if (button.tagName !== 'BUTTON') {
    item=item.parentElement
}
console.log('to delete',item)
remove_item(item);
}

const aside_cart_functions={
    "remove_product":handle_remove,
    "increase_number":increase_number,
    "decrease_number":decrease_number,
    "product_number_input":handle_manage_input
}
//event delegation main event
items_list.addEventListener('click',(e)=>{
    if(e.target.dataset.action){
    e.preventDefault()
    // we might need parameters
    const action_function=aside_cart_functions[e.target.dataset.action]
    action_function(e.target)
    }
})

continue_checkout_button.addEventListener('click',()=>{
    console.log(continue_checkout_button)
    if(continue_checkout_button.textContent==='continue your shopping'){
        hide_aside_page();
    }else{
        save_products();
        console.log("go checkout")
        go_checkout()        
    }
});

// loading cart
load_cart()
