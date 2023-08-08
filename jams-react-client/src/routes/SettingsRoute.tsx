import React from "react";

import Settings from "views/Settings/Settings";

import BaseLayout from "layouts/BaseLayout";

export default function SettingsRoute() {
  return <BaseLayout component={<Settings />} />;
}
