export default ({
    timestampToDateTime: (timestamp) => {
      let date = new Date(timestamp);
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      let year = date.getFullYear();
      let month = months[date.getMonth()];
      let day = date.getDate();
      let hour = date.getHours();
      let min = date.getMinutes();
      let sec = date.getSeconds();
      let time = day + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;

      return time;
    },
    timestampToDate: (timestamp) => {
      let date = new Date(timestamp);
      const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      let year = date.getFullYear();
      let month = months[date.getMonth()];
      let day = date.getDate();
      let _date = month + " " + day + ", " + year;

      return _date;
    },
    timestampToTime: (timestamp) => {
      let date = new Date(timestamp);
      let hour = date.getHours();
      let min = date.getMinutes();
      let time = (hour < 10 ? "0" : "") + hour + ":" + (min < 10 ? "0" : "") + min;

      return time;
    },
    dateAgo: (timestamp) => {
      let currentDate = new Date();
      let lastDate = new Date(timestamp);
      let restDate = Math.floor((currentDate - lastDate) / (60 * 60 * 24 * 1000));


      return restDate;
    },
    handleOnClick: () => {
      window.scrollTo(0, 0);
    },
    convertTimestampToString: (timestamp) => {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      };
      return (new Date(timestamp)).toLocaleString("en-US", options);
    }
  }
);
