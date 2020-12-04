import React from "react";

import Settings from "views/Settings/Settings.js";

import BaseLayout from "layouts/BaseLayout.js";

export default function SettingsRoute (props) {
    return (
        <BaseLayout component={<Settings />} />
    )
}