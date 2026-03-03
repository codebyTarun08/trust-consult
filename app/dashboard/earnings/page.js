"use client"
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { apiConnector } from '@/utils/apiConnector';
import Loading from '@/components/common/Loading';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const EarningsPage = () => {
    const { user } = useSelector(state => state.profile);
    const [earningsData, setEarningsData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEarnings = async () => {
            if (user) {
                try {
                    const response = await apiConnector("GET", `/api/consultant/earnings?consultantId=${user._id}`);
                    setEarningsData(response.data);
                } catch (error) {
                    console.error("Error fetching earnings data:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchEarnings();
    }, [user]);

    const monthlyEarningsChartData = {
        labels: earningsData ? Object.keys(earningsData.monthlyEarnings) : [],
        datasets: [
            {
                label: 'Monthly Earnings',
                data: earningsData ? Object.values(earningsData.monthlyEarnings) : [],
                backgroundColor: 'rgba(117, 133, 246, 0.7)',
                borderColor: 'rgba(117, 133, 246, 1)',
                borderWidth: 1,
            },
        ],
    };

    const bookingStatusData = {
        labels: ['Completed', 'Other'],
        datasets: [
            {
                label: 'Booking Status',
                data: [
                    earningsData?.completedBookings || 0,
                    (earningsData?.totalBookings || 0) - (earningsData?.completedBookings || 0)
                ],
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
                borderWidth: 1,
            },
        ],
    };

    if (loading) {
        return <Loading />;
    }

    if (!user) {
        return <div className="text-white text-center text-2xl mt-10">Please log in to view your earnings.</div>
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 md:p-8">
            <div className="container mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-center text-purple-400">Earnings Dashboard</h1>

                {/* Glassmorphic Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6 shadow-lg hover:scale-105 transition-transform duration-300">
                        <h2 className="text-lg font-semibold text-gray-300">Total Earnings</h2>
                        <p className="text-3xl font-bold text-green-400 mt-2">₹{earningsData?.totalEarnings || 0}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6 shadow-lg hover:scale-105 transition-transform duration-300">
                        <h2 className="text-lg font-semibold text-gray-300">Pending Money</h2>
                        <p className="text-3xl font-bold text-yellow-400 mt-2">₹{earningsData?.pendingMoney || 0}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6 shadow-lg hover:scale-105 transition-transform duration-300">
                        <h2 className="text-lg font-semibold text-gray-300">Total Bookings</h2>
                        <p className="text-3xl font-bold text-blue-400 mt-2">{earningsData?.totalBookings || 0}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6 shadow-lg hover:scale-105 transition-transform duration-300">
                        <h2 className="text-lg font-semibold text-gray-300">Completed Bookings</h2>
                        <p className="text-3xl font-bold text-teal-400 mt-2">{earningsData?.completedBookings || 0}</p>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl border border-gray-700 shadow-xl">
                        <h2 className="text-2xl font-bold text-purple-300 mb-4">Monthly Earnings</h2>
                        <Bar data={monthlyEarningsChartData} options={{
                            responsive: true,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: { color: '#d1d5db' },
                                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                                },
                                x: {
                                    ticks: { color: '#d1d5db' },
                                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                                }
                            },
                            plugins: {
                                legend: {
                                    labels: { color: '#d1d5db' }
                                }
                            }
                        }} />
                    </div>

                    <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl border border-gray-700 shadow-xl flex flex-col items-center justify-center">
                        <h2 className="text-2xl font-bold text-purple-300 mb-4">Booking Status</h2>
                        <div style={{ position: 'relative', height: '300px', width: '300px' }}>
                            <Doughnut data={bookingStatusData} options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'top',
                                        labels: {
                                            color: '#d1d5db'
                                        }
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: function (context) {
                                                let label = context.label || '';
                                                if (label) {
                                                    label += ': ';
                                                }
                                                if (context.parsed !== null) {
                                                    label += context.parsed;
                                                }
                                                return label;
                                            }
                                        }
                                    }
                                }
                            }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EarningsPage;
