import { useEffect, useState } from "react";
import api from "../services/api";


function Dashboard() {


  const [data, setData] = useState({

    totalEmployees: 0,

    presentToday: 0,

    absentToday: 0,

    totalLeaves: 0,

    pendingLeaves: 0,

    approvedLeaves: 0,

    rejectedLeaves: 0

  });



  useEffect(() => {


    const fetchDashboard = async () => {

      try {

        const response = await api.get("/dashboard");


        setData(response.data.stats);


      } catch(error) {

        console.log(
          "Dashboard Error:",
          error
        );

      }

    };


    fetchDashboard();


  }, []);



  return (

    <div
      style={{
        padding: "40px"
      }}
    >


      <h1>
        Smart ERP CRM Dashboard
      </h1>



      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "20px",
          marginTop: "30px"
        }}
      >


        <Card
          title="Total Employees"
          value={data.totalEmployees}
        />


        <Card
          title="Present Today"
          value={data.presentToday}
        />


        <Card
          title="Absent Today"
          value={data.absentToday}
        />


        <Card
          title="Total Leaves"
          value={data.totalLeaves}
        />


        <Card
          title="Pending Leaves"
          value={data.pendingLeaves}
        />


        <Card
          title="Approved Leaves"
          value={data.approvedLeaves}
        />


        <Card
          title="Rejected Leaves"
          value={data.rejectedLeaves}
        />


      </div>


    </div>

  );

}



function Card(
  {
    title,
    value
  }:
  {
    title: string;
    value: number;
  }
) {


  return (

    <div
      style={{
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        textAlign: "center"
      }}
    >


      <h3>
        {title}
      </h3>


      <h1>
        {value}
      </h1>


    </div>

  );

}


export default Dashboard;