
function price_calc(){
    total_price.textContent="0.00"
    list=items_list.querySelectorAll('li')
    for(let i=1;i<list.length;i++){
    price=list[i].querySelector('.price').textContent;
    number=list[i].querySelector('input').value;
    increase_total_price(price,number)
    }
   
    
}
function increase_total_price(p,x=1){
    old_total_price=parseFloat(total_price.textContent);
    to_add_price=parseFloat(p.replace(/[^0-9.]/g, ''));// from last code can be deleted
    let sum=(old_total_price)+(to_add_price*x)+'';
    if(sum.indexOf('.')==-1){
        sum+='.00';
    }
        total_price.textContent=sum+'$';
    
}


 
function save_products(){
    cart=[]
    const items=items_list.querySelectorAll('li'); 
    
    // saving cart
    items.forEach((item)=>{// use for loop
    let item_text=item.querySelector('.details p').textContent
    let num=item.querySelector('input')
    let item_price=item.querySelector('.price').textContent
    item_price=parseFloat(item_price.replace(/[^0-9.]/g,''));
    let item_id=item.dataset.id
    let item_image=item.querySelector('.img-c img').getAttribute('src');
    obj={text:item_text ,number:num.value,img:item_image,price:item_price,id:item_id}
    cart.push(obj);
    })
    if (cart.length>0){
        cart.shift()
    }
    
    localStorage.setItem('cart',JSON.stringify(cart));
    }

function increase_num_icon(){
    const num=document.querySelector('.cart .p-nb p')
    if(parseInt(num.textContent)==0){
        items_added();
    }
    num.textContent=parseInt(num.textContent)+1
}
function decrease_num_icon(){
    const num=document.querySelector('.cart .p-nb p')
    if(parseInt(num.textContent)==1){
        no_items();
     }
    num.textContent=parseInt(num.textContent)-1;
}