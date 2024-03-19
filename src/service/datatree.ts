import TreeNode from "primereact/treenode";
import celulasJson from "./../celulas.json";
import { Inscrito } from "../types/Inscrito";
import cargos from './../cargos.json'

export const parseInscritos = (data: any): TreeNode[] => {
    let celulas = Object
        .entries(data)
        .map(([celula, inscritos]) => {
            let rede = celulasJson.find(c => c.code == celula);
            let children = Object
                .values(inscritos as Inscrito[]);

            let nome = /^\d+$/.test(celula)
                ? `Refúgio ${celula}`
                : `${celula[0].toUpperCase()}${celula.slice(1)}s`;

            return {
                "key": `${nome}`,
                "data": {
                    "nome": nome,
                    "rede": rede?.rede,
                    "convidado": !(/^\d+$/.test(celula)),
                    "sort": celula == 'supervisores' ? 0 : 1
                },
                "children": parseChildren(nome, children)
            };
        })

    celulas.sort(sortParse);
    return celulas as TreeNode[];
}

const parseChildren = (rede: any, inscritos: Inscrito[]) => {
    let _inscritos = inscritos.map((inscrito, i) => {
        return {
            "key": `${rede} ${inscrito.cpf}`,
            "data": {
                ...inscrito,
                sort: cargos.indexOf(inscrito.cargo!)
            }
        };
    });

    _inscritos.sort(sortParse);
    return _inscritos;
}

const sortParse = (a: TreeNode, b: TreeNode) => {
    return a.data.sort >= b.data.sort ? 1 : -1;
}