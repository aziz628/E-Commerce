const products_list=document.querySelector(".container .shop .products")
const filter=document.querySelector(".drop_down select")

//get the queries from url and add them to the first get_product

let query=""
const arrows=document.querySelectorAll('.arrow');

function show_arrows(n){
    if(n==1){
        arrows[0].classList.remove('show');
        arrows[1].classList.remove('show');
        return
    }
    //
    let current_page=document.querySelector('.current_page').id
    if(current_page==1){
    arrows[0].classList.remove('show');
    arrows[1].classList.add('show');
}
    else if(current_page==n){
        arrows[1].classList.remove('show');
        arrows[0].classList.add('show');

    }else{
        arrows[0].classList.add('show');
        arrows[1].classList.add('show');
    }

}
function set_current_page_number(x){
    const numbers=document.querySelectorAll(".page_numbers .numbers li")

    numbers.forEach((n,i) =>{
        // you can replace foreach by one variable if you can store the previous current page 
        if(i+1==x+1){
            n.classList.add('current_page')
        }else{      
              n.classList.remove('current_page')
}
    })

}
const page_numbers=document.querySelector('.page_numbers .numbers')
function show_page_numbers(number){
    for(let i=1;i<=number;i++){
        let li =document.createElement('li')
        li.textContent=i;
        li.id=i
        page_numbers.appendChild(li)
    }
}
function last_page(){
    let current_page=document.querySelector(".current_page")
    return current_page.id==page_numbers.lastElementChild.id
}
let products_result_span=document.querySelector(".toolbar p span")
function set_result_string(n,page_n){
    products_result_span.textContent=''
    if(n>6){
        let stop_at;// is declaring than assigning faster than declare assign in same line ?
        let start_from=6*page_n // i didn't use ||1 here cause it adds 1 idk why
        if(!last_page()){
            stop_at=start_from+6
        }else{
            stop_at=n
        }
        products_result_span.textContent=(start_from||1)+'_' +stop_at+" out of "+n
    }else{
        products_result_span.textContent=n; 
    }
}
// resuest
 async function get_products(page_number=0,queries=""){
    remove_number_event();
    products_list.innerHTML='';
    page_numbers.innerHTML="";
    show_arrows(1) // hide them
    let filter_value=filter.value
    let url=`http://127.0.0.1:3000/products/shoping?offset=${6*page_number}${queries}&filter=${filter_value}`;
    console.log(url)
    try{
    const response= await fetch(url,{
        method:"GET",
        headers:{"Content-Type":"application/json"},
    })
    if(!response.ok){
        if(response.status==404){
            products_result_span.textContent='0'
            setTimeout(() => {
                // he excute alert fist maybe cause accessing doom take longer
            alert("no products")
            }, 100);
            return
        }else if(response.status==410){
            alert("PAGE NOT FOUND")
            return
        }
        throw new Error(`Server returned status: ${response.status}`)
    }
    let data=await response.json()
    console.log(data)
    const products=data.products

    let number=data.number
    if (products) {
        if (number > 6) {
            let trunc_page =Math.trunc(number/6)
            let pages=(number/6)>trunc_page?trunc_page+1:trunc_page
            show_page_numbers(pages)
            set_current_page_number(page_number)
            show_arrows(pages)
        }
        products.forEach(product => {
            make_product(product)
        })
        add_number_event()
        set_result_string(number,page_number)
    }
    }catch(err){
console.error(err)
    }
 }
get_products();
 
// CSR products
function make_product(product){
let item = document.createElement('li')
item.dataset.id=product.id;
item.dataset.quantity=product.quantity;
item.classList.add('product');
let price='$'+product.price;
if(price.indexOf('.')==-1){
    price+='.00';
}
item.innerHTML=`
                    <div class="img-c">
                        <div class="pin">
                            <div class="cart-c">
                                <i class="fa-solid fa-cart-shopping"></i>                            
                            </div>
                            <div class="note"> <p>add to cart</p></div>

                        </div>
                        <div class="sale">Sale!</div>
                        <img src="${product.image_url}" alt="">
                        </div>
                    <div class="stars"><i class="fa-regular fa-star"></i>
                        <i class="fa-regular fa-star"></i>
                        <i class="fa-regular fa-star"></i>
                        <i class="fa-regular fa-star"></i>
                        <i class="fa-regular fa-star"></i>
                    </div>
                    <h3>${product.description}</h3>
                    <p> <del>${price}$ </del>${product.discounted_price}$</p>
                
                `;
                products_list.appendChild(item)
 }
 // remove it with each new search (new number of products)
 function remove_number_event(){
 if(page_numbers)
 page_numbers.removeEventListener('click',get_page)
}
 
 function add_number_event(){
 page_numbers.addEventListener('click',get_page)
}

function get_page(e){
        if(e.target.id){
            console.log((e.target.id)-1)
            get_products((e.target.id)-1)
        }
}

const next_arrow=document.querySelector('.next')
const previous_arrow=document.querySelector('.previous')

//condition when changing page (get only existing pages)
function change_page(x){
    let current_page=document.querySelector('.current_page').id
    let length=page_numbers.children.length

    if(!( (current_page==1&&x==-1) || (current_page==length&&x==1) )){
        console.log("change page")
        get_products(current_page-1+x)
    }
    // get current and apply x
    // not < 0 else show page not found
}

next_arrow.addEventListener('click',()=>{
    change_page(1)
})

previous_arrow.addEventListener('click',()=>{
    change_page(-1)
})

 const bt=document.querySelector('.arrow_icon');
 // only work for small screen
 bt.addEventListener('click',()=>{
     if(window.innerWidth<700)sub_menu.classList.toggle('show');
    }); // this is fixed
 
const categories=document.querySelector('.categories-links')
// event delegation
categories.addEventListener('click',(e)=>{
if(e.target.dataset.query){
e.preventDefault()
query="&category="+e.target.dataset.query
get_products(0,query)
console.log(query)
}
})


// event delegation for adding products to the aside cart
products_list.addEventListener('click',(e)=>{
    let clicked=e.target
    console.log("target ",e.target)
if(clicked.classList=="cart-c"){
    let item=clicked.parentElement.parentElement.parentElement
    console.log("item ",item)
    add_item(item);
}else if(clicked.parentElement.classList=="cart-c"){
    let item=clicked.parentElement.parentElement.parentElement.parentElement
    console.log("item ",item)
    add_item(item);  
}else if(e.target.parentElement.classList=="img-c"){
    let li=e.target.parentElement.parentElement;
    console.log("li ",li)
    window.open(`http://127.0.0.1:3000/products/product_page?id=${li.dataset.id}`, "_blank")

    //get_product_page(li.dataset.id)
}
})

const search_input=document.querySelector(".search input")
// start search request
search_input.addEventListener('keydown',(e)=>{
    if(e.key==="Enter"){
    let search=search_input.value.trim()
    if(search){
        query="&search="+search
        get_products(0,query)
        // get products its names start with this
    }}
})

filter.addEventListener("change",()=>{
    get_products(0,query)
})
