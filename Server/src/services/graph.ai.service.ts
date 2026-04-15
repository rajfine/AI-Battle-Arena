import { HumanMessage } from "@langchain/core/messages";
import { StateSchema, MessagesValue, ReducedValue, StateGraph, START, END } from "@langchain/langgraph";
import { createAgent, providerStrategy } from 'langchain'
import { z } from 'zod'
import { cohereModel, mistralModel, geminiModel } from "./models.service.js";


const State = new StateSchema({
  messages: MessagesValue, 
  solution_1: new ReducedValue(z.string().default(""),{
    reducer: (current, next)=>{ return next; }
  }),
  solution_2: new ReducedValue(z.string().default(""),{
    reducer: (current, next)=>{ return next; }
  }),
  judge_recommendation: new ReducedValue(z.object({
    reasoning: z.string().default(""),
    solution_1_score: z.number().default(0),
    solution_2_score: z.number().default(0)
  }).default({
    reasoning: "",
    solution_1_score: 0,
    solution_2_score: 0,
  }),{
    reducer: (current, next)=>{ return next; }
  })
});

function getUserMessageContent(state: typeof State.State) {
  const firstMessage = state.messages[0]

  if (!firstMessage || typeof firstMessage.content !== 'string') {
    throw new Error('A user message is required to run the graph')
  }

  return firstMessage.content
}

const solutionNode = async (state: typeof State.State, config?: any)=>{
  const callbacks = config?.callbacks;
  const userMessage = getUserMessageContent(state)

  const [mistral_solution, cohere_solution] = await Promise.all([
    mistralModel.invoke(userMessage, { callbacks, runName: "mistral" }),
    cohereModel.invoke(userMessage, { callbacks, runName: "cohere" }),
  ])

  return {
    solution_1: mistral_solution.content as string,
    solution_2: cohere_solution.content as string
  }
};

const judgeNode = async (state: typeof State.State)=>{
  const {solution_1, solution_2} = state;
  const userMessage = getUserMessageContent(state)
  const judge = createAgent({
    model: geminiModel,
    tools: [],
    responseFormat: providerStrategy(z.object({
      reasoning: z.string().describe("A short explanation of why this solution is the winner... small but good."),
      solution_1_score: z.number().min(0).max(100),
      solution_2_score: z.number().min(0).max(100),
    }))
  })

  const judgeResponse = await judge.invoke({
    messages: [
      new HumanMessage(
        `You are the judge evaluating two solutions for the question: "${userMessage}". 
Please provide a score for each solution between 0 and 100, where 100 is the best score. 
Here are the two solutions:
Solution 1: ${solution_1}
Solution 2: ${solution_2}

The solution with the highest score is the winner. Explain why this one is the winner, keep it small but good.
Please provide only the structured data containing scores and reasoning in your response.`
      )
    ]
  })

  return {
    judge_recommendation: judgeResponse.structuredResponse
  }
}

const graph = new StateGraph(State)
  .addNode("solution", solutionNode)
  .addNode("judge", judgeNode)
  .addEdge(START, "solution")
  .addEdge("solution", "judge")
  .addEdge("judge", END)
  .compile();


export async function streamGraph(userMessage: string) {
  // Return the async generator for streamEvents
  return await graph.streamEvents({
    messages: [ new HumanMessage(userMessage) ]
  }, { version: "v2" });
}

export default async function(userMessage: string){
  const result = await graph.invoke({
    messages: [ new HumanMessage( userMessage ) ]
  })
  
  return result;
}












