// URL directa a la API
const API_URL = 'http://localhost:8000';

// Función para obtener los comentarios de un post
export const getPostComments = async (postId) => {
    try {
        // Obtener el token del localStorage (para web) o AsyncStorage (para mobile)
        let token;
        if (typeof localStorage !== 'undefined') {
            token = localStorage.getItem('token');
        }

        const url = `${API_URL}/comments/post/${postId}`;
        
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        // Agregar el token de autorización si existe
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: headers
        });

        if (response.ok) {
            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } else {
            const errorData = await response.json().catch(() => ({ detail: 'Error al obtener los comentarios' }));
            return { success: false, msg: errorData.detail || 'Error al obtener los comentarios' };
        }
    } catch (error) {
        console.log(error);
        return { success: false, msg: error.message || 'Error al obtener los comentarios' };
    }
};

// Función para obtener los likes de un post
export const getPostLikes = async (postId) => {
    try {
        // Obtener el token del localStorage (para web) o AsyncStorage (para mobile)
        let token;
        if (typeof localStorage !== 'undefined') {
            token = localStorage.getItem('token');
        }

        const url = `${API_URL}/likes/post/${postId}`;
        
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        // Agregar el token de autorización si existe
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: headers
        });

        if (response.ok) {
            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } else {
            const errorData = await response.json().catch(() => ({ detail: 'Error al obtener los likes' }));
            return { success: false, msg: errorData.detail || 'Error al obtener los likes' };
        }
    } catch (error) {
        console.log(error);
        return { success: false, msg: error.message || 'Error al obtener los likes' };
    }
};

export const createPost = async (postData) => {
    try {
        // Obtener el token del localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No hay token de autenticación');
        }

        console.log('postData', postData)

        const response = await fetch(`${API_URL}/posts/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
            body: JSON.stringify(postData)
        });

        if (response.ok) {
            const data = await response.json().catch(() => ({ message: 'Post creado correctamente' }));
            return { success: true, data };
        } else {
            const errorMsg = await response.text().catch(() => 'Error al crear el post');
            return { success: false, msg: errorMsg };
        }
    } catch (error) {
        console.error('Error in createPost:', error);
        return { success: false, msg: error.message || 'Error al crear el post' };
    }
};

export const UpdatePost = async (post) => {
    try{
        return {success: true, msg: 'Post actualizado correctamente'};
    }catch(error){
        console.log(error);
        return {success: false, msg: error.message || 'Error al actualizar el post'};
    }
};

export const getPosts = async (skip = 0, limit = 10) => {
    try {
        // Obtener el token del localStorage (para web) o AsyncStorage (para mobile)
        let token;
        if (typeof localStorage !== 'undefined') {
            token = localStorage.getItem('token');
        }

        // Construir la URL con los parámetros de paginación
        const url = `${API_URL}/posts/?skip=${skip}&limit=${limit}`;
        
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        // Agregar el token de autorización si existe
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: headers
        });

        if (response.ok) {
            const data = await response.json();
            
            // Procesar los datos para agregar imágenes simuladas
            const processedData = data.map(post => ({
                ...post,
                // Simulamos imágenes aleatorias para los posts
                file: post.file || getRandomImage()
            }));
            
            return {
                success: true,
                data: processedData,
                hasMore: data.length === limit // Si recibimos menos items que el límite, no hay más datos
            };
        } else {
            const errorData = await response.json().catch(() => ({ detail: 'Error al obtener los posts' }));
            return { success: false, msg: errorData.detail || 'Error al obtener los posts' };
        }
    } catch (error) {
        console.log(error);
        return { success: false, msg: error.message || 'Error al obtener los posts' };
    }
};

// Función para simular imágenes aleatorias
const getRandomImage = () => {
    const images = ['imagen1.jpg', 'imagen2.jpg', 'imagen3.jpg', 'atardecer.jpg'];
    return images[Math.floor(Math.random() * images.length)];
};

export const fetchPostDetails = async (id) => {
    try {
        // Obtener el token del localStorage (para web) o AsyncStorage (para mobile)
        let token;
        if (typeof localStorage !== 'undefined') {
            token = localStorage.getItem('token');
        }

        const url = `${API_URL}/posts/${id}`;
        
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        // Agregar el token de autorización si existe
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        console.log(`Fetching post details for ID: ${id} from URL: ${url}`);
        const response = await fetch(url, {
            method: 'GET',
            headers: headers
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Post details fetched successfully:', data);
            
            // Procesar los datos para agregar imágenes simuladas si no tiene
            const processedData = {
                ...data,
                // Simulamos imágenes aleatorias para los posts que no tienen
                file: data.file || getRandomImage()
            };
            
            return {
                success: true,
                data: processedData
            };
        } else {
            const errorData = await response.json().catch(() => ({ detail: 'Error al obtener los detalles del post' }));
            console.error('Error fetching post details:', errorData);
            return { success: false, msg: errorData.detail || 'Error al obtener los detalles del post' };
        }
    } catch (error) {
        console.error('Exception in fetchPostDetails:', error);
        return { success: false, msg: error.message || 'Error al obtener los detalles del post' };
    }
};

export const deletePost = async (id) => {
    try {
        // Obtener el token del localStorage
        let token;
        if (typeof localStorage !== 'undefined') {
            token = localStorage.getItem('token');
        }
        
        if (!token) {
            throw new Error('No hay token de autenticación');
        }

        const url = `${API_URL}/posts/${id}`;
        
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            return { success: true, msg: 'Post eliminado correctamente' };
        } else {
            const errorData = await response.json().catch(() => ({ detail: 'Error al eliminar el post' }));
            return { success: false, msg: errorData.detail || 'Error al eliminar el post' };
        }
    } catch (error) {
        console.error('Error in deletePost:', error);
        return { success: false, msg: error.message || 'Error al eliminar el post' };
    }
};

export const createComment = async (data, post_id) => {
    try {
        // Obtener el token del localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No hay token de autenticación');
        }

        const response = await fetch(`${API_URL}/comments/${post_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                content: data.content
            })
        });

        if (response.ok) {
            const data = await response.json();
            return { success: true, data, msg: 'Comentario creado correctamente' };
        } else {
            const errorData = await response.json().catch(() => ({ detail: 'Error al crear el comentario' }));
            return { success: false, msg: errorData.detail || 'Error al crear el comentario' };
        }
    } catch (error) {
        console.error('Error in createComment:', error);
        return { success: false, msg: error.message || 'Error al crear el comentario' };
    }
};

