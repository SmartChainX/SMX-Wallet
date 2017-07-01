!ifndef ZIPDLL_USED



!define ZIPDLL_USED



!macro ZIPDLL_EXTRACT SOURCE DESTINATION FILE



  !define "FILE_${FILE}"



  !ifndef FILE_<ALL>

    Push "${FILE}"

  !endif



  IfFileExists "${DESTINATION}" +2

    CreateDirectory "${DESTINATION}"



  Push "${DESTINATION}"



  IfFileExists "${SOURCE}" +2

    SetErrors



  Push "${SOURCE}"



  ;The strings that will be translated are (ready to copy,

  ;remove leading semicolons in your language block):



  !ifdef LANG_ENGLISH



    ;English is default language of ZipDLL, no need to push the untranslated strings



    ;StrCmp $LANGUAGE ${LANG_ENGLISH} 0 +1



      ;Push "  Error: %s"

      ;Push "Could not get file attributes."

      ;Push "Error: Could not get file attributes."

      ;Push "Could not extract %s"

      ;Push "  Error: Could not extract %s"



      ;!ifdef FILE_<ALL>

        ;Push "  Extract: %s"

        ;Push "  Extracting %d files and directories"

        ;Push "Extracting contents of %s to %s"

      ;!else

        ;Push "Specified file does not exist in archive."

        ;Push "Error: Specified file does not exist in archive."

        ;Push "Extracting the file %s from %s to %s"

      ;!endif



      ;Push "/TRANSLATE"



  !endif

