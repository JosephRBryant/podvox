export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { day: "numeric", month: "long", year: "numeric"};
  const formattedDate = new Intl.DateTimeFormat("en-us", options).format(date);

  const day = date.getDate();
  const suffix =
  day % 10 === 1 && day !== 11
    ? "st"
    : day % 10 === 2 && day !== 12
    ? "nd"
    : day % 10 === 3 && day !== 13
    ? "rd"
    : "th";

    return formattedDate.replace(/\d+/, day + suffix);
}

export default formatDate;
