"use client"

import { Product } from "@/generated/types/Product"
import { STORAGE_KEYS } from "@/lib/constants"
import { createContext, ReactNode, useContext, useState } from "react"

export interface CartItem {
  product: Product
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return []
    try {
      const storedCart = localStorage.getItem(STORAGE_KEYS.cart)
      if (!storedCart) return []
      return JSON.parse(storedCart) as CartItem[]
    } catch {
      localStorage.removeItem(STORAGE_KEYS.cart)
      return []
    }
  })
  const [isCartOpen, setIsCartOpen] = useState(false)

  const saveCart = (newItems: CartItem[]) => {
    setItems(newItems)
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(newItems))
  }

  const addToCart = (product: Product) => {
    const existing = items.find((i) => i.product.id === product.id)
    if (existing) {
      saveCart(
        items.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      )
    } else {
      saveCart([...items, { product, quantity: 1 }])
    }
  }

  const removeFromCart = (productId: number) => {
    saveCart(items.filter((i) => i.product.id !== productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    saveCart(
      items.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i
      )
    )
  }

  const clearCart = () => {
    saveCart([])
  }

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)
  const totalPrice = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart deve ser usado dentro de um CartProvider")
  }
  return context
}
