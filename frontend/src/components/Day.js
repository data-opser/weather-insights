import { GoSun } from "react-icons/go";
import { WiRaindrop } from "react-icons/wi";
import '../styles/Day.css'

function Day() {
    return (
        <div className="day">
            <p>8 Oct.</p>
            <GoSun className="sun"/>
            <p>14/10</p>
            <div className="rain">
                <WiRaindrop className="raindrop"/>
                <p>14%</p>
            </div>
            
            <p>5 m/s</p>
        </div>
    );
}

export default Day;