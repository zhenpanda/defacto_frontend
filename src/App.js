import './assets/css/app.css';
import bgImg from './assets/images/bazaar_bg.png';

function App() {
  return (
    <div className="app">

    

      <div className="bg-container">
        
        <div className="left-side-bar">

        </div>

        <div className="middle-bar">
          <img src={bgImg} className="bg-image" alt="" /> 
        </div>
      
        <div className="right-side-bar">

        </div>

      </div>

    </div>
  );
}

export default App;