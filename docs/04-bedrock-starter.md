# Bedrock Starter Track

## How do I get started with Bedrock
Start with the club's Bedrock starter track. Step one is requesting access to the models you want in the Amazon Bedrock console for your chosen region. Step two is running a single text prompt from the console playground. Step three is calling the same model from a small script using the AWS SDK.

## Region availability
Model availability differs by region, so pick one region for the whole track and stay in it. If a model does not appear in the console list, it is not enabled for your account or region yet.

## Starter project ideas
The club recommends three starter projects: a study-notes summariser, a question answering bot over your own class notes, and a small text classifier for club feedback forms.

## Retrieval-augmented generation basics
For question answering over documents, split documents into sections, create embeddings, store them, retrieve the closest sections for a question, and pass only those sections to the model. Always show which document the answer came from.

## Cost care while learning
Keep prompts short during learning, avoid long loops that call the model repeatedly, and stop any scheduled jobs when you finish a session. Check your budget alert after your first heavy day of testing.

## Where to get help
Bring Bedrock questions to the weekly workshop or post them in the club help thread with your code snippet and the exact error text.
