import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, Container, InputLabel, Select, MenuItem, SelectChangeEvent, Modal } from '@mui/material';
import { DepartureBoard } from '@mui/icons-material';

interface Depart {
    id: number;
    name: string;
}

const CreateTicket: React.FC = () =>{

    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [priority, setPriority] = useState<string | undefined>('');
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
            const resposta = await fetch('http://127.0.0.1:5000/Groups', {
                method: 'GET',
                headers: {
                    'Authorization': token_glpi,
                }});
                if (!resposta.ok) {
                    throw new Error('Erro ao buscar dados');
                }
                const resp = await resposta.json();
                setDepartments(resp);
                } catch (error) {
                  console.error('Erro na requisição:', error);
                }
            };
          
        fetchData();
        }, []);

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
      };
    
      const handleContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setContent(event.target.value);
      };
    const handlePriorityChange  = (event: SelectChangeEvent<string>) => {
        setPriority(event.target.value as string);
      };
    
      const handleDepartmentChange = (event: SelectChangeEvent<string>) => {
        setDepartment(event.target.value);
      };
    
      const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('Name:', name);
        console.log('Content:', content);
        console.log('Priority:', priority);
        console.log('Department:', department);
        const fetchData = async () => {
            try {
                const token_glpi = sessionStorage.getItem("@AuthFirebase:token_glpi");
                const data = {
                    "name" : name,
                    "content": content,
                    "priority": priority,
                    "department": department
                };
                if (!token_glpi) {
                    throw new Error('Token de autorização não fornecido.');
                }
                const resposta = await fetch('http://127.0.0.1:5000/Ticket', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token_glpi,
                    },
                    body: JSON.stringify(data)
                    });
                    if (!resposta.ok) {
                        throw new Error('Erro ao criar Ticket');
                    }
                    setName('');
                    setContent('');
                    setDepartment('');
                    setPriority('');
                    setShowModal(true);
                    
                    } catch (error) {
                      console.error('Erro na requisição:', error);
                      setShowModalError(true);
                    }
                    
                };
              
            fetchData();
      };

    return(
        <Container maxWidth="xs">
      <Typography variant="h4" align="center" gutterBottom>
        Criar Ticket
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nome"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={handleNameChange}
        />
        <TextField
          label="Descrição"
          variant="outlined"
          fullWidth
          margin="normal"
          value={content}
          onChange={handleContentChange}
        />
        <InputLabel id="demo-simple-select-label">Prioridade</InputLabel>
        <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={priority}
            label="Prioridade"
            onChange={handlePriorityChange}
        >
            <MenuItem value={1}>Muito Baixa</MenuItem>
            <MenuItem value={2}>Baixa</MenuItem>
            <MenuItem value={3}>Média</MenuItem>
            <MenuItem value={4}>Alta</MenuItem>
            <MenuItem value={5}>Muito alta</MenuItem>
            <MenuItem value={6}>Crítica</MenuItem>
        </Select>
        <InputLabel id="demo-simple-select-label">Departamento</InputLabel>
        <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={department}
            label="Departamento"
            onChange={handleDepartmentChange}
        >
        {departments.map((dp, index) => (
            <MenuItem key={index} value={dp.id}>
            {dp.name}
            </MenuItem>
        ))}
        </Select>
       
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Criar Ticket
        </Button>
        <Modal
            open={showModal}
            onClose={() => setShowModal(false)}
            aria-labelledby="modal-title"
                aria-describedby="modal-description"
            ><div>
            <Typography variant="h6" id="modal-title" align="center">
                Ticket criado com sucesso!
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
                Ticket nao foi criado!
            </Typography>
            </div>

        </Modal>
      </form>
    </Container>
    );
}

export default CreateTicket;