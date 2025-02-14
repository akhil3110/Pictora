import express from "express"
import {TrainModel, GenerateImage, GenerateImagesFromPack} from "@workspace/common/types"

const app = express()

app.post("/ai/training", (req,res) => {
    try {
        
    } catch (error) {
        
    }
})

app.post("/ai/generate", (req,res) => {

})

app.post("/pack/generate", (req,res) => {
    
})

app.get("/pack/bulk", (req,res) => {
    
})

app.get("/image", (req,res) => {
    
})



app.get("/", (req,res) => {
    res.send("backend app running")
})

app.listen(3001,() => {
    console.log("App running on port 3001")
})