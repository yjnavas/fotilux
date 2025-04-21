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