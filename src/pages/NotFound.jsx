import { Flex, Text } from "@theme-ui/components";
import React, { useEffect } from "react";
import Container from "../components/Container";
import constants from "../constants";

const NotFound = () => {
  useEffect(() => {
    document.title = `${constants.APP_NAME} | 404 Not Found`;
  }, []);

  return (
    <Container>
      <Flex
        mt={2}
        sx={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <Text sx={{ fontSize: [50, 170, 170, 150, 170] }}>Oops! 404.</Text>
        <Text sx={{ fontSize: [20, 90, 70, 70, 90] }}>
          We couldn&apos;t find the page you were looking for.
        </Text>
      </Flex>
    </Container>
  );
};

export default NotFound;
