import React from 'react';
import { PortalClienteLdSection } from '../PortalCliente/PortalClienteLdSection';
import styles from './ControleDocumental.module.css';

export const ControleDocumental = () => {
    return (
        <div className={styles.page}>
            <PortalClienteLdSection contexto="interno" projetoLabel="SE Charqueadas 230/69 kV - Ampliação I" />
        </div>
    );
};

