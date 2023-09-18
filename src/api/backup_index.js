// const BASE_URL = `http://localhost:3000/api/`
const BASE_URL = `http://localhost:3000`



// REGISTER 
export async function registerUser(userData) {
    // const endpoint = 'users/register';
    const endpoint = '/api/users/register';

    try {
        const response = await fetch(BASE_URL + endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            console.error(data.message);
            return null;
        }

        console.log(data.message); // "You're signed up!"
        return {
            user: data.user,
            token: data.token
        };

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error.message);
        return null;
    }
}

// LOGIN
export async function loginUser(credentials) {

    // const endpoint = 'users/login';
    const endpoint = '/api/users/login';

    try {
        const response = await fetch(BASE_URL + endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error.message);
        }
        return data;
    } catch (error) {
        console.error("API call failed:", error.message);
        throw error
    }

}


// SESSION ID
// export async function getSessionId() {

//     // const endpoint = 'get-session-id';
//     const endpoint = '/api/carts/session'


//     try {
//         const response = await fetch(BASE_URL + endpoint);
//         const data = await response.json();

//         console.log(data);
//         console.log("Session ID from backend:", data.sessionId);
//         return data

//     } catch (error) {
//         console.error('Error fetching session ID from API:', error);
//         throw error;
//     }
// }


// export async function getSessionId() {

//     // const endpoint = 'get-session-id';
//     const endpoint = '/session'


//     try {
//         const response = await fetch(BASE_URL + endpoint)
//         const data = await response.json();

//         console.log(data);
//         console.log("Session ID from backend:", data.sessionId);
//         return data.sessionId

//     } catch (error) {
//         console.error('Error fetching session ID from API:', error);
//         throw error;
//     }
// }


// VERSION 1 TOGET SESSION ID 
// export async function getDecodedSessionId() {

//     const endpoint = '/get-decoded-session-id'

//     try {
//         const response = await fetch(BASE_URL + endpoint, {
//             method: 'GET',
//             credentials: 'include'  // Make sure to include credentials to send cookies
//         });

//         if (response.ok) {
//             const data = await response.json();
//             console.log('data', data)
//             return data.decodedSessionId;


//         } else {
//             throw new Error('Failed to fetch decoded sessionId');
//         }
//     } catch (error) {
//         console.error('Error fetching decoded sessionId:', error);
//     }
// }

// VERSION 2 
export async function getDecodedSessionId() {
    const endpoint = '/get-decoded-session-id';

    // Retrieve the token from localStorage (or wherever it's stored)
    const token = localStorage.getItem('jwtToken');

    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = 'Bearer ' + token;
    }

    try {
        const response = await fetch(BASE_URL + endpoint, {
            method: 'GET',
            credentials: 'include',  // Make sure to include credentials to send cookies
            headers: headers
        });

        if (response.ok) {
            const data = await response.json();

            return data.decodedSessionId
        } else {
            throw new Error('Failed to fetch decoded sessionId');
        }
    } catch (error) {
        console.error('Error fetching decoded sessionId:', error);
    }
}




// Get All Products

// export async function getAllProducts() {

//     const endpoint = '/api/products';

//     try {

//         const response = await fetch(BASE_URL + endpoint)

//         if (!response.ok) {
//             throw new Error(`Error fetching products`);
//         }
//         const products = await response.json();
//         // console.log(products)
//         return products
//     } catch (error) {
//         console.log(error)
//         throw error;

//     }

// }

// update 2 protect route 
export async function getAllProducts(token) {
    const endpoint = '/api/products';

    // Define headers object
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    } else {
        // If no token is provided, try to retrieve the decoded session ID
        const sessionId = await getDecodedSessionId();

        if (!sessionId) {
            throw new Error("No authentication token or session ID provided");
        }

        headers['X-Session-ID'] = sessionId; // Assuming the backend expects session ID in a header named X-Session-ID
    }

    try {
        const response = await fetch(BASE_URL + endpoint, {
            method: 'GET',
            headers: headers,
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`Error fetching products`);
        }

        const products = await response.json();
        return products;

    } catch (error) {
        console.log(error);
        throw error;
    }
}




