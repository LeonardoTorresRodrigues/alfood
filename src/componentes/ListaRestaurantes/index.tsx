import React, { useEffect, useState } from 'react';
import IRestaurante from '../../interfaces/IRestaurante';
import style from './ListaRestaurantes.module.scss';
import Restaurante from './Restaurante';
import axios, { AxiosRequestConfig } from 'axios';
import { IPaginacao } from '../../interfaces/IPaginacao';

interface IParametrosBusca {
  ordering?: string;
  search?: string;
}

const ListaRestaurantes = () => {
  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
  const [proximaPagina, setProximaPagina] = useState('');
  const [paginaAnterior, setPaginaAnterior] = useState('');

  const [busca, setBusca] = useState('');

  const carregarDados = (url: string, opcoes: AxiosRequestConfig = {}) => {
    axios
      .get<IPaginacao<IRestaurante>>(url, opcoes)
      .then((res) => {
        setRestaurantes(res.data.results);
        setProximaPagina(res.data.next);
        setPaginaAnterior(res.data.previous);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const buscar = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const opcoes = {
      params: {} as IParametrosBusca,
    };
    if (busca) {
      opcoes.params.search = busca;
    }
    carregarDados('http://localhost:8000/api/v1/restaurantes/', opcoes);
  };

  useEffect(() => {
    carregarDados('http://localhost:8000/api/v1/restaurantes/');

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
      <form onSubmit={buscar}>
        <input
          type="text"
          value={busca}
          onChange={(evento) => setBusca(evento.target.value)}
        />
        <button type="submit">buscar</button>
      </form>
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
