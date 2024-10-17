export const timeLeftToUTCMidnight = () => {
    // Get current time in UTC
    const now = new Date();
    const nowUtc = new Date(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds(),
    );

    // Get the next UTC midnight
    const nextUtcMidnight = new Date(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + 1, // Move to the next day
        0,
        0,
        0,
        0, // Midnight UTC
    );

    // Distance between the two
    const distance = nextUtcMidnight.getTime() - nowUtc.getTime();

    // Time calculations
    const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Format the time strings with leading zeros if needed
    const hoursString = hours.toString().padStart(2, "0");
    const minutesString = minutes.toString().padStart(2, "0");
    const secondsString = seconds.toString().padStart(2, "0");

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

    let monthString = (target.getMonth() + 1).toString().padStart(2, "0");
    let dayString = target.getDate().toString().padStart(2, "0");

    return `${target.getFullYear()}-${monthString}-${dayString}`;
};

export const getLastUpdatedDate = (date: string) => {
    // Target date & current date
    const target = new Date(date);
    const today = new Date();

    // Normalize times for date comparison (without time)
    const targetCopy = new Date(target);
    targetCopy.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    // Get the time difference in days
    const dayDiff =
        (today.getTime() - targetCopy.getTime()) / (1000 * 60 * 60 * 24);

    // Check if the input date is today
    if (dayDiff === 0) {
        const hours = target.getHours().toString().padStart(2, "0");
        const minutes = target.getMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}`;
    } else {
        return getRelativeDate(date);
    }
};
