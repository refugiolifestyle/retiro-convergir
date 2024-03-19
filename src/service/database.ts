import {get, push, ref, set} from "firebase/database";
import {database} from "../config/firebase";
import {Inscrito, Parcela, Venda} from "../types/Inscrito";
import {saveDocumentos} from "./storage";
import {Produto} from "../types/Produto";

export const consultarPermitirInscricao = async () => {
    let path = `configuracao/permitirInscricao`;
    let permissaoRef = ref(database, path);
    let permissao = await get(permissaoRef);

    return permissao.exists()
        && permissao.val() as boolean;
}

export const consultarPermitirVendinha = async () => {
    let path = `configuracao/permitirVendinha`;
    let permissaoRef = ref(database, path);
    let permissao = await get(permissaoRef);

    return permissao.exists()
        && permissao.val() as boolean;
}

export const consultarProdutos = async () => {
    let produtosRef = ref(database, 'produtos');
    let produtos = await get(produtosRef);

    return produtos.val() as Produto[];
}

const getInscritoPath = (inscrito: Inscrito) => {
    let cpf = inscrito.cpf.replaceAll(/[.-]/g, "");
    return `inscritos/${inscrito.celula}/${cpf}`;
}

export const consultaInscrito = async (inscrito: Inscrito) => {
    let inscritoRef = ref(database, getInscritoPath(inscrito));
    return await get(inscritoRef);
}

export const saveInscritos = async (inscritos: Inscrito[], comprovante: any) => {
    for (let inscrito of inscritos) {
        let inscritoGet = await consultaInscrito(inscrito);

        if (!inscritoGet.exists()) {
            inscrito = await saveDocumentos(inscrito);
            inscrito.parcelas = [{
                quantidade: inscrito.parcelas as string,
                comprovante
            }];
        } else {
            let inscritoSaved = inscritoGet.val() as Inscrito;
            inscrito = {
                ...inscritoSaved,
                parcelas: [
                    ...inscritoSaved.parcelas as Parcela[],
                    {
                        quantidade: inscrito.parcelas as string,
                        comprovante
                    } as Parcela
                ]
            }
        }

        let inscritoParcelaRef = ref(database, getInscritoPath(inscrito));
        await set(inscritoParcelaRef, inscrito);
    }
}

export const saveVendinhaInscritos = async (_inscrito: Inscrito) => {
    let inscrito = {
        ..._inscrito,
        celula: "convidado",
        convidado: true
    };

    let inscritoGet = await consultaInscrito(inscrito);
    if (!inscritoGet.exists()) {
        let inscritoParcelaRef = ref(database, getInscritoPath(inscrito));
        await set(inscritoParcelaRef, inscrito);
    }
}

export const finalizarCompra = async (inscrito: Inscrito, compras: Venda[]) => {
    let inscritoGet = await consultaInscrito(inscrito);
    let inscritoSaved = inscritoGet.val() as Inscrito;

    inscritoSaved = {
        ...inscritoSaved,
        vendinha: [
            ...compras.map(compra => ({
                ...compra,
                data: new Date().toString()
            })),
            ...(inscritoSaved.vendinha || []) as Venda[]
        ]
    }

    let inscritoParcelaRef = ref(database, getInscritoPath(inscrito));
    await set(inscritoParcelaRef, inscritoSaved);
}

export const quitarCompras = async (inscrito: Inscrito) => {
    let inscritoGet = await consultaInscrito(inscrito);
    let inscritoSaved = inscritoGet.val() as Inscrito;

    inscritoSaved = {
        ...inscritoSaved,
        vendinha: [
            ...(inscritoSaved.vendinha || []).map(compra => ({
                ...compra,
                pago: true
            }))
        ]
    }

    let inscritoParcelaRef = ref(database, getInscritoPath(inscrito));
    await set(inscritoParcelaRef, inscritoSaved);
}