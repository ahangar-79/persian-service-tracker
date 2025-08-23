"use client";

import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import styles from '@/app/(user)/u-dashboard/dashboard.module.css';


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const usersData = [
    { id: 1, username: 'master_emad', nationalId: '0018328991', phone: '09196841088', company: 'master_emad', email: 'www.test343637st@gmail.com', status: true, date: '1405/10/27' },
    { id: 2, username: 'pmadani', nationalId: '7777777777', phone: '09166666666', company: '-', email: 'test6@gmail.com', status: false, date: '1402/07/15' },
    { id: 3, username: 'master.beheshti', nationalId: '3801789233', phone: '09216803309', company: '-', email: 'mkl@gmail2.com', status: true, date: '1402/09/07' },
    { id: 4, username: 'pooyamiri', nationalId: '0440175161', phone: '09125212469', company: '-', email: 'pooyamiri91@gmail.com', status: true, date: '1403/09/12' },
    { id: 5, username: 'mfzjn', nationalId: '2130360580', phone: '09022614024', company: '-', email: 'mfzjn.official@gmail.com', status: true, date: '1403/10/06' },
    { id: 6, username: 'providersrm', nationalId: '3333333333', phone: '09122222333', company: '-', email: 'vasi3@gmail', status: true, date: '1403/10/14' },
    { id: 7, username: 'rayadata', nationalId: '11111111111', phone: '09123456780', company: '-', email: 's@s.com', status: true, date: '1403/10/25' },
];

const topServices = [
    { name: 'vehicle@latonasesctoital', value: 95 },
    { name: 'SendSMS', value: 85 },
    { name: 'activeplate', value: 70 },
    { name: 'SetNewSurvey', value: 55 },
    { name: 'negativescorecertificate', value: 45 },
];

const topProviders = [
    { name: 'شرکت ایمه کردن ارزیابیت روهاک (ساپایک)', value: 75 },
    { name: 'بانک گردشگری', value: 65 },
    { name: 'شرکت ایران خودرو', value: 55 },
    { name: 'شرکت خاوران خورشید (سریان)', value: 45 },
    { name: 'شرکت امداد بی تین دهیلد (ساپایک)', value: 35 },
];


export default function Dashboard() {
    const [users, setUsers] = useState(usersData);
    const [activePage, setActivePage] = useState(1);

    const handleToggleStatus = (id: number) => {
        setUsers(users.map(user =>
            user.id === id ? { ...user, status: !user.status } : user
        ));
    };

    const chartData = {
        labels: ['1404-01-01', '1404-01-15', '1404-02-01', '1404-02-15', '1404-03-01', '1404-03-15', '1404-04-01', '1404-04-15', '1404-04-27'],
        datasets: [
            {
                label: 'موفق',
                data: [30, 35, 45, 58, 42, 55, 38, 45, 60, 42, 45, 52, 35],
                borderColor: '#4285f4',
                backgroundColor: 'rgba(66, 133, 244, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6
            },
            {
                label: 'ناموفق',
                data: [8, 10, 12, 15, 12, 14, 8, 10, 15, 8, 6, 12, 8],
                borderColor: '#ea4335',
                backgroundColor: 'rgba(234, 67, 53, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                align: 'center' as const,
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        size: 12
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0,0,0,0.1)'
                },
                ticks: {
                    font: {
                        size: 11
                    }
                }
            },
            x: {
                grid: {
                    color: 'rgba(0,0,0,0.1)'
                },
                ticks: {
                    font: {
                        size: 11
                    }
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index' as const,
        }
    };


    return (
        <div className={styles.dashboard}>
            <div className={styles.header}>
                <h1>داشبورد کلی</h1>
            </div>

            <div className={styles.topSection}>
                <div className={styles.chartContainer}>
                    <div className={styles.chartTitle}>درخواست ها در طول زمان</div>
                    <div className={styles.lineChartContainer}>
                        <Line data={chartData} options={chartOptions} />
                    </div>
                </div>
            </div>

            <div className={styles.bottomSection}>
                <div className={styles.tableContainer}>
                    <div className={styles.tableHeader}>
                        <div className={styles.chartTitle}>لیست کاربران</div>
                        <button className={styles.addButton}>
                            <span>+</span>
                            ایجاد کاربر
                        </button>
                    </div>

                    <div className={styles.tableControls}>
                        <button className={styles.filterButton}>
                            ⚙️ ستون‌ها
                        </button>
                        <button className={styles.filterButton}>
                            🔍 فیلتر پیشرفته
                        </button>
                        <input type="text" className={styles.searchInput} placeholder="جستجوی کاربران..." />
                    </div>

                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ردیف</th>
                                <th>نام کاربری</th>
                                <th>کد ملی</th>
                                <th>تلفن همراه</th>
                                <th>عنوان شرکت</th>
                                <th>پست الکترونیک</th>
                                <th>وضعیت</th>
                                <th>تاریخ ساخت ↕</th>
                                <th>عملیات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user.id}>
                                    <td>{index + 1}</td>
                                    <td>{user.username}</td>
                                    <td>{user.nationalId}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.company}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <div
                                            className={`${styles.statusToggle} ${user.status ? styles.active : ''}`}
                                            onClick={() => handleToggleStatus(user.id)}
                                        ></div>
                                    </td>
                                    <td>{user.date}</td>
                                    <td className={styles.actionsMenu}>⋯</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className={styles.pagination}>
                        <div className={styles.paginationControls}>
                            <button className={styles.paginationBtn}>‹</button>
                            <button
                                className={`${styles.paginationBtn} ${activePage === 2 ? styles.active : ''}`}
                                onClick={() => setActivePage(2)}
                            >2</button>
                            <button
                                className={`${styles.paginationBtn} ${activePage === 1 ? styles.active : ''}`}
                                onClick={() => setActivePage(1)}
                            >1</button>
                            <button className={styles.paginationBtn}>›</button>
                        </div>
                        <div className={styles.rowsPerPage}>
                            <span>10 آیتم</span>
                            <select className={styles.rowsSelect}>
                                <option>10 آیتم</option>
                                <option>25 آیتم</option>
                                <option>50 آیتم</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.finalSection}>
                <div className={styles.barChart}>
                    <div className={styles.chartTitle}>سرویس‌های برتر</div>
                    {topServices.map(service => (
                        <div className={styles.barItem} key={service.name}>
                            <div className={styles.barLabel}>{service.name}</div>
                            <div className={styles.barVisual} style={{ width: `${service.value}%` }}></div>
                            <div className={styles.barValue}>{service.value}</div>
                        </div>
                    ))}
                </div>

                <div className={styles.barChart}>
                    <div className={styles.chartTitle}>سرویس‌دهنده‌های برتر</div>
                    {topProviders.map(provider => (
                        <div className={styles.barItem} key={provider.name}>
                            <div className={styles.barLabel}>{provider.name}</div>
                            <div className={styles.barVisual} style={{ width: `${provider.value}%` }}></div>
                            <div className={styles.barValue}>{provider.value}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
