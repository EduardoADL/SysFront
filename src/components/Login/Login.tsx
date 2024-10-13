import React, { useState } from "react";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  CardFooter,
  Typography,
  Input,
} from "@material-tailwind/react";
import { IUserLogin, IUserLoginResponse } from "../../interfaces/AuthInterface";
import { toast } from 'react-toastify';
import { loginUser } from "../../services/Auth";
import { useNavigate } from "react-router-dom";
import { useBalance } from "../../context/useBalance";

interface Params {
  fw: boolean
}

export function Login({ fw }: Params) {
  const navigate = useNavigate();
  const { setBalance } = useBalance();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [data, setData] = useState<IUserLogin>({
    email: "",
    password: "",
  });

  const handleOpen = () => {
    setOpen((cur) => !cur);
    if (open) resetForm();
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const resetForm = () => {
    setData({
      email: "",
      password: "",
    });
    setErrors({});
  };

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
    if (!data.email) {
      newErrors.email = "O e-mail é obrigatório.";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "O e-mail é inválido.";
    }
    if (!data.password) {
      newErrors.password = "A senha é obrigatória.";
    } else if (data.password.length < 6) {
      newErrors.password = "A senha deve ter pelo menos 6 caracteres.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleLogin = async () => {
    if (!validateFields()) {
      return;
    }
    setIsLoading(true);
    const load = toast.loading('Fazendo Login');
    try {
      const response: IUserLoginResponse = await loginUser(data);
      console.log("Usuário logado:", response);
      setOpen(false);

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('token', response.accessToken);
      setBalance(response.balance);
      
      toast.update(load, { render: "Login bem sucedido!", type: "success", isLoading: false, autoClose: 3000 });
      navigate('/landing')
    } catch (error) {
      toast.update(load, { render: "Algo deu Errado", type: "error", isLoading: false, autoClose: 3000 });
      console.error("Erro ao entrar na conta", error);
      if (error instanceof Error) {
        console.error('Erro ao entrar na conta:', error.message);
      }
    } finally {
      setIsLoading(false);
      resetForm();
    }
  };

  return (
    <>
      <Button
        fullWidth={fw}
        variant="outlined"
        size="sm"
        className=""
        onClick={handleOpen}>Entrar</Button>
      <Dialog
        size="xs"
        open={open}
        handler={handleOpen}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-[24rem] max-h-[600px] lg:max-h-full overflow-auto">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
              Entrar
            </Typography>
            <Typography
              className="mb-3 font-normal"
              variant="paragraph"
              color="gray"
            >
              Digite seu E-mail e senha para entrar.
            </Typography>
            <Typography className="-mb-2" variant="h6">
              Seu E-mail
            </Typography>
            <Input
              crossOrigin={undefined}
              label="Email" size="lg"
              name="email"
              onChange={handleInputChange}
              error={!!errors.email}
            />
            {errors.email && <Typography color="red">{errors.email}</Typography>}
            <Typography className="-mb-2" variant="h6">
              Sua senha
            </Typography>
            <Input
              crossOrigin={undefined}
              label="Senha"
              size="lg"
              name="password"
              type="password"
              onChange={handleInputChange}
              error={!!errors.password}
            />
            {errors.password && <Typography color="red">{errors.password}</Typography>}
          </CardBody>
          <CardFooter className="pt-0">
            <Button disabled={isLoading ? true : false} variant="gradient" onClick={handleLogin} fullWidth>
              Entrar
            </Button>
            <Typography variant="small" className="mt-4 flex justify-center">
              Ainda não tem conta?
              <Typography
                as="a"
                href="#signup"
                variant="small"
                color="blue-gray"
                className="ml-1 font-bold"
                onClick={handleOpen}
              >
                Cadastrar
              </Typography>
            </Typography>
          </CardFooter>
        </Card>
      </Dialog>
    </>
  );
}