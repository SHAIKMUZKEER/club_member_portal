# Serverless Lambda Patterns

## When the club recommends Lambda
Use Lambda for short, event-driven tasks: handling an API request, reacting to a file upload, processing a queue message, or running a scheduled job. It is the default starting point for club projects that need a backend.

## Pattern one: HTTP API backend
Put an API endpoint in front of a function and keep the handler thin. Validate input first, do the work in a separate module, and return a clear status code.

## Pattern two: event processing
Trigger a function from a storage event or queue message. Make handlers idempotent, because the same event can be delivered more than once.

## Pattern three: scheduled jobs
Run a function on a schedule for clean-up, reminders, or report generation. Log a start and finish line for each run so failures are easy to spot.

## Common mistakes club members make
Putting long-running work inside a request handler, forgetting to set a timeout that matches the workload, storing secrets in the code instead of a secret store, and giving a function broader permissions than it needs.

## Debugging tips
Check the function logs first, reproduce the payload locally, and add structured log lines with a request identifier. Bring the exact error text to the workshop if you get stuck.
