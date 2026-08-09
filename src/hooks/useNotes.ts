import { useCallback, useEffect, useState } from "react";
import { getAllNotes, saveNote as dbSave, deleteNote as dbDelete, type DayNote } from "@/lib/db";

export function useNotes() {
  const [notes, setNotes] = useState<Record<string, DayNote>>({});
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const rows = await getAllNotes();
    const map: Record<string, DayNote> = {};
    rows.forEach((r) => {
      map[r.dateKey] = r;
    });
    setNotes(map);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const save = useCallback(
    async (dateKey: string, text: string) => {
      await dbSave(dateKey, text);
      await refresh();
    },
    [refresh],
  );

  const remove = useCallback(
    async (dateKey: string) => {
      await dbDelete(dateKey);
      await refresh();
    },
    [refresh],
  );

  return { notes, loading, refresh, save, remove };
}
