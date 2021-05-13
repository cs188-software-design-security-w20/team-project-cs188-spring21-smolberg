import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import * as forge from "node-forge";

import FullPageSpinner from "../components/FullPageSpinner";
import { useAuth } from "./AuthContext";
import { cipher } from "../lib/crypto";
import { FileManifest } from "../lib/manifest/filemanifest";
import { UserManifest } from "../lib/manifest/usermanifest";
import { fileSize } from "../lib/misc";

const DriveContext = React.createContext();

const useDrive = () => useContext(DriveContext);

const DriveProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const { currentUser, driveFS, updateUser } = useAuth();

  const uploadNewFile = async (file) => {
    setLoading(true);
    const oldFileManifestName = currentUser.userManifest.fileManifest.name;
    // Encrypt file
    const encryptedFile = await cipher.encryptFile(file);
    // Upload file
    const encodedFile = forge.util.binary.raw.decode(
      encryptedFile.cipher.getBytes()
    );
    await driveFS.uploadFile(
      encryptedFile.encryptedFilename,
      new Blob([encodedFile]),
      null
    );
    // Generate new File Manifest
    const newFileManifest = new FileManifest(currentUser.fileManifest.files);
    newFileManifest.addFile(
      file.name,
      encryptedFile.encryptedFilename,
      encryptedFile.key,
      encryptedFile.iv
    );
    const encryptedNewFileManifest = await newFileManifest.encrypt();
    // Upload new file manifest
    await driveFS.uploadFile(
      encryptedNewFileManifest.encryptedFilename,
      // prettier-ignore
      new Blob([
        forge.util.binary.raw.decode(encryptedNewFileManifest.cipher.getBytes())
      ]),
      null,
      null
    );
    // Update user manifest
    const newUserManifest = UserManifest.fromManifest(currentUser.userManifest);
    newUserManifest.fileManifest.name =
      encryptedNewFileManifest.encryptedFilename;
    newUserManifest.fileManifest.key = encryptedNewFileManifest.key;
    newUserManifest.fileManifest.iv = encryptedNewFileManifest.iv;
    // Upload new user manifest
    const newIv = forge.random.getBytesSync(16);
    const encryptedNewUserManifest = await newUserManifest.encrypt(
      currentUser.key,
      newIv
    );
    const encodedNewUserManifest = forge.util.binary.raw.decode(
      encryptedNewUserManifest.cipher.getBytes()
    );
    await driveFS.updateFile(
      currentUser.manifestName,
      new Blob([encodedNewUserManifest]),
      {
        iv: forge.util.encodeUtf8(newIv),
      }
    );
    // Delete old file manifest
    await driveFS.deleteFileByName(oldFileManifestName);
    // Update user params
    updateUser(newIv, newUserManifest, newFileManifest);
    setLoading(false);
  };

  const deleteFile = async (realName, encName) => {
    setLoading(true);
    const oldFileManifestName = currentUser.userManifest.fileManifest.name;
    // Delete File
    await driveFS.deleteFileByName(encName);
    // Generate new File Manifest
    const newFileManifest = new FileManifest(currentUser.fileManifest.files);
    newFileManifest.deleteFile(realName);
    const encryptedNewFileManifest = await newFileManifest.encrypt();
    // Upload new file manifest
    await driveFS.uploadFile(
      encryptedNewFileManifest.encryptedFilename,
      // prettier-ignore
      new Blob([
        forge.util.binary.raw.decode(encryptedNewFileManifest.cipher.getBytes())
      ]),
      null,
      null
    );
    // Update user manifest
    const newUserManifest = UserManifest.fromManifest(currentUser.userManifest);
    newUserManifest.fileManifest.name =
      encryptedNewFileManifest.encryptedFilename;
    newUserManifest.fileManifest.key = encryptedNewFileManifest.key;
    newUserManifest.fileManifest.iv = encryptedNewFileManifest.iv;
    // Upload new user manifest
    const newIv = forge.random.getBytesSync(16);
    const encryptedNewUserManifest = await newUserManifest.encrypt(
      currentUser.key,
      newIv
    );
    const encodedNewUserManifest = forge.util.binary.raw.decode(
      encryptedNewUserManifest.cipher.getBytes()
    );
    await driveFS.updateFile(
      currentUser.manifestName,
      new Blob([encodedNewUserManifest]),
      {
        iv: forge.util.encodeUtf8(newIv),
      }
    );
    // Delete old file manifest
    await driveFS.deleteFileByName(oldFileManifestName);
    // Update user params
    updateUser(newIv, newUserManifest, newFileManifest);
    setLoading(false);
  };

  const generateFileInfo = async () => {
    let data = await driveFS.getAllFileData();
    data = data.filter(
      (f) =>
        f.name !== currentUser.userManifest.fileManifest.name &&
        f.name !== currentUser.manifestName
    );
    return data.map((f) => {
      const realName = currentUser.fileManifest.searchByEncryptedName(f.name);
      const fileInfo = currentUser.fileManifest.getFile(realName);
      return {
        name: realName,
        id: f.id,
        size: fileSize.getReadableFileSizeString(f.size),
        lastModTime: new Date(f.modifiedTime),
        download: async () => {
          const file = await driveFS.downloadFileByName(f.name);
          cipher.decryptAndDownloadFile(
            file.file,
            realName,
            fileInfo.key,
            fileInfo.iv
          );
        },
        delete: async () => {
          deleteFile(realName, f.name);
        },
      };
    });
  };

  const driveTools = {
    uploadNewFile,
    generateFileInfo,
  };

  return (
    <DriveContext.Provider value={driveTools}>
      {!loading ? children : <FullPageSpinner />}
    </DriveContext.Provider>
  );
};

DriveProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export { DriveProvider, useDrive };
