import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import ApexCharts from "react-apexcharts"; // Import ApexCharts for React

function AdminDashboard() {
    const [ticketData, setTicketData] = useState(null);

    // Fetch data from API
    useEffect(() => {
        const fetchTicketData = async () => {
            try {
                const response = await fetch(
                    "http://127.0.0.1:8000/api/admin/dashboard-tickets"
                );
                const data = await response.json();
                setTicketData(data); // Assuming the API returns a JSON object with ticket data
            } catch (error) {
                console.error("Error fetching ticket data:", error);
            }
        };

        fetchTicketData();
    }, []);

    // Access statusCounts from API response (if data is available)
    const statusCounts = ticketData ? ticketData.statusCounts : {};
    const newTickets = ticketData ? ticketData.newTickets : {};
    const overdueTickets = ticketData ? ticketData.overdueTickets : {};
    
    // Ticket Summary
    const ticketSummary = statusCounts
        ? [
              statusCounts.pending,
              statusCounts.on_hold,
              statusCounts.in_progress,
              statusCounts.resolved,
              statusCounts.waiting_reply,
              statusCounts.replied,
          ]
        : [];

    // Chart Data for Activity Overview (Pie Chart)
    const activityData = statusCounts
        ? {
              series: [
                  statusCounts.pending || 0,
                  statusCounts.on_hold || 0,
                  statusCounts.in_progress || 0,
                  statusCounts.resolved || 0,
                  statusCounts.waiting_reply || 0,
                  statusCounts.replied || 0,
              ],
              options: {
                  chart: {
                      type: "pie",
                      animations: {
                          enabled: true,
                          easing: "easeinout",
                          speed: 1200,
                      },
                  },
                  colors: [
                      "#FF5733",
                      "#33FF57",
                      "#3357FF",
                      "#FF33A1",
                      "#FF8D33",
                      "#A133FF",
                  ], // Vibrant color palette
                  labels: [
                      "Pending",
                      "On Hold",
                      "In Progress",
                      "Resolved",
                      "Waiting Reply",
                      "Replied",
                  ],
                  legend: {
                      position: "bottom",
                      fontSize: '14px',
                  },
                  responsive: [
                      {
                          breakpoint: 480,
                          options: {
                              chart: {
                                  width: 250,
                              },
                              legend: {
                                  position: "bottom",
                              },
                          },
                      },
                  ],
              },
          }
        : null;

    const pendingTicketsData = {
        series: [
            {
                name: "Pending Tickets",
                data:
                    ticketData && ticketData.userData
                        ? ticketData.userData.map((user) => user.pending || 0)
                        : [],
            },
        ],
        options: {
            chart: {
                type: "bar",
                height: 350,
                animations: {
                    enabled: true,
                    easing: "easeinout",
                    speed: 1200,
                },
            },
            colors: [
                "#F44336",
                "#4CAF50",
                "#2196F3",
                "#FFC107",
                "#9C27B0",
                "#E91E63",
            ], // Modern color palette for bars
            plotOptions: {
                bar: {
                    borderRadius: 8,
                    horizontal: false,
                    columnWidth: "50%",
                },
            },
            xaxis: {
                categories:
                    ticketData && ticketData.userData
                        ? ticketData.userData.map(
                              (user) => user.user_name || "Unknown User"
                          )
                        : [],
                labels: {
                    style: {
                        fontSize: "13px",
                        fontWeight: "bold",
                        colors: "#333",
                    },
                },
            },
            fill: {
                opacity: 0.9,
            },
            grid: {
                show: true,
                borderColor: "#ddd",
            },
            dataLabels: {
                enabled: false,
            },
        },
    };

    return (
        <Layout>
            {/* Dashboard Header */}
            <div className="text-center mb-4 animate__animated animate__fadeInDown">
                <h1 className="text-4xl bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-600 drop-shadow-xl">
                    Tickets Overall View
                </h1>
            </div>

            {/* Ticket Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-12">
                {statusCounts && (
                    <>
                        {[{ label: "Pending", value: statusCounts.pending, color: "bg-gradient-to-br from-red-500 to-red-700" }, 
                        { label: "On Hold", value: statusCounts.on_hold, color: "bg-gradient-to-br from-yellow-500 to-yellow-700" },
                        { label: "In Progress", value: statusCounts.in_progress, color: "bg-gradient-to-br from-blue-500 to-blue-700" },
                        { label: "Resolved", value: statusCounts.resolved, color: "bg-gradient-to-br from-green-500 to-green-700" },
                        { label: "Waiting Reply", value: statusCounts.waiting_reply, color: "bg-gradient-to-br from-purple-500 to-purple-700" },
                        { label: "Replied", value: statusCounts.replied, color: "bg-gradient-to-br from-pink-500 to-pink-700" }]
                        .map((item, index) => (
                            <div
                                key={index}
                                className={`${item.color} text-white rounded-xl shadow-lg p-6 transform hover:scale-110 cursor-pointer transition-transform duration-300`}
                            >
                                <h3 className="text-4xl font-extrabold drop-shadow">{item.value}</h3>
                                <p className="text-lg font-medium mt-1">{item.label}</p>
                            </div>
                        ))}
                    </>
                )}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate__animated animate__fadeInUp">
                {/* Activity Overview - Pie Chart */}
                {activityData && (
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h2 className="text-xl text-center font-semibold text-gray-700 mb-4">Activity Overview</h2>
                        <ApexCharts
                            options={activityData.options}
                            series={activityData.series}
                            type="pie"
                            height={350}
                        />
                    </div>
                )}

                {/* Pending Tickets Bar Chart */}
                {ticketData && ticketData.userData && (
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h2 className="text-xl text-center font-semibold text-gray-700 mb-4">Pending Tickets by User</h2>
                        <ApexCharts
                            options={pendingTicketsData.options}
                            series={pendingTicketsData.series}
                            type="bar"
                            height={350}
                        />
                    </div>
                )}
            </div>

            {/* New Tickets and Overdue Tickets Tables (Side by Side) */}
            <div className="flex gap-8 mt-8">
  {/* New Tickets Table */}
  {newTickets && newTickets.length > 0 && (
    <div className="bg-white p-6 rounded-xl shadow-lg w-full">
      <h2 className="text-xl text-center font-semibold text-gray-700 mb-4">New Tickets</h2>
      <div className="overflow-x-auto">
        <div className="table-auto border-collapse max-h-[300px] overflow-y-auto block">
          <div className="sticky bg-[#f8703c] top-0 z-10">
            <div className="grid grid-cols-3 gap-4 p-2 text-left font-medium">
              <div className="text-center">Ticket ID</div>
              {/* <div className="text-center">Message</div> */}
              <div className="text-center">Employee</div>
              <div className="text-center">Agent</div>
            </div>
          </div>
          <div>
            {newTickets.map((ticket, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 p-2 border-t">
                <div className="text-center">{ticket.trackid}</div>
                {/* <div className="text-center truncate w-36">{ticket.message}</div> */}
                <div className="text-center">{ticket.name}</div>
                <div className="text-center">{ticket.owner_name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )}

  {/* Overdue Tickets Table */}
  {overdueTickets && overdueTickets.length > 0 && (
    <div className="bg-white p-6 rounded-xl shadow-lg w-full">
      <h2 className="text-xl text-center font-semibold text-gray-700 mb-4">Overdue Tickets</h2>
      <div className="overflow-x-auto">
        <div className="table-auto border-collapse max-h-[300px] overflow-y-auto block">
          <div className="sticky bg-[#f8703c] top-0 z-10">
            <div className="grid grid-cols-3 gap-4 p-2 text-left font-medium">
              <div className="text-center">Ticket ID</div>
              {/* <div className="text-center">Message</div> */}
              <div className="text-center">Employee</div>
              <div className="text-center">Agent</div>
            </div>
          </div>
          <div>
            {overdueTickets.map((ticket, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 p-2 border-t">
                <div className="text-center">{ticket.trackid}</div>
                {/* <div className="text-center truncate w-36">{ticket.message}</div> */}
                <div className="text-center">{ticket.name}</div>
                <div className="text-center">{ticket.owner_name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )}
</div>

        </Layout>
    );
}

export default AdminDashboard;
