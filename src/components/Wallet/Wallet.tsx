import { Card, CardBody, Dialog, Input, Typography } from "@material-tailwind/react";
import idIcon from '../../assets/img/svg/id-icon.svg'
import { FC, useEffect, useState } from "react";
import { formatDateTime } from "../../utils/formatDateTime";
import { formatCurrency } from "../../utils/formatCurrency";
import {
    Button,
} from "@material-tailwind/react";
import { toast } from "react-toastify";
import { IWalletReponse } from "../../interfaces/WalletInterface";
import { getTransactions } from "../../services/wallet";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface ChildComponentProps {
    onReturn: () => void;
}

const TABLE_HEAD = ["Identificador", "Valor", "Tipo"];
const Wallet: FC<ChildComponentProps> = ({ onReturn }) => {
    const [idSearch, setIdSearch] = useState<string>("");
    const [filter, setFilter] = useState<string | undefined>("");
    const [openFilter, setOpenFilter] = useState<boolean>(false);
    const [pagesTotal, setPagesTotal] = useState<number>(1);
    const [dataWallet, setDataWallet] = useState<IWalletReponse>({
        data: [
            {
                id: "",
                createdAt: "",
                amount: 0,
                type: ""
            }
        ],
        total: 0,
        page: 0,
        limit: 0
    })
    function formatPagination(valor: number): number {
        return Math.ceil(valor);
    }
    const fetchWallet = async (page: number, limit: number, id?: string, status?: string) => {
        try {
            const response: IWalletReponse = await getTransactions({ id: id, type: status, page: page, limit: limit });
            setDataWallet(response);
            setPagesTotal(formatPagination(response.total / 15))
        } catch (e) {
            console.log(e);
        }
    }



    const paginationHandler = (page: 'first' | 'back' | 'next' | 'last') => {
        if (dataWallet.total <= 15) {
            return
        }
        if (dataWallet.page < pagesTotal && page === 'next') {
            fetchWallet(dataWallet.page + 1, 15, undefined, filter)
        } else if (dataWallet.page < pagesTotal && page === 'last') {
            fetchWallet(pagesTotal, 15, undefined, filter)
        } else if (dataWallet.page > 1 && page === 'back') {
            fetchWallet(dataWallet.page - 1, 15, undefined, filter)
        } else if (dataWallet.page > 1 && page === 'first') {
            fetchWallet(1, 15, undefined, filter)
        }
    }

    const search = () => {
        if (!idSearch) {
            return toast("Por favor digite um id para fazer a busca!", { type: 'error' })
        }

        fetchWallet(1, 15, idSearch);
    }

    const searchByType = (type: 'bet' | 'win' | 'cancel'| undefined) => {
        fetchWallet(1, 15, undefined, type);
        setFilter(type)
        handleOpenFilter();
    }

    const handleOpenFilter = () => {
        setOpenFilter(!openFilter)
    };

    useEffect(() => {
        fetchWallet(1, 15);
    }, [])

    useEffect(() => {
        if (idSearch.length == 0) {
            fetchWallet(1, 15);
        }
    }, [idSearch])
    return (
        <>
            <div className="flex w-10/12 max-w-[1140px] items-center justify-between px-2 py-2 my-[1%] bg-white rounded-xl flex-wrap gap-2">
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
                    <Button onClick={onReturn} color="green" className="flex items-center" size="sm">
                        Voltar para apostas
                    </Button>
                </div>
            </div>
            <div className="flex items-center justify-center max-w-[1140px] w-10/12  mb-[2%]">
                <Card className="h-full w-full  lg:w-full overflow-x-auto p-4">
                { dataWallet.data.length > 0 ? (<>
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
                            {dataWallet.data.map(({ id, createdAt, amount, type }) => (
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
                                        <Typography variant="small" color="blue-gray" className="font-semibold" style={{ color: type === 'win' ? '#4caf4f' : type === 'bet' ? '#eb4034' : 'orange' }}>
                                            {type === 'bet' ? 'Aposta' : type === 'win' ? 'Ganho' : 'Cancelado'}
                                        </Typography>
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
                        {dataWallet.page}/{pagesTotal}
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
                        <Button onClick={() => searchByType('bet')} color="red" variant="gradient" fullWidth>
                            Apostado
                        </Button>
                        <Button onClick={() => searchByType('win')} color="green" variant="gradient" fullWidth>
                            Ganho
                        </Button>
                        <Button onClick={() => searchByType('cancel')} color='orange' variant="gradient" fullWidth>
                            cancelado
                        </Button>
                    </CardBody>
                </Card>
            </Dialog>
        </>
    )
}
export default Wallet;