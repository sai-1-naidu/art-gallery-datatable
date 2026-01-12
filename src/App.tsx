import { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import type { DataTableStateEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import { InputNumber } from "primereact/inputnumber";
import type { InputNumberValueChangeEvent } from "primereact/inputnumber";
import type { Artwork, ApiResponse } from "./types";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

export default function App() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  // Persistent selection (IDs only)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [deselectedIds, setDeselectedIds] = useState<Set<number>>(new Set());

  const [inputCount, setInputCount] = useState<number | null>(null);

  const op = useRef<OverlayPanel | null>(null);
  const ROWS_PER_PAGE = 12;

  // ---------------- FETCH DATA (SERVER-SIDE PAGINATION) ----------------
  const loadData = async (targetPage: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.artic.edu/api/v1/artworks?page=${targetPage}`
      );
      const result: ApiResponse = await res.json();
      setArtworks(result.data);
      setTotalRecords(result.pagination.total);
    } catch (err) {
      console.error("API error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData(page);
  }, [page]);

  const onPage = (event: DataTableStateEvent) => {
    setPage((event.page ?? 0) + 1);
  };

  // ---------------- DERIVE SELECTION FOR CURRENT PAGE ----------------
  const selectedRowsOnPage = artworks.filter(
    (row) => selectedIds.has(row.id) && !deselectedIds.has(row.id)
  );

  // ---------------- CHECKBOX SELECTION HANDLER ----------------
  const onSelectionChange = (e: { value: Artwork[] }) => {
    const newSelected = new Set(selectedIds);
    const newDeselected = new Set(deselectedIds);

    // Add selected rows
    e.value.forEach((row) => {
      newSelected.add(row.id);
      newDeselected.delete(row.id);
    });

    // Track deselection on current page
    artworks.forEach((row) => {
      const stillSelected = e.value.some((r) => r.id === row.id);
      if (!stillSelected && selectedIds.has(row.id)) {
        newDeselected.add(row.id);
      }
    });

    setSelectedIds(newSelected);
    setDeselectedIds(newDeselected);
  };

  // ---------------- CUSTOM ROW SELECTION (REPLACES CURRENT PAGE) ----------------
  const handleCustomSelection = () => {
    if (!inputCount || inputCount <= 0) return;

    const limit = Math.min(inputCount, artworks.length);
    const newSelected = new Set(selectedIds);
    const newDeselected = new Set(deselectedIds);

    // Clear previous selections from CURRENT PAGE
    artworks.forEach((row) => {
      newSelected.delete(row.id);
      newDeselected.delete(row.id);
    });

    // Apply new custom selection
    for (let i = 0; i < limit; i++) {
      newSelected.add(artworks[i].id);
    }

    setSelectedIds(newSelected);
    setDeselectedIds(newDeselected);
    setInputCount(null);
    op.current?.hide();
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Art Institute Gallery</h1>

      <div className="card shadow-2">
        <DataTable
          value={artworks}
          lazy
          paginator
          rows={ROWS_PER_PAGE}
          first={(page - 1) * ROWS_PER_PAGE}
          totalRecords={totalRecords}
          onPage={onPage}
          loading={loading}
          dataKey="id"
          selectionMode="multiple"
          selection={selectedRowsOnPage}
          onSelectionChange={onSelectionChange}
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />

          <Column
            field="title"
            header={
              <div className="flex align-items-center gap-2">
                <Button
                  icon="pi pi-chevron-down"
                  className="p-button-rounded p-button-text p-button-sm"
                  onClick={(e) => op.current?.toggle(e)}
                />
                <span>Title</span>
              </div>
            }
          />
          <Column field="place_of_origin" header="Place of Origin" />
          <Column field="artist_display" header="Artist" />
          <Column field="inscriptions" header="Inscriptions" />
          <Column field="date_start" header="Start" />
          <Column field="date_end" header="End" />
        </DataTable>
      </div>

      {/* -------- SELECT ROWS OVERLAY -------- */}
      <OverlayPanel ref={op}>
        <div className="flex flex-column gap-3 p-2" style={{ width: "220px" }}>
          <div className="flex justify-content-between align-items-center">
            <label className="font-bold">Select Rows (Current Page)</label>
            <Button
              icon="pi pi-times"
              className="p-button-rounded p-button-text p-button-sm"
              onClick={() => {
                setInputCount(null);
                op.current?.hide();
              }}
              aria-label="Close"
            />
          </div>

          <InputNumber
            value={inputCount}
            onValueChange={(e: InputNumberValueChangeEvent) =>
              setInputCount(e.value ?? null)
            }
            min={1}
            max={artworks.length}
            placeholder="Number of rows"
            className="w-full"
          />

          <Button
            label="Select Rows"
            icon="pi pi-check"
            onClick={handleCustomSelection}
            className="w-full"
          />
        </div>
      </OverlayPanel>
    </div>
  );
}
