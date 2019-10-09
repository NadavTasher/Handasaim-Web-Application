

function desktop_load_grades() {

}

function desktop_load(schedule) {

    get("grades").setAttribute("mobile", false);

    row("subjects");
    get("subjects").setAttribute("mobile", false);

    // Scroll load
    let scrollable = get("subjects");
    let height = parseInt(getComputedStyle(scrollable).height);
    let min = 0;
    let max = scrollable.scrollHeight - height;
    let desktopScrollDirection = true, desktopScrollPaused = false;
    let targetScroll = scrollable.scrollTop;
    setInterval(() => {
        if (!desktopScrollPaused) {
            if (targetScroll >= max ||
                targetScroll <= min)
                desktopScrollDirection = !(targetScroll >= max);
            let toAdd = (desktopScrollDirection ? 1 : -1) * height;
            targetScroll += toAdd;
            scrollable.scrollBy(0, toAdd);
        }
    }, DESKTOP_SCROLL_INTERVAL);
    setInterval(() => {
        let now = new Date();
        glance(now.getHours() + ":" + ((now.getMinutes() < 10) ? "0" + now.getMinutes() : now.getMinutes()), "");
    }, CLOCK_REFRESH_INTERVAL);
}