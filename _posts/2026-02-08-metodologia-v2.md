---
layout: post
title:  "Részletes módszertan: A 2026-os választási modell"
author: Viktor
categories: [ ]
tags: [módszertan, "2026", elemzés]
image: assets/images/gears.webp
description: "Hogyan működik a 'Krónikás-v2' választási modell? Betekintés a hierarchikus Bayes-i becslés és a mandátumszámítás motorházteteje alá."
featured: false
hidden: false
---
A 2026-os országgyűlési választások közeledtével frissítettük előrejelző rendszerünket. Az új modell, a **"Krónikás-v2"**, a legmodernebb adatstatisztikai módszereket, konkrétan a [probabilisztikus programozást](https://en.wikipedia.org/wiki/Probabilistic_programming) és a hierarchikus Bayes-i modellezést alkalmazza a várható eredmények becslésére.

Az alábbiakban részletesen bemutatjuk a modell működését, az adatforrásokat és a felhasznált algoritmusokat.

---

## 1. Adatforrások

A modell elsődleges bemenete a publikus közvélemény-kutatások eredményei. Ezeket a [Vox Populi](https://kozvelemeny.org/) választási kalauz adatbázisából vesszük át, amely Tóka Gábor lelkiismeretes gyűjtőmunkájának eredménye. A modell jelenleg a 2024 novembere óta publikált kutatásokat dolgozza fel.

## 2. A Hierarchikus Bayes-i Modell (Polling Aggregation)

A közvélemény-kutatások aggregálása nem egyszerű átlagolást jelent. A különböző intézetek eltérő módszertannal, más időpontokban és különböző mintanagyságokkal dolgoznak. A modellünk mindezt figyelembe veszi.

### Főbb komponensek:

* **Latens népszerűség (Latent State):** A pártok valódi társadalmi támogatottságát egy időben változó, rejtett (latens) változóként kezeljük. Ennek mozgását egy **Gauss-féle véletlen séta (Gaussian Random Walk)** írja le. Ez azt jelenti, hogy a mai támogatottság a tegnapi támogatottságból indul ki, de egy véletlenszerű mértékben változhat.
* **Kutatói torzítások (House Effects):** Minden kutatóintézethez rendelünk egy torzítási paramétert. A modell megtanulja az adatokból, hogy egy adott intézet szisztematikusan felül- vagy alulmér-e bizonyos pártokat az átlaghoz (konszenzushoz) képest. Mivel nem tudjuk biztosan, kinek van igaza, a "House Effect"-eket egy közös, hierarchikus prior eloszlással fogjuk össze.
* **Megfigyelési modell (Observation Model):** A pártok támogatottságát egy **Dirichlet-eloszlás** segítségével modellezzük. Ez a többváltozós eloszlás garantálja, hogy a pártok támogatottságának összege mindig pontosan 100% legyen (ún. *simplex* kényszer), így elkerülhetjük a külön-külön modellezésből adódó inkonzisztenciákat.
* **Időbeli bizonytalanság:** A választás napjához közeledve a bizonytalanság csökken. A modell a hátralévő idő négyzetgyökével arányos extra szórást ad az előrejelzéshez, így a távoli jövőre vonatkozó becslések természetes módon bizonytalanabbak ("tölcsér" effektus).

A becsléshez **MCMC (Markov Chain Monte Carlo)** mintavételezést használunk a `PyMC` könyvtár segítségével, jellemzően 4 láncon, több ezer mintával a konvergencia érdekében.

## 3. Mandátumbecslés (Seat Projection)

A magyar választási rendszer sajátossága, hogy a mandátumok többsége (106 a 199-ből) egyéni választókerületekben (OEVK) dől el, ahol a "győztes mindent visz" elv érvényesül.

### A modell lépései:

1. **Bázis: 2022-es választások:** Mivel nincsenek rendszeres, körzetszintű felmérések, a 2022-es választási eredményeket használjuk kiindulópontként.
2. **Országos elmozdulás (Uniform Swing):** A 2022-es eredményeket módosítjuk az aktuális országos közvélemény-kutatási átlagok változásával.
   * *Példa:* Ha a Fidesz országosan 5 százalékpontot gyengült 2022 óta, akkor a modell minden egyes választókerületben 5 százalékponttal csökkenti a Fidesz várható eredményét.
   * Ez a módszer feltételezi, hogy a politikai hangulatváltozások területi eloszlása viszonylag egyenletes (bár a modell tartalmaz némi véletlenszerű szórást a körzetek között is a bizonytalanság növelése érdekében).
3. **Pártok megfeleltetése:**
   * **Fidesz-KDNP** → Fidesz-KDNP (változatlan)
   * **Egységben Magyarországért (2022)** → A 2022-es ellenzéki összefogás szavazatait a jelenlegi kutatások arányában osztjuk szét a **TISZA Párt** és a **DK** (illetve az MSZP-Momentum tömb) között.
   * **Mi Hazánk** → Mi Hazánk (változatlan)
   * **MKKP** → MKKP (változatlan)
4. **A rendszer logikája:**
   * **106 egyéni mandátum:** A körzetenkénti becsült eredmények alapján a legtöbb szavazatot szerző jelölt nyeri a mandátumot.
   * **Győzteskompenzáció:** A győztes pártnak a második helyezetthez képesti szavazatkülönbsége (többletszavazatok) hozzáadódik az országos listás eredményhez.
   * **Töredékszavazatok:** A vesztes jelöltekre leadott szavazatok szintén az országos listát gyarapítják.
   * **93 listás mandátum:** Az összesített listás szavazatok (országos listás voksok + töredékszavazatok + győzteskompenzáció) alapján **D'Hondt-módszerrel** osztjuk ki a mandátumokat, 5%-os bejutási küszöb alkalmazásával.
   * **Nemzetiségi mandátum:** A modell 1 mandátumot a német nemzetiségnek dedikál, amelyet a politikai elemzések alapján a kormánypárti blokkhoz sorolunk.
   * **Levélszavazatok:** A modell kb. 250.000 határon túli levélszavazattal számol, melyeknél a múltbeli tapasztalatok alapján >90%-os Fidesz-támogatottságot feltételez.

## 4. Szimuláció és Eredmények

A jövőbeli bizonytalanságot nem egyetlen becsléssel, hanem **40.000 Monte Carlo szimulációval** kezeljük. Mind a 40.000 esetben:

1. Generálunk egy lehetséges választási eredményt a statisztikai hibahatárokon belül.
2. Lefuttatjuk a teljes választási rendszert (körzetek, lista, kompenzáció).
3. Meghatározzuk a győztest és a mandátumarányokat.

Így kapjuk meg azokat a valószínűségeket – például a "Patthelyzet esélye" vagy a "TISZA többség esélye" –, amelyeket az elemzéseinkben közlünk. Ez a módszer sokkal árnyaltabb képet ad, mint az egyszerű százalékok, hiszen megmutatja a lehetséges forgatókönyvek teljes skáláját.

---

*A modell folyamatos fejlesztés alatt áll. A cél nem a jövő megjóslása, hanem a jelenlegi folyamatok és bizonytalanságok pontos, matematikai alapú feltérképezése.*
