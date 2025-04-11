// useGetUsers.ts
"use client";
import { useState, useEffect, useCallback } from "react";
import { getUsers } from "./users.service"; // Adjust the import path



interface UsersResponse {
  content: User[];
  limit: number;
  page: number;
  isLastPage: boolean;
}

interface UseGetUsersResult {
  users: User[];
  hasMore: boolean;
  loading: boolean;
  error: string | null;
  loadMore: () => void;
  totalItems: number;
}

export default function useGetUsers(limit: number = 5): UseGetUsersResult {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);

  const fetchUsers = useCallback(
    async (pageNum: number) => {
      setLoading(true);
      setError(null);

      try {
        const data: UsersResponse = await getUsers(pageNum, limit);
        setUsers((prev) =>
          pageNum === 1 ? data.content : [...prev, ...data.content],
        );
        const calculatedTotalItems =
          (data.page - 1) * data.limit + data.content.length;
        setTotalItems(calculatedTotalItems);
        setHasMore(!data.isLastPage);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [limit],
  );

  // Initial fetch
  useEffect(() => {
    fetchUsers(1);
  }, [fetchUsers]);

  // Function to load more users
  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchUsers(nextPage);
    }
  };

  return { users, hasMore, loading, error, loadMore, totalItems };
}
