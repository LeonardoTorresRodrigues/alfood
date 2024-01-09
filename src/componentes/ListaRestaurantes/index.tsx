import React, { useEffect, useState } from 'react';
import IRestaurante from '../../interfaces/IRestaurante';
import style from './ListaRestaurantes.module.scss';
import Restaurante from './Restaurante';
import axios from 'axios';
import { IPaginacao } from '../../interfaces/IPaginacao';

const ListaRestaurantes = () => {
  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
  const [proximaPagina, setProximaPagina] = useState('');
  const [paginaAnterior, setPaginaAnterior] = useState('');

  const carregarDados = (url: string) => {
    axios
      .get<IPaginacao<IRestaurante>>(url)
      .then((res) => {
        setRestaurantes(res.data.results);
        setProximaPagina(res.data.next);
        setPaginaAnterior(res.data.previous);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    axios
      .get<IPaginacao<IRestaurante>>(
        'http://localhost:8000/api/v1/restaurantes/',
      )
      .then((res) => {
        setRestaurantes(res.data.results);
        setProximaPagina(res.data.next);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // const verMais = () => {
  //   axios
  //     .get<IPaginacao<IRestaurante>>(proximaPagina)
  //     .then((res) => {
  //       setRestaurantes([...restaurantes, ...res.data.results]);
  //       setProximaPagina(res.data.next);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  return (
    <section className={style.ListaRestaurantes}>
      <h1>
        Os restaurantes mais <em>bacanas</em>!
      </h1>
      {restaurantes?.map((item) => (
        <Restaurante restaurante={item} key={item.id} />
      ))}
      {
        <button
          onClick={() => carregarDados(paginaAnterior)}
          disabled={!paginaAnterior}
        >
          Página Anterior
        </button>
      }
      {
        <button
          onClick={() => carregarDados(proximaPagina)}
          disabled={!proximaPagina}
        >
          Próxima página
        </button>
      }
    </section>
  );
};

export default ListaRestaurantes;
