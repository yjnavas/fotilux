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

export const getPosts = async (userId) => {
    try{
        return {
            success: true, 
            data: [
                {id: 1, name: 'joe', title: 'saludos', body: 'Hola a todos! soy <b>nuevo</b> por aqui! saludos', userId: 1, createdAt: '2024-01-18T10:00:00.000Z', updatedAt: '2023-04-18T10:00:00.000Z', file: 'imagen1.jpg'},
                {id: 2, name: 'silmaris', title: 'que tal', body: '<h1>una foto de un atardecer en mi tierra natal</h1>', userId: 2, createdAt: '2024-02-18T10:00:00.000Z', updatedAt: '2023-04-18T10:00:00.000Z', file: 'atardecer.jpg'},
                {id: 3, name: 'jorge', title: 'adios', body: 'buenas noches a todos, espero que descansen, por mi parte ha sido todo por hoy!', userId: 3, createdAt: '2024-03-18T10:00:00.000Z', updatedAt: '2023-04-18T10:00:00.000Z', file: 'imagen2.jpg'},
                {id: 4, name: 'yovani', title: 'hola de nuevo', body: '<h4>a alguien mas le gustan los chesecake de chocolate tanto como a mi?</h4>', userId: 4, createdAt: '2024-04-18T10:00:00.000Z', updatedAt: '2023-04-18T10:00:00.000Z', file: 'imagen3.jpg'},

            ]
        };
    }catch(error){
        console.log(error);
        return {success: false, msg: error.message || 'Error al obtener los posts'};
    }
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