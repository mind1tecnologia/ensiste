import { ReactNode, useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    KanbanSquare,
    Files,
    Zap,
    ShieldAlert,
    Banknote,
    Bot,
    Play,
    Menu,
    X
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import clsx from 'clsx';
import styles from './Layout.module.css';
import ensisteLogo from '../../assets/ensiste-logo-anexo.png';

interface LayoutProps {
    children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { toasts, addToast } = useAppContext();
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    const handleDemoModo = () => {
        addToast({
            message: "Modo Demo ativado. Você pode simular as automações e ver o fluxo em ação.",
            type: "info"
        });
    };

    const navItems = [
        { path: '/', label: 'Home / Tour', icon: <Play size={20} /> },
        { path: '/executivo', label: 'Cockpit Executivo', icon: <LayoutDashboard size={20} /> },
        { path: '/operacional', label: 'Cockpit Operacional', icon: <KanbanSquare size={20} /> },
        { path: '/entregaveis', label: 'Entregáveis', icon: <Files size={20} /> },
        { path: '/destravadores', label: 'Destravadores', icon: <Zap size={20} /> },
        { path: '/qualidade', label: 'Qualidade & Retrabalho', icon: <ShieldAlert size={20} /> },
        { path: '/financeiro', label: 'Financeiro', icon: <Banknote size={20} /> },
        { path: '/automacoes', label: 'Central de IA', icon: <Bot size={20} /> },
    ];

    useEffect(() => {
        setIsMobileNavOpen(false);
    }, [location.pathname]);

    const currentNavItem =
        navItems.find((item) => item.path === location.pathname) ??
        navItems.find((item) => item.path !== '/' && location.pathname.startsWith(item.path)) ??
        (location.pathname.startsWith('/documento/')
            ? { path: '/documento', label: 'Detalhe do Entregável', icon: <Files size={20} /> }
            : undefined) ??
        navItems[0];

    return (
        <div className={styles.layout}>
            {isMobileNavOpen && (
                <button
                    type="button"
                    className={styles.sidebarBackdrop}
                    aria-label="Fechar menu lateral"
                    onClick={() => setIsMobileNavOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={clsx(styles.sidebar, isMobileNavOpen && styles.sidebarOpen)}>
                <button
                    type="button"
                    className={styles.logoContainer}
                    onClick={() => navigate('/')}
                    aria-label="Ir para a página inicial"
                >
                    <div className={styles.logoIcon} aria-hidden="true">
                        <img src={ensisteLogo} alt="" className={styles.logoMark} />
                    </div>
                </button>

                <nav className={styles.nav} aria-label="Navegação principal">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => clsx(styles.navItem, isActive && styles.navItemActive)}
                            onClick={() => setIsMobileNavOpen(false)}
                        >
                            <div className={styles.navIcon}>{item.icon}</div>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className={styles.sidebarFooter}>
                    <div className={styles.userProfile}>
                        <div className={styles.avatar}>LA</div>
                        <div className={styles.userInfo}>
                            <span className={styles.userName}>Leonardo A.</span>
                            <span className={styles.userRole}>Diretoria</span>
                        </div>
                    </div>
                </div>
            </aside>

            <div className={styles.mainContent}>
                {/* Topbar */}
                <header className={styles.topbar}>
                    <div className={styles.topbarLeft}>
                        <button
                            type="button"
                            className={styles.menuButton}
                            aria-label={isMobileNavOpen ? 'Fechar menu' : 'Abrir menu'}
                            onClick={() => setIsMobileNavOpen((value) => !value)}
                        >
                            {isMobileNavOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>
                        <div className={styles.topbarMeta}>
                            <span className={styles.pageEyebrow}>Ambiente ENSISTE</span>
                            <h1 className={styles.pageTitle}>{currentNavItem.label}</h1>
                        </div>
                    </div>
                    <div className={styles.topbarRight}>
                        <button className={styles.demoButton} onClick={handleDemoModo}>
                            <Zap size={16} />
                            Simular Fluxo
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className={styles.pageContainer}>
                    {children}
                </main>
            </div>

            {/* Toasts */}
            <div className={styles.toastContainer}>
                {toasts.map((toast) => (
                    <div key={toast.id} className={clsx(styles.toast, styles[`toast-${toast.type || 'info'}`])}>
                        <div className={styles.toastContent}>{toast.message}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
