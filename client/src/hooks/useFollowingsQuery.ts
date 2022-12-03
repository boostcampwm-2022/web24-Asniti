import type { Followings } from '@apis/user';
import type { AxiosError } from 'axios';

import { getFollowings } from '@apis/user';
import { useQuery } from '@tanstack/react-query';

import queryKeyCreator from '@/queryKeyCreator';

const useFollowingsQuery = (
  filter: string,
  options?: { suspense: boolean },
) => {
  const key = queryKeyCreator.followings.all();
  const query = useQuery<Followings, AxiosError>(key, getFollowings, {
    ...options,
    select: (data) =>
      filter
        ? data.filter(({ nickname }) =>
            nickname.toUpperCase().includes(filter.toUpperCase()),
          )
        : data,
  });

  return query;
};

export default useFollowingsQuery;
