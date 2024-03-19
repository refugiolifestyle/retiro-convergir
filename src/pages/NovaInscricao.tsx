import { FC, Fragment, RefObject, useCallback, useContext, useState } from 'react';
import { Toast } from 'primereact/toast';
import { ComprovanteNovaInscricao } from '../components/inscricoes/ComprovanteNovaInscricao';
import { InscritosNovaInscricao } from '../components/inscricoes/InscritosNovaInscricao';
import { ToastContext } from '../App';

export type DadosNovaInscricao = {
    comprovante?: string,
    valorComprovante?: number
};

const NovaInscricao: FC = () => {
    const [dados, setDados] = useState<DadosNovaInscricao>();

    return <Fragment>
        {
            dados
                ? <InscritosNovaInscricao dados={dados} voltar={() => setDados(undefined)} />
                : <ComprovanteNovaInscricao avancar={setDados} />
        }
    </Fragment>;
}

export default NovaInscricao;