// Get single product details
// export async function getProductDetail(id) {

//     const endpoint = `/api/products/${id}`
//     console.log('id', id)

//     try {

//         const response = await fetch(BASE_URL + endpoint)

//         if (!response.ok) {
//             throw new Error(`Error fetching products`);
//         }
//         const detail = await response.json();
//         console.log(detail)
//         return detail
//     } catch (error) {
//         console.log(error)
//         throw error;
//     }

// }

// update 2 
export async function getProductDetail(id, token) {
    const endpoint = `/api/products/${id}`;
    console.log('id', id);

    // Declare headers for the fetch call
    let headers = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    } else {
        // Retrieve the decoded session ID if no token is provided
        const sessionId = await getDecodedSessionId();
        headers['x-session-id'] = sessionId;
    }

    try {
        const response = await fetch(BASE_URL + endpoint, {
            method: 'GET',
            headers: headers,
            credentials: 'include' // Ensures cookies (like session IDs) are sent with the request
        });

        if (!response.ok) {
            throw new Error(`Error fetching product details`);
        }

        const detail = await response.json();
        console.log(detail);
        return detail;

    } catch (error) {
        console.log(error);
        throw error;
    }
}





// Get All reviews and rating 
export async function getAllReviews() {

    const endpoint = '/api/reviews';

    try {

        const response = await fetch(BASE_URL + endpoint)

        if (!response.ok) {
            throw new Error(`Error fetching products`);
        }
        const reviews = await response.json();
        // console.log(reviews)
        return reviews
    } catch (error) {
        console.log(error)
        throw error;

    }

}

// Get Reviews for specific product

