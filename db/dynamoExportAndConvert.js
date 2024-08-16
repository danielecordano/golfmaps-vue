//! How to get all records from a Dynamo DB Table and store as regular JSON

// 1. Run the following command in the terminal
// * Note that the output will be in Dynamo JSON format
// aws dynamodb scan --region us-east-2 --profile default --table-name Course-am3brnpa4nbi3gzqthk27susc4-staging > exports.json

// 2. Convert from Dynamo JSON to regular JSON.
const AWS = require('aws-sdk')
const fs = require('fs')

const table = JSON.parse(fs.readFileSync('./exports.json', 'utf-8'))

fs.writeFileSync('exports_unmarshalled.json', '[\n')

table.Items.forEach((item) => {
  fs.appendFileSync(
    'exports_unmarshalled.json',
    JSON.stringify(AWS.DynamoDB.Converter.unmarshall(item)) + ',\n'
  )
})

fs.appendFileSync('exports_unmarshalled.json',']')