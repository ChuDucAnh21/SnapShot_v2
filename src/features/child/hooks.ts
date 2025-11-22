'use client';

import type { ChildListResponse, CreateChildPayload } from './type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QK } from '@/lib/react-query/keys';
import * as ChildApi from './api';

export function useChildren(parentId: string, enabled = Boolean(parentId)) {
  return useQuery<ChildListResponse>({
    queryKey: QK.children(parentId),
    queryFn: ({ signal }) => ChildApi.getListChild(parentId, signal),
    enabled,
    staleTime: 5 * 60_000,
  });
}

export function useCreateChild() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateChildPayload) => ChildApi.createChild(body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QK.children(variables.parent_id) });
    },
  });
}
