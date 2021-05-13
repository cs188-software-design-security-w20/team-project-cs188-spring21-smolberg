import { Button, Flex, Input, Label, Text } from "@theme-ui/components";
import React, { useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";

// import { ReactComponent as TileButton } from '../../assets/ui-icons/tile.svg'
// import { ReactComponent as RowButton } from '../../assets/ui-icons/row.svg'
import { ReactComponent as UpArrow } from "../../assets/ui-icons/up-arrow.svg";
import RowView from "./rowView";
import { useDrive } from "../../contexts/DriveContext";

const FileManager = ({ files, currentPath }) => {
  // const [currentView, setCurrentView] = useState('row')

  const { uploadNewFile } = useDrive();

  const [sortMode, setSortMode] = useState(
    localStorage.getItem("sort-pref") || "lastMod-down"
  );

  const sortedFiles = files;

  if (sortMode === "alpha-up") {
    sortedFiles.sort((a, b) => a.name.toUpperCase() > b.name.toUpperCase());
  } else if (sortMode === "alpha-down") {
    sortedFiles.sort((a, b) => a.name.toUpperCase() < b.name.toUpperCase());
  } else if (sortMode === "lastMod-down") {
    sortedFiles.sort((a, b) =>
      moment(a.lastModTime).isBefore(moment(b.lastModTime))
    );
  } else {
    sortedFiles.sort((a, b) =>
      moment(a.lastModTime).isAfter(moment(b.lastModTime))
    );
  }

  const handleFileUpload = (e) => {
    uploadNewFile(e.target.files[0]);
  };

  return (
    <Flex
      sx={{
        border: "solid",
        borderRadius: "10px",
        width: "80%",
        borderWidth: "2px",
        flexDirection: "column",
      }}
    >
      <Flex
        sx={{
          backgroundColor: "muted",
          borderTopRightRadius: "10px",
          borderTopLeftRadius: "10px",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 2,
        }}
      >
        <Flex
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button mr={3}>
            <Flex sx={{ justifyContent: "center", alignItems: "center" }}>
              <UpArrow width="20px" height="20px" />
            </Flex>
          </Button>
          <Text variant="subtitle">{currentPath}</Text>
        </Flex>
        <Flex>
          <Button p={0}>
            <Label p={2} sx={{ cursor: "pointer" }}>
              <Input
                type="file"
                sx={{ display: "none" }}
                onChange={handleFileUpload}
              />
              <Text>Add File</Text>
            </Label>
          </Button>
          {/* If we add a tile/icon view, these buttons will allow switching */}
          {/* <Button mr={3} bg={currentView === 'tile' ? "default" : "gray"} onClick={(e) => setCurrentView('tile')}>
                        <Flex sx={{ justifyContent: "center", alignItems: "center" }}>
                            <TileButton width="20px" height="20px" />
                        </Flex>
                    </Button> */}
          {/* <Button bg={currentView === 'row' ? "default" : "gray"} onClick={(e) => setCurrentView('row')}>
                        <Flex sx={{ justifyContent: "center", alignItems: "center" }}>
                            <RowButton width="20px" height="20px" />
                        </Flex>
                    </Button> */}
        </Flex>
      </Flex>
      {/* {currentView === 'tile' ? <></> : <RowView files={sortedFiles} sort={sortMode} changeSort={setSortMode}/>} */}
      <RowView files={sortedFiles} sort={sortMode} changeSort={setSortMode} />
    </Flex>
  );
};

FileManager.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      lastModTime: PropTypes.objectOf(Date),
      download: PropTypes.func,
      delete: PropTypes.func,
    })
  ).isRequired,
  currentPath: PropTypes.string.isRequired,
};

export default FileManager;
