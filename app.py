import os
import json
from flask import (Flask, request, render_template, redirect, url_for,
                   flash, send_from_directory, abort, jsonify)
from werkzeug.utils import secure_filename
import mido
import logging
import sys       # <--- Added sys from previous step, ensure it's there
import tempfile  # <--- Added tempfile from previous step, ensure it's there
import uuid     
import copy
import math
from music21.clef import PercussionClef
from music21.midi.percussion import PercussionMapper
import music21.midi.translate as m21midi




try:
    from abc_xml_converter import convert_xml2abc
except ImportError:
    logging.error("Fatal Error: Required library 'abc-xml-converter' is not installed.")
    logging.error("Please install it using: pip install abc-xml-converter")
    sys.exit(1) # Exit the script if library is missing

import music21 # Make sure you have installed music21: pip install music21

from music21.instrument import UnpitchedPercussion
from music21.note import Unpitched
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


# Add this mapping constant just before your route definitions:
DRUM_PITCH_TO_ABC = {
    35: 'B,,,', 36: 'C,,', 37: '^C,,', 38: 'D,,', 39: '^D,,', 40: 'E,,',
    41: 'F,,', 42: '^F,,', 43: 'G,,', 44: '^G,,', 45: 'A,,', 46: '^A,,',
    47: 'B,,', 48: 'C,', 49: '^C,', 50: 'D,', 51: '^D,', 52: 'E,',
    53: 'F,', 54: '^F,', 55: 'G,', 56: '^G,', 57: 'A,', 58: '^A,',
    59: 'B,', 60: 'C', 61: '^C', 62: 'D', 63: '^D', 64: 'E',
    65: 'F', 66: '^F', 67: 'G', 68: '^G', 69: 'A', 70: '^A',
    71: 'B', 72: 'c', 73: '^c', 74: 'd', 75: '^d', 76: 'e',
    77: 'f', 78: '^f', 79: 'g', 80: '^g', 81: 'a'
}



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
    """
    Parses a MIDI file and extracts detailed track data including instrument,
    program number, channel, drum track flag, notes, and time signature.
    """
    try:
        mid = mido.MidiFile(filepath)
        # Use default 480 if ticks_per_beat is not set or zero
        ticks_per_beat = mid.ticks_per_beat if mid.ticks_per_beat and mid.ticks_per_beat > 0 else 480
        tracks_data = []

        # --- Time Signature Extraction ---
        time_sig_numerator = 4  # Default
        time_sig_denominator = 4 # Default
        time_sig_found = False
        # Often in track 0, but check all tracks just in case
        for track in mid.tracks:
            for msg in track:
                if msg.is_meta and msg.type == 'time_signature':
                    time_sig_numerator = msg.numerator
                    time_sig_denominator = msg.denominator
                    # We typically only care about the first time signature
                    time_sig_found = True
                    break # Stop checking messages in this track
            if time_sig_found:
                break # Stop checking other tracks
        if not time_sig_found:
             app.logger.warning(f"No time signature found in {os.path.basename(filepath)}. Using default 4/4.")
        app.logger.info(f"Detected Time Signature for {os.path.basename(filepath)}: {time_sig_numerator}/{time_sig_denominator}")

        # --- Track Processing ---
        for i, track in enumerate(mid.tracks):
            current_time_ticks = 0
            notes_on = {}
            processed_notes = []
            track_name = f"Track {i}"
            instrument_name = "Unknown"
            program_number = None # Initialize program_number for this track
            is_drum_track = False
            channel_found = -1 # Initialize channel for this track (-1 means not found yet)

            # --- Pass 1: Metadata Extraction (Name, Channel, Program, Drum Status) ---
            temp_program_found = False
            # Iterate once to find the *first* channel, *first* program change, and name
            for msg in track:
                # Find the first channel used in the track's messages
                if not msg.is_meta and hasattr(msg, 'channel') and channel_found == -1:
                    channel_found = msg.channel
                    # Check if this first channel indicates a drum track
                    if channel_found == 9: # Channel 10 (0-indexed) is GM standard for drums
                        is_drum_track = True
                        app.logger.info(f"Track {i} identified as drum track based on channel 9.")

                # Get the first program change associated with the determined channel (or any if channel unknown)
                if msg.type == 'program_change' and not temp_program_found:
                    # Only accept if channel matches or if we haven't found a channel yet
                    if channel_found == -1 or msg.channel == channel_found:
                        program_number = msg.program # STORE the program number
                        instrument_name = get_instrument_name(program_number)
                        temp_program_found = True
                        # If we found the program change, update the channel if it wasn't set
                        if channel_found == -1:
                             channel_found = msg.channel
                             if channel_found == 9:
                                 is_drum_track = True # Re-check drum status based on PC channel
                                 app.logger.info(f"Track {i} identified as drum track based on Program Change on channel 9.")

                # Get track name
                elif msg.type == 'track_name':
                    track_name = msg.name.strip() # Clean whitespace

            # If it's a drum track (channel 9 was found), ensure instrument name reflects it
            if is_drum_track:
                instrument_name = "Drums"
                # No need to nullify program_number, just the name matters most for drums

            # --- Pass 2: Note Processing ---
            # Reset time accumulation for processing notes from the beginning of the track
            current_time_ticks = 0
            notes_on = {} # Clear notes_on dictionary for note processing pass
            processed_notes = [] # Clear notes list for note processing pass

            for msg in track:
                current_time_ticks += msg.time
                if msg.type == 'note_on' and msg.velocity > 0:
                    # Use the channel found in Pass 1 if available, otherwise default (e.g. 0) or msg.channel
                    # For simplicity, we'll rely on the channel found, assuming track uses one primary channel
                    event_channel = channel_found if channel_found != -1 else msg.channel
                    notes_on[(event_channel, msg.note)] = { # Use (channel, note) tuple as key
                         'start_tick': current_time_ticks,
                         'velocity': msg.velocity
                         }
                elif msg.type == 'note_off' or (msg.type == 'note_on' and msg.velocity == 0):
                    event_channel = channel_found if channel_found != -1 else msg.channel
                    note_key = (event_channel, msg.note)
                    if note_key in notes_on:
                        start_info = notes_on[note_key]
                        duration_ticks = current_time_ticks - start_info['start_tick']
                        if duration_ticks >= 0: # Allow zero duration notes
                            processed_notes.append({
                                'pitch': msg.note,
                                'start_tick': start_info['start_tick'],
                                'duration_ticks': duration_ticks,
                                'velocity': start_info['velocity']
                                # Channel info isn't strictly needed per note if track uses one channel
                            })
                        del notes_on[note_key] # Remove note from tracking

            # Handle notes still 'on' at the end of the track (optional, depends on desired behavior)
            # for key, start_info in notes_on.items():
            #    # Decide how to handle these - e.g., assign a default duration or log a warning
            #    app.logger.warning(f"Note {key[1]} on channel {key[0]} in track {i} was not turned off.")


            # --- Append Track Data to List ---
            # Only add tracks that actually contained note_on/note_off events
            if processed_notes:
                final_channel = channel_found if channel_found != -1 else 0 # Use found channel or default to 0
                tracks_data.append({
                    'track_index': i,
                    'name': track_name,
                    'instrument': instrument_name,
                    'program_number': program_number, # Store the found program number
                    'channel': final_channel,         # Store the found channel
                    'notes': processed_notes,         # Store the processed notes
                    'is_drum_track': is_drum_track    # Store the drum track flag
                })
            else:
                 app.logger.info(f"Track {i} ('{track_name}') skipped - no note on/off events found.")

        # Ensure we return valid defaults if parsing failed early
        if time_sig_numerator <= 0: time_sig_numerator = 4
        if time_sig_denominator <= 0: time_sig_denominator = 4
        if ticks_per_beat <= 0: ticks_per_beat = 480

        return tracks_data, ticks_per_beat, time_sig_numerator, time_sig_denominator

    except mido.ParserError as e:
        app.logger.error(f"Mido ParserError for file {filepath}: {e}")
        flash(f"Error parsing MIDI file '{os.path.basename(filepath)}'. It might be corrupted or not a valid MIDI file.")
        return None, 480, 4, 4 # Return defaults on error
    except IndexError as e:
         app.logger.error(f"Index error processing MIDI file {filepath}: {e}. Might indicate corrupted track data.", exc_info=True)
         flash(f"Error processing MIDI file '{os.path.basename(filepath)}'. Track data might be invalid.")
         return None, 480, 4, 4
    except Exception as e:
        app.logger.error(f"Unexpected error processing MIDI file {filepath}: {e}", exc_info=True)
        flash("An unexpected error occurred while processing the MIDI file.")
        return None, 480, 4, 4 # Return defaults on error
