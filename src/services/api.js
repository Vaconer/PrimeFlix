import axios from "axios";

//Base da URL: https://api.themoviedb.org/3/
//URL da API: https://api.themoviedb.org/3/movie/now_playing?api_key=c37d549444046fa2870249ba2c5deb22&language=pt-br

const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/'
});

export default api;