import React, { useEffect, useState } from "react";
import Tmdb from './Tmdb';
import MovieRow from './components/MovieRow';
import './App.css'
import Header from "./components/Header";
import FeaturedMovie from './components/FeaturedMovie';

export default () => {
  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackheader] = useState(false);

  useEffect(() => {
    const loadAll = async () => {
      // pegar lista total dos filmes

      let list = await Tmdb.getHomeList();
      setMovieList(list);

      // pegar o featured
      let originals = list.filter(i => i.slug === 'originals');

      // (gerar um numero aleatorio)
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));

      //pegar o filme escolhido
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
      setFeaturedData(chosenInfo);

      //console.log(chosen);
    }

    loadAll();

  }, []);

  useEffect(() => {
    const scrollListener = () => {
      if (window.scrollY > 10) {
        setBlackheader(true);
      } else {
        setBlackheader(false);
      }
    }

    window.addEventListener('scroll', scrollListener);

    return () => {
      window.removeEventListener('scroll', scrollListener);

    }
  }, []);

  return (
    <div className="page">

      <Header black={blackHeader} />

      {featuredData &&
        <FeaturedMovie item={featuredData} />
      }

      <section className="lists">
        {movieList.map((item, key) => (
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>

      <footer>
        <text>Feito com <span role='img' aria-label="coração">❤️</span> por VB.<br />
          Direitos de imagem para Netflix.<br />
          Dados pegos do site themoviedb.org
        </text>
      </footer>

      {movieList.length <= 0 &&
        <div className="loading">
          <img src="https://media.filmelier.com/noticias/br/2020/03/Netflix_LoadTime.gif" alt="Carregando..." className="imgload" />
        </div>
      }
    </div>
  );
}
