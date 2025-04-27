// static/js/analysis-data.js

const analysisContent = `Now for the **Whole song** section:

- **Whole song** (bars 1–0)
  - **DropIn** (bars 1–4)
  <abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Fmin
%%score (V1 V2 V3 V4)
V:1 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:1] z2 ^C,4 z22 ^C,3 | ^C,3 | ^C,4 |]
V:2 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:2] D,, D,, C,,4 C,,4 C,,4 C,,4 | C,,4 C,,4 C,,2 C,,3 C,,3 | C,,4 C,,4 C,,4 C,,4 | C,,4 C,,4 C,, D,, D,, C,, D,, D,, | |]
V:3 name="Distortion Guitar" snm="Distortion Guitar" clef=treble
%%MIDI program 30
%%MIDI channel 0
[V:3] [B,,E,] [=B,,=E,] [C,F,]4 [_E,A,]2 [C,F,]2 [F,_B,]2 [E,A,]2 [C,F,]2 | [E,A,]12 [B,,E,]3 [=B,,=E,]3 | [C,F,]4 [E,A,]2 [C,F,]2 [F,B,]2 [E,A,]2 [C,F,]2 | [B,,E,]18 | |]
V:4 name="Electric Bass (pick)" snm="Electric Bass (pick)" clef=treble
%%MIDI program 34
%%MIDI channel 0
[V:4] E,,, =E,,, F,,,4 A,,,2 F,,,2 B,,,2 A,,,2 F,,,2 | A,,,12 E,,,3 =E,,,3 | F,,,4 A,,,2 F,,,2 B,,,2 A,,,2 F,,,2 | E,,,10 F,,, F,,, F,, F,,, F,,, B,,, | |]
</abc>
    • **Distortion Guitar**
    <abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Fmin
%%score (V1)
V:1 name="Distortion Guitar" snm="Distortion Guitar" clef=treble
%%MIDI program 30
%%MIDI channel 0
[V:1] [B,,E,] [=B,,=E,] [C,F,]4 [_E,A,]2 [C,F,]2 [F,_B,]2 [E,A,]2 [C,F,]2 | [E,A,]12 [B,,E,]3 [=B,,=E,]3 | [C,F,]4 [E,A,]2 [C,F,]2 [F,B,]2 [E,A,]2 [C,F,]2 | [B,,E,]18 | |]
    </abc>
    • **Electric Bass (pick)**
    <abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Fmin
%%score (V1)
V:1 name="Electric Bass (pick)" snm="Electric Bass (pick)" clef=treble
%%MIDI program 34
%%MIDI channel 0
[V:1] E,,, =E,,, F,,,4 A,,,2 F,,,2 B,,,2 A,,,2 F,,,2 | A,,,12 E,,,3 =E,,,3 | F,,,4 A,,,2 F,,,2 B,,,2 A,,,2 F,,,2 | E,,,10 F,,, F,,, F,, F,,, F,,, B,,, | |]
    </abc>
    • **Drums**
    <abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Fmin
%%score (V1 V2)
V:1 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:1] z2 ^C,4 z22 ^C,3 | ^C,3 | ^C,4 |]
V:2 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:2] D,, D,, C,,4 C,,4 C,,4 C,,4 | C,,4 C,,4 C,,2 C,,3 C,,3 | C,,4 C,,4 C,,4 C,,4 | C,,4 C,,4 C,, D,, D,, C,, D,, D,, | |]
    </abc>
    - **Theme A** (bars 1–2)
    <abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Fmin
%%score (V1)
V:1 name="Electric Bass (pick)" snm="Electric Bass (pick)" clef=treble
%%MIDI program 34
%%MIDI channel 0
[V:1] E,,, =E,,, F,,,4 A,,,2 F,,,2 B,,,2 A,,,2 F,,,2 | A,,,12 |]
</abc>
      - **Theme A'** (bars 3–4)
      <abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Fmin
%%score (V1)
V:1 name="Electric Bass (pick)" snm="Electric Bass (pick)" clef=treble
%%MIDI program 34
%%MIDI channel 0
[V:1] z2 F,,,4 A,,,2 F,,,2 B,,,2 A,,,2 F,,,2 | E,,,10 |]
</abc>
        _(variation of Theme A)_
        - **Power Theme A'** (bars 3–4)
        <abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Fmin
%%score (V1)
V:1 name="Distortion Guitar" snm="Distortion Guitar" clef=treble
%%MIDI program 30
%%MIDI channel 0
[V:1] z2 [C,F,]4 [E,A,]2 [C,F,]2 [F,B,]2 [E,A,]2 [C,F,]2 | [B,,E,]18 | |]
</abc>
          _(variation of Theme A')_
      - **Power Theme A** (bars 1–2)
      <abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Fmin
%%score (V1)
V:1 name="Distortion Guitar" snm="Distortion Guitar" clef=treble
%%MIDI program 30
%%MIDI channel 0
[V:1] [B,,E,] [=B,,=E,] [C,F,]4 [_E,A,]2 [C,F,]2 [F,_B,]2 [E,A,]2 [C,F,]2 | [E,A,]12 |]
</abc>
        _(variation of Theme A)_
  - **Part A** (bars 5–12)
  <abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Fmin
%%score (V1 V2 V3 V4 V5)
V:1 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:1] z2 ^C,4 ^A,,4 ^A,,4 ^A,,4 | ^A,,4 ^A,,4 ^A,,4 ^A,,4 | ^C,4 ^A,,4 ^A,,4 ^A,,4 | ^A,,4 ^A,,4 ^A,,4 ^A,,4 | ^C,4 ^A,,4 ^A,,4 ^A,,4 | ^A,,4 ^A,,4 ^A,,4 ^A,,4 | ^C,4 ^A,,4 ^A,,4 ^A,,4 | ^A,,2 ^C,2 z4 ^C,4 |]
V:2 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:2] z1 D,, C,,2 z2 D,,2 z2 C,,2 C,,2 D,,2 | z2 C,,2 z2 D,,2 z2 C,,2 z2 D,,2 | C,, B,,, C,,2 z2 D,,2 z2 C,,2 C,,2 D,,2 | z2 C,,2 z2 D,,2 z2 C,,2 z2 D,,2 | D,, D,, C,,2 z2 D,,2 z2 C,,2 C,,2 D,,2 | z2 C,,2 z2 D,,2 z2 C,,2 z2 D,,2 | C,, B,,, C,,2 z2 D,,2 z2 C,,2 C,,2 D,,2 | C,, B,,, D,,2 C,,2 z4 C,,2 B,,, D,, D,, |]
V:3 name="String Ensemble 1" snm="String Ensemble 1" clef=treble
%%MIDI program 48
%%MIDI channel 0
[V:3] z6 a6 g4 | f18 | z4 a6 g4 | G18 | z4 a6 g4 | f18 | z4 a6 g4 | G18 | |]
V:4 name="Distortion Guitar" snm="Distortion Guitar" clef=treble
%%MIDI program 30
%%MIDI channel 0
[V:4] z2 [C,F,]4 [E,A,]2 [C,F,]2 [F,B,]2 [E,A,]2 [C,F,]2 | [E,A,]16 | [B,,E,] [=B,,=E,] [C,F,]4 [_E,A,]2 [C,F,]2 [F,_B,]2 [E,A,]2 [C,F,]2 | [B,,E,]4 [G,,C,]14 | [C,F,]4 [E,A,]2 [C,F,]2 [F,B,]2 [E,A,]2 [C,F,]2 | [E,A,]16 | [B,,E,] [=B,,=E,] [C,F,]4 [_E,A,]2 [C,F,]2 [F,_B,]2 [E,A,]2 [C,F,]2 | [B,,E,]4 [G,,C,]4 z2 [G,,C,]4 |]
V:5 name="Electric Bass (pick)" snm="Electric Bass (pick)" clef=treble
%%MIDI program 34
%%MIDI channel 0
[V:5] z1 F,,, F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 | F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 | E,,, =E,,, F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,2 F,,,2 | F,,2 C,,,2 C,,,2 C,,,2 C,,,2 C,,,2 C,,,2 C,,,2 | E,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 | F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 | E,,, =E,,, F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,2 F,,,2 | F,,2 C,,,2 C,,,2 z4 C,,,2 C,,,2 G,,,2 | |]
</abc>
    • **String Ensemble 1**
    <abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Fmin
%%score (V1)
V:1 name="String Ensemble 1" snm="String Ensemble 1" clef=treble
%%MIDI program 48
%%MIDI channel 0
[V:1] z6 a6 g4 | f18 | z4 a6 g4 | G18 | z4 a6 g4 | f18 | z4 a6 g4 | G18 | |]
    </abc>
    • **Distortion Guitar**
    <abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Fmin
%%score (V1)
V:1 name="Distortion Guitar" snm="Distortion Guitar" clef=treble
%%MIDI program 30
%%MIDI channel 0
[V:1] z2 [C,F,]4 [E,A,]2 [C,F,]2 [F,B,]2 [E,A,]2 [C,F,]2 | [E,A,]16 | [B,,E,] [=B,,=E,] [C,F,]4 [_E,A,]2 [C,F,]2 [F,_B,]2 [E,A,]2 [C,F,]2 | [B,,E,]4 [G,,C,]14 | [C,F,]4 [E,A,]2 [C,F,]2 [F,B,]2 [E,A,]2 [C,F,]2 | [E,A,]16 | [B,,E,] [=B,,=E,] [C,F,]4 [_E,A,]2 [C,F,]2 [F,_B,]2 [E,A,]2 [C,F,]2 | [B,,E,]4 [G,,C,]4 z2 [G,,C,]4 |]
    </abc>
    • **Electric Bass (pick)**
    <abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Fmin
%%score (V1)
V:1 name="Electric Bass (pick)" snm="Electric Bass (pick)" clef=treble
%%MIDI program 34
%%MIDI channel 0
[V:1] z1 F,,, F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 | F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 | E,,, =E,,, F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,2 F,,,2 | F,,2 C,,,2 C,,,2 C,,,2 C,,,2 C,,,2 C,,,2 C,,,2 | E,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 | F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 | E,,, =E,,, F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,2 F,,,2 | F,,2 C,,,2 C,,,2 z4 C,,,2 C,,,2 G,,,2 | |]
    </abc>
    • **Drums**
    <abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Fmin
%%score (V1 V2)
V:1 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:1] z2 ^C,4 ^A,,4 ^A,,4 ^A,,4 | ^A,,4 ^A,,4 ^A,,4 ^A,,4 | ^C,4 ^A,,4 ^A,,4 ^A,,4 | ^A,,4 ^A,,4 ^A,,4 ^A,,4 | ^C,4 ^A,,4 ^A,,4 ^A,,4 | ^A,,4 ^A,,4 ^A,,4 ^A,,4 | ^C,4 ^A,,4 ^A,,4 ^A,,4 | ^A,,2 ^C,2 z4 ^C,4 |]
V:2 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:2] z1 D,, C,,2 z2 D,,2 z2 C,,2 C,,2 D,,2 | z2 C,,2 z2 D,,2 z2 C,,2 z2 D,,2 | C,, B,,, C,,2 z2 D,,2 z2 C,,2 C,,2 D,,2 | z2 C,,2 z2 D,,2 z2 C,,2 z2 D,,2 | D,, D,, C,,2 z2 D,,2 z2 C,,2 C,,2 D,,2 | z2 C,,2 z2 D,,2 z2 C,,2 z2 D,,2 | C,, B,,, C,,2 z2 D,,2 z2 C,,2 C,,2 D,,2 | C,, B,,, D,,2 C,,2 z4 C,,2 B,,, D,, D,, |]
    </abc>
    - **Drum A** (bars 5–6)
    <abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Fmin
%%score (V1 V2)
V:1 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:1] z2 ^C,4 ^A,,4 ^A,,4 ^A,,4 | ^A,,4 ^A,,4 ^A,,4 ^A,,4 | |]
V:2 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:2] C,, D,, C,,2 z2 D,,2 z2 C,,2 C,,2 D,,2 | z2 C,,2 z2 D,,2 z2 C,,2 z2 D,,2 | |]
</abc>
      • **Drums**
      <abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Fmin
%%score (V1 V2)
V:1 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:1] z2 ^C,4 ^A,,4 ^A,,4 ^A,,4 | ^A,,4 ^A,,4 ^A,,4 ^A,,4 | |]
V:2 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:2] C,, D,, C,,2 z2 D,,2 z2 C,,2 C,,2 D,,2 | z2 C,,2 z2 D,,2 z2 C,,2 z2 D,,2 | |]
      </abc>
      - **Drum A'** (bars 6–8)
      <abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Fmin
%%score (V1 V2)
V:1 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:1] z2 ^C,4 ^A,,4 ^A,,4 ^A,,4 | ^A,,4 ^A,,4 ^A,,4 ^A,,4 | |]
V:2 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:2] C,, B,,, C,,2 z2 D,,2 z2 C,,2 C,,2 D,,2 | z2 C,,2 z2 D,,2 z2 C,,2 z2 D,,2 | |]
</abc>
        • **Drums**
        <abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Fmin
%%score (V1 V2)
V:1 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:1] z2 ^C,4 ^A,,4 ^A,,4 ^A,,4 | ^A,,4 ^A,,4 ^A,,4 ^A,,4 | |]
V:2 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:2] C,, B,,, C,,2 z2 D,,2 z2 C,,2 C,,2 D,,2 | z2 C,,2 z2 D,,2 z2 C,,2 z2 D,,2 | |]
        </abc>
        _(variation of Drum A)_
      - **Drum A''** (bars 8–10)
      <abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Fmin
%%score (V1 V2)
V:1 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:1] z2 ^C,4 ^A,,4 ^A,,4 ^A,,4 | ^A,,4 ^A,,4 ^A,,4 ^A,,4 | |]
V:2 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:2] D,, D,, C,,2 z2 D,,2 z2 C,,2 C,,2 D,,2 | z2 C,,2 z2 D,,2 z2 C,,2 z2 D,,2 | |]
</abc>
        • **Drums**
        <abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Fmin
%%score (V1 V2)
V:1 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:1] z2 ^C,4 ^A,,4 ^A,,4 ^A,,4 | ^A,,4 ^A,,4 ^A,,4 ^A,,4 | |]
V:2 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:2] D,, D,, C,,2 z2 D,,2 z2 C,,2 C,,2 D,,2 | z2 C,,2 z2 D,,2 z2 C,,2 z2 D,,2 | |]
        </abc>
        _(variation of Drum A)_
      - **Drum A'''** (bars 11–12)
      <abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Fmin
%%score (V1 V2)
V:1 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:1] z2 ^C,4 ^A,,4 ^A,,4 ^A,,4 | ^A,,2 ^C,2 z4 ^C,4 |]
V:2 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:2] z1 B,,, C,,2 z2 D,,2 z2 C,,2 C,,2 D,,2 | C,, B,,, D,,2 C,,2 z4 C,,2 B,,, D,, D,, |]
</abc>
        • **Drums**
        <abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Fmin
%%score (V1 V2)
V:1 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:1] z2 ^C,4 ^A,,4 ^A,,4 ^A,,4 | ^A,,2 ^C,2 z4 ^C,4 |]
V:2 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:2] z1 B,,, C,,2 z2 D,,2 z2 C,,2 C,,2 D,,2 | C,, B,,, D,,2 C,,2 z4 C,,2 B,,, D,, D,, |]
        </abc>
        _(variation of Drum A)_
    - **Descending Strings** (bars 5–8)
    <abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Fmin
%%score (V1)
V:1 name="String Ensemble 1" snm="String Ensemble 1" clef=treble
%%MIDI program 48
%%MIDI channel 0
[V:1] z6 a6 g4 | f18 | z4 a6 g4 | G18 | |]
</abc>
      - **undefined** repeats bars 9–12
  - **Part B** (bars 13–28)
  <abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Fmin
%%score (V1 V2 V3 V4 V5 V6)
V:1 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:1] z2 ^C,4 ^A,,4 ^A,,4 ^A,,4 | ^A,,4 ^A,,4 ^A,,4 ^A,,4 | ^A,,4 ^A,,4 ^A,,4 ^A,,4 | ^C,2 z4 ^C,2 z8 ^C,4 | ^A,,4 ^A,,4 ^A,,4 | ^A,,4 ^A,,4 ^A,,4 ^A,,4 | ^A,,4 ^A,,4 ^A,,4 ^A,,4 | ^C,2 z4 ^C,2 z8 ^C,4 | ^A,,4 ^A,,4 ^A,,4 | ^A,,4 ^A,,4 ^A,,4 ^A,,4 | ^A,,4 ^A,,4 ^A,,4 ^A,,4 | ^C,2 z4 ^C,2 z8 ^C,4 | ^A,,4 ^A,,4 ^A,,4 | ^A,,4 ^A,,4 ^A,,4 ^A,,4 | ^A,,4 ^A,,4 ^A,,4 ^A,,4 | ^C,2 z4 ^C,2 |]
V:2 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:2] D,, D,, C,,2 z2 D,,2 z C,, z2 C,, B,,, D,, z3 C,,2 | z2 D,,2 z C,, z2 C,, B,,, D,, z C,, | z C,,2 z2 D,,2 z C,, z2 C,, B,,, D,, z C, | B,, C,, z C, C, B,, B,, C,, z3 C, C, B,, B,, | A,, A,, C,,2 z2 D,,2 z C,, z2 C,, B,,, D,, z3 C,,2 | z2 D,,2 z C,, z2 C,, B,,, D,, z C,, | z C,,2 z2 D,,2 z C,, z2 C,, B,,, D,, z C, | B,, C,, z C, C, B,, B,, C,, z3 C, C, B,, B,, | A,, A,, C,,2 z2 D,,2 z C,, z2 C,, B,,, D,, z3 C,,2 | z2 D,,2 z C,, z2 C,, B,,, D,, z C,, | z C,,2 z2 D,,2 z C,, z2 C,, B,,, D,, z C, | B,, C,, z C, C, B,, B,, C,, z3 C, C, B,, B,, | A,, A,, C,,2 z2 D,,2 z C,, z2 C,, B,,, D,, z3 C,,2 | z2 D,,2 z C,, z2 C,, B,,, D,, z C,, | z C,,2 z2 D,,2 z C,, z2 C,, B,,, D,, z C, | B,, C,, z C, C, B,, B,, C,, z3 C, C, B,, B,, | A,, |]
V:3 name="Overdriven Guitar" snm="Overdriven Guitar" clef=treble
%%MIDI program 29
%%MIDI channel 0
[V:3] z2 F16 | z2 c4 B2 A3 B3 | A2 G6 F10 | z2 E2 =E2 F2 A2 F2 _E2 | =E2 F16 | z2 c4 B2 A3 B3 | A2 G6 C10 | z2 F2 B2 A2 G2 A2 G2 | E2 F16 | z2 [Cc]4 [B,B]2 [A,A]3 [B,B]3 | [A,A]2 [G,G]6 [F,F]10 | z2 [E,E]2 [=E,E]2 [F,F]2 [A,A]2 [F,F]2 [_E,E]2 | [=E,E]2 F16 | z2 [Gc]4 [FB]2 [EA]3 [FB]3 | [EA]2 [=DG]6 C10 | z2 F2 B2 A2 G2 A2 G2 | E2 |]
V:4 name="Overdriven Guitar" snm="Overdriven Guitar" clef=treble
%%MIDI program 29
%%MIDI channel 0
[V:4] z3 F16 | z2 c4 B2 A3 B3 | A2 G6 F10 | z2 E2 =E2 F2 A2 F2 _E2 | =E2 F16 | z2 c4 B2 A3 B3 | A2 G6 C10 | z2 F2 B2 A2 G2 A2 G2 | E2 F16 | z2 [Cc]4 [B,B]2 [A,A]3 [B,B]3 | [A,A]2 [G,G]6 [F,F]10 | z2 [E,E]2 [=E,E]2 [F,F]2 [A,A]2 [F,F]2 [_E,E]2 | [=E,E]2 F16 | z2 [Gc]4 [FB]2 [EA]3 [FB]3 | [EA]2 [=DG]6 C10 | z2 F2 B2 A2 G2 A2 G2 | |]
V:5 name="Distortion Guitar" snm="Distortion Guitar" clef=treble
%%MIDI program 30
%%MIDI channel 0
[V:5] [B,,E,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 | [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 | [C,F,]2 [F,B,]2 [F,B,]2 [F,B,]2 [F,B,]2 [F,B,]2 [F,B,]2 [F,B,]2 | [F,B,]2 z2 [B,,E,]2 [=B,,=E,]2 [C,F,]2 [_E,A,]2 [C,F,]2 [_B,,E,]2 | [=B,,=E,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 | [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 | [C,F,]2 [F,B,]2 [F,B,]2 [F,B,]2 [F,B,]2 [F,B,]2 [F,B,]2 [F,B,]2 | [F,B,]2 z2 [C,F,]2 [F,B,]2 [E,A,]2 [=D,G,]2 [E,A,]2 [D,G,]2 | [B,,E,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 | [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 | [C,F,]2 [F,B,]2 [F,B,]2 [F,B,]2 [F,B,]2 [F,B,]2 [F,B,]2 [F,B,]2 | [F,B,]2 z2 [B,,E,]2 [=B,,=E,]2 [C,F,]2 [_E,A,]2 [C,F,]2 [_B,,E,]2 | [=B,,=E,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 | [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 | [C,F,]2 [F,B,]2 [F,B,]2 [F,B,]2 [F,B,]2 [F,B,]2 [F,B,]2 [F,B,]2 | [F,B,]2 z2 [C,F,]2 [F,B,]2 [E,A,]2 [=D,G,]2 [E,A,]2 [D,G,]2 | [B,,E,]2 |]
V:6 name="Electric Bass (pick)" snm="Electric Bass (pick)" clef=treble
%%MIDI program 34
%%MIDI channel 0
[V:6] E,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 | F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 | F,,, F,,, B,,,2 B,,,2 B,,,2 B,,,2 B,,,2 B,,,2 B,,,2 | B,,,2 z2 E,,,2 =E,,,2 F,,,2 A,,,2 F,,,2 _E,,,2 | =E,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 | F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 | F,,, F,,, B,,,2 B,,,2 B,,,2 B,,,2 B,,,2 B,,,2 B,,,2 | B,,,2 z2 F,,,2 B,,,2 A,,,2 G,,,2 A,,,2 G,,,2 | E,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 | F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 | F,,, F,,, B,,,2 B,,,2 B,,,2 B,,,2 B,,,2 B,,,2 B,,,2 | B,,,2 z2 E,,,2 =E,,,2 F,,,2 A,,,2 F,,,2 _E,,,2 | =E,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 | F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 | F,,, F,,, B,,,2 B,,,2 B,,,2 B,,,2 B,,,2 B,,,2 B,,,2 | B,,,2 z2 F,,,2 B,,,2 A,,,2 G,,,2 A,,,2 G,,,2 | E,,,2 |]
</abc>
    • **Overdriven Guitar**
    <abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Fmin
%%score (V1)
V:1 name="Overdriven Guitar" snm="Overdriven Guitar" clef=treble
%%MIDI program 29
%%MIDI channel 0
[V:1] z2 F16 | z2 c4 B2 A3 B3 | A2 G6 F10 | z2 E2 =E2 F2 A2 F2 _E2 | =E2 F16 | z2 c4 B2 A3 B3 | A2 G6 C10 | z2 F2 B2 A2 G2 A2 G2 | E2 F16 | z2 [Cc]4 [B,B]2 [A,A]3 [B,B]3 | [A,A]2 [G,G]6 [F,F]10 | z2 [E,E]2 [=E,E]2 [F,F]2 [A,A]2 [F,F]2 [_E,E]2 | [=E,E]2 F16 | z2 [Gc]4 [FB]2 [EA]3 [FB]3 | [EA]2 [=DG]6 C10 | z2 F2 B2 A2 G2 A2 G2 | E2 |]
    </abc>
    • **Overdriven Guitar**
    <abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Fmin
%%score (V1)
V:1 name="Overdriven Guitar" snm="Overdriven Guitar" clef=treble
%%MIDI program 29
%%MIDI channel 0
[V:1] z3 F16 | z2 c4 B2 A3 B3 | A2 G6 F10 | z2 E2 =E2 F2 A2 F2 _E2 | =E2 F16 | z2 c4 B2 A3 B3 | A2 G6 C10 | z2 F2 B2 A2 G2 A2 G2 | E2 F16 | z2 [Cc]4 [B,B]2 [A,A]3 [B,B]3 | [A,A]2 [G,G]6 [F,F]10 | z2 [E,E]2 [=E,E]2 [F,F]2 [A,A]2 [F,F]2 [_E,E]2 | [=E,E]2 F16 | z2 [Gc]4 [FB]2 [EA]3 [FB]3 | [EA]2 [=DG]6 C10 | z2 F2 B2 A2 G2 A2 G2 | |]
    </abc>
    • **Distortion Guitar**
    <abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Fmin
%%score (V1)
V:1 name="Distortion Guitar" snm="Distortion Guitar" clef=treble
%%MIDI program 30
%%MIDI channel 0
[V:1] [B,,E,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 | [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 | [C,F,]2 [F,B,]2 [F,B,]2 [F,B,]2 [F,B,]2 [F,B,]2 [F,B,]2 [F,B,]2 | [F,B,]2 z2 [B,,E,]2 [=B,,=E,]2 [C,F,]2 [_E,A,]2 [C,F,]2 [_B,,E,]2 | [=B,,=E,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 | [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 | [C,F,]2 [F,B,]2 [F,B,]2 [F,B,]2 [F,B,]2 [F,B,]2 [F,B,]2 [F,B,]2 | [F,B,]2 z2 [C,F,]2 [F,B,]2 [E,A,]2 [=D,G,]2 [E,A,]2 [D,G,]2 | [B,,E,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 | [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 | [C,F,]2 [F,B,]2 [F,B,]2 [F,B,]2 [F,B,]2 [F,B,]2 [F,B,]2 [F,B,]2 | [F,B,]2 z2 [B,,E,]2 [=B,,=E,]2 [C,F,]2 [_E,A,]2 [C,F,]2 [_B,,E,]2 | [=B,,=E,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 | [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 [C,F,]2 | [C,F,]2 [F,B,]2 [F,B,]2 [F,B,]2 [F,B,]2 [F,B,]2 [F,B,]2 [F,B,]2 | [F,B,]2 z2 [C,F,]2 [F,B,]2 [E,A,]2 [=D,G,]2 [E,A,]2 [D,G,]2 | [B,,E,]2 |]
    </abc>
    • **Electric Bass (pick)**
    <abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Fmin
%%score (V1)
V:1 name="Electric Bass (pick)" snm="Electric Bass (pick)" clef=treble
%%MIDI program 34
%%MIDI channel 0
[V:1] E,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 | F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 | F,,, F,,, B,,,2 B,,,2 B,,,2 B,,,2 B,,,2 B,,,2 B,,,2 | B,,,2 z2 E,,,2 =E,,,2 F,,,2 A,,,2 F,,,2 _E,,,2 | =E,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 | F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 | F,,, F,,, B,,,2 B,,,2 B,,,2 B,,,2 B,,,2 B,,,2 B,,,2 | B,,,2 z2 F,,,2 B,,,2 A,,,2 G,,,2 A,,,2 G,,,2 | E,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 | F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 | F,,, F,,, B,,,2 B,,,2 B,,,2 B,,,2 B,,,2 B,,,2 B,,,2 | B,,,2 z2 E,,,2 =E,,,2 F,,,2 A,,,2 F,,,2 _E,,,2 | =E,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 | F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 F,,,2 | F,,, F,,, B,,,2 B,,,2 B,,,2 B,,,2 B,,,2 B,,,2 B,,,2 | B,,,2 z2 F,,,2 B,,,2 A,,,2 G,,,2 A,,,2 G,,,2 | E,,,2 |]
    </abc>
    • **Drums**
    <abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Fmin
%%score (V1 V2)
V:1 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:1] z2 ^C,4 ^A,,4 ^A,,4 ^A,,4 | ^A,,4 ^A,,4 ^A,,4 ^A,,4 | ^A,,4 ^A,,4 ^A,,4 ^A,,4 | ^C,2 z4 ^C,2 z8 ^C,4 | ^A,,4 ^A,,4 ^A,,4 | ^A,,4 ^A,,4 ^A,,4 ^A,,4 | ^A,,4 ^A,,4 ^A,,4 ^A,,4 | ^C,2 z4 ^C,2 z8 ^C,4 | ^A,,4 ^A,,4 ^A,,4 | ^A,,4 ^A,,4 ^A,,4 ^A,,4 | ^A,,4 ^A,,4 ^A,,4 ^A,,4 | ^C,2 z4 ^C,2 z8 ^C,4 | ^A,,4 ^A,,4 ^A,,4 | ^A,,4 ^A,,4 ^A,,4 ^A,,4 | ^A,,4 ^A,,4 ^A,,4 ^A,,4 | ^C,2 z4 ^C,2 |]
V:2 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:2] D,, D,, C,,2 z2 D,,2 z C,, z2 C,, B,,, D,, z3 C,,2 | z2 D,,2 z C,, z2 C,, B,,, D,, z C,, | z C,,2 z2 D,,2 z C,, z2 C,, B,,, D,, z C, | B,, C,, z C, C, B,, B,, C,, z3 C, C, B,, B,, | A,, A,, C,,2 z2 D,,2 z C,, z2 C,, B,,, D,, z3 C,,2 | z2 D,,2 z C,, z2 C,, B,,, D,, z C,, | z C,,2 z2 D,,2 z C,, z2 C,, B,,, D,, z C, | B,, C,, z C, C, B,, B,, C,, z3 C, C, B,, B,, | A,, A,, C,,2 z2 D,,2 z C,, z2 C,, B,,, D,, z3 C,,2 | z2 D,,2 z C,, z2 C,, B,,, D,, z C,, | z C,,2 z2 D,,2 z C,, z2 C,, B,,, D,, z C, | B,, C,, z C, C, B,, B,, C,, z3 C, C, B,, B,, | A,, A,, C,,2 z2 D,,2 z C,, z2 C,, B,,, D,, z3 C,,2 | z2 D,,2 z C,, z2 C,, B,,, D,, z C,, | z C,,2 z2 D,,2 z C,, z2 C,, B,,, D,, z C, | B,, C,, z C, C, B,, B,, C,, z3 C, C, B,, B,, | A,, |]
    </abc>
  - **Part C** (bars 29–37)
  <abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Fmin
%%score (V1 V2 V3 V4 V5 V6)
V:1 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:1] z2 ^C,4 ^A,,4 ^A,,4 ^A,,4 | ^A,,4 ^A,,4 ^A,,4 ^A,,4 | ^C,4 ^A,,4 ^A,,4 ^A,,4 | ^C,3 ^C,3 ^C,2 z8 ^C,4 | ^A,,4 ^A,,4 ^A,,4 | ^A,,4 ^A,,4 ^A,,4 ^A,,4 | ^C,4 ^A,,4 ^A,,4 ^A,,4 | ^C,3 ^C,3 ^C,2 z8 ^C,4 | |]
V:2 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:2] A,, A,, C,,2 z2 D,,2 z2 C,,2 C,,2 D,,2 | z2 C,,2 z2 D,,2 z2 C,,2 C,,2 D,,2 | z2 C,,2 z2 D,,2 z2 C,,2 C,,2 D,,2 | z2 C,,3 C,,3 C,,2 z2 C,, B,,, D,, z C,, | z C,,2 z2 D,,2 z2 C,,2 C,,2 D,,2 | z2 C,,2 z2 D,,2 z2 C,,2 C,,2 D,,2 | z2 C,,2 z2 D,,2 z2 C,,2 C,,2 D,,2 | z2 C,,3 C,,3 C,,2 z2 C,, z D,, z D,, | D,, C,,4 C,,4 C,,4 C,,4 | |]
V:3 name="Overdriven Guitar" snm="Overdriven Guitar" clef=treble
%%MIDI program 29
%%MIDI channel 0
[V:3] E2 d2 A2 F2 d2 A2 F2 d2 | A2 G2 d2 B2 G2 d2 B2 G2 | d2 c2 G2 E2 c2 G2 E2 c2 | G2 A3 G3 F6 A G | F E d2 A2 F2 d2 A2 F2 d2 | A2 G2 d2 B2 G2 d2 B2 G2 | d2 c2 G2 E2 c2 G2 E2 c2 | e2 d c B A B A G E F4 E2 | =E2 F32 | | |]
V:4 name="Overdriven Guitar" snm="Overdriven Guitar" clef=treble
%%MIDI program 29
%%MIDI channel 0
[V:4] z1 E2 d2 A2 F2 d2 A2 F2 d2 | A2 G2 d2 B2 G2 d2 B2 G2 | d2 c2 G2 E2 c2 G2 E2 c2 | G2 A3 G3 F6 A | G F E d2 A2 F2 d2 A2 F2 d2 | A2 G2 d2 B2 G2 d2 B2 G2 | d2 c2 G2 E2 c2 G2 E2 c2 | e2 d c B A B A G E F4 E2 | =E2 F32 | | |]
V:5 name="Distortion Guitar" snm="Distortion Guitar" clef=treble
%%MIDI program 30
%%MIDI channel 0
[V:5] [B,,E,]2 [A,,D,]2 [A,,D,]2 [A,,D,]2 [A,,D,]2 [A,,D,]2 [A,,D,]2 [A,,D,]2 | [A,,D,]2 [B,,E,]2 [B,,E,]2 [B,,E,]2 [B,,E,]2 [B,,E,]2 [B,,E,]2 [B,,E,]2 | [B,,E,]2 [G,,C,]2 [G,,C,]2 [G,,C,]2 [G,,C,]2 [G,,C,]2 [G,,C,]2 [G,,C,]2 | [=D,G,]2 [E,A,]3 [D,G,]3 [C,F,]10 | [A,,D,]2 [A,,D,]2 [A,,D,]2 [A,,D,]2 [A,,D,]2 [A,,D,]2 [A,,D,]2 | [A,,D,]2 [B,,E,]2 [B,,E,]2 [B,,E,]2 [B,,E,]2 [B,,E,]2 [B,,E,]2 [B,,E,]2 | [B,,E,]2 [G,,C,]2 [G,,C,]2 [G,,C,]2 [G,,C,]2 [G,,C,]2 [G,,C,]2 [G,,C,]2 | [=D,G,]2 [E,A,]3 [D,G,]3 [C,F,]6 [B,,E,]2 | [=B,,=E,]2 [C,F,]4 [_E,A,]2 [C,F,]2 [F,_B,]2 [E,A,]2 [C,F,]2 | [E,A,]12 |]
V:6 name="Electric Bass (pick)" snm="Electric Bass (pick)" clef=treble
%%MIDI program 34
%%MIDI channel 0
[V:6] E,,,2 D,,,2 D,,,2 D,,,2 D,,,2 D,,,2 D,,,2 D,,,2 | D,,,2 E,,,2 E,,,2 E,,,2 E,,,2 E,,,2 E,,,2 E,,,2 | E,,,2 C,,,2 C,,,2 C,,,2 C,,,2 C,,,2 C,,,2 C,,,2 | G,,,2 A,,,3 G,,,3 F,,,10 | D,,,2 D,,,2 D,,,2 D,,,2 D,,,2 D,,,2 D,,,2 | D,,,2 E,,,2 E,,,2 E,,,2 E,,,2 E,,,2 E,,,2 E,,,2 | E,,,2 C,,,2 C,,,2 C,,,2 C,,,2 C,,,2 C,,,2 C,,,2 | G,,,2 A,,,3 G,,,3 F,,,6 E,,,2 | =E,,,2 F,,,4 A,,,2 F,,,2 B,,,2 A,,,2 F,,,2 | A,,,12 |]
</abc>
    • **Overdriven Guitar**
    <abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Fmin
%%score (V1)
V:1 name="Overdriven Guitar" snm="Overdriven Guitar" clef=treble
%%MIDI program 29
%%MIDI channel 0
[V:1] E2 d2 A2 F2 d2 A2 F2 d2 | A2 G2 d2 B2 G2 d2 B2 G2 | d2 c2 G2 E2 c2 G2 E2 c2 | G2 A3 G3 F6 A G | F E d2 A2 F2 d2 A2 F2 d2 | A2 G2 d2 B2 G2 d2 B2 G2 | d2 c2 G2 E2 c2 G2 E2 c2 | e2 d c B A B A G E F4 E2 | =E2 F32 | | |]
    </abc>
    • **Overdriven Guitar**
    <abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Fmin
%%score (V1)
V:1 name="Overdriven Guitar" snm="Overdriven Guitar" clef=treble
%%MIDI program 29
%%MIDI channel 0
[V:1] z1 E2 d2 A2 F2 d2 A2 F2 d2 | A2 G2 d2 B2 G2 d2 B2 G2 | d2 c2 G2 E2 c2 G2 E2 c2 | G2 A3 G3 F6 A | G F E d2 A2 F2 d2 A2 F2 d2 | A2 G2 d2 B2 G2 d2 B2 G2 | d2 c2 G2 E2 c2 G2 E2 c2 | e2 d c B A B A G E F4 E2 | =E2 F32 | | |]
    </abc>
    • **Distortion Guitar**
    <abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Fmin
%%score (V1)
V:1 name="Distortion Guitar" snm="Distortion Guitar" clef=treble
%%MIDI program 30
%%MIDI channel 0
[V:1] [B,,E,]2 [A,,D,]2 [A,,D,]2 [A,,D,]2 [A,,D,]2 [A,,D,]2 [A,,D,]2 [A,,D,]2 | [A,,D,]2 [B,,E,]2 [B,,E,]2 [B,,E,]2 [B,,E,]2 [B,,E,]2 [B,,E,]2 [B,,E,]2 | [B,,E,]2 [G,,C,]2 [G,,C,]2 [G,,C,]2 [G,,C,]2 [G,,C,]2 [G,,C,]2 [G,,C,]2 | [=D,G,]2 [E,A,]3 [D,G,]3 [C,F,]10 | [A,,D,]2 [A,,D,]2 [A,,D,]2 [A,,D,]2 [A,,D,]2 [A,,D,]2 [A,,D,]2 | [A,,D,]2 [B,,E,]2 [B,,E,]2 [B,,E,]2 [B,,E,]2 [B,,E,]2 [B,,E,]2 [B,,E,]2 | [B,,E,]2 [G,,C,]2 [G,,C,]2 [G,,C,]2 [G,,C,]2 [G,,C,]2 [G,,C,]2 [G,,C,]2 | [=D,G,]2 [E,A,]3 [D,G,]3 [C,F,]6 [B,,E,]2 | [=B,,=E,]2 [C,F,]4 [_E,A,]2 [C,F,]2 [F,_B,]2 [E,A,]2 [C,F,]2 | [E,A,]12 |]
    </abc>
    • **Electric Bass (pick)**
    <abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Fmin
%%score (V1)
V:1 name="Electric Bass (pick)" snm="Electric Bass (pick)" clef=treble
%%MIDI program 34
%%MIDI channel 0
[V:1] E,,,2 D,,,2 D,,,2 D,,,2 D,,,2 D,,,2 D,,,2 D,,,2 | D,,,2 E,,,2 E,,,2 E,,,2 E,,,2 E,,,2 E,,,2 E,,,2 | E,,,2 C,,,2 C,,,2 C,,,2 C,,,2 C,,,2 C,,,2 C,,,2 | G,,,2 A,,,3 G,,,3 F,,,10 | D,,,2 D,,,2 D,,,2 D,,,2 D,,,2 D,,,2 D,,,2 | D,,,2 E,,,2 E,,,2 E,,,2 E,,,2 E,,,2 E,,,2 E,,,2 | E,,,2 C,,,2 C,,,2 C,,,2 C,,,2 C,,,2 C,,,2 C,,,2 | G,,,2 A,,,3 G,,,3 F,,,6 E,,,2 | =E,,,2 F,,,4 A,,,2 F,,,2 B,,,2 A,,,2 F,,,2 | A,,,12 |]
    </abc>
    • **Drums**
    <abc>
X:1
T:Multi-Track Snippet
M:4/4
L:1/16
K:Fmin
%%score (V1 V2)
V:1 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:1] z2 ^C,4 ^A,,4 ^A,,4 ^A,,4 | ^A,,4 ^A,,4 ^A,,4 ^A,,4 | ^C,4 ^A,,4 ^A,,4 ^A,,4 | ^C,3 ^C,3 ^C,2 z8 ^C,4 | ^A,,4 ^A,,4 ^A,,4 | ^A,,4 ^A,,4 ^A,,4 ^A,,4 | ^C,4 ^A,,4 ^A,,4 ^A,,4 | ^C,3 ^C,3 ^C,2 z8 ^C,4 | |]
V:2 name="Drums" snm="Drums" clef=treble perc=yes
%%MIDI channel 10
[V:2] A,, A,, C,,2 z2 D,,2 z2 C,,2 C,,2 D,,2 | z2 C,,2 z2 D,,2 z2 C,,2 C,,2 D,,2 | z2 C,,2 z2 D,,2 z2 C,,2 C,,2 D,,2 | z2 C,,3 C,,3 C,,2 z2 C,, B,,, D,, z C,, | z C,,2 z2 D,,2 z2 C,,2 C,,2 D,,2 | z2 C,,2 z2 D,,2 z2 C,,2 C,,2 D,,2 | z2 C,,2 z2 D,,2 z2 C,,2 C,,2 D,,2 | z2 C,,3 C,,3 C,,2 z2 C,, z D,, z D,, | D,, C,,4 C,,4 C,,4 C,,4 | |]
    </abc>

`;