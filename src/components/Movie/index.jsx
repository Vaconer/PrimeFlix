import React from "react";
import {Link} from 'react-router-dom'

export const Movie = ({item, excluirFilme}) => {
    return (<li key={item.id}>
        <span>{item.title}</span>
        <img src={`https://image.tmdb.org/t/p/original/${item.backdrop_path}`} alt={item.title} />
        <div>
            <Link to={`/filme/${item.id}`}>Ver detalhes</Link>
            <button onClick={() => excluirFilme(item.id)}>Excluir</button>
        </div>
    </li>)
}