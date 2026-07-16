import { createContext, useContext, useState, useEffect } from "react"

// create a context (global box that holds the cart data and functions)
const CartContext = createContext()

// create the Provider component (wrapper component that provides the cart data/functions to all children)
export function CartProvider({ children }) {

  //load cart from localStorage on first render and return {} if nothing found
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart")
    return saved ? JSON.parse(saved) : {}
  })

  //wheever cart changes, save it to localStorage hence cart is dependency of this effect
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  // Total item count for navbar badge
  // Replaces: let sum = 0; for (let item in cart) { sum += cart[item] }
  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0)

  // Add to cart, we use ...prev (spread operator) to keep existing items and just update the one we want otherwise all prev data will get lost and only the new item will be in cart
  function addToCart(id) {
    setCart(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1//if no item with this id in cart, start with 0 and add 1 otherwise just add 1 to existing quantity
    }))
  }

  // Increase quantity (plus button)
  function increaseQty(id) {
    setCart(prev => ({
      ...prev,//keep existing items
      [id]: (prev[id] || 0) + 1
    }))
  }

  // Decrease quantity (minus button)
  // Replaces: cart[idStr] = Math.max((cart[idStr] || 1) - 1, 0)
  function decreaseQty(id) {
    setCart(prev => {
      const newQty = (prev[id] || 1) - 1
      if (newQty <= 0) {
        // Remove item from cart completely when it hits 0
        const updated = { ...prev }
        delete updated[id]
        return updated
      }
      return { ...prev, [id]: newQty }
    })
  }

  // Clear entire cart
  // Replaces: cart = {}; localStorage.removeItem("cart")
  function clearCart() {
    setCart({})
    localStorage.removeItem("cart")
  }

  // Everything we want to share with all components
  return (
    <CartContext.Provider value={{
      cart,
      cartCount,
      addToCart,
      increaseQty,
      decreaseQty,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

// Step C: Custom hook so any component can use cart easily
// Instead of writing useContext(CartContext) every time,
// just write useCart()
export function useCart() {
  return useContext(CartContext)
}