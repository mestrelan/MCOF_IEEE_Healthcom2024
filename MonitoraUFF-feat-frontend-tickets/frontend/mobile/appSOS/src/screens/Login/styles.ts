import styled from "styled-components/native";

export const Container = styled.View`
    display: flex;

`;
export const ContainerTextoLogin = styled.View`
    flex: 32%;

    justify-content: flex-end;
    align-items: center;
`;
export const TextoLogin = styled.Text`
    
`;
export const ContainerCaixasTexto = styled.View`
    flex: 63%;
    padding: 20px; 
    align-items: center;
`;
export const ContainerCaixasTextoIndividual = styled.View`
    padding: 20px;
`;
export const TextoCaixas = styled.Text`
    
`;
export const CaixaLogin = styled.TextInput`
    height: 25px;
    width: 200px;
    border-width: 1px;
    justify-content: center;
`;
export const BotaoLogin = styled.TouchableOpacity`
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 40px;
    background-color: #005AAB;
    border-radius: 10px;
`;
export const ContainerImagemLogos = styled.Image`
    flex: 4%;
    width: 100%;
    height: auto;
    align-items: center;
`;
export const ContainerBotao = styled.View`
    padding: 40px;
`;

export const TextoEnvio  = styled.Text`
    color: snow;
`;