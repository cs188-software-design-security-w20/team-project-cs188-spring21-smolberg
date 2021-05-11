/** @jsxImportSource theme-ui */

import { Flex } from "@theme-ui/components";
import React, { useEffect } from "react";
import Container from "../components/Container";
import FileManager from "../components/fileManager";
import constants from "../constants";

import sampleFiles from "../components/fileManager/sampleFiles";

const Files = () => {
  useEffect(() => {
    document.title = `${constants.APP_NAME} | Files`;
  }, []);

  return (
    <Container>
      <Flex mt={2} sx={{ width: "100%", justifyContent: "center" }}>
        <FileManager files={sampleFiles} currentPath="/users/testuser" />
      </Flex>
    </Container>
  );
};

export default Files;
