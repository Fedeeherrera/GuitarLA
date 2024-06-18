import { useState, useEffect, useMemo } from "react"
import type { CartItem, Guitar } from "../types"
import {db} from '../data/db'

function useCart() {
  const initialCart = () => {
    const localStorageCart = localStorage.getItem('Cart')
    return localStorageCart ? JSON.parse(localStorageCart) : []
  }

  const [data] = useState(db)
  const [cart, setCart] = useState(initialCart)

  const MAX_ITEMS = 5
  const MIN_ITEMS = 1

  useEffect(() => {
    localStorage.setItem('Cart', JSON.stringify(cart))
  }, [cart])

  function addToCart(item : Guitar) {
    const itemsExists = cart.findIndex((guitar : Guitar) => guitar.id === item.id)
    if (itemsExists >= 0) {
      if (cart[itemsExists].quantity >= MAX_ITEMS) return
      const updatedCart = [...cart]
      updatedCart[itemsExists].quantity++
      setCart(updatedCart)
    } else {
      const newItem : CartItem = {...item, quantity : 1} 
      setCart([...cart, newItem])
    }
  }

  function increaseQuantity(id : Guitar['id']) {
    const updatedCart = cart.map((item : CartItem) => {
      if (item.id === id && item.quantity < MAX_ITEMS) {
        return {
          ...item,
          quantity: item.quantity + 1,
        }
      }
      return item
    })
    setCart(updatedCart)
  }

  function removeFromCart(id : Guitar['id']) {
    setCart((prevCart : CartItem[]) => prevCart.filter((guitar : Guitar) => guitar.id !== id))
  }

  function decreaseQuantity(id : Guitar['id']) {
    const updatedCart = cart.map((item : CartItem) => {
      if (item.id === id && item.quantity > MIN_ITEMS) {
        return {
          ...item,
          quantity: item.quantity - 1,
        }
      }
      return item
    })
    setCart(updatedCart)
  }



  function clearcart() {
    const verification = confirm('Seguro que quiere vaciar el carrito')
    if (verification) {
      setCart([])
    }
  }

    //State Derivado
    const isEmpty = useMemo(() => cart.length === 0, [cart])
    const cartTotal = useMemo(() => cart.reduce((total : number, item : CartItem) => total + (item.quantity * item.price), 0), [cart])

  return {data,cart, addToCart, removeFromCart, decreaseQuantity, increaseQuantity, clearcart, isEmpty, cartTotal }
}

export default useCart
