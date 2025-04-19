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


So 

<abc>
X:1
T:Music21 Fragment
C:Music21
%%score 1 2
L:1/16
M:4/4
I:linebreak $
K:none
V:1 treble nm="Staff" snm="Elec Gtr"
V:2 bass nm="Staff-3" snm="Brs"
V:1
 z4 _e3 z _B2=B2 z2 c2- | c15 z |] %2
V:2
 [G,,C,]3 z [_E,G,]3 z [G,,C,]2[_E,G,]3 z [G,,C,]2 | %1
 [_E,G,]3 z [G,,C,]2[_E,G,]3 z [G,,C,]2 [_E,G,]3 z |] %2

</abc>







`;