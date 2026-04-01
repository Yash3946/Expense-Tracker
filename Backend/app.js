const express = require("express")
const app = express()
app.use(express.json())

const userRoutes = require("./src/routes/UserRoutes")
app.use("/user",userRoutes)


//DBCONNECTION:
const DBConnection = require("./src/utils/DBConnection")
DBConnection()

//server creation..
const PORT = 3000
app.listen(PORT,()=>{
    console.log(`server started on port ${PORT}`)
})