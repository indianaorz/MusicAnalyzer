import os
import json
from flask import (Flask, request, render_template, redirect, url_for, 
                   flash, send_from_directory, abort) # Added send_from_directory, abort
from werkzeug.utils import secure_filename
import mido # Make sure you have installed mido: pip install mido
import logging # For better logging

# --- Configuration ---
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'mid', 'midi'}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB limit

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH
# IMPORTANT: Change this secret key for any real deployment!
app.secret_key = 'a-very-secret-key-change-me-again' 

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Configure Logging
logging.basicConfig(level=logging.INFO)
app.logger.setLevel(logging.INFO)

# --- General MIDI Instrument Map (Program Change to Name) ---
# (Based on GM Standard - you can customize this)
GM_INSTRUMENTS = [
    "Acoustic Grand Piano", "Bright Acoustic Piano", "Electric Grand Piano", "Honky-tonk Piano",
    "Electric Piano 1", "Electric Piano 2", "Harpsichord", "Clavinet", "Celesta", "Glockenspiel",
    "Music Box", "Vibraphone", "Marimba", "Xylophone", "Tubular Bells", "Dulcimer", "Drawbar Organ",
    "Percussive Organ", "Rock Organ", "Church Organ", "Reed Organ", "Accordion", "Harmonica",
    "Tango Accordion", "Acoustic Guitar (nylon)", "Acoustic Guitar (steel)", "Electric Guitar (jazz)",
    "Electric Guitar (clean)", "Electric Guitar (muted)", "Overdriven Guitar", "Distortion Guitar",
    "Guitar Harmonics", "Acoustic Bass", "Electric Bass (finger)", "Electric Bass (pick)",
    "Fretless Bass", "Slap Bass 1", "Slap Bass 2", "Synth Bass 1", "Synth Bass 2", "Violin", "Viola",
    "Cello", "Contrabass", "Tremolo Strings", "Pizzicato Strings", "Orchestral Harp", "Timpani",
    "String Ensemble 1", "String Ensemble 2", "Synth Strings 1", "Synth Strings 2", "Choir Aahs",
    "Voice Oohs", "Synth Voice", "Orchestra Hit", "Trumpet", "Trombone", "Tuba", "Muted Trumpet",
    "French Horn", "Brass Section", "Synth Brass 1", "Synth Brass 2", "Soprano Sax", "Alto Sax",
    "Tenor Sax", "Baritone Sax", "Oboe", "English Horn", "Bassoon", "Clarinet", "Piccolo", "Flute",
    "Recorder", "Pan Flute", "Blown bottle", "Shakuhachi", "Whistle", "Ocarina", "Lead 1 (square)",
    "Lead 2 (sawtooth)", "Lead 3 (calliope)", "Lead 4 (chiff)", "Lead 5 (charang)", "Lead 6 (voice)",
    "Lead 7 (fifths)", "Lead 8 (bass + lead)", "Pad 1 (new age)", "Pad 2 (warm)", "Pad 3 (polysynth)",
    "Pad 4 (choir)", "Pad 5 (bowed)", "Pad 6 (metallic)", "Pad 7 (halo)", "Pad 8 (sweep)",
    "FX 1 (rain)", "FX 2 (soundtrack)", "FX 3 (crystal)", "FX 4 (atmosphere)", "FX 5 (brightness)",
    "FX 6 (goblins)", "FX 7 (echoes)", "FX 8 (sci-fi)", "Sitar", "Banjo", "Shamisen", "Koto",
    "Kalimba", "Bagpipe", "Fiddle", "Shanai", "Tinkle Bell", "Agogo", "Steel Drums", "Woodblock",
    "Taiko Drum", "Melodic Tom", "Synth Drum", "Reverse Cymbal", "Guitar Fret Noise",
    "Breath Noise", "Seashore", "Bird Tweet", "Telephone Ring", "Helicopter", "Applause", "Gunshot"
]

def get_instrument_name(program_number):
    """Gets GM instrument name from program number."""
    if 0 <= program_number <= 127:
        return GM_INSTRUMENTS[program_number]
    return "Unknown Instrument"

