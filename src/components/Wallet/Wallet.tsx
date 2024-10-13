import { Card, Input, Typography } from "@material-tailwind/react";
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

interface ChildComponentProps {
    onReturn: () => void;
}

const TABLE_HEAD = ["Identificador", "Valor", "Tipo"];
const Wallet: FC<ChildComponentProps> = ({ onReturn }) => {
    const [idSearch, setIdSearch] = useState<string>("");
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
            const response: IWalletReponse = await getTransactions({ id: id, status: status, page: page, limit: limit });
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
            fetchWallet(dataWallet.page + 1, 15)
        } else if (dataWallet.page < pagesTotal && page === 'last') {
            fetchWallet(pagesTotal, 15)
        } else if (dataWallet.page > 1 && page === 'back') {
            fetchWallet(dataWallet.page - 1, 15)
        } else if (dataWallet.page > 1 && page === 'first') {
            fetchWallet(1, 15)
        }
    }

    const search = () => {
        if (!idSearch) {
            return toast("Por favor digite um id para fazer a busca!", { type: 'error' })
        }

        fetchWallet(1, 15, idSearch);
    }

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
                <div className="flex gap-2 flex-wrap">
                    <div className="w-full md:w-72 flex ">
                        <Input
                            label="Procurar id"
                            onChange={(e) => setIdSearch(e.target.value)}
                        />
                    </div>
                    <Button onClick={() => search()} className="flex items-center" size="sm">
                        Buscar
                    </Button>
                </div>
                <Button onClick={onReturn} color="green" className="flex items-center  justify-center" size="sm">
                    Voltar para apostas
                </Button>
            </div>
            <div className="flex items-center justify-center max-w-[1140px] w-full mb-[2%]">
                <Card className="h-full w-10/12 lg:w-full overflow-x-scroll p-4">
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
                            {dataWallet.data.map(({ id, createdAt, amount, type }, index) => (
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
                </Card>
            </div>
        </>
    )
}
export default Wallet;