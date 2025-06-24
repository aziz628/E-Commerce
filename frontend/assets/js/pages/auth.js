
const log_in=document.querySelector('.log_in')
const sign_in=document.querySelector('.sign_in');
// select section based on the query 
//check url.query or something
let section=log_in;

function select_elements(section){
let submit_bt=section.querySelector('#submit');
let email=section.querySelector(".email input")
let password=section.querySelector(".password input")
let form=section.querySelector("form")
let password_icon=section.querySelector(".password .icon");
let email_icon=section.querySelector(".email .icon");
let see_password=section.querySelector('.see i')
let switch_bt= section.querySelector('#switch');
console.log('switch')
let handlers={};
let context={submit_bt, email, password,form, see_password, switch_bt,section,handlers}
handlers = define(context);
console.log
context.handlers=handlers;

add_event_listener(context);
}
select_elements(section);

// trying things with objects
/*let client= new User("dodo@gmail.com","20042004");
Users.push(client);
save_data_to_server(Users);*/

async function sign_in_user(user,context) {
   try{
        const url="http://127.0.0.1:3000/users/signup"
        const response= await fetch(url,{ method: 'POST',
        headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(user,null,2)
       }) 
       data= await response.json(); 
        if (!response.ok) {
            if (response.status === 409) {
                console.log(data)
                alert(data.error)
                return
              } else if(response.status === 400) {
                alert('Invalid input')
                return
              } else if(response.status===429)
              return alert("too much requests , try again later ")
              else {
                // Handle other non-200 responses
                throw new Error(`Server returned status: ${response.status}`);
              }
        }
        console.log("response :",data)
        if (data.message === "user added") {
            console.log('your id : ',data.id)
            alert("user sign in successfully");
            remove_event_listener(context);
            switch_section(null, context);
        }
        //else handled by status code 409
        }catch(error){
            console.error(error)
        }
}
async function log_in_user(user){
    
    try{
        const url="http://127.0.0.1:3000/users/login"
        let response= await fetch(url,{ method: 'POST',
        headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(user,null,2)
       }) 
       data= await response.json(); 
       console.log(data)

        if (!response.ok) {
            console.log("error",data.error)
            if (response.status === 404) {
// the server is sending an error message inside the response body 
// don't know if i should use it or remove it from response 
// maybe because  of text of errors with same status code 
                alert("User not found. Please check your credentials.");
                return
              }else if(response.status === 400){
                alert(data.error)
                return
              } else if (response.status === 401){
                console.error('Unauthorized')
                return
              }else if(response.status===429)
              return alert(data.error)
              else  {
                // Handle other non-200 responses
                throw new Error(`Server returned status: ${response.status}`);
              }
        }
        
// check json format by try        
        console.log("user",user)
        localStorage.setItem('login','true')
        if(data?.role=="admin"){
            return setTimeout(() => {
                window.open("/admin/dashboard");
            }, 100);
        }
        alert(data);
        setTimeout(() => {
            window.location.replace("/");
        }, 100);
        }catch(error){
            console.error("An error occurred:", error);
            alert("An unexpected error occurred. Please try again later.");
        }
}

function define(context) {
    return {
        handleEmailInput: (event) => validate_email(context.email),
        handlePasswordInput: (event) => validate_password(context.password),
        handleSubmit: (event) => submit_validate(event, context.email, context.password, context.form, context.section,context),
        togglePasswordVisibility: (event) => toggle_visibility(event, context.see_password),
        handleSwitch: (event) => {
            remove_event_listener(context);
            switch_section(event, context);
        }
    };
}
function add_event_listener(context) {
    console.log("add_event_listener")
    const { handlers } = context;
    context.email.addEventListener('input', handlers.handleEmailInput);
    context.password.addEventListener('input', handlers.handlePasswordInput);
    context.submit_bt.addEventListener('click', (event) => handlers.handleSubmit(event));
    context.see_password.addEventListener('click', (event) => handlers.togglePasswordVisibility(event));
    context.switch_bt.addEventListener('click', (event) => handlers.handleSwitch(event));
}

function remove_event_listener(context) {
    const { handlers } = context;
    context.email.removeEventListener('input', handlers.handleEmailInput);
    context.password.removeEventListener('input', handlers.handlePasswordInput);
    context.submit_bt.removeEventListener('click', handlers.handleSubmit);
    context.see_password.removeEventListener('click', handlers.togglePasswordVisibility);
    context.switch_bt.removeEventListener('click', handlers.handleSwitch);
}



function submit_validate(event,email,password,form,section,context){
    event.preventDefault();
    if(validate_email(email) && validate_password(password)){
        const formData = new FormData(form);
        const user_account = Object.fromEntries(formData.entries());
       
        if(section===sign_in){
             //validate sign in
             console.log('trying to sign in')
            sign_in_user(user_account,context)
        }else{
            //validate log in
            log_in_user(user_account);
        }
    }
    else{
        alert("invalid input");
        return;
    }
}
function hide_for_switch(context){
    context.email.value = '';
    context.password.value = '';
    context.email.style.borderColor="#48515b";
    context.password.style.borderColor="#48515b";
    console.log("section",context.section)
    let icons=context.section.querySelectorAll('#icon');
    console.log(icons)
    icons[0].style.color='';
    icons[1].style.color='';
}

function switch_section(event, context){
    if(event){
    event.preventDefault();
}
    hide_for_switch(context);
    console.log("email ",context.email)
    if(section==log_in){        
        sign_in.style.display='block';
        log_in.style.display='none';
        section=sign_in;
    }else{
        sign_in.style.display='none';
        log_in.style.display='block';
        section=log_in
    }
    select_elements(section)
}

function validate_email(email){
    value=email.value;
    let pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (value==="admin"){
        show_correct_input(email)
        return true
    }
        if(pattern.test(value)){
            show_correct_input(email)
            return true
        }else{
           show_wrong_input(email)
           return false
        }
};
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

function toggle_visibility(e,see_password){
    const button=see_password.parentElement;
    const pass=button.parentElement.querySelector('input');
    e.preventDefault();
    if(see_password.classList.contains("fa-eye-slash")){  
        password_hidden(see_password,pass);

    }else{
        show_password(see_password,pass);

    }

}

function show_password(see_password,pass){
see_password.classList.remove("fa-eye")  
see_password.classList.add("fa-eye-slash")
pass.type="text";

}
function password_hidden(see_password,pass){
    see_password.classList.remove("fa-eye-slash")  
    see_password.classList.add("fa-eye")
    pass.type="password"
}


