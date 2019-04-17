export const testing = function() {
    console.log('funct');
};
export const text_truncate = function(str,  type?, size?,  ending? ) {
  let length = 23;
  if (size) {
    length = size;
  }
    let strExt = '';
    if (type === 'file') {
        // strExt = str.slice(-3);
        strExt = '';
    }
    if (length == null) {
      length = 100;
    }
    if (ending == null) {
      ending = '...';
    }
    if (str.length > length) {
      return str.substring(0, length - ending.length) + ending + strExt;
    } else {
      return str;
    }
  };
  export const sortByDateCreated = function(a, b) {
    // let ax = a.secret.originalFileName.toLocaleLowerCase();
    // let bx = b.secret.originalFileName.toLocaleLowerCase();
    let ax = a.createdAt;
    let bx  = b.createdAt;
    if (ax > bx) {
      return -1;
    } if (ax < bx) {
      return 1;
    }
    return 0;
  };
  export const   checkLastElement = function(array: any[]) {
    for (let i = 0; i < array.length; i++) {
      const item = array[i];
      if ((i + 1) === (array.length)) {
          console.log('last' + item.name);
      } else {
        console.log('not last element');
      }
  }
  };

  export const getFileProgressRate = function(fileI: object) {
    let sizeCount = 0;
    const file = fileI;
    for (const key in file) {
      if (file.hasOwnProperty(key)) {
        const element = file[key];
        sizeCount = sizeCount + element.size;
      }
    }
    let size = sizeCount;
    if (sizeCount > 1000 ) {
      size = sizeCount / 1024;
    }
    let rate = 30;
    if (size > 10000) {
      rate = 2.5 / 2;
    } else if (size > 5000) {
      rate = 2.5;
    } else if (size > 3000) {
      rate = 5;
    } else if (size > 2000) {
      rate = 15 / 2;
    } else if (size > 1000) {
      rate = 15;
    }
    return rate;
  };

  export const fileSize = function (size: number) {
    const  sized: any = size / 1056;
    let myFileSize = sized.toFixed(2) + ' KB';
    if (sized < 1 ) {
      const byte = size;
      myFileSize = byte + ' Bytes';
    } else if (sized > 1000) {
      let megabyte = sized.toFixed(2);
      megabyte = megabyte.toString();
      megabyte = `${megabyte[0]}.${megabyte[1]}${megabyte[2]}`;
      myFileSize = megabyte + ' MB';
    }
    return myFileSize;
  };

  export const getNavShortPathFunc = function (array: any[]) {
    const longPath = [];
    const lastValue = array[array.length - 1];
    const secondToLastValue = array[array.length - 2];
    if (array.length > 5) {
      array.forEach((element, index) => {
        if (index < 4) {
          longPath.push(element);
        }
      });
      longPath.push({name: '...', link: '', id: 'short'});
      longPath.push(secondToLastValue, lastValue);
      return longPath;
    } else {
      return array;
    }
  };

  // export const sortByDateCreated = function(a, b) {
  //   if (a.name < b.name) {
  //     return -1;
  //   } if (a.name > b.name) {
  //     return 1;
  //   }
  //   return 0;
  // };



