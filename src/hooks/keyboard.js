import { act, useEffect } from "react";

const useKeyboard = ({
  selectedNote,
  selectedNotes,
  filteredLength,
  edit,
  print,
  searchRef,
  actions,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      const tag = e.target.tagName;

      if (["INPUT", "TEXTAREA"].includes(tag)) return;

      // =========================
      // 🔹 NAVIGATION
      // =========================
      if (key === "arrowdown") {
        e.preventDefault();
        actions.onDown?.();
        return;
      }

      if (key === "arrowup") {
        e.preventDefault();
        actions.onUp?.();
        return;
      }

      // =========================
      // 🔹 SPACE SELECT (ONLY IN EDIT MODE)
      // =========================
      if (!edit && e.code === "Space" && selectedNote) {
        e.preventDefault();
        actions.onToggleSelect?.(selectedNote.id);
        return;
      }

      // =========================
      // 🔹 GLOBAL CTRL SHORTCUTS
      // =========================
      if (e.ctrlKey) {
        switch (key) {
          case "n":
            e.preventDefault();
            actions.onAdd?.();
            return;

          case "l":
            e.preventDefault();
            actions.onLogout?.();
            return;

          case "s":
            e.preventDefault();
            searchRef?.current?.focus();
            return;

          case "e":
            e.preventDefault();
            actions.onEnterEdit?.();
            return;

          case "c":
            e.preventDefault();
            actions.onExitEdit?.();
            return;

          case "delete":
            if (selectedNote && edit) {
              e.preventDefault();
              actions.onDeleteSingle?.(selectedNote.id);
            }
            return;

          case "r":
            if (selectedNote && edit) {
              e.preventDefault();
              actions.onRecoverSingle?.(selectedNote.id);
            }
            return;

          default:
            break;
        }
      }

      if(e.shiftKey){
        switch (key){
          case "r" : 
            e.preventDefault()
            actions.ToRecycle()
            return;
          case "n" :
            e.preventDefault()
            actions.ToAllNotes()
            return;
          case "f" :
            e.preventDefault()
            actions.ToFavourite()
            return;

          default :
            break;
        }
      }

      // =========================
      // 🔹 EDIT MODE ACTIONS
      // =========================
      if (!edit) {
        if (key === "delete") {
          e.preventDefault();
          actions.onDeleteMultiple?.();
          return;
        }

        if (key === "r") {
          e.preventDefault();
          actions.onRecoverMultiple?.();
          return;
        }
        if(key === 'p'){
          e.preventDefault()
          actions.onPrint?.()
          return;
        }
      }

        if(key === 'f' && selectedNote){
          e.preventDefault()
          actions.onToggleFavourite?.()
          return;
        }

        if(print){
          if(key === 'enter'){
            e.preventDefault()
            actions.onConfirmPrint?.()
            return;
          }
          if(key === 'p'){
            e.preventDefault();
            actions.exportPdf?.()
            return
          }
          if(key === 'escape'){
            e.preventDefault()
            actions.ClosePrintShow?.()
            return;
          }
        }
        
      

      // =========================
      // 🔹 ESCAPE
      // =========================
      if (tag !== "INPUT" && tag !== "TEXTAREA") {
        if (key === "escape") {
          e.preventDefault();
          actions.onEscape?.();
          return;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedNote, selectedNotes, edit, filteredLength , print]);
};

export default useKeyboard;