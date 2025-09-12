"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
}

interface SelectTriggerProps {
  className?: string
  children: React.ReactNode
}

interface SelectContentProps {
  children: React.ReactNode
}

interface SelectItemProps {
  value: string
  children: React.ReactNode
}

function Select({ value, onValueChange, children }: SelectProps) {
  return (
    <div className="relative">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === SelectTrigger) {
          return React.cloneElement(child, { value, onValueChange })
        }
        return child
      })}
    </div>
  )
}

function SelectTrigger({ className, children, ...props }: SelectTriggerProps & any) {
  return (
    <select
      className={cn(
        "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      value={props.value}
      onChange={(e) => props.onValueChange?.(e.target.value)}
      {...props}
    >
      {children}
    </select>
  )
}

function SelectContent({ children }: SelectContentProps) {
  return <>{children}</>
}

function SelectItem({ value, children }: SelectItemProps) {
  return <option value={value}>{children}</option>
}

// Placeholder components for compatibility
const SelectGroup = ({ children }: { children: React.ReactNode }) => <>{children}</>
const SelectLabel = ({ children }: { children: React.ReactNode }) => <>{children}</>
const SelectScrollDownButton = () => null
const SelectScrollUpButton = () => null
const SelectSeparator = () => null
const SelectValue = ({ placeholder }: { placeholder?: string }) => <>{placeholder}</>

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