export const deleteComment = async (commentId) => {
    try {
        // Obtener el token del localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No hay token de autenticación');
        }

        const response = await fetch(`${API_URL}/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            return { success: true, msg: 'Comentario eliminado correctamente' };
        } else {
            const errorData = await response.json().catch(() => ({ detail: 'Error al eliminar el comentario' }));
            return { success: false, msg: errorData.detail || 'Error al eliminar el comentario' };
        }
    } catch (error) {
        console.error('Error in deleteComment:', error);
        return { success: false, msg: error.message || 'Error al eliminar el comentario' };
    }
};

// Función para agregar un like a un post
export const addLike = async (postId) => {
    try {
        // Obtener el token del localStorage
        let token;
        if (typeof localStorage !== 'undefined') {
            token = localStorage.getItem('token');
        }
        
        if (!token) {
            throw new Error('No hay token de autenticación');
        }

        const url = `${API_URL}/likes/${postId}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json().catch(() => ({}));
            return { success: true, data, msg: 'Like agregado correctamente' };
        } else {
            const errorData = await response.json().catch(() => ({ detail: 'Error al agregar like' }));
            return { success: false, msg: errorData.detail || 'Error al agregar like' };
        }
    } catch (error) {
        console.error('Error in addLike:', error);
        return { success: false, msg: error.message || 'Error al agregar like' };
    }
};

