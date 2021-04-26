import React from 'react'

import pdfLogo from '../../assets/fileicons/pdf.svg'
import fileLogo from '../../assets/fileicons/file.svg'
import mp3Logo from '../../assets/fileicons/mp3.svg'
import aviLogo from '../../assets/fileicons/avi.svg'
import csvLogo from '../../assets/fileicons/csv.svg'
import docLogo from '../../assets/fileicons/doc.svg'
import exeLogo from '../../assets/fileicons/exe.svg'
import htmlLogo from '../../assets/fileicons/html.svg'
import jsLogo from '../../assets/fileicons/javascript.svg'
import jpgLogo from '../../assets/fileicons/jpg.svg'
import jsonLogo from '../../assets/fileicons/json-file.svg'
import mp4Logo from '../../assets/fileicons/mp4.svg'
import pngLogo from '../../assets/fileicons/png.svg'
import pptLogo from '../../assets/fileicons/ppt.svg'
import rtfLogo from '../../assets/fileicons/rtf.svg'
import svgLogo from '../../assets/fileicons/svg.svg'
import txtLogo from '../../assets/fileicons/txt.svg'
import xlsLogo from '../../assets/fileicons/xls.svg'
import xmlLogo from '../../assets/fileicons/xml.svg'
import zipLogo from '../../assets/fileicons/zip.svg'

import { Image } from '@theme-ui/components'

const FileIcon = (props) => {
    const ext = props.name.split('.').pop();
    const size = props.size
    let iconPath = ''
    switch (ext) {
        case 'avi':
            iconPath = aviLogo
            break
        case 'csv':
            iconPath = csvLogo
            break
        case 'doc':
            iconPath = docLogo
            break
        case 'exe':
            iconPath = exeLogo
            break
        case 'html':
            iconPath = htmlLogo
            break
        case 'js':
            iconPath = jsLogo
            break
        case 'jpg':
            iconPath = jpgLogo
            break
        case 'json':
            iconPath = jsonLogo
            break
        case 'mp3':
            iconPath = mp3Logo
            break
        case 'mp4':
            iconPath = mp4Logo
            break
        case 'pdf':
            iconPath = pdfLogo
            break
        case 'png':
            iconPath = pngLogo
            break
        case 'ppt':
            iconPath = pptLogo
            break
        case 'rtf':
            iconPath = rtfLogo
            break
        case 'zip':
            iconPath = zipLogo
            break
        case 'svg':
            iconPath = svgLogo
            break
        case 'txt':
            iconPath = txtLogo
            break
        case 'xls':
            iconPath = xlsLogo
            break
        case 'xml':
            iconPath = xmlLogo
            break;
        default:
            iconPath = fileLogo
    }
    return <Image src={iconPath} sx={{ height: size || '25px', width:  size || "25px", mr: "10px"}} />
}

export default FileIcon