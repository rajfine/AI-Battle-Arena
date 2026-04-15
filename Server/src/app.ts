import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import useGraph, { streamGraph } from './services/graph.ai.service.js'
import cors from 'cors'

const app = express()
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5174'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const clientDistPath = path.resolve(__dirname, '../dist/client')

app.use(express.json())

app.use(cors({
  origin: allowedOrigin,
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
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  // Flush headers immediately if possible
  res.flushHeaders();
  
  try {
    const { input } = req.body;
    const events = await streamGraph(input);
    
    for await (const event of events) {
      if (event.event === "on_chat_model_stream") {
        if (event.name === "mistral" || event.name === "cohere") {
          const content = event.data?.chunk?.content;
          if (content) {
            res.write(`data: ${JSON.stringify({ type: "chunk", model: event.name === "mistral" ? 1 : 2, content })}\n\n`);
          }
        }
      }
      // When the main LangGraph ends, it sends the full result
      if (event.event === "on_chain_end" && event.name === "LangGraph") {
        res.write(`data: ${JSON.stringify({ type: "end", result: event.data.output })}\n\n`);
      }
    }
    
    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (error: any) {
    console.error("Streaming error:", error.message || error);
    
    res.write(`data: ${JSON.stringify({ 
      type: "error", 
      message: error.response?.data?.message || error.message || "An error occurred" 
    })}\n\n`);
    res.end();
  }
})

app.use(express.static(clientDistPath))

app.get(/^(?!\/(health|usegraph|invoke)$).*/, (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'))
})

export default app
