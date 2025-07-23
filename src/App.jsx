import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './index.css'
import HeaderUnitama from "./components/HeaderUtama";
import Navbar from './components/Navbar'
import NorthWestCorner from './components/NorthWestCorner';
import VogelMethod from './components/VogelMethod'
import MinimumCostMethod from './components/MinimumCostMethod'
import Footer from './components/Footer';


function App() {
  const [count, setCount] = useState(0)
  const [selectedMethod, setSelectedMethod] = useState("");

  const renderSelectedComponent = () => {
    switch (selectedMethod) {
      case "northwest":
        return <NorthWestCorner />;
      case "vogel":
        return <VogelMethod/>;
      case "leastCost":
        return <MinimumCostMethod/>;
      default:
        return (
          <div className="text-center p-8 text-gray-300">
            Silakan pilih salah satu metode dari navigasi di atas.
          </div>
        );
    }
  };

  return (
    <><HeaderUnitama />
      <div className="min-h-screen ">
        
        <Navbar onSelectMethod={setSelectedMethod} />
        <main>{renderSelectedComponent()}</main>
    </div>
    <Footer/>
    </>
  )
}

export default App
