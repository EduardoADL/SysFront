import Menu from "../../components/Menu/Menu";
import { Card, Typography } from "@material-tailwind/react";
import bg from '../../assets/img/bg-home.png'
import cancelIcon from '../../assets/img/svg/cancel-icon.svg'
import { IMyBetsReponse } from "../../interfaces/BetsInterface";
import { useEffect, useState } from "react";
import { getBets } from "../../services/Bet";
import { formatDateTime } from "../../utils/formatDateTime";
import { formatCurrency } from "../../utils/formatCurrency";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
  } from "@material-tailwind/react";

const TABLE_HEAD = ["Identificador", "Data", "Valor", "Ganho", "status", ""];

const Landing = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);
    const [dataBets, setDataBets] = useState<IMyBetsReponse>({
        data: [
          {
            id: "",
            createdAt: "",
            amount: 0,
            winAmount: 0,
            status: ""
          }
        ],
        total: 0,
        page: 0,
        limit: 0
      })

    const fetchBets = async(page:number, limit:number,id?:string, status?:string) =>{
        try{
            const response:IMyBetsReponse = await getBets({id:id, status:status, page:page, limit:limit});
            setDataBets(response);
        }catch(e){
            console.log(e);
        }
    }

    useEffect(()=>{
        fetchBets(1,15);
    },[])

    return(
        <div className="w-full h-screen flex flex-col items-center bg-cover bg-scroll" style={{backgroundImage:`url(${bg})`}} >
            <Menu/>
            <p className="font-lethalforce text-xl lg:text-6xl my-[8%] lg:my-[2%] bg-gradient-to-b from-green-400 to-green-800 inline-block text-transparent bg-clip-text" >Central de Apostas</p>
            <div className="flex w-10/12 mt-[2%] items-center justify-between px-2 py-2  bg-white rounded-lg">
                <p className="font-lethalforce text-[8px] lg:text-2xl">Minhas apostas</p>
                <button className="bg-green-500 p-2 lg:p-4 text-xs lg:text-xl rounded-lg text-center text-white font-lethalforce">Nova Aposta +</button>
            </div>
            <div className="flex items-center justify-center w-full mt-[2%]">
                <Card className="h-full w-10/12 overflow-x-scroll">
                <table className="w-full min-w-max table-auto text-left">
                    <thead>
                    <tr>
                        {TABLE_HEAD.map((head) => (
                        <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                            <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal leading-none opacity-70"
                            >
                            {head}
                            </Typography>
                        </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {dataBets.data.map(({ id, createdAt, amount,winAmount,status }, index) => (
                        <tr key={id} className="even:bg-blue-gray-50/50">
                        <td className="p-4">
                            <Typography variant="small" color="blue-gray" className="font-normal">
                            {id}
                            </Typography>
                        </td>
                        <td className="p-4">
                            <Typography variant="small" color="blue-gray" className="font-normal">
                            {formatDateTime(createdAt)}
                            </Typography>
                        </td>
                        <td className="p-4">
                            <Typography variant="small" color="blue-gray" className="font-normal">
                            {formatCurrency(amount)}
                            </Typography>
                        </td>
                        <td className="p-4">
                            <Typography variant="small" color="blue-gray" className="font-normal">
                            {winAmount ? formatCurrency(winAmount) : "Sem ganhos"}
                            </Typography>
                        </td>
                        <td className="p-4">
                            <Typography variant="small" color="blue-gray" className="font-bold text-base" style={{color: status === 'lost' ? 'red' : 'green'}}>
                            {status === 'lost' ? 'Perdeu' : 'Ganhou'}
                            </Typography>
                        </td>
                        <td className="p-4">
                            <img onClick={handleOpen} className="w-7 cursor-pointer" src={cancelIcon} alt="icon"/>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </Card>
            </div>
            <Dialog
                open={open}
                handler={handleOpen}
                animate={{
                mount: { scale: 1, y: 0 },
                unmount: { scale: 0.9, y: -100 },
                }}
            >
        <DialogHeader>Cancelamento</DialogHeader>
        <DialogBody>
            Deseja mesmo cancelar essa aposta?
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            className="mr-1"
            onClick={handleOpen}
          >
            <span>Cancelar</span>
          </Button>
          <Button variant="gradient" color="green">
            <span>Confirmar</span>
          </Button>
        </DialogFooter>
      </Dialog>
        </div>
    )
}
export default Landing;