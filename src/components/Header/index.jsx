import "./header.css";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaFilm, FaSearch } from "react-icons/fa";

function Header({ onSearch, onCategoryChange, onGenreChange, genres }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);

  const location = useLocation();
  const mobileSearchInputRef = useRef(null);

  const isHome = location.pathname === "/";
  const isFavorites = location.pathname === "/favoritos";

  const optionsCategory = [
    { name: "Agora em Cartaz", id: "now_playing" },
    { name: "Populares", id: "popular" },
    { name: "Mais Avaliados", id: "top_rated" },
    { name: "Lançamentos", id: "upcoming" },
  ];

  const toggleMenu = () => setIsMenuOpen((v) => !v);
  const toggleSearch = () => setIsSearchOpen((v) => !v);

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleCategoryClick = (id) => {
    setSelectedCategory(id);
    onCategoryChange?.(id);
    setIsMenuOpen(false);
  };

  const handleGenreClick = (id) => {
    setSelectedGenre(id);
    onGenreChange?.(id);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => mobileSearchInputRef.current?.focus(), 0);
    }
  }, [isSearchOpen]);

  // Opcional: ao trocar de rota, fecha o menu aberto
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header>
      <div className="menu">
        <Link className="logo" to={"/"}>
          <FaFilm size={30} />
        </Link>

        {/* Lupa fora do menu (apenas na Home) */}
        {isHome && (
          <button
            type="button"
            className="search-toggle mobile-only"
            onClick={toggleSearch}
            aria-label="Pesquisar"
            aria-expanded={isSearchOpen}
          >
            <FaSearch size={18} />
          </button>
        )}

        {/* Hamburguer NÃO aparece em /favoritos */}
        {!isFavorites && (
          <div className="menu-toggle" onClick={toggleMenu} aria-label="Menu">
            ☰
          </div>
        )}

        <nav className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
          {/* <Link className="links" to={"/"}>
            Home
          </Link> */}

          {/* CATEGORIAS — só na Home */}
          {isHome && (
            <div className="categories">
              <Link className="links" to={"/"}>Categoria</Link>
              <div className="categories-dropdown">
                <div className="chip-list" role="listbox" aria-label="Categorias">
                  {optionsCategory.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className={`chip ${selectedCategory === opt.id ? "is-selected" : ""}`}
                      onClick={() => handleCategoryClick(opt.id)}
                      aria-pressed={selectedCategory === opt.id}
                    >
                      {opt.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* GÊNEROS — só na Home */}
          {isHome && (
            <div className="genres">
              <Link className="links" to={"/"}>Gêneros</Link>
              <div className="genres-dropdown">
                <div className="chip-list" role="listbox" aria-label="Gêneros">
                  {(Array.isArray(genres) ? genres : []).map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      className={`chip ${selectedGenre === g.id ? "is-selected" : ""}`}
                      onClick={() => handleGenreClick(g.id)}
                      aria-pressed={selectedGenre === g.id}
                    >
                      {g.name ?? g.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Busca desktop — só na Home */}
          {isHome && (
            <div className="search-bar desktop-only">
              <input
                type="text"
                placeholder="Faça sua pesquisa..."
                value={searchTerm}
                onChange={handleSearch}
              />
              <i className="fa fa-search" />
            </div>
          )}

          {/* Link "Meus Filmes" NÃO aparece em /favoritos */}
          {!isFavorites && (
            <Link className="favoritos" to={"/favoritos"}>
              Meus Filmes
            </Link>
          )}
        </nav>
      </div>

      {/* Overlay de busca mobile — só na Home */}
      {isHome && (
        <div className={`search-overlay mobile-only ${isSearchOpen ? "open" : ""}`}>
          <div className="search-input-wrap">
            <FaSearch className="search-icon-left" />
            <input
              ref={mobileSearchInputRef}
              type="text"
              placeholder="Pesquisar filmes..."
              value={searchTerm}
              onChange={handleSearch}
              onBlur={() => setIsSearchOpen(false)}
            />
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
