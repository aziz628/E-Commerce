//user account event delegation and functions
let web_socket;

const user_account_functions={
    "up_date":update,
    "logout":log_out,
    "delete":confirmation,
}
//hide and show right windows
function update(){
    hide_setting_list()
   update_area.classList.add('show')
   back_cover.classList.add('show')
}

//inside update password
let see_password=document.querySelector('.see i')

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
//input validation
function validate_email(){
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
function validate_password(){
     value=password.value;
     if(value.length >= 6){
        show_correct_input(password);
        return true
     }else{
        show_wrong_input(password);
        return false
     }
};

// for eye button function
// but get event and not used it ??

function toggle_visibility(e){
    const button=see_password.parentElement;
    const pass=button.parentElement.querySelector('input');
    e.preventDefault();
    if(see_password.classList.contains("fa-eye-slash")){  
        password_hidden(see_password,pass);

    }else{
        show_password(see_password,pass);

    }

}
// need change
see_password.parentElement.addEventListener('click', toggle_visibility);

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
email.addEventListener('input', validate_email);
password.addEventListener('input', validate_password);


//login link hide (after loging)
function remove_login(){
    localStorage.setItem('login','false')
    window.location.reload()
    //reload
 }
 //press button again
function hide_setting_list(){
    setting.classList.remove('show');
}
//log out request 
async function log_out(){
    let url="http://127.0.0.1:3000/users/logout";
    try{
    const response=await fetch(url,{
        method:'POST',
        credentials: 'include',
        headers:{'Content-Type':'application/json'},
    })
    if(!response.ok){
        let result= await response.json()
        if(response.status === 401){
            console.error(result.error)
            alert("session expired");
            remove_login() //looks stupid since he trying to log out
            return
          }
        if(response.status===429)return handle_max_request()
        throw new Error(result.error+`\n returned status: ${response.status}`)
    }
     web_socket.close();
    // make it show and hide without ok to pass
    alert('user log out')

    remove_login();// reload
}catch(err){
    console.error(" error : ",err)
}
}


const delete_functions={
    "delete_bt":delete_account
    ,"cancel":cancel
}

//show confirm page and add event delegation
function confirmation(){
    hide_setting_list()
    confirmation_area.classList.add('show')
    back_cover.classList.add('show')
    confirmation_area.addEventListener('click',(e)=>{
        if(delete_functions[e.target.classList]){
            delete_functions[e.target.classList]()
            // putting hide_setting_list here didn't work
        }
    })
}
// confirmation page options: cancel and delete
function cancel(){
    back_cover.classList.remove('show')
    confirmation_area.classList.remove('show')
}
//delete request
async function delete_account(){

    try{
    const url="http://127.0.0.1:3000/users/delete_account";
    response = await fetch(url,{
        method:"DELETE",
        credentials: 'include',
        headers:{'Content-Type': 'application/json'},
    })
    let result=await response.json(); 
    if(!response.ok){
        if(response.status==404){
            console.error(result.error)
            return
        }else if(response.status==401){// only when no refresh token
            console.error(result.error)
            alert("session expired");
            return
        }
        throw new Error(`Server returned status: ${response.status}`);
    }
    console.log(response)
    if(result.message==="user deleted"){
        alert("account deleted")
        remove_login();//  get back to login page
    }else{
        console.error("error occured")
    }
    }catch(err){
        console.error(" error : ",err.message)
    }
    }

submit_update.addEventListener("click",send_update)

//update request
async function send_update(e){
e.preventDefault()
if(validate_email()&& validate_password()){
try{
const url="http://127.0.0.1:3000/users/update";
let new_data=get_updated_data()
const data =JSON.stringify({new_data})
response=await fetch(url,{
    method:'PUT'
    ,headers:{'Content-Type': 'application/json'}
    ,credentials: 'include'
    ,body:data })
    const result=await response.json()
    if(!response.ok){
        if(response.status === 401){
            console.error(result.error)
            alert("session expired");
            window.location.reload()
            return
          }else if(response.status === 400){
            alert('invalid input')
            return
          }else if(response.status === 409){
            alert('Same credentials')
            return
          }
        throw new Error(`Server returned status: ${response.status}`);
    }
    if (result.message==='data updated'){
        console.log(result.message)
        alert(result.message)
        hide_update()
    }else{
        throw new Error('unknown response')
    }
}catch(err){
console.error(" error : ",err.message)
}
}else{
    alert('Invalid Input')
}
}
// return  data to send it in request
function get_updated_data(){
    // collect all interies from the form
    const formdata=new FormData(form)    
    // make obj out of it
    const new_data=Object.fromEntries(formdata)
    return new_data
}


 function handle_max_request(){
alert("too much requests , try again later ")
 }

// hide update banner
function hide_update(){
update_area.classList.remove('show');
back_cover.classList.remove('show')
}
hide.addEventListener('click',hide_update)

// event delegation of setting 
setting.addEventListener('click',(e)=>{
    if(user_account_functions[e.target.classList]){
        e.preventDefault();
        user_account_functions[e.target.classList]()
    }
 })

// check if user loged in to show setting 
function check_login(){
    let check_login=JSON.parse(localStorage.getItem('login'))
    if(check_login){
        //in case the main page closed and event don't work
        log.style.display='none';
        user_related.style.display='flex';
        notification.classList.add('show');
        if(window.location.pathname=="/") open_user_connection();
    }else{
        log.style.display='block'
        user_related.style.display='none'
        notification.classList.remove('show')
    }
}
check_login();


let currentList = null;

// Toggle the list when clicking inside the container
user_related.addEventListener('click', (event) => {
    const ul = event.target.closest('button')?.querySelector('ul');
    if (ul) {
        if (currentList && currentList !== ul) currentList.classList.remove('show');
        currentList = ul.classList.toggle('show') ? ul : null;
        // toggle return true while adding
        if (ul.classList.contains('notification_list') && parseInt(notification_number.textContent) > 0) {
            hide_notification_number(); // Handle notifications
        }
    }
});

// Close the list when clicking outside
document.addEventListener('click', ({ target }) => {
    if (currentList && !user_related.contains(target)) {
        currentList.classList.remove('show');
        currentList = null;
    }
});

function add_notification(notif){
    let li=document.createElement('li');
    li.innerHTML=`<p>${notif}</p>`
    notification_list.append(li);
    increase_notification_number();
}

async function refresh(){
await fetch("http://127.0.0.1:3000/users/refresh",{
    method:'GET'
    ,headers:{'Content-Type': 'application/json'}
    ,credentials: 'include' })
}
async function open_user_connection(){
await refresh() // to get access token 
const socket = new WebSocket("ws://127.0.0.1:3000");

  socket.onopen = () => {
    socket.send(JSON.stringify({event:"notification:pull" ,data:"hey server connection intialized, give notifications !"}));
    console.log(" WebSocket Connected!");
  };

  socket.onmessage = (message_event) => {
    // this need to be modular with mapping events
    console.log("Message from server:",message_event?.data);
    const { event, data } = JSON.parse(message_event.data); // right part is ws attribute
    console.log("event : ",event,' \n data : ',data)
    if(event=="new_notification"){
        add_notification(data.notification)
    }
    if(event=="notifications:list"){
        const lastNotif = data.all_notifications[0] ??null;
        console.log("last notif ",lastNotif)
        localStorage.setItem("lastSeenId",JSON.stringify(lastNotif.id))
        data.all_notifications.forEach((notif,index) =>{ 
            // u can replace this by two  for loop (or use index in for each with if conidtion) 
            // and use the var for number of notif make give them  effect or new 
            // on click go back normal u can use function event listener for and classes or styles 
            let li=document.createElement('li');
            notif.created_at=new Date(notif.created_at).toISOString().split('T')[0];
            li.innerHTML=`<p>${notif.message}</p><span> ${notif.created_at} </span>`;
            notification_list.append(li);
        });increase_notification_number(data.unseen_notif_count)
    }
    };

  socket.onclose = () => {
    console.log(" WebSocket Disconnected");
  };
  web_socket=socket;
}
function increase_notification_number(n=1){
    if(n==0)return 
    let val =parseInt(notification_number.textContent);
    console.log(notification_number)
    if(val==0){
        notification_number.parentElement.classList.add('show');
        console.log(notification_number.parentElement)
    }
    val+=n;
    notification_number.textContent=val;
}
function hide_notification_number(){
    notification_number.textContent=0;
    notification_number.parentElement.classList.remove('show');
    // use mark seen event
    let lastSeenId=JSON.parse(localStorage.getItem("lastSeenId"))
    console.log('setting last seen ')
    web_socket.send(
        JSON.stringify({
            event:"notification:seen",
            data:{lastSeenId}
        })
    )
}
