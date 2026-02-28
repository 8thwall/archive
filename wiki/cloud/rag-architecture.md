# RAG Architecture

 * Proposed Structure:
 * Indexing Part:
 * Filtering / preprocessing text:
 * Generating document tree structure:
 * Generate Summary for each parent file:
 * Processing Parent and Child files:
 * Processing Code : (Needs Research 📕 )
 * Processing Tables (Needs Research 📕 )
 * Replacing the content in the document and preparing it for chunking
 * Chunking Strategy (Needs Research 📕 )
 * Processing Metadata
 * Generating embeddings (Needs Research 📕 )
 * Search Part
 * Conversational Server (Lambda) (Needs Research 📕 )
 * Pre Handling Check
 * Query Decomposition and Query Enhancement (Needs Research 📕 & Future step )
 * Check for multiple request
 * Identify Request Type
 * Process Request
 * Answer Generation using LLM (Needs Research 📕 )
 * Hallucination Check (Needs Research 📕 & Future step )
 * LLM Cache (Future step )
 * Check For Ambiguity (Future step )

Step Function Architecture Diagram:
API Gateway Architecture Diagram:

# Proposed Structure:

# Indexing Part:

### _**Filtering / preprocessing text:**_

The indexing process will start with processing the documents that are stored in the knowledge base in .md format. Initially we need to filter the document text for the character which are not supported by the embedding model. Eg: (\\*, \\#, \\`,~~~, $$$, ***)

### _**Generating document tree structure:**_

Next we need to pass the entire document structure to a function to generate the tree for the input files.

The intent over here is to have this two functions handy at any given point. We are doing to use this to map each child files to the parent file’s summary to get context.

 1. is_parent(file_path) → Boolean : A function to identify if a given file is a root / parent file or not.

 2. find_parent(file_path) → Str: A function to find the parent file for any given file path.

```js
is_parent("Studio/home") -> True
is_parent("Studio/Guides/Audio") -> False

find_parent("Studio/Guides/Audio/index.md") -> Studio/Guides/index.md
find_parent("Studio/Guides/Components/component_schema/index.md") -> Studio/Guides/Components/index.md
```

### _**Generate Summary for each parent file:**_

Due to the limitations of lambda being able to run only 15 min continuously we need to use step function to make this run in batches. So once we get the tree for all the parent files we need to generate summary using bedrock LLM endpoint and save it in a s3 file structure as cache.

This will be helpful to all the child files, as the not only we are not doing the repetitive work of generating summary of the parent document to get the context but we are also making sure that the summary generated for all the child files are same and consistent. Also, reducing the LLM call to bedrock thus even reducing the cost.

### _**Processing Parent and Child files:**_

Once the summary is generated both parent and child files will follow the same processing steps. For each file we will identify if the file consist of the following components:

 * Code

 * Tables

 * Text

This can be a static process using regex or similar method to parse the document and identify this sections.

**Embeddings:** Computers cannot inherently understand words, so we need to convert words into numerical representations. This process is called embedding. There are multiple ways to generate embeddings, but one common approach is to train a deep learning model on a specific task. For example, if the task is sentence translation, you would train a model on that task and use the resulting trained model to generate embeddings suitable for sentence translation. In our case, since we are focusing on code understanding, the best approach is to use a model specifically trained on code generation or code understanding to generate embeddings for the code.

**Chunks:** The text in a document cannot be directly converted into embeddings if the text is very lengthy, such as the size of a book. Therefore, it must be divided into smaller parts. Each of these smaller sections is called a chunk.

### _**Processing Code : (Needs Research**_ )

The embedding models currently provided by Amazon Bedrock consist of only two options (Titan and Cohere), which are trained on natural language sentences rather than code. Therefore, it is recommended to use a large language model (LLM) to generate a summary of the code and then create embeddings based on that summary.

When saving these embeddings, a useful approach is to append the original code to the summary and store them together in the database. This ensures that when retrieving the original text associated with the embeddings, both the summary and the original code are available.

### _**Processing Tables (Needs Research**_ _**)**_

Similar to Code we can’t directly process the tables. One of the approach we can try here is to convert each row of the table in a meaningful sentence using LLM and then use that as text. This still needs some research on what is the best manner to preserve the context of the table and process it to generate embeddings. But overall we will be replacing the tables to text.

Research Link: Processing Tables

### _**Replacing the content in the document and preparing it for chunking**_

Once the sections are identified we will be creating a temporary document where we will be replacing each sections and then move on with the chunking strategy.

### _**Chunking Strategy (Needs Research**_ _**)**_

Now once the document is prepared, we need to make sure that each chunk of the document has the context of the entire document and the parent’s document too. Thus the chunk we will be creating will be in the following format:

Here we are using a hybrid approach of Recursive and Semantic chunking strategy. And we are making sure that if the content of one section is too large and we need to split it into multiple chunks. We will make sure to append the header title to each chunks too so that context can be passed to each chunks.

### _**Processing Metadata**_

Along with each chunks we are going to add the following metadata for corresponding to the information of each chunks:
```json
{
 "Source": "",
 "Title": "",
 "Section": "",
 "Tag": "",
 "Content Type": "[code/table/text]",
}
```

### _**Generating embeddings (Needs Research**_ _**)**_

Once we are ready with out chunks we can use the embeddings models to generate embeddings and save them in the database. Now again some research is needed here to identify which embedding models is best for our use case.

* * *

# Search Part

### Conversational Server (Lambda) _**(Needs Research**_ _**)**_

To begun with we will start with an auto-scalable server from AWS (Lambda) to handle the user request. Along with this it will also handle sessions and authentication if needed.

### Pre Handling Check

Every user request with context history goes though this check. This is a pre check for some of the logics like:

 * Relevancy Check

 * Profanity Check

 * Prompt Injection

 * Check for PII and remove it

 * Language Detection

 * Fetch Metadata from user profile

Each of this sections will be handled in a asynchronous manner to reduce the latency.

### Query Decomposition and Query Enhancement _**(Needs Research**_ & Future step :future: _**)**_

When we receive a user request containing multiple questions, we need to decompose it and treat each question as an independent request. There are several approaches to achieve this. One approach is to use a Large Language Model (LLM) to identify and separate individual questions from the user's request.

Another approach is called **query enhancement** , where we rewrite the user request to make it more structured or focused before processing it as a single request.

Query Decomposition

### Check for multiple request

This is a routing component that identifies multiple queries in a user request. If multiple queries are detected, it sends each query asynchronously to the search component. When generating the final answer, all sub-questions and their respective retrieved chunks are combined to produce a cohesive response.

### Identify Request Type

Once the request is obtained, the next task is to classify the request in one of the following classes:

Identify request type:

 * Document : Can the user request be resolved with a document?

 * Code: Does the user request is expecting a code output?

 * Code + Doc: Combination of code + document

 * Q/A: Is the user asking a single line answer?

### Process Request

We combine the following information here and implement a search query:

 * User Question

 * Meta Data

 * Request Type

We have different database for different actions, if the request type is only code we point to code embedding generation and do a query in code database. Same goes for KB embeddings and Code + KB embeddings.

### Answer Generation using LLM _**(Needs Research**_ _**)**_

This is the main component which generates the answer from the retrieved chunks. It takes the following variables as input and then use prompt to generate the answer:

 * User Request

 * Meta Data

 * History

 * Request Type

 * Selected Chunks
Jini - Response Generation

### Hallucination Check _**(Needs Research**_ & Future step :future: _**)**_

There are several methods to validate if the LLM is hallucination. Once we get some time we can explore this methods:

Reference:

 * [Astute RAG: Overcoming Imperfect Retrieval Augmentation and Knowledge Conflicts for Large Language Models ](<https://arxiv.org/pdf/2410.07176>)

 * [Tug-of-War Between Knowledge: Exploring and Resolving Knowledge Conflicts in Retrieval-Augmented Language Models](<https://arxiv.org/pdf/2402.14409>)

 * [SELF-CONTRADICTORY HALLUCINATIONS OF LLMS: EVALUATION, DETECTION AND MITIGATION](<https://arxiv.org/pdf/2305.15852>)

 * [HaluEval: A Large-Scale Hallucination Evaluation Benchmark for Large Language Models](<https://arxiv.org/pdf/2305.11747v2>)

 * [A Survey on Hallucination in Large Language Models: Principles, Taxonomy, Challenges, and Open Questions](<https://arxiv.org/pdf/2311.05232>)

 * [Detecting and Mitigating Hallucinations in Multilingual Summarisation](<https://arxiv.org/pdf/2305.13632v1>)

### LLM Cache (Future step :future: )

This step involves a quick check to determine if a similar request with the same metadata is already present in the cache. If it is, we can reuse the chunks from that response to generate an answer based on the user's question. This approach helps reduce latency and cost.

### Check For Ambiguity (Future step :future: )

For a given user request, some chunks might provide correct answers but conflict with one another.

For example, a user might ask, _"How do I restart my PC?"_ The retrieved chunks could include the process for restarting a Mac and the process for restarting a Windows PC. Although both chunks answer the question correctly, they conflict with each other.

In such cases, it is necessary to ask the user a clarification question. This improves both the user experience and the accuracy of the response generated by the bot.
