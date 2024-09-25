import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IdPriority, StatusId } from '../models/constants';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

interface Dado {
    id_ticket: number;
    name: string;
    id_priority: number;
    status_id: number;
}

const Tickets = () => {
    const [dados, setDados] = useState<Dado[]>([]);
    const [filtro, setFiltro] = useState<Dado[]>([]);
          
    useEffect(() => {
        const fetchData = async () => {
        try {
            const token_glpi = sessionStorage.getItem("@AuthFirebase:token_glpi");
            if (!token_glpi) {
                throw new Error('Token de autorização não fornecido.');
            }
            const resposta = await fetch('http://127.0.0.1:5000/Ticket', {
                method: 'GET',
                headers: {
                    'Authorization': token_glpi,
                }});
                if (!resposta.ok) {
                    throw new Error('Erro ao buscar dados');
                }
                const resp = await resposta.json();
                setDados(resp.data);
                setFiltro(resp.data);
                } catch (error) {
                  console.error('Erro na requisição:', error);
                }
            };
          
        const intervalId = setInterval(fetchData, 5000);
        }, []);

        function filtrar_by_status(event: { target: { name:any , value: any } }){
          const { name, value } = event.target;

          if(value ==0 ){
            setFiltro(dados);
          }else{
            let itensFiltrados = dados.filter(dado =>
            dado.status_id == value);
            console.log("a"+itensFiltrados);
            setFiltro(itensFiltrados);
          }
          
        }

        function filtrar_by_priority(event: { target: { name:any , value: any } }){
          const { name, value } = event.target;

          if(value ==0 ){
            setFiltro(dados);
          }else{
            let itensFiltrados = dados.filter(dado =>
            dado.id_priority == value);
            console.log("a"+itensFiltrados);
            setFiltro(itensFiltrados);
          }
        }
          
    return (
        <div>
            <h1>Tickets :</h1>
            <div >
              <label>Filtre os tickets por status:</label>
              <select id="statusFilter" onChange={filtrar_by_status}>
                  <option value='0'>Sem filtro</option>
                  <option value='1'>Novo</option>
                  <option value='2'>Em atendimento (Atribuído)</option>
                  <option value='3'>Em atendimento (Planejado)</option>
                  <option value='4'>Pendente</option>
                  <option value='5'>Solucionado</option>
                  <option value='6'>Fechado</option>
              </select>
            </div>
            <div >
                <label>Filtre os tickets por Prioridade:</label>
                <select id="priorityFilter" onChange={filtrar_by_priority}>
                    <option value='0'>Sem filtro</option>
                    <option value='1'>Muito Baixa</option>
                    <option value='2'>Baixa</option>
                    <option value='3'>Média</option>
                    <option value='4'>Alta</option>
                    <option value='5'>Muito alta</option>
                    <option value='6'>Crítica</option>
                </select>
            </div>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="right">Id Ticket</TableCell>
                    <TableCell align="right">Name&nbsp;</TableCell>
                    <TableCell align="right">Priority&nbsp;</TableCell>
                    <TableCell align="right">Status&nbsp;</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtro.map((dado) => (
                    <TableRow
                      key={dado.id_ticket}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row"><Link to={`/ticket/${dado.id_ticket}`}>
                        {dado.id_ticket}</Link>
                      </TableCell>
                      <TableCell align="right">{dado.name}</TableCell>
                      <TableCell align="right">{IdPriority[dado.id_priority]}</TableCell>
                      <TableCell align="right">{StatusId[dado.status_id]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
              {/*
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Titulo </th>
                      <th>Prioridade</th>
                      <th>Status</th>
                      {/* Adicione outras colunas conforme necessário *
                    </tr>
                  </thead>
                  <tbody>
                        {Array.isArray(dados) && dados.map((item) => (
                        <tr key={item.id_ticket}>
                        <td><Link to={`/ticket/${item.id_ticket}`}>{item.id_ticket}</Link></td>
                        <td>{item.name}</td>
                        <td>{IdPriority[item.id_priority]}</td>
                        <td>{StatusId[item.status_id]}</td>
                        {/* Adicione outras células conforme necessário *
                        </tr>
                    ))}
                  </tbody>
                </table>*/}
              </div>
            );
          };
export default Tickets;
          