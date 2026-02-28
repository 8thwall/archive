import requests


def download_from_url(
    url: str,
) -> str:
    """
    Download text content from a given URL.

    Args:
        url (str): The URL to download the content from.
    """
    response = requests.get(url)
    response.raise_for_status()
    return response.text


def extract_ecs_definition(
    url: str = "https://cdn.8thwall.com/web/ecs/release/ecs-definition-file.ts",
) -> str:
    """
    Extract the ECS definition from the provided url.
    """
    defns = download_from_url(url)
    return f"<ecs_definition>\n{defns}\n</ecs_definition>"


def save_file(path: str, content: str) -> None:
    """
    Save the content to a file at the specified path.

    Args:
        path (str): The file path where the content should be saved.
        content (str): The content to save in the file.
    """
    with open(path, "w") as file:
        file.write(content)
