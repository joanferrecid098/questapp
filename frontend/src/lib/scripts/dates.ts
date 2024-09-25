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

export const getRelativeDate = (date: string) => {
    // Target date & current date
    const target = new Date(date);
    const today = new Date();

    // Normalize times
    target.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    // Get the time difference in days
    const dayDiff =
        (today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24);

    // Check if the input date is today
    if (dayDiff === 0) {
        return "Today";
    }

    // Check if the input date was yesterday
    if (dayDiff === 1) {
        return "Yesterday";
    }

    // Check if the input date is within the same week
    const inputDay = target.getDay();
    const todayDay = today.getDay();

    // Return the day of the week
    if (dayDiff > 1 && dayDiff < 7 && inputDay <= todayDay) {
        const weekdays = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];
        return weekdays[inputDay];
    }

    let monthString = (target.getMonth() + 1).toString();
    let dayString = target.getDay().toString();

    if (monthString.length < 2) monthString = "0" + monthString;
    if (dayString.length < 2) dayString = "0" + dayString;

    return `${target.getFullYear()}-${monthString}-${dayString}`;
};
