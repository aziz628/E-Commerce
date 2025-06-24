const  email=document.querySelector(".email input")
email.addEventListener('input', validate_email);


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

function validate_email(){
    console.log("validate")
    value=email.value;
    let pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
        if(pattern.test(value)){
            show_correct_input(email)
            return true
        }else{
           show_wrong_input(email)
           return false
        }
};
let create_bt=document.querySelector('.create_bt')
create_bt.addEventListener('click',(e)=>{
    e.preventDefault();
    if(validate_email()){
        send_email(email.value)
    }
})
async function send_email(email){
try{
    url="http://127.0.0.1:3000/users/password_loss"
    let response=await fetch(url,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email})
    })
    if(!response.ok){
        if(response.status==404){
            alert('no user with this email')
            return
        }else if(response.status==400){
            alert("Error in sending email")
            return
        }
        throw new Error(`Server returned status: ${response.status}`)
    }
    alert("check your email for reset link")
}catch(err){
console.error(err)
}
}