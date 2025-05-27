
// URL directa a la API
const API_URL = 'http://localhost:8000';

// Function to register a new user
export const registerUser = async (userData) => {
    try {
        // Format the data according to the API requirements
        const apiData = {
            name: userData.name, // Using username as name
            mail: userData.mail,
            password: userData.password
        };
        const response = await fetch(`${API_URL}/users/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(apiData)
        });

        if (response.ok) {
            const data = await response.json().catch(() => ({ message: 'Usuario registrado correctamente' }));
            return { success: true, data };
        } else {
            const errorMsg = await response.text().catch(() => 'Error al registrar usuario');
            return { success: false, msg: errorMsg };
        }
    } catch (error) {
        return { success: false, msg: error.message || 'Error al registrar usuario' };
    }
};

// Function to login a user
export const loginUser = async (userData) => {
    try {
        // Crear FormData para OAuth2PasswordRequestForm
        const formData = new FormData();
        formData.append('username', userData.mail);
        formData.append('password', userData.password);

        const response = await fetch(`${API_URL}/token`, {
            method: 'POST',
            // No establecemos Content-Type para que el navegador establezca el boundary correcto para FormData
            body: formData
        });

        if (response.ok) {
            try {
                const data = await response.json();
                return { success: true, data };
            } catch (jsonError) {
                console.error('Error parsing JSON:', jsonError);
                return { success: true, data: { message: 'Inicio de sesión exitoso' } };
            }
        } else {
            try {
                // Intentar obtener el mensaje de error en formato JSON
                const errorData = await response.json();
                return { success: false, msg: errorData.detail || 'Credenciales incorrectas' };
            } catch (jsonError) {
                // Si no es JSON, intentar obtener como texto
                const errorMsg = await response.text().catch(() => 'Error al iniciar sesión');
                return { success: false, msg: errorMsg };
            }
        }
    } catch (error) {
        return { success: false, msg: error.message || 'Error al iniciar sesión' };
    }
};

export const fetchFollowers = async (userId) => {
    try{
        return {
            success: true, 
            data: [
                {id: 1, username: '@JhontVa'},
                {id: 2, username: '@Edgarht'},
                {id: 3, username: '@JoeVr'},
                {id: 4, username: '@NavasYov'},
                {id: 5, username: '@JChiquinN'},
            ],
        };
    }catch(error){
        console.log(error);
        return {success: false, msg: error.message || 'Error al obtener los followers'};
    }
};