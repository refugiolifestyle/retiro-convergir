import {FC, Fragment, RefObject, useCallback, useContext, useRef, useState} from 'react';
import {Button} from 'primereact/button';
import {Dialog} from 'primereact/dialog';
import {Dropdown} from 'primereact/dropdown';
import {InputMask} from 'primereact/inputmask';
import {Inscrito} from '../../types/Inscrito';
import {Toast} from 'primereact/toast';
import {ToastContext} from '../../App';
import {FileUpload, FileUploadRemoveParams, FileUploadSelectParams} from 'primereact/fileupload';
import cargos from './../../cargos.json'
import {saveVendinhaInscritos} from "../../service/database";

export const NovoCompradorVendinhaModal: FC = () => {
    const toast = useContext<RefObject<Toast> | null>(ToastContext);
    const [visible, setVisible] = useState(false);
    const [nomeRef, setNomeRef] = useState<string>('');
    const [cpfRef, setCpfRef] = useState<string>('');
    const [telefoneRef, setTelefoneRef] = useState<string>('');

    const adicionarInscrito = useCallback(async () => {
        const cpf = cpfRef;
        const nome = nomeRef;
        const telefone = telefoneRef;

        if (!cpf || !nome || !telefone) {
            toast?.current?.show({
                summary: 'Erro ao avançar',
                detail: 'Campos precisam ser preenchidos',
                severity: 'error'
            });
            return;
        }

        let inscrito: Inscrito = {
            cpf,
            nome,
            telefone
        };

        await saveVendinhaInscritos(inscrito);

        setVisible(false);
    }, [setVisible, cpfRef, nomeRef, telefoneRef]);


    const optionTemplate = (option: any) => {
        return (
            <div className="text-2xl ml-3">
                {option.label}
            </div>
        );
    }

    const groupedItemTemplate = (option: any, index: number) => {
        return (
            <div className="text-2xl font-bold">
                {option.label}
            </div>
        );
    }

    const abrirModal = () => {
        setNomeRef('');
        setCpfRef('');
        setTelefoneRef('');

        setVisible(true);
    }

    return <Fragment>
        <Button
            icon="pi pi-plus"
            label="Cadastrar novo comprador"
            className="p-button-raised p-button-success h-3rem"
            onClick={() => abrirModal()}/>
        <Dialog
            closable={false}
            visible={visible}
            onHide={() => setVisible(false)}
            style={{width: '90%', maxWidth: '75rem'}}
            header={<h2>Cadastre um novo comprador da vendinha</h2>}
            footer={<div className="flex justify-content-end align-items-center mb-3">
                <Button
                    label="Cancelar"
                    icon="pi pi-times"
                    className="p-button-text p-button-danger h-3rem"
                    onClick={() => setVisible(false)}/>
                <Button
                    label="Finalizar"
                    icon="pi pi-check"
                    className="p-button-raised p-button-success h-3rem"
                    onClick={() => adicionarInscrito()}/>
            </div>}>
            <div className="formgrid grid pb-2">
                <div className="field col-12 md:col-3">
                    <label htmlFor="cpf" className="text-2xl font-light">Cpf *</label>
                    <InputMask id="cpf"
                               mask="999.999.999-99"
                               value={cpfRef!}
                               onChange={event => setCpfRef(event.target.value)}
                               className="text-2xl text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full h-3rem"></InputMask>
                </div>
            </div>
            <div className="formgrid grid pb-2">
                <div className="field col-12 md:col-8">
                    <label htmlFor="nome" className="text-2xl font-light">Nome *</label>
                    <input onChange={(e) => setNomeRef(e.target.value)} value={nomeRef!} id="nome"
                           className="text-2xl text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full h-3rem"/>
                </div>
                <div className="field col-12 md:col-4">
                    <label htmlFor="telefone"
                           className="text-2xl font-light">Telefone *</label>
                    <InputMask mask="(99) 99999-9999" onChange={event => setTelefoneRef(event.target.value)}
                               value={telefoneRef!} id="telefone"
                               className="text-2xl text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full h-3rem"></InputMask>
                </div>
            </div>
        </Dialog>
    </Fragment>;
}
