import { Badge } from "primereact/badge";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import TreeNode from "primereact/treenode";
import React, { useEffect, useState } from 'react';
import Inscritos from "../components/Inscritos";
import { ComprasVendinhaModal } from "../components/vendinha/ComprasVendinhaModal";
import { NovaCompraVendinhaModal } from "../components/vendinha/NovaCompraVendinhaModal";
import { NovoCompradorVendinhaModal } from "../components/vendinha/NovoCompradorVendinhaModal";
import { consultarProdutos } from "../service/database";
import { Inscrito, Venda } from "../types/Inscrito";
import { Produto } from "../types/Produto";

const Vendinha: React.FC = () => {
    const [produtos, setProdutos] = useState<Produto[]>([]);

    useEffect(() => {
        (async () => {
            let _produtos = await consultarProdutos();
            setProdutos(_produtos);
        })();
    }, []);

    const buildSaldoColumn = (tree: TreeNode) => {
        if (tree.children) {
            let saldoGrupo = tree.children.reduce(function (am, child) {
                let saldoChild = child.data.vendinha?.reduce(
                    (sa: number, venda: Venda) => sa + (venda.pago ? 0 : (Number.parseInt(venda.quantidade!) * venda.valor)), 0.0);
                return am + (saldoChild || 0);
            }, 0.0);
            return saldoGrupo > 0 ? <Badge
                value={"Saldo devedor"}
                severity={"warning"}
                size="large"
            ></Badge> : '';
        } else {
            let saldoGrupo = tree.data.vendinha?.reduce(
                (sa: number, venda: Venda) => sa + (venda.pago ? 0 : (Number.parseInt(venda.quantidade!) * venda.valor)), 0.0)
            return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(saldoGrupo || 0);
        }
    }

    const buildTotalHeader = (nodes: TreeNode[]) => {
        let amountNodes = 0;
        for (let node of nodes) {
            for (let child of node.children!) {
                let inscrito: Inscrito = child.data;
                if (inscrito.vendinha && inscrito.vendinha.length) {
                    amountNodes += inscrito.vendinha.reduce((a, venda) => a + (venda.valor * Number.parseInt(venda.quantidade!)), 0);            
                } 
            }
        }
        
        return <span className="font-bold py-3 sm:py-0">Total de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
            .format(amountNodes)}</span>;
    }

    return <section>
        <div className="flex justify-content-between align-items-center">
            <h2>Vendinha</h2>
            <NovoCompradorVendinhaModal />
        </div>
        <Card>
            <Inscritos header={buildTotalHeader}>
                <Column
                    field="telefone"
                    header="Telefone"
                    headerClassName="sm-invisible w-14rem"
                    bodyClassName="sm-invisible w-14rem"
                    className="text-2xl py-3 w-14rem">
                </Column>
                <Column
                    header="Saldo devedor"
                    headerClassName="w-full sm:w-25rem"
                    bodyClassName="w-full sm:w-25rem"
                    className="text-2xl py-3 w-full sm:w-25rem"
                    body={linha => buildSaldoColumn(linha)}>
                </Column>
                <Column
                    header=""
                    headerClassName="w-full sm:w-25rem"
                    bodyClassName="w-full sm:w-25rem"
                    className="text-2xl py-3 w-full sm:w-25rem"
                    body={linha => !linha.children && <div key={linha.key} className="flex justify-content-end align-items-center gap-2">
                        <NovaCompraVendinhaModal inscrito={linha.data} produtos={produtos} />
                        <ComprasVendinhaModal inscrito={linha.data} />
                    </div>}>
                </Column>
            </Inscritos>
        </Card>
    </section>;
}

export default Vendinha;