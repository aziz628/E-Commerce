// open checkout page
function go_checkout(){
    window.open("/checkout.html", "_blank");
    //check_login();//get tokken to send the data to server (you get it after login in)
    //open  check out page
}
// modify aside page if no products exist
function no_items(){
    const num=document.querySelector('.cart .p-nb p')
    num.parentElement.style.backgroundColor='#48a7de'
    continue_checkout_button.textContent='continue your shopping';
    no_item_text.style.display='block';
    total_price_container.style.display='none';
    viewcart_button.style.display='none';
}
//opposite
function items_added(){
    const num=document.querySelector('.cart .p-nb p')
        num.parentElement.style.backgroundColor='red';
        continue_checkout_button.textContent='Checkout';
        total_price_container.style.display='flex';
        no_item_text.style.display='none';
        viewcart_button.style.display='block';
}
//load cart into local storage
function load_cart(){//reload the cart with every change
    // with every load set nb products to 0
    items_list.innerHTML=""
    items_list.appendChild(model)

    let cart=JSON.parse( localStorage.getItem('cart'));
    console.log("cart ",cart)
    if(cart){
    if(cart.length>0){
        console.log("cart exist ")
        cart.forEach((obj)=>{
            add_to_cart_from_storage(obj);
        })
    } else {
        no_items();
        console.log("Cart is empty or undefined"); // This will be logged
    }
    }

}
// hiding cart
function hide_aside_page() {
    aside_page.classList.remove('show');
    cover.classList.remove('show')
}

//remove item
function remove_item(item){
    // check if item.remove reach the right item or cause same error of scope and choose the last item of add_to_cart (i put console log to check)
    const delete_item = item.querySelector('.remove_bt');
    const num=item.querySelector('input')
    num.removeEventListener('input', clean_event);
    item.remove();
    save_products();
    price_calc()
    decrease_num_icon();
    delete_item.removeEventListener('click', remove_item);
}
// product number
function increase_number(item){
    let num=item.parentElement.querySelector('input')
    const val=num.value; // make number
    num.value=parseInt(val)+1;
    save_products();
    price_calc()
}
function decrease_number(button){
    let num=button.parentElement.querySelector('input')
    const val=num.value; // check if number update
    if(val>1){
        num.value=parseInt(num.value)-1
        save_products();
        price_calc()

    }else{
        let item=button.parentElement.parentElement.parentElement
        remove_item(item);
    }
    
}
// aadd to cart a product obj from local storage 
function add_to_cart_from_storage(obj){ 
    console.log("obj",obj);
    let item = model.cloneNode(true);
    item.classList.remove('model');
    item.style.display = '';
    let {text,number,img,price,id}=obj;
    item.dataset.id=id;
    let item_image= item.querySelector('.img-c img');
    item_image.setAttribute('src',img);
    let item_text=item.querySelector('.details p');
    item_text.textContent=text;
    let item_price=item.querySelector('.price');
    price='$'+price;
    if(price.indexOf('.')==-1){
        price+='.00';
    }
    item_price.textContent=price
    const num = item.querySelector('input');
    num.value=number
       console.log("price",price,"and",item_price.textContent)
    items_list.appendChild(item);
    increase_num_icon();
    console.log("increase from storage ")
    price_calc();
}
// need to import rign function here


