import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

import WeatherDashboard from './WeatherDashboard';

import './theme.css';

import './WelcomePage.css';

function WelcomePage() {
    const navigate = useNavigate();

    return (
        <div className="welcome-container">
            <h1>Welcome back!</h1>
            <button onClick={() => navigate('/search')}>Search</button>
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/search" element={<WeatherDashboard />} />
            </Routes>
        </BrowserRouter>
    );
}