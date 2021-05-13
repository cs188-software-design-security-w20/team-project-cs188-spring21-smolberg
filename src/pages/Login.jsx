/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Flex,
  Input,
  Button,
  Text,
  Card,
  Image,
  IconButton,
  Link,
} from "@theme-ui/components";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Container from "../components/Container";
import { useAuth } from "../contexts/AuthContext";
import useInput from "../hooks/useInput";

import googleLogo from "../assets/logos/google_mini.svg";
import { ReactComponent as LeftArrow } from "../assets/ui-icons/left-arrow.svg";
import { ReactComponent as RightArrow } from "../assets/ui-icons/right-arrow.svg";
import constants from "../constants";

const PageIndicatorButton = ({ onClick, active }) => (
  <IconButton enabled={false} onClick={onClick} sx={{ cursor: "pointer" }}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="currentcolor"
    >
      <circle
        r={11}
        cx={12}
        cy={12}
        fill={active ? "primary" : "none"}
        stroke="currentColor"
        strokeWidth={2}
      />
    </svg>
  </IconButton>
);

PageIndicatorButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
};

const OAuthWindow = ({
  currentOAuthUser,
  OAuthLogOut,
  setComplete,
  handleOAuthLogin,
  movePage,
}) => {
  const swapAccount = () => {
    OAuthLogOut();
    setComplete(false);
  };

  const handleClick = async () => {
    try {
      await handleOAuthLogin();
      setComplete(true);
      setTimeout(() => movePage(), 500);
    } catch {
      setComplete(false);
    }
  };

  return (
    <Flex
      sx={{
        height: "100%",
        flexDirection: "column",
        alignItems: "center",
        width: "80%",
        textAlign: "center",
      }}
    >
      <Text variant="subheading" mt={2} mb={4}>
        Connect to Google Drive
      </Text>
      <Text mb={1}>
        Connect your Google account so this app can access your drive
      </Text>
      <Flex
        sx={{
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Button
          variant="black"
          mb={2}
          onClick={handleClick}
          disabled={currentOAuthUser != null}
          sx={{
            cursor: currentOAuthUser ? "not-allowed" : "pointer",
            width: "60%",
            height: "50px",
          }}
        >
          <Flex sx={{ justifyContent: "space-between", alignItems: "center" }}>
            <Image
              src={googleLogo}
              sx={{
                width: 35,
                height: 35,
                borderRadius: 99999,
              }}
            />
            <Text>Sign in with Google</Text>
          </Flex>
        </Button>
        {currentOAuthUser && (
          <Flex sx={{ flexDirection: "column", alignItems: "center" }}>
            <Text mb={2}>
              You are signed in to Google.{" "}
              <Link onClick={swapAccount}>Click here</Link> to sign out or
              change your account
            </Text>
            <Flex
              sx={{ alignItems: "center", cursor: "pointer" }}
              onClick={() => movePage()}
            >
              <Link mr={2}>Continue to master password</Link>
              <RightArrow width="15px" height="15px" />
            </Flex>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

OAuthWindow.propTypes = {
  currentOAuthUser: PropTypes.shape(),
  OAuthLogOut: PropTypes.func.isRequired,
  setComplete: PropTypes.func.isRequired,
  handleOAuthLogin: PropTypes.func.isRequired,
  movePage: PropTypes.func.isRequired,
};

OAuthWindow.defaultProps = {
  currentOAuthUser: null,
};

const MPWWindow = ({ passwordInput, handleLogin, wrongPwd, goBack }) => (
  <Flex
    sx={{
      height: "100%",
      flexDirection: "column",
      alignItems: "center",
      width: "80%",
      textAlign: "center",
    }}
  >
    <Text variant="subheading" mt={2} mb={4}>
      Enter your Master Password
    </Text>
    <Text mb={2}>
      Verify your master password, so we can encrypt and decrypt your documents
    </Text>
    <Flex
      sx={{
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Flex mb={3} sx={{ flexDirection: "column", alignItems: "center" }}>
        <Flex
          sx={{ width: "100%", alignItems: "center", cursor: "pointer" }}
          onClick={() => goBack()}
        >
          <LeftArrow width="15px" height="15px" />
          <Link ml={2}>Log in with a different Google account</Link>
        </Flex>
      </Flex>
      <Input
        mb={2}
        type="password"
        value={passwordInput.bind.value}
        onChange={passwordInput.bind.onChange}
      />
      {wrongPwd && <Text mb={2}>The password you entered was invalid</Text>}
      <Button onClick={handleLogin}>Login</Button>
    </Flex>
  </Flex>
);

MPWWindow.propTypes = {
  passwordInput: PropTypes.shape({
    v: PropTypes.node.isRequired,
    setV: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    bind: PropTypes.shape({
      value: PropTypes.node.isRequired,
      onChange: PropTypes.func.isRequired,
    }),
  }).isRequired,
  handleLogin: PropTypes.func.isRequired,
  wrongPwd: PropTypes.bool.isRequired,
  goBack: PropTypes.func.isRequired,
};

const Login = () => {
  const { currentOAuthUser, loginOAuth, OAuthLogOut, login } = useAuth();
  const [currentPage, setCurrentPage] = useState(currentOAuthUser ? 2 : 1);
  const [canEnterPwd, setCanEnterPwd] = useState(currentOAuthUser !== null);
  const [wrongPwd, setWrongPwd] = useState(false);
  const passwordInput = useInput("");

  useEffect(() => {
    document.title = `${constants.APP_NAME} | Login`;
  }, []);

  const handleOAuthLogin = async () => {
    try {
      await loginOAuth();
    } catch {
      throw Error();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login(passwordInput.v);
    if (!success) {
      setWrongPwd(true);
    }
  };

  return (
    <Container>
      <Flex sx={{ justifyContent: "center" }}>
        <Card mt={4} sx={{ height: "350px", width: "500px" }}>
          <Flex
            sx={{
              height: "100%",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {currentPage === 1 ? (
              <OAuthWindow
                handleOAuthLogin={handleOAuthLogin}
                currentOAuthUser={currentOAuthUser}
                OAuthLogOut={OAuthLogOut}
                movePage={() => setCurrentPage(2)}
                setComplete={(v) => setCanEnterPwd(v)}
              />
            ) : (
              <MPWWindow
                handleLogin={handleLogin}
                passwordInput={passwordInput}
                wrongPwd={wrongPwd}
                goBack={() => setCurrentPage(1)}
              />
            )}
            <Flex sx={{ width: "20%", justifyContent: "space-evenly" }}>
              <PageIndicatorButton
                active={currentPage === 1}
                onClick={() => setCurrentPage(1)}
              />
              <PageIndicatorButton
                active={currentPage === 2}
                onClick={() => {
                  if (canEnterPwd) setCurrentPage(2);
                }}
              />
            </Flex>
          </Flex>
        </Card>
      </Flex>
    </Container>
  );
};

export default Login;
