import { Spinner, Flex } from "@theme-ui/components";
import React from "react";

const FullPageSpinner = () => (
  <Flex
    sx={{
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      width: "100%",
    }}
  >
    <Spinner size={100} strokeWidth={3} />
  </Flex>
);

export default FullPageSpinner;
