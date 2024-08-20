import "./favoritos.css"
import {useEffect, useState} from 'react'
import { toast } from 'react-toastify';
import { Movie } from "../../components/Movie";

function Favoritos() {

    const [filmes, setFilmes] = useState([])

    useEffect(()=>{
        const minhaLista = localStorage.getItem("@primeFlix");
        setFilmes(JSON.parse(minhaLista) || [])
    }, [])

    function excluirFilme(id){
        let filtroFilmes = filmes.filter( (item)=>{
            return (item.id !== id)
        })

        setFilmes(filtroFilmes)
        localStorage.setItem("@primeFlix", JSON.stringify(filtroFilmes))
        toast.success("Filmes removido com sucesso!")
    }

    return (
        <div className="meus-filmes">
            <h1>MEUS FILME</h1>

            {filmes.length === 0 && <span>Você não possui nenhum filme salvo </span>}

            <ul>
                {filmes.map ((item)=>{
                    return(
                      <Movie item={item} excluirFilme={excluirFilme}/>
                    )
                })}
            </ul>
        </div>
    )
}

export default Favoritos