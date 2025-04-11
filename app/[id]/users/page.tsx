// Page.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import UserManagement from "@/components/user-management";
import useGetUsers from "./useGetUsers";

export default function Page() {
  const { users, hasMore, loading, error, loadMore, totalItems } =
    useGetUsers(5);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Set up IntersectionObserver to trigger loadMore
  useEffect(() => {
    if (!hasMore || loading) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1.0 },
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading, loadMore]);

  return (
    <div className="p-6">
      <UserManagement
        initialUsers={users}
        paginationInfo={{
          currentPage: 1, // Not used for infinite scroll
          totalPages: 1, // Not used
          totalItems,
          itemsPerPage: 5, // Not used
        }}
      />
      {loading && <p className="text-center mt-4">Loading more users...</p>}
      {error && <p className="text-center mt-4 text-red-500">{error}</p>}
      {!hasMore && users.length > 0 && (
        <p className="text-center mt-4 text-muted-foreground">
          No more users to load
        </p>
      )}
      <div ref={loadMoreRef} style={{ height: "20px" }} />
    </div>
  );
}
