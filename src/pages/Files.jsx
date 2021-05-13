/** @jsxImportSource theme-ui */

import { Flex } from "@theme-ui/components";
import React, { useState, useEffect } from "react";
import Container from "../components/Container";
import FullPageSpinner from "../components/FullPageSpinner";
import FileManager from "../components/fileManager";
import constants from "../constants";
import { useDrive } from "../contexts/DriveContext";

const Files = () => {
  const [files, setFiles] = useState();
  const [loading, setLoading] = useState(true);

  const { generateFileInfo } = useDrive();

  useEffect(() => {
    document.title = `${constants.APP_NAME} | Files`;
    const f = async () => {
      setLoading(true);
      const newFiles = await generateFileInfo();
      setFiles(newFiles);
      setLoading(false);
    };
    f();
  }, []);

  if (loading) {
    return (
      <Container>
        <FullPageSpinner />
      </Container>
    );
  }

  return (
    <Container>
      <Flex mt={2} mb={7} sx={{ width: "100%", justifyContent: "center" }}>
        <FileManager files={files} currentPath="/users/testuser" />
      </Flex>
    </Container>
  );
};

export default Files;
