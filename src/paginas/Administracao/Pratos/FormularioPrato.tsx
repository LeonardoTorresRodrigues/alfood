import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import http from '../../../http';
import ITag from '../../../interfaces/ITag';
import IRestaurante from '../../../interfaces/IRestaurante';
import { useParams } from 'react-router-dom';
import IPrato from '../../../interfaces/IPrato';

const FormularioPrato = () => {
  const parametros = useParams();

  const [nomePrato, setNomePrato] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tag, setTag] = useState('');
  const [restaurante, setRestaurante] = useState(0);
  const [imagem, setImagem] = useState<File | null>(null);

  const [tags, setTags] = useState<ITag[]>([]);
  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);

  useEffect(() => {
    http.get<{ tags: ITag[] }>('tags/').then((res) => setTags(res.data.tags));
    http
      .get<IRestaurante[]>('restaurantes/')
      .then((res) => setRestaurantes(res.data));
  }, []);

  useEffect(() => {
    if (parametros.id) {
      http.get<IPrato>(`pratos/${parametros.id}/`).then((res) => {
        setNomePrato(res.data.nome);
        setDescricao(res.data.descricao);
        setTag(res.data.tag);
        setRestaurante(res.data.restaurante);
      });
    }
  }, [parametros]);

  const selecionarArquivo = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setImagem(event.target.files[0]);
    } else {
      setImagem(null);
    }
  };

  const aoSubmeterForm = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();

    const formData = new FormData();

    formData.append('nome', nomePrato);
    formData.append('descricao', descricao);
    formData.append('tag', tag);
    formData.append('restaurante', restaurante.toString());

    if (!parametros.id && imagem) {
      formData.append('imagem', imagem);
    }

    const url = parametros.id ? `pratos/${parametros.id}/` : 'pratos/';
    const method = parametros.id ? 'PUT' : 'POST';

    http
      .request({
        url,
        method,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: formData,
      })
      .then(() => {
        if (parametros.id) {
          setNomePrato('');
          setDescricao('');
          setTag('');
          setRestaurante(0);
          alert('prato cadastrado com sucesso!');
          setImagem(null);
        }
      })
      .catch((erro) => console.log(erro));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flexGrow: 1,
      }}
    >
      <Typography component="h1" variant="h6">
        Formulário de Pratos
      </Typography>
      <Box component="form" sx={{ width: '100%' }} onSubmit={aoSubmeterForm}>
        <TextField
          value={nomePrato}
          onChange={(evento) => setNomePrato(evento.target.value)}
          id="standard-basic"
          label="Nome do Prato"
          variant="standard"
          fullWidth
          required
          margin="dense"
        />
        <TextField
          value={descricao}
          onChange={(evento) => setDescricao(evento.target.value)}
          id="standard-basic"
          label="Descrição do Prato"
          variant="standard"
          fullWidth
          required
          margin="dense"
        />
        <FormControl margin="dense" fullWidth>
          <InputLabel id="select-tag">Tag</InputLabel>
          <Select
            labelId="select-tag"
            value={tag}
            onChange={(event) => setTag(event.target.value)}
          >
            {tags.map((tag) => (
              <MenuItem key={tag.id} value={tag.value}>
                {tag.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl margin="dense" fullWidth>
          <InputLabel id="select-restaurante">Restaurante</InputLabel>
          <Select
            labelId="select-restaurante"
            value={restaurante}
            onChange={(event) => setRestaurante(Number(event.target.value))}
          >
            {restaurantes.map((restaurante) => (
              <MenuItem key={restaurante.id} value={restaurante.id}>
                {restaurante.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <input type="file" onChange={selecionarArquivo} />

        <Button
          sx={{ marginTop: 1 }}
          type="submit"
          variant="outlined"
          fullWidth
        >
          Salvar
        </Button>
      </Box>
    </Box>
  );
};

export default FormularioPrato;
