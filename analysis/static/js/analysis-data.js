// static/js/analysis-data.js

const analysisContent = `
<abc>
X:1
T:Music21 Fragment
C:Music21
%%score ( 1 2 ) ( 3 4 ) 5 6 7
L:1/8
M:4/4
I:linebreak $
K:none
V:1 treble 
V:2 treble 
L:1/4
V:3 treble 
L:1/16
V:4 treble 
V:5 bass 
V:6 bass 
L:1/16
V:7 treble 
L:1/16
V:1
 z8 | z2 _e3/2 z/ _B=B z c- | c15/2 z/ | z2 _e3/2 z/ _B=B z c | z c _eg f_e d_B | %5
 z ^g3/2 z/ =g f_e z d | _e z2 c2- c/ z/ d_e | fd3/2 z/ _e3/2 z/ d3/2 z/ _B | G15/2 z/ | %9
 z2 _e3/2 z/ _B=B z c- | c15/2 z/ | z2 _e3/2 z/ _B=B z c | z c _ec f^f =fc | %13
 z ^g3/2 z/ =g fc'3/2 z/ _b | ^g z2 f2- f/ z/ d_e | fd3/2 z/ _e3/2 z/ f3/2 z/ g | g15/2 z/ | %17
 z2 f3/2 z/ ^gc'3/2 z/ _e' | d'_b g d2- d/ z/ d_e | d c7/2 z/ c d_e | f/_e/ d4- d2- d/ z/ | %21
 z2 cd _ec/ z [_ef]/_e- | ed cF G_B Gd | f2- f/ z/ _e3/2 z/ f _ef | g15/2 z/ | z2 c2- c/ z/ d _ec | %26
 z ^G _eg fd _ec | z ^g f^g _e'd' c'^g | _e'd' [c'_e'][^gf'] [fg'][df'] [_B_e'][Gd'] | %29
 z c7/2 z/ d _eg | z f2- f/ z/ _ed f z | G3/2 z/ _Bd3/2 z/ f2- f/ z/ | g15/2 z/ | %33
 z2 _e3/2 z/ _B=B z c- | c15/2 z/ | z2 _e3/2 z/ _B=B z c | z c _eg f_e d_B | %37
 z ^g3/2 z/ =g f_e z d | _e z2 c2- c/ z/ d_e | fd3/2 z/ _e3/2 z/ d3/2 z/ _B | G15/2 z/ | %41
 z2 _e3/2 z/ _B=B z c- | c15/2 z/ | z2 _e3/2 z/ _B=B z c | z c _ec f^f =fc | %45
 z ^g3/2 z/ =g fc'3/2 z/ _b | ^g z2 f2- f/ z/ d_e | fd3/2 z/ _e3/2 z/ f3/2 z/ g | g15/2 z/ | %49
 z2 f3/2 z/ ^gc'3/2 z/ _e' | d'_b g d2- d/ z/ d_e | d c7/2 z/ c d_e | f/_e/ d4- d2- d/ z/ | %53
 z2 cd _ec/ z [_ef]/_e- | ed cF G_B Gd | f2- f/ z/ _e3/2 z/ f _ef | g15/2 z/ | z2 c2- c/ z/ d _ec | %58
 z ^G _eg fd _ec | z ^g f^g _e'd' c'^g | _e'd' [c'_e'][^gf'] [fg'][df'] [_B_e'][Gd'] | %61
 z c7/2 z/ d _eg | z f2- f/ z/ _ed f z | G3/2 z/ _Bd3/2 z/ f2- f/ z/ | g15/2 z/ | z15/2 |] %66
V:2
 z4 | z4 | z4 | z4 | z4 | z4 | z4 | z4 | z4 | z4 | z4 | z4 | z4 | z4 | z4 | z4 | z4 | z4 | z4 | %19
 z4 | z4 | (3z4 f z | z4 | z4 | z4 | z4 | z4 | z4 | z4 | z4 | z4 | z4 | z4 | z4 | z4 | z4 | z4 | %37
 z4 | z4 | z4 | z4 | z4 | z4 | z4 | z4 | z4 | z4 | z4 | z4 | z4 | z4 | z4 | z4 | (3z4 f z | z4 | %55
 z4 | z4 | z4 | z4 | z4 | z4 | z4 | z4 | z4 | z4 | z15/4 |] %66
V:3
 z16 | z4 z _e3 z _B2=B2 z2 c- | c16 | z4 z _e3 z _B2=B2 z2 c- | c z2 c2 _e2g2 f2_e2 d2_B- | %5
 B z2 ^g3 z =g2 f2_e2 z2 d- | d_e2 z4 c4- c z d2_e- | ef2d3 z _e3 z d3 z _B- | B G15 | %9
 z4 z _e3 z _B2=B2 z2 c- | c16 | z4 z _e3 z _B2=B2 z2 c- | c z2 c2 _e2c2 f2^f2 =f2c- | %13
 c z2 ^g3 z =g2 f2c'3 z _b- | b^g2 z4 f4- f z d2_e- | ef2d3 z _e3 z f3 z g- | g g15 | %17
 z4 z f3 z ^g2c'3 z _e'- | e'd'2_b2 g2 d4- d z d2_e- | ed2 c7 z c2 d2_e- | ef_e d8- d4- d | %21
 z4 z c2d2 _e2c z2 [_ef]_e- | e3d2 c2F2 G2_B2 G2d- | d f4- f z _e3 z f2 _e2f- | f g15 | %25
 z4 z c4- c z d2 _e2c- | c z2 ^G2 _e2g2 f2d2 _e2c- | c z2 ^g2 f2^g2 _e'2d'2 c'2^g- | %28
 g_e'2d'2 [c'_e']2[^gf']2 [fg']2[df']2 [_B_e']2[Gd']- | [Gd'] z2 c7 z d2 _e2g- | %30
 g z2 f4- f z _e2d2 f2 z | z G3 z _B2d3 z f4- f | z g15 | z4 z _e3 z _B2=B2 z2 c- | c16 | %35
 z4 z _e3 z _B2=B2 z2 c- | c z2 c2 _e2g2 f2_e2 d2_B- | B z2 ^g3 z =g2 f2_e2 z2 d- | %38
 d_e2 z4 c4- c z d2_e- | ef2d3 z _e3 z d3 z _B- | B G15 | z4 z _e3 z _B2=B2 z2 c- | c16 | %43
 z4 z _e3 z _B2=B2 z2 c- | c z2 c2 _e2c2 f2^f2 =f2c- | c z2 ^g3 z =g2 f2c'3 z _b- | %46
 b^g2 z4 f4- f z d2_e- | ef2d3 z _e3 z f3 z g- | g g15 | z4 z f3 z ^g2c'3 z _e'- | %50
 e'd'2_b2 g2 d4- d z d2_e- | ed2 c7 z c2 d2_e- | ef_e d8- d4- d | z4 z c2d2 _e2c z2 [_ef]_e- | %54
 e3d2 c2F2 G2_B2 G2d- | d f4- f z _e3 z f2 _e2f- | f g15 | z4 z c4- c z d2 _e2c- | %58
 c z2 ^G2 _e2g2 f2d2 _e2c- | c z2 ^g2 f2^g2 _e'2d'2 c'2^g- | %60
 g_e'2d'2 [c'_e']2[^gf']2 [fg']2[df']2 [_B_e']2[Gd']- | [Gd'] z2 c7 z d2 _e2g- | %62
 g z2 f4- f z _e2d2 f2 z | z G3 z _B2d3 z f4- f | z g15 | z15 |] %66
V:4
 z8 | z8 | z8 | z8 | z8 | z8 | z8 | z8 | z8 | z8 | z8 | z8 | z8 | z8 | z8 | z8 | z8 | z8 | z8 | %19
 z8 | z8 | z4 z3/2 f z3/2 | z8 | z8 | z8 | z8 | z8 | z8 | z8 | z8 | z8 | z8 | z8 | z8 | z8 | z8 | %36
 z8 | z8 | z8 | z8 | z8 | z8 | z8 | z8 | z8 | z8 | z8 | z8 | z8 | z8 | z8 | z8 | z8 | %53
 z4 z3/2 f z3/2 | z8 | z8 | z8 | z8 | z8 | z8 | z8 | z8 | z8 | z8 | z8 | z15/2 |] %66
V:5
 C,,>C, z G,,/_E,,/ ^F,,_B,,, B,,,=B,,, | C,,C,, C,,C,, C,,C,, C,,C,, | %2
 C,,C,, C,,C,, C,,G,, C,,C,, | C,,C,, C,,C,, C,,C,, C,,C,, | C,,C,, C,,C,, C,,G,, C,,C,, | %5
 ^G,,,G,,, G,,,G,,, G,,,G,,, G,,,G,,, | ^G,,,G,,, G,,,^G,, ^G,,,G,,, ^G,,^G,,, | %7
 D,,D,, D,,D,, D,,D,, D,,D,, | _B,,,B,,, B,,,B,,, B,,,B,,, B,,,B,,, | C,,C,, C,,C,, C,,C,, C,,C,, | %10
 C,,C,, C,,C,, C,,G,, C,,C,, | C,,C,, C,,C,, C,,C,, C,,C,, | C,,C,, C,,C,, C,,G,, C,,C,, | %13
 ^G,,,G,,, G,,,G,,, G,,,G,,, G,,,G,,, | ^G,,,G,,, G,,,^G,, ^G,,,G,,, ^G,,^G,,, | %15
 D,,D,, D,,D,, D,,D,, D,,D,, | _B,,,B,,, B,,,B,,, B,,,B,,, B,,,B,,, | %17
 ^G,,,G,,, G,,,G,,, G,,,G,,, G,,,G,,, | =G,,,G,,, G,,,G,,, G,,,G,,, G,,,G,,, | %19
 F,,,F,,, F,,,F,,, F,,,F,,, F,,,F,,, | G,,,G,,, G,,,G,,, G,,,G,,, G,,,G,,, | %21
 ^G,,,G,,, G,,,G,,, G,,,G,,, G,,,G,,, | C,,C,, C,,C,, C,,C,, C,,C,, | F,,F,, F,,F,, F,,F,, F,,F,, | %24
 G,,3/2 z/ D,,G,,3/2 z/ D,, G,,D,, | C,,C,, C,,C,, C,,D,, _E,,C,, | F,,D,, _E,,G,, F,,D,, _E,,C,, | %27
 F,,,F,,, F,,,F,,, F,,,F,,, F,,,F,,, | D,,C,, _B,,,G,,, F,,_E,, D,,G,,, | %29
 C,,C,, C,,C,, C,,D,, _E,,C,, | F,,C,, _E,,F,, _E,,C,, G,,C,, | F,,F,, F,,F,, F,,C,, _E,,C,, | %32
 F,,_E,, D,, C,,4- C,,/ z/ | C,,C,, C,,C,, C,,C,, C,,C,, | C,,C,, C,,C,, C,,G,, C,,C,, | %35
 C,,C,, C,,C,, C,,C,, C,,C,, | C,,C,, C,,C,, C,,G,, C,,C,, | ^G,,,G,,, G,,,G,,, G,,,G,,, G,,,G,,, | %38
 ^G,,,G,,, G,,,^G,, ^G,,,G,,, ^G,,^G,,, | D,,D,, D,,D,, D,,D,, D,,D,, | %40
 _B,,,B,,, B,,,B,,, B,,,B,,, B,,,B,,, | C,,C,, C,,C,, C,,C,, C,,C,, | C,,C,, C,,C,, C,,G,, C,,C,, | %43
 C,,C,, C,,C,, C,,C,, C,,C,, | C,,C,, C,,C,, C,,G,, C,,C,, | ^G,,,G,,, G,,,G,,, G,,,G,,, G,,,G,,, | %46
 ^G,,,G,,, G,,,^G,, ^G,,,G,,, ^G,,^G,,, | D,,D,, D,,D,, D,,D,, D,,D,, | %48
 _B,,,B,,, B,,,B,,, B,,,B,,, B,,,B,,, | ^G,,,G,,, G,,,G,,, G,,,G,,, G,,,G,,, | %50
 =G,,,G,,, G,,,G,,, G,,,G,,, G,,,G,,, | F,,,F,,, F,,,F,,, F,,,F,,, F,,,F,,, | %52
 G,,,G,,, G,,,G,,, G,,,G,,, G,,,G,,, | ^G,,,G,,, G,,,G,,, G,,,G,,, G,,,G,,, | %54
 C,,C,, C,,C,, C,,C,, C,,C,, | F,,F,, F,,F,, F,,F,, F,,F,, | G,,3/2 z/ D,,G,,3/2 z/ D,, G,,D,, | %57
 C,,C,, C,,C,, C,,D,, _E,,C,, | F,,D,, _E,,G,, F,,D,, _E,,C,, | %59
 F,,,F,,, F,,,F,,, F,,,F,,, F,,,F,,, | D,,C,, _B,,,G,,, F,,_E,, D,,G,,, | %61
 C,,C,, C,,C,, C,,D,, _E,,C,, | F,,C,, _E,,F,, _E,,C,, G,,C,, | F,,F,, F,,F,, F,,C,, _E,,C,, | %64
 F,,_E,, D,, C,,4- C,,/ z/ | x15/2 |] %66
V:6
 z8 z2 [G,,D,]3 z [G,,D,]2 | [G,,C,]3 z [_E,G,]3 z [G,,C,]2[_E,G,]3 z [G,,C,]2 | %2
 [_E,G,]3 z [G,,C,]2[_E,G,]3 z [G,,C,]2 [_E,G,]3 z | %3
 [G,,C,]3 z [_E,G,]3 z [G,,C,]2[_E,G,]3 z [G,,C,]2 | %4
 [_E,G,]3 z [G,,C,]2[_E,G,]3 z [G,,C,]2 [_E,G,]3 z | %5
 [^G,,C,]3 z [C,_E,]3 z [^G,,C,]2[C,_E,]3 z [^G,,C,]2 | %6
 [C,_E,]3 z [^G,,C,]2[C,_E,]3 z [^G,,C,]2 [C,_E,]3 z | %7
 [_B,,D,]3 z [D,=G,]3 z [_B,,D,]2[D,G,]3 z [_B,,D,]2 | %8
 [D,G,]3 z [_B,,D,]2[D,G,]3 z [_B,,D,]2 [D,G,]3 z | %9
 [G,,C,]3 z [_E,G,]3 z [G,,C,]2[_E,G,]3 z [G,,C,]2 | %10
 [_E,G,]3 z [G,,C,]2[_E,G,]3 z [G,,C,]2 [_E,G,]3 z | %11
 [G,,C,]3 z [_E,G,]3 z [G,,C,]2[_E,G,]3 z [G,,C,]2 | %12
 [_E,G,]3 z [G,,C,]2[_E,G,]3 z [G,,C,]2 [_E,G,]3 z | %13
 [^G,,C,]3 z [C,_E,]3 z [^G,,C,]2[C,_E,]3 z [^G,,C,]2 | %14
 [C,_E,]3 z [^G,,C,]2[C,_E,]3 z [^G,,C,]2 [C,_E,]3 z | %15
 [_B,,D,]3 z [D,=G,]3 z [_B,,D,]2[D,G,]3 z [_B,,D,]2 | %16
 [D,G,]3 z [_B,,D,]2[D,G,]3 z [_B,,D,]2 [D,G,]3 z | [_E,^G,]15 z | [D,=G,]15 z | [C,F,]15 z | %20
 [D,G,]15 z | [F,^G,]15 z | [=G,C]15 z | [_B,_E]15 z | [G,D]15 z | %25
 [G,,C,]3 z [_E,G,]3 z [G,,C,]2[_E,G,]3 z [G,,C,]2 | %26
 [_E,^G,]3 z [^G,,C,]2[_E,^G,]3 z [^G,,C,]2 [_E,^G,]3 z | %27
 [^G,,C,]3 z [C,F,]3 z [^G,,C,]2[C,F,]3 z [^G,,C,]2 | %28
 [C,_E,]3 z [=G,,C,]2[B,,D,]3 z [G,,C,]2 [B,,D,]3 z | %29
 [G,,C,]3 z [_E,G,]3 z [G,,C,]2[_E,G,]3 z [G,,C,]2 | %30
 [_E,^G,]3 z [^G,,C,]2[_E,^G,]3 z [^G,,C,]2 [_E,^G,]3 z | %31
 [D,F,]2[D,F,]2 [D,F,]2[D,F,]2 [D,F,]2[_E,=G,]2 [F,^G,]2[_E,=G,]2 | %32
 [D,F,]2[C,_E,]2 [_B,,D,]2 [G,,C,]8- [G,,C,] z | %33
 [G,,C,]3 z [_E,G,]3 z [G,,C,]2[_E,G,]3 z [G,,C,]2 | %34
 [_E,G,]3 z [G,,C,]2[_E,G,]3 z [G,,C,]2 [_E,G,]3 z | %35
 [G,,C,]3 z [_E,G,]3 z [G,,C,]2[_E,G,]3 z [G,,C,]2 | %36
 [_E,G,]3 z [G,,C,]2[_E,G,]3 z [G,,C,]2 [_E,G,]3 z | %37
 [^G,,C,]3 z [C,_E,]3 z [^G,,C,]2[C,_E,]3 z [^G,,C,]2 | %38
 [C,_E,]3 z [^G,,C,]2[C,_E,]3 z [^G,,C,]2 [C,_E,]3 z | %39
 [_B,,D,]3 z [D,=G,]3 z [_B,,D,]2[D,G,]3 z [_B,,D,]2 | %40
 [D,G,]3 z [_B,,D,]2[D,G,]3 z [_B,,D,]2 [D,G,]3 z | %41
 [G,,C,]3 z [_E,G,]3 z [G,,C,]2[_E,G,]3 z [G,,C,]2 | %42
 [_E,G,]3 z [G,,C,]2[_E,G,]3 z [G,,C,]2 [_E,G,]3 z | %43
 [G,,C,]3 z [_E,G,]3 z [G,,C,]2[_E,G,]3 z [G,,C,]2 | %44
 [_E,G,]3 z [G,,C,]2[_E,G,]3 z [G,,C,]2 [_E,G,]3 z | %45
 [^G,,C,]3 z [C,_E,]3 z [^G,,C,]2[C,_E,]3 z [^G,,C,]2 | %46
 [C,_E,]3 z [^G,,C,]2[C,_E,]3 z [^G,,C,]2 [C,_E,]3 z | %47
 [_B,,D,]3 z [D,=G,]3 z [_B,,D,]2[D,G,]3 z [_B,,D,]2 | %48
 [D,G,]3 z [_B,,D,]2[D,G,]3 z [_B,,D,]2 [D,G,]3 z | [_E,^G,]15 z | [D,=G,]15 z | [C,F,]15 z | %52
 [D,G,]15 z | [F,^G,]15 z | [=G,C]15 z | [_B,_E]15 z | [G,D]15 z | %57
 [G,,C,]3 z [_E,G,]3 z [G,,C,]2[_E,G,]3 z [G,,C,]2 | %58
 [_E,^G,]3 z [^G,,C,]2[_E,^G,]3 z [^G,,C,]2 [_E,^G,]3 z | %59
 [^G,,C,]3 z [C,F,]3 z [^G,,C,]2[C,F,]3 z [^G,,C,]2 | %60
 [C,_E,]3 z [=G,,C,]2[B,,D,]3 z [G,,C,]2 [B,,D,]3 z | %61
 [G,,C,]3 z [_E,G,]3 z [G,,C,]2[_E,G,]3 z [G,,C,]2 | %62
 [_E,^G,]3 z [^G,,C,]2[_E,^G,]3 z [^G,,C,]2 [_E,^G,]3 z | %63
 [D,F,]2[D,F,]2 [D,F,]2[D,F,]2 [D,F,]2[_E,=G,]2 [F,^G,]2[_E,=G,]2 | %64
 [D,F,]2[C,_E,]2 [_B,,D,]2 [G,,C,]8- [G,,C,] z | x15 |] %66
V:7
 z16 | [c_eg]16- | x15 [ceg]- | [ceg]14 z [c_eg]- | [ceg]15- x | x14 [ceg]2- | %6
 [ceg]8- [ceg]4- [ceg] z [c_e^g]2- | [ceg]14- x2 | x8 x4 x [ceg]3- | [ceg]12 z [_Bdg]3- | %10
 [Bdg]8- [Bdg]4- [Bdg]- x3 | x12 [Bdg]4- | [Bdg]8- [Bdg]3 z [c_eg]4- | [ceg]12- x4 | %14
 x8 x3 [ceg]4- [ceg]- | [ceg]8- [ceg]2 z [c_eg]4- [ceg]- | [ceg]8- [ceg]3- x4 x | x8 x2 [ceg]6- | %18
 [ceg]8- [ceg] z [c_e^g]6- | [ceg]8- [ceg]2- x6 | x8 x [ceg]7- | [ceg]8 z [_Bdg]7- | %22
 [Bdg]8- [Bdg]- x7 | x8 [Bdg]8- | [Bdg]7 z [c_e^g]8- | [ceg]7 z [_Bdg]8- | [Bdg]7 z [^Gcf]8- | %27
 [Gcf]7 z [_Bdg]8- | [Bdg]7 z [cf^g]8- | [cfg]7 z [c_eg]8- | [ceg]7 z [_B_ef]8- | %31
 [Bef]7 z [Bdg]8- | [Bdg]7 z [c_eg]8- | [ceg]7 z [c_e^g]8- | [ceg]7 z [cdf]8- | %35
 [cdf]7 z [c_e^g]4- [ceg] z [Bd=g]2- | [Bdg]7 z [c_eg]8- | [ceg]7 z [c_e^g]8- | [ceg]7 z [_Bdf]8- | %39
 [Bdf]7 z [_Bdf]4- [Bdf] z [c_eg]2- | [ceg]7 z [c_eg]8- | [ceg]8- x8 | x7 [ceg]8- [ceg]- | %43
 [ceg]6 z [c_eg]8- [ceg]- | [ceg]7- x8 x | x6 [ceg]8- [ceg]2- | [ceg]4- [ceg] z [c_e^g]8- [ceg]2- | %47
 [ceg]6- x8 x2 | x4 x [ceg]8- [ceg]3- | [ceg]4 z [_Bdg]8- [Bdg]3- | [Bdg]4- [Bdg]- x8 x3 | %51
 x4 [Bdg]12- | [Bdg]3 z [c_eg]12- | [ceg]4- x12 | x3 [ceg]8- [ceg]4- [ceg]- | %55
 [ceg]2 z [c_eg]8- [ceg]4- [ceg]- | [ceg]3- x8 x4 x | x2 [ceg]14- | [ceg] z [c_e^g]14- | %59
 [ceg]2- x14 | x [ceg]15 | z [_Bdg]15- | [Bdg]- x15 | [Bdg]15 z | [c_e^g]15 z | [_Bdg]15 |] %66

</abc>

The first track I'm looking at for analysis is going to be the Introduction Stage to Megaman X. 
Figured might as well start at the beginning. 

Okay so I definintely don't recommend listening to it on the site in this format. I'm just making sure to include the ABC format here (though I don't think what is above is correct) so this data can possibly be used for AI training / inference. 

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