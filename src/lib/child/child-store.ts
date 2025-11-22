'use client';

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type Kid = {
  child_id?: string;
  fullname?: string;
  nickname?: string;
  age?: number;
  gender?: 'male' | 'female';
  birth_date?: string;
  submiss_subject?: Array<{ id_subject: string; submiss_id: string }>;
  [key: string]: any;
};

type ChildStoreState = {
  list_kids: Kid[];
  child_current_id: string;
  // submission_id: string | null;
  setKids: (kids: Kid[]) => void;
  addKid: (kid: Kid) => void;
  deleteKid: (kidId: string) => void;
  // setSubmissionID: (submissionId: string | null) => void;
  setChildCurrentID: (childId: string) => void;
  resetListChild: () => void;
};

export const useChildStore = create<ChildStoreState>()(
  devtools(
    persist(
      (set) => ({
        list_kids: [],
        child_current_id: '',
        // submission_id: null,
        setKids: (kids) => set({ list_kids: kids }),
        addKid: (kid) => set((state) => ({ list_kids: [...state.list_kids, kid] })),
        deleteKid: (kidId) =>
          set((state) => ({ list_kids: state.list_kids.filter((kid) => kid.id !== kidId) })),
        // setSubmissionID: (submissionId) => set({ submission_id: submissionId }),
        setChildCurrentID: (childId) => set({ child_current_id: childId }),
        resetListChild: () =>
          set({ list_kids: [], child_current_id: ''}),
      }),
      {
        name: 'child-storage',
      }
    )
  )
);

export default useChildStore;
