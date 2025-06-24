const sqlite= require('sqlite3').verbose()
const path=require('path')
const db_path=path.join(__dirname,'db.sqlite')
// or just use DB/db.sqlite since the CWD of node js (roo) is e_project
const db=new sqlite.Database(db_path, (err) => {
// look for file in absolute path or start from CWD if relative
    if (err) {
        console.error(err.message);
    } else {
        // Enable foreign key support
        db.run('PRAGMA foreign_keys = ON;', (err) => {
            if (err) {
                console.error("Error enabling foreign keys:", err.message);
            } else {
                console.log("Foreign key support enabled");
            }
        });
    }
});
module.exports=db;