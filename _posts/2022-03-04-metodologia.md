---
layout: post
title:  "Módszertan és egyéb gyakran felmerülő kérdések"
author: Viktor
categories: [ ]
tags: [módszertan]
image: assets/images/gears.webp
description: "Így készülnek az előrejelzések"
featured: true
hidden: false
---

[Mitől más, mint mások?](#mitol-mas-mint-masok)

[Hogyan működnek a modellek?](#hogy-mukodik)

[Mennyire újszerű ez a megközelítés?](#ujszeru)

[Milyen adatokat használnak az előrejelző modellek?](#adatok)

[Mik a modell gyengeségei?](#gyengesegek)

[Ki készíti az oldalt?](#kikeszit)

[Milyen az oldal politikai elfogultsága?](#elfogult)


{: id="mitol-mas-mint-masok"}
#### Mitől más, mint mások?


A politikai előrejelzések készítésének nagy hagyománya van a fejlett demokráciákban. Magyarországon is egyre több előrejelzés próbálja megmondani, mire számthatunk a választásokon. 

Ennek egyik adat alapú megközelítése az úgynevezett **poll aggregator**oké, akik több közvéleménykutatás eredményeit összegyúrva próbálnak egy még erősebb előrejelzést adni. Ennek alapvető logikája könnyen belátható. Ha tíz darab 1.000 fős mintát összeadunk akkor egy 10.000 fős mintát kapunk, mely pontosabb eredményekkel szolgálhat a köz hangulatáról, mint az egyes előrejelzések önmagukban.

Bár önmagában ez egyszerűnek tűnik, de az egyes előrejelzések aggragálása korántsem olyan egyszerű folyamat. Az egyes előrejelzők eltérő módszertanokkal, szisztematikus és eseti torzításokkal dolgoznak. Különböző időpontokban, különböző csatornákon eltérő nagyságú mintákat vesznek fel.

Az általam alkalmazott módszertan ebben nyújt újat Magyarországon. Felhasználja a **mesterséges intelligencia** és a **számítástudományok** ezen belül is a **probabilisztikus programozás** legújabb eredményeit. Ez remélhetőleg nem csak pontosabb eredményt tud biztosítani, mint a hagyományos (például különböző súlyozott mozgóátlagok) módszertannal készült előrejelzések, de lehetővé teszi a jelenlegi folyamatok jövőbe (választások idejére) történő kiterjesztését és sokoldalúbban tudja bemutatni a lehetséges kimeneteleket (pl. nem csak a legvalószínűbb eredményt mutatja meg, hanem minden egyes várható eredmény valószínűségi eloszlását is). 

{: id="hogy-mukodik"}
#### Hogyan működnek a modellek?

A modellek nem a közvéleménykutatások valamilyen matematikai összegzésére épülnek, mint a legtöbb aggregátor előrejelzés. Probabilisztikus programozás segítségével elkészítem a valóság egy modelljét. Ez gráffal írható le, mely figyelembe veszi, hogy létezik minden pártnak egy tényleges társadalmi támogatottsága. Ez csak a választások napján derül ki, addig, csak a közvéleménykutatók adait látjuk, melyek különböző időpontokban mutatnak eltérő értkeket. Ezek az eltérések származhatnak a mérés idejéből, a mintavétel módjából, nagyságából és a mérést végző szisztematikus torzításából. Ezen tényezők mind leírhatóak a gráfban egy-egy valószínűségi eloszlással.

Mesterséges intelligencia segítségével kiszámolhatóak ezen valószínűségi eloszlások paraméterei. A módszertan nem csak azt teszi lehetővé, hogy a gráfot visszafejtve következtethesünk a pártok népszerűségére hanem, hogy egy valószínűségi eloszlás segítségével számszerűsíthetsük a jelenlegi és a választásokig tartó időben felmerülő bizonytalanságot.

Így nem csak a legvalószínűbb értéket tudjuk megmondani, de több ezer lehetséges szimuációt készíthetünk, mely megmutatja a lehetséges választási kimeneteleket. 

A népszerűségi adatokat felhasználva egy második modell is felhasználásra kerül, mely a népszerűségi adatokat transzformálja parlamenti mandátumokká a korábbi választási eredmények területi eloszlását figyelembe véve.

{: id="ujszeru"}
#### Mennyire újszerű ez a megközelítés?

Hasonló megoldással a magyar előrejelzések között még nem találkoztam (ez lehet, hogy ez csak az én figyelmetlenségemet mutatja). A legtöbb előrejelzés lényegesen egyszerűbb módszertannal dolgozik. Az egyszerűség nem szükségszerűen jelent rosszat, ezek is sokszor pontos eredményekhez vezethetnek.

A megoldás előképe az amerikai [fivethirtyeight](https://fivethirtyeight.com/) oldal, amely öndefiníciója szerint hasonló megoldásokat alkalmaz az amerikai elnökválasztások előrejelzésére.

{: id="adatok"}
#### Milyen adatokat használnak az előrejelző modellek?

Az előrejelző modellek elsősorban a különböző közvéleménykutatók méréseiből táplálkoznak. Ezek forrása <a href=http://kozvelemeny.wordpress.com>**Tóka Gábor, 2019-. "Vox Populi választási kalauza" http://kozvelemeny.wordpress.com**</a>. A kiváló oldalt nem csak az adatok, de az érdekes elemzések miatt is érdemes felkeresni.

A mandátumszámító modell ezen felül felhasználja a korábbi választások részletes eredményeit is.

{: id="gyengesegek"}
#### Mik a modell gyengeségei?

A modell gyengeségei leginkább az elégtelen adatokból erednek. Kis pártok esetében a tizedesjegyek is nagy különbséget jelenthetnek (pl 2% és 2.5% között 25% a különbség), azonban jellemzően az egyes közvéleménykutatók csak kerekített értékeket adnak meg. Ez nagyobb támogatottságú pártok esetén kevésbé problémás, azonban a kissebb pártok esetében fontos lehet, különösen, hogy elég közel mozognak a parlamenti bejutási köszöbhöz.

A magyar közvéleménykutatások száma például az amerikaihoz képest sokkal limitáltabb és a közölt adatok is sokkal kevésbé részletesek (nincsenek például megyei vagy választóköri adatok).

A kevés számú közvéleménykutató közül pedig több is vélhetően a köz véleményének megismerésén túl más poltikai ágendát is képvisel, ami csökkenti az adatok megbízhatóságát. Ezt a modellek práblják figyelembe venni és ellensúlyozni.

{: id="kikeszit"}
#### Ki készíti az oldalt?

[Tisza Viktornak](https://www.linkedin.com/in/viktor-tisza-5309b28/) hívnak. Az oldalt és az abban szereplő elemzéseket jelenleg egyedül készítem. Data scientist vagy csúnya magyar kifejezéssel élve adattudós vagyok. Politikával csak műkedvelőként foglalkozom, de a gazdasági élet különböző szektoraiban közel 15 éve foglalkozom adatok elemzésével, értelmezésével és mesterséges intelligencia felhasználásával azokból történő előrejelzésekkel.

{: id="elfogult"}
#### Milyen az oldal politikai elfogultsága?

Mint az emberek nagy részének nekem is van politikai preferenciám, azonban ez az általam közölt eredményeket nem befolyásolja. A fenti előrejelzásek elkészítése során a legjobb szakmai tudásom szerint járok el. Csupán a mindenki számára elérhető adatokból indulok ki és azt egy vélemény nélküli programmal dolgozom fel. A legfőbb célom, hogy az általam közölt eredmények minél jobban leírják a valóságot és előrejelezzék a választók viselkedését. Ettől eltérő célok képviseletének már csak azért sem lenne értelme, mert nem hiszem, hogy az itt közölt eredmények szignifikánsan befolyásolni tudnák a közvéleményt.

<br>