function add_item(e){
    let item_id=e.dataset.id;
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
    add_to_cart(e);
    increase_num_icon();
    console.log("increase from add_item ")
}
function add_to_cart(element)  {

    let item = model.cloneNode(true);
    item.classList.remove('model');
    item.style.display = '';
    
    item.dataset.id=element.getAttribute('data-id')
    
    const images = element.querySelectorAll('.img-c img');
    const item_image = item.querySelector('.img-c img');
    
    if (images.length > 1) {
        image = images[1]; // Select the second image
    } else {
        image = images[0];
    }
    item_image.setAttribute('src',image.getAttribute('src'));
    
    text=element.querySelector('h3');
    item_text=item.querySelector(' .details p');
    item_text.textContent=text.textContent;
    
    price=element.lastElementChild.lastChild.textContent;
    item_price=item.querySelector('.price');
    item_price.textContent=price;
    
    items_list.appendChild(item);
    save_products();
    price_calc()
    
    }