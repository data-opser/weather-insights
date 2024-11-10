import '../styles/UserPage.css'
import user from '../images/user.jpg'

function UserPage() {
    return (
        <div className="user-page">
            <div className="user">
                <img className='user-photo' src={user}></img>
            </div>
            <div className="notification"></div>
        </div>
    );
}

export default UserPage;