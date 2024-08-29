import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface RequestStore {
  sortField: string;
  sortOrder: string;
  searchTerm: string;
  searchField: string;
  selectedDates: string[];
  setSelectedDates: (dates: string[]) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
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

const initialRequestState = {
  sortField: "createdAt",
  sortOrder: "desc",
  searchTerm: "",
  searchField: "reportName",
  page: 0,
  pageSize: 10,
  currentPage: 0,
  selectedDates: ["0000-01-01", "9999-12-31"],
};

const useRequestStore = create<RequestStore>()(
  devtools((set) => ({
    ...initialRequestState,
    reset: () => set(initialRequestState),
    setSortField: (field) => set({ sortField: field }),
    setSortOrder: (order) => set({ sortOrder: order }),
    setSearchTerm: (term) => set({ searchTerm: term }),
    setSearchField: (field) => set({ searchField: field }),
    setPage: (page) => set({ page }),
    setPageSize: (size) => set({ pageSize: size, page: 0 }), // Reset page when pageSize changes
    setCurrentPage: (page) => set({ currentPage: page }),
    setSelectedDates: (dates) => set({ selectedDates: dates }),
  }))
);

export default useRequestStore;
