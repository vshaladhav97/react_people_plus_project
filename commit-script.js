var fs = require('fs')
var text = fs.readFileSync(process.argv[2], 'utf-8') //Note for husky v5 and up, process.argv[2] is required

const regex = /([A-Z0-9]{2,9}-\d+|PATCH): [A-Z][A-Za-z ]+/
if (regex.test(text)) {
  console.log('\x1b[32m%s\x1b[0m', 'Committed successfully with the correct format !\n')
  process.exit(0)
} else {
  console.log('\x1b[31m%s\x1b[0m', 'Please follow the commit message format: ([JIRA-Ticket-Number]: [Message])\n')
  process.exit(1)
}