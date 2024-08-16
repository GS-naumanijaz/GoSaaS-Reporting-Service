import {create} from "zustand";

interface ProductStore {
  currentPage: number;
  selectedFilter: string;
  searchTerm: string;
  setCurrentPage: (page: number) => void;
  setSelectedFilter: (filter: string) => void;
  setSearchTerm: (term: string) => void;
}

const useProductStore = create<ProductStore>((set) => ({
  currentPage: 0,
  selectedFilter: "Active",
  searchTerm: "",
  setCurrentPage: (page) => set({ currentPage: page }),
  setSelectedFilter: (filter) => set({ selectedFilter: filter }),
  setSearchTerm: (term) => set({ searchTerm: term }),
}));

export default useProductStore;
