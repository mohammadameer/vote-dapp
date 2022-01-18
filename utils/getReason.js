const getReason = (e) => {
  let message =
    e.data && e.data.message
      ? e.data.message
      : e.error && JSON.parse(JSON.stringify(e.error)).body
      ? JSON.parse(JSON.parse(JSON.stringify(e.error)).body).error.message
      : e.data
      ? e.data
      : JSON.stringify(e);
  if (!e.error && e.message) {
    message = e.message;
  }

  console.log("Attempt to clean up:", message);
  try {
    let obj = JSON.parse(message);
    if (obj && obj.error) {
      if (obj?.error?.message) {
        message = obj.error.message;
      }
    }
  } catch (e) {
    //ignore
  }

  //   try {
  //     let obj = JSON.parse(message);
  //     if (obj && obj.reason) {
  //       message = obj.reason;
  //     }
  //   } catch (e) {
  //     //ignore
  //   }

  return message;
};

export default getReason;
