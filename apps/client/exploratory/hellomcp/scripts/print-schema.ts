import {zodToJsonSchema} from 'zod-to-json-schema'

// Update the import with schema(s) you want to verify.
import {pathValueSchema as schema} from '../src/schema/common.ts'

// Converts your Zod schema to JSON schema and prints to stdout.
// You can write the results to a file with:
//   npm run print-schema --silent > schema.json
const run = () => {
  const jsonSchema = zodToJsonSchema(schema)
  console.log(JSON.stringify(jsonSchema, null, 2))
}

run()
