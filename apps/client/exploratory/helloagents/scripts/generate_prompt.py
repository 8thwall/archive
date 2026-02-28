#!/usr/bin/python3

import argparse

from utils import download_from_url, extract_ecs_definition, save_file

parser = argparse.ArgumentParser(
    description="Generate a prompt for the 8W Studio Code Generator.",
)
parser.add_argument(
    "--explain-code",
    default=False,
    action="store_true",
    help="Whether to explain the generated code.",
)


def generate_prompt(
    example_code_question_pairs: list[tuple[str, str]],
    args: argparse.Namespace = parser.parse_args(),
) -> None:
    """
    Generate a prompt for the 8W Studio Code Generator.

    Args:
        example_code_question_pairs: list[tuple[str, str]]: Example Code URL & question pairs to be included within the prompt.
    """
    ecs_definition = extract_ecs_definition()
    examples = [download_from_url(url) for url, _ in example_code_question_pairs]
    code_style = (
        "Generate the code first and follow up with an explanation of the code."
        if args.explain_code
        else "Only generate code. Nothing more, nothing less. You do not need to explain the code."
    )
    prompt = f"""## Generated using scripts/generate_prompt.py\n## Do not edit the file directly.\n\n
SYSTEM_PROMPT = \"\"\"You are a experienced software engineer with exceptional skills in javascript and typescript. In addition you are great at developing custom components using the @8thwall/ecs library. Given a prompt/question, your job is to generate a custom component that addresses the requirements provided in the prompt.

<guidelines>
- Use a stateMachine whenever there is a need for event handling. States within stateMachines have the `onEvent` callback that are ideal for scenarios as they are cleaner and automatically cleanup listeners to prevent the issue of dangling listeners.
- To update the fields within `data` or `schema` of a component, always use the `dataAttribute.set` and `schemaAttribute.set` respectively.
- {code_style}
</guidelines>

{ecs_definition}
    """

    for example, (url, question) in zip(examples, example_code_question_pairs):
        prompt += f"\n\n<example_code>\nHuman: {question}\nAssistant:\n```javascript\n{example}\n```\n</example_code>\n\n"
    prompt += '"""'

    save_file("./src/generated/prompt.py", f"{prompt}")


if __name__ == "__main__":
    example_code_question_pairs = [
        (
            "https://www.8thwall.com/api/public/repos-public/get/9fcbcbb0-81b1-477a-8852-e695ecb7da14/5bf9ed8ac8f0eb0050ae06359ba02ab6d244b11a/code/follow-camera.ts",
            "Can you create a camera follower component that makes a camera entity follow a player entity with a configurable offset position?",
        ),
        (
            "https://www.8thwall.com/api/public/repos-public/get/4fdfbd6f-ae81-4bf9-b0f9-dd1621cb65c6/8905a620128568d8f706e7948b1826a7bb93a40c/code/vehicle-controller.ts",
            "Generate a vehicle controller component that allows a vehicle entity to be controlled by player input?",
        ),
        (
            "https://www.8thwall.com/api/public/repos-public/get/6933d824-88f5-4137-a0c8-73c2f22b2a5a/7bec96c23cd81c550d1b17dc41da4e8b9697d1f7/code/falling-apples/apple-spawner.ts",
            "Create a component that spawns apple entities from a prefab every second. Each apple should appear above the spawner's position and have physics properties like mass and a spherical collider.",
        ),
        (
            "https://www.8thwall.com/api/public/repos-public/get/291ecb81-dce0-431d-80f0-5547778e66e0/2af91e2f59333ee0e32ede2d5242c130724b78f5/code/random-quote.ts",
            "Can you generate component that fetches data from a remote API and updates the User Interface with the fetched data?",
        ),
    ]
    generate_prompt(example_code_question_pairs, args=parser.parse_args())
