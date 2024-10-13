import Menu from "../../components/Menu/Menu";
import { Card, CardBody, CardFooter, Input, Typography } from "@material-tailwind/react";
import {
    MagnifyingGlassIcon,
  } from "@heroicons/react/24/outline";
import bg from '../../assets/img/bg-home.png'
import cancelIcon from '../../assets/img/svg/cancel-icon.svg'
import idIcon from '../../assets/img/svg/id-icon.svg'
import { ICancelBetResponse, IMyBetsReponse, INewBetResponse } from "../../interfaces/BetsInterface";
import { ChangeEvent, useEffect, useState } from "react";
import { deleteBet, getBets, newBet } from "../../services/Bet";
import { formatDateTime } from "../../utils/formatDateTime";
import { formatCurrency } from "../../utils/formatCurrency";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import { toast } from "react-toastify";
import { useBalance } from "../../context/useBalance";
import Wallet from "../../components/Wallet/Wallet";

const TABLE_HEAD = ["Identificador", "Valor", "Resultado", ""];

const Landing = () => {
    const [id, setId] = useState<string>("");
    const [idSearch, setIdSearch] = useState<string>("");
    const [amount, setAmount] = useState("");
    const [filter, setFilter] = useState<string | undefined>("");
    const [openFilter, setOpenFilter] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [openNew, setOpenNew] = useState<boolean>(false);
    const [changeComponent, setChangeComponent] = useState<boolean>(false);
    const [pagesTotal, setPagesTotal] = useState<number>(1);
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
    const { setBalance, balance } = useBalance();
    const tableChange = (): void => {
       setChangeComponent(!changeComponent)
    };
    const handleOpen = (idf?: string) => {
        if (idf) {
            setId(idf)
        } else {
            setId("")
        }
        console.log(id);
        setOpen(!open)
    };
    const handleOpenNew = () => {
        setOpenNew(!openNew)
        if (openNew === false) {
            setAmount("");
        }
    };
    function formatPagination(valor: number): number {
        return Math.ceil(valor);
    }
    const fetchBets = async (page: number, limit: number, id?: string, status?: string) => {
        try {
            const response: IMyBetsReponse = await getBets({ id: id, status: status, page: page, limit: limit });
            setDataBets(response);
            setPagesTotal(formatPagination(response.total / 15))
        } catch (e) {
            console.log(e);
        }
    }

    const cancelBet = async () => {
        const load = toast.loading('Cancelando Aposta');
        try {
            const response: ICancelBetResponse = await deleteBet(id);
            toast.update(load, { render: "Aposta Cancelada!", type: "success", isLoading: false, autoClose: 3000 });
            console.log(response);
            handleOpen();
            fetchBets(1, 15);
            setBalance(response.balance)
        } catch (e) {
            console.log(e);
            toast.done(load);
        }
    }

    const createBet = async () => {
        const value = parseBRLToNumber(amount)
        if (value < 1) {
            return toast("O valor precisa ser no minimo R$01,00", { type: 'error' })
        }
        if (value > balance) {
            return toast("Você não possuí dinheiro para fazer esta aposta!", { type: 'error' })
        }
        const load = toast.loading('Fazendo Aposta');
        try {
            const response: INewBetResponse = await newBet({ amount: value })
            console.log(response);
            toast.update(load, { render: "Aposta Realizada!", type: "success", isLoading: false, autoClose: 3000 });
            handleOpenNew();
            fetchBets(1, 15);
            setBalance(response.balance)
        } catch (e) {
            console.log(e);
            toast.done(load);
        }
    }

    const formatToBRL = (value: string) => {
        const numericValue = value.replace(/\D/g, "");
        const formattedValue = (Number(numericValue) / 100).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
        return formattedValue;
    };

    const parseBRLToNumber = (value: string) => {
        if (!value) return 0;
        const numericValue = value
            .replace(/\./g, "")
            .replace(",", ".")
            .replace(/[^\d.-]/g, "");
        return parseFloat(numericValue);
    };

    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        const formattedValue = formatToBRL(e.target.value);
        setAmount(formattedValue);
    };

    const paginationHandler = (page: 'first' | 'back' | 'next' | 'last') => {
        if (dataBets.total <= 15) {
            return
        }
        if (dataBets.page < pagesTotal && page === 'next') {
            fetchBets(dataBets.page + 1, 15, undefined, filter)
        } else if (dataBets.page < pagesTotal && page === 'last') {
            fetchBets(pagesTotal, 15, undefined, filter)
        } else if (dataBets.page > 1 && page === 'back') {
            fetchBets(dataBets.page - 1, 15, undefined, filter)
        } else if (dataBets.page > 1 && page === 'first') {
            fetchBets(1, 15, undefined, filter)
        }
    }

    const search = () => {
        if(!idSearch){
            return toast("Por favor digite um id para fazer a busca!", { type: 'error' }) 
        }

        fetchBets(1, 15, idSearch);
    }

    const searchByType = (type: 'lost' | 'win' | 'canceled'| undefined) => {
        fetchBets(1, 15, undefined, type);
        setFilter(type)
        handleOpenFilter();
    }

    const handleOpenFilter = () => {
        setOpenFilter(!openFilter)
    };

    useEffect(() => {
        fetchBets(1, 15);
    }, [])

    useEffect(() => {
        if(idSearch.length == 0){
            fetchBets(1, 15);
        }
    }, [idSearch])

    return (
        <div className="w-full h-screen min-h-screen flex flex-col items-center bg-cover bg-fixed overflow-auto" style={{ backgroundImage: `url(${bg})` }} >
            <Menu />
            <p className="font-lethalforce text-[18px] lg:text-6xl my-[4%] lg:my-[2%] bg-gradient-to-b from-green-400 to-green-800 inline-block text-transparent bg-clip-text" >Central de Apostas</p>
            <p className="font-lethalforce text-[16px] lg:text-4xl my-[2%] lg:my-[2%] bg-gradient-to-b from-green-400 to-green-800 inline-block text-transparent bg-clip-text" >{changeComponent? 'Minha Carteira' : 'Minhas Apostas'}</p>
            { changeComponent ? (<Wallet onReturn={tableChange}/>) : (<>
            <div className="flex flex-col lg:flex-row w-10/12 max-w-[1140px] items-center justify-between px-2 py-2 my-[1%] bg-white rounded-xl gap-2">
                <div className="flex gap-2 w-full lg:w-auto">
                    <div className="w-full md:w-72 flex ">
                        <Input
                            crossOrigin={undefined}
                            label="Procurar id"
                            onChange={(e) => setIdSearch(e.target.value)}
                        />
                    </div>
                    <Button onClick={() => search()} className="flex items-center" size="sm">
                        <MagnifyingGlassIcon className="h-5 w-5" />
                    </Button>
                </div>
                <div className="flex gap-2 flex-col lg:flex-row w-full lg:w-auto">
                    <Button onClick={handleOpenFilter} className="flex items-center" size="sm">
                        FIltro
                    </Button>
                    <Button onClick={tableChange} className="flex items-center" size="sm">
                        Carteira
                    </Button>
                    <Button onClick={handleOpenNew} color="green" className="flex items-center" size="sm">
                        Nova Aposta
                    </Button>
                </div>
            </div>
            <div className="flex items-center justify-center max-w-[1140px] w-10/12 mb-[2%]">
                <Card className="h-full w-full lg:w-full overflow-x-auto p-4">
                    {dataBets.data.length > 0 ?(<>
                    <table className="w-full min-w-max table-auto text-left">
                        <thead>
                            <tr>
                                {TABLE_HEAD.map((head) => (
                                    <th key={head} className="border-b border-blue-gray-100 p-4">
                                        <Typography
                                            variant="paragraph"
                                            color="blue-gray"
                                            className="leading-none font-extrabold"
                                        >
                                            {head}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {dataBets.data.map(({ id, createdAt, amount, winAmount, status }) => (
                                <tr key={id} className="border-b border-blue-gray-100">
                                    <td className="p-4 flex gap-x-4">
                                        <img src={idIcon} alt="icon" className="w-[32px]" />
                                        <div className="">
                                            <Typography variant="small" color="blue-gray" className="font-semibold">
                                                {id}
                                            </Typography>
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {formatDateTime(createdAt)}
                                            </Typography>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <Typography variant="small" color="blue-gray" className="font-semibold">
                                            {formatCurrency(amount)}
                                        </Typography>
                                    </td>
                                    <td className="p-4">
                                        <Typography variant="small" color="blue-gray" className="font-semibold" style={{ color: status === 'win' ? '#4caf4f' : status === 'canceled' ? 'orange' : '#eb4034' }}>
                                            {status === 'win' ? `+ ${formatCurrency(winAmount)} ↑` : status === 'canceled' ? 'CANCELADO' : `- ${formatCurrency(amount)} ↓`}
                                        </Typography>
                                    </td>
                                    <td className="p-4">
                                        {status === 'canceled' ? null : (<img onClick={() => handleOpen(id)} className="w-7 cursor-pointer" src={cancelIcon} alt="icon" />)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="w-full flex items-center justify-center gap-x-2 my-2">
                        <div className="flex gap-x-2">
                            <button onClick={() => paginationHandler('first')} className="bg-green-500 px-2 rounded-md text-white">{'<<'}</button>
                            <button onClick={() => paginationHandler('back')} className="bg-green-500 px-2 rounded-md text-white">{'<'}</button>
                        </div>
                        {dataBets.page}/{pagesTotal}
                        <div className="flex gap-x-2">
                            <button onClick={() => paginationHandler('next')} className="bg-green-500 px-2 rounded-md text-white">{'>'}</button>
                            <button onClick={() => paginationHandler('last')} className="bg-green-500 px-2 rounded-md text-white">{'>>'}</button>
                        </div>
                    </div>
                    </>):(<div className="w-full flex items-center justify-center h-96">
                        <p className="font-lethalforce text-[16px] lg:text-4xl my-[2%] lg:my-[2%] bg-gradient-to-b from-green-400 to-green-800 inline-block text-transparent bg-clip-text" >Nenhum dado encontrado</p>
                    </div>)}
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
                        onClick={() => handleOpen()}
                    >
                        <span>Cancelar</span>
                    </Button>
                    <Button onClick={() => cancelBet()} variant="gradient" color="green">
                        <span>Confirmar</span>
                    </Button>
                </DialogFooter>
            </Dialog>
            <Dialog
                size="xs"
                open={openNew}
                handler={handleOpenNew}
                className="bg-transparent shadow-none"
            >
                <Card className="mx-auto w-full max-w-[24rem] max-h-[600px] lg:max-h-full overflow-auto">
                    <CardBody className="flex flex-col gap-4">
                        <Typography variant="h4" color="blue-gray">
                            Apostar
                        </Typography>
                        <Typography className="-mb-2" variant="h6" color="green">
                            Saldo na carteira: {formatCurrency(balance)}
                        </Typography>
                        <Typography className="-mb-2" variant="h6">
                            Qual valor?
                        </Typography>
                        <Input
                            crossOrigin={undefined}
                            label="Valor"
                            size="lg"
                            name="amount"
                            value={amount}
                            onChange={handleAmountChange}
                        />
                    </CardBody>
                    <CardFooter className="flex gap-x-2 pt-0">
                        <Button onClick={handleOpenNew} variant="outlined" fullWidth>
                            cancelar
                        </Button>
                        <Button onClick={() => createBet()} variant="gradient" fullWidth>
                            Apostar
                        </Button>
                    </CardFooter>
                </Card>
            </Dialog>
            <Dialog
                size="xs"
                open={openFilter}
                handler={handleOpenFilter}
                className="bg-transparent shadow-none"
            >
                <Card className="mx-auto w-full max-w-[24rem] max-h-[600px] lg:max-h-full overflow-auto">
                    <CardBody className="flex flex-col gap-4">
                        <Button onClick={() => searchByType(undefined)} variant="gradient" fullWidth>
                            Todos
                        </Button>
                        <Button onClick={() => searchByType('lost')} color="red" variant="gradient" fullWidth>
                            Perdeu
                        </Button>
                        <Button onClick={() => searchByType('win')} color="green" variant="gradient" fullWidth>
                            Ganhou
                        </Button>
                        <Button onClick={() => searchByType('canceled')} color='orange' variant="gradient" fullWidth>
                            cancelado
                        </Button>
                    </CardBody>
                </Card>
            </Dialog>
        </>)}
        </div>
    )
}
export default Landing;