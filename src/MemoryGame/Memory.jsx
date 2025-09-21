import { useEffect, useState } from "react";
import bg from './imgs/background.png';

export default function MemoryGame() {
  const [Pokemons, setPokemons] = useState([]);
  const [pages , setpages] = useState(0);
  const [Show , setShow] = useState(null)
  const [ShuffleShow , setShuffleShow] = useState(null)
  const [Shuffle , setShuffle] = useState([])
  const [index1 , setindex] = useState(null)
  const [index2 , setindex2] = useState(null)
  const [Score , SetScore] = useState(0)
  const [Reveal , setReveal] = useState(true)
  

  const getCardCount = () => {
    const width = window.innerWidth;
    if (width < 576) return 8; // Small screens
    if (width < 992) return 10; // Medium screens
    return 15; // Large screens
  };

  const FetchPokemons = async () => {
    try {
      setReveal(true);
      const cardCount = getCardCount();
      console.log("Browser Width:", window.innerWidth, "Card Count:", cardCount);
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${cardCount}&offset=${pages}`);
      const data = await res.json();
      setPokemons(data.results);
      setShuffle(shufflepokemons(data.results))
      setTimeout(() => {
      setReveal(false);
    }, 1500);
    } catch (error) {
      console.error("Pokemons escaped:", error);
    }
  };

  useEffect(() => {
    FetchPokemons();
    
    // Add resize event listener to update cards when screen size changes
    const handleResize = () => {
      FetchPokemons();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [pages]);


  const shufflepokemons = (Array)=>{
    const Shuffeled = [...Array];
    for(let i = Shuffeled.length -1 ; i > 0 ; i-- ){
        const j = Math.floor(Math.random()*(i+1));
        [Shuffeled[j], Shuffeled[i]] = [Shuffeled[i],Shuffeled[j]]
    }
    return Shuffeled

  }

  const getIdFromUrl = (url) => {
    const parts = url.split("/").filter(Boolean);
    return parts[parts.length - 1];
  };
  
  const DeletePokemons = (index1)=>{
    const Interval = setTimeout(()=>{
    setPokemons(Pokemons.filter((i)=> i !== index1))
    FetchPokemons()

  },800)
  return ()=> clearTimeout(Interval)

  }

  useEffect(()=>{
    if(index1 !== null && index2 !== null){
    if(index1 === index2){
        SetScore(prev => prev + 1)
        DeletePokemons(index1)
        
    }
    else{
        SetScore(prev => prev - 1)
    }
      setTimeout(() => {
      setShow(null);
      setShuffleShow(null);
      setindex(null);
      setindex2(null);
    }, 700);
  
}
  },[index1 , index2])




  return (
    
    <div className="main-container"
  style={{
    backgroundImage: `url(${bg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    minHeight: '100vh',
    zIndex: -1,
    overflowX: 'hidden'
  }} >
   <h1 className="text-center fw-bold display-4 mb-4" style={{color: '#ffffff', textShadow: '2px 2px 4px #000000', marginTop: '20px'}}>MEMORYDEX</h1>
    <div className="d-flex flex-column flex-lg-row justify-content-center align-items-center px-2 py-2 gap-4">
    <div className="container-sm border border-2 w-100 mx-auto p-3 d-flex position-relative flex-wrap justify-content-center gap-3" style={{maxWidth:'500px', minHeight: '300px', backgroundColor: 'rgba(255, 255, 255, 0.5)'}}>
      {Pokemons.map((pokemon, index) => {
        const id = getIdFromUrl(pokemon.url);
        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

        return ( 
          <div className={`shadow-lg p-2`}  key={index} style={{ width: "4.5rem",height:'4.5rem', margin: '0.25rem' }}>
            <img src={imageUrl} style={{objectFit:'cover', width: '100%', height: '100%'}} className="card-img-top" alt={pokemon.name} />
            <button  className={`position-absolute btn btn-outline-light text-light-emphasis p-2`}
            style={{
                   backgroundColor : `${ Reveal || Show === index ? 'transparent' : 'white'}`,
                   width:'4.5rem',
                   height:'4.5rem',
                   transform: 'translate(-100%, 0)',
                  }}
            onClick={()=>{setShow(index),setindex(pokemon.name)}}></button>
          </div>
        );
      })}
      
    </div>
    <div className="container-sm border border-2 w-100 mx-auto p-3 d-flex position-relative flex-wrap justify-content-center gap-3" style={{maxWidth:'500px', minHeight: '300px', backgroundColor: 'rgba(255, 255, 255, 0.5)'}}>
      {Shuffle.map((pokemon, Shuffleindex) => {
        const id = getIdFromUrl(pokemon.url);
        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

        return ( 
          <div className={`shadow-lg p-2`}  key={Shuffleindex} style={{ width: "4.5rem",height:'4.5rem', margin: '0.25rem' }}>
            <img src={imageUrl} style={{objectFit:'cover', width: '100%', height: '100%'}} className="card-img-top" alt={pokemon.name} />
            <button className={`position-absolute btn btn-outline-light text-light-emphasis p-2`}
            style={{
                   backgroundColor : `${ Reveal || ShuffleShow === Shuffleindex ? 'transparent' : 'white'}`,
                   width:'4.5rem',
                   height:'4.5rem',
                   transform: 'translate(-100%, 0)',
                  }}
            onClick={()=>{setShuffleShow(Shuffleindex),setindex2(pokemon.name)}}></button>
          </div>
        );
      })}
    </div>
    </div>
        <div className="text-center my-3">
          <p className="fw-bold text-light fs-5 mb-1">Your Score</p>
          <p className="fw-bolder fs-2 text-light mb-3">{Score}</p>
        </div>

        <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-center mb-4">
          <li className={`page-item ${pages === 1 ? 'disabled' : ''}`}>
            <button className="page-link border border-light fw-bold" style={{backgroundColor: 'rgba(255, 255, 255, 0.2)',color:'white'}} onClick={() => setpages(pages - 10)} disabled={pages === 1}>
              <i className="bi bi-arrow-bar-left"></i> Previous
            </button>
          </li>
          <li className="page-item">
            <button className="page-link border border-light fw-bold" style={{backgroundColor: 'rgba(255, 255, 255, 0.2)',color:'white'}} onClick={() => setpages(pages + 10)}>
              Next <i className="bi bi-arrow-bar-right"></i>
            </button>
          </li>
        </ul>
      </nav>



      </div>
  
    
  );
}

{/* <div className="card-body">
              <h5 className="card-title text-capitalize">{pokemon.name}</h5>
            </div> */}