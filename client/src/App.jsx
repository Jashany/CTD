import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  const [count, setCount] = useState(0)
  const handleResponse = (response) => {
    const decoded = decodeJwtResponse(response.credential)
    console.log(decoded)

  }

  function decodeJwtResponse(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    return JSON.parse(jsonPayload);
  }
  return (
    <>
      <div>
        <GoogleLogin
          onSuccess={(response) => handleResponse(response)}
          onFailure={(response) => console.log(response)}
        />
       </div>
    </>
  )
}

export default App
