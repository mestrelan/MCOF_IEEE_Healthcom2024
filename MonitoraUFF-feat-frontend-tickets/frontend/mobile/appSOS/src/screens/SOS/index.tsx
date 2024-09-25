import { Text, Image, TouchableOpacity, View, Alert } from 'react-native'
import axios from 'axios';
import { Container, Imagem } from './styles';

interface SOSProps {
    route: {
        params: {
            tokenRecebido: {token:string}
        };
    };
}

export default function SOS({route}:SOSProps){
    const { token } = route.params.tokenRecebido;
    console.log(token)
    const dados = {
        description:'teste chamado'
    }
    const postTicket = async () => {
        try {
            const response = await axios.post('http://192.168.1.2:5000/SOSButton', dados,
            {
                headers: {
                'Authorization': token
            }
            });
            Alert.alert("Chamado enviado com sucesso!")
        } catch (error) {
            console.error("Erro ao enviar chamado: ", error);
        }
    };

    return(
        <Container>
                <TouchableOpacity onPress={postTicket}>
                        <Imagem source={require('../../../assets/sos.png')}/>
                </TouchableOpacity>
        </Container> 
    );
}










































































