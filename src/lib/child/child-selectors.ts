import useChildStore from './child-store';

export const useListKids = () => useChildStore(state => state.list_kids);
export const useChildCurrentID = () => useChildStore(state => state.child_current_id);
