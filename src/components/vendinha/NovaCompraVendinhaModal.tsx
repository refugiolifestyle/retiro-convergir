import {FC, Fragment, useEffect, useMemo, useState} from 'react';
import {Button} from 'primereact/button';
import {Dialog} from 'primereact/dialog';
import {Inscrito, Venda} from '../../types/Inscrito';
import {Produto} from "../../types/Produto";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {useFieldArray, useForm} from "react-hook-form";
import {finalizarCompra} from "../../service/database";
import {FieldValues} from "react-hook-form/dist/types/fields";

export const NovaCompraVendinhaModal: FC<{ inscrito: Inscrito, produtos: Produto[] }> = ({inscrito, produtos}) => {
    const [visible, setVisible] = useState(false);
    const [totalGeral, setTotalGeral] = useState(0);
    const {control, register, handleSubmit, watch, formState: {errors}} = useForm<{ compras: Venda[] }>();
    const {fields, append, remove} = useFieldArray({
        control,
        name: "compras",
    });

    useEffect(() => {
        const subscription = watch((value) => {
            let totalGeral = value.compras?.reduce((a, c) => {
                return a + (c?.valor! * (c?.quantidade ? Number.parseInt(c.quantidade) : 0));
            }, 0.0);

            setTotalGeral(totalGeral!);
        });

        return () => subscription.unsubscribe();
    }, [watch]);

    const realizarCompra = (pago = true) => async (data: FieldValues) => {
        let compras = data.compras
            .filter((compra: Venda) => compra.quantidade && /^\d+$/.test(compra.quantidade))
            .map((compra: Venda) => ({
                ...compra,
                pago
            }));

        await finalizarCompra(inscrito, compras);

        hideModal();
    }

    const showModal = () => {
        produtos.forEach(produto =>
            append(produto as Venda));

        setVisible(true);
    }
    const hideModal = () => {
        setVisible(false);
        remove();
    }

    return <Fragment>
        <Button
            icon="pi pi-plus"
            tooltip="Fazer uma nova compra"
            tooltipOptions={{position: "bottom"}}
            className="p-button-outlined p-button-rounded p-button-link p-3"
            onClick={() => showModal()}/>
        <Dialog
            visible={visible}
            onHide={hideModal}
            style={{width: '90%', maxWidth: '75rem'}}
            header={<h2>Total {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(totalGeral)}</h2>}
            footer={<div className="flex justify-content-end align-items-center">
                <Button
                    label="Pagar agora"
                    icon="pi pi-check"
                    className="p-button-raised p-button-success h-3rem"
                    onClick={handleSubmit(realizarCompra(true))}/>
                <Button
                    label="Colocar na conta"
                    icon="pi pi-clock"
                    className="p-button-raised p-button-warning h-3rem"
                    onClick={handleSubmit(realizarCompra(false))}/>
            </div>}>
            <form>
                <DataTable value={fields} size="small" stripedRows>
                    <Column
                        field="produto"
                        header="Produto"
                        headerClassName={"py-3"}
                        style={{width: '50%'}}>
                    </Column>
                    <Column
                        field="valor"
                        header="Valor"
                        headerClassName={"py-3"}
                        style={{width: '25%'}}
                        body={({valor}) =>
                            new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(valor)
                        }></Column>
                    <Column
                        header="Quantidade"
                        headerClassName={"py-3"}
                        style={{width: '25%'}}
                        body={(_, {rowIndex}) => <div className="ml-2">
                            <input
                                type="text"
                                className={`text-2xl text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-20rem ${errors?.compras?.[rowIndex] ? 'p-invalid' : ''}`}
                                {...register(`compras.${rowIndex}.quantidade`, {
                                    validate: value => !value || value && /^\d+$/.test(value)
                                })}/>
                            {errors?.compras?.[rowIndex] &&
                                <small className="p-error">Digite uma quantidade fechada</small>}
                        </div>}></Column>
                </DataTable>
            </form>
        </Dialog>
    </Fragment>;
}
