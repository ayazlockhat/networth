"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { isLoggedIn } from "@/components/auth"

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    if (isLoggedIn()) {
      router.push("/dashboard")
    } else {
      router.push("/login")
    }
  }, [router])

  return null
}
