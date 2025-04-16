#!/usr/bin/env python3
import os
import argparse
import pyperclip

def copy_all(folder_path, extensions):
    all_content = ""
    # Ensure the folder exists
    if not os.path.isdir(folder_path):
        print(f"Folder '{folder_path}' does not exist.")
        return

    # Normalize extensions (ensure they start with a dot and are lowercase)
    extensions = [ext if ext.startswith('.') else f'.{ext}' for ext in extensions]
    extensions = [ext.lower() for ext in extensions]

    # Iterate over files in the folder recursively
    for root, dirs, files in os.walk(folder_path):
        for filename in files:
            # Check if file ends with one of the desired extensions
            if any(filename.lower().endswith(ext) for ext in extensions):
                file_path = os.path.join(root, filename)
                if os.path.isfile(file_path):
                    try:
                        with open(file_path, 'r', encoding='utf-8') as file:
                            content = file.read()
                    except Exception as e:
                        print(f"Could not read {file_path}: {e}")
                        continue
                    print(f"Copied content of '{filename}' to clipboard.")
                    all_content += f"File: {os.path.join(root, filename)}\n\n{content}\n\n\n"

    pyperclip.copy(all_content)
    print("All contents copied to clipboard.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Copy contents of files with specified extensions.")
    parser.add_argument("folder", nargs='?', default=os.getcwd(),
                        help="Target folder path (defaults to current directory).")
    parser.add_argument("-e", "--extensions", nargs='+', default=[".c", ".h", ".json", ".map"],
                        help="List of file extensions to include (e.g., -e .txt .py). Default: .c .h .json .map")

    args = parser.parse_args()
    copy_all(args.folder, args.extensions)
