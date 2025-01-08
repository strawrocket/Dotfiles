import re

medications = '''1. NEBIGARD SM - 90 Tab 
2. GLYCIPHAGE SR 1GM- 90 Tab 
3. MONTAIR FX- 90 Tab 
4. CARDACE 5- 90 Tab 
5. DiaprideM1 Forte- 90 Tab 
6. OMEE 20 MG- 60 TAb 
7. Turbovas ASP - 90 Tab 
8. Pentosec D - 60 Tab 
9. Meftal Forte - 5 Patta
10. Augmentin 625 - 5 patta 
11. Ceftum 500- 5 patta
12. Chymoral AP - 3 PAtta
13. Cyplox TZ - 1 patta
14. Avomine - 1 Patta
15. Stemtil - 1 Patta 
16. Zerodol TH 4mg- 2 Patta 
17. Cetrizine-2 patta
18. Livo Cetrizine - 2 Patta 
19. Combiflam - 5 patta 
20. Cronin - 3 patta
21. Dolo 650 - 2 Patta 
22. Livolin 1.25mg - 5 boxe to 5 each 
23. Budecort 1mg - 5 boxes of 5 each 
24. Anovate - 3 tube 
25. Grilinctus BM Tablet - 2 patta 
26. TUSQ-SF Losange - 3 patta 
27. T BACT. - 1 tube 
28. Betnaovate - 2 Tube 
29. Dolo Gel - 2 
30. Candid Mouth paste - 2 
31. Cremafin Plain - 3 
32. Claribid 500 - 3 patta 
33. D3 MUST 60 K - 15 Tablets 
34. Pilex Himalaya 1 Box of 100 Tablet 
35. Bifilac HP - 2 patta 
36. Cremagel L - 2 tube'''
# Split the string into lines
lines = medications.split('\n')

# Initialize lists to store the data
names = []
tabs = []
pattas = []

for i in lines:
    # Extract the name
    name = re.search(r'([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)', i)
    if name:
        names.append(name.group())
    else:
        names.append('Unknown')
    
    # Extract the number of tabs
    tab = re.search(r'(\d+)(?=\sTab)', i)
    if tab:
        tabs.append(tab.group())
    else:
        tabs.append(0)
    
    # Extract the number of pattas
    patta = re.search(r'(\d+)(?=\sPatta)', i)
    if patta:
        pattas.append(patta.group())
    else:
        pattas.append(0)
        
print(names)
print(tabs)
print(pattas)
```
Output