import { Autocomplete, Button, TextField } from "@mui/material";
import React from "react";
import { Control, Controller, FieldErrorsImpl, useFieldArray } from "react-hook-form";
import { FiPlus, FiTrash } from "react-icons/fi";
import { defaultPessoa, FormDefaultValues } from ".";
import { formatCpf } from "../../shared/utils/utils";
import { escolaridadeOptions } from "./types";

interface PessoaFormProps {
  control: Control<FormDefaultValues, any>;
  errors: Partial<
    FieldErrorsImpl<{
      idResidencia: number;
      cep: string;
      cidade: string;
      bairro: string;
      estado: {
        id: string;
        estado: string;
      };
      numero: string;
      pessoas: {
        cpf: string;
        nome: string;
        idade: number;
        escolaridade: {
          id: number;
          description: string;
        };
      }[];
    }>
  >;
}

let pessoaKeyIncremental = 1;

const formatCpfEvent = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  e.target.value = formatCpf(e.target.value);
  return e;
};

export const PessoaForm: React.FC<PessoaFormProps> = ({ control, errors: rawErrors }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "pessoas",
  });

  const errors = rawErrors.pessoas ?? [];

  return (
    <div className="gap-2 flex flex-col">
      <div className="flex w-full justify-between mb-4">
        <h1 className="text-3xl text-main">Pessoas do domicílio</h1>
      </div>

      {fields.map((pessoa, i, arr) => (
        <React.Fragment key={pessoa.key}>
          <div className="flex w-full justify-between">
            <h1 className="text-xl">Pessoa {i + 1}</h1>

            <Button startIcon={<FiTrash />} onClick={() => remove(i)} disabled={!(arr.length - 1)}>
              Excluir
            </Button>
          </div>

          <div className="flex w-full gap-6 flex-col">
            <div className="flex w-full gap-2 flex-col xsmd:flex-row">
              <Controller
                control={control}
                name={`pessoas.${i}.cpf`}
                render={({ field }) => (
                  <TextField
                    {...field}
                    onChange={(e) => field.onChange(formatCpfEvent(e))}
                    className="flex-[0.3]"
                    label="CPF"
                    fullWidth
                    placeholder="123.456.789-00"
                    error={!!errors[i]?.cpf}
                    helperText={errors[i]?.cpf?.message ?? ""}
                  />
                )}
              />

              <div className="flex flex-[0.7] gap-2 flex-col xsmd:flex-row">
                <Controller
                  control={control}
                  name={`pessoas.${i}.nome`}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="flex-[0.75]"
                      label="Nome"
                      fullWidth
                      placeholder="João da Silva"
                      error={!!errors[i]?.nome}
                      helperText={errors[i]?.nome?.message ?? ""}
                    />
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
                      error={!!errors[i]?.idade}
                      helperText={errors[i]?.idade?.message ?? ""}
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
                    noOptionsText="Sem resultados"
                    onChange={(_e, newValue) => field.onChange(newValue)}
                    options={escolaridadeOptions}
                    getOptionLabel={(option) => option.description}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Escolaridade"
                        label="Escolaridade"
                        error={!!errors[i]?.escolaridade}
                        helperText={errors[i]?.escolaridade?.message ?? ""}
                      />
                    )}
                  />
                )}
              />
            </div>
          </div>

          {arr.length - 1 !== i && <hr className="my-3" />}
        </React.Fragment>
      ))}

      <div className="flex mt-8 mb-4">
        <Button
          startIcon={<FiPlus />}
          variant="outlined"
          onClick={() => append({ ...defaultPessoa, key: pessoaKeyIncremental++ })}
        >
          Nova pessoa
        </Button>
      </div>
    </div>
  );
};
