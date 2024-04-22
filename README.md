# Who Am I game
An OpenAI-powered Who Am I game?

# Setup 
* Duplicate `.env.example` at `.env`
* Create an OpenAI API key with access to the `gpt-3.5-turbo` model. Add the API Key to `.env`. The value of `SESSION_SECRET` can be a random string.
* Run `npm install`
* To start the server, run `netlify dev`

## Notes
* All server code lives in `netlify/functions`
