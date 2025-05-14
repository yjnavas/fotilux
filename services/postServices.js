// URL directa a la API
const API_URL = 'http://localhost:8000';

export const createPost = async (post) => {
    try{
        return {success: true, msg: 'Post creado correctamente'};
    }catch(error){
        console.log(error);
        return {success: false, msg: error.message || 'Error al crear el post'};
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
    try{
        return {
            success: true, 
            data: {
                id: 1, 
                name: 'joe', 
                title: 'saludos', 
                body: 'Hola a todos! soy <b>nuevo</b> por aqui! saludos', 
                userId: 1, 
                createdAt: '2024-01-18T10:00:00.000Z', 
                updatedAt: '2023-04-18T10:00:00.000Z', 
                file: 'imagen1.jpg',
                comments: [
                    {
                        id: 1, 
                        comment: 'excelente foto',
                        user: {
                            id: 1,
                            name: 'yovani',
                            // image: 'user?.image',
                        },
                    },
                    {
                        id: 2, 
                        comment: 'saludos a mi tia',
                        user: {
                            id: 1,
                            name: 'susan',
                            // image: 'user?.image',
                        },
                    },                    
                ],
            }
        };
    }catch(error){
        console.log(error);
        return {success: false, msg: error.message || 'Error al obtener los detalles del post'};
    }
};

export const deletePost = async (id) => {
    try{
        return {success: true, msg: 'Post eliminado correctamente'};
    }catch(error){
        console.log(error);
        return {success: false, msg: error.message || 'Error al eliminar el post'};
    }
};

export const createComment = async (data) => {
    try{
        return {success: true, msg: 'Comentario creado correctamente'};
    }catch(error){
        console.log(error);
        return {success: false, msg: error.message || 'Error al crear el comentario'};
    }
};