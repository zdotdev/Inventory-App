import { useEffect, useState } from 'react'
import axios from 'axios'
import './Items.css'

function AllItems () {
  const [data, setData] = useState([])
  const [showDialog, setShowDialog] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')

  useEffect(() => {
    axios
      .get(
        'https://chimerical-kelpie-e80fa5.netlify.app/.netlify/functions/api'
      )
      .then(res => setData(res.data))
      .catch(err => console.log(err))
  }, [])

  const handleButtonClick = id => {
    const item = data.find(element => element._id === id)
    setSelectedItem(item)
    setName(item.name)
    setPrice(item.price)
    setQuantity(item.quantity)
    setShowDialog(true)
  }

  const handleCloseDialog = () => {
    setShowDialog(false)
  }

  const handleSave = () => {
    if (!selectedItem) {
      console.error('Item not found')
      return
    }
    const updatedItem = {
      name,
      price,
      quantity
    }
    axios
      .put(
        `https://chimerical-kelpie-e80fa5.netlify.app/.netlify/functions/api/${selectedItem._id}`,
        updatedItem
      )
      .then(() => {
        console.log('Item updated successfully')
        handleCloseDialog()
        window.location.reload()
      })
      .catch(err => {
        console.error(err.message)
      })
  }

  const handleDelete = id => {
    axios
      .delete(
        `https://chimerical-kelpie-e80fa5.netlify.app/.netlify/functions/api/${id}`
      )
      .then(() => {
        console.log('Item deleted successfully')
        setData(data.filter(item => item._id !== id))
      })
      .catch(err => console.log(err))
  }

  const handleAddItem = () => {
    const newItem = {
      name,
      price,
      quantity
    }
    axios
      .post(
        'https://chimerical-kelpie-e80fa5.netlify.app/.netlify/functions/api/',
        newItem
      )
      .then(() => {
        console.log('Item added successfully')
        window.location.reload()
      })
      .catch(err => {
        console.error(err.message)
      })
  }

  return (
    <>
      <main>
        <div id='first-form'>
          <input
            type='text'
            placeholder='Name'
            onChange={e => setName(e.target.value)}
          />
          <input
            type='text'
            placeholder='Price'
            onChange={e => setPrice(e.target.value)}
          />
          <input
            type='text'
            placeholder='Quantity'
            onChange={e => setQuantity(e.target.value)}
          />
          <button onClick={handleAddItem}>Add Item</button>
        </div>
        {data.map(element => (
          <div id='itemz' key={element._id}>
            <p>
              Product Name: <strong>{element.name}</strong>{' '}
              <span>{element.quantity < 10 ? '(Must reorder)' : ''}</span>
            </p>
            <p>Price: ₱{element.price}</p>
            <p style={{ color: element.quantity < 10 ? 'red' : 'green' }}>
              Quantity: {element.quantity}
            </p>
            <button onClick={() => handleButtonClick(element._id)}>Edit</button>
            <button onClick={() => handleDelete(element._id)}>Delete</button>
          </div>
        ))}
        {showDialog && (
          <div>
            <h2>Item Details</h2>
            <label>
              Product Name:
              <input
                type='text'
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </label>
            <label>
              Price:
              <input
                type='text'
                value={price}
                onChange={e => setPrice(e.target.value)}
              />
            </label>
            <label>
              Quantity:
              <input
                type='text'
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
              />
            </label>
            <button onClick={handleSave}>Save</button>
            <button onClick={handleCloseDialog}>Close</button>
          </div>
        )}
      </main>
    </>
  )
}

export default AllItems
