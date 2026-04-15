import express from 'express'
import useGraph, { streamGraph } from './services/graph.ai.service.js'

const app = express()
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
].filter(Boolean)

app.use(express.json())

app.use((req, res, next) => {
  const origin = req.headers.origin

  if (!origin || allowedOrigins.includes(origin)) {
    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin)
    }
    res.setHeader('Vary', 'Origin')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    if (req.method === 'OPTIONS') {
      res.sendStatus(204)
      return
    }

    next()
    return
  }

  res.status(403).json({
    message: 'Not allowed by CORS',
  })
})

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'AI Battle Arena backend is running',
  })
})

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
  res.flushHeaders?.();
  
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

export default app
