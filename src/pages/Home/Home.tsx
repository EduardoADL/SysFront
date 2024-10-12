import Menu from "../../components/Menu/Menu";
import bg from '../../assets/img/bg-home.png'

const Home = () => {
    return(
        <div className="flex items-center flex-col w-screen h-screen bg-cover" style={{backgroundImage:`url(${bg})`}}>
            <Menu/>
            <div className="flex w-9/12 mt-20 lg:mt-[200px] justify-center flex-col">
                <p className="font-body text-white text-xl lg:text-3xl">Bem vindo ao</p>
                <p className="font-lethalforce text-white text-5xl lg:text-9xl"><span className="text-green-500">LET's</span> BET</p>
                <p className="mt-[20px] lg:w-1/2 font-body text-gray-600 text-base lg:text-lg">Entre no jogo e aposte no seu sucesso! Com nossa plataforma, você tem acesso às melhores opções de apostas, desde esportes até jogos ao vivo. Experimente agora e transforme sua paixão em ganhos reais. A sorte está a um clique de distância!</p> 
            </div>
            <button className="animate-pulse font-lethalforce w-9/12 mt-[7%] mb-[10%] bg-white rounded-xl p-4 text-green-500 text-xl lg:text-5xl">Acesse ou crie sua conta agora!</button>
        </div>
    )
}
export default Home;