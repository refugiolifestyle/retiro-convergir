import {FC, Fragment, RefObject, useCallback, useContext, useRef, useState} from 'react';
import {Button} from 'primereact/button';
import {Dialog} from 'primereact/dialog';
import {Dropdown} from 'primereact/dropdown';
import {InputMask} from 'primereact/inputmask';
import {Cargos, Inscrito, Parcela} from '../../types/Inscrito';
import {Toast} from 'primereact/toast';
import {ToastContext} from '../../App';
import {FileUpload, FileUploadRemoveParams, FileUploadSelectParams} from 'primereact/fileupload';
import {validateFile} from '../../service/storage';
import cargos from './../../cargos.json'
import {consultaInscrito} from "../../service/database";
import * as React from "react";

interface Props {
    numeroRestanteDeParcelas: number,
    salvarInscrito: (inscrito: Inscrito) => void
}

const celulas = [
    {
        label: 'Rede 12', code: 'rede12',
        items: [
            {"label": "Refúgio 2", "code": 2},
            {"label": "Refúgio 4", "code": 4},
            {"label": "Refúgio 16", "code": 16},
            {"label": "Refúgio 22", "code": 22},
            {"label": "Refúgio 44", "code": 44},
            {"label": "Refúgio 53", "code": 53},
            {"label": "Refúgio 54", "code": 54},
            {"label": "Refúgio 56", "code": 56},
            {"label": "Refúgio 68", "code": 68},
            {"label": "Refúgio 70", "code": 70},
            {"label": "Refúgio 87", "code": 87},
            {"label": "Refúgio 90", "code": 90},
            {"label": "Refúgio 98", "code": 98},
            {"label": "Refúgio 102", "code": 102},
            {"label": "Refúgio 117", "code": 117},
            {"label": "Refúgio 127", "code": 127},
            {"label": "Refúgio 130", "code": 130},
            {"label": "Refúgio 154", "code": 154}
        ]
    },
    {
        label: 'Rede 17', code: 'rede17',
        items: [
            {"label": "Refúgio 63", "code": 63},
            {"label": "Refúgio 94", "code": 94},
            {"label": "Refúgio 109", "code": 109},
            {"label": "Refúgio 140", "code": 140},
            {"label": "Refúgio 144", "code": 144}s
        ]
    },
];

