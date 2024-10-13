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
import { createUser } from "../../services/Auth";
import { IUserRegister } from "../../interfaces/AuthInterface";
import { toast } from 'react-toastify';

interface Params {
  fw: boolean;
}

export function SignUp({ fw }: Params) {
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [data, setData] = useState<IUserRegister>({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
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
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
  };

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
    if (!data.name) newErrors.name = "O nome é obrigatório.";
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
    if (data.password !== data.confirmPassword) {
      newErrors.confirmPassword = "As senhas não correspondem.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateUser = async () => {
    if (!validateFields()) {
      return;
    }
    setIsLoading(true);
    const load = toast.loading('Registrando');
    try {
      const newUser = await createUser(data);
      console.log("Usuário criado:", newUser);
      setOpen(false);
      toast.update(load, { render: "Conta criada!", type: "success", isLoading: false, autoClose:3000 });
      setIsLoading(false);
      resetForm();
    } catch (error) {
        toast.update(load, { render: "Algo deu Errado", type: "error", isLoading: false, autoClose:3000 });
        setIsLoading(false);
      console.error("Erro ao criar usuário:", error);
      if (error instanceof Error) {
        console.error('Erro ao criar usuário:', error.message);
      }
    }
  };

  return (
    <>
      <Button
        fullWidth={fw}
        variant="gradient"
        size="sm"
        className=""
        onClick={handleOpen}
      >
        Criar Conta
      </Button>
      <Dialog
        size="xs"
        open={open}
        handler={handleOpen}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-[24rem] max-h-[600px] lg:max-h-full overflow-auto">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
              Cadastro
            </Typography>
            <Typography className="mb-3 font-normal" variant="paragraph" color="gray">
              Digite suas informações para criar a conta.
            </Typography>
            <Typography className="-mb-2" variant="h6">
              Seu Nome
            </Typography>
            <Input
              label="Nome"
              size="lg"
              name="name"
              onChange={handleInputChange}
              error={!!errors.name}
            />
            {errors.name && <Typography color="red">{errors.name}</Typography>}
            
            <Typography className="-mb-2" variant="h6">
              Seu E-mail
            </Typography>
            <Input
              label="Email"
              size="lg"
              name="email"
              onChange={handleInputChange}
              error={!!errors.email}
            />
            {errors.email && <Typography color="red">{errors.email}</Typography>}
            
            <Typography className="-mb-2" variant="h6">
              Sua senha
            </Typography>
            <Input
              label="Senha"
              size="lg"
              name="password"
              type="password"
              onChange={handleInputChange}
              error={!!errors.password}
            />
            {errors.password && <Typography color="red">{errors.password}</Typography>}
            
            <Typography className="-mb-2" variant="h6">
              Confirme sua senha
            </Typography>
            <Input
              label="Confirmar senha"
              size="lg"
              name="confirmPassword"
              type="password"
              onChange={handleInputChange}
              error={!!errors.confirmPassword}
            />
            {errors.confirmPassword && <Typography color="red">{errors.confirmPassword}</Typography>}
          </CardBody>
          <CardFooter className="flex pt-0 gap-x-2">
            <Button variant="outlined" onClick={handleOpen} fullWidth>
              Cancelar
            </Button>
            <Button disabled={isLoading ? true : false} variant="gradient" onClick={handleCreateUser} fullWidth>
              Criar
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
    </>
  );
}
