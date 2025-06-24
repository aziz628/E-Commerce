
// just for trial , no real login

const products = document.querySelectorAll('.Products-summary .container .product');
products.forEach((product) => {
    const header = product.querySelector('h3');

    product.addEventListener('mouseover', () => {
        header.classList.add('bright');
    });

    product.addEventListener('mouseleave', () => {
        header.classList.remove('bright');
    });
});


//get products add_cart buttons and assign events to them 
const pin_list=document.querySelectorAll('.pin');
pin_list.forEach((pin)=>{
const cart_icon=pin.querySelector('.cart-c');
cart_icon.addEventListener('click',()=>{
    add_item(pin.parentElement.parentElement);
})
});




const starsContainers = document.querySelectorAll('.stars');
const icon_toggle=(star,to_show)=>{

      if (to_show) {
        star.classList.add('fa-solid');
        star.classList.remove('fa-regular');
    } else {
        star.classList.add('fa-regular');
        star.classList.remove('fa-solid');
    }
}

const update_icons = (stars,index) => {
    stars.forEach((star,  i) => {
        if (i <= index) {
            icon_toggle(star, true); // Make it solid
        } else {
            icon_toggle(star, false); // Make it regular
        }
    });
}

starsContainers.forEach((container) => {
    const stars = container.querySelectorAll('i');

stars.forEach((star, index) => {
    // use flex to fix distance
    star.addEventListener('mouseover', () => {
        update_icons(stars,index); // Change icons up to the hovered star index
    });

});
container.addEventListener('mouseleave', () => {
    update_icons(stars,-1);
 });// Reset  icons up to the hovered star index

});

