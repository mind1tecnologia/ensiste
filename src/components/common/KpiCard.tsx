import React, { ReactNode } from 'react';
import styles from './KpiCard.module.css';
import clsx from 'clsx';

interface KpiCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: ReactNode;
    trend?: {
        value: string;
        isPositive: boolean;
    };
    highlight?: 'success' | 'warning' | 'danger' | 'info';
    onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({ title, value, subtitle, icon, trend, highlight, onClick }) => {
    return (
        <div
            className={clsx(styles.card, onClick && styles.clickable, highlight && styles[`highlight-${highlight}`])}
            onClick={onClick}
        >
            <div className={styles.header}>
                <h3 className={styles.title}>{title}</h3>
                {icon && <div className={styles.icon}>{icon}</div>}
            </div>
            <div className={styles.content}>
                <div className={styles.value}>{value}</div>
                {(subtitle || trend) && (
                    <div className={styles.footer}>
                        {trend && (
                            <span className={clsx(styles.trend, trend.isPositive ? styles.trendPositive : styles.trendNegative)}>
                                {trend.isPositive ? '↑' : '↓'} {trend.value}
                            </span>
                        )}
                        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
                    </div>
                )}
            </div>
        </div>
    );
};
