"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { usePathname } from "next/navigation"

type SidebarContextType = {
  isOpen: boolean
  toggle: () => void
  close: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Close sidebar on mobile when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        toggle: () => setIsOpen(!isOpen),
        close: () => setIsOpen(false),
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

