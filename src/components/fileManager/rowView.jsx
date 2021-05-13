import { Divider, Flex, Text, Box, Button } from "@theme-ui/components";
import React, { useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";

import FileIcon from "./fileIcon";

import { ReactComponent as DeleteButton } from "../../assets/ui-icons/delete.svg";
import { ReactComponent as DLButton } from "../../assets/ui-icons/download.svg";
import { ReactComponent as InfoButton } from "../../assets/ui-icons/info.svg";
import { ReactComponent as DownChevron } from "../../assets/ui-icons/arrow-down.svg";
import { ReactComponent as UpChevron } from "../../assets/ui-icons/arrow-up.svg";
import FileModal from "./fileModal";

const Cell = ({ file, isLast, selected, setSelected, setModal }) => {
  const bottomRadius = isLast ? "10px" : "0px";
  // const [sha256text, setSha256text] = useState("sha256");

  const active = selected === file.name;

  const selectCell = () => {
    setSelected(file.name);
  };

  const openModal = () => {
    if (active) {
      setModal(file);
    }
  };

  // const copy256sum = async () => {
  //   navigator.clipboard.writeText(file.sum);
  //   setSha256text("sha256 copied to clipboard");
  //   setTimeout(() => setSha256text("sha256"), 2 * 1000);
  // };

  const getLastModString = (d) => {
    const date = moment(d);
    if (date.isSame(moment(), "day")) {
      return `Today, ${date.format("h:mm a")}`;
    }
    return date.format("MMM D YYYY");
  };

  return (
    <Flex
      sx={{ flexDirection: "column", overflow: "hidden" }}
      onClick={selectCell}
      onDoubleClick={openModal}
    >
      <Flex
        sx={{
          flexDirection: "row",
          p: 2,
          // height: "50px",
          borderBottomRightRadius: bottomRadius,
          borderBottomLeftRadius: bottomRadius,
          justifyContent: "space-between",
          alignItems: "center",
          ":hover": {
            backgroundColor: "highlight",
          },
          backgroundColor: active ? "highlight" : "default",
        }}
      >
        <Flex>
          <FileIcon name={file.name} />
          <Text>{file.name}</Text>
        </Flex>
        <Flex sx={{ flexDirection: "column", alignItems: "flex-end" }}>
          <Flex>
            <Text variant="small" mb={active ? 1 : 0}>
              {getLastModString(file.lastModTime)}
            </Text>
          </Flex>
          {active && (
            <Flex>
              <Button mr={2} onClick={openModal}>
                <Flex sx={{ justifyContent: "center", alignItems: "center" }}>
                  <InfoButton width="20px" height="20px" />
                </Flex>
              </Button>
              {/* <Button mr={2} onClick={copy256sum}>
                <Flex sx={{ justifyContent: "center", alignItems: "center" }}>
                  <Text>{sha256text}</Text>
                </Flex>
              </Button> */}
              <Button mr={2} onClick={() => file.download()}>
                <Flex sx={{ justifyContent: "center", alignItems: "center" }}>
                  <DLButton width="20px" height="20px" />
                </Flex>
              </Button>
              <Button onClick={() => file.delete()}>
                <Flex sx={{ justifyContent: "center", alignItems: "center" }}>
                  <DeleteButton width="20px" height="20px" />
                </Flex>
              </Button>
            </Flex>
          )}
        </Flex>
      </Flex>
      {!isLast && <Divider p={0} m={0} />}
    </Flex>
  );
};

Cell.propTypes = {
  file: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string,
    size: PropTypes.string,
    lastModTime: PropTypes.objectOf(Date),
    download: PropTypes.func,
    delete: PropTypes.func,
  }).isRequired,
  isLast: PropTypes.bool.isRequired,
  selected: PropTypes.string.isRequired,
  setSelected: PropTypes.func.isRequired,
  setModal: PropTypes.func.isRequired,
};

const TableHeader = ({ sort, changeSort }) => {
  const toggleLastMod = () => {
    if (sort === "lastMod-up") {
      changeSort("lastMod-down");
      localStorage.setItem("sort-pref", "lastMod-down");
    } else {
      changeSort("lastMod-up");
      localStorage.setItem("sort-pref", "lastMod-up");
    }
  };

  const toggleAlpha = () => {
    if (sort === "alpha-up") {
      changeSort("alpha-down");
      localStorage.setItem("sort-pref", "alpha-down");
    } else {
      changeSort("alpha-up");
      localStorage.setItem("sort-pref", "alpha-up");
    }
  };

  const alphaSort = sort.includes("alpha");

  return (
    <Flex px={2} sx={{ justifyContent: "space-between" }} bg="muted">
      <Flex sx={{ alignItems: "center" }} onClick={toggleAlpha}>
        <Text
          variant={alphaSort ? "defaultbold" : "default"}
          mr={1}
          sx={{ cursor: "pointer" }}
        >
          Name
        </Text>
        {alphaSort &&
          (sort === "alpha-up" ? (
            <UpChevron width="15px" height="15px" cursor="pointer" />
          ) : (
            <DownChevron width="15px" height="15px" cursor="pointer" />
          ))}
      </Flex>
      <Flex sx={{ alignItems: "center" }} onClick={toggleLastMod}>
        <Text
          variant={!alphaSort ? "defaultbold" : "default"}
          mr={1}
          sx={{ cursor: "pointer" }}
        >
          Last Modified
        </Text>
        {!alphaSort &&
          (sort === "lastMod-up" ? (
            <UpChevron width="15px" height="15px" cursor="pointer" />
          ) : (
            <DownChevron width="15px" height="15px" cursor="pointer" />
          ))}
      </Flex>
    </Flex>
  );
};

TableHeader.propTypes = {
  sort: PropTypes.string.isRequired,
  changeSort: PropTypes.func.isRequired,
};

const RowView = ({ files, sort, changeSort }) => {
  const [currentSelection, setCurrentSelection] = useState("");
  const [showModal, setShowModal] = useState(null);
  const numElements = files.length;
  return (
    <Box mt={0} mb={0}>
      <Divider m={0} p={0} sx={{ border: "solid 1px" }} />
      <TableHeader sort={sort} changeSort={changeSort} />
      <Divider m={0} p={0} sx={{ border: "solid 1px" }} />
      {files.map((f, i) => (
        <Cell
          file={f}
          isLast={i === numElements - 1}
          selected={currentSelection}
          setSelected={setCurrentSelection}
          setModal={setShowModal}
          key={f.id}
        />
      ))}
      {showModal && (
        <FileModal file={showModal} close={() => setShowModal(null)} />
      )}
    </Box>
  );
};

RowView.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.string,
      size: PropTypes.string,
      download: PropTypes.func,
      delete: PropTypes.func,
      lastModTime: PropTypes.objectOf(Date),
    })
  ).isRequired,
  sort: PropTypes.string.isRequired,
  changeSort: PropTypes.func.isRequired,
};

export default RowView;
