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
    // console.log('id', id);

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
        // console.log(detail);
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

// Get item in the cart by user 
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

// Get item in the cart by guest(session)
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

// Add item to user cart 
export async function addProductToCart(productId, quantity, userId, sessionId, token) {
    const endpoint = '/api/carts';

    const body = {
        product_id: productId,
        quantity: quantity,
        ...(userId ? { user_id: userId } : { session_id: sessionId })
    };

    const headers = {
        'Content-Type': 'application/json'
    };

    if (!token) {
        token = localStorage.getItem('authToken');
    }
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

// Delete item in cart
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

// Post review 
export async function postReview(productId, rating, reviewText) {

    const endpoint = `/api/reviews/${productId}`;

    const headers = {
        'Content-Type': 'application/json'
    };


    const token = localStorage.getItem('authToken');

    // console.log(token)

    if (token) {
        headers['Authorization'] = 'Bearer ' + token;
    }

    try {

        const reviewData = {

            rating: rating,
            text: reviewText
        }

        const response = await fetch(BASE_URL + endpoint, {

            method: 'POST',
            headers: headers,
            body: JSON.stringify(reviewData),
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Failed to post review', errorData.error || "Unknown error")
            throw new Error(errorData.error);
        }

        const responseData = await response.json();
        return responseData

    } catch (error) {
        console.error("Error posting review", error)
        throw error;
    }



}

// Get wishlist for user
export async function getWishListByUser() {

    const endpoint = '/api/wishlist/user';

    const headers = {
        'Content-Type': 'application/json'
    };

    const token = localStorage.getItem('authToken');

    console.log(token)

    if (token) {
        headers['Authorization'] = 'Bearer ' + token;
    }

    try {
        const response = await fetch(BASE_URL + endpoint, {
            method: 'GET',
            headers: headers,
            credentials: 'include'
        })

        console.log(response)

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Failed to fetch wishlist', errorData.error || "Unknown error")
            throw new Error(errorData.error);
        }

        const responseData = await response.json();
        return responseData

    } catch (error) {
        console.error('Error adding wishlist', error)
        throw error;
    }



}

// Add item to wishlist
export async function addProductToWishList(productId) {

    const endpoint = `/api/wishlist/${productId}`;

    const headers = {
        'Content-Type': 'application/json'
    };


    const token = localStorage.getItem('authToken');

    // console.log(token)

    if (token) {
        headers['Authorization'] = 'Bearer ' + token;
    }

    try {
        const response = await fetch(BASE_URL + endpoint, {

            method: 'POST',
            headers: headers,
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData.error, errorData.message)
            if (errorData.error && errorData.error.message === 'Product is already in the wishlist!') {
                alert('Product is already in your wishlist!');
                return;
            } else {
                throw new Error(errorData.error || "Unknown error");
            }
        }

        const responseData = await response.json();
        return responseData

    } catch (error) {
        console.error('Error adding wishlist', error)
        throw error;
    }
}

// Delete wishlist by user 
export async function deleteWishlist(productId) {

    const endpoint = `/api/wishlist/user/product/${productId}`;
    const token = localStorage.getItem('authToken');

    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }


    try {
        const response = await fetch(BASE_URL + endpoint, {
            method: 'DELETE',
            headers: headers,
            credentials: 'include'
        })

        if (!response.ok) {
            const errorData = await response.json();
            console.log('Failed to delete item from wishlist', errorData.error)
            throw new Error(errorData.error);
        }

        const responseData = await response.json();
        return responseData
    } catch (error) {
        console.error('Error delete item from wishlist', error)
    }
}

// Get Personal Info
export async function getPersonalInfobyUser() {

    const endpoint = '/api/personal_info'
    const token = localStorage.getItem('authToken');


    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    try {

        const response = await fetch(BASE_URL + endpoint, {

            method: 'GET',
            headers: headers,
            credentials: 'include'
        })

        if (!response.ok) {
            const errorData = await response.json();
            console.log('Failed to fetch user info', errorData.error)
            throw new Error(errorData.error);
        }

        const responseData = await response.json();
        return responseData

    } catch (error) {
        console.error('Error getting user information, error')
    }

}

// Update Personal Info
export async function updatePersonalInfo(updatedInfo) {
    const endpoint = '/api/personal_info'
    const token = localStorage.getItem('authToken');


    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    try {

        const response = await fetch(BASE_URL + endpoint, {

            method: 'PATCH',
            headers: headers,
            credentials: 'include',
            body: JSON.stringify(updatedInfo)
        })

        if (!response.ok) {
            const errorData = await response.json();
            console.log('Failed to fetch user info', errorData.error)
            throw new Error(errorData.error);
        }

        const responseData = await response.json();
        return responseData

    } catch (error) {
        console.error('Error updating user information, error')
    }
}

// Update Password
export async function updatePassword(currentPassword, newPassword) {

    const endpoint = '/api/personal_info/update-password'
    const token = localStorage.getItem('authToken');


    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    try {
        const response = await fetch(BASE_URL + endpoint, {
            method: 'POST',
            headers: headers,
            credentials: 'include',
            body: JSON.stringify({ currentPassword, newPassword })
        })

        if (!response.ok) {
            const errorData = await response.json();
            console.log('Failed to update password', errorData.error)
            throw new Error(errorData.error);
        }

        const responseData = await response.json();
        return responseData

    } catch (error) {
        console.error('Error updating password, error')
    }

}