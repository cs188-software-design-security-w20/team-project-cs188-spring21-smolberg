/** @jsxImportSource theme-ui */

import { Flex } from "@theme-ui/components";
import React, { useState, useEffect } from "react";
import Container from "../components/Container";
import FileManager from "../components/fileManager";
import {getAllFileData, formatFiles} from '../lib/gdrivefs/files.js' 
import constants from "../constants";

import sampleFiles from "../components/fileManager/sampleFiles";

const Files = () => {

  const [files, setFiles] = useState()

  useEffect(() => {
    document.title = `${constants.APP_NAME} | Files`;
    const f = async () => {
      setFiles(await (formatFiles(await getAllFileData())))
    }
  }, []);

  return (
    <Container>
      <Flex mt={2} sx={{ width: "100%", justifyContent: "center" }}>
        <FileManager files={files} currentPath="/users/testuser" />
      </Flex>
    </Container>
  );
};

export default Files;
