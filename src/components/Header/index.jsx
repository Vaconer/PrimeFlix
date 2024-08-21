import './header.css';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Select } from './components/Select';
import { FaFilm } from 'react-icons/fa';

function Header({ onSearch, onCategoryChange, onGenreChange, genres }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    onSearch(event.target.value);
  };

  const handleCategoryChange = (category) => {
    onCategoryChange(category);
  };

  const handleGenreChange = (genreId) => {
    onGenreChange(genreId);
  };

  const showSearchBar = location.pathname === '/';

  const optionsCategory = [{
    name: 'Agora em Cartaz',
    id: 'now_playing'

  },
  {
    name: 'Populares',
    id: 'popular'

  },
  {
    name: 'Mais Avaliados',
    id: 'top_rated'
  }, {
    name: 'Lançamentos',
    id: 'upcoming'
  }
  ]
  console.log(genres)
  return (
    <header>
      <div className="menu">
      <Link className='logo' to={"/"}>
        <FaFilm size={40} /> 
      </Link>

        <div className="menu-toggle" onClick={toggleMenu}>☰</div>

        <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link className='links' to={"/"}>Home</Link>
          <div className="categories">
            <Link className='links' to={"/"}>Categoria</Link>
            <div className="categories-dropdown">

            <Select options={optionsCategory} onChangeOption={handleCategoryChange} />
          </div></div>
          <div className="genres">
            <Link className='links' to={"/"}>Gêneros</Link>
            <div className="genres-dropdown">
              <Select options={genres} onChangeOption={handleGenreChange}/>
           
            </div>
          </div>
          <Link className='links' to={"/"}>Filmes</Link>

          {showSearchBar && (
            <div className="search-bar">
              <input
                type="text"
                placeholder="Faça sua pesquisa..."
                value={searchTerm}
                onChange={handleSearch}
              />
              <i className="fa fa-search"></i>
            </div>
          )}

          <Link className='favoritos' to={"/favoritos"}>Meus Filmes</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
