// import logo from './logo.svg';
import './App.css';
import ConfigEditor from './components/ConfigEditor';
import starterConfig from './components/input_configs/starter_config.json';

function App() {
  return (
    
    <div className="App">
      <ConfigEditor botConfig={starterConfig}/>
    </div>
  );
}

export default App;
