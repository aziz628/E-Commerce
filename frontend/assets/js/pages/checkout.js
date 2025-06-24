
const menu_bt=document.querySelector('.menu-button');
const menu=document.querySelector('.second-header');
const links=menu.querySelector('.links');
const sub_menu=menu.querySelector('.sub-menu');

const Checkout=document.querySelector('main .Checkout')
const orders=document.querySelector('main #order')
const mobile_order= document.querySelector('main .Checkout .show .order')
const list=orders.querySelector('.details .products')
const list_mobile=mobile_order.querySelector('.details .products')
var total_price=orders.querySelector('.total .value')
var total_mobile=mobile_order.querySelector('.total .value')
const button=document.querySelector('.Checkout .buy span')
const discount_a=Checkout.querySelector('form a')


function load_cart(emptying_cart=false){
    let cart=JSON.parse( localStorage.getItem('cart'));
    if(cart){
        set_cart(cart);
    } else {
        console.log("Cart is empty or undefined"); // This will be logged
        if(emptying_cart)location.reload()
    }

}


// load orders
function set_cart(cart){ 
    list.innerHTML=""; 
    total_price.textContent='$0.00';// need  change
    total_mobile.textContent='$0.00';

    cart.forEach((obj)=>{
        let {text,number,img,price}=obj;
        let element=document.createElement('div')
       console.log(img)
        element.className = "product"
        element.innerHTML=`<div class="img-c">
        <img src="${img}" alt=""></div>
        <p class="text">${text}</p>
        <p class="number">x${number}</p>
         <p class="sub-price">${(price*number).toFixed(2)}$</p>`;
        list.appendChild(element);
        let x=price*number
        increase_total_price(x)
        console.log("element ",element)
        let clonedElement = element.cloneNode(true);  
        list_mobile.appendChild(clonedElement);
    })
    
    button.textContent=total_price.textContent
}
load_cart()

function increase_total_price(p){
total=parseFloat(total_price.textContent.substring(1));
total_price.textContent='$'+(total+p).toFixed(2);
total_mobile.textContent=total_price.textContent;
}
window.addEventListener('storage', function(event) {
    if (event.key === 'cart') {
      load_cart(true);
    }
  });

const coupon=Checkout.querySelector('.coupon')
discount_a.addEventListener('click',(e)=>{
e.preventDefault();
let style=coupon.style.display;
if(style==='none'||style===''){
coupon.style.display='flex';
}
discount_a.style.display='none';
discount_a=null;
coupon=null
})

const menu_b_icon=document.querySelector('.nav .menu-button i');

menu_bt.addEventListener('click',()=>{
links.classList.toggle('show');// classlist manipulate single class, className Directly sets , 

menu_b_icon.classList.toggle('fa-bars');
menu_b_icon.classList.toggle('fa-times');
/* NEED TO SWITCH TO add/remove and add
 condition in remove to hide the submenu with it if kept open*/

});
const bt=document.querySelector('.arrow_icon');
    bt.addEventListener('click',()=>{
        if(window.innerWidth<700)sub_menu.classList.toggle('show');
    });

function show_order(){
    // basicly toggle
    if (mobile_order.style.display === 'none'||mobile_order.style.display === '') {
        mobile_order.style.display = 'block';  // Show the order
    } else {
        mobile_order.style.display = 'none';   // Hide the order
    }}

const order_toggle=document.querySelector('main .Checkout .show > h3');
order_toggle.addEventListener('click',()=>{
    let title=order_toggle.querySelector('span')
    let text=title.textContent; 
    title.textContent=text.includes("Show")?
    text.replace("Show","Hide"):text.replace("Hide","Show")

    order_toggle.querySelector('i').classList.toggle('click');
    show_order()
})