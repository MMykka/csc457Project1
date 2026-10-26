import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home/Home.jsx'
import ItemList from './pages/ItemList/ItemList.jsx'
import ItemDetails from './pages/ItemDetails/ItemDetails.jsx'
import AddItem from './pages/AddItem/AddItem.jsx'
import EditItem from './pages/EditItem/EditItem.jsx'
import DeleteItem from './pages/DeleteItem/DeleteItem.jsx'
import About from './pages/About/About.jsx'
import Contact from './pages/Contact/Contact.jsx'
import NotFound from './pages/NotFound/NotFound.jsx'

export default function App() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  // Start each view at the top instead of keeping the previous page's scroll position.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return (
    <div className={`app${isHome ? ' app--home' : ''}`}>
      <Navbar overHero={isHome} />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/items" element={<ItemList />} />
          <Route path="/items/new" element={<AddItem />} />
          <Route path="/items/:id" element={<ItemDetails />} />
          <Route path="/items/:id/edit" element={<EditItem />} />
          <Route path="/items/:id/delete" element={<DeleteItem />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
