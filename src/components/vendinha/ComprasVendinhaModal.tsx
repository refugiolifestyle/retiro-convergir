import {FC, Fragment, useState} from 'react';
import {quitarCompras} from "../../service/database";
import {Inscrito, Venda} from '../../types/Inscrito';
import {Button} from 'primereact/button';
import {Dialog} from 'primereact/dialog';
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Badge} from "primereact/badge";
import {getFormatDate} from "../../service/utils";

export const ComprasVendinhaModal: FC<{ inscrito: Inscrito }> = ({inscrito}) => {
    const [visible, setVisible] = useState(false);

    const pagarCompras = async () => {
        await quitarCompras(inscrito);
        setVisible(false);
    }

    const getTotal = (pago?: boolean) => {
        let compras = inscrito.vendinha as Venda[] || [];

        if (pago !== undefined) {
            compras = compras.filter(compra => compra.pago === pago);
        }

        return compras.reduce((am, compra) => {
            return am + (compra.valor * Number.parseInt(compra.quantidade as string))
        }, 0.0);
    }


    return <Fragment>
        <Button
            icon="pi pi-list"
            tooltip="Visualizar as compras"
            tooltipOptions={{position: "bottom"}}
            className="p-button-outlined p-button-rounded p-button-link p-3"
            onClick={() => setVisible(true)}/>
        <Dialog
            visible={visible}
            onHide={() => setVisible(false)}
            style={{width: '90%', maxWidth: '75rem'}}
            header={<h2>Compras realizadas</h2>}
            footer={getTotal(false) > 0 && <div className="flex justify-content-end align-items-center">
                <Button
                    label="Quitar divida"
                    icon="pi pi-check"
                    className="p-button-raised p-button-success h-3rem"
                    onClick={pagarCompras}/>
            </div>}>
            <div className="flex flex-column p-3 mb-3 gap-3 bg-black-alpha-10">
                <div className="flex justify-content-between align-items-center text-green-700">
                    <span className="font-bold">Total pago:</span>
                    <span>
                            {new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'})
                                .format(getTotal(true))}
                        </span>
                </div>
                <div className="flex justify-content-between align-items-center text-red-700">
                    <span className="font-bold">Total à pagar:</span>
                    <span>
                            {new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'})
                                .format(getTotal(false))}
                        </span>
                </div>
                <div className="flex justify-content-between align-items-center font-bold mt-3">
                    <span>Total geral:</span>
                    <span>
                            {new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'})
                                .format(getTotal())}
                        </span>
                </div>
            </div>
            <DataTable
                stripedRows
                paginator
                rows={5}
                value={inscrito.vendinha as Venda[]}
                emptyMessage="Não foi encontrado resultado">
                <Column
                    field="produto"
                    header="Produto">
                </Column>
                <Column
                    field="data"
                    header="Data da compra"
                    body={({data}) => getFormatDate(data)}></Column>
                <Column
                    field="quantidade"
                    header="Quantidade">
                </Column>
                <Column
                    header="Situação"
                    body={({pago}) =>
                        <Badge
                            value={pago ? "Pago" : "Falta pagar"}
                            severity={pago ? "success" : "warning"}
                            size="large"
                        ></Badge>
                    }></Column>
                <Column
                    header="Valor Total"
                    body={({valor, quantidade}) =>
                        new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'})
                            .format(valor * Number.parseInt(quantidade))
                    }></Column>
            </DataTable>
        </Dialog>
    </Fragment>;
}