export const NovoInscritoNovaInscricaoModal: FC<Props> = ({numeroRestanteDeParcelas, salvarInscrito}) => {
    const toast = useContext<RefObject<Toast> | null>(ToastContext);
    const [visible, setVisible] = useState(false);
    const [primeiraParcela, setPrimeiraParcela] = useState(false);
    const [totalParcelas, setTotalParcelas] = useState<number>(3);
    const [celulaRef, setCelulaRef] = useState<string>('');
    const [parcelasRef, setParcelasRef] = useState<string>('');
    const [cargosRef, setCargosRef] = useState<Cargos>();
    const [nomeRef, setNomeRef] = useState<string>('');
    const [cpfRef, setCpfRef] = useState<string>('');
    const [sexoRef, setSexoRef] = useState<string>('M');
    const [dataNascimentoRef, setDataNascimentoRef] = useState<string>('');
    const [telefoneRef, setTelefoneRef] = useState<string>('');
    const [observacaoRef, setObservacaoRef] = useState<string>('');
    const documentosRef = useRef<string[]>([]);

    const adicionarInscrito = useCallback(() => {
        const cpf = cpfRef;
        const celula = celulaRef;
        const parcelas = parcelasRef;

        if (!cpf || !celula || !parcelas) {
            toast?.current?.show({
                summary: 'Erro ao avançar',
                detail: 'Campos precisam ser preenchidos',
                severity: 'error'
            });
            return;
        }

        let inscrito: Inscrito = {celula, parcelas, cpf};
        if (primeiraParcela) {
            const cargo = cargosRef;
            const nome = nomeRef;
            const sexo = sexoRef;
            const dataNascimento = dataNascimentoRef;
            const telefone = telefoneRef;
            const documentos = documentosRef.current;

            if (!cargo || !nome || !sexo || !dataNascimento || !telefone || !documentos.length) {
                toast?.current?.show({
                    summary: 'Erro ao avançar',
                    detail: 'Campos precisam ser preenchidos',
                    severity: 'error'
                });
                return;
            }

            for (let documento of documentos) {
                if (!validateFile(documento)) {
                    toast?.current?.show({
                        summary: 'Erro ao avançar',
                        detail: 'Documentos inválidos',
                        severity: 'error'
                    });
                    return;
                }
            }

            const observacao = observacaoRef!;
            inscrito = {...inscrito, cargo, nome, sexo, dataNascimento, telefone, observacao, documentos};
        } else {
            const nome = nomeRef;
            inscrito = {...inscrito, nome};
        }

        salvarInscrito(inscrito);
        setVisible(false);
    }, [setVisible, salvarInscrito, primeiraParcela, celulaRef, cargosRef, cpfRef, nomeRef, parcelasRef, sexoRef, dataNascimentoRef, telefoneRef, observacaoRef]);


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

    const salvarDocumentos = async (event: FileUploadSelectParams) => {
        let files = Array.from(event.files as File[]);
        for (let file of files) {
            const reader = new FileReader();

            reader.onloadend = function () {
                let data = reader.result as string;
                documentosRef.current.push(data);
            }

            let response = await fetch(file.objectURL);
            reader.readAsDataURL(await response.blob());
        }
    }

    const excluirDocumentos = async (event: FileUploadRemoveParams) => {
        let {file} = event;
        const reader = new FileReader();

        reader.onloadend = function () {
            let data = reader.result as string;
            let newFiles = documentosRef.current.filter(f => f !== data);

            documentosRef.current = newFiles;
        }

        let response = await fetch(file.objectURL);
        reader.readAsDataURL(await response.blob());
    }

    const abrirModal = () => {
        setPrimeiraParcela(false);
        setTotalParcelas(3);
        setCelulaRef('');
        setParcelasRef('');
        setNomeRef('');
        setCpfRef('');
        setSexoRef('M');
        setDataNascimentoRef('');
        setTelefoneRef('');
        setObservacaoRef('');
        setCargosRef(undefined);
        documentosRef.current = [];

        setVisible(true);
    }

    const parcelas = [
        {"label": "1 parcela", "code": 1},
        {"label": "2 parcelas", "code": 2},
        {"label": "3 parcelas", "code": 3},
    ]
        .filter(parcela => {
            if (totalParcelas <= numeroRestanteDeParcelas) {
                return parcela.code <= totalParcelas;
            }
            return parcela.code <= numeroRestanteDeParcelas;
        });

    const onCPFChange = async (event: React.FocusEvent<HTMLInputElement>) => {
        const cpf = cpfRef!;
        const celula = celulaRef!;

        if (cpf && celula) {
            let inscritoParams: Inscrito = {celula, cpf, parcelas: "0"};
            let inscritoSnap = await consultaInscrito(inscritoParams);
            let inscrito: Inscrito = inscritoSnap.val();
            if (inscrito != null) {
                let parcelasRestantes = Array.from(inscrito?.parcelas as Parcela[])
                    .reduce((par, ins) => {
                        return 3 - parseInt(ins.quantidade);
                    }, 0);

                setTotalParcelas(parcelasRestantes);
                setNomeRef(inscrito.nome!);
            } else {
                setTotalParcelas(3);
                setNomeRef('');
            }
        }
    }

    return <Fragment>
        <Button label="Selecionar inscrito" icon="pi pi-plus" className="p-button-raised py-2"
                onClick={() => abrirModal()} disabled={numeroRestanteDeParcelas < 1}/>
        <Dialog
            closable={false}
            visible={visible}
            onHide={() => setVisible(false)}
            style={{width: '90%', maxWidth: '75rem'}}
            header={<h2>Preencha as informações do inscrito</h2>}
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
                <label htmlFor="primeiraParcela" className="col-6 md:col-3 text-2xl font-light">É uma nova
                    inscrição?</label>
                <div className="field col">
                    <input id="primeiraParcela" type="checkbox" checked={primeiraParcela}
                           onChange={(e) => setPrimeiraParcela(!primeiraParcela)}/>
                </div>
            </div>
            <div className="formgrid grid pb-2">
                <div className="field col-12 md:col-3">
                    <label htmlFor="celula" className="text-2xl font-light">Célula *</label>
                    <Dropdown inputId="celula" options={celulas} value={celulaRef} onChange={e => setCelulaRef(e.value)}
                              optionLabel="label" optionValue="code" optionGroupLabel="label"
                              optionGroupChildren="items" itemTemplate={optionTemplate}
                              optionGroupTemplate={groupedItemTemplate}
                              className="text-2xl text-color surface-overlay border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full h-3rem"/>
                </div>
                <div className="field col-12 md:col-3">
                    <label htmlFor="cpf" className="text-2xl font-light">Cpf *</label>
                    <InputMask id="cpf"
                               mask="999.999.999-99"
                               value={cpfRef!}
                               onChange={event => setCpfRef(event.target.value)}
                               className="text-2xl text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full h-3rem"
                               onBlur={onCPFChange}></InputMask>
                </div>
            </div>
            <div className="formgrid grid pb-2">
                <div className="field col-12 md:col-3">
                    <label htmlFor="parcelas" className="text-2xl font-light">Quantidade de parcelas *</label>
                    <Dropdown inputId="parcelas" options={parcelas} value={parcelasRef}
                              onChange={e => setParcelasRef(e.value)} optionLabel="label" optionValue="code"
                              itemTemplate={optionTemplate} optionGroupTemplate={groupedItemTemplate}
                              className="text-2xl text-color surface-overlay border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full h-3rem"/>
                </div>
                <div className="field col-12 md:col">
                    <label htmlFor="nome" className="text-2xl font-light">Nome {primeiraParcela && '*'}</label>
                    <input onChange={(e) => setNomeRef(e.target.value)} value={nomeRef!} id="nome" disabled={!primeiraParcela}
                           className="text-2xl text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full h-3rem"/>
                </div>
                {primeiraParcela && <div className="field col-12 md:col-3">
                    <label htmlFor="cargo" className="text-2xl font-light">Cargo {primeiraParcela && '*'}</label>
                    <Dropdown inputId="cargo" options={cargos} value={cargosRef} onChange={e => setCargosRef(e.value)}
                              className="text-2xl text-color surface-overlay border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full h-3rem"/>
                </div>}
            </div>
            {
                primeiraParcela && <Fragment>
                    <div className="formgrid grid pb-2">
                        <div className="field col-12 md:col-3">
                            <label htmlFor="sexo" className="text-2xl font-light">Sexo {primeiraParcela && '*'}</label>
                            <select onChange={event => setSexoRef(event.target.value)} value={sexoRef!} name="sexo" id="sexo"
                                    className="text-2xl text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full h-3rem">
                                <option value="M">Masculino</option>
                                <option value="F">Feminino</option>
                            </select>
                        </div>
                        <div className="field col-12 md:col">
                            <label htmlFor="datanascimento" className="text-2xl font-light">Data de
                                nascimento {primeiraParcela && '*'}</label>
                            <InputMask mask="99/99/9999" onChange={event => setDataNascimentoRef(event.target.value)} value={dataNascimentoRef!} id="datanascimento"
                                       className="text-2xl text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full h-3rem"></InputMask>
                        </div>
                        <div className="field col-12 md:col">
                            <label htmlFor="telefone"
                                   className="text-2xl font-light">Telefone {primeiraParcela && '*'}</label>
                            <InputMask mask="(99) 99999-9999" onChange={event => setTelefoneRef(event.target.value)} value={telefoneRef!} id="telefone"
                                       className="text-2xl text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full h-3rem"></InputMask>
                        </div>
                    </div>
                    <div className="formgrid grid pb-2">
                        <div className="field col-12">
                            <label htmlFor="observacoes" className="text-2xl font-light">Observações</label>
                            <textarea id="observacoes" onChange={event => setObservacaoRef(event.target.value)} value={observacaoRef!}
                                      className="text-2xl text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                                      rows={4} placeholder='Remédios, alergias e outros...'></textarea>
                        </div>
                    </div>
                    <div className="formgrid grid pb-2">
                        <div className="field col-12">
                            <label htmlFor="documentos" className="text-2xl font-light">Documentos (somente imagem)</label>
                            <FileUpload
                                auto
                                customUpload
                                multiple
                                accept="image/*"
                                name="documentos"
                                id='documentos'
                                chooseLabel="Adicionar"
                                className="w-full"
                                emptyTemplate={
                                    <div className="flex align-items-center flex-column">
                                        <i className="pi pi-image mt-3 p-5" style={{
                                            'fontSize': '5em',
                                            borderRadius: '50%',
                                            backgroundColor: 'var(--surface-b)',
                                            color: 'var(--surface-d)'
                                        }}></i>
                                        <span style={{'fontSize': '1.2em', color: 'var(--text-color-secondary)'}}
                                              className="my-5">Arraste os Documentos aqui</span>
                                    </div>}
                                onSelect={salvarDocumentos}
                                onRemove={excluirDocumentos}/>
                        </div>
                    </div>
                </Fragment>
            }
        </Dialog>
    </Fragment>;
}
