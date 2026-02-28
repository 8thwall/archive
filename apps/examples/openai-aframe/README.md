# A-Frame: GenAI powered by OpenAI

OpenAI's DALL·E is a powerful GenAI model that creates highly detailed and creative images based on text-based prompts from a user. Developers can use text-to-image prompts powered by DALL·E to create experiences that put creativity in the control of the users. Similarly, ChatGPT enables developers to create personalized and interactive WebAR experiences by understanding and responding to user inputs in real-time.

The A-Frame GenAI Sample Project uses the 8th Wall Module for OpenAI to demonstrate how to apply generative textures to primitives and 3D models, and how to generate conversational text using the OpenAI API. Learn more about 8th Wall’s [Module for OpenAI](https://www.8thwall.com/8thwall/modules/openai)

Use of this module is subject to OpenAI's terms, available at https://openai.com/policies/terms-of-use

![](https://static.8thwall.app/assets/openai-sample-short-hwibtqo5i9.gif)

### Adding your OpenAI Secret API key

To get started, you must add your secret API key to the OpenAI module in the "Options" tab:

1. Go to https://platform.openai.com/account/api-keys to find or generate your OpenAI Secret API Key
2. In your 8th Wall project, click on the `openai` module under "Modules"
3. Paste your OpenAI Secret API Key in the `API Key` field under "Options"

![](https://static.8thwall.app/assets/secret-key-steps-xkfmxgo4lj.png)

Now you're ready to begin using the module! 🎉🎉🎉

### Scene Components

`tv-texture`: demonstrates how to use events emitted from the OpenAI module to receive and
apply a texture returned by the OpenAI API to a sub-mesh (tv screen).

#### Components from the `openai` module:

`openai-overlay`: inserts a prompt box at the top of your scene that interfaces with the OpenAI API

- `mode`: configures the overlay to use either ChatGPT for chat completion, DALL•E for image generation, or the option to toggle between the two. Choose between `chat`, `image` or `toggle` (default).
- `chatModel`: configures the API request to use a specified OpenAI chat model. Be sure to try the slower but much smarter `gpt-4`. (default: 'gpt-3.5-turbo')
- `imageSize`: the size of generated images. Must be one of '256x256', '512x512', or '1024x1024' (default: '512x512')
- `promptPrefix`: this text is prepended to the user's prompt before it is sent. (optional)
- `promptMaxLength`: max character length the overlay will allow (default: 400)
- `chatPlaceholder`: placeholder text displayed in 'chat' mode (default: 'Ask me anything...')
- `imagePlaceholder`: placeholder text displayed in 'image' mode (default: 'Describe an image...')

`openai-texture`: applies the generated DALL•E image as a texture to any primitive or GLB model this component is attached to.

`openai-text`: applies the text response from the ChatGPT API as a `value` to any element this component is attached to. In this case, `<a-text>` or `<a-troika-text>`.

- `target`: Apply the result of a generation to any element using a query selector, such as `#elementId`. (optional)
