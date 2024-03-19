import React from 'react';
import convergir from './../assets/convergir.png'

const Dashboard: React.FC = () => {
    return <section className="w-full h-full flex-1 flex flex-column justify-content-center align-items-center">
        <img src={convergir} alt="Retiro Convergir" className='w-20rem' />
        <p className="text-justify text-xl" style={{ maxWidth: '60rem' }}>Isto é, de fazer convergir em Cristo todas as coisas, celestiais ou terrenas, na dispensação da plenitude dos tempos.
            <span className="block font-bold text-right">Efésios 1.10</span>
        </p>
    </section>;
}

export default Dashboard;