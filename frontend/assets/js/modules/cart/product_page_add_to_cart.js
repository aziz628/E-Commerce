
const add_to_cart_bt=document.querySelector('.add_to_cart')
const product_summary=document.querySelector('.product-summary')
const main_image =document.querySelector('.main_image img');

function add_to_cart() {
    let item = model.cloneNode(true);
    item.classList.remove('model');
    item.style.display = '';
    
    item.dataset.id=product_summary.getAttribute('data-id')
    item_image=item.querySelector('.img-c img');
    item_image.setAttribute('src',main_image.getAttribute('src'));
    
    text=product_summary.querySelector('h2');
    item_text=item.querySelector(' .details p');
    item_text.textContent=text.textContent;
    
    price=product_summary.querySelector('.price span').textContent
    item_price=item.querySelector('.price');
    item_price.textContent=price;
    let n=document.querySelector('.quantity input')
    console.log(n.value)
    if(parseInt(n.value)>1){
        item.querySelector('input').value=n.value;
    }
    items_list.appendChild(item);
    save_products();
    price_calc();
    }
function add_item(){
    console.log(product_summary)
    console.log("id",product_summary.dataset.id)

    let item_id=product_summary.dataset.id;
    for(i=1;i<items_list.children.length;i++){// need to fix template
    let id=items_list.children[i].dataset.id;
    if(id===item_id){
        console.log("correct")
        let num = items_list.children[i].querySelector('.pro_n input');
            num.value = parseInt(num.value) + 1; // this line is the problem (i commented it no number in search)
            save_products();
            price_calc();
            return ;
    }}
    add_to_cart();
    increase_num_icon();
    console.log("increase from add_item ")
}