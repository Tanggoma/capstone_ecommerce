import { useContext, useEffect } from 'react'
import '../src/style/App.css'

//Context
import AuthContext from './context/AuthContext';
import jwtDecode from 'jwt-decode'; // import for controlling state.user

//React Router
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

//Components
import Home from './components/Home';
import NavigationBar from './components/NavigationBar';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Singleproduct from './components/Singleproduct';
import ProductByCategory from './components/ProductByCategory';
import CheckOut from './components/CheckOut';
import Payment from './components/Payment';
import Wishlist from './components/Wishlist';
import ProductByBrand from './components/ProductByBrand';
import OrdersHistory from './components/OrdersHistory';
import ERD from './components/ERD';
import ErrorPage from './components/ErrorPage';

function App() {

  const { dispatch } = useContext(AuthContext);

  // useEffect(() => {
  //   const storedToken = localStorage.getItem('authToken');
  //   if (storedToken) {

  //     dispatch({
  //       type: 'LOGIN',
  //       token: storedToken,
  //       user: decodeUser(storedToken) // 
  //     });
  //   }
  // }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {

      let decodedUser = null;

      try {
        decodedUser = jwtDecode(storedToken)

        dispatch({
          type: 'LOGIN',
          token: storedToken,
          user: decodedUser
        });

      } catch (error) {
        console.log(error)
      }
    }
  }, []);


  return (

    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/products/:id" element={<Singleproduct />} />
        <Route path="/categories/:id" element={<ProductByCategory />} />
        <Route path="/brands/:brand" element={<ProductByBrand />} />
        <Route path="/checkout" element={<CheckOut />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/order-history" element={<OrdersHistory />} />
        <Route path="/ERD" element={<ERD />} />
        <Route path="*" element={<ErrorPage />} />


      </Routes>
    </Router>

  )
}

export default App
