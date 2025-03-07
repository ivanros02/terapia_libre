import { useState } from "react";
import { Button} from "react-bootstrap";
import LoginGoogle from "./LoginGoogle";

const GoogleLoginButton = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div>
      <Button
        variant="light"
        className="border rounded-circle p-2"
        onClick={() => setShowLogin(true)}
      >
        <img src="/logo_google.png" alt="Google" width="30" />
      </Button>

      {showLogin && <LoginGoogle />}
    </div>
  );
};

export default GoogleLoginButton;
