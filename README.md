# TitleLens on Google AI Studio

A working prototype of TitleLens: cited title-chain checks on a sample Bengaluru property file.
The title chain and checks are built by plain code. Questions are answered by Gemini, only from
the retrieved pages, and a code validator checks every document number, area and amount in the answer.

All data in the app is fictional sample data.

## Files

- `server.js`: a small Node server (no packages to install). Serves the page and sends questions to Gemini.
  Your API key stays on the server and never reaches the browser.
- `public/index.html`: the whole app (sample file, chain builder, retrieval, validator, UI).
- `package.json`: start script.

## Option A: run it inside Google AI Studio (recommended)

1. Put these three files in a new GitHub repository (keep the `public` folder).
2. Open https://aistudio.google.com and go to **Build**.
3. Choose **Import from GitHub** and pick your repository.
4. AI Studio sets your Gemini API key as a server secret. If it asks for the variable name, use `GEMINI_API_KEY`.
5. Click **Share** to give others a link. They can use the app without seeing your key, but their
   questions count against your Gemini usage.
6. For a public URL, use **Deploy** (it deploys to Cloud Run).

If the import does not start the server, ask the Build chat: "Run this as a Node app with `npm start`
and expose port 3000." The prompt in `AI_STUDIO_PROMPT.md` rebuilds the same app from scratch if needed.

## Option B: run it on your laptop

    GEMINI_API_KEY=your_key_here node server.js

Then open http://localhost:3000. Node 18 or newer is required. Get a key at https://aistudio.google.com/apikey

## Choosing the model

The server uses `gemini-flash-latest` by default. To pick a specific model, set `GEMINI_MODEL`
(for example the model ID shown in AI Studio's model list). If the name is wrong, the app shows
"That Gemini model name was not found".

## What to show in your walkthrough

1. The title chain: the 2017 link is red because the EC lists a sale whose deed is not in the file.
2. Ask "Who sold the property to Anitha Rao?": the answer cites the 2019 deed's recital and the EC row,
   and says the 2017 deed itself is missing.
3. Ask "Is the title clear?": it refuses and lists the open issues.
4. Ask "What is the market value of the flat?": it says it couldn't find this in the file.
5. Open "Retrieval trace" under any answer to show the pages retrieved, their scores and the full prompt.
