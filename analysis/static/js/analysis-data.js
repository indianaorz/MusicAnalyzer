// static/js/analysis-data.js

const analysisContent = `
<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmin
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
K:Cmin
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
K:Cmin
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
K:Cmin
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
K:Cmin
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
K:Cmin
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
K:Cmin
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

I'd consider this section the main theme of the song. You can actually break it down into 2 sections, I guess we can call it Theme A (4 bars) and then Theme A Variation (4 bars).

Lets take a quick look at Theme A:

<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmin
%%score (V1 V2 V3 V4 V5 V6 V7)
V:1 name="Distortion Guitar" snm="Distortion Guitar" clef=treble
%%MIDI program 30
%%MIDI channel 0
[V:1] z4 ^d3 | z ^A2 B2 z2 c17 | z5 ^d3 | z ^A2 B2 z2 c2 | z2 c2 ^d2 g2 f2 d2 =d2 ^A2 | z2 ^g3 z =g2 f2 ^d2 z2 =d2 | ^d2 z4 c5 z =d2 ^d2 | f2 d3 z ^d3 z =d3 z ^A2 | G15 |]
V:2 name="Distortion Guitar" snm="Distortion Guitar" clef=treble
%%MIDI program 30
%%MIDI channel 0
[V:2] z5 ^d3 | z ^A2 B2 z2 c17 | | z5 ^d3 z ^A2 B2 z2 c2 | z2 c2 ^d2 g2 f2 d2 =d2 ^A2 | z2 ^g3 z =g2 f2 ^d2 z2 =d2 | ^d2 z4 c5 z =d2 ^d2 | f2 d3 z ^d3 z =d3 z ^A2 | G15 | |]
V:3 name="Synth Bass 1" snm="Synth Bass 1" clef=treble
%%MIDI program 38
%%MIDI channel 0
[V:3] C,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 G,,2 C,,2 C,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 G,,2 C,,2 C,,2 | ^G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 | ^G,,,2 G,,,2 G,,,2 G,,2 G,,,2 G,,,2 G,,2 G,,,2 | D,,2 D,,2 D,,2 D,,2 D,,2 D,,2 D,,2 D,,2 | ^A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 | |]
V:4 name="SynthBrass 2" snm="Synth Brass 2" clef=treble
%%MIDI program 63
%%MIDI channel 0
[V:4] [G,,C,]3 | z [^D,G,]3 z [G,,C,]2 [D,G,]3 z [G,,C,]2 | [^D,G,]3 z [G,,C,]2 [D,G,]3 z [G,,C,]2 [D,G,]3 z [G,,C,]3 | z [^D,G,]3 z [G,,C,]2 [D,G,]3 z [G,,C,]2 | [^D,G,]3 z [G,,C,]2 [D,G,]3 z [G,,C,]2 [D,G,]3 z [^G,,C,]3 | z [C,^D,]3 z [^G,,C,]2 [C,D,]3 z [G,,C,]2 | [C,^D,]3 z [^G,,C,]2 [C,D,]3 z [G,,C,]2 [C,D,]3 z [^A,,=D,]3 | z [D,G,]3 z [^A,,D,]2 [D,G,]3 z [A,,D,]2 | [D,G,]3 z [^A,,D,]2 [D,G,]3 z [A,,D,]2 [D,G,]3 |]
V:5 name="SynthStrings 1" snm="Synth Strings 1" clef=treble
%%MIDI program 50
%%MIDI channel 0
[V:5] [c^dg]31 | | z [c^dg]31 | | z [c^d^g]31 | | z [^Adg]31 | | |]
V:6 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:6] B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 z B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 z B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 z B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,2 E,, E,, D,, D,, B,,, B,,, C,, C,, | |]
V:7 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:7] [^A,,^C,] | ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, [^A,,^C,] ^A,, | [^A,,^C,] ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | |]
</abc>


And below is theme A Variation which plays immediately after Theme A.


Theme A Variation:
<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmin
%%score (V1 V2 V3 V4 V5 V6 V7)
V:1 name="Distortion Guitar" snm="Distortion Guitar" clef=treble
%%MIDI program 30
%%MIDI channel 0
[V:1] z4 ^d3 | | | | | | | | | z ^A2 B2 z2 c17 | z5 ^d3 | z ^A2 B2 z2 c2 | z2 c2 ^d2 c2 f2 ^f2 =f2 c2 | z2 ^g3 z =g2 f2 c'3 z ^a2 | ^g2 z4 f5 z d2 ^d2 | f2 d3 z ^d3 z f3 z g2 | g15 |]
V:2 name="Distortion Guitar" snm="Distortion Guitar" clef=treble
%%MIDI program 30
%%MIDI channel 0
[V:2] z5 ^d3 | | | | | | | | | z ^A2 B2 z2 c17 | | z5 ^d3 z ^A2 B2 z2 c2 | z2 c2 ^d2 c2 f2 ^f2 =f2 c2 | z2 ^g3 z =g2 f2 c'3 z ^a2 | ^g2 z4 f5 z d2 ^d2 | f2 d3 z ^d3 z f3 z g2 | g15 | |]
V:3 name="Synth Bass 1" snm="Synth Bass 1" clef=treble
%%MIDI program 38
%%MIDI channel 0
[V:3] C,,2 | | | | | | | | | C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 G,,2 C,,2 C,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 G,,2 C,,2 C,,2 | ^G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 | ^G,,,2 G,,,2 G,,,2 G,,2 G,,,2 G,,,2 G,,2 G,,,2 | D,,2 D,,2 D,,2 D,,2 D,,2 D,,2 D,,2 D,,2 | ^A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 | |]
V:4 name="SynthBrass 2" snm="Synth Brass 2" clef=treble
%%MIDI program 63
%%MIDI channel 0
[V:4] [G,,C,]3 | | | | | | | | | z [^D,G,]3 z [G,,C,]2 [D,G,]3 z [G,,C,]2 | [^D,G,]3 z [G,,C,]2 [D,G,]3 z [G,,C,]2 [D,G,]3 z [G,,C,]3 | z [^D,G,]3 z [G,,C,]2 [D,G,]3 z [G,,C,]2 | [^D,G,]3 z [G,,C,]2 [D,G,]3 z [G,,C,]2 [D,G,]3 z [^G,,C,]3 | z [C,^D,]3 z [^G,,C,]2 [C,D,]3 z [G,,C,]2 | [C,^D,]3 z [^G,,C,]2 [C,D,]3 z [G,,C,]2 [C,D,]3 z [^A,,=D,]3 | z [D,G,]3 z [^A,,D,]2 [D,G,]3 z [A,,D,]2 | [D,G,]3 z [^A,,D,]2 [D,G,]3 z [A,,D,]2 [D,G,]3 |]
V:5 name="SynthStrings 1" snm="Synth Strings 1" clef=treble
%%MIDI program 50
%%MIDI channel 0
[V:5] [c^dg]31 | | | | | | | | | | z [c^dg]31 | | z [c^d^g]31 | | z [^Adg]31 | | |]
V:6 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:6] B,,,3 | | | | | | | | | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 z B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 z B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 z B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,2 E,, E,, D,, D,, B,,, B,,, C,, C,, | |]
V:7 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:7] [^A,,^C,] | | | | | | | | | ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, [^A,,^C,] ^A,, | [^A,,^C,] ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | |]
</abc>


If you were to play the first few bars of each you'd think they were the same track, which is why I'm saying it's a variation. The variation begins about halfway through the section. So now that we have a feel for the rough big picture of this section, lets break it down a bit more.


We'll start with the drums again. Since that really clearly paints the picture of the whole section. I'll show the drums for the whole section here:

<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmin
%%score (V1 V2)
V:1 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:1] B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 z B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 z B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 z B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,2 E,, E,, D,, D,, B,,, B,,, C,, C,, | B,,,3 z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 z B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 z B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 z B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,2 E,, E,, D,, D,, B,,, B,,, C,, C,, | |]
V:2 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:2] [^A,,^C,] | ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, [^A,,^C,] ^A,, | [^A,,^C,] ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | [^A,,^C,] ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, [^A,,^C,] ^A,, | [^A,,^C,] ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | |]
</abc>

Perhaps in this view it's a little easier to see that this is the same thing 2x over. Lets take a look at what one of the sections looks like:

<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmin
%%score (V1 V2)
V:1 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:1] B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 z B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 z B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 z B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,2 E,, E,, D,, D,, B,,, B,,, C,, C,, | |]
V:2 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:2] [^A,,^C,] | ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, [^A,,^C,] ^A,, | [^A,,^C,] ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | |]
</abc>


I'll focus on the cymbals first, so here's just them:
<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmin
%%score (V1)
V:1 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:1] [^A,,^C,] | ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, [^A,,^C,] ^A,, | [^A,,^C,] ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | |]
</abc>

So right off the bat there's a few common things to notice. Probably most obviously is the open high hat, which is just blasted on repeat 16th notes for the whole thing. This basically sets the time for the song. 

Next we can see the crash cymbal right in the beginning, as I said before, this is a normal way of unleashing all the energy built up from the last section. We also see that the crash cymbal is played twice once leading up to the third measure and once at the beginning of the third measure. I find it interesting because it is in the middle of the section instead of at the end. Perhaps this is where the cymbals have a little bit of a "fill" where at the end of the section the drums have a fill, so they each kind of take their own space instead of both playing on top of eachother. Maybe this could help keep the momentum going and add some interesting texture to the middle.

Then we have the splash cymbal.The splash cymbal is only played on the off beats, so it gives a nice little bit of extra energy to the section. 

Now lets take a look at the drums:

<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmin
%%score (V1)
V:1 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:1] B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 z B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 z B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 z B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,2 E,, E,, D,, D,, B,,, B,,, C,, C,, | |]
</abc>

This section has a pretty interesting drum beat where it's still not the simple "boots and cats" beat. It has a repeating kick-snare pattern which goes the whole time until the drum fill at the end.

Let me break down the drum beat into its repeating part:

<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmin
%%score (V1)
V:1 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:1] B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 |]
</abc>

This is just 2 bars here and it loops very nicely. lets quickly take a look at the boilerplate "boots and cats" beat and see how it compares to it, since when writing music, it could be useful to start with the basic and see how we could change it up to be like what is happening here.


<abc>
X:1
T:Boots and Cats
M:4/4
L:1/16
K:Cmin
%%score (V1)
V:1 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:1] B,,,3 | z E,,3 z B,,,3 z E,,3 z B,,,3 | z E,,3 z B,,,3 z E,,3 |]
</abc>

So pretty simple but it works. This beat basically directly shows the "on beat" and the "off beat". 


Actually now that I'm thinking about it, the "boots and cats" drum line i might be thinking of might actually be this:
<abc>
X:1
T:Boots and Cats (for real?)
M:4/4
L:1/16
K:Cmin
%%score (V1)
V:1 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:1] B,,,3 | z ^A,,2 z2 E,,3 z ^A,,2 z2 B,,,3 | z ^A,,2 z2 E,,3 z ^A,,2 |]
</abc>

Either way they're basically the same thing. Kick is showing the strongest beats, the snares on the off beats. 

The first really shows "kick is on beat" and "snare is off beat" much more stongly, but the second one adds the hi hat in for spreading out the beats where the hihat is definintely off beat, and the snare in on a strong beat but not as strong as the kick. 

So anyway, idk if that was useful, but lets take a look back at the drums for this section and see how we could modify boots and cats to be like this section:

<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmin
%%score (V1)
V:1 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:1] B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 |]
</abc>

The main thing I see happening here is that it starts like normal boots and cats, but we get and extra kick in there on the third beat. Then the snare on the 4th beat immediately gets another kick after it. The double kicks really drive the energy forward. Lets take a look at what it would feel like without those double kicks:

<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmin
%%score (V1)
V:1 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:1] B,,,3 | z E,,3 z B,,,2 z2 E,,2 z2 B,,,3 | z E,,2 B,,,3 z B,,,2 E,,3 |]
</abc>

Much more bland and much less energy. it still carries the groove, but we can see the benefit of adding the double kicks directly here.

Without the double kicks the first measure/bar (first 4 beats) is exactly like the simple boots and cats starting point. So we can see how just slightly modifying the simple "boots and cats" with the idea of "driving energy forward" we can kinda do that by adding in double kicks. 

The second half is a little different, I'm not 100% sure how to approach it or why it does what it does. 

The first Kick-Snare is exactly the same as the first half, but then we get a surprise kick a half beat earlier than we'd expect. Then we get a really quick second kick before resolving the end on a normally placed snare. Again this syncopation creates the drive.

Then the last part of these drums is the drum fill.

<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmin
%%score (V1)
V:1 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:1] B,,,3 | | | | | | | | z E,,2 B,,,2 E,, E,, D,, D,, B,,, B,,, C,, C,, | |]
</abc>

Again I don't really know toom much about drum fills, but I do know that they're placed at the end of a section and it works really well to swell everything up and drive us forward into the next part. It also really helps with timing when just playing along to a looping drum track, you kinda get the signal "hey this musical idea is over".

What I see happening here is the normal start, then we got an offbeat kick to drive us into the fill, and then 16th notes of snares here (but could be any kind of drum, toms, or anything). 

And then this should lead directly into a crash cymbal at the beginning of the next section.

So that's the drums for this main theme section. Pretty simple repetitive beat, but enough syncopation to keep it going and interesting.

Next to continue in how we have been going lets check out the bass.

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
[V:1] C,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 G,,2 C,,2 C,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 G,,2 C,,2 C,,2 | ^G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 | ^G,,,2 G,,,2 G,,,2 G,,2 G,,,2 G,,,2 G,,2 G,,,2 | D,,2 D,,2 D,,2 D,,2 D,,2 D,,2 D,,2 D,,2 | ^A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 G,,2 C,,2 C,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 G,,2 C,,2 C,,2 | ^G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 | ^G,,,2 G,,,2 G,,,2 G,,2 G,,,2 G,,,2 G,,2 G,,,2 | |]
</abc>

Pretty simple here. The bass is basically just full 16th notes repeated over and over. Like we saw in the drum section, we can see this is repeated twice identically, so lets take a closer look to the pattern it plays:

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
[V:1] C,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 G,,2 C,,2 C,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 G,,2 C,,2 C,,2 | A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 | A,,,2 A,,,2 A,,,2 A,,2 A,,,2 A,,,2 A,,2 A,,,2 | D,,2 D,,2 D,,2 D,,2 D,,2 D,,2 D,,2 D,,2 | B,,,2 B,,,2 B,,,2 B,,,2 B,,,2 B,,,2 B,,,2 B,,,2 | |]
</abc>

This is 8 bars of music, first four bars are the same. They start on C and on the third to last note it goes up to G. This is kinda like a power chord and is a really safe note to go to. For a bass line I'd say if you're looking to add some variation without messing with harmony in order to add some variation, the 5th or Octave are the safest bets. It does go to the 5th only for one note and it's the 3rd to last note which is interesting. It's definitely off beat when it goes to G, but it also allows for there to be 2 notes of C before it finishes the bar. Hanging out on C for 4 bars is a long time, but it kinda roots us where home is in the key of C minor while our main melody can be established.

Then for the 5th bar we're playing on Ab, here the note that we leave the root for is Ab, another safe note for the bass - though it adds some interesting variation here with 2 quick notes going back and forth the Ab instead of doing it just once like before.

Then for the final bars 7 and 8 we speed up and switch root notes twice. D is played in bar 7 and Bb is played in bar 8. There's no jump from the root to the 5th or octave here, just Ds then Bbs.

What is kinda neat here is the fractal like structure of the harmony here. C for 4, G for 2, D for 1, Bb for 1. It spreads out these chord changes across 8 measures and keeps things fresh with when the root changes. I wonder if this again helps create this driving forward energetic feeling. Regardless it's an interesting tool to have for basslines and harmoy. 

Looking at the bass line, I'm expecting the harmony here the be as we said:

Cm | Cm | Cm | Cm | Ab | Ab | D? | Bb |

The interesting thing here is that D. In C minor the D is a D diminished chord, which clashes really hard and wants to resolve, so we don't want to hang on it too long - which is basically exactly what we do here, we don't even make it out of the measure and we go to Bb which really wants to resolve back to Cm and creates a great loop. The D here could also be the 5th of G which is the V chord of C minor so it could be hinting at that as well, either way it's ~tension~

You can hear it if you listen to it again that when it gets to playing the D note something sounds a little funky. I think this D here actually really spices everything up a LOT and makes it so it's not just a normal bass line something like to typical (though great progression) of Cm | Ab | Bb | Cm |

We have the bass line now, lets figure out what the harmony is doing, we have our hunches from the bass so lets see if they're validated.


<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmin
%%score (V1)
V:1 name="SynthStrings 1" snm="Synth Strings 1" clef=treble
%%MIDI program 50
%%MIDI channel 0
[V:1] [ceg]31 | | z [ceg]31 | | z [cea]31 | | z [Bdg]31 | | z [ceg]31 | | z [ceg]31 | | z [cea]31 | | z [Bdg]31 | | |]
</abc>


Like everything else in this section, this is the exact same thing 2x. so lets just look at what the pattern is:


<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmin
%%score (V1)
V:1 name="SynthStrings 1" snm="Synth Strings 1" clef=treble
%%MIDI program 50
%%MIDI channel 0
[V:1] [ceg]31 | | z [ceg]31 | | z [cea]31 | | z [Bdg]31 | | |]
</abc>

As established in the bass line, these chords really hang around here spreading over 8 bars. 

We get a very complete Cm triad (C, Eb, G) for the first 2 bars, and then it plays again for another 2 bars. I imagine that this is again to really give space for the main melody to be established. The Cm chord is the root of the key, so it makes sense to hang out here for a while.

Next from bars 5-6 were expecting an Ab chord and that's basically what we get. By moving the G from the Cm up to Ab, we get the first inversion of the Ab chord.

Ab is (Ab, C, Eb), and in root position those are the notes played. We can "invert" chords to give them a different sound by changing which notes are on the top and bottom. In this case we move the Ab from the bottom and put it on the top for a first inversion (C, Eb, Ab). The second inversion would be if we then take the C and put it on the top (Eb, Ab, C). From what I'm seeing online this is notated by writing Ab/C which means "Ab chord with C in the bass".

What this change does between the Cm and Ab/C is it gives us the harmony of the Ab chord, but we stay anchored by not changing the C or Eb notes. 

Next the really interesting part. Remember in the bass we played D for one bar and then Bb for one bar? Well here we DON'T switch between chords, but continue our "Hold this chord for 2 measures" thing we've been doing. So then what is the chord?

The notes are Bb, D, G. So what it actually is is a Gminor chord first inversion (Gm/Bb). So this actually completes our picture of what was going on in the bass line which is really interesting, it was actually playing a Gm/Bb chord, the first measure of the bass was hanging out on the 5th of the Gm chord, then it went to the 3rd of the Gm chord. it's really interesting since the bass typically roots itself on the root of the chord, but here on the ending of this section it was dancing around the root without touching it.

Lets listen to both of these sections together to see how that last section sounds harmonically:

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
[V:1] C,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 G,,2 C,,2 C,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 G,,2 C,,2 C,,2 | A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 | A,,,2 A,,,2 A,,,2 A,,2 A,,,2 A,,,2 A,,2 A,,,2 | D,,2 D,,2 D,,2 D,,2 D,,2 D,,2 D,,2 D,,2 | B,,,2 B,,,2 B,,,2 B,,,2 B,,,2 B,,,2 B,,,2 B,,,2 | |]
V:2 name="SynthStrings 1" snm="Synth Strings 1" clef=treble
%%MIDI program 50
%%MIDI channel 0
[V:2] [ceg]31 | | z [ceg]31 | | z [cea]31 | | z [Bdg]31 | | |]
</abc>

From what I hear here not with the bass and strings together is it feels like the bass is trying to walk down at the end back home. It's both moving towards the root of the harmony (G) and leading directly to the tonic (C). It does a really good job of going towards the loop. 

Before moving to the Brass, is there anything we can gather from the relationship between the drums and the bass?

<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmin
%%score (V1 V2 V3)
V:2 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:2] B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 z B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 z B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 z B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,2 E,, E,, D,, D,, B,,, B,,, C,, C,, | |]
V:3 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:3] [^A,,^C,] | ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, [^A,,^C,] ^A,, | [^A,,^C,] ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | |]
V:1 name="Synth Bass 1" snm="Synth Bass 1" clef=treble
%%MIDI program 38
%%MIDI channel 0
[V:1] C,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 G,,2 C,,2 C,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 G,,2 C,,2 C,,2 | A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 | A,,,2 A,,,2 A,,,2 A,,2 A,,,2 A,,,2 A,,2 A,,,2 | D,,2 D,,2 D,,2 D,,2 D,,2 D,,2 D,,2 D,,2 | B,,,2 B,,,2 B,,,2 B,,,2 B,,,2 B,,,2 B,,,2 B,,,2 | |]
</abc>

The main thing I'm seeing is I think the answer for the double Crash Cymbal. It occurs right as we switch away from Cm after hanging on it for 4 bars. Then there's enough changing in the bass and drums for 5-8 so it makes sense the double crash occurs when it does now.

Okay! Now onto the synth brass:

<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmin
%%score (V1)
V:1 name="SynthBrass 2" snm="Synth Brass 2" clef=treble
%%MIDI program 63
%%MIDI channel 0
[V:1] [G,,C,]3 | z [E,G,]3 z [G,,C,]2 [E,G,]3 z [G,,C,]2 | [E,G,]3 z [G,,C,]2 [E,G,]3 z [G,,C,]2 [E,G,]3 z [G,,C,]3 | z [E,G,]3 z [G,,C,]2 [E,G,]3 z [G,,C,]2 | [E,G,]3 z [G,,C,]2 [E,G,]3 z [G,,C,]2 [E,G,]3 z [A,,C,]3 | z [C,E,]3 z [A,,C,]2 [C,E,]3 z [A,,C,]2 | [C,E,]3 z [A,,C,]2 [C,E,]3 z [A,,C,]2 [C,E,]3 z [B,,D,]3 | z [D,G,]3 z [B,,D,]2 [D,G,]3 z [B,,D,]2 | [D,G,]3 z [B,,D,]2 [D,G,]3 z [B,,D,]2 [D,G,]3 z [G,,C,]3 | z [E,G,]3 z [G,,C,]2 [E,G,]3 z [G,,C,]2 | [E,G,]3 z [G,,C,]2 [E,G,]3 z [G,,C,]2 [E,G,]3 z [G,,C,]3 | z [E,G,]3 z [G,,C,]2 [E,G,]3 z [G,,C,]2 | [E,G,]3 z [G,,C,]2 [E,G,]3 z [G,,C,]2 [E,G,]3 z [A,,C,]3 | z [C,E,]3 z [A,,C,]2 [C,E,]3 z [A,,C,]2 | [C,E,]3 z [A,,C,]2 [C,E,]3 z [A,,C,]2 [C,E,]3 |]
</abc>


Like everything else this is the same thing 2x, so lets take a look at the pattern:

<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmin
%%score (V1)
V:1 name="SynthBrass 2" snm="Synth Brass 2" clef=treble
%%MIDI program 63
%%MIDI channel 0
[V:1] [G,,C,]3 | z [E,G,]3 z [G,,C,]2 [E,G,]3 z [G,,C,]2 | [E,G,]3 z [G,,C,]2 [E,G,]3 z [G,,C,]2 [E,G,]3 z [G,,C,]3 | z [E,G,]3 z [G,,C,]2 [E,G,]3 z [G,,C,]2 | [E,G,]3 z [G,,C,]2 [E,G,]3 z [G,,C,]2 [E,G,]3 z [A,,C,]3 | z [C,E,]3 z [A,,C,]2 [C,E,]3 z [A,,C,]2 | [C,E,]3 z [A,,C,]2 [C,E,]3 z [A,,C,]2 [C,E,]3 z [B,,D,]3 | z [D,G,]3 z [B,,D,]2 [D,G,]3 z [B,,D,]2 | [D,G,]3 z [B,,D,]2 [D,G,]3 z [B,,D,]2 [D,G,]3 |]
</abc>

Harmonically I'd expect to see exactly what we had in the string here:

Cm | Cm | Cm | Cm | Ab | Ab | Gm | Gm |

From the look of it it basically is that. The first 4 bars are Cm, then we switch to Ab for 2 bars, then Gm for 2 bars. 

There's two things that this is really adding though instead of just mirroring the strings. 

First it obviously creates this interesting rhytmic texture. 

I quickly want to take a look at the drums to see how they compare.


<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmin
%%score (V1 V2)
V:2 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:2] B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 z B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 z B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 z B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,2 E,, E,, D,, D,, B,,, B,,, C,, C,, | |]
V:1 name="SynthBrass 2" snm="Synth Brass 2" clef=treble
%%MIDI program 63
%%MIDI channel 0
[V:1] [G,,C,]3 | z [E,G,]3 z [G,,C,]2 [E,G,]3 z [G,,C,]2 | [E,G,]3 z [G,,C,]2 [E,G,]3 z [G,,C,]2 [E,G,]3 z [G,,C,]3 | z [E,G,]3 z [G,,C,]2 [E,G,]3 z [G,,C,]2 | [E,G,]3 z [G,,C,]2 [E,G,]3 z [G,,C,]2 [E,G,]3 z [A,,C,]3 | z [C,E,]3 z [A,,C,]2 [C,E,]3 z [A,,C,]2 | [C,E,]3 z [A,,C,]2 [C,E,]3 z [A,,C,]2 [C,E,]3 z [B,,D,]3 | z [D,G,]3 z [B,,D,]2 [D,G,]3 z [B,,D,]2 | [D,G,]3 z [B,,D,]2 [D,G,]3 z [B,,D,]2 [D,G,]3 |]
</abc>

From this I gather that they kinda go back and forth between being in sync and out of sync. I wanna zoom in to a single rhythmic loop of the brass since we know that the drum just repeats every 2 bars. And it looks like the rhythm for the brass repeats every 4, so lets look at just the first 4


<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmin
%%score (V1 V2)
V:2 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:2] B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 z B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 |]
V:1 name="SynthBrass 2" snm="Synth Brass 2" clef=treble
%%MIDI program 63
%%MIDI channel 0
[V:1] [G,,C,]3 | z [E,G,]3 z [G,,C,]2 [E,G,]3 z [G,,C,]2 | [E,G,]3 z [G,,C,]2 [E,G,]3 z [G,,C,]2 [E,G,]3 z [G,,C,]3 | z [E,G,]3 z [G,,C,]2 [E,G,]3 z [G,,C,]2 | [E,G,]3 z [G,,C,]2 [E,G,]3 z [G,,C,]2 [E,G,]3 |]
</abc>

What I first notice which is interesting here is that the rhythm for the brass quickens exactly when the double kick occurs. Because if we look at the general pattern for the brass it is basically this:

<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmin
%%score (V1 V2)
V:2 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:2] B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 z B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 |]
V:1 name="SynthBrass 2" snm="Synth Brass 2" clef=treble
%%MIDI program 63
%%MIDI channel 0
[V:1] C,3 | z E,3 z C,2 E,3 z C,2 | E,3 z C,2 E,3 z C,2 E,3 z C,3 | z E,3 z C,2 E,3 z C,2 | E,3 z C,2 E,3 z C,2 E,3 |]
</abc>

Actually just noticed that the rhythm for the brass is just 2 bars - so it's actually the same length as the drums and loops up perfectly. So I think that the rhythm for the brass can really be derived from the drums.

we have this rhythm of the brass which starts with an 8th note and then goes back and forth 4x of 16th then 8th. 

What this kind of creates is this little locomotion effect between the drums. The first two are in sync, then when the double kick plays, the first note of the brass shortens to be in sync with the kick and the second kick occurs the longer note of the brass plays. Then the next time the long note of the brass plays it plays again directly on the kick. The kick even holds out here for the entire 5th bar. 

Actually taking a look at it now, the long notes of the brass are always on the kick except the first and the last ones. Since it's looping we get this "two times in a row the kick is syncing with the long note" and "two times in a row the snare is syncing with the long note. 

Not really sure if there's any meaning or connection here. It does really feel like the brass is jumping back and forth off the drums though, and considering the brass is mostly just adding to the rhythm, I just wanted to see if I could find any purpose to why it's doing what its doing. 

At the end of the day it is adding both a rhytmic looping texture that's the same duration as the drum loop, and it's adding harmonic texture as well. Actually lets take a look at that.


<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmin
%%score (V1)
V:1 name="SynthBrass 2" snm="Synth Brass 2" clef=treble
%%MIDI program 63
%%MIDI channel 0
[V:1] [G,,C,]3 | z [E,G,]3 z [G,,C,]2 [E,G,]3 z [G,,C,]2 | [E,G,]3 z [G,,C,]2 [E,G,]3 z [G,,C,]2 [E,G,]3 z [G,,C,]3 | z [E,G,]3 z [G,,C,]2 [E,G,]3 z [G,,C,]2 | [E,G,]3 z [G,,C,]2 [E,G,]3 z [G,,C,]2 [E,G,]3 z [A,,C,]3 | z [C,E,]3 z [A,,C,]2 [C,E,]3 z [A,,C,]2 | [C,E,]3 z [A,,C,]2 [C,E,]3 z [A,,C,]2 [C,E,]3 z [B,,D,]3 | z [D,G,]3 z [B,,D,]2 [D,G,]3 z [B,,D,]2 | [D,G,]3 z [B,,D,]2 [D,G,]3 z [B,,D,]2 [D,G,]3 |]
</abc>

So we remember our progression:

Cm | Cm | Cm | Cm | Ab | Ab | Gm | Gm

What this is doing is it's breaking the chords into something that is kinda like a "kick-snare" pattern. Just looking at the highest notes we're going from C to G. C being our "kick" and G being our "snare". Though just C and G feels a little empty so for the C we actually added in our 5th below it. Then for the G we add the 3rd below it. This creates a nice texture without changing any of the harmoy we already have extablished, so it sounds like several horns playing filling up the space instead of just a single horn (similar to the example I showed earlier with the drums).

For the Ab chord we do the same thing, except the chord is broken into (Ab C) and (C Eb). What I see this doing here is everything is trying to stay pretty close to center here. Nothing is really travelling outside of the initial space we declared during the Cm. The Gm is actually played here with the same inversion as the strings (even though the Ab here was not) so again just some play with variation.

Also something to note is that the brass ping ponging back and forth like this feels very "car horn honking" and it is a highway stage. Not sure if there's any connection there, but it does feel like it fits the theme of the stage.


Now to the most exciting part, now that we've established the stage to play on, we're on to the main melody!

When I'm writing a lot of the time this is the flow I follow. I imagine it like building up the atmosphere and painting the landscape of the stage, and then I put the main character on it. In this case the main character is the main melody.


So here's the main melody for these 16 bars:

<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmin
%%score (V1)
V:1 name="Distortion Guitar" snm="Distortion Guitar" clef=treble
%%MIDI program 30
%%MIDI channel 0
[V:1] z4 e3 | z B2 =B2 z2 c17 | z5 e3 | z B2 =B2 z2 c2 | z2 c2 e2 g2 f2 e2 d2 B2 | z2 a3 z g2 f2 e2 z2 d2 | e2 z4 c5 z d2 e2 | f2 d3 z e3 z d3 z B2 | G15 z5 e3 | z B2 =B2 z2 c17 | z5 e3 | z B2 =B2 z2 c2 | z2 c2 e2 c2 f2 _g2 f2 c2 | z2 a3 z g2 f2 c'3 z b2 | a2 z4 f5 z d2 e2 | f2 d3 z e3 z f3 z g2 | g15 |]
</abc>


As I mentioned way earlier, this 16 bar section is 2 parts. The main theme, and then the main theme variation. 

As we established earlier, every single part of the song is 2x repeated, so the only thing that's different here IS the main melody, and the main melody does greatly change, but it maintains some of the same things during its repitition. Lets take a look at the first half.


<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmin
%%score (V1)
V:1 name="Distortion Guitar" snm="Distortion Guitar" clef=treble
%%MIDI program 30
%%MIDI channel 0
[V:1] z4 e3 | z B2 =B2 z2 c17 | z5 e3 | z B2 =B2 z2 c2 | z2 c2 e2 g2 f2 e2 d2 B2 | z2 a3 z g2 f2 e2 z2 d2 | e2 z4 c5 z d2 e2 | f2 d3 z e3 z d3 z B2 | G15 |]
</abc>

If you recall from the harmony we're looking at this harmony here:

Cm | Cm | Cm | Cm | Ab | Ab | Gm | Gm

And looking at the melody you can actually see two very distinct sections just here in the melody which aligns directly with the first 4 bars of just Cm.

Lets zoom in there since there's a lot of good stuff going on here.


<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmin
%%score (V1)
V:1 name="Distortion Guitar" snm="Distortion Guitar" clef=treble
%%MIDI program 30
%%MIDI channel 0
[V:1] z4 e3 | z B2 =B2 z2 c17 | z5 e3 | z B2 =B2 z2 c2 | z2 c2 e2 g2 f2 e2 d2 B2 | |]
</abc>

For the whole 16 bar section we already determined the structure that's occuring is:

Theme A | Theme A Variation

Well what's neat is that while that's occuring at the 16 bar level, that's also occuring on the first 4 bars as well.

Repitition and Variation really are the cornerstones of music. And the nice thing with that is that repitition means there's less work needed to be done to make something, and variation basically just means "copy paste and change a few things". And on some level that's the "secret" of good music.

So the first 2 bars we introduce what I like to think of as the main theme. The third then the bluesy walk up back to the root. The first time this is introduced we get a little breathing room for the other elements of the song to come in. Something I always struggle with in writing is not just putting a whole bunch of notes in everywhere. It's really important to hold notes sometimes and just leave a moment to breath. A recommendation I heard for melody writing is think of it like vocals or someone playing a wind instrument, they need to take breaths, so leave space for them to do that.

Typically when I'm writing something I'd write something like the bars 3-4 here. What I think I'm learning here is maybe I could start out with that, but then put a variation before it with a little more breating room. This way even though I wrote the energetic part first, I could put the repitition and breathing room in the first 2 bars, and then those pieces can come together to create something like this. 

So what's going on in the the 4th bar here?

It's kinda like a drum roll filler isn't it? It's all 16th notes propelling us forward, here we're jumping up the notes of Cm (C E G) starting on a syncopated beat, and then walking down the scale, though we actually jump right past the tonic down to Bb, which really creates some tension. Remember we're only on bar 4 out of a 16 bar phrase. Lets take a look at the next 4 bars to see how this continues. Remember this part has just been sitting on Cm and we're about to switch to Ab. So we've established the melody and now we're about to switch the harmony.

I typically think of Ab in Cm as a very powerful chord. It feels like you're pushing forward at a challenging but doable part of your journey.

<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmin
%%score (V1)
V:1 name="Distortion Guitar" snm="Distortion Guitar" clef=treble
%%MIDI program 30
%%MIDI channel 0
[V:1] z2 c2 | | | | e2 g2 f2 e2 d2 B2 | z2 a3 z g2 f2 e2 z2 d2 | e2 z4 c5 z d2 e2 | f2 d3 z e3 z d3 z B2 | G15 |]
</abc>



Here I'm including bar 4 as well, so we don't forget where we came from. 

So we've got 5 bars, bars 4-8 here which rounds out Theme A.

We can see that there's not really any blues notes here, so it's mostly playing it safe, but lets look at what is played starting bar 5. We start the melody high up at Ab, which is the root of our harmony so it sounds just where it belongs here since we know all the other instruments are backing us up here. Though again, it's totally not on the beat at all so it's syncopated giving us that driving energy. The note is held long enough for us to riff our a bunch of 16th notes again walking down the scale from Ab G F Eb. The melody also really lingers around the Eb which makes sense since it's the 5th of the Ab chord. Also in general remember that the 5th is like the "power chord" so it's a very strong harmony and a good note to land on.  

Lets take a look at the melody and chords together so we can see how the melody dances around the chords:

<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmin
%%score (V1 V2)
V:1 name="Distortion Guitar" snm="Distortion Guitar" clef=treble
%%MIDI program 30
%%MIDI channel 0
[V:1] z4 e3 | z B2 =B2 z2 c17 | z5 e3 | z B2 =B2 z2 c2 | z2 c2 e2 g2 f2 e2 d2 B2 | z2 a3 z g2 f2 e2 z2 d2 | e2 z4 c5 z d2 e2 | f2 d3 z e3 z d3 z B2 | G15 |]
V:2 name="SynthStrings 1" snm="Synth Strings 1" clef=treble
%%MIDI program 50
%%MIDI channel 0
[V:2] [ceg]31 | | z [ceg]31 | | z [cea]31 | | z [Bdg]31 | | |]
</abc>

Typically the safest way to go is to hit a note which is in the chord on the strong beats. Since the melody is syncopated here, we actually hit the chord tones basically a 16th note off from when its played. Again I think this just drives the melody forward and gives it a lot of energy.

Now lets take a look at 9-16, aka the Theme A Variation:

<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmin
%%score (V1 V2)
V:1 name="Distortion Guitar" snm="Distortion Guitar" clef=treble
%%MIDI program 30
%%MIDI channel 0
[V:1] z4 e3 | | | | | | | | | z B2 =B2 z2 c17 | z5 e3 | z B2 =B2 z2 c2 | z2 c2 e2 c2 f2 _g2 f2 c2 | z2 a3 z g2 f2 c'3 z b2 | a2 z4 f5 z d2 e2 | f2 d3 z e3 z f3 z g2 | g15 |]
V:2 name="SynthStrings 1" snm="Synth Strings 1" clef=treble
%%MIDI program 50
%%MIDI channel 0
[V:2] [ceg]31 | | | | | | | | | | z [ceg]31 | | z [cea]31 | | z [Bdg]31 | | |]
</abc>

I'm including the chords here as well because I feel like it provides important harmonic context.

We can see that it starts off exactly the same, but right towards the end of the 4th bar of this part we change up the "drum fill-like" section we had and stick in a stanky Gb blues note.

So this next section isn't to actually listen to, but it's for a rhytmic comparison of Theme A and Theme A Variation:

<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmin
%%score (V1 V2)
V:1 name="Theme A" snm="Distortion Guitar" clef=treble
%%MIDI program 30
%%MIDI channel 0
[V:1] z5 e3 | | | | | | | | | z B2 =B2 z2 c17 | | z5 e3 z B2 =B2 z2 c2 | z2 c2 e2 g2 f2 e2 d2 B2 | z2 a3 z g2 f2 e2 z2 d2 | e2 z4 c5 z d2 e2 | f2 d3 z e3 z d3 z B2 | G15 | |]
V:2 name="Theme A Variation" snm="Distortion Guitar" clef=treble
%%MIDI program 30
%%MIDI channel 0
[V:2] z5 e3 | | | | | | | | | z B2 =B2 z2 c17 | | z5 e3 z B2 =B2 z2 c2 | z2 c2 e2 c2 f2 _g2 f2 c2 | z2 a3 z g2 f2 c'3 z b2 | a2 z4 f5 z d2 e2 | f2 d3 z e3 z f3 z g2 | g15 | |]
</abc>

I just stuck them directly on top of each other.

You can see here that they're actually rhymically identical, but as we said, in bar 4 it changes. This is again good news for anyone who wants to make music like this, because again it just means copy paste and change a few things - and the funny thing is that's what makes it sound good!

The main difference which occurs on bar 4 is that instead of going down to Bb, we play around with the Gb (blues note) and then linger on F.

Lingering on this F kinda changes the harmony that were had which was a comfy Cm to a Csus4 kinda thing. We only get that feeling for basically an 8th note, but it's definintely there in the melody. This tension drives us towards the variation in this section.

Here we're just building with hype. You can see in the comparison here, while Theme A goes down and lingers on the 5th of Ab, the Theme A' (using ' for Variation) repeats the descending line, but shoots up  to C and descends down to Ab (the root of the chord). 

What it feels like we're trying to do here is build up the energy as the pitches get higher and higher, but the descending line keeps us grounded. C is also a pretty safe note to jump to here because it's the 3rd of the Ab chord. So we just barely leave our comfort zone with walking down on Bb, but then we immediately return to it in Ab.

But again we don't stay comfy for long. We're still in the Ab chord and we play another F! Lingering on it even longer. The F in the Ab chord creates this Ab Major 6th sound. This is a very jazzy sound, and it really creates this "we're not done yet" feeling. 

Which makes sense because right after that part we're going into our Gm chord where we've got 2 ascending figures stepping up from D Eb F which repeats twice. The first time is in 16th note time, and the repitition looks like it's in triplet time. This is kinda a cool thing where it's playing the same 3 notes but slightly slowing down the rhythm.

Lets take a quick look at what it would sound like if we didn't do the triplet time here and just repeated without variation:

<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmin
%%score (V1)
V:1 name="Distortion Guitar" snm="Distortion Guitar" clef=treble
%%MIDI program 30
%%MIDI channel 0
[V:1] z4 e3 | | | | | | | | | z B2 =B2 z2 c17 | z5 e3 | z B2 =B2 z2 c2 | z2 c2 e2 c2 f2 _g2 f2 c2 | z2 a3 z g2 f2 c'3 z b2 | a2 z4 f5 z d2 e2 | f2 d2 e2 f2 z6 g2 | g15 |]
</abc>

It really just sounds wrong idk. I think this shows the importance of variation. The variation could be melodic or timing, but unless you're intentionally playing with repitition, it can sound really stale.


And then that just leads into a held note on G (which is the 5th of our key, leaving in a very powerful place), and it's also the root of the current chord we're in, so it sounds like we've reached where we're trying to go harmonically. It also totally mirrors what we did in Theme A (non variation). Theme A started at home (the tonic) and ventured out but returned back down home. Then on Theme A' we are venturing further out away from home and we've made it all the way the fifth of the key! Being the V of the Key, so we actually have a LOT of tension here, which is good because we have the B section to go to next!

Lets take one more listen to the whole section here now hopefully having a little more understanding of how it all fits together:

<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmin
%%score (V1 V2 V3 V4 V5 V6 V7)
V:6 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:6] B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 z B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 z B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 z B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,2 E,, E,, D,, D,, B,,, B,,, C,, C,, | B,,,3 z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 z B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 z B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,3 z B,,,2 E,,3 z B,,,3 | z E,,3 z B,,,2 B,,,2 E,,2 B,,,2 | B,,,3 z E,,2 B,,,2 E,, E,, D,, D,, B,,, B,,, C,, |]
V:7 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:7] [^A,,^C,] | ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, [^A,,^C,] ^A,, | [^A,,^C,] ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | [^A,,^C,] ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, [^A,,^C,] ^A,, | [^A,,^C,] ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, | ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, ^A,, [^A,,G,] ^A,, ^A,, |]
V:1 name="Distortion Guitar" snm="Distortion Guitar" clef=treble
%%MIDI program 30
%%MIDI channel 0
[V:1] z4 e3 | z B2 =B2 z2 c17 | z5 e3 | z B2 =B2 z2 c2 | z2 c2 e2 g2 f2 e2 d2 B2 | z2 a3 z g2 f2 e2 z2 d2 | e2 z4 c5 z d2 e2 | f2 d3 z e3 z d3 z B2 | G15 z5 e3 | z B2 =B2 z2 c17 | z5 e3 | z B2 =B2 z2 c2 | z2 c2 e2 c2 f2 _g2 f2 c2 | z2 a3 z g2 f2 c'3 z b2 | a2 z4 f5 z d2 e2 | f2 d3 z e3 z f3 z g2 | g15 |]
V:2 name="Distortion Guitar" snm="Distortion Guitar" clef=treble
%%MIDI program 30
%%MIDI channel 0
[V:2] z5 e3 | z B2 =B2 z2 c17 | | z5 e3 z B2 =B2 z2 c2 | z2 c2 e2 g2 f2 e2 d2 B2 | z2 a3 z g2 f2 e2 z2 d2 | e2 z4 c5 z d2 e2 | f2 d3 z e3 z d3 z B2 | G15 | z5 e3 z B2 =B2 z2 c17 | | z5 e3 z B2 =B2 z2 c2 | z2 c2 e2 c2 f2 _g2 f2 c2 | z2 a3 z g2 f2 c'3 z b2 | a2 z4 f5 z d2 e2 | f2 d3 z e3 z f3 z g2 | g15 | |]
V:3 name="Synth Bass 1" snm="Synth Bass 1" clef=treble
%%MIDI program 38
%%MIDI channel 0
[V:3] C,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 G,,2 C,,2 C,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 G,,2 C,,2 C,,2 | A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 | A,,,2 A,,,2 A,,,2 A,,2 A,,,2 A,,,2 A,,2 A,,,2 | D,,2 D,,2 D,,2 D,,2 D,,2 D,,2 D,,2 D,,2 | B,,,2 B,,,2 B,,,2 B,,,2 B,,,2 B,,,2 B,,,2 B,,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 G,,2 C,,2 C,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 G,,2 C,,2 C,,2 | A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 | A,,,2 A,,,2 A,,,2 A,,2 A,,,2 A,,,2 A,,2 A,,,2 | D,,2 D,,2 D,,2 D,,2 D,,2 D,,2 D,,2 D,,2 | B,,,2 B,,,2 B,,,2 B,,,2 B,,,2 B,,,2 B,,,2 B,,,2 | |]
V:4 name="SynthBrass 2" snm="Synth Brass 2" clef=treble
%%MIDI program 63
%%MIDI channel 0
[V:4] [G,,C,]3 | z [E,G,]3 z [G,,C,]2 [E,G,]3 z [G,,C,]2 | [E,G,]3 z [G,,C,]2 [E,G,]3 z [G,,C,]2 [E,G,]3 z [G,,C,]3 | z [E,G,]3 z [G,,C,]2 [E,G,]3 z [G,,C,]2 | [E,G,]3 z [G,,C,]2 [E,G,]3 z [G,,C,]2 [E,G,]3 z [A,,C,]3 | z [C,E,]3 z [A,,C,]2 [C,E,]3 z [A,,C,]2 | [C,E,]3 z [A,,C,]2 [C,E,]3 z [A,,C,]2 [C,E,]3 z [B,,D,]3 | z [D,G,]3 z [B,,D,]2 [D,G,]3 z [B,,D,]2 | [D,G,]3 z [B,,D,]2 [D,G,]3 z [B,,D,]2 [D,G,]3 z [G,,C,]3 | z [E,G,]3 z [G,,C,]2 [E,G,]3 z [G,,C,]2 | [E,G,]3 z [G,,C,]2 [E,G,]3 z [G,,C,]2 [E,G,]3 z [G,,C,]3 | z [E,G,]3 z [G,,C,]2 [E,G,]3 z [G,,C,]2 | [E,G,]3 z [G,,C,]2 [E,G,]3 z [G,,C,]2 [E,G,]3 z [A,,C,]3 | z [C,E,]3 z [A,,C,]2 [C,E,]3 z [A,,C,]2 | [C,E,]3 z [A,,C,]2 [C,E,]3 z [A,,C,]2 [C,E,]3 z [B,,D,]3 | z [D,G,]3 z [B,,D,]2 [D,G,]3 z [B,,D,]2 | [D,G,]3 z [B,,D,]2 [D,G,]3 z [B,,D,]2 [D,G,]3 |]
V:5 name="SynthStrings 1" snm="Synth Strings 1" clef=treble
%%MIDI program 50
%%MIDI channel 0
[V:5] [ceg]31 | | z [ceg]31 | | z [cea]31 | | z [Bdg]31 | | z [ceg]31 | | z [ceg]31 | | z [cea]31 | | z [Bdg]31 | | |]
</abc>

I feel like listening to it again here I can really feel how the drum fills work together with the harmonic arrangement to drive the song forward. It does create this little cozy space with the Cms and then gradually introduce both haromic and rhytmic tension.


On to the next section, I guess if the previous section was the main theme, I'd call this the "Build Up"

<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmin
%%score (V1 V2 V3 V4 V5 V6 V7)
V:1 name="Distortion Guitar" snm="Distortion Guitar" clef=treble
%%MIDI program 30
%%MIDI channel 0
[V:1] z20 f3 | | | | | | | | | | | | | | | | | z a2 c'3 z e'2 | d'2 b2 g2 d5 z d2 e2 | d2 c7 z c2 d2 e2 | f e d13 z5 c2 | d2 e2 c f2 e [ef]4 | d2 c2 F2 G2 B2 G2 d2 | f5 z e3 z f2 e2 f2 | g15 |]
V:2 name="Distortion Guitar" snm="Distortion Guitar" clef=treble
%%MIDI program 30
%%MIDI channel 0
[V:2] z1 g15 | | | | | | | | | | | | | | | | | z5 f3 z a2 c'3 z e'2 | d'2 b2 g2 d5 z d2 e2 | d2 c7 z c2 d2 e2 | f e d13 | z5 c2 d2 e2 c f2 e [ef]4 | d2 c2 F2 G2 B2 G2 d2 | f5 z e3 z f2 e2 f2 | g15 | |]
V:3 name="Synth Bass 1" snm="Synth Bass 1" clef=treble
%%MIDI program 38
%%MIDI channel 0
[V:3] z14 B,,,2 | | | | | | | | | | | | | | | | | A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 | G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 | F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 | G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 | A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 | F,,2 F,,2 F,,2 F,,2 F,,2 F,,2 F,,2 F,,2 | G,,3 z D,,2 G,,3 z D,,2 G,,2 D,,2 | |]
V:4 name="SynthBrass 2" snm="Synth Brass 2" clef=treble
%%MIDI program 63
%%MIDI channel 0
[V:4] z16 [E,A,]15 | | | | | | | | | | | | | | | | | z [D,G,]15 | z [C,F,]15 | z [D,G,]15 | z [F,A,]15 | z [G,C]15 | z [B,E]15 | z [G,D]15 | |]
V:5 name="SynthStrings 1" snm="Synth Strings 1" clef=treble
%%MIDI program 50
%%MIDI channel 0
[V:5] z16 [cea]15 | | | | | | | | | | | | | | | | | z [Bdg]15 | z [Acf]15 | z [Bdg]15 | z [cfa]15 | z [ceg]15 | z [Bef]15 | z [=Bdg]15 | |]
V:6 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:6] z15 C,, | | | | | | | | | | | | | | | | | B,,,3 z E,,3 z B,,,3 z E,,3 z B,,,3 | z E,,3 z B,,,3 z E,,3 z B,,,3 | z E,,3 z B,,,3 z E,,3 z B,,,3 | z E,,3 z E,, E,, D,, D,, B,,, B,,, C,, C,, | B,,,3 z E,,3 z B,,,3 z E,,3 z B,,,3 | z E,,3 z B,,,3 z E,,3 z B,,,3 | z E,,3 z B,,,3 z E,,3 z B,,,3 | z E,,3 z E,, E,, D,, D,, B,,, B,,, C,, C,, | |]
V:7 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:7] z15 ^A,, | | | | | | | | | | | | | | | | | [^F,,^C,]2 ^F,,2 [^A,,G,]2 ^F,,2 ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 | ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 | ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 | ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 | [^F,,^C,]2 ^F,,2 [^A,,G,]2 ^F,,2 ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 | ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 | ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 | ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 | |]
</abc>

This section I feel like is building up even more. It also feels like a different groove than the first section which We can see with the drum part.

<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmin
%%score (V1 V2)
V:1 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:1] B,,,3 | | | | | | | | | | | | | | | | | z E,,3 z B,,,3 z E,,3 z B,,,3 | z E,,3 z B,,,3 z E,,3 z B,,,3 | z E,,3 z B,,,3 z E,,3 z B,,,3 | z E,,3 z E,, E,, D,, D,, B,,, B,,, C,, C,, | |]
V:2 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:2] [^F,,^C,]2 | | | | | | | | | | | | | | | | | ^F,,2 [^A,,G,]2 ^F,,2 ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 | ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 | ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 | ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 | |]
</abc>

This pattern for the drums is repeated 2x over 8 bars so for brevity I only provided the first 4 bars. My analysis for the main section took like 4 hours so I need to be a little more brief going forward since I don't have that much time hahaha.


Looking at these drums it's much closer the the "boots and cats" rhythm. We alternate Kick-Snare every beat and have a drum fill at the end. The thing that I feel like gives this drum pattern its character is the alternating between the closed and open hihat. The open Hit Hat is hit on the syncopated beats (which we know at this time gives the melody energy so I'll stop mentioning that as well for brevity). 

Lets take a look at the bass:

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
[V:1] A,,,2 | | | | | | | | | | | | | | | | | A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 | G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 | F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 | G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 | A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 | F,,2 F,,2 F,,2 F,,2 F,,2 F,,2 F,,2 F,,2 | G,,3 z D,,2 G,,3 z D,,2 G,,2 D,,2 | |]
</abc>

Much more simple than the previous section, we lose the jumping up and down and the bass is just a basic root note progression. 

We go from:

| Ab | G | F | G | Ab | C | F | G |

The first 4 bars feel like they could loop, going down from Ab then back up to Ab by the 5th measure. Though the 5-8 ascends to the G. The bass pattern is really simple repeated 16th notes, but the rhythm breaks up on the 8th bar on the G chord where it bounces down to the 5th of G (D). We get this Long-Short, Long-Short, Short-Short pattern which nicely breaks up the rhythm and gives us a little bit of syncopation but by the end accelerates back to its 16th pace.

Now lets look at the strings to see how they add to the harmony:

<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmin
%%score (V1)
V:1 name="SynthStrings 1" snm="Synth Strings 1" clef=treble
%%MIDI program 50
%%MIDI channel 0
[V:1] [cea]15 | | | | | | | | | | | | | | | | | z [Bdg]15 | z [Acf]15 | z [Bdg]15 | z [cfa]15 | z [ceg]15 | z [Bef]15 | z [=Bdg]15 | |]
</abc>

Remember before where each chord took up 2 bars? Now they're taking up 1 bar. So while the drums and bass are getting rhymically simpler, the changing of the harmony is speeding up almost like it's charging up.

The progression here is:

| Ab/C | Gm/Bb | Fm/Ab | Gm/Bb | Fm/C | Cm | Bbsus4 | G/B |


If we ignore the inversions, the progression looks like:

| Ab | Gm | Fm | Gm | Fm | Cm | Bbsus4 | G |
| VI | v | iv | v | iv | i | VIIsus4 | V |

I'd break this into 2 sections:

| VI | v | iv | v | 

| iv | i | VIIsus4 | V |

We're really building up the tension here. The first section leading to the Gm (v) chord, and then the second section leading to the G (V) chord with max tension. The Sus4 before the V is also a great addition to the tension. 

Each subsection climbs in tension, with the second half resolving (briefly) into a pre-cadential struggle (B♭sus4 → G).

Looking at the inversions as part of it, we can see the bottom note moves similarly to the bass, but for the 5-8 bars the chords actually descend while the bass ascends, creating interest.

Lets listen to both together:

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
[V:1] A,,,2 | | | | | | | | | | | | | | | | | A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 | G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 | F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 | G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 | A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 | F,,2 F,,2 F,,2 F,,2 F,,2 F,,2 F,,2 F,,2 | G,,3 z D,,2 G,,3 z D,,2 G,,2 D,,2 | |]
V:2 name="SynthStrings 1" snm="Synth Strings 1" clef=treble
%%MIDI program 50
%%MIDI channel 0
[V:2] [cea]15 | | | | | | | | | | | | | | | | | z [Bdg]15 | z [Acf]15 | z [Bdg]15 | z [cfa]15 | z [ceg]15 | z [Bef]15 | z [=Bdg]15 | |]
</abc>

Actually interestingly enough, listening to both together, the strings feel like they're almost always going down, and end down, and the bass is trying to build up. 

The Brass during this section breaks from its rhythm and adds mostly to the harmony here:

<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmin
%%score (V1)
V:1 name="SynthBrass 2" snm="Synth Brass 2" clef=treble
%%MIDI program 63
%%MIDI channel 0
[V:1] [E,A,]15 | | | | | | | | | | | | | | | | | z [D,G,]15 | z [C,F,]15 | z [D,G,]15 | z [F,A,]15 | z [G,C]15 | z [B,E]15 | z [G,D]15 | |]
</abc>

This looks like it more closely mirrors the bass's ascent/descent oppsosed to the strings. The First 4 bars are all 4th intervals. Though lets take a look at what they're outlining:

Ab / Eb (4th) | G / D (4th) | F / C (4th) | G / D (4th) |

So outlining a 4th structure here. Then for the next section we start with a third which mixes things up, then returning to the 4ths and resolving on a 5th interval. The bars 5-8 really feel like the brass's voice opens up as we get to the final bar.

Ab / F (3rd) | C / G (4th) | Eb / Bb (4th) | D / G (5th) |

I feel like the interval jumping here creates some variation and facilitates the tension building. 4ths are very stable and open, a minor 3rd is tense and a 5th is a very stable power chord (but the chord it's outlining as we noted in the harmony is the V chord, so it's a very tense ending to the section).

Putting together with to the bass and the string what kind of harmony do we get?

<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmin
%%score (V1 V2 V3)
V:1 name="Synth Bass 1" snm="Synth Bass 1" clef=treble
%%MIDI program 38
%%MIDI channel 0
[V:1] A,,,2 | | | | | | | | | | | | | | | | | A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 | G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 | F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 | G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 | A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 | F,,2 F,,2 F,,2 F,,2 F,,2 F,,2 F,,2 F,,2 | G,,3 z D,,2 G,,3 z D,,2 G,,2 D,,2 | |]
V:2 name="SynthBrass 2" snm="Synth Brass 2" clef=treble
%%MIDI program 63
%%MIDI channel 0
[V:2] [E,A,]15 | | | | | | | | | | | | | | | | | z [D,G,]15 | z [C,F,]15 | z [D,G,]15 | z [F,A,]15 | z [G,C]15 | z [B,E]15 | z [G,D]15 | |]
V:3 name="SynthStrings 1" snm="Synth Strings 1" clef=treble
%%MIDI program 50
%%MIDI channel 0
[V:3] [cea]15 | | | | | | | | | | | | | | | | | z [Bdg]15 | z [Acf]15 | z [Bdg]15 | z [cfa]15 | z [ceg]15 | z [Bef]15 | z [=Bdg]15 | |]
</abc>

Should also note here, that each of these are within their own octave space, so the bass forms the foundtation around C1-C3, the brass takes between C3 - C5, and the strings take C5 - C6. This fills our frequency spectrum nicely and gives us a full sound.

All 3 of these instruments are basically the same harmonic structure, but with slightly varying voicings.

Now lets look at the most complicated part, the main melody:

<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmin
%%score (V1)
V:1 name="Distortion Guitar" snm="Distortion Guitar" clef=treble
%%MIDI program 30
%%MIDI channel 0
[V:1] z4 f3 | | | | | | | | | | | | | | | | | z a2 c'3 z e'2 | d'2 b2 g2 d5 z d2 e2 | d2 c7 z c2 d2 e2 | f e d13 z5 c2 | d2 e2 c f2 e [ef]4 | d2 c2 F2 G2 B2 G2 d2 | f5 z e3 z f2 e2 f2 | g15 |]
</abc>

One important thing to note again is the insane amount of syncopation. You would have seen this the whole time, but I decided to update the piano roll viewer to draw the syncopated / offbeat notes in a lighter color so it's easier to distinguish them. I'm noting here that "onbeat" notes are ones that on on the downbeat (1, 2, 3, 4) and "offbeat" notes are ones that are on the upbeats (the "and" of each beat).

Not really sure how much I can say about this section. We know the chord progression:

| Ab | Gm | Fm | Gm | Fm | Cm | Bbsus4 | G |

Though the notes we're playing are:

| F Ab C Eb | D Bb G | D C Eb | F Eb D | C D Eb F | F Eb D C G Bb | F Eb | G | 

The notes of the chords are:

| Ab C Eb | G Bb D | F Ab C | G Bb D | F Ab C | C Eb G | Bb Eb F | G B D |

So comparing the two, the non-chord notes are:

| F | - | D Eb | F Eb | D Eb | F D Bb | - | - |


So most of the measures do embellish here on non-chord tones, consider the melody is driving us here and leading us forward, it really creates harmonic interest this way. 


or in scale degrees:

| 4 | - | 2 3 | 4 3 | 2 3 | 4 2 7 | - | - |

One thing I'm trying to see here is the frequency of notes played within the scale, which notes really create that "Megaman X Sound" especially when we're breaking away from the chord tones. For this I'm seeing mostly:

4, 3, 2, 7

I would just think about this when trying to write my own melody to determine which non-chord tones could be safest to hit for passing tones. I don't notice any repeated rhythm here, there is a few good embellishings where the melody jumps back and forth between two notes quickly. 

Perhaps we could break down the first and second halves and see there's a slight parallel with how they function? 

1-4: | rise | fall | linger | hold
5-8: | rise | fall | linger | hold

So that's a bit of repitition there, though there's a whole lot of rhythmic and harmonic variation layered on top of that.

Wish I could offer more insight here, but that's basically all I have for this.


Lets listen to the whole thing:

<abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Cmin
%%score (V1 V2 V3 V4)
V:1 name="Distortion Guitar" snm="Distortion Guitar" clef=treble
%%MIDI program 30
%%MIDI channel 0
[V:1] z4 f3 | | | | | | | | | | | | | | | | | z a2 c'3 z e'2 | d'2 b2 g2 d5 z d2 e2 | d2 c7 z c2 d2 e2 | f e d13 z5 c2 | d2 e2 c f2 e [ef]4 | d2 c2 F2 G2 B2 G2 d2 | f5 z e3 z f2 e2 f2 | g15 |]
V:2 name="Synth Bass 1" snm="Synth Bass 1" clef=treble
%%MIDI program 38
%%MIDI channel 0
[V:2] A,,,2 | | | | | | | | | | | | | | | | | A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 | G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 | F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 | G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 G,,,2 | A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 A,,,2 | C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 C,,2 | F,,2 F,,2 F,,2 F,,2 F,,2 F,,2 F,,2 F,,2 | G,,3 z D,,2 G,,3 z D,,2 G,,2 D,,2 | |]
V:3 name="SynthStrings 1" snm="Synth Strings 1" clef=treble
%%MIDI program 50
%%MIDI channel 0
[V:3] [cea]15 | | | | | | | | | | | | | | | | | z [Bdg]15 | z [Acf]15 | z [Bdg]15 | z [cfa]15 | z [ceg]15 | z [Bef]15 | z [=Bdg]15 | |]
V:4 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:4] [^F,,^C,]2 | | | | | | | | | | | | | | | | | ^F,,2 [^A,,G,]2 ^F,,2 ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 | ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 | ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 | ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 | [^F,,^C,]2 ^F,,2 [^A,,G,]2 ^F,,2 ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 | ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 | ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 | ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 ^F,,2 ^F,,2 [^A,,G,]2 ^F,,2 | |]
</abc>


`;