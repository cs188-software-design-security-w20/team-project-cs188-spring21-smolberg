/** @jsxImportSource theme-ui */

import {
  Flex,
  Text,
  Box,
  Button,
  Card,
  IconButton,
} from "@theme-ui/components";
import React, { useState } from "react";
import PropTypes from "prop-types";
import constants from "../constants";
import Container from "../components/Container";

import { ReactComponent as EncryptedFileLogo } from "../assets/ui-icons/envelope.svg";
import { ReactComponent as DriveLogo } from "../assets/logos/google-drive.svg";
import { ReactComponent as PasswordIcon } from "../assets/ui-icons/password.svg";
import { ReactComponent as FolderIcon } from "../assets/ui-icons/folder.svg";
import { ReactComponent as ShieldIcon } from "../assets/ui-icons/shield.svg";

const PageIndicatorButton = ({ active, onClick }) => (
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
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

const HIWCard = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const texts = [
    `${constants.APP_NAME} connects to your Google Drive and configures a folder to be your encrypted drive. All of your encrypted data will be stored here`,
    `Set up a master password. This is the only way any of your files can be accessed. To ensure absolute security and to keep the platform decentralized, there is no way to recover this password if you lose it.`,
    `${constants.APP_NAME} will store critical login data in your drive, which allows the app to verify your identity and give you access to your data. We will also set up a filesystem within your Drive folder so we can securely organize your files.`,
    `You can now use ${constants.APP_NAME} to use Google Drive as a personal, encrypted file storage system.`,
  ];

  const images = [
    <DriveLogo width="200px" height="200px" />,
    <PasswordIcon width="200px" height="200px" />,
    <FolderIcon width="200px" height="200px" />,
    <ShieldIcon width="200px" height="200px" />,
  ];

  return (
    <Card p={3} sx={{ width: "700px", height: "400px" }}>
      <Flex
        sx={{
          height: "100%",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "space-between",
          textAlign: "center",
        }}
      >
        <div>{images[currentPage - 1]}</div>
        <Text mt={2}>{texts[currentPage - 1]}</Text>
        <Flex mt={3} sx={{ width: "20%", justifyContent: "space-evenly" }}>
          <PageIndicatorButton
            active={currentPage === 1}
            onClick={() => setCurrentPage(1)}
          />
          <PageIndicatorButton
            active={currentPage === 2}
            onClick={() => setCurrentPage(2)}
          />
          <PageIndicatorButton
            active={currentPage === 3}
            onClick={() => setCurrentPage(3)}
          />
          <PageIndicatorButton
            active={currentPage === 4}
            onClick={() => setCurrentPage(4)}
          />
        </Flex>
      </Flex>
    </Card>
  );
};

const LandingPage = () => (
  <Container>
    <Flex sx={{ flexDirection: "column", alignItems: "center" }}>
      <Flex sx={{ flexDirection: "column" }}>
        <Text mt={4} sx={{ fontSize: [70, 70, 70, 70, 90] }}>
          Take back control of your data.
        </Text>
        <Flex
          mt={4}
          sx={{
            justifyContent: "flex-start",
            flexDirection: ["column", "row"],
          }}
        >
          <Box sx={{ flexShrink: "0" }}>
            <EncryptedFileLogo sx={{ width: "330px", height: "330px" }} />
          </Box>
          <Flex ml={[0, 5]} sx={{ flexDirection: "column", maxWidth: "800px" }}>
            <Text mb={3} sx={{ fontSize: 36 }}>
              Encrypt you files and store them securely in Google Drive
            </Text>
            <Text mb={2}>
              {`Connect ${constants.APP_NAME} to your Google Drive and use your Drive as an encrypted cloud file storage location. ${constants.APP_NAME} will encrypt your files using best in class file encryption methods and store them in a folder on your Google Drive.`}
            </Text>
            <Text mb={3}>
              {`${constants.APP_NAME} does not store your data on any servers. All of your data, including information needed for secure logins, is stored exclusively on your Google Drive. All data will be encrypted and can only be unlocked with your master password.`}
            </Text>
            <Flex sx={{ justifyContent: "center" }}>
              <Button sx={{ width: ["50%", "180px"] }}>Get Started</Button>
            </Flex>
          </Flex>
        </Flex>

        <Text mt={5} sx={{ fontSize: [50, 50, 50, 50, 70] }}>
          How this works
        </Text>
        <Flex mt={4} mb={6} sx={{ justifyContent: "center" }}>
          <HIWCard />
        </Flex>
      </Flex>
    </Flex>
  </Container>
);

export default LandingPage;
