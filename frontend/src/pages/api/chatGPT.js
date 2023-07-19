import { Configuration, OpenAIApi } from "openai";

export default async function handler(req, res) {
  const board = req.body.board;

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const system_prompt = `You are a helpful, rule-following game strategiest, playing tic-tac-toe. 
  Tic-tac-toe is a strategy game where two players, Goku and Dragon-Ball, take turns marking spots 
  in a 3x3 grid. The goal is to be the first to get three of their own marks in  a row, either 
  horizontally, vertically, or diagonally.

  A player cannot mark a spot that's already occupied.
  
  Smart moves involve:
  
  Completing a row of three of your own marks (Goku or Dragon-Ball).
  Blocking the opponent from completing their row of three.
  Creating a 'fork' - a position with two potential winning rows.
  Blocking an opponent's fork.
  Occupying the center or a corner if available, as these positions give more winning opportunities.
  Remember, the best move may depend on the current state of the grid and the opponent's strategy.
  
  You will receive a board state and must return the best next available move for Goku. The board state 
  will look like this: [${board}]. The slots are numbered from 0 to 8, left to right, top to bottom. 
  
  DO NOT PICK A SLOT THAT IS OCCUPIED BY DRAGON-BALL OR GOKU.`;

  const func_desc = [
    {
      name: "move",
      description: "Make a move in tic-tac-toe.",
      parameters: {
        type: "object",
        properties: {
          move: {
            type: "integer",
            enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            description: "The unoccupied square to play in",
          },
        },
        required: ["board"],
      },
    },
  ];

  console.log(generatePrompt(board));

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4-0613", // gpt-3.5-turbo-0613 gpt-4-0613
      messages: [
        { role: "system", content: system_prompt },
        { role: "user", content: generatePrompt(board) },
      ],
      functions: func_desc,
      function_call: { name: "move" },
      temperature: 0,
      frequency_penalty: 0.2,
      presence_penalty: 0,
    });
    console.log(completion.data.choices[0].message.function_call);
    res
      .status(200)
      .json({ result: completion.data.choices[0].message.function_call });
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

function generatePrompt(board) {
  const stringifiedBoard = board.toString();
  return `Here is the current state of tic-tac-toe board: [${board}]. You are dragon-ball. The other player is goku.

    What is the best next available move for dragon-ball? Do not choose a square that is already occupied by goku. For instance, if the state of the board is [,,,,goku,,,,], do not choose space 4`;
}
