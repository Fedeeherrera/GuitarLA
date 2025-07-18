import Header from './components/Header.jsx'
import Guitar from './components/Guitar.jsx'
import { db } from './data/db.js'
import { useState, useEffect } from 'react'

function App() {

  const initialCart = () => {
    const localStorageCart = localStorage.getItem('cart')
    return localStorageCart ? JSON.parse(localStorageCart) : []
  }

  const [data] = useState(db)
  const [cart, setCart] = useState(initialCart)

  const MAX_ITEMS = 5
  const MIN_ITEMS = 1

    useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  function addToCart(item) {
    const itemExists = cart.findIndex(guitar => guitar.id === item.id)
    if (itemExists >= 0) {
      if (cart[itemExists].quantity >= MAX_ITEMS) return
      const updatedCart = [...cart] //hago una copia del carrito
      updatedCart[itemExists].quantity++ //Modifico la copia
      setCart(updatedCart) //Paso los valores de la copia al carrito original
    } else {
      item.quantity = 1
      setCart([...cart, item])
    }
  }

  function removeToCart(id) {
    setCart((prevCart) => prevCart.filter(guitar => guitar.id != id))
  }

  function increaseQuantity(id) {
    const updatedCart = cart.map(item => {
      if (item.id === id && item.quantity < MAX_ITEMS) {
        return {
          ...item,
          quantity: item.quantity + 1
        }
      }
      return item
    })
    setCart(updatedCart)
  }
  function decreaseQuantity(id) {
    const updatedCart = cart.map(item => {
      if (item.id === id && item.quantity > MIN_ITEMS) {
        return {
          ...item,
          quantity: item.quantity - 1
        }
      }
      return item
    })
    setCart(updatedCart)
  }

  function cleanCart() {
    setCart([])
  }

  return (
    <>
      <Header cart={cart} removeToCart={removeToCart} increaseQuantity={increaseQuantity} decreaseQuantity={decreaseQuantity} cleanCart={cleanCart} />
      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">
          {data.map((guitar) => (
            <Guitar
              key={guitar.id}
              guitar={guitar}
              setCart={setCart}
              addToCart={addToCart}
            />
          ))}

        </div>
      </main>

      <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
          <p className="text-white text-center fs-4 mt-4 m-md-0">
            GuitarLA - Todos los derechos Reservados
          </p>
        </div>
      </footer>

    </>
  )
}

export default App
