/** @jsxImportSource theme-ui */

import React from "react";
import PropTypes from "prop-types";
import Header from "./Header";

const Container = ({ children }) => (
  <>
    <Header />
    <div
      sx={{
        width: "80%",
        margin: "0 auto",
      }}
    >
      <>{children}</>
    </div>
  </>
);

Container.propTypes = {
  children: PropTypes.element.isRequired,
};

export default Container;
