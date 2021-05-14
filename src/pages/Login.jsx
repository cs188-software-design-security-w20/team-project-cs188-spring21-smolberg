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
  Label,
} from "@theme-ui/components";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Container from "../components/Container";
import { useAuth, AuthStatus } from "../contexts/AuthContext";
import useInput from "../hooks/useInput";

import googleLogo from "../assets/logos/google_mini.svg";
import { ReactComponent as LeftArrow } from "../assets/ui-icons/left-arrow.svg";
import { ReactComponent as RightArrow } from "../assets/ui-icons/right-arrow.svg";
import constants from "../constants";

const PageIndicatorButton = ({ onClick, active }) => (
  <IconButton
    enabled={false}
    onClick={onClick}
    mt={2}
    sx={{ cursor: "pointer" }}
  >
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
      <Text mb={2}>
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

const MPWWindow = ({
  passwordInput,
  passwordVerifyInput,
  handleLogin,
  goBack,
  authStatus,
  pwdNoMatch,
}) => (
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
      {authStatus === AuthStatus.SIGNING_UP
        ? "Choose your Master Password"
        : "Enter your Master Password"}
    </Text>
    <Text mb={2}>
      {authStatus === AuthStatus.SIGNING_UP
        ? "Your master password will be the only way to gain access to your files. If you forget this password, all of your content will be lost"
        : "Verify your master password, so we can encrypt and decrypt your documents"}
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
      {authStatus === AuthStatus.SIGNING_UP && (
        <Flex sx={{ flexDirection: "column", width: "100%" }}>
          <Label>Verify your password</Label>
          <Input
            mb={2}
            type="password"
            value={passwordVerifyInput.bind.value}
            onChange={passwordVerifyInput.bind.onChange}
          />
        </Flex>
      )}
      {authStatus === AuthStatus.WRONG_PASSWORD && (
        <Text mb={2}>The password you entered was invalid</Text>
      )}
      {authStatus === AuthStatus.UNSECURE_PASSWORD && (
        <Text mb={2}>The password you entered is not secure enough</Text>
      )}
      {pwdNoMatch && <Text mb={2}>Your passwords do not match</Text>}
      <Button onClick={handleLogin}>Login</Button>
    </Flex>
  </Flex>
);

const pwdInputPropType = PropTypes.shape({
  v: PropTypes.node.isRequired,
  setV: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  bind: PropTypes.shape({
    value: PropTypes.node.isRequired,
    onChange: PropTypes.func.isRequired,
  }),
});

MPWWindow.propTypes = {
  passwordInput: pwdInputPropType.isRequired,
  passwordVerifyInput: pwdInputPropType.isRequired,
  authStatus: PropTypes.oneOf(Object.values(AuthStatus)).isRequired,
  handleLogin: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  pwdNoMatch: PropTypes.bool.isRequired,
};

const Login = () => {
  const { currentOAuthUser, authStatus, loginOAuth, OAuthLogOut, login } =
    useAuth();
  const [currentPage, setCurrentPage] = useState(currentOAuthUser ? 2 : 1);
  const [canEnterPwd, setCanEnterPwd] = useState(currentOAuthUser !== null);
  const [pwdNoMatch, setPwdNoMatch] = useState(false);
  const passwordInput = useInput("");
  const passwordVerifyInput = useInput("");

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
    if (authStatus === AuthStatus.SIGNING_UP) {
      if (passwordInput.v !== passwordVerifyInput.v) {
        setPwdNoMatch(true);
        return;
      }
    }
    await login(passwordInput.v);
  };

  return (
    <Container>
      <Flex sx={{ justifyContent: "center" }}>
        <Card mt={4} sx={{ width: "500px" }}>
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
                passwordVerifyInput={passwordVerifyInput}
                authStatus={authStatus}
                pwdNoMatch={pwdNoMatch}
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
