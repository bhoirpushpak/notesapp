import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ThemeProvider from 'react-bootstrap/ThemeProvider';
import 'react-toastify/dist/ReactToastify.css';
import ViewNote from "./Components/ViewNote";
import Home from "./Components/Home";
import NavBar from "./Components/NavBar";
import { Route, Routes} from "react-router-dom"

function App() {

    return (
        <ThemeProvider
            breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}
            minBreakpoint="xxs">
            { <NavBar/> }
            <Routes>
                <Route path="*"  element={<Home/>} />
                <Route exact path="/:noteSlug"  element={<ViewNote/>} />
            </Routes>
        </ThemeProvider>
  );
}

export default App;
