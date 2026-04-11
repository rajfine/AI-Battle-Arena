import express from 'express'
import useGraph from './services/graph.ai.service.js'

const app = express()

app.get('/health',(req,res)=>{
  res.status(200).json({
    status: 'ok'
  })
})

app.get("/usegraph", async (req, res)=>{
  const result: any = await useGraph("write the factorial code in java")
  return res.status(200).json(result)
})


export default app