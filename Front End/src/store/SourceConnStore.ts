import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface SourceConnectionStore {
  sortField: string;
  sortOrder: string;
  searchTerm: string;
  searchField: string;
  page: number;
  pageSize: number;
  reset: () => void;
  setSortField: (field: string) => void;
  setSortOrder: (order: string) => void;
  setSearchTerm: (term: string) => void;
  setSearchField: (field: string) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
}

const initialState = {
  sortField: "updatedAt",
  sortOrder: "desc",
  searchTerm: "",
  searchField: "",
  page: 0,
  pageSize: 5,
};

const useSourceConnectionStore = create<SourceConnectionStore>()(
  devtools((set) => ({
    ...initialState,
    reset: () => set(initialState),
    setSortField: (field) => set({ sortField: field }),
    setSortOrder: (order) => set({ sortOrder: order }),
    setSearchTerm: (term) => set({ searchTerm: term }),
    setSearchField: (field) => set({ searchField: field }),
    setPage: (page) => set({ page }),
    setPageSize: (size) => set({ pageSize: size, page: 0 }), // Reset page when pageSize changes
  }))
);

export default useSourceConnectionStore;