# --- Routes ---

@app.route('/view/<path:filename>')
def view_file(filename):
    """Parses a specific MIDI file and renders the piano roll view."""
    safe_filename = secure_filename(filename)
    if safe_filename != filename:
        app.logger.warning(f"Attempt to access non-secure filename: {filename}")
        abort(404)

    filepath = os.path.join(app.config['UPLOAD_FOLDER'], safe_filename)

    if not os.path.exists(filepath) or not os.path.isfile(filepath):
        app.logger.error(f"File not found at path: {filepath}")
        abort(404)

    app.logger.info(f"Processing view request for: {filepath}")
    # --- MODIFIED CALL ---
    tracks_data, ticks_per_beat, ts_num, ts_den = parse_midi(filepath)

    # --- MODIFIED CHECK ---
    if tracks_data is None: # This implies an error occurred during parsing
        # parse_midi already flashed an error, redirect home
        return redirect(url_for('index'))

    if not tracks_data:
        flash(f"The MIDI file '{safe_filename}' contains no playable note tracks.")
        # Still render the page, but maybe show a message?
        # Let's render it to show the message clearly.

    tracks_data_json = json.dumps(tracks_data)

    # --- PASS NEW DATA TO TEMPLATE ---
    return render_template('results.html',
                           filename=safe_filename,
                           tracks_data=tracks_data,
                           tracks_data_json=tracks_data_json,
                           ticks_per_beat=ticks_per_beat,
                           time_signature_numerator=ts_num, # New
                           time_signature_denominator=ts_den) # New

