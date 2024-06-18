const extractProductId = (url) => {
    const regex = /\/dp\/([A-Z0-9]+)|\/gp\/product\/([A-Z0-9]+)/;
    const match = url.match(regex);
    if (match) {
      return match[1] || match[2];
    }
    return null;
};

export default extractProductId;