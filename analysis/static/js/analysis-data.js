// static/js/analysis-data.js

const analysisContent = `
<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmaj
%%score (V1 V2 V3 V4 V5 V6 V7)
V:1 name="Distortion Guitar" snm="Distortion Guitar" clef=treble
%%MIDI program 30
%%MIDI channel 0
[V:1] z20 ^d3 | z ^A2 B2 z2 c17 | z5 ^d3 | z ^A2 B2 z2 c2 | z2 c2 ^d2 g2 f2 d2 =d2 ^A2 | z2 ^g3 z =g2 f2 ^d2 z2 =d2 | ^d2 z4 c5 z =d2 ^d2 | f2 d3 z ^d3 z =d3 z ^A2 | G15 z5 ^d3 | z ^A2 B2 z2 c17 | z5 ^d3 | z ^A2 B2 z2 c2 | z2 c2 ^d2 c2 f2 ^f2 =f2 c2 | z2 ^g3 z =g2 f2 c'3 z ^a2 | ^g2 z4 f5 z d2 ^d2 | f2 d3 z ^d3 z f3 z g2 | g15 z5 f3 | z ^g2 c'3 z ^d'2 | d'2 ^a2 g2 d5 z d2 ^d2 | d2 c7 z c2 d2 ^d2 | f ^d =d13 z5 c2 | d2 ^d2 c f2 d [df]4 | d2 c2 F2 G2 ^A2 G2 d2 | f5 z ^d3 z f2 d2 f2 | g15 z5 c5 | z d2 ^d2 c2 | z2 ^G2 ^d2 =g2 f2 =d2 ^d2 c2 | z2 ^g2 f2 g2 ^d'2 =d'2 c'2 g2 | ^d'2 =d'2 [c'^d']2 [^gf']2 [f=g']2 [=df']2 [^A^d']2 [G=d']2 | z2 c7 z d2 ^d2 g2 | z2 f5 z ^d2 =d2 f2 z2 G3 | z ^A2 d3 z f5 z g15 | |]
V:2 name="Distortion Guitar" snm="Distortion Guitar" clef=treble
%%MIDI program 30
%%MIDI channel 0
[V:2] z21 ^d3 | z ^A2 B2 z2 c17 | | z5 ^d3 z ^A2 B2 z2 c2 | z2 c2 ^d2 g2 f2 d2 =d2 ^A2 | z2 ^g3 z =g2 f2 ^d2 z2 =d2 | ^d2 z4 c5 z =d2 ^d2 | f2 d3 z ^d3 z =d3 z ^A2 | G15 | z5 ^d3 z ^A2 B2 z2 c17 | | z5 ^d3 z ^A2 B2 z2 c2 | z2 c2 ^d2 c2 f2 ^f2 =f2 c2 | z2 ^g3 z =g2 f2 c'3 z ^a2 | ^g2 z4 f5 z d2 ^d2 | f2 d3 z ^d3 z f3 z g2 | g15 | z5 f3 z ^g2 c'3 z ^d'2 | d'2 ^a2 g2 d5 z d2 ^d2 | d2 c7 z c2 d2 ^d2 | f ^d =d13 | z5 c2 d2 ^d2 c f2 d [df]4 | d2 c2 F2 G2 ^A2 G2 d2 | f5 z ^d3 z f2 d2 f2 | g15 | z5 c5 z d2 ^d2 c2 | z2 ^G2 ^d2 =g2 f2 =d2 ^d2 c2 | z2 ^g2 f2 g2 ^d'2 =d'2 c'2 g2 | ^d'2 =d'2 [c'^d']2 [^gf']2 [f=g']2 [=df']2 [^A^d']2 [G=d']2 | z2 c7 z d2 ^d2 g2 | z2 f5 z ^d2 =d2 f2 z2 G3 | z ^A2 d3 z f5 | z g15 | |]
V:3 name="Synth Bass 1" snm="Synth Bass 1" clef=treble
%%MIDI program 38
%%MIDI channel 0
[V:3] C,,3 C, z2 G,, ^D,, ^F,,2 ^A,,,2 A,,,2 B,,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 G,,2 C,,2 C,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 G,,2 C,,2 C,,2 | ^G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 | ^G,,,2 G,,,2 G,,,2 G,,2 G,,,2 G,,,2 G,,2 G,,,2 | D,,2 D,,2 D,,2 D,,2 D,,2 D,,2 D,,2 D,,2 | ^A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 G,,2 C,,2 C,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 G,,2 C,,2 C,,2 | ^G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 | ^G,,,2 G,,,2 G,,,2 G,,2 G,,,2 G,,,2 G,,2 G,,,2 | D,,2 D,,2 D,,2 D,,2 D,,2 D,,2 D,,2 D,,2 | ^A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 | ^G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 | G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 | F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 | G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 | ^G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 | F,,2 F,,2 F,,2 F,,2 F,,2 F,,2 F,,2 F,,2 | G,,3 z D,,2 G,,3 z D,,2 G,,2 D,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 D,,2 ^D,,2 C,,2 | F,,2 D,,2 ^D,,2 G,,2 F,,2 =D,,2 ^D,,2 C,,2 | F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 | D,,2 C,,2 ^A,,,2 G,,,2 F,,2 ^D,,2 =D,,2 G,,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 D,,2 ^D,,2 C,,2 | F,,2 C,,2 ^D,,2 F,,2 D,,2 C,,2 G,,2 C,,2 | F,,2 F,,2 F,,2 F,,2 F,,2 C,,2 ^D,,2 C,,2 | F,,2 ^D,,2 =D,,2 C,,9 |]
V:4 name="SynthBrass 2" snm="Synth Brass 2" clef=treble
%%MIDI program 63
%%MIDI channel 0
[V:4] z10 [G,,D,]3 z [G,,D,]2 | [G,,C,]3 z [^D,G,]3 z [G,,C,]2 [D,G,]3 z [G,,C,]2 | [^D,G,]3 z [G,,C,]2 [D,G,]3 z [G,,C,]2 [D,G,]3 z [G,,C,]3 | z [^D,G,]3 z [G,,C,]2 [D,G,]3 z [G,,C,]2 | [^D,G,]3 z [G,,C,]2 [D,G,]3 z [G,,C,]2 [D,G,]3 z [^G,,C,]3 | z [C,^D,]3 z [^G,,C,]2 [C,D,]3 z [G,,C,]2 | [C,^D,]3 z [^G,,C,]2 [C,D,]3 z [G,,C,]2 [C,D,]3 z [^A,,=D,]3 | z [D,G,]3 z [^A,,D,]2 [D,G,]3 z [A,,D,]2 | [D,G,]3 z [^A,,D,]2 [D,G,]3 z [A,,D,]2 [D,G,]3 z [G,,C,]3 | z [^D,G,]3 z [G,,C,]2 [D,G,]3 z [G,,C,]2 | [^D,G,]3 z [G,,C,]2 [D,G,]3 z [G,,C,]2 [D,G,]3 z [G,,C,]3 | z [^D,G,]3 z [G,,C,]2 [D,G,]3 z [G,,C,]2 | [^D,G,]3 z [G,,C,]2 [D,G,]3 z [G,,C,]2 [D,G,]3 z [^G,,C,]3 | z [C,^D,]3 z [^G,,C,]2 [C,D,]3 z [G,,C,]2 | [C,^D,]3 z [^G,,C,]2 [C,D,]3 z [G,,C,]2 [C,D,]3 z [^A,,=D,]3 | z [D,G,]3 z [^A,,D,]2 [D,G,]3 z [A,,D,]2 | [D,G,]3 z [^A,,D,]2 [D,G,]3 z [A,,D,]2 [D,G,]3 z [^D,^G,]15 | z [D,G,]15 | z [C,F,]15 | z [D,G,]15 | z [F,^G,]15 | z [G,C]15 | z [^A,^D]15 | z [G,D]15 | z [G,,C,]3 | z [^D,G,]3 z [G,,C,]2 [D,G,]3 z [G,,C,]2 | [^D,^G,]3 z [G,,C,]2 [D,G,]3 z [G,,C,]2 [D,G,]3 z [G,,C,]3 | z [C,F,]3 z [^G,,C,]2 [C,F,]3 z [G,,C,]2 | [C,^D,]3 z [G,,C,]2 [B,,=D,]3 z [G,,C,]2 [B,,D,]3 z [G,,C,]3 | z [^D,G,]3 z [G,,C,]2 [D,G,]3 z [G,,C,]2 | [^D,^G,]3 z [G,,C,]2 [D,G,]3 z [G,,C,]2 [D,G,]3 z [=D,F,]2 | [D,F,]2 [D,F,]2 [D,F,]2 [D,F,]2 [^D,G,]2 [F,^G,]2 [D,=G,]2 | [D,F,]2 [C,^D,]2 [^A,,=D,]2 [G,,C,]9 |]
V:5 name="SynthStrings 1" snm="Synth Strings 1" clef=treble
%%MIDI program 50
%%MIDI channel 0
[V:5] z16 [c^dg]31 | | z [c^dg]31 | | z [c^d^g]31 | | z [^Adg]31 | | z [c^dg]31 | | z [c^dg]31 | | z [c^d^g]31 | | z [^Adg]31 | | z [c^d^g]15 | z [^Adg]15 | z [^Gcf]15 | z [^Adg]15 | z [cf^g]15 | z [c^dg]15 | z [^A^df]15 | z [Bdg]15 | z [c^dg]15 | z [c^d^g]15 | z [cdf]15 | z [c^d^g]5 | z [Bdg]9 z [c^dg]15 | z [c^d^g]15 | z [^Adf]15 | z [^Adf]5 | z [c^dg]9 |]
V:6 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:6] B,,,3 z E,,3 E,, E,,2 B,,,3 z E,,2 | B,,,3 z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 z B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 z B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 z B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,2 E,, E,, D,, D,, B,,, B,,, C,, C,, | B,,,3 z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 z B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 z B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 z B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,2 E,, E,, D,, D,, B,,, B,,, C,, C,, | B,,,3 z E,,3 z B,,,3 z E,,3 z B,,,3 | z E,,3 z B,,,3 z E,,3 z B,,,3 | z E,,3 z B,,,3 z E,,3 z B,,,3 | z E,,3 z E,, E,, D,, D,, B,,, B,,, C,, C,, | B,,,3 z E,,3 z B,,,3 z E,,3 z B,,,3 | z E,,3 z B,,,3 z E,,3 z B,,,3 | z E,,3 z B,,,3 z E,,3 z B,,,3 | z E,,3 z E,, E,, D,, D,, B,,, B,,, C,, C,, | B,,,2 E,,2 B,,,3 z E,,2 E,,3 z B,,, E,, | B,,,2 E,,2 B,,,3 z E,,2 E,,3 z B,,, E,, | B,,,2 E,,2 B,,,3 z E,,2 E,,3 z B,,, E,, | B,,,2 E,,2 B,,,3 z E,, E,, D,, D,, B,,, B,,, C,, C,, | B,,,2 E,,2 B,,,3 z E,,2 E,,3 z B,,, E,, | B,,,2 E,,2 B,,,3 z E,,2 E,,3 z B,,, E,, | B,,,2 E,,2 B,,,3 z E,,2 E,,3 z B,,, E,, | B,,,2 E,,2 B,,,3 z E,, E,, D,, D,, B,,, B,,, C,, C,, | |]
V:7 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:7] [^A,,^C,E,]3 z ^A,,3 ^F,, [^A,,E,]2 ^A,,3 z ^A,,2 | [^A,,^C,] ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, [^A,,^C,] ^A,, | [^A,,^C,] ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | [^A,,^C,] ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, [^A,,^C,] ^A,, | [^A,,^C,] ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | [^F,,^C,]2 ^F,,2 [^A,,G,]2 ^F,,2 ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 | ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 | ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 | ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 | [^F,,^C,]2 ^F,,2 [^A,,G,]2 ^F,,2 ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 | ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 | ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 | ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 | [^F,,^C,]2 [^A,,G,]2 ^F,,3 z [^A,,G,]2 [^A,,G,]2 [^F,,^C,]2 [^A,,G,]2 | [^F,,^C,]2 [^A,,G,]2 ^F,,3 z [^A,,G,]2 [^A,,G,]2 [^F,,^C,]2 [^A,,G,]2 | [^F,,^C,]2 [^A,,G,]2 ^F,,3 z [^A,,G,]2 [^A,,G,]2 [^F,,^C,]2 [^A,,G,]2 | [^F,,^C,]2 [^A,,G,]2 ^F,,3 z [^A,,G,]2 [^A,,G,]2 ^F,,2 [^A,,G,]2 | [^F,,^C,]2 [^A,,G,]2 ^F,,3 z [^A,,G,]2 [^A,,G,]2 [^F,,^C,]2 [^A,,G,]2 | [^F,,^C,]2 [^A,,G,]2 ^F,,3 z [^A,,G,]2 [^A,,G,]2 [^F,,^C,]2 [^A,,G,]2 | [^F,,^C,]2 [^A,,G,]2 ^F,,3 z [^A,,G,]2 [^A,,G,]2 [^F,,^C,]2 [^A,,G,]2 | [^F,,^C,]2 [^A,,G,]2 ^F,,3 z [^A,,G,]2 [^A,,G,]2 ^F,,2 [^A,,G,]2 | |]
</abc>

The first track I'm looking at for analysis is going to be the Introduction Stage to Megaman X. 
Figured might as well start at the beginning. 

Okay so I definintely don't recommend listening to it on the site in this format. I'm just making sure to include the ABC format here so this data can possibly be used for AI training / inference. 

The idea with that being: this analysis in rawtext ABC format which is a pretty condensed format which is very readable in text form (for a language model at least), so hopefully this analysis document could in some way be used to train an AI to be able to analyze music in a similar way.

It would be neat if this could allow interactive generation of music with LLMs in a very compositional way where the human user can decide the motifs and phrases and the LLM could provide good drum loops or bass lines or chord progressions that go along with that. Not sure if any of that is possible, but I'm doing these analysis anyway, might as well do it in a way that could potentially be useful for building future AI based tools as well.


Okay so lets get into the analysis.

So typically for composing I use Maschine since I got Maschine + when I was getting into composing and even though the UI is kind rough compared to FL Studio, It's hooked into all the tools and instruments and I'm very familiar with all the shortcuts and workflow.

The reason I bring this up is because Maschine separates songs into Song > Ideas > Patterns that's kinda how I'll end up breaking this down.

A Song is the whole song and a group of ideas.

Ideas is basically a group of patterns (for instruments) that are used together, what's really nice about maschine is that you can just loop an idea and it automatically loops something that's 4 bars to 8 / 16 if you're recording something within the same idea, so it makes it very intuitive to just compose in a flow.

And a pattern is just a set of notes for an instrument, so like a drum pattern or a bass pattern or a chord progression.


So in order to start tackling this song, we should break it down into the ideas that make up the song, probably easier to just refer them as "sections." 

I haven't fully figured out the "best way" to identify a pattern from a song, I think you kinda get the feeling of it when listening, but I'd like to figure out a more systematic way to identify sections of a song. You could look for chord loops, or repeating motifs, though I'm thinking probably a really good way is to look at the drums. At least that's what I did for the Intro Stage of Megaman X. So lets take a look at the first section, which is just one bar.

<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmin
%%score (V1 V2 V3 V4)
V:1 name="Synth Bass 1" snm="Synth Bass 1" clef=treble
%%MIDI program 38
%%MIDI channel 0
[V:1] C,,3 C, z2 G,, E,, _G,,2 B,,,2 B,,,2 =B,,,2 | |]
V:2 name="SynthBrass 2" snm="Synth Brass 2" clef=treble
%%MIDI program 63
%%MIDI channel 0
[V:2] z10 [G,,D,]3 z [G,,D,]2 | |]
V:3 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:3] B,,,3 z E,,3 E,, E,,2 B,,,3 z E,,2 | |]
V:4 name="Hats" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:4] [^A,,^C,E,]3 z ^A,,3 ^F,, [^A,,E,]2 ^A,,3 z ^A,,2 | |]
</abc>

This section is basically just an intro, and I'm pretty sure it shouldn't play on a loop, so it only plays once when the song starts. I'm pretty sure a lot of Megaman X songs have this kind of intro and I'm thinking it's kinda to go along with the idea of Mega Man "beaming" down into the stage. Just a quick bar here to get you rolling into the rock of the stage.


There's only 2 instruments here and a drum track. 

Honestly not really sure what to make of this, but it does really drive you forward into into the beginning of the song. One thing that I really see in this view that does that is all the instruments come together on that last beat in sync, so they all do their own thing and then join in in unison on the last beat driving the energy forward to the beginning of the song. 

Lets take a look at each instrument individually to see if maybe we can get a better understanding of how this section creates the energy it does.

<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmin
%%score (V1 V2)
V:1 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:1] B,,,3 z E,,3 E,, E,,2 B,,,3 z E,,2 | |]
V:2 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:2] [^A,,^C,E,]3 z ^A,,3 ^F,, [^A,,E,]2 ^A,,3 z ^A,,2 | |]
</abc>

Okay so here's the drums. One thing I have a lot to learn is drums. Again I've only really done atmospheric Metroid-like music in the past which is not very drum heavy, so I'm hoping going through these analysis I'll be able to pick up on a lot more of what drums are about.

So this section definintely isn't a straight foward drum groove. It's much more similar to a fill, where the rhythm is chaotic and offbeat. We'll get into what a typical "groove" is in a bit, but you can think of what i'm referring to as the ol' "boots and cats and boots and cats" rhythm. This is def not that.

I'm going to break out the hats and the drums separately here to be able to look at them individually as well.

<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmin
%%score (V1)
V:1 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:1] B,,,3 z E,,3 E,, E,,2 B,,,3 z E,,2 | |]
</abc>

So it starts off the simple Kick-Snare on beat for the first 2 beats of this measure (4 beats total), but the second half mixes it up. The third beat starts with a snare instead of a kick and has a note at the end of beat 2 for anticipation. This really drives the energy forward and then beats 3 and four are syncopated (off beat). When I'm saying on/off beat I'm basically saying that the beginning of the notes align with the thicker vertical lines. When the notes align with that it'll sound more typical, but to really get the action going syncopation really helps to drive the energy forward.

So with that in mind this little section does that well at least with the drums. It starts off simple, then the anticipation note kicks you off and then it's like we're running off kilter into the action. Looking at it like this, this really makes sense for the purpose of this section in the song. 

I do think that drums are really like the "skeleton" of a song as it sets the rhythm and the pace of the song. So I think this is a good place to start with the analysis since most other things will align with that. That's not to say when composing you can't add the drums in later to match the rhythm of other melodic parts, but the drums are basically atonal so it's easy to get an idea what the song's trying to do without being overwhelmed by harmony and just focusing on the rhythm.



Okay now lets look at the hats.

<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmin
%%score (V1)
V:1 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:1] [^A,,^C,E,]3 z ^A,,3 ^F,, [^A,,E,]2 ^A,,3 z ^A,,2 | |]
</abc>

Looking at the hats, the first 2 hits of them are on beat with the kick and snare. Actually the third hat stays on the beat as well. 

It looks like the hats basically do the same thing as the kick and snare. The open hi hat plays basically on all the hits of the drum pattern, as it does. the only time the open hat changes to a closed hat is on that "anticipation" beat. I imagine this is a stylistic thing, but it does kinda further the idea I've been working out about that anticipation beat intending to drive the energy forward and kick us into that syncopation section. 

We also start with a crash cymbal, which is pretty typical for the beginning of drum sections. Typically I see crashes placed at the beginning usually after a drum fill as a way to kinda disperse all the built up energy. I'll point that out when I see it later. 

The ride cymbal is in here just carrying the rhythm along, it's on beat 1 and beat 3, nicely dividing up the measure into 2 halves. Not 100% the functional purpose of it, I'm not too familiar with the ride cymbal. This stage is the "Highway Stage" so maybe it's adding a little atmosphere of cars and action. 

A quick search about the ride cymbal said:

"the ride cymbal's job is to hold the groove with a clear, sustained ping while coloring the band's sound and punctuating accents. It's what drummers lean on once the song really gets rolling."

So I guess that makes sense here, it's just holding the groove and keeping the rhythm going - right here it's not doing anything too interesting, but it's keeping it going.


Okay so that's the drums, not lets get into the melodic meat of this section.

<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmin
%%score (V1)
V:1 name="Synth Bass 1" snm="Synth Bass 1" clef=treble
%%MIDI program 38
%%MIDI channel 0
[V:1] C,,3 C, z2 G,, E,, _G,,2 B,,,2 B,,,2 =B,,,2 | |]
</abc>

So we get this funky bass line to start us off here. There's actually a LOT going on here to talk about. One thing I think is stylistically core to a lot of Megaman X music are its use of blues notes. I built the piano roll on this site to take into account the Key of the song. So this song is in C Minor, meaning that the main notes that sound right on the song are in blue on the keyboard above. Any note that's not in the key is an off key note, which is orange.

The blues notes really give that funky rocking feel to the songs and they're masterfully sprinkled throughout the song (and I imagine throughout the soundtrack as well, but we'll get to that later). We can see here in just this section that 2 notes are off key, the F# (which actually should be labelled Gb, since we're in Cm but that's not important). The other is the B at the very end.

A really interesting thing here to me is where these notes are placed. In my understanding of these blues notes is that they should mostly be used as a "transition" note, where you play if off the main beat to lead to a main beat note which is in harmony with the current chord and on the key. The F# here is actually placed right on the beginning of beat 3 with 2 on key notes. The 2 previous notes to the orange F# is actually a technique i believe that's called "embellishing" where we always intended on going to the F#, but on our way we decorated the melody with (mostly) neighbor tones (notes above or below) and what's really interesting is that this embellishment doesn't lead to a nice chord tone but a off key note as if this bass line is saying "yeah, I'm going to rock however I want to, and you can't stop me!"

At the end of this riff there's the other off key note, the B. This B is actually really prevalent in the main motif of the song, here we can also view it as a walk up to the beginning of the next section since we're going from Bb to B to C. You could remove the B and it would sound okay, but the B adds an extra rhythmic step and gives that nice "rocking" feel to the end of the section.

As an experiment, let me show a few examples of what this could look like without all the embelishments

<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmin
%%score (V1)
V:1 name="Synth Bass 1" snm="Synth Bass 1" clef=treble
%%MIDI program 38
%%MIDI channel 0
[V:1] C,,3 C, z4 _G,,2 B,,,2 B,,,2 |]
</abc>

You can see how this basically feels the same, but it's missing that extra "oomph" that we get with the embellishments.

Also this is what it would sound like without the off key note:

<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmin
%%score (V1)
V:1 name="Synth Bass 1" snm="Synth Bass 1" clef=treble
%%MIDI program 38
%%MIDI channel 0
[V:1] C,,3 C, z2 G,, E,, F,,2 B,,,2 B,,,2 B,,,2 | |]
</abc>

You can hear how this sounds okay, but a little plain.


<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmin
%%score (V1 V2)
V:1 name="Synth Bass 1" snm="Synth Bass 1" clef=treble
%%MIDI program 38
%%MIDI channel 0
[V:1] C,,3 C, z2 G,, E,, _G,,2 B,,,2 B,,,2 =B,,,2 | |]
V:2 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:2] B,,,3 z E,,3 E,, E,,2 B,,,3 z E,,2 | |]
</abc>

Okay so now lets see how this works along with the drums (not hats).

Rhymically it basically follows the drum beats, and adds a couple extra notes to fill the gaps. Just for show, let me show you what it would look like if we were building this bass line using the drums as a base, only having notes that match the rhythm of the drums.


<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmin
%%score (V1 V2)
V:1 name="Synth Bass 1" snm="Synth Bass 1" clef=treble
%%MIDI program 38
%%MIDI channel 0
[V:1] C,,3 z4 E,, _G,,2 B,,,2 z2 =B,,,2 | |]
V:2 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:2] B,,,3 z E,,3 E,, E,,2 B,,,3 z E,,2 | |]
</abc>

This is "fine", I mean it'll do if you're just writing something to get the idea down. That's actually how I like to do things some times. A lot of the times I can't really get creative until I have at least SOMETHING down so copying the rhythm from something else and then adding on top of that is a good way to get started. Lets actually take a look at what that could look like.

<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmin
%%score (V1 V2)
V:1 name="Synth Bass 1" snm="Synth Bass 1" clef=treble
%%MIDI program 38
%%MIDI channel 0
[V:1] C,,3 z C,,3  C,, C,,2 C,,3 z C,,2 | |]
V:2 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:2] B,,,3 z E,,3 E,, E,,2 B,,,3 z E,,2 | |]
</abc>

So if we were just getting started, we wouldn't really have any melodic idea yet, so we'd just repeat on the rhythm of the drums on the root note (right now C, since we're in C minor). And actually listening to this you can kinda hear how it feels like it's turning into the actual section. 

Now I'm trying to think of "why" would those other parts be added in. I mean just looking at the current section, we can see an empty spot at the end of the first beat (the 4th 16th note). So might as well just add one in there? The option that they chose is actually to not use the note on the second beat, and to put a quick 16th note on the 3rd 16th instead. This would be a syncopated note and for sure lend to the off kilter rocking feel of the section like we're entering into the action and getting ready to rock. 

I guess something interesting to note here as well. For this section the drums are very syncopated in the second half and on beat for the first half, what the bass is doing is a little the opposite, being mostly off beat notes for the first 2 beats and then on beat for the second half. I wonder if that helps add to the rock feel without being too chaotic, a nice balance between some parts being syncopated and some on beat. I guess it also really drives home the syncopation, since in order for things to feel syncopated, there needs to be a beat to syncopate against. Its kinda cool that the bass and the drums synergize in this way here, switching at beat 3.

There's also one more note that was added in, and that's actually before the 16th note right before the 2nd beat. They end up filling this with a full 8th note. Again not sure why rhymically they chose this, but it does fill in the measure. 

So lets take a look at the bass line without any melody, but with the full rhythm.

<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmaj
%%score (V1 V2)
V:1 name="Synth Bass 1" snm="Synth Bass 1" clef=treble
%%MIDI program 38
%%MIDI channel 0
[V:1] C,,3 C,, z2 C,, C,, C,,2 C,,2 C,,2 C,,2 | |]
V:2 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:2] B,,,3 z E,,3 E,, E,,2 B,,,3 z E,,2 | |]
</abc>

So now that the rhythm is down - and you can hear that just the rhythm is a BIG part of what makes this section this section. 

And then from there that's a good point to then move the notes around and actually decide the melody of the bass line, especially for a complicated fill like this. Honestly I never did this like this before, but after thinking through it like this it could be a good strategy since I'm usually stuck with the blank slate issue with bass lines. Most of my bass lines are either just the same note over and over on 16th notes, or going up and down the octave on 16th notes. I always say, "that's good enough I'll get to it later" but looking at it like this it doesn't seem too bad.

Lets take another quick look at the melody of the bass line and think about the decisions that would have gone into moving the notes to where they ended up.

So since the bass line is basically the only melodic instrument here, it's job is going to be to outline the harmony of this section. Given that the song is in C minor, starting with a C minor chord is a good start. So C Eb and G are going to be the main notes we have to choose from here. And like I said before my basslines are usually just the root note and the octave, so C2 C3 C2 C3 actually is a classic bouncy bass feel. This is actually what this bass line starts out with too. I think in general its a good idea by starting out with the octave you kinda give an idea of the soundscape you're covering right now with the bass line.

We talked a lot about the F# and the B notes already, so I won't go into that again, but those were some strong decisions which really drive the melody of the section. The notes before the F# decorate it, and then we have the smooth walk up from Bb to B at the end which leads to C. That'll lead us to what we have so far for the intro section.

<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmaj
%%score (V1 V2 V3)
V:1 name="Synth Bass 1" snm="Synth Bass 1" clef=treble
%%MIDI program 38
%%MIDI channel 0
[V:1] C,,3 C, z2 G,, ^D,, ^F,,2 ^A,,,2 A,,,2 B,,,2 | |]
V:2 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:2] B,,,3 z E,,3 E,, E,,2 B,,,3 z E,,2 | |]
V:3 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:3] [^A,,^C,E,]3 z ^A,,3 ^F,, [^A,,E,]2 ^A,,3 z ^A,,2 | |]
</abc>

Okay so the only thing we're missing is the simplest part, the Synth Brass.

<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmaj
%%score (V1)
V:1 name="SynthBrass 2" snm="Synth Brass 2" clef=treble
%%MIDI program 63
%%MIDI channel 0
[V:1] z10 [G,,D,]3 z [G,,D,]2 | |]
</abc>

All the synth brass is really doing is helping transition into the next section of the song. You can see it directly aligns with the final drum beats:

<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmaj
%%score (V1 V2)
V:1 name="SynthBrass 2" snm="Synth Brass 2" clef=treble
%%MIDI program 63
%%MIDI channel 0
[V:1] z10 [G,,D,]3 z [G,,D,]2 | |]
V:2 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:2] B,,,3 z E,,3 E,, E,,2 B,,,3 z E,,2 | |]
</abc>

So it's not adding any rhythmic complexity, just some atmosphere and harmony. The chord is technically a G5 (G and D) which is the V chord in C minor which finalizes the B note in the bass. A V chord is a very common way to end a section, as it creates a sense of tension that resolves into the next section. Naturally the V wants to go to the I chord, which in this case would be G -> Cm. So all this harmonic and rhymic complexity culminates here in a smooth way to get right into the action.


Lets take a look at the whole section together again:

<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmaj
%%score (V1 V2 V3 V4)
V:1 name="Synth Bass 1" snm="Synth Bass 1" clef=treble
%%MIDI program 38
%%MIDI channel 0
[V:1] C,,3 C, z2 G,, ^D,, ^F,,2 ^A,,,2 A,,,2 B,,,2 | |]
V:2 name="SynthBrass 2" snm="Synth Brass 2" clef=treble
%%MIDI program 63
%%MIDI channel 0
[V:2] z10 [G,,D,]3 z [G,,D,]2 | |]
V:3 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:3] B,,,3 z E,,3 E,, E,,2 B,,,3 z E,,2 | |]
V:4 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:4] [^A,,^C,E,]3 z ^A,,3 ^F,, [^A,,E,]2 ^A,,3 z ^A,,2 | |]
</abc>

I mean it's short and not overly complex, but it is pretty complicated. Hopefully looking at it broken down like that gives a good idea on how to approach a section like this.

If I were to write an intro section inspired by this I would start my approach with the drums. I would try to maintain a balance between on and off beat drum hits between the kick and snare, and glue it together with the hats. Then using the outline of the rhythm provided by the drums, syncopate sections of the bass line against the sections of the drums that are on beat. Then once I found a good bass rhythm that felt good to me, I would move those notes around to create harmonic interest, especially making sure to include some blues notes to give it that funky rocking feel. Finally making sure to end with a V chord and possibly leading with a new instrument to transition into the next section.


Okay so that was a lot more in depth that I expected and actually took a few hours to write. Next thing I'm going to tackle is the main section of the song and main motif. Have a listen to that section here:

<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmaj
%%score (V1 V2 V3 V4 V5 V6 V7)
V:1 name="Distortion Guitar" snm="Distortion Guitar" clef=treble
%%MIDI program 30
%%MIDI channel 0
[V:1] z4 ^d3 | z ^A2 B2 z2 c17 | z5 ^d3 | z ^A2 B2 z2 c2 | z2 c2 ^d2 g2 f2 d2 =d2 ^A2 | z2 ^g3 z =g2 f2 ^d2 z2 =d2 | ^d2 z4 c5 z =d2 ^d2 | f2 d3 z ^d3 z =d3 z ^A2 | G15 z5 ^d3 | z ^A2 B2 z2 c17 | z5 ^d3 | z ^A2 B2 z2 c2 | z2 c2 ^d2 c2 f2 ^f2 =f2 c2 | z2 ^g3 z =g2 f2 c'3 z ^a2 | ^g2 z4 f5 z d2 ^d2 | f2 d3 z ^d3 z f3 z g2 | g15 |]
V:2 name="Distortion Guitar" snm="Distortion Guitar" clef=treble
%%MIDI program 30
%%MIDI channel 0
[V:2] z5 ^d3 | z ^A2 B2 z2 c17 | | z5 ^d3 z ^A2 B2 z2 c2 | z2 c2 ^d2 g2 f2 d2 =d2 ^A2 | z2 ^g3 z =g2 f2 ^d2 z2 =d2 | ^d2 z4 c5 z =d2 ^d2 | f2 d3 z ^d3 z =d3 z ^A2 | G15 | z5 ^d3 z ^A2 B2 z2 c17 | | z5 ^d3 z ^A2 B2 z2 c2 | z2 c2 ^d2 c2 f2 ^f2 =f2 c2 | z2 ^g3 z =g2 f2 c'3 z ^a2 | ^g2 z4 f5 z d2 ^d2 | f2 d3 z ^d3 z f3 z g2 | g15 | |]
V:3 name="Synth Bass 1" snm="Synth Bass 1" clef=treble
%%MIDI program 38
%%MIDI channel 0
[V:3] C,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 G,,2 C,,2 C,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 G,,2 C,,2 C,,2 | ^G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 | ^G,,,2 G,,,2 G,,,2 G,,2 G,,,2 G,,,2 G,,2 G,,,2 | D,,2 D,,2 D,,2 D,,2 D,,2 D,,2 D,,2 D,,2 | ^A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 G,,2 C,,2 C,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 G,,2 C,,2 C,,2 | ^G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 | ^G,,,2 G,,,2 G,,,2 G,,2 G,,,2 G,,,2 G,,2 G,,,2 | D,,2 D,,2 D,,2 D,,2 D,,2 D,,2 D,,2 D,,2 | ^A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 | |]
V:4 name="SynthBrass 2" snm="Synth Brass 2" clef=treble
%%MIDI program 63
%%MIDI channel 0
[V:4] [G,,C,]3 | z [^D,G,]3 z [G,,C,]2 [D,G,]3 z [G,,C,]2 | [^D,G,]3 z [G,,C,]2 [D,G,]3 z [G,,C,]2 [D,G,]3 z [G,,C,]3 | z [^D,G,]3 z [G,,C,]2 [D,G,]3 z [G,,C,]2 | [^D,G,]3 z [G,,C,]2 [D,G,]3 z [G,,C,]2 [D,G,]3 z [^G,,C,]3 | z [C,^D,]3 z [^G,,C,]2 [C,D,]3 z [G,,C,]2 | [C,^D,]3 z [^G,,C,]2 [C,D,]3 z [G,,C,]2 [C,D,]3 z [^A,,=D,]3 | z [D,G,]3 z [^A,,D,]2 [D,G,]3 z [A,,D,]2 | [D,G,]3 z [^A,,D,]2 [D,G,]3 z [A,,D,]2 [D,G,]3 z [G,,C,]3 | z [^D,G,]3 z [G,,C,]2 [D,G,]3 z [G,,C,]2 | [^D,G,]3 z [G,,C,]2 [D,G,]3 z [G,,C,]2 [D,G,]3 z [G,,C,]3 | z [^D,G,]3 z [G,,C,]2 [D,G,]3 z [G,,C,]2 | [^D,G,]3 z [G,,C,]2 [D,G,]3 z [G,,C,]2 [D,G,]3 z [^G,,C,]3 | z [C,^D,]3 z [^G,,C,]2 [C,D,]3 z [G,,C,]2 | [C,^D,]3 z [^G,,C,]2 [C,D,]3 z [G,,C,]2 [C,D,]3 z [^A,,=D,]3 | z [D,G,]3 z [^A,,D,]2 [D,G,]3 z [A,,D,]2 | [D,G,]3 z [^A,,D,]2 [D,G,]3 z [A,,D,]2 [D,G,]3 |]
V:5 name="SynthStrings 1" snm="Synth Strings 1" clef=treble
%%MIDI program 50
%%MIDI channel 0
[V:5] [c^dg]31 | | z [c^dg]31 | | z [c^d^g]31 | | z [^Adg]31 | | z [c^dg]31 | | z [c^dg]31 | | z [c^d^g]31 | | z [^Adg]31 | | |]
V:6 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:6] B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 z B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 z B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 z B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,2 E,, E,, D,, D,, B,,, B,,, C,, C,, | B,,,3 z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 z B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 z B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 z B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,2 E,, E,, D,, D,, B,,, B,,, C,, C,, | |]
V:7 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:7] [^A,,^C,] | ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, [^A,,^C,] ^A,, | [^A,,^C,] ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | [^A,,^C,] ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, [^A,,^C,] ^A,, | [^A,,^C,] ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | |]
</abc>
`;