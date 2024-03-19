import { uuidv4 } from "@firebase/util";
import { ref as refDatabase, set } from "firebase/database";
import { getDownloadURL, ref as refStorage, uploadString } from "firebase/storage";
import { storage, database } from "../config/firebase";
import { Inscrito } from "../types/Inscrito";
import { DadosNovaInscricao } from "../pages/NovaInscricao";

const filetypes: { [key: string]: string } = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "application/pdf": "pdf"
}

const exportType = (file: string) => 
    file.substring("data:".length, file.indexOf(";base64"));

export const validateFile = (file: string) => {
    let type = exportType(file);
    if (!Object.keys(filetypes).includes(type!)) {
        return null;
    }

    return type;
}

export const saveComprovante = async (dados: DadosNovaInscricao, inscritos: Inscrito[]) => {
    let date = new Date();
    let dateString = date.toLocaleDateString("pt-BR", { dateStyle: "short" });
    let path = `comprovantes/${dateString.replaceAll('/', ' ')}/${uuidv4().replaceAll('-', '')}`;

    let type = validateFile(dados?.comprovante!);
    let comprovanteStorageRef = refStorage(storage, `${path}.${filetypes[type!]}`);
    let uploadFile = await uploadString(comprovanteStorageRef, dados?.comprovante!, 'data_url');
    let url = await getDownloadURL(uploadFile.ref);

    let comprovanteDatabaseRef = refDatabase(database, path);
    let inscritosComprovante = Object.fromEntries(inscritos
        .map(({cpf, nome, celula, parcelas}) => [cpf.replaceAll(/[.-]/g, ""), {celula, nome, parcelas}]))

    set(comprovanteDatabaseRef, {
        inscritos: inscritosComprovante,
        valor: dados.valorComprovante,
        comprovante: url,
        data: date.toLocaleString("pt-BR", { dateStyle: "full", timeStyle: "short" })
    });

    return {
        path,
        url
    };
}

export const saveDocumentos = async (inscrito: Inscrito) => {
    if (inscrito.documentos) {
        for (let i in inscrito.documentos) {
            let documento = inscrito.documentos[i];
            
            let type = exportType(documento);
            let path = `documentos/${inscrito.celula}/${inscrito.cpf}/${uuidv4()}`;

            let comprovanteStorageRef = refStorage(storage, `${path}.${filetypes[type!]}`);
            let uploadFile = await uploadString(comprovanteStorageRef, documento!, 'data_url');
            let url = await getDownloadURL(uploadFile.ref);

            inscrito.documentos[i] = url;
        }
    }

    return inscrito;
}