import {
  Flex,
  Input,
  Button,
  Text,
  Card,
  Image,
  IconButton,
  Link,
  Select,
  Box,
  Label,
} from "@theme-ui/components";
import React, { useEffect, useState } from "react";
import Container from "../components/Container";
import { useAuth } from "../contexts/AuthContext";
import useInput from "../hooks/useInput";

import googleLogo from "../assets/logos/google_mini.svg";
import { ReactComponent as LeftArrow } from "../assets/ui-icons/left-arrow.svg";
import { ReactComponent as RightArrow } from "../assets/ui-icons/right-arrow.svg";
import constants from "../constants";
import * as gdrivefs from "../lib/gdrivefs";

const PageIndicatorButton = (props) => (
  <IconButton
    enabled={false}
    onClick={props.onClick}
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
        fill={props.active ? "primary" : "none"}
        stroke="currentColor"
        strokeWidth={2}
      />
    </svg>
  </IconButton>
);

const OAuthWindow = (props) => {
  const swapAccount = () => {
    props.OAuthLogOut();
    props.setComplete(false);
  };

  const handleClick = async () => {
    try {
      await props.handleOAuthLogin();
      props.setComplete(true);
      setTimeout(() => props.movePage(), 500);
    } catch {
      props.setComplete(false);
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
          disabled={props.currentOAuthUser != null}
          sx={{
            cursor: props.currentOAuthUser ? "not-allowed" : "pointer",
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
        {props.currentOAuthUser && (
          <Flex sx={{ flexDirection: "column", alignItems: "center" }}>
            <Text mb={2}>
              You are signed in to Google.{" "}
              <Link onClick={swapAccount}>Click here</Link> to sign out or
              change your account
            </Text>
            <Flex
              sx={{ alignItems: "center", cursor: "pointer" }}
              onClick={() => props.movePage()}
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

const MPWWindow = (props) => (
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
      Create your Master Password
    </Text>
    <Text mb={2}>
      This password will be the only way to access your files. If you forget
      this password, you will lose access to your files.
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
          onClick={() => props.goBack()}
        >
          <LeftArrow width="15px" height="15px" />
          <Link ml={2}>Change your directory</Link>
        </Flex>
      </Flex>
      <Input mb={2} type="password" {...props.passwordInput.bind}></Input>
      <Box sx={{ width: "100%" }}>
        <Label>Confirm</Label>
        <Input mb={2} type="password" {...props.passwordInput.bind}></Input>
      </Box>
      <Button onClick={props.handleLogin}>Login</Button>
    </Flex>
  </Flex>
);

const DirectoryPicker = () => {
  const [dirlist, setDirlist] = useState(null);

  useEffect(() => {
    const f = async () => {
      setDirlist(await gdrivefs.files.getFolders());
    };
    f();
  }, []);

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
      <Text variant="subheading" mt={2} mb={3}>
        Pick a directory
      </Text>
      <Text mb={1}>
        Choose where you want to store your files. You will not be able to use
        this directory, and any contents in it may be deleted. You will not be
        able to change this later. We recommend you choose the one we have
        selected for you.
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
        <Flex mb={3} sx={{ flexDirection: "column", alignItems: "center" }}>
          <Flex
            sx={{ width: "100%", alignItems: "center", cursor: "pointer" }}
            onClick={() => 2}
          >
            <LeftArrow width="15px" height="15px" />
            <Link ml={2}>Log in with a different Google account</Link>
          </Flex>
        </Flex>
        <Select
          mb={2}
          p={2}
          sx={{ width: "auto" }}
          defaultValue="SMOLBERG_ENCRYPTED_DATA"
        >
          {dirlist ? dirlist.map((d) => <option>{d.name}</option>) : <></>}
          <option>SMOLBERG_ENCRYPTED_DATA</option>
        </Select>
        <Button onClick>Next</Button>
      </Flex>
    </Flex>
  );
};

const Signup = () => {
  const { currentOAuthUser, loginOAuth, OAuthLogOut, login } = useAuth();
  const [currentPage, setCurrentPage] = useState(currentOAuthUser ? 3 : 1);
  const [canEnterPwd, setCanEnterPwd] = useState(currentOAuthUser !== null);
  const [canPickFile, setCanPickFile] = useState(currentOAuthUser !== null);
  const [directory, setDirectory] = useState();
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

  const handleLogin = (e) => {
    e.preventDefault();
    login(passwordInput.v);
  };

  return (
    <Container>
      <Flex sx={{ justifyContent: "center" }}>
        <Card mt={4} sx={{ height: "420px", width: "500px" }}>
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
            ) : currentPage === 2 ? (
              <DirectoryPicker set={(v) => setDirectory(v)} />
            ) : (
              <MPWWindow
                passwordInput={passwordInput}
                goBack={() => setCurrentPage(2)}
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
                  if (canPickFile) setCurrentPage(2);
                }}
              />
              <PageIndicatorButton
                active={currentPage === 3}
                onClick={() => {
                  if (canEnterPwd) setCurrentPage(3);
                }}
              />
            </Flex>
          </Flex>
        </Card>
      </Flex>
    </Container>
  );
};

export default Signup;
