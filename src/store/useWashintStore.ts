
import { create } from "zustand";
interface WashintStoreState {
    isSearchBarOpen:boolean,
    openSearchBar: ()=> void,
    closeSearchBar: ()=> void,
    
}
 const useWashintStore = create<WashintStoreState>((set) => ({
    isSearchBarOpen: false,  
    openSearchBar: ()=> set((state) => ({isSearchBarOpen:true})),
    closeSearchBar: ()=> set((state) => ({isSearchBarOpen:false})),
}))

export default useWashintStore