# ... (keep download_file and main block) ...
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

# Optional: Route to serve uploaded files if needed directly (usually not required)
@app.route('/uploads/<path:filename>')
def download_file(filename):
    try:
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True)
    except FileNotFoundError:
        abort(404)



# C:\Users\leeor\FFCO\MusicAnalyzerDAW\app.py
# ... (keep all imports and other routes/functions as they were) ...
import os
import json
from flask import (Flask, request, render_template, redirect, url_for,
                   flash, send_from_directory, abort, jsonify)
from werkzeug.utils import secure_filename
import mido
import logging
import sys
import tempfile
import uuid # <--- Ensure this is imported

try:
    from abc_xml_converter import convert_xml2abc
except ImportError:
    logging.error("Fatal Error: Required library 'abc-xml-converter' is not installed.")
    logging.error("Please install it using: pip install abc-xml-converter")
    sys.exit(1) # Exit the script if library is missing

import music21 # Make sure you have installed music21: pip install music21
# --- Configuration ---
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'mid', 'midi'}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB limit

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH
app.secret_key = 'a-very-secret-key-change-me-again' # Change for deployment

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
logging.basicConfig(level=logging.INFO)
app.logger.setLevel(logging.INFO)

# --- GM_INSTRUMENTS, get_instrument_name, allowed_file, parse_midi ---
# ... (Keep these functions as they were in the previous correct version) ...
# --- (Previous working functions omitted for brevity) ---

# --- Routes ---

@app.route('/view/<path:filename>')
def view_file(filename):
    """Parses a specific MIDI file and renders the piano roll view."""
    safe_filename = secure_filename(filename)
    if safe_filename != filename:
        app.logger.warning(f"Attempt to access non-secure filename: {filename}")
        abort(404)

    filepath = os.path.join(app.config['UPLOAD_FOLDER'], safe_filename)

    if not os.path.exists(filepath) or not os.path.isfile(filepath):
        app.logger.error(f"File not found at path: {filepath}")
        abort(404)

    app.logger.info(f"Processing view request for: {filepath}")
    tracks_data, ticks_per_beat, ts_num, ts_den = parse_midi(filepath)

    if tracks_data is None: # Error during parsing
        return redirect(url_for('index'))

    if not tracks_data:
        flash(f"The MIDI file '{safe_filename}' contains no playable note tracks.")
        tracks_data = [] # Ensure it's an empty list for the template

    tracks_data_json = json.dumps(tracks_data)

    return render_template('results.html',
                           filename=safe_filename,
                           tracks_data=tracks_data,
                           tracks_data_json=tracks_data_json,
                           ticks_per_beat=ticks_per_beat,
                           time_signature_numerator=ts_num,
                           time_signature_denominator=ts_den)

