
import Sidebar from "../../components/Sidebar/Sidebar.jsx";

import Main from "../../components/Main/Main.jsx";
function Dashboard() {


  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Mobile Header */}

      <Sidebar />

      <Main />
    </div>
  );
}

export default Dashboard;
