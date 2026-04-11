import { HumanMessage } from "@langchain/core/messages";
import { StateSchema, MessagesValue, ReducedValue, StateGraph, START, END } from "@langchain/langgraph";
import type { GraphNode } from '@langchain/langgraph'
import { createAgent, providerStrategy } from 'langchain'
import {z} from 'zod'
import { cohereModel, mistralModel, geminiModel } from "./models.service.js";


const State = new StateSchema({
  messages: MessagesValue, 
  solution_1: new ReducedValue(z.string().default(""),{
    reducer: (current, next)=>{
      return next;
    }
  }),
  solution_2: new ReducedValue(z.string().default(""),{
    reducer: (current, next)=>{
      return next;
    }
  }),
  judge_recommendation: new ReducedValue(z.string().default({
    solution_1_score: 0,
    solution_2_score: 0,
  }),{
    reducer: (current, next)=>{
      return next;
    }
  })
});

const solutionNode: GraphNode<typeof State> = async (state: typeof State)=>{
  console.log(state)
  const [mistral_solution, cohere_solution] = await Promise.all([
    mistralModel.invoke(state.messages[0].text),
    cohereModel.invoke(state.messages[0].text),
  ])

  return {
    solution_1: mistral_solution.text,
    solution_2: cohere_solution.text
  }
};

const judgeNode: GraphNode<typeof State> = async (state: typeof State)=>{
  const {solution_1, solution_2} = state;
  const judge = createAgent({
    model: geminiModel,
    tools: [],
    responseFormat: providerStrategy(z.object({
      solution_1_score: z.number().min(0).max(10),
      solution_2_score: z.number().min(0).max(10),
      
    }))
  })

  const judgeResponse = await judge.invoke({
    messages: [
      new HumanMessage(
        `you are the judge evaluating two solutions for the question: ${state.messages[0].text} and please provide a score for each solution between 0 and 10, where 10 is the best score. Here are the two solutions: Solution 1: ${solution_1}, Solution 2: ${solution_2}, the solution with the highest score is the winner. Please provide only the scores in your response without any additional text`
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


export default async function(userMessage: string){
  const result = await graph.invoke({
    messages: [
      new HumanMessage( userMessage )
    ]
  })
  
  console.log(result)
  return result;
}














