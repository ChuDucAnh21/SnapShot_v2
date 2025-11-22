import type { ChildListResponse, CreateChildPayload, CreateChildResponse } from './type';
import { apiWithoutPrefix } from '@/lib/http/axios-client';

export async function getListChild(parentId: string, signal?: AbortSignal): Promise<ChildListResponse> {
  const r = await apiWithoutPrefix.get<ChildListResponse>(`/api/get_child_list?parent_id=${parentId}`, {
    signal,
  });
  return r.data;
}

export async function createChild(payload: CreateChildPayload, signal?: AbortSignal): Promise<CreateChildResponse> {
  const r = await apiWithoutPrefix.post<CreateChildResponse>(`/api/create_child?parent_id=${payload.parent_id}`, {
    parent_id: payload.parent_id,
    child_info: {
      fullname: payload.fullname,
      nickname: payload.nickname || '',
      gender: payload.gender,
      birthday: payload.birthday,
    },
  }, { signal });
  return r.data;
}

export const ChildrenService = {
  getListChild,
  createChild,
};
