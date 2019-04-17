export const pdfExt = function(ext: string) {
    const extenstion = ext.slice(-3);
    if (extenstion === 'pdf') {
        return true;
    } else {
        return false;
    }
};
export const mp3Ext = function(ext: string) {
    const extenstion = ext.slice(-3);
    if (extenstion === 'mp3') {
        return true;
    } else {
        return false;
    }
};
export const mp4Ext = function(ext: string) {
    const extenstion = ext.slice(-3);
    if (extenstion === 'mp4') {
        return true;
    } else {
        return false;
    }
};
export const wordExt = function(ext: string) {
    const extenstion = ext.slice(-3);
    if ((extenstion === 'doc' ) || (extenstion === 'ord' )
        || (extenstion === 'ent' )) {
        return true;
    } else {
        return false;
    }
};
export const ExcelExt = function(ext: string) {
    const extenstion = ext.slice(-3);
    if ((extenstion === 'xls' ) || (extenstion === 'eet' )) {
        return true;
    } else {
        return false;
    }
};
export const ImgExt = function(ext: string) {
    const extenstion = ext.slice(-3);
    if ((extenstion === 'png' ) || (extenstion === 'peg' )
    || (extenstion === 'gif' ) || (extenstion === 'jpg' )) {
        return true;
    } else {
        return false;
    }
};

export const PptExt = function(ext: string) {
    const extenstion = ext.slice(-3);
    if ((extenstion === 'ppt' ) || (extenstion === 'pptx' )) {
        return true;
    } else {
        return false;
    }
};

export const defaultIcon = function(ext: string) {
    if (!ImgExt(ext) && !ExcelExt(ext) && !wordExt(ext) && !pdfExt(ext) && !mp3Ext(ext) && !mp4Ext(ext) ) {
        return true;
    } else {
        return false;
    }
};

export const getFileIcon = function (ext: string) {
    let fileIcon = 'fa-file-alt text-secondary';
    if (pdfExt(ext)) {
        fileIcon = 'fa-file-pdf-o text-danger';
    } else if (mp3Ext(ext)) {
        fileIcon = 'fa-music text-dark';
    } else if (wordExt(ext)) {
        fileIcon = 'fa-file-word-o text-primary';
    } else if (ExcelExt(ext)) {
        fileIcon = 'fa-file-excel-o text-success';
    } else if (ImgExt(ext)) {
        fileIcon = 'fa-image text-info';
    }
    return fileIcon;
};

export const getNewFileIcon = function (ext: string) {
    let fileIcon = 'fa-file-alt text-secondary';
    if (pdfExt(ext)) {
        fileIcon = 'fa-file-pdf';
    } else if (wordExt(ext)) {
        fileIcon = 'fa-file-word';
    } else if(PptExt(ext)){
        fileIcon = 'fa-file-powerpoint';
    } else if (ExcelExt(ext)) {
        fileIcon = 'fa-file-excel';
    } else if (ImgExt(ext)) {
        fileIcon = 'fa-image';
    } else if (mp3Ext(ext)) {
        fileIcon = 'fa-music';
    } else if (mp4Ext(ext)) {
        fileIcon = 'fa-file-video';
    }
    return fileIcon;
};
