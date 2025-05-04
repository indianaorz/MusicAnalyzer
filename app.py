import os
import json
import re
from flask import (Flask, request, render_template, redirect, url_for,
                    flash, send_from_directory, abort, jsonify, send_file)
import uuid
from werkzeug.utils import secure_filename
import mido # Make sure you have installed mido: pip install mido
import logging # For better logging

from typing import List, Dict, Any
import os, json, re, uuid, tempfile, subprocess
from pathlib import Path
import miditoolkit

RENDER_ROOT   = Path('renders').resolve()
SOUNDFONT_SF2 = Path('assets/FluidR3_GM.sf2')   # adjust to taste
RENDER_ROOT.mkdir(exist_ok=True)


# --- Configuration ---
# UPLOAD_FOLDER = 'uploads'
from pathlib import Path

UPLOAD_FOLDER = Path('uploads')
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


import os
import mido
from mido.midifiles.units import tempo2bpm
from flask import flash, current_app

# def get_instrument_name(program_number): ...


def parse_midi(filepath):
    """
    Return:
        tracks_data, ticks_per_beat, ts_num, ts_den, bpm
    or a series of Nones on failure.
    """
    try:
        mid = mido.MidiFile(filepath)
    except (OSError, IOError, EOFError, ValueError) as e:
        current_app.logger.error(f"Unable to read MIDI '{filepath}': {e}")
        flash(f"Could not read MIDI file '{os.path.basename(filepath)}'. "
              "It might be corrupted or not a valid MIDI file.")
        return None, None, None, None, None

    ticks_per_beat = mid.ticks_per_beat or 480

    # ── Time‑signature (first one found) ────────────────────────────────
    ts_num, ts_den = 4, 4
    for tr in mid.tracks:
        for msg in tr:
            if msg.is_meta and msg.type == "time_signature":
                ts_num, ts_den = msg.numerator, msg.denominator
                break
        else:
            continue
        break
    current_app.logger.info(f"Time signature: {ts_num}/{ts_den}")

    # ── Tempo (µs per quarter → BPM) ───────────────────────────────────
    bpm = 120
    for tr in mid.tracks:
        for msg in tr:
            if msg.is_meta and msg.type == "set_tempo":
                bpm = int(tempo2bpm(msg.tempo))
                break
        else:
            continue
        break
    current_app.logger.info(f"Tempo: {bpm} BPM")

    # ── Track & note extraction ────────────────────────────────────────
    tracks_data = []
    for i, track in enumerate(mid.tracks):
        is_drum      = False
        program_no   = None
        instrument   = "Unknown"
        track_name   = f"Track {i}"

        # pass 1 – meta info
        for msg in track:
            if not msg.is_meta and msg.channel == 9:
                is_drum = True
            if msg.type == "program_change" and program_no is None:
                program_no = msg.program
                instrument = get_instrument_name(program_no)
            elif msg.type == "track_name":
                track_name = msg.name

        if is_drum and program_no is None:
            instrument = "Drums"

        # pass 2 – notes
        cur_tick = 0
        notes_on = {}
        notes    = []

        for msg in track:
            cur_tick += msg.time
            if msg.type == "note_on" and msg.velocity > 0:
                notes_on[msg.note] = {"start_tick": cur_tick,
                                      "velocity":   msg.velocity}
            elif msg.type in ("note_off", "note_on") and msg.velocity == 0:
                start = notes_on.pop(msg.note, None)
                if start:
                    dur = cur_tick - start["start_tick"]
                    if dur >= 0:
                        notes.append({
                            "pitch":          msg.note,
                            "start_tick":     start["start_tick"],
                            "duration_ticks": dur,
                            "velocity":       start["velocity"],
                        })

        if notes:
            tracks_data.append({
                "track_index":   i,
                "name":          track_name,
                "instrument":    instrument,
                "notes":         notes,
                "is_drum_track": is_drum,
            })

    return tracks_data, ticks_per_beat, ts_num, ts_den, bpm

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
    song_title = Path(safe_filename).stem

    # --- MODIFIED CALL ---
    tracks_data, ticks_per_beat, ts_num, ts_den,bpm = parse_midi(filepath)

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

    # ensure BPM is in the saved settings
    initial_settings['bpm'] = bpm

    # --- PASS NEW DATA TO TEMPLATE ---
    return render_template('results.html',
                           filename=safe_filename,
                           tracks_data=tracks_data,
                           song_title=song_title,
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

@app.post('/dataset/generation')
def save_generation():
    data = request.get_json(force=True)
    song = re.sub(r'[^\w\- ]+', '', data.get('song_name', 'untitled')).strip() or 'untitled'
    folder = DATA_ROOT / song / 'generation'
    folder.mkdir(parents=True, exist_ok=True)
    for ex in data.get('examples', []):
        fid = ex.get('id') or uuid.uuid4().hex
        (folder / f'{fid}.json').write_text(json.dumps(ex, indent=2))
    return {'saved': len(data.get('examples', []))}

@app.post('/dataset/epicify')
def save_epicify():
    data = request.get_json(force=True)
    song = slugify(data.get('song_name', 'untitled'))
    examples = data.get('examples', [])
    folder = DATA_ROOT / song / 'epicify'
    folder.mkdir(parents=True, exist_ok=True)

    for ex in examples:
        fid = ex.get('id') or uuid.uuid4().hex
        (folder / f'{fid}.json').write_text(json.dumps(ex, indent=2))

    return jsonify({'saved': len(examples)})

from typing import List, Set
import tempfile, miditoolkit, mido
from pathlib import Path


# app.py
from flask import request, jsonify, abort
from werkzeug.utils import secure_filename
import subprocess, tempfile, os
from pathlib import Path

from flask import request, jsonify, abort
import tempfile, os, json, subprocess
from pathlib import Path
from music21 import converter
import fluidsynth

SOUNDFONT_SF2 = Path('assets/FluidR3_GM.sf2')
RENDER_ROOT   = Path('renders').resolve()


from music21 import meter

from flask import request, abort, jsonify
from pathlib import Path
import tempfile
import os

from music21 import converter, meter
import fluidsynth  # make sure you have `pip install pyFluidSynth`

from flask import request, abort, jsonify
from pathlib import Path
import tempfile
import os

from music21 import converter, meter
import fluidsynth  # make sure you have `pip install pyFluidSynth`
from pathlib import Path
import tempfile
import subprocess
import os

from flask import (
    current_app,
    jsonify,
    request,
    abort,
    Response,
)

from music21 import converter


def strip_duplicate_time_signatures(score):
    """
    Remove duplicate TimeSignature objects so music21.write('midi')
    doesn’t trip over the same TS in multiple places.
    """
    for part in getattr(score, 'parts', []):
        seen_offsets = set()
        for ts in list(part.recurse().getElementsByClass(meter.TimeSignature)):
            offset = getattr(ts, 'offset', None)
            if offset in seen_offsets:
                parent = ts.getContextByClass(type(part))
                if parent:
                    parent.remove(ts)
            else:
                seen_offsets.add(offset)


# app.py  ─────────────────────────────────────────────────────────────




def midi_to_wav(midi_path: str, wav_path: str):
    """Render MIDI to WAV using FluidSynth CLI."""
    cmd = [
        'fluidsynth', '-ni', str(SOUNDFONT_SF2),
        midi_path,
        '-F', wav_path,
        '-r', '44100'
    ]
    result = subprocess.run(cmd, check=True, capture_output=True, text=True)
    if result.stderr:
        current_app.logger.warning(f"FluidSynth stderr: {result.stderr}")

@app.post("/render_abc")
def render_abc():
    """
    POST /render_abc
    ---------------
    JSON body: {
      "abc":    "<full ABC string>",
      "outfile": "desired.wav"    # optional; defaults to output.wav
    }

    Returns 200 JSON { rendered: true, output: "/abs/path/to/file.wav" }
    on success, or a 4xx/5xx error with a message on failure.
    """
    data = request.get_json(force=True) or {}
    abc = data.get("abc", "").strip()
    ofname = Path(data.get("outfile", "output.wav")).name
    if not abc:
        abort(400, "No ABC passed")

    print(data)

    # Write ABC to temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix='.abc') as tmp_abc:
        tmp_abc.write(abc.encode('utf-8'))
        tmp_abc_path = tmp_abc.name

    # Generate temp MIDI path
    tmp_mid_path = tempfile.mktemp(suffix='.mid')

    # Convert ABC to MIDI
    try:
        result = subprocess.run(
            ['abc2midi', tmp_abc_path, '-o', tmp_mid_path],
            check=True, capture_output=True, text=True
        )
        if result.stderr:
            current_app.logger.info(f"abc2midi stderr: {result.stderr}")
    except subprocess.CalledProcessError as e:
        os.unlink(tmp_abc_path)
        current_app.logger.error(f"abc2midi failed: {e.stderr}")
        abort(400, f"Invalid ABC notation: {e.stderr}")
    finally:
        os.unlink(tmp_abc_path)

    # Prepare output WAV path
    out_wav = (RENDER_ROOT / ofname).resolve()
    out_wav.parent.mkdir(parents=True, exist_ok=True)

    # Render MIDI to WAV and normalize
    try:
        midi_to_wav(tmp_mid_path, str(out_wav))
        # Normalize using FFmpeg loudnorm
        tmp_norm = out_wav.with_suffix('.normalized.wav')
        ffmpeg_cmd = [
            'ffmpeg', '-y', '-i', str(out_wav),
            '-af', 'loudnorm', '-ar', '44100', str(tmp_norm)
        ]
        result = subprocess.run(ffmpeg_cmd, check=True, capture_output=True, text=True)
        if result.stderr:
            current_app.logger.info(f"ffmpeg stderr: {result.stderr}")
        # Replace original with normalized
        os.replace(tmp_norm, str(out_wav))
    except subprocess.CalledProcessError as e:
        os.unlink(tmp_mid_path)
        current_app.logger.error(f"FFmpeg normalization failed: {e.stderr}")
        abort(500, f"WAV processing failed: {e.stderr}")
    finally:
        os.unlink(tmp_mid_path)

    return jsonify({"rendered": True, "output": str(out_wav)})

# ------------------------------------------------------------------
# helpers.py  (or inline in app.py if you prefer)
# ------------------------------------------------------------------
def _song_max_tick(mt: miditoolkit.MidiFile) -> int:
    """Last tick in the file."""
    return max((n.end for inst in mt.instruments for n in inst.notes), default=0)

def _resolve_keep_set(
    mt: miditoolkit.MidiFile,
    mo: mido.MidiFile,
    keep_tracks: List[int]) -> Set[int]:
    """
    Accept *either* UI indices (after sort) **or** original Mido indices.
    Falls back to 'use instrument index directly' when the first lookup fails.
    """
    # map original‑>miditoolkit
    idx_map: dict[int,int] = {}
    seq = 0
    for orig_idx, trk in enumerate(mo.tracks):
        if any(msg.type.startswith('note_') for msg in trk):
            idx_map[orig_idx] = seq
            seq += 1

    keep_instr: set[int] = set()
    for k in (keep_tracks or []):
        if k in idx_map:                        # original index → OK
            keep_instr.add(idx_map[k])
        elif 0 <= k < len(mt.instruments):      # maybe already instrument idx
            keep_instr.add(k)
    if not keep_tracks:                      # empty → keep everything
        return set(range(len(mt.instruments)))
    return {k for k in keep_tracks
              if 0 <= k < len(mt.instruments)}
    return keep_instr

# ------------------------------------------------------------------
def _slice_midi(src_midi: Path,
                ticks_per_beat: int,
                start_tick: int,
                end_tick: int,
                keep_tracks: List[int]) -> Path:
    mt = miditoolkit.MidiFile(src_midi)
    mo = mido.MidiFile(src_midi)

    # --- NEW: expand “end” when 0/null --------------------------------
    if end_tick == 0:
        end_tick = _song_max_tick(mt)

    keep_instr = _resolve_keep_set(mt, mo, keep_tracks)

    out = miditoolkit.MidiFile(ticks_per_beat=ticks_per_beat)
    out.tempo_changes          = mt.tempo_changes
    out.time_signature_changes = mt.time_signature_changes

    def clone(n: miditoolkit.Note) -> miditoolkit.Note:
        return miditoolkit.Note(pitch=n.pitch, velocity=n.velocity,
                                start=max(0, n.start - start_tick),
                                end=max(0, n.end   - start_tick))

    for i, inst in enumerate(mt.instruments):
        if i not in keep_instr:
            continue
        ni = miditoolkit.Instrument(program=inst.program,
                                    is_drum=inst.is_drum,
                                    name=inst.name)
        for n in inst.notes:
            if n.start >= end_tick or n.end <= start_tick:
                continue
            ni.notes.append(clone(n))
        if ni.notes:
            out.instruments.append(ni)

    tmp = tempfile.NamedTemporaryFile(delete=False, suffix='.mid')
    out.dump(tmp.name)
    tmp.close()                                 # Windows ‑ important!
    return Path(tmp.name)



def midi_to_wav(midi_path: Path, wav_path: Path):
    """Render the entire MIDI via fluidsynth."""
    cmd = [
        'fluidsynth', '-ni', str(SOUNDFONT_SF2),
        str(midi_path),
        '-F', str(wav_path),
        '-r', '44100'
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

# ----------------------------------------------------------------------
#  helpers (same as before)  ───────────────────────────────────────────
#  _song_max_tick, _resolve_keep_set, _slice_midi, _midi_to_wav
#  --------------------------------------------------------------------

@app.post('/render_wav')
def render_wav():
    """
    Either:
      { "song_id": "file.mid" }                    → whole song
    or:
      {
        "song_id"     : "file.mid",
        "ticksPerBeat": 480,
        "jobs": [ {file,range,instruments}, … ]
      }
    """
    data      = request.get_json(force=True)
    song_id   = secure_filename(data.get('song_id', ''))
    if not song_id:
        abort(400, 'song_id is required')

    src = (Path(app.config['UPLOAD_FOLDER']) / song_id).resolve()
    if not src.is_file():
        abort(404, f"MIDI file {song_id} not found")

    ticks_per_beat = int(data.get('ticksPerBeat', 480) or 480)
    jobs = data.get('jobs')           # might be None

    # ------------------------------------------------------------------
    # Simple‑case fallback: render one file for the whole song
    # ------------------------------------------------------------------
    if not jobs:
        out_wav = RENDER_ROOT / f"{Path(song_id).stem}.wav"
        try:
            midi_to_wav(src, out_wav)
        except subprocess.CalledProcessError as e:
            app.logger.error(f"Error rendering {src}: {e}")
            abort(500, 'Rendering failed')
        return jsonify({'rendered': 1, 'output': str(out_wav)})

    # ------------------------------------------------------------------
    # Full job list (pattern + instrument splits)
    # ------------------------------------------------------------------
    rendered = 0
    for job in jobs:
        try:
            # ---- unpack & sanitise ------------------------------------------------
            rng   = job.get('range') or {}
            start = int(rng.get('start', 0) or 0)
            end   = int(rng.get('end',   0) or 0)      # 0/None  → slice helper expands
            keep  = job.get('instruments', [])
            # fname = secure_filename(job.get('file', f'{uuid.uuid4()}.wav'))
            name = job.get('file').replace("'", " Variation")  # replace ' with ' ariation
            out_wav = (RENDER_ROOT / name).resolve()
            out_wav.parent.mkdir(parents=True, exist_ok=True)
            #remove _ from filename and replace with ' '
            out_wav = out_wav.with_name(out_wav.name.replace('_', ' '))

            # ---- slice + render ----------------------------------------------------
            tmp_mid = _slice_midi(src, ticks_per_beat, start, end, keep)
            try:
                _midi_to_wav(tmp_mid, out_wav)
                rendered += 1
                app.logger.info(f'✅ rendered {out_wav}')
            finally:
                tmp_mid.unlink(missing_ok=True)
        except Exception as exc:
            app.logger.error(f"Render failed for {job.get('file')} – {exc}", exc_info=True)

    return jsonify({'rendered': rendered})


def _midi_to_wav(midi_path: Path, wav_path: Path) -> None:
    """Render with FluidSynth (change this if you use a different synth)."""
    cmd = [
        'fluidsynth',
        '-ni', str(SOUNDFONT_SF2),
        str(midi_path),
        '-F', str(wav_path),
        '-r', '44100'
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
# # ────────────────────────────────────────────────────────────────────────


# @app.post('/render_wav')
# def render_wav():
#     """
#     Body  {
#       "song_id"     : "file.mid",
#       "ticksPerBeat": 480,
#       "jobs": [ {...}, ... ]
#     }
#     """
#     data: Dict[str, Any] = request.get_json(force=True)
#     song_id        = secure_filename(data.get('song_id', ''))
#     jobs           = data.get('jobs', [])

#     if not song_id or not jobs:
#         abort(400, 'song_id and jobs are required')

#     src_midi = Path(app.config['UPLOAD_FOLDER']) / song_id
#     if not src_midi.exists():
#         abort(404, f"MIDI file {song_id} not found")

#     rendered = 0
#     ticks_per_beat = int(data.get('ticksPerBeat', 480) or 480)

#     for job in jobs:
#         try:
#             rng  = job.get('range', {})
#             start = int(rng.get('start', 0) or 0)
#             end   = int(rng.get('end'  , 0) or 0)
#             keep  = job.get('instruments')          # may be None / []

#             if end <= start:                # bad / missing end → skip
#                 app.logger.warning(f"Skipped job with invalid range: {job}")
#                 continue

#             keep    = job.get('instruments', [])
#             fn_safe = secure_filename(job.get('file', f'{uuid.uuid4()}.wav'))
#             wav_out = RENDER_ROOT / fn_safe
#             wav_out.parent.mkdir(parents=True, exist_ok=True)

#             tmp_mid = _slice_midi(src_midi, ticks_per_beat, start, end, keep)
#             try:
#                 _midi_to_wav(tmp_mid, wav_out)
#                 rendered += 1
#                 app.logger.info(f'✅ rendered {wav_out}')
#             finally:
#                 # give FluidSynth a moment on Windows
#                 import time, atexit, shutil
#                 for _ in range(10):
#                     try:
#                         tmp_mid.unlink(missing_ok=True)
#                         break
#                     except PermissionError:
#                         time.sleep(0.05)
#                 else:
#                     atexit.register(lambda p=tmp_mid: p.unlink(missing_ok=True))
#         except Exception as exc:
#             app.logger.error(f"Render failed for {job.get('file')} – {exc}", exc_info=True)

#     return jsonify({'rendered': rendered})



# ----------------------------------------------------------------------
#  Tiny HTML page that hosts the JS browser (see §2)
# ----------------------------------------------------------------------
@app.get('/browse')
def browse():
    return render_template('data_browser.html')

if __name__ == '__main__':
    app.run(debug=True)