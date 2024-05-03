import express, { Router } from "express";
import serverless from "serverless-http";
import OpenAI from 'openai';
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const api = express();
const router = Router();
const session = require('express-session');

api.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

async function talk(prompt){
  const params: OpenAI.Chat.ChatCompletionCreateParams = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  };
  let completion;
  try{
    completion = await openai.chat.completions.create(params);
  }catch( error ){
    // Error
    return {
      error: error.error.code,
    }
  }
  return completion.choices[0]?.message?.content;
}

router.get('/start', async (req: express.Request & { session: any }, res) => {
  const ssn = req.session;
  const message = await talk('Name a random famous person or fictional character.');
  ssn.person = message;
  if(message?.error){
    return res.status(200).json({
      success: false,
      error: {
        code: 'api_error',
        message: message.error,
      }
    });
  }

  return res.status(200).json({
    success: true,
    message: message,
  });
});

router.get('/ask', async (req: express.Request & { session: any }, res) => {
  let question = req.query?.question;
  if(question){
    question = question.toString().trim();
  }else{
    return res.status(200).json({
      success: false,
      error: {
        message: 'Please ask a question',
      }
    });
  };

  const ssn = req.session;
  if(!ssn.person){
    return res.status(200).json({
      success: false,
      error: {
        message: 'Please restart the game.',
      }
    });
  }

  console.log('question: '+question);

  const message = await talk(`Answer the following question as if you're ${ssn.person}, responding with either 'Yes' or 'No': ${question}. If it isn't with either a 'Yes' or 'No' response, respond with 'error_not_a_question`);
  if(message === 'error_not_a_question'){
    return res.status(200).json({
      success: false,
      error: {
        message: "Please enter a valid question.",
      }
    });
  }
  if(message.error){
    return res.status(200).json({
      success: false,
      error: {
        message: message.error,
      }
    });
  }
  
  return res.status(200).json({
    success: true,
    message: message,
  });
});

api.use("/api/", router); // All routes will be available under /api path

export const handler = serverless(api);
