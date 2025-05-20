"use client";

import { redirect } from "next/navigation";

// Check if user is logged in
export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("isLoggedIn") === "true";
}

// Login function
export function login(email: string, password: string): boolean {
  // In a real app, you would validate against a backend
  // For this demo, we'll use hardcoded credentials from .env.local
  const validEmail = process.env.NEXT_PUBLIC_AUTH_EMAIL;
  const validPassword = process.env.NEXT_PUBLIC_AUTH_PASSWORD;

  if (email === validEmail && password === validPassword) {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", email);
    return true;
  }
  return false;
}

export function getUserInfo() {
  if (typeof window === "undefined") {
    return {
      name: "Loading...",
      email: "Loading...",
      avatar: "",
    };
  }

  const email = localStorage.getItem("userEmail") || "unknown@example.com";
  const name = email.split("@")[0];

  return {
    name: name.charAt(0).toUpperCase() + name.slice(1),
    email,
    avatar: "",
  };
}

// Logout function
export function logout() {
  localStorage.removeItem("isLoggedIn");
  redirect("/login");
}

// Check auth and redirect if needed
export function checkAuth() {
  if (!isLoggedIn()) {
    redirect("/login");
  }
}
