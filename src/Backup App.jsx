
import { useState, useContext, useEffect } from 'react'
import { Button, Navbar } from 'react-bootstrap';


// import './App.css'
// import '../style/App.css'
import '../src/style/App.css'
import AuthContext from './context/AuthContext';




//Router
import { Route, createRoutesFromElements, createBrowserRouter, RouterProvider, Outlet } from "react-router-dom"

//Components
import Home from './components/Home';
import NavigationBar from './components/NavigationBar';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import CarouselContainer from './components/CarouselContainer';
import Singleproduct from './components/Singleproduct';
import ProductByCategory from './components/ProductByCategory';
import CheckOut from './components/CheckOut';
// import AddToCart from './components/AddToCart'; // Add to Cart 


function App() {

    const { dispatch } = useContext(AuthContext);

    // const [sessionId, setSessionId] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            // Restore the user's logged-in state using the token.
            // Optionally, verify the token's validity with the backend.
            dispatch({
                type: 'LOGIN',
                token: storedToken,
                // user: decodeUser(storedToken) // 
            });
        }


    }, []);



    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route>

                <Route path="/" element={<Home />}  >



                    {/* <Route path="posts" element={<Post />} loader={postsloader} />
          <Route path="register" element={<Register setToken={setToken} />} />
          <Route path="login" element={<Login token={token} setToken={setToken} />} />
          <Route path="add" element={<CreatePosts token={token} />} />
          <Route path='profile' element={<AllmyPost token={token} />} /> */}




                    {/* any other route */}
                    {/* <Route path="*" element={<NotFound />} /> */}
                </Route>
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Register />} />
                <Route path="profile" element={<Profile />} />
                <Route path="products/:id" element={<Singleproduct />} />
                <Route path="categories/:id" element={<ProductByCategory />} />
                <Route path="checkout" element={<CheckOut />} />
                {/* <Route path="carts/:userId"  /> */}
                {/* <Route path="carts" element={<AddToCart />} /> */}



            </Route>

        )
    );

    return (
        <>
            <NavigationBar />
            <RouterProvider router={router} />
        </>




    )
}

export default App
