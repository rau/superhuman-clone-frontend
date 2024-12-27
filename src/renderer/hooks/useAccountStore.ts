import { create } from "zustand"

interface AccountState {
	selectedAccountId: string | null
	setSelectedAccountId: (id: string | null) => void
}

export const useAccountStore = create<AccountState>()((set) => ({
	selectedAccountId: null,
	setSelectedAccountId: (id) => set({ selectedAccountId: id }),
}))
