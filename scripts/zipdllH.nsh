!endif



  !ifdef LANG_HUNGARIAN



    StrCmp $LANGUAGE ${LANG_HUNGARIAN} 0 +10



      Push "  Hiba: %s"

      Push "Nem olvasható a fájl attribútumai."

      Push "Hiba: Nem olvasható a fájl attribútumai."

      Push "Nem sikerült kicsomagolni a(z) %s"

      Push "  Hiba: Nem sikerült kicsomagolni a(z) %s"



      !ifdef FILE_<ALL>

        Push "  Kicsomagolás: %s"

        Push "  %d fájl és mappa kicsomagolása"

        Push "%s tartalom kicsomagolása a %s helyre"

      !else

        Push "A megadott fájl nem található az arhívumban."

        Push "Hiba: A megadott fájl nem található az arhívumban."

        Push "%s fájl kcsomagolása a(z) %s fájlból a %s helyre"

      !endif



      Push "/TRANSLATE"



  !endif
