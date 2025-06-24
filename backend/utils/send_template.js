function send_template(res,template,data={}){
  res.render(template,data,(err,html)=>{
    console.error(err);
      if(err){ return res.status(404).send('page not found'); }
      res.send(html);
    })
}

module.exports=send_template