@app.route('/', methods=['GET'])
def index():
    """Displays the upload form and lists existing MIDI files."""
    uploaded_files = []
    try:
        filenames = os.listdir(app.config['UPLOAD_FOLDER'])
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
             return redirect(url_for('view_file', filename=filename))
        except Exception as e:
            app.logger.error(f'Error during file upload or saving: {e}', exc_info=True)
            flash(f'An error occurred during upload: {e}')
            return redirect(url_for('index'))
    else:
        flash('Invalid file type. Please upload a .mid or .midi file.')
        return redirect(url_for('index'))


@app.route('/uploads/<path:filename>')
def download_file(filename):
    try:
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True)
    except FileNotFoundError:
        abort(404)

import re
token_pattern = re.compile(r'\b(' + '|'.join(map(re.escape, DRUM_PITCH_TO_ABC.values())) + r'|[A-Ga-g](?:,+|\'*)?)\b')



@app.route('/api/convert_selection_to_abc', methods=['POST'])
def convert_selection_to_abc_api():
    """
    Extracts a time range and selected tracks from a MIDI,
    writes a drum‑aware MusicXML (with <midi-unpitched>),
    converts to ABC (injecting I:percmap lines),
    and returns the ABC string.
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON data"}), 400

    # 1. Validate inputs
    try:
        orig_fn  = secure_filename(data['original_filename'])
        start_t  = int(data['min_start_tick'])
        end_t    = int(data['max_end_tick'])
        sel_idxs = [int(i) + 1 for i in data['selected_track_indices']]
        if start_t < 0 or end_t <= start_t:
            raise ValueError("Bad tick range")
    except Exception as e:
        return jsonify({"error": f"Invalid parameters: {e}"}), 400

    midi_path = os.path.join(app.config['UPLOAD_FOLDER'], orig_fn)
    if not os.path.isfile(midi_path):
        return jsonify({"error": "Original MIDI not found"}), 404

    # 2. Prepare temp files
    uid              = uuid.uuid4()
    tmp              = tempfile.gettempdir()
    snippet_mid_path = os.path.join(tmp, f"snippet_{uid}.mid")
    xml_path         = os.path.join(tmp, f"snippet_{uid}.musicxml")
    abc_path         = os.path.join(tmp, f"snippet_{uid}.abc")

    try:
        # 3. Parse MIDI & time sig
        tracks_data, tpb, ts_num, ts_den = parse_midi(midi_path)
        if tracks_data is None:
            return jsonify({"error": "Failed to parse MIDI"}), 500

        # 4. Align to bar
        ticks_per_bar = int(tpb * ts_num * (4 / ts_den))
        bar_index     = start_t // ticks_per_bar
        adj_start     = bar_index * ticks_per_bar
        duration      = end_t - adj_start
        if duration <= 0:
            return jsonify({"error": "Empty selection"}), 400

        # 5. Build snippet MIDI
        snippet = mido.MidiFile(ticks_per_beat=tpb)
        for idx in sel_idxs:
            td = next((t for t in tracks_data if t['track_index']==idx), None)
            if not td or not td['notes']:
                continue

            tr = mido.MidiTrack()
            tr.append(mido.MetaMessage('track_name', name=td['name'], time=0))
            # ch = 9 if td['is_drum_track'] else td['channel']
            ch = 0 if td['is_drum_track'] else td['channel']
            prog = td.get('program_number')
            if not td['is_drum_track'] and prog is not None:
                tr.append(mido.Message('program_change', channel=ch, program=prog, time=0))

            events, last = [], 0
            for n in td['notes']:
                s, e = n['start_tick'], n['start_tick'] + n['duration_ticks']
                if s < end_t and e > adj_start:
                    rs = max(0, s - adj_start)
                    re = min(duration, e - adj_start)
                    if re > rs:
                        events.append((rs, mido.Message('note_on',
                                                       note=n['pitch'],
                                                       velocity=n['velocity'],
                                                       channel=ch, time=0)))
                        events.append((re, mido.Message('note_off',
                                                       note=n['pitch'],
                                                       velocity=0,
                                                       channel=ch, time=0)))
            events.sort(key=lambda x: x[0])
            for t, msg in events:
                msg.time, last = t - last, t
                tr.append(msg)
            tr.append(mido.MetaMessage('end_of_track', time=duration - last))
            snippet.tracks.append(tr)

        if not snippet.tracks:
            return jsonify({"abc_string": "", "warning": "Nothing to convert"}), 200
        snippet.save(snippet_mid_path)

        # 6. Convert to MusicXML with full drum mapping
        score = music21.converter.parse(snippet_mid_path)
        for part_ix, part in enumerate(score.parts):
            td = next((t for t in tracks_data if t['track_index'] == sel_idxs[part_ix]), None)
            if not td or not td['is_drum_track']:
                continue

            # 6A. Mark staff as percussion (unpitched) :contentReference[oaicite:4]{index=4}
            part.insert(0.0, PercussionClef())  # percussion clef for XML
            part.partName = 'Drums'

            # # Gather I:percmap entries
            percmap = {}
            for up in part.recurse().getElementsByClass(Unpitched):
                # Grab the associated instrument (set by Midi translator) :contentReference[oaicite:5]{index=5}
                inst = up.storedInstrument or UnpitchedPercussion()
                midi = getattr(inst, 'midiUnpitched', None)
                if midi is None:
                    # skip or default to bass drum if missing :contentReference[oaicite:6]{index=6}
                    midi = 35
                # Map to ABC via your constant
                abc_note = DRUM_PITCH_TO_ABC.get(midi, 'C,')
                percmap[abc_note] = midi

            # 6B. Re‑insert each instrument so <score‑instrument> / <midi‑unpitched> are emitted :contentReference[oaicite:7]{index=7}
            for inst in {u.storedInstrument for u in part.recurse().getElementsByClass(Unpitched)}:
                part.insert(0.0, inst)

            # Attach for later injection
            part.percmap = percmap

        score.write('musicxml', fp=xml_path)

        # 7. MusicXML → ABC
        convert_xml2abc(file_to_convert=xml_path, output_directory=tmp)
        if not os.path.isfile(abc_path):
            return jsonify({"error": "ABC file not generated"}), 500

        # Read in the raw ABC as a list of lines
        with open(abc_path, encoding='utf-8') as f:
            lines = f.read().splitlines()

        # Build a mapping of voice numbers → drum percmap dicts
        # (voice numbers in ABC are 1-based; score.parts is 0-based)
        drum_voice_maps = {}
        for part_ix, part in enumerate(score.parts):
            orig_idx = sel_idxs[part_ix]       # your original track_index
            td = next((t for t in tracks_data if t['track_index'] == orig_idx), None)
            if td and td['is_drum_track'] and hasattr(part, 'percmap'):
                # ABC voice numbers start at 1
                drum_voice_maps[part_ix + 1] = part.percmap

        # Walk through the ABC, rewriting only drum V: lines
        out = []
        import re
        voice_re = re.compile(r'^(V:\s*)(\d+)(.*)$')

        for line in lines:
            m = voice_re.match(line)
            if m:
                vno = int(m.group(2))
                rest = m.group(3)
                if vno in drum_voice_maps:
                    # 1) emit the voice header with the MIDI directive
                    out.append(f"{m.group(1)}{vno}{rest} perc=true")
                    # 2) immediately follow with each I:percmap line
                    for abc_note, midi_num in drum_voice_maps[vno].items():
                        out.append(f"I:percmap {abc_note} {midi_num}")
                    continue
            # non‑drum lines (or other headers) pass through unchanged
            out.append(line)

        # Join back into a single string
        abc_out = "\n".join(out) + "\n"
        return jsonify({"abc_string": abc_out}), 200


    except Exception as e:
        logging.error("convert_selection_to_abc_api failed: %s", e, exc_info=True)
        return jsonify({"error": "Internal server error"}), 500

    finally:
        for p in (snippet_mid_path, xml_path, abc_path):
            if os.path.exists(p):
                logging.info("Temp file remains: %s", p)


if __name__ == '__main__':
    app.run(debug=True)