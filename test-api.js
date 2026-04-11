const axios = require('axios');

async function testSignup() {
    try {
        const response = await axios.post('http://localhost:8080/user-service/auth/signup', {
            username: "testuser1",
            email: "testuser1@test.com",
            password: "password123"
        });
        console.log("Success:", JSON.stringify(response.data));
    } catch (e) {
        if (e.response) {
            console.log("DATA_IS:", JSON.stringify(e.response.data));
        } else {
            console.log("Network Error:", e.message);
        }
    }
}
testSignup();
