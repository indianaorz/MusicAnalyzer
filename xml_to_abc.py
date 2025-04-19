import os
import argparse
import logging
import sys

# Attempt to import the required library and exit if not found
try:
    from abc_xml_converter import convert_xml2abc
except ImportError:
    logging.error("Fatal Error: Required library 'abc-xml-converter' is not installed.")
    logging.error("Please install it using: pip install abc-xml-converter")
    sys.exit(1) # Exit the script if library is missing

# --- Configuration ---
# Set up logging to provide informative output to the console
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s',
                    handlers=[logging.StreamHandler(sys.stdout)])

# --- Core Function ---
def convert_musicxml_to_abc(input_dir, output_dir):
    """
    Recursively finds MusicXML files (.musicxml) in input_dir,
    converts them to ABC notation (.abc), and saves them in output_dir
    using the abc-xml-converter library.
    """
    # 1. Validate Input Directory
    if not os.path.isdir(input_dir):
        logging.error(f"Error: Input directory '{input_dir}' not found or is not a directory.")
        return False # Indicate failure

    # 2. Ensure Output Directory Exists
    if not os.path.exists(output_dir):
        try:
            os.makedirs(output_dir)
            logging.info(f"Created output directory: '{output_dir}'")
        except OSError as e:
            logging.error(f"Error creating output directory '{output_dir}': {e}")
            return False # Indicate failure
    elif not os.path.isdir(output_dir):
         logging.error(f"Error: Output path '{output_dir}' exists but is not a directory.")
         return False # Indicate failure

    # 3. Process Files
    found_xml_files = 0
    attempted_conversions = 0
    failed_files = 0

    logging.info(f"Starting MusicXML to ABC conversion from '{input_dir}' to '{output_dir}'...")

    for root, _, files in os.walk(input_dir):
        for filename in files:
            # Check for MusicXML file extension (case-insensitive)
            if filename.lower().endswith('.musicxml'):
                found_xml_files += 1
                musicxml_file_path = os.path.join(root, filename)

                logging.info(f"Processing: {musicxml_file_path}")
                attempted_conversions += 1 # Increment attempt counter

                try:
                    # --- MODIFIED LINE ---
                    # Removed the 'use_title_as_filename' argument
                    convert_xml2abc(
                        file_to_convert=musicxml_file_path,
                        output_directory=output_dir
                        # We rely on the library's default behavior for naming output files.
                    )
                    # --- END MODIFIED LINE ---

                    # If the function completes without error, we assume it worked.
                    logging.info(f"Conversion successful (assumed) for: {filename}")

                except Exception as e:
                    # Catch any error during the library's conversion process
                    logging.error(f"FAILED to convert '{filename}': {e}", exc_info=False) # Set exc_info=True for full traceback
                    failed_files += 1

    # 4. Log Summary (Rest of the function remains the same...)
    logging.info("-------------------- Conversion Summary --------------------")
    logging.info(f"Total MusicXML files found: {found_xml_files}")
    logging.info(f"Attempted conversions:    {attempted_conversions}")
    logging.info(f"Failed conversions:       {failed_files}")
    logging.info("----------------------------------------------------------")
    if found_xml_files > 0 and failed_files == 0:
         logging.info(f"Conversion process completed successfully.")
         logging.info(f"Please check '{output_dir}' for the generated .abc files.")
    elif found_xml_files == 0:
         logging.info("No .musicxml files were found in the input directory.")
    else:
         logging.warning(f"Conversion process completed with {failed_files} errors.")
         logging.warning(f"Please check the logs above and the content of '{output_dir}'.")

    # Return True if no files failed, False otherwise
    return failed_files == 0

    """
    Recursively finds MusicXML files (.musicxml) in input_dir,
    converts them to ABC notation (.abc), and saves them in output_dir
    using the abc-xml-converter library.
    """
    # 1. Validate Input Directory
    if not os.path.isdir(input_dir):
        logging.error(f"Error: Input directory '{input_dir}' not found or is not a directory.")
        return False # Indicate failure

    # 2. Ensure Output Directory Exists
    if not os.path.exists(output_dir):
        try:
            os.makedirs(output_dir)
            logging.info(f"Created output directory: '{output_dir}'")
        except OSError as e:
            logging.error(f"Error creating output directory '{output_dir}': {e}")
            return False # Indicate failure
    elif not os.path.isdir(output_dir):
         logging.error(f"Error: Output path '{output_dir}' exists but is not a directory.")
         return False # Indicate failure

    # 3. Process Files
    found_xml_files = 0
    attempted_conversions = 0
    failed_files = 0

    logging.info(f"Starting MusicXML to ABC conversion from '{input_dir}' to '{output_dir}'...")

    for root, _, files in os.walk(input_dir):
        for filename in files:
            # Check for MusicXML file extension (case-insensitive)
            if filename.lower().endswith('.musicxml'):
                found_xml_files += 1
                musicxml_file_path = os.path.join(root, filename)

                logging.info(f"Processing: {musicxml_file_path}")
                attempted_conversions += 1 # Increment attempt counter

                try:
                    # Use the library function to convert and save the file.
                    # It expects the input file path and the output directory.
                    # 'use_title_as_filename=False' ensures it uses the original
                    # filename (minus extension) for the output .abc file.
                    convert_xml2abc(
                        file_to_convert=musicxml_file_path,
                        output_directory=output_dir,
                        use_title_as_filename=False
                        # Add other options like skip_tunes=(0, 1) if your MusicXML
                        # files might contain multiple tunes and you only want the first.
                    )
                    # If the function completes without error, we assume it worked.
                    logging.info(f"Conversion successful (assumed) for: {filename}")

                except Exception as e:
                    # Catch any error during the library's conversion process
                    logging.error(f"FAILED to convert '{filename}': {e}", exc_info=False) # Set exc_info=True for full traceback
                    failed_files += 1

    # 4. Log Summary
    logging.info("-------------------- Conversion Summary --------------------")
    logging.info(f"Total MusicXML files found: {found_xml_files}")
    logging.info(f"Attempted conversions:    {attempted_conversions}")
    logging.info(f"Failed conversions:       {failed_files}")
    logging.info("----------------------------------------------------------")
    if found_xml_files > 0 and failed_files == 0:
         logging.info(f"Conversion process completed successfully.")
         logging.info(f"Please check '{output_dir}' for the generated .abc files.")
    elif found_xml_files == 0:
         logging.info("No .musicxml files were found in the input directory.")
    else:
         logging.warning(f"Conversion process completed with {failed_files} errors.")
         logging.warning(f"Please check the logs above and the content of '{output_dir}'.")

    # Return True if no files failed, False otherwise
    return failed_files == 0

# --- Main Execution Block ---
if __name__ == "__main__":
    # Set up command-line argument parsing
    parser = argparse.ArgumentParser(
        description="Recursively convert MusicXML files (.musicxml) in an input folder to ABC notation (.abc) in an output folder."
    )
    parser.add_argument(
        "input_folder",
        help="Path to the folder containing .musicxml files (searched recursively)."
    )
    parser.add_argument(
        "output_folder",
        help="Path to the folder where the converted .abc files will be saved."
    )

    # Parse the arguments provided by the user
    args = parser.parse_args()

    # Run the conversion function
    success = convert_musicxml_to_abc(args.input_folder, args.output_folder)

    # Exit with appropriate status code (0 for success, 1 for failure)
    sys.exit(0 if success else 1)