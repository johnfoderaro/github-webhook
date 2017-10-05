Web hook app

Provide an API that accepts:

- gitHub secret
- gitHub token (for private repos)
- specify endpoint for POSTs? (validate this)
- build a library of common post-hook tasks (clone, run commands, etc.)
- then-able / async await to execute commands after results
- option to return JSON data and handle on own
- log activity with winston
- port
- end point
- POST body is the hash we have to check

async await / promises


const webhook = require('webhook');

const payload = webhook({

});
