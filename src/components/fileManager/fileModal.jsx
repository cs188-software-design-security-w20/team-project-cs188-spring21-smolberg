/** @jsxImportSource theme-ui */

import { Flex, Text, Card, Close, Box, Button } from "@theme-ui/components";
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import FileIcon from "./fileIcon";

const FileModal = ({ file, close }) => {
  useEffect(() => {
    const downHandler = ({ keyCode }) => {
      if (keyCode === 27) {
        close();
      }
    };
    window.addEventListener("keydown", downHandler);
    return () => {
      window.removeEventListener("keydown", downHandler);
    };
  }, [close]);

  return (
    <Flex
      sx={{
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        backgroundColor: "darken",
        zIndex: 10000,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card bg="muted" opacity="1" p={4}>
        <Flex sx={{ flexDirection: "column" }}>
          <Flex sx={{ justifyContent: "flex-end" }}>
            <Close onClick={close} sx={{ cursor: "pointer" }} />
          </Flex>
          <Flex mb={3} sx={{ flexDirection: "column", alignItems: "center" }}>
            <Box mb={1}>
              <FileIcon name={file.name} size="150px" />
            </Box>
            <Text variant="heading">{file.name}</Text>
          </Flex>
          <Text>
            Last Modified:{" "}
            {moment(file.lastModTime).format("MMM Do YYYY, h:mm:ss a")}
          </Text>
          <Flex mt={4} sx={{ justifyContent: "center" }}>
            <Button mr={4} onClick={() => file.download()}>
              Download
            </Button>
            <Button onClick={() => file.delete()}>Delete</Button>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
};

FileModal.propTypes = {
  file: PropTypes.shape({
    name: PropTypes.string,
    lastModTime: PropTypes.objectOf(Date),
    download: PropTypes.func,
    delete: PropTypes.func,
  }).isRequired,
  close: PropTypes.func.isRequired,
};

export default FileModal;
