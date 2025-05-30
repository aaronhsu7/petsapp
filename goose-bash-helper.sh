#!/bin/bash
# Helper script for Goose to interact with files

# Function to list files in a directory
function list_files() {
  local dir="${1:-.}"
  find "$dir" -type f -not -path "*/node_modules/*" -not -path "*/\.*" | sort
}

# Function to list directories
function list_dirs() {
  local dir="${1:-.}"
  find "$dir" -type d -not -path "*/node_modules/*" -not -path "*/\.*" | sort
}

# Function to read file content
function read_file() {
  local file="$1"
  if [[ -f "$file" ]]; then
    cat "$file"
  else
    echo "File not found: $file"
    return 1
  fi
}

# Function to write to a file
function write_file() {
  local file="$1"
  local content="${@:2}"
  echo "$content" > "$file"
}

# Function to append to a file
function append_file() {
  local file="$1"
  local content="${@:2}"
  echo "$content" >> "$file"
}

# Function to create a directory
function create_dir() {
  local dir="$1"
  mkdir -p "$dir"
}

# Execute the requested function
"$@"