// Función para quitar un like de un post
export const removeLike = async (postId) => {
    try {
        // Obtener el token del localStorage
        let token;
        if (typeof localStorage !== 'undefined') {
            token = localStorage.getItem('token');
        }
        
        if (!token) {
            throw new Error('No hay token de autenticación');
        }

        const url = `${API_URL}/likes/${postId}`;
        
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            return { success: true, msg: 'Like eliminado correctamente' };
        } else {
            const errorData = await response.json().catch(() => ({ detail: 'Error al quitar like' }));
            return { success: false, msg: errorData.detail || 'Error al quitar like' };
        }
    } catch (error) {
        console.error('Error in removeLike:', error);
        return { success: false, msg: error.message || 'Error al quitar like' };
    }
};

// Función para agregar un post a favoritos
export const create_favorite = async (postId) => {
    try {
        // Obtener el token del localStorage
        let token;
        if (typeof localStorage !== 'undefined') {
            token = localStorage.getItem('token');
        }
        
        if (!token) {
            throw new Error('No hay token de autenticación');
        }

        const url = `${API_URL}/favorites/${postId}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json().catch(() => ({}));
            return { success: true, data, msg: 'Post agregado a favoritos correctamente' };
        } else {
            const errorData = await response.json().catch(() => ({ detail: 'Error al agregar a favoritos' }));
            return { success: false, msg: errorData.detail || 'Error al agregar a favoritos' };
        }
    } catch (error) {
        console.error('Error in create_favorite:', error);
        return { success: false, msg: error.message || 'Error al agregar a favoritos' };
    }
};

// Función para eliminar un post de favoritos
export const delete_favorite = async (postId) => {
    try {
        // Obtener el token del localStorage
        let token;
        if (typeof localStorage !== 'undefined') {
            token = localStorage.getItem('token');
        }
        
        if (!token) {
            throw new Error('No hay token de autenticación');
        }

        const url = `${API_URL}/favorites/${postId}`;
        
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            return { success: true, msg: 'Post eliminado de favoritos correctamente' };
        } else {
            const errorData = await response.json().catch(() => ({ detail: 'Error al eliminar de favoritos' }));
            return { success: false, msg: errorData.detail || 'Error al eliminar de favoritos' };
        }
    } catch (error) {
        console.error('Error in delete_favorite:', error);
        return { success: false, msg: error.message || 'Error al eliminar de favoritos' };
    }
};

// Función para obtener los posts favoritos de un usuario
export const get_post_favorites = async (postId) => {
try {
    // Obtener el token del localStorage
    let token;
    if (typeof localStorage !== 'undefined') {
        token = localStorage.getItem('token');
    }
    
    if (!token) {
        throw new Error('No hay token de autenticación');
    }

    const url = `${API_URL}/favorites/post/${postId}`;
    
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        }
    });

    if (response.ok) {
        const data = await response.json();
        return { success: true, data };
    } else {
        const errorData = await response.json().catch(() => ({ detail: 'Error al obtener favoritos' }));
        return { success: false, msg: errorData.detail || 'Error al obtener favoritos' };
    }
} catch (error) {
    console.error('Error in get_post_favorites:', error);
    return { success: false, msg: error.message || 'Error al obtener favoritos' };
}
};

// Función para obtener todos los posts favoritos del usuario en sesión
export const getFavoritesPost = async (skip = 0, limit = 10) => {
    try {
        // Obtener el token del localStorage (para web) o AsyncStorage (para mobile)
        let token;
        if (typeof localStorage !== 'undefined') {
            token = localStorage.getItem('token');
        }

        // Construir la URL con los parámetros de paginación
        const url = `${API_URL}/favorites/my-posts?skip=${skip}&limit=${limit}`;
        
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        // Agregar el token de autorización si existe
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: headers
        });

        if (response.ok) {
            const data = await response.json();
            
            // Procesar los datos para agregar imágenes simuladas
            const processedData = data.map(post => ({
                ...post,
                // Simulamos imágenes aleatorias para los posts
                file: post.file || getRandomImage()
            }));
            
            return {
                success: true,
                data: processedData,
                hasMore: data.length === limit // Si recibimos menos items que el límite, no hay más datos
            };
        } else {
            const errorData = await response.json().catch(() => ({ detail: 'Error al obtener los posts' }));
            return { success: false, msg: errorData.detail || 'Error al obtener los posts' };
        }
    } catch (error) {
        console.log(error);
        return { success: false, msg: error.message || 'Error al obtener los posts' };
    }
};