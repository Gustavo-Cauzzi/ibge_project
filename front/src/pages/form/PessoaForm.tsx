import { Autocomplete, Button, TextField } from "@mui/material";
import React from "react";
import { Control, Controller, useFieldArray, UseFormRegister } from "react-hook-form";
import { FiPlus, FiTrash } from "react-icons/fi";
import { defaultPessoa, FormDefaultValues } from ".";
import { escolaridadeOptions } from "../../shared/@types/form";

interface PessoaFormProps {
  control: Control<FormDefaultValues, any>;
  register: UseFormRegister<FormDefaultValues>;
}

const formatCpf = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  e.target.value = e.target.value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return e;
};

export const PessoaForm: React.FC<PessoaFormProps> = ({ control, register }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "pessoas",
  });

  return (
    <div className="gap-2 flex flex-col">
      <div className="flex w-full justify-between mb-4">
        <h1 className="text-3xl text-main">Pessoas do domicílio</h1>
      </div>

      {fields.map((_pessoa, i, arr) => (
        <React.Fragment key={i}>
          <div className="flex w-full justify-between">
            <h1 className="text-xl">Pessoa {i + 1}</h1>

            <Button startIcon={<FiTrash />} onClick={() => remove(i)} disabled={!(arr.length - 1)}>
              Excluir
            </Button>
          </div>

          <div className="flex w-full gap-2 flex-col">
            <div className="flex w-full gap-2 flex-col xsmd:flex-row">
              <Controller
                control={control}
                name={`pessoas.${i}.cpf`}
                render={({ field }) => (
                  <TextField
                    {...field}
                    onChange={(e) => field.onChange(formatCpf(e))}
                    className="flex-[0.3]"
                    label="CPF"
                    fullWidth
                    placeholder="123.456.789-00"
                  />
                )}
              />

              <div className="flex flex-[0.7] gap-2 flex-col xsmd:flex-row">
                <Controller
                  control={control}
                  name={`pessoas.${i}.nome`}
                  render={({ field }) => (
                    <TextField {...field} className="flex-[0.75]" label="Nome" fullWidth placeholder="João da Silva" />
                  )}
                />

                <Controller
                  control={control}
                  name={`pessoas.${i}.idade`}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="flex-[0.25]"
                      label="Idade"
                      placeholder="20"
                      fullWidth
                      type="number"
                      InputProps={{ inputProps: { min: 0 } }}
                    />
                  )}
                />
              </div>
            </div>

            <div className="w-full">
              <Controller
                control={control}
                name={`pessoas.${i}.escolaridade`}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    value={field.value}
                    options={escolaridadeOptions}
                    getOptionLabel={(option) => option.description}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderInput={(params) => <TextField {...params} placeholder="Escolaridade" label="Escolaridade" />}
                  />
                )}
              />
            </div>
          </div>

          {arr.length - 1 !== i && <hr className="my-3" />}
        </React.Fragment>
      ))}

      <div className="flex mt-8 mb-4">
        <Button startIcon={<FiPlus />} variant="outlined" onClick={() => append(defaultPessoa)}>
          Nova pessoa
        </Button>
      </div>
    </div>
  );
};
