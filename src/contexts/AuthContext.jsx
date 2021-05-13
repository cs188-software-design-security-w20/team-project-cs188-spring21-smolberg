/* eslint-disable */

import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import * as forge from "node-forge";
import * as bcrypt from "bcryptjs";
import { favicon } from "../lib/misc";
import { useHistory } from "react-router";
import FullPageSpinner from "../components/FullPageSpinner";

const AuthContext = React.createContext();

// Array of API discovery doc URLs for APIs
const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = "https://www.googleapis.com/auth/drive";

const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [currentOAuthUser, setCurrentOAuthUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  // Don't render anything before auth status has been realized
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  /**
   * Load Google API OAutg client.
   * Log user in automatically, if cookies exist
   */
  useEffect(() => {
    setLoading(true);
    const f = async () => {
      await window.gapi.load("client:auth2", () => {
        window.gapi.client
          .init({
            apiKey: process.env.REACT_APP_GOOGLE_DRIVE_API_KEY,
            clientId: process.env.REACT_APP_GOOGLE_DRIVE_CLIENT_ID,
            scope: SCOPES,
            discoveryDocs: DISCOVERY_DOCS,
          })
          .then(
            () => {
              if (window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
                setCurrentOAuthUser(
                  window.gapi.auth2.getAuthInstance().currentUser
                );
              }
            },
            (e) => new Error(e.details)
          );
      });
    };
    f();
    setLoading(false);
  }, []);

  /**
   * Change the favicon to `locked'
   * @returns void
   */
  const setLockedFavicon = () => favicon.changeFavicon("locked.png");
  /**
   * Change the favicon to `unlocked'
   * @returns void
   */
  const setUnlockedFavicon = () => favicon.changeFavicon("unlocked.png");

  const signup = () => {
    setLoading(true);
    // TODO
    setLoading(false);
  };

  /**
   * Sign user in to Google
   * @param {bool} isSignedIn
   */
  const updateOAuthStatus = async (isSignedIn) => {
    if (!isSignedIn) {
      try {
        await window.gapi.auth2.getAuthInstance().signIn();
      } catch {
        throw Error();
      }
    }
    setCurrentOAuthUser(window.gapi.auth2.getAuthInstance().currentUser);
  };

  /**
   * Sign user in to Google
   */
  const loginOAuth = async () => {
    try {
      await updateOAuthStatus(
        window.gapi.auth2.getAuthInstance().isSignedIn.get()
      );
    } catch {
      throw Error();
    }
  };

  /**
   * Log user out of Google
   */
  const OAuthLogOut = async () => {
    await window.gapi.auth2.getAuthInstance().signOut();
    setCurrentOAuthUser(null);
  };

  /**
   * Log user in using their master password.
   * This is done by pulling their manifest from drive.
   * If this manifest does not exist, they will be signed up instead
   * @param {string} pass Users master password
   * @returns {Promise} Success or failure
   */
  const login = async (pass) => {
    /**
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     * DO NOT EDIT THIS FUNCTION. WIP
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     */
    setLoading(true);

    const key = forge.pkcs5.pbkdf2(pass, "", 10, 16);
    console.log(key);

    //--------------WIP DO NOT EDIT---------------------------------------------------------------------------------------------------------
    let manifestRequest = "";

    // Double check that OAuth is still valid?

    // Password Validation

    // TODO: add failure handling!

    // Determine if new user by accessing manifest (this also checks the trash)
    manifestRequest = window.gapi.client.request({
      path: "https://www.googleapis.com/drive/v3/files",
      method: "GET",
      params: { q: "name = 'manifest1.json'" },
    });

    return new Promise((resolve) => {
      manifestRequest.execute(async (resp) => {
        // Check if manifest exists
        let newUser = resp.files.length === 0;
        var hash = "";

        // Save user password hash if not enrolled
        if (newUser) {
          // Generate salt and hash
          var salt = bcrypt.genSaltSync(10); // TODO: is random salt okay?
          hash = bcrypt.hashSync(pass, salt);

          // Testing

          // console.log("Password: " + pass);
          // console.log("Hash: " + hash);
          // console.log("Status: " + bcrypt.compareSync(pass, hash));

          // Unencrypted json data
          var username = "hi"; // TODO: replace with user google account
          var jsonData = {
            username: username,
            hash: hash,
            salt: salt, // Needed?
          };

          var fileData = JSON.stringify(jsonData, 0);

          // Upload to Google Drive

          const boundary = "foo_bar_baz";
          const delimiter = "\r\n--" + boundary + "\r\n";
          const close_delim = "\r\n--" + boundary + "--";
          var fileName = "manifest1.json";

          // TODO: encrypt file data before uploading to drive

          var contentType = "application/json";
          var metadata = {
            name: fileName,
            mimeType: contentType,
          };

          var multipartRequestBody =
            delimiter +
            "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
            JSON.stringify(metadata) +
            delimiter +
            "Content-Type: " +
            contentType +
            "\r\n\r\n" +
            fileData +
            "\r\n" +
            close_delim;

          // console.log(multipartRequestBody);
          var createRequest = window.gapi.client.request({
            path: "https://www.googleapis.com/upload/drive/v3/files",
            method: "POST",
            params: { uploadType: "multipart" },
            headers: {
              "Content-Type": "multipart/related; boundary=" + boundary + "",
            },
            body: multipartRequestBody,
          });

          createRequest.execute(function (file) {
            console.log(file); // can comment out
          });

          // TODO: Upload this data to user local cookies

          setCurrentUser(hash);
          history.push("/files");
          setUnlockedFavicon();
        } else {
          // Get hashed password from user manifest

          // TODO: Check cookies first

          // Through drive

          // How do we verify that we have the right file?? Security concern? (User could upload own file! But encryption...
          let r = await getData(resp.files[0].id);

          // Add decryption before this step
          let jsonResp = JSON.parse(
            String.fromCharCode.apply(null, new Uint8Array(r))
          );

          // console.log(jsonResp);

          if (bcrypt.compareSync(pass, jsonResp.hash)) {
            setCurrentUser(jsonResp.hash);
            history.push("/files");
            setUnlockedFavicon();
            setLoading(false);
            resolve(true);
          } else {
            setCurrentUser(null);
            setLoading(false);
            resolve(false);
          }
          // TODO: Authentication based on bcrypt response
        }
      });
    });
  };

  const logout = async () => {
    setLoading(true);
    // Add some delay...
    // Logouts are too fast and the user may not realize that the action was completed
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await wait(1000);
    await OAuthLogOut();
    setCurrentUser(null);
    setLockedFavicon();
    setLoading(false);
  };

  // helper function to get data
  const getData = async (fileId) => {
    const file = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      {
        method: "GET",
        headers: new Headers({
          Authorization: "Bearer " + window.gapi.auth.getToken().access_token,
        }),
      }
    );
    return await file.arrayBuffer();
  };

  // download file to local device
  const download = async (fileId) => {
    setLoading(true);
    let filename = "file";
    let filetype = "txt"; // temporary filetype
    let request = window.gapi.client.drive.files.get({
      fileId: fileId,
    });
    request.execute(function (file) {
      if (file.name) filename = file.name;
      if (file.mimeType) filetype = file.mimeType;
    });
    let data = await getData(fileId);
    const blob = new Blob([data], { type: filetype });
    FileSaver.saveAs(blob, filename);

    setLoading(false);
  };

  const authTools = {
    currentUser,
    currentOAuthUser,
    login,
    loginOAuth,
    signup,
    OAuthLogOut,
    logout,
  };

  return (
    <AuthContext.Provider value={authTools}>
      {!loading ? children : <FullPageSpinner />}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export { AuthProvider, useAuth };
