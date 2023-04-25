// Vanilla JS
export const picker = new tempusDominus.TempusDominus(
    document.getElementById("date-picker"),
    {
        // options here

        localization: {
            dayViewHeaderFormat: {
                month: "long",
                year: "2-digit",
                today: "Go to today",
            },
            locale: "default",
            startOfTheWeek: 0,
            format: "YYYY-MM-DD",
        },
        multipleDates: true,
        // dateRange: true,

        multipleDatesSeparator: "; ",
        display: {
            buttons: {
                clear: true,
            },
            components: {
                clock: false,
                hours: false,
                minutes: false,
            },
            toolbarPlacement: "top",
            keepOpen: true,
            inline: true,
        },
    }
);

// Get date strings
// document.getElementById("test").addEventListener("click", () => {
//   console.log(picker.dates.picked);
// });
