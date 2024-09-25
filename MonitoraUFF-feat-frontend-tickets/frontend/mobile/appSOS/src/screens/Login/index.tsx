import { Container, TextoLogin, TextoEnvio, ContainerBotao, CaixaLogin, ContainerCaixasTexto, BotaoLogin, ContainerTextoLogin, ContainerCaixasTextoIndividual, TextoCaixas, ContainerImagemLogos } from "./styles";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "react-native/Libraries/NewAppScreen";

export default function Login(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigation = useNavigation();
    function navigateToSecond(tokenRecebido:string) {
        navigation.navigate("SOS", {tokenRecebido});
    }
    const data = {
        username: username,
        password: password
    }
    const postLogin = async () => {
        try {
            const response = await axios.post('http://192.168.1.2:5000/Login', data);
            const tokenRecebido = response.data;
            navigateToSecond(tokenRecebido);
        } catch (error) {
            console.error("Erro ao fazer login:", error);
        }
    };

    return(
        <Container>
            <ContainerTextoLogin>
                <TextoLogin>LOGIN</TextoLogin>
            </ContainerTextoLogin>
            <ContainerCaixasTexto>
                <ContainerCaixasTextoIndividual>
                    <TextoCaixas>Usuário</TextoCaixas>
                    <CaixaLogin onChangeText={(text: string) => setUsername(text)}/>
                </ContainerCaixasTextoIndividual>
                <ContainerCaixasTextoIndividual>
                    <TextoCaixas>Senha</TextoCaixas>
                    <CaixaLogin secureTextEntry={true} onChangeText={(text: string) => setPassword(text)}/>
                </ContainerCaixasTextoIndividual>
                <ContainerBotao>
                    <BotaoLogin onPress={postLogin}><TextoEnvio>Entrar</TextoEnvio></BotaoLogin>
                </ContainerBotao>
            </ContainerCaixasTexto>
            <ContainerImagemLogos source={require('../../../assets/logos.png')}></ContainerImagemLogos>
        </Container>
    );
}
