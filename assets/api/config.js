---
---

// ^^ Do not remove the above front matter, it is required for Jekyll processing

export const baseurl = "{{ site.baseurl }}";

// CCAE backend (Flask)
export var pythonURI;
if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    pythonURI = "http://localhost:5001";  // must match app.run(port=...) in CCAE-BE
} else {
    pythonURI = "https://ccae-be.onrender.com";  // replace with backend server from jmort if we get one
}

export const fetchOptions = {
    method: 'GET',        // Default method is GET
    mode: 'cors',         // Enable CORS (Cross-Origin Resource Sharing)
    cache: 'default',     // Default caching behavior
    credentials: 'include', // Include credentials (cookies, etc.)
    headers: {
        'Content-Type': 'application/json',
        'X-Origin': 'client' // Custom header to identify source
    },
};

// User Login Function (allows both GET and POST)
export function login(options) {
    // Modify the options to use the correct method and include the request body
    const requestOptions = {
        ...fetchOptions,
        method: options.method || 'POST',
        body: options.method === 'POST' ? JSON.stringify(options.body) : undefined
    };

    // Clear the message area
    document.getElementById(options.message).textContent = "";

    // Fetch JWT from the server
    fetch(options.URL, requestOptions)
        .then(response => {
            // Trap error response from the Web API
            if (!response.ok) {
                const errorMsg = 'Login error: ' + response.status;
                console.log(errorMsg);
                document.getElementById(options.message).textContent = errorMsg;
                return response; // Exit early if response is not OK
            }
            // Success: Proceed with callback
            options.callback();
        })
        .catch(error => {
            // Handle network errors
            console.log('Possible CORS or Service Down error: ' + error);
            document.getElementById(options.message).textContent = 'Possible CORS or service down error: ' + error;
        });
}