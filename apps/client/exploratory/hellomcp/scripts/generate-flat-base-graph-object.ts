/* eslint-disable max-len */
/*
 * NOTE(kyle):
 * - This feature is experimental and has been landed for posterity sake.
 * - Learnings from creating a union of all possible PathValues documented in go/vibe8:
 *   https://docs.google.com/document/d/<REMOVED_BEFORE_OPEN_SOURCING>
 * - Path should be an enum of string literlas rather than a union of string literals.
 * - PathValue is extremely expensive token-wise.
/* eslint-enable max-len */

import {BedrockRuntimeClient, InvokeModelCommand} from '@aws-sdk/client-bedrock-runtime'
import {execSync} from 'node:child_process'
import {readFileSync, writeFileSync} from 'node:fs'
import {join} from 'node:path'

const gitRoot = execSync('git rev-parse --show-toplevel', {encoding: 'utf-8'}).trim()
const sceneGraphPath = join(gitRoot, 'c8/ecs/src/shared/scene-graph.ts')
const flatBaseGraphObjectPath = join(
  gitRoot, 'apps/client/exploratory/hellomcp/scripts/flat-base-graph-object.ts'
)
const sceneGraphContents = readFileSync(sceneGraphPath, 'utf8')
const flatBaseGraphObjectContents = readFileSync(flatBaseGraphObjectPath, 'utf8')

/* eslint-disable max-len */
const SYSTEM_PROMPT = `You are a TypeScript code generator that outputs ONLY valid TypeScript code with no additional text, commentary, explanations, or markdown formatting.

Your task is to generate an updated flat-base-graph-object.ts file based on changes to a scene-graph.ts file. 

Generate two types:
1. Type 'Path': a string literal union of all dot-notation properties in BaseGraphObject
2. Type 'PathValue': a union of objects with single key-value pairs for each Path

Requirements:
1. MAINTAIN EXISTING ORDER: Keep existing Path entries and PathValue definitions in the same order as the current flat-base-graph-object.ts file
2. ADD NEW PROPERTIES: Add any new properties from scene-graph.ts at the appropriate location, grouping them with related properties
3. REMOVE DELETED PROPERTIES: Remove any properties that no longer exist in scene-graph.ts
4. DOT NOTATION: Use dot notation for nested properties (e.g., 'geometry.type', 'material.color')
5. PRESERVE TYPES: Ensure all types match the original definitions in scene-graph.ts
6. HANDLE OPTIONALS: PathValue should represent the non-optional version of each property
7. ALPHABETIZATION: If adding a group of new properties with no clear location, add them alphabetically within their parent category
8. RETAIN HELPER TYPES: Keep any existing helper types at the top of the file (like style types)
9. PRESERVE FORMATTING: Maintain consistent formatting for readability
10. NO CHANGES POLICY: If you detect no changes are needed between scene-graph.ts and the current flat-base-graph-object.ts, simply return the original flat-base-graph-object.ts file without modifications

IMPORTANT: Your response MUST contain ONLY the TypeScript code for the updated flat-base-graph-object.ts file. Do not include any explanations, comments about what you changed, or markdown code blocks. The output will be used directly by other code.`
/* eslint-enable max-len */

const USER_PROMPT = `Here are the source files needed to update the flat-base-graph-object.ts file:

<scene-graph>
${sceneGraphContents}
</scene-graph>
 
<flat-base-graph-object>
${flatBaseGraphObjectContents}
</flat-base-graph-object>

Please generate the updated flat-base-graph-object.ts file with all necessary changes.`

const run = async () => {
  const bedrock = new BedrockRuntimeClient({region: 'us-west-2'})
  const invokeResponse = await bedrock.send(new InvokeModelCommand({
    modelId: 'us.anthropic.claude-3-7-sonnet-20250219-v1:0',
    body: JSON.stringify(({
      'anthropic_version': 'bedrock-2023-05-31',
      'system': SYSTEM_PROMPT,
      // 64k is the max output according to:
      // https://docs.anthropic.com/en/docs/about-claude/models/all-models#model-comparison
      // The system prompt is pretty good though so we should never get close to that.
      'max_tokens': 64_000,
      'temperature': 0,  // Make the output deterministic
      'messages': [{
        role: 'user',
        content: [{
          type: 'text',
          text: USER_PROMPT,
        }],
      }],
    })),
  }))
  const out = JSON.parse(new TextDecoder().decode(invokeResponse.body))
  const {text} = out.content[0]
  const filepath = join(gitRoot, flatBaseGraphObjectPath)
  writeFileSync(filepath, text)
}

run()
