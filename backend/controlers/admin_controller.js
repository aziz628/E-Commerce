const notif_service=require("../Services/notification_service")
const {broadcast,unicast}=require("../ws/wsEvents/notifications")
const product_service=require('../Services/products_services')

async function send_Notification(req, res) {
    const { message } = req.body;
    
    if (!message) throw new Error("Message is required");
  
    const notification = await notif_service.create_notif(message);
    await notif_service.link_To_All_Users(notification.id,req.admin_id); // might send full obj
    console.log("broadcasting ",notification)
    broadcast({
      event: "new_notification",
      data: {notification:message}
    }); 
    // Push to connected users through WebSocket if needed
    res.status(201).json({ message: "Notification broadcasted" });
  };
  async function send_notif_per_user(req,res){
    id=req.params.user_id;
    const { message } = req.body;
    if (!message) throw new Error("Message is required");
    const notification = await notif_service.create_notif(message);
    await notif_service.link_notif_user(id,notification.id)
   
    let result =unicast(id,{
      event: "new_notification",
      data: {notification}
    })
    if(!result) return res.status(404).json({ error: "user don't exist" });
    res.status(201).json({ message: "Notification sent to user" });
  }
  async function add_product(req,res){
    const product=req.body.product;
    //object
    await product_service.save_product(product);
    res.status(200).json({message:"saved product"})
}
module.exports={send_Notification,send_notif_per_user,add_product}