# --- Helper Functions ---
def allowed_file(filename):
    """Checks if the file extension is allowed."""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def parse_midi(filepath):
    """Parses a MIDI file and extracts detailed track data including instrument."""
    try:
        mid = mido.MidiFile(filepath)
        ticks_per_beat = mid.ticks_per_beat if mid.ticks_per_beat else 480 
        tracks_data = []
        
        for i, track in enumerate(mid.tracks):
            current_time_ticks = 0
            notes_on = {} 
            processed_notes = []
            track_name = f"Track {i}" 
            instrument_name = "Unknown" # Default instrument
            program_number = None # Store the program number if found

            # Find the first program_change to determine instrument
            # Also find track_name
            for msg in track:
                 if msg.type == 'program_change' and program_number is None: # Take the first one
                    program_number = msg.program
                    instrument_name = get_instrument_name(program_number)
                 elif msg.type == 'track_name':
                    track_name = msg.name
                 # Optimization: Stop searching if both found early? Maybe not worth it.
                 
            # Reset time and process notes
            current_time_ticks = 0
            for msg in track:
                current_time_ticks += msg.time 

                if msg.type == 'note_on' and msg.velocity > 0:
                    notes_on[msg.note] = {
                        'start_tick': current_time_ticks,
                        'velocity': msg.velocity
                    }
                elif msg.type == 'note_off' or (msg.type == 'note_on' and msg.velocity == 0):
                    if msg.note in notes_on:
                        start_info = notes_on[msg.note]
                        duration_ticks = current_time_ticks - start_info['start_tick']
                        if duration_ticks >= 0: 
                             processed_notes.append({
                                'pitch': msg.note, 
                                'start_tick': start_info['start_tick'],
                                'duration_ticks': duration_ticks,
                                'velocity': start_info['velocity'] 
                            })
                        del notes_on[msg.note]

            # Special handling for percussion track (Channel 10, often 9 in 0-based index)
            # Mido doesn't directly expose channel per track easily without iterating messages again
            # A common convention: if no program_change is found, and it's track 9/10, assume Drums.
            # We'll refine this if needed, but for now, rely on program_change.
            is_drum_track = any(msg.channel == 9 for msg in track if not msg.is_meta)
            if is_drum_track and program_number is None:
                 instrument_name = "Drums"


            # Only add tracks that have notes
            if processed_notes: 
                 tracks_data.append({
                    'track_index': i, # Store original index
                    'name': track_name,
                    'instrument': instrument_name,
                    'notes': processed_notes
                })

        return tracks_data, ticks_per_beat

    except mido.ParserError as e:
        app.logger.error(f"Mido ParserError for file {filepath}: {e}")
        flash(f"Error parsing MIDI file '{os.path.basename(filepath)}'. It might be corrupted or not a valid MIDI file.")
        return None, None
    except Exception as e:
        app.logger.error(f"Error processing MIDI file {filepath}: {e}", exc_info=True)
        flash("An unexpected error occurred while processing the MIDI file.")
        return None, None

# --- Routes ---
@app.route('/', methods=['GET'])
def index():
    """Displays the upload form and lists existing MIDI files."""
    uploaded_files = []
    try:
        filenames = os.listdir(app.config['UPLOAD_FOLDER'])
        # Filter for allowed extensions and sort alphabetically
        uploaded_files = sorted([f for f in filenames if allowed_file(f)]) 
    except FileNotFoundError:
        app.logger.warning(f"Upload folder '{app.config['UPLOAD_FOLDER']}' not found.")
    except Exception as e:
        app.logger.error(f"Error listing files in upload folder: {e}")
        flash("Could not list uploaded files.")
        
    return render_template('index.html', uploaded_files=uploaded_files)

@app.route('/upload', methods=['POST'])
def upload_file():
    """Handles file upload, saves it, and redirects to the view page."""
    if 'midi_file' not in request.files:
        flash('No file part in the request.')
        return redirect(url_for('index')) 
    
    file = request.files['midi_file']

    if file.filename == '':
        flash('No file selected.')
        return redirect(url_for('index'))

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename) 
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        try:
             file.save(filepath) 
             app.logger.info(f"File saved to {filepath}")
             flash(f"File '{filename}' uploaded successfully.")
             # Redirect to the view page for the new file
             return redirect(url_for('view_file', filename=filename))

        except Exception as e:
            app.logger.error(f'Error during file upload or saving: {e}', exc_info=True)
            flash(f'An error occurred during upload: {e}')
            return redirect(url_for('index'))
    else:
        flash('Invalid file type. Please upload a .mid or .midi file.')
        return redirect(url_for('index'))

@app.route('/view/<path:filename>')
def view_file(filename):
    """Parses a specific MIDI file and renders the piano roll view."""
    # Ensure the filename is secure and points within the upload folder
    safe_filename = secure_filename(filename)
    if safe_filename != filename: # Check if filename had problematic chars
         app.logger.warning(f"Attempt to access non-secure filename: {filename}")
         abort(404) # Not found or forbidden

    filepath = os.path.join(app.config['UPLOAD_FOLDER'], safe_filename)

    if not os.path.exists(filepath) or not os.path.isfile(filepath):
         app.logger.error(f"File not found at path: {filepath}")
         abort(404) # Use abort for standard HTTP errors

    app.logger.info(f"Processing view request for: {filepath}")
    tracks_data, ticks_per_beat = parse_midi(filepath)

    if tracks_data is None:
        # parse_midi already flashed an error, redirect home
        return redirect(url_for('index'))
    
    if not tracks_data:
         flash(f"The MIDI file '{safe_filename}' contains no playable note tracks.")
         # Still render the page but maybe show a message? Or redirect?
         # Let's render it to show the message clearly.
         
    tracks_data_json = json.dumps(tracks_data) 

    return render_template('results.html', 
                            filename=safe_filename, 
                            tracks_data=tracks_data, # Pass raw data for Jinja loops/info
                            tracks_data_json=tracks_data_json, # Pass JSON string for JS
                            ticks_per_beat=ticks_per_beat)

# Optional: Route to serve uploaded files if needed directly (usually not required)
@app.route('/uploads/<path:filename>')
def download_file(filename):
    try:
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True)
    except FileNotFoundError:
        abort(404)

if __name__ == '__main__':
    app.run(debug=True)