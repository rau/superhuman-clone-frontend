import { create } from "zustand"

interface SearchState {
	query: string
	isSearching: boolean
	setQuery: (query: string) => void
	setIsSearching: (isSearching: boolean) => void
	reset: () => void
}

export const useSearchStore = create<SearchState>((set) => ({
	query: "",
	isSearching: false,
	setQuery: (query) => set({ query }),
	setIsSearching: (isSearching) => set({ isSearching }),
	reset: () => set({ query: "", isSearching: false }),
}))
