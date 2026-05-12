p='app/profile/page.js'
t=open(p,encoding='utf-8').read()
replacements = [
    ('"\u00c3\u008emi asum responsabilitatea deplin\u0103 pentru alegerile \u0218i consecin\u021bele mele."', '"Îmi asum responsabilitatea deplina pentru alegerile ?i consecin?ele mele."'),
    ('"Voi folosi acest profil ca pe o oglind\u0103, nu ca pe o scuz\u0103."', '"Voi folosi acest profil ca pe o oglinda, nu ca pe o scuza."'),
    ('"M\u0103 angajez la auto-observare sincer\u0103, chiar \u0218i c\u00e2nd este inconfortabil."', '"Ma angajez la auto-observare sincera, chiar ?i când este inconfortabil."'),
]
for old, new in replacements:
    t = t.replace(old, new)
open(p, 'w', encoding='utf-8').write(t)
lines = open(p, encoding='utf-8').readlines()
for l in lines[37:43]: print(l.rstrip())
