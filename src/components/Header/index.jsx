import "./header.css";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaFilm, FaSearch } from "react-icons/fa";

function Header({ onSearch, onCategoryChange, onGenreChange, genres }) {
  // UI state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Seleções atuais (armazenadas como STRING para comparação estável na UI)
  const [selectedCategory, setSelectedCategory] = useState(null); // string | null
  const [selectedGenre, setSelectedGenre] = useState(null);       // string | null

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

  // Utils
  const toStr = (v) => (v === null || v === undefined ? null : String(v));

  const toggleMenu = () => setIsMenuOpen((v) => !v);
  const toggleSearch = () => setIsSearchOpen((v) => !v);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch?.(value);
  };

  // Persiste seleção em query params e recarrega a página (preserva ambos)
  const persistSelectionAndReload = ({ category, genre }) => {
    const params = new URLSearchParams(window.location.search);

    // Categoria
    if (category === null) params.delete("category");
    else if (category !== undefined) params.set("category", String(category));

    // Gênero
    if (genre === null) params.delete("genre");
    else if (genre !== undefined) params.set("genre", String(genre));

    const qs = params.toString();
    const newUrl = `${location.pathname}${qs ? `?${qs}` : ""}`;
    window.history.replaceState(null, "", newUrl);
    window.location.reload();
  };

  // Clique em categoria (toggle/deseleção)
  const handleCategoryClick = (rawId) => {
    const id = toStr(rawId);
    const willDeselect = selectedCategory === id;
    const nextCategory = willDeselect ? null : id;

    setSelectedCategory(nextCategory);
    setIsMenuOpen(false);

    // combina com o gênero atual (se houver)
    persistSelectionAndReload({
      category: nextCategory,
      genre: selectedGenre,
    });
  };

  // Clique em gênero (toggle/deseleção)
  const handleGenreClick = (rawId) => {
    const id = toStr(rawId);
    const willDeselect = selectedGenre === id;
    const nextGenre = willDeselect ? null : id;

    setSelectedGenre(nextGenre);
    setIsMenuOpen(false);

    // combina com a categoria atual (se houver)
    persistSelectionAndReload({
      category: selectedCategory,
      genre: nextGenre,
    });
  };

  // Foco no input ao abrir busca mobile
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => mobileSearchInputRef.current?.focus(), 0);
    }
  }, [isSearchOpen]);

  // Ao trocar de rota, fecha o menu
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Lê params e dispara filtros (combinados quando ambos existirem)
  useEffect(() => {
    if (!isHome) return;

    const params = new URLSearchParams(window.location.search);
    const cat = params.get("category"); // string (ex: 'now_playing')
    const gen = params.get("genre");    // string (ex: '28')

    let genreIdForCallback = null;

    // Categoria: mantém string
    if (cat) {
      setSelectedCategory(cat);
    } else {
      setSelectedCategory(null);
    }

    // Gênero: tenta converter para número para o callback
    if (gen) {
      const n = Number(gen);
      genreIdForCallback = Number.isNaN(n) ? gen : n;
      setSelectedGenre(String(gen)); // estado visual como string
    } else {
      setSelectedGenre(null);
    }

    // 🔗 COMBINAÇÃO: dispare ambos os callbacks com contexto do outro filtro
    if (cat) {
      // onCategoryChange(categoryId, genreIdAtual | null)
      onCategoryChange?.(cat, genreIdForCallback);
    }
    if (gen) {
      // onGenreChange(genreId, categoryIdAtual | null)
      onGenreChange?.(genreIdForCallback, cat || null);
    }
  }, [isHome, onCategoryChange, onGenreChange]);

  return (
    <header>
      <div className="menu">
        <Link className="logo" to={"/"} aria-label="Página inicial">
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
          <button
            type="button"
            className="menu-toggle"
            onClick={toggleMenu}
            aria-label="Abrir menu"
            aria-expanded={isMenuOpen}
          >
            ☰
          </button>
        )}

        <nav className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
          {/* CATEGORIAS — só na Home */}
          {isHome && (
            <div className="categories">
              <Link className="links" to={"/"}>Categoria</Link>
              <div className="categories-dropdown">
                <div className="chip-list" role="listbox" aria-label="Categorias">
                  {optionsCategory.map((opt) => {
                    const isSel = selectedCategory === toStr(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        className={`chip ${isSel ? "is-selected" : ""}`}
                        onClick={() => handleCategoryClick(opt.id)}
                        aria-pressed={isSel}
                        aria-label={`Categoria: ${opt.name}${isSel ? " (selecionada)" : ""}`}
                        title={opt.name}
                      >
                        {opt.name}
                      </button>
                    );
                  })}
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
                  {(Array.isArray(genres) ? genres : []).map((g) => {
                    const gid = toStr(g.id);
                    const isSel = selectedGenre === gid;
                    return (
                      <button
                        key={gid}
                        type="button"
                        className={`chip ${isSel ? "is-selected" : ""}`}
                        onClick={() => handleGenreClick(g.id)}
                        aria-pressed={isSel}
                        aria-label={`Gênero: ${g.name ?? g.title}${isSel ? " (selecionado)" : ""}`}
                        title={g.name ?? g.title}
                      >
                        {g.name ?? g.title}
                      </button>
                    );
                  })}
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
                aria-label="Pesquisar filmes"
              />
              <i className="fa fa-search" aria-hidden="true" />
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
            <FaSearch className="search-icon-left" aria-hidden="true" />
            <input
              ref={mobileSearchInputRef}
              type="text"
              placeholder="Pesquisar filmes..."
              value={searchTerm}
              onChange={handleSearch}
              onBlur={() => setIsSearchOpen(false)}
              aria-label="Pesquisar filmes"
            />
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
