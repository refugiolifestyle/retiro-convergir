import { FC, Fragment, RefObject, useContext, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { DadosNovaInscricao } from '../../pages/NovaInscricao';
import { Card } from 'primereact/card';
import { NovoInscritoNovaInscricaoModal } from './NovoInscritoNovaInscricaoModal';
import { useNavigate } from 'react-router-dom';
import { ToastContext } from '../../App';
import { Inscrito } from '../../types/Inscrito';
import { saveComprovante } from '../../service/storage';
import { saveInscritos } from '../../service/database';
import { generalConfigs } from '../../config/general';

interface Props {
    dados?: DadosNovaInscricao,
    voltar: () => void
}

export const InscritosNovaInscricao: FC<Props> = ({ dados, voltar }) => {
    const navigate = useNavigate();
    const toast = useContext<RefObject<Toast> | null>(ToastContext);
    const [loading, setLoading] = useState(false);
    const [inscritos, setInscritos] = useState<Inscrito[]>([]);

    const numeroDeParcelas = inscritos.reduce((total, inscrito) => total + Number.parseInt(inscrito.parcelas as string), 0);
    const numeroPossivelDeParcelas = (dados?.valorComprovante || 0) / generalConfigs.VALOR_INSCRICAO;
    const numeroRestanteDeParcelas = numeroPossivelDeParcelas - numeroDeParcelas;

    const finalizar = async () => {
        try {
            setLoading(true);
    
            let comprovante = await saveComprovante(dados!, inscritos!);
            if (comprovante === null) {
                setLoading(false);
                throw new Error('Falha ao salvar o comprovante');
            }
    
            await saveInscritos(inscritos, comprovante);
    
            toast?.current?.show({ summary: 'Tudo certo', detail: 'Todos os dados foram salvos', severity: 'success' });
            navigate('/inscricoes');
        } catch (e: any) {
            toast?.current?.show({ summary: e.message, severity: 'error' });
            setLoading(false);
            return;
        }
    };

    const apagarInscrito = (_cpf: string) => {
        setInscritos(old => {
            return old.filter(inscrito => inscrito.cpf !== _cpf);
        })
    };

    const actionBodyTemplate = (data: any) => {
        return <Button type="button" icon="pi pi-times text-2xl" className="p-button-text p-button-danger" onClick={() => apagarInscrito(data.cpf)}></Button>;
    }

    const celulaBodyTemplate = (data: any) => {
        return `Refúgio ${data.celula}`;
    }

    return <Fragment>
        <div className="flex flex-column">
            <div className="flex justify-content-between align-items-center">
                <div className="flex justify-content-start align-items-center">
                    <i className="pi pi-arrow-left text-2xl mr-4 cursor-pointer" onClick={() => voltar()}></i>
                    <h2>Selecione os inscritos correspondentes as parcelas</h2>
                </div>
                <div className="flex justify-content-end align-items-center">
                    <Button
                        label="Finalizar tudo"
                        icon="pi pi-check"
                        loading={loading}
                        className="p-button-raised p-button-success py-2"
                        disabled={numeroRestanteDeParcelas > 0}
                        onClick={finalizar} />
                </div>
            </div>
            <Card>
                <DataTable
                    paginator
                    rows={5}
                    value={inscritos}
                    emptyMessage="Clique no botão 'Selecionar inscrito' para continuar"
                    header={<div className="flex justify-content-between align-items-center">
                        <span>Você já adicionou {numeroDeParcelas || 0}/{numeroPossivelDeParcelas} parcelas (R$ {dados?.valorComprovante || 0} reais), restam {numeroRestanteDeParcelas}</span>
                        <NovoInscritoNovaInscricaoModal numeroRestanteDeParcelas={numeroRestanteDeParcelas} salvarInscrito={inscrito => setInscritos(old => [inscrito, ...old])} />
                    </div>}>
                    <Column field="celula" header="Célula" headerClassName="text-2xl py-3" body={celulaBodyTemplate}></Column>
                    <Column field="cpf" header="CPF" headerClassName="text-2xl py-3"></Column>
                    <Column field="nome" header="Nome" headerClassName="text-2xl py-3"></Column>
                    <Column field="parcelas" header="Parcelas" headerClassName="text-2xl py-3"></Column>
                    <Column headerClassName="text-2xl py-3" body={actionBodyTemplate} />
                </DataTable>
            </Card>
        </div>
    </Fragment>;
}
