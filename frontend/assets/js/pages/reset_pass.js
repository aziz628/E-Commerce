let password=document.querySelector(".password input");
let confirm_password=document.querySelector(".confirm_password input");
let submit_bt=document.querySelector('.submit');
let queryString = window.location.search;

password.addEventListener('input',()=>{
    validate_password(password)
} );
confirm_password.addEventListener('input',()=>{
    validate_password(confirm_password)
} );

let reset_token = queryString.substring(1).split('=')[1];
console.log(reset_token)
console.log("query ",queryString);
submit_bt.addEventListener('click',(e)=>{
    e.preventDefault();
    if(validate_password(password) && validate_password(confirm_password)){
        send_password(password.value)
    }
})
async function send_password(password){
try{
    url="http://127.0.0.1:3000/users/reset_password"
    let response=await fetch(url,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({password,reset_token})
    })
    if(!response.ok){
        let data=await response.json()
        if(response.status==400){
            console.error(data.error)
            alert("link expired")
        }
        else if(response.status==404){
            console.error(data.error)
            alert("link is invalid")
        }
        throw new Error(`Server returned status: ${response.status}`)
    }
    alert("password reset is successful")
    window.location.href="/auth.html"
}catch(err){
console.error(err)
}
}

function validate_password(password){
    value=password.value;
    if(value.length >= 6){
       show_correct_input(password);
       return true
    }else{
       show_wrong_input(password);
       return false
    }
};

function show_correct_input(element){
    let icon=element.parentElement.querySelector('#icon')
    element.style.borderColor='green'
    icon.className='fa-solid fa-circle-check icon'
   icon.style.color='green';
}
function show_wrong_input(element){
    let icon=element.parentElement.querySelector('#icon')
    element.style.borderColor='red';
    icon.className='fa-sharp fa-solid fa-circle-exclamation icon';
    icon.style.color='red';
}
