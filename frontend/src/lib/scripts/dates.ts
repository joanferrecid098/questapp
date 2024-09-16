export const convertDateToTimeLeft = (date: Date) => {
    // Target date & current date
    const targetDate = date.getTime();
    const now = new Date().getTime();

    // Distance between the two
    const distance = targetDate - now;

    // Time calculations
    const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    let hoursString = hours.toString();
    if (hoursString.length == 1) hoursString = "0" + hoursString;
    let minutesString = minutes.toString();
    if (minutesString.length == 1) minutesString = "0" + minutesString;
    let secondsString = seconds.toString();
    if (secondsString.length == 1) secondsString = "0" + secondsString;

    return {
        hours,
        minutes,
        seconds,
        hoursString,
        minutesString,
        secondsString,
    };
};