export async function getReviewsByProductId(id) {

    const endpoint = `/api/reviews/${id}`
    try {
        const response = await fetch(BASE_URL + endpoint);

        if (!response.ok) {
            throw new Error("Failed to fetch reviews");
        }
        return response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}




// Get Product by categories

export async function getProductsByCategory(id) {

    const endpoint = `/api/categories/${id}`
    try {
        const response = await fetch(BASE_URL + endpoint);

        if (!response.ok) {
            throw new Error("Failed to fetch reviews");
        }
        return response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// get item in the cart by user 
export async function fetchUserCart(token) {

    const endpoint = '/api/carts/mycart'

    console.log('token my cart', token)

    if (!token) {
        throw new Error("No authentication token provided");
    }

    try {
        const response = await fetch(BASE_URL + endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        });

        if (!response.ok) {
            const message = await response.text();
            throw new Error(`Failed to fetch user cart: ${message}`);
        }

        const cartData = await response.json();
        console.log(cartData)
        return cartData;
    } catch (error) {
        console.error("Error fetching user cart:", error);
    }
}

// get cart by session ID
// export async function fetchCartBySession(sessionId) {

//     const endpoint = `/api/session/${sessionId}`

//     try {

//         const response = await fetch(BASE_URL + endpoint, {

//             method: 'GET',
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json'
//             },
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const data = await response.json();
//         return data;

//     } catch (error) {
//         console.error("There was a problem fetching the cart:", error);
//         throw error;
//     }

// };

// version2
export async function fetchCartBySession() {

    const endpoint = '/api/carts/session';

    try {

        const response = await fetch(BASE_URL + endpoint, {

            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('data', data)
        return data;

    } catch (error) {
        console.error("There was a problem fetching the cart:", error);
        throw error;
    }

};




// add item to user cart 
//version1

// export async function addProductToCart(productId, quantity, userId, sessionId) {

//     const endpoint = '/api/carts';

//     const body = {
//         product_id: productId,
//         quantity: quantity,
//         ...(userId ? { user_id: userId } : { session_id: sessionId })
//     };

//     // console.log(body)
//     try {

//         const response = await fetch(BASE_URL + endpoint, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(body), credentials: 'include'
//         });

//         // Check if response is not successful
//         if (!response.ok) {

//             const responseData = await response.json();
//             const errorMessage = responseData.message || 'Failed to add product to cart.';
//             throw new Error(errorMessage);
//         }

//         return await response.json();
//     } catch (error) {
//         console.error('Error adding product to cart:', error);
//         throw error;
//     }
// }

// version2 with token
export async function addProductToCart(productId, quantity, userId, sessionId, token) {
    const endpoint = '/api/carts';

    const body = {
        product_id: productId,
        quantity: quantity,
        ...(userId ? { user_id: userId } : { session_id: sessionId })
    };

    // Prepare headers with Content-Type and possibly an Authorization token

    const headers = {
        'Content-Type': 'application/json'
    };

    if (!token) {
        token = localStorage.getItem('authToken');
    }

    // Add the authorization token to the headers if it's available
    if (token) {
        headers['Authorization'] = 'Bearer ' + token;
    }

    console.log('headers', headers)

    try {
        const response = await fetch(BASE_URL + endpoint, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body),
            credentials: 'include'
        });

        // Check if response is not successful
        if (!response.ok) {
            const responseData = await response.json();
            const errorMessage = responseData.message || 'Failed to add product to cart.';
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error('Error adding product to cart:', error);
        throw error;
    }
}



// delete item in cart

/**
 * Deletes a product from the user's cart.
 * 
 * @param {number|string} userId - User ID
 * @param {number|string} productId - Product ID to be deleted from the cart.
 * @param {string} sessionId - Session ID (used if userId is not provided).
 * @returns {Promise<Object>} - Response from the server.
 */
// export async function deleteProductFromCart(userId, productId, sessionId) {

//     let endpoint = `/api/carts/delete?productId=${productId}`;

//     console.log('userId', userId)
//     console.log('sessionId', sessionId)

//     if (userId) {
//         endpoint += `&userId=${userId}`;
//     } else if (sessionId) {
//         endpoint += `&sessionId=${sessionId}`;
//     }
//     try {
//         const response = await fetch(BASE_URL + endpoint, {
//             method: 'DELETE',
//             headers: {
//                 'Content-Type': 'application/json',

//             },
//             credentials: 'include'
//         });

//         // Parse the JSON response from the server
//         const data = await response.json();

//         if (!response.ok) {
//             throw new Error(data.error || 'Error deleting product from cart.');
//         }

//         return data;

//     } catch (error) {
//         throw error;
//     }
// }

// version 2 
export async function deleteProductFromCart(userId, productId, sessionId, token) {

    let endpoint = `/api/carts/delete?productId=${productId}`;

    console.log('userId', userId);
    console.log('sessionId', sessionId);
    console.log('token', token)
    console.log(localStorage.getItem('authToken'));


    if (userId) {
        endpoint += `&userId=${userId}`;
    } else if (sessionId) {
        endpoint += `&sessionId=${sessionId}`;
    }

    const headers = {
        'Content-Type': 'application/json'
    };

    if (!token) {
        token = localStorage.getItem('authToken');
    }

    // Add the authorization token to the headers if it's available
    if (token) {
        headers['Authorization'] = 'Bearer ' + token;
    }


    console.log('Headers', headers)

    try {
        const response = await fetch(BASE_URL + endpoint, {
            method: 'DELETE',
            headers: headers,
            credentials: 'include',
            mode: 'cors'
        });

        // Parse the JSON response from the server
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error deleting product from cart.');
        }

        return data;

    } catch (error) {
        throw error;
    }
}


// Clear Cart after payment 

export async function clearCartAfterPayment(userId, sessionId, token) {


    const body = JSON.stringify({ userId, sessionId });

    let endpoint = '/api/carts/clear'

    let headers = {
        'Content-Type': 'application/json'
    };

    if (!token) {
        token = localStorage.getItem('authToken');
    }

    // Add the authorization token to the headers if it's available
    if (token) {
        headers['Authorization'] = 'Bearer ' + token;
    }

    try {
        const response = await fetch(BASE_URL + endpoint, {
            method: 'DELETE',
            headers: headers,
            body: body,
            credentials: 'include',
            mode: 'cors'
        });


        if (!response.ok) {
            const responseData = await response.json();
            const errorMessage = responseData.message || 'Failed to delete cart.';
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error('Error delete cart:', error);
        throw error;
    }

};





// const COHORT_NAME = '2302-ACC-PT-WEB-PT-A'
// const BASE_URL = `https://strangers-things.herokuapp.com/api/${COHORT_NAME}`

// //register sign up to get Token
// export const registerUser = async (username, password) => {
//     try {
//         const response = await fetch(`${BASE_URL}/users/register`, {
//             method: "POST",
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 user: {
//                     username,
//                     password
//                 }
//             })
//         });
//         const result = await response.json();

//         console.log(result)
//         return result
//     } catch (err) {
//         console.error(err);
//     }
// }



// //login
// export const login = async (username, password) => {

//     try {
//         const response = await fetch(`${BASE_URL}/users/login`, {
//             method: "POST",
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 user: {
//                     username,
//                     password,
//                 }
//             })
//         });
//         const result = await response.json();
//         console.log(result);
//         return result
//     } catch (err) {
//         console.error(err);
//     }
// }

// //mydata
// export const myData = async (token) => {

//     try {
//         const response = await fetch(`${BASE_URL}/users/me`, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`
//             },
//         });
//         const result = await response.json();
//         console.log(result);
//         return result
//     } catch (err) {
//         console.error(err);
//     }
// }

// //fetch post
// export const fetchPosts = async () => {
//     try {
//         const response = await fetch(`${BASE_URL}/posts`)

//         const result = await response.json();
//         console.log(result);
//         return result
//     } catch (err) {
//         console.error(err);
//     }
// }

// // create posts

// export const makePost = async (token, postData) => {

//     const { title, description, price, location, willDeliver } = postData

//     try {
//         const response = await fetch(`${BASE_URL}/posts`, {
//             method: "POST",
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`
//             },
//             body: JSON.stringify({
//                 post: {
//                     title,
//                     description,
//                     price,
//                     location,
//                     willDeliver
//                 }
//             })
//             // body: JSON.stringify(newPostData)
//         });
//         const result = await response.json();
//         console.log(result);
//         return result
//     } catch (err) {
//         console.error(err);
//     }
// }

// // update posts

// export const updatePost = async (id, token, postData) => {

//     const { title, description, price, location, willDeliver } = postData

//     try {
//         // You will need to insert a variable into the fetch template literal 
//         // in order to make the POST_ID dynamic. 
//         // 5e8d1bd48829fb0017d2233b is just for demonstration.
//         const response = await fetch(`${BASE_URL}/posts/${id}`, {
//             method: "PATCH",
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`
//             },
//             body: JSON.stringify({
//                 post: {
//                     title,
//                     description,
//                     price,
//                     location,
//                     willDeliver
//                 }
//             })
//         });
//         const result = await response.json();
//         console.log(result);
//         return result
//     } catch (err) {
//         console.error(err);
//     }
// }

// // delete msg

// export const deletePost = async (id, token) => {
//     try {
//         const response = await fetch(`${BASE_URL}/posts/${id}`, {
//             method: "DELETE",
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`
//             }
//         });
//         const result = await response.json();
//         console.log(result);
//         return result
//     } catch (err) {
//         console.error(err);
//     }
// }


// // posts msg
// export const postMessage = async (id, token, message) => {
//     try {
//         const response = await fetch(`${BASE_URL}/posts/${id}/messages`, {
//             method: "POST",
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`
//             },
//             body: JSON.stringify({
//                 message: {
//                     content: message
//                 }
//             })
//         });
//         const result = await response.json();
//         console.log(result);
//         return result
//     } catch (err) {
//         console.error(err);
//     }
// }

