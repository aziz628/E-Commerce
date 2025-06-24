//const notifHandler = require("./wsEvents/notifications");
const db = require("../Services/notification_service"); // Your DB logic
const {active_users}=require("../ws/ws_Server")
async function markSeen(ws, data) {
  const lastSeenId = data?.lastSeenId;
  if (!lastSeenId) return ws.send(JSON.stringify({ error: "Missing lastSeenId" }));
  console.log("saving lastSeenId")
  await db.updateLastSeen(ws.user_id, lastSeenId);
  // here idk if i should return a sucess message cause if error
  // i can do function with mapping for message with error status and map to right handler
  //  but for success idk 
}
async function broadcast(data){
  // i might add condition param for certain users group cause this general for all events
  active_users.forEach(ws => {
    ws.send(JSON.stringify(data))
  });
}
async function unicast(id,data){
    active_users.forEach(ws => {
      if(ws.user_id==id) return ws.send(JSON.stringify(data))||true
    });
  return null
}
async function load_notifications(ws,data) {
  console.log('loading notifiications')
  const userId = ws.user_id;
  const last_Seen_notif_Id = await db.getLastSeen(userId);  // e.g. notif_id = 21
  const all_notifications = await db.get_user_notifications(userId);
  console.log("all notifs ",all_notifications)
  if(all_notifications.length==0)
  return ws.send(JSON.stringify({event: "notifications:list", data:{ error:"no notifcations"} }));

  let unseen_notif_count=0
  const lastNotif = all_notifications[0]??null;
  console.log("last notif ",lastNotif)
  console.log("last notif id ",  last_Seen_notif_Id
  )

  if(lastNotif.id!==last_Seen_notif_Id)
  unseen_notif_count=lastNotif.id-last_Seen_notif_Id
  
  ws.send(JSON.stringify({
    event: "notifications:list",
    data: { unseen_notif_count,all_notifications,last_notif_Id:lastNotif.id }
  }));
}

notifHandler={ markSeen, load_notifications ,broadcast,unicast};
//  Event dispatcher map
const eventHandlers = {
  "notification:seen": notifHandler.markSeen,
  "notification:pull":  notifHandler.load_notifications,
};
//  Called for every incoming WS message
function routeMessage(ws, rawMessage) {
  try {
    const { event, data="" } = JSON.parse(rawMessage);
    console.log(`event : '${event}' `,'data : ',data)

    const fn=eventHandlers[event]|| ws.send(JSON.stringify({ error: "Unknown event: " + event }));
    fn(ws, data) ?? null
  } catch (err) {
    ws.send(JSON.stringify({ error: "Invalid message format" }));
  }
}

module.exports = routeMessage;
