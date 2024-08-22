import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface ProductStore {
  sortField: string;
  sortOrder: string;
  searchTerm: string;
  searchField: string;
  selectedFilter: string;
  selectedDates: string[];
  setSelectedDates: (dates: string[]) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  setSelectedFilter: (filter: string) => void;
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
  searchField: "alias",
  page: 0,
  pageSize: 5,
  selectedFilter: "Active",
  currentPage: 0,
  selectedDates: ["0000-01-01", "9999-12-31"],
};

const useProductStore = create<ProductStore>()(
  devtools((set) => ({
    ...initialState,
    reset: () => set(initialState),
    setSortField: (field) => set({ sortField: field }),
    setSortOrder: (order) => set({ sortOrder: order }),
    setSearchTerm: (term) => set({ searchTerm: term }),
    setSearchField: (field) => set({ searchField: field }),
    setPage: (page) => set({ page }),
    setPageSize: (size) => set({ pageSize: size, page: 0 }), // Reset page when pageSize changes
    setSelectedFilter: (filter) => set({ selectedFilter: filter }),
    setCurrentPage: (page) => set({ currentPage: page }),
    setSelectedDates: (dates) => set({ selectedDates: dates }),
  }))
);

export default useProductStore;
