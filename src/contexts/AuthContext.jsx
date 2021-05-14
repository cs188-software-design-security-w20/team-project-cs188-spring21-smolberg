import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import * as forge from "node-forge";
import * as bcrypt from "bcryptjs";
import { useHistory } from "react-router-dom";
import { favicon } from "../lib/misc";
import FullPageSpinner from "../components/FullPageSpinner";
import constants from "../constants";
import GDriveFS from "../lib/gdrivefs";
import { UserManifest } from "../lib/manifest/usermanifest";
// import FileNotFoundError from "../lib/gdrivefs/exceptions/FileNotFoundError";
import { FileManifest } from "../lib/manifest/filemanifest";
// import constants from "../constants";

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
  const [driveFS, setDriveFS] = useState(null);

  const history = useHistory();

  /**
   * Load Google API OAuth client.
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
                const x = new GDriveFS();
                x.init();
                setDriveFS(x);
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
   * Sign user in to Google and initialize filesystem
   */
  const loginOAuth = async () => {
    try {
      await updateOAuthStatus(
        window.gapi.auth2.getAuthInstance().isSignedIn.get()
      );
      const x = new GDriveFS();
      x.init();
      setDriveFS(x);
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

  const signup = async (pass) => {
    setLoading(true);

    // Check length
    if (pass.length < 8) {
      setCurrentUser(null);
      setLoading(false);
      return;
    }

    // Generate salt and hash
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(pass, salt);

    // Generate password derived key and salt
    const userKey = forge.pkcs5.pbkdf2(pass, constants.SALTS.KEY, 10_000, 32);
    const userIv = forge.random.getBytesSync(16);

    const userManifest = new UserManifest(hash);
    const encryptedManifest = await userManifest.encrypt(userKey, userIv);

    // Generate manifest name
    const md = forge.md.sha256.create();
    md.update(bcrypt.hashSync(pass, `$2a$12$${constants.SALTS.MPW}`));
    const manifestName = md.digest().toHex();

    const encodedFile = forge.util.binary.raw.decode(
      encryptedManifest.cipher.getBytes()
    );

    // Upload Manifest
    await driveFS.uploadFile(manifestName, new Blob([encodedFile]), null, {
      iv: forge.util.encodeUtf8(userIv),
    });

    // Create File Manifest
    const fileManifest = new FileManifest();
    // Encrypt and upload File Manifest
    const encryptedFileManifest = await fileManifest.encryptWithKey(
      userManifest.fileManifest.key,
      userManifest.fileManifest.iv
    );

    await driveFS.uploadFile(
      userManifest.fileManifest.name,
      // prettier-ignore
      new Blob([
        forge.util.binary.raw.decode(encryptedFileManifest.cipher.getBytes())
      ]),
      null,
      null
    );

    setCurrentUser({
      key: userKey,
      iv: userIv,
      userManifest,
      fileManifest,
      manifestName,
    });
    history.push("/files");
    setLoading(false);
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
     * TODO: Add key and iv to currentUser
     */
    setLoading(true);

    // Generate name of manifest
    const md = forge.md.sha256.create();
    md.update(bcrypt.hashSync(pass, `$2a$12$${constants.SALTS.MPW}`));
    const manifestName = md.digest().toHex();

    // Get users key
    const key = forge.pkcs5.pbkdf2(pass, constants.SALTS.KEY, 10_000, 32);

    // Check if new user
    const folderData = await driveFS.getAllFileData();
    if (folderData.length === 0) {
      signup(pass);
      setLoading(false);
      return;
    }

    // Look for manifest
    let userManifest = null;
    let iv = null;
    try {
      const manifestQuery = await driveFS.downloadFileByName(manifestName);
      iv = forge.util.decodeUtf8(manifestQuery.props.properties.iv);
      userManifest = UserManifest.decrypt(manifestQuery.file, key, iv);
    } catch (e) {
      setCurrentUser(null);
      setLoading(false);
      return;
    }

    // Find File Manifest
    const fileManifestQuery = await driveFS.downloadFileByName(
      userManifest.fileManifest.name
    );
    const fileManifest = FileManifest.decrypt(
      fileManifestQuery.file,
      userManifest.fileManifest.key,
      userManifest.fileManifest.iv
    );

    if (bcrypt.compareSync(pass, userManifest.mpwHash)) {
      setCurrentUser({
        key,
        iv,
        userManifest,
        fileManifest,
        manifestName,
      });
      history.push("/files");
      setUnlockedFavicon();
      setLoading(false);
    } else {
      setCurrentUser(null);
      setLoading(false);
    }
  };

  const updateUser = (iv, userManifest, fileManifest) => {
    setCurrentUser({
      key: currentUser.key,
      manifestName: currentUser.manifestName,
      iv,
      fileManifest,
      userManifest,
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

  const authTools = {
    currentUser,
    currentOAuthUser,
    login,
    loginOAuth,
    signup,
    OAuthLogOut,
    logout,
    updateUser,
    driveFS,
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
