import { useParams } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { IdPriority, StatusId } from '../models/constants';
import { InputLabel, MenuItem, Modal, Select, SelectChangeEvent, Typography } from "@mui/material";

interface Ticket {
    id: number;
    name: string;
    priority: number;
    status: number;
    content: string;
    date_creation: string;
    users_id_lastupdater: number;
    users_id_recipient: number;
}

interface Answer {
    id: number;
    ticket_id: number;
    content: string;
    date_creation: string;
}

interface Solution {
    id: number;
    ticket_id: number;
    content: string;
    date_creation: string;
}

interface Depart {
    id: number;
    name: string;
}

export function Ticket() {
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [answer, setAnswer] = useState("");
    const [recipient_username, setRecipientUsername] = useState("");
    const [lastupdater_username, setLastUpdaterUsername] = useState("");
    const [isAnswer, setIsAnswer] = useState(true);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [solutions, setSolutions] = useState<Solution[]>([]);
    const { id } = useParams();
    const [department, setDepartment] = useState('');
    const [departments, setDepartments] = useState<Depart[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [showModalError, setShowModalError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token_glpi = sessionStorage.getItem("@AuthFirebase:token_glpi");
                if (!token_glpi) {
                    throw new Error('Token de autorização não fornecido.');
                }
                const resposta = await fetch('http://127.0.0.1:5000/TicketById/' + id, {
                    method: 'GET',
                    headers: {
                        'Authorization': token_glpi,
                    }
                });
                if (!resposta.ok) {
                    throw new Error('Erro ao buscar dados');
                }
                const resp = await resposta.json();
                setTicket(resp);
                const resposta_group = await fetch('http://127.0.0.1:5000/Groups', {
                method: 'GET',
                headers: {
                    'Authorization': token_glpi,
                }});
                if (!resposta_group.ok) {
                    throw new Error('Erro ao buscar dados');
                }
                const resp_group = await resposta_group.json();
                setDepartments(resp_group);

                //Check if the ticket has solutions. If it doesn't, we'll fetch it's answers.
                if (resp.status === 6) { //If it is closed, it must have a solution (status id = 6)
                    const solutionRes = await fetch('http://127.0.0.1:5000/TicketSolution/' + id, {
                        method: 'GET',
                        headers: {
                            'Authorization': token_glpi,
                        }
                    });
                    if (!solutionRes.ok) {
                        throw new Error('Erro ao buscar soluções do ticket');
                    }
                    const solutionsData = await solutionRes.json();
                    setSolutions(solutionsData);
                    console.log(solutionsData)
                } else {
                    const answerRes = await fetch('http://127.0.0.1:5000/TicketAnswer/' + id, {
                        method: 'GET',
                        headers: {
                            'Authorization': token_glpi,
                        }
                    });
                    if (!answerRes.ok) {
                        throw new Error('Erro ao buscar respostas do ticket');
                    }
                    const answersData = await answerRes.json();
                    console.log(answersData)
                    setAnswers(answersData);
                }

            } catch (error) {
                console.error('Erro na requisição:', error);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        const fetchUsernames = async () => {
            if (ticket) {
                console.log(ticket.status)
                try {
                    const token_glpi = sessionStorage.getItem("@AuthFirebase:token_glpi");
                    if (!token_glpi) {
                        throw new Error('Token de autorização não fornecido.');
                    }

                    const recipient_username_request = await fetch('http://127.0.0.1:5000/User/' + String(ticket.users_id_recipient), {
                        method: 'GET',
                        headers: {
                            'Authorization': token_glpi,
                        }
                    });
                    if (!recipient_username_request.ok) {
                        throw new Error('Erro ao buscar dados');
                    }
                    const result_recipient = await recipient_username_request.json();
                    setRecipientUsername(result_recipient);

                    const lastupdater_username_request = await fetch('http://127.0.0.1:5000/User/' + String(ticket.users_id_lastupdater), {
                        method: 'GET',
                        headers: {
                            'Authorization': token_glpi,
                        }
                    });
                    if (!lastupdater_username_request.ok) {
                        throw new Error('Erro ao buscar dados');
                    }
                    const result_lastupdater = await lastupdater_username_request.json();
                    setLastUpdaterUsername(result_lastupdater);

                } catch (error) {
                    console.error('Erro na requisição:', error);
                }
            }
        };

        fetchUsernames();
    }, [ticket]);

    const handleSetAnswer = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setAnswer(event.target.value);
    };

    const handleDepartmentChange = (event: SelectChangeEvent<string>) => {
        setDepartment(event.target.value);
      };
    
    const assignTicket = () => {
        try {
            const token_glpi = sessionStorage.getItem("@AuthFirebase:token_glpi");
            const data = {
                "department": department
            };
            if (!token_glpi) {
                throw new Error('Token de autorização não fornecido.');
            }
            const resposta = fetch('http://127.0.0.1:5000/TicketUpdateDepartment/' + id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token_glpi,
                },
                body: JSON.stringify(data)
            });
            if (!resposta) {
                throw new Error('Erro ao buscar dados');
            }
            setDepartment('');
            setShowModal(true);
            }catch (error) {
                setShowModalError(true);
                console.error('Erro na requisição:', error);
            }

    }

    const postData = async () => {
        try {
            const token_glpi = sessionStorage.getItem("@AuthFirebase:token_glpi");
            if (!token_glpi) {
                throw new Error('Token de autorização não fornecido.');
            }

            let url = isAnswer ? 'http://127.0.0.1:5000/TicketAnswer' : 'http://127.0.0.1:5000/TicketSolution';

            let _data = isAnswer ? { "answer": answer } : { "solution": answer };

            const resposta = await fetch(url + '/' + id, {
                body: JSON.stringify(_data),
                method: 'POST',
                headers: {
                    'Authorization': token_glpi,
                    'Content-Type': 'application/json; charset=UTF-8'

                }
            });

            if (!resposta.ok) {
                throw new Error('Erro ao buscar dados');
            }

            const resp = await resposta.json();
            setTicket(resp);


            if (isAnswer) {
                alert('Resposta enviada com sucesso!');
            } else {
                alert('Ticket solucionado com sucesso!');
            }

            
            window.location.reload();

        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    }

    return (
        ticket ? (
            <div className="flex">
                <div className="w-1/2 p-8">
                    <h1 className="text-3xl font-bold mb-4">Ticket Especifico</h1>
                    <div className="mb-4">
                        <h1 className="font-bold">ID:</h1>
                        <p>{ticket.id}</p>
                    </div>
                    <div className="mb-4">
                        <h1 className="font-bold">Nome do Ticket:</h1>
                        <p>{ticket.name}</p>
                    </div>
                    <div className="mb-4">
                        <h1 className="font-bold">Descrição:</h1>
                        <p>{ticket.content}</p>
                    </div>
                    <div className="mb-4">
                        <h1 className="font-bold">Nome do criador:</h1>
                        <p>{recipient_username}</p>
                    </div>
                    <div className="mb-4">
                        <h1 className="font-bold">Nome do último atualizador:</h1>
                        <p>{lastupdater_username}</p>
                    </div>
                    <div className="mb-4">
                        <h1 className="font-bold">Data de criação:</h1>
                        <p>{ticket.date_creation}</p>
                    </div>
                    <div className="mb-4">
                        <h1 className="font-bold">Prioridade do Ticket:</h1>
                        <p>{IdPriority[ticket.priority]}</p>
                    </div>
                    <div className="mb-4">
                        <h1 className="font-bold">Status do Ticket:</h1>
                        <p>{StatusId[ticket.status]}</p>
                    </div>
                    <div className="mb-4">
                        <h1 className="font-bold">Atribuir a outro departamento :</h1>
                        <InputLabel id="demo-simple-select-label">Departamento</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={department}
                            label="Departamento"
                            onChange={handleDepartmentChange}
                        >
                        {departments.map((dp, index) => (
                            <MenuItem key={dp.id} value={dp.id}>
                            {dp.name}
                            </MenuItem>
                        ))}
                        </Select>
                    </div>
                    <div className="mb-8">
                        <button className="border-2 py-2 px-4 bg-blue-500 text-white hover:bg-blue-600" onClick={assignTicket}>
                            Atribuir
                        </button>
                    </div>
                    <Modal
                    open={showModal}
                    onClose={() => setShowModal(false)}
                    aria-labelledby="modal-title"
                        aria-describedby="modal-description"
                    ><div>
                    <Typography variant="h6" id="modal-title" align="center">
                        Ticket atribuido com sucesso!
                    </Typography>
                    </div>

                </Modal>
                <Modal
                    open={showModalError}
                    onClose={() => setShowModalError(false)}
                    aria-labelledby="modal-title"
                        aria-describedby="modal-description"
                    ><div>
                    <Typography variant="h6" id="modal-title" align="center">
                        Error ticket nao atribuido!
                    </Typography>
                    </div>

                </Modal>
                
                    <div className="mb-8">

                        <h1 className="text-3xl font-bold mb-4">Responder Ticket:</h1>
                        <textarea className="border-2 w-full p-2 mb-4" name="postContent" value={answer} onChange={handleSetAnswer} />
                        <button className="border-2 py-2 px-4 bg-blue-500 text-white hover:bg-blue-600" onClick={postData}>
                            {isAnswer ? 'Enviar resposta' : 'Solucionar'}
                        </button>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold mb-4">Alterar ação:</h1>
                        <label className="mr-4">
                            Responder
                            <input
                                type="radio"
                                value="Responder"
                                checked={isAnswer}
                                onChange={() => setIsAnswer(true)}
                            />
                        </label>
                        <label>
                            Solucionar
                            <input
                                type="radio"
                                value="Solucionar"
                                checked={!isAnswer}
                                onChange={() => setIsAnswer(false)}
                            />
                        </label>
                    </div>
                </div>

                <div className="w-1/2 p-8">
                    {ticket.status === 6 ? (
                        <>
                            <h1 className="text-3xl font-bold mb-4">Soluções do Ticket:</h1>
                            <ul>
                                {solutions.map((solution) => (
                                    <li key={solution.id} className="mb-8">
                                        <div className="mb-4">
                                            <h2 className="font-bold">ID da Solução:</h2>
                                            <p>{solution.id}</p>
                                        </div>
                                        <div className="mb-4">
                                            <h2 className="font-bold">Conteúdo:</h2>
                                            <p>{solution.content}</p>
                                        </div>
                                        <div>
                                            <h2 className="font-bold">Data de Criação:</h2>
                                            <p>{solution.date_creation}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <>
                            <h1 className="text-3xl font-bold mb-4">Respostas do Ticket:</h1>
                            <ul>
                                {answers.map((answer) => (
                                    <li key={answer.id} className="mb-8">
                                        <div className="mb-4">
                                            <h2 className="font-bold">ID da Resposta:</h2>
                                            <p>{answer.id}</p>
                                        </div>
                                        <div className="mb-4">
                                            <h2 className="font-bold">Conteúdo:</h2>
                                            <p>{answer.content}</p>
                                        </div>
                                        <div>
                                            <h2 className="font-bold">Data de Criação:</h2>
                                            <p>{answer.date_creation}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            </div>
        ) : (
            <div></div>
        )
    );
}