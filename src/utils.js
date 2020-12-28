exports.getImagesFullpath = (images) => {
    const fullpathImages = images?.map(image=>(`${process.env.BASE}/uploads/${image.url}`));
    return fullpathImages;
} 

exports.getIconsFullpath = (iconName) => {
    const fullpathIcon = `${process.env.BASE}/icons/${iconName}.png`;       
    return fullpathIcon;
} 

exports.errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    return `${msg}`;
  };
