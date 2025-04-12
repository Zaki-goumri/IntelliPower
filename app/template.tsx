"use client";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseUrl } from "@/api/axios.config";
import { useUserStore } from "@/store/userStore";

export default function Template({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient());


  useEffect(() => {
    const sseUrl = baseUrl + "/notifications";

    const eventSource = new EventSource(sseUrl);
    eventSource.addEventListener("Notification", (event) => {
      try {
        const data = event.data;
        console.log("Parsed custom event data:", data);
        toast.success(data || "New notification", {
          position: "top-right",
          autoClose: 5000,
        });
      } catch (error) {
        console.error("Error parsing custom event data:", error);
        toast.error("Failed to parse notification", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="Dark"
      />
      {children}
    </QueryClientProvider>
  );
}
