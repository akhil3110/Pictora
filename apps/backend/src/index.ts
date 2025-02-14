import express from "express"
import {TrainModel, GenerateImage, GenerateImagesFromPack} from "@workspace/common/types"
import {prismaClient} from "@workspace/db/db"

const app = express()
app.use(express.json())
app.use()


const USERID = "adada"


app.post("/ai/training",async (req,res) => {
    try {
        const parsedBody = TrainModel.safeParse(req.body)

        if(!parsedBody.success){
            res.status(401).json({
                message: "Input Incorect"
            })
            return
        }

        const data = await prismaClient.model.create({
            data: {
                name: parsedBody.data.name,
                type: parsedBody.data.type,
                age: parsedBody.data.age,
                ethinicity: parsedBody.data.ethinicity,
                eyeColor: parsedBody.data.eyeColor,
                bald: parsedBody.data.bald,
                userId: USERID,
                zipUrl: "ada"
            }
          })
        
          res.json({
            modelId: data.id
          })



    } catch (error) {
        console.log(error, "/ai/training")
    }
})

app.post("/ai/generate", async(req,res) => {

    try {
        
        const parsedBody = GenerateImage.safeParse(req.body)

        if (!parsedBody.success) {
            res.status(411).json({
                
            })
            return;
        }
    
        const model = await prismaClient.model.findUnique({
            where: {
                id: parsedBody.data.modelId
            }
        })
    
        if (!model || !model.tensorPath) {
            res.status(411).json({
                message: "Model not found"
            })
            return;
        }
    
    
        const data = await prismaClient.outputImages.create({
            data: {
                prompt: parsedBody.data.prompt,
                userId: USERID,
                modelId: parsedBody.data.modelId,
                imageUrl: "",
                falAiRequestId: "adad"
            }
        })
    
        res.json({
            imageId: data.id
        })

    } catch (error) {
        console.log(error, "/ai/generate")
    }

})

app.post("/pack/generate", async (req,res) => {
    
    try {

    const parsedBody = GenerateImagesFromPack.safeParse(req.body)

    if (!parsedBody.success) {
        res.status(411).json({
            message: "Input incorrect"
        })
        return;
    }
    
    const prompts = await prismaClient.packPrompts.findMany({
        where: {
            packId: parsedBody.data.packId
        }
    })

    const model = await prismaClient.model.findFirst({
      where: {
        id: parsedBody.data.modelId
      }
    })

    if (!model) {
      res.status(411).json({
        "message": "Model not found"
      })
      return 
    }

   
    const images = await prismaClient.outputImages.createManyAndReturn({
        data: prompts.map((prompt, index) => ({
            prompt: prompt.prompt,
            userId: USERID,
            modelId: parsedBody.data.modelId,
            imageUrl: "",
            falAiRequestId: ""
        }))
    })

    res.json({
        images: images.map((image) => image.id)
    })
    
        
    } catch (error) {
        console.log(error, "/pack/generate")
    }


})

app.get("/pack/bulk", async(req,res) => {
    try {
        const packs = await prismaClient.packs.findMany({})

        res.json({
            packs
        })
    } catch (error) {
        console.log(error,"/pack/bulk")
    }
})

app.get("/image/bulk", async(req,res) => {
    try {
        const ids = req.query.ids as string[]
        const limit = req.query.limit as string ?? "100";
        const offset = req.query.offset as string ?? "0";
      
        const imagesData = await prismaClient.outputImages.findMany({
          where: {
            id: { in: ids }, 
            userId: USERID,
            status: {
              not: "Failed"
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          skip: parseInt(offset),
          take: parseInt(limit)
        })
      
        res.json({
          images: imagesData
        })
    } catch (error) {
        console.log(error,"imgae/bulk")
    }
})



app.get("/", (req,res) => {
    res.send("backend app running")
})

app.listen(3001,() => {
    console.log("App running on port 3001")
})