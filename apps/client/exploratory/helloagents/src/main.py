import boto3
import streamlit as st
from botocore.config import Config
from generated.prompt import SYSTEM_PROMPT
from langchain_aws import ChatBedrockConverse
from langchain_core.messages import HumanMessage, SystemMessage

config = Config(read_timeout=600)
bedrock = boto3.client(
    service_name="bedrock-runtime", region_name="us-west-2", config=config
)
llm = ChatBedrockConverse(
    model="us.anthropic.claude-sonnet-4-20250514-v1:0",
    client=bedrock,
)

st.logo("https://www.8thwall.com/docs/images/branding/8th-Wall-Logo-Purple.svg")
st.write("8th Wall Studio Code Generator")
st.caption(
    "Studio code generation tool with just context engineering. Disclaimer: This tool does not have a chat memory and therefore cannot hold conversations. It is designed for single shot code generation based on the provided context and user input."
)

# Initialize chat history
if "messages" not in st.session_state:
    st.session_state.messages = [
        {
            "role": "assistant",
            "content": "Hi, I can help you create custom components using the `@8thwall/ecs` library. To begin, just let me know what you're requirements using below input box! 👇",
        }
    ]

# Display chat messages from history on app rerun
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# Accept user input
if prompt := st.chat_input("Describe the 8w component you need"):
    # Add user message to chat history
    st.session_state.messages.append({"role": "user", "content": prompt})
    # Display user message in chat message container
    with st.chat_message("user"):
        st.markdown(prompt)

    # Display assistant response in chat message container
    with st.chat_message("assistant"):
        message_placeholder = st.empty()
        full_response = ""
        for chunk in llm.stream(
            [
                SystemMessage(
                    content=[
                        {"type": "text", "text": SYSTEM_PROMPT},
                        {
                            "cachePoint": {"type": "default"},
                        },
                    ]
                ),
                HumanMessage(content=prompt),
            ]
        ):
            chunk_content = chunk.content
            if type(chunk_content) is str:
                full_response += chunk_content
            elif (
                type(chunk_content) is dict
                and "type" in chunk_content
                and chunk_content["type"] == "text"
            ):
                full_response += chunk_content.get("text", "")
            elif type(chunk_content) is list:
                for item in chunk_content:
                    if type(item) is str:
                        full_response += item
                    elif (
                        type(item) is dict and "type" in item and item["type"] == "text"
                    ):
                        full_response += item.get("text", "")
            # Update the message placeholder with the new text
            message_placeholder.markdown(full_response + "▌")
            message_dump = chunk.model_dump()
            if "usage_metadata" in message_dump and message_dump["usage_metadata"]:
                # Print usage metadata if available
                print(message_dump.get("usage_metadata"))
        message_placeholder.markdown(full_response)
        st.feedback("thumbs")
    st.session_state.messages.append({"role": "assistant", "content": full_response})
