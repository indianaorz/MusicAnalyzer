import os
import json
import re
from flask import (Flask, request, render_template, redirect, url_for,
                    flash, send_from_directory, abort, jsonify, send_file)
import uuid
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

from pathlib import Path

DATA_ROOT = Path('training_data').resolve()      # ① make it absolute


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
    drum track flag, and time signature.
    """
    try:
        mid = mido.MidiFile(filepath)
        ticks_per_beat = mid.ticks_per_beat if mid.ticks_per_beat else 480
        tracks_data = []

        # --- NEW: Time Signature Extraction ---
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
        app.logger.info(f"Detected Time Signature: {time_sig_numerator}/{time_sig_denominator}")
        # --- END NEW ---


        for i, track in enumerate(mid.tracks):
            current_time_ticks = 0
            notes_on = {}
            processed_notes = []
            track_name = f"Track {i}"
            instrument_name = "Unknown"
            program_number = None
            is_drum_track = False

            # Pass 1: Get track name, first program change, and check for drum channel
            temp_program_found = False
            for msg in track:
                if not msg.is_meta:
                    if msg.channel == 9: # Channel 10 (0-indexed) is standard for drums
                        is_drum_track = True

                if msg.type == 'program_change' and not temp_program_found:
                    program_number = msg.program
                    instrument_name = get_instrument_name(program_number)
                    temp_program_found = True
                elif msg.type == 'track_name':
                    track_name = msg.name

            if is_drum_track and program_number is None:
                instrument_name = "Drums"

            # Pass 2: Process notes
            current_time_ticks = 0
            for msg in track:
                current_time_ticks += msg.time
                if msg.type == 'note_on' and msg.velocity > 0:
                    notes_on[msg.note] = { 'start_tick': current_time_ticks, 'velocity': msg.velocity }
                elif msg.type == 'note_off' or (msg.type == 'note_on' and msg.velocity == 0):
                    if msg.note in notes_on:
                        start_info = notes_on[msg.note]
                        duration_ticks = current_time_ticks - start_info['start_tick']
                        if duration_ticks >= 0: # Allow zero duration notes if needed
                             processed_notes.append({
                                 'pitch': msg.note, 'start_tick': start_info['start_tick'],
                                 'duration_ticks': duration_ticks, 'velocity': start_info['velocity']
                             })
                        del notes_on[msg.note]

            if processed_notes:
                 tracks_data.append({
                     'track_index': i,
                     'name': track_name,
                     'instrument': instrument_name,
                     'notes': processed_notes,
                     'is_drum_track': is_drum_track
                 })

        # --- MODIFIED RETURN ---
        return tracks_data, ticks_per_beat, time_sig_numerator, time_sig_denominator

    except mido.ParserError as e:
        app.logger.error(f"Mido ParserError for file {filepath}: {e}")
        flash(f"Error parsing MIDI file '{os.path.basename(filepath)}'. It might be corrupted or not a valid MIDI file.")
        # --- MODIFIED RETURN ---
        return None, None, None, None
    except Exception as e:
        app.logger.error(f"Error processing MIDI file {filepath}: {e}", exc_info=True)
        flash("An unexpected error occurred while processing the MIDI file.")
        # --- MODIFIED RETURN ---
        return None, None, None, None

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

    
    # ─── NEW: sort drums first ───────────────────────────────
    tracks_data.sort(key=lambda t: not t['is_drum_track'])
    # ─────────────────────────────────────────────────────────

    tracks_data_json = json.dumps(tracks_data)
    settings_path = os.path.join(SET_DIR, filename + '.json')
    initial_settings = {}
    if os.path.exists(settings_path):
        with open(settings_path) as f:
            initial_settings = json.load(f)

    # --- PASS NEW DATA TO TEMPLATE ---
    return render_template('results.html',
                           filename=safe_filename,
                           tracks_data=tracks_data,
                           tracks_data_json=tracks_data_json,
                           ticks_per_beat=ticks_per_beat,
                           time_signature_numerator=ts_num, # New
                           time_signature_denominator=ts_den,
                           initial_settings=json.dumps(initial_settings)) # New


def slugify(s: str) -> str:
    return re.sub('[^\w\- ]+', '', s).strip().replace(' ', '_')[:64]

# app.py  – keep DATA_ROOT as before
@app.post('/dataset/motif_variation')
def save_batch():
    data = request.get_json(force=True)
    song   = re.sub(r'[^\w\- ]+', '', data.get('song_name','untitled')).strip() or 'untitled'
    folder = DATA_ROOT / song / 'motif_variation'
    folder.mkdir(parents=True, exist_ok=True)

    for ex in data.get('examples', []):
        # ensure a filename even if UI forgot the id
        fid = ex.get('id') or uuid.uuid4().hex
        (folder / f'{fid}.json').write_text(json.dumps(ex, indent=2))

    return {'saved': len(data.get('examples', []))}


@app.post('/dataset/motif_variation')
def save_motif_variation():
    data = request.get_json(force=True)
    song   = slugify(data.get('song_name' , 'untitled'))
    ex     = data.get('example')
    if not song or not ex:
        abort(400, 'song_name and example required')

    # 1. folder layout  <root>/<song>/motif_variation/
    folder = DATA_ROOT / song / 'motif_variation'
    folder.mkdir(parents=True, exist_ok=True)

    # 2. write the original
    fname = folder / f'{ex["id"]}.json'
    fname.write_text(json.dumps(ex, indent=2))

    # 3. generate 11 transposed copies (-6 … +6 semitones, skip 0)
    m = re.search(r'K:([A-G][b#]?)(maj|min)?', ex['input'])
    if m:
        key = m.group(1)
        for semis in range(-6, 7):
            if semis == 0: continue
            t_in  = transpose_abc(ex['input'] , semis, key)
            t_out = transpose_abc(ex['output'], semis, key)
            if not t_in or not t_out: continue      # skip failures

            tid = uuid.uuid4().hex
            (folder / f'{tid}.json').write_text(json.dumps({
                "id":       tid,
                "function": ex['function'],
                "input":    t_in,
                "output":   t_out
            }, indent=2))

    return jsonify({'status':'ok'})

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



SET_DIR = 'user_settings'
os.makedirs(SET_DIR, exist_ok=True)

@app.route('/settings/<path:fname>', methods=['GET', 'POST'])
def user_settings(fname):
    safe = secure_filename(fname)
    path = os.path.join(SET_DIR, safe)
    if request.method == 'POST':
        with open(path, 'w') as f:
            json.dump(request.get_json(force=True), f)
        return '', 204
    if os.path.exists(path):
        return json.load(open(path)), 200
    return {}, 200

@app.post('/dataset/export_training')
def export_training():
    data = request.get_json(force=True)
    song = slugify(data.get('song_name', 'untitled'))
    examples = data.get('examples', [])
    folder = DATA_ROOT / song / 'instrument_addition'
    folder.mkdir(parents=True, exist_ok=True)
    for ex in examples:
        fid = ex.get('id') or uuid.uuid4().hex
        (folder / f'{fid}.json').write_text(json.dumps(ex, indent=2))
    return jsonify({'saved': len(examples)})


# ----------------------------------------------------------------------
#  /data/index.json  →  flat list of every example we can find
# ----------------------------------------------------------------------
@app.get('/data/index.json')
def data_index():
    """
    Scans training_data/<song>/*/*.json  (recursively) and returns:
        [
          {
            "id": "nw02f2b8",                 # file stem
            "song": "Cannon_in_D",            # parent song folder
            "category": "motif_variation",    # sub-folder
            "path": "Cannon_in_D/motif_variation/nw02f2b8.json",
            "function": "add_third_above",    # if present in file
            "title": "Cannon_in_D • add_third_above"
          },
          ...
        ]
    """
    items = []
    for json_path in DATA_ROOT.rglob('*.json'):
        try:
            payload = json.loads(json_path.read_text())
        except Exception:
            continue                            # skip broken files

        song      = json_path.parts[-3]         # <song>
        category  = json_path.parts[-2]         # motif_variation / …
        fid       = json_path.stem
        function  = payload.get('function', '')
        title     = f"{song} • {function}" if function else f"{song}/{fid}"

        items.append({
            "id": fid,
            "song": song,
            "category": category,
            "path": '/'.join(json_path.parts[-3:]),   # relative to DATA_ROOT
            "function": function,
            "title": title
        })

    # sort sensibly (alpha by song, then whatever)
    items.sort(key=lambda x: (x['song'].lower(), x['title'].lower()))
    return jsonify(items)


# ----------------------------------------------------------------------
#  Serve any individual example JSON (read-only)
# ----------------------------------------------------------------------
@app.get('/data/example/<path:subpath>')
def data_example(subpath):
    wanted = (DATA_ROOT / subpath).resolve()
    print(f"Requested data example: {wanted}")

    # ② reject only if the path escapes the dataset folder
    try:
        wanted.relative_to(DATA_ROOT)
    except ValueError:
        abort(404)

    if not wanted.exists():
        # forgiving fallback (unchanged) …
        candidates = [p for p in DATA_ROOT.rglob(wanted.name)
                      if p.is_file() and p.suffix == '.json']
        if candidates:
            wanted = candidates[0]
        else:
            abort(404)

    return send_file(wanted, mimetype='application/json')


# ----------------------------------------------------------------------
#  Tiny HTML page that hosts the JS browser (see §2)
# ----------------------------------------------------------------------
@app.get('/browse')
def browse():
    return render_template('data_browser.html')

if __name__ == '__main__':
    app.run(debug=True)