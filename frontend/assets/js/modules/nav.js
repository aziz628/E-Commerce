
// open links menu for mobile
menu_bt.addEventListener('click',()=>{
links.classList.toggle('show');// classlist manipulate single class, className Directly sets , 
menu_b_icon.classList.toggle('fa-bars');
menu_b_icon.classList.toggle('fa-times');/* NEED TO SWITCH TO add/remove and add /condition in remove to hide the submenu with it if kept open*/
});


// show links with arrow button (only work for small screen)
arrow_bt.addEventListener('click',()=>{
    if(window.innerWidth<700)sub_menu.classList.toggle('show');
}); 