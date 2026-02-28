#!/bin/bash

set -e

REPO_ROOT="$(git rev-parse --show-toplevel)"
DISCORD_ACTIVITY_EXAMPLE_DIR="$REPO_ROOT/apps/client/exploratory/discord-activity-example"
ENV_FILE="$DISCORD_ACTIVITY_EXAMPLE_DIR/.env"

verify_value() {
  local arg=$1
  local arg_name=$2
  local default_value=$3

  if [ -z "$arg" ]; then
    if [ -n "$default_value" ]; then
      arg="$default_value"
    else
      echo "Error: Missing $arg_name value." >&2
      return 1
    fi
  fi

  echo "$arg"
}

DEFAULT_APP_CONFIG_PATH="$REPO_ROOT/reality/app/nae/nae-build-request-data/discord-activity-example-html-prod.json"
APP_CONFIG_PATH="$(verify_value "$1" "app_config_path" "$DEFAULT_APP_CONFIG_PATH")"

add_env_var() {
  local var_name="$1"
  local value="$2"

  # Check if variable already exists
  if grep -q "^${var_name}=" "$ENV_FILE"; then
    sed -i '' "s|^${var_name}=.*|${var_name}=${value}|" "$ENV_FILE"
  else
    echo "${var_name}=${value}" >> "$ENV_FILE"
  fi
}

add_env_var_with_prompt() {
  local var_name="$1"
  local prompt_message="$2"

  # Check if variable already exists in .env file
  if ! grep -q "^${var_name}=" "$ENV_FILE"; then
    if [ -n "$prompt_message" ]; then
      # Prompt the user for input, but hide input for sensitive data
      read -s -p "$prompt_message: " user_input

      local value="$user_input"
      local input_length=${#user_input}
      local asterisks=$(printf '%*s' "$input_length" | tr ' ' '*')
      echo "$asterisks"
    else
      echo "Error: No prompt message provided for $var_name"
      exit 1
    fi

    add_env_var "$var_name" "$value"
  fi
}

# Create .env file if it doesn't exist
if [ ! -f "$ENV_FILE" ]; then
  echo "Creating .env file..."
  touch "$ENV_FILE"
fi

echo "Checking .env file for required variables..."
add_env_var_with_prompt "DISCORD_CLIENT_ID" "Enter your Discord Client ID"
add_env_var_with_prompt "DISCORD_CLIENT_SECRET" "Enter your Discord Client Secret"

# Build the HTML bundle using the packager
OUTPUT_ZIP="$DISCORD_ACTIVITY_EXAMPLE_DIR/dist/html-bundle.zip"

bazel run --run_under="cd $PWD && " //reality/app/nae/packager:packager -- \
  --config="$APP_CONFIG_PATH" \
  --out="$OUTPUT_ZIP"

HOST_DIR="$DISCORD_ACTIVITY_EXAMPLE_DIR/dist/html-bundle"
unzip -o "$OUTPUT_ZIP" -d "$HOST_DIR"

add_env_var "DISCORD_CLIENT_HOST_PATH" "$HOST_DIR"

# Serve the project with an API to serve the discord session token
bazel run --run_under="cd $DISCORD_ACTIVITY_EXAMPLE_DIR && " \
  //apps/client/exploratory/discord-activity-example/src:app
