export const fetchNotifications = async (userId) => {
    try{
        return {
            success: true, 
            data: [
                {senderId: 1, receiverId: 2, title: 'Samaris ha comentado tu publicacion', data: { postId: 1, commentId: 1, userPhoto: 'imagen1.jpg'}},
                {senderId: 2, receiverId: 2, title: 'Ana Lopez a comenzado a seguirte', data: { postId: 1, commentId: 2, userPhoto: 'imagen2.jpg'}},
                {senderId: 3, receiverId: 2, title: 'Yovani Navas ha comentado tu publicacion', data: { postId: 1, commentId: 3, userPhoto: 'imagen3.jpg'}},
                {senderId: 4, receiverId: 2, title: 'Jose Verde acaba de guardar tu publicaion', data: { postId: 1, commentId: 4, userPhoto: 'imagen4.jpg'}},
                {senderId: 5, receiverId: 2, title: 'Jorge Chiquin compartio tu publicacion', data: { postId: 1, commentId: 5, userPhoto: 'imagen5.jpg'}},            
            ]
        };
    }catch(error){
        console.log(error);
        return {success: false, msg: error.message || 'Error al obtener las notificaiones'};
    }
};