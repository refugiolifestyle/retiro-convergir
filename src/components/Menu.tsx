import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {PrimeIcons} from 'primereact/api';
import {classNames} from 'primereact/utils';
import {Card} from 'primereact/card';
import {Button} from 'primereact/button';
import {consultarPermitirInscricao, consultarPermitirVendinha} from "../service/database";

export const Menu: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [items, setItems] = useState([
        {label: 'Dashboard', icon: PrimeIcons.HOME, to: '/dashboard'},
        {label: 'Inscrições', icon: PrimeIcons.USER_EDIT, to: '/inscricoes'},
    ]);

    useEffect(() => {
        (async () => {
            let _permitirVendinha = await consultarPermitirVendinha();
            if (_permitirVendinha) {
                setItems([
                    {label: 'Dashboard', icon: PrimeIcons.HOME, to: '/dashboard'},
                    {label: 'Inscrições', icon: PrimeIcons.USER_EDIT, to: '/inscricoes'},
                    {label: 'Vendinha', icon: PrimeIcons.SHOPPING_BAG, to: '/vendinha'}
                ]);
            }
        })();
    }, []);

    return <aside className="m-5 flex flex-column">
        {
            items.map(item => (
                <Button key={item.to}
                        className={classNames('p-button-text w-full lg:w-20rem p-button-plain shadow-1 mb-4 p-0 cursor-pointer', {'shadow-5': location.pathname.startsWith(item.to)})}
                        onClick={() => navigate(item.to)}>
                    <Card className="py-2 text-8xl w-full flex flex-row lg:flex-column align-items-center"
                          title={<h3 className="my-1">{item.label}</h3>} header={<i
                        className={classNames('pi pi-fw m-3 text-6xl flex justify-content-center align-items-center', item.icon)}/>}/>
                </Button>
            ))
        }
    </aside>;
}