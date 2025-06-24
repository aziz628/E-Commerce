
async function refresh(){
  console.log("refresh access token")
  await fetch("http://127.0.0.1:3000/admin/refresh",{
      method:'GET'
      ,headers:{'Content-Type': 'application/json'}
      ,credentials: 'include' })
  }
document.getElementById("productForm").onsubmit = async (e) => {
    e.preventDefault();  await refresh()

    const product = Object.fromEntries(new FormData(e.target));
    await fetch("/admin/add_product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product })
    }).then(res => res.json()).then(console.log);
  };
  
  document.getElementById("notifForm").onsubmit = async (e) => {
    e.preventDefault();await refresh()

    const message =  document.querySelector("#id_notification_text").value
    if(message.trim()==="")return
      await fetch("/admin/notify_users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    }).then(res => res.json()).then(console.log);
  };
  document.querySelector("tbody").onclick = async (e) => {
      if(e.target.closest("button")){
        await refresh()
          let row= e.target.closest("tr")
          let message=row.querySelector("input").value
          let user_id=row.querySelector("#user_id").textContent.trim();
          if(message.trim()==="")return
          await fetch("/admin/notify_user/"+user_id, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ message })
          }).then(res => res.json()).then(console.log);
          // need to add error handling this is temporary
      }
  }
  