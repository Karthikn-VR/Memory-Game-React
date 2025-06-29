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
  

  const FetchPokemons = async () => {
    try {
      setReveal(true);
      console.log("Browser Width:", window.innerWidth);
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=12&offset=${pages}`);
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
         
  alt="Memorydex Background" 
  style={{
    backgroundImage:`url(${bg})`,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100vh',
    objectFit: 'cover',
    zIndex: -1
  }} >
   <h1 className="d-flex justify-content-center align-items-center mb-5 my-5 p-4" ></h1>
    <div className="d-flex justify-content-center align-items-center m-5 my-5 gap-3">
    <div className="container-sm border border-2 w-50 mx-4 my-4 p-4 d-flex position-relative flex-wrap justify-content-center gap-4" style={{maxWidth:'500px',backgroundColor: 'rgba(255, 255, 255, 0.5)'}}>
      {Pokemons.map((pokemon, index) => {
        const id = getIdFromUrl(pokemon.url);
        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

        return ( 
          <div className={`shadow-lg p-2`}  key={index} style={{ width: "5rem",height:'5rem' }}>
            <img src={imageUrl} style={{objectFit:'cover'}} className="card-img-top" alt={pokemon.name} />
            <button  className={`position-absolute btn btn-outline-light text-light-emphasis p-2`}
            style={{
                   backgroundColor : `${ Reveal || Show === index ? 'transparent' : 'white'}`,
                   width:'5rem',
                   height:'5rem',
                   marginRight:'-2px',
                   marginLeft:'-72px',
                   marginbottom:'39px',
                   marginTop:'-8px'}}
            onClick={()=>{setShow(index),setindex(pokemon.name)}}></button>
          </div>
        );
      })}
      
    </div>
    <div className="d-flex">
    <div className="col border border-2 w-50 mx-4 my-4 p-4 d-flex flex-direction-column position-relative flex-wrap justify-content-center gap-4" style={{maxWidth:'500px', backgroundColor: 'rgba(255, 255, 255, 0.5)'}}>
      {Shuffle.map((pokemon, Shuffleindex) => {
        const id = getIdFromUrl(pokemon.url);
        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

        return ( 
          <div className={`shadow-lg p-2`}  key={Shuffleindex} style={{ width: "5rem",height:'5rem' }}>
            <img src={imageUrl} style={{objectFit:'cover'}} className="card-img-top" alt={pokemon.name} />
            <button className={`position-absolute btn btn-outline-light text-light-emphasis p-2`}
            style={{
                   backgroundColor : `${ Reveal || ShuffleShow === Shuffleindex ? 'transparent' : 'white'}`,
                   width:'5rem',
                   height:'5rem',
                   marginRight:'-2px',
                   marginLeft:'-72px',
                   marginbottom:'39px',
                   marginTop:'-8px',
                  }}
            onClick={()=>{setShuffleShow(Shuffleindex),setindex2(pokemon.name)}}></button>
          </div>
        );
      })}
    </div>
    </div>
    </div>
        <div className="text-center text-light" style={{marginTop:'-50px'}}>
          <p className="fw-bold text-light fs-5">Your Score</p>
          <p className="fw-bolder fs-2">{Score}</p>
        </div>

        <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${pages === 1 ? 'disabled' : ''}`}>
            <button className="page-link border border-light fw-bold" style={{backgroundColor: 'rgba(255, 255, 255, 0.1)',color:'white'}} onClick={() => setpages(pages - 10)} disabled={pages === 1}>
              <i class="bi bi-arrow-bar-left"></i>Previous
            </button>
          </li>
          <li className="page-item">
            <button className="page-link border border-light fw-bold" style={{backgroundColor: 'rgba(255, 255, 255, 0.1)',color:'white'}} onClick={() => setpages(pages + 10)}>
              Next<i class="bi bi-arrow-bar-right"></i>
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