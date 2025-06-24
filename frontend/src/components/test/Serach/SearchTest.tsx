// components/Search.tsx
import './Search.css';

function Search() {
  return (
    <div className="search">
      <input 
        type="text" 
        placeholder="Buscar paciente..." 
        className="search-input"
      />
      <div className="profile-circle">
        <img 
          src="/default-avatar.png" 
          alt="Perfil" 
          className="profile-image"
        />
      </div>
    </div>
  );
}

export default Search;