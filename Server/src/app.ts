import express from 'express'
import useGraph from './services/graph.ai.service.js'
import cors from 'cors'

const app = express()

app.use(express.json())

app.use(cors({
  origin: 'http://localhost:5174', // Update this to match your frontend's URL and port
  credentials: true, // Allow cookies to be sent with requests
}))

app.get('/health',(req,res)=>{
  res.status(200).json({
    status: 'ok'
  })
})

app.get("/usegraph", async (req, res)=>{
  const result: any = await useGraph("capital of france?")
  return res.status(200).json(result)
})

app.post("/invoke", async (req, res)=>{
  const {input} = req.body
  const result: any  = await useGraph(input)

  return res.status(200).json({
    message: "graph executed successfully",
    success: true,
    result
  })
})


export default app